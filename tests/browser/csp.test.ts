import { existsSync, readFileSync, statSync } from "node:fs";
import { createServer, type Server } from "node:http";
import type { AddressInfo } from "node:net";
import { extname, join, normalize } from "node:path";
import { chromium, type Browser, type Page } from "playwright-core";
import { afterAll, beforeAll, describe, expect, it } from "vitest";
import { netlifyHeaders } from "../netlify-headers";

// Serve o dist/ do `npm run build` anterior (gate: `npm run build && npm run test:browser`) com os cabeçalhos
// publicados no netlify.toml, e abre as páginas no Chromium do cache do Playwright (playwright-core 1.63 = chromium-1243).
const STATIC = join(process.cwd(), "dist");

const TYPES: Record<string, string> = {
  ".html": "text/html; charset=utf-8",
  ".js": "text/javascript; charset=utf-8",
  ".css": "text/css; charset=utf-8",
  ".svg": "image/svg+xml",
  ".png": "image/png",
  ".ico": "image/x-icon",
  ".woff2": "font/woff2",
  ".xml": "application/xml",
  ".txt": "text/plain; charset=utf-8",
};

/** Cabeçalhos de cada regra cujo `for` casa com o caminho (`*` = qualquer sequência). */
function headersFor(path: string, override: Record<string, string> = {}): Record<string, string> {
  const matching = netlifyHeaders().filter((rule) =>
    new RegExp(`^${rule.for.split("*").map((part) => part.replace(/[.?+^$()[\]{}|\\]/g, "\\$&")).join(".*")}$`).test(path),
  );
  return Object.assign({}, ...matching.map((rule) => rule.values), override);
}

/** Como a Netlify: `/x/` → `/x/index.html`; caminho inexistente → `404.html` com status 404. */
function serve(override: Record<string, string> = {}): Promise<{ server: Server; origin: string }> {
  const server = createServer((req, res) => {
    const path = decodeURIComponent(new URL(req.url ?? "/", "http://localhost").pathname);
    let file = join(STATIC, normalize(path));
    if (existsSync(file) && statSync(file).isDirectory()) file = join(file, "index.html");
    const found = file.startsWith(STATIC) && existsSync(file) && statSync(file).isFile();
    if (!found) file = join(STATIC, "404.html");
    res.writeHead(found ? 200 : 404, { "content-type": TYPES[extname(file)] ?? "application/octet-stream", ...headersFor(path, override) });
    res.end(readFileSync(file));
  });
  return new Promise((resolve) =>
    server.listen(0, "127.0.0.1", () => resolve({ server, origin: `http://127.0.0.1:${(server.address() as AddressInfo).port}` })),
  );
}

/** Abre a página e anota tudo que a CSP, o COEP/CORP ou outra origem bloquearia (CSP-04, EDGE-10). */
async function open(browser: Browser, origin: string, path: string, viewport = { width: 1280, height: 800 }) {
  const page = await browser.newPage({ viewport });
  const issues: string[] = [];
  await page.addInitScript(() => {
    document.addEventListener("securitypolicyviolation", (event) => {
      console.error(`securitypolicyviolation: ${event.violatedDirective} ${event.blockedURI}`);
    });
  });
  page.on("console", (message) => {
    const text = message.text();
    // A própria 404 é registrada como recurso com erro; qualquer outro erro do console conta.
    if (message.type() === "error" && !(path === "/nao-existe/" && /status of 404/.test(text))) issues.push(`console: ${text}`);
  });
  page.on("pageerror", (error) => issues.push(`pageerror: ${error.message}`));
  page.on("requestfailed", (request) => issues.push(`requestfailed: ${request.url()} ${request.failure()?.errorText}`));
  page.on("request", (request) => {
    const url = new URL(request.url());
    if (url.protocol !== "data:" && url.origin !== origin) issues.push(`outra origem: ${request.url()}`);
  });
  const response = await page.goto(`${origin}${path}`, { waitUntil: "load" });
  return { page, issues, status: response?.status() };
}

/** Rola até cada `.reveal` e devolve os que não receberam `is-visible` (CSP-06). */
async function hiddenReveals(page: Page, timeout = 2_000): Promise<number[]> {
  const reveals = page.locator(".reveal");
  const hidden: number[] = [];
  for (let i = 0; i < (await reveals.count()); i++) {
    // Centraliza: o observer ignora os 10% de baixo da tela (rootMargin do reveal.ts).
    await reveals.nth(i).evaluate((el) => el.scrollIntoView({ block: "center" }));
    const visible = await page
      .waitForFunction((index) => document.querySelectorAll(".reveal")[index]?.classList.contains("is-visible"), i, { timeout })
      .then(() => true, () => false);
    if (!visible) hidden.push(i);
  }
  return hidden;
}

let browser: Browser;
let site: { server: Server; origin: string };

beforeAll(async () => {
  expect(existsSync(join(STATIC, "index.html")), "rode `npm run build` antes").toBe(true);
  browser = await chromium.launch();
  site = await serve();
}, 60_000);

afterAll(async () => {
  await browser?.close();
  site?.server.close();
});

describe("páginas sob os cabeçalhos publicados, no Chromium (CSP-04, EDGE-10, EDGE-13)", { timeout: 60_000 }, () => {
  it.each([
    ["/", 200],
    ["/criacao-de-sites/", 200],
    ["/privacidade/", 200],
    ["/nao-existe/", 404],
  ])("%s: status %i, com CSP, sem violação, erro de COEP/CORP nem requisição a outra origem", async (path, expected) => {
    const { page, issues, status } = await open(browser, site.origin, path);
    const csp = (await page.request.get(`${site.origin}${path}`)).headers()["content-security-policy"];
    await hiddenReveals(page);
    await page.waitForLoadState("networkidle");
    expect(status).toBe(expected);
    expect(csp).toContain("script-src 'self'");
    expect(issues).toEqual([]);
    await page.close();
  });
});

describe("scripts rodam sob a CSP (CSP-05, CSP-06)", { timeout: 60_000 }, () => {
  it.each(["/", "/criacao-de-sites/"])("%s: todo .reveal recebe is-visible ao entrar na tela", async (path) => {
    const { page, issues } = await open(browser, site.origin, path);
    expect(await page.locator(".reveal").count()).toBeGreaterThan(0);
    expect(await hiddenReveals(page)).toEqual([]);
    expect(issues).toEqual([]);
    await page.close();
  });

  it("em 390 px o botão Menu abre e fecha o menu", async () => {
    const { page, issues } = await open(browser, site.origin, "/", { width: 390, height: 844 });
    const button = page.locator("header button[aria-controls]");
    const panel = page.locator(`#${await button.getAttribute("aria-controls")}`);
    expect(await button.isVisible()).toBe(true);
    expect(await panel.isVisible()).toBe(false);
    await button.click();
    expect(await button.getAttribute("aria-expanded")).toBe("true");
    expect(await panel.isVisible()).toBe(true);
    await button.click();
    expect(await button.getAttribute("aria-expanded")).toBe("false");
    expect(await panel.isVisible()).toBe(false);
    expect(issues).toEqual([]);
    await page.close();
  });

  it("o formulário envia a /api/contato e mostra o estado de sucesso", async () => {
    const { page, issues } = await open(browser, site.origin, "/");
    const sent: { method: string; body: unknown }[] = [];
    await page.route("**/api/contato", (route) => {
      sent.push({ method: route.request().method(), body: route.request().postDataJSON() });
      return route.fulfill({ status: 200, contentType: "application/json", body: '{"ok":true}' });
    });
    await page.fill("#nome", "Ana Lima");
    await page.fill("#email", "ana@empresa.com.br");
    await page.selectOption("#tipo", "Site");
    await page.fill("#mensagem", "Preciso de um site novo.");
    await page.click('.contact-form button[type="submit"]');
    await page.waitForSelector(".contact-status p");
    expect(sent).toEqual([
      { method: "POST", body: { nome: "Ana Lima", email: "ana@empresa.com.br", tipo: "Site", mensagem: "Preciso de um site novo.", website: "" } },
    ]);
    expect(await page.textContent(".contact-status p")).toMatch(/^Mensagem enviada!/);
    expect(await page.locator(".contact-form").getAttribute("hidden")).not.toBeNull();
    expect(issues).toEqual([]);
    await page.close();
  });
});

describe("controle: o teste enxerga script bloqueado", { timeout: 60_000 }, () => {
  it("com script-src 'none', o reveal falha e a violação de CSP é registrada", async () => {
    const blocked = await serve({ "Content-Security-Policy": "default-src 'self'; script-src 'none'; style-src 'self' 'unsafe-inline'" });
    try {
      const { page, issues } = await open(browser, blocked.origin, "/");
      expect(await hiddenReveals(page, 300)).not.toEqual([]);
      expect(issues.some((issue) => /Content Security Policy|securitypolicyviolation/.test(issue))).toBe(true);
      await page.close();
    } finally {
      blocked.server.close();
    }
  });
});

import { existsSync, readdirSync, readFileSync } from "node:fs";
import { join } from "node:path";
import { describe, expect, it } from "vitest";
import { parse } from "yaml";
import { parseHtml } from "../render";

// Lê o dist/ do `npm run build` anterior (gate: `npm run build && npm run test:build`).
const dist = join(process.cwd(), "dist");
const PUBLISHED = ["integracao-bling-api", "integracao-rastreamento-veicular"];
const DRAFTS = ["quanto-custa-um-site", "quanto-custa-um-sistema-sob-medida"];

const front = (slug: string) =>
  parse(readFileSync(join(process.cwd(), "src", "content", "guias", `${slug}.md`), "utf8").match(/^---\r?\n([\s\S]*?)\r?\n---/)![1]);
/** `updatedAt ?? publishedAt` do frontmatter, em milissegundos (o YAML lê a data como meia-noite UTC). */
const guideTime = (slug: string) => {
  const data = front(slug);
  return new Date(data.updatedAt ?? data.publishedAt).getTime();
};

const xml = readFileSync(join(dist, "sitemap-0.xml"), "utf8");
const urls = new Map(
  [...xml.matchAll(/<url>([\s\S]*?)<\/url>/g)].map(([, body]) => [
    new URL(body.match(/<loc>(.*?)<\/loc>/)![1]).pathname,
    body.match(/<lastmod>(.*?)<\/lastmod>/)?.[1],
  ]),
);

describe("build: guias no sitemap (guias SMAP-01, SMAP-02, SMAP-03)", () => {
  it("os guias publicados não são rascunho e os do teste de rascunho são", () => {
    expect(PUBLISHED.map((slug) => front(slug).draft ?? false)).toEqual([false, false]);
    expect(DRAFTS.map((slug) => front(slug).draft)).toEqual([true, true]);
  });

  it.each(PUBLISHED)("/guias/%s/ está no sitemap com <lastmod> igual ao frontmatter", (slug) => {
    const lastmod = urls.get(`/guias/${slug}/`);
    expect(lastmod).toBeDefined();
    expect(new Date(lastmod!).getTime()).toBe(guideTime(slug));
  });

  it("/guias/ está no sitemap com <lastmod> do guia publicado mais recente", () => {
    const lastmod = urls.get("/guias/");
    expect(lastmod).toBeDefined();
    expect(new Date(lastmod!).getTime()).toBe(Math.max(...PUBLISHED.map(guideTime)));
  });
});

describe("build: rascunhos fora da saída (guias COL-08)", () => {
  const llms = readFileSync(join(dist, "llms.txt"), "utf8");
  const hub = readFileSync(join(dist, "guias", "index.html"), "utf8");

  it.each(DRAFTS)("%s não gera página nem aparece no sitemap, no llms.txt ou em /guias/", (slug) => {
    expect(existsSync(join(dist, "guias", slug))).toBe(false);
    expect(urls.has(`/guias/${slug}/`)).toBe(false);
    expect(llms).not.toContain(`/guias/${slug}/`);
    expect(hub).not.toContain(`/guias/${slug}/`);
  });

  it.each(PUBLISHED)("%s gera página e aparece no llms.txt", (slug) => {
    expect(existsSync(join(dist, "guias", slug, "index.html"))).toBe(true);
    expect(llms).toContain(`/guias/${slug}/`);
  });
});

describe("build: títulos únicos com as páginas de guia (SEO-07, guias PAGE-02)", () => {
  const htmls = (readdirSync(dist, { recursive: true }) as string[]).filter((f) => f.endsWith(".html") && f !== "404.html");
  const titles = htmls.map((file) => parseHtml(readFileSync(join(dist, file), "utf8")).querySelector("title")?.textContent ?? "");

  it("inclui /guias/ e os guias publicados", () => {
    expect(htmls).toEqual(expect.arrayContaining(["guias/index.html", ...PUBLISHED.map((slug) => `guias/${slug}/index.html`)]));
  });

  it("nenhum <title> se repete", () => {
    expect(new Set(titles).size).toBe(titles.length);
  });

  it.each(PUBLISHED)("/guias/%s/ usa o title do frontmatter", (slug) => {
    expect(titles[htmls.indexOf(`guias/${slug}/index.html`)]).toBe(front(slug).title);
  });
});

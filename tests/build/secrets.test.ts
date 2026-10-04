import { execFileSync } from "node:child_process";
import { existsSync, readdirSync, readFileSync, statSync } from "node:fs";
import { join } from "node:path";
import { beforeAll, describe, expect, it } from "vitest";

// Pastas confirmadas após o build com @astrojs/netlify 8 + Astro 7: o que vai ao navegador fica em dist/,
// e a função que atende /api/contato e a 404 fica em .netlify/v1/functions/ssr/.
const STATIC = join(process.cwd(), "dist");
const SSR = join(process.cwd(), ".netlify/v1/functions/ssr/ssr.mjs");
const SENTINEL = "re_SENTINELA_nao_pode_vazar_7f3a91";

function listFiles(dir: string): string[] {
  return readdirSync(dir).flatMap((name) => {
    const path = join(dir, name);
    return statSync(path).isDirectory() ? listFiles(path) : [path];
  });
}

beforeAll(() => {
  // Build com um valor-sentinela na chave: se ela vazar, aparece nos arquivos públicos.
  execFileSync("npx", ["astro", "build"], {
    env: {
      ...process.env,
      RESEND_API_KEY: SENTINEL,
      CONTACT_TO: "destino@exemplo.com.br",
      CONTACT_FROM: "Site <site@exemplo.com.br>",
    },
    stdio: "pipe",
  });
}, 180_000);

describe("saída do build", () => {
  // Contexto mínimo que a Netlify entrega à função; `ip` vira o clientAddress do Astro.
  const context = { ip: "203.0.113.7", geo: {}, cookies: { set() {}, delete() {} }, next: async () => new Response(null) };
  const loadSsr = async () => {
    Object.assign(process.env, { RESEND_API_KEY: SENTINEL, CONTACT_TO: "destino@exemplo.com.br", CONTACT_FROM: "Site <site@exemplo.com.br>" });
    return (await import(SSR)) as {
      default: (request: Request, ctx: typeof context) => Promise<Response>;
      config: { path: string; preferStatic: boolean };
    };
  };
  const post = (body: string) =>
    new Request("https://leonardoassuncao.com.br/api/contato", { method: "POST", headers: { "content-type": "application/json" }, body });

  it("pasta pública existe e contém o HTML estático", () => {
    expect(existsSync(STATIC)).toBe(true);
    expect(existsSync(join(STATIC, "index.html"))).toBe(true);
  });

  it("/api/contato é servido pela função, não por arquivo estático (FORM-10)", async () => {
    const { default: handler, config } = await loadSsr();
    expect(config).toMatchObject({ path: "/*", preferStatic: true });
    expect(listFiles(STATIC).some((file) => file.includes("contato"))).toBe(false);
    const honeypot = await handler(post(JSON.stringify({ nome: "Ana Lima", email: "ana@empresa.com.br", tipo: "Site", mensagem: "Preciso de um site novo.", website: "bot" })), context);
    expect(honeypot.status).toBe(200);
    expect(await honeypot.json()).toEqual({ ok: true });
  });

  it("a função responde 400 para JSON malformado (FORM-06)", async () => {
    const { default: handler } = await loadSsr();
    const response = await handler(post("{"), context);
    expect(response.status).toBe(400);
  });

  it("endereço inexistente responde 404 com a página 404 (LEGAL-03)", async () => {
    expect(existsSync(join(STATIC, "404.html"))).toBe(true);
    const { default: handler } = await loadSsr();
    const response = await handler(new Request("https://leonardoassuncao.com.br/qualquer-coisa"), context);
    expect(response.status).toBe(404);
    const html = await response.text();
    expect(html).toContain("Página não encontrada");
    expect(html).toContain('href="/"');
  });

  it("nenhum arquivo público contém o nome nem o valor da chave do Resend", () => {
    const files = listFiles(STATIC);
    expect(files.length).toBeGreaterThan(0);
    const leaks = files.filter((file) => {
      const content = readFileSync(file, "latin1");
      return content.includes(SENTINEL) || content.includes("RESEND_API_KEY");
    });
    expect(leaks).toEqual([]);
  });
});

// Mesmo arquivo do build acima: um segundo arquivo rodaria outro build em paralelo na mesma pasta.
describe("SEO: imagem de compartilhamento, sitemap e robots (SEO-02, SEO-03)", () => {
  const DOMAIN = "https://www.leonardoassuncao.com.br";

  it("og.png é um PNG de exatamente 1200×630", () => {
    const png = readFileSync(join(STATIC, "og.png"));
    expect(png.subarray(1, 4).toString("latin1")).toBe("PNG");
    expect(png.subarray(12, 16).toString("latin1")).toBe("IHDR");
    expect(png.readUInt32BE(16)).toBe(1200);
    expect(png.readUInt32BE(20)).toBe(630);
  });

  it("o sitemap lista / e /privacidade, sem /api/contato nem a 404", () => {
    const index = readFileSync(join(STATIC, "sitemap-index.xml"), "utf8");
    const sitemaps = [...index.matchAll(/<loc>([^<]+)<\/loc>/g)].map(([, loc]) => loc);
    expect(sitemaps.length).toBeGreaterThan(0);
    const urls = sitemaps.flatMap((loc) => {
      const file = readFileSync(join(STATIC, new URL(loc).pathname), "utf8");
      return [...file.matchAll(/<loc>([^<]+)<\/loc>/g)].map(([, url]) => url);
    });
    expect(urls).toEqual([`${DOMAIN}/`, `${DOMAIN}/privacidade/`]);
  });

  it("robots.txt aponta para o índice do sitemap no domínio", () => {
    const robots = readFileSync(join(STATIC, "robots.txt"), "utf8");
    expect(robots).toMatch(/^User-agent: \*$/m);
    expect(robots).toMatch(new RegExp(`^Sitemap: ${DOMAIN}/sitemap-index\\.xml$`, "m"));
  });
});

describe("fontes servidas pelo próprio domínio (SEO-06)", () => {
  const publicText = () =>
    listFiles(STATIC)
      .filter((file) => /\.(html|css)$/.test(file))
      .map((file) => ({ file, content: readFileSync(file, "utf8") }));

  it("os arquivos da Archivo estão na pasta pública do build", () => {
    const fonts = readdirSync(join(STATIC, "_astro")).filter((name) => /^archivo-.*\.woff2$/.test(name));
    expect(fonts.length).toBeGreaterThan(0);
  });

  it("toda @font-face da Archivo aponta para /_astro/ e usa font-display: swap", () => {
    const faces = publicText().flatMap(({ content }) => content.match(/@font-face\{[^}]*\}/g) ?? []);
    const archivo = faces.filter((face) => /font-family:\s*["']?Archivo/.test(face));
    expect(archivo.length).toBeGreaterThan(0);
    for (const face of archivo) {
      expect(face).toMatch(/font-display:\s*swap/);
      expect(face).toMatch(/url\(["']?\/_astro\/archivo-[^)]+\.woff2/);
    }
  });

  it("nenhuma página ou CSS carrega fontes do Google", () => {
    const external = publicText().filter(({ content }) => /fonts\.(googleapis|gstatic)\.com/.test(content));
    expect(external.map(({ file }) => file)).toEqual([]);
  });
});

describe("URL canônica de cada página (SEO-03)", () => {
  const DOMAIN = "https://www.leonardoassuncao.com.br";
  const metaOf = (page: string) => {
    const html = readFileSync(join(STATIC, page), "utf8");
    return {
      canonical: html.match(/<link[^>]+rel="canonical"[^>]+href="([^"]+)"/)?.[1],
      ogUrl: html.match(/<meta[^>]+property="og:url"[^>]+content="([^"]+)"/)?.[1],
    };
  };

  it("a página inicial aponta para a raiz do domínio", () => {
    expect(metaOf("index.html")).toEqual({ canonical: `${DOMAIN}/`, ogUrl: `${DOMAIN}/` });
  });

  it("/privacidade aponta para si mesma, não para a página inicial", () => {
    expect(metaOf("privacidade/index.html")).toEqual({ canonical: `${DOMAIN}/privacidade/`, ogUrl: `${DOMAIN}/privacidade/` });
  });
});

import { execFileSync } from "node:child_process";
import { readFileSync } from "node:fs";
import { join } from "node:path";
import { describe, expect, it } from "vitest";

// Lê o dist/ do `npm run build` anterior. Fontes de cada página conforme o design (SMAP-01).
const LAYOUTS = "src/layouts";
const SERVICE = ["src/pages/[servico].astro", "src/data/services.ts", LAYOUTS];
const EXPECTED_SOURCES: Record<string, string[]> = {
  "/": ["src/pages/index.astro", "src/components", "src/data/faq.ts", LAYOUTS],
  "/criacao-de-sites/": SERVICE,
  "/sistemas-web/": SERVICE,
  "/software-sob-medida/": SERVICE,
  "/integracoes/": SERVICE,
  "/manutencao-de-sistemas/": SERVICE,
  "/privacidade/": ["src/pages/privacidade.astro", LAYOUTS],
};
// /guias/ e os guias tiram o <lastmod> do frontmatter, não do git (guias SMAP-02/03; verificado em guias.test.ts).
const GUIDE_PAGES = [
  "/guias/",
  "/guias/bling-nao-sincroniza-pedidos/",
  "/guias/integracao-bling-api/",
  "/guias/integracao-rastreamento-veicular/",
  "/guias/portal-de-pedidos-para-distribuidora/",
  "/guias/quanto-custa-um-sistema-sob-medida/",
  "/guias/quanto-custa-um-site/",
  "/guias/sistema-ordem-de-servico-ar-condicionado/",
  "/guias/software-recarga-de-extintores/",
];

const git = (...args: string[]) => execFileSync("git", args, { encoding: "utf8" }).trim();

describe("sitemap com <lastmod> real (SMAP-01)", () => {
  const xml = readFileSync(join(process.cwd(), "dist", "sitemap-0.xml"), "utf8");
  const urls = [...xml.matchAll(/<url>([\s\S]*?)<\/url>/g)].map(([, body]) => ({
    path: new URL(body.match(/<loc>(.*?)<\/loc>/)![1]).pathname,
    lastmod: body.match(/<lastmod>(.*?)<\/lastmod>/)?.[1],
  }));

  it("tem exatamente as 16 páginas indexáveis", () => {
    expect(urls.map((u) => u.path).sort()).toEqual([...Object.keys(EXPECTED_SOURCES), ...GUIDE_PAGES].sort());
  });

  it("com histórico completo, cada <lastmod> é a data do último commit nas fontes da página; em clone raso, não há <lastmod> (SMAP-02)", () => {
    if (git("rev-parse", "--is-shallow-repository") === "true") {
      expect(urls.filter((u) => u.lastmod !== undefined)).toEqual([]);
      return;
    }
    for (const { path, lastmod } of urls.filter((u) => !GUIDE_PAGES.includes(u.path))) {
      const expected = git("log", "-1", "--format=%cI", "--", ...EXPECTED_SOURCES[path]);
      expect(expected, path).not.toBe("");
      // O sitemap reescreve a data em UTC; compara o instante.
      expect(lastmod, path).toBeDefined();
      expect(new Date(lastmod!).getTime(), path).toBe(new Date(expected).getTime());
    }
  });
});

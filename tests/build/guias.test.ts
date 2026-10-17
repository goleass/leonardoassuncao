import { existsSync, readdirSync, readFileSync } from "node:fs";
import { join } from "node:path";
import { describe, expect, it } from "vitest";
import { parse } from "yaml";
import { parseHtml } from "../render";

// Lê o dist/ do `npm run build` anterior (gate: `npm run build && npm run test:build`).
const dist = join(process.cwd(), "dist");
const LAUNCH = ["integracao-bling-api", "integracao-rastreamento-veicular", "quanto-custa-um-sistema-sob-medida", "quanto-custa-um-site"];
const CONTENT = join(process.cwd(), "src", "content", "guias");

const front = (slug: string) =>
  parse(readFileSync(join(CONTENT, `${slug}.md`), "utf8").match(/^---\r?\n([\s\S]*?)\r?\n---/)![1]);
// Publicados e rascunhos saem do frontmatter: publicar um guia não exige editar este teste.
const slugs = readdirSync(CONTENT).filter((f) => f.endsWith(".md")).map((f) => f.slice(0, -3));
const PUBLISHED = slugs.filter((slug) => !front(slug).draft);
const DRAFTS = slugs.filter((slug) => front(slug).draft);
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
  it("os 4 guias do lançamento estão publicados (guias CONT-01)", () => {
    expect(PUBLISHED).toEqual(expect.arrayContaining(LAUNCH));
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

  // Um único teste com laço: sem rascunhos no momento, a lista fica vazia e o teste continua válido.
  it("nenhum rascunho gera página nem aparece no sitemap, no llms.txt ou em /guias/", () => {
    for (const slug of DRAFTS) {
      expect(existsSync(join(dist, "guias", slug))).toBe(false);
      expect(urls.has(`/guias/${slug}/`)).toBe(false);
      expect(llms).not.toContain(`/guias/${slug}/`);
      expect(hub).not.toContain(`/guias/${slug}/`);
    }
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

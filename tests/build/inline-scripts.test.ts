import { readdirSync, readFileSync, statSync } from "node:fs";
import { join, relative } from "node:path";
import { describe, expect, it } from "vitest";

// Lê o dist/ do `npm run build` anterior (gate: `npm run build && npm run test:build`). O test:build roda
// os arquivos em sequência, então o build do secrets.test.ts não reescreve o dist/ durante a leitura.
const STATIC = join(process.cwd(), "dist");

const PAGES = [
  "404.html",
  "criacao-de-sites/index.html",
  "index.html",
  "integracoes/index.html",
  "manutencao-de-sistemas/index.html",
  "privacidade/index.html",
  "sistemas-web/index.html",
  "software-sob-medida/index.html",
];

function listFiles(dir: string): string[] {
  return readdirSync(dir).flatMap((name) => {
    const path = join(dir, name);
    return statSync(path).isDirectory() ? listFiles(path) : [path];
  });
}

/** Arquivos com `<script>` de corpo não vazio cujo `type` não é `application/ld+json` (EDGE-09). */
function inlineScriptPages(pages: { file: string; html: string }[]): string[] {
  return pages
    .filter(({ html }) =>
      [...html.matchAll(/<script\b([^>]*)>([\s\S]*?)<\/script>/gi)].some(
        ([, attrs, body]) => body.trim() !== "" && !/\btype=["']?application\/ld\+json["']?/i.test(attrs),
      ),
    )
    .map(({ file }) => file);
}

describe("nenhuma página publica script executável inline (CSP-03, EDGE-09)", () => {
  const built = listFiles(STATIC)
    .filter((file) => file.endsWith(".html"))
    .map((file) => ({ file: relative(STATIC, file), html: readFileSync(file, "utf8") }));

  it("o build gera as 8 páginas", () => {
    expect(built.map(({ file }) => file).sort()).toEqual(PAGES);
  });

  it("nenhum dist/**/*.html tem <script> com corpo, exceto JSON-LD", () => {
    expect(inlineScriptPages(built)).toEqual([]);
  });

  it("a verificação aponta o arquivo quando há script inline (fixture)", () => {
    const fixtures = [
      { file: "ok.html", html: '<script type="application/ld+json">{"@graph":[]}</script><script type="module" src="/_astro/a.js"></script>' },
      { file: "classico.html", html: '<head><script>document.documentElement.classList.add("js");</script></head>' },
      { file: "modulo.html", html: '<script type="module">import "/_astro/a.js";</script>' },
    ];
    expect(inlineScriptPages(fixtures)).toEqual(["classico.html", "modulo.html"]);
  });
});

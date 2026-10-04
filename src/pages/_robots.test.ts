// O prefixo "_" impede o Astro de tratar este arquivo de teste como rota de src/pages.
import { describe, expect, it, vi } from "vitest";
import { siteFixture } from "../../tests/fixtures/site";

// O dublê prova que o endereço do sitemap vem de src/config/site.ts (HOST-03).
vi.mock("../config/site", () => ({ site: { ...siteFixture, url: "https://www.exemplo.com.br" } }));

const { GET } = await import("./robots.txt");

const body = async () => (await GET({} as never)).text();

describe("/robots.txt (HOST-03, HOST-04)", () => {
  it("aponta o sitemap no host configurado", async () => {
    expect((await body()).split("\n")).toContain("Sitemap: https://www.exemplo.com.br/sitemap-index.xml");
  });

  it("bloqueia o endpoint /api/ e libera o resto", async () => {
    const lines = (await body()).split("\n");
    expect(lines).toContain("Disallow: /api/");
    expect(lines).toContain("Allow: /");
  });

  it("responde como texto puro", async () => {
    expect((await GET({} as never)).headers.get("content-type")).toBe("text/plain; charset=utf-8");
  });
});

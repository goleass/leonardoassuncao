// O prefixo "_" impede o Astro de tratar este arquivo de teste como rota de src/pages.
import { beforeAll, describe, expect, it } from "vitest";
import { parseHtml, renderComponent } from "../../tests/render";
import NotFound from "./404.astro";

let doc: Document;

beforeAll(async () => {
  doc = parseHtml(await renderComponent(NotFound));
});

describe("Página 404 (LEGAL-03)", () => {
  it("tem título próprio e um único <h1>", () => {
    expect(doc.querySelector("title")?.textContent).toBe("Página não encontrada — Leonardo Gomes Assunção");
    expect(doc.querySelectorAll("h1")).toHaveLength(1);
    expect(doc.querySelector("h1")?.textContent?.trim()).toBe("Página não encontrada");
  });

  it("tem um link para a página inicial dentro do conteúdo", () => {
    const link = doc.querySelector('main a[href="/"]');
    expect(link?.textContent?.trim()).toBe("Voltar para a página inicial");
  });

  it("usa o visual do site: cabeçalho e rodapé", () => {
    expect(doc.querySelector("header.site-header")).not.toBeNull();
    expect(doc.querySelector("footer.site-footer")).not.toBeNull();
  });
});

describe("Página 404 fora do índice (NOIDX-01, NOIDX-02)", () => {
  it('declara <meta name="robots" content="noindex">', () => {
    expect(doc.querySelector('meta[name="robots"]')?.getAttribute("content")).toBe("noindex");
  });

  it("não tem hreflang nem o robots index, follow (I18N-02, RMETA-02)", () => {
    expect(doc.querySelector("link[hreflang]")).toBeNull();
    expect(doc.documentElement.innerHTML).not.toContain("index, follow");
  });

  it("não declara URL canônica nem og:url", () => {
    expect(doc.querySelector('link[rel="canonical"]')).toBeNull();
    expect(doc.querySelector('meta[property="og:url"]')).toBeNull();
  });
});

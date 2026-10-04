import { describe, expect, it } from "vitest";
import { accessibleText, parseHtml, renderComponent } from "../../tests/render";
import { projetoFixture } from "../../tests/fixtures/site";
import Projects from "./Projects.astro";

const segundo = {
  nome: "Integração Loja",
  categoria: "Integração",
  ano: "2024",
  descricao: "Pedidos da loja viram nota fiscal sem digitação.",
  imagem: "/projetos/loja.jpg",
  alt: "Painel da integração da loja",
};

describe("Projects: seção omitida sem projetos (PAGE-11)", () => {
  it("lista vazia não renderiza nada", async () => {
    const html = await renderComponent(Projects, { projetos: [] });
    expect(html.trim()).toBe("");
  });
});

describe("Projects: seção com os projetos configurados (PAGE-10)", () => {
  it('2 projetos → 2 artigos com imagem, nome, categoria, ano e descrição, dentro de id="projetos"', async () => {
    const doc = parseHtml(await renderComponent(Projects, { projetos: [projetoFixture, segundo] }));
    expect(doc.querySelector("section#projetos h2")?.textContent?.trim()).toBe("Projetos");
    const articles = [...doc.querySelectorAll("#projetos article")];
    expect(articles).toHaveLength(2);
    const read = (article: Element) => ({
      nome: article.querySelector("h3")?.textContent?.trim(),
      src: article.querySelector("img")?.getAttribute("src"),
      alt: article.querySelector("img")?.getAttribute("alt"),
      text: accessibleText(article),
    });
    const [first, second] = articles.map(read);
    expect(first).toMatchObject({ nome: "Projeto Exemplo", src: "/projetos/exemplo.jpg", alt: "Tela do Projeto Exemplo" });
    expect(first.text).toContain("Sistema web");
    expect(first.text).toContain("2025");
    expect(first.text).toContain("Descrição fictícia do projeto.");
    expect(second).toMatchObject({ nome: "Integração Loja", src: "/projetos/loja.jpg", alt: "Painel da integração da loja" });
    expect(second.text).toContain("Integração");
    expect(second.text).toContain("2024");
    expect(second.text).toContain("Pedidos da loja viram nota fiscal sem digitação.");
  });
});

describe("Projects: imagem que não carrega mantém o espaço (EDGE-05)", () => {
  it("cada imagem declara largura e altura na proporção 16:11 e tem texto alternativo", async () => {
    const doc = parseHtml(await renderComponent(Projects, { projetos: [projetoFixture, segundo] }));
    const images = [...doc.querySelectorAll("#projetos img")];
    expect(images).toHaveLength(2);
    for (const img of images) {
      const width = Number(img.getAttribute("width"));
      const height = Number(img.getAttribute("height"));
      expect(width / height).toBeCloseTo(16 / 11, 5);
      expect(img.getAttribute("alt")?.length).toBeGreaterThan(0);
    }
  });
});

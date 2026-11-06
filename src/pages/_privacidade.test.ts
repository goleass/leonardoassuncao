// O prefixo "_" impede o Astro de tratar este arquivo de teste como rota de src/pages.
import { beforeAll, describe, expect, it, vi } from "vitest";
import { accessibleText, parseHtml, renderComponent } from "../../tests/render";
import { siteFixture } from "../../tests/fixtures/site";

// A página lê src/config/site.ts; o dublê prova que o e-mail vem da configuração.
vi.mock("../config/site", () => ({ site: { ...siteFixture, email: "dados@exemplo.com.br" } }));

const { default: Privacidade } = await import("./privacidade.astro");

let doc: Document;
let text: string;

beforeAll(async () => {
  doc = parseHtml(await renderComponent(Privacidade));
  text = accessibleText(doc.querySelector("main") as Element);
});

describe("Página /privacidade (LEGAL-01)", () => {
  it("tem título próprio e um único <h1>", () => {
    expect(doc.querySelector("title")?.textContent).toBe("Política de privacidade — Leonardo Gomes Assunção");
    expect(doc.querySelectorAll("h1")).toHaveLength(1);
    expect(doc.querySelector("h1")?.textContent?.trim()).toBe("Política de privacidade");
  });

  it("informa os dados que o formulário coleta: nome, e-mail, tipo de projeto e mensagem", () => {
    const items = [...doc.querySelectorAll("main #dados-coletados + ul li")].map((li) => li.textContent?.trim());
    expect(items).toEqual(["Nome", "E-mail", "Tipo de projeto", "Mensagem sobre o projeto"]);
  });

  it("informa a finalidade: responder ao contato", () => {
    expect(text).toContain("Os dados são usados apenas para responder ao seu contato.");
  });

  it("informa que as mensagens não são armazenadas no site", () => {
    expect(text).toContain("As mensagens não são armazenadas no site");
  });

  it("dá o e-mail configurado para pedidos sobre dados pessoais", () => {
    const link = doc.querySelector('main a[href^="mailto:"]');
    expect(link?.getAttribute("href")).toBe("mailto:dados@exemplo.com.br");
    expect(link?.textContent?.trim()).toBe("dados@exemplo.com.br");
  });

  /** Texto entre o título da seção de análise e o próximo <h2>. */
  function analysisSection(): string {
    const parts: string[] = [];
    let node = doc.querySelector("#analise-de-navegacao")?.nextElementSibling;
    while (node && node.tagName !== "H2") {
      parts.push(accessibleText(node));
      node = node.nextElementSibling;
    }
    return parts.join(" ");
  }

  it('tem a seção "Análise de navegação" com o Clarity, os dados, os cookies e a finalidade (CLAR-09)', () => {
    expect(doc.querySelector("#analise-de-navegacao")?.textContent?.trim()).toBe("Análise de navegação");
    const section = analysisSection();
    expect(section).toContain("Microsoft Clarity");
    expect(section).toContain("as páginas visitadas, os cliques, a rolagem e gravações da sessão");
    expect(section).toContain("O Clarity guarda cookies no seu navegador, como _clck e _clsk, para reconhecer a visita.");
    expect(section).toContain("Você pode bloqueá-los nas configurações do navegador.");
    expect(section).toContain("melhorar o site");
    expect(section).toContain("Saiba mais na política de privacidade da Microsoft.");
  });

  it("informa que a Microsoft pode usar cookies próprios, inclusive para publicidade (CLAR-14)", () => {
    expect(analysisSection()).toContain("Dependendo do navegador, a Microsoft também pode usar cookies próprios, inclusive para publicidade.");
  });

  it("informa que os campos do formulário são mascarados nas gravações (CLAR-10)", () => {
    expect(analysisSection()).toContain("O conteúdo dos campos do formulário de contato é mascarado nas gravações.");
  });

  it("a promessa de não compartilhar fica sob um título restrito ao formulário (CLAR-15)", () => {
    const heading = doc.querySelector("#finalidade-formulario");
    expect(heading?.textContent?.trim()).toBe("Finalidade dos dados do formulário");
    expect(accessibleText(heading?.nextElementSibling as Element)).toContain("não são vendidos, compartilhados para marketing");
  });

  it('"Seus direitos" orienta sobre os dados da análise de navegação (CLAR-16)', () => {
    const paragraph = doc.querySelector("#direitos-navegacao") as Element;
    expect(accessibleText(paragraph)).toBe(
      "Os dados da análise de navegação ficam com a Microsoft; para dúvidas sobre eles, escreva para o mesmo e-mail ou consulte a política de privacidade da Microsoft.",
    );
    expect(paragraph.previousElementSibling?.previousElementSibling?.textContent?.trim()).toBe("Seus direitos");
  });

  it("a introdução cita também a análise de navegação (CLAR-11)", () => {
    expect(doc.querySelector(".legal__lead")?.textContent?.replace(/\s+/g, " ")).toContain("dados da análise de navegação");
  });

  it("usa o visual do site: cabeçalho e rodapé", () => {
    expect(doc.querySelector("header.site-header")).not.toBeNull();
    expect(doc.querySelector("footer.site-footer")).not.toBeNull();
  });
});

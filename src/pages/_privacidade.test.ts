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

  it("usa o visual do site: cabeçalho e rodapé", () => {
    expect(doc.querySelector("header.site-header")).not.toBeNull();
    expect(doc.querySelector("footer.site-footer")).not.toBeNull();
  });
});

import { describe, expect, it } from "vitest";
import { parseHtml, renderComponent } from "../../tests/render";
import { projetoFixture, siteFixture } from "../../tests/fixtures/site";
import Header from "./Header.astro";

async function render(site = siteFixture) {
  return parseHtml(await renderComponent(Header, { site }));
}

const linkHref = (doc: Document, text: string) =>
  [...doc.querySelectorAll("nav a")].find((a) => a.textContent?.trim() === text)?.getAttribute("href");

describe("Header: navegação por âncoras (PAGE-06)", () => {
  it("cada link do menu aponta para o id da seção", async () => {
    const doc = await render({ ...siteFixture, projetos: [projetoFixture] });
    expect(linkHref(doc, "Serviços")).toBe("#servicos");
    expect(linkHref(doc, "Integrações")).toBe("#integracoes");
    expect(linkHref(doc, "Processo")).toBe("#processo");
    expect(linkHref(doc, "Projetos")).toBe("#projetos");
    expect(linkHref(doc, "Fale comigo")).toBe("#contato");
  });

  it("o nome da empresa leva ao topo", async () => {
    const doc = await render();
    const brand = doc.querySelector('header a[href="#topo"]');
    expect(brand?.textContent?.trim()).toBe("Leonardo Gomes Assunção");
  });
});

describe("Header: link Projetos condicional (PAGE-11)", () => {
  it('sem projetos configurados, não há link "Projetos"', async () => {
    const doc = await render();
    expect(linkHref(doc, "Projetos")).toBeUndefined();
    expect(doc.querySelector('a[href="#projetos"]')).toBeNull();
  });

  it('com projetos configurados, o link "Projetos" aparece entre Processo e Fale comigo', async () => {
    const doc = await render({ ...siteFixture, projetos: [projetoFixture] });
    const texts = [...doc.querySelectorAll("nav a")].map((a) => a.textContent?.trim());
    expect(texts).toEqual(["Serviços", "Integrações", "Processo", "Projetos", "Fale comigo"]);
  });
});

describe("Header: botão Menu para telas pequenas (RESP-02, RESP-03)", () => {
  it('tem um botão "Menu" fechado (aria-expanded="false")', async () => {
    const doc = await render();
    const button = doc.querySelector("header button");
    expect(button?.textContent?.trim()).toBe("Menu");
    expect(button?.getAttribute("type")).toBe("button");
    expect(button?.getAttribute("aria-expanded")).toBe("false");
  });

  it("aria-controls aponta para o painel com os links e o botão Fale comigo", async () => {
    const doc = await render();
    const controls = doc.querySelector("header button")?.getAttribute("aria-controls") ?? "";
    const panel = doc.getElementById(controls);
    expect(panel).not.toBeNull();
    const texts = [...(panel?.querySelectorAll("a") ?? [])].map((a) => a.textContent?.trim());
    expect(texts).toEqual(["Serviços", "Integrações", "Processo", "Fale comigo"]);
  });
});

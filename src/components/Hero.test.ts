import { beforeAll, describe, expect, it } from "vitest";
import { accessibleText, parseHtml, renderComponent } from "../../tests/render";
import { siteFixture } from "../../tests/fixtures/site";
import Hero from "./Hero.astro";

let doc: Document;

beforeAll(async () => {
  doc = parseHtml(await renderComponent(Hero, { site: siteFixture }));
});

describe("Hero: título (PAGE-02, A11Y-05, ANIM-08)", () => {
  it("tem um único <h1>", () => {
    expect(doc.querySelectorAll("h1")).toHaveLength(1);
  });

  it('o texto acessível do <h1> é a frase fixa "Construo software sob medida."', () => {
    expect(accessibleText(doc.querySelector("h1")!)).toBe("Construo software sob medida.");
  });

  it("alterna as palavras sites, sistemas, integrações e software, nessa ordem, fora da leitura de tela", () => {
    const rotator = doc.querySelector('h1 [aria-hidden="true"]');
    const words = [...(rotator?.querySelectorAll("*") ?? [])]
      .filter((el) => el.children.length === 0)
      .map((w) => w.textContent?.trim());
    expect(words.slice(0, 4)).toEqual(["sites", "sistemas", "integrações", "software"]);
  });
});

describe("Hero: entrada do título em 3 linhas (ANIM-01)", () => {
  it("o <h1> é composto por 3 linhas: Construo, palavra alternada, sob medida.", () => {
    const lines = [...doc.querySelector("h1")!.children];
    expect(lines).toHaveLength(3);
    expect(accessibleText(lines[0])).toBe("Construo");
    expect(accessibleText(lines[1])).toBe("software");
    expect(accessibleText(lines[2])).toBe("sob medida.");
  });
});

describe("Hero: chamadas para ação", () => {
  it('"Iniciar um projeto" leva a #contato e "Ver serviços" leva a #servicos', () => {
    const href = (text: string) =>
      [...doc.querySelectorAll("a")].find((a) => a.textContent?.trim() === text)?.getAttribute("href");
    expect(href("Iniciar um projeto")).toBe("#contato");
    expect(href("Ver serviços")).toBe("#servicos");
  });
});

describe("Hero: âncora e cidade configurada", () => {
  it('é a seção id="topo" e mostra a cidade/UF configurada', () => {
    const section = doc.querySelector("section#topo");
    expect(section).not.toBeNull();
    expect(section?.textContent).toContain("São Paulo, SP — Atendimento em todo o Brasil");
  });
});

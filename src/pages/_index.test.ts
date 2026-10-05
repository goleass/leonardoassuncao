// O prefixo "_" impede o Astro de tratar este arquivo de teste como rota de src/pages.
import { afterEach, describe, expect, it, vi } from "vitest";
import { parseHtml, renderComponent } from "../../tests/render";
import { projetoFixture, siteFixture } from "../../tests/fixtures/site";
import type { SiteConfig } from "../config/schema";

// A página lê src/config/site.ts; o dublê deixa cada teste escolher projetos/depoimento.
const config = vi.hoisted(() => ({ site: {} as SiteConfig }));
vi.mock("../config/site", () => config);

const { default: Index } = await import("./index.astro");

const DEPOIMENTO = { texto: "Ótimo trabalho.", autor: "Ana", cargo: "Diretora", empresa: "ACME" };

// Cada parte da página na ordem da spec (PAGE-01), identificada por um seletor estável.
const PARTS = [
  ["cabeçalho", "header.site-header"],
  ["topo", "#topo"],
  ["faixa de especialidades", 'section[aria-label="Especialidades"]'],
  ["Serviços", "#servicos"],
  ["Integrações", "#integracoes"],
  ["Compromissos", "#compromissos"],
  ["Processo", "#processo"],
  ["Projetos", "#projetos"],
  ["Depoimento", 'section[aria-label="Depoimento"]'],
  ["Perguntas frequentes", "#faq"],
  ["Contato", "#contato"],
  ["rodapé", "footer.site-footer"],
] as const;

async function render(site: SiteConfig) {
  config.site = site;
  return parseHtml(await renderComponent(Index));
}

/** Nomes das partes presentes, na ordem em que aparecem no HTML. */
function partsInOrder(doc: Document): string[] {
  const found = PARTS.flatMap(([name, selector]) => {
    const element = doc.querySelector(selector);
    return element ? [{ name, element }] : [];
  });
  return found
    .sort((a, b) => (a.element.compareDocumentPosition(b.element) & 4 ? -1 : 1))
    .map(({ name }) => name);
}

afterEach(() => {
  config.site = {} as SiteConfig;
});

describe("Página inicial: ordem das seções (PAGE-01)", () => {
  it("com projetos e depoimento, mostra as 12 partes na ordem da spec", async () => {
    const doc = await render({ ...siteFixture, projetos: [projetoFixture], depoimento: DEPOIMENTO });
    expect(partsInOrder(doc)).toEqual(PARTS.map(([name]) => name));
  });

  it("sem projetos nem depoimento, omite as duas e mantém a ordem das demais", async () => {
    const doc = await render(siteFixture);
    expect(partsInOrder(doc)).toEqual([
      "cabeçalho",
      "topo",
      "faixa de especialidades",
      "Serviços",
      "Integrações",
      "Compromissos",
      "Processo",
      "Perguntas frequentes",
      "Contato",
      "rodapé",
    ]);
  });

  it("as seções ficam dentro do <main>, entre o cabeçalho e o rodapé", async () => {
    const doc = await render(siteFixture);
    for (const id of ["topo", "servicos", "integracoes", "compromissos", "processo", "faq", "contato"]) {
      expect(doc.getElementById(id)?.closest("main")).not.toBeNull();
    }
    expect(doc.querySelector("header.site-header")?.closest("main")).toBeNull();
    expect(doc.querySelector("footer.site-footer")?.closest("main")).toBeNull();
  });

  it("usa a configuração do site: rodapé com o CNPJ configurado", async () => {
    const doc = await render(siteFixture);
    expect(doc.querySelector("footer.site-footer")?.textContent).toContain("00.000.000/0001-00");
  });
});

describe("Página inicial: hierarquia de títulos (A11Y-05)", () => {
  it.each([
    ["sem projetos nem depoimento", siteFixture],
    ["com projetos e depoimento", { ...siteFixture, projetos: [projetoFixture], depoimento: DEPOIMENTO }],
  ])("%s: exatamente um <h1> e nenhum nível pulado", async (_label, site) => {
    const doc = await render(site);
    expect(doc.querySelectorAll("h1")).toHaveLength(1);
    const levels = [...doc.querySelectorAll("h1, h2, h3, h4, h5, h6")].map((h) => Number(h.tagName[1]));
    expect(levels[0]).toBe(1);
    levels.forEach((level, i) => {
      if (i > 0) expect(level).toBeLessThanOrEqual(levels[i - 1] + 1);
    });
    expect(levels.indexOf(3)).toBeGreaterThan(levels.indexOf(2));
  });
});

describe("Página inicial: FAQ em dados estruturados (LD-07)", () => {
  it("publica uma FAQPage com as perguntas e respostas exatamente como aparecem na seção #faq", async () => {
    const doc = await render(siteFixture);
    const visible = [...doc.querySelectorAll("#faq details")].map((d) => [
      d.querySelector("summary")?.textContent?.trim(),
      d.querySelector("summary + *")?.textContent?.trim(),
    ]);
    const graph = JSON.parse(doc.querySelector('script[type="application/ld+json"]')?.textContent ?? "null")["@graph"];
    const faq = graph.find((node: { "@type": string }) => node["@type"] === "FAQPage");
    expect(visible).toHaveLength(4);
    expect(faq.mainEntity.map((q: any) => [q.name, q.acceptedAnswer.text])).toEqual(visible);
  });
});

describe("Página inicial: título e descrição para a busca (HOME-01, HOME-02)", () => {
  it("publica o título e a descrição exatos da spec", async () => {
    const doc = await render(siteFixture);
    expect(doc.querySelector("title")?.textContent).toBe("Criação de Sites e Sistemas em Canoas/RS | Leonardo Assunção");
    expect(doc.querySelector('meta[name="description"]')?.getAttribute("content")).toBe(
      "Criação de sites, sistemas web, integrações e software sob medida em Canoas/RS. Um só responsável técnico, do diagnóstico ao suporte. Atendo todo o Brasil.",
    );
  });
});

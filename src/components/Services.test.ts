import { beforeAll, describe, expect, it } from "vitest";
import { parseHtml, renderComponent } from "../../tests/render";
import Services from "./Services.astro";

const SERVICES = [
  {
    num: "01",
    title: "Criação de sites",
    text: "Institucionais, landing pages e catálogos. Rápidos, bem posicionados no Google e pensados para gerar contato.",
  },
  {
    num: "02",
    title: "Sistemas web",
    text: "Painéis administrativos, CRMs, portais de clientes e plataformas desenhadas em torno do seu processo, não o contrário.",
  },
  {
    num: "03",
    title: "Integrações e APIs",
    text: "ERP, pagamentos, WhatsApp, marketplaces e emissão fiscal conectados, para os dados fluírem sem digitação manual.",
  },
  {
    num: "04",
    title: "Software sob medida",
    text: "Automações, APIs próprias, aplicações internas e consultoria técnica para decisões de tecnologia.",
  },
  {
    num: "05",
    title: "Manutenção e evolução",
    text: "Assumo sistemas que já existem: correções, melhorias de desempenho, segurança e novas funcionalidades.",
  },
];

let doc: Document;

beforeAll(async () => {
  doc = parseHtml(await renderComponent(Services));
});

describe("Services: seção (PAGE-03)", () => {
  it('é a seção id="servicos" com o título <h2> "Serviços"', () => {
    const section = doc.querySelector("section#servicos");
    expect(section).not.toBeNull();
    expect(section?.querySelector("h2")?.textContent?.trim()).toBe("Serviços");
  });

  it("lista os 5 serviços na ordem, com número 01–05, título <h3> e descrição", () => {
    const items = [...doc.querySelectorAll("#servicos li")].map((li) => ({
      num: li.querySelector('[aria-hidden="true"]:not(svg)')?.textContent?.trim(),
      title: li.querySelector("h3")?.textContent?.trim(),
      text: li.querySelector("p")?.textContent?.trim(),
    }));
    expect(items).toEqual(SERVICES);
  });

  it("cada serviço é um link para #contato com a seta decorativa (ANIM-05)", () => {
    const items = [...doc.querySelectorAll("#servicos li")];
    expect(items).toHaveLength(5);
    for (const li of items) {
      const link = li.querySelector("a");
      expect(link?.getAttribute("href")).toBe("#contato");
      expect(link?.querySelector("svg")?.getAttribute("aria-hidden")).toBe("true");
    }
  });
});

import { beforeAll, describe, expect, it } from "vitest";
import { parseHtml, renderComponent } from "../../tests/render";
import Faq from "./Faq.astro";

let doc: Document;

beforeAll(async () => {
  doc = parseHtml(await renderComponent(Faq));
});

describe("Faq: perguntas frequentes (PAGE-07)", () => {
  it("tem 4 perguntas em <details>/<summary>, cada uma com a resposta do protótipo", () => {
    const items = [...doc.querySelectorAll("#faq details")].map((details) => ({
      pergunta: details.querySelector("summary")?.textContent?.trim(),
      resposta: details.querySelector("p")?.textContent?.trim(),
    }));
    expect(items).toEqual([
      {
        pergunta: "Quanto custa um site ou sistema?",
        resposta:
          "Depende do escopo. Depois do diagnóstico você recebe uma proposta fechada, com valor e prazo definidos antes de começar.",
      },
      {
        pergunta: "Quanto tempo leva para ficar pronto?",
        resposta:
          "Sites costumam levar algumas semanas. Sistemas são divididos em entregas para você começar a usar o quanto antes.",
      },
      {
        pergunta: "Dá para integrar com o sistema que eu já uso?",
        resposta: "Na maioria dos casos, sim. Se o sistema tem API, webhook ou exportação de dados, é possível integrar.",
      },
      {
        pergunta: "Você atende empresas de outras cidades?",
        resposta: "Sim. Todo o processo funciona remotamente, com reuniões por vídeo e acompanhamento online.",
      },
    ]);
  });

  it("só a primeira pergunta começa aberta", () => {
    const open = [...doc.querySelectorAll("#faq details")].map((details) => details.hasAttribute("open"));
    expect(open).toEqual([true, false, false, false]);
  });

  it('tem o título <h2> "Perguntas frequentes" (A11Y-05)', () => {
    expect(doc.querySelector("#faq h2")?.textContent?.trim()).toBe("Perguntas frequentes");
  });
});

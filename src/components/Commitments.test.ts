import { beforeAll, describe, expect, it } from "vitest";
import { parseHtml, renderComponent } from "../../tests/render";
import Commitments from "./Commitments.astro";

let doc: Document;

beforeAll(async () => {
  doc = parseHtml(await renderComponent(Commitments));
});

describe("Commitments: seção Compromissos (PAGE-01)", () => {
  it("mostra os 3 compromissos do protótipo com título <h3> e texto", () => {
    const items = [...doc.querySelectorAll("#compromissos li")].map((li) => ({
      title: li.querySelector("h3")?.textContent?.trim(),
      text: li.querySelector("p")?.textContent?.trim(),
    }));
    expect(items).toEqual([
      {
        title: "O código é seu.",
        text: "Código-fonte, servidores e acessos ficam com a sua empresa. Sem aluguel de plataforma, sem ficar refém.",
      },
      {
        title: "Escopo antes do código.",
        text: "Proposta por escrito com entregas, prazo e investimento definidos antes da primeira linha.",
      },
      {
        title: "Suporte depois da entrega.",
        text: "Monitoramento, correções e evolução contínua. O projeto não termina quando vai ao ar.",
      },
    ]);
  });

  it('tem um <h2> "Compromissos" antes dos <h3>, para a hierarquia de títulos (A11Y-05)', () => {
    const headings = [...doc.querySelectorAll("#compromissos h2, #compromissos h3")].map((h) => h.tagName);
    expect(headings).toEqual(["H2", "H3", "H3", "H3"]);
    expect(doc.querySelector("#compromissos h2")?.textContent?.trim()).toBe("Compromissos");
  });
});

import { beforeAll, describe, expect, it } from "vitest";
import { parseHtml, renderComponent } from "../../tests/render";
import Process from "./Process.astro";

let doc: Document;

beforeAll(async () => {
  doc = parseHtml(await renderComponent(Process));
});

describe("Process: 4 etapas (PAGE-05)", () => {
  it('é a seção id="processo" com o título <h2> "Processo"', () => {
    const section = doc.querySelector("section#processo");
    expect(section).not.toBeNull();
    expect(section?.querySelector("h2")?.textContent?.trim()).toBe("Processo");
  });

  it("lista as 4 etapas na ordem da spec, numa lista ordenada com título <h3> e descrição", () => {
    const steps = [...doc.querySelectorAll("#processo ol > li")].map((li) => ({
      title: li.querySelector("h3")?.textContent?.trim(),
      text: li.querySelector("p")?.textContent?.trim(),
    }));
    expect(steps).toEqual([
      {
        title: "Diagnóstico",
        text: "Conversa para entender o problema, o objetivo e o que já existe hoje na empresa.",
      },
      { title: "Proposta", text: "Escopo, tecnologias, cronograma e investimento, tudo documentado." },
      { title: "Desenvolvimento", text: "Ciclos curtos, com versões de teste que você acompanha e valida." },
      { title: "Entrega e suporte", text: "Publicação, treinamento da equipe e acompanhamento contínuo." },
    ]);
  });
});

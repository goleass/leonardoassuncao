import { describe, expect, it } from "vitest";
import { parseHtml, renderComponent } from "../../tests/render";
import Testimonial from "./Testimonial.astro";

const depoimento = {
  texto: "O sistema acabou com a planilha e economizou horas por semana.",
  autor: "Maria Souza",
  cargo: "Diretora de Operações",
  empresa: "Empresa Exemplo",
};

describe("Testimonial: depoimento condicional (PAGE-12)", () => {
  it("sem depoimento configurado não renderiza nada", async () => {
    const html = await renderComponent(Testimonial, {});
    expect(html.trim()).toBe("");
  });

  it("com depoimento, mostra a citação e o nome, cargo e empresa do autor", async () => {
    const doc = parseHtml(await renderComponent(Testimonial, { depoimento }));
    const quote = doc.querySelector("figure blockquote")?.textContent ?? "";
    expect(quote).toContain("O sistema acabou com a planilha e economizou horas por semana.");
    const caption = doc.querySelector("figure figcaption")?.textContent?.replace(/\s+/g, " ").trim() ?? "";
    expect(caption).toContain("Maria Souza");
    expect(caption).toContain("Diretora de Operações");
    expect(caption).toContain("Empresa Exemplo");
  });
});

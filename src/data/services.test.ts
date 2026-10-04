import { describe, expect, it } from "vitest";
import { services, type Service } from "./services";

const words = (text: string) => text.split(/\s+/).filter(Boolean).length;

// Todo o texto que vai para o <article> da página do serviço.
const articleText = (s: Service) =>
  [s.h1, s.intro, ...s.sections.flatMap((sec) => [sec.title, ...sec.paragraphs, ...(sec.items ?? [])]), ...s.faq.flatMap((f) => [f.q, f.a])].join(" ");

describe("services.ts: as 5 páginas de serviço (SVC-01)", () => {
  it("tem exatamente os 5 slugs, nesta ordem", () => {
    expect(services.map((s) => s.slug)).toEqual([
      "criacao-de-sites",
      "sistemas-web",
      "integracoes",
      "software-sob-medida",
      "manutencao-de-sistemas",
    ]);
  });
});

describe.each(services)("serviço $slug", (service) => {
  it("title tem até 60 caracteres (SVC-02)", () => {
    expect(service.title.length).toBeGreaterThan(0);
    expect(service.title.length).toBeLessThanOrEqual(60);
  });

  it("description tem de 70 a 160 caracteres (SVC-02)", () => {
    expect(service.description.length).toBeGreaterThanOrEqual(70);
    expect(service.description.length).toBeLessThanOrEqual(160);
  });

  it("tem ao menos 600 palavras de conteúdo (SVC-04)", () => {
    expect(words(articleText(service))).toBeGreaterThanOrEqual(600);
  });

  it("tem ao menos 2 seções e 3 perguntas (SVC-05)", () => {
    expect(service.sections.length).toBeGreaterThanOrEqual(2);
    expect(service.faq.length).toBeGreaterThanOrEqual(3);
  });

  it("não afirma clientes, projetos, anos de experiência nem métricas (SVC-10)", () => {
    expect(articleText(service)).not.toMatch(/\d+\s*(\+\s*)?(clientes|projetos|anos|%)/i);
  });
});

import { describe, expect, it } from "vitest";
import { guideSchema } from "./schema";

// Frontmatter mínimo válido; cada caso muda um campo só.
const valid = {
  title: "Quanto Custa um Sistema Sob Medida | Leonardo", // 45 caracteres
  description: "Faixas de preço, o que muda o valor e como pedir um orçamento de sistema sob medida em Canoas e região.",
  h1: "Quanto custa um sistema sob medida",
  resumo: "Depende do escopo. Este guia mostra o que pesa no preço.",
  servico: "software-sob-medida",
  publishedAt: "2026-10-17",
};

const issuePaths = (input: unknown) => {
  const result = guideSchema.safeParse(input);
  return result.success ? [] : result.error.issues.map((i) => i.path.join("."));
};

describe("guideSchema (COL-02)", () => {
  it("aceita frontmatter válido e converte as datas", () => {
    const data = guideSchema.parse({ ...valid, updatedAt: "2026-10-20" });
    expect(data.publishedAt).toEqual(new Date("2026-10-17"));
    expect(data.updatedAt).toEqual(new Date("2026-10-20"));
  });

  it("faq assume [] e draft assume false quando ausentes", () => {
    const data = guideSchema.parse(valid);
    expect(data.faq).toEqual([]);
    expect(data.draft).toBe(false);
    expect(data.updatedAt).toBeUndefined();
  });

  it("aceita faq como lista de { q, a } e draft: true", () => {
    const data = guideSchema.parse({ ...valid, faq: [{ q: "Pergunta?", a: "Resposta." }], draft: true });
    expect(data.faq).toEqual([{ q: "Pergunta?", a: "Resposta." }]);
    expect(data.draft).toBe(true);
  });

  it.each(["title", "description", "h1", "resumo", "servico", "publishedAt"])(
    "falha sem o campo obrigatório %s",
    (field) => {
      const { [field]: _, ...rest } = valid as Record<string, unknown>;
      expect(issuePaths(rest)).toContain(field);
    },
  );
});

describe("guideSchema: serviço (COL-03)", () => {
  it("aceita cada um dos 5 serviços", () => {
    for (const servico of ["criacao-de-sites", "sistemas-web", "integracoes", "software-sob-medida", "manutencao-de-sistemas"]) {
      expect(guideSchema.safeParse({ ...valid, servico }).success).toBe(true);
    }
  });

  it("falha com serviço desconhecido, apontando o campo", () => {
    expect(issuePaths({ ...valid, servico: "marketing" })).toEqual(["servico"]);
  });
});

describe("guideSchema: tamanhos de title e description (COL-04)", () => {
  it("aceita title com 30 e 60 caracteres", () => {
    expect(guideSchema.safeParse({ ...valid, title: "a".repeat(30) }).success).toBe(true);
    expect(guideSchema.safeParse({ ...valid, title: "a".repeat(60) }).success).toBe(true);
  });

  it("falha com title de 29 ou 61 caracteres, apontando o campo", () => {
    expect(issuePaths({ ...valid, title: "a".repeat(29) })).toEqual(["title"]);
    expect(issuePaths({ ...valid, title: "a".repeat(61) })).toEqual(["title"]);
  });

  it("aceita description com 70 e 160 caracteres", () => {
    expect(guideSchema.safeParse({ ...valid, description: "a".repeat(70) }).success).toBe(true);
    expect(guideSchema.safeParse({ ...valid, description: "a".repeat(160) }).success).toBe(true);
  });

  it("falha com description de 69 ou 161 caracteres, apontando o campo", () => {
    expect(issuePaths({ ...valid, description: "a".repeat(69) })).toEqual(["description"]);
    expect(issuePaths({ ...valid, description: "a".repeat(161) })).toEqual(["description"]);
  });
});

describe("guideSchema: datas (COL-06)", () => {
  it("aceita updatedAt igual a publishedAt", () => {
    expect(guideSchema.safeParse({ ...valid, updatedAt: "2026-10-17" }).success).toBe(true);
  });

  it("falha com updatedAt anterior a publishedAt", () => {
    expect(issuePaths({ ...valid, updatedAt: "2026-10-16" })).toEqual(["updatedAt"]);
  });
});

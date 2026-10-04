import { describe, expect, it } from "vitest";
import { validateSiteConfig } from "./schema";

const valid = {
  url: "https://leonardoassuncao.com.br",
  email: "contato@leonardoassuncao.com.br",
  whatsapp: "5511999999999",
  whatsappDisplay: "(11) 99999-9999",
  linkedin: "https://www.linkedin.com/in/leonardo",
  cidade: "São Paulo, SP",
  cnpj: "12.345.678/0001-90",
  prazoResposta: "24 horas úteis",
  projetos: [],
};

const requiredFields = [
  "url",
  "email",
  "whatsapp",
  "whatsappDisplay",
  "linkedin",
  "cidade",
  "cnpj",
  "prazoResposta",
] as const;

describe("validateSiteConfig", () => {
  it.each(requiredFields)("campo %s vazio → erro que nomeia o campo", (field) => {
    expect(() => validateSiteConfig({ ...valid, [field]: "" })).toThrow(
      new RegExp(`^Configuração inválida: ${field} está vazio$`),
    );
  });

  it.each(requiredFields)("campo %s com texto entre colchetes → erro que nomeia o campo", (field) => {
    expect(() => validateSiteConfig({ ...valid, [field]: "[X]" })).toThrow(
      new RegExp(`^Configuração inválida: ${field} contém texto entre colchetes$`),
    );
  });

  it("campo só com espaços conta como vazio", () => {
    expect(() => validateSiteConfig({ ...valid, cnpj: "   " })).toThrow(/^Configuração inválida: cnpj está vazio$/);
  });

  it("colchetes no meio do texto também são rejeitados", () => {
    expect(() => validateSiteConfig({ ...valid, cidade: "[Cidade], SP" })).toThrow(
      /^Configuração inválida: cidade contém texto entre colchetes$/,
    );
  });

  it("campo obrigatório ausente → erro que nomeia o campo", () => {
    const { email: _omit, ...rest } = valid;
    expect(() => validateSiteConfig(rest)).toThrow(/^Configuração inválida: email está ausente$/);
  });

  it("config válida retorna o objeto tipado com os mesmos valores", () => {
    const result = validateSiteConfig(valid);
    expect(result).toEqual(valid);
  });

  it("aceita projetos: [] e depoimento ausente", () => {
    const result = validateSiteConfig(valid);
    expect(result.projetos).toEqual([]);
    expect(result.depoimento).toBeUndefined();
  });

  it("aceita projetos e depoimento preenchidos", () => {
    const projeto = {
      nome: "Portal do cliente",
      categoria: "Sistema web",
      ano: "2026",
      descricao: "Portal que centraliza pedidos.",
      imagem: "/projetos/portal.jpg",
      alt: "Tela inicial do portal do cliente",
    };
    const depoimento = { texto: "Ótimo trabalho.", autor: "Ana", cargo: "Diretora", empresa: "ACME" };
    const result = validateSiteConfig({ ...valid, projetos: [projeto], depoimento });
    expect(result.projetos).toEqual([projeto]);
    expect(result.depoimento).toEqual(depoimento);
  });

  it("campo de projeto com placeholder → erro que nomeia o campo", () => {
    const projeto = {
      nome: "[Nome do projeto 1]",
      categoria: "Sistema web",
      ano: "2026",
      descricao: "Descrição.",
      imagem: "/p.jpg",
      alt: "Imagem",
    };
    expect(() => validateSiteConfig({ ...valid, projetos: [projeto] })).toThrow(
      /^Configuração inválida: projetos\.0\.nome contém texto entre colchetes$/,
    );
  });

  it("campo de depoimento vazio → erro que nomeia o campo", () => {
    const depoimento = { texto: "Ótimo.", autor: "", cargo: "Diretora", empresa: "ACME" };
    expect(() => validateSiteConfig({ ...valid, depoimento })).toThrow(
      /^Configuração inválida: depoimento\.autor está vazio$/,
    );
  });
});

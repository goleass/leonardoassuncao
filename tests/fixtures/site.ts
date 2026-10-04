import type { SiteConfig } from "../../src/config/schema";

// Valores fictícios, válidos no schema; os dados reais entram no T4 (src/config/site.ts).
export const siteFixture: SiteConfig = {
  url: "https://exemplo.com.br",
  email: "contato@exemplo.com.br",
  whatsapp: "5511900000000",
  whatsappDisplay: "(11) 90000-0000",
  cidade: "São Paulo, SP",
  cnpj: "00.000.000/0001-00",
  prazoResposta: "24 horas úteis",
  projetos: [],
};

/** Variante com LinkedIn configurado (o campo é opcional). */
export const siteComLinkedinFixture: SiteConfig = { ...siteFixture, linkedin: "https://www.linkedin.com/in/exemplo" };

export const projetoFixture: SiteConfig["projetos"][number] = {
  nome: "Projeto Exemplo",
  categoria: "Sistema web",
  ano: "2025",
  descricao: "Descrição fictícia do projeto.",
  imagem: "/projetos/exemplo.jpg",
  alt: "Tela do Projeto Exemplo",
};

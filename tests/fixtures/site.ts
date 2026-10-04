import type { SiteConfig } from "../../src/config/schema";

// Valores fictícios, válidos no schema; os dados reais entram no T4 (src/config/site.ts).
export const siteFixture: SiteConfig = {
  url: "https://exemplo.com.br",
  email: "contato@exemplo.com.br",
  whatsapp: "5511900000000",
  whatsappDisplay: "(11) 90000-0000",
  linkedin: "https://www.linkedin.com/in/exemplo",
  cidade: "São Paulo, SP",
  cnpj: "00.000.000/0001-00",
  prazoResposta: "24 horas úteis",
  projetos: [],
};

export const projetoFixture: SiteConfig["projetos"][number] = {
  nome: "Projeto Exemplo",
  categoria: "Sistema web",
  ano: "2025",
  descricao: "Descrição fictícia do projeto.",
  imagem: "/projetos/exemplo.jpg",
  alt: "Tela do Projeto Exemplo",
};

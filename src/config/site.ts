import type { SiteConfig } from "./schema";

// Único lugar com os dados da empresa (PAGE-08). O build valida este objeto em astro.config.mjs (PAGE-09).
export const site: SiteConfig = {
  url: "https://www.leonardoassuncao.com.br",
  email: "contato@leonardoassuncao.com.br",
  whatsapp: "5551991419064",
  whatsappDisplay: "(51) 99141-9064",
  cidade: "Canoas, RS",
  cnpj: "44.053.654/0001-59",
  prazoResposta: "24 horas úteis",
  projetos: [],
};

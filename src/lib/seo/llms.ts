import type { SiteConfig } from "../../config/schema";
import type { Service } from "../../data/services";
import { lastDate, type Guide } from "../guias/guias";
import { HOME_DESCRIPTION, NAME } from "./schema";

const AREA = "Canoas, Porto Alegre e região metropolitana; todo o Brasil de forma remota";

const abs = (site: SiteConfig, path: string) => new URL(path, site.url).href;

/** Resumo em Markdown para modelos de IA (llmstxt.org): serviços e guias listados a partir dos dados (LLMS-06; guias LLMS-01 a 03). */
export function llmsText(site: SiteConfig, list: Service[], guides: Guide[] = []): string {
  const recentes = [...guides].sort((a, b) => lastDate(b).getTime() - lastDate(a).getTime());
  return [
    `# ${NAME}`,
    "",
    `> ${HOME_DESCRIPTION}`,
    "",
    `Cidade: ${site.cidade}. Área de atuação: ${AREA}. E-mail: ${site.email}. WhatsApp: ${site.whatsappDisplay} (https://wa.me/${site.whatsapp}). CNPJ: ${site.cnpj}.`,
    "",
    "## Páginas",
    "",
    `- [Início](${abs(site, "/")}): ${HOME_DESCRIPTION}`,
    ...list.map((s) => `- [${s.name}](${abs(site, `/${s.slug}/`)}): ${s.description}`),
    `- [Guias](${abs(site, "/guias/")}): Guias práticos sobre custo e contratação de sites, sistemas e integrações.`,
    `- [Privacidade](${abs(site, "/privacidade/")}): Como os dados enviados pelo formulário e pelo WhatsApp são tratados.`,
    "",
    // Seção só existe com ao menos um guia publicado (guias LLMS-02).
    ...(recentes.length
      ? ["## Guias", "", ...recentes.map((g) => `- [${g.h1}](${abs(site, `/guias/${g.slug}/`)}): ${g.resumo}`), ""]
      : []),
    "## Optional",
    "",
    `- [Texto completo](${abs(site, "/llms-full.txt")}): Serviços e perguntas frequentes em texto corrido.`,
    "",
  ].join("\n");
}

/** Texto integral dos serviços e do FAQ, sem HTML (LLMS-08, LLMS-09). */
export function llmsFullText(site: SiteConfig, list: Service[], faq: { q: string; a: string }[]): string {
  const servico = (s: Service) => [
    `### ${s.name}`,
    "",
    `URL: ${abs(site, `/${s.slug}/`)}`,
    "",
    s.description,
    "",
    s.intro,
    "",
    ...s.sections.flatMap((sec) => [
      `#### ${sec.title}`,
      "",
      ...sec.paragraphs.flatMap((p) => [p, ""]),
      ...(sec.items ? [...sec.items.map((i) => `- ${i}`), ""] : []),
    ]),
  ];
  return [
    `# ${NAME}`,
    "",
    `> ${HOME_DESCRIPTION}`,
    "",
    `Cidade: ${site.cidade}. Área de atuação: ${AREA}. E-mail: ${site.email}. WhatsApp: ${site.whatsappDisplay} (https://wa.me/${site.whatsapp}). CNPJ: ${site.cnpj}.`,
    "",
    "## Serviços",
    "",
    ...list.flatMap(servico),
    "## Perguntas frequentes",
    "",
    ...faq.flatMap(({ q, a }) => [`### ${q}`, "", a, ""]),
  ].join("\n");
}

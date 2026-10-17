// Modelo, validação, seleção e ordem dos guias. Puro: não importa astro:content.
import type { GuideData } from "./schema";

/** Entrada da coleção com o mínimo usado aqui (id = nome do arquivo sem extensão). */
export interface GuideEntry {
  id: string;
  data: GuideData;
  body?: string;
  rendered?: { html: string };
}

export type Guide = GuideData & {
  slug: string;
  /** Markdown cru: checagem de marcadores e contagem de palavras. */
  body: string;
  /** HTML que o Astro gerou do Markdown. */
  html: string;
};

const SLUG = /^[a-z0-9]+(-[a-z0-9]+)*$/;
const MARKERS = ["[PREÇO:", "[REVISAR:", "[...]"];

export function toGuide(entry: GuideEntry): Guide {
  return { slug: entry.id, ...entry.data, body: entry.body ?? "", html: entry.rendered?.html ?? "" };
}

export const lastDate = (g: Guide): Date => g.updatedAt ?? g.publishedAt;

const newestFirst = (list: Guide[]) => [...list].sort((a, b) => lastDate(b).getTime() - lastDate(a).getTime());

/** Valida slug e marcadores, remove rascunhos fora do dev e ordena do mais recente (COL-05, COL-07 a COL-09). */
export function selectGuides(guides: Guide[], { includeDrafts }: { includeDrafts: boolean }): Guide[] {
  for (const g of guides) {
    const file = `guias/${g.slug}.md`;
    if (!SLUG.test(g.slug)) throw new Error(`${file}: nome do arquivo inválido; use letras minúsculas, números e hífens`);
    if (!g.draft) {
      const { body, html: _html, ...frontmatter } = g;
      const text = JSON.stringify(frontmatter) + body;
      const marker = MARKERS.find((m) => text.includes(m));
      if (marker) throw new Error(`${file}: marcador pendente "${marker}" em guia publicado; resolva ou use draft: true`);
    }
  }
  return newestFirst(includeDrafts ? guides : guides.filter((g) => !g.draft));
}

export const guidesFor = (guides: Guide[], servico: string): Guide[] =>
  newestFirst(guides.filter((g) => g.servico === servico));

/** Outros guias do mesmo serviço, os `max` mais recentes (PAGE-08, EDGE-02, EDGE-03). */
export const related = (guides: Guide[], guide: Guide, max = 3): Guide[] =>
  guidesFor(guides, guide.servico)
    .filter((g) => g.slug !== guide.slug)
    .slice(0, max);

// Datas YAML viram meia-noite UTC: formatar em UTC evita mostrar o dia anterior.
const fmt = new Intl.DateTimeFormat("pt-BR", { dateStyle: "long", timeZone: "UTC" });

/** "17 de outubro de 2026". */
export const formatDate = (d: Date): string => fmt.format(d);

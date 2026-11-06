// Regras de calendário e de links dos guias, puras para terem casos de falha próprios (PRB-02, SCHED-09, SCHED-10).
const OWN_SITE = /^https?:\/\/(?:www\.)?leonardoassuncao\.com\.br/;

/** Slugs de guia citados no corpo, com ou sem domínio, barra final, âncora ou query. */
export function guideTargets(body: string): string[] {
  const hrefs = [...body.matchAll(/(?:\]\(|href=["'])([^)\s"']+)/g)].map(([, href]) => href.replace(OWN_SITE, ""));
  return hrefs.map((href) => href.match(/^\/guias\/([^/#?]+)\/?(?:[#?].*)?$/)?.[1]).filter((slug): slug is string => !!slug);
}

/** Links relativos: dependem da página de origem e escapariam de guideTargets (SCHED-09, SCHED-10). */
export const relativeLinks = (body: string): string[] =>
  [...body.matchAll(/(?:\]\(|href=["'])(\.{1,2}\/[^)\s"']*)/g)].map(([, href]) => href);

/** Alvos com data posterior à do guia de origem (SCHED-09). */
export const laterTargets = (own: string, targets: string[], dateOf: (slug: string) => string): string[] =>
  targets.filter((target) => dateOf(target).slice(0, 10) > own.slice(0, 10));

/** Alvos sem arquivo em src/content/guias (SCHED-10). */
export const missingTargets = (targets: string[], files: string[]): string[] =>
  targets.filter((target) => !files.includes(target));

/** Datas com mais de `limit` guias (PRB-02). */
export function datesOverLimit(dates: string[], limit = 3): string[] {
  const perDate = new Map<string, number>();
  for (const date of dates) perDate.set(date, (perDate.get(date) ?? 0) + 1);
  return [...perDate].filter(([, count]) => count > limit).map(([date]) => date);
}

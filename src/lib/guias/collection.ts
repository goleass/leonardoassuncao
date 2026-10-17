// Único ponto que toca astro:content; o resto recebe Guide[] (testável sem o build).
import { getCollection } from "astro:content";
import { selectGuides, toGuide, type Guide } from "./guias";

/** Guias validados e ordenados; rascunhos só no `astro dev` (COL-08, COL-09). MODE vem do comando do Astro; DEV pode vir de uma variável de ambiente e publicaria rascunhos. */
export async function loadGuides(): Promise<Guide[]> {
  return selectGuides((await getCollection("guias")).map(toGuide), { includeDrafts: import.meta.env.MODE === "development" });
}

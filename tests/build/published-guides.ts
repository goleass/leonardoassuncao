import { readdirSync, readFileSync } from "node:fs";
import { join } from "node:path";
import { parse } from "yaml";
import { isDue } from "../../src/lib/guias/guias";

const CONTENT = join(process.cwd(), "src", "content", "guias");

/** Slugs que o build de hoje deve publicar, em ordem: sem rascunhos e sem guias com data futura em Brasília (SCHED-01, SCHED-02). */
export const PUBLISHED_GUIDES = readdirSync(CONTENT)
  .filter((file) => file.endsWith(".md"))
  .filter((file) => {
    const front = parse(readFileSync(join(CONTENT, file), "utf8").match(/^---\r?\n([\s\S]*?)\r?\n---/)![1]);
    return !front.draft && isDue(new Date(front.publishedAt));
  })
  .map((file) => file.slice(0, -3))
  .sort();

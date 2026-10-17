// Data real de alteração de cada página para o <lastmod> do sitemap (SMAP-01/02).
// Usado pelo astro.config.mjs: nada aqui pode depender de módulos do Astro.
import { execFileSync } from "node:child_process";
import { readdirSync, readFileSync } from "node:fs";
import { join } from "node:path";
import { services } from "../../data/services.ts";

type GitRun = (args: string[]) => string | undefined;

// Sem git (binário ausente, sem .git) → undefined.
const git: GitRun = (args) => {
  try {
    return execFileSync("git", args, { encoding: "utf8", stdio: ["ignore", "pipe", "ignore"] });
  } catch {
    return undefined;
  }
};

/** Data ISO do último commit que tocou `files`; undefined em clone raso, sem git ou sem commits. */
export function lastCommitDate(files: string[], run: GitRun = git): string | undefined {
  if (files.length === 0) return undefined;
  try {
    // Clone raso: a data seria a do único commit baixado, igual para tudo (SMAP-02).
    if (run(["rev-parse", "--is-shallow-repository"])?.trim() === "true") return undefined;
    return run(["log", "-1", "--format=%cI", "--", ...files])?.trim() || undefined;
  } catch {
    return undefined;
  }
}

const LAYOUTS = "src/layouts";

/** Arquivos-fonte e dados de cada página, por caminho da URL. */
export const PAGE_SOURCES: Record<string, string[]> = {
  "/": ["src/pages/index.astro", "src/components", "src/data/faq.ts", LAYOUTS],
  ...Object.fromEntries(
    services.map((service) => [`/${service.slug}/`, ["src/pages/[servico].astro", "src/data/services.ts", LAYOUTS]]),
  ),
  "/privacidade/": ["src/pages/privacidade.astro", LAYOUTS],
};

type GuideFile = { name: string; text: string };
type ReadDir = (dir: string) => GuideFile[];

// Pasta ausente (nenhum guia ainda) → lista vazia.
const readDir: ReadDir = (dir) => {
  try {
    return readdirSync(dir)
      .filter((name) => name.endsWith(".md"))
      .map((name) => ({ name, text: readFileSync(join(dir, name), "utf8") }));
  } catch {
    return [];
  }
};

/** slug → `updatedAt ?? publishedAt` (AAAA-MM-DD) dos guias publicados, lido do frontmatter (guias SMAP-02). */
export function guideDates(dir = "src/content/guias", read: ReadDir = readDir): Record<string, string> {
  const dates: Record<string, string> = {};
  for (const { name, text } of read(dir)) {
    const front = text.match(/^---\r?\n([\s\S]*?)\r?\n---/)?.[1] ?? "";
    const field = (key: string) => front.match(new RegExp(`^${key}:\\s*["']?([^"'\\s]+)["']?\\s*$`, "m"))?.[1];
    if (field("draft") === "true") continue;
    const date = field("updatedAt") ?? field("publishedAt");
    if (date) dates[name.replace(/\.md$/, "")] = date;
  }
  return dates;
}

/** Data dos guias para /guias/<slug>/ e a maior delas para /guias/ (guias SMAP-02, SMAP-03). */
function guideLastmod(path: string, read: ReadDir): string | undefined {
  const slug = path.match(/^\/guias\/(?:([^/]+)\/)?$/);
  if (!slug) return undefined;
  const dates = guideDates(undefined, read);
  return slug[1] ? dates[slug[1]] : Object.values(dates).sort().at(-1);
}

/** `serialize` do sitemap: preenche `lastmod` pelas fontes da página; sem data, deixa o item como está (SMAP-02). */
export function withLastmod<T extends { url: string; lastmod?: string }>(
  item: T,
  run: GitRun = git,
  read: ReadDir = readDir,
): T {
  const path = new URL(item.url).pathname;
  const date = path.startsWith("/guias/") ? guideLastmod(path, read) : lastCommitDate(PAGE_SOURCES[path] ?? [], run);
  if (date) item.lastmod = date;
  return item;
}

// Data real de alteração de cada página para o <lastmod> do sitemap (SMAP-01/02).
// Usado pelo astro.config.mjs: nada aqui pode depender de módulos do Astro.
import { execFileSync } from "node:child_process";
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

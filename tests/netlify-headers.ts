import { readFileSync } from "node:fs";
import { join } from "node:path";

export interface HeaderRule {
  for: string;
  values: Record<string, string>;
}

// Lê cada bloco [[headers]] do netlify.toml (`for` + [headers.values]) sem dependência de parser TOML.
// Usado pelo teste da configuração e pelo servidor do teste de navegador.
export function netlifyHeaders(toml = readFileSync(join(process.cwd(), "netlify.toml"), "utf8")): HeaderRule[] {
  return toml
    .split("[[headers]]")
    .slice(1)
    .map((block) => {
      const [head, values = ""] = block.split(/^\s*\[headers\.values\]\s*$/m);
      const pairs = (text: string) =>
        Object.fromEntries([...text.split(/\n\s*\[\[?[^\]]+\]\]?/)[0].matchAll(/^\s*([\w-]+)\s*=\s*"([^"\n]*)"\s*$/gm)].map(([, k, v]) => [k, v]));
      return { for: pairs(head).for, values: pairs(values) };
    });
}

import { readFileSync } from "node:fs";
import { join } from "node:path";
import { describe, expect, it } from "vitest";

// Lê cada bloco [[redirects]] do netlify.toml como pares chave = valor (sem dependência de parser TOML).
function redirects(): Record<string, string>[] {
  const toml = readFileSync(join(process.cwd(), "netlify.toml"), "utf8");
  return toml
    .split("[[redirects]]")
    .slice(1)
    .map((block) =>
      Object.fromEntries(
        [...block.split(/\n\[/)[0].matchAll(/^\s*(\w+)\s*=\s*"?([^"\n]*)"?\s*$/gm)].map(([, key, value]) => [key, value]),
      ),
    );
}

describe("netlify.toml: subdomínio netlify.app vai para o host canônico (HOST-05)", () => {
  it("redireciona 301, forçado, preservando o caminho", () => {
    const rule = redirects().find((r) => r.from === "https://leonardoassuncao.netlify.app/*");
    expect(rule).toEqual({
      from: "https://leonardoassuncao.netlify.app/*",
      to: "https://www.leonardoassuncao.com.br/:splat",
      status: "301",
      force: "true",
    });
  });
});

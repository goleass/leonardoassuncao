import { readFileSync } from "node:fs";
import { join } from "node:path";
import { describe, expect, it } from "vitest";

// Lê o dist/ do `npm run build` anterior (gate: `npm run build && npm run test:build`).
const arquivo = join(process.cwd(), "dist", ".well-known", "security.txt");

describe("build publica /.well-known/security.txt (SECTXT-01..06, EDGE-11)", () => {
  const linhas = readFileSync(arquivo, "utf8").split("\n");

  it("tem os campos com os dados reais", () => {
    expect(linhas).toContain("Contact: mailto:contato@leonardoassuncao.com.br");
    expect(linhas).toContain("Canonical: https://www.leonardoassuncao.com.br/.well-known/security.txt");
    expect(linhas).toContain("Preferred-Languages: pt-BR, en");
    expect(linhas).toContain("Policy: https://www.leonardoassuncao.com.br/privacidade/");
  });

  it("Expires é posterior à data do build (EDGE-11)", () => {
    const expires = linhas.find((l) => l.startsWith("Expires: "))!.slice("Expires: ".length);
    expect(Date.parse(expires)).toBeGreaterThan(Date.now());
  });
});

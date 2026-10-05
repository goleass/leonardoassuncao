import { readFileSync } from "node:fs";
import { join } from "node:path";
import { describe, expect, it } from "vitest";
import { netlifyHeaders } from "./netlify-headers";

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

describe("netlify.toml: cabeçalhos de segurança em todo caminho (SECH-01..07, CSP-01, EDGE-13)", () => {
  const rules = netlifyHeaders();
  const all = rules.find((rule) => rule.for === "/*");
  const header = (name: string) => all?.values[name];

  it('o primeiro bloco [[headers]] é for = "/*" (vale para 404, llms.txt, security.txt e manifest)', () => {
    expect(rules[0].for).toBe("/*");
  });

  it("os demais blocos só ajustam o content-type do manifest, sem sobrescrever cabeçalho de segurança (MANI-01)", () => {
    expect(rules.slice(1)).toEqual([{ for: "/site.webmanifest", values: { "Content-Type": "application/manifest+json" } }]);
  });

  it.each([
    ["X-Content-Type-Options", "nosniff"], // SECH-01
    ["X-Frame-Options", "DENY"], // SECH-02
    ["Referrer-Policy", "strict-origin-when-cross-origin"], // SECH-03
    ["Permissions-Policy", "camera=(), microphone=(), geolocation=(), payment=(), usb=(), browsing-topics=()"], // SECH-04
    ["Cross-Origin-Opener-Policy", "same-origin"], // SECH-05
    ["Cross-Origin-Embedder-Policy", "require-corp"], // SECH-06
    ["Cross-Origin-Resource-Policy", "same-origin"], // SECH-07
  ])("%s = %s", (name, value) => {
    expect(header(name)).toBe(value);
  });

  it("Permissions-Policy desliga câmera, microfone, localização, pagamento e browsing-topics (SECH-04)", () => {
    const features = (header("Permissions-Policy") ?? "").split(",").map((part) => part.trim());
    for (const feature of ["camera=()", "microphone=()", "geolocation=()", "payment=()", "browsing-topics=()"]) {
      expect(features).toContain(feature);
    }
  });

  it("envia Content-Security-Policy com o valor do design (CSP-01)", () => {
    expect(header("Content-Security-Policy")).toBe(
      "default-src 'self'; script-src 'self'; style-src 'self' 'unsafe-inline'; img-src 'self' data:; font-src 'self'; connect-src 'self'; frame-ancestors 'none'; base-uri 'self'; form-action 'self'; object-src 'none'; upgrade-insecure-requests",
    );
  });

  describe("diretivas da CSP", () => {
    const csp = () =>
      Object.fromEntries(
        (header("Content-Security-Policy") ?? "")
          .split(";")
          .map((part) => part.trim().split(/\s+/))
          .filter(([name]) => name)
          .map(([name, ...sources]) => [name, sources]),
      ) as Record<string, string[]>;

    it.each([
      ["default-src", ["'self'"]],
      ["frame-ancestors", ["'none'"]],
      ["base-uri", ["'self'"]],
      ["form-action", ["'self'"]],
      ["object-src", ["'none'"]],
    ])("%s %j (CSP-02)", (name, sources) => {
      expect(csp()[name]).toEqual(sources);
    });

    it("script-src (ou default-src) sem 'unsafe-inline' nem 'unsafe-eval' (CSP-03)", () => {
      const scripts = csp()["script-src"] ?? csp()["default-src"];
      expect(scripts).toEqual(["'self'"]);
      expect(scripts).not.toContain("'unsafe-inline'");
      expect(scripts).not.toContain("'unsafe-eval'");
    });
  });
});

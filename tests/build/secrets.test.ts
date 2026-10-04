import { execFileSync } from "node:child_process";
import { existsSync, readdirSync, readFileSync, statSync } from "node:fs";
import { join } from "node:path";
import { beforeAll, describe, expect, it } from "vitest";

// Pasta confirmada após o build com @astrojs/vercel 11 + Astro 7: tudo que vai ao navegador fica em static/.
const OUTPUT = join(process.cwd(), ".vercel/output");
const STATIC = join(OUTPUT, "static");
const SENTINEL = "re_SENTINELA_nao_pode_vazar_7f3a91";

function listFiles(dir: string): string[] {
  return readdirSync(dir).flatMap((name) => {
    const path = join(dir, name);
    return statSync(path).isDirectory() ? listFiles(path) : [path];
  });
}

beforeAll(() => {
  // Build com um valor-sentinela na chave: se ela vazar, aparece nos arquivos públicos.
  execFileSync("npx", ["astro", "build"], {
    env: {
      ...process.env,
      RESEND_API_KEY: SENTINEL,
      CONTACT_TO: "destino@exemplo.com.br",
      CONTACT_FROM: "Site <site@exemplo.com.br>",
    },
    stdio: "pipe",
  });
}, 180_000);

describe("saída do build", () => {
  it("pasta pública existe e contém o HTML estático", () => {
    expect(existsSync(STATIC)).toBe(true);
    expect(existsSync(join(STATIC, "index.html"))).toBe(true);
  });

  it("/api/contato é servido por uma função, não por arquivo estático", () => {
    const config = JSON.parse(readFileSync(join(OUTPUT, "config.json"), "utf8")) as {
      routes: Array<{ src?: string; dest?: string }>;
    };
    const route = config.routes.find((r) => r.src && new RegExp(r.src).test("/api/contato"));
    expect(route?.dest).toBe("_render");
    expect(existsSync(join(OUTPUT, "functions/_render.func/.vc-config.json"))).toBe(true);
    expect(listFiles(STATIC).some((file) => file.includes("contato"))).toBe(false);
  });

  it("endereço inexistente responde 404 com a página 404.html (LEGAL-03)", () => {
    expect(existsSync(join(STATIC, "404.html"))).toBe(true);
    const config = JSON.parse(readFileSync(join(OUTPUT, "config.json"), "utf8")) as {
      routes: Array<{ src?: string; dest?: string; status?: number }>;
    };
    const route = config.routes.find((r) => r.dest === "/404.html");
    expect(route?.status).toBe(404);
    expect(new RegExp(route?.src ?? "$^").test("/qualquer-coisa")).toBe(true);
  });

  it("nenhum arquivo público contém o nome nem o valor da chave do Resend", () => {
    const files = listFiles(STATIC);
    expect(files.length).toBeGreaterThan(0);
    const leaks = files.filter((file) => {
      const content = readFileSync(file, "latin1");
      return content.includes(SENTINEL) || content.includes("RESEND_API_KEY");
    });
    expect(leaks).toEqual([]);
  });
});

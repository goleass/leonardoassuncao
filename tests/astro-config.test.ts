import { afterEach, describe, expect, it, vi } from "vitest";
import { site } from "../src/config/site";

// O build carrega astro.config.mjs; se a validação lançar ali, o build falha (PAGE-09).
const loadConfig = () => import("../astro.config.mjs");

afterEach(() => {
  vi.doUnmock("../src/config/site.ts");
  vi.resetModules();
});

// Importar a configuração carrega o Astro e o adaptador; com cache frio passa de 5 s (o limite padrão).
describe("astro.config.mjs bloqueia o build com dados de exemplo (PAGE-09)", { timeout: 30_000 }, () => {
  it("com um campo entre colchetes, carregar a configuração falha nomeando o campo", async () => {
    vi.resetModules();
    vi.doMock("../src/config/site.ts", () => ({ site: { ...site, cnpj: "[00.000.000/0000-00]" } }));
    await expect(loadConfig()).rejects.toThrow("Configuração inválida: cnpj");
  });

  it("com um campo obrigatório vazio, carregar a configuração falha nomeando o campo", async () => {
    vi.resetModules();
    vi.doMock("../src/config/site.ts", () => ({ site: { ...site, email: "" } }));
    await expect(loadConfig()).rejects.toThrow("Configuração inválida: email");
  });

  it("com os dados reais, a configuração carrega e usa o domínio como site", async () => {
    vi.resetModules();
    const { default: config } = await loadConfig();
    expect(config.site).toBe("https://leonardoassuncao.com.br");
  });
});

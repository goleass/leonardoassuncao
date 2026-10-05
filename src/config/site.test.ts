import { describe, expect, it } from "vitest";
import { validateSiteConfig } from "./schema";
import { site } from "./site";

describe("site.ts: dados reais da empresa (PAGE-08, PAGE-09)", () => {
  it("passa no schema sem erro e mantém os valores", () => {
    expect(validateSiteConfig(site)).toEqual(site);
  });

  it("traz domínio, e-mail, WhatsApp, cidade/UF, CNPJ e prazo informados", () => {
    expect(site).toEqual({
      url: "https://www.leonardoassuncao.com.br",
      email: "contato@leonardoassuncao.com.br",
      whatsapp: "5551991419064",
      whatsappDisplay: "(51) 99141-9064",
      cidade: "Canoas, RS",
      cnpj: "44.053.654/0001-59",
      prazoResposta: "24 horas úteis",
      linkedin: "https://www.linkedin.com/in/leonardo-gomes-assuncao",
      projetos: [],
    });
  });

  it("tem o LinkedIn exato da spec (LD-12), mas sem projetos nem depoimento", () => {
    expect(site.linkedin).toBe("https://www.linkedin.com/in/leonardo-gomes-assuncao");
    expect(site.projetos).toEqual([]);
    expect(site).not.toHaveProperty("depoimento");
  });
});

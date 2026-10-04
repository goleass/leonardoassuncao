import { describe, expect, it } from "vitest";
import { buildWhatsAppUrl } from "./whatsapp";

const textOf = (url: string) => {
  const [, query] = url.split("?text=");
  return decodeURIComponent(query);
};

describe("buildWhatsAppUrl", () => {
  it("aponta para wa.me com o número configurado", () => {
    const url = buildWhatsAppUrl("5511999999999", { nome: "Ana", tipo: "Site" });
    expect(url.startsWith("https://wa.me/5511999999999?text=")).toBe(true);
  });

  it("texto decodificado é exatamente o da premissa", () => {
    const url = buildWhatsAppUrl("5511999999999", { nome: "Ana Souza", tipo: "Sistema web" });
    expect(textOf(url)).toBe(
      "Olá, Leonardo! Acabei de enviar uma mensagem pelo site sobre: Sistema web. Meu nome é Ana Souza.",
    );
  });

  it("codifica acentos, espaços e & com encodeURIComponent", () => {
    const url = buildWhatsAppUrl("5511999999999", { nome: "João & Cia", tipo: "Integração" });
    const query = url.split("?text=")[1];
    expect(query).toBe(
      "Ol%C3%A1%2C%20Leonardo!%20Acabei%20de%20enviar%20uma%20mensagem%20pelo%20site%20sobre%3A%20" +
        "Integra%C3%A7%C3%A3o.%20Meu%20nome%20%C3%A9%20Jo%C3%A3o%20%26%20Cia.",
    );
    expect(query).not.toMatch(/[ &]/);
  });
});

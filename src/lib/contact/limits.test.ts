import { describe, expect, it } from "vitest";
import { CONTACT_RATE_LIMIT, SEND_TIMEOUT_MS } from "./limits";

describe("limites do contato usados pelo endpoint", () => {
  it("permite 5 envios por IP numa janela de 60 minutos (FORM-11)", () => {
    expect(CONTACT_RATE_LIMIT).toEqual({ limit: 5, windowMs: 60 * 60 * 1000 });
  });

  it("espera o serviço de e-mail por no máximo 10 segundos (FORM-08)", () => {
    expect(SEND_TIMEOUT_MS).toBe(10_000);
  });
});

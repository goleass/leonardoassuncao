import { describe, expect, it } from "vitest";
import { contactFingerprint, createSentLog } from "./dedupe";

const TEN_MIN = 10 * 60 * 1000;
const data = { nome: "Ana", email: "ana@empresa.com.br", tipo: "Site" as const, mensagem: "Quero um site novo." };

describe("createSentLog", () => {
  it("lembra a chave até 1 ms antes de a janela expirar e a esquece depois", () => {
    let clock = 0;
    const log = createSentLog({ windowMs: TEN_MIN, now: () => clock });
    expect(log.has("a")).toBe(false);
    log.add("a");
    clock = TEN_MIN - 1;
    expect(log.has("a")).toBe(true);
    clock = TEN_MIN;
    expect(log.has("a")).toBe(false);
  });
});

describe("contactFingerprint", () => {
  it("é igual para a mesma mensagem, ignorando caixa do e-mail, e não contém os dados", () => {
    const key = contactFingerprint(data);
    expect(contactFingerprint({ ...data, email: "ANA@Empresa.com.br" })).toBe(key);
    expect(key).toMatch(/^[0-9a-f]{64}$/);
  });

  it("muda quando qualquer campo muda", () => {
    const key = contactFingerprint(data);
    for (const change of [{ nome: "Bia" }, { email: "b@b.com" }, { tipo: "Outro" as const }, { mensagem: "Outra coisa." }]) {
      expect(contactFingerprint({ ...data, ...change })).not.toBe(key);
    }
  });
});

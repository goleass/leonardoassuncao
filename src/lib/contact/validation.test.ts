import { describe, expect, it } from "vitest";
import { CONTACT_MESSAGES as M, PROJECT_TYPES, validateContact } from "./validation";

const valid = {
  nome: "Ana Souza",
  email: "ana@empresa.com.br",
  tipo: "Sistema web",
  mensagem: "Preciso de um sistema para controlar pedidos.",
};

const text = (n: number) => "a".repeat(n);
// E-mail com formato válido e exatamente `n` caracteres.
const emailOfLength = (n: number) => {
  const suffix = "@exemplo.com.br";
  return "a".repeat(n - suffix.length) + suffix;
};

function errorsFor(input: unknown) {
  const result = validateContact(input);
  if (result.ok) throw new Error("esperava falha de validação");
  return result.errors;
}

function dataFor(input: unknown) {
  const result = validateContact(input);
  if (!result.ok) throw new Error(`esperava sucesso: ${JSON.stringify(result.errors)}`);
  return result.data;
}

describe("validateContact", () => {
  it("dados válidos → ok com os mesmos valores", () => {
    expect(dataFor(valid)).toEqual(valid);
  });

  describe("nome (2–100, com trim)", () => {
    it("1 caractere → erro", () => {
      expect(errorsFor({ ...valid, nome: text(1) })).toEqual({ nome: M.nomeCurto });
    });
    it("2 caracteres → válido", () => {
      expect(dataFor({ ...valid, nome: text(2) }).nome).toBe(text(2));
    });
    it("100 caracteres → válido", () => {
      expect(dataFor({ ...valid, nome: text(100) }).nome).toBe(text(100));
    });
    it("101 caracteres → erro", () => {
      expect(errorsFor({ ...valid, nome: text(101) })).toEqual({ nome: M.nomeLongo });
    });
    it("espaços nas pontas são removidos antes de medir", () => {
      expect(errorsFor({ ...valid, nome: "   a   " })).toEqual({ nome: M.nomeCurto });
      expect(dataFor({ ...valid, nome: "  Ana  " }).nome).toBe("Ana");
    });
  });

  describe("e-mail (formato válido, até 254)", () => {
    it("254 caracteres → válido", () => {
      const email = emailOfLength(254);
      expect(email).toHaveLength(254);
      expect(dataFor({ ...valid, email }).email).toBe(email);
    });
    it("255 caracteres → erro de tamanho", () => {
      const email = emailOfLength(255);
      expect(email).toHaveLength(255);
      expect(errorsFor({ ...valid, email })).toEqual({ email: M.emailLongo });
    });
    it.each(["ana", "ana@", "@empresa.com", "ana empresa@x.com", "ana@empresa"])(
      "formato inválido %j → erro",
      (email) => {
        expect(errorsFor({ ...valid, email })).toEqual({ email: M.emailInvalido });
      },
    );
  });

  describe("tipo de projeto", () => {
    it("lista é exatamente Site, Sistema web, Integração, Outro", () => {
      expect(PROJECT_TYPES).toEqual(["Site", "Sistema web", "Integração", "Outro"]);
    });
    it.each(["Site", "Sistema web", "Integração", "Outro"])("%s → válido", (tipo) => {
      expect(dataFor({ ...valid, tipo }).tipo).toBe(tipo);
    });
    it("tipo fora da lista → erro", () => {
      expect(errorsFor({ ...valid, tipo: "Aplicativo" })).toEqual({ tipo: M.tipoInvalido });
    });
  });

  describe("mensagem (10–2000, com trim)", () => {
    it("9 caracteres → erro", () => {
      expect(errorsFor({ ...valid, mensagem: text(9) })).toEqual({ mensagem: M.mensagemCurta });
    });
    it("10 caracteres → válido", () => {
      expect(dataFor({ ...valid, mensagem: text(10) }).mensagem).toBe(text(10));
    });
    it("2000 caracteres → válido", () => {
      expect(dataFor({ ...valid, mensagem: text(2000) }).mensagem).toBe(text(2000));
    });
    it("2001 caracteres → 'A mensagem pode ter até 2000 caracteres.'", () => {
      expect(errorsFor({ ...valid, mensagem: text(2001) })).toEqual({
        mensagem: "A mensagem pode ter até 2000 caracteres.",
      });
    });
    it("espaços nas pontas são removidos antes de medir", () => {
      expect(errorsFor({ ...valid, mensagem: `   ${text(9)}   ` })).toEqual({ mensagem: M.mensagemCurta });
    });
  });

  it("campos ausentes → um erro por campo obrigatório", () => {
    expect(errorsFor({})).toEqual({
      nome: M.nomeCurto,
      email: M.emailInvalido,
      tipo: M.tipoInvalido,
      mensagem: M.mensagemCurta,
    });
  });

  it("vários campos inválidos → um erro em cada campo", () => {
    expect(errorsFor({ nome: "a", email: "x", tipo: "?", mensagem: "oi" })).toEqual({
      nome: M.nomeCurto,
      email: M.emailInvalido,
      tipo: M.tipoInvalido,
      mensagem: M.mensagemCurta,
    });
  });

  it("entrada que não é objeto → erro em todos os campos", () => {
    expect(Object.keys(errorsFor(null)).sort()).toEqual(["email", "mensagem", "nome", "tipo"]);
  });

  it("honeypot website é devolvido para o servidor decidir", () => {
    expect(dataFor({ ...valid, website: "http://spam.example" }).website).toBe("http://spam.example");
  });

  it("mensagens de erro em português", () => {
    expect(M).toEqual({
      nomeCurto: "Informe seu nome (mínimo de 2 caracteres).",
      nomeLongo: "O nome pode ter até 100 caracteres.",
      emailInvalido: "Informe um e-mail válido.",
      emailLongo: "O e-mail pode ter até 254 caracteres.",
      tipoInvalido: "Escolha o tipo de projeto.",
      mensagemCurta: "Conte um pouco mais sobre o projeto (mínimo de 10 caracteres).",
      mensagemLonga: "A mensagem pode ter até 2000 caracteres.",
    });
  });
});

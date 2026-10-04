import { beforeAll, describe, expect, it } from "vitest";
import { accessibleText, parseHtml, renderComponent } from "../../tests/render";
import { siteFixture } from "../../tests/fixtures/site";
import Contact from "./Contact.astro";

let doc: Document;

beforeAll(async () => {
  doc = parseHtml(await renderComponent(Contact, { site: siteFixture }));
});

const form = () => doc.querySelector("#contato form") as HTMLFormElement;
const field = (name: string) => form().querySelector(`[name="${name}"]`) as HTMLElement;
const labelOf = (el: Element) => doc.querySelector(`label[for="${el.id}"]`)?.textContent?.trim();

describe("Contact: campos e limites do formulário (FORM-04, A11Y-03)", () => {
  it("cada campo tem <label for> com o nome da spec e é obrigatório", () => {
    const fields = ["nome", "email", "tipo", "mensagem"].map((name) => {
      const el = field(name);
      return { name, label: el.id ? labelOf(el) : undefined, required: el.hasAttribute("required") };
    });
    expect(fields).toEqual([
      { name: "nome", label: "Nome", required: true },
      { name: "email", label: "E-mail", required: true },
      { name: "tipo", label: "Tipo de projeto", required: true },
      { name: "mensagem", label: "Sobre o projeto", required: true },
    ]);
  });

  it("limites: Nome 2–100, E-mail no formato e até 254, Sobre o projeto 10–2000", () => {
    const attrs = (name: string, ...keys: string[]) =>
      Object.fromEntries(keys.map((key) => [key, field(name).getAttribute(key)]));
    expect(attrs("nome", "minlength", "maxlength")).toEqual({ minlength: "2", maxlength: "100" });
    expect(attrs("email", "type", "maxlength")).toEqual({ type: "email", maxlength: "254" });
    expect(field("mensagem").tagName).toBe("TEXTAREA");
    expect(attrs("mensagem", "minlength", "maxlength")).toEqual({ minlength: "10", maxlength: "2000" });
  });

  it("tipo de projeto oferece exatamente Site, Sistema web, Integração e Outro", () => {
    const select = field("tipo");
    expect(select.tagName).toBe("SELECT");
    const options = [...select.querySelectorAll("option")].map((option) => ({
      value: option.getAttribute("value") ?? option.textContent?.trim(),
      text: option.textContent?.trim(),
    }));
    expect(options).toEqual([
      { value: "Site", text: "Site" },
      { value: "Sistema web", text: "Sistema web" },
      { value: "Integração", text: "Integração" },
      { value: "Outro", text: "Outro" },
    ]);
  });

  it("cada campo aponta por aria-describedby para o elemento onde o erro aparece", () => {
    for (const name of ["nome", "email", "tipo", "mensagem"]) {
      const describedBy = field(name).getAttribute("aria-describedby") ?? "";
      expect(describedBy, name).not.toBe("");
      expect(doc.getElementById(describedBy), name).not.toBeNull();
    }
  });

  it('o resultado do envio é anunciado numa região aria-live="polite" fora do formulário', () => {
    const live = doc.querySelector('#contato [aria-live="polite"]');
    expect(live).not.toBeNull();
    expect(form().contains(live)).toBe(false);
  });
});

describe("Contact: honeypot anti-spam (FORM-10)", () => {
  it("o campo website fica fora da tabulação, sem autocompletar e escondido de leitores de tela", () => {
    const honeypot = field("website") as HTMLInputElement;
    expect(honeypot).not.toBeNull();
    expect(honeypot.getAttribute("tabindex")).toBe("-1");
    expect(honeypot.getAttribute("autocomplete")).toBe("off");
    expect(honeypot.closest('[aria-hidden="true"]')).not.toBeNull();
  });
});

describe("Contact: dados de contato da configuração (PAGE-08)", () => {
  it("e-mail, WhatsApp e LinkedIn usam os valores da config", () => {
    const hrefs = [...doc.querySelectorAll("#contato a")].map((a) => a.getAttribute("href"));
    expect(hrefs).toContain("mailto:contato@exemplo.com.br");
    expect(hrefs).toContain("https://wa.me/5511900000000");
    expect(hrefs).toContain("https://www.linkedin.com/in/exemplo");
    expect(doc.querySelector('#contato a[href^="mailto:"]')?.textContent?.trim()).toBe("contato@exemplo.com.br");
  });

  it("mostra o prazo de resposta configurado", () => {
    expect(accessibleText(doc.getElementById("contato")!)).toContain("Respondo pessoalmente em até 24 horas úteis.");
  });
});

describe("Contact: link da política de privacidade junto ao envio (LEGAL-02)", () => {
  it('o formulário tem o botão "Enviar mensagem" e um link para /privacidade', () => {
    const button = form().querySelector('button[type="submit"]');
    expect(button && accessibleText(button)).toBe("Enviar mensagem");
    expect(form().querySelector('a[href="/privacidade"]')).not.toBeNull();
  });
});

describe("Contact: título da seção (A11Y-05)", () => {
  it('tem um <h2> "Vamos construir?" em id="contato"', () => {
    const h2 = doc.querySelector("section#contato h2");
    expect(h2 && accessibleText(h2)).toBe("Vamos construir?");
  });
});

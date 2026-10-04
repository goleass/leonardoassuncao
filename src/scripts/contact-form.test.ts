// @vitest-environment happy-dom
import { beforeEach, describe, expect, it, vi } from "vitest";
import { initContactForm } from "./contact-form";

// Mesmo contrato da seção Contato (T22): ids, names, ids de erro e região aria-live fora do formulário.
// (A Container API do Astro não renderiza no ambiente happy-dom.)
const markup = `
  <section id="contato">
    <div class="contact__panel">
      <form class="contact-form" action="/api/contato" method="post">
        <label for="nome">Nome</label>
        <input id="nome" name="nome" type="text" required minlength="2" maxlength="100" aria-describedby="nome-erro" />
        <p id="nome-erro"></p>
        <label for="email">E-mail</label>
        <input id="email" name="email" type="email" required maxlength="254" aria-describedby="email-erro" />
        <p id="email-erro"></p>
        <label for="tipo">Tipo de projeto</label>
        <select id="tipo" name="tipo" required aria-describedby="tipo-erro">
          <option value="Site">Site</option><option value="Sistema web">Sistema web</option>
          <option value="Integração">Integração</option><option value="Outro">Outro</option>
        </select>
        <p id="tipo-erro"></p>
        <label for="mensagem">Sobre o projeto</label>
        <textarea id="mensagem" name="mensagem" required minlength="10" maxlength="2000" aria-describedby="mensagem-erro"></textarea>
        <p id="mensagem-erro"></p>
        <div aria-hidden="true"><input id="website" name="website" type="text" tabindex="-1" autocomplete="off" /></div>
        <button type="submit"><span class="contact-form__label">Enviar mensagem</span><svg aria-hidden="true"></svg></button>
        <p>Veja a <a href="/privacidade">política de privacidade</a>.</p>
      </form>
      <div class="contact-status" role="status" aria-live="polite"></div>
    </div>
  </section>`;

let form: HTMLFormElement;
let fetchMock: ReturnType<typeof vi.fn>;

const status = () => document.querySelector('#contato [aria-live="polite"]') as HTMLElement;
const statusText = () => status().textContent?.replace(/\s+/g, " ").trim();
const statusLinks = () => [...status().querySelectorAll("a")].map((a) => ({ text: a.textContent?.trim(), href: a.getAttribute("href") }));
const button = () => form.querySelector('button[type="submit"]') as HTMLButtonElement;
const buttonText = () => button().textContent?.replace(/\s+/g, " ").trim();
const errorOf = (field: string) => document.getElementById(`${field}-erro`)?.textContent?.trim();
const control = (name: string) => form.elements.namedItem(name) as HTMLInputElement;
const flush = async () => {
  for (let i = 0; i < 5; i++) await new Promise((resolve) => setTimeout(resolve, 0));
};
const submit = () => form.dispatchEvent(new Event("submit", { bubbles: true, cancelable: true }));
const reply = (status: number, body: unknown) => Promise.resolve(new Response(JSON.stringify(body), { status }));

function fill(values: Partial<Record<"nome" | "email" | "tipo" | "mensagem", string>> = {}) {
  const data = { nome: "Ana Lima", email: "ana@empresa.com.br", tipo: "Sistema web", mensagem: "Preciso de um portal para clientes.", ...values };
  for (const [name, value] of Object.entries(data)) control(name).value = value;
}

beforeEach(() => {
  document.body.innerHTML = markup;
  form = document.querySelector("#contato form") as HTMLFormElement;
  fetchMock = vi.fn();
  initContactForm(form, {
    fetch: fetchMock as unknown as typeof fetch,
    whatsappPhone: "5511900000000",
    email: "contato@exemplo.com.br",
    responseTime: "24 horas úteis",
  });
});

describe("initContactForm: validação no navegador (FORM-05, EDGE-02)", () => {
  it("campos inválidos mostram o erro em português abaixo de cada campo e nada é enviado", async () => {
    fill({ nome: "A", email: "ana@", mensagem: "curta" });
    submit();
    await flush();
    expect(errorOf("nome")).toBe("Informe seu nome (mínimo de 2 caracteres).");
    expect(errorOf("email")).toBe("Informe um e-mail válido.");
    expect(errorOf("mensagem")).toBe("Conte um pouco mais sobre o projeto (mínimo de 10 caracteres).");
    expect(control("nome").getAttribute("aria-invalid")).toBe("true");
    expect(fetchMock).not.toHaveBeenCalled();
  });

  it('mensagem com 2001 caracteres mostra "A mensagem pode ter até 2000 caracteres." e não envia', async () => {
    fill({ mensagem: "a".repeat(2001) });
    submit();
    await flush();
    expect(errorOf("mensagem")).toBe("A mensagem pode ter até 2000 caracteres.");
    expect(fetchMock).not.toHaveBeenCalled();
  });
});

describe("initContactForm: envio (FORM-07, EDGE-01)", () => {
  it("envia uma requisição POST JSON para /api/contato com os campos e o honeypot", async () => {
    fetchMock.mockReturnValue(reply(200, { ok: true }));
    fill();
    submit();
    await flush();
    expect(fetchMock).toHaveBeenCalledTimes(1);
    const [url, init] = fetchMock.mock.calls[0] as [string, RequestInit];
    expect(url).toBe("/api/contato");
    expect(init.method).toBe("POST");
    expect(JSON.parse(String(init.body))).toEqual({
      nome: "Ana Lima",
      email: "ana@empresa.com.br",
      tipo: "Sistema web",
      mensagem: "Preciso de um portal para clientes.",
      website: "",
    });
  });

  it('enquanto envia, o botão fica desabilitado com o texto "Enviando…"', async () => {
    fetchMock.mockReturnValue(new Promise(() => {}));
    fill();
    submit();
    await flush();
    expect(button().disabled).toBe(true);
    expect(buttonText()).toBe("Enviando…");
  });

  it("dois envios seguidos geram uma única requisição", async () => {
    fetchMock.mockReturnValue(new Promise(() => {}));
    fill();
    submit();
    submit();
    await flush();
    expect(fetchMock).toHaveBeenCalledTimes(1);
  });
});

describe("initContactForm: sucesso (FORM-02, FORM-03)", () => {
  it("substitui o formulário pela confirmação com o prazo e o botão Continuar no WhatsApp", async () => {
    fetchMock.mockReturnValue(reply(200, { ok: true }));
    fill();
    submit();
    await flush();
    expect(form.hidden).toBe(true);
    expect(statusText()).toContain("Mensagem enviada! Respondo pessoalmente em até 24 horas úteis.");
    const text = "Olá, Leonardo! Acabei de enviar uma mensagem pelo site sobre: Sistema web. Meu nome é Ana Lima.";
    expect(statusLinks()).toEqual([
      { text: "Continuar no WhatsApp", href: `https://wa.me/5511900000000?text=${encodeURIComponent(text)}` },
    ]);
  });
});

describe("initContactForm: erros do servidor", () => {
  it("400 mostra as mensagens do servidor abaixo dos campos e mantém o formulário (FORM-06)", async () => {
    fetchMock.mockReturnValue(reply(400, { ok: false, errors: { email: "Informe um e-mail válido." } }));
    fill();
    submit();
    await flush();
    expect(errorOf("email")).toBe("Informe um e-mail válido.");
    expect(form.hidden).toBe(false);
    expect(button().disabled).toBe(false);
  });

  it("429 mostra a mensagem de limite com o link do WhatsApp (FORM-12)", async () => {
    fetchMock.mockReturnValue(reply(429, { ok: false, code: "rate_limited" }));
    fill();
    submit();
    await flush();
    expect(statusText()).toContain("Muitas tentativas. Tente novamente mais tarde ou chame no WhatsApp.");
    expect(statusLinks().map((link) => link.href)).toContain("https://wa.me/5511900000000");
    expect(form.hidden).toBe(false);
  });

  it("502 mostra o plano B com WhatsApp e e-mail e mantém os dados digitados (FORM-09)", async () => {
    fetchMock.mockReturnValue(reply(502, { ok: false, code: "send_failed" }));
    fill();
    submit();
    await flush();
    expect(statusText()).toContain("Não foi possível enviar agora.");
    const hrefs = statusLinks().map((link) => link.href);
    expect(hrefs).toContain("https://wa.me/5511900000000");
    expect(hrefs).toContain("mailto:contato@exemplo.com.br");
    expect(form.hidden).toBe(false);
    expect(control("nome").value).toBe("Ana Lima");
    expect(control("mensagem").value).toBe("Preciso de um portal para clientes.");
    expect(button().disabled).toBe(false);
    expect(buttonText()).toBe("Enviar mensagem");
  });

  it("falha de rede leva ao mesmo plano B, com os dados mantidos (FORM-09)", async () => {
    fetchMock.mockReturnValue(Promise.reject(new TypeError("Failed to fetch")));
    fill();
    submit();
    await flush();
    expect(statusText()).toContain("Não foi possível enviar agora.");
    const hrefs = statusLinks().map((link) => link.href);
    expect(hrefs).toContain("https://wa.me/5511900000000");
    expect(hrefs).toContain("mailto:contato@exemplo.com.br");
    expect(control("email").value).toBe("ana@empresa.com.br");
    expect(button().disabled).toBe(false);
  });

  it("depois de uma falha, um novo envio é possível", async () => {
    fetchMock.mockReturnValueOnce(reply(502, { ok: false, code: "send_failed" })).mockReturnValueOnce(reply(200, { ok: true }));
    fill();
    submit();
    await flush();
    submit();
    await flush();
    expect(fetchMock).toHaveBeenCalledTimes(2);
    expect(statusText()).toContain("Mensagem enviada!");
    expect(statusText()).not.toContain("Não foi possível enviar agora.");
  });
});

import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

// Testa o endpoint real (/api/contato) com o Resend e as variáveis de ambiente substituídos.
const send = vi.fn();

vi.mock("astro:env/server", () => ({
  RESEND_API_KEY: "re_teste",
  CONTACT_TO: "contato@leonardoassuncao.com.br",
  CONTACT_FROM: "Site <site@leonardoassuncao.com.br>",
}));

vi.mock("resend", () => ({
  Resend: class {
    emails = { send };
  },
}));

const valid = { nome: "Ana Lima", email: "ana@empresa.com.br", tipo: "Sistema web", mensagem: "Preciso de um portal para clientes.", website: "" };

async function loadPost() {
  vi.resetModules();
  const { POST } = await import("./contato");
  return (ip = "203.0.113.7") =>
    POST({
      request: new Request("https://leonardoassuncao.com.br/api/contato", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify(valid),
      }),
      clientAddress: ip,
    } as never) as Promise<Response>;
}

beforeEach(() => {
  send.mockReset();
  send.mockResolvedValue({ data: { id: "1" }, error: null });
  vi.spyOn(console, "error").mockImplementation(() => {});
});

afterEach(() => {
  vi.useRealTimers();
  vi.restoreAllMocks();
});

describe("POST /api/contato", () => {
  it("o mesmo IP consegue 5 envios e o 6º recebe 429 sem enviar e-mail (FORM-11)", async () => {
    const post = await loadPost();
    const statuses: number[] = [];
    for (let i = 0; i < 6; i++) statuses.push((await post()).status);
    expect(statuses).toEqual([200, 200, 200, 200, 200, 429]);
    expect(send).toHaveBeenCalledTimes(5);
  });

  it("outro IP não é afetado pelo limite do primeiro (FORM-11)", async () => {
    const post = await loadPost();
    for (let i = 0; i < 5; i++) await post("203.0.113.7");
    expect((await post("198.51.100.9")).status).toBe(200);
  });

  it("envia para o destino configurado com o visitante em Responder para (FORM-01)", async () => {
    const post = await loadPost();
    await post();
    const mail = send.mock.calls[0][0];
    expect(mail.to).toBe("contato@leonardoassuncao.com.br");
    expect(mail.from).toBe("Site <site@leonardoassuncao.com.br>");
    expect(mail.replyTo).toBe("ana@empresa.com.br");
  });

  it("se o serviço de e-mail não responder, devolve 502 aos 10 segundos e não antes (FORM-08)", async () => {
    vi.useFakeTimers();
    send.mockImplementation(() => new Promise(() => {}));
    const post = await loadPost();
    let response: Response | undefined;
    const pending = post().then((r) => (response = r));
    await vi.advanceTimersByTimeAsync(9_999);
    expect(response).toBeUndefined();
    await vi.advanceTimersByTimeAsync(1);
    await pending;
    expect(response?.status).toBe(502);
    expect(await response?.json()).toEqual({ ok: false, code: "send_failed" });
  });

  it("se o Resend devolver erro, responde 502 (FORM-08)", async () => {
    send.mockResolvedValue({ data: null, error: { name: "validation_error", message: "x" } });
    const post = await loadPost();
    expect((await post()).status).toBe(502);
  });
});

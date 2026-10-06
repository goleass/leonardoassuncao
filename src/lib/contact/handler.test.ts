import { afterEach, describe, expect, it, vi } from "vitest";
import { handleContact, type ContactDeps, type OutgoingMail } from "./handler";
import { createSentLog } from "./dedupe";
import { createRateLimiter } from "./rate-limit";
import { CONTACT_MESSAGES as M } from "./validation";

const valid = {
  nome: "Ana Souza",
  email: "ana@empresa.com.br",
  tipo: "Site",
  mensagem: "Quero um site novo para a clínica.",
};

function post(body: unknown, raw = false) {
  return new Request("https://site.test/api/contato", {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: raw ? String(body) : JSON.stringify(body),
  });
}

function makeDeps(overrides: Partial<ContactDeps> = {}) {
  const sent: OutgoingMail[] = [];
  const logs: Array<{ at: string; code: string }> = [];
  const deps: ContactDeps = {
    send: vi.fn(async (mail: OutgoingMail) => {
      sent.push(mail);
    }),
    limiter: createRateLimiter({ limit: 5, windowMs: 3_600_000 }),
    sentLog: createSentLog({ windowMs: 600_000 }),
    to: "leonardo@empresa.com.br",
    from: "Site <site@empresa.com.br>",
    timeoutMs: 10_000,
    log: (entry) => logs.push(entry),
    clientIp: "203.0.113.7",
    ...overrides,
  };
  return { deps, sent, logs };
}

// Mensagens diferentes, para os testes de limite não esbarrarem na deduplicação.
const nth = (i: number) => ({ ...valid, mensagem: `${valid.mensagem} (${i})` });

async function json(res: Response) {
  return { status: res.status, body: await res.json() };
}

afterEach(() => {
  vi.useRealTimers();
});

describe("handleContact", () => {
  it("dados válidos → 200 { ok: true } e envia o e-mail", async () => {
    const { deps, sent } = makeDeps();
    expect(await json(await handleContact(post(valid), deps))).toEqual({ status: 200, body: { ok: true } });
    expect(sent).toHaveLength(1);
  });

  it("e-mail vai para o endereço configurado, com nome, e-mail, tipo, mensagem e Responder para do visitante", async () => {
    const { deps, sent } = makeDeps();
    await handleContact(post(valid), deps);
    const mail = sent[0];
    expect(mail.to).toBe("leonardo@empresa.com.br");
    expect(mail.from).toBe("Site <site@empresa.com.br>");
    expect(mail.replyTo).toBe("ana@empresa.com.br");
    expect(mail.subject).toBe("Novo contato pelo site: Site — Ana Souza");
    for (const value of [valid.nome, valid.email, valid.tipo, valid.mensagem]) {
      expect(mail.text).toContain(value);
      expect(mail.html).toContain(value);
    }
  });

  it("campo inválido → 400 com a lista de campos inválidos e sem envio", async () => {
    const { deps } = makeDeps();
    const res = await json(await handleContact(post({ ...valid, nome: "A", mensagem: "curta" }), deps));
    expect(res).toEqual({
      status: 400,
      body: { ok: false, errors: { nome: M.nomeCurto, mensagem: M.mensagemCurta } },
    });
    expect(deps.send).not.toHaveBeenCalled();
  });

  it("JSON malformado → 400 { ok: false, errors: {} } e sem envio", async () => {
    const { deps } = makeDeps();
    expect(await json(await handleContact(post("{nome:", true), deps))).toEqual({
      status: 400,
      body: { ok: false, errors: {} },
    });
    expect(deps.send).not.toHaveBeenCalled();
  });

  it("honeypot preenchido → 200 { ok: true } sem envio", async () => {
    const { deps } = makeDeps();
    expect(await json(await handleContact(post({ ...valid, website: "http://spam.example" }), deps))).toEqual({
      status: 200,
      body: { ok: true },
    });
    expect(deps.send).not.toHaveBeenCalled();
  });

  it("6º envio do mesmo IP em 60 min → 429 { ok: false, code: 'rate_limited' } sem envio", async () => {
    const { deps, sent } = makeDeps();
    const statuses: number[] = [];
    for (let i = 0; i < 6; i++) statuses.push((await handleContact(post(nth(i)), deps)).status);
    expect(statuses).toEqual([200, 200, 200, 200, 200, 429]);
    expect(sent).toHaveLength(5);
    expect(await json(await handleContact(post(nth(6)), deps))).toEqual({
      status: 429,
      body: { ok: false, code: "rate_limited" },
    });
    expect(sent).toHaveLength(5);
  });

  it("o limite é contado pelo IP do cliente", async () => {
    const limiter = createRateLimiter({ limit: 5, windowMs: 3_600_000 });
    const a = makeDeps({ limiter, clientIp: "198.51.100.1" });
    for (let i = 0; i < 5; i++) await handleContact(post(nth(i)), a.deps);
    expect((await handleContact(post(nth(5)), a.deps)).status).toBe(429);
    const b = makeDeps({ limiter, clientIp: "198.51.100.2" });
    expect((await handleContact(post(valid), b.deps)).status).toBe(200);
  });

  it("mensagem idêntica já enviada → 200 { ok: true } sem novo e-mail e sem gastar o limite", async () => {
    const { deps, sent } = makeDeps({ limiter: createRateLimiter({ limit: 1, windowMs: 3_600_000 }) });
    expect((await handleContact(post(valid), deps)).status).toBe(200);
    expect(await json(await handleContact(post(valid), deps))).toEqual({ status: 200, body: { ok: true } });
    expect(sent).toHaveLength(1);
  });

  it("mensagem diferente do mesmo visitante é enviada normalmente", async () => {
    const { deps, sent } = makeDeps();
    await handleContact(post(valid), deps);
    await handleContact(post(nth(1)), deps);
    expect(sent).toHaveLength(2);
  });

  it("depois de falha no envio, a mesma mensagem pode ser reenviada", async () => {
    const send = vi.fn().mockRejectedValueOnce(new Error("boom")).mockResolvedValueOnce(undefined);
    const { deps } = makeDeps({ send });
    expect((await handleContact(post(valid), deps)).status).toBe(502);
    expect((await handleContact(post(valid), deps)).status).toBe(200);
    expect(send).toHaveBeenCalledTimes(2);
  });

  it("falha do serviço de e-mail → 502 { ok: false, code: 'send_failed' }", async () => {
    const { deps } = makeDeps({ send: vi.fn().mockRejectedValue(new Error("boom")) });
    expect(await json(await handleContact(post(valid), deps))).toEqual({
      status: 502,
      body: { ok: false, code: "send_failed" },
    });
  });

  it("serviço de e-mail sem resposta por 10 s → 502", async () => {
    vi.useFakeTimers();
    const { deps } = makeDeps({ send: vi.fn(() => new Promise<void>(() => {})) });
    let settled: Response | undefined;
    const pending = handleContact(post(valid), deps).then((res) => (settled = res));
    await vi.advanceTimersByTimeAsync(9_999);
    expect(settled).toBeUndefined();
    await vi.advanceTimersByTimeAsync(1);
    await pending;
    expect(settled?.status).toBe(502);
    expect(await settled?.json()).toEqual({ ok: false, code: "send_failed" });
  });

  it("falha registra data/hora e código, sem nome, e-mail nem mensagem", async () => {
    vi.useFakeTimers({ now: new Date("2026-10-04T12:00:00.000Z") });
    const { deps, logs } = makeDeps({ send: vi.fn().mockRejectedValue(new Error(`falhou para ${valid.email}`)) });
    await handleContact(post(valid), deps);
    expect(logs).toEqual([{ at: "2026-10-04T12:00:00.000Z", code: "send_failed" }]);
    const logged = JSON.stringify(logs);
    for (const personal of [valid.nome, valid.email, valid.mensagem]) expect(logged).not.toContain(personal);
  });

  it("timeout registra código próprio no log", async () => {
    vi.useFakeTimers({ now: new Date("2026-10-04T12:00:00.000Z") });
    const { deps, logs } = makeDeps({ send: vi.fn(() => new Promise<void>(() => {})) });
    const pending = handleContact(post(valid), deps);
    await vi.advanceTimersByTimeAsync(10_000);
    await pending;
    expect(logs).toEqual([{ at: "2026-10-04T12:00:10.000Z", code: "send_timeout" }]);
  });

  it("respostas são JSON", async () => {
    const { deps } = makeDeps();
    expect((await handleContact(post(valid), deps)).headers.get("content-type")).toBe(
      "application/json; charset=utf-8",
    );
  });
});

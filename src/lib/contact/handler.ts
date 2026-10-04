import { renderContactEmail } from "./email";
import type { RateLimiter } from "./rate-limit";
import { validateContact } from "./validation";

export interface OutgoingMail {
  from: string;
  to: string;
  replyTo: string;
  subject: string;
  text: string;
  html: string;
}

export interface ContactDeps {
  send(mail: OutgoingMail): Promise<void>;
  limiter: RateLimiter;
  to: string;
  from: string;
  timeoutMs: number;
  log(entry: { at: string; code: string }): void;
  clientIp: string;
}

const reply = (status: number, body: unknown) =>
  new Response(JSON.stringify(body), {
    status,
    headers: { "content-type": "application/json; charset=utf-8" },
  });

class SendTimeout extends Error {}

function withTimeout(promise: Promise<void>, ms: number): Promise<void> {
  let timer: ReturnType<typeof setTimeout> | undefined;
  const timeout = new Promise<never>((_, reject) => {
    timer = setTimeout(() => reject(new SendTimeout()), ms);
  });
  return Promise.race([promise, timeout]).finally(() => clearTimeout(timer));
}

// Nada é gravado: a mensagem só existe na memória desta requisição e no e-mail enviado (FORM-13).
export async function handleContact(request: Request, deps: ContactDeps): Promise<Response> {
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return reply(400, { ok: false, errors: {} });
  }

  const website = (body as { website?: unknown } | null)?.website;
  if (typeof website === "string" && website.trim() !== "") return reply(200, { ok: true });

  const result = validateContact(body);
  if (!result.ok) return reply(400, { ok: false, errors: result.errors });

  if (!deps.limiter.hit(deps.clientIp)) return reply(429, { ok: false, code: "rate_limited" });

  const { subject, text, html } = renderContactEmail(result.data);
  try {
    await withTimeout(
      deps.send({ from: deps.from, to: deps.to, replyTo: result.data.email, subject, text, html }),
      deps.timeoutMs,
    );
  } catch (error) {
    // Só data/hora e código: nenhum dado do visitante vai para o log (FORM-15).
    deps.log({ at: new Date().toISOString(), code: error instanceof SendTimeout ? "send_timeout" : "send_failed" });
    return reply(502, { ok: false, code: "send_failed" });
  }
  return reply(200, { ok: true });
}

import { createHash } from "node:crypto";
import type { ContactInput } from "./validation";

export interface SentLog {
  /** `true` = a mesma mensagem já foi enviada dentro da janela. */
  has(key: string): boolean;
  add(key: string): void;
}

export function createSentLog(opts: { windowMs: number; now?: () => number }): SentLog {
  const { windowMs, now = Date.now } = opts;
  const sent = new Map<string, number>();

  return {
    has(key) {
      const t = now();
      for (const [k, at] of sent) if (t - at >= windowMs) sent.delete(k);
      return sent.has(key);
    },
    add(key) {
      sent.set(key, now());
    },
  };
}

// Só o hash fica na memória, nunca o conteúdo da mensagem (FORM-13).
export function contactFingerprint({ nome, email, tipo, mensagem }: ContactInput): string {
  return createHash("sha256")
    .update(JSON.stringify([nome, email.toLowerCase(), tipo, mensagem]))
    .digest("hex");
}

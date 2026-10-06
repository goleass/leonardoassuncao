// Valores da spec: 5 envios por IP a cada 60 minutos (FORM-11) e 10 s de espera pelo e-mail (FORM-08).
export const CONTACT_RATE_LIMIT = { limit: 5, windowMs: 60 * 60 * 1000 } as const;
export const SEND_TIMEOUT_MS = 10_000;
// Mensagem idêntica dentro desta janela não gera um segundo e-mail.
export const DUPLICATE_WINDOW_MS = 10 * 60 * 1000;

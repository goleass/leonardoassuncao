import { z } from "zod";

// Sem compilação via `Function`: com a CSP sem 'unsafe-eval', a sonda do zod já gera uma violação (CSP-04).
z.config({ jitless: true });

export const PROJECT_TYPES = ["Site", "Sistema web", "Integração", "Outro"] as const;
export type ProjectType = (typeof PROJECT_TYPES)[number];
export type ContactField = "nome" | "email" | "tipo" | "mensagem";

export const CONTACT_MESSAGES = {
  nomeCurto: "Informe seu nome (mínimo de 2 caracteres).",
  nomeLongo: "O nome pode ter até 100 caracteres.",
  emailInvalido: "Informe um e-mail válido.",
  emailLongo: "O e-mail pode ter até 254 caracteres.",
  tipoInvalido: "Escolha o tipo de projeto.",
  mensagemCurta: "Conte um pouco mais sobre o projeto (mínimo de 10 caracteres).",
  mensagemLonga: "A mensagem pode ter até 2000 caracteres.",
} as const;

const M = CONTACT_MESSAGES;

const contactSchema = z.object({
  nome: z.string({ error: M.nomeCurto }).trim().min(2, M.nomeCurto).max(100, M.nomeLongo),
  email: z
    .string({ error: M.emailInvalido })
    .trim()
    .max(254, M.emailLongo)
    .pipe(z.email(M.emailInvalido)),
  tipo: z.enum(PROJECT_TYPES, { error: M.tipoInvalido }),
  mensagem: z.string({ error: M.mensagemCurta }).trim().min(10, M.mensagemCurta).max(2000, M.mensagemLonga),
  // Honeypot: pessoas não veem o campo; o servidor descarta envios que o preenchem.
  website: z.string().optional(),
});

export type ContactInput = z.infer<typeof contactSchema>;

export type ContactValidation =
  | { ok: true; data: ContactInput }
  | { ok: false; errors: Partial<Record<ContactField, string>> };

export function validateContact(input: unknown): ContactValidation {
  const result = contactSchema.safeParse(typeof input === "object" && input !== null ? input : {});
  if (result.success) return { ok: true, data: result.data };
  const errors: Partial<Record<ContactField, string>> = {};
  for (const issue of result.error.issues) {
    const field = issue.path[0] as ContactField;
    errors[field] ??= issue.message;
  }
  return { ok: false, errors };
}

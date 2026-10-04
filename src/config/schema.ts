import { z } from "zod";

const PLACEHOLDER = /\[[^\]]*\]/;

/** Texto obrigatório: não pode ficar vazio nem conter um marcador como "[SEU_NUMERO]". */
const required = z
  .string({ error: "está ausente" })
  .trim()
  .min(1, "está vazio")
  .refine((value) => !PLACEHOLDER.test(value), "contém texto entre colchetes");

export const siteSchema = z.object({
  url: required,
  email: required,
  whatsapp: required,
  whatsappDisplay: required,
  linkedin: required,
  cidade: required,
  cnpj: required,
  prazoResposta: required,
  projetos: z.array(
    z.object({
      nome: required,
      categoria: required,
      ano: required,
      descricao: required,
      imagem: required,
      alt: required,
    }),
  ),
  depoimento: z
    .object({
      texto: required,
      autor: required,
      cargo: required,
      empresa: required,
    })
    .optional(),
});

export type SiteConfig = z.infer<typeof siteSchema>;

export function validateSiteConfig(input: unknown): SiteConfig {
  const result = siteSchema.safeParse(input);
  if (result.success) return result.data;
  const problems = result.error.issues.map((issue) => `${issue.path.join(".")} ${issue.message}`);
  throw new Error(`Configuração inválida: ${problems.join("; ")}`);
}

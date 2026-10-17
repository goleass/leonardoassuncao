// Frontmatter dos guias (COL-02). Puro: importado pelo src/content.config.ts e pelos testes.
import { z } from "astro/zod";
import { services } from "../../data/services";

const slugs = services.map((s) => s.slug) as [string, ...string[]];

export const guideSchema = z
  .object({
    // Faixa que o Google mostra sem cortar (COL-04).
    title: z.string().min(30).max(60),
    description: z.string().min(70).max(160),
    h1: z.string().min(1),
    resumo: z.string().min(1),
    // Só os 5 serviços de src/data/services.ts (COL-03).
    servico: z.enum(slugs),
    publishedAt: z.coerce.date(),
    updatedAt: z.coerce.date().optional(),
    faq: z.array(z.object({ q: z.string().min(1), a: z.string().min(1) })).default([]),
    draft: z.boolean().default(false),
  })
  // Atualização nunca antes da publicação (COL-06).
  .refine((g) => !g.updatedAt || g.updatedAt >= g.publishedAt, {
    message: "updatedAt anterior a publishedAt",
    path: ["updatedAt"],
  });

export type GuideData = z.infer<typeof guideSchema>;

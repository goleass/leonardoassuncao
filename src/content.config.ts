import { defineCollection } from "astro:content";
import { glob } from "astro/loaders";
import { guideSchema } from "./lib/guias/schema";

// Um arquivo Markdown por guia; o id é o nome cru do arquivo, para o slug ser validado como está (COL-01, COL-05).
const guias = defineCollection({
  loader: glob({
    pattern: "**/*.md",
    base: "./src/content/guias",
    generateId: ({ entry }) => entry.replace(/\.md$/, ""),
  }),
  schema: guideSchema,
});

export const collections = { guias };

/// <reference types="vitest/config" />
import { getViteConfig } from "astro/config";

export default getViteConfig(
  {
    test: {
      include: ["src/**/*.test.ts", "tests/**/*.test.ts"],
    },
  },
  // Sem a barra de dev, o HTML renderizado nos testes não recebe atributos data-astro-source-*.
  { devToolbar: { enabled: false } },
);

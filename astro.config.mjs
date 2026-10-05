// @ts-check
import { defineConfig, envField } from "astro/config";
import netlify from "@astrojs/netlify";
import sitemap from "@astrojs/sitemap";
import { validateSiteConfig } from "./src/config/schema.ts";
import { site } from "./src/config/site.ts";
import { withLastmod } from "./src/lib/seo/lastmod.ts";

// Falha o build se algum dado obrigatório estiver vazio ou com marcador "[...]" (PAGE-09).
validateSiteConfig(site);

export default defineConfig({
  site: site.url,
  adapter: netlify(),
  // <lastmod> = data do último commit nas fontes de cada página; omitido sem histórico git (SMAP-01/02).
  integrations: [sitemap({ serialize: (item) => withLastmod(item) })],
  // Sem folhas de estilo externas bloqueando a primeira pintura (PERF-01).
  build: { inlineStylesheets: "always" },
  // Scripts do Astro saem como arquivo em /_astro/, nunca inline: a CSP usa script-src 'self' (CSP-03, AD-005).
  vite: { build: { assetsInlineLimit: 0 } },
  env: {
    schema: {
      // Lidas só em tempo de execução, no servidor: nunca entram no build nem no navegador (FORM-14).
      RESEND_API_KEY: envField.string({ context: "server", access: "secret" }),
      CONTACT_TO: envField.string({ context: "server", access: "secret" }),
      CONTACT_FROM: envField.string({ context: "server", access: "secret" }),
    },
  },
});

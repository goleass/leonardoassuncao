// @ts-check
import { defineConfig, envField } from "astro/config";
import netlify from "@astrojs/netlify";
import sitemap from "@astrojs/sitemap";
import { validateSiteConfig } from "./src/config/schema.ts";
import { site } from "./src/config/site.ts";

// Falha o build se algum dado obrigatório estiver vazio ou com marcador "[...]" (PAGE-09).
validateSiteConfig(site);

export default defineConfig({
  site: site.url,
  adapter: netlify(),
  integrations: [sitemap()],
  env: {
    schema: {
      // Lidas só em tempo de execução, no servidor: nunca entram no build nem no navegador (FORM-14).
      RESEND_API_KEY: envField.string({ context: "server", access: "secret" }),
      CONTACT_TO: envField.string({ context: "server", access: "secret" }),
      CONTACT_FROM: envField.string({ context: "server", access: "secret" }),
    },
  },
});

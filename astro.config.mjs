// @ts-check
import { defineConfig, envField } from "astro/config";
import vercel from "@astrojs/vercel";

export default defineConfig({
  adapter: vercel(),
  env: {
    schema: {
      // Lidas só em tempo de execução, no servidor: nunca entram no build nem no navegador (FORM-14).
      RESEND_API_KEY: envField.string({ context: "server", access: "secret" }),
      CONTACT_TO: envField.string({ context: "server", access: "secret" }),
      CONTACT_FROM: envField.string({ context: "server", access: "secret" }),
    },
  },
});

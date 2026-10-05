import { defineMiddleware } from "astro:middleware";
import { withSecurityHeaders } from "./lib/security/headers";

// Respostas da função da Netlify (404 e /api/contato) não recebem os [[headers]] do netlify.toml.
export const onRequest = defineMiddleware(async (_context, next) => withSecurityHeaders(await next()));

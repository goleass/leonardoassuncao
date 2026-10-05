import type { APIRoute } from "astro";
import { site } from "../config/site";

// Crawlers de IA liberados de forma explícita, de treino e de busca (BOT-01).
export const AI_BOTS = [
  "GPTBot",
  "OAI-SearchBot",
  "ChatGPT-User",
  "ClaudeBot",
  "Claude-User",
  "Claude-SearchBot",
  "PerplexityBot",
  "Perplexity-User",
  "Google-Extended",
];

const group = (agent: string) => [`User-agent: ${agent}`, "Allow: /", "Disallow: /api/", ""];

// Gerado da configuração para o sitemap acompanhar o host canônico (HOST-03).
export const GET: APIRoute = () =>
  new Response(
    [...group("*"), ...AI_BOTS.flatMap(group), `Sitemap: ${new URL("/sitemap-index.xml", site.url).href}`, ""].join("\n"),
    { headers: { "content-type": "text/plain; charset=utf-8" } },
  );

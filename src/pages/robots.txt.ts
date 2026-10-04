import type { APIRoute } from "astro";
import { site } from "../config/site";

// Gerado da configuração para o sitemap acompanhar o host canônico (HOST-03).
export const GET: APIRoute = () =>
  new Response(
    ["User-agent: *", "Allow: /", "Disallow: /api/", "", `Sitemap: ${new URL("/sitemap-index.xml", site.url).href}`, ""].join("\n"),
    { headers: { "content-type": "text/plain; charset=utf-8" } },
  );

import type { APIRoute } from "astro";
import { NAME } from "../lib/seo/schema";

// Manifesto mínimo: nome, cor do tema e ícones; sem modo instalável (MANI-01).
export const GET: APIRoute = () =>
  new Response(
    JSON.stringify({
      name: NAME,
      short_name: "L. Assunção",
      start_url: "/",
      display: "browser",
      lang: "pt-BR",
      theme_color: "#0a1a33",
      background_color: "#0a1a33",
      icons: [
        { src: "/icon-192.png", type: "image/png", sizes: "192x192" },
        { src: "/icon-512.png", type: "image/png", sizes: "512x512" },
      ],
    }),
    { headers: { "content-type": "application/manifest+json" } },
  );

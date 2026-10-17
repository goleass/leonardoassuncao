import type { APIRoute } from "astro";
import { site } from "../config/site";
import { services } from "../data/services";
import { loadGuides } from "../lib/guias/collection";
import { llmsText } from "../lib/seo/llms";

// Gerado dos dados do site para listar serviços e guias novos sem edição manual (LLMS-06; guias LLMS-01).
export const GET: APIRoute = async () =>
  new Response(llmsText(site, services, await loadGuides()), {
    headers: { "content-type": "text/plain; charset=utf-8" },
  });

import type { APIRoute } from "astro";
import { site } from "../config/site";
import { services } from "../data/services";
import { llmsText } from "../lib/seo/llms";

// Gerado dos dados do site para listar serviços novos sem edição manual (LLMS-06).
export const GET: APIRoute = () =>
  new Response(llmsText(site, services), { headers: { "content-type": "text/plain; charset=utf-8" } });

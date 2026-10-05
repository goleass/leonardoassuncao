import type { APIRoute } from "astro";
import { site } from "../config/site";
import { questions } from "../data/faq";
import { services } from "../data/services";
import { llmsFullText } from "../lib/seo/llms";

export const GET: APIRoute = () =>
  new Response(llmsFullText(site, services, questions), { headers: { "content-type": "text/plain; charset=utf-8" } });

import type { APIRoute } from "astro";
import { site } from "../../config/site";
import { securityTxt } from "../../lib/seo/security-txt";

// A data é a do build, então cada deploy renova o Expires (EDGE-11).
export const GET: APIRoute = () =>
  new Response(securityTxt(site, new Date()), { headers: { "content-type": "text/plain; charset=utf-8" } });

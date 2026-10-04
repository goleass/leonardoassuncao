import type { APIRoute } from "astro";
import { CONTACT_FROM, CONTACT_TO, RESEND_API_KEY } from "astro:env/server";
import { Resend } from "resend";
import { handleContact } from "../../lib/contact/handler";
import { CONTACT_RATE_LIMIT, SEND_TIMEOUT_MS } from "../../lib/contact/limits";
import { createRateLimiter } from "../../lib/contact/rate-limit";

export const prerender = false;

// Uma instância por função: a contagem zera num cold start (premissa aceita na spec).
const limiter = createRateLimiter(CONTACT_RATE_LIMIT);

export const POST: APIRoute = ({ request, clientAddress }) => {
  const resend = new Resend(RESEND_API_KEY);
  return handleContact(request, {
    async send(mail) {
      const { error } = await resend.emails.send(mail);
      if (error) throw new Error(error.name);
    },
    limiter,
    to: CONTACT_TO,
    from: CONTACT_FROM,
    timeoutMs: SEND_TIMEOUT_MS,
    log: (entry) => console.error(JSON.stringify(entry)),
    clientIp: clientAddress,
  });
};

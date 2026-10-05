import type { SiteConfig } from "../../config/schema";

const DIA_MS = 24 * 60 * 60 * 1000;

/** security.txt (RFC 9116). `Expires` = agora + 364 dias, renovado a cada build (SECTXT-03, EDGE-11). */
export function securityTxt(site: SiteConfig, now: Date): string {
  const expires = new Date(now.getTime() + 364 * DIA_MS).toISOString().replace(/\.\d{3}Z$/, "Z");
  return [
    `Contact: mailto:${site.email}`,
    `Expires: ${expires}`,
    `Canonical: ${new URL("/.well-known/security.txt", site.url).href}`,
    "Preferred-Languages: pt-BR, en",
    `Policy: ${new URL("/privacidade/", site.url).href}`,
    "",
  ].join("\n");
}

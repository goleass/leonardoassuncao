import { readdirSync, readFileSync } from "node:fs";
import { join } from "node:path";
import { describe, expect, it } from "vitest";
import { parseHtml } from "../render";

// Lê o dist/ do `npm run build` anterior (gate: `npm run build && npm run test:build`).
const dist = join(process.cwd(), "dist");
const htmls = (readdirSync(dist, { recursive: true }) as string[]).filter((f) => f.endsWith(".html"));

describe("build: títulos das páginas (SEO-07, SEO-08)", () => {
  it("encontra as páginas do build", () => {
    expect(htmls).toEqual(expect.arrayContaining(["index.html", "404.html"]));
  });

  it.each(htmls)("%s tem <title> com até 60 caracteres", (file) => {
    // textContent já decodifica entidades (&amp; conta como 1 caractere).
    const title = parseHtml(readFileSync(join(dist, file), "utf8")).querySelector("title")?.textContent ?? "";
    expect(title.length).toBeGreaterThan(0);
    expect(title.length).toBeLessThanOrEqual(60);
  });
});

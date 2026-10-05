// O prefixo "_" impede o Astro de tratar este arquivo de teste como rota de src/pages.
import { describe, expect, it, vi } from "vitest";
import { siteFixture } from "../../tests/fixtures/site";
import { questions } from "../data/faq";
import { services } from "../data/services";

// O dublê prova que as URLs vêm da config (LLMS-07, LLMS-08).
const site = { ...siteFixture, url: "https://www.exemplo.com.br" };
vi.mock("../config/site", () => ({ site: { ...siteFixture, url: "https://www.exemplo.com.br" } }));

const { GET } = await import("./llms-full.txt");
const { llmsFullText } = await import("../lib/seo/llms");

describe("/llms-full.txt (LLMS-07)", () => {
  it("responde 200 como texto puro em UTF-8", async () => {
    const res = await GET({} as never);
    expect(res.status).toBe(200);
    expect(res.headers.get("content-type")).toBe("text/plain; charset=utf-8");
  });

  it("devolve o texto de todos os serviços e do FAQ no host da config", async () => {
    const body = await (await GET({} as never)).text();
    expect(body).toBe(llmsFullText(site, services, questions));
    for (const s of services) expect(body).toContain(`https://www.exemplo.com.br/${s.slug}/`);
    for (const { q, a } of questions) {
      expect(body).toContain(q);
      expect(body).toContain(a);
    }
  });
});

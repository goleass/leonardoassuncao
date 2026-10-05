// O prefixo "_" impede o Astro de tratar este arquivo de teste como rota de src/pages.
import { describe, expect, it, vi } from "vitest";
import { siteFixture } from "../../tests/fixtures/site";
import { services } from "../data/services";

// O dublê prova que o corpo é gerado com a config (LLMS-01, LLMS-04).
const site = { ...siteFixture, url: "https://www.exemplo.com.br" };
vi.mock("../config/site", () => ({ site: { ...siteFixture, url: "https://www.exemplo.com.br" } }));

const { GET } = await import("./llms.txt");
const { llmsText } = await import("../lib/seo/llms");

describe("/llms.txt (LLMS-01)", () => {
  it("responde 200 como texto puro em UTF-8", async () => {
    const res = await GET({} as never);
    expect(res.status).toBe(200);
    expect(res.headers.get("content-type")).toBe("text/plain; charset=utf-8");
  });

  it("devolve o corpo do gerador com a config e os serviços do site", async () => {
    const body = await (await GET({} as never)).text();
    expect(body).toBe(llmsText(site, services));
    expect(body.startsWith("# Leonardo Gomes Assunção\n")).toBe(true);
    expect(body).toContain("https://www.exemplo.com.br/criacao-de-sites/");
  });
});

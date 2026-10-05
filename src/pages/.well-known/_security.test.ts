// O prefixo "_" impede o Astro de tratar este arquivo de teste como rota de src/pages.
import { describe, expect, it, vi } from "vitest";
import { siteFixture } from "../../../tests/fixtures/site";

// O dublê prova que os campos vêm de src/config/site.ts (SECTXT-01..06).
vi.mock("../../config/site", () => ({ site: { ...siteFixture, url: "https://www.exemplo.com.br" } }));

const { GET } = await import("./security.txt");

describe("/.well-known/security.txt (SECTXT-01)", () => {
  it("responde 200 como texto puro em UTF-8", async () => {
    const res = await GET({} as never);
    expect(res.status).toBe(200);
    expect(res.headers.get("content-type")).toBe("text/plain; charset=utf-8");
  });

  it("traz os campos da RFC 9116 com os dados da config", async () => {
    const linhas = (await (await GET({} as never)).text()).split("\n");
    expect(linhas).toContain("Contact: mailto:contato@exemplo.com.br");
    expect(linhas).toContain("Canonical: https://www.exemplo.com.br/.well-known/security.txt");
    expect(linhas).toContain("Preferred-Languages: pt-BR, en");
    expect(linhas).toContain("Policy: https://www.exemplo.com.br/privacidade/");
    expect(linhas.some((l) => /^Expires: \d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}Z$/.test(l))).toBe(true);
  });
});

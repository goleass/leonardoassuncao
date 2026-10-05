import { describe, expect, it } from "vitest";
import { siteFixture } from "../../../tests/fixtures/site";
import { securityTxt } from "./security-txt";

// Host e e-mail do dublê diferem dos de produção: os valores vêm da config.
const site = { ...siteFixture, url: "https://www.exemplo.com.br" };
const now = new Date("2026-10-04T12:00:00Z");
const linhas = securityTxt(site, now).split("\n");

describe("securityTxt (SECTXT-02..06, EDGE-11)", () => {
  it("Expires é agora + 364 dias em UTC, sem milissegundos (SECTXT-03)", () => {
    expect(linhas).toContain("Expires: 2027-10-03T12:00:00Z");
  });

  it("Contact usa o e-mail da config (SECTXT-02)", () => {
    expect(linhas).toContain("Contact: mailto:contato@exemplo.com.br");
  });

  it("Canonical aponta o próprio arquivo no host da config (SECTXT-04)", () => {
    expect(linhas).toContain("Canonical: https://www.exemplo.com.br/.well-known/security.txt");
  });

  it("declara os idiomas preferidos (SECTXT-05)", () => {
    expect(linhas).toContain("Preferred-Languages: pt-BR, en");
  });

  it("Policy aponta a página de privacidade no host da config (SECTXT-06)", () => {
    expect(linhas).toContain("Policy: https://www.exemplo.com.br/privacidade/");
  });

  it("Expires fica sempre depois de agora, em qualquer data de build (EDGE-11)", () => {
    for (const iso of ["2026-01-01T00:00:00Z", "2028-02-29T23:59:59Z"]) {
      const agora = new Date(iso);
      const expires = securityTxt(site, agora).match(/^Expires: (.+)$/m)![1];
      expect(Date.parse(expires)).toBeGreaterThan(agora.getTime());
    }
  });
});

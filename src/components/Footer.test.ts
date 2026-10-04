import { afterEach, describe, expect, it, vi } from "vitest";
import { accessibleText, parseHtml, renderComponent } from "../../tests/render";
import { siteFixture } from "../../tests/fixtures/site";
import Footer from "./Footer.astro";

afterEach(() => {
  vi.useRealTimers();
});

describe("Footer: rodapé (LEGAL-04)", () => {
  it("mostra nome da empresa, CNPJ, cidade/UF e link para /privacidade", async () => {
    const doc = parseHtml(await renderComponent(Footer, { site: siteFixture }));
    const footer = doc.querySelector("footer")!;
    const text = accessibleText(footer);
    expect(text).toContain("Leonardo Gomes Assunção");
    expect(text).toContain("CNPJ 00.000.000/0001-00");
    expect(text).toContain("São Paulo, SP");
    expect(footer.querySelector('a[href="/privacidade"]')).not.toBeNull();
  });

  it("mostra o ano atual, lido da data do sistema", async () => {
    vi.useFakeTimers({ toFake: ["Date"] });
    vi.setSystemTime(new Date("2031-03-15T12:00:00Z"));
    const doc = parseHtml(await renderComponent(Footer, { site: siteFixture }));
    expect(accessibleText(doc.querySelector("footer")!)).toContain("© 2031");
  });
});

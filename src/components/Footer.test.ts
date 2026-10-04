import { afterEach, describe, expect, it, vi } from "vitest";
import { accessibleText, parseHtml, renderComponent } from "../../tests/render";
import { siteFixture } from "../../tests/fixtures/site";
import Footer from "./Footer.astro";

afterEach(() => {
  vi.useRealTimers();
});

describe("Footer: rodapé (LEGAL-04)", () => {
  it("mostra nome da empresa, CNPJ, cidade/UF e link para /privacidade/ sem redirect (HOST-06)", async () => {
    const doc = parseHtml(await renderComponent(Footer, { site: siteFixture }));
    const footer = doc.querySelector("footer")!;
    const text = accessibleText(footer);
    expect(text).toContain("Leonardo Gomes Assunção");
    expect(text).toContain("CNPJ 00.000.000/0001-00");
    expect(text).toContain("São Paulo, SP");
    expect(footer.querySelector('a[href="/privacidade/"]')).not.toBeNull();
  });

  it("linka as 5 páginas de serviço (LINK-02)", async () => {
    const doc = parseHtml(await renderComponent(Footer, { site: siteFixture }));
    const nav = doc.querySelector('footer nav[aria-label="Serviços"]');
    expect([...(nav?.querySelectorAll("a") ?? [])].map((a) => [a.getAttribute("href"), a.textContent?.trim()])).toEqual([
      ["/criacao-de-sites/", "Criação de sites"],
      ["/sistemas-web/", "Sistemas web"],
      ["/integracoes/", "Integrações e APIs"],
      ["/software-sob-medida/", "Software sob medida"],
      ["/manutencao-de-sistemas/", "Manutenção e evolução"],
    ]);
  });

  it("mostra o ano atual, lido da data do sistema", async () => {
    vi.useFakeTimers({ toFake: ["Date"] });
    vi.setSystemTime(new Date("2031-03-15T12:00:00Z"));
    const doc = parseHtml(await renderComponent(Footer, { site: siteFixture }));
    expect(accessibleText(doc.querySelector("footer")!)).toContain("© 2031");
  });
});

import { beforeAll, describe, expect, it } from "vitest";
import { parseHtml, renderComponent } from "../../tests/render";
import { siteComLinkedinFixture, siteFixture } from "../../tests/fixtures/site";
import BaseLayout from "./BaseLayout.astro";

const TITLE = "Leonardo Gomes Assunção — Sites, Sistemas Web e Integrações";

let doc: Document;

const meta = (selector: string) => doc.querySelector(`meta[${selector}]`)?.getAttribute("content");

beforeAll(async () => {
  const html = await renderComponent(
    BaseLayout,
    { site: siteFixture },
    { header: '<header><a href="#servicos">Serviços</a></header>', default: "<p>conteúdo</p>" },
  );
  doc = parseHtml(html);
});

describe("BaseLayout: idioma, título e descrição (SEO-01)", () => {
  it('declara lang="pt-BR"', () => {
    expect(doc.documentElement.getAttribute("lang")).toBe("pt-BR");
  });

  it("usa o título exato da spec", () => {
    expect(doc.querySelector("title")?.textContent).toBe(TITLE);
  });

  it("tem meta description não vazia com até 160 caracteres", () => {
    const description = meta('name="description"') ?? "";
    expect(description.length).toBeGreaterThan(0);
    expect(description.length).toBeLessThanOrEqual(160);
  });
});

describe("BaseLayout: ícones e cor do tema (ICON-02, ICON-03)", () => {
  it("declara favicon ICO 48×48, favicon SVG e ícone da Apple", () => {
    const ico = doc.querySelector('link[rel="icon"][href="/favicon.ico"]');
    expect(ico?.getAttribute("sizes")).toBe("48x48");
    const svg = doc.querySelector('link[rel="icon"][href="/favicon.svg"]');
    expect(svg?.getAttribute("type")).toBe("image/svg+xml");
    expect(doc.querySelector('link[rel="apple-touch-icon"]')?.getAttribute("href")).toBe("/apple-touch-icon.png");
  });

  it('declara theme-color "#0a1a33"', () => {
    expect(meta('name="theme-color"')).toBe("#0a1a33");
  });
});

describe("BaseLayout: canônica, Open Graph e Twitter Card (SEO-02, SEO-03)", () => {
  it("sem noindex, não publica meta robots (NOIDX-01)", () => {
    expect(doc.querySelector('meta[name="robots"]')).toBeNull();
  });

  it("aponta a URL canônica para o domínio configurado", () => {
    expect(doc.querySelector('link[rel="canonical"]')?.getAttribute("href")).toBe("https://exemplo.com.br/");
  });

  it("publica Open Graph com título, descrição, URL e imagem 1200×630 absoluta", () => {
    expect(meta('property="og:type"')).toBe("website");
    expect(meta('property="og:locale"')).toBe("pt_BR");
    expect(meta('property="og:title"')).toBe(TITLE);
    expect(meta('property="og:description"')).toBe(meta('name="description"'));
    expect(meta('property="og:url"')).toBe("https://exemplo.com.br/");
    expect(meta('property="og:image"')).toBe("https://exemplo.com.br/og.png");
    expect(meta('property="og:image:width"')).toBe("1200");
    expect(meta('property="og:image:height"')).toBe("630");
  });

  it("publica Twitter Card com imagem grande", () => {
    expect(meta('name="twitter:card"')).toBe("summary_large_image");
    expect(meta('name="twitter:title"')).toBe(TITLE);
    expect(meta('name="twitter:description"')).toBe(meta('name="description"'));
    expect(meta('name="twitter:image"')).toBe("https://exemplo.com.br/og.png");
  });
});

describe("BaseLayout: JSON-LD em @graph (SEO-04, LD-01)", () => {
  const scripts = (d: Document) => d.querySelectorAll('script[type="application/ld+json"]');
  const graph = (d: Document = doc) => JSON.parse(scripts(d)[0]?.textContent ?? "null");
  const empresa = (d: Document = doc) =>
    graph(d)["@graph"].find((node: { "@type": string }) => node["@type"] === "ProfessionalService");

  it("publica um único script JSON-LD com @context e @graph", () => {
    expect(scripts(doc)).toHaveLength(1);
    expect(graph()["@context"]).toBe("https://schema.org");
    expect(Array.isArray(graph()["@graph"])).toBe(true);
  });

  it("o @graph traz empresa, site e pessoa", () => {
    const types = graph()["@graph"].map((node: { "@type": string }) => node["@type"]);
    expect(types).toEqual(expect.arrayContaining(["ProfessionalService", "WebSite", "Person"]));
  });

  it("acrescenta ao @graph os nós extras recebidos por prop", async () => {
    const extra = { "@type": "FAQPage", mainEntity: [] };
    const other = parseHtml(await renderComponent(BaseLayout, { site: siteFixture, schema: [extra] }));
    expect(scripts(other)).toHaveLength(1);
    expect(graph(other)["@graph"]).toContainEqual(extra);
  });

  it("a empresa é um ProfessionalService com o nome e a URL do site", () => {
    expect(empresa().name).toBe("Leonardo Gomes Assunção");
    expect(empresa().url).toBe("https://exemplo.com.br/");
  });

  it("lista os 5 serviços", () => {
    const names = empresa().hasOfferCatalog.itemListElement.map(
      (offer: { itemOffered: { name: string } }) => offer.itemOffered.name,
    );
    expect(names).toEqual([
      "Criação de sites",
      "Sistemas web",
      "Integrações e APIs",
      "Software sob medida",
      "Manutenção e evolução",
    ]);
  });

  it("informa a área atendida e a cidade/UF configurada", () => {
    expect(empresa().areaServed).toEqual([
      { "@type": "City", name: "Canoas" },
      { "@type": "City", name: "Porto Alegre" },
      { "@type": "Country", name: "Brasil" },
    ]);
    expect(empresa().address).toEqual({
      "@type": "PostalAddress",
      addressLocality: "São Paulo",
      addressRegion: "SP",
      addressCountry: "BR",
    });
  });

  it("traz os contatos configurados", () => {
    expect(empresa().email).toBe("contato@exemplo.com.br");
    expect(empresa().telephone).toBe("+5511900000000");
  });

  it("sem LinkedIn configurado, não publica sameAs", () => {
    expect(empresa()).not.toHaveProperty("sameAs");
  });

  it("com LinkedIn configurado, publica o perfil em sameAs", async () => {
    const other = parseHtml(await renderComponent(BaseLayout, { site: siteComLinkedinFixture }));
    expect(empresa(other).sameAs).toEqual(["https://www.linkedin.com/in/exemplo"]);
  });
});

describe("BaseLayout: pular para o conteúdo (A11Y-04)", () => {
  it('o primeiro elemento focável é o link "Pular para o conteúdo" que leva ao <main>', () => {
    const first = doc.body.querySelector("a[href], button, input, select, textarea, summary, [tabindex]");
    expect(first?.textContent?.trim()).toBe("Pular para o conteúdo");
    expect(first?.getAttribute("href")).toBe("#conteudo");
    expect(doc.querySelector("main")?.id).toBe("conteudo");
  });

  it("renderiza o conteúdo da página dentro do <main>", () => {
    expect(doc.querySelector("main p")?.textContent).toBe("conteúdo");
  });
});

describe("BaseLayout: classe js para animações (ANIM-09)", () => {
  it('o script inline do <head> adiciona a classe "js" ao <html>', () => {
    const script = [...doc.head.querySelectorAll("script:not([type])")].map((s) => s.textContent ?? "").join("\n");
    const target = parseHtml("<html><body></body></html>");
    new Function("document", script)(target);
    expect(target.documentElement.classList.contains("js")).toBe(true);
    expect(doc.documentElement.classList.contains("js")).toBe(false);
  });
});

describe("BaseLayout: título e descrição por página (LEGAL-01, LEGAL-03)", () => {
  const PAGE_TITLE = "Política de privacidade — Leonardo Gomes Assunção";
  const PAGE_DESCRIPTION = "Como o formulário de contato trata os seus dados.";

  it("usa o título e a descrição recebidos em <title>, description, Open Graph e Twitter", async () => {
    const page = parseHtml(
      await renderComponent(BaseLayout, { site: siteFixture, title: PAGE_TITLE, description: PAGE_DESCRIPTION }),
    );
    const content = (selector: string) => page.querySelector(`meta[${selector}]`)?.getAttribute("content");
    expect(page.querySelector("title")?.textContent).toBe(PAGE_TITLE);
    expect(content('name="description"')).toBe(PAGE_DESCRIPTION);
    expect(content('property="og:title"')).toBe(PAGE_TITLE);
    expect(content('property="og:description"')).toBe(PAGE_DESCRIPTION);
    expect(content('name="twitter:title"')).toBe(PAGE_TITLE);
    expect(content('name="twitter:description"')).toBe(PAGE_DESCRIPTION);
    // O JSON-LD descreve a empresa (SEO-04), não a página: mantém a descrição da página inicial.
    const data = JSON.parse(page.querySelector('script[type="application/ld+json"]')?.textContent ?? "{}");
    const empresa = data["@graph"].find((node: { "@type": string }) => node["@type"] === "ProfessionalService");
    expect(empresa.description).toBe(meta('name="description"'));
  });

  it("sem título e descrição recebidos, mantém os da página inicial (SEO-01)", () => {
    expect(doc.querySelector("title")?.textContent).toBe(TITLE);
    expect(meta('name="description"')).toMatch(/^Criação de sites, sistemas web, integrações e software sob medida\./);
  });
});

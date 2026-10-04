import { beforeAll, describe, expect, it } from "vitest";
import { parseHtml, renderComponent } from "../../tests/render";
import { siteFixture } from "../../tests/fixtures/site";
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

describe("BaseLayout: canônica, Open Graph e Twitter Card (SEO-02, SEO-03)", () => {
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

describe("BaseLayout: JSON-LD ProfessionalService (SEO-04)", () => {
  const jsonLd = () => JSON.parse(doc.querySelector('script[type="application/ld+json"]')?.textContent ?? "null");

  it("é JSON válido do tipo ProfessionalService com o nome da empresa", () => {
    const data = jsonLd();
    expect(data["@context"]).toBe("https://schema.org");
    expect(data["@type"]).toBe("ProfessionalService");
    expect(data.name).toBe("Leonardo Gomes Assunção");
    expect(data.url).toBe("https://exemplo.com.br/");
  });

  it("lista os 5 serviços", () => {
    const names = jsonLd().hasOfferCatalog.itemListElement.map(
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
    const data = jsonLd();
    expect(data.areaServed).toEqual({ "@type": "Country", name: "Brasil" });
    expect(data.address).toEqual({
      "@type": "PostalAddress",
      addressLocality: "São Paulo",
      addressRegion: "SP",
      addressCountry: "BR",
    });
  });

  it("traz os contatos configurados", () => {
    const data = jsonLd();
    expect(data.email).toBe("contato@exemplo.com.br");
    expect(data.telephone).toBe("+5511900000000");
    expect(data.sameAs).toEqual(["https://www.linkedin.com/in/exemplo"]);
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

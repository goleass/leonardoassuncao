import { describe, expect, it } from "vitest";
import { siteComLinkedinFixture, siteFixture } from "../../../tests/fixtures/site";
import { site as siteReal } from "../../config/site";
import { services } from "../../data/services";
import type { Guide } from "../guias/guias";
import { articleNode, breadcrumbNode, collectionNode, faqNode, jsonLdText, serviceNode, siteNodes } from "./schema";

const BASE = "https://exemplo.com.br/";
const AREA = [
  { "@type": "City", name: "Canoas" },
  { "@type": "City", name: "Porto Alegre" },
  { "@type": "Country", name: "Brasil" },
];

// @type pode ser string ou array (a empresa é Organization e ProfessionalService, LD-10).
const byType = (nodes: Record<string, unknown>[], type: string) =>
  nodes.find((n) => [n["@type"]].flat().includes(type)) as Record<string, any>;

describe("siteNodes: empresa (LD-02, LD-03, LD-05)", () => {
  const empresa = byType(siteNodes(siteFixture), "ProfessionalService");

  it("identifica a empresa com @id, nome, url, logo e imagem absolutos", () => {
    expect(empresa["@id"]).toBe(`${BASE}#empresa`);
    expect(empresa.name).toBe("Leonardo Gomes Assunção");
    expect(empresa.url).toBe(BASE);
    expect(empresa.logo).toBe(`${BASE}icon-512.png`);
    expect(empresa.image).toBe(`${BASE}og.png`);
  });

  it("traz e-mail, telefone, CNPJ e endereço da configuração", () => {
    expect(empresa.email).toBe("contato@exemplo.com.br");
    expect(empresa.telephone).toBe("+5511900000000");
    expect(empresa.taxID).toBe("00.000.000/0001-00");
    expect(empresa.address).toEqual({
      "@type": "PostalAddress",
      addressLocality: "São Paulo",
      addressRegion: "SP",
      addressCountry: "BR",
    });
  });

  it("aponta o fundador para a pessoa", () => {
    expect(empresa.founder).toEqual({ "@id": `${BASE}#leonardo` });
  });

  it("atende Canoas, Porto Alegre e o Brasil", () => {
    expect(empresa.areaServed).toEqual(AREA);
  });

  it("lista os 5 serviços com a URL absoluta de cada página", () => {
    const offered = empresa.hasOfferCatalog.itemListElement.map((o: any) => o.itemOffered);
    expect(offered).toEqual(
      services.map((s) => ({ "@type": "Service", name: s.name, url: `${BASE}${s.slug}/` })),
    );
  });
});

describe("siteNodes: site e pessoa (LD-04)", () => {
  const nodes = siteNodes(siteFixture);

  it("publica o WebSite em pt-BR, publicado pela empresa", () => {
    const site = byType(nodes, "WebSite");
    expect(site["@id"]).toBe(`${BASE}#site`);
    expect(site.url).toBe(BASE);
    expect(site.inLanguage).toBe("pt-BR");
    expect(site.publisher).toEqual({ "@id": `${BASE}#empresa` });
  });

  it("publica a pessoa Leonardo Gomes Assunção", () => {
    const person = byType(nodes, "Person");
    expect(person["@id"]).toBe(`${BASE}#leonardo`);
    expect(person.name).toBe("Leonardo Gomes Assunção");
  });
});

describe("siteNodes: Organization e knowsAbout (LD-10, LD-11, LD-14)", () => {
  const nodes = siteNodes(siteFixture);
  const empresa = nodes.find((n) => n["@id"] === `${BASE}#empresa`) as Record<string, any>;

  it('a empresa tem @type ["Organization", "ProfessionalService"]', () => {
    expect(empresa["@type"]).toEqual(["Organization", "ProfessionalService"]);
  });

  it("knowsAbout lista o nome de cada serviço, na ordem do arquivo", () => {
    expect(empresa.knowsAbout).toEqual([
      "Criação de sites",
      "Sistemas web",
      "Integrações e APIs",
      "Software sob medida",
      "Manutenção e evolução",
    ]);
    expect(empresa.knowsAbout).toEqual(services.map((s) => s.name));
  });

  it("mantém hasOfferCatalog, address, name e url", () => {
    expect(empresa.hasOfferCatalog.itemListElement).toHaveLength(services.length);
    expect(empresa.address.addressCountry).toBe("BR");
    expect(empresa.name).toBe("Leonardo Gomes Assunção");
    expect(empresa.url).toBe(BASE);
  });
});

describe("siteNodes: LinkedIn (LD-09)", () => {
  it("sem LinkedIn, empresa e pessoa não têm a chave sameAs (LD-15)", () => {
    const nodes = siteNodes(siteFixture);
    expect(byType(nodes, "ProfessionalService")).not.toHaveProperty("sameAs");
    expect(byType(nodes, "Person")).not.toHaveProperty("sameAs");
  });

  it("com o site real, empresa e pessoa têm sameAs com o LinkedIn da spec (LD-12)", () => {
    const nodes = siteNodes(siteReal);
    const url = "https://www.linkedin.com/in/leonardo-gomes-assuncao";
    expect(byType(nodes, "ProfessionalService").sameAs).toEqual([url]);
    expect(byType(nodes, "Person").sameAs).toEqual([url]);
  });

  it("com LinkedIn, empresa e pessoa listam o perfil em sameAs", () => {
    const nodes = siteNodes(siteComLinkedinFixture);
    expect(byType(nodes, "ProfessionalService").sameAs).toEqual(["https://www.linkedin.com/in/exemplo"]);
    expect(byType(nodes, "Person").sameAs).toEqual(["https://www.linkedin.com/in/exemplo"]);
  });
});

describe("serviceNode, breadcrumbNode e faqNode (LD-06)", () => {
  const service = services[2];

  it("descreve o serviço com nome, descrição, url, fornecedor e área", () => {
    expect(serviceNode(siteFixture, service)).toEqual({
      "@type": "Service",
      name: service.name,
      description: service.description,
      url: `${BASE}${service.slug}/`,
      provider: { "@id": `${BASE}#empresa` },
      areaServed: AREA,
    });
  });

  it("monta a trilha com posições e URLs absolutas", () => {
    const node = breadcrumbNode(siteFixture, [
      { name: "Início", path: "/" },
      { name: service.name, path: `/${service.slug}/` },
    ]);
    expect(node).toEqual({
      "@type": "BreadcrumbList",
      itemListElement: [
        { "@type": "ListItem", position: 1, name: "Início", item: BASE },
        { "@type": "ListItem", position: 2, name: service.name, item: `${BASE}${service.slug}/` },
      ],
    });
  });

  it("transforma perguntas e respostas em FAQPage", () => {
    expect(faqNode([{ q: "Pergunta?", a: "Resposta." }])).toEqual({
      "@type": "FAQPage",
      mainEntity: [{ "@type": "Question", name: "Pergunta?", acceptedAnswer: { "@type": "Answer", text: "Resposta." } }],
    });
  });
});

describe("jsonLdText (LD-01, LD-08)", () => {
  it("embrulha os nós num @graph do schema.org", () => {
    expect(JSON.parse(jsonLdText([{ "@type": "Thing" }]))).toEqual({
      "@context": "https://schema.org",
      "@graph": [{ "@type": "Thing" }],
    });
  });

  it('escapa "<" como \\u003c para não fechar a tag <script>', () => {
    const text = jsonLdText([{ name: "</script><b>" }]);
    expect(text).not.toContain("<");
    expect(text).toContain("\\u003c/script>");
    expect(JSON.parse(text)["@graph"][0].name).toBe("</script><b>");
  });
});

// Guia fixture para os nós da seção /guias/.
function guide(over: Partial<Guide> = {}): Guide {
  return {
    slug: "integracao-bling-api",
    title: "Integração com o Bling via API | Leonardo Assunção",
    description: "Descrição do guia.",
    h1: "Como integrar o Bling via API",
    resumo: "Resumo.",
    servico: "integracoes",
    publishedAt: new Date("2026-10-01"),
    faq: [],
    draft: false,
    body: "",
    html: "",
    ...over,
  };
}

describe("articleNode (guias LD-01)", () => {
  const service = services.find((s) => s.slug === "integracoes")!;

  it("descreve o guia como Article ligado ao autor, à empresa e ao serviço", () => {
    expect(articleNode(siteFixture, guide({ updatedAt: new Date("2026-10-15") }), service)).toEqual({
      "@type": "Article",
      headline: "Como integrar o Bling via API",
      description: "Descrição do guia.",
      datePublished: "2026-10-01",
      dateModified: "2026-10-15",
      author: { "@id": `${BASE}#leonardo` },
      publisher: { "@id": `${BASE}#empresa` },
      mainEntityOfPage: `${BASE}guias/integracao-bling-api/`,
      inLanguage: "pt-BR",
      about: { "@type": "Service", name: service.name, url: `${BASE}integracoes/` },
    });
  });

  it("sem updatedAt, dateModified = publishedAt", () => {
    expect(articleNode(siteFixture, guide(), service).dateModified).toBe("2026-10-01");
  });
});

describe("collectionNode (guias LD-04)", () => {
  it("é um CollectionPage de /guias/ com a URL de cada guia na ordem recebida", () => {
    const node = collectionNode(siteFixture, [guide({ slug: "b-guia", h1: "B" }), guide({ slug: "a-guia", h1: "A" })]) as Record<
      string,
      any
    >;
    expect(node["@type"]).toBe("CollectionPage");
    expect(node.url).toBe(`${BASE}guias/`);
    expect(node.hasPart.map((p: any) => p.url)).toEqual([`${BASE}guias/b-guia/`, `${BASE}guias/a-guia/`]);
    expect(node.hasPart[0]).toEqual({ "@type": "Article", url: `${BASE}guias/b-guia/`, headline: "B" });
  });

  it("sem guias, hasPart é []", () => {
    expect((collectionNode(siteFixture, []) as Record<string, any>).hasPart).toEqual([]);
  });
});

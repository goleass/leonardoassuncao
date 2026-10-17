// O prefixo "_" impede o Astro de tratar este arquivo de teste como rota de src/pages.
import { beforeAll, describe, expect, it, vi } from "vitest";
import { parseHtml, renderComponent } from "../../../tests/render";
import { site } from "../../config/site";
import type { Guide } from "../../lib/guias/guias";

function guide(over: Partial<Guide> & { slug: string }): Guide {
  return {
    title: "Quanto Custa um Sistema Sob Medida | Leonardo Assunção",
    description: "Quanto custa um sistema sob medida: o que entra no preço, prazos e como pedir um orçamento sem surpresas.",
    h1: "Quanto custa um sistema sob medida",
    resumo: "O preço depende do escopo. Este guia mostra o que entra na conta.",
    servico: "software-sob-medida",
    publishedAt: new Date("2026-10-17"),
    faq: [],
    draft: false,
    body: "",
    html: "",
    ...over,
  };
}

const principal = guide({
  slug: "quanto-custa-um-sistema-sob-medida",
  updatedAt: new Date("2026-11-03"),
  faq: [
    { q: "Quanto tempo leva?", a: "De 4 a 12 semanas, conforme o escopo." },
    { q: "Tem manutenção?", a: "Sim, com contrato mensal opcional." },
  ],
  html: "<h2>O que entra no preço</h2><p>Texto do corpo do guia.</p>",
});
const outros = [
  guide({ slug: "guia-a", h1: "Guia A", publishedAt: new Date("2026-09-01") }),
  guide({ slug: "guia-b", h1: "Guia B", publishedAt: new Date("2026-10-01") }),
  guide({ slug: "guia-c", h1: "Guia C", publishedAt: new Date("2026-08-01") }),
  guide({ slug: "guia-d", h1: "Guia D", publishedAt: new Date("2026-07-01") }),
];
const sozinho = guide({ slug: "integracao-bling-api", servico: "integracoes", h1: "Integração com o Bling via API" });

// Sem astro:content nos testes: a rota recebe os guias de um dublê.
const loadGuides = vi.fn(async () => [principal, ...outros, sozinho]);
vi.mock("../../lib/guias/collection", () => ({ loadGuides }));

const { default: GuidePage, getStaticPaths } = await import("./[slug].astro");

const render = async (props: { guide: Guide; related: Guide[] }) => parseHtml(await renderComponent(GuidePage, props));
const graph = (doc: Document) =>
  JSON.parse(doc.querySelector('script[type="application/ld+json"]')?.textContent ?? "null")["@graph"] as Record<
    string,
    any
  >[];
const node = (doc: Document, type: string) => graph(doc).find((n) => n["@type"] === type);
const heading = (doc: Document, text: string) =>
  [...doc.querySelectorAll("h2")].find((h) => h.textContent?.trim() === text);

describe("Rotas dos guias (guias PAGE-01, PAGE-08, EDGE-03)", () => {
  it("gera um caminho por guia, com os relacionados do mesmo serviço (até 3, mais recentes)", async () => {
    const paths = await getStaticPaths();
    expect(paths.map((p) => p.params.slug)).toEqual([
      "quanto-custa-um-sistema-sob-medida",
      "guia-a",
      "guia-b",
      "guia-c",
      "guia-d",
      "integracao-bling-api",
    ]);
    const first = paths[0].props;
    expect(first.guide).toBe(principal);
    expect(first.related.map((g) => g.slug)).toEqual(["guia-b", "guia-a", "guia-c"]);
    expect(paths[5].props.related).toEqual([]);
  });
});

describe("Página do guia com FAQ, atualização e relacionados", () => {
  let doc: Document;

  beforeAll(async () => {
    doc = await render({ guide: principal, related: [outros[1], outros[0], outros[2]] });
  });

  it("usa title, description e um único <h1> do guia (guias PAGE-02)", () => {
    expect(doc.querySelector("title")?.textContent).toBe(principal.title);
    expect(doc.querySelector('meta[name="description"]')?.getAttribute("content")).toBe(principal.description);
    expect(doc.querySelectorAll("h1")).toHaveLength(1);
    expect(doc.querySelector("h1")?.textContent?.trim()).toBe(principal.h1);
  });

  it("mostra resumo, autor com LinkedIn e data de publicação antes do corpo (guias PAGE-03)", () => {
    const body = doc.querySelector(".guide__body")!;
    const before = (el: Element | null | undefined) =>
      !!el && (el.compareDocumentPosition(body) & 4) /* DOCUMENT_POSITION_FOLLOWING */ !== 0;

    const resumo = [...doc.querySelectorAll("p")].find((p) => p.textContent?.trim() === principal.resumo);
    expect(before(resumo)).toBe(true);

    const author = [...doc.querySelectorAll("a")].find((a) => a.textContent?.trim() === "Leonardo Gomes Assunção" && a.closest("article"));
    expect(author?.getAttribute("href")).toBe(site.linkedin);
    expect(before(author)).toBe(true);

    const published = doc.querySelector('time[datetime="2026-10-17"]');
    expect(published?.textContent?.trim()).toBe("17 de outubro de 2026");
    expect(published?.parentElement?.textContent?.replace(/\s+/g, " ")).toContain("Publicado em 17 de outubro de 2026");
    expect(before(published)).toBe(true);
  });

  it('mostra "Atualizado em" com <time datetime> quando há updatedAt (guias PAGE-04)', () => {
    const updated = doc.querySelector('time[datetime="2026-11-03"]');
    expect(updated?.textContent?.trim()).toBe("3 de novembro de 2026");
    expect(updated?.parentElement?.textContent?.replace(/\s+/g, " ")).toContain("Atualizado em 3 de novembro de 2026");
  });

  it("renderiza o HTML do corpo do guia", () => {
    expect(doc.querySelector(".guide__body h2")?.textContent).toBe("O que entra no preço");
  });

  it('mostra a trilha "Início › Guias › <h1>" (guias PAGE-05)', () => {
    const nav = doc.querySelector('nav[aria-label="Trilha de navegação"] ol.crumbs');
    const links = [...(nav?.querySelectorAll("a") ?? [])].map((a) => [a.textContent?.trim(), a.getAttribute("href")]);
    expect(links).toEqual([
      ["Início", "/"],
      ["Guias", "/guias/"],
    ]);
    expect(nav?.querySelector('[aria-current="page"]')?.textContent?.trim()).toBe(principal.h1);
  });

  it("termina com CTA que nomeia o serviço e linka a página dele, #contato e o WhatsApp (guias PAGE-06)", () => {
    const cta = doc.querySelector(".guide-cta")!;
    expect(cta.textContent).toContain("Software sob medida");
    const hrefs = [...cta.querySelectorAll("a")].map((a) => a.getAttribute("href"));
    expect(hrefs).toEqual(["/software-sob-medida/", "#contato", `https://wa.me/${site.whatsapp}`]);
    // Depois do corpo e da FAQ, antes da seção de contato.
    expect(doc.querySelector(".guide__body")!.compareDocumentPosition(cta) & 4).toBeTruthy();
    expect(heading(doc, "Perguntas frequentes")!.compareDocumentPosition(cta) & 4).toBeTruthy();
  });

  it('mostra cada item da FAQ como <details> sob "Perguntas frequentes" (guias PAGE-07)', () => {
    const section = heading(doc, "Perguntas frequentes")?.closest("section");
    const items = [...(section?.querySelectorAll("details") ?? [])].map((d) => [
      d.querySelector("summary")?.textContent?.trim(),
      d.querySelector("summary + *")?.textContent?.trim(),
    ]);
    expect(items).toEqual(principal.faq.map(({ q, a }) => [q, a]));
  });

  it('lista os relacionados sob "Leia também", na ordem recebida (guias PAGE-08)', () => {
    const section = heading(doc, "Leia também")?.closest("nav, section");
    const links = [...(section?.querySelectorAll("a") ?? [])].map((a) => [a.textContent?.trim(), a.getAttribute("href")]);
    expect(links).toEqual([
      ["Guia B", "/guias/guia-b/"],
      ["Guia A", "/guias/guia-a/"],
      ["Guia C", "/guias/guia-c/"],
    ]);
  });

  it("inclui a seção de contato com o formulário (guias PAGE-09)", () => {
    expect(doc.querySelector("section#contato form")?.getAttribute("action")).toBe("/api/contato");
  });

  it("não tem <script> executável inline (guias PAGE-10)", () => {
    const inline = [...doc.querySelectorAll("script")].filter(
      (s) => (s.textContent ?? "").trim() !== "" && s.getAttribute("type") !== "application/ld+json",
    );
    expect(inline).toHaveLength(0);
  });

  it("publica o Article do guia (guias LD-01)", () => {
    const article = node(doc, "Article");
    expect(article?.headline).toBe(principal.h1);
    expect(article?.datePublished).toBe("2026-10-17");
    expect(article?.dateModified).toBe("2026-11-03");
    expect(article?.mainEntityOfPage).toBe("https://www.leonardoassuncao.com.br/guias/quanto-custa-um-sistema-sob-medida/");
    expect(article?.about).toEqual({
      "@type": "Service",
      name: "Software sob medida",
      url: "https://www.leonardoassuncao.com.br/software-sob-medida/",
    });
  });

  it("publica a trilha Início → Guias → h1 como BreadcrumbList (guias LD-02)", () => {
    const items = node(doc, "BreadcrumbList")?.itemListElement.map((i: any) => [i.position, i.name, i.item]);
    expect(items).toEqual([
      [1, "Início", "https://www.leonardoassuncao.com.br/"],
      [2, "Guias", "https://www.leonardoassuncao.com.br/guias/"],
      [3, principal.h1, "https://www.leonardoassuncao.com.br/guias/quanto-custa-um-sistema-sob-medida/"],
    ]);
  });

  it("publica a FAQPage igual ao texto visível da FAQ (guias LD-03)", () => {
    const structured = node(doc, "FAQPage")?.mainEntity.map((q: any) => [q.name, q.acceptedAnswer.text]);
    expect(structured).toEqual(principal.faq.map(({ q, a }) => [q, a]));
  });
});

describe("Página do guia sem FAQ, sem atualização e sem relacionados", () => {
  let doc: Document;

  beforeAll(async () => {
    doc = await render({ guide: sozinho, related: [] });
  });

  it('sem updatedAt, não mostra "Atualizado em" (guias PAGE-04)', () => {
    expect(doc.body.textContent).not.toContain("Atualizado em");
    expect(doc.querySelectorAll("time")).toHaveLength(1);
  });

  it('guia único do serviço não mostra "Leia também" (guias EDGE-02)', () => {
    expect(doc.body.textContent).not.toContain("Leia também");
  });

  it('FAQ vazia: nem "Perguntas frequentes" nem FAQPage (guias EDGE-04)', () => {
    expect(heading(doc, "Perguntas frequentes")).toBeUndefined();
    expect(doc.querySelectorAll("details")).toHaveLength(0);
    expect(node(doc, "FAQPage")).toBeUndefined();
  });

  it("o CTA aponta para o serviço do guia (guias PAGE-06)", () => {
    const cta = doc.querySelector(".guide-cta")!;
    expect(cta.textContent).toContain("Integrações e APIs");
    expect(cta.querySelector("a")?.getAttribute("href")).toBe("/integracoes/");
  });
});

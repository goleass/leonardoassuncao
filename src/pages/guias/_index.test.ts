// O prefixo "_" impede o Astro de tratar este arquivo de teste como rota de src/pages.
import { beforeAll, describe, expect, it, vi } from "vitest";
import { parseHtml, renderComponent } from "../../../tests/render";
import type { Guide } from "../../lib/guias/guias";

function guide(over: Partial<Guide> & { slug: string }): Guide {
  return {
    title: "Título de teste com tamanho suficiente | Leonardo Assunção",
    description: `Descrição do guia ${over.slug}, com tamanho suficiente para passar na validação do schema dos guias.`,
    h1: `H1 ${over.slug}`,
    resumo: "Resumo.",
    servico: "integracoes",
    publishedAt: new Date("2026-10-17"),
    faq: [],
    draft: false,
    body: "",
    html: "",
    ...over,
  };
}

// Ordem de loadGuides (mais recente primeiro), misturando serviços.
const guides = [
  guide({ slug: "bling", publishedAt: new Date("2026-09-01"), updatedAt: new Date("2026-11-03") }),
  guide({ slug: "quanto-custa-um-site", servico: "criacao-de-sites", publishedAt: new Date("2026-10-20") }),
  guide({ slug: "rastreamento", publishedAt: new Date("2026-10-17") }),
];

// Sem astro:content nos testes: o dublê prova que a página usa as props quando recebe guias.
const loadGuides = vi.fn(async () => [] as Guide[]);
vi.mock("../../lib/guias/collection", () => ({ loadGuides }));

const { default: HubPage } = await import("./index.astro");

const graph = (doc: Document) =>
  JSON.parse(doc.querySelector('script[type="application/ld+json"]')?.textContent ?? "null")["@graph"] as Record<
    string,
    any
  >[];
const node = (doc: Document, type: string) => graph(doc).find((n) => n["@type"] === type);

describe("/guias/ com guias de 2 serviços", () => {
  let doc: Document;
  const groups = () => [...doc.querySelectorAll("main h2")].map((h) => h.closest("section")!);

  beforeAll(async () => {
    doc = parseHtml(await renderComponent(HubPage, { guides }));
  });

  it("usa o título exato e uma meta description de 70 a 160 caracteres (guias HUB-01)", () => {
    expect(doc.querySelector("title")?.textContent).toBe("Guias sobre Sites, Sistemas e Integrações | Leonardo Assunção");
    const description = doc.querySelector('meta[name="description"]')?.getAttribute("content") ?? "";
    expect(description.length).toBeGreaterThanOrEqual(70);
    expect(description.length).toBeLessThanOrEqual(160);
  });

  it("tem um único <h1>", () => {
    expect(doc.querySelectorAll("h1")).toHaveLength(1);
  });

  it("agrupa os guias sob um <h2> por serviço, na ordem de services (guias HUB-02)", () => {
    expect(groups().map((s) => s.querySelector("h2")?.textContent?.trim())).toEqual([
      "Criação de sites",
      "Integrações e APIs",
    ]);
  });

  it("cada grupo linka a página do serviço (guias HUB-05)", () => {
    expect(groups().map((s) => s.querySelector('a[href^="/"]:not([href^="/guias/"])')?.getAttribute("href"))).toEqual([
      "/criacao-de-sites/",
      "/integracoes/",
    ]);
  });

  it("lista cada guia com link, h1, descrição e data mais recente, do mais recente ao mais antigo (guias HUB-03, HUB-04)", () => {
    const items = [...groups()[1].querySelectorAll("li")].map((li) => {
      const a = li.querySelector('a[href^="/guias/"]');
      return {
        href: a?.getAttribute("href"),
        text: a?.textContent?.trim(),
        description: li.querySelector("p")?.textContent?.trim(),
        datetime: li.querySelector("time")?.getAttribute("datetime"),
        date: li.querySelector("time")?.textContent?.trim(),
      };
    });
    expect(items).toEqual([
      {
        href: "/guias/bling/",
        text: "H1 bling",
        description: guides[0].description,
        datetime: "2026-11-03",
        date: "3 de novembro de 2026",
      },
      {
        href: "/guias/rastreamento/",
        text: "H1 rastreamento",
        description: guides[2].description,
        datetime: "2026-10-17",
        date: "17 de outubro de 2026",
      },
    ]);
  });

  it("ordena dentro do grupo mesmo que as props cheguem fora de ordem (guias HUB-04)", async () => {
    const reversed = parseHtml(await renderComponent(HubPage, { guides: [...guides].reverse() }));
    const hrefs = [...reversed.querySelectorAll('main a[href^="/guias/"]')].map((a) => a.getAttribute("href"));
    expect(hrefs.filter((h) => h !== "/guias/")).toEqual(["/guias/quanto-custa-um-site/", "/guias/bling/", "/guias/rastreamento/"]);
  });

  it('mostra a trilha "Início › Guias" (guias HUB-06)', () => {
    const nav = doc.querySelector('nav[aria-label="Trilha de navegação"] ol.crumbs');
    const home = nav?.querySelector("a");
    expect([home?.textContent?.trim(), home?.getAttribute("href")]).toEqual(["Início", "/"]);
    expect(nav?.querySelector('[aria-current="page"]')?.textContent?.trim()).toBe("Guias");
  });

  it("publica CollectionPage com os guias e BreadcrumbList Início → Guias (guias LD-04)", () => {
    expect(node(doc, "CollectionPage")?.hasPart.map((p: any) => p.url)).toEqual(
      guides.map((g) => `https://www.leonardoassuncao.com.br/guias/${g.slug}/`),
    );
    const items = node(doc, "BreadcrumbList")?.itemListElement.map((i: any) => [i.position, i.name, i.item]);
    expect(items).toEqual([
      [1, "Início", "https://www.leonardoassuncao.com.br/"],
      [2, "Guias", "https://www.leonardoassuncao.com.br/guias/"],
    ]);
  });

  it("não tem <script> executável inline (AD-005)", () => {
    const inline = [...doc.querySelectorAll("script")].filter(
      (s) => (s.textContent ?? "").trim() !== "" && s.getAttribute("type") !== "application/ld+json",
    );
    expect(inline).toHaveLength(0);
  });
});

describe("/guias/ sem guias (guias EDGE-01)", () => {
  it('mostra "Os primeiros guias estão a caminho." e nenhum grupo', async () => {
    const doc = parseHtml(await renderComponent(HubPage, { guides: [] }));
    expect(doc.querySelector("main")?.textContent).toContain("Os primeiros guias estão a caminho.");
    expect(doc.querySelectorAll("main h2")).toHaveLength(0);
  });

  it("sem props, usa loadGuides()", async () => {
    loadGuides.mockResolvedValueOnce([guides[2]]);
    const doc = parseHtml(await renderComponent(HubPage, {}));
    expect(doc.querySelector('main a[href="/guias/rastreamento/"]')).not.toBeNull();
  });
});

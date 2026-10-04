// O prefixo "_" impede o Astro de tratar este arquivo de teste como rota de src/pages.
import { beforeAll, describe, expect, it } from "vitest";
import { parseHtml, renderComponent } from "../../tests/render";
import { services } from "../data/services";
import ServicePage, { getStaticPaths } from "./[servico].astro";

// Conta nó de texto por nó de texto: o HTML gerado não tem espaço entre tags, e textContent colaria palavras vizinhas.
function words(element: Element): number {
  const walker = element.ownerDocument.createTreeWalker(element, 4 /* NodeFilter.SHOW_TEXT */);
  let count = 0;
  for (let node = walker.nextNode(); node; node = walker.nextNode()) {
    count += (node.textContent ?? "").split(/\s+/).filter(Boolean).length;
  }
  return count;
}

describe("Rotas das páginas de serviço (SVC-01)", () => {
  it("gera exatamente as 5 páginas, uma por slug", () => {
    const paths = getStaticPaths();
    expect(paths.map((p) => p.params.servico)).toEqual([
      "criacao-de-sites",
      "sistemas-web",
      "integracoes",
      "software-sob-medida",
      "manutencao-de-sistemas",
    ]);
  });
});

describe.each(services)("Página /$slug/", (service) => {
  let doc: Document;
  const article = () => doc.querySelector("main article") as Element;
  const graph = () =>
    JSON.parse(doc.querySelector('script[type="application/ld+json"]')?.textContent ?? "null")["@graph"] as Record<
      string,
      any
    >[];
  const node = (type: string) => graph().find((n) => n["@type"] === type);

  beforeAll(async () => {
    doc = parseHtml(await renderComponent(ServicePage, { service }));
  });

  it("tem um único <h1> com o título do serviço (SVC-02)", () => {
    expect(doc.querySelectorAll("h1")).toHaveLength(1);
    expect(doc.querySelector("h1")?.textContent?.trim()).toBe(service.h1);
  });

  it("usa o title e a description do serviço (SVC-02)", () => {
    expect(doc.querySelector("title")?.textContent).toBe(service.title);
    expect(doc.querySelector('meta[name="description"]')?.getAttribute("content")).toBe(service.description);
  });

  it("tem ao menos 600 palavras dentro de <article> (SVC-04)", () => {
    expect(words(article())).toBeGreaterThanOrEqual(600);
  });

  it("tem ao menos 2 seções <h2> e uma FAQ com 3 ou mais <details>/<summary> (SVC-05)", () => {
    expect(article().querySelectorAll("h2").length).toBeGreaterThanOrEqual(2);
    const items = article().querySelectorAll("details");
    expect(items.length).toBeGreaterThanOrEqual(3);
    for (const item of items) expect(item.querySelector("summary")).not.toBeNull();
  });

  it('mostra a trilha "Início" → serviço, com a página atual marcada (SVC-06)', () => {
    const nav = doc.querySelector('nav[aria-label="Trilha de navegação"]');
    const home = nav?.querySelector("a");
    expect(home?.textContent?.trim()).toBe("Início");
    expect(home?.getAttribute("href")).toBe("/");
    const current = nav?.querySelector('[aria-current="page"]');
    expect(current?.textContent?.trim()).toBe(service.name);
  });

  it("linka os outros 4 serviços, sem link para si mesma (SVC-07, SVC-12)", () => {
    const hrefs = [...doc.querySelectorAll('nav[aria-label="Outros serviços"] a')].map((a) => a.getAttribute("href"));
    expect(hrefs).toEqual(services.filter((s) => s !== service).map((s) => `/${s.slug}/`));
  });

  it("inclui a seção de contato com o formulário (SVC-08)", () => {
    expect(doc.querySelector("section#contato form")?.getAttribute("action")).toBe("/api/contato");
  });

  it("mostra todo o conteúdo sem depender de animação (SVC-11)", () => {
    expect(article().querySelectorAll(".reveal")).toHaveLength(0);
  });

  it("publica o Service com url e fornecedor (LD-06)", () => {
    const svc = node("Service");
    expect(svc?.name).toBe(service.name);
    expect(svc?.description).toBe(service.description);
    expect(svc?.url).toBe(`https://www.leonardoassuncao.com.br/${service.slug}/`);
    expect(svc?.provider).toEqual({ "@id": "https://www.leonardoassuncao.com.br/#empresa" });
  });

  it("publica a trilha Início → serviço como BreadcrumbList (LD-06)", () => {
    const items = node("BreadcrumbList")?.itemListElement.map((i: any) => [i.position, i.name, i.item]);
    expect(items).toEqual([
      [1, "Início", "https://www.leonardoassuncao.com.br/"],
      [2, service.name, `https://www.leonardoassuncao.com.br/${service.slug}/`],
    ]);
  });

  it("publica a FAQPage igual ao texto visível da FAQ (LD-06)", () => {
    const visible = [...article().querySelectorAll("details")].map((d) => [
      d.querySelector("summary")?.textContent?.trim(),
      d.querySelector("summary + *")?.textContent?.trim(),
    ]);
    const structured = node("FAQPage")?.mainEntity.map((q: any) => [q.name, q.acceptedAnswer.text]);
    expect(structured).toEqual(visible);
  });
});

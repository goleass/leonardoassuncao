import { describe, expect, it } from "vitest";
import { formatDate, guidesFor, lastDate, related, selectGuides, toGuide, type Guide } from "./guias";

// Guia fixture; cada teste muda só o que importa.
function guide(over: Partial<Guide> = {}): Guide {
  return {
    slug: "guia-a",
    title: "Título do guia com tamanho suficiente",
    description: "Descrição",
    h1: "Guia A",
    resumo: "Resumo.",
    servico: "integracoes",
    publishedAt: new Date("2026-10-01"),
    faq: [],
    draft: false,
    body: "Texto do guia.",
    html: "<p>Texto do guia.</p>",
    ...over,
  };
}

const slugs = (list: Guide[]) => list.map((g) => g.slug);

describe("toGuide", () => {
  it("usa o id como slug e copia frontmatter, corpo e HTML", () => {
    const { slug: _s, body: _b, html: _h, ...data } = guide();
    const g = toGuide({ id: "meu-guia", data, body: "# Corpo", rendered: { html: "<h1>Corpo</h1>" } });
    expect(g.slug).toBe("meu-guia");
    expect(g.h1).toBe("Guia A");
    expect(g.body).toBe("# Corpo");
    expect(g.html).toBe("<h1>Corpo</h1>");
  });

  it("sem corpo nem HTML usa strings vazias", () => {
    const g = toGuide({ id: "x", data: guide() });
    expect(g.body).toBe("");
    expect(g.html).toBe("");
  });
});

describe("selectGuides: slug (COL-05)", () => {
  it.each(["Guia_1", "guia--x", "-guia", "guia-"])("slug %s lança erro com o nome do arquivo", (slug) => {
    expect(() => selectGuides([guide({ slug })], { includeDrafts: false })).toThrow(`guias/${slug}.md`);
  });

  it("aceita slug com letras minúsculas, números e hífens simples", () => {
    expect(slugs(selectGuides([guide({ slug: "guia-2026-x" })], { includeDrafts: false }))).toEqual(["guia-2026-x"]);
  });
});

describe("selectGuides: marcadores pendentes (COL-07)", () => {
  it.each(["[PREÇO: faixa]", "[REVISAR: dado]", "[...]"])("guia publicado com %s no corpo lança erro com o arquivo", (m) => {
    expect(() => selectGuides([guide({ slug: "com-marcador", body: `Custa ${m}.` })], { includeDrafts: false })).toThrow(
      "guias/com-marcador.md",
    );
  });

  it("guia publicado com marcador no frontmatter (resumo ou FAQ) lança erro com o arquivo", () => {
    expect(() => selectGuides([guide({ resumo: "Custa [PREÇO: x]." })], { includeDrafts: false })).toThrow("guias/guia-a.md");
    expect(() =>
      selectGuides([guide({ faq: [{ q: "Quanto?", a: "[REVISAR: valor]" }] })], { includeDrafts: false }),
    ).toThrow("guias/guia-a.md");
  });

  it("rascunho com marcador não lança", () => {
    const draft = guide({ draft: true, body: "Custa [PREÇO: faixa].", resumo: "[...]" });
    expect(() => selectGuides([draft], { includeDrafts: false })).not.toThrow();
    expect(slugs(selectGuides([draft], { includeDrafts: true }))).toEqual(["guia-a"]);
  });
});

describe("selectGuides: rascunhos e ordem (COL-08, COL-09)", () => {
  const pub = guide({ slug: "publicado" });
  const draft = guide({ slug: "rascunho", draft: true });

  it("includeDrafts: false remove rascunhos (COL-08)", () => {
    expect(slugs(selectGuides([pub, draft], { includeDrafts: false }))).toEqual(["publicado"]);
  });

  it("includeDrafts: true mantém rascunhos (COL-09)", () => {
    expect(slugs(selectGuides([pub, draft], { includeDrafts: true })).sort()).toEqual(["publicado", "rascunho"]);
  });

  it("ordena por updatedAt ?? publishedAt, mais recente primeiro", () => {
    const antigo = guide({ slug: "antigo", publishedAt: new Date("2026-01-10") });
    const atualizado = guide({ slug: "atualizado", publishedAt: new Date("2026-01-01"), updatedAt: new Date("2026-09-01") });
    const recente = guide({ slug: "recente", publishedAt: new Date("2026-06-01") });
    expect(slugs(selectGuides([antigo, recente, atualizado], { includeDrafts: false }))).toEqual([
      "atualizado",
      "recente",
      "antigo",
    ]);
  });
});

describe("lastDate", () => {
  it("usa updatedAt quando existe; senão publishedAt", () => {
    expect(lastDate(guide({ updatedAt: new Date("2026-10-05") }))).toEqual(new Date("2026-10-05"));
    expect(lastDate(guide())).toEqual(new Date("2026-10-01"));
  });
});

describe("guidesFor (HUB-04)", () => {
  it("filtra pelo serviço e ordena do mais recente", () => {
    const list = [
      guide({ slug: "a", servico: "integracoes", publishedAt: new Date("2026-01-01") }),
      guide({ slug: "b", servico: "criacao-de-sites" }),
      guide({ slug: "c", servico: "integracoes", publishedAt: new Date("2026-05-01") }),
    ];
    expect(slugs(guidesFor(list, "integracoes"))).toEqual(["c", "a"]);
    expect(guidesFor(list, "sistemas-web")).toEqual([]);
  });
});

describe("related (PAGE-08, EDGE-02, EDGE-03)", () => {
  const atual = guide({ slug: "atual", publishedAt: new Date("2026-10-10") });
  const outros = [1, 2, 3, 4].map((m) => guide({ slug: `rel-${m}`, publishedAt: new Date(`2026-0${m}-01`) }));
  const outroServico = guide({ slug: "outro-servico", servico: "criacao-de-sites", publishedAt: new Date("2026-09-01") });

  it("exclui o próprio guia, filtra pelo serviço e limita aos 3 mais recentes (EDGE-03)", () => {
    expect(slugs(related([atual, ...outros, outroServico], atual))).toEqual(["rel-4", "rel-3", "rel-2"]);
  });

  it("guia único do serviço → [] (EDGE-02)", () => {
    expect(related([atual, outroServico], atual)).toEqual([]);
  });
});

describe("formatDate (PAGE-03)", () => {
  it("formata em pt-BR por extenso, no dia UTC da data", () => {
    expect(formatDate(new Date("2026-10-17"))).toBe("17 de outubro de 2026");
  });
});

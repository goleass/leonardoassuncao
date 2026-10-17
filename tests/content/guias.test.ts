import { existsSync, readFileSync } from "node:fs";
import { join } from "node:path";
import { describe, expect, it } from "vitest";
import { parse } from "yaml";

// Os guias do lançamento e o serviço de cada um (CONT-01).
const LAUNCH: Record<string, string> = {
  "quanto-custa-um-site": "criacao-de-sites",
  "quanto-custa-um-sistema-sob-medida": "software-sob-medida",
  "integracao-bling-api": "integracoes",
  "integracao-rastreamento-veicular": "integracoes",
};

const DIR = join(process.cwd(), "src", "content", "guias");
const present = Object.keys(LAUNCH).filter((slug) => existsSync(join(DIR, `${slug}.md`)));

function read(slug: string) {
  const text = readFileSync(join(DIR, `${slug}.md`), "utf8");
  const [, front, body] = text.match(/^---\r?\n([\s\S]*?)\r?\n---\r?\n([\s\S]*)$/) ?? [];
  return { front: front ?? "", data: parse(front ?? "") ?? {}, body: body ?? "" };
}

/** Palavras do texto visível: sem URLs de link, `#`, `|`, marcadores de lista, ênfase e linhas de tabela `---` (CONT-02). */
function countWords(markdown: string): number {
  const text = markdown
    .replace(/\[([^\]]*)\]\([^)]*\)/g, "$1")
    .replace(/^\s*#+\s*/gm, "")
    .replace(/^\s*(?:[-*+]|\d+\.)\s+/gm, "")
    .replace(/[|*_`>]/g, " ")
    .replace(/:?-{3,}:?/g, " ");
  return text.split(/\s+/).filter((w) => /[\p{L}\p{N}]/u.test(w)).length;
}

describe("contagem de palavras do corpo (CONT-02)", () => {
  it("ignora a sintaxe Markdown e conta só o texto visível", () => {
    const md = "## Um título\n\n- item [um link](/integracoes/)\n\n| A | B |\n| --- | --- |\n| c d | e |\n\n**negrito** e `x`";
    // Um título item um link A B c d e negrito e x
    expect(countWords(md)).toBe(13);
  });
});

describe("guias do lançamento (CONT-01 a CONT-05, CONT-07, LINK-05)", () => {
  it("existe pelo menos um guia do lançamento", () => {
    expect(present.length).toBeGreaterThan(0);
  });

  describe.each(present)("%s", (slug) => {
    const { front, data, body } = read(slug);
    const servico = LAUNCH[slug];

    it(`tem servico ${servico} (CONT-01)`, () => {
      expect(data.servico).toBe(servico);
    });

    it("tem title de 30 a 60 e description de 70 a 160 caracteres (COL-04)", () => {
      expect(data.title.length).toBeGreaterThanOrEqual(30);
      expect(data.title.length).toBeLessThanOrEqual(60);
      expect(data.description.length).toBeGreaterThanOrEqual(70);
      expect(data.description.length).toBeLessThanOrEqual(160);
    });

    it("tem pelo menos 1.200 palavras no corpo (CONT-02)", () => {
      expect(countWords(body)).toBeGreaterThanOrEqual(1200);
    });

    it("tem pelo menos 3 perguntas no FAQ (CONT-03)", () => {
      expect(Array.isArray(data.faq)).toBe(true);
      expect(data.faq.length).toBeGreaterThanOrEqual(3);
    });

    it("tem pelo menos 3 títulos ## (CONT-04)", () => {
      expect(body.match(/^## \S/gm)?.length ?? 0).toBeGreaterThanOrEqual(3);
    });

    it("menciona Canoas ou Porto Alegre no corpo (CONT-05)", () => {
      expect(body).toMatch(/Canoas|Porto Alegre/);
    });

    it(`liga para /${servico}/ e para outra página do site (LINK-05)`, () => {
      const links = [...body.matchAll(/\]\((\/[^)\s]*)\)/g)].map(([, href]) => href);
      expect(links).toContain(`/${servico}/`);
      expect(links.filter((href) => href !== `/${servico}/`).length).toBeGreaterThan(0);
    });

    it("fica em rascunho enquanto tiver [PREÇO: (CONT-07)", () => {
      if ((front + body).includes("[PREÇO:")) expect(data.draft).toBe(true);
    });
  });
});

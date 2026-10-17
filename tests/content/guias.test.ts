import { existsSync, readdirSync, readFileSync } from "node:fs";
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

// Guias por nicho: servico, title e h1 de GN-02 e da tabela de prioridade; cluster = link obrigatório de GN-11.
const NICHE: Record<string, { servico: string; title: string; h1: string; cluster: string }> = {
  "bling-nao-sincroniza-pedidos": {
    servico: "integracoes",
    title: "Bling Não Sincroniza Pedidos da Loja? | Leonardo Assunção",
    h1: "Minha loja virtual e o Bling não sincronizam os pedidos corretamente: quando preciso de uma integração personalizada?",
    cluster: "/guias/integracao-bling-api/",
  },
  "portal-de-pedidos-para-distribuidora": {
    servico: "sistemas-web",
    title: "Portal de Pedidos para Distribuidora | Leonardo Assunção",
    h1: "Portal de pedidos para distribuidora: como parar de receber todos os pedidos pelo WhatsApp",
    cluster: "/guias/bling-nao-sincroniza-pedidos/",
  },
  "sistema-ordem-de-servico-ar-condicionado": {
    servico: "sistemas-web",
    title: "Sistema de OS para Ar-Condicionado | Leonardo Assunção",
    h1: "Sistema de ordens de serviço para empresa de ar-condicionado: visitas, técnicos e manutenção recorrente",
    cluster: "/guias/quanto-custa-um-sistema-sob-medida/",
  },
  "software-recarga-de-extintores": {
    servico: "software-sob-medida",
    title: "Software para Recarga de Extintores | Leonardo Assunção",
    h1: "Software para empresa de recarga de extintores controlar equipamentos, clientes e vencimentos",
    cluster: "/guias/sistema-ordem-de-servico-ar-condicionado/",
  },
  "portal-de-pedidos-salgados-congelados": {
    servico: "sistemas-web",
    title: "Portal de Pedidos: Salgados Congelados | Leonardo Assunção",
    h1: "Portal de pedidos para fábrica de salgados congelados que vende para mercados e lanchonetes",
    cluster: "/guias/portal-de-pedidos-para-distribuidora/",
  },
  "quanto-custa-site-para-vidracaria": {
    servico: "criacao-de-sites",
    title: "Quanto Custa um Site para Vidraçaria | Leonardo Assunção",
    h1: "Quanto custa criar um site para vidraçaria com orçamento de box, espelhos e fachadas?",
    cluster: "/guias/quanto-custa-um-site/",
  },
  "sistema-aluguel-de-cacambas": {
    servico: "software-sob-medida",
    title: "Sistema para Aluguel de Caçambas | Leonardo Assunção",
    h1: "Sistema para empresa de aluguel de caçambas: controlar entregas, retiradas e trocas por endereço",
    cluster: "/guias/integracao-rastreamento-veicular/",
  },
  "sistema-fabrica-de-uniformes": {
    servico: "software-sob-medida",
    title: "Sistema para Fábrica de Uniformes | Leonardo Assunção",
    h1: "Sistema de pedidos e produção para fábrica de uniformes personalizados",
    cluster: "/guias/quanto-custa-um-sistema-sob-medida/",
  },
  "portal-do-cliente-contabilidade": {
    servico: "sistemas-web",
    title: "Portal do Cliente para Contabilidade | Leonardo Assunção",
    h1: "Portal do cliente para escritório de contabilidade: como organizar documentos e pendências sem depender de mensagens",
    cluster: "/guias/quanto-custa-um-sistema-sob-medida/",
  },
  "sistema-portoes-automaticos": {
    servico: "software-sob-medida",
    title: "Sistema para Portões Automáticos | Leonardo Assunção",
    h1: "Sistema para empresa de instalação de portões automáticos: orçamento, instalação e manutenção",
    cluster: "/guias/sistema-ordem-de-servico-ar-condicionado/",
  },
  "site-aluguel-de-inflaveis": {
    servico: "criacao-de-sites",
    title: "Site para Aluguel de Infláveis | Leonardo Assunção",
    h1: "Site para aluguel de brinquedos infláveis: como consultar disponibilidade e pedir orçamento por data",
    cluster: "/guias/quanto-custa-um-site/",
  },
};

// Mapa dos 15 guias planejados → servico (TEST-02).
const EXPECTED: Record<string, string> = {
  ...LAUNCH,
  ...Object.fromEntries(Object.entries(NICHE).map(([slug, g]) => [slug, g.servico])),
};

// Guias que precisam existir: os 15 do mapa, ao fim da feature guias-nichos (TEST-02).
const REQUIRED = Object.keys(EXPECTED);

const DIR = join(process.cwd(), "src", "content", "guias");
// Todo arquivo .md da pasta, e não só os do mapa (TEST-01).
const files = readdirSync(DIR)
  .filter((name) => name.endsWith(".md"))
  .map((name) => name.slice(0, -3))
  .sort();

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

describe("guias de src/content/guias (TEST-01 a TEST-04, CONT-01 a CONT-07, GN-02 a GN-07)", () => {
  it("tem todos os guias obrigatórios (CONT-01, TEST-02)", () => {
    const missing = REQUIRED.filter((slug) => !existsSync(join(DIR, `${slug}.md`)));
    expect(missing).toEqual([]);
  });

  describe.each(files)("%s", (slug) => {
    const { front, data, body } = read(slug);
    const servico = EXPECTED[slug];
    const niche = NICHE[slug];
    const links = [...body.matchAll(/\]\((\/[^)\s]*)\)/g)].map(([, href]) => href);

    it("está no mapa de guias planejados (TEST-03)", () => {
      expect(Object.keys(EXPECTED), `guia fora do mapa: ${slug}`).toContain(slug);
    });

    it(`tem servico ${servico} (CONT-01, TEST-02)`, () => {
      expect(data.servico).toBe(servico);
    });

    it("tem title de 30 a 60 e description de 70 a 160 caracteres (COL-04)", () => {
      expect(data.title.length).toBeGreaterThanOrEqual(30);
      expect(data.title.length).toBeLessThanOrEqual(60);
      expect(data.description.length).toBeGreaterThanOrEqual(70);
      expect(data.description.length).toBeLessThanOrEqual(160);
    });

    it("tem pelo menos 1.200 palavras no corpo (CONT-02, GN-03)", () => {
      expect(countWords(body)).toBeGreaterThanOrEqual(1200);
    });

    const min = niche ? 4 : 3;

    it(`tem pelo menos ${min} perguntas no FAQ (CONT-03, GN-04)`, () => {
      expect(Array.isArray(data.faq)).toBe(true);
      expect(data.faq.length).toBeGreaterThanOrEqual(min);
    });

    it(`tem pelo menos ${min} títulos ## (CONT-04, GN-05)`, () => {
      expect(body.match(/^## \S/gm)?.length ?? 0).toBeGreaterThanOrEqual(min);
    });

    it("menciona Canoas ou Porto Alegre no corpo (CONT-05, GN-06)", () => {
      expect(body).toMatch(/Canoas|Porto Alegre/);
    });

    it(`liga para /${servico}/ e para outra página do site (LINK-05, GN-07)`, () => {
      expect(links).toContain(`/${servico}/`);
      expect(links.filter((href) => href !== `/${servico}/`).length).toBeGreaterThan(0);
    });

    it("liga para outro guia que existe na pasta (TEST-04, GN-07)", () => {
      const guides = links
        .map((href) => href.match(/^\/guias\/([^/#?]+)\/$/)?.[1])
        .filter((target): target is string => !!target && target !== slug && files.includes(target));
      expect(guides.length).toBeGreaterThan(0);
    });

    if (niche) {
      it("tem o title e o h1 de GN-02", () => {
        expect(data.title).toBe(niche.title);
        expect(data.h1).toBe(niche.h1);
      });

      it("liga para o guia de cluster de GN-11", () => {
        expect(links).toContain(niche.cluster);
      });
    }

    it("fica em rascunho enquanto tiver [PREÇO: (CONT-07)", () => {
      if ((front + body).includes("[PREÇO:")) expect(data.draft).toBe(true);
    });
  });
});

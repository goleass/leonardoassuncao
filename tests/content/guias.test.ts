import { existsSync, readdirSync, readFileSync } from "node:fs";
import { join } from "node:path";
import { describe, expect, it } from "vitest";
import { parse } from "yaml";
import { datesOverLimit, guideTargets, laterTargets, missingTargets, relativeLinks } from "./guide-rules";

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

// Guias de problemas reais: servico, title, h1 e cluster do calendário (PRB-01). Um guia sem arquivo ainda não reprova o teste (PRB-03).
const PROBLEM: Record<string, { servico: string; title: string; h1: string; cluster: string }> = {
  "erp-preenche-ibs-cbs-nfe": {
    servico: "integracoes",
    title: "IBS e CBS na NF-e: Seu ERP Está Pronto? | Leonardo Assunção",
    h1: "Meu ERP já preenche IBS e CBS na NF-e? Como conferir antes de ter problema",
    cluster: "/guias/integracao-bling-api/",
  },
  "pix-sem-txid-erp-nao-da-baixa": {
    servico: "integracoes",
    title: "Pix na Chave: ERP Não Dá Baixa Sozinho | Leonardo Assunção",
    h1: "Cliente pagou o Pix direto na chave e o ERP não deu baixa: como resolver",
    cluster: "/guias/integracao-bling-api/",
  },
  "locacao-equipamentos-devolucao-parcial": {
    servico: "software-sob-medida",
    title: "Locação: Cobrança na Devolução Parcial | Leonardo Assunção",
    h1: "Como cobrar diárias quando o cliente devolve só parte dos andaimes ou equipamentos?",
    cluster: "/guias/sistema-aluguel-de-cacambas/",
  },
  "custo-api-whatsapp-mensagens-servico": {
    servico: "integracoes",
    title: "Custo da API do WhatsApp Subiu? Entenda | Leonardo Assunção",
    h1: "A conta da API do WhatsApp subiu depois de outubro: como descobrir o que está gerando custo",
    cluster: "/guias/portal-de-pedidos-para-distribuidora/",
  },
  "aluguel-trajes-reserva-duplicada": {
    servico: "software-sob-medida",
    title: "Aluguel de Trajes sem Reserva Duplicada | Leonardo Assunção",
    h1: "Como evitar alugar o mesmo vestido ou traje para duas festas na mesma data?",
    cluster: "/guias/site-aluguel-de-inflaveis/",
  },
  "omie-erro-425-bloqueio-api": {
    servico: "manutencao-de-sistemas",
    title: "Erro 425 na API do Omie: Como Resolver | Leonardo Assunção",
    h1: "Erro 425 na API do Omie: por que a integração foi bloqueada por 30 minutos?",
    cluster: "/guias/integracao-bling-api/",
  },
  "laboratorio-protese-controle-trabalhos": {
    servico: "sistemas-web",
    title: "Prótese Dentária: Controle de Trabalhos | Leonardo Assunção",
    h1: "Como um laboratório de prótese dentária acompanha os trabalhos que vão e voltam do dentista?",
    cluster: "/guias/sistema-fabrica-de-uniformes/",
  },
  "pagamento-duplicado-valor-diferente": {
    servico: "integracoes",
    title: "Pagamento Duplicado: Como Tratar no ERP | Leonardo Assunção",
    h1: "Cliente pagou duas vezes ou com valor diferente: como tratar a baixa no sistema?",
    cluster: "/guias/pix-sem-txid-erp-nao-da-baixa/",
  },
  "oficina-historico-servicos-por-placa": {
    servico: "software-sob-medida",
    title: "Oficina: Histórico de Serviços por Placa | Leonardo Assunção",
    h1: "Como encontrar o que já foi trocado em um carro quando o cliente volta na garantia da oficina?",
    cluster: "/guias/sistema-ordem-de-servico-ar-condicionado/",
  },
  "omie-consumo-indevido-get": {
    servico: "manutencao-de-sistemas",
    title: "Consumo Indevido [GET] na API do Omie | Leonardo Assunção",
    h1: "Consumo indevido [GET] na API do Omie: o que significa e como corrigir",
    cluster: "/guias/omie-erro-425-bloqueio-api/",
  },
  "grafica-registro-aprovacao-arte": {
    servico: "sistemas-web",
    title: "Gráfica: Registro de Aprovação da Arte | Leonardo Assunção",
    h1: "O cliente aprovou a arte e depois disse que está errada: como a gráfica pode provar?",
    cluster: "/guias/sistema-fabrica-de-uniformes/",
  },
  "pilates-controle-reposicao-aulas": {
    servico: "sistemas-web",
    title: "Pilates: Como Controlar as Reposições | Leonardo Assunção",
    h1: "Como um estúdio de pilates controla reposição de aulas sem se perder?",
    cluster: "/guias/quanto-custa-um-sistema-sob-medida/",
  },
  "imobiliaria-repasse-proprietarios": {
    servico: "software-sob-medida",
    title: "Imobiliária: Repasse sem Planilha | Leonardo Assunção",
    h1: "Como uma imobiliária pequena organiza o repasse aos proprietários sem planilha?",
    cluster: "/guias/quanto-custa-um-sistema-sob-medida/",
  },
  "pagamento-aprovado-dinheiro-nao-caiu": {
    servico: "integracoes",
    title: "Pago, Mas Não Caiu: Status no Financeiro | Leonardo Assunção",
    h1: "O pagamento foi aprovado, mas o dinheiro não entrou: como separar os status no financeiro?",
    cluster: "/guias/pagamento-duplicado-valor-diferente/",
  },
  "estetica-controle-pacotes-sessoes": {
    servico: "sistemas-web",
    title: "Estética: Controle de Pacotes de Sessão | Leonardo Assunção",
    h1: "Como uma clínica de estética controla as sessões de um pacote já pago?",
    cluster: "/guias/pilates-controle-reposicao-aulas/",
  },
  "marmoraria-erro-medida-retalhos": {
    servico: "software-sob-medida",
    title: "Marmoraria: Erro de Medida e Retalhos | Leonardo Assunção",
    h1: "Como uma marmoraria evita perder dinheiro com medida errada e retalho de chapa?",
    cluster: "/guias/quanto-custa-site-para-vidracaria/",
  },
  "bling-integracao-parou-token": {
    servico: "manutencao-de-sistemas",
    title: "Bling Parou Sozinho? Verifique o Token | Leonardo Assunção",
    h1: "A integração com o Bling parou sozinha depois de um tempo: é o token?",
    cluster: "/guias/integracao-bling-api/",
  },
  "marcenaria-orcado-custo-real": {
    servico: "software-sob-medida",
    title: "Marcenaria: Orçado x Custo Real do Móvel | Leonardo Assunção",
    h1: "Por que o móvel vendido pela marcenaria dá menos lucro que o previsto?",
    cluster: "/guias/quanto-custa-um-sistema-sob-medida/",
  },
  "transporte-escolar-controle-mensalidades": {
    servico: "sistemas-web",
    title: "Transporte Escolar: Controle de Cobrança | Leonardo Assunção",
    h1: "Como controlar mensalidades atrasadas do transporte escolar sem constranger os pais?",
    cluster: "/guias/pix-sem-txid-erp-nao-da-baixa/",
  },
  "energia-solar-homologacao-garantia": {
    servico: "sistemas-web",
    title: "Energia Solar: Homologação e Garantia | Leonardo Assunção",
    h1: "Como acompanhar a homologação e a garantia de cada instalação de energia solar?",
    cluster: "/guias/sistema-ordem-de-servico-ar-condicionado/",
  },
  "assistencia-celular-aparelho-abandonado": {
    servico: "software-sob-medida",
    title: "Celular Esquecido na Assistência Técnica | Leonardo Assunção",
    h1: "O que fazer com os celulares que o cliente nunca buscou na assistência técnica?",
    cluster: "/guias/oficina-historico-servicos-por-placa/",
  },
  "escolinha-futebol-mensalidades-pix": {
    servico: "sistemas-web",
    title: "Escolinha de Futebol: Quem Está em Dia? | Leonardo Assunção",
    h1: "Como saber quem está em dia na escolinha de futebol sem conferir o extrato aluno por aluno?",
    cluster: "/guias/transporte-escolar-controle-mensalidades/",
  },
  "condominio-reserva-salao-festas": {
    servico: "sistemas-web",
    title: "Condomínio: Reservas sem Conflito | Leonardo Assunção",
    h1: "Como organizar a reserva do salão de festas do condomínio sem conflito entre moradores?",
    cluster: "/guias/aluguel-trajes-reserva-duplicada/",
  },
  "veterinaria-aviso-reforco-vacina": {
    servico: "sistemas-web",
    title: "Vacina Pet: Aviso da Data do Reforço | Leonardo Assunção",
    h1: "Como a clínica veterinária avisa o tutor na data do reforço da vacina?",
    cluster: "/guias/software-recarga-de-extintores/",
  },
  "pedidos-amazon-nao-entram-tiny": {
    servico: "integracoes",
    title: "Pedidos da Amazon Não Entram no Tiny? | Leonardo Assunção",
    h1: "Pedidos da Amazon não entram no Tiny/Olist e a nota não sai: o que conferir",
    cluster: "/guias/bling-nao-sincroniza-pedidos/",
  },
  "rastreador-posicao-atrasada": {
    servico: "integracoes",
    title: "Rastreador com Posição Atrasada: Causas | Leonardo Assunção",
    h1: "Rastreador com posição atrasada: é o equipamento, o sinal ou a integração?",
    cluster: "/guias/integracao-rastreamento-veicular/",
  },
  "frota-rastreadores-marcas-diferentes": {
    servico: "integracoes",
    title: "Rastreadores Diferentes em Um Painel Só | Leonardo Assunção",
    h1: "Frota com rastreadores de marcas diferentes: como ver tudo em um painel só?",
    cluster: "/guias/rastreador-posicao-atrasada/",
  },
};

// Guias que seguem as regras de GN-02 a GN-16.
const PLANNED = { ...NICHE, ...PROBLEM };

// Mapa dos guias planejados → servico (TEST-02).
const EXPECTED: Record<string, string> = {
  ...LAUNCH,
  ...Object.fromEntries(Object.entries(PLANNED).map(([slug, g]) => [slug, g.servico])),
};

// Guias que precisam existir: os 15 já publicados, até a última tarefa de guias-problemas-reais (TEST-02, PRB-03).
const REQUIRED = [...Object.keys(LAUNCH), ...Object.keys(NICHE)];

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

  it("não passa de 3 guias de problemas reais na mesma data (PRB-02)", () => {
    const dates = files.filter((name) => name in PROBLEM).map((slug) => String(read(slug).data.publishedAt));
    const over = datesOverLimit(dates);
    expect(over, `datas com mais de 3 guias: ${over.join(", ")}`).toEqual([]);
  });

  describe.each(files)("%s", (slug) => {
    const { front, data, body } = read(slug);
    const servico = EXPECTED[slug];
    const niche = PLANNED[slug];
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

    it("só liga para guias existentes e com data igual ou anterior (SCHED-09, SCHED-10)", () => {
      expect(relativeLinks(body), `${slug} usa link relativo`).toEqual([]);
      const targets = guideTargets(body);
      const missing = missingTargets(targets, files);
      expect(missing, `${slug} liga para guia sem arquivo: ${missing.join(", ")}`).toEqual([]);
      const later = laterTargets(String(data.publishedAt), targets, (target) => String(read(target).data.publishedAt));
      expect(later, `${slug} liga para guia com data posterior: ${later.join(", ")}`).toEqual([]);
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

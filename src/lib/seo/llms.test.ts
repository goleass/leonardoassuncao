import { describe, expect, it } from "vitest";
import { siteFixture } from "../../../tests/fixtures/site";
import { services, type Service } from "../../data/services";
import { questions } from "../../data/faq";
import { llmsFullText, llmsText } from "./llms";

// Host, cidade, e-mail, WhatsApp e CNPJ do dublê diferem dos de produção: os valores vêm da config (LLMS-04).
const site = { ...siteFixture, url: "https://www.exemplo.com.br" };
const HOME = "Criação de sites, sistemas web, integrações e software sob medida em Canoas/RS. Um só responsável técnico, do diagnóstico ao suporte. Atendo todo o Brasil.";

const extra: Service = { ...services[0], slug: "servico-novo", name: "Serviço Novo", description: "Descrição única do serviço novo." };
const lista = [...services, extra];

describe("llmsText (LLMS-02, LLMS-03, LLMS-04, LLMS-06, LLMS-10)", () => {
  const txt = llmsText(site, lista);

  it("abre com título e resumo igual à descrição da home, nos primeiros 500 caracteres (LLMS-02)", () => {
    const abertura = txt.slice(0, 500);
    expect(txt.startsWith("# Leonardo Gomes Assunção\n")).toBe(true);
    expect(abertura).toContain(`\n> ${HOME}\n`);
  });

  it("lista home, serviços e privacidade com link absoluto no host da config e descrição (LLMS-03)", () => {
    const linhas = txt.split("\n");
    expect(linhas).toContain(`- [Início](https://www.exemplo.com.br/): ${HOME}`);
    for (const s of services) {
      expect(linhas).toContain(`- [${s.name}](https://www.exemplo.com.br/${s.slug}/): ${s.description}`);
    }
    expect(linhas.some((l) => l.startsWith("- [Privacidade](https://www.exemplo.com.br/privacidade/): "))).toBe(true);
    expect(txt).not.toContain("leonardoassuncao.com.br");
  });

  it("traz cidade, área, e-mail, WhatsApp e CNPJ da config (LLMS-04)", () => {
    expect(txt).toContain("São Paulo, SP");
    expect(txt).toContain("Canoas, Porto Alegre e região metropolitana; todo o Brasil de forma remota");
    expect(txt).toContain("contato@exemplo.com.br");
    expect(txt).toContain("(11) 90000-0000");
    expect(txt).toContain("https://wa.me/5511900000000");
    expect(txt).toContain("00.000.000/0001-00");
  });

  it("lista um serviço novo sem mudar o gerador (LLMS-06)", () => {
    expect(txt).toContain("- [Serviço Novo](https://www.exemplo.com.br/servico-novo/): Descrição única do serviço novo.");
  });

  it("aponta /llms-full.txt sob ## Optional (LLMS-10)", () => {
    const opcional = txt.slice(txt.indexOf("## Optional"));
    expect(opcional).toContain("(https://www.exemplo.com.br/llms-full.txt)");
  });
});

describe("llmsFullText (LLMS-08, LLMS-09)", () => {
  const txt = llmsFullText(site, lista, questions);

  it("traz nome, URL e descrição de cada serviço (LLMS-08)", () => {
    for (const s of lista) {
      expect(txt).toContain(s.name);
      expect(txt).toContain(`https://www.exemplo.com.br/${s.slug}/`);
      expect(txt).toContain(s.description);
    }
  });

  it("traz todas as perguntas e respostas do FAQ (LLMS-09)", () => {
    expect(questions.length).toBeGreaterThan(0);
    for (const { q, a } of questions) {
      expect(txt).toContain(q);
      expect(txt).toContain(a);
    }
  });

  it("inclui o texto das seções do serviço, não só o resumo (LLMS-08)", () => {
    const sec = services[0].sections[0];
    expect(txt).toContain(sec.title);
    expect(txt).toContain(sec.paragraphs[0]);
  });
});

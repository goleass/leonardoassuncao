import { describe, expect, it } from "vitest";
import { services } from "../../data/services";
import { lastCommitDate, PAGE_SOURCES, withLastmod } from "./lastmod";

// Dublê do git: responde por subcomando e registra as chamadas.
function fakeGit(answers: { shallow?: string; log?: string }) {
  const calls: string[][] = [];
  const run = (args: string[]) => {
    calls.push(args);
    if (args[0] === "rev-parse") return answers.shallow;
    if (args[0] === "log") return answers.log;
    return undefined;
  };
  return { run, calls };
}

describe("lastCommitDate (SMAP-01, SMAP-02)", () => {
  it("com histórico completo devolve a data ISO do último commit que tocou as fontes (SMAP-01)", () => {
    const { run, calls } = fakeGit({ shallow: "false\n", log: "2026-09-30T14:05:12-03:00\n" });
    expect(lastCommitDate(["src/pages/index.astro", "src/layouts"], run)).toBe("2026-09-30T14:05:12-03:00");
    expect(calls).toContainEqual(["log", "-1", "--format=%cI", "--", "src/pages/index.astro", "src/layouts"]);
  });

  it("clone raso → undefined, sem consultar o log (SMAP-02)", () => {
    const { run, calls } = fakeGit({ shallow: "true\n", log: "2026-09-30T14:05:12-03:00\n" });
    expect(lastCommitDate(["src/layouts"], run)).toBeUndefined();
    expect(calls.some((args) => args[0] === "log")).toBe(false);
  });

  it("git ausente ou falhando → undefined, sem lançar (SMAP-02)", () => {
    const run = () => {
      throw new Error("spawn git ENOENT");
    };
    expect(lastCommitDate(["src/layouts"], run)).toBeUndefined();
  });

  it("git sem resposta (sem .git) → undefined (SMAP-02)", () => {
    const { run } = fakeGit({});
    expect(lastCommitDate(["src/layouts"], run)).toBeUndefined();
  });

  it("log vazio (nenhum commit tocou as fontes) → undefined (SMAP-02)", () => {
    const { run } = fakeGit({ shallow: "false\n", log: "\n" });
    expect(lastCommitDate(["src/layouts"], run)).toBeUndefined();
  });

  it("lista de fontes vazia → undefined, sem chamar o git", () => {
    const { run, calls } = fakeGit({ shallow: "false\n", log: "2026-09-30T14:05:12-03:00\n" });
    expect(lastCommitDate([], run)).toBeUndefined();
    expect(calls).toEqual([]);
  });
});

describe("PAGE_SOURCES (SMAP-01)", () => {
  it("cobre a home, os 5 serviços e a privacidade, com as fontes do design", () => {
    const servicePaths = services.map((s) => `/${s.slug}/`);
    expect(servicePaths).toHaveLength(5);
    expect(Object.keys(PAGE_SOURCES).sort()).toEqual(["/", ...servicePaths, "/privacidade/"].sort());
    expect(PAGE_SOURCES["/"]).toEqual(["src/pages/index.astro", "src/components", "src/data/faq.ts", "src/layouts"]);
    for (const path of servicePaths) {
      expect(PAGE_SOURCES[path]).toEqual(["src/pages/[servico].astro", "src/data/services.ts", "src/layouts"]);
    }
    expect(PAGE_SOURCES["/privacidade/"]).toEqual(["src/pages/privacidade.astro", "src/layouts"]);
  });
});

describe("withLastmod: serialize do sitemap (SMAP-01, SMAP-02)", () => {
  const url = "https://www.leonardoassuncao.com.br/privacidade/";

  it("com histórico completo, lastmod recebe a data do último commit das fontes da página (SMAP-01)", () => {
    const { run, calls } = fakeGit({ shallow: "false\n", log: "2026-09-30T14:05:12-03:00\n" });
    expect(withLastmod({ url }, run)).toEqual({ url, lastmod: "2026-09-30T14:05:12-03:00" });
    expect(calls).toContainEqual(["log", "-1", "--format=%cI", "--", "src/pages/privacidade.astro", "src/layouts"]);
  });

  it("em clone raso, o item sai sem lastmod (SMAP-02)", () => {
    const { run } = fakeGit({ shallow: "true\n", log: "2026-09-30T14:05:12-03:00\n" });
    expect(withLastmod({ url }, run)).toEqual({ url });
  });

  it("caminho sem fontes mapeadas sai sem lastmod", () => {
    const { run } = fakeGit({ shallow: "false\n", log: "2026-09-30T14:05:12-03:00\n" });
    expect(withLastmod({ url: "https://www.leonardoassuncao.com.br/outra/" }, run)).toEqual({
      url: "https://www.leonardoassuncao.com.br/outra/",
    });
  });
});

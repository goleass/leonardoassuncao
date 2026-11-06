// @vitest-environment happy-dom
import { afterEach, describe, expect, it, vi } from "vitest";
import { site } from "../config/site";
import { initClarity, type ClarityQueue } from "./clarity";

type ClarityWindow = Window & { clarity?: ClarityQueue };

const TAG = "https://www.clarity.ms/tag/z96a82cx1w";
const scripts = () => [...document.querySelectorAll<HTMLScriptElement>("script")];

/** Janela com o hostname pedido; o restante do documento é o do happy-dom. */
function fakeWindow(hostname: string, clarity?: ClarityWindow["clarity"]): ClarityWindow {
  return { location: { hostname }, clarity } as unknown as ClarityWindow;
}

afterEach(() => {
  document.head.innerHTML = "";
  vi.restoreAllMocks();
});

describe("initClarity no domínio oficial", () => {
  const official = new URL(site.url).hostname;

  it("carrega a tag do projeto com <script async> (CLAR-01)", () => {
    initClarity(fakeWindow(official), document);
    expect(scripts().map((script) => script.getAttribute("src"))).toEqual([TAG]);
    expect(scripts()[0].async).toBe(true);
  });

  it("cria a fila antes de carregar a tag, guardando as chamadas em clarity.q (CLAR-02)", () => {
    const win = fakeWindow(official);
    const append = vi.spyOn(document.head, "append").mockImplementation(() => {
      expect(typeof win.clarity).toBe("function");
    });
    initClarity(win, document);
    expect(append).toHaveBeenCalledOnce();
    win.clarity?.("start", { projectId: "x" });
    win.clarity?.("set", "a", "b");
    expect(win.clarity?.q?.map((call) => Array.from(call))).toEqual([
      ["start", { projectId: "x" }],
      ["set", "a", "b"],
    ]);
  });

  it("mantém um window.clarity que já existe (CLAR-12)", () => {
    const existing = vi.fn() as unknown as ClarityQueue;
    const win = fakeWindow(official, existing);
    initClarity(win, document);
    expect(win.clarity).toBe(existing);
    expect(scripts().map((script) => script.getAttribute("src"))).toEqual([TAG]);
  });
});

describe("initClarity fora do domínio oficial (CLAR-03)", () => {
  it.each([
    "127.0.0.1",
    "localhost",
    "leonardoassuncao.netlify.app",
    "deploy-preview-1--leonardoassuncao.netlify.app",
    "leonardoassuncao.com.br",
    "staging.leonardoassuncao.com.br",
    "www.leonardoassuncao.com.br.exemplo.com",
  ])(
    "%s: não cria a fila nem carrega a tag",
    (hostname) => {
      const win = fakeWindow(hostname);
      initClarity(win, document);
      expect(win.clarity).toBeUndefined();
      expect(scripts()).toEqual([]);
    },
  );
});

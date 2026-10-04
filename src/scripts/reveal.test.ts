// @vitest-environment happy-dom
import { afterEach, beforeEach, describe, expect, it } from "vitest";
import { initReveal } from "./reveal";

/** Dublê de IntersectionObserver: o teste decide quando cada elemento entra na tela. */
class FakeObserver {
  static instances: FakeObserver[] = [];
  observed = new Set<Element>();
  disconnected = false;
  constructor(public callback: IntersectionObserverCallback) {
    FakeObserver.instances.push(this);
  }
  observe(el: Element) {
    this.observed.add(el);
  }
  unobserve(el: Element) {
    this.observed.delete(el);
  }
  disconnect() {
    this.disconnected = true;
    this.observed.clear();
  }
  fire(el: Element, isIntersecting: boolean) {
    this.callback([{ target: el, isIntersecting } as IntersectionObserverEntry], this as unknown as IntersectionObserver);
  }
}

const win = window as unknown as { IntersectionObserver?: unknown };
const original = win.IntersectionObserver;
let sections: HTMLElement[];
let cleanup: () => void = () => {};

const visible = () => sections.map((el) => el.classList.contains("is-visible"));

beforeEach(() => {
  FakeObserver.instances = [];
  win.IntersectionObserver = FakeObserver;
  document.body.innerHTML = `
    <section class="reveal" id="a"></section>
    <section class="reveal" id="b"></section>
    <section id="sem-reveal"></section>`;
  sections = [...document.querySelectorAll<HTMLElement>(".reveal")];
});

afterEach(() => {
  cleanup();
  win.IntersectionObserver = original;
  document.body.innerHTML = "";
});

describe("initReveal: revelação ao rolar, uma única vez (ANIM-07)", () => {
  it("observa cada .reveal e nada começa visível", () => {
    cleanup = initReveal(document);
    const [observer] = FakeObserver.instances;
    expect([...observer.observed]).toEqual(sections);
    expect(visible()).toEqual([false, false]);
  });

  it("ao entrar na tela o elemento recebe is-visible e deixa de ser observado", () => {
    cleanup = initReveal(document);
    const [observer] = FakeObserver.instances;
    observer.fire(sections[0], true);
    expect(visible()).toEqual([true, false]);
    expect(observer.observed.has(sections[0])).toBe(false);
    expect(observer.observed.has(sections[1])).toBe(true);
  });

  it("um aviso de que o elemento não está na tela não o revela", () => {
    cleanup = initReveal(document);
    FakeObserver.instances[0].fire(sections[1], false);
    expect(visible()).toEqual([false, false]);
  });

  it("depois de revelado, sair da tela não esconde de novo", () => {
    cleanup = initReveal(document);
    const [observer] = FakeObserver.instances;
    observer.fire(sections[0], true);
    observer.fire(sections[0], false);
    expect(visible()).toEqual([true, false]);
  });

  it("a limpeza desconecta o observer", () => {
    cleanup = initReveal(document);
    cleanup();
    expect(FakeObserver.instances[0].disconnected).toBe(true);
  });
});

describe("initReveal: movimento reduzido (ANIM-08)", () => {
  it("marca tudo visível de imediato, sem criar observer", () => {
    cleanup = initReveal(document, { reducedMotion: true });
    expect(visible()).toEqual([true, true]);
    expect(FakeObserver.instances).toHaveLength(0);
  });
});

describe("initReveal: navegador sem IntersectionObserver (ANIM-09)", () => {
  it("marca tudo visível de imediato", () => {
    win.IntersectionObserver = undefined;
    cleanup = initReveal(document);
    expect(visible()).toEqual([true, true]);
  });
});

// @vitest-environment happy-dom
import { afterEach, beforeEach, describe, expect, it } from "vitest";
import { initMenu } from "./menu";

// Mesmo contrato do Header (T12): botão com aria-controls seguido do painel de navegação.
const MARKUP = `
  <header class="site-header">
    <a href="#topo">Leonardo Gomes Assunção</a>
    <button type="button" aria-expanded="false" aria-controls="menu-principal">Menu</button>
    <nav id="menu-principal">
      <ul>
        <li><a href="#servicos">Serviços</a></li>
        <li><a href="#integracoes">Integrações</a></li>
        <li><a href="#processo">Processo</a></li>
        <li><a href="#contato">Fale comigo</a></li>
      </ul>
    </nav>
  </header>`;

let header: HTMLElement;
let button: HTMLButtonElement;
let cleanup: () => void;

const expanded = () => button.getAttribute("aria-expanded");
const pressEscape = () => document.dispatchEvent(new KeyboardEvent("keydown", { key: "Escape", bubbles: true }));
const link = (text: string) => [...header.querySelectorAll("nav a")].find((a) => a.textContent === text) as HTMLElement;

beforeEach(() => {
  document.body.innerHTML = MARKUP;
  header = document.querySelector("header")!;
  button = header.querySelector("button")!;
  cleanup = initMenu(header);
});

afterEach(() => {
  cleanup();
  document.body.innerHTML = "";
});

describe("initMenu: abrir e fechar pelo botão (RESP-03)", () => {
  it('um toque em "Menu" abre o painel (aria-expanded="true")', () => {
    button.click();
    expect(expanded()).toBe("true");
  });

  it("um segundo toque fecha o painel", () => {
    button.click();
    button.click();
    expect(expanded()).toBe("false");
  });
});

describe("initMenu: fechar o painel (RESP-04)", () => {
  it("Esc fecha o painel aberto e devolve o foco ao botão", () => {
    button.click();
    link("Serviços").focus();
    pressEscape();
    expect(expanded()).toBe("false");
    expect(document.activeElement).toBe(button);
  });

  it("tocar num link do painel fecha o painel", () => {
    button.click();
    link("Processo").click();
    expect(expanded()).toBe("false");
  });

  it('tocar em "Fale comigo" também fecha o painel', () => {
    button.click();
    link("Fale comigo").click();
    expect(expanded()).toBe("false");
  });

  it("Esc com o painel fechado não muda nada nem rouba o foco", () => {
    link("Serviços").focus();
    pressEscape();
    expect(expanded()).toBe("false");
    expect(document.activeElement).toBe(link("Serviços"));
  });
});

describe("initMenu: limpeza", () => {
  it("a função de limpeza remove os listeners do botão, do painel e do Esc", () => {
    button.click();
    cleanup();
    link("Serviços").click();
    pressEscape();
    expect(expanded()).toBe("true");
    button.click();
    expect(expanded()).toBe("true");
  });
});

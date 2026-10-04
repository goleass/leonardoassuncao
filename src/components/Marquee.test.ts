import { beforeAll, describe, expect, it } from "vitest";
import { accessibleText, parseHtml, renderComponent } from "../../tests/render";
import Marquee from "./Marquee.astro";

const SPECIALTIES = [
  "Sites institucionais",
  "Sistemas web",
  "Integrações",
  "APIs",
  "Automação de processos",
  "Manutenção e evolução",
];

let doc: Document;

beforeAll(async () => {
  doc = parseHtml(await renderComponent(Marquee));
});

const items = (list: Element | undefined) => [...(list?.querySelectorAll("li") ?? [])].map((li) => accessibleText(li));

describe("Marquee: faixa de especialidades (ANIM-03, ANIM-04)", () => {
  it("a primeira cópia lista as 6 especialidades, legível por leitores de tela", () => {
    const [first] = doc.querySelectorAll("ul");
    expect(first.closest('[aria-hidden="true"]')).toBeNull();
    expect(items(first)).toEqual(SPECIALTIES);
    expect(doc.querySelector("section")?.getAttribute("aria-label")).toBe("Especialidades");
  });

  it('a segunda cópia, para o ciclo sem emenda, repete a lista com aria-hidden="true"', () => {
    const lists = doc.querySelectorAll("ul");
    expect(lists).toHaveLength(2);
    expect(lists[1].getAttribute("aria-hidden")).toBe("true");
    expect([...lists[1].querySelectorAll("li")].map((li) => li.textContent?.replace("/", "").trim())).toEqual(
      SPECIALTIES,
    );
  });
});

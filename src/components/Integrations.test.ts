import { beforeAll, describe, expect, it } from "vitest";
import { parseHtml, renderComponent } from "../../tests/render";
import Integrations from "./Integrations.astro";

let doc: Document;

beforeAll(async () => {
  doc = parseHtml(await renderComponent(Integrations));
});

describe("Integrations: fluxo de 5 etapas (PAGE-04)", () => {
  it('é a seção id="integracoes" com título <h2>', () => {
    const section = doc.querySelector("section#integracoes");
    expect(section).not.toBeNull();
    expect(section?.querySelector("h2")?.textContent?.trim()).toBe("Seus sistemas, conversando entre si.");
  });

  it("mostra as 5 etapas na ordem da spec, numa lista ordenada", () => {
    const steps = [...doc.querySelectorAll("#integracoes ol > li")].map((li) => li.querySelector("span")?.textContent?.trim());
    expect(steps).toEqual([
      "Pedido no site",
      "Cliente cadastrado no ERP",
      "Pagamento confirmado",
      "Nota fiscal emitida",
      "Cliente avisado no WhatsApp",
    ]);
  });
});

describe("Integrations: marcador animado (ANIM-06)", () => {
  it("o marcador que percorre o fluxo é decorativo (aria-hidden) e fica fora da lista", () => {
    const ol = doc.querySelector("#integracoes ol")!;
    const flow = ol.parentElement!;
    const decorative = [...flow.children].filter((el) => el !== ol);
    expect(decorative.length).toBeGreaterThan(0);
    for (const el of decorative) expect(el.getAttribute("aria-hidden")).toBe("true");
  });
});

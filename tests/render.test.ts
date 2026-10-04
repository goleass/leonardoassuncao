import { describe, expect, it } from "vitest";
import { renderComponent } from "./render";
import Greeting from "./fixtures/Greeting.astro";

describe("renderComponent", () => {
  it("renderiza um componente .astro com props em HTML", async () => {
    const html = await renderComponent(Greeting, { name: "Ana" });
    expect(html).toContain('<p class="greeting">Olá, Ana!</p>');
  });
});

import { experimental_AstroContainer } from "astro/container";
import { Window } from "happy-dom";

type Component = Parameters<experimental_AstroContainer["renderToString"]>[0];

let container: experimental_AstroContainer | undefined;

// Único ponto de uso da Container API (experimental): concentra o risco de mudanças do Astro.
export async function renderComponent(
  component: Component,
  props: Record<string, unknown> = {},
  slots: Record<string, string> = {},
): Promise<string> {
  container ??= await experimental_AstroContainer.create();
  return container.renderToString(component, { props, slots });
}

/** Transforma o HTML renderizado num documento consultável por seletores. */
export function parseHtml(html: string): Document {
  const window = new Window();
  return new window.DOMParser().parseFromString(html, "text/html") as unknown as Document;
}

/** Texto como um leitor de tela lê: ignora `aria-hidden="true"` e junta os espaços. */
export function accessibleText(element: Element): string {
  const clone = element.cloneNode(true) as Element;
  clone.querySelectorAll('[aria-hidden="true"]').forEach((hidden) => hidden.remove());
  return (clone.textContent ?? "").replace(/\s+/g, " ").trim();
}

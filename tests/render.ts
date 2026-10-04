import { experimental_AstroContainer } from "astro/container";

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

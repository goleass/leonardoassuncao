import { readFileSync } from "node:fs";
import { join } from "node:path";
import { describe, expect, it } from "vitest";

// Fonte de fallback com métricas ajustadas: a troca para a Archivo não move o conteúdo (PERF-08).
const css = readFileSync(join(process.cwd(), "src/styles/tokens.css"), "utf8");
const block = (re: RegExp) => css.match(re)?.[1] ?? "";

describe("tokens.css: fallback com métricas da Archivo (PERF-08)", () => {
  const face = block(/@font-face\s*\{([^}]*font-family:\s*"Archivo Fallback"[^}]*)\}/);

  it('declara @font-face "Archivo Fallback" a partir da Arial local', () => {
    expect(face).not.toBe("");
    expect(face).toMatch(/src:\s*local\("Arial"\)/);
  });

  it("ajusta size-adjust, ascent-override, descent-override e line-gap-override com porcentagens", () => {
    for (const prop of ["size-adjust", "ascent-override", "descent-override", "line-gap-override"]) {
      expect(face, prop).toMatch(new RegExp(`${prop}:\\s*\\d+(\\.\\d+)?%;`));
    }
  });

  it("registra num comentário o comando fontTools que gerou os valores", () => {
    expect(css).toMatch(/\/\*[\s\S]*fontTools[\s\S]*archivo-latin-wdth-normal\.woff2[\s\S]*\*\//);
  });

  it('--font-sans põe "Archivo Fallback" logo depois de "Archivo Variable"', () => {
    expect(block(/--font-sans:\s*([^;]*);/)).toBe('"Archivo Variable", "Archivo Fallback", system-ui, sans-serif');
  });
});

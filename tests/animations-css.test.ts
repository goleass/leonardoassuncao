import { readdirSync, readFileSync, statSync } from "node:fs";
import { join } from "node:path";
import { describe, expect, it } from "vitest";

interface Rule {
  prelude: string;
  decls: [string, string][];
  /** At-rules que envolvem a regra, de fora para dentro. */
  context: string[];
}

// Leitor mínimo de CSS: cada bloco `{}` vira uma regra com as declarações e as at-rules em volta.
function parseCss(css: string): Rule[] {
  const rules: Rule[] = [];
  const preludes: string[] = [];
  const decls: [string, string][][] = [];
  let buf = "";
  const flush = () => {
    const i = buf.indexOf(":");
    if (decls.length && i > 0) decls.at(-1)!.push([buf.slice(0, i).trim(), buf.slice(i + 1).trim()]);
    buf = "";
  };
  for (const ch of css.replace(/\/\*[\s\S]*?\*\//g, "")) {
    if (ch === "{") {
      preludes.push(buf.trim());
      decls.push([]);
      buf = "";
    } else if (ch === "}") {
      flush();
      rules.push({ prelude: preludes.pop()!, decls: decls.pop()!, context: [...preludes] });
    } else if (ch === ";") flush();
    else buf += ch;
  }
  return rules;
}

const animations = parseCss(readFileSync(join(process.cwd(), "src/styles/animations.css"), "utf8"));
const value = (rule: Rule, prop: string) => rule.decls.find(([p]) => p === prop)?.[1];
const selectors = (rule: Rule) => rule.prelude.split(",").map((s) => s.trim());
const inScripting = (rule: Rule) => rule.context.some((c) => /^@media\b.*\(scripting:\s*enabled\)/.test(c));

function sourceFiles(dir: string): string[] {
  return readdirSync(dir).flatMap((name) => {
    const path = join(dir, name);
    return statSync(path).isDirectory() ? sourceFiles(path) : [path];
  });
}

describe("estado com JS sem script inline (CSP-03, AD-005)", () => {
  it("nenhum arquivo de src/ usa o seletor html.js", () => {
    const files = sourceFiles(join(process.cwd(), "src")).filter((f) => /\.(css|astro)$/.test(f));
    expect(files.length).toBeGreaterThan(0);
    expect(files.filter((f) => /html\.js\b/.test(readFileSync(f, "utf8")))).toEqual([]);
  });

  it(".reveal escondido (opacity 0 / scaleX(0)) só existe dentro de @media (scripting: enabled) (ANIM-09)", () => {
    const hidden = animations.filter(
      (r) =>
        r.prelude.includes(".reveal") &&
        (value(r, "opacity") === "0" || /scaleX\(0\)/.test(value(r, "transform") ?? "")),
    );
    expect(hidden.map((r) => r.prelude).sort()).toEqual([".reveal", ".reveal:not(.is-visible) .lg-draw"]);
    expect(hidden.filter((r) => !inScripting(r))).toEqual([]);
  });

  it("com movimento reduzido, .reveal fica visível e parado, depois do estado escondido (ANIM-08)", () => {
    const hiddenAt = animations.findIndex((r) => r.prelude === ".reveal" && inScripting(r));
    const reducedAt = animations.findIndex(
      (r) => r.context.includes("@media (prefers-reduced-motion: reduce)") && selectors(r).includes(".reveal"),
    );
    const reduced = animations[reducedAt];
    expect(reducedAt).toBeGreaterThan(hiddenAt);
    // Mesmos seletores do estado escondido: mesma especificidade, e a regra posterior vence.
    expect(selectors(reduced)).toEqual([".reveal", ".reveal:not(.is-visible) .lg-draw"]);
    expect(value(reduced, "opacity")).toBe("1");
    expect(value(reduced, "transform")).toBe("none");
  });

  it("o menu compacto do Header só substitui os links quando há script (RESP-02, EDGE-04)", () => {
    const astro = readFileSync(join(process.cwd(), "src/components/Header.astro"), "utf8");
    const style = astro.match(/<style>([\s\S]*)<\/style>/)?.[1] ?? "";
    const button = parseCss(style).find((r) => r.prelude === ".menu-button" && value(r, "display") === "inline-flex");
    expect(button?.context).toEqual(["@media (max-width: 767.98px) and (scripting: enabled)"]);
  });
});

describe("animações só com opacity, transform e background-size (PERF-09)", () => {
  const ALLOWED = ["opacity", "transform", "background-size"];

  it("toda @keyframes anima só propriedades que não mexem no layout", () => {
    const frames = animations.filter((r) => r.context.some((c) => c.startsWith("@keyframes")));
    expect(frames.length).toBeGreaterThan(0);
    const props = new Set(frames.flatMap((r) => r.decls.map(([p]) => p)));
    expect([...props].filter((p) => !ALLOWED.includes(p))).toEqual([]);
  });

  it("toda transition anima só propriedades que não mexem no layout", () => {
    const transitions = animations.flatMap((r) => r.decls.filter(([p]) => p === "transition").map(([, v]) => v));
    expect(transitions.length).toBeGreaterThan(0);
    const props = transitions.flatMap((v) => v.split(",").map((part) => part.trim().split(/\s+/)[0]));
    expect(props.filter((p) => p !== "none" && !ALLOWED.includes(p))).toEqual([]);
  });
});

import { describe, expect, it } from "vitest";
import { datesOverLimit, guideTargets, laterTargets, missingTargets, relativeLinks } from "./guide-rules";

describe("guideTargets (SCHED-09, SCHED-10)", () => {
  it.each([
    ["[a](/guias/alvo/)"],
    ["[a](/guias/alvo)"],
    ["[a](/guias/alvo/#secao)"],
    ["[a](/guias/alvo?x=1)"],
    ["[a](https://www.leonardoassuncao.com.br/guias/alvo/)"],
    ['<a href="/guias/alvo/">a</a>'],
  ])("encontra o guia em %s", (body) => {
    expect(guideTargets(body)).toEqual(["alvo"]);
  });

  it("ignora o hub, outras páginas e outros domínios", () => {
    expect(guideTargets("[a](/guias/) [b](/integracoes/) [c](https://exemplo.com/guias/alvo/)")).toEqual([]);
  });
});

describe("relativeLinks (SCHED-09, SCHED-10)", () => {
  it.each([["[a](../alvo/)"], ["[a](./alvo/)"], ['<a href="../alvo/">a</a>']])("reprova %s", (body) => {
    expect(relativeLinks(body)).toHaveLength(1);
  });

  it("aceita links absolutos e o texto comum", () => {
    expect(relativeLinks("[a](/guias/alvo/) [b](https://exemplo.com/x) e ../texto solto")).toEqual([]);
  });
});

describe("laterTargets (SCHED-09)", () => {
  const dateOf = (slug: string) => ({ antes: "2026-11-04", igual: "2026-11-05", depois: "2026-11-06" })[slug]!;

  it("reprova só o alvo com data posterior", () => {
    expect(laterTargets("2026-11-05", ["antes", "igual", "depois"], dateOf)).toEqual(["depois"]);
  });

  it("aceita alvos com data igual ou anterior", () => {
    expect(laterTargets("2026-11-05", ["antes", "igual"], dateOf)).toEqual([]);
  });
});

describe("missingTargets (SCHED-10)", () => {
  it("reprova o alvo sem arquivo e aceita o que existe", () => {
    expect(missingTargets(["existe", "falta"], ["existe"])).toEqual(["falta"]);
  });
});

describe("datesOverLimit (PRB-02)", () => {
  it("aceita 3 guias na mesma data", () => {
    expect(datesOverLimit(["2026-11-05", "2026-11-05", "2026-11-05"])).toEqual([]);
  });

  it("reprova 4 guias na mesma data e nomeia a data", () => {
    expect(datesOverLimit(["2026-11-05", "2026-11-05", "2026-11-05", "2026-11-05", "2026-11-06"])).toEqual(["2026-11-05"]);
  });
});

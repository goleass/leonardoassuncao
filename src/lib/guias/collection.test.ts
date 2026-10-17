import { afterEach, describe, expect, it, vi } from "vitest";

// Entradas no formato da coleção (id = nome do arquivo), fora de ordem e com um rascunho.
const entry = (id: string, publishedAt: string, extra: Record<string, unknown> = {}) => ({
  id,
  data: {
    title: "Título do guia com tamanho suficiente",
    description: "Descrição",
    h1: `Guia ${id}`,
    resumo: "Resumo.",
    servico: "integracoes",
    publishedAt: new Date(publishedAt),
    faq: [],
    draft: false,
    ...extra,
  },
  body: "Corpo.",
  rendered: { html: "<p>Corpo.</p>" },
});

const getCollection = vi.fn(async (_name: string) => [
  entry("antigo", "2026-01-01"),
  entry("rascunho", "2026-12-01", { draft: true }),
  entry("recente", "2026-09-01"),
]);
vi.mock("astro:content", () => ({ getCollection }));

const { loadGuides } = await import("./collection");

afterEach(() => vi.unstubAllEnvs());

describe("loadGuides (COL-08, COL-09)", () => {
  it("lê a coleção guias e devolve guias convertidos, mais recente primeiro", async () => {
    vi.stubEnv("MODE", "production");
    const guides = await loadGuides();
    expect(getCollection).toHaveBeenCalledWith("guias");
    expect(guides.map((g) => g.slug)).toEqual(["recente", "antigo"]);
    expect(guides[0].html).toBe("<p>Corpo.</p>");
  });

  it("no build de produção remove rascunhos (COL-08)", async () => {
    vi.stubEnv("MODE", "production");
    expect((await loadGuides()).some((g) => g.draft)).toBe(false);
  });

  it("no astro dev mantém rascunhos (COL-09)", async () => {
    vi.stubEnv("MODE", "development");
    expect((await loadGuides()).map((g) => g.slug)).toEqual(["rascunho", "recente", "antigo"]);
  });

  it("propaga o erro de validação com o nome do arquivo", async () => {
    vi.stubEnv("MODE", "production");
    getCollection.mockResolvedValueOnce([entry("Guia_1", "2026-01-01")]);
    await expect(loadGuides()).rejects.toThrow("guias/Guia_1.md");
  });
});

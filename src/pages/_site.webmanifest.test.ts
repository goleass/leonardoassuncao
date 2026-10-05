// O prefixo "_" impede o Astro de tratar este arquivo de teste como rota de src/pages.
import { describe, expect, it } from "vitest";
import { GET } from "./site.webmanifest";

describe("/site.webmanifest (MANI-01)", () => {
  it("responde 200 como application/manifest+json", async () => {
    const res = await GET({} as never);
    expect(res.status).toBe(200);
    expect(res.headers.get("content-type")).toBe("application/manifest+json");
  });

  it("traz os campos exatos da spec", async () => {
    const manifest = await (await GET({} as never)).json();
    expect(manifest).toMatchObject({
      name: "Leonardo Gomes Assunção",
      short_name: "L. Assunção",
      start_url: "/",
      display: "browser",
      lang: "pt-BR",
      theme_color: "#0a1a33",
      background_color: "#0a1a33",
    });
  });

  it("declara os ícones PNG de 192×192 e 512×512", async () => {
    const { icons } = await (await GET({} as never)).json();
    expect(icons).toEqual([
      { src: "/icon-192.png", type: "image/png", sizes: "192x192" },
      { src: "/icon-512.png", type: "image/png", sizes: "512x512" },
    ]);
  });
});

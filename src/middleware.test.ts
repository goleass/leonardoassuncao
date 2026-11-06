import { describe, expect, it } from "vitest";
import { onRequest } from "./middleware";

describe("middleware: cabeçalhos nas respostas da função (CLAR-05, CLAR-06)", () => {
  it("aplica CSP e COEP publicados à resposta, mantendo status e corpo", async () => {
    const response = (await onRequest({} as never, async () => new Response("não encontrado", { status: 404 }))) as Response;
    expect(response.status).toBe(404);
    expect(await response.text()).toBe("não encontrado");
    expect(response.headers.get("Cross-Origin-Embedder-Policy")).toBe("credentialless");
    const csp = response.headers.get("Content-Security-Policy");
    expect(csp).toContain("script-src 'self' https://www.clarity.ms https://scripts.clarity.ms;");
    expect(csp).toContain("img-src 'self' data: https://*.clarity.ms https://c.bing.com;");
    expect(csp).toContain("connect-src 'self' https://*.clarity.ms https://c.bing.com;");
  });
});

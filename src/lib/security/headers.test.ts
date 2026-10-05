import { describe, expect, it } from "vitest";
import { netlifyHeaders } from "../../../tests/netlify-headers";
import { SECURITY_HEADERS, withSecurityHeaders } from "./headers";

describe("cabeçalhos de segurança nas respostas da função (SECH-01..07, CSP-01, EDGE-13)", () => {
  it("são os mesmos que o netlify.toml aplica a /*", () => {
    expect(netlifyHeaders().find((rule) => rule.for === "/*")?.values).toEqual(SECURITY_HEADERS);
  });

  it("entram na resposta mantendo status, corpo e cabeçalhos dela", async () => {
    const original = new Response("não encontrado", { status: 404, headers: { "content-type": "text/html; charset=utf-8" } });
    const secured = withSecurityHeaders(original);
    expect(secured.status).toBe(404);
    expect(secured.headers.get("content-type")).toBe("text/html; charset=utf-8");
    expect(await secured.text()).toBe("não encontrado");
    for (const [name, value] of Object.entries(SECURITY_HEADERS)) expect(secured.headers.get(name)).toBe(value);
  });

  it("funciona com resposta de cabeçalhos imutáveis (Response.redirect)", () => {
    const secured = withSecurityHeaders(Response.redirect("https://www.exemplo.com.br/", 301));
    expect(secured.status).toBe(301);
    expect(secured.headers.get("location")).toBe("https://www.exemplo.com.br/");
    expect(secured.headers.get("X-Frame-Options")).toBe("DENY");
  });
});

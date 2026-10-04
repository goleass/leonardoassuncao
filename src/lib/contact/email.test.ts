import { describe, expect, it } from "vitest";
import { renderContactEmail } from "./email";

const data = {
  nome: "Ana Souza",
  email: "ana@empresa.com.br",
  tipo: "Integração" as const,
  mensagem: "Quero integrar a loja com o ERP.",
};

describe("renderContactEmail", () => {
  it("assunto é 'Novo contato pelo site: <tipo> — <nome>'", () => {
    expect(renderContactEmail(data).subject).toBe("Novo contato pelo site: Integração — Ana Souza");
  });

  it("texto simples contém nome, e-mail, tipo e mensagem", () => {
    const { text } = renderContactEmail(data);
    expect(text).toContain("Nome: Ana Souza");
    expect(text).toContain("E-mail: ana@empresa.com.br");
    expect(text).toContain("Tipo de projeto: Integração");
    expect(text).toContain("Quero integrar a loja com o ERP.");
  });

  it("HTML contém nome, e-mail, tipo e mensagem", () => {
    const { html } = renderContactEmail(data);
    expect(html).toContain("Ana Souza");
    expect(html).toContain("ana@empresa.com.br");
    expect(html).toContain("Integração");
    expect(html).toContain("Quero integrar a loja com o ERP.");
  });

  it("<script> no nome e na mensagem aparece escapado no HTML", () => {
    const { html } = renderContactEmail({
      ...data,
      nome: "<script>alert(1)</script>",
      mensagem: "Olá <script>roubar()</script> tudo bem?",
    });
    expect(html).toContain("&lt;script&gt;alert(1)&lt;/script&gt;");
    expect(html).toContain("Olá &lt;script&gt;roubar()&lt;/script&gt; tudo bem?");
    expect(html).not.toContain("<script>");
  });

  it('escapa & " e \' no HTML', () => {
    const { html } = renderContactEmail({ ...data, mensagem: `Tom & "Jerry" d'Ávila` });
    expect(html).toContain("Tom &amp; &quot;Jerry&quot; d&#39;Ávila");
  });
});

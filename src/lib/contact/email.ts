import type { ContactInput } from "./validation";

const ESCAPES: Record<string, string> = { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" };
const escapeHtml = (value: string) => value.replace(/[&<>"']/g, (ch) => ESCAPES[ch]);

export function renderContactEmail(data: ContactInput): { subject: string; text: string; html: string } {
  const { nome, email, tipo, mensagem } = data;
  const subject = `Novo contato pelo site: ${tipo} — ${nome}`;
  const text = `Nome: ${nome}\nE-mail: ${email}\nTipo de projeto: ${tipo}\n\nMensagem:\n${mensagem}\n`;
  const html = [
    `<p><strong>Nome:</strong> ${escapeHtml(nome)}</p>`,
    `<p><strong>E-mail:</strong> ${escapeHtml(email)}</p>`,
    `<p><strong>Tipo de projeto:</strong> ${escapeHtml(tipo)}</p>`,
    `<p><strong>Mensagem:</strong></p>`,
    `<p style="white-space:pre-wrap">${escapeHtml(mensagem)}</p>`,
  ].join("\n");
  return { subject, text, html };
}

import type { ProjectType } from "./validation";

export function buildWhatsAppUrl(phone: string, info: { nome: string; tipo: ProjectType }): string {
  const text = `Olá, Leonardo! Acabei de enviar uma mensagem pelo site sobre: ${info.tipo}. Meu nome é ${info.nome}.`;
  return `https://wa.me/${phone}?text=${encodeURIComponent(text)}`;
}

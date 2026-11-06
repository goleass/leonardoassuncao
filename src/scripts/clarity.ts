// Mesmo efeito do snippet oficial do Microsoft Clarity, como módulo: a CSP proíbe script inline (AD-005, AD-006).
const HOST = "www.leonardoassuncao.com.br";
const PROJECT_ID = "z96a82cx1w";

export type ClarityQueue = { (...args: unknown[]): void; q?: IArguments[] };

/** Só roda no domínio oficial: testes, localhost e deploy previews não entram nos dados (CLAR-03). */
export function initClarity(win: Window & { clarity?: ClarityQueue }, doc: Document): void {
  if (win.location.hostname !== HOST) return;
  const queue: ClarityQueue = function () {
    (queue.q ??= []).push(arguments);
  };
  win.clarity ??= queue;
  const script = doc.createElement("script");
  script.async = true;
  script.src = `https://www.clarity.ms/tag/${PROJECT_ID}`;
  doc.head.append(script);
}

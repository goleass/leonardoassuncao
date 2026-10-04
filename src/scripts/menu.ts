/**
 * Menu do celular (RESP-03, RESP-04). Só alterna `aria-expanded`: o CSS do Header mostra o painel
 * quando o botão está expandido. Retorna a função que remove os listeners.
 */
export function initMenu(root: HTMLElement): () => void {
  const button = root.querySelector<HTMLButtonElement>("button[aria-controls]");
  const panel = button && root.ownerDocument.getElementById(button.getAttribute("aria-controls") ?? "");
  if (!button || !panel) return () => {};

  const doc = root.ownerDocument;
  const isOpen = () => button.getAttribute("aria-expanded") === "true";
  const setOpen = (open: boolean) => button.setAttribute("aria-expanded", String(open));

  const onToggle = () => setOpen(!isOpen());
  const onPanelClick = (event: Event) => {
    if ((event.target as Element | null)?.closest("a")) setOpen(false);
  };
  const onKeydown = (event: KeyboardEvent) => {
    if (event.key !== "Escape" || !isOpen()) return;
    setOpen(false);
    button.focus();
  };

  button.addEventListener("click", onToggle);
  panel.addEventListener("click", onPanelClick);
  doc.addEventListener("keydown", onKeydown);

  return () => {
    button.removeEventListener("click", onToggle);
    panel.removeEventListener("click", onPanelClick);
    doc.removeEventListener("keydown", onKeydown);
  };
}

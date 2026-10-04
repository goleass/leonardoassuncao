/**
 * Revela cada `.reveal` uma única vez quando entra na tela (ANIM-07). Com movimento reduzido ou sem
 * IntersectionObserver, mostra tudo de imediato (ANIM-08, ANIM-09). Retorna a função de limpeza.
 */
export function initReveal(doc: Document, opts: { reducedMotion?: boolean } = {}): () => void {
  const elements = [...doc.querySelectorAll(".reveal")];
  const Observer = doc.defaultView?.IntersectionObserver;

  if (opts.reducedMotion || !Observer) {
    for (const el of elements) el.classList.add("is-visible");
    return () => {};
  }

  const observer = new Observer(
    (entries) => {
      for (const entry of entries) {
        if (!entry.isIntersecting) continue;
        entry.target.classList.add("is-visible");
        observer.unobserve(entry.target);
      }
    },
    { rootMargin: "0px 0px -10% 0px" },
  );
  for (const el of elements) observer.observe(el);
  return () => observer.disconnect();
}

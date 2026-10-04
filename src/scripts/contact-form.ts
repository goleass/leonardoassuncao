import { validateContact, type ContactField } from "../lib/contact/validation";
import { buildWhatsAppUrl } from "../lib/contact/whatsapp";

export interface ContactFormDeps {
  fetch: typeof fetch;
  whatsappPhone: string;
  email: string;
  responseTime: string;
}

const FIELDS: ContactField[] = ["nome", "email", "tipo", "mensagem"];
const SENDING = "Enviando…";
const FAILED = "Não foi possível enviar agora.";
const RATE_LIMITED = "Muitas tentativas. Tente novamente mais tarde ou chame no WhatsApp.";

/**
 * Formulário de contato: idle → sending → success | error | rate-limited
 * (FORM-02, FORM-03, FORM-05, FORM-07, FORM-09, FORM-12, EDGE-01).
 */
export function initContactForm(form: HTMLFormElement, deps: ContactFormDeps): void {
  const doc = form.ownerDocument;
  const button = form.querySelector<HTMLButtonElement>('button[type="submit"]');
  const label = button?.querySelector(".contact-form__label") ?? button;
  const idleText = label?.textContent ?? "";
  const status = form.parentElement?.querySelector<HTMLElement>("[aria-live]");
  const whatsappBase = `https://wa.me/${deps.whatsappPhone}`;
  let sending = false;

  // Com JavaScript as mensagens em português substituem os balões nativos do navegador.
  form.noValidate = true;

  const control = (field: string) => form.elements.namedItem(field) as HTMLInputElement | null;

  const showErrors = (errors: Partial<Record<ContactField, string>>) => {
    for (const field of FIELDS) {
      const message = errors[field] ?? "";
      const output = doc.getElementById(`${field}-erro`);
      if (output) output.textContent = message;
      if (message) control(field)?.setAttribute("aria-invalid", "true");
      else control(field)?.removeAttribute("aria-invalid");
    }
    const first = FIELDS.find((field) => errors[field]);
    if (first) control(first)?.focus();
  };

  const link = (text: string, href: string) => {
    const a = doc.createElement("a");
    a.className = "contact-status__link";
    a.href = href;
    a.textContent = text;
    if (href.startsWith("https:")) {
      a.target = "_blank";
      a.rel = "noopener";
    }
    return a;
  };

  const showStatus = (message: string, ...links: HTMLAnchorElement[]) => {
    if (!status) return;
    const p = doc.createElement("p");
    p.textContent = message;
    const actions = doc.createElement("div");
    actions.className = "contact-status__actions";
    actions.append(...links);
    status.replaceChildren(p, ...(links.length ? [actions] : []));
  };

  const setSending = (value: boolean) => {
    sending = value;
    if (button) button.disabled = value;
    if (label) label.textContent = value ? SENDING : idleText;
  };

  form.addEventListener("submit", async (event) => {
    event.preventDefault();
    if (sending) return;

    const values = Object.fromEntries(
      [...FIELDS, "website"].map((field) => [field, control(field)?.value ?? ""]),
    );
    const result = validateContact(values);
    showErrors(result.ok ? {} : result.errors);
    if (!result.ok) return;

    status?.replaceChildren();
    setSending(true);
    const failed = () =>
      showStatus(FAILED, link("Chamar no WhatsApp", whatsappBase), link(deps.email, `mailto:${deps.email}`));

    try {
      const response = await deps.fetch("/api/contato", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ ...result.data, website: values.website }),
      });

      if (response.ok) {
        form.hidden = true;
        showStatus(
          `Mensagem enviada! Respondo pessoalmente em até ${deps.responseTime}.`,
          link("Continuar no WhatsApp", buildWhatsAppUrl(deps.whatsappPhone, result.data)),
        );
      } else if (response.status === 429) {
        showStatus(RATE_LIMITED, link("Chamar no WhatsApp", whatsappBase));
      } else if (response.status === 400) {
        const body = (await response.json().catch(() => ({}))) as { errors?: Partial<Record<ContactField, string>> };
        const errors = body.errors ?? {};
        if (Object.keys(errors).length > 0) showErrors(errors);
        else failed();
      } else {
        failed();
      }
    } catch {
      failed();
    } finally {
      setSending(false);
    }
  });
}

# Site Institucional Validation (round 4, user-authorized)

**Verdict**: FAIL ❌
**Date**: 2026-10-04
**Spec**: `.specs/features/site-institucional/spec.md`
**Diff range**: `main..feat/site-institucional` (`97f3844..1dca232`). Round-4 fixes: `caaa399..1dca232` (T40, T41, T42 and the round-3 lessons commit)
**Verifier**: independent sub-agent (author ≠ verifier), re-verification round 4 (one extra round authorized by the user after the round-3 escalation)

The four round-3 survivors (C1, C2, P1, W3) are all killed. T40, T41 and T42 do what they were meant to do. The feature still fails because 3 of the 20 fresh or re-run mutants survive:

- **S1, S2**: the inline `<script>` in `Contact.astro:150-151` that turns the form's `data-*` into `initContactForm` deps is untested. T40 pins the attributes and T41 pins the script with injected deps, but nothing covers the hand-off between them. Swapping `prazo` → `email` or `whatsapp` → `email` there passes the unit suite and the build suite.
- **L2b**: moving the privacy paragraph from next to the submit button to the top of the form passes everything. LEGAL-02 says "junto ao botão de envio", but `Contact.test.ts:108` only checks that the link is somewhere inside the form.

Production behaviour is correct today. The built `index.html` has the privacy paragraph inside `.contact-form__submit`, right after the button. The built bundle `_astro/Contact.astro_astro_type_script_index_0_lang.*.js` maps `{whatsapp, email, prazo}` → `{whatsappPhone: whatsapp, email, responseTime: prazo}`. All three gaps are therefore **test-only**, and none is blocking.

---

## Task Completion

| Task | Status | Notes |
| ---- | ------ | ----- |
| T1–T39 | ✅ Done | Unchanged since round 3 |
| T40 | ✅ Done | `src/components/Contact.test.ts:119-126`; fixture prazo `48 horas úteis` (`tests/fixtures/site.ts:12`) |
| T41 | ✅ Done | `src/scripts/contact-form.test.ts:64,160` (`3 dias úteis`) |
| T42 | ✅ Done | `src/pages/api/_contato.test.ts:54-62` |

`tasks.md`: 42 tasks, 122 `[x]` Done-when boxes, 0 unchecked. Since round 3, production code is unchanged: `git diff --name-only caaa399..HEAD -- src tests public astro.config.mjs` lists only `Contact.test.ts`, `_contato.test.ts`, `contact-form.test.ts` and `tests/fixtures/site.ts`.

---

## Spec-Anchored Acceptance Criteria

Legend: ✅ the assertion matches the spec outcome · ❌ GAP (no evidence, or a mutant survived) · 🖐 manual under the agreed matrix · 🔍 accepted static inspection (matrix).

All citations below were re-read at `1dca232`. Round-3 line numbers that had drifted have been corrected (`Faq.test.ts`, `contact-form.test.ts` after line 63, `_contato.test.ts` after line 52).

### P1: Landing page

| ID | Spec-defined outcome | `file:line` + assertion | Result |
| -- | -------------------- | ----------------------- | ------ |
| PAGE-01 | 12 parts in spec order; Projetos and Depoimento conditional | `src/pages/_index.test.ts:54` - `expect(partsInOrder(doc)).toEqual(PARTS.map(([name]) => name))` | ✅ |
| PAGE-02 | "Construo <palavra> sob medida." with the 4 words | `src/components/Hero.test.ts:18` - `toBe("Construo software sob medida.")`; `:26` - `toEqual(["sites","sistemas","integrações","software"])` | ✅ |
| PAGE-03 | 5 services, 01–05, title and description, in order | `src/components/Services.test.ts:52` - `expect(items).toEqual(SERVICES)` | ✅ (**SV1, SV2 killed**) |
| PAGE-04 | 5 flow steps in order | `src/components/Integrations.test.ts:20-26` - `expect(steps).toEqual(["Pedido no site", …, "Cliente avisado no WhatsApp"])` | ✅ (**IN1 killed**) |
| PAGE-05 | 4 process steps | `src/components/Process.test.ts:23` - `expect(steps).toEqual([…])` | ✅ |
| PAGE-06 | Each menu link goes to its section (scroll and offset are manual) | `src/components/Header.test.ts:17-21` - `toBe("/#servicos")` … `toBe("/#contato")` | ✅ anchors; scroll 🖐 |
| PAGE-07 | Click expands, second click collapses | `src/components/Faq.test.ts:17` - 4 `<details>/<summary>` items; `:41` - `toEqual([true,false,false,false])` | ✅ native `<details>` |
| PAGE-08 | Contact data read from one config file | `src/config/site.test.ts:11`; `src/components/Contact.test.ts:82-84,100`; **`:121-125` - `expect({ ...form().dataset }).toEqual({ whatsapp, email, prazo })` from `siteFixture`** | ✅ |
| PAGE-09 | Empty or `[…]` value → the build fails, naming the field | `tests/astro-config.test.ts:16,22` - `rejects.toThrow("Configuração inválida: cnpj"/"email")`; `src/config/schema.test.ts:28,34` | ✅ |
| PAGE-10 | ≥1 project: image, name, category, year, description | `src/components/Projects.test.ts:35-42` | ✅ |
| PAGE-11 | No projects → no section and no menu link | `src/components/Projects.test.ts:18` - `toBe("")`; `src/components/Header.test.ts:41-42` | ✅ |
| PAGE-12 | Quote with name, role and company | `src/components/Testimonial.test.ts:21-25` | ✅ |
| PAGE-13 | Header fixed while scrolling | - | 🖐 |
| PAGE-14 | LinkedIn only when configured, in Contato and `sameAs` | `src/components/Contact.test.ts:89-90,96`; `src/layouts/BaseLayout.test.ts:103,109` | ✅ |
| PAGE-15 | The menu on `/privacidade` and the 404 page leads to home sections | `src/components/Header.test.ts:17-21,33-34` - every href matches `/^\/(#[a-z]+)?$/`; `src/pages/_404.test.ts:25`, `src/pages/_privacidade.test.ts:46` | ✅ |

### P1: Contact form

| ID | Spec-defined outcome | `file:line` + assertion | Result |
| -- | -------------------- | ----------------------- | ------ |
| FORM-01 | E-mail to the configured address with name, e-mail, type and message; Reply-To = visitor | `src/lib/contact/handler.test.ts:58-64`; `src/lib/contact/email.test.ts:18-21,26-29`; `src/pages/api/_contato.test.ts:74-76` - `mail.to` `toBe("contato@leonardoassuncao.com.br")`, `mail.replyTo` `toBe("ana@empresa.com.br")` | ✅ |
| FORM-02 | Form replaced by "Mensagem enviada! Respondo pessoalmente em até <prazo configurado>." and the WhatsApp button | **`src/scripts/contact-form.test.ts:160` - `toContain("…em até 3 dias úteis.")` with `responseTime: "3 dias úteis"` (`:64`)** (P1 killed); **`src/components/Contact.test.ts:121-125` - `data-prazo` = fixture `48 horas úteis`** (C1 killed). The inline script `Contact.astro:150-151` that maps `dataset.prazo` → `responseTime` is untested: `responseTime: email` passes 205/205 + 12/12 (**S1 survived**) | ❌ GAP: page-to-script hand-off |
| FORM-03 | `https://wa.me/<número configurado>?text=<texto>` | `src/lib/contact/whatsapp.test.ts:12,17,25`; `src/scripts/contact-form.test.ts:162-164` - `toEqual([{ text: "Continuar no WhatsApp", href: "https://wa.me/5511900000000?text=" + encodeURIComponent(text) }])`; **`src/components/Contact.test.ts:122` - `data-whatsapp` = digits-only `siteFixture.whatsapp`** (C2 killed). `whatsappPhone: email` in `Contact.astro:151` passes everything (**S2 survived**) | ❌ GAP: page-to-script hand-off |
| FORM-04 | Field bounds and the type list | `src/lib/contact/validation.test.ts:37-46,57-63,75,87-96,106`; `src/components/Contact.test.ts:22-36,46` | ✅ |
| FORM-05 | Portuguese error below the field; no request | `src/scripts/contact-form.test.ts:73-77` | ✅ |
| FORM-06 | 400 with the invalid fields; no e-mail | `src/lib/contact/handler.test.ts:70-75`, malformed JSON `:80-84`; client renders the server's errors `src/scripts/contact-form.test.ts:174` - `toBe("Informe um e-mail válido.")` | ✅ (**E400 killed**) |
| FORM-07 | Button disabled, text "Enviando…" | `src/scripts/contact-form.test.ts:139-140` | ✅ |
| FORM-08 | E-mail service fails or takes 10 s → 502 | `src/lib/contact/handler.test.ts:120-136`; `src/lib/contact/limits.test.ts:10`; `src/pages/api/_contato.test.ts:86` - `toBeUndefined()` at 9 999 ms; `:89-90` - `toBe(502)`, `toEqual({ ok:false, code:"send_failed" })`; `:96` - Resend error → 502 | ✅ |
| FORM-09 | 502 or network failure → fallback text with WhatsApp and e-mail; data kept | `src/scripts/contact-form.test.ts:194-202,210-215`; `src/components/Contact.test.ts:123` - `data-email` from config. The `email` hand-off at `Contact.astro:151` shares the S1/S2 gap | ✅ script and attributes; hand-off ❌ (same as FORM-02/03) |
| FORM-10 | Honeypot → 200, no e-mail | `src/lib/contact/handler.test.ts:89-93`; markup `src/components/Contact.test.ts:73,75` | ✅ (**HP1, HP2 killed**) |
| FORM-11 | More than 5 sends per IP in 60 min → 429, no e-mail | `src/lib/contact/rate-limit.test.ts:24`; `src/lib/contact/limits.test.ts:6`; `src/pages/api/_contato.test.ts:50-51` - `toEqual([200,200,200,200,200,429])`, `send` ×5; **`:59` - `toBe(429)` at 12:59:59; `:61` - `toBe(200)` at 13:00:00, fake clock installed before `loadPost()` (`:55-56`)**; `:67` other IP 200 | ✅ (**W3 killed**) |
| FORM-12 | 429 → limit text and WhatsApp link | `src/scripts/contact-form.test.ts:184-185` | ✅ |
| FORM-13 | No message content written to disk or database | Static grep for `node:fs\|writeFile\|appendFile\|createWriteStream\|sqlite\|prisma\|mongodb\|@vercel/kv\|redis\|localStorage` over `src` and `astro.config.mjs` (tests excluded): 0 hits, re-run this round | 🔍 |
| FORM-14 | Credentials only on the server | `tests/build/secrets.test.ts:64` - `expect(leaks).toEqual([])`; `:42` | ✅ |
| FORM-15 | Log has date/time and code, with no personal data | `src/lib/contact/handler.test.ts:143,145,154` | ✅ |

### P1: Responsive layout

| ID | Spec-defined outcome | `file:line` + assertion | Result |
| -- | -------------------- | ----------------------- | ------ |
| RESP-01 | No horizontal scroll, 320–1920 px | - | 🖐 |
| RESP-02 | Below 768 px: name and the "Menu" button | `src/components/Header.test.ts:56-58` | ✅ markup; breakpoint 🖐 |
| RESP-03 | "Menu" opens the panel with links and "Fale comigo" | `src/scripts/menu.test.ts:43`; `src/components/Header.test.ts:67` | ✅ |
| RESP-04 | A panel link or Esc closes it | `src/scripts/menu.test.ts:58-59,65,71` | ✅ |
| RESP-05 | Touch targets ≥44×44 px | - | 🖐 |
| RESP-06 | Stacking below 768 px | - | 🖐 |

### P2: Animations

| ID | Spec-defined outcome | `file:line` + assertion | Result |
| -- | -------------------- | ----------------------- | ------ |
| ANIM-01 … ANIM-06 | Title entry, rotating word, marquee, pause, service fill, integration marker | Structure only: `Hero.test.ts:33-36`, `Marquee.test.ts:25,33`, `Services.test.ts:55+`, `Integrations.test.ts:30+` | 🖐 (marquee copy `aria-hidden` ✅, **MQ1 killed**) |
| ANIM-07 | Revealed once, on first entry | `src/scripts/reveal.test.ts:63-65,79` | ✅ |
| ANIM-08 | Reduced motion: everything visible, fixed title | `src/scripts/reveal.test.ts:92-93`; `src/components/Hero.test.ts:18` | ✅ |
| ANIM-09 | Without JS, all content visible | `src/layouts/BaseLayout.test.ts:131-132`; `src/scripts/reveal.test.ts:101` - no IntersectionObserver → `toEqual([true, true])` | ✅ (**RV1 killed**) |
| ANIM-10 | Only transform/opacity/background-size; CLS < 0.1 | - | 🖐 |

### P2: SEO

| ID | Spec-defined outcome | `file:line` + assertion | Result |
| -- | -------------------- | ----------------------- | ------ |
| SEO-01 | `lang="pt-BR"`, exact title, description ≤160 | `src/layouts/BaseLayout.test.ts:23,27,33` | ✅ |
| SEO-02 | OG and Twitter Card with a 1200×630 image | `src/layouts/BaseLayout.test.ts:43-57`; `tests/build/secrets.test.ts:76-77` | ✅ |
| SEO-03 | `sitemap.xml`, `robots.txt`, canonical | `tests/build/secrets.test.ts:88,93-94,136,140` | ✅ |
| SEO-04 | JSON-LD `ProfessionalService` with name, services, area and contacts | `src/layouts/BaseLayout.test.ts:66-69,76,87-93,98-99` | ✅ |
| SEO-05 | Lighthouse mobile thresholds | - | 🖐 |
| SEO-06 | Archivo from the site's own domain with `swap` | `tests/build/secrets.test.ts:106,114-115,121` | ✅ |

### P2: Accessibility

| ID | Spec-defined outcome | `file:line` + assertion | Result |
| -- | -------------------- | ----------------------- | ------ |
| A11Y-01 | Contrast ≥4.5:1 / ≥3:1 | - | 🖐 |
| A11Y-02 | Keyboard reach and visible focus | - | 🖐 |
| A11Y-03 | Labels; `aria-describedby` + `aria-invalid="true"`; focus on the first invalid field; `aria-live="polite"` | `src/components/Contact.test.ts:22,57-58,64-65`; `src/scripts/contact-form.test.ts:94,101,109-111` | ✅ |
| A11Y-04 | Skip link is the first focusable element | `src/layouts/BaseLayout.test.ts:116-118` | ✅ (**SK1 killed**) |
| A11Y-05 | One `<h1>`, ordered headings | `src/pages/_index.test.ts:94-100`; `src/components/Faq.test.ts:45` | ✅ (**HX1 killed**, 3 failures) |

### P2: Privacy and 404

| ID | Spec-defined outcome | `file:line` + assertion | Result |
| -- | -------------------- | ----------------------- | ------ |
| LEGAL-01 | `/privacidade`: data collected, purpose, messages not stored, e-mail for data requests | `src/pages/_privacidade.test.ts:28,32,36,41-42` | ✅ (**L1, L1b killed**) |
| LEGAL-02 | Privacy link **next to the submit button** | `src/components/Contact.test.ts:107-108` - button text `toBe("Enviar mensagem")`; `form().querySelector('a[href="/privacidade"]')` `not.toBeNull()`. Removing the link is caught (**L2 killed**). Moving it to the top of the form, away from the button, passes 205/205 (**L2b survived**) | ❌ GAP: adjacency not asserted |
| LEGAL-03 | 404 status, site look, home link | `tests/build/secrets.test.ts:53-54`; `src/pages/_404.test.ts:20-21,25-26` | ✅ |
| LEGAL-04 | Footer: name, CNPJ, city/state, current year, `/privacidade` | `src/components/Footer.test.ts:15-18,25` | ✅ |

### Edge cases

| ID | Spec-defined outcome | `file:line` + assertion | Result |
| -- | -------------------- | ----------------------- | ------ |
| EDGE-01 | Double submit → one request | `src/scripts/contact-form.test.ts:149` | ✅ |
| EDGE-02 | >2000 characters → exact message, no send | `src/scripts/contact-form.test.ts:84-85`; `src/lib/contact/validation.test.ts:96` | ✅ |
| EDGE-03 | HTML escaped in the e-mail | `src/lib/contact/email.test.ts:38-40,45` | ✅ |
| EDGE-04 | At exactly 768 px: full links, no "Menu" | - | 🖐 |
| EDGE-05 | Broken image keeps 16:11 and alt text | `src/components/Projects.test.ts:54-55` | ✅ |

**Status**: ❌ Gaps present. 50 IDs are automatable: 47 match the spec outcome and 3 are ❌ (FORM-02, FORM-03, LEGAL-02). FORM-09 shares the hand-off gap but is otherwise covered. The round-3 gaps on FORM-02/03 (attributes and script text) and FORM-11 (window) are closed. The remaining FORM-02/03 gap is the one step between them. FORM-13 is accepted static inspection, 15 IDs are manual, and there are no spec-precision gaps.

---

## Manual Checklist (UAT)

These IDs come from the matrix's manual list and do not cause a FAIL. No production file changed since round 3, and the static evidence was re-checked at `1dca232`.

| ID | Static evidence | UAT check |
| -- | --------------- | --------- |
| RESP-01 | `auto-fit`/`minmax(min(100%, …))` grids, `flex-wrap`, `img, svg {max-width:100%}` (`global.css`), `.band {overflow:hidden}` (`Marquee.astro`) | No horizontal scroll at 320, 390, 768, 1280, 1920 px |
| RESP-02 (breakpoint), EDGE-04 | `@media (max-width: 767.98px)` (`Header.astro:139`) | "Menu" at 767 px; full links at 768 px |
| RESP-05 | `min-height: 44px` (`Header.astro:75,106,114`); `.menu-button` `min-width/min-height: 44px` (`Header.astro:124-125`) | Measure the targets on mobile |
| RESP-06 | Wrapping and `auto-fit` grids | One column below 768 px |
| PAGE-06 (scroll) | `scroll-behavior: smooth` (`global.css:13`); `scroll-margin-top: calc(var(--header-h) + 16px)` (`global.css:62`) | Section title visible below the header after each click |
| PAGE-13 | `.site-header { position: sticky; top: 0 }` (`Header.astro:54`) | The header stays while scrolling |
| A11Y-01 | Computed text ratios ≥4.5:1 (lowest: mark on deep, 5.95); `--error` 5.8:1 (`Contact.astro:157-158`) | axe or a contrast tool |
| A11Y-02 | `:focus-visible` outline (`global.css:55`); native `<summary>` | Tab through the page, menu and form |
| SEO-05 | Static output, little JS, self-hosted fonts | Lighthouse mobile: Perf ≥90, A11y ≥95, BP ≥95, SEO 100 |
| ANIM-01 | `lg-rise` ends at 1.35 s (`animations.css`) | Watch the hero on load |
| ANIM-02 | 11 s / 4 words = 2.75 s per word (`animations.css`) | Confirm the pace ("cerca de 2,5 s") |
| ANIM-03 | Two lists, `translateX(-50%)`, 48 s linear infinite | No visible seam |
| ANIM-04 | `animation-play-state: paused` on hover | Hover the band |
| ANIM-05 | `--deep` fill left → right, arrow `rotate(-45deg)` | Hover a service |
| ANIM-06 | `lg-travel` 5 s; step delays 0.4–4.4 s | Watch a 5 s cycle |
| ANIM-10 | Keyframes use only `transform`/`opacity`; transitions only on `transform`, `opacity`, `background-size` | CLS < 0.1 in Lighthouse |

---

## Discrimination Sensor

Run in an isolated `git worktree` (`scratchpad/verifier-wt4`, detached at `1dca232`, `node_modules` symlinked). The scratch baseline passed 205/205. Each mutant was applied by exact single-match replacement (`scratchpad/mutate4.py`; every replacement matched exactly once) and run against the full unit suite (`vitest run --exclude 'tests/build/**'`). S1 and S2 were also run through `npm run test:build`, which rebuilds. Each file was reverted with `git checkout -- <file>`.

| # | File:line | Mutation | Result |
| - | --------- | -------- | ------ |
| C1 | `src/components/Contact.astro:57` | Removed `data-prazo={site.prazoResposta}` (round-3 survivor) | ✅ Killed (`Contact.test.ts:121`) |
| C2 | `src/components/Contact.astro:55` | `data-whatsapp={site.whatsappDisplay}` (round-3 survivor) | ✅ Killed (`Contact.test.ts:121`) |
| P1 | `src/scripts/contact-form.ts:100` | Success text hard-codes `24 horas úteis` (round-3 survivor) | ✅ Killed (`contact-form.test.ts:160`) |
| W3 | `src/pages/api/contato.ts:11` | `windowMs: 30 * 60 * 1000` (round-3 survivor) | ✅ Killed (`_contato.test.ts:59`) |
| L1 | `src/pages/privacidade.astro:38` | "não são armazenadas" → "ficam guardadas" | ✅ Killed (`_privacidade.test.ts:36`) |
| L1b | `src/pages/privacidade.astro:46` | Data-request e-mail hard-coded instead of `site.email` | ✅ Killed (`_privacidade.test.ts:41`) |
| L2 | `src/components/Contact.astro:133` | Privacy link removed (plain text) | ✅ Killed (`Contact.test.ts:108`) |
| L2b | `src/components/Contact.astro:132-134` | Privacy paragraph moved out of `.contact-form__submit` to the top of the form, away from the button | ❌ **Survived** (205/205) |
| HP1 | `src/components/Contact.astro:114` | Honeypot without `tabindex="-1"` | ✅ Killed (`Contact.test.ts:73`) |
| HP2 | `src/components/Contact.astro:112` | Honeypot wrapper without `aria-hidden="true"` | ✅ Killed (`Contact.test.ts:75`) |
| MQ1 | `src/components/Marquee.astro:17` | Second copy without `aria-hidden` | ✅ Killed (`Marquee.test.ts:33`) |
| SV1 | `src/components/Services.astro:4,8` | Services 01 and 02 swapped | ✅ Killed (`Services.test.ts:52`) |
| SV2 | `src/components/Services.astro:38` | `services.slice(0, 4)` (4 services) | ✅ Killed (2 failures, `Services.test.ts`) |
| IN1 | `src/components/Integrations.astro:6-7` | Steps 2 and 3 swapped | ✅ Killed (`Integrations.test.ts:20`) |
| SK1 | `src/layouts/BaseLayout.astro:84-85` | Skip link moved after the header slot | ✅ Killed (`BaseLayout.test.ts:116`) |
| HX1 | `src/components/Faq.astro:24` | FAQ `<h2>` → `<h1>` (second `<h1>` on the page) | ✅ Killed (3 failures: `Faq.test.ts`, `_index.test.ts`) |
| E400 | `src/scripts/contact-form.ts:108` | 400 with field errors shows the fallback instead of the field errors | ✅ Killed (`contact-form.test.ts:174`) |
| RV1 | `src/scripts/reveal.ts:9` | Without IntersectionObserver, return early and leave `.reveal` hidden | ✅ Killed (`reveal.test.ts:101`) |
| S1 | `src/components/Contact.astro:151` | `responseTime: prazo` → `responseTime: email` | ❌ **Survived** (unit 205/205, build 12/12) |
| S2 | `src/components/Contact.astro:151` | `whatsappPhone: whatsapp` → `whatsappPhone: email` | ❌ **Survived** (unit 205/205, build 12/12) |

**Sensor depth**: P0-expanded (20 manual behavior-level mutations: 4 re-runs of round-3 survivors, 16 fresh in areas no earlier round mutated)
**Result**: 17/20 killed. FAIL ❌ (L2b, S1, S2 survived)
**Isolation**: the real tree's `git status --porcelain` was the same before and after (`diff` empty): ` M .specs/STATE.md`, `?? .claude/`, `?? .specs/features/site-institucional/validation.md`. Inside the scratch, `git status --porcelain` showed only `?? node_modules` (the symlink) before removal. Then `git worktree remove --force` and `prune` ran, and `git worktree list` shows only the main tree. The real `node_modules` is intact (292 entries). `git stash` was not used, and the stash list is empty.

Why S1/S2 survive: `Contact.test.ts` renders the component with the Container API, which emits the `<script>` as a module reference and never runs it. `contact-form.test.ts:59-65` calls `initContactForm` with hand-built deps. `tests/build/secrets.test.ts` does not inspect the bundled script. So no test runs the three-name mapping at `Contact.astro:150-151`.

---

## Code Quality

| Principle | Status |
| --------- | ------ |
| Minimum code | ✅ Round 4 adds only tests and a fixture value |
| Surgical changes | ✅ No production file changed since round 3 |
| No scope creep | ✅ |
| Matches patterns | ✅ The fake clock is installed before `loadPost()`, and `afterEach` restores real timers (`_contato.test.ts:40-43`) |
| Spec-anchored outcome check | ❌ The FORM-02/03 hand-off is untested; LEGAL-02 adjacency is not asserted |
| Per-layer Coverage Expectation met | ⚠️ The browser-script layer covers `initContactForm`, but not the inline bootstrap that feeds it |
| Every test maps to a spec requirement | ✅ The new `describe`/`it` titles name FORM-02/03/09/11 |
| Documented guidelines followed | none (empty repo); strong defaults applied |

---

## Edge Cases

- [x] EDGE-01 double submit → one request
- [x] EDGE-02 >2000 characters
- [x] EDGE-03 HTML escaped
- [ ] EDGE-04 exactly 768 px (manual UAT)
- [x] EDGE-05 broken project image

---

## Gate Check

- **Gate command**: `npm run check && npm run build && npm test && npm run test:build`
- **Result**: exit 0. `astro check`: 66 files, 0 errors. `npm test`: 30 files, **205 passed**. `npm run test:build`: 1 file, **12 passed**
- **Test count before feature**: 0
- **Test count after round 3**: 215 (203 + 12)
- **Test count now**: 217 (205 + 12)
- **Delta since round 3**: +2 (dataset test, 60-minute window test). Two assertions changed their expected value along with their fixture (`Contact.test.ts:100` and `contact-form.test.ts:160`). Both still pin the configured value, now with a non-production string, so neither is weaker
- **Skipped tests**: none
- **Failures**: none

---

## Fix Plans

All three are **test-only**: production is correct today, as shown by the built `index.html` and the built `Contact.astro` script bundle quoted above. None is blocking.

### Fix 1: The page-to-script hand-off is untested (FORM-02 via S1, FORM-03 via S2, FORM-09). Major

- **Root cause**: `Contact.astro:150-151` destructures `form.dataset` and renames the fields into `initContactForm` deps inline, where no test runs.
- **Fix task**: move the mapping into `src/scripts/contact-form.ts`, for example as an exported `depsFromForm(form, fetch)` or an `initContactFormFromDataset(form, fetch)`. Make the inline script a one-line call. In `contact-form.test.ts`, put `data-whatsapp`, `data-email` and `data-prazo` on the markup with three distinct values, and assert that the success text, the WhatsApp href and the fallback mailto use them.
- **Done when**: S1 (`responseTime: email`) and S2 (`whatsappPhone: email`) are killed.

### Fix 2: The privacy link's position next to the button is not asserted (LEGAL-02 via L2b). Minor

- **Root cause**: `Contact.test.ts:108` searches the whole form for the link.
- **Fix task**: assert that the submit button and the `/privacidade` link share the same container, for example `button.parentElement.querySelector('a[href="/privacidade"]')` is not null, or that the privacy paragraph is the button's next element sibling.
- **Done when**: L2b is killed.

---

## Requirement Traceability Update

The Verifier does not edit `spec.md`. Proposed statuses:

| Requirement | Proposed status |
| ----------- | --------------- |
| FORM-02, FORM-03, LEGAL-02 | ❌ Needs Fix (test-only) |
| FORM-11 | ✅ Verified (round-3 gap closed) |
| FORM-09 | ✅ Verified for the script and attributes; the hand-off is covered by Fix 1 |
| FORM-13 | 🔍 Verified by static inspection (matrix) |
| RESP-01, RESP-05, RESP-06, EDGE-04, PAGE-13, A11Y-01, A11Y-02, SEO-05, ANIM-01..06, ANIM-10 (+ the scroll part of PAGE-06 and the breakpoint part of RESP-02) | 🖐 Pending UAT |
| All other IDs | ✅ Verified |

---

## Summary

**Overall**: ❌ Not Ready (gaps are test-only; none blocking)

**Spec-anchored check**: 47 of 50 automatable IDs match the spec outcome; 3 ❌ (FORM-02, FORM-03, LEGAL-02); 0 spec-precision gaps; 15 manual + 1 static
**Sensor**: 17/20 killed (L2b, S1, S2 survived)
**Gate**: 205 + 12 passed, 0 failed

**What works**:
- All four round-3 survivors (C1, C2, P1, W3) are killed. The 60-minute window is pinned at the real endpoint. The form's attributes carry the config, and the success text no longer accepts a hard-coded prazo.
- Fresh mutants are killed for the privacy page content, privacy link presence, honeypot `tabindex`/`aria-hidden`, marquee copy `aria-hidden`, service count and order, integration step order, skip-link position, the single `<h1>`, 400 field errors, and the no-IntersectionObserver fallback.

**Issues found**:
1. The inline bootstrap that turns `data-*` into deps is untested (Fix 1).
2. LEGAL-02's "next to the submit button" is not asserted (Fix 2).

**Next steps**: this was the extra round the user authorized, so the decision goes back to the user. The options are to apply Fixes 1–2 and verify again, or to accept the two test-only gaps. After that, run UAT on the manual checklist.

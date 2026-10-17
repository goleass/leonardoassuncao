# Guias por Nicho Validation

**Date**: 2026-10-17
**Spec**: `.specs/features/guias-nichos/spec.md`
**Diff range**: `eeb40fa..HEAD` (HEAD = `ef54a9c`, 14 task commits T1–T14)
**Verifier**: independent sub-agent (author ≠ verifier)

**Verdict: PASS ✅**

Every testable AC has a matching assertion, and the review ACs (GN-08 to GN-11, GN-14 to GN-16) hold in all 11 guides. 9 high-risk facts were checked against official sources; all are correct. 12 of 13 mutants were killed. The one survivor (M1b) checks the GN-11 mandatory cluster link, which `tasks.md:25` assigns to review rather than the test, and the review confirms that link in all 11 guides. It is listed as advisory A1, not a FAIL.

---

## Task Completion

| Task | Commit | Status |
| ---- | ------ | ------ |
| T1 link from `quanto-custa-um-site` to the custom-system cost guide | `ed01c1a` | ✅ Done (`src/content/guias/quanto-custa-um-site.md:107`) |
| T2 content test covers every guide file | `239a440` | ✅ Done |
| T3–T13 the 11 guides | `74aa5af` … `7a83b43` | ✅ Done |
| T14 require all 15 guides | `ef54a9c` | ✅ Done |

---

## Spec-Anchored Acceptance Criteria (mechanical)

All references are to `tests/content/guias.test.ts` unless noted.

| AC | Spec-defined outcome | `file:line` + assertion | Result |
| -- | -------------------- | ----------------------- | ------ |
| TEST-01 | CONT-02/03/04/05/07, COL-04, LINK-05 run on every `.md` in the folder | `:84-87` `readdirSync(DIR).filter(.md)`; `:120` `describe.each(files)`; the checks are at `:134-181` | ✅ |
| TEST-02 (map) | Map of 15 slugs → `servico`; wrong `servico` fails | `:7-12` LAUNCH (4) + `:15-71` NICHE (11) → `:74-77` EXPECTED; `:131` `expect(data.servico).toBe(servico)` | ✅ |
| TEST-02 (required set) | After T14, all 15 slugs must exist | `:80` `REQUIRED = Object.keys(EXPECTED)` (15); `:116-117` `expect(missing).toEqual([])` | ✅ |
| TEST-03 | A file outside the map fails, and the message names the slug | `:127` ``expect(Object.keys(EXPECTED), `guia fora do mapa: ${slug}`).toContain(slug)`` | ✅ |
| TEST-04 | Each body links to another `/guias/<slug>/` that has a file | `:166-169` filters to `files.includes(target) && target !== slug`; `expect(guides.length).toBeGreaterThan(0)` | ✅ |
| GN-01/12/13 | The 4/3/4 slugs exist with the GN-02 `servico`, `h1` and `title` | `:16-70` the entries match the spec table character for character (checked by reading); `:116`, `:131`, `:174-175` | ✅ |
| GN-02 | Exact `title` and `h1` | `:174` `expect(data.title).toBe(niche.title)`; `:175` `expect(data.h1).toBe(niche.h1)`. The values at `:18-69` match the spec's GN-02 table and the "Ordem por importância" questions | ✅ |
| GN-03 | ≥ 1.200 words in the body, excluding frontmatter and FAQ | `:91` body = text after the frontmatter (the FAQ lives in the frontmatter); `:142` `toBeGreaterThanOrEqual(1200)`; word counter self-test at `:110` | ✅ |
| GN-04 | ≥ 4 FAQ items (niche guides) | `:145` `min = niche ? 4 : 3`; `:149` `data.faq.length >= min` (all 11 have 5) | ✅ |
| GN-05 | ≥ 4 `##` headings | `:153` `body.match(/^## \S/gm).length >= min` (the 11 guides have 6–7) | ✅ |
| GN-06 | Canoas or Porto Alegre in the body | `:157` `toMatch(/Canoas\|Porto Alegre/)`. The "service area / local context" sentence is confirmed by review (below) | ✅ |
| GN-07 | Links to `/<servico>/` and to another guide | `:161` `toContain(`/${servico}/`)`; `:169` (TEST-04) | ✅ |
| EDGE-03 | A title over 60 characters fails | `:136` `title.length <= 60` plus the existing COL-04 schema | ✅ |
| EDGE-01 | Fallback link when the target guide is not published yet | Not triggered: wave order put every cluster target before its source guide (AC → extintores/portões, distribuidora → salgados) | ✅ N/A |

Build-test edits: `tests/build/inline-scripts.test.ts` (24 pages, the 11 new guides added), `tests/build/sitemap.test.ts` (23 indexable pages), `tests/build/secrets.test.ts` (11 new URLs in the sitemap). All three are exact-list `toEqual` assertions, and all pass.

---

## Review-Based ACs (per guide)

Paths are relative to `src/content/guias/`. "GN-15 §" and "GN-16 §" give the line of the `##` section. GN-15: every section names WhatsApp, paper and spreadsheet, and lists 4–5 losses specific to the niche. GN-16: every section has "costuma bastar quando" and "vale a pena quando" lists.

| Guide | GN-08 resumo (1st sentence answers h1) | GN-11 angle + mandatory cluster link | GN-14 cost | GN-15 § | GN-16 § |
| ----- | -------------------------------------- | ------------------------------------ | ---------- | ------- | ------- |
| bling-nao-sincroniza-pedidos | `:5` "Você precisa de uma integração personalizada quando o diagnóstico mostra que a falha não é de configuração…" ✅ | 6-step diagnosis + when the ready-made connector is not enough; `:96` → `/guias/integracao-bling-api/` ✅ | `:116` links the cost guide, 0 R$ ✅ | `:26` (duplicate NF-e, sale without stock, order never shipped, price/freight mismatch) ✅ | `:74` ✅ |
| portal-de-pedidos-para-distribuidora | `:5` "Para parar de receber… precisa dar ao cliente um lugar onde ele mesmo monte o pedido…" ✅ | B2B catalog, price per customer, minimum order, ERP; `:74` → `/guias/bling-nao-sincroniza-pedidos/` ✅ | `:96` link, 0 R$ ✅ | `:26` (lost order, wrong price table, misread item, below-minimum order, history stuck on a phone) ✅ | `:76` ✅ |
| sistema-ordem-de-servico-ar-condicionado | `:5` "…precisa agendar visitas, mandar a OS certa para o técnico certo…" ✅ | Field OS + PMOC + recurring preventive; `:105` → `/guias/quanto-custa-um-sistema-sob-medida/` ✅ | `:105` link, 0 R$ ✅ | `:26` (forgotten preventive, incomplete PMOC record, wrong address) ✅ | `:85` ✅ |
| software-recarga-de-extintores | `:5` "…cadastrar cada extintor… avisar… antes de cada vencimento" ✅ | Due dates per piece of equipment + customer alerts; `:83` → `/guias/sistema-ordem-de-servico-ar-condicionado/` ✅ | `:105` link, 0 R$ ✅ | `:26` (expired extinguisher not reported, forgotten hydrostatic test, extinguishers swapped between customers) ✅ | `:85` ✅ |
| portal-de-pedidos-salgados-congelados | `:5` "…deixa cada mercado e lanchonete fazer o próprio pedido até um horário de corte… planejar a produção por… lote" ✅ | Order cut-off → production by lot → route; `:24` → `/guias/portal-de-pedidos-para-distribuidora/`, and states it does not repeat the B2B catalog angle ✅ | `:102` link, 0 R$ ✅ | `:26` (over/under production per flavor, forgotten standing order, lot not traceable) ✅ | `:84` ✅ |
| quanto-custa-site-para-vidracaria | `:5` "…fica entre R$ 3.000 e R$ 10.000…" ✅ | Price + quote form by measurement; `:24` → `/guias/quanto-custa-um-site/` ✅ | The only guide with R$ (7 lines), dated "outubro de 2026" with named sources (`:28`) ✅ | `:68` (wrong measurement → tempered glass lost, wrong hardware color, quote never answered) ✅ | `:87` ✅ |
| sistema-aluguel-de-cacambas | `:5` "…registrar cada caçamba… em que endereço ela está… agendar entrega, troca e retirada…" ✅ | Delivery/swap/pickup per address, rental period, yard; `:99` → `/guias/integracao-rastreamento-veicular/` ✅ | `:119` link, 0 R$ ✅ | `:26` (skip left past the deadline, swap sent to the wrong site, skip location unknown) ✅ | `:101` ✅ |
| sistema-fabrica-de-uniformes | `:5` "…registrar cada pedido com a grade de tamanhos… transformar… numa ordem de produção…" ✅ | Size grid + artwork approval → production order by stage; `:109` → `/guias/quanto-custa-um-sistema-sob-medida/` ✅ | `:109` link, 0 R$ ✅ | `:26` (wrong size grid, unapproved artwork printed, embroidered name misspelled) ✅ | `:91` ✅ |
| portal-do-cliente-contabilidade | `:5` "Para organizar… precisa de um portal do cliente onde cada empresa tem um checklist…" ✅ | Custom vs ready-made portal + checklist per client; `:96` → `/guias/quanto-custa-um-sistema-sob-medida/` ✅ | `:96` link, 0 R$ ✅ | `:26` (document lost in chat, tax slip sent to the wrong client, history leaves with the analyst) ✅ | `:78` ✅ |
| sistema-portoes-automaticos | `:5` "…acompanhar cada cliente desde o pedido de orçamento… até a garantia e o contrato de manutenção…" ✅ | Technical visit → quote → installation → warranty/contract; `:24` → AC guide, and states it focuses on what is specific to gates ✅ | `:97` link, 0 R$ ✅ | `:26` (quote never followed up, wrong installation material, warranty not recorded) ✅ | `:79` ✅ |
| site-aluguel-de-inflaveis | `:5` "…mostra cada brinquedo… deixa o cliente escolher a data… ver quais brinquedos estão livres…" ✅ | Availability calendar per toy + quote by date; `:99` → `/guias/quanto-custa-um-site/` ✅ | `:99` link, 0 R$ ✅ | `:26` (double booking, date held without confirmation, toy under repair offered as free) ✅ | `:77` ✅ |

**GN-11 cannibalization.**
- Salgados × distribuidora: different primary queries (production by lot and cut-off vs. getting orders out of WhatsApp). Salgados explicitly defers the B2B catalog to the distribuidora guide (`portal-de-pedidos-salgados-congelados.md:24`).
- Portões × ar-condicionado × extintores: three different angles. Portões covers the sales funnel, installation and the CDC warranty. AC covers PMOC and preventive contracts. Extintores covers due dates per piece of equipment under NBR 12962 and Inmetro. Portões defers field OS to the AC guide (`sistema-portoes-automaticos.md:24`).

**GN-06 local sentence.** Every guide closes with a `##` "… de Canoas e Porto Alegre" section that contains "Eu … para empresas de Canoas, Porto Alegre e região". Examples: `bling-nao-sincroniza-pedidos.md:128`, `site-aluguel-de-inflaveis.md:115`. ✅

**GN-09 (no unconfirmed experience).** I grepped all 11 guides for client counts, years, results and "já fiz/atendi": 0 hits (the only "projetos" hit is a market-price sentence in vidraçaria `:28`). First-person statements are limited to "Eu desenvolvo/crio/atendo… para empresas de Canoas…" and `bling-nao-sincroniza-pedidos.md:112` "Eu trabalho com integrações entre ERPs, lojas e sistemas internos". That one is a general capability in the author's real domain, not a claim about the niche. ✅

---

## GN-10 / EDGE-02 Fact Spot-Checks (official sources)

| # | Claim (guide:line) | Source checked | Result |
| - | ------------------ | -------------- | ------ |
| 1 | Bling API: 3 req/s and 120k/day per account, 429 when exceeded, IP block (`bling-nao-sincroniza-pedidos.md:70`) | developer.bling.com.br/limites | ✅ Confirmed |
| 2 | Bling webhooks: 2xx within 5 s, retries for up to 3 days, then disabled until manually re-enabled; no ordering guarantee; duplicates possible (`bling…:66`, `:105`, FAQ `:15`) | developer.bling.com.br/webhooks | ✅ Confirmed |
| 3 | Bling refresh token valid for 30 days (`bling…:50`) | developer.bling.com.br/aplicativos | ✅ Confirmed |
| 4 | Lei 13.589/2018: PMOC required in buildings of public and collective use; refers to Anvisa Resolução 9/2003 and ABNT (`sistema-ordem-de-servico-ar-condicionado.md:72`, FAQ `:13`) | Lei 13.589/2018 text (Senado / Planalto) | ✅ Confirmed |
| 5 | Portaria GM/MS 3.523/1998 art. 6: technical manager required above 5 TR (15.000 kcal/h = 60.000 BTU/h); PMOC and record of execution kept available (`ar-condicionado.md:74`, resumo `:5`) | bvsms.saude.gov.br prt3523_28_08_1998 | ✅ Confirmed |
| 6 | Porto Alegre: Lei 10.474/2008; authorization at least 1 business day in advance via the "Licenças para Obras e Eventos" form; identification number, company name and phone on each side face; EPTC notice of Aug/2026 (`sistema-aluguel-de-cacambas.md:84`) | prefeitura.poa.br/eptc notice dated 12/08/2026 | ✅ Confirmed |
| 7 | Portaria FEPAM 576/2026: MTR Online mandatory; exemption for RCC except Classe D (`cacambas.md:88`, FAQ `:13`) | legisweb Portaria FEPAM 576 de 08/01/2026, art. 4º, III | ✅ Confirmed |
| 8 | RDC 727/2022: lot identification and shelf life are mandatory label items; Anvisa opened a revision in 2025 (`portal-de-pedidos-salgados-congelados.md:71`, FAQ `:15`) | Anvisa RDC 727 consolidated PDF (art. 7); Anvisa ROP 10/2025 vote | ✅ Confirmed. The "determinado pelo fabricante" wording was not located verbatim, but it matches the regulation's lot definition |
| 9 | ABNT NBR 15859, large inflatable toys, safety requirements and test methods (`site-aluguel-de-inflaveis.md:61`) | normas.com.br catalog (2010 edition, in force) | ✅ Confirmed |
| 10 | Portaria Inmetro 118/2021 (textile labeling); Portaria Inmetro 58/2022 (extinguisher inspection and maintenance); Portaria 314/2025 (QR Code seal, amends 58/2022) (`sistema-fabrica-de-uniformes.md:61`, `software-recarga-de-extintores.md:24`, `:71`) | DOU / legisweb / Inmetro | ✅ Confirmed |
| 11 | CDC art. 26 (90 days, apparent defects, durable goods and services, counted from delivery or end of service); art. 50 (contractual warranty complements the legal one, given by written term) (`sistema-portoes-automaticos.md:75`) | Lei 8.078/1990 (known text) | ✅ Confirmed |
| 12 | LGPD art. 46, security measures (`portal-do-cliente-contabilidade.md:76`) | Lei 13.709/2018 (known text) | ✅ Confirmed |

No incorrect fact found. Claims not independently checked, all attributed in the text:
- the Inmetro 2026 evaluation report on maintenance levels (`extintores.md:61`)
- the Omie API service list (`distribuidora.md:68`)
- the Locaweb and Método Viral price references (`vidracaria.md:28`)
- NBR 14207 and NBR 16259 (`vidracaria.md:47`); titles consistent with the ABNT catalog

---

## Discrimination Sensor

Scratch: a temporary `git worktree` of HEAD under the scratchpad, with `node_modules` symlinked. Each mutant was reset with `git checkout -- . && git clean`. Runner: `npx vitest run tests/content`. Baseline M0: 163/163 pass.

| # | File | Mutation | Killed? (failing test) |
| - | ---- | -------- | ---------------------- |
| M1 | `sistema-portoes-automaticos.md` | Replaced every `/guias/` link with non-guide links | ✅ TEST-04 `:169` |
| M1b | `sistema-portoes-automaticos.md` | Removed only the GN-11 mandatory cluster link (the cost-guide link remains) | ❌ Survived. By design: `tasks.md:25` assigns GN-11 to Verifier review; see A1 |
| M2 | `software-recarga-de-extintores.md` | FAQ 5 → 3 | ✅ GN-04 `:149` |
| M3 | `sistema-aluguel-de-cacambas.md` | `title` "Aluguel" → "Locação" | ✅ GN-02 `:174` |
| M4 | `site-aluguel-de-inflaveis.md` | Deleted a required guide | ✅ TEST-02 `:117` |
| M5 | new `guia-fora-do-mapa.md` | Added a guide that is not in the map | ✅ TEST-03 `:127` (+ `:131`) |
| M6 | `sistema-fabrica-de-uniformes.md` | Removed Canoas/Porto Alegre | ✅ GN-06 `:157` |
| M7 | `portal-do-cliente-contabilidade.md` | `servico` sistemas-web → software-sob-medida | ✅ TEST-02 `:131` |
| M8 | `quanto-custa-site-para-vidracaria.md` | `##` 7 → 3 | ✅ GN-05 `:153` |
| M9 | `portal-de-pedidos-para-distribuidora.md` | `h1` changed | ✅ GN-02 `:175` |
| M10 | `bling-nao-sincroniza-pedidos.md` | Service link `/integracoes/` removed | ✅ GN-07 `:161` |
| M11 | `sistema-ordem-de-servico-ar-condicionado.md` | Body truncated (< 1.200 words) | ✅ GN-03 `:142` (+ GN-05) |
| M12 | `bling-nao-sincroniza-pedidos.md` | Guide links point to slugs that do not exist | ✅ TEST-04 `:168` |

**Sensor depth**: lightweight+ (13 mutations).
**Result**: 12/13 killed. The 1 survivor is outside the automated scope by design → PASS ✅

**Isolation.** Real-tree `git status --porcelain` before = `?? .claude/` and after = `?? .claude/` (identical). The worktree was removed and pruned, and `git worktree list` shows only the main tree.

---

## Code Quality

| Check | Status |
| ----- | ------ |
| Minimum code: one test file widened; build tests changed only by list extension | ✅ |
| Surgical changes: no page, route, sitemap or `llms.txt` code touched (matches the Goal); T1 is one sentence | ✅ |
| Matches patterns: same frontmatter and section shape as the 4 launch guides | ✅ |
| Spec-anchored outcomes: thresholds 4/1.200/60 and exact titles match the spec | ✅ |
| Every test maps to an AC (TEST-01..04, GN-02..07, CONT/COL/LINK) | ✅ |
| Test integrity: no test removed; the launch guides keep the ≥ 3 thresholds (`:145`) | ✅ |
| Guidelines: `.specs` spec + tasks Test Coverage Matrix (`tasks.md:25`) | ✅ |

---

## Gate Check

- **Command**: `npm run check && npm test && npm run build && npm run test:build` → exit 0
- `astro check`: 118 files, 0 errors, 0 warnings
- `npm test`: 53 files, 676 tests passed, 0 failed, 0 skipped
- `npm run build`: OK (24 HTML pages)
- `npm run test:build`: 6 files, 120 tests passed, 0 failed

---

## Advisories (non-blocking)

- **A1 (GN-11, test precision).** The mandatory cluster link per guide is checked only by review. A guide could lose its GN-11 link and still pass as long as it links any other existing guide (mutant M1b). Today all 11 links are present. Suggested fix: add `cluster` to each `NICHE` entry in `tests/content/guias.test.ts:15-71` and assert `expect(links).toContain(niche.cluster)`.
- **A2 (traceability).** `spec.md`'s Requirement Traceability still says "Implementing". The orchestrator should mark the rows Verified; the Verifier does not edit spec files.

---

## Summary

**Overall**: ✅ Ready (pending the user review before each wave's merge, per the spec)
**Spec-anchored check**: 14/14 mechanical ACs matched the spec outcome; review ACs GN-08/09/10/11/14/15/16 and EDGE-02 pass for all 11 guides
**Sensor**: 12/13 killed (1 by-design survivor, A1)
**Gate**: 676 + 120 passed

## Correção pós-verificação

- Mutante sobrevivente M1b (link de cluster de GN-11 removido de `sistema-portoes-automaticos`) virou tarefa de correção: `tests/content/guias.test.ts` agora tem o campo `cluster` por guia de nicho e o teste "liga para o guia de cluster de GN-11" exige o link exato.
- Reexecução do M1b após a correção: **morto** (1 falha: `sistema-portoes-automaticos > liga para o guia de cluster de GN-11`); arquivo restaurado, `npm test` = 687 passando.
- Sensor final: 13 mutações, 13 mortas, 0 sobreviventes.

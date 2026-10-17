# Guias de Conteúdo Validation

## Validation: guias-conteudo - PASS ✅

**Result**: PASS

**Date**: 2026-10-17
**Spec**: `.specs/features/guias-conteudo/spec.md`
**Diff range**: `379f532..5535607` (branch `feat/guias-conteudo`, 22 feature commits)
**Verifier**: independent sub-agent (author ≠ verifier)

---

## Task Completion

| Task | Status | Notes |
| ---- | ------ | ----- |
| T1–T17 | ✅ Done | Every task heading in tasks.md is marked ✅ and has a matching commit in the range (34acf55 … 5d01009), plus fixes c43b170 (60-char titles) and 5535607 (drafts by MODE). Bookkeeping: the per-task "Done when" boxes in tasks.md are still `- [ ]` and the header says "Status: Draft". Cosmetic; not a gap. |

---

## Gate Check

- **Gate command**: `npm run check && npm test && npm run build && npm run test:build`
- `npm run check`: 0 errors, 0 warnings, 1 hint (118 files)
- `npm test`: **547 passed**, 0 failed, 0 skipped (53 files)
- `npm run build`: exit 0
- `npm run test:build`: **69 passed**, 0 failed, 0 skipped (6 files)
- **Unit test count before feature** (379f532, same command, run in a scratch worktree): 423
- **After**: 547. **Delta**: +124. No tests deleted. Existing assertions were changed only to add the new pages/link (`Header.test.ts` lists now include "Guias"; `inline-scripts`, `secrets` and `sitemap` build tests list the 3 new pages). None were weakened.
- `tests/build/secrets.test.ts` now builds without vitest's `NODE_ENV/DEV/MODE/PROD/SSR/BASE_URL` variables. Those variables would otherwise publish drafts. This is correct and documented inline.

---

## Spec-Anchored Acceptance Criteria

### P1: Coleção de guias validada

| AC | Spec-defined outcome | `file:line` + assertion | Result |
| -- | -------------------- | ----------------------- | ------ |
| COL-01 | One file per guide in `src/content/guias/`; slug = file name | `src/lib/guias/guias.test.ts:28` - `expect(g.slug).toBe("meu-guia")` (id→slug); `src/content.config.ts:10` `generateId` strips `.md`; `tests/build/guias.test.ts:59` - `existsSync(dist/guias/<slug>/index.html)` true for the file names | ✅ PASS |
| COL-02 | Required title, description, h1, resumo, servico, publishedAt; optional updatedAt, faq `{q,a}[]`, draft default false | `src/lib/guias/schema.test.ts:43` - `expect(issuePaths(rest)).toContain(field)` for each of the 6 fields; `:28-29` - `faq` `toEqual([])`, `draft` `toBe(false)`; `:35-36` faq `{q,a}` and `draft: true` accepted | ✅ PASS |
| COL-03 | Unknown `servico` → build fails naming the file | `src/lib/guias/schema.test.ts:56` - `expect(issuePaths({...servico:"marketing"})).toEqual(["servico"])`; `:51` all 5 slugs accepted. The file name comes from Astro's `InvalidContentEntryDataError`. In the scratch run (`servico: marketing`), the build failed with `guias → integracao-bling-api … src/content/guias/integracao-bling-api.md` | ⚠️ PASS: the file-name clause comes from the framework and is confirmed by hand only (see gap 2) |
| COL-04 | title outside 30–60 / description outside 70–160 → fails naming file and field | `src/lib/guias/schema.test.ts:67-68` - 29 and 61 chars `toEqual(["title"])`; `:77-78` - 69 and 161 chars `toEqual(["description"])`; `:62-63,72-73` 30/60/70/160 accepted | ⚠️ PASS: the field is asserted; the file name comes from the framework (gap 2) |
| COL-05 | Slug not matching `^[a-z0-9]+(-[a-z0-9]+)*$` → fails naming file | `src/lib/guias/guias.test.ts:43` - `toThrow(\`guias/${slug}.md\`)` for `Guia_1`, `guia--x`, `-guia`, `guia-`; `src/lib/guias/collection.test.ts:54` - `rejects.toThrow("guias/Guia_1.md")` | ✅ PASS |
| COL-06 | updatedAt < publishedAt → fails naming file | `src/lib/guias/schema.test.ts:88` - `toEqual(["updatedAt"])`; `:84` equal dates accepted. In the scratch run, the build failed with `updatedAt anterior a publishedAt` and named the .md file | ⚠️ PASS: the file name comes from the framework (gap 2) |
| COL-07 | `draft:false` with `[PREÇO:`, `[REVISAR:` or `[...]` in frontmatter or body → fails naming file | `src/lib/guias/guias.test.ts:53-54` - each of the 3 markers in the body `toThrow("guias/com-marcador.md")`; `:59,62` frontmatter (resumo, faq) `toThrow("guias/guia-a.md")`; `:67` a draft with markers does `not.toThrow()`. In the scratch run, adding `[REVISAR: dado]` to a published guide failed the build with `guias/integracao-bling-api.md: marcador pendente "[REVISAR:"` | ✅ PASS |
| COL-08 | Draft not generated; not in /guias/, service pages, related lists, sitemap, llms.txt | `src/lib/guias/guias.test.ts:77` - `includeDrafts:false` → `toEqual(["publicado"])`; `src/lib/guias/collection.test.ts:43` - MODE=production `some(g=>g.draft)` false; `tests/build/guias.test.ts:52-56` - draft dir absent, not in sitemap, llms.txt or hub HTML. Service pages and related lists get their guides only from `loadGuides()` (`src/pages/[servico].astro`, `src/pages/guias/[slug].astro:16`) | ✅ PASS (service/related exclusion is covered through the shared loader; no build-level assertion, see gap 4) |
| COL-09 | `astro dev` renders drafts | `src/lib/guias/collection.test.ts:48` - MODE=development → `toEqual(["rascunho","recente","antigo"])`; `src/lib/guias/guias.test.ts:81` `includeDrafts:true` keeps drafts | ⚠️ PASS: the loader branch is asserted; no automated test renders a page on the dev server (gap 4) |

### P1: Página do guia

| AC | Spec-defined outcome | `file:line` + assertion | Result |
| -- | -------------------- | ----------------------- | ------ |
| PAGE-01 | One static page per non-draft guide | `src/pages/guias/_slug.test.ts:59` - `paths.map(p=>p.params.slug)` `toEqual([...6 slugs])`; `tests/build/guias.test.ts:59` page exists for each published guide | ✅ PASS |
| PAGE-02 | `<title>`=title, meta description=description, single `<h1>`=h1 | `src/pages/guias/_slug.test.ts:82-85` - title `toBe(principal.title)`, meta `toBe(principal.description)`, `h1` `toHaveLength(1)` and text `toBe(principal.h1)`; `tests/build/guias.test.ts:77` built title = frontmatter title | ✅ PASS |
| PAGE-03 | Before the body: resumo; author "Leonardo Gomes Assunção" → `site.linkedin`; "Publicado em <data>" in `<time datetime>` | `src/pages/guias/_slug.test.ts:94` resumo before `.guide__body`; `:97` author href `toBe(site.linkedin)`, `:98` before body; `:101-103` `time[datetime="2026-10-17"]` text `"17 de outubro de 2026"`, parent contains `"Publicado em 17 de outubro de 2026"`, before body | ✅ PASS (date format note: gap 1) |
| PAGE-04 | With updatedAt: "Atualizado em <data>" in `<time datetime>` | `src/pages/guias/_slug.test.ts:108-109` - `time[datetime="2026-11-03"]` → `"3 de novembro de 2026"`, parent contains `"Atualizado em 3 de novembro de 2026"`; `:202-203` absent without updatedAt, a single `<time>` | ✅ PASS |
| PAGE-05 | Breadcrumb Início › Guias › h1, links `/` and `/guias/` | `src/pages/guias/_slug.test.ts:119-123` - links `toEqual([["Início","/"],["Guias","/guias/"]])`, `aria-current` = h1 | ✅ PASS |
| PAGE-06 | Ends with a CTA naming the service, linking `/<servico>/`, `#contato`, `https://wa.me/<whatsapp>` | `src/pages/guias/_slug.test.ts:128-133` - text contains "Software sob medida"; hrefs `toEqual(["/software-sob-medida/","#contato","https://wa.me/${site.whatsapp}"])`; the CTA comes after the body and the FAQ; `:218-219` second service (`/integracoes/`) | ✅ PASS |
| PAGE-07 | Each faq item as `<details>` under "Perguntas frequentes" | `src/pages/guias/_slug.test.ts:142` - `[summary, answer]` pairs `toEqual(principal.faq.map(...))` inside the section with that heading | ✅ PASS |
| PAGE-08 | Up to 3 related guides of the same service, most recent first, under "Leia também" | `src/pages/guias/_slug.test.ts:69` - `related` `toEqual(["guia-b","guia-a","guia-c"])` (4 candidates, the oldest dropped); `:148-152` rendered links in order; `src/lib/guias/guias.test.ts:121` `related` `toEqual(["rel-4","rel-3","rel-2"])` | ✅ PASS |
| PAGE-09 | Contact section `#contato` | `src/pages/guias/_slug.test.ts:156` - `section#contato form` action `toBe("/api/contato")` | ✅ PASS |
| PAGE-10 | No inline executable scripts | `src/pages/guias/_slug.test.ts:163` - inline non-JSON-LD scripts `toHaveLength(0)`; `tests/build/inline-scripts.test.ts:12-14` guide pages included in the built-page scan | ✅ PASS |

### P1: Página índice /guias/

| AC | Spec-defined outcome | `file:line` + assertion | Result |
| -- | -------------------- | ----------------------- | ------ |
| HUB-01 | `<title>` exactly "Guias de Sites, Sistemas e Integrações \| Leonardo Assunção"; description 70–160 | `src/pages/guias/_index.test.ts:51` - `toBe("Guias de Sites, Sistemas e Integrações \| Leonardo Assunção")`; `:53-54` length ≥70 and ≤160 | ✅ PASS |
| HUB-02 | One `<h2>` per service that has guides, in `services.ts` order | `src/pages/guias/_index.test.ts:62` - `toEqual(["Criação de sites","Integrações e APIs"])` (input order was integracoes first) | ✅ PASS |
| HUB-03 | Each guide: link `/guias/<slug>/`, h1 text, description, `updatedAt ?? publishedAt` | `src/pages/guias/_index.test.ts:86-101` - `toEqual([{href,text,description,datetime:"2026-11-03",date:"3 de novembro de 2026"}, …])` (updatedAt used when present) | ✅ PASS |
| HUB-04 | Within a group: most recent first | `src/pages/guias/_index.test.ts:86` (bling with updatedAt 11-03 before rastreamento 10-17); `:107` reversed props still `toEqual([...])` in order; `src/lib/guias/guias.test.ts:110` `guidesFor` → `["c","a"]` | ✅ PASS |
| HUB-05 | Each group links `/<servico>/` | `src/pages/guias/_index.test.ts:69` - `toEqual(["/criacao-de-sites/","/integracoes/"])` | ✅ PASS |
| HUB-06 | Breadcrumb Início › Guias | `src/pages/guias/_index.test.ts:113-114` - `["Início","/"]`, `aria-current` = "Guias" | ✅ PASS |

### P1: Links internos

| AC | Spec-defined outcome | `file:line` + assertion | Result |
| -- | -------------------- | ----------------------- | ------ |
| LINK-01 | "Guias sobre <name>" with that service's guides, most recent first, links `/guias/<slug>/` | `src/pages/_servico.test.ts:150` - `getStaticPaths` per-service `toEqual({... integracoes: ["integracao-rastreamento-veicular","integracao-bling-api"] ...})`; `:161` heading `toBe("Guias sobre Integrações e APIs")`; `:163` links `toEqual([...])` | ✅ PASS |
| LINK-02 | No guides → no "Guias sobre" section | `src/pages/_servico.test.ts:174-175` - `section(doc)` `toBeUndefined()`, no `main a[href^="/guias/"]` | ✅ PASS |
| LINK-03 | Header "Guias" → `/guias/`, after "Processo" | `src/components/Header.test.ts:41-43` - href `toBe("/guias/")`, `texts[indexOf("Processo")+1]` `toBe("Guias")` with and without projects; `:59` full order `toEqual([... "Processo","Guias","Projetos","Fale comigo"])` | ✅ PASS |
| LINK-04 | Footer "Guias" → `/guias/` | `src/components/Footer.test.ts:36` - `toEqual(["/guias/"])` | ✅ PASS |
| LINK-05 | Each launch guide links `/<servico>/` and one other site page | `tests/content/guias.test.ts:81-82` - `links` `toContain(\`/${servico}/\`)` and other internal links `> 0`, for each of the 4 guides | ✅ PASS |

### P1: Dados estruturados e sitemap

| AC | Spec-defined outcome | `file:line` + assertion | Result |
| -- | -------------------- | ----------------------- | ------ |
| LD-01 | Article: headline=h1, description, datePublished, dateModified=`updatedAt ?? publishedAt`, author `/#leonardo`, publisher `/#empresa`, mainEntityOfPage=guide URL, inLanguage pt-BR, about `{Service,name,url}` | `src/lib/seo/schema.test.ts:198-208` - `toEqual({...})` on the whole node, with every field by value (payload rule met: all 10 fields); `:213` without updatedAt `dateModified` `toBe("2026-10-01")`; page level `src/pages/guias/_slug.test.ts:168-176` (headline, dates, mainEntityOfPage, about) | ✅ PASS |
| LD-02 | BreadcrumbList Início, Guias, h1 | `src/pages/guias/_slug.test.ts:181` - `[position,name,item]` `toEqual([[1,"Início",…/],[2,"Guias",…/guias/],[3,h1,…/guias/<slug>/]])` | ✅ PASS |
| LD-03 | FAQPage = visible questions/answers | `src/pages/guias/_slug.test.ts:190` - `mainEntity` `[name, acceptedAnswer.text]` `toEqual(principal.faq…)` | ✅ PASS |
| LD-04 | CollectionPage with `hasPart` = each non-draft guide URL; BreadcrumbList Início, Guias | `src/pages/guias/_index.test.ts:118` - `hasPart.map(url)` `toEqual(guides.map(...))`; `:122` breadcrumb `toEqual([[1,"Início",…],[2,"Guias",…]])`; `src/lib/seo/schema.test.ts:223-226` node type/url/hasPart | ✅ PASS |
| SMAP-01 | Sitemap lists `/guias/` and every non-draft guide | `tests/build/sitemap.test.ts:30` - exact path list including `GUIDE_PAGES`; `tests/build/secrets.test.ts:109-114` exact URL list; `tests/build/guias.test.ts:37,43` | ✅ PASS |
| SMAP-02 | Guide lastmod = `updatedAt ?? publishedAt` | `src/lib/seo/lastmod.test.ts:125-132` - `lastmod: "2026-10-10"` (updatedAt) and `"2026-08-15"` (publishedAt), git not called; `:101` with/without quotes, drafts skipped; `tests/build/guias.test.ts:37` built lastmod time = frontmatter time | ✅ PASS |
| SMAP-03 | `/guias/` lastmod = newest among non-draft guides | `src/lib/seo/lastmod.test.ts:138` - `lastmod: "2026-10-10"` with a newer draft (12-01) ignored; `tests/build/guias.test.ts:43` = `Math.max(...)` | ✅ PASS (build-level check can't tell max from min because all guides share 2026-10-17; the unit test does, see mutant M9) |

### P1: llms.txt

| AC | Spec-defined outcome | `file:line` + assertion | Result |
| -- | -------------------- | ----------------------- | ------ |
| LLMS-01 | `## Guias` with `- [<h1>](<abs URL>): <resumo>`, most recent first | `src/lib/seo/llms.test.ts:87-90` - lines `toEqual(["- [Quanto custa um site](https://www.exemplo.com.br/guias/quanto-custa-um-site/): Resumo do custo.", "- [Como integrar o Bling via API](…): Resumo do Bling."])` (input order reversed); `src/pages/_llms.test.ts:47-50` route body `toBe(llmsText(...,[guia]))` and contains the exact line | ✅ PASS |
| LLMS-02 | No non-draft guides → no `## Guias` | `src/lib/seo/llms.test.ts:94-95` - `not.toContain("## Guias")` (default and `[]`) | ✅ PASS |
| LLMS-03 | "Páginas" lists `/guias/` | `src/lib/seo/llms.test.ts:101` - "Páginas" section `toContain(linhaGuias)` with and without guides | ✅ PASS |

### P1: Os 4 guias do lançamento

| AC | Spec-defined outcome | `file:line` + assertion | Result |
| -- | -------------------- | ----------------------- | ------ |
| CONT-01 | The 4 slugs with their servico | `tests/content/guias.test.ts:44` - `present` `toEqual(Object.keys(LAUNCH))`; `:52` `data.servico` `toBe(servico)` | ✅ PASS |
| CONT-02 | ≥1.200 body words, excluding frontmatter and FAQ | `tests/content/guias.test.ts:63` - `countWords(body)` `toBeGreaterThanOrEqual(1200)` (FAQ lives in frontmatter, so it is excluded); counter self-test `:38` `toBe(13)` | ✅ PASS |
| CONT-03 | ≥3 FAQ items | `tests/content/guias.test.ts:68` - `data.faq.length` `toBeGreaterThanOrEqual(3)` | ✅ PASS |
| CONT-04 | ≥3 `<h2>` phrased as the reader's questions or tasks | `tests/content/guias.test.ts:72` - `^## ` count `≥ 3`. Phrasing checked by hand: 5–6 of the 7 `##` headings per guide are questions (e.g. `integracao-bling-api.md:23` "O que dá para automatizar com a API do Bling?") | ⚠️ PASS: the count is automated; the phrasing needs human judgment (gap 3) |
| CONT-05 | Canoas or Porto Alegre in the body, in a sentence about service area or local context | `tests/content/guias.test.ts:76` - `toMatch(/Canoas\|Porto Alegre/)`. Context checked by hand: each guide's last section (`quanto-custa-um-site.md:105`, `integracao-bling-api.md:114`, `integracao-rastreamento-veicular.md:86`, `quanto-custa-um-sistema-sob-medida.md:107`) is about the service area | ⚠️ PASS: presence is automated; the context needs human judgment (gap 3) |
| CONT-06 | No unconfirmed clients, project counts, years of experience or results | Human-review item by design; spot-check below | 👁 Human review (spot-check clean) |
| CONT-07 | "quanto custa" guide with `[PREÇO:` ⇒ `draft: true` | `tests/content/guias.test.ts:86` - `if includes("[PREÇO:") expect(data.draft).toBe(true)`; `tests/build/guias.test.ts:31` both "quanto custa" guides `draft` `toEqual([true,true])`; also enforced at build by COL-07 | ✅ PASS |

### Edge cases

| AC | Spec-defined outcome | `file:line` + assertion | Result |
| -- | -------------------- | ----------------------- | ------ |
| EDGE-01 | No guides → "Os primeiros guias estão a caminho." and no group | `src/pages/guias/_index.test.ts:139-140` - `toContain("Os primeiros guias estão a caminho.")`, `main h2` `toHaveLength(0)` | ✅ PASS |
| EDGE-02 | Only guide of its service → no "Leia também" | `src/pages/guias/_slug.test.ts:207` - `not.toContain("Leia também")`; `:70` `related` `toEqual([])`; `src/lib/guias/guias.test.ts:125` | ✅ PASS |
| EDGE-03 | >3 related → only the 3 most recent | `src/pages/guias/_slug.test.ts:69`; `src/lib/guias/guias.test.ts:121` - `toEqual(["rel-4","rel-3","rel-2"])` | ✅ PASS |
| EDGE-04 | Empty faq → no "Perguntas frequentes" and no FAQPage | `src/pages/guias/_slug.test.ts:211-213` - heading `toBeUndefined()`, `details` length 0, FAQPage `toBeUndefined()` | ✅ PASS |

**Status**: ✅ All 51 ACs have evidence (50 automated + CONT-06, which is human review by design). ⚠️ 4 spec-precision / partial-evidence gaps are flagged below. None of them is a behavior failure.

---

## Spec-Precision Gaps (non-blocking)

1. **PAGE-03 / PAGE-04 date format "dd de mês de aaaa"**: "dd" reads as zero-padded ("03 de novembro"), but `Intl` pt-BR `dateStyle: "long"` gives "3 de novembro de 2026", and the test (`src/pages/guias/_slug.test.ts:108`) asserts the unpadded form. The tasks.md Done-when only fixes "17 de outubro de 2026", which doesn't settle it. The implementation follows standard pt-BR usage. The spec wording should say "d de mês de aaaa".
2. **COL-03 / COL-04 / COL-06 "naming the guide file"**: the tests assert schema rejection and the field path. The file name comes from Astro's `InvalidContentEntryDataError`, which no automated test asserts. I confirmed it by hand in a scratch build (the build fails, and the output names `src/content/guias/integracao-bling-api.md` and the field).
3. **CONT-04 / CONT-05 qualitative clauses**: "phrased as the reader's questions or tasks" and "in a sentence about service area or local context" can't be tested mechanically. The tests cover count and presence; I checked phrasing and context by hand and both pass.
4. **COL-08 / COL-09 surface coverage**: draft exclusion from service pages and related lists, and draft rendering on the dev server, follow from the single `loadGuides()` source plus its MODE unit tests. No build-level or dev-server test asserts them directly.

---

## Discrimination Sensor

Run in a temporary `git worktree` at HEAD (`<scratchpad>/verify-wt`, node_modules symlinked). One mutation at a time; the file was restored after each run. Then the worktree was removed with `git worktree remove --force`. Real-tree `git status --porcelain` before = after = `?? .claude/` (baseline match confirmed).

| # | File:line | Mutation | Tests run | Killed? |
| - | --------- | -------- | --------- | ------- |
| M1 | `src/lib/guias/guias.ts:43` | Draft filter inverted (`!g.draft` → `g.draft`) | `src/lib/guias` | ✅ Killed (5 failed) |
| M2 | `src/lib/guias/guias.ts:40` | Marker check removed (`if (false && marker) throw`) | `src/lib/guias` | ✅ Killed (4 failed) |
| M3 | `src/lib/guias/guias.ts:50` | `related` limit 3 → 4 | `src/lib/guias`, `src/pages/guias` | ✅ Killed (2 failed) |
| M4 | `src/lib/guias/guias.ts:52` | `related` stops excluding self | `src/lib/guias`, `src/pages/guias` | ✅ Killed (3 failed) |
| M5 | `src/lib/seo/schema.ts:112` | `dateModified` always `publishedAt` | `src/lib/seo`, `src/pages/guias` | ✅ Killed (2 failed) |
| M6 | `src/pages/guias/index.astro:20` | Hub group sorted ascending (`.reverse()`) | `src/pages/guias` | ✅ Killed (2 failed) |
| M7 | `src/pages/[servico].astro:101` | "Guias sobre" rendered when empty (`> 0` → `>= 0`) | `src/pages/_servico.test.ts` | ✅ Killed (1 failed) |
| M8 | `src/lib/seo/llms.ts:28` | `## Guias` always emitted | `src/lib/seo`, `src/pages/_llms.test.ts` | ✅ Killed (1 failed) |
| M9 | `src/lib/seo/lastmod.ts:74` | `/guias/` lastmod uses the oldest date (`.at(-1)` → `.at(0)`) | `src/lib/seo` | ✅ Killed (1 failed) |
| M10 | `src/lib/seo/lastmod.ts:62` | lastmod ignores `draft: true` | `src/lib/seo` | ✅ Killed (3 failed) |
| M11 | `src/lib/guias/collection.ts:7` | Back to `import.meta.env.DEV` (the regression fixed in 5535607) | `src/lib/guias` | ✅ Killed (2 failed) |
| M12 | `src/pages/guias/[slug].astro:36` | FAQPage emitted for empty faq | `src/pages/guias` | ✅ Killed (1 failed) |
| M13 | `src/components/Header.astro:15` | "Guias" moved after "Projetos" | `src/components/Header.test.ts` | ✅ Killed (2 failed) |
| M14 | `src/lib/seo/schema.ts:128` | `hasPart` drops the first guide | `src/lib/seo`, `src/pages/guias` | ✅ Killed (2 failed) |

**Sensor depth**: expanded (14 behavior-level mutations; this is the site's SEO surface)
**Result**: 14/14 killed - PASS ✅

---

## Code Quality

| Principle | Status |
| --------- | ------ |
| Minimum code | ✅ Pure `guias.ts` / `schema.ts`; one `astro:content` touchpoint (`collection.ts`) |
| Surgical changes | ⚠️ Minor: `package-lock.json` drops 243 lines of extraneous `@vercel/*`/execa entries that are not in package.json (lockfile pruning in 5535607 while adding `yaml`). Harmless, but unrelated churn. `[servico].astro` styles moved to the shared `src/styles/article.css` (T4, planned) |
| No scope creep | ✅ |
| Matches patterns | ✅ Same render/test helpers, `_`-prefixed page tests, JSON-LD `@graph` |
| Spec-anchored outcome check | ✅ (gaps flagged above) |
| Per-layer coverage | ✅ Domain 1:1 (schema, selection, related, lastmod, llms); pages cover happy + empty/edge paths; build tests cover the output |
| Every test maps to a requirement | ✅ Test names cite AC ids |
| Documented guidelines followed | none found in the repo (no CLAUDE.md/AGENTS.md); strong defaults applied |

Observation (not a gap): `lastmod.ts` reads guide dates with a regex on the frontmatter instead of the zod schema, because `astro.config.mjs` can't import Astro modules. A `draft:` value written in another YAML spelling (`draft: yes`, or `draft: true # comment`) would be read as published by the sitemap only. Such a guide is still filtered out of page generation, so no sitemap URL is emitted for it, but it could raise `/guias/` lastmod. Low risk.

---

## CONT-06 Spot-Check (human-review item)

- None of the 4 guides names a client, project count, years of experience or customer result. First-person claims are limited to service area ("Eu atendo empresas de Canoas, Porto Alegre e região metropolitana…") and how a project is run.
- The two "quanto custa" guides contain no invented prices: every value is a `[PREÇO: …]` marker, and both are `draft: true`.
- **For the owner to verify before deploy**: the Bling guide states third-party technical facts: API v3 with OAuth 2.0; a limit of 3 requests/s and 120,000/day per account; webhook retries for up to 3 days, then deactivation; a 5-second webhook response window; no ordering guarantee. These aren't claims about the user, but they must match developer.bling.com.br. The vehicle-tracking guide cites the LGPD (Lei nº 13.709) and the BR-116 logistics corridor (`integracao-rastreamento-veicular.md:86`), which is general context.

---

## Execution History (signals surfaced during Execute, already fixed)

- **Spec conflict, title length** (fixed in c43b170): the hub title in the original spec was 61 characters, against the site-wide 60-character rule (SEO-08, `tests/build/titles.test.ts`). The spec and titles were corrected; HUB-01 now asserts the 58-character title.
- **Draft-publishing risk** (fixed in 5535607): `loadGuides` originally used `import.meta.env.DEV`, which environment variables can set (vitest exports `DEV=1`, and the Astro build inherited it), so a production build could have published drafts. It now uses `MODE === "development"`; mutant M11 confirms the regression is caught.

---

## Requirement Traceability Update

| Requirement | Previous Status | New Status |
| ----------- | --------------- | ---------- |
| COL-01…COL-09, PAGE-01…PAGE-10, HUB-01…HUB-06, LINK-01…LINK-05, LD-01…LD-04, SMAP-01…SMAP-03, LLMS-01…LLMS-03, CONT-01…CONT-05, CONT-07, EDGE-01…EDGE-04 | Implementing | ✅ Verified |
| CONT-06 | Implementing | 👁 Pending owner review (spot-check clean) |

---

## Summary

**Overall**: ✅ Ready (pending owner review of CONT-06 and the Bling technical figures, and the price fills for the 2 drafts)

**Spec-anchored check**: 50/50 automatable ACs matched the spec outcome; 4 spec-precision / partial-evidence gaps flagged (non-blocking)
**Sensor**: 14/14 mutations killed
**Gate**: check 0 errors; 547 unit + 69 build tests passed, 0 failed, 0 skipped

**Next steps**: fix the spec wording "dd" → "d" (PAGE-03/04); the owner fills the `[PREÇO:]` markers and flips `draft` on the 2 "quanto custa" guides; the owner checks the Bling API limits against the official docs.

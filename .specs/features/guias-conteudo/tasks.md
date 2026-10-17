# Guias de Conteúdo — Tasks

## Execution Protocol (MANDATORY -- do not skip)

Implement these tasks with the `tlc-spec-driven` skill: **activate it by name and follow its Execute flow and Critical Rules.** Do not search for skill files by filesystem path. The skill is the source of truth for the full flow (per-task cycle, sub-agent delegation, adequacy review, Verifier, discrimination sensor).

**If the skill cannot be activated, STOP and tell the user - do not proceed without it.**

---

**Design**: `.specs/features/guias-conteudo/design.md`
**Status**: Draft

---

## Test Coverage Matrix

> Generated from codebase, project guidelines, and spec - confirm before Execute. Guidelines found: `vitest.config.ts` (sem limite de cobertura), padrões de `src/**/*.test.ts`, `tests/build/*.test.ts` e a matriz de `.specs/features/seo-ranqueamento/tasks.md` — strong defaults applied.

| Code Layer | Required Test Type | Coverage Expectation | Location Pattern | Run Command |
| ---------- | ------------------ | -------------------- | ---------------- | ----------- |
| Funções puras (`src/lib/**`) | unit | Todos os ramos; 1:1 com os ACs; edge cases listados | `src/**/*.test.ts` | `npm test` |
| Schema zod dos guias | unit | Cada regra de validação: um caso válido e um inválido por campo | `src/lib/guias/*.test.ts` | `npm test` |
| Páginas / componentes Astro | unit (Container API + happy-dom) | 1:1 com os ACs da página; edge cases listados | `src/**/*.test.ts` (páginas com prefixo `_`) | `npm test` |
| CSS compartilhado | unit (testes existentes da página de serviço) | HTML e classes da página de serviço inalterados | `src/pages/_servico.test.ts` | `npm test` |
| Conteúdo (`src/content/guias/*.md`) | unit | CONT-01 a CONT-05, CONT-07, LINK-05 por guia | `tests/content/*.test.ts` | `npm test` |
| Saída do build (`dist/`) | integration | Sitemap, rascunhos ausentes, títulos únicos, sem script inline | `tests/build/*.test.ts` | `npm run test:build` |

## Gate Check Commands

> Generated from codebase - confirm before Execute.

| Gate Level | When to Use | Command |
| ---------- | ----------- | ------- |
| Quick | Tarefas com testes unitários | `npm test` |
| Full | Tarefas que mexem na saída do build | `npm test && npm run build && npm run test:build` |
| Build | Fim de fase | `npm run check && npm test && npm run build && npm run test:build` |

---

## Execution Plan

### Phase 1: Modelo de dados

```
T1 -> T2 -> T3
T4
```

### Phase 2: SEO e IA

```
T5
T6
T7
```

### Phase 3: Páginas e links

```
T8
T9
T10
T11
T12
```

### Phase 4: Conteúdo

```
T13 -> T14 -> T15 -> T16
```

### Phase 5: Verificação da saída

```
T17
```

---

## Task Breakdown

### T1: Schema zod da coleção de guias ✅

**What**: Schema do frontmatter (`guideSchema`) com as regras de COL-02/03/04/06, registrado como coleção `guias` em `src/content.config.ts` (glob `**/*.md` em `src/content/guias`, `generateId` com o nome cru do arquivo).
**Where**: `src/lib/guias/schema.ts`
**Depends on**: None
**Reuses**: `services` (`src/data/services.ts`), `astro/zod`
**Requirement**: COL-01, COL-02, COL-03, COL-04, COL-06

**Tools**:

- MCP: NONE
- Skill: NONE

**Done when**:

- [ ] `src/content.config.ts` registra a coleção com o schema
- [ ] Testes: frontmatter válido passa; `servico` desconhecido, `title` com 29 e 61 caracteres, `description` com 69 e 161, `updatedAt` < `publishedAt` e campo obrigatório ausente falham; `faq` assume `[]` e `draft` assume `false`
- [ ] Gate check passes: `npm test`

**Tests**: unit
**Gate**: quick

**Commit**: `feat(guias): add guide collection schema`

---

### T2: Seleção, ordenação e datas dos guias ✅

**What**: `toGuide`, `selectGuides`, `lastDate`, `guidesFor`, `related` e `formatDate`, conforme o design.
**Where**: `src/lib/guias/guias.ts`
**Depends on**: T1
**Reuses**: tipo inferido de `guideSchema`
**Requirement**: COL-05, COL-07, COL-08, COL-09, PAGE-08, HUB-04, EDGE-02, EDGE-03

**Tools**:

- MCP: NONE
- Skill: NONE

**Done when**:

- [ ] Slug inválido (`Guia_1`, `guia--x`) lança erro com o nome do arquivo
- [ ] Guia publicado com `[PREÇO:`, `[REVISAR:` ou `[...]` no corpo ou no frontmatter lança erro com o nome do arquivo; rascunho com marcador não lança
- [ ] `includeDrafts: false` remove rascunhos; `includeDrafts: true` mantém
- [ ] Ordem por `updatedAt ?? publishedAt` decrescente
- [ ] `related` exclui o próprio guia, filtra pelo serviço e limita a 3; retorna `[]` quando é o único do serviço
- [ ] `formatDate(new Date("2026-10-17"))` = `17 de outubro de 2026`
- [ ] Gate check passes: `npm test`

**Tests**: unit
**Gate**: quick

**Commit**: `feat(guias): add guide selection and ordering`

---

### T3: Carregador da coleção ✅

**What**: `loadGuides()`: `getCollection("guias")` → `toGuide` → `selectGuides` com `includeDrafts: import.meta.env.DEV`.
**Where**: `src/lib/guias/collection.ts`
**Depends on**: T2
**Reuses**: `selectGuides`, `toGuide`
**Requirement**: COL-08, COL-09

**Tools**:

- MCP: NONE
- Skill: NONE

**Done when**:

- [ ] Teste com `vi.mock("astro:content")` confirma que entradas passam por `selectGuides` e o resultado volta ordenado
- [ ] Gate check passes: `npm test`

**Tests**: unit
**Gate**: quick

**Commit**: `feat(guias): add collection loader`

---

### T4: Extrair estilos de artigo para CSS compartilhado ✅

**What**: Mover sem alteração as regras `.svc-*` e `.crumbs*` do `<style>` de `src/pages/[servico].astro` para `src/styles/article.css`, importado no frontmatter da página de serviço.
**Where**: `src/styles/article.css`
**Depends on**: None
**Reuses**: `src/pages/[servico].astro:112`

**Tools**:

- MCP: NONE
- Skill: NONE

**Done when**:

- [ ] Testes existentes de `src/pages/_servico.test.ts` passam sem mudança
- [ ] `npm run build` gera as páginas de serviço com as regras `.svc-hero` no CSS embutido
- [ ] Gate check passes: `npm test && npm run build && npm run test:build`

**Tests**: unit
**Gate**: full

**Commit**: `refactor(styles): share article styles across pages`

---

### T5: JSON-LD de guia e de coleção ✅

**What**: `articleNode(site, guide, service)` e `collectionNode(site, guides)`.
**Where**: `src/lib/seo/schema.ts`
**Depends on**: None
**Reuses**: `ref`, `abs` do mesmo arquivo
**Requirement**: LD-01, LD-04

**Tools**:

- MCP: NONE
- Skill: NONE

**Done when**:

- [ ] `articleNode` tem `@type: Article`, `headline`, `description`, `datePublished`, `dateModified` (= `updatedAt`, ou `publishedAt` sem ele), `author` `/#leonardo`, `publisher` `/#empresa`, `mainEntityOfPage`, `inLanguage: pt-BR` e `about` com nome e URL do serviço
- [ ] `collectionNode` tem `@type: CollectionPage`, `url` de `/guias/` e `hasPart` com a URL de cada guia na ordem recebida
- [ ] Gate check passes: `npm test`

**Tests**: unit
**Gate**: quick

**Commit**: `feat(seo): add article and collection page schema`

---

### T6: `<lastmod>` dos guias no sitemap ✅

**What**: `guideDates()` lê `publishedAt`, `updatedAt` e `draft` do frontmatter; `withLastmod` usa essas datas para `/guias/<slug>/` e a maior delas para `/guias/`.
**Where**: `src/lib/seo/lastmod.ts`
**Depends on**: None
**Reuses**: `withLastmod`, padrão de injeção (`run`) para teste
**Requirement**: SMAP-02, SMAP-03

**Tools**:

- MCP: NONE
- Skill: NONE

**Done when**:

- [ ] Testes com leitor de arquivos falso: guia com `updatedAt` usa `updatedAt`; sem ele, `publishedAt`; datas com e sem aspas; rascunho fica de fora; `/guias/` recebe a maior data; caminhos que não são de guia continuam usando git
- [ ] Gate check passes: `npm test`

**Tests**: unit
**Gate**: quick

**Commit**: `feat(seo): set sitemap lastmod from guide dates`

---

### T7: Guias no llms.txt ✅

**What**: `llmsText(site, list, guides = [])` com `/guias/` em "Páginas" e seção `## Guias`; `src/pages/llms.txt.ts` passa `await loadGuides()`.
**Where**: `src/lib/seo/llms.ts`
**Depends on**: None
**Reuses**: `llmsText`
**Requirement**: LLMS-01, LLMS-02, LLMS-03

**Tools**:

- MCP: NONE
- Skill: NONE

**Done when**:

- [ ] Com 2 guias: seção `## Guias` com `- [<h1>](<URL absoluta>): <resumo>`, mais recente primeiro
- [ ] Sem guias: sem a seção `## Guias`
- [ ] "Páginas" lista `/guias/` nos dois casos
- [ ] Testes existentes de `llms.test.ts` e `_llms.test.ts` continuam passando (rota com `loadGuides` mockado)
- [ ] Gate check passes: `npm test`

**Tests**: unit
**Gate**: quick

**Commit**: `feat(seo): list guides in llms.txt`

---

### T8: Página do guia ✅

**What**: Rota `src/pages/guias/[slug].astro` com `getStaticPaths` async (props `guide`, `related`), conforme o design.
**Where**: `src/pages/guias/[slug].astro`
**Depends on**: None
**Reuses**: `BaseLayout`, `Header`, `Footer`, `Contact`, `article.css`, `articleNode`, `breadcrumbNode`, `faqNode`, `formatDate`
**Requirement**: PAGE-01 a PAGE-10, LD-01, LD-02, LD-03, EDGE-02, EDGE-04

**Tools**:

- MCP: NONE
- Skill: NONE

**Done when**:

- [ ] `getStaticPaths` (com `loadGuides` mockado) gera um caminho por guia, com `related` correto
- [ ] Testes com guia fixture: `<title>`, meta description, `<h1>` único, resumo, autor com link do LinkedIn, `<time datetime>` publicado e atualizado, trilha, CTA com `/<servico>/`, `#contato` e `wa.me`, FAQ em `<details>`, "Leia também", seção `#contato`, nenhum `<script>` executável inline
- [ ] JSON-LD contém `Article`, `BreadcrumbList` (Início, Guias, h1) e `FAQPage`; sem FAQ, nem a seção nem o `FAQPage`; guia único do serviço sem "Leia também"; sem `updatedAt`, sem "Atualizado em"
- [ ] Gate check passes: `npm test`

**Tests**: unit
**Gate**: quick

**Commit**: `feat(guias): add guide page`

---

### T9: Página índice /guias/ ✅

**What**: `src/pages/guias/index.astro` usando `Astro.props.guides ?? await loadGuides()`.
**Where**: `src/pages/guias/index.astro`
**Depends on**: None
**Reuses**: `BaseLayout`, `Header`, `Footer`, `article.css`, `collectionNode`, `breadcrumbNode`, `lastDate`, `formatDate`
**Requirement**: HUB-01 a HUB-06, LD-04, EDGE-01

**Tools**:

- MCP: NONE
- Skill: NONE

**Done when**:

- [ ] Testes com fixtures de 2 serviços: título exato, meta description com 70–160 caracteres, um `<h2>` por serviço na ordem de `services`, link para o serviço, cada guia com link, h1, descrição e data, ordem decrescente, trilha "Início › Guias"
- [ ] JSON-LD contém `CollectionPage` e `BreadcrumbList`
- [ ] Sem guias: texto "Os primeiros guias estão a caminho." e nenhum grupo
- [ ] Gate check passes: `npm test`

**Tests**: unit
**Gate**: quick

**Commit**: `feat(guias): add guides index page`

---

### T10: Bloco "Guias sobre" nas páginas de serviço ✅

**What**: `getStaticPaths` async com `guides: guidesFor(await loadGuides(), slug)`; seção "Guias sobre <name>" antes de "Outros serviços", só com lista não vazia.
**Where**: `src/pages/[servico].astro`
**Depends on**: None
**Reuses**: `guidesFor`, `loadGuides`
**Requirement**: LINK-01, LINK-02

**Tools**:

- MCP: NONE
- Skill: NONE

**Done when**:

- [ ] `_servico.test.ts` atualizado para `await getStaticPaths()` com `loadGuides` mockado; testes anteriores continuam passando
- [ ] Com 2 guias: seção com título "Guias sobre <name>" e links `/guias/<slug>/`, mais recente primeiro
- [ ] Sem guias: a seção não existe
- [ ] Gate check passes: `npm test`

**Tests**: unit
**Gate**: quick

**Commit**: `feat(guias): link guides from service pages`

---

### T11: Link "Guias" no cabeçalho ✅

**What**: `{ href: "/guias/", label: "Guias" }` depois de "Processo".
**Where**: `src/components/Header.astro`
**Depends on**: None
**Reuses**: lista `links` existente
**Requirement**: LINK-03

**Tools**:

- MCP: NONE
- Skill: NONE

**Done when**:

- [ ] Teste: o link "Guias" aponta para `/guias/` e vem logo depois de "Processo"
- [ ] Gate check passes: `npm test`

**Tests**: unit
**Gate**: quick

**Commit**: `feat(guias): add guides link to header`

---

### T12: Link "Guias" no rodapé ✅

**What**: Link "Guias" para `/guias/` no rodapé, junto da lista de serviços.
**Where**: `src/components/Footer.astro`
**Depends on**: None
**Reuses**: classe `site-footer__link`
**Requirement**: LINK-04

**Tools**:

- MCP: NONE
- Skill: NONE

**Done when**:

- [ ] Teste: o rodapé tem link "Guias" para `/guias/`
- [ ] Gate check passes: `npm test`

**Tests**: unit
**Gate**: quick

**Commit**: `feat(guias): add guides link to footer`

---

### T13: Guia "Quanto custa um site"

**What**: `src/content/guias/quanto-custa-um-site.md` (`servico: criacao-de-sites`, `draft: true`, marcadores `[PREÇO: ...]` onde entram as faixas), e o teste de conteúdo `tests/content/guias.test.ts`, que roda para cada guia de lançamento existente.
**Where**: `src/content/guias/quanto-custa-um-site.md`
**Depends on**: None
**Reuses**: textos de `src/data/services.ts` (tom, área de atendimento)
**Requirement**: CONT-01 a CONT-07, LINK-05

**Tools**:

- MCP: NONE
- Skill: `local-landing-pages`, `ai-local-search`

**Done when**:

- [ ] Teste: ≥ 1.200 palavras no corpo, ≥ 3 FAQ, ≥ 3 `##`, menção a Canoas ou Porto Alegre, link para `/criacao-de-sites/` e para outra página do site, e `draft: true` enquanto houver `[PREÇO:`
- [ ] Nenhum cliente, número de projetos, anos de experiência ou resultado inventado
- [ ] Gate check passes: `npm test`

**Tests**: unit
**Gate**: quick

**Commit**: `content(guias): add website cost guide draft`

---

### T14: Guia "Quanto custa um sistema sob medida"

**What**: `src/content/guias/quanto-custa-um-sistema-sob-medida.md` (`servico: software-sob-medida`, `draft: true`, marcadores `[PREÇO: ...]`).
**Where**: `src/content/guias/quanto-custa-um-sistema-sob-medida.md`
**Depends on**: T13
**Reuses**: `tests/content/guias.test.ts`
**Requirement**: CONT-01 a CONT-07, LINK-05

**Tools**:

- MCP: NONE
- Skill: `local-landing-pages`, `ai-local-search`

**Done when**:

- [ ] O teste de conteúdo cobre este guia e passa
- [ ] Gate check passes: `npm test`

**Tests**: unit
**Gate**: quick

**Commit**: `content(guias): add custom software cost guide draft`

---

### T15: Guia "Integração com o Bling via API"

**What**: `src/content/guias/integracao-bling-api.md` (`servico: integracoes`, `draft: false`).
**Where**: `src/content/guias/integracao-bling-api.md`
**Depends on**: T14
**Reuses**: `tests/content/guias.test.ts`
**Requirement**: CONT-01 a CONT-06, LINK-05

**Tools**:

- MCP: NONE
- Skill: `local-landing-pages`, `ai-local-search`

**Done when**:

- [ ] O teste de conteúdo cobre este guia e passa; sem marcadores pendentes
- [ ] Gate check passes: `npm test`

**Tests**: unit
**Gate**: quick

**Commit**: `content(guias): add Bling API integration guide`

---

### T16: Guia "Integrar rastreamento veicular ao sistema"

**What**: `src/content/guias/integracao-rastreamento-veicular.md` (`servico: integracoes`, `draft: false`); o teste de conteúdo passa a exigir os 4 arquivos (CONT-01).
**Where**: `src/content/guias/integracao-rastreamento-veicular.md`
**Depends on**: T15
**Reuses**: `tests/content/guias.test.ts`
**Requirement**: CONT-01 a CONT-06, LINK-05

**Tools**:

- MCP: NONE
- Skill: `local-landing-pages`, `ai-local-search`

**Done when**:

- [ ] O teste de conteúdo exige os 4 guias e passa
- [ ] Gate check passes: `npm test`

**Tests**: unit
**Gate**: quick

**Commit**: `content(guias): add vehicle tracking integration guide`

---

### T17: Verificação da saída do build

**What**: Testes de build: sitemap lista `/guias/` e os guias publicados com `<lastmod>`; rascunhos ausentes de `dist/`, sitemap e `llms.txt`; listas `PAGES` de `titles.test.ts` e `inline-scripts.test.ts` incluem `guias/index.html` e os guias publicados.
**Where**: `tests/build/guias.test.ts`
**Depends on**: None
**Reuses**: helpers de `tests/build/sitemap.test.ts`
**Requirement**: SMAP-01, SMAP-02, SMAP-03, COL-08, PAGE-10

**Tools**:

- MCP: NONE
- Skill: NONE

**Done when**:

- [ ] Sitemap contém `/guias/`, `/guias/integracao-bling-api/` e `/guias/integracao-rastreamento-veicular/` com `<lastmod>` igual ao frontmatter, e não contém os dois rascunhos
- [ ] `dist/guias/quanto-custa-um-site/` e `dist/guias/quanto-custa-um-sistema-sob-medida/` não existem
- [ ] Títulos únicos e nenhum script inline nas páginas novas
- [ ] Gate check passes: `npm run check && npm test && npm run build && npm run test:build`

**Tests**: integration
**Gate**: build

**Commit**: `test(guias): verify guides in build output`

---

## Phase Execution Map

```
Phase 1 → Phase 2 → Phase 3 → Phase 4 → Phase 5

Phase 1:  T1 → T2 → T3
          T4
Phase 2:  T5, T6, T7 (independentes)
Phase 3:  T8, T9, T10, T11, T12 (independentes)
Phase 4:  T13 → T14 → T15 → T16
Phase 5:  T17
```

Batches (~7 tarefas, fases inteiras): **A** = Fases 1–2 (T1–T7), **B** = Fase 3 (T8–T12), **C** = Fases 4–5 (T13–T17).

---

## Task Granularity Check

| Task | Scope | Status |
| ---- | ----- | ------ |
| T1 | 1 schema (+ registro de 1 linha na config) | ✅ Granular |
| T2 | 6 funções puras coesas no mesmo arquivo | ⚠️ OK, coesas |
| T3 | 1 função | ✅ Granular |
| T4 | 1 arquivo CSS (movido) | ✅ Granular |
| T5 | 2 funções no mesmo arquivo | ⚠️ OK, coesas |
| T6 | 1 função + ramo em `withLastmod` | ✅ Granular |
| T7 | 1 função + chamada na rota | ✅ Granular |
| T8 | 1 página | ✅ Granular |
| T9 | 1 página | ✅ Granular |
| T10 | 1 seção numa página | ✅ Granular |
| T11 | 1 link | ✅ Granular |
| T12 | 1 link | ✅ Granular |
| T13 | 1 guia + teste de conteúdo | ✅ Granular |
| T14–T16 | 1 guia cada | ✅ Granular |
| T17 | 1 arquivo de teste de build | ✅ Granular |

## Diagram-Definition Cross-Check

| Task | Depends On (task body) | Diagram Shows | Status |
| ---- | ---------------------- | ------------- | ------ |
| T1 | None | — | ✅ Match |
| T2 | T1 | T1 → T2 | ✅ Match |
| T3 | T2 | T2 → T3 | ✅ Match |
| T4 | None | — | ✅ Match |
| T5 | None | — | ✅ Match |
| T6 | None | — | ✅ Match |
| T7 | None | — | ✅ Match |
| T8 | None | — | ✅ Match |
| T9 | None | — | ✅ Match |
| T10 | None | — | ✅ Match |
| T11 | None | — | ✅ Match |
| T12 | None | — | ✅ Match |
| T13 | None | — | ✅ Match |
| T14 | T13 | T13 → T14 | ✅ Match |
| T15 | T14 | T14 → T15 | ✅ Match |
| T16 | T15 | T15 → T16 | ✅ Match |
| T17 | None | — | ✅ Match |

## Test Co-location Validation

| Task | Code Layer Created/Modified | Matrix Requires | Task Says | Status |
| ---- | --------------------------- | --------------- | --------- | ------ |
| T1 | Schema zod | unit | unit | ✅ OK |
| T2 | Função pura | unit | unit | ✅ OK |
| T3 | Função pura | unit | unit | ✅ OK |
| T4 | CSS compartilhado | unit | unit | ✅ OK |
| T5 | Função pura | unit | unit | ✅ OK |
| T6 | Função pura | unit | unit | ✅ OK |
| T7 | Função pura | unit | unit | ✅ OK |
| T8 | Página Astro | unit | unit | ✅ OK |
| T9 | Página Astro | unit | unit | ✅ OK |
| T10 | Página Astro | unit | unit | ✅ OK |
| T11 | Componente Astro | unit | unit | ✅ OK |
| T12 | Componente Astro | unit | unit | ✅ OK |
| T13 | Conteúdo | unit | unit | ✅ OK |
| T14 | Conteúdo | unit | unit | ✅ OK |
| T15 | Conteúdo | unit | unit | ✅ OK |
| T16 | Conteúdo | unit | unit | ✅ OK |
| T17 | Saída do build | integration | integration | ✅ OK |

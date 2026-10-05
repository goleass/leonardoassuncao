# Auditoria GEO e Segurança — Tasks

## Execution Protocol (MANDATORY -- do not skip)

Implement these tasks with the `tlc-spec-driven` skill: **activate it by name and follow its Execute flow and Critical Rules.** Do not search for skill files by filesystem path. The skill is the source of truth for the full flow (per-task cycle, sub-agent delegation, adequacy review, Verifier, discrimination sensor).

**If the skill cannot be activated, STOP and tell the user - do not proceed without it.**

---

**Design**: `.specs/features/auditoria-geo-seguranca/design.md`
**Status**: Draft

---

## Test Coverage Matrix

> Generated from codebase, project guidelines, and spec. Guidelines found: `vitest.config.ts` (sem limite de cobertura), padrões de `src/**/*.test.ts`, `tests/*.test.ts` e `tests/build/secrets.test.ts`. Strong defaults applied.

| Code Layer | Required Test Type | Coverage Expectation | Location Pattern | Run Command |
| ---------- | ------------------ | -------------------- | ---------------- | ----------- |
| Componentes / páginas / layout Astro | unit (Container API + happy-dom) | 1:1 com os ACs do componente; edge cases listados | `src/**/*.test.ts` (páginas com prefixo `_`) | `npm test` |
| Funções puras (`src/lib/**`) | unit | Todos os ramos; 1:1 com os ACs | `src/**/*.test.ts` | `npm test` |
| Rotas de texto (`src/pages/*.ts`) | unit | Corpo, status e `content-type` | `src/pages/_*.test.ts` | `npm test` |
| Configuração (`astro.config.mjs`, `netlify.toml`, `src/config/site.ts`, CSS de tokens) | unit | Valor exato exigido pela spec | `tests/*.test.ts`, `src/config/*.test.ts` | `npm test` |
| Arquivos estáticos (`public/`) | unit | Existência e dimensões | `tests/*.test.ts` | `npm test` |
| Saída do build (`dist/`) | integration | Invariantes entre páginas (scripts inline, títulos, sitemap, arquivos gerados) | `tests/build/*.test.ts` | `npm run build && npm run test:build` |
| Comportamento no navegador com os cabeçalhos | e2e (Chromium) | Home, serviço, privacidade e 404: zero violações; reveal, menu e formulário funcionando | `tests/browser/*.test.ts` | `npm run build && npm run test:browser` |
| Script de medição (`scripts/lighthouse.mjs`) | none | — (gate manual: o próprio script é a medição) | — | `node scripts/lighthouse.mjs` |

## Gate Check Commands

| Gate Level | When to Use | Command |
| ---------- | ----------- | ------- |
| Quick | Tarefas com testes unitários | `npm test` |
| Full | Tarefas que mexem na saída do build ou no navegador | `npm test && npm run build && npm run test:build && npm run test:browser` |
| Build | Fim de fase | `npm run check && npm test && npm run build && npm run test:build && npm run test:browser` |

> Até a T5 criar `test:browser`, o gate Full e o Build rodam sem esse último passo.

---

## Execution Plan

Phases are ordered and run sequentially - each phase completes before the next begins, and tasks within a phase execute in order.

### Phase 1: Páginas sem script inline

```
T1 -> T2 -> T3
```

### Phase 2: Cabeçalhos de segurança

```
T4 -> T5
```

### Phase 3: Arquivos para IA e pesquisadores

```
T6
T7 -> T8
T7 -> T9
T10 -> T11
```

### Phase 4: Head, manifest e JSON-LD

```
T12 -> T13 -> T14
T15 -> T16
```

### Phase 5: Conteúdo, sitemap e desempenho

```
T17
T18
T19 -> T20
T21 -> T22
```

---

## Task Breakdown

### T1: Estado "com JS" via `@media (scripting: enabled)` ✅

**What**: Trocar os seletores `html.js` de `animations.css` por regras dentro de `@media (scripting: enabled)`, mantendo os mesmos estados de `.reveal` e `.lg-draw` e a exceção de movimento reduzido.
**Where**: `src/styles/animations.css`
**Depends on**: None
**Reuses**: regras atuais (`animations.css:256-298`)
**Requirement**: CSP-03 (pré-requisito), PERF-09

**Tools**:

- MCP: NONE
- Skill: NONE

**Done when**:

- [ ] Nenhum seletor `html.js` em `src/` (teste lê o CSS)
- [ ] Teste confirma que o estado escondido de `.reveal` existe só dentro de `@media (scripting: enabled)`
- [ ] Teste confirma que toda `@keyframes` e `transition` do arquivo anima só `opacity`, `transform` ou `background-size` (PERF-09)
- [ ] Gate check passes: `npm test`

**Tests**: unit
**Gate**: quick
**Commit**: `refactor(css): gate reveal state on scripting media query`

---

### T2: Remover o script inline da classe `js` ✅

**What**: Apagar o `<script is:inline>` que adiciona a classe `js` no `BaseLayout` e ajustar o teste que hoje cobra essa classe.
**Where**: `src/layouts/BaseLayout.astro`
**Depends on**: T1
**Reuses**: `src/layouts/BaseLayout.test.ts`
**Requirement**: CSP-03

**Tools**:

- MCP: NONE
- Skill: NONE

**Done when**:

- [ ] O layout renderizado não tem `<script>` sem `src` além do `application/ld+json` e dos scripts processados do Astro
- [ ] Teste antigo da classe `js` substituído pela nova afirmação (sem apagar cobertura de ANIM-09)
- [ ] Gate check passes: `npm test`

**Tests**: unit
**Gate**: quick
**Commit**: `refactor(layout): drop inline js-class script`

---

### T3: Scripts do Astro como arquivo externo + guarda de build ✅

**What**: Adicionar `vite: { build: { assetsInlineLimit: 0 } }` em `astro.config.mjs` e criar `tests/build/inline-scripts.test.ts`, que falha nomeando o arquivo se algum `dist/**/*.html` tiver `<script>` com corpo e `type` diferente de `application/ld+json`.
**Where**: `astro.config.mjs`
**Depends on**: T2
**Reuses**: `listFiles` / padrão de `tests/build/secrets.test.ts`; `tests/astro-config.test.ts`
**Requirement**: CSP-03, EDGE-09

**Tools**:

- MCP: NONE
- Skill: NONE

**Done when**:

- [ ] `tests/astro-config.test.ts` confirma `assetsInlineLimit: 0`
- [ ] Teste de build passa nas 8 páginas e falharia com um script inline (provado com um HTML de fixture no próprio teste)
- [ ] Gate check passes: `npm test && npm run build && npm run test:build`

**Tests**: integration
**Gate**: full
**Commit**: `build: emit astro scripts as files and forbid inline scripts`

---

### T4: Cabeçalhos de segurança no `netlify.toml` ✅

**What**: Adicionar `[[headers]] for = "/*"` com os 8 cabeçalhos e a CSP exatos do design, e estender `tests/netlify-config.test.ts` com um leitor de `[[headers]]`.
**Where**: `netlify.toml`
**Depends on**: None (T3 na fase anterior)
**Reuses**: leitor TOML de `tests/netlify-config.test.ts`
**Requirement**: SECH-01, SECH-02, SECH-03, SECH-04, SECH-05, SECH-06, SECH-07, CSP-01, CSP-02, CSP-03, EDGE-13

**Tools**:

- MCP: NONE
- Skill: NONE

**Done when**:

- [ ] Um teste por cabeçalho confere o valor exato e o `for = "/*"`
- [ ] Teste confirma as diretivas de CSP-02 e a ausência de `'unsafe-inline'`/`'unsafe-eval'` em `script-src`
- [ ] Gate check passes: `npm test`

**Tests**: unit
**Gate**: quick
**Commit**: `feat(security): send security headers and strict csp`

---

### T5: Teste de navegador com os cabeçalhos reais ✅

**What**: Adicionar `playwright-core` (devDependency) e o script `test:browser`, e criar `tests/browser/csp.test.ts`: servidor `node:http` sobre `dist/` com os cabeçalhos lidos do `netlify.toml`; abre `/`, `/criacao-de-sites/`, `/privacidade/` e `/nao-existe/` (404); falha em qualquer violação de CSP, erro de COEP/CORP ou requisição a outra origem; confere `.reveal.is-visible`, o menu em 390 px e o envio do formulário com `/api/contato` interceptado.
**Where**: `tests/browser/csp.test.ts`
**Depends on**: T4
**Reuses**: Chromium em `~/.cache/ms-playwright/chromium-1243`; leitor de headers da T4
**Requirement**: CSP-04, CSP-05, CSP-06, EDGE-10, EDGE-13

**Tools**:

- MCP: NONE
- Skill: NONE

**Done when**:

- [ ] `npm run test:browser` passa nas 4 páginas
- [ ] Teste de controle: com a CSP trocada para `script-src 'none'` no próprio teste, o caso de reveal falha (prova que o teste enxerga bloqueio)
- [ ] `vitest.config.ts` / `test` continua excluindo `tests/browser/**` do `npm test`
- [ ] Gate check passes: `npm test && npm run build && npm run test:build && npm run test:browser`

**Tests**: e2e
**Gate**: full
**Commit**: `test(security): verify pages under published headers in chromium`

---

### T6: Bots de IA no robots.txt ✅

**What**: Exportar `AI_BOTS` (9 user-agents) e gerar um grupo por bot com `Allow: /` e `Disallow: /api/`, mantendo o grupo `*` e o `Sitemap:`.
**Where**: `src/pages/robots.txt.ts`
**Depends on**: None
**Reuses**: `src/pages/_robots.test.ts`
**Requirement**: BOT-01, BOT-02, BOT-03

**Tools**:

- MCP: NONE
- Skill: NONE

**Done when**:

- [ ] Teste confere, para cada um dos 9 nomes literais da spec, o grupo com `Allow: /` e `Disallow: /api/`
- [ ] Testes de HOST-03/04 continuam passando
- [ ] Gate check passes: `npm test`

**Tests**: unit
**Gate**: quick
**Commit**: `feat(seo): allow ai crawlers explicitly in robots.txt`

---

### T7: Geradores `llmsText` e `llmsFullText`

**What**: Criar `src/lib/seo/llms.ts` com as duas funções puras do design.
**Where**: `src/lib/seo/llms.ts`
**Depends on**: None
**Reuses**: `NAME`, `HOME_DESCRIPTION` (`schema.ts`), `services`, `questions`
**Requirement**: LLMS-02, LLMS-03, LLMS-04, LLMS-06, LLMS-08, LLMS-09, LLMS-10

**Tools**:

- MCP: NONE
- Skill: NONE

**Done when**:

- [ ] `# Leonardo Gomes Assunção` e `> <HOME_DESCRIPTION>` nos primeiros 500 caracteres
- [ ] Links absolutos no host da config para home, cada serviço e privacidade, com descrição de uma linha
- [ ] Cidade, área, e-mail, WhatsApp e CNPJ vindos da config (dublê com valores próprios)
- [ ] Lista de serviços extra no teste aparece sem mudar o gerador (LLMS-06)
- [ ] `llmsFullText` contém nome, URL e descrição de cada serviço e todo par pergunta/resposta do FAQ; `llmsText` tem `## Optional` com `/llms-full.txt`
- [ ] Gate check passes: `npm test`

**Tests**: unit
**Gate**: quick
**Commit**: `feat(geo): generate llms.txt content from site data`

---

### T8: Rota `/llms.txt`

**What**: Criar `src/pages/llms.txt.ts` que responde `llmsText(site, services)` como `text/plain; charset=utf-8`.
**Where**: `src/pages/llms.txt.ts`
**Depends on**: T7
**Reuses**: padrão de `robots.txt.ts` e `_robots.test.ts`
**Requirement**: LLMS-01

**Tools**:

- MCP: NONE
- Skill: NONE

**Done when**:

- [ ] Teste `_llms.test.ts` confere status 200, `content-type` e corpo igual ao gerador
- [ ] Gate check passes: `npm test`

**Tests**: unit
**Gate**: quick
**Commit**: `feat(geo): serve /llms.txt`

---

### T9: Rota `/llms-full.txt`

**What**: Criar `src/pages/llms-full.txt.ts` que responde `llmsFullText(site, services, questions)`.
**Where**: `src/pages/llms-full.txt.ts`
**Depends on**: T7
**Reuses**: padrão da T8
**Requirement**: LLMS-07

**Tools**:

- MCP: NONE
- Skill: NONE

**Done when**:

- [ ] Teste `_llms-full.test.ts` confere status 200, `content-type` e corpo
- [ ] Gate check passes: `npm test`

**Tests**: unit
**Gate**: quick
**Commit**: `feat(geo): serve /llms-full.txt`

---

### T10: Gerador `securityTxt`

**What**: Criar `src/lib/seo/security-txt.ts` com `securityTxt(site, now)`.
**Where**: `src/lib/seo/security-txt.ts`
**Depends on**: None
**Reuses**: `site.email`, `site.url`
**Requirement**: SECTXT-02, SECTXT-03, SECTXT-04, SECTXT-05, SECTXT-06, EDGE-11, EDGE-12

**Tools**:

- MCP: NONE
- Skill: NONE

**Done when**:

- [ ] Com `now = 2026-10-04T12:00:00Z`: `Expires: 2027-10-03T12:00:00Z` exato
- [ ] `Contact: mailto:<email>`, `Canonical`, `Preferred-Languages: pt-BR, en` e `Policy:` com a URL de privacidade no host da config
- [ ] `Expires` > `now` (EDGE-11); o teste de PAGE-09 que falha com e-mail vazio continua verde (EDGE-12)
- [ ] Gate check passes: `npm test`

**Tests**: unit
**Gate**: quick
**Commit**: `feat(security): generate security.txt content`

---

### T11: Rota `/.well-known/security.txt`

**What**: Criar `src/pages/.well-known/security.txt.ts` respondendo `securityTxt(site, new Date())`.
**Where**: `src/pages/.well-known/security.txt.ts`
**Depends on**: T10
**Reuses**: padrão da T8
**Requirement**: SECTXT-01

**Tools**:

- MCP: NONE
- Skill: NONE

**Done when**:

- [ ] Teste unitário confere status, `content-type` e campos
- [ ] Teste de build confirma `dist/.well-known/security.txt`
- [ ] Gate check passes: `npm test && npm run build && npm run test:build && npm run test:browser`

**Tests**: integration
**Gate**: full
**Commit**: `feat(security): serve /.well-known/security.txt`

---

### T12: Ícone 192×192

**What**: Fazer `scripts/icons.mjs` gerar `public/icon-192.png` e commitar o arquivo.
**Where**: `scripts/icons.mjs`
**Depends on**: None
**Reuses**: função `png(size)` existente; `tests/icons.test.ts`
**Requirement**: MANI-01

**Tools**:

- MCP: NONE
- Skill: NONE

**Done when**:

- [ ] `tests/icons.test.ts` confirma `public/icon-192.png` com 192×192
- [ ] Gate check passes: `npm test`

**Tests**: unit
**Gate**: quick
**Commit**: `feat(icons): add 192px icon for the web manifest`

---

### T13: Rota `/site.webmanifest`

**What**: Criar `src/pages/site.webmanifest.ts` com o JSON da spec (`application/manifest+json`).
**Where**: `src/pages/site.webmanifest.ts`
**Depends on**: T12
**Reuses**: `NAME`
**Requirement**: MANI-01

**Tools**:

- MCP: NONE
- Skill: NONE

**Done when**:

- [ ] Teste confere cada campo da spec e os ícones 192 e 512 PNG
- [ ] Gate check passes: `npm test`

**Tests**: unit
**Gate**: quick
**Commit**: `feat(pwa): serve web app manifest`

---

### T14: `<head>` do BaseLayout

**What**: Adicionar robots meta de indexação, `hreflang` pt-BR e x-default, `<link rel="manifest">`, `<link rel="alternate" type="text/plain" href="/llms.txt">` e o título padrão novo; criar `tests/build/titles.test.ts` (todo `<title>` ≤ 60).
**Where**: `src/layouts/BaseLayout.astro`
**Depends on**: T13
**Reuses**: `BaseLayout.test.ts`, `_index.test.ts`, `_404.test.ts`
**Requirement**: RMETA-01, RMETA-02, I18N-01, I18N-02, MANI-02, LLMS-05, SEO-07, SEO-08

**Tools**:

- MCP: NONE
- Skill: NONE

**Done when**:

- [ ] Página indexável: robots meta exato + 2 `hreflang` na canônica
- [ ] Página `noindex`: só `noindex`, sem `hreflang` e sem `index, follow`
- [ ] Toda página: link de manifest e de llms.txt
- [ ] Título da home = "Criação de Sites e Sistemas em Canoas/RS | Leonardo Assunção" (testes antigos atualizados)
- [ ] Teste de build: nenhum `<title>` acima de 60 caracteres
- [ ] Gate check passes: `npm test && npm run build && npm run test:build && npm run test:browser`

**Tests**: integration
**Gate**: full
**Commit**: `feat(seo): add robots, hreflang, manifest and llms links to head`

---

### T15: LinkedIn na configuração

**What**: Preencher `linkedin: "https://www.linkedin.com/in/leonardo-gomes-assuncao"` em `site.ts`.
**Where**: `src/config/site.ts`
**Depends on**: None
**Reuses**: `src/config/site.test.ts`
**Requirement**: LD-12

**Tools**:

- MCP: NONE
- Skill: NONE

**Done when**:

- [ ] `site.test.ts` afirma a URL exata (no lugar do teste "sem LinkedIn")
- [ ] Gate check passes: `npm test`

**Tests**: unit
**Gate**: quick
**Commit**: `feat(config): add linkedin profile`

---

### T16: Nó da empresa como Organization + `knowsAbout`

**What**: Em `siteNodes`, `@type` vira `["Organization", "ProfessionalService"]` e entra `knowsAbout` com os nomes dos serviços em ordem; o helper `byType` dos testes aceita `@type` em array.
**Where**: `src/lib/seo/schema.ts`
**Depends on**: T15
**Reuses**: `src/lib/seo/schema.test.ts`
**Requirement**: LD-10, LD-11, LD-12, LD-14, LD-15

**Tools**:

- MCP: NONE
- Skill: NONE

**Done when**:

- [ ] `@type` exato; `knowsAbout` igual a `services.map(s => s.name)`
- [ ] Com o site real: `sameAs` = LinkedIn na empresa e na pessoa; sem LinkedIn: chave ausente
- [ ] `hasOfferCatalog`, `address`, `name`, `url` continuam presentes
- [ ] Gate check passes: `npm test`

**Tests**: unit
**Gate**: quick
**Commit**: `feat(seo): declare company as organization with knowsAbout`

---

### T17: Perguntas do FAQ como `<h3>`

**What**: Colocar o texto de cada pergunta num `<h3 class="faq__q">` dentro do `<summary>`, com `font: inherit; margin: 0`.
**Where**: `src/components/Faq.astro`
**Depends on**: None
**Reuses**: `src/components/Faq.test.ts`
**Requirement**: A11Y-06

**Tools**:

- MCP: NONE
- Skill: NONE

**Done when**:

- [ ] Cada `summary` contém exatamente um `h3` com o texto da pergunta
- [ ] Gate check passes: `npm test`

**Tests**: unit
**Gate**: quick
**Commit**: `feat(a11y): mark faq questions as headings`

---

### T18: Honeypot sem `aria-hidden`

**What**: Tirar `aria-hidden` do wrapper do honeypot e trocar o rótulo para "Deixe este campo em branco", mantendo `tabindex="-1"`, `autocomplete="off"`, `name="website"` e o CSS fora da tela.
**Where**: `src/components/Contact.astro`
**Depends on**: None
**Reuses**: `src/components/Contact.test.ts`, `src/pages/api/_contato.test.ts`
**Requirement**: A11Y-07, A11Y-08, A11Y-09, EDGE-14

**Tools**:

- MCP: NONE
- Skill: NONE

**Done when**:

- [ ] Nenhum ancestral do campo `website` tem `aria-hidden="true"`
- [ ] Atributos e rótulo exatos da spec
- [ ] Testes da API (FORM-10 e demais) continuam verdes sem alteração
- [ ] Gate check passes: `npm test`

**Tests**: unit
**Gate**: quick
**Commit**: `fix(a11y): keep honeypot out of aria-hidden`

---

### T19: `lastCommitDate` e `PAGE_SOURCES`

**What**: Criar `src/lib/seo/lastmod.ts` com `lastCommitDate(files, run?)` e o mapa `PAGE_SOURCES`, como no design.
**Where**: `src/lib/seo/lastmod.ts`
**Depends on**: None
**Reuses**: nenhum
**Requirement**: SMAP-01, SMAP-02

**Tools**:

- MCP: NONE
- Skill: NONE

**Done when**:

- [ ] Com `run` dublê: devolve a data do `git log`; clone raso → `undefined`; `run` lançando erro → `undefined`; saída vazia → `undefined`
- [ ] `PAGE_SOURCES` cobre `/`, os 5 serviços (derivados de `services`) e `/privacidade/`
- [ ] Gate check passes: `npm test`

**Tests**: unit
**Gate**: quick
**Commit**: `feat(seo): resolve last commit date per page source`

---

### T20: `lastmod` no sitemap

**What**: Passar `serialize` ao `sitemap()` em `astro.config.mjs`, preenchendo `lastmod` com `lastCommitDate(PAGE_SOURCES[path])` quando existir.
**Where**: `astro.config.mjs`
**Depends on**: T19
**Reuses**: `tests/astro-config.test.ts`
**Requirement**: SMAP-01, SMAP-02

**Tools**:

- MCP: NONE
- Skill: NONE

**Done when**:

- [ ] Teste de build: com histórico completo, cada `<url>` do `sitemap-0.xml` tem `<lastmod>` igual a `git log -1 --format=%cI -- <fontes>` daquela página
- [ ] O build passa num clone raso (teste cria `git clone --depth 1` temporário ou simula via `run`) e o sitemap sai sem `<lastmod>`
- [ ] Gate check passes: `npm test && npm run build && npm run test:build && npm run test:browser`

**Tests**: integration
**Gate**: full
**Commit**: `feat(seo): add real lastmod dates to sitemap`

---

### T21: Fonte de fallback com métricas ajustadas

**What**: Calcular com fontTools as métricas do `archivo-latin-wdth-normal.woff2` e declarar `@font-face "Archivo Fallback"` (`local("Arial")`, `size-adjust`, `ascent-override`, `descent-override`, `line-gap-override`), colocando-a depois de "Archivo Variable" em `--font-sans`.
**Where**: `src/styles/tokens.css`
**Depends on**: None
**Reuses**: `--font-sans` atual
**Requirement**: PERF-08

**Tools**:

- MCP: NONE
- Skill: NONE

**Done when**:

- [ ] Teste lê o CSS: `@font-face` com as 4 propriedades e `--font-sans` na ordem "Archivo Variable", "Archivo Fallback"
- [ ] Os valores calculados e o comando que os gerou ficam num comentário
- [ ] Gate check passes: `npm test`

**Tests**: unit
**Gate**: quick
**Commit**: `perf(fonts): add metric-matched fallback font`

---

### T22: Script de medição Lighthouse

**What**: Criar `scripts/lighthouse.mjs`, que serve `dist/`, roda Lighthouse 12 mobile 3× em `/` e `/criacao-de-sites/` e sai com código ≠ 0 se algum CLS > 0,1 ou Performance < 95.
**Where**: `scripts/lighthouse.mjs`
**Depends on**: T21
**Reuses**: Chrome em `/usr/bin/google-chrome`
**Requirement**: PERF-05, PERF-06, PERF-07

**Tools**:

- MCP: NONE
- Skill: NONE

**Done when**:

- [ ] `npm run build && node scripts/lighthouse.mjs` imprime 6 medições e sai com 0
- [ ] Saída registrada no `validation.md`
- [ ] Gate check passes: `npm run check && npm test && npm run build && npm run test:build && npm run test:browser`

**Tests**: none
**Gate**: build
**Commit**: `chore(perf): add lighthouse cls and performance check`

---

## Phase Execution Map

```
Phase 1 → Phase 2 → Phase 3 → Phase 4 → Phase 5

Phase 1:  T1 → T2 → T3
Phase 2:  T4 → T5
Phase 3:  T6
          T7 → T8
          T7 → T9
          T10 → T11
Phase 4:  T12 → T13 → T14
          T15 → T16
Phase 5:  T17
          T18
          T19 → T20
          T21 → T22
```

Execução estritamente sequencial (T1 → T22).

---

## Validation Tables

### Task Granularity Check

| Task | Scope | Status |
| ---- | ----- | ------ |
| T1, T2, T6, T15, T17, T18, T21 | 1 arquivo, 1 mudança | ✅ Granular |
| T3 | 1 opção de config + o teste que a protege | ✅ Coeso |
| T4 | 1 bloco TOML | ✅ Granular |
| T5 | 1 arquivo de teste (+ script e devDependency para rodá-lo) | ✅ Coeso |
| T7, T10, T19 | 1 módulo puro | ✅ Granular |
| T8, T9, T11, T13 | 1 rota | ✅ Granular |
| T12 | 1 script + o arquivo gerado | ✅ Granular |
| T14 | 1 `<head>` (5 tags) + guarda de títulos | ⚠️ Coeso: mesmo bloco do layout |
| T16 | 1 função | ✅ Granular |
| T20 | 1 opção de config | ✅ Granular |
| T22 | 1 script | ✅ Granular |

### Diagram-Definition Cross-Check

| Task | Depends On (body) | Diagram | Status |
| ---- | ----------------- | ------- | ------ |
| T1 | None | — | ✅ |
| T2 | T1 | T1 → T2 | ✅ |
| T3 | T2 | T2 → T3 | ✅ |
| T4 | None (T3 na fase anterior) | — | ✅ |
| T5 | T4 | T4 → T5 | ✅ |
| T6 | None | — | ✅ |
| T7 | None | — | ✅ |
| T8 | T7 | T7 → T8 | ✅ |
| T9 | T7 | T7 → T9 | ✅ |
| T10 | None | — | ✅ |
| T11 | T10 | T10 → T11 | ✅ |
| T12 | None | — | ✅ |
| T13 | T12 | T12 → T13 | ✅ |
| T14 | T13 | T13 → T14 | ✅ |
| T15 | None | — | ✅ |
| T16 | T15 | T15 → T16 | ✅ |
| T17 | None | — | ✅ |
| T18 | None | — | ✅ |
| T19 | None | — | ✅ |
| T20 | T19 | T19 → T20 | ✅ |
| T21 | None | — | ✅ |
| T22 | T21 | T21 → T22 | ✅ |

### Test Co-location Validation

| Task | Code Layer | Matrix Requires | Task Says | Status |
| ---- | ---------- | --------------- | --------- | ------ |
| T1, T21 | Configuração (CSS) | unit | unit | ✅ |
| T2, T14, T17, T18 | Layout / componentes | unit (T14 também saída do build) | unit / integration | ✅ |
| T3, T20 | Configuração + saída do build | integration | integration | ✅ |
| T4, T15 | Configuração | unit | unit | ✅ |
| T5 | Navegador | e2e | e2e | ✅ |
| T6, T8, T9, T13 | Rotas de texto | unit | unit | ✅ |
| T11 | Rota + saída do build | integration | integration | ✅ |
| T7, T10, T16, T19 | Funções puras | unit | unit | ✅ |
| T12 | Arquivos estáticos | unit | unit | ✅ |
| T22 | Script de medição | none | none | ✅ |

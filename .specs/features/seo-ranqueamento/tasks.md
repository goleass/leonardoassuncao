# SEO e Ranqueamento — Tasks

## Execution Protocol (MANDATORY -- do not skip)

Implement these tasks with the `tlc-spec-driven` skill: **activate it by name and follow its Execute flow and Critical Rules.** Do not search for skill files by filesystem path. The skill is the source of truth for the full flow (per-task cycle, sub-agent delegation, adequacy review, Verifier, discrimination sensor).

**If the skill cannot be activated, STOP and tell the user - do not proceed without it.**

---

**Design**: inline (sem `design.md`: nenhuma decisão de arquitetura nova). Conteúdo das páginas de serviço vive num módulo de dados (`src/data/services.ts`), igual ao padrão atual de listas no frontmatter dos componentes; uma rota dinâmica `src/pages/[servico].astro` com `getStaticPaths` gera as 5 páginas estáticas; o JSON-LD passa a ser montado por funções puras em `src/lib/seo/schema.ts` e o layout recebe nós extras por página.
**Status**: Approved

---

## Test Coverage Matrix

> Generated from codebase, project guidelines, and spec. Guidelines found: `vitest.config.ts` (sem limite de cobertura), padrões de `src/**/*.test.ts` e `tests/build/secrets.test.ts` — strong defaults applied.

| Code Layer | Required Test Type | Coverage Expectation | Location Pattern | Run Command |
| ---------- | ------------------ | -------------------- | ---------------- | ----------- |
| Componentes / páginas / layout Astro | unit (Container API + happy-dom) | 1:1 com os ACs do componente; edge cases listados | `src/**/*.test.ts` (páginas com prefixo `_`) | `npm test` |
| Funções puras (`src/lib/**`, `src/data/**`) | unit | Todos os ramos; 1:1 com os ACs | `src/**/*.test.ts` | `npm test` |
| Configuração (`astro.config.mjs`, `netlify.toml`, `src/config/site.ts`) | unit | Valor exigido pela spec | `tests/*.test.ts`, `src/config/*.test.ts` | `npm test` |
| Arquivos estáticos (`public/`) | unit | Existência e dimensões | `tests/*.test.ts` | `npm test` |
| Saída do build (`dist/`) | integration | Invariantes entre páginas (host, títulos únicos, sitemap, links, CSS) | `tests/build/*.test.ts` | `npm run test:build` |

## Gate Check Commands

| Gate Level | When to Use | Command |
| ---------- | ----------- | ------- |
| Quick | Tarefas com testes unitários | `npm test` |
| Full | Tarefas que mexem na saída do build | `npm test && npm run test:build` |
| Build | Fim de fase | `npm run check && npm test && npm run test:build` |

---

## Execution Plan

### Phase 1: Fundação técnica

```
T1 -> T2
T3
T4
T5 -> T6
T7
```

### Phase 2: Dados e JSON-LD

```
T8 -> T9 -> T10
```

### Phase 3: Páginas e links

```
T11
T12
T13
T14
T15
T16
T17
```

### Phase 4: Verificação da saída

```
T18
```

---

## Task Breakdown

### T1: Host canônico www na configuração ✅

**What**: `site.url` passa a `https://www.leonardoassuncao.com.br`.
**Where**: `src/config/site.ts`
**Depends on**: None
**Reuses**: testes existentes em `src/config/site.test.ts` e `tests/astro-config.test.ts`
**Requirement**: HOST-01, HOST-02

**Tools**: MCP: NONE · Skill: NONE

**Done when**:

- [x] `site.test.ts` e `astro-config.test.ts` esperam o host www
- [x] Gate passa: `npm test`

**Tests**: unit
**Gate**: quick
**Commit**: `fix(seo): use www as the canonical host`

---

### T2: robots.txt gerado da configuração

**What**: Endpoint estático `/robots.txt` com `Allow: /`, `Disallow: /api/` e `Sitemap: <site.url>/sitemap-index.xml`; remove `public/robots.txt`.
**Where**: `src/pages/robots.txt.ts`
**Depends on**: T1
**Reuses**: `site` de `src/config/site.ts`
**Requirement**: HOST-03, HOST-04

**Tools**: MCP: NONE · Skill: NONE

**Done when**:

- [ ] Teste chama o `GET` e confere `Disallow: /api/` e a linha `Sitemap:` com o host www
- [ ] Gate passa: `npm test`

**Tests**: unit
**Gate**: quick
**Commit**: `feat(seo): generate robots.txt from site config`

---

### T3: Redirecionar o subdomínio netlify.app

**What**: Regra 301 forçada de `https://leonardoassuncao.netlify.app/*` para `https://www.leonardoassuncao.com.br/:splat`.
**Where**: `netlify.toml`
**Depends on**: None
**Reuses**: NONE
**Requirement**: HOST-05

**Tools**: MCP: NONE · Skill: NONE

**Done when**:

- [ ] Teste lê `netlify.toml` e confere origem, destino, `status = 301` e `force = true`
- [ ] Gate passa: `npm test`

**Tests**: unit
**Gate**: quick
**Commit**: `fix(seo): redirect netlify.app subdomain to canonical host`

---

### T4: 404 com noindex e sem canônica

**What**: Prop `noindex` no layout: publica `<meta name="robots" content="noindex">` e omite canônica e `og:url`; a 404 usa a prop.
**Where**: `src/layouts/BaseLayout.astro`
**Depends on**: None
**Reuses**: `src/pages/_404.test.ts`
**Requirement**: NOIDX-01, NOIDX-02

**Tools**: MCP: NONE · Skill: NONE

**Done when**:

- [ ] Teste da 404 confere o meta robots e a ausência de canônica e `og:url`
- [ ] Teste do layout confere que sem a prop a canônica continua
- [ ] Gate passa: `npm test`

**Tests**: unit
**Gate**: quick
**Commit**: `fix(seo): keep the 404 page out of the index`

---

### T5: Arquivos de favicon

**What**: `favicon.svg`, `favicon.ico` (48×48), `apple-touch-icon.png` (180×180) e `icon-512.png` (512×512) com a marca (quadrado #5B95FF sobre #0A1A33).
**Where**: `public/favicon.svg`
**Depends on**: None
**Reuses**: tokens `--deep` e `--mark` de `src/styles/tokens.css`
**Requirement**: ICON-01

**Tools**: MCP: NONE · Skill: NONE

**Done when**:

- [ ] Teste lê os 4 arquivos em `public/` e confere as dimensões pelo cabeçalho PNG/ICO
- [ ] Gate passa: `npm test`

**Tests**: unit
**Gate**: quick
**Commit**: `feat(seo): add favicon and touch icons`

---

### T6: Tags de ícone e theme-color

**What**: Layout declara os 3 `link` de ícone e `meta theme-color` `#0a1a33`.
**Where**: `src/layouts/BaseLayout.astro`
**Depends on**: T5
**Reuses**: `src/layouts/BaseLayout.test.ts`
**Requirement**: ICON-02, ICON-03

**Tools**: MCP: NONE · Skill: NONE

**Done when**:

- [ ] Teste do layout confere os `href`, `sizes`, `type` e o theme-color
- [ ] Gate passa: `npm test`

**Tests**: unit
**Gate**: quick
**Commit**: `feat(seo): declare favicons and theme color`

---

### T7: CSS embutido no HTML

**What**: `build.inlineStylesheets: "always"` no Astro.
**Where**: `astro.config.mjs`
**Depends on**: None
**Reuses**: `tests/astro-config.test.ts`
**Requirement**: PERF-01

**Tools**: MCP: NONE · Skill: NONE

**Done when**:

- [ ] Teste da configuração confere o valor
- [ ] Gate passa: `npm test`

**Tests**: unit
**Gate**: quick
**Commit**: `perf: inline stylesheets to drop render-blocking css`

---

### T8: Conteúdo das 5 páginas de serviço

**What**: Módulo com os 5 serviços (slug, nome, resumo do card, title, description, h1, intro, seções h2, FAQ), texto em pt-BR sem afirmações inventadas.
**Where**: `src/data/services.ts`
**Depends on**: None
**Reuses**: textos atuais de `src/components/Services.astro`
**Requirement**: SVC-01, SVC-02, SVC-04, SVC-05, SVC-10

**Tools**: MCP: NONE · Skill: NONE

**Done when**:

- [ ] Teste confere os 5 slugs na ordem, title ≤ 60, description 70–160, ≥ 2 seções, ≥ 3 perguntas, ≥ 600 palavras (intro + seções + FAQ), e nenhum padrão de número + "clientes|projetos|anos|%"
- [ ] Gate passa: `npm test`

**Tests**: unit
**Gate**: quick
**Commit**: `feat(services): add service page content`

---

### T9: Montagem do JSON-LD

**What**: Funções puras que devolvem os nós `ProfessionalService`, `WebSite`, `Person`, `Service`, `BreadcrumbList`, `FAQPage` e o texto do script com `<` escapado.
**Where**: `src/lib/seo/schema.ts`
**Depends on**: T8
**Reuses**: objeto JSON-LD atual de `src/layouts/BaseLayout.astro`
**Requirement**: LD-02, LD-03, LD-04, LD-05, LD-08, LD-09

**Tools**: MCP: NONE · Skill: NONE

**Done when**:

- [ ] Testes 1:1 com LD-02..05, LD-08 e LD-09 (com e sem LinkedIn)
- [ ] Gate passa: `npm test`

**Tests**: unit
**Gate**: quick
**Commit**: `feat(seo): build json-ld graph from site data`

---

### T10: Layout publica o @graph

**What**: Layout passa a publicar um único script com `@graph` (empresa, site, pessoa + nós extras recebidos por prop `schema`).
**Where**: `src/layouts/BaseLayout.astro`
**Depends on**: T9
**Reuses**: `src/lib/seo/schema.ts`
**Requirement**: LD-01

**Tools**: MCP: NONE · Skill: NONE

**Done when**:

- [ ] Teste do layout confere um único script, `@graph` com os 3 nós fixos e o nó extra passado por prop
- [ ] Gate passa: `npm test`

**Tests**: unit
**Gate**: quick
**Commit**: `feat(seo): publish json-ld as a single graph`

---

### T11: Rota das páginas de serviço

**What**: `getStaticPaths` dos 5 serviços; página com trilha, `<article>` (h1, intro, seções, FAQ), "Outros serviços", contato e JSON-LD `Service` + `BreadcrumbList` + `FAQPage`.
**Where**: `src/pages/[servico].astro`
**Depends on**: None
**Reuses**: `BaseLayout`, `Header`, `Contact`, `Footer`, classes `.section-title`/`.reveal`, estilo do `Faq`
**Requirement**: SVC-01, SVC-02, SVC-04, SVC-05, SVC-06, SVC-07, SVC-08, SVC-11, SVC-12, LD-06

**Tools**: MCP: NONE · Skill: NONE

**Done when**:

- [ ] Teste renderiza cada serviço: 1 `h1`, title/description do módulo, ≥ 600 palavras em `article`, ≥ 2 `h2`, ≥ 3 `details`, trilha com `aria-current`, 4 links para os outros serviços sem auto-link, `#contato` com formulário, JSON-LD com FAQ igual ao texto visível
- [ ] Gate passa: `npm test`

**Tests**: unit
**Gate**: quick
**Commit**: `feat(services): add service landing pages`

---

### T12: Cards de serviço apontam para as páginas

**What**: A seção "Serviços" da home lê `src/data/services.ts` e cada card linka para a página do serviço.
**Where**: `src/components/Services.astro`
**Depends on**: None
**Reuses**: `src/data/services.ts`
**Requirement**: LINK-01

**Tools**: MCP: NONE · Skill: NONE

**Done when**:

- [ ] `Services.test.ts` confere os 5 `href` na ordem de SVC-01
- [ ] Gate passa: `npm test`

**Tests**: unit
**Gate**: quick
**Commit**: `feat(services): link home service cards to their pages`

---

### T13: Rodapé com links de serviço

**What**: Rodapé lista os 5 serviços e a política em `/privacidade/`.
**Where**: `src/components/Footer.astro`
**Depends on**: None
**Reuses**: `src/data/services.ts`
**Requirement**: LINK-02, HOST-06

**Tools**: MCP: NONE · Skill: NONE

**Done when**:

- [ ] `Footer.test.ts` confere os 5 `href` de serviço e `/privacidade/`
- [ ] Gate passa: `npm test`

**Tests**: unit
**Gate**: quick
**Commit**: `feat(footer): link service pages and privacy with trailing slash`

---

### T14: Link de privacidade do formulário com barra final

**What**: O link junto ao botão de envio aponta para `/privacidade/`.
**Where**: `src/components/Contact.astro`
**Depends on**: None
**Reuses**: `src/components/Contact.test.ts`
**Requirement**: HOST-06

**Tools**: MCP: NONE · Skill: NONE

**Done when**:

- [ ] `Contact.test.ts` espera `a[href="/privacidade/"]`
- [ ] Gate passa: `npm test`

**Tests**: unit
**Gate**: quick
**Commit**: `fix(contact): link privacy page without redirect`

---

### T15: Título e descrição da home

**What**: Padrões do layout passam a ser o título e a descrição de HOME-01/02.
**Where**: `src/layouts/BaseLayout.astro`
**Depends on**: None
**Reuses**: `src/layouts/BaseLayout.test.ts`
**Requirement**: HOME-01, HOME-02

**Tools**: MCP: NONE · Skill: NONE

**Done when**:

- [ ] Teste confere título e descrição exatos
- [ ] Gate passa: `npm test`

**Tests**: unit
**Gate**: quick
**Commit**: `feat(seo): target service and city in home title`

---

### T16: `<h1>` da home sem as palavras alternadas no texto

**What**: As palavras do rotador viram `data-word` desenhadas por `::before { content: attr(data-word) }`.
**Where**: `src/components/Hero.astro`
**Depends on**: None
**Reuses**: `src/components/Hero.test.ts`
**Requirement**: HOME-03, HOME-04

**Tools**: MCP: NONE · Skill: NONE

**Done when**:

- [ ] Teste confere `textContent` do `h1` = "Construo software sob medida." e os `data-word` na ordem
- [ ] Gate passa: `npm test`

**Tests**: unit
**Gate**: quick
**Commit**: `fix(hero): keep rotating words out of the h1 text`

---

### T17: FAQPage na home

**What**: As perguntas da FAQ saem para um módulo de dados; `Faq.astro` e a home (JSON-LD `FAQPage`) leem dele.
**Where**: `src/data/faq.ts`
**Depends on**: None
**Reuses**: `faqPage` de `src/lib/seo/schema.ts`
**Requirement**: LD-07

**Tools**: MCP: NONE · Skill: NONE

**Done when**:

- [ ] Teste da home confere `FAQPage` com perguntas e respostas iguais ao texto visível
- [ ] `Faq.test.ts` continua passando
- [ ] Gate passa: `npm test`

**Tests**: unit
**Gate**: quick
**Commit**: `feat(seo): publish home faq as structured data`

---

### T18: Invariantes de SEO na saída do build

**What**: Teste de integração lê `dist/`: host www em canônicas/og/JSON-LD/sitemap/robots, links internos com barra final, títulos e descrições únicos, 5 serviços no sitemap, nenhum 404 no sitemap, nenhum `<link rel="stylesheet">`, ícones publicados.
**Where**: `tests/build/seo.test.ts`
**Depends on**: None
**Reuses**: padrão de `tests/build/secrets.test.ts`
**Requirement**: HOST-02, HOST-06, SVC-03, SVC-09, NOIDX-03, PERF-02, ICON-01

**Tools**: MCP: NONE · Skill: NONE

**Done when**:

- [ ] Gate passa: `npm run check && npm test && npm run test:build`

**Tests**: integration
**Gate**: build
**Commit**: `test(seo): assert seo invariants on build output`

---

## Phase Execution Map

```
Phase 1 → Phase 2 → Phase 3 → Phase 4

Phase 1:  T1 → T2
          T3, T4, T7 (independentes)
          T5 → T6
Phase 2:  T8 → T9 → T10
Phase 3:  T11 · T12 · T13 · T14 · T15 · T16 · T17
Phase 4:  T18
```

## Validation Tables

### Diagram-Definition Cross-Check

| Task | Depends On (body) | Diagram | Status |
| ---- | ----------------- | ------- | ------ |
| T1 | None | — | ✅ |
| T2 | T1 | T1 → T2 | ✅ |
| T3–T4 | None | — | ✅ |
| T5 | None | — | ✅ |
| T6 | T5 | T5 → T6 | ✅ |
| T7 | None | — | ✅ |
| T8 | None | — | ✅ |
| T9 | T8 | T8 → T9 | ✅ |
| T10 | T9 | T9 → T10 | ✅ |
| T11–T17 | None (fases anteriores) | — | ✅ |
| T18 | None (fases anteriores) | — | ✅ |

### Test Co-location Validation

| Task | Layer | Matrix | Task | Status |
| ---- | ----- | ------ | ---- | ------ |
| T1, T3, T7 | Configuração | unit | unit | ✅ |
| T5 | Arquivos estáticos | unit | unit | ✅ |
| T2, T4, T6, T10–T16 | Páginas / layout / componentes | unit | unit | ✅ |
| T8, T9, T17 | Funções puras / dados | unit | unit | ✅ |
| T18 | Saída do build | integration | integration | ✅ |

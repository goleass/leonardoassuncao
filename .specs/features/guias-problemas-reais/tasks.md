# Guias de Problemas Reais — Tasks

## Execution Protocol (MANDATORY -- do not skip)

Implement these tasks with the `tlc-spec-driven` skill: **activate it by name and follow its Execute flow and Critical Rules.** Do not search for skill files by filesystem path. The skill is the source of truth for the full flow (per-task cycle, sub-agent delegation, adequacy review, Verifier, discrimination sensor).

**If the skill cannot be activated, STOP and tell the user - do not proceed without it.**

---

**Spec**: `.specs/features/guias-problemas-reais/spec.md`
**Design**: skipped — só conteúdo Markdown e um teste; nenhuma decisão de arquitetura (a estrutura é a de `guias-conteudo`).
**Branch**: `feat/guias-problemas-reais`, a partir de `main`, em worktree separada
**Status**: Draft

---

## Test Coverage Matrix

> Generated from codebase, project guidelines, and spec - confirm before Execute. Guidelines found: `vitest.config.ts` (sem limite de cobertura), `tests/content/guias.test.ts`, matriz de `.specs/features/guias-nichos/tasks.md` — strong defaults applied.

| Code Layer | Required Test Type | Coverage Expectation | Location Pattern | Run Command |
| ---------- | ------------------ | -------------------- | ---------------- | ----------- |
| Teste de conteúdo | unit | PRB-01 a PRB-03 com um caso que passa e um que falha por regra | `tests/content/*.test.ts` | `npm test` |
| Conteúdo (`src/content/guias/*.md`) | unit | PRB-01 e PRB-07 no teste de conteúdo; PRB-08 a PRB-12 na revisão do usuário e do Verificador | `tests/content/*.test.ts` | `npm test` |
| Lógica de guias, SEO e workflow | unit | SCHED-01 a SCHED-09: caso que passa e caso que falha, com a virada do dia em Brasília | `src/lib/**/*.test.ts`, `tests/content/*.test.ts` | `npm test` |
| Saída do build (`dist/`) | integration | Testes existentes mais guias agendados fora da saída | `tests/build/*.test.ts` | `npm run test:build` |

## Gate Check Commands

> Generated from codebase - confirm before Execute.

| Gate Level | When to Use | Command |
| ---------- | ----------- | ------- |
| Quick | Cada guia e o teste de conteúdo | `npm test` |
| Full | — (nenhuma tarefa muda o build além de páginas novas) | `npm test && npm run build && npm run test:build` |
| Build | Fim de cada lote diário | `npm run check && npm test && npm run build && npm run test:build` |

---

## Execution Plan

Cada fase reúne os guias de uma data de publicação. A escrita pode adiantar várias fases por dia; depois do gate Build e da revisão do usuário, merge e push exigem autorização explícita. O cron publica cada guia na sua data (EDGE-05).

### Phase 1: Lote de 05/11 (qui)

Primeiro o filtro, o workflow e o mapa do teste, depois os 3 guias do dia. Termina com o gate Build e a revisão do usuário.

```
T1 → T2 → T3 → T4 → T5 → T6 → T7 → T8
```
### Phase 2: Lote de 06/11 (sex)

Termina com o gate Build e a revisão do usuário.

```
(T8) → T9 → T10
```
### Phase 3: Lote de 07/11 (sáb)

Termina com o gate Build e a revisão do usuário.

```
(T10) → T11 → T12
```
### Phase 4: Lote de 08/11 (dom)

Termina com o gate Build e a revisão do usuário.

```
(T12) → T13 → T14
```
### Phase 5: Lote de 09/11 (seg)

Termina com o gate Build e a revisão do usuário.

```
(T14) → T15 → T16
```
### Phase 6: Lote de 10/11 (ter)

Termina com o gate Build e a revisão do usuário.

```
(T16) → T17 → T18
```
### Phase 7: Lote de 11/11 (qua)

Termina com o gate Build e a revisão do usuário.

```
(T18) → T19 → T20
```
### Phase 8: Lote de 12/11 (qui)

Termina com o gate Build e a revisão do usuário.

```
(T20) → T21 → T22
```
### Phase 9: Lote de 13/11 (sex)

Termina com o gate Build e a revisão do usuário.

```
(T22) → T23 → T24
```
### Phase 10: Lote de 14/11 (sáb)

Termina com o gate Build e a revisão do usuário.

```
(T24) → T25 → T26
```
### Phase 11: Lote de 15/11 (dom)

Termina com o gate Build e a revisão do usuário.

```
(T26) → T27 → T28
```
### Phase 12: Lote de 16/11 (seg)

Termina com o gate Build e a revisão do usuário.

```
(T28) → T29 → T30
```
### Phase 13: Lote de 17/11 (ter)

Termina com o gate Build e a revisão do usuário.

```
(T30) → T31 → T32 → T33
```

---

## Task Breakdown

### T1: Filtrar guias com data futura ✅

**What**: Fazer `selectGuides` omitir, fora do dev, guias com `publishedAt` depois de hoje em `America/Sao_Paulo`.
**Where**: `src/lib/guias/guias.ts`
**Depends on**: None
**Reuses**: `selectGuides` e fixtures de `src/lib/guias/guias.test.ts`
**Requirement**: SCHED-01, SCHED-02, SCHED-04, SCHED-05

**Tools**:

- MCP: NONE
- Skill: NONE

**Done when**:

- [x] Guia de 06/11 fica de fora às 23:59 de 05/11 em Brasília e entra às 00:00 de 06/11 (SCHED-01, SCHED-02)
- [x] Guia futuro com marcador pendente lança erro com o arquivo (SCHED-04)
- [x] `includeDrafts: true` mantém guia futuro (SCHED-05)
- [x] Gate check passes: `npm test`

**Tests**: unit
**Gate**: quick

**Commit**: `feat(guias): hide guides until their publication date`

---

### T2: Ignorar data futura no lastmod ✅

**What**: Fazer `guideDates` ignorar guias com `publishedAt` futuro, para o `<lastmod>` de `/guias/` não apontar para o futuro.
**Where**: `src/lib/seo/lastmod.ts`
**Depends on**: T1
**Reuses**: regra de data de T1; fixtures de `src/lib/seo/lastmod.test.ts`
**Requirement**: SCHED-03

**Tools**:

- MCP: NONE
- Skill: NONE

**Done when**:

- [x] Guia futuro não entra em `guideDates` e não define o `<lastmod>` de `/guias/` (SCHED-03)
- [x] Gate check passes: `npm test`

**Tests**: unit
**Gate**: quick

**Commit**: `fix(seo): ignore scheduled guides in sitemap lastmod`

---

### T3: Separar guias agendados no teste de build ✅

**What**: Tratar como publicados no teste de build só os guias com data até hoje e conferir que os agendados ficam fora da saída.
**Where**: `tests/build/guias.test.ts`
**Depends on**: T2
**Reuses**: lista `DRAFTS` e testes de rascunho do mesmo arquivo
**Requirement**: SCHED-01, SCHED-03

**Tools**:

- MCP: NONE
- Skill: NONE

**Done when**:

- [x] Guia agendado não gera página nem aparece no sitemap, no `llms.txt` ou em `/guias/` (SCHED-01)
- [x] `<lastmod>` de `/guias/` considera só guias publicados (SCHED-03)
- [x] Gate check passes: `npm run check && npm test && npm run build && npm run test:build`

**Tests**: unit
**Gate**: build

**Commit**: `test(guias): keep scheduled guides out of the build output`

---

### T4: Criar o workflow de publicação diária ✅

**What**: Criar o GitHub Actions que aciona o build hook da Netlify todos os dias às 12:07 UTC e também por disparo manual.
**Where**: `.github/workflows/publicar-guias.yml`
**Depends on**: T3
**Reuses**: `tests/content/publish-workflow.test.ts` novo, no padrão de `tests/content`
**Requirement**: SCHED-06, SCHED-07, SCHED-08

**Tools**:

- MCP: NONE
- Skill: NONE

**Done when**:

- [x] Agenda `7 12 * * *` e `workflow_dispatch` (SCHED-06)
- [x] POST para `secrets.NETLIFY_BUILD_HOOK`, sem URL de hook no repositório (SCHED-07)
- [x] `curl --fail` e erro explícito quando o secret está vazio (SCHED-08)
- [x] Gate check passes: `npm test`

**Tests**: unit
**Gate**: quick

**Commit**: `ci(guias): trigger a daily site build for scheduled guides`

---

### T5: Colocar os 27 guias no mapa do teste de conteúdo ✅

**What**: Incluir no mapa os 27 slugs do calendário, reprovar datas com mais de 3 guias desta feature e links para guias com data posterior.
**Where**: `tests/content/guias.test.ts`
**Depends on**: T4
**Reuses**: `NICHE`, `EXPECTED`, `REQUIRED` e os `it` existentes do mesmo arquivo
**Requirement**: PRB-01, PRB-02, PRB-03, SCHED-09

**Tools**:

- MCP: NONE
- Skill: NONE

**Done when**:

- [x] Os 27 slugs estão no mapa com `servico`, `title`, `h1` e link de cluster do calendário (PRB-01)
- [x] Mais de 3 guias desta feature na mesma data reprovam o teste com a data na mensagem (PRB-02)
- [x] Guias do calendário ainda sem arquivo não reprovam o teste (PRB-03)
- [x] Link para guia com data posterior reprova o teste com os dois slugs (SCHED-09)
- [x] Prova de discriminação registrada para PRB-02 e SCHED-09
- [x] Gate check passes: `npm test`; nenhum teste existente removido

**Tests**: unit
**Gate**: quick

**Commit**: `test(guias): add real-problem guides to the content map`

---

### T6: Escrever o guia erp-preenche-ibs-cbs-nfe ✅

**What**: Criar o guia `erp-preenche-ibs-cbs-nfe` com `servico: integracoes`, o `title`, o `h1`, o ângulo e o link de cluster do calendário.
**Where**: `src/content/guias/erp-preenche-ibs-cbs-nfe.md`
**Depends on**: T5
**Reuses**: frontmatter e estrutura de `src/content/guias/bling-nao-sincroniza-pedidos.md`
**Requirement**: PRB-04, PRB-05, PRB-06, PRB-07, PRB-08, PRB-09, PRB-10, PRB-11, PRB-12, EDGE-01, EDGE-04

**Tools**:

- MCP: WebSearch / WebFetch (resultados do h1, perguntas relacionadas, fontes oficiais)
- Skill: NONE

**Done when**:

- [x] Resultados de busca do h1 lidos; o ângulo não repete o de outro guia (PRB-08)
- [x] Cuidados da spec aplicados: Ato Técnico Conjunto CGIBS/RFB nº 1/2026, Ato Conjunto RFB/CGIBS nº 4/2026, Nota Técnica 2025.002 e calendário oficial do Simples; orientar a validar a parte tributária com o contador
- [x] `resumo` responde o h1 na primeira frase; ≥ 4 FAQ; ≥ 4 `##`; ≥ 1.200 palavras; menção a Canoas ou Porto Alegre (PRB-07)
- [x] Links para `/integracoes/` e `/guias/integracao-bling-api/` (PRB-07, PRB-08)
- [x] Nenhum cliente, número, resultado ou experiência não confirmados (PRB-09); fontes oficiais nomeadas no texto (PRB-10)
- [x] Seções de controle atual, com ≥ 3 perdas concretas, e de pronto × sob medida (PRB-11); sem preço de site ou sistema (PRB-12)
- [x] `publishedAt` igual à data do calendário: 2026-11-05 (PRB-05)
- [x] Gate check passes: `npm test`

**Tests**: unit
**Gate**: quick

**Commit**: `feat(guias): add erp-preenche-ibs-cbs-nfe guide`

---

### T7: Escrever o guia pix-sem-txid-erp-nao-da-baixa

**What**: Criar o guia `pix-sem-txid-erp-nao-da-baixa` com `servico: integracoes`, o `title`, o `h1`, o ângulo e o link de cluster do calendário.
**Where**: `src/content/guias/pix-sem-txid-erp-nao-da-baixa.md`
**Depends on**: T6
**Reuses**: frontmatter e estrutura de `src/content/guias/bling-nao-sincroniza-pedidos.md`
**Requirement**: PRB-04, PRB-05, PRB-06, PRB-07, PRB-08, PRB-09, PRB-10, PRB-11, PRB-12, EDGE-01, EDGE-04

**Tools**:

- MCP: WebSearch / WebFetch (resultados do h1, perguntas relacionadas, fontes oficiais)
- Skill: NONE

**Done when**:

- [ ] Resultados de busca do h1 lidos; o ângulo não repete o de outro guia (PRB-08)
- [ ] Cuidados da spec aplicados: Manual e API Pix do Banco Central; documentação do provedor citado
- [ ] `resumo` responde o h1 na primeira frase; ≥ 4 FAQ; ≥ 4 `##`; ≥ 1.200 palavras; menção a Canoas ou Porto Alegre (PRB-07)
- [ ] Links para `/integracoes/` e `/guias/integracao-bling-api/` (PRB-07, PRB-08)
- [ ] Nenhum cliente, número, resultado ou experiência não confirmados (PRB-09); fontes oficiais nomeadas no texto (PRB-10)
- [ ] Seções de controle atual, com ≥ 3 perdas concretas, e de pronto × sob medida (PRB-11); sem preço de site ou sistema (PRB-12)
- [ ] `publishedAt` igual à data do calendário: 2026-11-05 (PRB-05)
- [ ] Gate check passes: `npm test`

**Tests**: unit
**Gate**: quick

**Commit**: `feat(guias): add pix-sem-txid-erp-nao-da-baixa guide`

---

### T8: Escrever o guia locacao-equipamentos-devolucao-parcial

**What**: Criar o guia `locacao-equipamentos-devolucao-parcial` com `servico: software-sob-medida`, o `title`, o `h1`, o ângulo e o link de cluster do calendário.
**Where**: `src/content/guias/locacao-equipamentos-devolucao-parcial.md`
**Depends on**: T7
**Reuses**: frontmatter e estrutura de `src/content/guias/bling-nao-sincroniza-pedidos.md`
**Requirement**: PRB-04, PRB-05, PRB-06, PRB-07, PRB-08, PRB-09, PRB-10, PRB-11, PRB-12, EDGE-01, EDGE-04

**Tools**:

- MCP: WebSearch / WebFetch (resultados do h1, perguntas relacionadas, fontes oficiais)
- Skill: NONE

**Done when**:

- [ ] Resultados de busca do h1 lidos; o ângulo não repete o de outro guia (PRB-08)
- [ ] Cuidados da spec aplicados: Sem norma obrigatória; não afirmar regra contratual como universal
- [ ] `resumo` responde o h1 na primeira frase; ≥ 4 FAQ; ≥ 4 `##`; ≥ 1.200 palavras; menção a Canoas ou Porto Alegre (PRB-07)
- [ ] Links para `/software-sob-medida/` e `/guias/sistema-aluguel-de-cacambas/` (PRB-07, PRB-08)
- [ ] Nenhum cliente, número, resultado ou experiência não confirmados (PRB-09); fontes oficiais nomeadas no texto (PRB-10)
- [ ] Seções de controle atual, com ≥ 3 perdas concretas, e de pronto × sob medida (PRB-11); sem preço de site ou sistema (PRB-12)
- [ ] `publishedAt` igual à data do calendário: 2026-11-05 (PRB-05)
- [ ] Gate check passes: `npm test`

**Tests**: unit
**Gate**: quick

**Commit**: `feat(guias): add locacao-equipamentos-devolucao-parcial guide`

---

### T9: Escrever o guia custo-api-whatsapp-mensagens-servico

**What**: Criar o guia `custo-api-whatsapp-mensagens-servico` com `servico: integracoes`, o `title`, o `h1`, o ângulo e o link de cluster do calendário.
**Where**: `src/content/guias/custo-api-whatsapp-mensagens-servico.md`
**Depends on**: T8
**Reuses**: frontmatter e estrutura de `src/content/guias/bling-nao-sincroniza-pedidos.md`
**Requirement**: PRB-05, PRB-06, PRB-07, PRB-08, PRB-09, PRB-10, PRB-11, PRB-12, EDGE-01, EDGE-04

**Tools**:

- MCP: WebSearch / WebFetch (resultados do h1, perguntas relacionadas, fontes oficiais)
- Skill: NONE

**Done when**:

- [ ] Resultados de busca do h1 lidos; o ângulo não repete o de outro guia (PRB-08)
- [ ] Cuidados da spec aplicados: Tabela e documentação oficial da Meta na data; valores só da fonte oficial
- [ ] `resumo` responde o h1 na primeira frase; ≥ 4 FAQ; ≥ 4 `##`; ≥ 1.200 palavras; menção a Canoas ou Porto Alegre (PRB-07)
- [ ] Links para `/integracoes/` e `/guias/portal-de-pedidos-para-distribuidora/` (PRB-07, PRB-08)
- [ ] Nenhum cliente, número, resultado ou experiência não confirmados (PRB-09); fontes oficiais nomeadas no texto (PRB-10)
- [ ] Seções de controle atual, com ≥ 3 perdas concretas, e de pronto × sob medida (PRB-11); sem preço de site ou sistema (PRB-12)
- [ ] `publishedAt` igual à data do calendário: 2026-11-06 (PRB-05)
- [ ] Gate check passes: `npm test`

**Tests**: unit
**Gate**: quick

**Commit**: `feat(guias): add custo-api-whatsapp-mensagens-servico guide`

---

### T10: Escrever o guia aluguel-trajes-reserva-duplicada

**What**: Criar o guia `aluguel-trajes-reserva-duplicada` com `servico: software-sob-medida`, o `title`, o `h1`, o ângulo e o link de cluster do calendário.
**Where**: `src/content/guias/aluguel-trajes-reserva-duplicada.md`
**Depends on**: T9
**Reuses**: frontmatter e estrutura de `src/content/guias/bling-nao-sincroniza-pedidos.md`
**Requirement**: PRB-05, PRB-06, PRB-07, PRB-08, PRB-09, PRB-10, PRB-11, PRB-12, EDGE-01, EDGE-04

**Tools**:

- MCP: WebSearch / WebFetch (resultados do h1, perguntas relacionadas, fontes oficiais)
- Skill: NONE

**Done when**:

- [ ] Resultados de busca do h1 lidos; o ângulo não repete o de outro guia (PRB-08)
- [ ] Cuidados da spec aplicados: Sem norma obrigatória
- [ ] `resumo` responde o h1 na primeira frase; ≥ 4 FAQ; ≥ 4 `##`; ≥ 1.200 palavras; menção a Canoas ou Porto Alegre (PRB-07)
- [ ] Links para `/software-sob-medida/` e `/guias/site-aluguel-de-inflaveis/` (PRB-07, PRB-08)
- [ ] Nenhum cliente, número, resultado ou experiência não confirmados (PRB-09); fontes oficiais nomeadas no texto (PRB-10)
- [ ] Seções de controle atual, com ≥ 3 perdas concretas, e de pronto × sob medida (PRB-11); sem preço de site ou sistema (PRB-12)
- [ ] `publishedAt` igual à data do calendário: 2026-11-06 (PRB-05)
- [ ] Gate check passes: `npm test`

**Tests**: unit
**Gate**: quick

**Commit**: `feat(guias): add aluguel-trajes-reserva-duplicada guide`

---

### T11: Escrever o guia omie-erro-425-bloqueio-api

**What**: Criar o guia `omie-erro-425-bloqueio-api` com `servico: manutencao-de-sistemas`, o `title`, o `h1`, o ângulo e o link de cluster do calendário.
**Where**: `src/content/guias/omie-erro-425-bloqueio-api.md`
**Depends on**: T10
**Reuses**: frontmatter e estrutura de `src/content/guias/bling-nao-sincroniza-pedidos.md`
**Requirement**: PRB-05, PRB-06, PRB-07, PRB-08, PRB-09, PRB-10, PRB-11, PRB-12, EDGE-01, EDGE-04

**Tools**:

- MCP: WebSearch / WebFetch (resultados do h1, perguntas relacionadas, fontes oficiais)
- Skill: NONE

**Done when**:

- [ ] Resultados de busca do h1 lidos; o ângulo não repete o de outro guia (PRB-08)
- [ ] Cuidados da spec aplicados: Central de ajuda da Omie: limites de consumo e tratamento de erros
- [ ] `resumo` responde o h1 na primeira frase; ≥ 4 FAQ; ≥ 4 `##`; ≥ 1.200 palavras; menção a Canoas ou Porto Alegre (PRB-07)
- [ ] Links para `/manutencao-de-sistemas/` e `/guias/integracao-bling-api/` (PRB-07, PRB-08)
- [ ] Nenhum cliente, número, resultado ou experiência não confirmados (PRB-09); fontes oficiais nomeadas no texto (PRB-10)
- [ ] Seções de controle atual, com ≥ 3 perdas concretas, e de pronto × sob medida (PRB-11); sem preço de site ou sistema (PRB-12)
- [ ] `publishedAt` igual à data do calendário: 2026-11-07 (PRB-05)
- [ ] Gate check passes: `npm test`

**Tests**: unit
**Gate**: quick

**Commit**: `feat(guias): add omie-erro-425-bloqueio-api guide`

---

### T12: Escrever o guia laboratorio-protese-controle-trabalhos

**What**: Criar o guia `laboratorio-protese-controle-trabalhos` com `servico: sistemas-web`, o `title`, o `h1`, o ângulo e o link de cluster do calendário.
**Where**: `src/content/guias/laboratorio-protese-controle-trabalhos.md`
**Depends on**: T11
**Reuses**: frontmatter e estrutura de `src/content/guias/bling-nao-sincroniza-pedidos.md`
**Requirement**: PRB-05, PRB-06, PRB-07, PRB-08, PRB-09, PRB-10, PRB-11, PRB-12, EDGE-01, EDGE-04

**Tools**:

- MCP: WebSearch / WebFetch (resultados do h1, perguntas relacionadas, fontes oficiais)
- Skill: NONE

**Done when**:

- [ ] Resultados de busca do h1 lidos; o ângulo não repete o de outro guia (PRB-08)
- [ ] Cuidados da spec aplicados: LGPD só com artigo conferido na Lei 13.709/2018; sem orientação clínica
- [ ] `resumo` responde o h1 na primeira frase; ≥ 4 FAQ; ≥ 4 `##`; ≥ 1.200 palavras; menção a Canoas ou Porto Alegre (PRB-07)
- [ ] Links para `/sistemas-web/` e `/guias/sistema-fabrica-de-uniformes/` (PRB-07, PRB-08)
- [ ] Nenhum cliente, número, resultado ou experiência não confirmados (PRB-09); fontes oficiais nomeadas no texto (PRB-10)
- [ ] Seções de controle atual, com ≥ 3 perdas concretas, e de pronto × sob medida (PRB-11); sem preço de site ou sistema (PRB-12)
- [ ] `publishedAt` igual à data do calendário: 2026-11-07 (PRB-05)
- [ ] Gate check passes: `npm test`

**Tests**: unit
**Gate**: quick

**Commit**: `feat(guias): add laboratorio-protese-controle-trabalhos guide`

---

### T13: Escrever o guia pagamento-duplicado-valor-diferente

**What**: Criar o guia `pagamento-duplicado-valor-diferente` com `servico: integracoes`, o `title`, o `h1`, o ângulo e o link de cluster do calendário.
**Where**: `src/content/guias/pagamento-duplicado-valor-diferente.md`
**Depends on**: T12
**Reuses**: frontmatter e estrutura de `src/content/guias/bling-nao-sincroniza-pedidos.md`
**Requirement**: PRB-05, PRB-06, PRB-07, PRB-08, PRB-09, PRB-10, PRB-11, PRB-12, EDGE-01, EDGE-04

**Tools**:

- MCP: WebSearch / WebFetch (resultados do h1, perguntas relacionadas, fontes oficiais)
- Skill: NONE

**Done when**:

- [ ] Resultados de busca do h1 lidos; o ângulo não repete o de outro guia (PRB-08)
- [ ] Cuidados da spec aplicados: Documentação dos provedores citados
- [ ] `resumo` responde o h1 na primeira frase; ≥ 4 FAQ; ≥ 4 `##`; ≥ 1.200 palavras; menção a Canoas ou Porto Alegre (PRB-07)
- [ ] Links para `/integracoes/` e `/guias/pix-sem-txid-erp-nao-da-baixa/` (PRB-07, PRB-08)
- [ ] Nenhum cliente, número, resultado ou experiência não confirmados (PRB-09); fontes oficiais nomeadas no texto (PRB-10)
- [ ] Seções de controle atual, com ≥ 3 perdas concretas, e de pronto × sob medida (PRB-11); sem preço de site ou sistema (PRB-12)
- [ ] `publishedAt` igual à data do calendário: 2026-11-08 (PRB-05)
- [ ] Gate check passes: `npm test`

**Tests**: unit
**Gate**: quick

**Commit**: `feat(guias): add pagamento-duplicado-valor-diferente guide`

---

### T14: Escrever o guia oficina-historico-servicos-por-placa

**What**: Criar o guia `oficina-historico-servicos-por-placa` com `servico: software-sob-medida`, o `title`, o `h1`, o ângulo e o link de cluster do calendário.
**Where**: `src/content/guias/oficina-historico-servicos-por-placa.md`
**Depends on**: T13
**Reuses**: frontmatter e estrutura de `src/content/guias/bling-nao-sincroniza-pedidos.md`
**Requirement**: PRB-05, PRB-06, PRB-07, PRB-08, PRB-09, PRB-10, PRB-11, PRB-12, EDGE-01, EDGE-04

**Tools**:

- MCP: WebSearch / WebFetch (resultados do h1, perguntas relacionadas, fontes oficiais)
- Skill: NONE

**Done when**:

- [ ] Resultados de busca do h1 lidos; o ângulo não repete o de outro guia (PRB-08)
- [ ] Cuidados da spec aplicados: Prazos de garantia só com artigo conferido no Código de Defesa do Consumidor
- [ ] `resumo` responde o h1 na primeira frase; ≥ 4 FAQ; ≥ 4 `##`; ≥ 1.200 palavras; menção a Canoas ou Porto Alegre (PRB-07)
- [ ] Links para `/software-sob-medida/` e `/guias/sistema-ordem-de-servico-ar-condicionado/` (PRB-07, PRB-08)
- [ ] Nenhum cliente, número, resultado ou experiência não confirmados (PRB-09); fontes oficiais nomeadas no texto (PRB-10)
- [ ] Seções de controle atual, com ≥ 3 perdas concretas, e de pronto × sob medida (PRB-11); sem preço de site ou sistema (PRB-12)
- [ ] `publishedAt` igual à data do calendário: 2026-11-08 (PRB-05)
- [ ] Gate check passes: `npm test`

**Tests**: unit
**Gate**: quick

**Commit**: `feat(guias): add oficina-historico-servicos-por-placa guide`

---

### T15: Escrever o guia omie-consumo-indevido-get

**What**: Criar o guia `omie-consumo-indevido-get` com `servico: manutencao-de-sistemas`, o `title`, o `h1`, o ângulo e o link de cluster do calendário.
**Where**: `src/content/guias/omie-consumo-indevido-get.md`
**Depends on**: T14
**Reuses**: frontmatter e estrutura de `src/content/guias/bling-nao-sincroniza-pedidos.md`
**Requirement**: PRB-05, PRB-06, PRB-07, PRB-08, PRB-09, PRB-10, PRB-11, PRB-12, EDGE-01, EDGE-04

**Tools**:

- MCP: WebSearch / WebFetch (resultados do h1, perguntas relacionadas, fontes oficiais)
- Skill: NONE

**Done when**:

- [ ] Resultados de busca do h1 lidos; o ângulo não repete o de outro guia (PRB-08)
- [ ] Cuidados da spec aplicados: Central de ajuda da Omie; precisa atingir 1.200 palavras sem enchimento (ver Edge Cases)
- [ ] `resumo` responde o h1 na primeira frase; ≥ 4 FAQ; ≥ 4 `##`; ≥ 1.200 palavras; menção a Canoas ou Porto Alegre (PRB-07)
- [ ] Links para `/manutencao-de-sistemas/` e `/guias/omie-erro-425-bloqueio-api/` (PRB-07, PRB-08)
- [ ] Nenhum cliente, número, resultado ou experiência não confirmados (PRB-09); fontes oficiais nomeadas no texto (PRB-10)
- [ ] Seções de controle atual, com ≥ 3 perdas concretas, e de pronto × sob medida (PRB-11); sem preço de site ou sistema (PRB-12)
- [ ] `publishedAt` igual à data do calendário: 2026-11-09 (PRB-05)
- [ ] Gate check passes: `npm test`

**Tests**: unit
**Gate**: quick

**Commit**: `feat(guias): add omie-consumo-indevido-get guide`

---

### T16: Escrever o guia grafica-registro-aprovacao-arte

**What**: Criar o guia `grafica-registro-aprovacao-arte` com `servico: sistemas-web`, o `title`, o `h1`, o ângulo e o link de cluster do calendário.
**Where**: `src/content/guias/grafica-registro-aprovacao-arte.md`
**Depends on**: T15
**Reuses**: frontmatter e estrutura de `src/content/guias/bling-nao-sincroniza-pedidos.md`
**Requirement**: PRB-05, PRB-06, PRB-07, PRB-08, PRB-09, PRB-10, PRB-11, PRB-12, EDGE-01, EDGE-04

**Tools**:

- MCP: WebSearch / WebFetch (resultados do h1, perguntas relacionadas, fontes oficiais)
- Skill: NONE

**Done when**:

- [ ] Resultados de busca do h1 lidos; o ângulo não repete o de outro guia (PRB-08)
- [ ] Cuidados da spec aplicados: Não prometer valor jurídico sem fonte; registro serve como organização da prova
- [ ] `resumo` responde o h1 na primeira frase; ≥ 4 FAQ; ≥ 4 `##`; ≥ 1.200 palavras; menção a Canoas ou Porto Alegre (PRB-07)
- [ ] Links para `/sistemas-web/` e `/guias/sistema-fabrica-de-uniformes/` (PRB-07, PRB-08)
- [ ] Nenhum cliente, número, resultado ou experiência não confirmados (PRB-09); fontes oficiais nomeadas no texto (PRB-10)
- [ ] Seções de controle atual, com ≥ 3 perdas concretas, e de pronto × sob medida (PRB-11); sem preço de site ou sistema (PRB-12)
- [ ] `publishedAt` igual à data do calendário: 2026-11-09 (PRB-05)
- [ ] Gate check passes: `npm test`

**Tests**: unit
**Gate**: quick

**Commit**: `feat(guias): add grafica-registro-aprovacao-arte guide`

---

### T17: Escrever o guia pilates-controle-reposicao-aulas

**What**: Criar o guia `pilates-controle-reposicao-aulas` com `servico: sistemas-web`, o `title`, o `h1`, o ângulo e o link de cluster do calendário.
**Where**: `src/content/guias/pilates-controle-reposicao-aulas.md`
**Depends on**: T16
**Reuses**: frontmatter e estrutura de `src/content/guias/bling-nao-sincroniza-pedidos.md`
**Requirement**: PRB-05, PRB-06, PRB-07, PRB-08, PRB-09, PRB-10, PRB-11, PRB-12, EDGE-01, EDGE-04

**Tools**:

- MCP: WebSearch / WebFetch (resultados do h1, perguntas relacionadas, fontes oficiais)
- Skill: NONE

**Done when**:

- [ ] Resultados de busca do h1 lidos; o ângulo não repete o de outro guia (PRB-08)
- [ ] Cuidados da spec aplicados: Sem orientação de saúde
- [ ] `resumo` responde o h1 na primeira frase; ≥ 4 FAQ; ≥ 4 `##`; ≥ 1.200 palavras; menção a Canoas ou Porto Alegre (PRB-07)
- [ ] Links para `/sistemas-web/` e `/guias/quanto-custa-um-sistema-sob-medida/` (PRB-07, PRB-08)
- [ ] Nenhum cliente, número, resultado ou experiência não confirmados (PRB-09); fontes oficiais nomeadas no texto (PRB-10)
- [ ] Seções de controle atual, com ≥ 3 perdas concretas, e de pronto × sob medida (PRB-11); sem preço de site ou sistema (PRB-12)
- [ ] `publishedAt` igual à data do calendário: 2026-11-10 (PRB-05)
- [ ] Gate check passes: `npm test`

**Tests**: unit
**Gate**: quick

**Commit**: `feat(guias): add pilates-controle-reposicao-aulas guide`

---

### T18: Escrever o guia imobiliaria-repasse-proprietarios

**What**: Criar o guia `imobiliaria-repasse-proprietarios` com `servico: software-sob-medida`, o `title`, o `h1`, o ângulo e o link de cluster do calendário.
**Where**: `src/content/guias/imobiliaria-repasse-proprietarios.md`
**Depends on**: T17
**Reuses**: frontmatter e estrutura de `src/content/guias/bling-nao-sincroniza-pedidos.md`
**Requirement**: PRB-05, PRB-06, PRB-07, PRB-08, PRB-09, PRB-10, PRB-11, PRB-12, EDGE-01, EDGE-04

**Tools**:

- MCP: WebSearch / WebFetch (resultados do h1, perguntas relacionadas, fontes oficiais)
- Skill: NONE

**Done when**:

- [ ] Resultados de busca do h1 lidos; o ângulo não repete o de outro guia (PRB-08)
- [ ] Cuidados da spec aplicados: Lei 8.245/1991 só no que for conferido; índices e regras tributárias só de fonte oficial
- [ ] `resumo` responde o h1 na primeira frase; ≥ 4 FAQ; ≥ 4 `##`; ≥ 1.200 palavras; menção a Canoas ou Porto Alegre (PRB-07)
- [ ] Links para `/software-sob-medida/` e `/guias/quanto-custa-um-sistema-sob-medida/` (PRB-07, PRB-08)
- [ ] Nenhum cliente, número, resultado ou experiência não confirmados (PRB-09); fontes oficiais nomeadas no texto (PRB-10)
- [ ] Seções de controle atual, com ≥ 3 perdas concretas, e de pronto × sob medida (PRB-11); sem preço de site ou sistema (PRB-12)
- [ ] `publishedAt` igual à data do calendário: 2026-11-10 (PRB-05)
- [ ] Gate check passes: `npm test`

**Tests**: unit
**Gate**: quick

**Commit**: `feat(guias): add imobiliaria-repasse-proprietarios guide`

---

### T19: Escrever o guia pagamento-aprovado-dinheiro-nao-caiu

**What**: Criar o guia `pagamento-aprovado-dinheiro-nao-caiu` com `servico: integracoes`, o `title`, o `h1`, o ângulo e o link de cluster do calendário.
**Where**: `src/content/guias/pagamento-aprovado-dinheiro-nao-caiu.md`
**Depends on**: T18
**Reuses**: frontmatter e estrutura de `src/content/guias/bling-nao-sincroniza-pedidos.md`
**Requirement**: PRB-05, PRB-06, PRB-07, PRB-08, PRB-09, PRB-10, PRB-11, PRB-12, EDGE-01, EDGE-04

**Tools**:

- MCP: WebSearch / WebFetch (resultados do h1, perguntas relacionadas, fontes oficiais)
- Skill: NONE

**Done when**:

- [ ] Resultados de busca do h1 lidos; o ângulo não repete o de outro guia (PRB-08)
- [ ] Cuidados da spec aplicados: Documentação dos provedores citados; prazos só da fonte oficial
- [ ] `resumo` responde o h1 na primeira frase; ≥ 4 FAQ; ≥ 4 `##`; ≥ 1.200 palavras; menção a Canoas ou Porto Alegre (PRB-07)
- [ ] Links para `/integracoes/` e `/guias/pagamento-duplicado-valor-diferente/` (PRB-07, PRB-08)
- [ ] Nenhum cliente, número, resultado ou experiência não confirmados (PRB-09); fontes oficiais nomeadas no texto (PRB-10)
- [ ] Seções de controle atual, com ≥ 3 perdas concretas, e de pronto × sob medida (PRB-11); sem preço de site ou sistema (PRB-12)
- [ ] `publishedAt` igual à data do calendário: 2026-11-11 (PRB-05)
- [ ] Gate check passes: `npm test`

**Tests**: unit
**Gate**: quick

**Commit**: `feat(guias): add pagamento-aprovado-dinheiro-nao-caiu guide`

---

### T20: Escrever o guia estetica-controle-pacotes-sessoes

**What**: Criar o guia `estetica-controle-pacotes-sessoes` com `servico: sistemas-web`, o `title`, o `h1`, o ângulo e o link de cluster do calendário.
**Where**: `src/content/guias/estetica-controle-pacotes-sessoes.md`
**Depends on**: T19
**Reuses**: frontmatter e estrutura de `src/content/guias/bling-nao-sincroniza-pedidos.md`
**Requirement**: PRB-05, PRB-06, PRB-07, PRB-08, PRB-09, PRB-10, PRB-11, PRB-12, EDGE-01, EDGE-04

**Tools**:

- MCP: WebSearch / WebFetch (resultados do h1, perguntas relacionadas, fontes oficiais)
- Skill: NONE

**Done when**:

- [ ] Resultados de busca do h1 lidos; o ângulo não repete o de outro guia (PRB-08)
- [ ] Cuidados da spec aplicados: LGPD só com artigo conferido; sem alegação clínica
- [ ] `resumo` responde o h1 na primeira frase; ≥ 4 FAQ; ≥ 4 `##`; ≥ 1.200 palavras; menção a Canoas ou Porto Alegre (PRB-07)
- [ ] Links para `/sistemas-web/` e `/guias/pilates-controle-reposicao-aulas/` (PRB-07, PRB-08)
- [ ] Nenhum cliente, número, resultado ou experiência não confirmados (PRB-09); fontes oficiais nomeadas no texto (PRB-10)
- [ ] Seções de controle atual, com ≥ 3 perdas concretas, e de pronto × sob medida (PRB-11); sem preço de site ou sistema (PRB-12)
- [ ] `publishedAt` igual à data do calendário: 2026-11-11 (PRB-05)
- [ ] Gate check passes: `npm test`

**Tests**: unit
**Gate**: quick

**Commit**: `feat(guias): add estetica-controle-pacotes-sessoes guide`

---

### T21: Escrever o guia marmoraria-erro-medida-retalhos

**What**: Criar o guia `marmoraria-erro-medida-retalhos` com `servico: software-sob-medida`, o `title`, o `h1`, o ângulo e o link de cluster do calendário.
**Where**: `src/content/guias/marmoraria-erro-medida-retalhos.md`
**Depends on**: T20
**Reuses**: frontmatter e estrutura de `src/content/guias/bling-nao-sincroniza-pedidos.md`
**Requirement**: PRB-05, PRB-06, PRB-07, PRB-08, PRB-09, PRB-10, PRB-11, PRB-12, EDGE-01, EDGE-04

**Tools**:

- MCP: WebSearch / WebFetch (resultados do h1, perguntas relacionadas, fontes oficiais)
- Skill: NONE

**Done when**:

- [ ] Resultados de busca do h1 lidos; o ângulo não repete o de outro guia (PRB-08)
- [ ] Cuidados da spec aplicados: Sem norma obrigatória
- [ ] `resumo` responde o h1 na primeira frase; ≥ 4 FAQ; ≥ 4 `##`; ≥ 1.200 palavras; menção a Canoas ou Porto Alegre (PRB-07)
- [ ] Links para `/software-sob-medida/` e `/guias/quanto-custa-site-para-vidracaria/` (PRB-07, PRB-08)
- [ ] Nenhum cliente, número, resultado ou experiência não confirmados (PRB-09); fontes oficiais nomeadas no texto (PRB-10)
- [ ] Seções de controle atual, com ≥ 3 perdas concretas, e de pronto × sob medida (PRB-11); sem preço de site ou sistema (PRB-12)
- [ ] `publishedAt` igual à data do calendário: 2026-11-12 (PRB-05)
- [ ] Gate check passes: `npm test`

**Tests**: unit
**Gate**: quick

**Commit**: `feat(guias): add marmoraria-erro-medida-retalhos guide`

---

### T22: Escrever o guia bling-integracao-parou-token

**What**: Criar o guia `bling-integracao-parou-token` com `servico: manutencao-de-sistemas`, o `title`, o `h1`, o ângulo e o link de cluster do calendário.
**Where**: `src/content/guias/bling-integracao-parou-token.md`
**Depends on**: T21
**Reuses**: frontmatter e estrutura de `src/content/guias/bling-nao-sincroniza-pedidos.md`
**Requirement**: PRB-05, PRB-06, PRB-07, PRB-08, PRB-09, PRB-10, PRB-11, PRB-12, EDGE-01, EDGE-04

**Tools**:

- MCP: WebSearch / WebFetch (resultados do h1, perguntas relacionadas, fontes oficiais)
- Skill: NONE

**Done when**:

- [ ] Resultados de busca do h1 lidos; o ângulo não repete o de outro guia (PRB-08)
- [ ] Cuidados da spec aplicados: Prazos só da documentação oficial da API v3; a fonte atual é de terceiro
- [ ] `resumo` responde o h1 na primeira frase; ≥ 4 FAQ; ≥ 4 `##`; ≥ 1.200 palavras; menção a Canoas ou Porto Alegre (PRB-07)
- [ ] Links para `/manutencao-de-sistemas/` e `/guias/integracao-bling-api/` (PRB-07, PRB-08)
- [ ] Nenhum cliente, número, resultado ou experiência não confirmados (PRB-09); fontes oficiais nomeadas no texto (PRB-10)
- [ ] Seções de controle atual, com ≥ 3 perdas concretas, e de pronto × sob medida (PRB-11); sem preço de site ou sistema (PRB-12)
- [ ] `publishedAt` igual à data do calendário: 2026-11-12 (PRB-05)
- [ ] Gate check passes: `npm test`

**Tests**: unit
**Gate**: quick

**Commit**: `feat(guias): add bling-integracao-parou-token guide`

---

### T23: Escrever o guia marcenaria-orcado-custo-real

**What**: Criar o guia `marcenaria-orcado-custo-real` com `servico: software-sob-medida`, o `title`, o `h1`, o ângulo e o link de cluster do calendário.
**Where**: `src/content/guias/marcenaria-orcado-custo-real.md`
**Depends on**: T22
**Reuses**: frontmatter e estrutura de `src/content/guias/bling-nao-sincroniza-pedidos.md`
**Requirement**: PRB-05, PRB-06, PRB-07, PRB-08, PRB-09, PRB-10, PRB-11, PRB-12, EDGE-01, EDGE-04

**Tools**:

- MCP: WebSearch / WebFetch (resultados do h1, perguntas relacionadas, fontes oficiais)
- Skill: NONE

**Done when**:

- [ ] Resultados de busca do h1 lidos; o ângulo não repete o de outro guia (PRB-08)
- [ ] Cuidados da spec aplicados: Exemplos claramente hipotéticos, sem dados de lucro inventados
- [ ] `resumo` responde o h1 na primeira frase; ≥ 4 FAQ; ≥ 4 `##`; ≥ 1.200 palavras; menção a Canoas ou Porto Alegre (PRB-07)
- [ ] Links para `/software-sob-medida/` e `/guias/quanto-custa-um-sistema-sob-medida/` (PRB-07, PRB-08)
- [ ] Nenhum cliente, número, resultado ou experiência não confirmados (PRB-09); fontes oficiais nomeadas no texto (PRB-10)
- [ ] Seções de controle atual, com ≥ 3 perdas concretas, e de pronto × sob medida (PRB-11); sem preço de site ou sistema (PRB-12)
- [ ] `publishedAt` igual à data do calendário: 2026-11-13 (PRB-05)
- [ ] Gate check passes: `npm test`

**Tests**: unit
**Gate**: quick

**Commit**: `feat(guias): add marcenaria-orcado-custo-real guide`

---

### T24: Escrever o guia transporte-escolar-controle-mensalidades

**What**: Criar o guia `transporte-escolar-controle-mensalidades` com `servico: sistemas-web`, o `title`, o `h1`, o ângulo e o link de cluster do calendário.
**Where**: `src/content/guias/transporte-escolar-controle-mensalidades.md`
**Depends on**: T23
**Reuses**: frontmatter e estrutura de `src/content/guias/bling-nao-sincroniza-pedidos.md`
**Requirement**: PRB-05, PRB-06, PRB-07, PRB-08, PRB-09, PRB-10, PRB-11, PRB-12, EDGE-01, EDGE-04

**Tools**:

- MCP: WebSearch / WebFetch (resultados do h1, perguntas relacionadas, fontes oficiais)
- Skill: NONE

**Done when**:

- [ ] Resultados de busca do h1 lidos; o ângulo não repete o de outro guia (PRB-08)
- [ ] Cuidados da spec aplicados: Art. 42 do CDC só se conferido; LGPD de menores só com artigo conferido
- [ ] `resumo` responde o h1 na primeira frase; ≥ 4 FAQ; ≥ 4 `##`; ≥ 1.200 palavras; menção a Canoas ou Porto Alegre (PRB-07)
- [ ] Links para `/sistemas-web/` e `/guias/pix-sem-txid-erp-nao-da-baixa/` (PRB-07, PRB-08)
- [ ] Nenhum cliente, número, resultado ou experiência não confirmados (PRB-09); fontes oficiais nomeadas no texto (PRB-10)
- [ ] Seções de controle atual, com ≥ 3 perdas concretas, e de pronto × sob medida (PRB-11); sem preço de site ou sistema (PRB-12)
- [ ] `publishedAt` igual à data do calendário: 2026-11-13 (PRB-05)
- [ ] Gate check passes: `npm test`

**Tests**: unit
**Gate**: quick

**Commit**: `feat(guias): add transporte-escolar-controle-mensalidades guide`

---

### T25: Escrever o guia energia-solar-homologacao-garantia

**What**: Criar o guia `energia-solar-homologacao-garantia` com `servico: sistemas-web`, o `title`, o `h1`, o ângulo e o link de cluster do calendário.
**Where**: `src/content/guias/energia-solar-homologacao-garantia.md`
**Depends on**: T24
**Reuses**: frontmatter e estrutura de `src/content/guias/bling-nao-sincroniza-pedidos.md`
**Requirement**: PRB-05, PRB-06, PRB-07, PRB-08, PRB-09, PRB-10, PRB-11, PRB-12, EDGE-01, EDGE-04

**Tools**:

- MCP: WebSearch / WebFetch (resultados do h1, perguntas relacionadas, fontes oficiais)
- Skill: NONE

**Done when**:

- [ ] Resultados de busca do h1 lidos; o ângulo não repete o de outro guia (PRB-08)
- [ ] Cuidados da spec aplicados: Lei 14.300/2022 e norma da ANEEL conferidas na data
- [ ] `resumo` responde o h1 na primeira frase; ≥ 4 FAQ; ≥ 4 `##`; ≥ 1.200 palavras; menção a Canoas ou Porto Alegre (PRB-07)
- [ ] Links para `/sistemas-web/` e `/guias/sistema-ordem-de-servico-ar-condicionado/` (PRB-07, PRB-08)
- [ ] Nenhum cliente, número, resultado ou experiência não confirmados (PRB-09); fontes oficiais nomeadas no texto (PRB-10)
- [ ] Seções de controle atual, com ≥ 3 perdas concretas, e de pronto × sob medida (PRB-11); sem preço de site ou sistema (PRB-12)
- [ ] `publishedAt` igual à data do calendário: 2026-11-14 (PRB-05)
- [ ] Gate check passes: `npm test`

**Tests**: unit
**Gate**: quick

**Commit**: `feat(guias): add energia-solar-homologacao-garantia guide`

---

### T26: Escrever o guia assistencia-celular-aparelho-abandonado

**What**: Criar o guia `assistencia-celular-aparelho-abandonado` com `servico: software-sob-medida`, o `title`, o `h1`, o ângulo e o link de cluster do calendário.
**Where**: `src/content/guias/assistencia-celular-aparelho-abandonado.md`
**Depends on**: T25
**Reuses**: frontmatter e estrutura de `src/content/guias/bling-nao-sincroniza-pedidos.md`
**Requirement**: PRB-05, PRB-06, PRB-07, PRB-08, PRB-09, PRB-10, PRB-11, PRB-12, EDGE-01, EDGE-04

**Tools**:

- MCP: WebSearch / WebFetch (resultados do h1, perguntas relacionadas, fontes oficiais)
- Skill: NONE

**Done when**:

- [ ] Resultados de busca do h1 lidos; o ângulo não repete o de outro guia (PRB-08)
- [ ] Cuidados da spec aplicados: Não indicar descarte ou venda sem fonte legal; orientar consulta a advogado
- [ ] `resumo` responde o h1 na primeira frase; ≥ 4 FAQ; ≥ 4 `##`; ≥ 1.200 palavras; menção a Canoas ou Porto Alegre (PRB-07)
- [ ] Links para `/software-sob-medida/` e `/guias/oficina-historico-servicos-por-placa/` (PRB-07, PRB-08)
- [ ] Nenhum cliente, número, resultado ou experiência não confirmados (PRB-09); fontes oficiais nomeadas no texto (PRB-10)
- [ ] Seções de controle atual, com ≥ 3 perdas concretas, e de pronto × sob medida (PRB-11); sem preço de site ou sistema (PRB-12)
- [ ] `publishedAt` igual à data do calendário: 2026-11-14 (PRB-05)
- [ ] Gate check passes: `npm test`

**Tests**: unit
**Gate**: quick

**Commit**: `feat(guias): add assistencia-celular-aparelho-abandonado guide`

---

### T27: Escrever o guia escolinha-futebol-mensalidades-pix

**What**: Criar o guia `escolinha-futebol-mensalidades-pix` com `servico: sistemas-web`, o `title`, o `h1`, o ângulo e o link de cluster do calendário.
**Where**: `src/content/guias/escolinha-futebol-mensalidades-pix.md`
**Depends on**: T26
**Reuses**: frontmatter e estrutura de `src/content/guias/bling-nao-sincroniza-pedidos.md`
**Requirement**: PRB-05, PRB-06, PRB-07, PRB-08, PRB-09, PRB-10, PRB-11, PRB-12, EDGE-01, EDGE-04

**Tools**:

- MCP: WebSearch / WebFetch (resultados do h1, perguntas relacionadas, fontes oficiais)
- Skill: NONE

**Done when**:

- [ ] Resultados de busca do h1 lidos; o ângulo não repete o de outro guia (PRB-08)
- [ ] Cuidados da spec aplicados: LGPD de menores só com artigo conferido
- [ ] `resumo` responde o h1 na primeira frase; ≥ 4 FAQ; ≥ 4 `##`; ≥ 1.200 palavras; menção a Canoas ou Porto Alegre (PRB-07)
- [ ] Links para `/sistemas-web/` e `/guias/transporte-escolar-controle-mensalidades/` (PRB-07, PRB-08)
- [ ] Nenhum cliente, número, resultado ou experiência não confirmados (PRB-09); fontes oficiais nomeadas no texto (PRB-10)
- [ ] Seções de controle atual, com ≥ 3 perdas concretas, e de pronto × sob medida (PRB-11); sem preço de site ou sistema (PRB-12)
- [ ] `publishedAt` igual à data do calendário: 2026-11-15 (PRB-05)
- [ ] Gate check passes: `npm test`

**Tests**: unit
**Gate**: quick

**Commit**: `feat(guias): add escolinha-futebol-mensalidades-pix guide`

---

### T28: Escrever o guia condominio-reserva-salao-festas

**What**: Criar o guia `condominio-reserva-salao-festas` com `servico: sistemas-web`, o `title`, o `h1`, o ângulo e o link de cluster do calendário.
**Where**: `src/content/guias/condominio-reserva-salao-festas.md`
**Depends on**: T27
**Reuses**: frontmatter e estrutura de `src/content/guias/bling-nao-sincroniza-pedidos.md`
**Requirement**: PRB-05, PRB-06, PRB-07, PRB-08, PRB-09, PRB-10, PRB-11, PRB-12, EDGE-01, EDGE-04

**Tools**:

- MCP: WebSearch / WebFetch (resultados do h1, perguntas relacionadas, fontes oficiais)
- Skill: NONE

**Done when**:

- [ ] Resultados de busca do h1 lidos; o ângulo não repete o de outro guia (PRB-08)
- [ ] Cuidados da spec aplicados: Regras dependem da convenção de cada condomínio; Código Civil só se conferido
- [ ] `resumo` responde o h1 na primeira frase; ≥ 4 FAQ; ≥ 4 `##`; ≥ 1.200 palavras; menção a Canoas ou Porto Alegre (PRB-07)
- [ ] Links para `/sistemas-web/` e `/guias/aluguel-trajes-reserva-duplicada/` (PRB-07, PRB-08)
- [ ] Nenhum cliente, número, resultado ou experiência não confirmados (PRB-09); fontes oficiais nomeadas no texto (PRB-10)
- [ ] Seções de controle atual, com ≥ 3 perdas concretas, e de pronto × sob medida (PRB-11); sem preço de site ou sistema (PRB-12)
- [ ] `publishedAt` igual à data do calendário: 2026-11-15 (PRB-05)
- [ ] Gate check passes: `npm test`

**Tests**: unit
**Gate**: quick

**Commit**: `feat(guias): add condominio-reserva-salao-festas guide`

---

### T29: Escrever o guia veterinaria-aviso-reforco-vacina

**What**: Criar o guia `veterinaria-aviso-reforco-vacina` com `servico: sistemas-web`, o `title`, o `h1`, o ângulo e o link de cluster do calendário.
**Where**: `src/content/guias/veterinaria-aviso-reforco-vacina.md`
**Depends on**: T28
**Reuses**: frontmatter e estrutura de `src/content/guias/bling-nao-sincroniza-pedidos.md`
**Requirement**: PRB-05, PRB-06, PRB-07, PRB-08, PRB-09, PRB-10, PRB-11, PRB-12, EDGE-01, EDGE-04

**Tools**:

- MCP: WebSearch / WebFetch (resultados do h1, perguntas relacionadas, fontes oficiais)
- Skill: NONE

**Done when**:

- [ ] Resultados de busca do h1 lidos; o ângulo não repete o de outro guia (PRB-08)
- [ ] Cuidados da spec aplicados: Intervalos de vacina fora do texto; sem orientação clínica
- [ ] `resumo` responde o h1 na primeira frase; ≥ 4 FAQ; ≥ 4 `##`; ≥ 1.200 palavras; menção a Canoas ou Porto Alegre (PRB-07)
- [ ] Links para `/sistemas-web/` e `/guias/software-recarga-de-extintores/` (PRB-07, PRB-08)
- [ ] Nenhum cliente, número, resultado ou experiência não confirmados (PRB-09); fontes oficiais nomeadas no texto (PRB-10)
- [ ] Seções de controle atual, com ≥ 3 perdas concretas, e de pronto × sob medida (PRB-11); sem preço de site ou sistema (PRB-12)
- [ ] `publishedAt` igual à data do calendário: 2026-11-16 (PRB-05)
- [ ] Gate check passes: `npm test`

**Tests**: unit
**Gate**: quick

**Commit**: `feat(guias): add veterinaria-aviso-reforco-vacina guide`

---

### T30: Escrever o guia pedidos-amazon-nao-entram-tiny

**What**: Criar o guia `pedidos-amazon-nao-entram-tiny` com `servico: integracoes`, o `title`, o `h1`, o ângulo e o link de cluster do calendário.
**Where**: `src/content/guias/pedidos-amazon-nao-entram-tiny.md`
**Depends on**: T29
**Reuses**: frontmatter e estrutura de `src/content/guias/bling-nao-sincroniza-pedidos.md`
**Requirement**: PRB-05, PRB-06, PRB-07, PRB-08, PRB-09, PRB-10, PRB-11, PRB-12, EDGE-01, EDGE-04

**Tools**:

- MCP: WebSearch / WebFetch (resultados do h1, perguntas relacionadas, fontes oficiais)
- Skill: NONE

**Done when**:

- [ ] Resultados de busca do h1 lidos; o ângulo não repete o de outro guia (PRB-08)
- [ ] Fonte oficial ou confirmação do usuário obtida; sem isso, aplicar EDGE-02 e não escrever o guia
- [ ] Cuidados da spec aplicados: CONDICIONAL: exige documentação oficial do Tiny/Olist ou caso confirmado pelo usuário; relato do Reclame Aqui não vira fato
- [ ] `resumo` responde o h1 na primeira frase; ≥ 4 FAQ; ≥ 4 `##`; ≥ 1.200 palavras; menção a Canoas ou Porto Alegre (PRB-07)
- [ ] Links para `/integracoes/` e `/guias/bling-nao-sincroniza-pedidos/` (PRB-07, PRB-08)
- [ ] Nenhum cliente, número, resultado ou experiência não confirmados (PRB-09); fontes oficiais nomeadas no texto (PRB-10)
- [ ] Seções de controle atual, com ≥ 3 perdas concretas, e de pronto × sob medida (PRB-11); sem preço de site ou sistema (PRB-12)
- [ ] `publishedAt` igual à data do calendário: 2026-11-16 (PRB-05)
- [ ] Gate check passes: `npm test`

**Tests**: unit
**Gate**: quick

**Commit**: `feat(guias): add pedidos-amazon-nao-entram-tiny guide`

---

### T31: Escrever o guia rastreador-posicao-atrasada

**What**: Criar o guia `rastreador-posicao-atrasada` com `servico: integracoes`, o `title`, o `h1`, o ângulo e o link de cluster do calendário.
**Where**: `src/content/guias/rastreador-posicao-atrasada.md`
**Depends on**: T30
**Reuses**: frontmatter e estrutura de `src/content/guias/bling-nao-sincroniza-pedidos.md`
**Requirement**: PRB-05, PRB-06, PRB-07, PRB-08, PRB-09, PRB-10, PRB-11, PRB-12, EDGE-01, EDGE-04

**Tools**:

- MCP: WebSearch / WebFetch (resultados do h1, perguntas relacionadas, fontes oficiais)
- Skill: NONE

**Done when**:

- [ ] Resultados de busca do h1 lidos; o ângulo não repete o de outro guia (PRB-08)
- [ ] Fonte oficial ou confirmação do usuário obtida; sem isso, aplicar EDGE-02 e não escrever o guia
- [ ] Cuidados da spec aplicados: CONDICIONAL: exige confirmação do usuário a partir da vivência em telemetria
- [ ] `resumo` responde o h1 na primeira frase; ≥ 4 FAQ; ≥ 4 `##`; ≥ 1.200 palavras; menção a Canoas ou Porto Alegre (PRB-07)
- [ ] Links para `/integracoes/` e `/guias/integracao-rastreamento-veicular/` (PRB-07, PRB-08)
- [ ] Nenhum cliente, número, resultado ou experiência não confirmados (PRB-09); fontes oficiais nomeadas no texto (PRB-10)
- [ ] Seções de controle atual, com ≥ 3 perdas concretas, e de pronto × sob medida (PRB-11); sem preço de site ou sistema (PRB-12)
- [ ] `publishedAt` igual à data do calendário: 2026-11-17 (PRB-05)
- [ ] Gate check passes: `npm test`

**Tests**: unit
**Gate**: quick

**Commit**: `feat(guias): add rastreador-posicao-atrasada guide`

---

### T32: Escrever o guia frota-rastreadores-marcas-diferentes

**What**: Criar o guia `frota-rastreadores-marcas-diferentes` com `servico: integracoes`, o `title`, o `h1`, o ângulo e o link de cluster do calendário.
**Where**: `src/content/guias/frota-rastreadores-marcas-diferentes.md`
**Depends on**: T31
**Reuses**: frontmatter e estrutura de `src/content/guias/bling-nao-sincroniza-pedidos.md`
**Requirement**: PRB-05, PRB-06, PRB-07, PRB-08, PRB-09, PRB-10, PRB-11, PRB-12, EDGE-01, EDGE-04

**Tools**:

- MCP: WebSearch / WebFetch (resultados do h1, perguntas relacionadas, fontes oficiais)
- Skill: NONE

**Done when**:

- [ ] Resultados de busca do h1 lidos; o ângulo não repete o de outro guia (PRB-08)
- [ ] Fonte oficial ou confirmação do usuário obtida; sem isso, aplicar EDGE-02 e não escrever o guia
- [ ] Cuidados da spec aplicados: CONDICIONAL: exige confirmação do usuário a partir da vivência em telemetria
- [ ] `resumo` responde o h1 na primeira frase; ≥ 4 FAQ; ≥ 4 `##`; ≥ 1.200 palavras; menção a Canoas ou Porto Alegre (PRB-07)
- [ ] Links para `/integracoes/` e `/guias/rastreador-posicao-atrasada/` (PRB-07, PRB-08)
- [ ] Nenhum cliente, número, resultado ou experiência não confirmados (PRB-09); fontes oficiais nomeadas no texto (PRB-10)
- [ ] Seções de controle atual, com ≥ 3 perdas concretas, e de pronto × sob medida (PRB-11); sem preço de site ou sistema (PRB-12)
- [ ] `publishedAt` igual à data do calendário: 2026-11-17 (PRB-05)
- [ ] Gate check passes: `npm test`

**Tests**: unit
**Gate**: quick

**Commit**: `feat(guias): add frota-rastreadores-marcas-diferentes guide`

---

### T33: Exigir os guias publicados no teste de conteúdo

**What**: Tornar obrigatórios no teste de conteúdo todos os guias do calendário que não foram removidos.
**Where**: `tests/content/guias.test.ts`
**Depends on**: T32
**Reuses**: mapa criado em T5
**Requirement**: PRB-03, EDGE-02, EDGE-03, EDGE-05

**Tools**:

- MCP: NONE
- Skill: NONE

**Done when**:

- [ ] Conjunto obrigatório = 15 guias atuais + guias do calendário não removidos
- [ ] Gate check passes: `npm run check && npm test && npm run build && npm run test:build`

**Tests**: unit
**Gate**: build

**Commit**: `test(guias): require all real-problem guides`

---

## Phase Execution Map

```
Phase 1 → Phase 2 → Phase 3 → Phase 4 → Phase 5 → Phase 6 → Phase 7 → Phase 8 → Phase 9 → Phase 10 → Phase 11 → Phase 12 → Phase 13

Phase 1:  T1 → T2 → T3 → T4 → T5 → T6 → T7 → T8  (05/11)
Phase 2:  T9 → T10  (06/11)
Phase 3:  T11 → T12  (07/11)
Phase 4:  T13 → T14  (08/11)
Phase 5:  T15 → T16  (09/11)
Phase 6:  T17 → T18  (10/11)
Phase 7:  T19 → T20  (11/11)
Phase 8:  T21 → T22  (12/11)
Phase 9:  T23 → T24  (13/11)
Phase 10:  T25 → T26  (14/11)
Phase 11:  T27 → T28  (15/11)
Phase 12:  T29 → T30  (16/11)
Phase 13:  T31 → T32 → T33  (17/11)
```

33 tarefas no total. Cada bloco de escrita cabe em um lote e roda inline. O Verificador roda ao fim da Fase 1, que vai ao ar sozinha, e depois da última tarefa.

---

## Task Granularity Check

| Task | Scope | Status |
| ---- | ----- | ------ |
| T1 | 1 função e seus testes | ✅ Granular |
| T2 | 1 função e seus testes | ✅ Granular |
| T3 | 1 arquivo de teste | ✅ Granular |
| T4 | 1 workflow e seu teste | ✅ Granular |
| T5 | 1 arquivo de teste | ✅ Granular |
| T6 | 1 guia (1 arquivo Markdown) | ✅ Granular |
| T7 | 1 guia (1 arquivo Markdown) | ✅ Granular |
| T8 | 1 guia (1 arquivo Markdown) | ✅ Granular |
| T9 | 1 guia (1 arquivo Markdown) | ✅ Granular |
| T10 | 1 guia (1 arquivo Markdown) | ✅ Granular |
| T11 | 1 guia (1 arquivo Markdown) | ✅ Granular |
| T12 | 1 guia (1 arquivo Markdown) | ✅ Granular |
| T13 | 1 guia (1 arquivo Markdown) | ✅ Granular |
| T14 | 1 guia (1 arquivo Markdown) | ✅ Granular |
| T15 | 1 guia (1 arquivo Markdown) | ✅ Granular |
| T16 | 1 guia (1 arquivo Markdown) | ✅ Granular |
| T17 | 1 guia (1 arquivo Markdown) | ✅ Granular |
| T18 | 1 guia (1 arquivo Markdown) | ✅ Granular |
| T19 | 1 guia (1 arquivo Markdown) | ✅ Granular |
| T20 | 1 guia (1 arquivo Markdown) | ✅ Granular |
| T21 | 1 guia (1 arquivo Markdown) | ✅ Granular |
| T22 | 1 guia (1 arquivo Markdown) | ✅ Granular |
| T23 | 1 guia (1 arquivo Markdown) | ✅ Granular |
| T24 | 1 guia (1 arquivo Markdown) | ✅ Granular |
| T25 | 1 guia (1 arquivo Markdown) | ✅ Granular |
| T26 | 1 guia (1 arquivo Markdown) | ✅ Granular |
| T27 | 1 guia (1 arquivo Markdown) | ✅ Granular |
| T28 | 1 guia (1 arquivo Markdown) | ✅ Granular |
| T29 | 1 guia (1 arquivo Markdown) | ✅ Granular |
| T30 | 1 guia (1 arquivo Markdown) | ✅ Granular |
| T31 | 1 guia (1 arquivo Markdown) | ✅ Granular |
| T32 | 1 guia (1 arquivo Markdown) | ✅ Granular |
| T33 | 1 constante em 1 teste | ✅ Granular |

## Diagram-Definition Cross-Check

| Task | Depends On (task body) | Diagram Shows | Status |
| ---- | ---------------------- | ------------- | ------ |
| T1 | None | início da fase 1 | ✅ Match |
| T2 | T1 | T1 → T2 | ✅ Match |
| T3 | T2 | T2 → T3 | ✅ Match |
| T4 | T3 | T3 → T4 | ✅ Match |
| T5 | T4 | T4 → T5 | ✅ Match |
| T6 | T5 | T5 → T6 | ✅ Match |
| T7 | T6 | T6 → T7 | ✅ Match |
| T8 | T7 | T7 → T8 | ✅ Match |
| T9 | T8 | início da fase, (T8) em fase anterior | ✅ Match |
| T10 | T9 | T9 → T10 | ✅ Match |
| T11 | T10 | início da fase, (T10) em fase anterior | ✅ Match |
| T12 | T11 | T11 → T12 | ✅ Match |
| T13 | T12 | início da fase, (T12) em fase anterior | ✅ Match |
| T14 | T13 | T13 → T14 | ✅ Match |
| T15 | T14 | início da fase, (T14) em fase anterior | ✅ Match |
| T16 | T15 | T15 → T16 | ✅ Match |
| T17 | T16 | início da fase, (T16) em fase anterior | ✅ Match |
| T18 | T17 | T17 → T18 | ✅ Match |
| T19 | T18 | início da fase, (T18) em fase anterior | ✅ Match |
| T20 | T19 | T19 → T20 | ✅ Match |
| T21 | T20 | início da fase, (T20) em fase anterior | ✅ Match |
| T22 | T21 | T21 → T22 | ✅ Match |
| T23 | T22 | início da fase, (T22) em fase anterior | ✅ Match |
| T24 | T23 | T23 → T24 | ✅ Match |
| T25 | T24 | início da fase, (T24) em fase anterior | ✅ Match |
| T26 | T25 | T25 → T26 | ✅ Match |
| T27 | T26 | início da fase, (T26) em fase anterior | ✅ Match |
| T28 | T27 | T27 → T28 | ✅ Match |
| T29 | T28 | início da fase, (T28) em fase anterior | ✅ Match |
| T30 | T29 | T29 → T30 | ✅ Match |
| T31 | T30 | início da fase, (T30) em fase anterior | ✅ Match |
| T32 | T31 | T31 → T32 | ✅ Match |
| T33 | T32 | T32 → T33 | ✅ Match |

## Test Co-location Validation

| Task | Code Layer Created/Modified | Matrix Requires | Task Says | Status |
| ---- | --------------------------- | --------------- | --------- | ------ |
| T1 | Lógica de guias | unit | unit | ✅ OK |
| T2 | Lógica de SEO | unit | unit | ✅ OK |
| T3 | Saída do build | integration | unit (gate build) | ✅ OK |
| T4 | Workflow | unit | unit | ✅ OK |
| T5 | Teste de conteúdo | unit | unit | ✅ OK |
| T6 | Conteúdo | unit | unit | ✅ OK |
| T7 | Conteúdo | unit | unit | ✅ OK |
| T8 | Conteúdo | unit | unit | ✅ OK |
| T9 | Conteúdo | unit | unit | ✅ OK |
| T10 | Conteúdo | unit | unit | ✅ OK |
| T11 | Conteúdo | unit | unit | ✅ OK |
| T12 | Conteúdo | unit | unit | ✅ OK |
| T13 | Conteúdo | unit | unit | ✅ OK |
| T14 | Conteúdo | unit | unit | ✅ OK |
| T15 | Conteúdo | unit | unit | ✅ OK |
| T16 | Conteúdo | unit | unit | ✅ OK |
| T17 | Conteúdo | unit | unit | ✅ OK |
| T18 | Conteúdo | unit | unit | ✅ OK |
| T19 | Conteúdo | unit | unit | ✅ OK |
| T20 | Conteúdo | unit | unit | ✅ OK |
| T21 | Conteúdo | unit | unit | ✅ OK |
| T22 | Conteúdo | unit | unit | ✅ OK |
| T23 | Conteúdo | unit | unit | ✅ OK |
| T24 | Conteúdo | unit | unit | ✅ OK |
| T25 | Conteúdo | unit | unit | ✅ OK |
| T26 | Conteúdo | unit | unit | ✅ OK |
| T27 | Conteúdo | unit | unit | ✅ OK |
| T28 | Conteúdo | unit | unit | ✅ OK |
| T29 | Conteúdo | unit | unit | ✅ OK |
| T30 | Conteúdo | unit | unit | ✅ OK |
| T31 | Conteúdo | unit | unit | ✅ OK |
| T32 | Conteúdo | unit | unit | ✅ OK |
| T33 | Teste de conteúdo | unit | unit (gate build) | ✅ OK |

## Requirement → Task

| Requirement | Tasks |
| ----------- | ----- |
| SCHED-01 | T1, T3 |
| SCHED-02, SCHED-04, SCHED-05 | T1 |
| SCHED-03 | T2, T3 |
| SCHED-06, SCHED-07, SCHED-08 | T4 |
| PRB-01, PRB-02, SCHED-09 | T5 |
| PRB-03 | T5, T33 |
| PRB-04 | T6–T8 |
| PRB-05 a PRB-12, EDGE-01, EDGE-04 | T6–T32 |
| EDGE-02, EDGE-03, EDGE-05 | Revisão de cada lote e T33 |

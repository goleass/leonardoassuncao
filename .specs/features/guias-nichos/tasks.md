# Guias por Nicho — Tasks

## Execution Protocol (MANDATORY -- do not skip)

Implement these tasks with the `tlc-spec-driven` skill: **activate it by name and follow its Execute flow and Critical Rules.** Do not search for skill files by filesystem path. The skill is the source of truth for the full flow (per-task cycle, sub-agent delegation, adequacy review, Verifier, discrimination sensor).

**If the skill cannot be activated, STOP and tell the user - do not proceed without it.**

---

**Spec**: `.specs/features/guias-nichos/spec.md`
**Design**: skipped — só conteúdo Markdown e um teste; nenhuma decisão de arquitetura (a estrutura é a de `guias-conteudo`).
**Branch**: `feat/guias-nichos`, criada a partir de `feat/guias-conteudo`
**Status**: Approved

---

## Test Coverage Matrix

> Generated from codebase, project guidelines, and spec - confirm before Execute. Guidelines found: `vitest.config.ts` (sem limite de cobertura), `tests/content/guias.test.ts`, matriz de `.specs/features/guias-conteudo/tasks.md` — strong defaults applied.

| Code Layer | Required Test Type | Coverage Expectation | Location Pattern | Run Command |
| ---------- | ------------------ | -------------------- | ---------------- | ----------- |
| Teste de conteúdo | unit | TEST-01 a TEST-04 com um caso que passa e um que falha por regra | `tests/content/*.test.ts` | `npm test` |
| Conteúdo (`src/content/guias/*.md`) | unit | GN-02 a GN-07 conferidos pelo teste de conteúdo em todo arquivo; GN-08 a GN-11 e GN-14 na revisão do Verificador | `tests/content/*.test.ts` | `npm test` |
| Saída do build (`dist/`) | integration | Testes existentes: sitemap, títulos únicos, sem script inline | `tests/build/*.test.ts` | `npm run test:build` |

## Gate Check Commands

> Generated from codebase - confirm before Execute.

| Gate Level | When to Use | Command |
| ---------- | ----------- | ------- |
| Quick | Cada guia e o teste de conteúdo | `npm test` |
| Full | — (nenhuma tarefa muda a saída do build além de páginas novas) | `npm test && npm run build && npm run test:build` |
| Build | Fim de cada fase (onda) | `npm run check && npm test && npm run build && npm run test:build` |

---

## Execution Plan

Fases em ordem; cada onda (fases 2, 3 e 4) termina com o gate Build e pode ser mesclada e publicada sozinha, com autorização do usuário.

### Phase 1: Fundação

```
T1 → T2
```

### Phase 2: Onda 1 (prioridade alta)

```
(T2) → T3 → T4 → T5 → T6
```

### Phase 3: Onda 2 (prioridade média)

```
(T4) → T7 → T8 → T9
```

### Phase 4: Onda 3 (prioridade baixa)

```
(T2) → T10 → T11 → T12 → T13 → T14
```

---

## Task Breakdown

### T1: Ligar o guia quanto-custa-um-site a outro guia ✅

**What**: Adicionar ao corpo de `quanto-custa-um-site` um link contextual para `/guias/quanto-custa-um-sistema-sob-medida/`, único guia atual sem link para outro guia (pré-requisito de TEST-04).
**Where**: `src/content/guias/quanto-custa-um-site.md`
**Depends on**: None
**Reuses**: links internos já usados nos outros guias
**Requirement**: TEST-04

**Tools**:

- MCP: NONE
- Skill: NONE

**Done when**:

- [x] Uma frase existente ou nova liga para `/guias/quanto-custa-um-sistema-sob-medida/`
- [x] Gate check passes: `npm test`

**Tests**: unit
**Gate**: quick

**Commit**: `docs(guias): link site cost guide to custom system cost guide`

---

### T2: Generalizar o teste de conteúdo para todos os guias ✅

**What**: Fazer `tests/content/guias.test.ts` rodar as regras em todo `.md` da pasta, com o mapa dos 15 slugs, o conjunto obrigatório (4 do lançamento) e a checagem de link para outro guia.
**Where**: `tests/content/guias.test.ts`
**Depends on**: T1
**Reuses**: `countWords`, `read` e os `it` existentes do mesmo arquivo
**Requirement**: TEST-01, TEST-02, TEST-03, TEST-04, GN-02, GN-03, GN-04, GN-05, GN-06, GN-07

**Tools**:

- MCP: NONE
- Skill: NONE

**Done when**:

- [x] `describe.each` percorre os arquivos da pasta, não a lista do lançamento (TEST-01)
- [x] Mapa com os 15 slugs → `servico`; guia presente com `servico` diferente falha; slug obrigatório ausente falha (TEST-02)
- [x] Arquivo fora do mapa falha com o slug na mensagem (TEST-03)
- [x] Todo guia liga para outro `/guias/<slug>/` existente (TEST-04)
- [x] Guias desta feature: ≥ 4 FAQ e ≥ 4 `##` (GN-04, GN-05); os 4 do lançamento mantêm ≥ 3 (CONT-03, CONT-04)
- [x] Guias desta feature: `title` igual ao de GN-02
- [x] Prova de discriminação registrada no commit: fixture temporária fora do mapa e com 100 palavras faz o teste falhar; removida, passa
- [x] Gate check passes: `npm test`; nenhum teste existente removido

**Tests**: unit
**Gate**: quick

**Commit**: `test(guias): check content rules on every guide file`

---

### T3: Escrever o guia Bling não sincroniza pedidos ✅

**What**: Criar o guia `bling-nao-sincroniza-pedidos` com `servico: integracoes`, o `title` de GN-02, o `h1` da tabela de prioridade, o ângulo e o link de cluster de GN-11.
**Where**: `src/content/guias/bling-nao-sincroniza-pedidos.md`
**Depends on**: T2
**Reuses**: frontmatter e estrutura de `src/content/guias/integracao-bling-api.md`
**Requirement**: GN-01, GN-02, GN-03, GN-04, GN-05, GN-06, GN-07, GN-08, GN-09, GN-10, GN-11, GN-14, GN-15, GN-16, EDGE-02

**Tools**:

- MCP: WebSearch / WebFetch (SERP do h1, People Also Ask, fontes oficiais)
- Skill: `local-keyword-research` (variações e perguntas da SERP), `ai-local-search` (resposta direta e trechos citáveis)

**Done when**:

- [x] Top 5 da SERP do h1 lido; o ângulo do guia não repete o de nenhum resultado nem o de outro guia (GN-11)
- [x] Conferir na documentação oficial do Bling (API v3, webhooks, limites de requisição) todo comportamento citado; diagnóstico passo a passo (status de pedido, mapeamento de SKU, estoque multiloja) antes de propor integração personalizada.
- [x] `resumo` responde o h1 na primeira frase (GN-08); ≥ 4 FAQ; ≥ 4 `##`; ≥ 1.200 palavras; menção a Canoas ou Porto Alegre
- [x] Links para `/integracoes/` e para o guia de cluster de GN-11
- [x] Nenhum cliente, número, resultado ou experiência no nicho não confirmados (GN-09); fontes nomeadas no texto (GN-10)
- [x] Seção `##` sobre como o ramo controla hoje (planilha, papel, WhatsApp) com ≥ 3 perdas concretas do nicho (GN-15)
- [x] Seção `##` sobre sistema que não atende 100%: quando o pronto basta e quando vale sob medida ou integração (GN-16)
- [x] Gate check passes: `npm test`

**Tests**: unit
**Gate**: quick

**Commit**: `feat(guias): add bling-nao-sincroniza-pedidos guide`

---

### T4: Escrever o guia portal de pedidos para distribuidora ✅

**What**: Criar o guia `portal-de-pedidos-para-distribuidora` com `servico: sistemas-web`, o `title` de GN-02, o `h1` da tabela de prioridade, o ângulo e o link de cluster de GN-11.
**Where**: `src/content/guias/portal-de-pedidos-para-distribuidora.md`
**Depends on**: T3
**Reuses**: frontmatter e estrutura de `src/content/guias/integracao-bling-api.md`
**Requirement**: GN-01, GN-02, GN-03, GN-04, GN-05, GN-06, GN-07, GN-08, GN-09, GN-10, GN-11, GN-14, GN-15, GN-16, EDGE-02

**Tools**:

- MCP: WebSearch / WebFetch (SERP do h1, People Also Ask, fontes oficiais)
- Skill: `local-keyword-research` (variações e perguntas da SERP), `ai-local-search` (resposta direta e trechos citáveis)

**Done when**:

- [x] Top 5 da SERP do h1 lido; o ângulo do guia não repete o de nenhum resultado nem o de outro guia (GN-11)
- [x] Comparar com SaaS de força de vendas sem citar preço; mostrar o fluxo WhatsApp → portal → ERP (Bling/Tiny/Omie) e NF-e.
- [x] `resumo` responde o h1 na primeira frase (GN-08); ≥ 4 FAQ; ≥ 4 `##`; ≥ 1.200 palavras; menção a Canoas ou Porto Alegre
- [x] Links para `/sistemas-web/` e para o guia de cluster de GN-11
- [x] Nenhum cliente, número, resultado ou experiência no nicho não confirmados (GN-09); fontes nomeadas no texto (GN-10)
- [x] Seção `##` sobre como o ramo controla hoje (planilha, papel, WhatsApp) com ≥ 3 perdas concretas do nicho (GN-15)
- [x] Seção `##` sobre sistema que não atende 100%: quando o pronto basta e quando vale sob medida ou integração (GN-16)
- [x] Gate check passes: `npm test`

**Tests**: unit
**Gate**: quick

**Commit**: `feat(guias): add portal-de-pedidos-para-distribuidora guide`

---

### T5: Escrever o guia OS para ar-condicionado ✅

**What**: Criar o guia `sistema-ordem-de-servico-ar-condicionado` com `servico: sistemas-web`, o `title` de GN-02, o `h1` da tabela de prioridade, o ângulo e o link de cluster de GN-11.
**Where**: `src/content/guias/sistema-ordem-de-servico-ar-condicionado.md`
**Depends on**: T4
**Reuses**: frontmatter e estrutura de `src/content/guias/integracao-bling-api.md`
**Requirement**: GN-01, GN-02, GN-03, GN-04, GN-05, GN-06, GN-07, GN-08, GN-09, GN-10, GN-11, GN-14, GN-15, GN-16, EDGE-02

**Tools**:

- MCP: WebSearch / WebFetch (SERP do h1, People Also Ask, fontes oficiais)
- Skill: `local-keyword-research` (variações e perguntas da SERP), `ai-local-search` (resposta direta e trechos citáveis)

**Done when**:

- [x] Top 5 da SERP do h1 lido; o ângulo do guia não repete o de nenhum resultado nem o de outro guia (GN-11)
- [x] Conferir a Lei 13.589/2018 (PMOC) e a Portaria GM/MS 3.523/1998 na fonte oficial; diferenciar OS corretiva, preventiva e contrato recorrente.
- [x] `resumo` responde o h1 na primeira frase (GN-08); ≥ 4 FAQ; ≥ 4 `##`; ≥ 1.200 palavras; menção a Canoas ou Porto Alegre
- [x] Links para `/sistemas-web/` e para o guia de cluster de GN-11
- [x] Nenhum cliente, número, resultado ou experiência no nicho não confirmados (GN-09); fontes nomeadas no texto (GN-10)
- [x] Seção `##` sobre como o ramo controla hoje (planilha, papel, WhatsApp) com ≥ 3 perdas concretas do nicho (GN-15)
- [x] Seção `##` sobre sistema que não atende 100%: quando o pronto basta e quando vale sob medida ou integração (GN-16)
- [x] Gate check passes: `npm test`

**Tests**: unit
**Gate**: quick

**Commit**: `feat(guias): add sistema-ordem-de-servico-ar-condicionado guide`

---

### T6: Escrever o guia software para recarga de extintores ✅

**What**: Criar o guia `software-recarga-de-extintores` com `servico: software-sob-medida`, o `title` de GN-02, o `h1` da tabela de prioridade, o ângulo e o link de cluster de GN-11.
**Where**: `src/content/guias/software-recarga-de-extintores.md`
**Depends on**: T5
**Reuses**: frontmatter e estrutura de `src/content/guias/integracao-bling-api.md`
**Requirement**: GN-01, GN-02, GN-03, GN-04, GN-05, GN-06, GN-07, GN-08, GN-09, GN-10, GN-11, GN-14, GN-15, GN-16, EDGE-02

**Tools**:

- MCP: WebSearch / WebFetch (SERP do h1, People Also Ask, fontes oficiais)
- Skill: `local-keyword-research` (variações e perguntas da SERP), `ai-local-search` (resposta direta e trechos citáveis)

**Done when**:

- [x] Top 5 da SERP do h1 lido; o ângulo do guia não repete o de nenhum resultado nem o de outro guia (GN-11)
- [x] Conferir ABNT NBR 12962 (inspeção e manutenção) e as regras do Inmetro para empresas de manutenção de extintores; prazos citados só se confirmados (EDGE-02).
- [x] `resumo` responde o h1 na primeira frase (GN-08); ≥ 4 FAQ; ≥ 4 `##`; ≥ 1.200 palavras; menção a Canoas ou Porto Alegre
- [x] Links para `/software-sob-medida/` e para o guia de cluster de GN-11
- [x] Nenhum cliente, número, resultado ou experiência no nicho não confirmados (GN-09); fontes nomeadas no texto (GN-10)
- [x] Seção `##` sobre como o ramo controla hoje (planilha, papel, WhatsApp) com ≥ 3 perdas concretas do nicho (GN-15)
- [x] Seção `##` sobre sistema que não atende 100%: quando o pronto basta e quando vale sob medida ou integração (GN-16)
- [x] Gate check passes: `npm test`

**Tests**: unit
**Gate**: quick

**Commit**: `feat(guias): add software-recarga-de-extintores guide`

---

### T7: Escrever o guia portal de pedidos para salgados congelados ✅

**What**: Criar o guia `portal-de-pedidos-salgados-congelados` com `servico: sistemas-web`, o `title` de GN-02, o `h1` da tabela de prioridade, o ângulo e o link de cluster de GN-11.
**Where**: `src/content/guias/portal-de-pedidos-salgados-congelados.md`
**Depends on**: T4
**Reuses**: frontmatter e estrutura de `src/content/guias/integracao-bling-api.md`
**Requirement**: GN-12, GN-02, GN-03, GN-04, GN-05, GN-06, GN-07, GN-08, GN-09, GN-10, GN-11, GN-14, GN-15, GN-16, EDGE-02

**Tools**:

- MCP: WebSearch / WebFetch (SERP do h1, People Also Ask, fontes oficiais)
- Skill: `local-keyword-research` (variações e perguntas da SERP), `ai-local-search` (resposta direta e trechos citáveis)

**Done when**:

- [x] Top 5 da SERP do h1 lido; o ângulo do guia não repete o de nenhum resultado nem o de outro guia (GN-11)
- [x] Ângulo de produção por lote e rota de entrega; não repetir o conteúdo do guia de distribuidora, linkar para ele.
- [x] `resumo` responde o h1 na primeira frase (GN-08); ≥ 4 FAQ; ≥ 4 `##`; ≥ 1.200 palavras; menção a Canoas ou Porto Alegre
- [x] Links para `/sistemas-web/` e para o guia de cluster de GN-11
- [x] Nenhum cliente, número, resultado ou experiência no nicho não confirmados (GN-09); fontes nomeadas no texto (GN-10)
- [x] Seção `##` sobre como o ramo controla hoje (planilha, papel, WhatsApp) com ≥ 3 perdas concretas do nicho (GN-15)
- [x] Seção `##` sobre sistema que não atende 100%: quando o pronto basta e quando vale sob medida ou integração (GN-16)
- [x] Gate check passes: `npm test`

**Tests**: unit
**Gate**: quick

**Commit**: `feat(guias): add portal-de-pedidos-salgados-congelados guide`

---

### T8: Escrever o guia quanto custa site para vidraçaria ✅

**What**: Criar o guia `quanto-custa-site-para-vidracaria` com `servico: criacao-de-sites`, o `title` de GN-02, o `h1` da tabela de prioridade, o ângulo e o link de cluster de GN-11.
**Where**: `src/content/guias/quanto-custa-site-para-vidracaria.md`
**Depends on**: T7
**Reuses**: frontmatter e estrutura de `src/content/guias/integracao-bling-api.md`
**Requirement**: GN-12, GN-02, GN-03, GN-04, GN-05, GN-06, GN-07, GN-08, GN-09, GN-10, GN-11, GN-14, GN-15, GN-16, EDGE-02

**Tools**:

- MCP: WebSearch / WebFetch (SERP do h1, People Also Ask, fontes oficiais)
- Skill: `local-keyword-research` (variações e perguntas da SERP), `ai-local-search` (resposta direta e trechos citáveis)

**Done when**:

- [x] Top 5 da SERP do h1 lido; o ângulo do guia não repete o de nenhum resultado nem o de outro guia (GN-11)
- [x] Único guia com preços: faixas de mercado 2026 conferidas em levantamentos públicos na data, apresentadas como referência; formulário de orçamento por medida sem calculadora (fora do escopo).
- [x] `resumo` responde o h1 na primeira frase (GN-08); ≥ 4 FAQ; ≥ 4 `##`; ≥ 1.200 palavras; menção a Canoas ou Porto Alegre
- [x] Links para `/criacao-de-sites/` e para o guia de cluster de GN-11
- [x] Nenhum cliente, número, resultado ou experiência no nicho não confirmados (GN-09); fontes nomeadas no texto (GN-10)
- [x] Seção `##` sobre como o ramo controla hoje (planilha, papel, WhatsApp) com ≥ 3 perdas concretas do nicho (GN-15)
- [x] Seção `##` sobre sistema que não atende 100%: quando o pronto basta e quando vale sob medida ou integração (GN-16)
- [x] Gate check passes: `npm test`

**Tests**: unit
**Gate**: quick

**Commit**: `feat(guias): add quanto-custa-site-para-vidracaria guide`

---

### T9: Escrever o guia sistema para aluguel de caçambas ✅

**What**: Criar o guia `sistema-aluguel-de-cacambas` com `servico: software-sob-medida`, o `title` de GN-02, o `h1` da tabela de prioridade, o ângulo e o link de cluster de GN-11.
**Where**: `src/content/guias/sistema-aluguel-de-cacambas.md`
**Depends on**: T8
**Reuses**: frontmatter e estrutura de `src/content/guias/integracao-bling-api.md`
**Requirement**: GN-12, GN-02, GN-03, GN-04, GN-05, GN-06, GN-07, GN-08, GN-09, GN-10, GN-11, GN-14, GN-15, GN-16, EDGE-02

**Tools**:

- MCP: WebSearch / WebFetch (SERP do h1, People Also Ask, fontes oficiais)
- Skill: `local-keyword-research` (variações e perguntas da SERP), `ai-local-search` (resposta direta e trechos citáveis)

**Done when**:

- [x] Top 5 da SERP do h1 lido; o ângulo do guia não repete o de nenhum resultado nem o de outro guia (GN-11)
- [x] Explicar CTR/MTR só se conferido na fonte oficial (ex.: SINIR/MTR do Ministério do Meio Ambiente, regras municipais de Canoas e Porto Alegre); ligar ao guia de rastreamento veicular.
- [x] `resumo` responde o h1 na primeira frase (GN-08); ≥ 4 FAQ; ≥ 4 `##`; ≥ 1.200 palavras; menção a Canoas ou Porto Alegre
- [x] Links para `/software-sob-medida/` e para o guia de cluster de GN-11
- [x] Nenhum cliente, número, resultado ou experiência no nicho não confirmados (GN-09); fontes nomeadas no texto (GN-10)
- [x] Seção `##` sobre como o ramo controla hoje (planilha, papel, WhatsApp) com ≥ 3 perdas concretas do nicho (GN-15)
- [x] Seção `##` sobre sistema que não atende 100%: quando o pronto basta e quando vale sob medida ou integração (GN-16)
- [x] Gate check passes: `npm test`

**Tests**: unit
**Gate**: quick

**Commit**: `feat(guias): add sistema-aluguel-de-cacambas guide`

---

### T10: Escrever o guia sistema para fábrica de uniformes

**What**: Criar o guia `sistema-fabrica-de-uniformes` com `servico: software-sob-medida`, o `title` de GN-02, o `h1` da tabela de prioridade, o ângulo e o link de cluster de GN-11.
**Where**: `src/content/guias/sistema-fabrica-de-uniformes.md`
**Depends on**: T2
**Reuses**: frontmatter e estrutura de `src/content/guias/integracao-bling-api.md`
**Requirement**: GN-13, GN-02, GN-03, GN-04, GN-05, GN-06, GN-07, GN-08, GN-09, GN-10, GN-11, GN-14, GN-15, GN-16, EDGE-02

**Tools**:

- MCP: WebSearch / WebFetch (SERP do h1, People Also Ask, fontes oficiais)
- Skill: `local-keyword-research` (variações e perguntas da SERP), `ai-local-search` (resposta direta e trechos citáveis)

**Done when**:

- [ ] Top 5 da SERP do h1 lido; o ângulo do guia não repete o de nenhum resultado nem o de outro guia (GN-11)
- [ ] Grade de tamanhos, arte/personalização aprovada pelo cliente e etapas (corte, costura, estampa/bordado, expedição).
- [ ] `resumo` responde o h1 na primeira frase (GN-08); ≥ 4 FAQ; ≥ 4 `##`; ≥ 1.200 palavras; menção a Canoas ou Porto Alegre
- [ ] Links para `/software-sob-medida/` e para o guia de cluster de GN-11
- [ ] Nenhum cliente, número, resultado ou experiência no nicho não confirmados (GN-09); fontes nomeadas no texto (GN-10)
- [ ] Seção `##` sobre como o ramo controla hoje (planilha, papel, WhatsApp) com ≥ 3 perdas concretas do nicho (GN-15)
- [ ] Seção `##` sobre sistema que não atende 100%: quando o pronto basta e quando vale sob medida ou integração (GN-16)
- [ ] Gate check passes: `npm test`

**Tests**: unit
**Gate**: quick

**Commit**: `feat(guias): add sistema-fabrica-de-uniformes guide`

---

### T11: Escrever o guia portal do cliente para contabilidade

**What**: Criar o guia `portal-do-cliente-contabilidade` com `servico: sistemas-web`, o `title` de GN-02, o `h1` da tabela de prioridade, o ângulo e o link de cluster de GN-11.
**Where**: `src/content/guias/portal-do-cliente-contabilidade.md`
**Depends on**: T10
**Reuses**: frontmatter e estrutura de `src/content/guias/integracao-bling-api.md`
**Requirement**: GN-13, GN-02, GN-03, GN-04, GN-05, GN-06, GN-07, GN-08, GN-09, GN-10, GN-11, GN-14, GN-15, GN-16, EDGE-02

**Tools**:

- MCP: WebSearch / WebFetch (SERP do h1, People Also Ask, fontes oficiais)
- Skill: `local-keyword-research` (variações e perguntas da SERP), `ai-local-search` (resposta direta e trechos citáveis)

**Done when**:

- [ ] Top 5 da SERP do h1 lido; o ângulo do guia não repete o de nenhum resultado nem o de outro guia (GN-11)
- [ ] Tratar com honestidade quando um portal pronto basta; LGPD citada só com artigo conferido no texto oficial da Lei 13.709/2018.
- [ ] `resumo` responde o h1 na primeira frase (GN-08); ≥ 4 FAQ; ≥ 4 `##`; ≥ 1.200 palavras; menção a Canoas ou Porto Alegre
- [ ] Links para `/sistemas-web/` e para o guia de cluster de GN-11
- [ ] Nenhum cliente, número, resultado ou experiência no nicho não confirmados (GN-09); fontes nomeadas no texto (GN-10)
- [ ] Seção `##` sobre como o ramo controla hoje (planilha, papel, WhatsApp) com ≥ 3 perdas concretas do nicho (GN-15)
- [ ] Seção `##` sobre sistema que não atende 100%: quando o pronto basta e quando vale sob medida ou integração (GN-16)
- [ ] Gate check passes: `npm test`

**Tests**: unit
**Gate**: quick

**Commit**: `feat(guias): add portal-do-cliente-contabilidade guide`

---

### T12: Escrever o guia sistema para portões automáticos

**What**: Criar o guia `sistema-portoes-automaticos` com `servico: software-sob-medida`, o `title` de GN-02, o `h1` da tabela de prioridade, o ângulo e o link de cluster de GN-11.
**Where**: `src/content/guias/sistema-portoes-automaticos.md`
**Depends on**: T11
**Reuses**: frontmatter e estrutura de `src/content/guias/integracao-bling-api.md`
**Requirement**: GN-13, GN-02, GN-03, GN-04, GN-05, GN-06, GN-07, GN-08, GN-09, GN-10, GN-11, GN-14, GN-15, GN-16, EDGE-02

**Tools**:

- MCP: WebSearch / WebFetch (SERP do h1, People Also Ask, fontes oficiais)
- Skill: `local-keyword-research` (variações e perguntas da SERP), `ai-local-search` (resposta direta e trechos citáveis)

**Done when**:

- [ ] Top 5 da SERP do h1 lido; o ângulo do guia não repete o de nenhum resultado nem o de outro guia (GN-11)
- [ ] Ângulo de visita técnica → orçamento → instalação → contrato de manutenção; não repetir o guia de ar-condicionado, linkar para ele.
- [ ] `resumo` responde o h1 na primeira frase (GN-08); ≥ 4 FAQ; ≥ 4 `##`; ≥ 1.200 palavras; menção a Canoas ou Porto Alegre
- [ ] Links para `/software-sob-medida/` e para o guia de cluster de GN-11
- [ ] Nenhum cliente, número, resultado ou experiência no nicho não confirmados (GN-09); fontes nomeadas no texto (GN-10)
- [ ] Seção `##` sobre como o ramo controla hoje (planilha, papel, WhatsApp) com ≥ 3 perdas concretas do nicho (GN-15)
- [ ] Seção `##` sobre sistema que não atende 100%: quando o pronto basta e quando vale sob medida ou integração (GN-16)
- [ ] Gate check passes: `npm test`

**Tests**: unit
**Gate**: quick

**Commit**: `feat(guias): add sistema-portoes-automaticos guide`

---

### T13: Escrever o guia site para aluguel de infláveis

**What**: Criar o guia `site-aluguel-de-inflaveis` com `servico: criacao-de-sites`, o `title` de GN-02, o `h1` da tabela de prioridade, o ângulo e o link de cluster de GN-11.
**Where**: `src/content/guias/site-aluguel-de-inflaveis.md`
**Depends on**: T12
**Reuses**: frontmatter e estrutura de `src/content/guias/integracao-bling-api.md`
**Requirement**: GN-13, GN-02, GN-03, GN-04, GN-05, GN-06, GN-07, GN-08, GN-09, GN-10, GN-11, GN-14, GN-15, GN-16, EDGE-02

**Tools**:

- MCP: WebSearch / WebFetch (SERP do h1, People Also Ask, fontes oficiais)
- Skill: `local-keyword-research` (variações e perguntas da SERP), `ai-local-search` (resposta direta e trechos citáveis)

**Done when**:

- [ ] Top 5 da SERP do h1 lido; o ângulo do guia não repete o de nenhum resultado nem o de outro guia (GN-11)
- [ ] Calendário de disponibilidade por brinquedo e pedido por data; sem preço de site (linkar `quanto-custa-um-site`).
- [ ] `resumo` responde o h1 na primeira frase (GN-08); ≥ 4 FAQ; ≥ 4 `##`; ≥ 1.200 palavras; menção a Canoas ou Porto Alegre
- [ ] Links para `/criacao-de-sites/` e para o guia de cluster de GN-11
- [ ] Nenhum cliente, número, resultado ou experiência no nicho não confirmados (GN-09); fontes nomeadas no texto (GN-10)
- [ ] Seção `##` sobre como o ramo controla hoje (planilha, papel, WhatsApp) com ≥ 3 perdas concretas do nicho (GN-15)
- [ ] Seção `##` sobre sistema que não atende 100%: quando o pronto basta e quando vale sob medida ou integração (GN-16)
- [ ] Gate check passes: `npm test`

**Tests**: unit
**Gate**: quick

**Commit**: `feat(guias): add site-aluguel-de-inflaveis guide`

---

### T14: Exigir os 15 guias no teste de conteúdo

**What**: Trocar o conjunto obrigatório do teste de conteúdo dos 4 guias do lançamento pelos 15 do mapa (TEST-02, fim da feature).
**Where**: `tests/content/guias.test.ts`
**Depends on**: T13
**Reuses**: mapa criado em T2
**Requirement**: TEST-02, GN-01, GN-12, GN-13

**Tools**:

- MCP: NONE
- Skill: NONE

**Done when**:

- [ ] Conjunto obrigatório = 15 slugs
- [ ] Gate check passes: `npm run check && npm test && npm run build && npm run test:build`

**Tests**: unit
**Gate**: build

**Commit**: `test(guias): require all 15 planned guides`

---

## Phase Execution Map

```
Phase 1 → Phase 2 → Phase 3 → Phase 4

Phase 1:  T1 → T2
Phase 2:  T3 → T4 → T5 → T6            (onda 1 — gate Build ao fim)
Phase 3:  T7 → T8 → T9                 (onda 2 — gate Build ao fim)
Phase 4:  T10 → T11 → T12 → T13 → T14  (onda 3 — gate Build em T14)
```

Dependências entre fases (sempre para trás): T7 ← T4 (cluster B2B), T10 ← T2.

14 tarefas → 2 lotes de ~7 (fases 1+2 = 6; fases 3+4 = 8): o Execute oferece sub-agentes antes de começar.

---

## Task Granularity Check

| Task | Scope | Status |
| ---- | ----- | ------ |
| T1 | 1 link em 1 guia | ✅ Granular |
| T2 | 1 arquivo de teste | ✅ Granular |
| T3–T13 | 1 guia (1 arquivo Markdown) cada | ✅ Granular |
| T14 | 1 constante em 1 teste | ✅ Granular |

## Diagram-Definition Cross-Check

| Task | Depends On (task body) | Diagram Shows | Status |
| ---- | ---------------------- | ------------- | ------ |
| T1 | None | início da fase 1 | ✅ Match |
| T2 | T1 | T1 → T2 | ✅ Match |
| T3 | T2 | início da fase 2 (T2 em fase anterior) | ✅ Match |
| T4 | T3 | T3 → T4 | ✅ Match |
| T5 | T4 | T4 → T5 | ✅ Match |
| T6 | T5 | T5 → T6 | ✅ Match |
| T7 | T4 | início da fase 3 (T4 em fase anterior) | ✅ Match |
| T8 | T7 | T7 → T8 | ✅ Match |
| T9 | T8 | T8 → T9 | ✅ Match |
| T10 | T2 | início da fase 4 (T2 em fase anterior) | ✅ Match |
| T11 | T10 | T10 → T11 | ✅ Match |
| T12 | T11 | T11 → T12 | ✅ Match |
| T13 | T12 | T12 → T13 | ✅ Match |
| T14 | T13 | T13 → T14 | ✅ Match |

## Test Co-location Validation

| Task | Code Layer Created/Modified | Matrix Requires | Task Says | Status |
| ---- | --------------------------- | --------------- | --------- | ------ |
| T1 | Conteúdo | unit | unit | ✅ OK |
| T2 | Teste de conteúdo | unit | unit | ✅ OK |
| T3–T13 | Conteúdo | unit | unit | ✅ OK |
| T14 | Teste de conteúdo | unit | unit (gate build) | ✅ OK |

## Requirement → Task

| Requirement | Tasks |
| ----------- | ----- |
| TEST-01, TEST-03 | T2 |
| TEST-02 | T2, T14 |
| TEST-04 | T1, T2 |
| GN-01 | T3–T6 |
| GN-12 | T7–T9 |
| GN-13 | T10–T13 |
| GN-02 a GN-11, GN-14, GN-15, GN-16, EDGE-02 | T3–T13 (GN-02 a GN-07 também em T2) |
| EDGE-01 | N/A na ordem atual: todo alvo de cluster sai antes do guia que liga para ele |
| EDGE-03 | COL-04 existente (build) |

# Guias de Problemas Reais Validation (Fase 1, iteração 3 de 3)

**Verdict**: PASS (com resíduo aceito pelo usuário)
**Decisão do usuário (2026-11-06)**: depois do limite de 3 iterações, o usuário aprovou publicar e aceitou o resíduo F24/F25 (formas de link relativo que nenhum guia usa). O último veredito do Verificador, na iteração 3, foi reprovado por esse resíduo; o histórico abaixo fica como registro. Os pontos de fonte não confirmados seguem listados neste relatório.
**Date**: 2026-11-05 (relógio de Brasília; 2026-11-06 em UTC)
**Spec**: `.specs/features/guias-problemas-reais/spec.md`
**Diff range**: `316b274..3891d18` (`316b274..HEAD`)
**Verifier**: independent sub-agent (author ≠ verifier)
**Cobertura**: só a Fase 1: T1–T8 e T34 a T38; SCHED-01 a SCHED-11, PRB-01 a PRB-04, PRB-07 a PRB-12. PRB-03 é parcial, porque T33 ainda não existe e os outros 24 guias também não (esperado). T9+, PRB-05 e PRB-06 ficam fora.

Os 2 gaps da iteração 2 estão fechados. O FAIL vem de um único resíduo de teste: duas outras formas de link relativo escapam (F24 e F25). Nenhum guia as usa, e o site publicado não tem defeito conhecido. Como esta é a terceira iteração, a decisão vai ao usuário: corrigir ou aceitar o resíduo (ver "Decisão para o usuário").

## Histórico

| Iteração | Faixa | Veredito | Sensor | Resumo |
| -------- | ----- | -------- | ------ | ------ |
| 1 | `316b274..688c88b` | FAIL | 17/24 | Comportamento certo; 12 gaps: testes sem discriminação (SCHED-08, SCHED-09, PRB-02), texto além da fonte (PRB-09, PRB-10) e spec imprecisa (SCHED-04) |
| 2 | `316b274..5ebdc90` | FAIL | 30/31 | 12 gaps fechados; 2 novos: frases sem fonte na locação (R1) e link relativo (R2, F22) |
| 3 | `316b274..3891d18` | FAIL | 3/5 nesta rodada | R1 e R2 fechados; resíduo novo: F24 e F25 |

---

## Gaps da iteração 2

| Gap | Estado | Evidência |
| --- | ------ | --------- |
| R1, PRB-09 | ✅ Fechado | `src/content/guias/locacao-equipamentos-devolucao-parcial.md:24` "o que pode dar errado"; `:62` "Uma locadora pode começar"; `:92` "Boa parte da discussão pode ser evitada"; `:130` "tendem a aparecer". Também `src/content/guias/pix-sem-txid-erp-nao-da-baixa.md:28`, frase neutra e sem regressão |
| R2, link relativo com `./` ou `../` | ✅ Fechado para links inline e `href` | `tests/content/guide-rules.ts:11-12`; `tests/content/guide-rules.test.ts:22-23`; `tests/content/guias.test.ts:360`, mensagem com o guia; `spec.md:174` (SCHED-11); F22, F22b e M20 mortos |

Os gaps 1 a 12 da iteração 1 seguem fechados. Os testes e textos que os fecharam não mudaram, salvo as trocas acima.

---

## Gap restante

**G1, SCHED-09 e SCHED-11, teste.** `tests/content/guide-rules.ts:11-12` só reconhece links relativos inline ou em `href`, e só com `./` ou `../`:

- **F25**: definição de referência `[r]: ../slug/` passa em `npm test`. Está dentro do texto de SCHED-11 (`spec.md:174`).
- **F24**: `[x](slug/)`, relativo sem ponto, passa em `npm test`. Está fora do texto de SCHED-11, mas é link para guia posterior e cai em SCHED-09 (`spec.md:172`).

Efeito se alguém usar uma dessas formas: link para página que não existe ainda no guia publicado. Hoje nenhum dos 18 guias tem definição de referência, e a varredura da iteração 2 não achou link relativo.

Correção sugerida, em `relativeLinks`: tratar como relativo todo destino, inline, em `href` ou em definição de referência, que não comece com `/`, `#`, `http:`, `https:`, `mailto:` ou `tel:`. Acrescentar os dois casos em `tests/content/guide-rules.test.ts`.

F24 e F25 foram sondas minhas, além das pedidas nesta rodada; não são regressão destes commits. O build não foi rodado com elas: o teste de `tests/build/guias.test.ts:78` procura `/guias/<slug>`, que não aparece em um `href` relativo, então a expectativa é que também escapem (como B22 na iteração 2).

**Decisão para o usuário**: o limite de 3 iterações foi atingido.

1. Aplicar a correção acima, de uma função e dois casos, e verificar só isso.
2. Aceitar o resíduo: nenhum guia é afetado, e o caso fica registrado aqui.

Observação de baixo peso, sem efeito no veredito: o título do teste em `tests/content/guias.test.ts:359` e o `describe` em `tests/content/guide-rules.test.ts:21` citam SCHED-09 e SCHED-10, não SCHED-11.

---

## Task Completion

| Task | Status | Notes |
| ---- | ------ | ----- |
| T1 a T8, T34, T35, T36 | ✅ Done | `tests/build/guias.test.ts:69,78` não afirmam nada enquanto não houver guia agendado; com fixture funcionam (iteração 2: B00 a B04) |
| T37 | ⚠️ Partial | `0501728`; G1 |
| T38 | ✅ Done | `3891d18` |

---

## Spec-Anchored Acceptance Criteria

| Req | Resultado definido na spec | `file:line` + asserção | Result |
| --- | -------------------------- | ---------------------- | ------ |
| SCHED-01 | Data futura em `America/Sao_Paulo` fora de páginas, `/guias/`, relacionados, serviços e `llms.txt` | `src/lib/guias/guias.test.ts:141` `toEqual(["atual"])` às 02:59:59Z; `tests/build/guias.test.ts:71-74`, `:78` | ✅ PASS |
| SCHED-02 | Inclui quando o dia chega em Brasília | `src/lib/guias/guias.test.ts:146` às 03:00:00Z | ✅ PASS |
| SCHED-03 | Data futura não vira `<lastmod>` de `/guias/` | `src/lib/seo/lastmod.test.ts:128,133`; `tests/build/guias.test.ts:50` | ✅ PASS |
| SCHED-04 | Com `draft: false`, marcador em guia futuro reprova nomeando o arquivo | `src/lib/guias/guias.test.ts:152` `toThrow("guias/agendado.md")` | ✅ PASS |
| SCHED-05 | `astro dev` mostra guia futuro | `src/lib/guias/guias.test.ts:157`; `src/lib/guias/collection.ts:7` | ✅ PASS |
| SCHED-06 | Todo dia às 12:07 UTC e manual | `tests/content/publish-workflow.test.ts`: `toEqual([{ cron: "7 12 * * *" }])` e `workflow_dispatch` | ✅ PASS |
| SCHED-07 | POST para a URL do secret; URL fora do repositório | `tests/content/publish-workflow.test.ts`: `toBe("${{ secrets.NETLIFY_BUILD_HOOK }}")` e `-X POST` | ✅ PASS |
| SCHED-08 | Secret ausente ou requisição com falha reprova o job | `tests/content/publish-workflow.test.ts:67` `toBe(22)`; `.github/workflows/publicar-guias.yml:24,26` | ✅ PASS |
| SCHED-09 | Link para guia posterior reprova nomeando os dois | `tests/content/guias.test.ts` `expect(later, ...)`; `tests/content/guide-rules.test.ts` | ❌ GAP G1 (F24, F25) |
| SCHED-10 | Link para `/guias/<slug>` sem arquivo reprova nomeando os dois | `tests/content/guias.test.ts` `expect(missing, ...)`; F20 morto na iteração 2 | ✅ PASS |
| SCHED-11 | Link relativo com `./` ou `../` reprova nomeando o guia | `tests/content/guias.test.ts:360`; `tests/content/guide-rules.test.ts:22-23` | ❌ GAP G1 (F25) |
| PRB-01 | 27 slugs com `servico`, `title`, `h1` e cluster | Mapa `PROBLEM` em `tests/content/guias.test.ts`; 27 linhas sem divergência (iteração 1) | ✅ PASS |
| PRB-02 | Mais de 3 na mesma data reprova nomeando a data | `tests/content/guias.test.ts:304`; `datesOverLimit` em `tests/content/guide-rules.test.ts` | ✅ PASS |
| PRB-03 | Guia sem arquivo não reprova até T33 (parcial) | `REQUIRED` em `tests/content/guias.test.ts`; `:298` | ✅ PASS parcial |
| PRB-04 | Os 3 guias no site | `it.each(PUBLISHED)` em `tests/build/guias.test.ts`; 134 passaram | ✅ PASS |
| PRB-07 | ≥1.200 palavras, 4 FAQ, 4 `##`, cidade, links, `resumo` | Asserções por guia em `tests/content/guias.test.ts`; `resumo` em cada guia, `:5` | ✅ PASS |
| PRB-08 | Segue o ângulo e tem o cluster | Asserção de cluster em `tests/content/guias.test.ts`; revisão da iteração 1 | ✅ PASS |
| PRB-09 | Sem resultado ou experiência de nicho não confirmados | `src/content/guias/locacao-equipamentos-devolucao-parcial.md:24,62,92,130`; `src/content/guias/erp-preenche-ibs-cbs-nfe.md:28,56,70`; `src/content/guias/pix-sem-txid-erp-nao-da-baixa.md:24,28` | ✅ PASS |
| PRB-10 | Fonte oficial nomeada; nada além dela | `src/content/guias/erp-preenche-ibs-cbs-nfe.md:24,34,47`; `src/content/guias/pix-sem-txid-erp-nao-da-baixa.md:67` | ✅ PASS, com os pontos não confirmados abaixo |
| PRB-11 | Controle atual com ≥3 perdas e pronto × sob medida | `src/content/guias/erp-preenche-ibs-cbs-nfe.md:52-62`; `src/content/guias/pix-sem-txid-erp-nao-da-baixa.md:45-59`; `src/content/guias/locacao-equipamentos-devolucao-parcial.md:60-74` | ✅ PASS |
| PRB-12 | Link "quanto custa"; sem preço de site ou sistema | `src/content/guias/erp-preenche-ibs-cbs-nfe.md:110`; `src/content/guias/pix-sem-txid-erp-nao-da-baixa.md:112`; `src/content/guias/locacao-equipamentos-devolucao-parcial.md:114` | ✅ PASS |

**Status**: 18 de 21 ACs sem ressalva, 1 parcial esperado (PRB-03), 2 com gap (SCHED-09 e SCHED-11, ambos em G1). Sem spec-precision gap.

Os ACs sem mudança nestes commits levam a evidência da iteração 2, com o gate rodado de novo agora.

---

## Pontos não confirmados

Não foi feita nova varredura de fontes. Nenhum destes impede o PASS, a meu ver; a decisão final é da revisão do usuário.

- **Informe Técnico 2025.002 v1.70 e os três dígitos do CST** (`src/content/guias/erp-preenche-ibs-cbs-nfe.md:46`): PDF visto só em site de terceiro; o Portal da NF-e não abriu.
- **Resolução BCB nº 1, 90 dias** (`src/content/guias/pix-sem-txid-erp-nao-da-baixa.md:19,118`): confirmado em tradução para o inglês, votos e Guia do MED em domínios do BCB; texto consolidado em português não localizado.
- **Falta de nova data para a validação** (`src/content/guias/erp-preenche-ibs-cbs-nfe.md:64`): só terceiros confirmam; a frase diz "não localizei".

A NT 2025.002 v1.51 está confirmada (`pdfs/ato.txt:33`, art. 1º, I, b).

---

## Discrimination Sensor

Worktree temporária destacada no `3891d18`, com symlink de `node_modules`, removida ao final. `git status --porcelain` da worktree real igual ao início (`?? .claude/` e `validation.md`).

| Id | `file:line` | Falha injetada | Resultado |
| -- | ----------- | -------------- | --------- |
| F22 | `tests/content/guias.test.ts:360` | Corpo com `[x](../slug/)` | ✅ Morto (sobreviveu na iteração 2) |
| F22b | `tests/content/guias.test.ts:360` | Corpo com `[x](./slug/)` | ✅ Morto |
| M20 | `tests/content/guide-rules.ts:12` | `relativeLinks` sempre vazio | ✅ Morto, 3 casos |
| F24 | `tests/content/guide-rules.ts:12` | Corpo com `[x](slug/)` | ❌ Sobreviveu |
| F25 | `tests/content/guide-rules.ts:12` | Corpo com `[r]: ../slug/` | ❌ Sobreviveu |

Fora da contagem, seguindo o critério da iteração 2:

- **M21**: retirar a chamada em `tests/content/guias.test.ts:360` sobrevive com os dados atuais, como qualquer remoção de asserção quando nenhum dado viola a regra.
- **M22**: a mesma retirada com um link relativo no corpo deixa de reprovar esse link. Junto com F22, isso prova que a chamada é o que reprova.

Nas fixtures F24, F25 e M22, as únicas falhas foram as do guia de teste, que copia outro guia e não tem `title` e cluster do calendário; o teste de links não falhou.

Os 31 mutantes da iteração 2 não foram rodados de novo, porque `src/` e o workflow não mudaram: F22 passou de sobrevivente a morto, e os outros 30 continuam com o resultado de `5ebdc90`.

**Sensor depth**: focado em G1, a pedido do orquestrador.
**Result**: 3/5 mortos nesta rodada - ❌ FAIL.

---

## Code Quality

| Principle | Status |
| --------- | ------ |
| Minimum code | ✅ `relativeLinks` tem 2 linhas |
| Surgical changes | ✅ |
| No scope creep | ✅ |
| Matches patterns | ✅ |
| Spec-anchored outcome check | ⚠️ G1 |
| Per-layer Coverage Expectation | ✅ Caso que passa e caso que falha em `tests/content/guide-rules.test.ts:22-27` |
| Every test maps to a requirement | ✅ |
| Documented guidelines | `tasks.md` (matriz) ✅ |

---

## Edge Cases

- [x] EDGE-01: ver pontos não confirmados
- [x] EDGE-04: os 3 guias passam de 1.200 palavras úteis
- [ ] EDGE-02, EDGE-03, EDGE-05: fora da Fase 1

---

## Gate Check

- **Gate command**: `npm run check && npm test && npm run build && npm run test:build`, rodado de novo por este Verificador em `3891d18`
- **Result**: check com 0 erros e 0 avisos; 783 passaram em `npm test`; 134 passaram em `test:build`; 0 falhas; 0 pulados
- **Delta sobre a iteração 2**: +4 em `npm test`

**Pendente fora do repositório**: o disparo manual do workflow ainda não foi feito, porque o arquivo não está na `main`.

---

## Fix Plans

1. **G1, Minor** - correção acima em `tests/content/guide-rules.ts:11-12`, se o usuário optar por ela. Pronto quando F24 e F25 morrerem.

---

## Requirement Traceability Update

| Requirement | Previous Status | New Status |
| ----------- | --------------- | ---------- |
| SCHED-01 a SCHED-08, SCHED-10 | Implementing | ✅ Verified (Fase 1) |
| SCHED-09, SCHED-11 | Implementing | ❌ Needs Fix (G1) ou resíduo aceito pelo usuário |
| PRB-01, PRB-02, PRB-04, PRB-07 a PRB-12 | Implementing | ✅ Verified (Fase 1) |
| PRB-03 | Implementing | ⚠️ Parcial até T33 |

`spec.md` não foi alterado por este Verificador.

---

## Summary

**Overall**: ⚠️ Issues: site correto, um resíduo de teste

**Spec-anchored check**: 18 de 21 ACs sem ressalva; 1 parcial esperado; 2 com gap (G1)
**Sensor**: 3/5 mutations killed nesta rodada
**Gate**: 783 + 134 passed, 0 failed

**What works**: filtro por data em todos os caminhos, virada do dia em Brasília, `lastmod`, workflow, links relativos inline e em `href`, textos dos 3 guias.

**Next steps**: o usuário decide G1. Limite de 3 iterações atingido.

# Guias por Nicho — Specification

## Problem Statement

A seção `/guias/` (feature `guias-conteudo`) tem 4 guias, todos sobre temas amplos ("quanto custa um site", "integração com o Bling"). Donos de pequenas empresas de nichos específicos (vidraçaria, ar-condicionado, distribuidora, caçambas…) pesquisam o próprio problema com as palavras do seu ramo, e hoje o site não tem nenhuma página que responda a essas pesquisas. São consultas de cauda longa, com intenção de compra e pouca concorrência de conteúdo em português que não seja página de venda de SaaS.

## Goals

- [ ] 11 guias novos publicados em `/guias/`, cada um respondendo a uma pesquisa de nicho e levando a uma página de serviço.
- [ ] Guias publicados na ordem de importância para SEO (tabela abaixo), em 3 ondas que podem ir ao ar separadamente.
- [ ] Os testes de conteúdo passam a valer para todo arquivo em `src/content/guias/`, e não só para os 4 do lançamento.
- [ ] Nenhuma mudança de código de páginas, rotas, sitemap ou `llms.txt`: a estrutura da feature `guias-conteudo` já gera tudo a partir do Markdown.

## Out of Scope

| Feature | Reason |
| ------- | ------ |
| Mudanças na estrutura de `/guias/` (layout, schema zod, JSON-LD, sitemap, `llms.txt`) | Já entregue e verificada em `guias-conteudo`; publicar guia exige só o arquivo Markdown. |
| Páginas de nicho fora de `/guias/` (ex.: `/sistema-para-vidracaria/`) | Mesma decisão das specs anteriores: os guias são o satélite; as 5 páginas de serviço continuam sendo os pilares. |
| Calculadora de orçamento, simulador ou qualquer recurso interativo nos guias | Os guias são texto; uma calculadora exigiria script e conflita com a CSP (AD-005). |
| Imagens e capturas nos guias | Mesma regra de `guias-conteudo`: imagens entram quando houver capturas reais. |
| Pesquisa de volume com ferramenta paga (Semrush, Ahrefs, Keyword Planner) | Nenhuma ferramenta de volume conectada; a ordem usa critérios qualitativos (ver Assumptions). |
| Deploy na Netlify e merge em `main` | Ação externa: exige autorização explícita do usuário a cada onda. |

---

## Ordem por importância para SEO

Critérios (1 a 3 cada): **Intenção** de compra, **Demanda** estimada, **Concorrência** (3 = fraca), **Aderência** à experiência real do responsável (ERPs, WhatsApp/CRM, NF-e, telemetria, automação) e **Cluster** (reforça guias ou serviços que já existem).

| # | Guia (h1 = pesquisa do usuário) | Slug | Serviço | Int | Dem | Conc | Ader | Clu | Total | Onda |
| - | ------------------------------- | ---- | ------- | --- | --- | ---- | ---- | --- | ----- | ---- |
| 1 | Minha loja virtual e o Bling não sincronizam os pedidos corretamente: quando preciso de uma integração personalizada? | `bling-nao-sincroniza-pedidos` | integracoes | 3 | 2 | 3 | 3 | 3 | 14 | 1 |
| 2 | Portal de pedidos para distribuidora: como parar de receber todos os pedidos pelo WhatsApp | `portal-de-pedidos-para-distribuidora` | sistemas-web | 3 | 2 | 2 | 3 | 3 | 13 | 1 |
| 3 | Sistema de ordens de serviço para empresa de ar-condicionado: visitas, técnicos e manutenção recorrente | `sistema-ordem-de-servico-ar-condicionado` | sistemas-web | 3 | 3 | 1 | 2 | 2 | 11 | 1 |
| 4 | Software para empresa de recarga de extintores controlar equipamentos, clientes e vencimentos | `software-recarga-de-extintores` | software-sob-medida | 3 | 2 | 3 | 2 | 1 | 11 | 1 |
| 5 | Portal de pedidos para fábrica de salgados congelados que vende para mercados e lanchonetes | `portal-de-pedidos-salgados-congelados` | sistemas-web | 3 | 1 | 3 | 2 | 3 | 12* | 2 |
| 6 | Quanto custa criar um site para vidraçaria com orçamento de box, espelhos e fachadas? | `quanto-custa-site-para-vidracaria` | criacao-de-sites | 3 | 2 | 2 | 1 | 2 | 10 | 2 |
| 7 | Sistema para empresa de aluguel de caçambas: controlar entregas, retiradas e trocas por endereço | `sistema-aluguel-de-cacambas` | software-sob-medida | 3 | 1 | 2 | 2 | 2 | 10 | 2 |
| 8 | Sistema de pedidos e produção para fábrica de uniformes personalizados | `sistema-fabrica-de-uniformes` | software-sob-medida | 3 | 1 | 2 | 2 | 1 | 9 | 3 |
| 9 | Portal do cliente para escritório de contabilidade: como organizar documentos e pendências sem depender de mensagens | `portal-do-cliente-contabilidade` | sistemas-web | 2 | 3 | 1 | 2 | 1 | 9 | 3 |
| 10 | Sistema para empresa de instalação de portões automáticos: orçamento, instalação e manutenção | `sistema-portoes-automaticos` | software-sob-medida | 3 | 1 | 2 | 1 | 1 | 8 | 3 |
| 11 | Site para aluguel de brinquedos infláveis: como consultar disponibilidade e pedir orçamento por data | `site-aluguel-de-inflaveis` | criacao-de-sites | 2 | 2 | 2 | 1 | 1 | 8 | 3 |

\* Salgados (12) soma mais que ar-condicionado e extintores, mas vai na onda 2 porque depende do guia de distribuidora (#2) como página-mãe do cluster B2B; publicado antes, os dois disputariam a mesma pesquisa "portal de pedidos".

**Por que esta ordem, em uma linha cada:**
1. Bling — pesquisa de problema ("não sincroniza") com dor imediata; a concorrência é a central de ajuda do Bling, que não fala de integração personalizada; reforça o guia `integracao-bling-api`.
2. Distribuidora — nicho principal escolhido pelo usuário (distribuidoras com ERP); a pergunta "como parar de receber pedido pelo WhatsApp" é o formato que IAs de busca respondem.
3. Ar-condicionado — maior demanda da lista e gancho legal (PMOC, Lei 13.589/2018), mas SERP dominada por SaaS de campo; o guia ganha pelo ângulo PMOC + manutenção recorrente.
4. Extintores — vencimentos definidos em norma (ABNT NBR 12962) geram necessidade recorrente; quase não há conteúdo além de páginas de venda.
5. Salgados — B2B com pedido recorrente, entrega por rota e produção por lote; cauda longa sem concorrência.
6. Vidraçaria — "quanto custa" tem a maior intenção de compra, mas a demanda nichada é baixa; reforça `quanto-custa-um-site`.
7. Caçambas — operação por endereço liga ao guia `integracao-rastreamento-veicular`; SaaS de nicho existem, conteúdo explicativo não.
8. Uniformes — produção sob encomenda (grade, tamanhos, personalização) tem pouca concorrência, mas demanda pequena.
9. Contabilidade — demanda alta, porém SERP dominada por portais prontos (Onvio, Acessórias, Gestta); difícil ranquear.
10. Portões — demanda baixa e mesmo modelo do #3 (OS + manutenção); risco de canibalização se não tiver ângulo próprio.
11. Infláveis — sazonal, ticket baixo e mais próximo de agenda/reserva do que de sistema.

---

## Assumptions & Open Questions

| Assumption / decision | Chosen default | Rationale | Confirmed? |
| --------------------- | -------------- | --------- | ---------- |
| Lista de guias | Os 11 temas acima, com o h1 igual à pergunta escrita pelo usuário (ajuste mínimo de pontuação) | Pedido do usuário (2026-10-17). | y |
| Ordem por SEO | Pontuação qualitativa da tabela "Ordem por importância"; volumes não medidos | Nenhuma ferramenta de volume conectada (`localseodata`, Semrush, Search Console). Rever a ordem quando o Search Console tiver 90 dias de dados. | y |
| Publicação em ondas | Onda 1 = guias 1–4, onda 2 = 5–7, onda 3 = 8–11; cada onda pode ser mesclada e publicada sozinha | Publicar primeiro o que tem mais chance de trazer cliente; o Google descobre conteúdo novo em lotes regulares. | y |
| Branch | `feat/guias-nichos` criada a partir de `feat/guias-conteudo` (ainda não mesclada em `main`) | A estrutura de `/guias/` só existe nessa branch. | y |
| Mapeamento guia → serviço | Coluna "Serviço" da tabela | Distribui os guias entre `sistemas-web` (hoje sem guia), `software-sob-medida`, `integracoes` e `criacao-de-sites`, sem passar de ~5 por serviço. | y |
| Título (`<title>`) | Coluna "title" de GN-02, sempre com o sufixo " \| Leonardo Assunção" e entre 30 e 60 caracteres | Mesmo padrão dos 4 guias existentes; limite de COL-04 / SEO-08. | y |
| Experiência nos nichos | Os guias não dizem que o responsável já fez sistemas para esses nichos. O eixo de cada guia é a importância de organizar as informações da operação: como o ramo costuma controlar tudo hoje (planilha, papel, WhatsApp, sistema que não atende 100%), o que se perde com isso e como um sistema organizado resolve (GN-15, GN-16) | Decisão do usuário (2026-10-17): não atendeu esses nichos, mas quer falar deles a partir do problema de organização. | y |
| Preços | Só o guia de vidraçaria traz faixas de preço, como referência de mercado em 2026, com o mesmo critério de `quanto-custa-um-site`; os demais remetem aos guias "quanto custa" | Decisão anterior do usuário (2026-10-17): faixas de mercado são aceitas; espalhar preços por 11 guias multiplica o risco de valores desatualizados. | y |
| Fatos de lei, norma ou API | Todo fato regulatório ou de API citado (PMOC/Lei 13.589/2018, ABNT NBR 12962, comportamento da API do Bling, CT-e/MDF-e, etc.) é conferido na fonte oficial no dia em que o guia é escrito e nomeado no texto | Erro em fato verificável destrói E-E-A-T e a chance de citação por IA. | y |
| Canibalização | Guias do mesmo modelo de sistema (ar-condicionado × portões × extintores; distribuidora × salgados) têm ângulos distintos, definidos em GN-11 | Sem ângulo próprio, duas páginas disputam a mesma pesquisa e nenhuma ranqueia. | y |
| Revisão do usuário | Guias escritos pelo agente com `draft: false`, revisados pelo usuário antes do merge de cada onda | Mesmo fluxo de `guias-conteudo`. | y |

**Open questions:** none - all resolved or logged above (required before the spec is confirmed).

---

## User Stories

### P1: Testes de conteúdo valem para todos os guias ⭐ MVP

**User Story**: Como responsável pelo site, quero que toda regra de conteúdo (tamanho, FAQ, títulos, menção local, links) seja conferida em qualquer guia novo, para não depender de lembrar de adicionar cada guia a uma lista.

**Why P1**: Sem isso, 11 guias novos entram sem nenhuma verificação automática (o teste atual só lê os 4 do lançamento).

**Acceptance Criteria**:

1. The content test SHALL apply the CONT-02, CONT-03, CONT-04, CONT-05, CONT-07, COL-04 and LINK-05 checks to every `.md` file in `src/content/guias/`. <!-- TEST-01 -->
2. The content test SHALL keep a map of the 15 planned guide slugs (4 launch + 11 of this feature) to `servico`, SHALL fail when a present guide file has a different `servico`, and SHALL fail when a slug of the required set has no file; the required set SHALL be the 4 launch guides until the last task of this feature, and all 15 after it. <!-- TEST-02 -->
3. IF a guide file exists in `src/content/guias/` and is not in the expected map THEN the content test SHALL fail naming the slug. <!-- TEST-03 -->
4. The content test SHALL check that every guide body links to at least one other guide (`/guias/<slug>/`) that has a file in `src/content/guias/`. <!-- TEST-04 -->

**Independent Test**: Adicionar uma fixture temporária fora do mapa e com 100 palavras: o teste falha por TEST-03 e CONT-02; removida, o teste passa com os 4 guias atuais.

---

### P1: Onda 1 — guias de maior prioridade ⭐ MVP

**User Story**: Como dono de loja virtual, distribuidora, empresa de ar-condicionado ou de recarga de extintores, quero uma resposta concreta para o problema que pesquisei, para entender se preciso de um sistema e com quem falar.

**Why P1**: São os 4 guias com maior pontuação; sozinhos já cobrem 3 dos 4 serviços com guias.

**Acceptance Criteria**:

1. The site SHALL include the guides `bling-nao-sincroniza-pedidos`, `portal-de-pedidos-para-distribuidora`, `sistema-ordem-de-servico-ar-condicionado` and `software-recarga-de-extintores`, each with the `servico`, `h1` and `title` given in GN-02. <!-- GN-01 -->

**Independent Test**: `npm test` com os 4 slugs no mapa esperado; leitura dos 4 guias contra GN-03 a GN-11.

---

### P2: Onda 2 — guias de média prioridade

**User Story**: Como dono de fábrica de salgados, vidraçaria ou empresa de caçambas, quero ver como um site ou sistema resolveria o meu dia a dia, para pedir orçamento sabendo o que pedir.

**Why P2**: Pontuação média; salgados depende do guia de distribuidora para não canibalizar.

**Acceptance Criteria**:

1. The site SHALL include the guides `portal-de-pedidos-salgados-congelados`, `quanto-custa-site-para-vidracaria` and `sistema-aluguel-de-cacambas`, each with the `servico`, `h1` and `title` given in GN-02. <!-- GN-12 -->

**Independent Test**: `npm test` com os 3 slugs no mapa esperado.

---

### P3: Onda 3 — guias de menor prioridade

**User Story**: Como dono de fábrica de uniformes, escritório de contabilidade, empresa de portões ou de aluguel de infláveis, quero entender o que um sistema ou site faria pela minha operação.

**Why P3**: Menor demanda ou concorrência mais forte; completam a cobertura.

**Acceptance Criteria**:

1. The site SHALL include the guides `sistema-fabrica-de-uniformes`, `portal-do-cliente-contabilidade`, `sistema-portoes-automaticos` and `site-aluguel-de-inflaveis`, each with the `servico`, `h1` and `title` given in GN-02. <!-- GN-13 -->

**Independent Test**: `npm test` com os 4 slugs no mapa esperado.

---

### Regras de conteúdo de todo guia desta feature

**Acceptance Criteria**:

1. Each guide of this feature SHALL have the `servico`, `title` and `h1` below. <!-- GN-02 -->

   | Slug | servico | title |
   | ---- | ------- | ----- |
   | `bling-nao-sincroniza-pedidos` | integracoes | Bling Não Sincroniza Pedidos da Loja? \| Leonardo Assunção |
   | `portal-de-pedidos-para-distribuidora` | sistemas-web | Portal de Pedidos para Distribuidora \| Leonardo Assunção |
   | `sistema-ordem-de-servico-ar-condicionado` | sistemas-web | Sistema de OS para Ar-Condicionado \| Leonardo Assunção |
   | `software-recarga-de-extintores` | software-sob-medida | Software para Recarga de Extintores \| Leonardo Assunção |
   | `portal-de-pedidos-salgados-congelados` | sistemas-web | Portal de Pedidos: Salgados Congelados \| Leonardo Assunção |
   | `quanto-custa-site-para-vidracaria` | criacao-de-sites | Quanto Custa um Site para Vidraçaria \| Leonardo Assunção |
   | `sistema-aluguel-de-cacambas` | software-sob-medida | Sistema para Aluguel de Caçambas \| Leonardo Assunção |
   | `sistema-fabrica-de-uniformes` | software-sob-medida | Sistema para Fábrica de Uniformes \| Leonardo Assunção |
   | `portal-do-cliente-contabilidade` | sistemas-web | Portal do Cliente para Contabilidade \| Leonardo Assunção |
   | `sistema-portoes-automaticos` | software-sob-medida | Sistema para Portões Automáticos \| Leonardo Assunção |
   | `site-aluguel-de-inflaveis` | criacao-de-sites | Site para Aluguel de Infláveis \| Leonardo Assunção |

   The `h1` SHALL be the question from the "Ordem por importância" table.
2. Each guide body SHALL have at least 1.200 words, excluding frontmatter and FAQ (same count as CONT-02). <!-- GN-03 -->
3. Each guide SHALL have at least 4 FAQ items. <!-- GN-04 -->
4. Each guide body SHALL use at least 4 `##` headings phrased as the reader's questions or tasks. <!-- GN-05 -->
5. Each guide body SHALL mention Canoas or Porto Alegre at least once, in a sentence about service area or local context. <!-- GN-06 -->
6. Each guide body SHALL link to its service page `/<servico>/` and to at least one other guide `/guias/<slug>/` (cluster links in GN-11). <!-- GN-07 -->
7. Each guide `resumo` SHALL answer the `h1` question in its first sentence. <!-- GN-08 -->
8. The guides SHALL NOT state clients, number of projects, years of experience, results or experience in the guide's niche that the user has not confirmed. <!-- GN-09 -->
9. WHERE a guide states a law, technical standard, tax document or third-party API behavior THEN it SHALL name the source (law number, ABNT standard or official documentation) checked on the writing date. <!-- GN-10 -->
10. Each guide SHALL follow its angle and cluster link from the table below, so no two guides of this feature target the same primary query. <!-- GN-11 -->

   | Slug | Ângulo próprio (pesquisa principal) | Link de cluster obrigatório |
   | ---- | ----------------------------------- | --------------------------- |
   | `bling-nao-sincroniza-pedidos` | Diagnóstico de falha de sincronização loja ↔ Bling e quando o conector pronto não basta | `/guias/integracao-bling-api/` |
   | `portal-de-pedidos-para-distribuidora` | Tirar pedidos do WhatsApp: catálogo B2B com tabela de preço por cliente, pedido mínimo e envio ao ERP | `/guias/bling-nao-sincroniza-pedidos/` |
   | `sistema-ordem-de-servico-ar-condicionado` | OS de campo + PMOC + manutenção preventiva recorrente | `/guias/quanto-custa-um-sistema-sob-medida/` |
   | `software-recarga-de-extintores` | Controle de vencimentos por equipamento (recarga, teste hidrostático) e aviso ao cliente | `/guias/sistema-ordem-de-servico-ar-condicionado/` |
   | `portal-de-pedidos-salgados-congelados` | Pedido recorrente de mercados/lanchonetes → planejamento de produção por lote e rota de entrega | `/guias/portal-de-pedidos-para-distribuidora/` |
   | `quanto-custa-site-para-vidracaria` | Preço de site de vidraçaria e formulário de orçamento por medida (box, espelho, fachada) | `/guias/quanto-custa-um-site/` |
   | `sistema-aluguel-de-cacambas` | Agenda de entrega, troca e retirada por endereço, prazo de permanência e caçamba no pátio | `/guias/integracao-rastreamento-veicular/` |
   | `sistema-fabrica-de-uniformes` | Pedido com grade de tamanhos e personalização → ordem de produção por etapa | `/guias/quanto-custa-um-sistema-sob-medida/` |
   | `portal-do-cliente-contabilidade` | Portal sob medida × portal pronto; checklist de documentos e pendências por cliente | `/guias/quanto-custa-um-sistema-sob-medida/` |
   | `sistema-portoes-automaticos` | Orçamento com visita técnica → instalação → contrato de manutenção (garantia e chamados) | `/guias/sistema-ordem-de-servico-ar-condicionado/` |
   | `site-aluguel-de-inflaveis` | Site com calendário de disponibilidade por brinquedo e pedido de orçamento por data | `/guias/quanto-custa-um-site/` |

11. WHERE a guide other than `quanto-custa-site-para-vidracaria` discusses cost THEN it SHALL link to a "quanto custa" guide and SHALL NOT state price values. <!-- GN-14 -->
12. Each guide body SHALL include a `##` section describing how a business of that niche typically controls the operation today — covering spreadsheets, paper and WhatsApp messages — with at least 3 concrete losses specific to the niche (e.g., expired extinguisher not reported, duplicated order, technician sent to the wrong address). <!-- GN-15 -->
13. Each guide body SHALL include a `##` section on a system that does not meet the operation 100%, stating when a ready-made system is enough and when a custom system or integration is worth it. <!-- GN-16 -->

---

## Edge Cases

- IF a cluster-link target guide is not yet published when its source guide is written THEN the source guide SHALL link to the target's already-published fallback in the same row's service cluster (`/guias/quanto-custa-um-sistema-sob-medida/` or `/guias/quanto-custa-um-site/`), and the link SHALL be updated when the target ships. <!-- EDGE-01 -->
- IF a fact required by GN-10 cannot be confirmed in an official source THEN the guide SHALL omit the fact rather than state it unsourced. <!-- EDGE-02 -->
- IF a guide's `title` exceeds 60 characters THEN the build SHALL fail (existing COL-04; no new code). <!-- EDGE-03 -->

Implicit-requirement dimensions sweep:

| Dimension | Resolution |
| --------- | ---------- |
| Input validation & bounds | GN-02 a GN-05 + COL-04 existente |
| Failure / partial-failure states | N/A because conteúdo estático; o build já falha com o nome do arquivo (COL-03 a COL-07) |
| Idempotency / retry / duplicate handling | GN-11 (sem pesquisa principal duplicada) e títulos únicos (SEO-08 existente) |
| Auth boundaries & rate limits | N/A because páginas estáticas públicas |
| Concurrency / ordering | Ordem de publicação por onda (tabela) e EDGE-01 para links a guias ainda não publicados |
| Data lifecycle / expiry | `updatedAt` existente; preços e normas conferidos na data de escrita (GN-10) |
| Observability | N/A because medido no Search Console, fora do código |
| External-dependency failure | N/A because nenhuma dependência nova |
| State-transition integrity | N/A because os guias nascem publicados (`draft: false`) e passam pela revisão antes do merge |

---

## Requirement Traceability

| Requirement ID | Story | Phase | Status |
| -------------- | ----- | ----- | ------ |
| TEST-01 | P1: Testes de conteúdo | Tasks | Implementing |
| TEST-02 | P1: Testes de conteúdo | Tasks | Implementing |
| TEST-03 | P1: Testes de conteúdo | Tasks | Implementing |
| TEST-04 | P1: Testes de conteúdo | Tasks | Implementing |
| GN-01 | P1: Onda 1 | Tasks | Implementing |
| GN-02 | Regras de conteúdo | Tasks | Implementing |
| GN-03 | Regras de conteúdo | Tasks | Implementing |
| GN-04 | Regras de conteúdo | Tasks | Implementing |
| GN-05 | Regras de conteúdo | Tasks | Implementing |
| GN-06 | Regras de conteúdo | Tasks | Implementing |
| GN-07 | Regras de conteúdo | Tasks | Implementing |
| GN-08 | Regras de conteúdo | Tasks | Implementing |
| GN-09 | Regras de conteúdo | Tasks | Implementing |
| GN-10 | Regras de conteúdo | Tasks | Implementing |
| GN-11 | Regras de conteúdo | Tasks | Implementing |
| GN-12 | P2: Onda 2 | Tasks | Implementing |
| GN-13 | P3: Onda 3 | Tasks | Pending |
| GN-14 | Regras de conteúdo | Tasks | Implementing |
| GN-15 | Regras de conteúdo | Tasks | Implementing |
| GN-16 | Regras de conteúdo | Tasks | Implementing |
| EDGE-01 | Edge cases | Tasks | Pending |
| EDGE-02 | Edge cases | Tasks | Implementing |
| EDGE-03 | Edge cases | Tasks | Pending |

**Coverage:** 23 total, 23 mapped to tasks, 0 unmapped

---

## Success Criteria

- [ ] Os 11 guias publicados e indexados em até 30 dias após o deploy de cada onda (Search Console → Páginas).
- [ ] Em 90 dias, cada guia com impressões no Search Console para a pesquisa principal do seu ângulo (GN-11).
- [ ] Pelo menos 1 contato pelo formulário ou WhatsApp vindo de uma página de guia de nicho em 120 dias.
- [ ] Ordem das ondas revista com os dados reais do Search Console depois da onda 1.

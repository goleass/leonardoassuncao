# Guias de Problemas Reais — Specification

## Problem Statement

O site tem 15 guias, a maioria organizada por nicho ou por tema amplo. Falta cobrir pesquisas feitas com as palavras exatas de um problema ("erro 425 na API do Omie", "devolveu só parte dos andaimes"), que têm intenção clara e costumam ter pouco conteúdo prático. Publicar tudo de uma vez também concentraria o conteúdo em um único dia, então os guias são revisados antes e publicados por data, em lotes diários automáticos.

## Goals

- [ ] 27 guias novos publicados entre 2026-11-05 e 2026-11-17, no máximo 3 por dia, se as condições do calendário forem atendidas.
- [ ] A publicação acontece sozinha todos os dias às 9h de Brasília, sem depender de alguém lembrar.
- [ ] Cada guia resolve um problema concreto e leva a uma página de serviço.
- [ ] Nenhuma mudança de layout ou rotas: o filtro por data fica nos pontos que já leem os guias.

## Out of Scope

| Feature | Reason |
| ------- | ------ |
| Escrita ou publicação sem revisão do usuário | Decisão do usuário: o agente escreve, o usuário revisa e o cron só publica o que já está na `main`. |
| Mudanças na estrutura de `/guias/` | Já entregue em `guias-conteudo`. |
| Calculadoras, imagens ou recursos interativos | Mesma regra de `guias-nichos`; conflita com a CSP ou exige capturas reais. |
| Reescrever os 15 guias existentes | Fora deste pedido. |
| Medir volume de busca por ferramenta paga | Nenhuma ferramenta conectada; a ordem usa critérios qualitativos. |
| Merge em `main` e push sem autorização | Ação externa: exige autorização explícita para cada bloco revisado. O build diário do cron só publica o que já foi autorizado. |

---

## Calendário

As datas são as de `publishedAt`. Guia ainda não revisado na sua data sai para o próximo dia com vaga, sem passar de 3 guias por dia.

| # | Dia | Slug | Title (+ "| Leonardo Assunção") | Serviço | H1 (pesquisa do usuário) | Link de cluster |
| - | --- | ---- | ----- | ------- | ------------------------ | --------------- |
| 1 | qui 05/11 | `erp-preenche-ibs-cbs-nfe` | IBS e CBS na NF-e: Seu ERP Está Pronto? | integracoes | Meu ERP já preenche IBS e CBS na NF-e? Como conferir antes de ter problema | `/guias/integracao-bling-api/` |
| 2 | qui 05/11 | `pix-sem-txid-erp-nao-da-baixa` | Pix na Chave: ERP Não Dá Baixa Sozinho | integracoes | Cliente pagou o Pix direto na chave e o ERP não deu baixa: como resolver | `/guias/integracao-bling-api/` |
| 3 | qui 05/11 | `locacao-equipamentos-devolucao-parcial` | Locação: Cobrança na Devolução Parcial | software-sob-medida | Como cobrar diárias quando o cliente devolve só parte dos andaimes ou equipamentos? | `/guias/sistema-aluguel-de-cacambas/` |
| 4 | sex 06/11 | `custo-api-whatsapp-mensagens-servico` | Custo da API do WhatsApp Subiu? Entenda | integracoes | A conta da API do WhatsApp subiu depois de outubro: como descobrir o que está gerando custo | `/guias/portal-de-pedidos-para-distribuidora/` |
| 5 | sex 06/11 | `aluguel-trajes-reserva-duplicada` | Aluguel de Trajes sem Reserva Duplicada | software-sob-medida | Como evitar alugar o mesmo vestido ou traje para duas festas na mesma data? | `/guias/site-aluguel-de-inflaveis/` |
| 6 | sáb 07/11 | `omie-erro-425-bloqueio-api` | Erro 425 na API do Omie: Como Resolver | manutencao-de-sistemas | Erro 425 na API do Omie: por que a integração foi bloqueada por 30 minutos? | `/guias/integracao-bling-api/` |
| 7 | sáb 07/11 | `laboratorio-protese-controle-trabalhos` | Prótese Dentária: Controle de Trabalhos | sistemas-web | Como um laboratório de prótese dentária acompanha os trabalhos que vão e voltam do dentista? | `/guias/sistema-fabrica-de-uniformes/` |
| 8 | dom 08/11 | `pagamento-duplicado-valor-diferente` | Pagamento Duplicado: Como Tratar no ERP | integracoes | Cliente pagou duas vezes ou com valor diferente: como tratar a baixa no sistema? | `/guias/pix-sem-txid-erp-nao-da-baixa/` |
| 9 | dom 08/11 | `oficina-historico-servicos-por-placa` | Oficina: Histórico de Serviços por Placa | software-sob-medida | Como encontrar o que já foi trocado em um carro quando o cliente volta na garantia da oficina? | `/guias/sistema-ordem-de-servico-ar-condicionado/` |
| 10 | seg 09/11 | `omie-consumo-indevido-get` | Consumo Indevido [GET] na API do Omie | manutencao-de-sistemas | Consumo indevido [GET] na API do Omie: o que significa e como corrigir | `/guias/omie-erro-425-bloqueio-api/` |
| 11 | seg 09/11 | `grafica-registro-aprovacao-arte` | Gráfica: Registro de Aprovação da Arte | sistemas-web | O cliente aprovou a arte e depois disse que está errada: como a gráfica pode provar? | `/guias/sistema-fabrica-de-uniformes/` |
| 12 | ter 10/11 | `pilates-controle-reposicao-aulas` | Pilates: Como Controlar as Reposições | sistemas-web | Como um estúdio de pilates controla reposição de aulas sem se perder? | `/guias/quanto-custa-um-sistema-sob-medida/` |
| 13 | ter 10/11 | `imobiliaria-repasse-proprietarios` | Imobiliária: Repasse sem Planilha | software-sob-medida | Como uma imobiliária pequena organiza o repasse aos proprietários sem planilha? | `/guias/quanto-custa-um-sistema-sob-medida/` |
| 14 | qua 11/11 | `pagamento-aprovado-dinheiro-nao-caiu` | Pago, Mas Não Caiu: Status no Financeiro | integracoes | O pagamento foi aprovado, mas o dinheiro não entrou: como separar os status no financeiro? | `/guias/pagamento-duplicado-valor-diferente/` |
| 15 | qua 11/11 | `estetica-controle-pacotes-sessoes` | Estética: Controle de Pacotes de Sessão | sistemas-web | Como uma clínica de estética controla as sessões de um pacote já pago? | `/guias/pilates-controle-reposicao-aulas/` |
| 16 | qui 12/11 | `marmoraria-erro-medida-retalhos` | Marmoraria: Erro de Medida e Retalhos | software-sob-medida | Como uma marmoraria evita perder dinheiro com medida errada e retalho de chapa? | `/guias/quanto-custa-site-para-vidracaria/` |
| 17 | qui 12/11 | `bling-integracao-parou-token` | Bling Parou Sozinho? Verifique o Token | manutencao-de-sistemas | A integração com o Bling parou sozinha depois de um tempo: é o token? | `/guias/integracao-bling-api/` |
| 18 | sex 13/11 | `marcenaria-orcado-custo-real` | Marcenaria: Orçado x Custo Real do Móvel | software-sob-medida | Por que o móvel vendido pela marcenaria dá menos lucro que o previsto? | `/guias/quanto-custa-um-sistema-sob-medida/` |
| 19 | sex 13/11 | `transporte-escolar-controle-mensalidades` | Transporte Escolar: Controle de Cobrança | sistemas-web | Como controlar mensalidades atrasadas do transporte escolar sem constranger os pais? | `/guias/pix-sem-txid-erp-nao-da-baixa/` |
| 20 | sáb 14/11 | `energia-solar-homologacao-garantia` | Energia Solar: Homologação e Garantia | sistemas-web | Como acompanhar a homologação e a garantia de cada instalação de energia solar? | `/guias/sistema-ordem-de-servico-ar-condicionado/` |
| 21 | sáb 14/11 | `assistencia-celular-aparelho-abandonado` | Celular Esquecido na Assistência Técnica | software-sob-medida | O que fazer com os celulares que o cliente nunca buscou na assistência técnica? | `/guias/oficina-historico-servicos-por-placa/` |
| 22 | dom 15/11 | `escolinha-futebol-mensalidades-pix` | Escolinha de Futebol: Quem Está em Dia? | sistemas-web | Como saber quem está em dia na escolinha de futebol sem conferir o extrato aluno por aluno? | `/guias/transporte-escolar-controle-mensalidades/` |
| 23 | dom 15/11 | `condominio-reserva-salao-festas` | Condomínio: Reservas sem Conflito | sistemas-web | Como organizar a reserva do salão de festas do condomínio sem conflito entre moradores? | `/guias/aluguel-trajes-reserva-duplicada/` |
| 24 | seg 16/11 | `veterinaria-aviso-reforco-vacina` | Vacina Pet: Aviso da Data do Reforço | sistemas-web | Como a clínica veterinária avisa o tutor na data do reforço da vacina? | `/guias/software-recarga-de-extintores/` |
| 25 | seg 16/11 | `pedidos-amazon-nao-entram-tiny` | Pedidos da Amazon Não Entram no Tiny? | integracoes | Pedidos da Amazon não entram no Tiny/Olist e a nota não sai: o que conferir | `/guias/bling-nao-sincroniza-pedidos/` |
| 26 | ter 17/11 | `rastreador-posicao-atrasada` | Rastreador com Posição Atrasada: Causas | integracoes | Rastreador com posição atrasada: é o equipamento, o sinal ou a integração? | `/guias/integracao-rastreamento-veicular/` |
| 27 | ter 17/11 | `frota-rastreadores-marcas-diferentes` | Rastreadores Diferentes em Um Painel Só | integracoes | Frota com rastreadores de marcas diferentes: como ver tudo em um painel só? | `/guias/rastreador-posicao-atrasada/` |

**Por que esta ordem:**

- 05 e 06/11 trazem os temas com prazo: IBS/CBS (Simples em 2027) e a nova cobrança da API do WhatsApp.
- Cada dia combina temas técnicos e nichos variados, para o site não concentrar um só assunto em sequência.
- Guias que dependem de outro saem depois dele; o cluster de pagamentos, por exemplo, começa pelo Pix.
- Guias condicionais ficam no fim, porque faltam fontes ou a confirmação da vivência do usuário.
- Publica de segunda a domingo, inclusive feriados, por decisão do usuário.

## Ângulo de cada guia

| Slug | Ângulo próprio |
| ---- | -------------- |
| `erp-preenche-ibs-cbs-nfe` | Conferir no XML e no ERP os campos de IBS e CBS enquanto a rejeição automática está suspensa |
| `pix-sem-txid-erp-nao-da-baixa` | Pix sem txid: por que o webhook da cobrança não ajuda e como conciliar pelo extrato |
| `locacao-equipamentos-devolucao-parcial` | Saldo por item e cálculo de diárias a cada devolução parcial, com falta e avaria |
| `custo-api-whatsapp-mensagens-servico` | Medir mensagens por fluxo e cortar envios de chatbot e CRM sem perder atendimento |
| `aluguel-trajes-reserva-duplicada` | Agenda por peça com folga para ajuste, lavagem e devolução atrasada |
| `omie-erro-425-bloqueio-api` | Parar o bloqueio por requisições incorretas repetidas: tratamento de erro, cache e backoff |
| `laboratorio-protese-controle-trabalhos` | Etapa, prova, ajuste e prazo de cada caso por dentista |
| `pagamento-duplicado-valor-diferente` | Idempotência por evento e fila de exceção para pagamento duplicado ou com valor divergente |
| `oficina-historico-servicos-por-placa` | Histórico por placa: peças, serviços e garantia ligados à ordem de serviço |
| `omie-consumo-indevido-get` | Trocar a chamada para POST e achar a origem do erro; guia curto de erro exato |
| `grafica-registro-aprovacao-arte` | Versão da arte, aprovação registrada e rastreio até a impressão |
| `pilates-controle-reposicao-aulas` | Crédito de aula, validade e vaga da turma visíveis para aluno e estúdio |
| `imobiliaria-repasse-proprietarios` | Extrato por contrato com reajuste, taxas, descontos e repasse |
| `pagamento-aprovado-dinheiro-nao-caiu` | Separar aprovado, liberado e recebido para o fluxo de caixa não mentir |
| `estetica-controle-pacotes-sessoes` | Saldo por cliente e procedimento, com assinatura de cada sessão realizada |
| `marmoraria-erro-medida-retalhos` | Medição registrada na obra e estoque de retalhos reaproveitáveis |
| `bling-integracao-parou-token` | Renovação do token OAuth, salvamento do novo token e alerta antes de parar |
| `marcenaria-orcado-custo-real` | Comparar orçamento com material e horas reais por projeto |
| `transporte-escolar-controle-mensalidades` | Cobrança separada da conversa pessoal, com aviso automático e histórico por aluno |
| `energia-solar-homologacao-garantia` | Linha do tempo da instalação: documentos, concessionária e garantias |
| `assistencia-celular-aparelho-abandonado` | Registro de entrada, avisos com data e histórico; a decisão sobre o aparelho é jurídica |
| `escolinha-futebol-mensalidades-pix` | Pix pago por parente em nome de outra pessoa: ligar pagamento ao aluno |
| `condominio-reserva-salao-festas` | Regra de reserva, taxa e fila visíveis para todos os moradores |
| `veterinaria-aviso-reforco-vacina` | Agenda de retorno por animal e aviso com autorização do tutor |
| `pedidos-amazon-nao-entram-tiny` | Roteiro de conferência da importação até a nota |
| `rastreador-posicao-atrasada` | Separar a hora do evento e a hora do recebimento para achar onde está o atraso |
| `frota-rastreadores-marcas-diferentes` | Normalizar os dados de vários fornecedores em um único modelo |

## Fontes e cuidados de cada guia

| Slug | Fontes e cuidados |
| ---- | ----------------- |
| `erp-preenche-ibs-cbs-nfe` | Ato Técnico Conjunto CGIBS/RFB nº 1/2026, Ato Conjunto RFB/CGIBS nº 4/2026, Nota Técnica 2025.002 e calendário oficial do Simples; orientar a validar a parte tributária com o contador |
| `pix-sem-txid-erp-nao-da-baixa` | Manual e API Pix do Banco Central; documentação do provedor citado |
| `locacao-equipamentos-devolucao-parcial` | Sem norma obrigatória; não afirmar regra contratual como universal |
| `custo-api-whatsapp-mensagens-servico` | Tabela e documentação oficial da Meta na data; valores só da fonte oficial |
| `aluguel-trajes-reserva-duplicada` | Sem norma obrigatória |
| `omie-erro-425-bloqueio-api` | Central de ajuda da Omie: limites de consumo e tratamento de erros |
| `laboratorio-protese-controle-trabalhos` | LGPD só com artigo conferido na Lei 13.709/2018; sem orientação clínica |
| `pagamento-duplicado-valor-diferente` | Documentação dos provedores citados |
| `oficina-historico-servicos-por-placa` | Prazos de garantia só com artigo conferido no Código de Defesa do Consumidor |
| `omie-consumo-indevido-get` | Central de ajuda da Omie; precisa atingir 1.200 palavras sem enchimento (ver Edge Cases) |
| `grafica-registro-aprovacao-arte` | Não prometer valor jurídico sem fonte; registro serve como organização da prova |
| `pilates-controle-reposicao-aulas` | Sem orientação de saúde |
| `imobiliaria-repasse-proprietarios` | Lei 8.245/1991 só no que for conferido; índices e regras tributárias só de fonte oficial |
| `pagamento-aprovado-dinheiro-nao-caiu` | Documentação dos provedores citados; prazos só da fonte oficial |
| `estetica-controle-pacotes-sessoes` | LGPD só com artigo conferido; sem alegação clínica |
| `marmoraria-erro-medida-retalhos` | Sem norma obrigatória |
| `bling-integracao-parou-token` | Prazos só da documentação oficial da API v3; a fonte atual é de terceiro |
| `marcenaria-orcado-custo-real` | Exemplos claramente hipotéticos, sem dados de lucro inventados |
| `transporte-escolar-controle-mensalidades` | Art. 42 do CDC só se conferido; LGPD de menores só com artigo conferido |
| `energia-solar-homologacao-garantia` | Lei 14.300/2022 e norma da ANEEL conferidas na data |
| `assistencia-celular-aparelho-abandonado` | Não indicar descarte ou venda sem fonte legal; orientar consulta a advogado |
| `escolinha-futebol-mensalidades-pix` | LGPD de menores só com artigo conferido |
| `condominio-reserva-salao-festas` | Regras dependem da convenção de cada condomínio; Código Civil só se conferido |
| `veterinaria-aviso-reforco-vacina` | Intervalos de vacina fora do texto; sem orientação clínica |
| `pedidos-amazon-nao-entram-tiny` | CONDICIONAL: exige documentação oficial do Tiny/Olist ou caso confirmado pelo usuário; relato do Reclame Aqui não vira fato |
| `rastreador-posicao-atrasada` | CONDICIONAL: exige confirmação do usuário a partir da vivência em telemetria |
| `frota-rastreadores-marcas-diferentes` | CONDICIONAL: exige confirmação do usuário a partir da vivência em telemetria |

---

## Assumptions & Open Questions

| Assumption / decision | Chosen default | Rationale | Confirmed? |
| --------------------- | -------------- | --------- | ---------- |
| Lista de temas | Os 27 temas sugeridos na conversa de 2026-11-05 (11 técnicos e 16 de nichos variados) | O usuário pediu temas diversos e aprovou o roadmap. | y |
| Cadência | 3 guias em 05/11 e 2 por dia depois, de segunda a domingo | Decisão do usuário (2026-11-05). | y |
| Publicação | Guias entram na `main` com data futura e ficam fora do build até a data; um GitHub Actions aciona o build hook da Netlify todos os dias às 12:07 UTC (9h07 em Brasília) | Decisão do usuário (2026-11-05): não depender de lembrar. Minutos fora da hora cheia reduzem atraso da fila do GitHub. | y |
| Fuso | "Hoje" é a data em `America/Sao_Paulo` | O público e o calendário são do Brasil; o build roda em UTC. | y |
| Branch | `feat/guias-problemas-reais` a partir de `main`, em worktree separada | O checkout principal estava em uso por outro trabalho. | y |
| Demanda | Sem volume medido; ordem qualitativa, com checagem dos resultados de busca antes de cada guia e revisão pelo Search Console depois | Nenhuma ferramenta de volume conectada; a busca disponível ao agente é limitada aos EUA e não reproduz a SERP brasileira. | n |
| Experiência | Sem experiência no nicho declarada; ângulo de organização das informações (GN-15 e GN-16). Em temas técnicos, vivência só entra se confirmada pelo usuário | Decisão anterior do usuário: não inventar clientes, números ou anos de experiência. | y |
| Preço | Nenhum preço de sistema ou site; tarifas de terceiros só com fonte oficial e data | Mantém GN-14 e evita valores desatualizados. | y |
| Revisão | O usuário revisa blocos de guias antes do merge, sem hora marcada | Decisão do usuário: mantém a revisão e tira a dependência do dia. | y |
| Serviços | Mapeamento da coluna "Serviço"; `manutencao-de-sistemas` recebe os guias sobre erros em integrações já em produção | Esse serviço não tem guia hoje, e quem tem integração parada busca manutenção. | y |

**Open questions:** none - all resolved or logged above (required before the spec is confirmed).

---

## User Stories

### P1: Publicação automática por data ⭐ MVP

**User Story**: Como responsável pelo site, quero que cada guia revisado apareça sozinho na sua data, para não precisar lembrar de publicar.

**Why P1**: É o motivo do agendamento; sem o filtro, um guia com data futura iria ao ar no primeiro build.

**Acceptance Criteria**:

1. WHILE a guide's `publishedAt` is later than today in `America/Sao_Paulo`, the production build SHALL omit it from guide pages, `/guias/`, related guides, service pages and `llms.txt`. <!-- SCHED-01 -->
2. WHEN today in `America/Sao_Paulo` reaches a guide's `publishedAt` THEN the production build SHALL include it. <!-- SCHED-02 -->
3. WHILE a guide's `publishedAt` is in the future, the sitemap SHALL NOT use its date as `<lastmod>` of `/guias/`. <!-- SCHED-03 -->
4. IF a guide with a future `publishedAt` has a pending marker THEN the build SHALL fail naming the file. <!-- SCHED-04 -->
5. WHILE running `astro dev`, the site SHALL show guides with a future `publishedAt`, so they can be reviewed. <!-- SCHED-05 -->
6. The workflow `.github/workflows/publicar-guias.yml` SHALL run every day at 12:07 UTC and on manual dispatch. <!-- SCHED-06 -->
7. The workflow SHALL send a POST to the URL in the secret `NETLIFY_BUILD_HOOK`, and the repository SHALL NOT contain that URL. <!-- SCHED-07 -->
8. IF the secret is missing or the request fails THEN the workflow job SHALL fail. <!-- SCHED-08 -->
9. IF a guide body links to a guide with a later `publishedAt` THEN the content test SHALL fail naming both slugs. <!-- SCHED-09 -->

**Independent Test**: Testes unitários com datas na virada do dia em Brasília; disparo manual do workflow depois que o secret existir.

---

### P1: Testes valem para os novos guias ⭐ MVP

**User Story**: Como responsável pelo site, quero que cada guia novo passe pelas regras de conteúdo existentes, para não depender de revisão manual nos itens automatizáveis.

**Why P1**: Hoje o teste reprova qualquer guia fora do mapa, então nada pode ser publicado sem esta mudança.

**Acceptance Criteria**:

1. The content test SHALL include each of the 27 slugs in the calendar with its `servico`, `title`, `h1` and cluster link. <!-- PRB-01 -->
2. IF a date has more than 3 guides of this feature with that `publishedAt` THEN the content test SHALL fail naming the date. <!-- PRB-02 -->
3. WHILE a calendar guide has no file, the content test SHALL pass without it, until the last task of this feature makes every non-removed calendar guide required. <!-- PRB-03 -->

**Independent Test**: Uma fixture com 4 guias na mesma data faz o teste falhar; removida, o teste volta a passar com os 15 guias atuais.

---

### P1: Lote de hoje ⭐ MVP

**User Story**: Como dono de empresa que pesquisa um problema específico, quero uma resposta concreta para ele, para entender o que conferir e quando pedir ajuda.

**Why P1**: É o primeiro lote pedido pelo usuário e inclui os temas mais urgentes e o mais ligado à contratação.

**Acceptance Criteria**:

1. The site SHALL include `erp-preenche-ibs-cbs-nfe`, `pix-sem-txid-erp-nao-da-baixa` and `locacao-equipamentos-devolucao-parcial` after the first batch. <!-- PRB-04 -->

**Independent Test**: `npm test` com os 3 arquivos presentes; leitura de cada um contra as regras de conteúdo.

---

### P2: Lotes seguintes

**User Story**: Como responsável pelo site, quero que os demais guias saiam um pouco a cada dia, para não publicar tudo de uma vez.

**Why P2**: Completam a cobertura depois do primeiro lote.

**Acceptance Criteria**:

1. Each guide SHALL have `publishedAt` equal to its calendar date, or to the next date with fewer than 3 guides if it is reviewed after that date. <!-- PRB-05 -->
2. The batches SHALL follow the calendar order, with at most 3 guides per day. <!-- PRB-06 -->

**Independent Test**: Conferir `publishedAt` de cada guia contra o calendário.

---

### Regras de conteúdo de todo guia desta feature

**Acceptance Criteria**:

1. Each guide SHALL meet GN-03 to GN-08 of `guias-nichos`: at least 1.200 words, 4 FAQ items, 4 `##` headings, a mention of Canoas or Porto Alegre, links to its service and to another guide, and a `resumo` that answers the `h1` in its first sentence. <!-- PRB-07 -->
2. Each guide SHALL follow its angle and include the cluster link from the calendar, so no two guides target the same primary query. <!-- PRB-08 -->
3. The guides SHALL NOT state clients, number of projects, years of experience, results or niche experience that the user has not confirmed. <!-- PRB-09 -->
4. WHERE a guide states a law, standard, tax rule, tariff or third-party API behavior THEN it SHALL name the official source checked on the writing date. <!-- PRB-10 -->
5. Each guide SHALL include GN-15's section on how the operation is controlled today, with at least 3 concrete losses specific to the problem, and GN-16's section on when a ready-made system is enough and when custom work is worth it. <!-- PRB-11 -->
6. WHERE a guide discusses the cost of a site or system THEN it SHALL link to a "quanto custa" guide and SHALL NOT state price values. <!-- PRB-12 -->

---

## Edge Cases

- IF a fact required by PRB-10 cannot be confirmed in an official source THEN the guide SHALL omit that fact. <!-- EDGE-01 -->
- IF a conditional guide (`pedidos-amazon-nao-entram-tiny`, `rastreador-posicao-atrasada`, `frota-rastreadores-marcas-diferentes`) lacks its source or confirmation by its date THEN it SHALL leave the calendar and the content-test map without being published. <!-- EDGE-02 -->
- IF a calendar guide is removed THEN every guide that uses it as a cluster link SHALL link to a published guide of the same subject instead. <!-- EDGE-03 -->
- IF a topic cannot reach 1.200 useful words THEN it SHALL be merged into the closest calendar guide instead of padded. <!-- EDGE-04 -->
- IF a guide is not reviewed by its date THEN it SHALL move to the next date with fewer than 3 guides, and the other guides SHALL keep their dates. <!-- EDGE-05 -->

Implicit-requirement dimensions sweep:

| Dimension | Resolution |
| --------- | ---------- |
| Input validation & bounds | PRB-01, PRB-02, PRB-07 e COL-04 existente |
| Failure / partial-failure states | EDGE-01, EDGE-02 e EDGE-05 |
| Idempotency / retry / duplicate handling | PRB-08 e títulos únicos (SEO-08 existente) |
| Auth boundaries & rate limits | N/A because páginas estáticas públicas |
| Concurrency / ordering | PRB-06, EDGE-03 e SCHED-09 |
| Data lifecycle / expiry | PRB-05 e PRB-10; `updatedAt` existente para mudanças de regra |
| Observability | Falha aparece como execução com erro no GitHub Actions (SCHED-08) |
| External-dependency failure | SCHED-08; o site atual segue no ar e o guia sai na execução seguinte |
| State-transition integrity | SCHED-01 e SCHED-02: o guia passa de agendado a publicado só pela data |

---

## Requirement Traceability

| Requirement ID | Story | Phase | Status |
| -------------- | ----- | ----- | ------ |
| PRB-01 | Regras do roadmap | Tasks | Implementing |
| PRB-02 | Regras do roadmap | Tasks | Implementing |
| PRB-03 | Regras do roadmap | Tasks | Implementing |
| PRB-04 | Regras do roadmap | Tasks | Pending |
| PRB-05 | Regras do roadmap | Tasks | Pending |
| PRB-06 | Regras do roadmap | Tasks | Pending |
| PRB-07 | Regras do roadmap | Tasks | Pending |
| PRB-08 | Regras do roadmap | Tasks | Pending |
| PRB-09 | Regras do roadmap | Tasks | Pending |
| PRB-10 | Regras do roadmap | Tasks | Pending |
| PRB-11 | Regras do roadmap | Tasks | Pending |
| PRB-12 | Regras do roadmap | Tasks | Pending |
| SCHED-01 | P1: Publicação automática | Tasks | Implementing |
| SCHED-02 | P1: Publicação automática | Tasks | Implementing |
| SCHED-03 | P1: Publicação automática | Tasks | Implementing |
| SCHED-04 | P1: Publicação automática | Tasks | Implementing |
| SCHED-05 | P1: Publicação automática | Tasks | Implementing |
| SCHED-06 | P1: Publicação automática | Tasks | Implementing |
| SCHED-07 | P1: Publicação automática | Tasks | Implementing |
| SCHED-08 | P1: Publicação automática | Tasks | Implementing |
| SCHED-09 | P1: Publicação automática | Tasks | Implementing |
| EDGE-01 | Edge cases | Tasks | Pending |
| EDGE-02 | Edge cases | Tasks | Pending |
| EDGE-03 | Edge cases | Tasks | Pending |
| EDGE-04 | Edge cases | Tasks | Pending |
| EDGE-05 | Edge cases | Tasks | Pending |

**Coverage:** 26 total, 26 mapped to tasks, 0 unmapped

---

## Success Criteria

- [ ] Cada guia indexado em até 30 dias após o deploy (Search Console → Páginas).
- [ ] Em 90 dias, cada guia com impressões para a pesquisa principal do seu ângulo.
- [ ] Pelo menos 1 contato pelo formulário ou WhatsApp vindo de um desses guias em 120 dias.
- [ ] Calendário restante revisto com os dados do Search Console 30 dias depois do primeiro lote, se ainda houver guias pendentes.

# Guias de Conteúdo (/guias/) — Specification

## Problem Statement

O site tem 6 páginas indexáveis (home + 5 serviços) e todas disputam termos amplos e concorridos ("criação de sites", "sistemas web"). Quem pesquisa algo específico, como "quanto custa um sistema sob medida" ou "integrar rastreador com o sistema da transportadora", não encontra o site, porque não existe nenhuma página que responda essa pergunta. Sem conteúdo nichado ligado às páginas de serviço, o Google não vê o site como autoridade em nenhum tema, e as IAs de busca (AI Overviews, ChatGPT, Perplexity) não têm um trecho factual para citar.

## Goals

- [ ] Uma seção `/guias/` em que cada artigo responde a uma única pesquisa específica e leva o leitor à página de serviço daquele tema (estrutura pilar → satélite).
- [ ] 4 guias publicados no lançamento, com ≥ 1.200 palavras cada, escritos sobre nichos que o responsável atende de fato.
- [ ] Publicar um guia novo exige só um arquivo Markdown: nenhuma edição de rota, sitemap, `llms.txt` ou links internos.
- [ ] Lighthouse mobile em produção nas páginas de guia: SEO 100, Acessibilidade 100, Boas práticas 100, Performance ≥ 95 (mesmo patamar das páginas de serviço).

## Out of Scope

| Feature | Reason |
| ------- | ------ |
| Página "Sobre" (`/sobre/`) | Decisão do usuário (2026-10-17): fica para depois. Os guias são assinados com o nome e o LinkedIn que já estão no site. |
| Páginas por cidade ("criação de sites Porto Alegre") | Mantém a decisão da spec `seo-ranqueamento`: páginas locais quase iguais viram conteúdo duplicado. A intenção local entra no texto dos guias. |
| Categorias, tags, busca interna, paginação | Com 4 a ~30 guias, uma lista por serviço na página índice basta. Reavaliar acima de 30 guias. |
| RSS / newsletter | Não influencia ranqueamento; o público chega pela busca, não por assinatura. |
| Comentários | Exigiria script de terceiros (conflita com a CSP, AD-005) e moderação. |
| Imagem Open Graph por guia | A imagem atual serve todas as páginas; não muda posição no Google (mesma decisão da spec `seo-ranqueamento`). |
| Imagens dentro dos guias | Os 4 primeiros guias são texto, listas e tabelas. Imagens entram quando houver capturas reais de projetos. |
| Texto integral dos guias no `llms-full.txt` | O `llms.txt` lista os guias com link e resumo; o arquivo completo ficaria grande demais à medida que os guias crescem. |
| Google Search Console, Perfil da Empresa, Bing Webmaster | Ações do dono da conta fora do código; continuam no checklist manual. |
| Guias além dos 4 do lançamento | Estão no plano de conteúdo abaixo e serão escritos um por vez, depois do lançamento. |

---

## Assumptions & Open Questions

| Assumption / decision | Chosen default | Rationale | Confirmed? |
| --------------------- | -------------- | --------- | ---------- |
| Endereço da seção | `/guias/` e `/guias/<slug>/` | Decisão do usuário (2026-10-17). Combina com conteúdo prático e perene. | y |
| Escopo da entrega | Estrutura + 4 guias escritos pelo agente, revisados pelo usuário antes do deploy | Decisão do usuário (2026-10-17). | y |
| Nichos dos guias | Logística e transportadoras (telemetria) e distribuidoras/atacado com ERP (Bling, Tiny, Omie) como nichos principais | O usuário trabalha com ERPs, WhatsApp/CRM, pagamentos e NF-e, telemetria veicular, automação e scraping, e pediu sugestão (2026-10-17). Canoas fica no eixo da BR-116, com muitas transportadoras e distribuidoras; quase não existe conteúdo em português sobre integração de telemetria com sistemas de gestão. | y |
| Os 4 guias do lançamento | (1) `quanto-custa-um-site` → Criação de sites; (2) `quanto-custa-um-sistema-sob-medida` → Software sob medida; (3) `integracao-bling-api` → Integrações; (4) `integracao-rastreamento-veicular` → Integrações | Dois "quanto custa" (alta intenção de compra) e dois de integração (nicho, pouca concorrência, experiência comprovada do usuário). | n |
| Valores nos guias "quanto custa" | O agente escreve o texto com marcadores `[PREÇO: ...]` onde entram as faixas de preço, e o guia fica como rascunho até o usuário preencher | Preço inventado fere a confiança e as diretrizes do Google; só o usuário conhece os valores que pratica. O guia sem faixa de preço não responde à pergunta da busca. | n |
| Rascunho | Campo `draft: true` no guia: aparece no `astro dev`, mas não é gerado no build de produção nem entra em índice, sitemap, `llms.txt` ou links | Permite mesclar a estrutura sem publicar texto que ainda falta revisar. | n |
| Marcador pendente | Guia com `draft: false` que contém `[PREÇO:`, `[REVISAR:` ou `[...]` faz o build falhar | Mesmo mecanismo da validação de dados do site (PAGE-09): nada publica com lacuna. | n |
| Formato dos guias | Markdown numa coleção de conteúdo do Astro, com o frontmatter validado por zod | O Astro e o zod já estão no projeto; Markdown é o formato mais simples para o usuário escrever guias futuros. | n |
| Autor | Todos os guias são assinados por "Leonardo Gomes Assunção", com link para o LinkedIn e o nó `Person` (`/#leonardo`) do JSON-LD | Sem a página Sobre, o LinkedIn é a prova de autoria disponível (E-E-A-T). | n |
| Datas | `publishedAt` obrigatório e `updatedAt` opcional, ambos visíveis na página e usados no JSON-LD e no `<lastmod>` do sitemap | Data real de atualização é o sinal de frescor que o Google e as IAs usam; aqui ela reflete mudança real do texto, ao contrário da data do build. | n |
| Tipo no JSON-LD | `Article` | Tipo genérico aceito pelo Google para conteúdo editorial; `BlogPosting` sugeriria post datado. | n |
| Limites de título e descrição | `title` entre 30 e 60 caracteres; `description` entre 70 e 160 caracteres | Faixa que o Google mostra sem cortar; 60 é o limite que `tests/build/titles.test.ts` (SEO-08) já impõe a todas as páginas. | n |
| Link "Guias" no menu | Entra no menu do cabeçalho, entre "Processo" e "Fale comigo", e no rodapé | A seção precisa estar a 1 clique de qualquer página para receber autoridade interna. | n |
| Ordem dos guias | Do mais recente para o mais antigo, por `updatedAt ?? publishedAt` | Leitor e Google veem primeiro o conteúdo mais novo. | n |
| Resposta direta no topo | Todo guia abre com um parágrafo de resumo (campo `resumo`, 1 a 3 frases) que responde à pergunta do título | É o trecho que AI Overviews e ChatGPT costumam citar; também serve de `description` estendida no `llms.txt`. | n |
| Conteúdo factual | Os guias não citam clientes, números de projetos, anos de experiência ou resultados que o usuário não confirmou (mesma regra SVC-10) | Conteúdo inventado prejudica confiança e E-E-A-T. | n |

**Open questions:** none - all resolved or logged above (required before the spec is confirmed).

---

## User Stories

### P1: Coleção de guias validada ⭐ MVP

**User Story**: Como responsável pelo site, quero escrever um guia num arquivo Markdown e ter o build recusando erros, para publicar sem mexer em código e sem risco de publicar algo incompleto.

**Why P1**: Toda a seção depende desse modelo de dados; sem ele não há páginas.

**Acceptance Criteria**:

1. The build SHALL read guides from Markdown files in `src/content/guias/`, one file per guide, with the file name (without extension) as the slug. <!-- COL-01 -->
2. The guide frontmatter SHALL require `title`, `description`, `h1`, `resumo`, `servico` and `publishedAt`, and SHALL accept optional `updatedAt`, `faq` (list of `{ q, a }`) and `draft` (boolean, default `false`). <!-- COL-02 -->
3. IF a guide `servico` is not the slug of one of the 5 services in `src/data/services.ts` THEN the build SHALL fail naming the guide file. <!-- COL-03 -->
4. IF a guide `title` length is outside 30–60 characters or its `description` length is outside 70–160 characters THEN the build SHALL fail naming the guide file and the field. <!-- COL-04 -->
5. IF a guide slug does not match `^[a-z0-9]+(-[a-z0-9]+)*$` THEN the build SHALL fail naming the guide file. <!-- COL-05 -->
6. IF a guide has `updatedAt` earlier than `publishedAt` THEN the build SHALL fail naming the guide file. <!-- COL-06 -->
7. IF a guide with `draft: false` contains `[PREÇO:`, `[REVISAR:` or `[...]` in its frontmatter or body THEN the build SHALL fail naming the guide file. <!-- COL-07 -->
8. WHILE a guide has `draft: true` the production build SHALL NOT generate its page nor include it in `/guias/`, service pages, related lists, sitemap or `llms.txt`. <!-- COL-08 -->
9. WHILE running `astro dev` the site SHALL render draft guides at `/guias/<slug>/`. <!-- COL-09 -->

**Independent Test**: Testes unitários do schema e do filtro de rascunho com fixtures válidas e inválidas; `npm run test:build` confirma que um rascunho não aparece em `dist/`.

---

### P1: Página do guia ⭐ MVP

**User Story**: Como quem pesquisa "quanto custa um sistema sob medida", quero cair numa página que responde logo no começo e me mostra como contratar, para decidir sem procurar mais.

**Why P1**: É a página que ranqueia e converte.

**Acceptance Criteria**:

1. The build SHALL generate one static page at `/guias/<slug>/` for each non-draft guide. <!-- PAGE-01 -->
2. The guide page SHALL use the guide `title` as `<title>`, its `description` as meta description, and its `h1` as the only `<h1>`. <!-- PAGE-02 -->
3. The guide page SHALL show, before the body, the `resumo` paragraph, the author name "Leonardo Gomes Assunção" linking to `site.linkedin`, and the date "Publicado em <dd de mês de aaaa>" in pt-BR inside a `<time datetime>` element. <!-- PAGE-03 -->
4. WHERE a guide has `updatedAt` the guide page SHALL also show "Atualizado em <dd de mês de aaaa>" inside a `<time datetime>` element. <!-- PAGE-04 -->
5. The guide page SHALL show a breadcrumb "Início › Guias › <h1>" linking to `/` and `/guias/`. <!-- PAGE-05 -->
6. The guide page SHALL end with a call-to-action block naming the related service, linking to `/<servico>/`, to `#contato` and to `https://wa.me/<site.whatsapp>`. <!-- PAGE-06 -->
7. WHERE a guide has `faq` the guide page SHALL render each item as a `<details>` element under the heading "Perguntas frequentes". <!-- PAGE-07 -->
8. WHERE other non-draft guides share the same `servico` the guide page SHALL list up to 3 of them, most recent first, under the heading "Leia também". <!-- PAGE-08 -->
9. The guide page SHALL include the contact form section (`#contato`) used by the service pages. <!-- PAGE-09 -->
10. The guide page SHALL NOT contain inline executable scripts (AD-005). <!-- PAGE-10 -->

**Independent Test**: Renderizar a página de um guia fixture e conferir título, metatags, `<h1>`, data, autor, trilha, CTA, FAQ e "Leia também".

---

### P1: Página índice /guias/ ⭐ MVP

**User Story**: Como visitante (e como o Google), quero uma página que reúne todos os guias por tema, para achar o assunto e entender a profundidade do site.

**Why P1**: É o elo entre o menu e os guias; sem ela os guias ficam a 2+ cliques e sem contexto temático.

**Acceptance Criteria**:

1. The build SHALL generate `/guias/` with `<title>` "Guias de Sites, Sistemas e Integrações | Leonardo Assunção" and a meta description of 70–160 characters. <!-- HUB-01 -->
2. The `/guias/` page SHALL group non-draft guides under one `<h2>` per service that has at least one guide, in the order of `src/data/services.ts`. <!-- HUB-02 -->
3. The `/guias/` page SHALL list each guide with a link to `/guias/<slug>/`, its `h1` as link text, its `description` and its most recent date (`updatedAt ?? publishedAt`). <!-- HUB-03 -->
4. Within each service group the `/guias/` page SHALL order guides by `updatedAt ?? publishedAt`, most recent first. <!-- HUB-04 -->
5. Each service group on `/guias/` SHALL link to its service page `/<servico>/`. <!-- HUB-05 -->
6. The `/guias/` page SHALL show a breadcrumb "Início › Guias". <!-- HUB-06 -->

**Independent Test**: Renderizar `/guias/` com fixtures de 2 serviços e conferir grupos, ordem e links.

---

### P1: Links internos entre serviços e guias ⭐ MVP

**User Story**: Como o Google, quero ver os guias ligados às páginas de serviço e o serviço ligado aos guias, para entender que o site cobre cada tema em profundidade.

**Why P1**: A estrutura pilar → satélite só funciona com links nos dois sentidos; é o que transfere relevância.

**Acceptance Criteria**:

1. WHERE a service has at least one non-draft guide the service page SHALL show a section "Guias sobre <name>" listing those guides, most recent first, each linking to `/guias/<slug>/`. <!-- LINK-01 -->
2. WHERE a service has no non-draft guide the service page SHALL NOT render the "Guias sobre" section. <!-- LINK-02 -->
3. The header navigation SHALL include a link "Guias" to `/guias/`, placed after "Processo". <!-- LINK-03 -->
4. The footer SHALL include a link "Guias" to `/guias/`. <!-- LINK-04 -->
5. Each launch guide body SHALL contain at least one link to its service page `/<servico>/` and at least one link to another page of the site other than its service page. <!-- LINK-05 -->

**Independent Test**: Renderizar uma página de serviço com e sem guias; renderizar Header e Footer; ler os 4 guias e contar os links.

---

### P1: Dados estruturados e sitemap ⭐ MVP

**User Story**: Como o Google e as IAs de busca, quero metadados que digam o que é cada guia, quem escreveu, quando e sobre qual serviço, para indexar, citar e mostrar a data correta.

**Why P1**: Sem eles o guia é só texto; com eles entra no grafo da empresa que já existe.

**Acceptance Criteria**:

1. The guide page JSON-LD SHALL include an `Article` node with `headline` = `h1`, `description`, `datePublished` = `publishedAt`, `dateModified` = `updatedAt ?? publishedAt`, `author` = `{"@id": "<site.url>/#leonardo"}`, `publisher` = `{"@id": "<site.url>/#empresa"}`, `mainEntityOfPage` = the guide URL, `inLanguage` = `pt-BR` and `about` = `{"@type": "Service", "name": <service name>, "url": <service URL>}`. <!-- LD-01 -->
2. The guide page JSON-LD SHALL include a `BreadcrumbList` with Início, Guias and the guide `h1`. <!-- LD-02 -->
3. WHERE a guide has `faq` the guide page JSON-LD SHALL include a `FAQPage` node with the same questions and answers shown on the page. <!-- LD-03 -->
4. The `/guias/` page JSON-LD SHALL include a `CollectionPage` node whose `hasPart` lists each non-draft guide URL, and a `BreadcrumbList` with Início and Guias. <!-- LD-04 -->
5. The sitemap SHALL list `/guias/` and every non-draft guide URL. <!-- SMAP-01 -->
6. The sitemap `<lastmod>` of a guide SHALL be its `updatedAt ?? publishedAt`. <!-- SMAP-02 -->
7. The sitemap `<lastmod>` of `/guias/` SHALL be the most recent `updatedAt ?? publishedAt` among non-draft guides. <!-- SMAP-03 -->

**Independent Test**: Testes das funções de JSON-LD com um guia fixture; `npm run test:build` lê o sitemap gerado.

---

### P1: Guias visíveis para IAs (llms.txt) ⭐ MVP

**User Story**: Como um modelo de IA que lê `llms.txt`, quero a lista de guias com resumo, para encontrar e citar a resposta certa.

**Why P1**: O site já publica `llms.txt` (nota A no GEO Checker); os guias são o conteúdo mais citável e precisam estar nele.

**Acceptance Criteria**:

1. The `/llms.txt` SHALL contain a section `## Guias` listing each non-draft guide as `- [<h1>](<absolute URL>): <resumo>`, most recent first. <!-- LLMS-01 -->
2. WHERE no non-draft guide exists the `/llms.txt` SHALL NOT contain the `## Guias` section. <!-- LLMS-02 -->
3. The `/llms.txt` "Páginas" section SHALL list `/guias/`. <!-- LLMS-03 -->

**Independent Test**: Teste unitário de `llmsText` com e sem guias.

---

### P1: Os 4 guias do lançamento ⭐ MVP

**User Story**: Como dono de transportadora, distribuidora ou pequena empresa em Canoas e região, quero respostas concretas sobre custo e integração, para saber se vale contratar e com quem.

**Why P1**: A estrutura sem conteúdo não ranqueia nada.

**Acceptance Criteria**:

1. The site SHALL include the guides `quanto-custa-um-site` (servico `criacao-de-sites`), `quanto-custa-um-sistema-sob-medida` (servico `software-sob-medida`), `integracao-bling-api` (servico `integracoes`) and `integracao-rastreamento-veicular` (servico `integracoes`). <!-- CONT-01 -->
2. Each launch guide body SHALL have at least 1.200 words, excluding frontmatter and FAQ. <!-- CONT-02 -->
3. Each launch guide SHALL have at least 3 FAQ items. <!-- CONT-03 -->
4. Each launch guide body SHALL use at least 3 `<h2>` headings phrased as the reader's questions or tasks. <!-- CONT-04 -->
5. Each launch guide SHALL mention Canoas or Porto Alegre at least once in the body, in a sentence about service area or local context. <!-- CONT-05 -->
6. The launch guides SHALL NOT state clients, number of projects, years of experience or results not confirmed by the user. <!-- CONT-06 -->
7. WHILE a "quanto custa" guide contains `[PREÇO:` markers it SHALL have `draft: true`. <!-- CONT-07 -->

**Independent Test**: Teste de build lê os 4 arquivos e confere slug, serviço, contagem de palavras, FAQ, `<h2>` e menção local; revisão do usuário cobre CONT-06.

---

## Edge Cases

- IF no non-draft guide exists THEN the `/guias/` page SHALL render with the text "Os primeiros guias estão a caminho." and no service group. <!-- EDGE-01 -->
- IF a guide is the only non-draft guide of its service THEN the guide page SHALL NOT render the "Leia também" section. <!-- EDGE-02 -->
- WHEN a guide has more than 3 related guides THEN the guide page SHALL list only the 3 most recent. <!-- EDGE-03 -->
- IF a guide `faq` list is empty THEN the guide page SHALL render neither the "Perguntas frequentes" section nor the `FAQPage` node. <!-- EDGE-04 -->

Implicit-requirement dimensions sweep:

| Dimension | Resolution |
| --------- | ---------- |
| Input validation & bounds | COL-02 a COL-07 |
| Failure / partial-failure states | Build falha com o nome do arquivo (COL-03 a COL-07); não há execução em tempo real |
| Idempotency / retry / duplicate handling | N/A because slug = nome do arquivo, e o sistema de arquivos impede duplicata |
| Auth boundaries & rate limits | N/A because páginas estáticas públicas, sem entrada do usuário (o formulário reaproveitado já tem as próprias regras) |
| Concurrency / ordering | Ordem definida em HUB-04, PAGE-08 e LLMS-01 |
| Data lifecycle / expiry | Rascunho (COL-08) e `updatedAt` (PAGE-04, SMAP-02); remover o arquivo remove a página |
| Observability | N/A because site estático; o Search Console (fora do escopo) mede o desempenho |
| External-dependency failure | N/A because nenhuma dependência externa nova; tudo é gerado no build |
| State-transition integrity | Rascunho → publicado só com marcadores resolvidos (COL-07, CONT-07) |

---

## Requirement Traceability

| Requirement ID | Story | Phase | Status |
| -------------- | ----- | ----- | ------ |
| COL-01 | P1: Coleção de guias validada | Design | Implementing |
| COL-02 | P1: Coleção de guias validada | Design | Implementing |
| COL-03 | P1: Coleção de guias validada | Design | Implementing |
| COL-04 | P1: Coleção de guias validada | Design | Implementing |
| COL-05 | P1: Coleção de guias validada | Design | Implementing |
| COL-06 | P1: Coleção de guias validada | Design | Implementing |
| COL-07 | P1: Coleção de guias validada | Design | Implementing |
| COL-08 | P1: Coleção de guias validada | Design | Implementing |
| COL-09 | P1: Coleção de guias validada | Design | Implementing |
| PAGE-01 | P1: Página do guia | Design | Implementing |
| PAGE-02 | P1: Página do guia | Design | Implementing |
| PAGE-03 | P1: Página do guia | Design | Implementing |
| PAGE-04 | P1: Página do guia | Design | Implementing |
| PAGE-05 | P1: Página do guia | Design | Implementing |
| PAGE-06 | P1: Página do guia | Design | Implementing |
| PAGE-07 | P1: Página do guia | Design | Implementing |
| PAGE-08 | P1: Página do guia | Design | Implementing |
| PAGE-09 | P1: Página do guia | Design | Implementing |
| PAGE-10 | P1: Página do guia | Design | Implementing |
| HUB-01 | P1: Página índice /guias/ | Design | Implementing |
| HUB-02 | P1: Página índice /guias/ | Design | Implementing |
| HUB-03 | P1: Página índice /guias/ | Design | Implementing |
| HUB-04 | P1: Página índice /guias/ | Design | Implementing |
| HUB-05 | P1: Página índice /guias/ | Design | Implementing |
| HUB-06 | P1: Página índice /guias/ | Design | Implementing |
| LINK-01 | P1: Links internos | Design | Implementing |
| LINK-02 | P1: Links internos | Design | Implementing |
| LINK-03 | P1: Links internos | Design | Implementing |
| LINK-04 | P1: Links internos | Design | Implementing |
| LINK-05 | P1: Links internos | Design | Pending |
| LD-01 | P1: Dados estruturados e sitemap | Design | Implementing |
| LD-02 | P1: Dados estruturados e sitemap | Design | Implementing |
| LD-03 | P1: Dados estruturados e sitemap | Design | Implementing |
| LD-04 | P1: Dados estruturados e sitemap | Design | Implementing |
| SMAP-01 | P1: Dados estruturados e sitemap | Design | Pending |
| SMAP-02 | P1: Dados estruturados e sitemap | Design | Implementing |
| SMAP-03 | P1: Dados estruturados e sitemap | Design | Implementing |
| LLMS-01 | P1: Guias visíveis para IAs | Design | Implementing |
| LLMS-02 | P1: Guias visíveis para IAs | Design | Implementing |
| LLMS-03 | P1: Guias visíveis para IAs | Design | Implementing |
| CONT-01 | P1: Os 4 guias do lançamento | Design | Pending |
| CONT-02 | P1: Os 4 guias do lançamento | Design | Pending |
| CONT-03 | P1: Os 4 guias do lançamento | Design | Pending |
| CONT-04 | P1: Os 4 guias do lançamento | Design | Pending |
| CONT-05 | P1: Os 4 guias do lançamento | Design | Pending |
| CONT-06 | P1: Os 4 guias do lançamento | Design | Pending |
| CONT-07 | P1: Os 4 guias do lançamento | Design | Pending |
| EDGE-01 | Edge cases | Design | Implementing |
| EDGE-02 | Edge cases | Design | Implementing |
| EDGE-03 | Edge cases | Design | Implementing |
| EDGE-04 | Edge cases | Design | Implementing |

**Coverage:** 51 total, 0 mapped to tasks, 51 unmapped ⚠️ (mapeamento na fase Tasks)

---

## Success Criteria

- [ ] Os 4 guias publicados (sem `draft`) e indexados no Google em até 30 dias após o deploy (Search Console → Páginas).
- [ ] Lighthouse mobile em produção numa página de guia: SEO 100, Acessibilidade 100, Boas práticas 100, Performance ≥ 95.
- [ ] Rich Results Test sem erros para `Article`, `BreadcrumbList` e `FAQPage` numa página de guia.
- [ ] Em 90 dias, cada guia com impressões no Search Console para a pesquisa principal do título.

---

## Plano de conteúdo (depois do lançamento)

Fora do escopo desta entrega; registrado para orientar os próximos guias, um por vez, sempre ligado a um serviço. A ordem segue intenção de compra × concorrência baixa × experiência do responsável.

| # | Guia sugerido (pesquisa-alvo) | Serviço | Nicho |
| - | ----------------------------- | ------- | ----- |
| 1 | Sistema para transportadora: o que precisa ter (frota, CT-e, rastreamento) | Sistemas web | Logística |
| 2 | Emissão automática de NF-e a partir do seu sistema ou loja | Integrações | Distribuidoras / e-commerce |
| 3 | Integrar o WhatsApp Business (API oficial) com o CRM ou sistema interno | Integrações | Atendimento / vendas |
| 4 | Baixa automática de Pix: como conciliar pagamentos sem planilha | Integrações | Qualquer PME |
| 5 | Integração com Omie e Tiny: o que dá para automatizar | Integrações | Distribuidoras / atacado |
| 6 | Planilha ou sistema: sinais de que a empresa passou da planilha | Sistemas web | Qualquer PME |
| 7 | Monitoramento de preços de concorrentes com automação (scraping dentro da lei) | Software sob medida | E-commerce / varejo |
| 8 | Telemetria de frota: como usar os dados do rastreador para reduzir custo | Sistemas web | Logística |
| 9 | Site lento: o que fazer, passo a passo | Manutenção de sistemas | Qualquer PME |
| 10 | Sistema legado: quando vale migrar e quando vale manter | Manutenção de sistemas | Indústria / serviços |

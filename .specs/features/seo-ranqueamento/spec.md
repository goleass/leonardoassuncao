# SEO e Ranqueamento no Google — Specification

## Problem Statement

O site está no ar e tira 100 em SEO no Lighthouse, mas essa nota só confere o básico. A auditoria de 2026-10-04 achou problemas que atrapalham o Google de verdade: todas as URLs canônicas, o sitemap, o robots.txt e o JSON-LD apontam para `leonardoassuncao.com.br`, que responde 301 para `www.leonardoassuncao.com.br` (sinal canônico contraditório); não existe favicon (404, sem ícone no resultado de busca); a página 404 se declara canônica; o `<h1>` entrega ao Google o texto "Construo sitessistemasintegraçõessoftwaresites software sob medida."; e uma única página de ~700 palavras tenta ranquear para cinco serviços ao mesmo tempo, sem nenhuma página dedicada nem intenção local no título.

## Goals

- [ ] Zero sinais canônicos contraditórios: canônica, og:url, sitemap, robots.txt e JSON-LD usam o mesmo host que responde 200 (`https://www.leonardoassuncao.com.br`).
- [ ] Uma página indexável por serviço (5), cada uma com título, descrição e `<h1>` próprios e ≥ 600 palavras de conteúdo.
- [ ] Lighthouse mobile em produção: SEO 100, Boas práticas 100, Performance ≥ 95, Acessibilidade 100.
- [ ] Dados estruturados válidos (schema.org) descrevendo empresa, site, responsável, serviços, FAQ e trilha de navegação.

## Out of Scope

| Feature | Reason |
| ------- | ------ |
| Google Search Console, Bing Webmaster e Perfil da Empresa no Google | Ações do dono da conta fora do código (verificação por DNS, envio do sitemap, cadastro da empresa). Entram no checklist manual do handoff. |
| Mudar o domínio principal no painel da Netlify | O código passa a seguir o host que já está no ar (www); não exige mexer no painel. |
| Blog / artigos | Estratégia de conteúdo contínuo; decidir depois de medir as páginas de serviço. |
| Seção "Sobre" com foto, experiência e trajetória | Precisa de informações reais do responsável; inventar prejudica E-E-A-T e confiança. Recomendado como próximo passo. |
| Páginas por cidade (ex.: "criação de sites Porto Alegre") | Páginas locais quase iguais viram conteúdo duplicado; a intenção local fica no título da home e no texto das páginas de serviço. |
| Reduzir o JS do formulário (zod no navegador, ~23 KB gzip) | TBT medido = 0 ms; não afeta ranqueamento hoje. |
| Pré-carregar a fonte, cabeçalhos de segurança, manifest de PWA | LCP medido = 0,9 s; não são fatores de ranqueamento. |
| `lastmod` no sitemap | O valor seria a data do build em toda publicação; o Google ignora `lastmod` que não reflete mudança real. |
| Imagens Open Graph por página | A imagem atual serve todas as páginas; não muda posição no Google. |

---

## Assumptions & Open Questions

| Assumption / decision | Chosen default | Rationale | Confirmed? |
| --------------------- | -------------- | --------- | ---------- |
| Host canônico | `https://www.leonardoassuncao.com.br` | É o host que a Netlify serve com 200 hoje; o domínio sem www já redireciona para ele. Trocar no código não exige ação no painel. | n |
| Subdomínio `leonardoassuncao.netlify.app` | Redireciona 301 para o host canônico, preservando o caminho | Hoje responde 200 com o site inteiro: é uma cópia indexável. | n |
| Páginas de serviço | 5 páginas: `/criacao-de-sites/`, `/sistemas-web/`, `/integracoes/`, `/software-sob-medida/`, `/manutencao-de-sistemas/` | Decisão do usuário (2026-10-04): uma página por serviço do site. Slugs são as palavras-chave em português. | y |
| Texto das páginas de serviço | Escrito pelo agente, sem inventar clientes, números, anos de experiência ou tecnologias não confirmadas; o usuário revisa antes do deploy | Conteúdo falso prejudica confiança e pode ferir as diretrizes do Google. | n |
| Título da home | "Criação de Sites e Sistemas Web em Canoas/RS \| Leonardo Assunção" | Decisão do usuário (2026-10-04): serviço + cidade, palavra-chave no começo. | y |
| Área de atendimento citada | Canoas, Porto Alegre e região metropolitana; o Brasil todo de forma remota | O site já diz "Canoas, RS — Atendimento em todo o Brasil"; Porto Alegre é a busca vizinha de maior volume. | n |
| FAQ em dados estruturados | Publica `FAQPage` mesmo sem garantia de resultado enriquecido | Desde 2023 o Google só mostra FAQ enriquecido para sites de governo e saúde, mas o markup ajuda a entender a página e custa pouco porque o conteúdo já existe. | n |
| Favicon | Quadrado azul de destaque (#5B95FF) sobre fundo marinho (#0A1A33), a mesma marca do cabeçalho; SVG + ICO 48×48 + PNG 180×180 (Apple) + PNG 512×512 (logo do JSON-LD) | O Google exige favicon quadrado com lado múltiplo de 48 px; reaproveita a identidade existente. | n |
| Palavras alternadas do `<h1>` | Passam a ser desenhadas por CSS (`content: attr(...)`), fora do texto do HTML | O efeito visual continua igual; o texto indexado do `<h1>` fica limpo. | n |
| Barra final nas URLs | Toda URL de página termina em "/" (formato atual do build) e os links internos usam essa forma | A Netlify redireciona `/privacidade` → `/privacidade/`; link interno não deve passar por redirect. | n |
| CSS embutido no HTML | `build.inlineStylesheets: "always"` | O Lighthouse aponta 2 folhas de estilo bloqueando a renderização (~5,6 KB gzip somadas). | n |

**Open questions:** none - all resolved or logged above (required before the spec is confirmed).

---

## User Stories

### P1: Sinal canônico único ⭐ MVP

**User Story**: Como o Google, quero que todas as referências do site apontem para o mesmo host que responde 200, para consolidar a relevância numa só URL por página.

**Why P1**: Canônica apontando para uma URL que redireciona é o maior defeito técnico encontrado; ele dilui todos os outros esforços.

**Acceptance Criteria**:

1. The site configuration SHALL define `url` as `https://www.leonardoassuncao.com.br`. <!-- HOST-01 -->
2. The built pages SHALL use `https://www.leonardoassuncao.com.br` as the host of `link[rel=canonical]`, `og:url`, `og:image` and every URL inside JSON-LD. <!-- HOST-02 -->
3. The `/robots.txt` SHALL contain `Sitemap: https://www.leonardoassuncao.com.br/sitemap-index.xml`, generated from the site configuration. <!-- HOST-03 -->
4. The `/robots.txt` SHALL contain `Disallow: /api/`. <!-- HOST-04 -->
5. WHEN a request reaches `https://leonardoassuncao.netlify.app/<path>` THEN Netlify SHALL answer 301 to `https://www.leonardoassuncao.com.br/<path>`. <!-- HOST-05 -->
6. The internal links to site pages SHALL end with "/" (e.g. `/privacidade/`), except anchors and the API endpoint. <!-- HOST-06 -->

**Independent Test**: `npm run test:build` lê `dist/` e confirma host www em canônicas, sitemap e robots, e os links internos com barra final; `netlify.toml` tem a regra do netlify.app.

---

### P1: Página 404 fora do índice ⭐ MVP

**User Story**: Como o Google, quero que a página de erro não se declare canônica, para não indexar `/404/`.

**Why P1**: Hoje `404.html` publica `<link rel="canonical" href=".../404/">`.

**Acceptance Criteria**:

1. The 404 page SHALL contain `<meta name="robots" content="noindex">`. <!-- NOIDX-01 -->
2. The 404 page SHALL NOT contain `link[rel=canonical]` nor `og:url`. <!-- NOIDX-02 -->
3. The sitemap SHALL NOT list any URL containing `404`. <!-- NOIDX-03 -->

**Independent Test**: Renderizar a 404 e conferir as metatags; ler o sitemap gerado.

---

### P1: Favicon ⭐ MVP

**User Story**: Como quem pesquisa no Google, quero ver o ícone do site ao lado do resultado, para reconhecer a marca.

**Why P1**: Sem favicon o Google mostra um ícone genérico; o Lighthouse registra erro de console (404 em `/favicon.ico`) e tira Boas práticas de 100.

**Acceptance Criteria**:

1. The build SHALL publish `/favicon.ico` (contains a 48×48 image), `/favicon.svg`, `/apple-touch-icon.png` (180×180) and `/icon-512.png` (512×512). <!-- ICON-01 -->
2. Every page SHALL declare `<link rel="icon" href="/favicon.ico" sizes="48x48">`, `<link rel="icon" href="/favicon.svg" type="image/svg+xml">` and `<link rel="apple-touch-icon" href="/apple-touch-icon.png">`. <!-- ICON-02 -->
3. Every page SHALL declare `<meta name="theme-color" content="#0a1a33">`. <!-- ICON-03 -->

**Independent Test**: Listar os arquivos em `dist/` com as dimensões; renderizar o layout e conferir as tags.

---

### P1: Título, descrição e `<h1>` da home voltados à busca ⭐ MVP

**User Story**: Como quem procura "criação de sites Canoas", quero ver um resultado cujo título diga exatamente isso, para clicar nele.

**Why P1**: O título é o fator on-page mais forte e o que define o clique no resultado.

**Acceptance Criteria**:

1. The home page SHALL have the title `Criação de Sites e Sistemas Web em Canoas/RS | Leonardo Assunção`. <!-- HOME-01 -->
2. The home page SHALL have the meta description `Criação de sites, sistemas web, integrações e software sob medida em Canoas/RS. Um só responsável técnico, do diagnóstico ao suporte. Atendo todo o Brasil.` (≤ 160 caracteres). <!-- HOME-02 -->
3. The home `<h1>` `textContent`, with whitespace collapsed, SHALL be exactly `Construo software sob medida.`. <!-- HOME-03 -->
4. WHILE motion is allowed, the hero SHALL keep showing the rotating words "sites", "sistemas", "integrações", "software" in that order. <!-- HOME-04 -->

**Independent Test**: Renderizar a home e o Hero; conferir título, descrição e o `textContent` do `<h1>`.

---

### P1: Páginas de serviço ⭐ MVP

**User Story**: Como quem procura um serviço específico (ex.: "integração com ERP"), quero cair numa página que trate só disso, para entender a oferta e pedir orçamento.

**Why P1**: Decisão do usuário; é o maior ganho de ranqueamento disponível — cada página pode disputar um grupo de buscas próprio.

**Acceptance Criteria**:

1. The site SHALL publish exactly 5 service pages at `/criacao-de-sites/`, `/sistemas-web/`, `/integracoes/`, `/software-sob-medida/` and `/manutencao-de-sistemas/`. <!-- SVC-01 -->
2. Each service page SHALL have exactly one `<h1>`, a `<title>` of at most 60 characters and a meta description of 70 to 160 characters. <!-- SVC-02 -->
3. All pages of the site (home, 5 services, privacy) SHALL have pairwise distinct `<title>` values and pairwise distinct meta descriptions. <!-- SVC-03 -->
4. Each service page SHALL contain at least 600 words inside `<article>`. <!-- SVC-04 -->
5. Each service page SHALL contain at least 2 `<h2>` sections and a FAQ section with at least 3 questions as `<details>`/`<summary>`. <!-- SVC-05 -->
6. Each service page SHALL show a breadcrumb `nav[aria-label="Trilha de navegação"]` with "Início" linking to `/` followed by the service name as the current page (`aria-current="page"`). <!-- SVC-06 -->
7. Each service page SHALL link to the other 4 service pages. <!-- SVC-07 -->
8. Each service page SHALL include the contact section (`#contato`) with the same form as the home. <!-- SVC-08 -->
9. The sitemap SHALL list the 5 service pages. <!-- SVC-09 -->
10. The service page text SHALL NOT state client names, project counts, years of experience or metrics. <!-- SVC-10 -->

**Independent Test**: Build e leitura de `dist/<slug>/index.html` para cada serviço; contagem de palavras, títulos únicos e links.

---

### P1: Links internos para as páginas de serviço ⭐ MVP

**User Story**: Como o Google, quero chegar às páginas de serviço a partir da home e de todas as páginas, para descobri-las e entender a importância delas.

**Why P1**: Página sem link interno quase não ranqueia.

**Acceptance Criteria**:

1. Each of the 5 cards in the home "Serviços" section SHALL link to its service page (in the order of SVC-01). <!-- LINK-01 -->
2. The footer of every page SHALL link to the 5 service pages and to `/privacidade/`. <!-- LINK-02 -->

**Independent Test**: Renderizar Services e Footer; conferir os `href`.

---

### P2: Dados estruturados completos

**User Story**: Como o Google, quero dados estruturados que descrevam a empresa, o responsável, o site, cada serviço, a FAQ e a trilha, para montar o painel de conhecimento e entender cada página.

**Why P2**: Ajuda o entendimento e a elegibilidade a recursos, mas não é bloqueante para indexar.

**Acceptance Criteria**:

1. Every page SHALL have exactly one `script[type="application/ld+json"]` whose JSON has `@context` `https://schema.org` and a `@graph` array. <!-- LD-01 -->
2. The `@graph` of every page SHALL contain a `ProfessionalService` with `@id` `<site>/#empresa`, `name`, `url`, `logo` (`<site>/icon-512.png`), `image`, `email`, `telephone`, `taxID` (CNPJ), `address` and `founder` referencing `<site>/#leonardo`. <!-- LD-02 -->
3. The `ProfessionalService` `areaServed` SHALL list the City "Canoas", the City "Porto Alegre" and the Country "Brasil". <!-- LD-03 -->
4. The `@graph` of every page SHALL contain a `WebSite` (`@id` `<site>/#site`, `inLanguage` `pt-BR`, `publisher` → `#empresa`) and a `Person` (`@id` `<site>/#leonardo`, `name` "Leonardo Gomes Assunção"). <!-- LD-04 -->
5. The `ProfessionalService` offer catalog SHALL list the 5 services, each `Service` with the absolute `url` of its page. <!-- LD-05 -->
6. Each service page `@graph` SHALL contain a `Service` (`name`, `description`, `url`, `provider` → `#empresa`, `areaServed`), a `BreadcrumbList` with 2 items (Início, service) and a `FAQPage` whose questions match the page's visible FAQ text exactly. <!-- LD-06 -->
7. The home `@graph` SHALL contain a `FAQPage` whose questions and answers match the visible home FAQ exactly. <!-- LD-07 -->
8. IF a text inside JSON-LD contains `<` THEN the layout SHALL escape it as `<`. <!-- LD-08 -->

**Independent Test**: Renderizar home e uma página de serviço, fazer `JSON.parse` do script e conferir os nós.

---

### P2: CSS sem bloqueio de renderização

**User Story**: Como visitante no celular, quero ver a página sem esperar folhas de estilo externas.

**Why P2**: Melhora FCP/LCP; o site já é rápido, então é ganho marginal.

**Acceptance Criteria**:

1. The Astro configuration SHALL set `build.inlineStylesheets` to `"always"`. <!-- PERF-01 -->
2. The built HTML pages SHALL NOT contain `<link rel="stylesheet">`. <!-- PERF-02 -->

**Independent Test**: Ler o HTML gerado em `dist/`.

---

## Edge Cases

- IF the site configuration has a `linkedin` value THEN the `ProfessionalService` and the `Person` SHALL list it in `sameAs`. <!-- LD-09 -->
- IF a visitor opens a service page with reduced motion THEN the page SHALL show all content with no animation dependency (reuses the existing `.reveal` behavior). <!-- SVC-11 -->
- WHEN a service page is the current page THEN the footer and the "outros serviços" list SHALL still be valid links (no self-link in "outros serviços"). <!-- SVC-12 -->

---

## Implicit-requirement sweep

| Dimension | Resolution |
| --------- | ---------- |
| Input validation & bounds | Title ≤ 60 and description 70–160 chars (SVC-02); site config already validated at build (PAGE-09). |
| Failure / partial-failure states | N/A because pages are static; a broken build fails before deploy. |
| Idempotency / retry | N/A because there is no write operation. |
| Auth boundaries & rate limits | `/api/` disallowed in robots (HOST-04); endpoint limits already exist (FORM). |
| Concurrency / ordering | N/A because output is static HTML. |
| Data lifecycle / expiry | N/A because no data is stored. |
| Observability | N/A for code; Search Console is the observability tool and is in the manual checklist. |
| External-dependency failure | HOST-05 depends on Netlify honoring the redirect rule; verified after deploy with `curl`. |
| State-transition integrity | N/A because there are no states. |

---

## Requirement Traceability

| Requirement ID | Story | Phase | Status |
| -------------- | ----- | ----- | ------ |
| HOST-01 | P1: Sinal canônico único | Tasks | Implementing |
| HOST-02 | P1: Sinal canônico único | Tasks | Implementing |
| HOST-03 | P1: Sinal canônico único | Tasks | Implementing |
| HOST-04 | P1: Sinal canônico único | Tasks | Implementing |
| HOST-05 | P1: Sinal canônico único | Tasks | Implementing |
| HOST-06 | P1: Sinal canônico único | Tasks | In Tasks |
| NOIDX-01 | P1: Página 404 fora do índice | Tasks | Implementing |
| NOIDX-02 | P1: Página 404 fora do índice | Tasks | Implementing |
| NOIDX-03 | P1: Página 404 fora do índice | Tasks | In Tasks |
| ICON-01 | P1: Favicon | Tasks | Implementing |
| ICON-02 | P1: Favicon | Tasks | Implementing |
| ICON-03 | P1: Favicon | Tasks | Implementing |
| HOME-01 | P1: Título, descrição e h1 da home | Tasks | In Tasks |
| HOME-02 | P1: Título, descrição e h1 da home | Tasks | In Tasks |
| HOME-03 | P1: Título, descrição e h1 da home | Tasks | In Tasks |
| HOME-04 | P1: Título, descrição e h1 da home | Tasks | In Tasks |
| SVC-01 | P1: Páginas de serviço | Tasks | In Tasks |
| SVC-02 | P1: Páginas de serviço | Tasks | In Tasks |
| SVC-03 | P1: Páginas de serviço | Tasks | In Tasks |
| SVC-04 | P1: Páginas de serviço | Tasks | In Tasks |
| SVC-05 | P1: Páginas de serviço | Tasks | In Tasks |
| SVC-06 | P1: Páginas de serviço | Tasks | In Tasks |
| SVC-07 | P1: Páginas de serviço | Tasks | In Tasks |
| SVC-08 | P1: Páginas de serviço | Tasks | In Tasks |
| SVC-09 | P1: Páginas de serviço | Tasks | In Tasks |
| SVC-10 | P1: Páginas de serviço | Tasks | In Tasks |
| SVC-11 | Edge cases | Tasks | In Tasks |
| SVC-12 | Edge cases | Tasks | In Tasks |
| LINK-01 | P1: Links internos | Tasks | In Tasks |
| LINK-02 | P1: Links internos | Tasks | In Tasks |
| LD-01 | P2: Dados estruturados | Tasks | In Tasks |
| LD-02 | P2: Dados estruturados | Tasks | In Tasks |
| LD-03 | P2: Dados estruturados | Tasks | In Tasks |
| LD-04 | P2: Dados estruturados | Tasks | In Tasks |
| LD-05 | P2: Dados estruturados | Tasks | In Tasks |
| LD-06 | P2: Dados estruturados | Tasks | In Tasks |
| LD-07 | P2: Dados estruturados | Tasks | In Tasks |
| LD-08 | P2: Dados estruturados | Tasks | In Tasks |
| LD-09 | Edge cases | Tasks | In Tasks |
| PERF-01 | P2: CSS sem bloqueio | Tasks | Implementing |
| PERF-02 | P2: CSS sem bloqueio | Tasks | In Tasks |

**Coverage:** 41 total, 0 mapped to tasks, 41 unmapped ⚠️ (mapped in tasks.md)

---

## Success Criteria

- [ ] `curl -I` em `https://leonardoassuncao.netlify.app/` responde 301 para o host www.
- [ ] Todas as canônicas em produção respondem 200 sem redirect.
- [ ] Lighthouse mobile em produção: SEO 100, Boas práticas 100, Acessibilidade 100, Performance ≥ 95 na home e numa página de serviço.
- [ ] Rich Results Test / Schema Markup Validator sem erros na home e numa página de serviço.
- [ ] Em até 4 semanas após enviar o sitemap no Search Console: as 7 URLs aparecem como "Indexada".

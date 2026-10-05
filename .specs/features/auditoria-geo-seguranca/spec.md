# Auditoria GEO e Segurança — Specification

## Problem Statement

O GEO Checker (check.outrun.at, resultado `aa05d5d3`, 2026-10-04) deu nota **C (170/239, 71%)** ao site. As maiores perdas estão em três frentes: cabeçalhos de segurança (3/15), sinais para buscadores de IA (bots de IA 0/12, meta de IA 3/10, robots meta 3/10, llms.txt ausente) e arquivos-padrão ausentes (security.txt 0/10, manifest). O PageSpeed do mesmo relatório mediu **CLS 0,32 no mobile** (Performance 82), um problema real de experiência, não só de nota. A spec anterior (`seo-ranqueamento`) deixou cabeçalhos, manifest e `lastmod` fora do escopo por não serem fatores de ranqueamento no Google. Agora o objetivo mudou: ser citado por ChatGPT, Claude, Perplexity e Gemini (GEO) e passar confiança técnica a quem audita o site.

## Goals

- [ ] GEO Checker com nota **A** (≥ 95% dos pontos pontuados) na home de produção.
- [ ] CLS ≤ 0,1 e Performance ≥ 95 no Lighthouse mobile da home em produção.
- [ ] Toda resposta HTML do site com os 8 cabeçalhos de segurança cobrados pelo checker, sem quebrar o formulário, as animações, o menu nem os previews sociais.
- [ ] Os buscadores de IA (ChatGPT, Claude, Perplexity, Gemini) liberados de forma explícita e com um `/llms.txt` que resume o negócio e lista as páginas.

## Out of Scope

| Feature | Reason |
| ------- | ------ |
| SPF, DKIM, DMARC e MTA-STS | Registros DNS e configuração do provedor de e-mail, fora do repositório. Entram no checklist manual (Sugestões fora do código). No checker são "informational" e não contam pontos. |
| Google Analytics | Peso 0 no checker. Rastreamento pede banner de consentimento (LGPD) e afrouxa a CSP. Fica como sugestão (analytics sem cookies). |
| `<noscript>` de fallback | O conteúdo inteiro já está no HTML estático; o JS só anima e valida. O checker cobra isso de "sites pesados em JS", e o site não é. |
| "CSS linked from `<head>`" | Falso positivo: o CSS vai embutido no `<head>` de propósito (PERF-01), o que é melhor para desempenho. Não voltamos para `<link rel="stylesheet">`. |
| `Strict-Transport-Security` com `includeSubDomains`/`preload` | A Netlify já envia HSTS. Estender para subdomínios ou entrar na preload list é difícil de desfazer e depende de saber quais subdomínios existem (e-mail, MTA-STS). Fica como sugestão. |
| Seção "Sobre" com foto e trajetória | Mesma razão da spec anterior: exige informação real do responsável. Continua recomendada. |
| Avaliações / `AggregateRating` | O Google não aceita avaliações da própria empresa sobre si mesma (self-serving reviews) em `LocalBusiness`/`Organization`. |
| Páginas em outro idioma | O site é só pt-BR. O `hreflang` aqui só declara o idioma da página (I18N-01), não cria traduções. |

---

## Assumptions & Open Questions

| Assumption / decision | Chosen default | Rationale | Confirmed? |
| --------------------- | -------------- | --------- | ---------- |
| Crawlers de **treino** de IA (GPTBot, ClaudeBot, Google-Extended) | Liberados explicitamente, junto com os de busca e navegação | Decisão do usuário (2026-10-04). Hoje `User-agent: *` já libera todos, então nada muda na prática. | y |
| LinkedIn e outros perfis para `sameAs` | `site.linkedin = "https://www.linkedin.com/in/leonardo-gomes-assuncao"`; nenhum outro perfil | Decisão do usuário (2026-10-04). Sem outros perfis, um campo genérico de "perfis extras" seria especulativo (removido o antigo LD-13). | y |
| Novo título da home | "Criação de Sites e Sistemas em Canoas/RS \| Leonardo Assunção" (60 caracteres) | O atual tem 64. Tirar "Web" mantém palavra-chave, cidade e marca. Confirmado pelo usuário (2026-10-04). | y |
| Tipo do nó da empresa no JSON-LD | `"@type": ["Organization", "ProfessionalService"]` | `ProfessionalService` já é subtipo de Organization no schema.org, mas o checker não reconhece. Declarar os dois é válido e mantém o tipo local. Risco: o checker pode só ler `@type` em string; nesse caso fica como falso positivo documentado. | y (padrão aceito com a spec) |
| Onde a CSP é entregue | Cabeçalho HTTP `Content-Security-Policy` (não só `<meta>`), sem `'unsafe-inline'` em `script-src` | O checker lê cabeçalhos, e `frame-ancestors` não funciona em `<meta>`. Scripts inline viram arquivo externo ou ganham hash (decisão de Design). | y (padrão aceito com a spec) |
| `style-src` da CSP | Permite `'unsafe-inline'` | Todo o CSS vai embutido (PERF-01) e o Astro gera atributos `style`. Injeção de CSS tem impacto baixo num site sem dados de usuário na página. | y (padrão aceito com a spec) |
| COEP | `Cross-Origin-Embedder-Policy: require-corp` | O site não carrega nenhum recurso de outra origem (fontes vêm do próprio domínio via fontsource). Se o Design encontrar algum, cai para `credentialless`. | y (padrão aceito com a spec) |
| CORP e previews sociais | `Cross-Origin-Resource-Policy: same-origin` em tudo, inclusive `/og.png` | WhatsApp, LinkedIn e Facebook buscam a imagem pelo servidor, e CORP só vale para navegadores. | y (padrão aceito com a spec) |
| `Expires` do security.txt | Data do build + 364 dias | A RFC 9116 recomenda menos de 1 ano. Cada deploy renova. Risco: um ano sem deploy deixa o arquivo vencido (ver EDGE-11). | y (padrão aceito com a spec) |
| `lastmod` do sitemap | Data do último commit git que alterou a fonte da página (não a data do build) | Responde à objeção da spec anterior: `lastmod` passa a refletir mudança real. Sem histórico git disponível, o `lastmod` é omitido. | y (padrão aceito com a spec) |
| Perguntas como títulos | O texto de cada pergunta do FAQ vira `<h3>` dentro do `<summary>` | O HTML permite um título dentro de `<summary>`. O conteúdo não muda, só a marcação. Risco: o checker pode procurar só how/what/why em inglês. | y (padrão aceito com a spec) |
| Honeypot do formulário | Sai o `aria-hidden`. O campo continua fora da tela, com `tabindex="-1"`, `autocomplete="off"` e um rótulo "Deixe este campo em branco" | É o padrão acessível de honeypot: leitor de tela que chegar ao campo sabe que não deve preencher. Mantém FORM-10. | y (padrão aceito com a spec) |
| Causa do CLS 0,32 | Investigada no Design (suspeitos: troca de fonte sem métricas de fallback; `.reveal` com transform/altura) | Medido em 2026-10-04: Lighthouse 12 mobile deu CLS 0,004 em 5 execuções (local, local com fonte atrasada 3 s, produção com throttling simulado e devtools). A única mudança de layout é o `<h1>` na troca da fonte ("Web font loaded"). O 0,32 do PSI não se reproduz, e o Design trata a única causa observada. | y |

**Open questions:** none - all resolved or logged above (required before the spec is confirmed).

---

## User Stories

### P1: Cabeçalhos de segurança ⭐ MVP

**User Story**: Como quem avalia o site (cliente técnico, checker, navegador), quero que toda resposta traga os cabeçalhos de segurança padrão, para que o site resista a clickjacking, MIME sniffing e injeção de script e passe confiança.

**Why P1**: Maior perda de pontos pontuados (12) e ganho real de segurança com custo baixo.

**Acceptance Criteria**:

1. The site SHALL send `X-Content-Type-Options: nosniff` on every response. <!-- SECH-01 -->
2. The site SHALL send `X-Frame-Options: DENY` on every response. <!-- SECH-02 -->
3. The site SHALL send `Referrer-Policy: strict-origin-when-cross-origin` on every response. <!-- SECH-03 -->
4. The site SHALL send a `Permissions-Policy` that sets `camera=()`, `microphone=()`, `geolocation=()`, `payment=()` and `browsing-topics=()` on every response. <!-- SECH-04 -->
5. The site SHALL send `Cross-Origin-Opener-Policy: same-origin` on every response. <!-- SECH-05 -->
6. The site SHALL send `Cross-Origin-Embedder-Policy: require-corp` on every response. <!-- SECH-06 -->
7. The site SHALL send `Cross-Origin-Resource-Policy: same-origin` on every response. <!-- SECH-07 -->
8. The site SHALL send a `Content-Security-Policy` response header on every HTML page. <!-- CSP-01 -->
9. The `Content-Security-Policy` SHALL contain `default-src 'self'`, `frame-ancestors 'none'`, `base-uri 'self'`, `form-action 'self'` and `object-src 'none'`. <!-- CSP-02 -->
10. The `script-src` (or `default-src` when `script-src` is absent) of the `Content-Security-Policy` SHALL NOT contain `'unsafe-inline'` nor `'unsafe-eval'`. <!-- CSP-03 -->
11. WHEN any built page loads in Chromium under the published headers THEN the browser SHALL report zero CSP violations and zero COEP/CORP blocking errors in the console. <!-- CSP-04 -->
12. WHEN a visitor submits the contact form with valid data under the published headers THEN the form SHALL reach `/api/contato` and show the success state (FORM behavior unchanged). <!-- CSP-05 -->
13. WHEN a page loads under the published headers THEN the `.reveal` elements SHALL receive `is-visible` and the mobile menu SHALL open and close (scripts not blocked). <!-- CSP-06 -->

**Independent Test**: Teste de build lê a configuração de cabeçalhos (netlify.toml ou `dist/_headers`) e confere cada valor; um teste de navegador (Playwright/Chromium já instalado) serve `dist/` com esses cabeçalhos, abre a home, uma página de serviço, a 404 e a de privacidade, e não registra nenhuma violação.

---

### P1: Sinais para buscadores de IA (GEO) ⭐ MVP

**User Story**: Como o crawler do ChatGPT, Claude, Perplexity ou Gemini, quero permissão explícita, diretivas de snippet sem limite e um resumo em texto do negócio, para indexar e citar o site com segurança.

**Why P1**: São 26 pontos pontuados (bots 12, meta de IA 7, robots meta 7) e o objetivo central desta feature.

**Acceptance Criteria**:

1. The `/robots.txt` SHALL contain a `User-agent` group with `Allow: /` for each of `GPTBot`, `OAI-SearchBot`, `ChatGPT-User`, `ClaudeBot`, `Claude-User`, `Claude-SearchBot`, `PerplexityBot`, `Perplexity-User` and `Google-Extended`. <!-- BOT-01 -->
2. Each AI `User-agent` group in `/robots.txt` SHALL also contain `Disallow: /api/`. <!-- BOT-02 -->
3. The `/robots.txt` SHALL keep the `User-agent: *` group with `Allow: /`, `Disallow: /api/` and the `Sitemap:` line (HOST-03, HOST-04 unchanged). <!-- BOT-03 -->
4. Every indexable page SHALL contain `<meta name="robots" content="index, follow, max-snippet:-1, max-image-preview:large, max-video-preview:-1">`. <!-- RMETA-01 -->
5. The 404 page SHALL keep `<meta name="robots" content="noindex">` and SHALL NOT contain the `index, follow` robots meta (NOIDX-01 unchanged). <!-- RMETA-02 -->
6. The site SHALL serve `/llms.txt` with status 200 and `content-type: text/plain; charset=utf-8`. <!-- LLMS-01 -->
7. The `/llms.txt` SHALL start with `# Leonardo Gomes Assunção` followed by a `>` summary line equal to the home description, both within the first 500 characters. <!-- LLMS-02 -->
8. The `/llms.txt` SHALL list, as Markdown links with absolute URLs on the canonical host, the home, every service page and the privacy page, each with a one-line description. <!-- LLMS-03 -->
9. The `/llms.txt` SHALL include city, service area, e-mail, WhatsApp and CNPJ taken from the site configuration. <!-- LLMS-04 -->
10. Every page SHALL contain `<link rel="alternate" type="text/plain" href="/llms.txt" title="llms.txt">` in `<head>`. <!-- LLMS-05 -->
11. WHEN a service is added to `src/data/services.ts` THEN `/llms.txt` SHALL list it without manual edits (generated from data). <!-- LLMS-06 -->

**Independent Test**: Teste de build lê `dist/robots.txt` e `dist/llms.txt` e confere grupos, links e dados; teste de render confere as metas no `<head>` da home e da 404.

---

### P1: security.txt ⭐ MVP

**User Story**: Como pesquisador de segurança, quero saber a quem reportar uma falha, para avisar o responsável em vez de expor o problema.

**Why P1**: 10 pontos pontuados, arquivo simples (RFC 9116).

**Acceptance Criteria**:

1. The site SHALL serve `/.well-known/security.txt` with status 200 and `content-type: text/plain; charset=utf-8`. <!-- SECTXT-01 -->
2. The `security.txt` SHALL contain `Contact: mailto:<site.email>`. <!-- SECTXT-02 -->
3. The `security.txt` SHALL contain an `Expires:` field in ISO 8601 UTC equal to the build date plus 364 days. <!-- SECTXT-03 -->
4. The `security.txt` SHALL contain `Canonical: https://www.leonardoassuncao.com.br/.well-known/security.txt`. <!-- SECTXT-04 -->
5. The `security.txt` SHALL contain `Preferred-Languages: pt-BR, en`. <!-- SECTXT-05 -->
6. The `security.txt` SHALL contain `Policy:` pointing to the privacy page on the canonical host. <!-- SECTXT-06 -->

**Independent Test**: Teste unitário do gerador com data fixa confere os campos; teste de build confere o arquivo em `dist/.well-known/`.

---

### P1: Layout estável no mobile (CLS) ⭐ MVP

**User Story**: Como visitante no celular, quero que o conteúdo não pule enquanto a página carrega, para não clicar no lugar errado nem perder a leitura.

**Why P1**: CLS 0,32 é "ruim" nos Core Web Vitals (limite bom: 0,1), afeta quem visita e é sinal de ranqueamento.

**Acceptance Criteria**:

1. WHEN Lighthouse mobile (emulação padrão) runs against the built home served locally THEN Cumulative Layout Shift SHALL be ≤ 0.1 in each of 3 consecutive runs. <!-- PERF-05 -->
2. WHEN Lighthouse mobile runs against `/criacao-de-sites/` served locally THEN Cumulative Layout Shift SHALL be ≤ 0.1 in each of 3 consecutive runs. <!-- PERF-06 -->
3. WHEN Lighthouse mobile runs against the built home THEN the Performance score SHALL be ≥ 95. <!-- PERF-07 -->
4. WHILE the web font has not loaded the page SHALL render with a fallback font whose metrics are adjusted (`size-adjust`/`ascent-override` or equivalent) so the font swap does not move content. <!-- PERF-08 -->
5. The reveal animations (ANIM) SHALL animate only `opacity` and `transform`, never properties that change layout (height, margin, top). <!-- PERF-09 -->

**Independent Test**: Script de Lighthouse local (Chrome em `/usr/bin/google-chrome`) roda 3× na home e em uma página de serviço e grava o CLS; PSI em produção depois do deploy.

---

### P2: Dados estruturados para IA

**User Story**: Como um modelo de IA montando uma resposta, quero saber quem é a empresa, o que ela sabe fazer, onde atua e quais perfis são dela, para citar com confiança.

**Why P2**: 9 pontos; o grafo já existe e só falta enriquecê-lo.

**Acceptance Criteria**:

1. The company JSON-LD node SHALL have `"@type": ["Organization", "ProfessionalService"]`. <!-- LD-10 -->
2. The company JSON-LD node SHALL contain a `knowsAbout` array with exactly the name of every service in `src/data/services.ts`, in file order. <!-- LD-11 -->
3. The site configuration SHALL set `linkedin` to `https://www.linkedin.com/in/leonardo-gomes-assuncao`, and the company node and the Person node SHALL each contain `sameAs: ["https://www.linkedin.com/in/leonardo-gomes-assuncao"]`. <!-- LD-12 -->
4. The company JSON-LD node SHALL keep `hasOfferCatalog`, `address`, `name` and `url` (LD-02 to LD-05 unchanged). <!-- LD-14 -->
5. IF `site.linkedin` is absent THEN the JSON-LD SHALL omit `sameAs` instead of publishing an empty array. <!-- LD-15 -->

**Independent Test**: Testes de `src/lib/seo/schema.ts` com configuração com e sem LinkedIn; Rich Results Test e validator.schema.org na produção.

---

### P2: Ajustes pequenos de SEO e acessibilidade

**User Story**: Como o Google e como usuário de leitor de tela, quero título no tamanho certo, manifest, idioma declarado, sitemap com datas reais e formulário sem armadilha de foco, para que cada detalhe técnico fique correto.

**Why P2**: São 9 pontos espalhados, todos de baixo risco.

**Acceptance Criteria**:

1. The home `<title>` SHALL have at most 60 characters. <!-- SEO-07 -->
2. Every page `<title>` SHALL have at most 60 characters. <!-- SEO-08 -->
3. The site SHALL serve `/site.webmanifest` with status 200, `name`, `short_name`, `start_url: "/"`, `display: "browser"`, `lang: "pt-BR"`, `theme_color: "#0a1a33"`, `background_color: "#0a1a33"` and icons of 192×192 and 512×512 PNG. <!-- MANI-01 -->
4. Every page SHALL contain `<link rel="manifest" href="/site.webmanifest">`. <!-- MANI-02 -->
5. Every indexable page SHALL contain `<link rel="alternate" hreflang="pt-BR">` and `<link rel="alternate" hreflang="x-default">`, both pointing to its canonical URL. <!-- I18N-01 -->
6. The 404 page SHALL NOT contain `hreflang` links. <!-- I18N-02 -->
7. WHEN git history is available at build time THEN each sitemap `<url>` SHALL have `<lastmod>` equal to the date of the last commit that touched that page's source files or its data. <!-- SMAP-01 -->
8. IF git history is not available at build time (shallow clone, no `.git`) THEN the sitemap SHALL omit `<lastmod>` and the build SHALL NOT fail. <!-- SMAP-02 -->
9. Each FAQ question SHALL be rendered as an `<h3>` inside its `<summary>`, with the visual style unchanged. <!-- A11Y-06 -->
10. The contact form honeypot SHALL NOT be inside an element with `aria-hidden="true"`. <!-- A11Y-07 -->
11. The honeypot field SHALL have `tabindex="-1"`, `autocomplete="off"`, stay visually off-screen and have the label "Deixe este campo em branco". <!-- A11Y-08 -->
12. WHEN the honeypot is filled THEN the API SHALL keep rejecting the submission as in FORM-10. <!-- A11Y-09 -->

**Independent Test**: Testes de render (título, manifest, hreflang, FAQ, formulário) e de build (sitemap com e sem git).

---

### P3: Texto completo para IA (`/llms-full.txt`)

**User Story**: Como um agente de IA, quero o texto inteiro das páginas de serviço num só arquivo de texto, para responder perguntas detalhadas sem renderizar HTML.

**Why P3**: Prática emergente (llmstxt.org). Não conta pontos no checker, mas é barato porque o conteúdo já está em `services.ts` e `faq.ts`.

**Acceptance Criteria**:

1. The site SHALL serve `/llms-full.txt` with status 200 and `content-type: text/plain; charset=utf-8`. <!-- LLMS-07 -->
2. The `/llms-full.txt` SHALL contain, for every service, its name, canonical URL and full description text from `src/data/services.ts`. <!-- LLMS-08 -->
3. The `/llms-full.txt` SHALL contain every FAQ question and answer from `src/data/faq.ts`. <!-- LLMS-09 -->
4. The `/llms.txt` SHALL link to `/llms-full.txt` under an `## Optional` section. <!-- LLMS-10 -->

**Independent Test**: Teste de build compara o arquivo com os dados.

---

## Edge Cases

- IF a new inline `<script>` without hash is added to a page THEN the build test SHALL fail, naming the page (CSP stays strict). <!-- EDGE-09 -->
- IF a page loads a resource from another origin THEN the CSP/COEP browser test SHALL fail, naming the URL. <!-- EDGE-10 -->
- WHEN the build runs THEN `security.txt` `Expires` SHALL be later than the build date, so every deploy renews it. <!-- EDGE-11 -->
- IF the site configuration's `email` is empty THEN the build SHALL fail (PAGE-09 rule extended to `security.txt` and `llms.txt`). <!-- EDGE-12 -->
- WHEN `/llms.txt`, `/llms-full.txt`, `/.well-known/security.txt` or `/site.webmanifest` is requested THEN the security headers SHALL also be present (SECH apply to every path). <!-- EDGE-13 -->
- The `/api/contato` endpoint SHALL keep answering with the same status codes and bodies under the new headers. <!-- EDGE-14 -->

---

## Requirement Traceability

| Requirement ID | Story | Phase | Status |
| -------------- | ----- | ----- | ------ |
| SECH-01 | P1: Cabeçalhos de segurança | - | Implementing |
| SECH-02 | P1: Cabeçalhos de segurança | - | Implementing |
| SECH-03 | P1: Cabeçalhos de segurança | - | Implementing |
| SECH-04 | P1: Cabeçalhos de segurança | - | Implementing |
| SECH-05 | P1: Cabeçalhos de segurança | - | Implementing |
| SECH-06 | P1: Cabeçalhos de segurança | - | Implementing |
| SECH-07 | P1: Cabeçalhos de segurança | - | Implementing |
| CSP-01 | P1: Cabeçalhos de segurança | - | Implementing |
| CSP-02 | P1: Cabeçalhos de segurança | - | Implementing |
| CSP-03 | P1: Cabeçalhos de segurança | - | Implementing |
| CSP-04 | P1: Cabeçalhos de segurança | - | Implementing |
| CSP-05 | P1: Cabeçalhos de segurança | - | Implementing |
| CSP-06 | P1: Cabeçalhos de segurança | - | Implementing |
| BOT-01 | P1: Sinais para IA | - | Implementing |
| BOT-02 | P1: Sinais para IA | - | Implementing |
| BOT-03 | P1: Sinais para IA | - | Implementing |
| RMETA-01 | P1: Sinais para IA | - | Pending |
| RMETA-02 | P1: Sinais para IA | - | Pending |
| LLMS-01 | P1: Sinais para IA | - | Implementing |
| LLMS-02 | P1: Sinais para IA | - | Implementing |
| LLMS-03 | P1: Sinais para IA | - | Implementing |
| LLMS-04 | P1: Sinais para IA | - | Implementing |
| LLMS-05 | P1: Sinais para IA | - | Pending |
| LLMS-06 | P1: Sinais para IA | - | Implementing |
| SECTXT-01 | P1: security.txt | - | Implementing |
| SECTXT-02 | P1: security.txt | - | Implementing |
| SECTXT-03 | P1: security.txt | - | Implementing |
| SECTXT-04 | P1: security.txt | - | Implementing |
| SECTXT-05 | P1: security.txt | - | Implementing |
| SECTXT-06 | P1: security.txt | - | Implementing |
| PERF-05 | P1: CLS | - | Pending |
| PERF-06 | P1: CLS | - | Pending |
| PERF-07 | P1: CLS | - | Pending |
| PERF-08 | P1: CLS | - | Pending |
| PERF-09 | P1: CLS | - | Implementing |
| LD-10 | P2: Dados estruturados | - | Pending |
| LD-11 | P2: Dados estruturados | - | Pending |
| LD-12 | P2: Dados estruturados | - | Pending |
| LD-14 | P2: Dados estruturados | - | Pending |
| LD-15 | P2: Dados estruturados | - | Pending |
| SEO-07 | P2: Ajustes pequenos | - | Pending |
| SEO-08 | P2: Ajustes pequenos | - | Pending |
| MANI-01 | P2: Ajustes pequenos | - | Implementing |
| MANI-02 | P2: Ajustes pequenos | - | Pending |
| I18N-01 | P2: Ajustes pequenos | - | Pending |
| I18N-02 | P2: Ajustes pequenos | - | Pending |
| SMAP-01 | P2: Ajustes pequenos | - | Pending |
| SMAP-02 | P2: Ajustes pequenos | - | Pending |
| A11Y-06 | P2: Ajustes pequenos | - | Pending |
| A11Y-07 | P2: Ajustes pequenos | - | Pending |
| A11Y-08 | P2: Ajustes pequenos | - | Pending |
| A11Y-09 | P2: Ajustes pequenos | - | Pending |
| LLMS-07 | P3: llms-full.txt | - | Implementing |
| LLMS-08 | P3: llms-full.txt | - | Implementing |
| LLMS-09 | P3: llms-full.txt | - | Implementing |
| LLMS-10 | P3: llms-full.txt | - | Implementing |
| EDGE-09 | Edge cases | - | Implementing |
| EDGE-10 | Edge cases | - | Implementing |
| EDGE-11 | Edge cases | - | Implementing |
| EDGE-12 | Edge cases | - | Implementing |
| EDGE-13 | Edge cases | - | Implementing |
| EDGE-14 | Edge cases | - | Pending |

**Coverage:** 62 total, 0 mapped to tasks, 62 unmapped ⚠️ (Tasks ainda não criadas)

---

## Implicit-Requirement Dimensions

| Dimension | Coverage |
| --------- | -------- |
| Input validation & bounds | Título ≤ 60 (SEO-07/08); honeypot continua validado (A11Y-09). |
| Failure / partial-failure states | Sem git → sem `lastmod` e build segue (SMAP-02); e-mail vazio falha o build (EDGE-12). |
| Idempotency / retry / duplicate handling | N/A because todos os artefatos são estáticos e gerados de forma determinística a cada build. |
| Auth boundaries & rate limits | N/A because não há autenticação; o rate limit do formulário (FORM) não muda (EDGE-14). |
| Concurrency / ordering | N/A because não há estado compartilhado nem escrita concorrente. |
| Data lifecycle / expiry | `Expires` do security.txt renovado a cada build (SECTXT-03, EDGE-11). |
| Observability | Violações de CSP aparecem no teste de navegador (CSP-04, EDGE-10). Endpoint de `report-to` fica fora: exigiria um serviço para receber os relatórios. |
| External-dependency failure | N/A because nenhum recurso de terceiros é carregado; o Resend do formulário não muda. |
| State-transition integrity | N/A because não há máquina de estados nova. |

---

## Success Criteria

- [ ] GEO Checker em produção: nota A, com Security Headers 15/15, AI Bot Permissions 12/12, Robots Meta 10/10, security.txt 10/10 e AI-Intent Meta 10/10.
- [ ] PageSpeed Insights mobile em produção: CLS ≤ 0,1 e Performance ≥ 95 na home.
- [ ] Formulário de contato enviado com sucesso em produção depois do deploy (sem regressão da CSP).
- [ ] `securityheaders.com` dá nota A ou superior.

---

## Sugestões fora do código (checklist do dono)

Não entram nos ACs porque dependem de painéis e contas, mas completam o trabalho:

1. **Bing Webmaster Tools**: verificar o domínio e enviar o sitemap. O ChatGPT Search usa o índice do Bing, então para GEO isso pesa tanto quanto o Search Console. Depois, considerar IndexNow.
2. **DMARC**: hoje está `p=none`. Ler os relatórios por 2 a 4 semanas e subir para `p=quarantine` (depois `p=reject`).
3. **SPF no domínio raiz**: incluir o provedor da caixa `contato@` (e o Resend, se ele enviar pelo domínio raiz), terminando em `~all`.
4. **DKIM**: ativar no provedor da caixa de e-mail (o Resend assina pelo próprio subdomínio).
5. **MTA-STS**: publicar `mta-sts.leonardoassuncao.com.br/.well-known/mta-sts.txt` (pode ser um segundo site grátis na Netlify) e o TXT `_mta-sts`. Começar em `mode: testing`.
6. **HSTS preload**: só depois de confirmar que todo subdomínio responde em HTTPS.
7. **Analytics sem cookies** (Cloudflare Web Analytics ou Plausible): mede se GEO e SEO trazem visitas sem banner de LGPD. Exige liberar o domínio do script na CSP.
8. **Perfil da Empresa no Google** e **LinkedIn da empresa**: alimentam o `sameAs` (LD-12/13) e dão sinal de entidade para os modelos.
9. **Seção "Sobre" e cases reais**: o maior ganho restante de E-E-A-T e de citação por IA. Precisa de informações reais.
10. **Reexecutar o GEO Checker** depois do deploy e anexar o novo `resultId` ao `validation.md`.

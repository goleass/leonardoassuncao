# Site Institucional Tasks

## Execution Protocol (MANDATORY -- do not skip)

Implement these tasks with the `tlc-spec-driven` skill: **activate it by name and follow its Execute flow and Critical Rules.** Do not search for skill files by filesystem path. The skill is the source of truth for the full flow (per-task cycle, sub-agent delegation, adequacy review, Verifier, discrimination sensor).

**If the skill cannot be activated, STOP and tell the user - do not proceed without it.**

---

**Design**: `.specs/features/site-institucional/design.md`
**Status**: Draft

**Pré-requisito antes do T4:** os dados reais da empresa (domínio, e-mail, WhatsApp, LinkedIn, cidade/UF, CNPJ, prazo de resposta). Sem eles o build falha por regra da spec (PAGE-09).

---

## Test Coverage Matrix

> Generated from project guidelines and spec - confirm before Execute. Guidelines found: none - repositório vazio; tipo de teste definido pelo usuário: **só unitário** (Vitest). Strong defaults applied dentro desse limite.

| Code Layer | Required Test Type | Coverage Expectation | Location Pattern | Run Command |
| ---------- | ------------------ | -------------------- | ---------------- | ----------- |
| Domínio do contato (`src/lib/contact/*`) | unit | Todos os ramos; 1:1 com FORM-xx e EDGE-01..03; cada limite testado no valor exato e ±1 | `src/lib/contact/*.test.ts` | `npm test` |
| Configuração (`src/config/*`) | unit | Cada campo obrigatório: vazio, com colchetes e válido; mensagem nomeia o campo | `src/config/*.test.ts` | `npm test` |
| Componentes e páginas `.astro` | unit (Container API → HTML) | Textos, ordem, atributos (`href`, `aria-*`, `lang`, `id`), renderização condicional; 1:1 com PAGE/SEO/A11Y/LEGAL testáveis por HTML | `src/components/*.test.ts`, `src/pages/*.test.ts`, `src/layouts/*.test.ts` | `npm test` |
| Scripts do navegador (`src/scripts/*`) | unit (happy-dom) | Toda transição de estado e evento da spec (clique, Esc, envio, 400/429/502/rede, clique duplo) | `src/scripts/*.test.ts` | `npm test` |
| Saída do build (`.vercel/output`) | unit sobre artefatos | Segredo ausente dos arquivos públicos; sitemap/robots presentes | `tests/build/*.test.ts` | `npm run test:build` |
| Estilos (`src/styles/*.css`) e config de ferramenta | none | Build gate + checklist manual na validação (RESP-01/02/05/06, EDGE-04, PAGE-06 rolagem suave/deslocamento, PAGE-13, A11Y-01/02, SEO-05, ANIM-01..06/10); FORM-13 por inspeção estática (nenhuma escrita em disco/banco no código) | - | build gate only |

## Gate Check Commands

> Generated from design - confirm before Execute. Comandos criados no T1.

| Gate Level | When to Use | Command |
| ---------- | ----------- | ------- |
| Quick | Tarefas com testes unitários | `npm test` |
| Full | Não usado (sem integração/e2e por decisão do usuário) | `npm test` |
| Build | Fim de cada fase, tarefas de config/estilo e tarefas que mexem no build | `npm run check && npm run build && npm test && npm run test:build` |

---

## Execution Plan

Phases are ordered and run sequentially - each phase completes before the next begins, and tasks within a phase execute in order.

### Phase 1: Fundação

```
T1 -> T2
T1 -> T3
T3 -> T4
```

### Phase 2: Lógica do contato

```
T5 -> T8
T5 -> T9
T6 -> T9
T8 -> T9
T9 -> T10
```

### Phase 3: Layout e primeiras seções

```
T11 -> T12
T11 -> T13
T11 -> T14
T11 -> T15
T11 -> T16
T11 -> T17
T11 -> T18
```

### Phase 4: Seções finais e página inicial

```
T19 -> T24
T20 -> T24
T21 -> T24
T22 -> T24
T23 -> T24
```

### Phase 5: Comportamento no navegador

```
T25 -> T27
```

### Phase 6: Páginas extras e SEO

```
T29 -> T31
T30 -> T31
T29 -> T32
T30 -> T32
```

### Phase 7: Correções da validação (rodada 1)

```
T34 -> T37
```

---

## Task Breakdown

### Phase 1: Fundação

#### T1: Criar o projeto Astro com Vitest

**What**: Inicializar git e o projeto Astro 7 (versão exata fixada) com `@astrojs/vercel`, `@astrojs/sitemap`, `zod`, `resend`, `@fontsource-variable/archivo`, Vitest + happy-dom; scripts `dev`, `build`, `check`, `test`, `test:build`; `.gitignore`; `tsconfig.json` estrito; `vitest.config.ts` com `getViteConfig`; helper `tests/render.ts` com a Container API; um teste de fumaça que renderiza um componente trivial.
**Where**: `package.json`
**Depends on**: None
**Reuses**: Docs do Astro (on-demand rendering, astro:env, Container API)
**Requirement**: base para todos

**Tools**:

- MCP: NONE
- Skill: NONE

**Done when**:

- [x] `npm run check`, `npm run build` e `npm test` rodam sem erro
- [x] Teste de fumaça do helper `renderComponent` passa (1 teste)
- [x] `astro` com versão exata (sem `^`) no `package.json`

**Tests**: unit
**Gate**: build

**Commit**: `chore: scaffold astro project with vitest`

---

#### T2: Tokens de design e estilos base

**What**: Criar `tokens.css` (paleta marinho: `--deep #0A1A33`, `--brand #143E7A`, `--mark #5B95FF`, cinzas frios, tinta `#0D1522`, escala de tipo e espaçamentos do protótipo) e `global.css` (reset, `@font-face` via fontsource wdth, foco visível, `scroll-margin-top` das seções, utilitário de container 1320px).
**Where**: `src/styles/tokens.css`
**Depends on**: T1
**Reuses**: valores de `project/Main.dc.html` do canvas
**Requirement**: SEO-06, A11Y-01, PAGE-06

**Tools**:

- MCP: NONE
- Skill: NONE

**Done when**:

- [x] Cores e tamanhos idênticos ao protótipo
- [x] Fonte servida do próprio domínio com `font-display: swap`
- [x] Gate build passa

**Tests**: none
**Gate**: build

**Commit**: `feat(styles): add design tokens and base styles`

---

#### T3: Schema e validação da configuração do site

**What**: `siteSchema` (zod) e `validateSiteConfig()` conforme o modelo `SiteConfig` do design, rejeitando campo obrigatório vazio ou com texto entre colchetes, com erro que nomeia o campo.
**Where**: `src/config/schema.ts`
**Depends on**: T1
**Reuses**: -
**Requirement**: PAGE-08, PAGE-09

**Tools**:

- MCP: NONE
- Skill: NONE

**Done when**:

- [x] Para cada campo obrigatório: vazio → erro com o nome do campo; `[X]` → erro com o nome do campo
- [x] Config válida retorna o objeto tipado
- [x] `projetos: []` e `depoimento` ausente são aceitos
- [x] Gate quick passa; ≥ 18 testes

**Tests**: unit
**Gate**: quick

**Commit**: `feat(config): add site config schema and validation`

---

#### T4: Dados reais do site e bloqueio no build

**What**: Preencher `site.ts` com os dados reais e chamar `validateSiteConfig(site)` no `astro.config.mjs`, definindo `site: site.url`.
**Where**: `src/config/site.ts`
**Depends on**: T3
**Reuses**: `validateSiteConfig`
**Requirement**: PAGE-08, PAGE-09

**Tools**:

- MCP: NONE
- Skill: NONE

**Done when**:

- [x] Teste unitário confirma que `site.ts` passa no schema
- [x] Trocar um campo por `[X]` faz `npm run build` falhar citando o campo (verificado e revertido)
- [x] Gate build passa

**Tests**: unit
**Gate**: build

**Commit**: `feat(config): add site content and validate it at build time`

---

### Phase 2: Lógica do contato

#### T5: Validação do formulário de contato

**What**: `validateContact()` com as regras e mensagens pt-BR de FORM-04 (nome 2–100, e-mail ≤ 254 e formato válido, tipo da lista, mensagem 10–2000, trim) e o campo honeypot `website`.
**Where**: `src/lib/contact/validation.ts`
**Depends on**: None
**Reuses**: `zod`
**Requirement**: FORM-04, FORM-05, FORM-06, EDGE-02

**Tools**:

- MCP: NONE
- Skill: NONE

**Done when**:

- [x] Limites testados no valor exato e ±1 (1, 2, 100, 101; 9, 10, 2000, 2001; 254, 255)
- [x] Mensagem de 2001 caracteres retorna "A mensagem pode ter até 2000 caracteres."
- [x] Tipo fora da lista e campos ausentes geram erro por campo
- [x] Gate quick passa; ≥ 16 testes

**Tests**: unit
**Gate**: quick

**Commit**: `feat(contact): add contact form validation`

---

#### T6: Limitador de envios por IP

**What**: `createRateLimiter({ limit, windowMs, now })` com janela deslizante em memória e limpeza de chaves expiradas.
**Where**: `src/lib/contact/rate-limit.ts`
**Depends on**: None
**Reuses**: -
**Requirement**: FORM-11

**Tools**:

- MCP: NONE
- Skill: NONE

**Done when**:

- [x] 5 chamadas permitidas, a 6ª bloqueada dentro de 60 min
- [x] Permitido de novo após a janela expirar (relógio injetado)
- [x] IPs diferentes contam separadamente
- [x] Gate quick passa; ≥ 5 testes

**Tests**: unit
**Gate**: quick

**Commit**: `feat(contact): add in-memory rate limiter`

---

#### T7: Link do WhatsApp com texto pré-preenchido

**What**: `buildWhatsAppUrl(phone, { nome, tipo })` gerando `https://wa.me/<phone>?text=` com o texto da premissa codificado por `encodeURIComponent`.
**Where**: `src/lib/contact/whatsapp.ts`
**Depends on**: None
**Reuses**: -
**Requirement**: FORM-03

**Tools**:

- MCP: NONE
- Skill: NONE

**Done when**:

- [x] URL decodificada é exatamente "Olá, Leonardo! Acabei de enviar uma mensagem pelo site sobre: <tipo>. Meu nome é <nome>."
- [x] Acentos, `&` e espaços codificados corretamente
- [x] Gate quick passa; ≥ 3 testes

**Tests**: unit
**Gate**: quick

**Commit**: `feat(contact): build whatsapp follow-up link`

---

#### T8: Conteúdo do e-mail de contato

**What**: `renderContactEmail(data)` retornando assunto "Novo contato pelo site: <tipo> — <nome>", texto simples e HTML com escape.
**Where**: `src/lib/contact/email.ts`
**Depends on**: T5
**Reuses**: tipo `ContactInput`
**Requirement**: FORM-01, EDGE-03

**Tools**:

- MCP: NONE
- Skill: NONE

**Done when**:

- [x] Nome, e-mail, tipo e mensagem presentes no texto e no HTML
- [x] `<script>` no nome/mensagem aparece como `&lt;script&gt;` no HTML
- [x] Gate quick passa; ≥ 4 testes

**Tests**: unit
**Gate**: quick

**Commit**: `feat(contact): render contact email`

---

#### T9: Handler do contato

**What**: `handleContact(request, deps)` implementando a tabela de respostas do design: 400 inválido/JSON malformado, 200 sem envio para honeypot, 429 por limite, 502 por falha ou timeout de 10s, 200 com envio e `replyTo` do visitante; log `{at, code}` sem dados pessoais; nada persistido.
**Where**: `src/lib/contact/handler.ts`
**Depends on**: T5, T6, T8
**Reuses**: `validateContact`, `createRateLimiter`, `renderContactEmail`
**Requirement**: FORM-01, FORM-06, FORM-08, FORM-10, FORM-11, FORM-13, FORM-15

**Tools**:

- MCP: NONE
- Skill: NONE

**Done when**:

- [x] Cada status (200, 400, 429, 502) testado com o corpo JSON exato do design
- [x] `send` não é chamado em 400, 429 e honeypot
- [x] Timeout testado com relógio falso: `send` pendente por 10s → 502
- [x] Entradas de log não contêm nome, e-mail nem mensagem
- [x] Gate quick passa; ≥ 10 testes

**Tests**: unit
**Gate**: quick

**Commit**: `feat(contact): add contact request handler`

---

#### T10: Endpoint /api/contato com Resend

**What**: Rota `POST` com `prerender = false`, schema `astro:env` (`RESEND_API_KEY` secreta, `CONTACT_TO`, `CONTACT_FROM` de servidor), limitador único do módulo, `clientAddress` como IP; teste de build que procura o nome e um valor-sentinela da chave nos arquivos públicos de `.vercel/output/static` (confirmando a pasta real).
**Where**: `src/pages/api/contato.ts`
**Depends on**: T9
**Reuses**: `handleContact`
**Requirement**: FORM-14

**Tools**:

- MCP: NONE
- Skill: NONE

**Done when**:

- [x] `npm run build` gera a função do endpoint e o resto estático
- [x] `tests/build/secrets.test.ts` falha se a pasta de saída não existir e passa sem o segredo nela
- [x] Gate build passa

**Tests**: unit
**Gate**: build

**Commit**: `feat(contact): expose contact endpoint backed by resend`

---

### Phase 3: Layout e primeiras seções

#### T11: Layout base com SEO

**What**: `BaseLayout.astro` com `<html lang="pt-BR">`, título e description da spec, canônica, Open Graph/Twitter (imagem `/og.png` 1200×630), JSON-LD `ProfessionalService` com dados da config, script inline que põe a classe `js` no `<html>`, link "Pular para o conteúdo" e `<main id="conteudo">`.
**Where**: `src/layouts/BaseLayout.astro`
**Depends on**: None
**Reuses**: `site.ts`, `tokens.css`, `global.css`
**Requirement**: SEO-01, SEO-02, SEO-04, A11Y-04

**Tools**:

- MCP: NONE
- Skill: NONE

**Done when**:

- [x] HTML renderizado contém cada meta/tag da spec com valor exato
- [x] JSON-LD é JSON válido com nome, serviços, área atendida e contatos
- [x] Primeiro elemento focável é o link "Pular para o conteúdo"
- [x] Gate quick passa; ≥ 8 testes

**Tests**: unit
**Gate**: quick

**Commit**: `feat(layout): add base layout with seo metadata`

---

#### T12: Cabeçalho fixo com navegação e botão Menu

**What**: `Header.astro` com logo, links âncora, "Fale comigo", botão "Menu" (`aria-expanded="false"`, `aria-controls`) e painel; link "Projetos" só quando há projetos.
**Where**: `src/components/Header.astro`
**Depends on**: T11
**Reuses**: `site.ts`
**Requirement**: PAGE-06, PAGE-11, PAGE-13, RESP-02

**Tools**:

- MCP: NONE
- Skill: NONE

**Done when**:

- [x] `href` de cada link aponta para o `id` da seção
- [x] Sem projetos → sem link "Projetos"; com projetos → link presente
- [x] Botão Menu tem `aria-expanded` e `aria-controls` válidos
- [x] Gate quick passa; ≥ 5 testes

**Tests**: unit
**Gate**: quick

**Commit**: `feat(header): add sticky header with navigation`

---

#### T13: Hero com título animado

**What**: `Hero.astro` com as 3 linhas do título, palavra alternada (sites, sistemas, integrações, software + repetição para o ciclo, com `aria-hidden` nas cópias), texto fixo "software" para movimento reduzido, parágrafos e CTAs do protótipo.
**Where**: `src/components/Hero.astro`
**Depends on**: T11
**Reuses**: textos do protótipo
**Requirement**: PAGE-02, ANIM-01, ANIM-02, ANIM-08, A11Y-05

**Tools**:

- MCP: NONE
- Skill: NONE

**Done when**:

- [x] Único `<h1>` da página, com texto acessível "Construo software sob medida."
- [x] As 4 palavras aparecem na ordem da spec
- [x] CTAs apontam para `#contato` e `#servicos`
- [x] Gate quick passa; ≥ 4 testes

**Tests**: unit
**Gate**: quick

**Commit**: `feat(hero): add hero with rotating headline`

---

#### T14: Faixa de especialidades

**What**: `Marquee.astro` com a lista duplicada (segunda cópia `aria-hidden`) para o ciclo sem emenda.
**Where**: `src/components/Marquee.astro`
**Depends on**: T11
**Reuses**: protótipo
**Requirement**: ANIM-03, ANIM-04

**Tools**:

- MCP: NONE
- Skill: NONE

**Done when**:

- [x] 6 especialidades na primeira cópia; segunda cópia com `aria-hidden="true"`
- [x] Gate quick passa; ≥ 2 testes

**Tests**: unit
**Gate**: quick

**Commit**: `feat(marquee): add specialties band`

---

#### T15: Seção Serviços

**What**: `Services.astro` com os 5 itens (01–05, título, descrição, seta), cada item um link para `#contato`.
**Where**: `src/components/Services.astro`
**Depends on**: T11
**Reuses**: protótipo
**Requirement**: PAGE-03, ANIM-05

**Tools**:

- MCP: NONE
- Skill: NONE

**Done when**:

- [x] 5 itens na ordem e com os textos da spec
- [x] `id="servicos"` e `<h2>` presentes
- [x] Gate quick passa; ≥ 3 testes

**Tests**: unit
**Gate**: quick

**Commit**: `feat(services): add services section`

---

#### T16: Seção Integrações

**What**: `Integrations.astro` com título, texto, etiquetas e o fluxo de 5 etapas com marcador animado (`aria-hidden` no marcador).
**Where**: `src/components/Integrations.astro`
**Depends on**: T11
**Reuses**: protótipo
**Requirement**: PAGE-04, ANIM-06

**Tools**:

- MCP: NONE
- Skill: NONE

**Done when**:

- [x] 5 etapas na ordem da spec, em lista ordenada
- [x] `id="integracoes"` presente
- [x] Gate quick passa; ≥ 3 testes

**Tests**: unit
**Gate**: quick

**Commit**: `feat(integrations): add integrations flow section`

---

#### T17: Seção Compromissos

**What**: `Commitments.astro` com os 3 compromissos e as linhas que se desenham.
**Where**: `src/components/Commitments.astro`
**Depends on**: T11
**Reuses**: protótipo
**Requirement**: PAGE-01

**Tools**:

- MCP: NONE
- Skill: NONE

**Done when**:

- [x] 3 títulos e textos do protótipo presentes
- [x] Gate quick passa; ≥ 1 teste

**Tests**: unit
**Gate**: quick

**Commit**: `feat(commitments): add commitments section`

---

#### T18: Seção Processo

**What**: `Process.astro` com as 4 etapas numeradas em `<ol>`.
**Where**: `src/components/Process.astro`
**Depends on**: T11
**Reuses**: protótipo
**Requirement**: PAGE-05

**Tools**:

- MCP: NONE
- Skill: NONE

**Done when**:

- [x] 4 etapas na ordem da spec
- [x] `id="processo"` presente
- [x] Gate build passa (fim da fase); ≥ 2 testes

**Tests**: unit
**Gate**: build

**Commit**: `feat(process): add process section`

---

### Phase 4: Seções finais e página inicial

#### T19: Seção Projetos condicional

**What**: `Projects.astro` que renderiza os projetos da config (imagem 16:11 com `alt`, nome, categoria, ano, descrição) e não renderiza nada quando a lista está vazia.
**Where**: `src/components/Projects.astro`
**Depends on**: None
**Reuses**: `SiteConfig.projetos`
**Requirement**: PAGE-10, PAGE-11, EDGE-05

**Tools**:

- MCP: NONE
- Skill: NONE

**Done when**:

- [x] Lista vazia → string vazia
- [x] 2 projetos → 2 artigos com todos os campos e `alt`
- [x] Contêiner da imagem com proporção 16:11 reservada
- [x] Gate quick passa; ≥ 3 testes

**Tests**: unit
**Gate**: quick

**Commit**: `feat(projects): add conditional projects section`

---

#### T20: Depoimento condicional

**What**: `Testimonial.astro` com `<figure>`/`<blockquote>`/`<figcaption>`; nada sem depoimento.
**Where**: `src/components/Testimonial.astro`
**Depends on**: None
**Reuses**: `SiteConfig.depoimento`
**Requirement**: PAGE-12

**Tools**:

- MCP: NONE
- Skill: NONE

**Done when**:

- [x] Sem depoimento → string vazia; com depoimento → texto, autor, cargo e empresa
- [x] Gate quick passa; ≥ 2 testes

**Tests**: unit
**Gate**: quick

**Commit**: `feat(testimonial): add conditional testimonial`

---

#### T21: Perguntas frequentes

**What**: `Faq.astro` com as 4 perguntas em `<details>/<summary>` (a primeira aberta).
**Where**: `src/components/Faq.astro`
**Depends on**: None
**Reuses**: protótipo
**Requirement**: PAGE-07

**Tools**:

- MCP: NONE
- Skill: NONE

**Done when**:

- [x] 4 `<details>` com pergunta e resposta; só o primeiro com `open`
- [x] Gate quick passa; ≥ 2 testes

**Tests**: unit
**Gate**: quick

**Commit**: `feat(faq): add faq section`

---

#### T22: Seção Contato com formulário

**What**: `Contact.astro` com título, prazo de resposta, e-mail/WhatsApp/LinkedIn da config, formulário (labels, `required`, `maxlength`, honeypot oculto `website` com `tabindex="-1"` e `autocomplete="off"`, região `aria-live="polite"`, link `/privacidade` junto ao botão).
**Where**: `src/components/Contact.astro`
**Depends on**: None
**Reuses**: `site.ts`
**Requirement**: FORM-04, LEGAL-02, A11Y-03

**Tools**:

- MCP: NONE
- Skill: NONE

**Done when**:

- [x] Cada campo tem `<label for>` correspondente e limites do FORM-04
- [x] Opções do tipo: Site, Sistema web, Integração, Outro
- [x] Honeypot fora da ordem de tabulação e escondido de leitores de tela
- [x] Links de e-mail/WhatsApp usam os valores da config
- [x] Gate quick passa; ≥ 6 testes

**Tests**: unit
**Gate**: quick

**Commit**: `feat(contact): add contact section markup`

---

#### T23: Rodapé

**What**: `Footer.astro` com nome, CNPJ, cidade/UF, ano atual e link `/privacidade`.
**Where**: `src/components/Footer.astro`
**Depends on**: None
**Reuses**: `site.ts`
**Requirement**: LEGAL-04

**Tools**:

- MCP: NONE
- Skill: NONE

**Done when**:

- [x] Ano vem de `new Date().getFullYear()` (teste com data fixa)
- [x] Gate quick passa; ≥ 2 testes

**Tests**: unit
**Gate**: quick

**Commit**: `feat(footer): add footer`

---

#### T24: Página inicial

**What**: `index.astro` montando as seções na ordem da spec dentro do `BaseLayout`.
**Where**: `src/pages/index.astro`
**Depends on**: T19, T20, T21, T22, T23
**Reuses**: todos os componentes das fases 3 e 4
**Requirement**: PAGE-01, A11Y-05

**Tools**:

- MCP: NONE
- Skill: NONE

**Done when**:

- [x] Ordem dos `id`/seções no HTML igual à spec (com e sem projetos/depoimento)
- [x] Exatamente um `<h1>`; nenhum `<h3>` antes do primeiro `<h2>`
- [x] Gate build passa (fim da fase); ≥ 3 testes

**Tests**: unit
**Gate**: build

**Commit**: `feat(home): compose landing page`

---

### Phase 5: Comportamento no navegador

#### T25: Animações e movimento reduzido

**What**: `animations.css` com os keyframes do protótipo (entrada do título, palavra alternada, faixa com pausa no hover, preenchimento dos serviços, fluxo de integrações, linhas), estado escondido de `.reveal` só sob `html.js`, e bloco `prefers-reduced-motion` que desliga tudo e mostra o texto fixo.
**Where**: `src/styles/animations.css`
**Depends on**: None
**Reuses**: `<helmet><style>` do `Main.dc.html`
**Requirement**: ANIM-01, ANIM-02, ANIM-03, ANIM-04, ANIM-05, ANIM-06, ANIM-08, ANIM-09, ANIM-10

**Tools**:

- MCP: NONE
- Skill: NONE

**Done when**:

- [x] Só `transform`, `opacity` e `background-size` animados
- [x] Gate build passa

**Tests**: none
**Gate**: build

**Commit**: `feat(styles): add strategic animations`

---

#### T26: Menu mobile

**What**: `initMenu(root)` abre/fecha o painel, alterna `aria-expanded`, fecha com Esc e ao clicar num link; ligado no `Header`.
**Where**: `src/scripts/menu.ts`
**Depends on**: None
**Reuses**: markup do T12
**Requirement**: RESP-03, RESP-04

**Tools**:

- MCP: NONE
- Skill: NONE

**Done when**:

- [x] Clique abre (`aria-expanded="true"`), segundo clique fecha
- [x] Esc fecha; clique num link fecha
- [x] Função de limpeza remove os listeners
- [x] Gate quick passa; ≥ 5 testes

**Tests**: unit
**Gate**: quick

**Commit**: `feat(menu): add mobile menu behavior`

---

#### T27: Revelação ao rolar

**What**: `initReveal(document)` adiciona `is-visible` uma única vez a cada `.reveal` que entra na tela; com movimento reduzido ou sem `IntersectionObserver`, marca tudo visível de imediato.
**Where**: `src/scripts/reveal.ts`
**Depends on**: T25
**Reuses**: classes do T25
**Requirement**: ANIM-07, ANIM-08, ANIM-09

**Tools**:

- MCP: NONE
- Skill: NONE

**Done when**:

- [x] Entrada na tela → `is-visible` e o elemento deixa de ser observado
- [x] Movimento reduzido → todos visíveis sem observer
- [x] Sem `IntersectionObserver` → todos visíveis
- [x] Gate quick passa; ≥ 4 testes

**Tests**: unit
**Gate**: quick

**Commit**: `feat(reveal): reveal sections on scroll`

---

#### T28: Controlador do formulário

**What**: `initContactForm(form, deps)` com validação antes do envio, estado "Enviando…" com botão desabilitado, uma única requisição por envio, e os estados de sucesso (mensagem + botão WhatsApp), 400 (erros nos campos), 429 e 502/rede (mensagens da spec, campos preservados).
**Where**: `src/scripts/contact-form.ts`
**Depends on**: None
**Reuses**: `validateContact`, `buildWhatsAppUrl`, markup do T22
**Requirement**: FORM-02, FORM-03, FORM-05, FORM-07, FORM-09, FORM-12, EDGE-01

**Tools**:

- MCP: NONE
- Skill: NONE

**Done when**:

- [x] Inválido → erro abaixo do campo e `fetch` não chamado
- [x] Clique duplo → `fetch` chamado 1 vez
- [x] Cada resposta (200, 400, 429, 502, rejeição de rede) leva ao texto exato da spec
- [x] Após sucesso, o botão aponta para a URL do `buildWhatsAppUrl`
- [x] Gate build passa (fim da fase); ≥ 9 testes

**Tests**: unit
**Gate**: build

**Commit**: `feat(contact): add contact form controller`

---

### Phase 6: Páginas extras e SEO

#### T29: Página de privacidade

**What**: `privacidade.astro` com dados coletados, finalidade, não armazenamento e e-mail de contato para dados pessoais.
**Where**: `src/pages/privacidade.astro`
**Depends on**: None
**Reuses**: `BaseLayout`, `site.ts`
**Requirement**: LEGAL-01

**Tools**:

- MCP: NONE
- Skill: NONE

**Done when**:

- [x] Os 4 itens do LEGAL-01 presentes; e-mail vem da config
- [x] Gate quick passa; ≥ 2 testes

**Tests**: unit
**Gate**: quick

**Commit**: `feat(legal): add privacy policy page`

---

#### T30: Página 404

**What**: `404.astro` no visual do site com link para `/`.
**Where**: `src/pages/404.astro`
**Depends on**: None
**Reuses**: `BaseLayout`
**Requirement**: LEGAL-03

**Tools**:

- MCP: NONE
- Skill: NONE

**Done when**:

- [x] Renderiza título e link `href="/"`
- [x] Build gera `404.html`
- [x] Gate quick passa; ≥ 1 teste

**Tests**: unit
**Gate**: quick

**Commit**: `feat(legal): add not found page`

---

#### T31: Imagem de compartilhamento, sitemap e robots

**What**: `public/og.png` 1200×630 na identidade do site, integração `@astrojs/sitemap`, `public/robots.txt` apontando para o sitemap; teste de build confirmando os três arquivos e que `/api/contato` não aparece no sitemap.
**Where**: `astro.config.mjs`
**Depends on**: T29, T30
**Reuses**: `site.url`
**Requirement**: SEO-02, SEO-03

**Tools**:

- MCP: NONE
- Skill: NONE

**Done when**:

- [x] `og.png` tem exatamente 1200×630 (teste lê o cabeçalho PNG)
- [x] Sitemap lista `/` e `/privacidade`
- [x] Gate build passa; ≥ 3 testes

**Tests**: unit
**Gate**: build

**Commit**: `feat(seo): add og image, sitemap and robots`

---

#### T32: Links do menu funcionando fora da página inicial

**What**: Trocar os `href` do `Header` de `#secao` para `/#secao` (inclusive "Fale comigo"; logo → `/`), para funcionarem em `/privacidade` e na 404.
**Where**: `src/components/Header.astro`
**Depends on**: T29, T30
**Reuses**: markup do T12
**Requirement**: PAGE-06, PAGE-15

**Tools**:

- MCP: NONE
- Skill: NONE

**Done when**:

- [x] Todos os links de seção do Header usam `/#<id>`; testes do T12 atualizados para o novo contrato (mudança de spec PAGE-15, não enfraquecimento)
- [x] Gate quick passa

**Tests**: unit
**Gate**: quick

**Commit**: `fix(header): link menu items to home page sections`

---

#### T33: Linha do Processo desenhada ao rolar

**What**: Envolver a linha do `Process` num elemento `.reveal` para o `lg-draw` animar ao entrar na tela (hoje fica estática).
**Where**: `src/components/Process.astro`
**Depends on**: None
**Reuses**: `.reveal` + `lg-draw` do T25/T27
**Requirement**: ANIM-07

**Tools**:

- MCP: NONE
- Skill: NONE

**Done when**:

- [x] A linha `.lg-draw` do Processo tem um ancestral `.reveal` (teste de HTML)
- [x] Gate build passa (fim da fase e do lote)

**Tests**: unit
**Gate**: build

**Commit**: `fix(process): draw timeline line on scroll`

---

### Phase 7: Correções da validação (rodada 1)

#### T34: Constantes de limite e timeout do contato

**What**: Mover `limit: 5`, `windowMs: 60 min` e `timeoutMs: 10_000` do endpoint para constantes exportadas em `src/lib/contact/limits.ts`, usadas por `contato.ts`, com teste afirmando os valores da spec (sobreviventes M18/M19).
**Where**: `src/lib/contact/limits.ts`
**Depends on**: None
**Reuses**: `src/pages/api/contato.ts`
**Requirement**: FORM-08, FORM-11

**Tools**:

- MCP: NONE
- Skill: NONE

**Done when**:

- [x] Teste afirma 5 envios, janela de 3.600.000 ms e timeout de 10.000 ms
- [x] `contato.ts` não tem mais esses literais
- [x] Gate quick passa

**Tests**: unit
**Gate**: quick

**Commit**: `test(contact): pin rate limit and timeout to spec values`

---

#### T35: Teste do bloqueio de placeholders no build

**What**: Teste que importa `astro.config.mjs` com `site.ts` substituído por uma config com `[X]` e espera o erro nomeando o campo; e com a config real, importa sem erro (sobrevivente M22).
**Where**: `tests/astro-config.test.ts`
**Depends on**: None
**Reuses**: `validateSiteConfig`
**Requirement**: PAGE-09

**Tools**:

- MCP: NONE
- Skill: NONE

**Done when**:

- [x] Remover a chamada `validateSiteConfig(site)` do `astro.config.mjs` faz o teste falhar
- [x] Gate quick passa

**Tests**: unit
**Gate**: quick

**Commit**: `test(config): cover build-time placeholder check`

---

#### T36: Teste das fontes auto-hospedadas

**What**: Teste de build confirmando arquivos `archivo-*.woff2` em `static/_astro`, `font-display: swap` no CSS gerado e nenhuma referência a `fonts.googleapis.com`/`fonts.gstatic.com` nos HTML/CSS.
**Where**: `tests/build/secrets.test.ts`
**Depends on**: None
**Reuses**: build do próprio arquivo
**Requirement**: SEO-06

**Tools**:

- MCP: NONE
- Skill: NONE

**Done when**:

- [x] Gate build passa

**Tests**: unit
**Gate**: build

**Commit**: `test(seo): verify self-hosted fonts with swap`

---

#### T37: Foco no primeiro campo inválido

**What**: Teste do `contact-form` afirmando que, com erros, o foco vai para o primeiro campo inválido na ordem nome → e-mail → tipo → mensagem e que a mensagem está ligada por `aria-describedby` (A11Y-03 esclarecido).
**Where**: `src/scripts/contact-form.test.ts`
**Depends on**: T34
**Reuses**: suíte existente
**Requirement**: A11Y-03

**Tools**:

- MCP: NONE
- Skill: NONE

**Done when**:

- [x] Gate build passa (fim da fase)

**Tests**: unit
**Gate**: build

**Commit**: `test(contact): assert focus moves to first invalid field`

---

## Phase Execution Map

```
Phase 1 → Phase 2 → Phase 3 → Phase 4 → Phase 5 → Phase 6

Phase 1:  T1, T2, T3, T4                      (4)
Phase 2:  T5, T6, T7, T8, T9, T10             (6)
Phase 3:  T11, T12 … T18                      (8)
Phase 4:  T19, T20, T21, T22, T23, T24        (6)
Phase 5:  T25, T26, T27, T28                  (4)
Phase 6:  T29, T30, T31, T32, T33             (5)
Phase 7:  T34, T35, T36, T37                  (4)
```

Execution is strictly sequential - there is no intra-phase parallelism.

**Batches (~7 tarefas, fases inteiras):** Lote A = Fases 1+2 (10) · Lote B = Fase 3 (8) · Lote C = Fases 4+5 (10) · Lote D = T4 + T24 (adiadas) + Fase 6 (5) = 7.

---

## Task Granularity Check

| Task | Scope | Status |
| ---- | ----- | ------ |
| T1 | Scaffold (vários arquivos de config, um conceito) | ⚠️ Coeso - configuração inicial não se divide de forma útil |
| T2 | 2 folhas de estilo base | ⚠️ Coeso - tokens + base |
| T3–T9 | 1 módulo cada | ✅ Granular |
| T10 | 1 endpoint + teste de build dele | ✅ Granular |
| T11–T24 | 1 componente/página cada | ✅ Granular |
| T25 | 1 folha de estilo | ✅ Granular |
| T26–T28 | 1 script cada | ✅ Granular |
| T29, T30 | 1 página cada | ✅ Granular |
| T31 | config de SEO + 2 arquivos públicos | ⚠️ Coeso - mesmo requisito |

## Diagram-Definition Cross-Check

| Task | Depends On (task body) | Diagram Shows | Status |
| ---- | ---------------------- | ------------- | ------ |
| T1 | None | - | ✅ Match |
| T2 | T1 | T1 -> T2 | ✅ Match |
| T3 | T1 | T1 -> T3 | ✅ Match |
| T4 | T3 | T3 -> T4 | ✅ Match |
| T5 | None | - | ✅ Match |
| T6 | None | - | ✅ Match |
| T7 | None | - | ✅ Match |
| T8 | T5 | T5 -> T8 | ✅ Match |
| T9 | T5, T6, T8 | T5/T6/T8 -> T9 | ✅ Match |
| T10 | T9 | T9 -> T10 | ✅ Match |
| T11 | None (usa Fase 1 por ordem de fase) | - | ✅ Match |
| T12–T18 | T11 | T11 -> T12…T18 | ✅ Match |
| T19–T23 | None | - | ✅ Match |
| T24 | T19, T20, T21, T22, T23 | T19…T23 -> T24 | ✅ Match |
| T25 | None | - | ✅ Match |
| T26 | None | - | ✅ Match |
| T27 | T25 | T25 -> T27 | ✅ Match |
| T28 | None (usa T5, T7, T22 de fases anteriores) | - | ✅ Match |
| T29, T30 | None | - | ✅ Match |
| T31 | T29, T30 | T29/T30 -> T31 | ✅ Match |

## Test Co-location Validation

| Task | Code Layer Created/Modified | Matrix Requires | Task Says | Status |
| ---- | --------------------------- | --------------- | --------- | ------ |
| T1 | Config de ferramenta + helper de teste | unit (helper) | unit | ✅ OK |
| T2 | Estilos | none | none | ✅ OK |
| T3, T4 | Configuração | unit | unit | ✅ OK |
| T5–T9 | Domínio do contato | unit | unit | ✅ OK |
| T10 | Endpoint + saída do build | unit | unit | ✅ OK |
| T11–T24 | Componentes/páginas `.astro` | unit | unit | ✅ OK |
| T25 | Estilos | none | none | ✅ OK |
| T26–T28 | Scripts do navegador | unit | unit | ✅ OK |
| T29, T30 | Páginas `.astro` | unit | unit | ✅ OK |
| T31 | Config + saída do build | unit | unit | ✅ OK |

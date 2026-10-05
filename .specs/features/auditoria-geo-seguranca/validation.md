# Auditoria GEO e Segurança — Validação

## Validation: auditoria-geo-seguranca - PASS

**Verdict**: PASS

**Data**: 2026-10-04
**Spec**: `.specs/features/auditoria-geo-seguranca/spec.md`
**Diff range**: `7c19466..91ec8d3` (branch `feat/auditoria-geo-seguranca`, 25 commits). Rodada 1: `7c19466..3794753`. Rodada 2 (re-verificação): `3794753..91ec8d3` = `91ec8d3` (só teste e spec)
**Verifier**: sub-agente independente (autor ≠ verificador)
**Iteração**: 2 de 3 (re-verificação)

**Rodada 2: PASS.** A rodada 1 reprovou por um motivo só: o mutante M18 sobreviveu (LLMS-03). O commit `91ec8d3` trocou o teste de prefixo em `src/lib/seo/llms.test.ts:29-31` pela linha exata da privacidade. Rodei M18 de novo num worktree temporário e ele agora morre (1 failed / 9 passed). O mesmo commit mudou a redação da PERF-09 na spec, que passa a aceitar `background-size` (como a ANIM-10 já aceitava), e isso fecha o spec-precision gap. Entre `3794753` e `91ec8d3` mudaram só `src/lib/seo/llms.test.ts` e `spec.md`, sem nenhum código de produção. Por isso rodei de novo só o `npm test` (410 passed). Os gates de build, navegador e Lighthouse da rodada 1 continuam valendo.

---

## Conclusão das tarefas

| Tarefa | Status | Observações |
| ---- | ------ | ----- |
| T1–T23 | ✅ Concluídas | Todas marcadas ✅ em tasks.md. Os checkboxes de "Done when" de T1–T19 ficaram `[ ]` (só T20+ marcados); é só um descuido no documento, os critérios foram conferidos aqui |
| T23 | ✅ Concluída | Adicionada na execução (causa real do CLS: o cabeçalho quebrava em duas linhas) |

Nenhum `SPEC_DEVIATION` no diff (`grep -rn SPEC_DEVIATION src tests scripts` vazio).

---

## Critérios de aceitação ancorados na spec

| AC | Resultado definido na spec | `file:line` + asserção | Resultado |
| -- | -------------------- | ----------------------- | ------ |
| SECH-01 | `X-Content-Type-Options: nosniff` em toda resposta | `tests/netlify-config.test.ts:41,49` `expect(header("X-Content-Type-Options")).toBe("nosniff")`; `:37` `expect(rules.map(r => r.for)).toEqual(["/*"])` | ✅ |
| SECH-02 | `X-Frame-Options: DENY` | `tests/netlify-config.test.ts:42,49` `toBe("DENY")` | ✅ |
| SECH-03 | `Referrer-Policy: strict-origin-when-cross-origin` | `tests/netlify-config.test.ts:43,49` `toBe("strict-origin-when-cross-origin")` | ✅ |
| SECH-04 | Permissions-Policy com camera, microphone, geolocation, payment e browsing-topics `=()` | `tests/netlify-config.test.ts:44,49` valor exato; `:54-55` `expect(features).toContain(feature)` para as 5 features (o `usb=()` a mais é permitido) | ✅ |
| SECH-05 | `Cross-Origin-Opener-Policy: same-origin` | `tests/netlify-config.test.ts:45,49` `toBe("same-origin")` | ✅ |
| SECH-06 | `Cross-Origin-Embedder-Policy: require-corp` | `tests/netlify-config.test.ts:46,49` `toBe("require-corp")` (M3 morto) | ✅ |
| SECH-07 | `Cross-Origin-Resource-Policy: same-origin` | `tests/netlify-config.test.ts:47,49` `toBe("same-origin")` | ✅ |
| CSP-01 | Cabeçalho CSP em toda página HTML | `tests/netlify-config.test.ts:60` `expect(header("Content-Security-Policy")).toBe("default-src 'self'; script-src 'self'; ...")`; `tests/browser/csp.test.ts:114` `expect(csp).toContain("script-src 'self'")` na resposta HTTP de 4 páginas | ✅ |
| CSP-02 | `default-src 'self'`, `frame-ancestors 'none'`, `base-uri 'self'`, `form-action 'self'`, `object-src 'none'` | `tests/netlify-config.test.ts:75-82` `expect(csp()[name]).toEqual(sources)` por diretiva (M1 morto) | ✅ |
| CSP-03 | `script-src` sem `'unsafe-inline'`/`'unsafe-eval'` | `tests/netlify-config.test.ts:86-89` `expect(scripts).toEqual(["'self'"])` + `not.toContain` (M2 morto) | ✅ |
| CSP-04 | Zero violações de CSP e zero erros de COEP/CORP no console do Chromium | `tests/browser/csp.test.ts:115` `expect(issues).toEqual([])` (console error, pageerror, requestfailed, `securitypolicyviolation`) em `/`, `/criacao-de-sites/`, `/privacidade/`, 404; controle negativo em `:173-174`. Execução: 9/9 passaram (M16 e M17 mortos) | ✅ |
| CSP-05 | Formulário válido chega a `/api/contato` e mostra sucesso | `tests/browser/csp.test.ts:158` `expect(sent).toEqual([{ method: "POST", body: {...} }])`; `:161` `toMatch(/^Mensagem enviada!/)`; `:163` `expect(issues).toEqual([])` (a rota é dublada no Playwright; o servidor real é coberto pelos testes da API) | ✅ |
| CSP-06 | `.reveal` recebe `is-visible`; menu mobile abre e fecha | `tests/browser/csp.test.ts:124` `expect(await hiddenReveals(page)).toEqual([])`; `:136` `aria-expanded` `"true"`, `:139` `"false"`, `:137,:140` visibilidade do painel | ✅ |
| BOT-01 | Grupo com `Allow: /` para cada um dos 9 bots | `src/pages/_robots.test.ts:42` `expect(groups).toContain(\`User-agent: ${bot}\nAllow: /\nDisallow: /api/\`)` com os 9 nomes literais da spec (M4 morto) | ✅ |
| BOT-02 | `Disallow: /api/` em cada grupo de IA | `src/pages/_robots.test.ts:42` (mesmo grupo) | ✅ |
| BOT-03 | Grupo `*` com Allow, Disallow e linha Sitemap mantidos | `src/pages/_robots.test.ts:47` `toBe("User-agent: *\nAllow: /\nDisallow: /api/")`; `:48` Sitemap por último; `:49` `toHaveLength(bots.length + 2)` | ✅ |
| RMETA-01 | `<meta name="robots" content="index, follow, max-snippet:-1, max-image-preview:large, max-video-preview:-1">` | `src/layouts/BaseLayout.test.ts:60-62` `toHaveLength(1)` + `toBe("index, follow, max-snippet:-1, ...")` (M6 morto). Layout compartilhado; conferido no `dist/` das 7 páginas indexáveis | ✅ |
| RMETA-02 | 404 mantém `noindex` e não tem `index, follow` | `src/pages/_404.test.ts:32` `toBe("noindex")`; `:37` `not.toContain("index, follow")`; `src/layouts/BaseLayout.test.ts:103,105` | ✅ |
| LLMS-01 | `/llms.txt` 200, `text/plain; charset=utf-8` | `src/pages/_llms.test.ts:16-17` `toBe(200)` / `toBe("text/plain; charset=utf-8")` | ✅ |
| LLMS-02 | Começa com `# Leonardo Gomes Assunção` + linha `>` igual à descrição da home, nos primeiros 500 caracteres | `src/lib/seo/llms.test.ts:19` `startsWith("# Leonardo Gomes Assunção\n")`; `:20` `expect(abertura).toContain(\`\n> ${HOME}\n\`)` com `abertura = txt.slice(0, 500)` | ✅ |
| LLMS-03 | Links Markdown absolutos para home, cada serviço e privacidade, cada um com descrição de uma linha | `src/lib/seo/llms.test.ts:25` home exata; `:27` cada serviço exato; `:29-31` `expect(linhas).toContain("- [Privacidade](https://www.exemplo.com.br/privacidade/): Como os dados enviados pelo formulário e pelo WhatsApp são tratados.")` (M18 morto na rodada 2; na rodada 1 era só prefixo e M18 sobreviveu) | ✅ |
| LLMS-04 | Cidade, área, e-mail, WhatsApp e CNPJ vindos da config | `src/lib/seo/llms.test.ts:34-39` `toContain` de cada valor do dublê, diferente do de produção (M11 morto) | ✅ |
| LLMS-05 | `<link rel="alternate" type="text/plain" href="/llms.txt" title="llms.txt">` em toda página | `src/layouts/BaseLayout.test.ts:115-116` `href` `"/llms.txt"`, `title` `"llms.txt"`, para página indexável e noindex | ✅ |
| LLMS-06 | Serviço novo listado sem editar o gerador | `src/lib/seo/llms.test.ts:43` `toContain("- [Serviço Novo](https://www.exemplo.com.br/servico-novo/): Descrição única do serviço novo.")` | ✅ |
| SECTXT-01 | `/.well-known/security.txt` 200, `text/plain; charset=utf-8` | `src/pages/.well-known/_security.test.ts:13-14`; `tests/build/security-txt.test.ts:12` (arquivo no `dist/`) | ✅ |
| SECTXT-02 | `Contact: mailto:<site.email>` | `src/lib/seo/security-txt.test.ts:16` `toContain("Contact: mailto:contato@exemplo.com.br")` | ✅ |
| SECTXT-03 | `Expires` em ISO 8601 UTC = data do build + 364 dias | `src/lib/seo/security-txt.test.ts:12` `toContain("Expires: 2027-10-03T12:00:00Z")` para `now = 2026-10-04T12:00:00Z` (M5 morto) | ✅ |
| SECTXT-04 | `Canonical: https://www.leonardoassuncao.com.br/.well-known/security.txt` | `src/lib/seo/security-txt.test.ts:20` (host da config); `tests/build/security-txt.test.ts:13` valor de produção exato | ✅ |
| SECTXT-05 | `Preferred-Languages: pt-BR, en` | `src/lib/seo/security-txt.test.ts:24` | ✅ |
| SECTXT-06 | `Policy:` com a página de privacidade no host canônico | `src/lib/seo/security-txt.test.ts:28`; `tests/build/security-txt.test.ts:15` | ✅ |
| PERF-05 | CLS ≤ 0,1 na home em 3 execuções do Lighthouse mobile | `scripts/lighthouse.mjs:15` `MAX_CLS = 0.1`, `:13` `RUNS = 3`. Execução: `/` CLS 0.000 / 0.000 / 0.000, saída 0 | ✅ |
| PERF-06 | CLS ≤ 0,1 em `/criacao-de-sites/` em 3 execuções | `scripts/lighthouse.mjs:12` `PAGES`. Execução: CLS 0.027 / 0.027 / 0.027 | ✅ |
| PERF-07 | Performance ≥ 95 na home | `scripts/lighthouse.mjs:16` `MIN_PERFORMANCE = 0.95`. Execução: `/` 97 / 97 / 97 (`/criacao-de-sites/` 98) | ✅ |
| PERF-08 | Fallback com métricas ajustadas | `tests/font-fallback.test.ts:19` `size-adjust`/`ascent-override`/`descent-override`/`line-gap-override` em %; `:28` `--font-sans` exato; o resultado aparece no CLS medido | ✅ |
| PERF-09 | (redação de `91ec8d3`) `@keyframes` e `transition` animam só `opacity`, `transform` e `background-size`, nunca propriedades de layout | `tests/animations-css.test.ts:97` `ALLOWED = ["opacity","transform","background-size"]`; `:103` `@keyframes` e `:110` `transition` com `expect(props.filter(p => !ALLOWED.includes(p))).toEqual([])` | ✅ (na rodada 1 era ⚠️ spec-precision gap: a spec dizia só opacity e transform) |
| LD-10 | `"@type": ["Organization", "ProfessionalService"]` | `src/lib/seo/schema.test.ts:80` `toEqual(["Organization", "ProfessionalService"])` (M8 morto) | ✅ |
| LD-11 | `knowsAbout` = nomes dos serviços, na ordem do arquivo | `src/lib/seo/schema.test.ts:84-91` lista literal + `toEqual(services.map(s => s.name))` (M7 morto) | ✅ |
| LD-12 | `site.linkedin` exato; `sameAs` nos nós da empresa e da pessoa | `src/config/site.test.ts:25` `toBe("https://www.linkedin.com/in/leonardo-gomes-assuncao")`; `src/lib/seo/schema.test.ts:112-113` `sameAs` `toEqual([url])` | ✅ |
| LD-14 | Mantém `hasOfferCatalog`, `address`, `name`, `url` | `src/lib/seo/schema.test.ts:95-98`; `:51` catálogo completo | ✅ |
| LD-15 | Sem LinkedIn, sem a chave `sameAs` | `src/lib/seo/schema.test.ts:105-106` `not.toHaveProperty("sameAs")` | ✅ |
| SEO-07 | Título da home ≤ 60 caracteres | `src/layouts/BaseLayout.test.ts:27` título exato (60 caracteres); `src/pages/_index.test.ts:121`; `tests/build/titles.test.ts:19` `toBeLessThanOrEqual(60)` | ✅ |
| SEO-08 | Todo `<title>` ≤ 60 | `tests/build/titles.test.ts:15-19` `it.each(htmls)` sobre todo `dist/**/*.html` | ✅ |
| MANI-01 | `/site.webmanifest` 200 com os campos e os ícones 192 e 512 PNG | `src/pages/_site.webmanifest.test.ts:8` `toBe(200)`; `:14-22` `toMatchObject` com valores exatos (M12 morto); `:27-30` ícones; `tests/icons.test.ts:34` PNG 192×192 | ✅ |
| MANI-02 | `<link rel="manifest" href="/site.webmanifest">` em toda página | `src/layouts/BaseLayout.test.ts:113` (indexável e noindex) | ✅ |
| I18N-01 | hreflang `pt-BR` e `x-default` apontando para a canônica | `src/layouts/BaseLayout.test.ts:94-97` `toEqual([["pt-BR", canon], ["x-default", canon]])` (M13 morto) | ✅ |
| I18N-02 | 404 sem hreflang | `src/pages/_404.test.ts:36` `expect(doc.querySelector("link[hreflang]")).toBeNull()`; `src/layouts/BaseLayout.test.ts:104` | ✅ |
| SMAP-01 | `<lastmod>` = data do último commit nas fontes da página | `tests/build/sitemap.test.ts:38-42` compara cada `<lastmod>` com `git log -1 --format=%cI -- <fontes>`; `src/lib/seo/lastmod.test.ts:20-21,72-73` | ✅ |
| SMAP-02 | Sem histórico git: sem `<lastmod>` e o build não falha | `src/lib/seo/lastmod.test.ts:26-27` (clone raso, M9 morto), `:34` (git lança erro), `:39`, `:44`, `:78` `toEqual({ url })`; `tests/build/sitemap.test.ts:33-34` | ✅ |
| A11Y-06 | Pergunta como `<h3>` dentro do `<summary>`, visual igual | `src/components/Faq.test.ts:53-54` exatamente um `h3` com o texto; `:62` `font: inherit` (mais `margin: 0` e `display: inline`) | ✅ |
| A11Y-07 | Honeypot fora de qualquer `aria-hidden="true"` | `src/components/Contact.test.ts:77` `expect(honeypot.closest('[aria-hidden="true"]')).toBeNull()` (M10 morto) | ✅ |
| A11Y-08 | `tabindex="-1"`, `autocomplete="off"`, fora da tela, rótulo exato | `src/components/Contact.test.ts:74-75`, `:81` `toBe("Deixe este campo em branco")`, `:89-90` `position: absolute` / `left: -10000px` | ✅ |
| A11Y-09 | Honeypot preenchido continua rejeitado (FORM-10) | `src/lib/contact/handler.test.ts:89` `toEqual({ status: 200, body: { ok: true } })` + `send` não chamado; `tests/build/secrets.test.ts:55-56` na função publicada (sem mudança no diff) | ✅ |
| LLMS-07 | `/llms-full.txt` 200, `text/plain; charset=utf-8` | `src/pages/_llms-full.test.ts:17-18` | ✅ |
| LLMS-08 | Nome, URL canônica e descrição completa de cada serviço | `src/lib/seo/llms.test.ts:57-59` (inclui um serviço extra); `:73-74` texto das seções; `src/pages/_llms-full.test.ts:23-24` | ✅ |
| LLMS-09 | Toda pergunta e resposta do FAQ | `src/lib/seo/llms.test.ts:64-67`; `src/pages/_llms-full.test.ts:25-27` | ✅ |
| LLMS-10 | `/llms.txt` aponta `/llms-full.txt` sob `## Optional` | `src/lib/seo/llms.test.ts:47-48` (M14 morto) | ✅ |
| EDGE-09 | Script inline sem hash quebra o teste de build e nomeia a página | `tests/build/inline-scripts.test.ts:48` `expect(inlineScriptPages(built)).toEqual([])`; fixture `:57`. M15 morto com `+ "index.html"` no diff da asserção | ✅ |
| EDGE-10 | Recurso de outra origem quebra o teste de navegador e nomeia a URL | `tests/browser/csp.test.ts:67` registra `outra origem: <url>`, `:115` `toEqual([])`. M17 morto com `"outra origem: https://example.com/pixel.png"` | ✅ |
| EDGE-11 | `Expires` posterior à data do build | `src/lib/seo/security-txt.test.ts:35` `toBeGreaterThan(agora.getTime())`; `tests/build/security-txt.test.ts:20` `toBeGreaterThan(Date.now())` | ✅ |
| EDGE-12 | E-mail vazio faz o build falhar | `tests/astro-config.test.ts:22-23` `rejects.toThrow("Configuração inválida: email")` (o mesmo `astro.config.mjs` gera security.txt e llms.txt) | ✅ |
| EDGE-13 | Cabeçalhos também em llms.txt, llms-full.txt, security.txt e manifest | `tests/netlify-config.test.ts:37` regra única `for = "/*"`; os quatro arquivos são estáticos no `dist/` | ✅ (risco residual: ver gap 3) |
| EDGE-14 | `/api/contato` com os mesmos status e corpos | `src/lib/contact/handler.test.ts` e `src/pages/api/_contato.test.ts` sem mudança no diff e verdes (por exemplo `src/pages/api/_contato.test.ts:59` `toBe(429)`, `:89` `toBe(502)`). A única mudança perto da API é `z.config({ jitless: true })` em `src/lib/contact/validation.ts:4`, coberta por `src/lib/contact/validation.test.ts` | ✅ |

**Status**: ✅ 62/62 ACs batem com a spec; 0 gaps (rodada 1: 1 GAP em LLMS-03 e 1 spec-precision gap em PERF-09, os dois fechados em `91ec8d3`)

### Regra de payload/conjunção (saídas geradas)

- **llms.txt**: título, resumo, cada link (home e serviços como linha exata), cidade, área, e-mail, WhatsApp (exibição e `wa.me`), CNPJ e a seção Optional são verificados por valor. A descrição da privacidade era a única exceção; desde `91ec8d3` também é verificada como linha exata.
- **security.txt**: os 5 campos são verificados por linha exata, com dublê de host e e-mail diferente do de produção; o build confere de novo os valores reais.
- **manifest**: os 7 campos por valor exato (`toMatchObject`) e o array de ícones por `toEqual`.
- **JSON-LD**: `@type` (array exato), `knowsAbout` (lista exata e ordenada), `sameAs` (array exato nos dois nós; ausência da chave sem LinkedIn), e o restante dos campos da empresa.

---

## Sensor de discriminação

Scratch: `git worktree add --detach <scratchpad>/wt HEAD`, com `node_modules` ligado por symlink. Cada mutante foi aplicado sozinho, com `git checkout -- .` entre eles. Depois o worktree foi removido com `git worktree remove --force`. Baseline do `git status --porcelain` real antes e depois: `?? .claude/` (igual). Rodada 2: M18 de novo em `<scratchpad>/wt3` a partir de `91ec8d3`; baseline (` M .specs/LESSONS.md`, ` M .specs/lessons.json`, `?? .claude/`, `?? .../validation.md`) igual antes e depois.

| # | Mutação | Arquivo | Testes rodados | Resultado |
| - | ------- | ------- | -------------- | --------- |
| M1 | Remove `frame-ancestors 'none'` da CSP | `netlify.toml:27` | `tests/netlify-config.test.ts` | ✅ Morto (CSP-01, CSP-02) |
| M2 | `script-src 'self' 'unsafe-inline'` | `netlify.toml:27` | `tests/netlify-config.test.ts` | ✅ Morto (CSP-01, CSP-03) |
| M3 | COEP `require-corp` → `credentialless` | `netlify.toml:25` | `tests/netlify-config.test.ts` | ✅ Morto |
| M4 | Remove `Claude-SearchBot` de `AI_BOTS` | `src/pages/robots.txt.ts:10` | `src/pages/_robots.test.ts` | ✅ Morto (BOT-01, BOT-03) |
| M5 | `Expires` + 365 dias em vez de 364 | `src/lib/seo/security-txt.ts:7` | `security-txt.test.ts`, `_security.test.ts` | ✅ Morto (SECTXT-03) |
| M6 | `max-snippet:-1` → `max-snippet:160` | `src/layouts/BaseLayout.astro:48` | `src/layouts`, `_index`, `_404` | ✅ Morto (RMETA-01) |
| M7 | `knowsAbout` sem o primeiro serviço | `src/lib/seo/schema.ts:42` | `schema.test.ts`, `src/layouts` | ✅ Morto (LD-11) |
| M8 | `@type` volta a ser a string `"ProfessionalService"` | `src/lib/seo/schema.ts:28` | `schema.test.ts`, `src/layouts` | ✅ Morto (LD-10) |
| M9 | Guarda de clone raso desativada | `src/lib/seo/lastmod.ts:22` | `lastmod.test.ts` | ✅ Morto (SMAP-02 ×2) |
| M10 | `aria-hidden="true"` de volta no honeypot | `src/components/Contact.astro:112` | `Contact.test.ts` | ✅ Morto (A11Y-07) |
| M11 | CNPJ removido do llms.txt | `src/lib/seo/llms.ts:16` | `llms.test.ts`, `_llms.test.ts` | ✅ Morto (LLMS-04) |
| M12 | Manifest `display: "standalone"` | `src/pages/site.webmanifest.ts:11` | `_site.webmanifest.test.ts` | ✅ Morto (MANI-01) |
| M13 | Remove o hreflang `x-default` | `src/layouts/BaseLayout.astro:52` | `src/layouts` | ✅ Morto (I18N-01) |
| M14 | `## Optional` → `## Extras` | `src/lib/seo/llms.ts:24` | `llms.test.ts` | ✅ Morto (LLMS-10) |
| M15 | `<script is:inline>` adicionado à home | `src/pages/index.astro:22` | `npm run build` + `tests/build/inline-scripts.test.ts` | ✅ Morto, nomeando `index.html` (EDGE-09) |
| M16 | Remove `z.config({ jitless: true })` | `src/lib/contact/validation.ts:4` | `npm run build` + `tests/browser` | ✅ Morto (6 casos: violação de `unsafe-eval` no console) |
| M17 | `<img src="https://example.com/pixel.png">` na home | `src/pages/index.astro:22` | `npm run build` + `tests/browser` | ✅ Morto, nomeando a URL (EDGE-10, CSP-04) |
| M18 | Descrição da privacidade esvaziada no llms.txt | `src/lib/seo/llms.ts:22` | `llms.test.ts`, `_llms.test.ts` | ✅ Morto na rodada 2 (1 failed / 9 passed, em LLMS-03). Na rodada 1 sobreviveu (10/10 verdes) porque `:29` só conferia o prefixo |

**Profundidade**: expandida (≥5; a feature é de segurança). 18 mutações.
**Result**: 18/18 mortos (rodada 1: 17/18)

---

## Qualidade do código

| Princípio | Status |
| --------- | ------ |
| Código mínimo | ✅ Geradores pequenos e puros; parser de TOML de 20 linhas em vez de dependência |
| Mudanças cirúrgicas | ✅ |
| Sem escopo extra | ✅ `usb=()` na Permissions-Policy vai além da spec, mas é inofensivo |
| Segue os padrões do projeto | ✅ Prefixo `_` em testes de rota, dublê de config, testes de build lendo `dist/` |
| Valores verificados batem com a spec | ✅ (LLMS-03 e PERF-09 corrigidos em `91ec8d3`) |
| Cobertura por camada | ✅ Unit (geradores) + rota + build + navegador |
| Todo teste mapeia para AC, edge case ou Done-when | ✅ (o teste do `.brand` mapeia para T23/PERF-05) |
| Diretrizes documentadas | nenhuma específica; padrões fortes aplicados |

Observação: `tests/build/inline-scripts.test.ts:5-6` diz que `secrets.test.ts` roda outro `astro build` e reescreve o `dist/`. Por isso o `test:build` passou a usar `--no-file-parallelism`. Funciona, mas contraria a lição candidata L-014 (um único build no `test:build`).

---

## Edge cases

- [x] EDGE-09: script inline quebra o build test, com o nome da página (M15)
- [x] EDGE-10: outra origem quebra o teste de navegador, com a URL (M17)
- [x] EDGE-11: `Expires` > data do build
- [x] EDGE-12: e-mail vazio falha o carregamento da configuração
- [x] EDGE-13: regra única `/*` (verificação em produção pendente, ver gap 3)
- [x] EDGE-14: testes da API sem mudança e verdes

---

## Gate check

Rodada 1: todos rodados de novo pelo Verifier, na árvore real (HEAD `3794753`). Rodada 2 (HEAD `91ec8d3`): `npm test` → 45 arquivos, 410 passed. Os outros gates não foram repetidos porque só um arquivo de teste e a spec mudaram.

| Gate | Comando | Saída |
| ---- | ------- | ----- |
| check | `npm run check` | 0 errors, 0 warnings, 1 hint (99 arquivos) |
| test | `npm test` | 45 arquivos, **410 passed**, 0 failed, 0 skipped |
| build | `npm run build` | Complete |
| test:build | `npm run test:build` | 5 arquivos, **54 passed** |
| browser | `npm run test:browser` | 1 arquivo, **9 passed** |
| lighthouse | `node scripts/lighthouse.mjs` | saída 0. `/`: CLS 0.000 ×3, Performance 97 ×3. `/criacao-de-sites/`: CLS 0.027 ×3, Performance 98 ×3 |

- **Testes antes da feature** (`npm test` em `7c19466`): 36 arquivos, 323 testes
- **Depois**: 45 arquivos, 410 testes (+87), além de 54 de build e 9 de navegador
- **Testes apagados ou enfraquecidos**: nenhum. A antiga asserção de `aria-hidden` no honeypot virou o oposto, como pede a A11Y-07. A checagem de fontes em `secrets.test.ts` ficou mais rígida (toda `url()` de fonte precisa vir de `/_astro/`)

---

## Fix plans

### Fix 1: LLMS-03, descrição da privacidade não verificada — ✅ aplicado em `91ec8d3`

`src/lib/seo/llms.test.ts:29-31` agora confere a linha exata. M18 morre.

### Fix 2: PERF-09, alinhar a redação — ✅ aplicado em `91ec8d3`

A spec agora diz "`opacity`, `transform` and `background-size` (the set already allowed by ANIM-10)", que é exatamente o que `tests/animations-css.test.ts:97` verifica.

---

## Gaps em ordem de prioridade

Nenhum gap bloqueante.

1. **Risco residual, só em produção** (não verificável aqui; não bloqueia): (a) os `[[headers]]` do `netlify.toml` podem não valer para respostas de Functions, então confira os cabeçalhos em `/api/contato` depois do deploy; (b) o `content-type` de `llms.txt` e `security.txt` publicados vem da Netlify pela extensão (o teste de rota só prova a `Response` do Astro), então confira `text/plain; charset=utf-8` em produção.

---

## Atualização da rastreabilidade

Os 62 requisitos → `Verified` em spec.md (LLMS-03 e PERF-09 passaram a `Verified` na rodada 2).

---

## Fora do veredito: bug que já existia (não é AC desta feature)

Depois de um envio com sucesso, `src/scripts/contact-form.ts:98` faz `form.hidden = true`, mas `.contact-form { display: flex }` em `src/components/Contact.astro:253-254` ganha do estilo padrão `[hidden] { display: none }`. O formulário continua visível. Tanto `src/scripts/contact-form.test.ts:159` quanto `tests/browser/csp.test.ts:162` só conferem o atributo `hidden`, não a visibilidade. Correção sugerida: `.contact-form[hidden] { display: none; }` e trocar a asserção do navegador por `expect(await page.locator(".contact-form").isVisible()).toBe(false)`.

---

## Pós-deploy (manual)

- [ ] Rodar de novo o GEO Checker (check.outrun.at) na home de produção, anotar o novo `resultId` aqui e conferir nota A (Security Headers 15/15, AI Bots 12/12, Robots Meta 10/10, security.txt 10/10, AI-Intent Meta 10/10)
- [ ] PageSpeed Insights mobile na home de produção: CLS ≤ 0,1 e Performance ≥ 95
- [ ] Rich Results Test e validator.schema.org: grafo com `["Organization","ProfessionalService"]`, `knowsAbout` e `sameAs` sem erros
- [ ] Bing Webmaster Tools: verificar o domínio e enviar o sitemap (considerar IndexNow)
- [ ] `curl -sI` em `/`, `/llms.txt`, `/.well-known/security.txt`, `/site.webmanifest`, uma URL 404 e `/api/contato` (POST): os 8 cabeçalhos presentes e `content-type` correto nos `.txt`
- [ ] Enviar o formulário em produção (sem regressão da CSP) e checar securityheaders.com (nota A ou maior)

---

## Resumo

**Overall**: ✅ Pronto para o deploy (falta só a verificação manual pós-deploy)

**Spec-anchored check**: 62/62 ACs batem com a spec; 0 spec-precision gaps abertos
**Sensor**: 18/18 mortos
**Gate**: check 0 erros; 410 unit (rodada 2) + 54 build + 9 browser passaram; Lighthouse dentro dos limites nas 6 execuções

**O que funciona**: cabeçalhos e CSP estrita (verificados por valor e no Chromium, com controle negativo), robots com bots de IA, llms.txt/llms-full.txt gerados dos dados, security.txt, manifest, metas e hreflang, JSON-LD enriquecido, lastmod real com fallback sem git, honeypot acessível, CLS corrigido (causa: o cabeçalho quebrava em duas linhas na troca da fonte).

**Próximo passo**: commitar os documentos, fazer o deploy e rodar a lista "Pós-deploy (manual)".

## Verificação em produção (2026-10-04, após `f3cd8e0`)

- **GEO Checker** (`resultId` d8056687): nota **A, 98%** (237/243). Antes: C, 71% (`aa05d5d3`).
  - Falhas restantes que contam pontos: `<noscript>` (fora de escopo), "CSS linked from `<head>`" (falso positivo: CSS embutido, PERF-01), títulos em forma de pergunta (o checker não reconhece as perguntas em português do FAQ em `<h3>`), ícone `maskable` no manifest (não estava na spec).
  - Informativas (sem pontos): SPF, DKIM, DMARC `p=none`, MTA-STS e Google Analytics. Todas ficam fora do código.
- **PageSpeed Insights mobile**: Performance 100, Acessibilidade 100, Boas práticas 100, SEO 100; LCP 854 ms; **CLS 0** (antes 0,32).
- **Cabeçalhos**: home, `/llms.txt`, `/.well-known/security.txt`, `/site.webmanifest` (`application/manifest+json`) e `/api/contato` com os 8 cabeçalhos. A 404 de caminho inexistente fica sem eles (risco aceito, ver Assumptions da spec).

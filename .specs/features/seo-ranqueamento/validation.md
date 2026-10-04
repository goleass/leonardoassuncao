# SEO e Ranqueamento — Validação

**Verdict**: PASS

**Data**: 2026-10-04
**Spec**: `.specs/features/seo-ranqueamento/spec.md`
**Diff range**: `main..HEAD` (branch `feat/seo-ranqueamento`, HEAD `87b3ddd`, 22 commits). Rodada 1: `main..2f0e334`. Rodada 2 (re-verificação): `2f0e334..87b3ddd` = `27d8bd6` (teste) + `87b3ddd` (lições)
**Verifier**: sub-agente independente (autor ≠ verificador)

**Iteração 2 de 3 (re-verificação): PASS.** Na rodada 1, a validação reprovou porque o mutante M13 sobreviveu: HOME-01 e HOME-02 só eram verificados no valor padrão do `BaseLayout`. O commit `27d8bd6` acrescentou em `src/pages/_index.test.ts:121-122` a asserção do title e da description exatos na home renderizada. M13 e a variante de descrição M13b agora morrem. Depois de `2f0e334` mudaram só `src/pages/_index.test.ts` (+10 linhas) e os arquivos de lições, sem nenhum código de produção, então nada mais pode ter regredido. Os 3 gates rodaram de novo.

---

## Conclusão das tarefas

| Tarefa | Status | Observações |
| ---- | ------ | ----- |
| T1–T17 | ✅ Concluídas | Marcadas ✅ em tasks.md, com os critérios de "Done when" marcados |
| T18 | ✅ Concluída | SPEC_DEVIATION registrado: os invariantes ficaram em `tests/build/secrets.test.ts`:171 (um único `astro build`) e não num novo `seo.test.ts`. Aceitável: a cobertura é equivalente |

---

## Critérios de aceitação ancorados na spec

| AC | Resultado definido na spec | `file:line` + asserção | Resultado |
| -- | -------------------- | ----------------------- | ------ |
| HOST-01 | `site.url` = `https://www.leonardoassuncao.com.br` | `src/config/site.test.ts:11` `expect(site).toEqual({ url: "https://www.leonardoassuncao.com.br", ... })`; `tests/astro-config.test.ts:29` `expect(config.site).toBe("https://www.leonardoassuncao.com.br")` | ✅ |
| HOST-02 | canonical, og:url, og:image e todas as URLs do JSON-LD no host www | `tests/build/secrets.test.ts:196-198` `toBe(\`${DOMAIN}${path}\`)` / `toBe(\`${DOMAIN}/og.png\`)` para as 7 páginas; `:206` `expect(urls.filter(u => !u.startsWith(\`${DOMAIN}/\`))).toEqual([])`; `:213` nenhum arquivo cita o host sem www | ✅ |
| HOST-03 | `Sitemap: https://www.../sitemap-index.xml`, vindo da config | `src/pages/_robots.test.ts:14` `toContain("Sitemap: https://www.exemplo.com.br/sitemap-index.xml")` (config mockada, o que prova a origem); `tests/build/secrets.test.ts:120` `toMatch(^Sitemap: ${DOMAIN}/sitemap-index\.xml$)` | ✅ |
| HOST-04 | `Disallow: /api/` | `src/pages/_robots.test.ts:19` `expect(lines).toContain("Disallow: /api/")` | ✅ |
| HOST-05 | netlify.app/<path> → 301 para www/<path> | `tests/netlify-config.test.ts:21` `expect(rule).toEqual({ from: "https://leonardoassuncao.netlify.app/*", to: "https://www.leonardoassuncao.com.br/:splat", status: "301", force: "true" })` | ✅ (só config; o `curl` em produção fica para depois do deploy) |
| HOST-06 | links internos terminam em "/" (exceto âncoras e API) | `tests/build/secrets.test.ts:219` `expect(hrefs.filter(h => !h.endsWith("/"))).toEqual([])` para as 7 páginas; `src/components/Footer.test.ts:18`, `src/components/Contact.test.ts:108` `a[href="/privacidade/"]` | ✅ |
| NOIDX-01 | 404 tem `<meta name="robots" content="noindex">` | `src/pages/_404.test.ts:32` `.getAttribute("content")).toBe("noindex")`; caso negativo em `src/layouts/BaseLayout.test.ts:59` | ✅ |
| NOIDX-02 | 404 sem canonical nem og:url | `src/pages/_404.test.ts:36-37` `toBeNull()` nos dois | ✅ |
| NOIDX-03 | sitemap sem URL com `404` | `tests/build/secrets.test.ts:106` `expect(urls).toEqual([7 URLs exatas])` (igualdade exata, sem 404) | ✅ |
| ICON-01 | ico 48×48, svg, apple 180×180, 512×512 publicados | `tests/icons.test.ts:21` `toContain("48x48")`, `:30` `{180,180}`, `:34` `{512,512}`; `tests/build/secrets.test.ts:236` os 4 arquivos existem em `dist/` | ✅ |
| ICON-02 | 3 tags `link` com href/sizes/type exatos | `src/layouts/BaseLayout.test.ts:46` `sizes` = `"48x48"`, `:48` `type` = `"image/svg+xml"`, `:49` `href` = `"/apple-touch-icon.png"` | ✅ |
| ICON-03 | `theme-color` `#0a1a33` | `src/layouts/BaseLayout.test.ts:53` `toBe("#0a1a33")` | ✅ |
| HOME-01 | título exato da home | `src/pages/_index.test.ts:121` `expect(doc.querySelector("title")?.textContent).toBe("Criação de Sites e Sistemas Web em Canoas/RS \| Leonardo Assunção")` (home renderizada); padrão do layout em `src/layouts/BaseLayout.test.ts:27` | ✅ (M13 morto na rodada 2) |
| HOME-02 | descrição exata (≤160) | `src/pages/_index.test.ts:122` `expect(doc.querySelector('meta[name="description"]')?.getAttribute("content")).toBe("Criação de sites, ... Atendo todo o Brasil.")` (home renderizada); `src/layouts/BaseLayout.test.ts:33` `≤160` | ✅ (M13b morto na rodada 2) |
| HOME-03 | `textContent` do h1 = `Construo software sob medida.` | `src/components/Hero.test.ts:28` `textContent?.replace(/\s+/g," ").trim()).toBe("Construo software sob medida.")` | ✅ |
| HOME-04 | palavras alternadas sites, sistemas, integrações, software, nessa ordem | `src/components/Hero.test.ts:24` `words.slice(0,4)).toEqual(["sites","sistemas","integrações","software"])` (atributos `data-word`) | ✅ DOM; a renderização visual (`content: attr(data-word)` em `Hero.astro` e a animação) não é testada automaticamente → conferir em UAT/visual |
| SVC-01 | exatamente 5 slugs | `src/pages/_servico.test.ts:20` `getStaticPaths` `toEqual([5 slugs])`; `src/data/services.test.ts:12` | ✅ |
| SVC-02 | 1 h1, title ≤60, description 70–160 | `src/pages/_servico.test.ts:45` `toHaveLength(1)`, `:49/:51` title/description iguais aos do módulo; `src/data/services.test.ts:25` `≤60`, `:29-30` `≥70`/`≤160` | ✅ |
| SVC-03 | títulos e descrições distintos dois a dois (7 páginas) | `tests/build/secrets.test.ts:225-226` `new Set(titles).size).toBe(PAGES.length)` | ✅ |
| SVC-04 | ≥600 palavras em `<article>` | `src/pages/_servico.test.ts:55` `words(article())).toBeGreaterThanOrEqual(600)` | ✅ |
| SVC-05 | ≥2 h2, ≥3 details/summary | `src/pages/_servico.test.ts:59-61` `h2 ≥ 2`, `details ≥ 3`, `summary` não nulo | ✅ |
| SVC-06 | trilha com "Início" → `/` e o serviço com `aria-current="page"` | `src/pages/_servico.test.ts:68` `"Início"`, `:69` `href` `"/"`, `:71` `[aria-current="page"]` texto = `service.name` | ✅ |
| SVC-07 | links para os outros 4 serviços | `src/pages/_servico.test.ts:76` `expect(hrefs).toEqual(services.filter(s => s !== service).map(...))` | ✅ |
| SVC-08 | seção `#contato` com o mesmo formulário da home | `src/pages/_servico.test.ts:80` `section#contato form` `action` = `"/api/contato"` (mesmo componente `Contact`) | ✅ (asserção mínima; o formulário vem do mesmo componente, já testado em `Contact.test.ts`) |
| SVC-09 | sitemap lista os 5 serviços | `tests/build/secrets.test.ts:106` lista exata com os 5 | ✅ |
| SVC-10 | sem clientes, contagens, anos de experiência ou métricas | `src/data/services.test.ts:43` `not.toMatch(/\d+\s*(\+\s*)?(clientes\|projetos\|anos\|%)/i)` + revisão manual de `src/data/services.ts` (abaixo) | ✅ |
| SVC-11 | conteúdo sem depender de animação | `src/pages/_servico.test.ts:84` `article().querySelectorAll(".reveal")).toHaveLength(0)` | ✅ |
| SVC-12 | "outros serviços" sem auto-link | `src/pages/_servico.test.ts:76` (a igualdade exata exclui o próprio slug); M6 morto | ✅ |
| LINK-01 | 5 cards da home → páginas na ordem do SVC-01 | `src/components/Services.test.ts:57` `toEqual(["/criacao-de-sites/", ..., "/manutencao-de-sistemas/"])` | ✅ |
| LINK-02 | rodapé com os 5 serviços + `/privacidade/` | `src/components/Footer.test.ts:24` `toEqual([[href, nome] × 5])`; `:18` `/privacidade/` | ✅ |
| LD-01 | um único script ld+json com `@context` e `@graph` | `src/layouts/BaseLayout.test.ts:92` `toHaveLength(1)`, `:93` `"https://schema.org"`, `:94` `Array.isArray(@graph)`; `src/lib/seo/schema.test.ts:124` | ✅ |
| LD-02 | ProfessionalService @id/name/url/logo/image/email/telephone/taxID/address/founder | `src/lib/seo/schema.test.ts:19` `@id` = `${BASE}#empresa`, `:22` logo `icon-512.png`, `:27-30` email/telephone/taxID/address, `:39` `founder` = `{ "@id": ${BASE}#leonardo }` | ✅ |
| LD-03 | areaServed: City Canoas, City Porto Alegre, Country Brasil | `src/lib/seo/schema.test.ts:43` `toEqual(AREA)`; `src/layouts/BaseLayout.test.ts:128` | ✅ |
| LD-04 | WebSite (#site, pt-BR, publisher→#empresa) e Person (#leonardo, nome) | `src/lib/seo/schema.test.ts:59-62`, `:67-68` | ✅ |
| LD-05 | catálogo com 5 Service e a url absoluta | `src/lib/seo/schema.test.ts:48` `toEqual(services.map(s => ({ "@type":"Service", name, url: \`${BASE}${s.slug}/\` })))` | ✅ |
| LD-06 | Service, BreadcrumbList (2 itens), FAQPage igual ao texto visível | `src/pages/_servico.test.ts:88-92` Service name/description/url/provider; `:97` breadcrumb `[[1,"Início",…],[2,name,…]]`; `:109` `expect(structured).toEqual(visible)`; `areaServed` em `src/lib/seo/schema.test.ts:90` | ✅ |
| LD-07 | FAQPage da home igual à FAQ visível | `src/pages/_index.test.ts:113-114` `toHaveLength(4)` + `toEqual(visible)` | ✅ |
| LD-08 | `<` escapado como `\u003c` | `src/lib/seo/schema.test.ts:132` `not.toContain("<")`, `:133` `toContain("\\u003c/script>")` | ✅ |
| LD-09 | com linkedin → `sameAs` na empresa e na pessoa | `src/lib/seo/schema.test.ts:75-76` (ausência), `:81-82` `sameAs` igual a `[linkedin]` | ✅ |
| PERF-01 | `build.inlineStylesheets` = `"always"` | `tests/astro-config.test.ts:37` `toBe("always")` | ✅ |
| PERF-02 | nenhum `<link rel="stylesheet">` no HTML | `tests/build/secrets.test.ts:231` `expect(blocking).toEqual([])` (7 páginas + 404) | ✅ |

**Status**: 41/41 ✅ (rodada 2). Nenhum spec-precision gap: os valores da spec são exatos e as asserções miram esses valores.

### SVC-10: revisão manual de `src/data/services.ts`

Não há nomes de clientes, contagens de projetos, anos de experiência, porcentagens nem métricas. Os pontos abaixo, só informativos, não violam o SVC-10, mas o usuário pode querer revisar antes do deploy (a premissa da spec diz que ele revisa o texto):
- `services.ts:87` "Uma landing page costuma ficar pronta em poucas semanas": promessa de prazo, sem número.
- `services.ts:133` "servidores com cópias de segurança automáticas" e `services.ts:394` "suporte contínuo inclui monitoramento": compromissos operacionais.
- `services.ts:203`/`:204` Pix, boletos, WhatsApp Business: capacidades de integração genéricas, sem marca de ERP nem de gateway.

---

## Sensor de discriminação

Scratch: `git worktree add --detach <scratchpad>/verify-wt HEAD`, com `node_modules` em symlink. Removido com `git worktree remove --force`. O `git status --porcelain` do repositório real ficou igual à linha de base (`?? .claude/`).

| # | Arquivo | Mutação | Testes executados | Morto? |
| - | --------- | -------- | ---------- | ------- |
| M1 | `src/pages/robots.txt.ts:7` | removida a linha `Disallow: /api/` | `_robots.test.ts` | ✅ morto (1 falhou) |
| M2 | `src/layouts/BaseLayout.astro` | `noindex ?` → `!noindex ?` | `_404.test.ts`, `BaseLayout.test.ts` | ✅ morto (4) |
| M3 | `src/lib/seo/schema.ts:15` | removido City "Porto Alegre" do areaServed | `schema.test.ts`, `BaseLayout.test.ts` | ✅ morto (3) |
| M4 | `src/lib/seo/schema.ts:65` | removido `sameAs` do Person | `schema.test.ts` | ✅ morto (1) |
| M5 | `src/components/Footer.astro` | href do serviço sem a barra final | `Footer.test.ts` | ✅ morto (1) |
| M6 | `src/pages/[servico].astro:21` | filtro `others` → `() => true` (auto-link) | `_servico.test.ts` | ✅ morto (5) |
| M7 | `src/lib/seo/schema.ts:102` | removido o escape `.replace(/</g, "\\u003c")` | `schema.test.ts` | ✅ morto (1) |
| M8 | `astro.config.mjs:16` | `inlineStylesheets` `"always"` → `"auto"` | `astro-config.test.ts` | ✅ morto (1) |
| M8b | `astro.config.mjs:16` | `"always"` → `"never"` (nível de build) | `tests/build` | ✅ morto (PERF-02) |
| M9 | `src/config/site.ts` | `url` sem www | `site.test.ts`, `astro-config.test.ts` | ✅ morto (2) |
| M10 | `src/lib/seo/schema.ts:19` | `abs()` devolve caminho relativo | `schema.test.ts` | ✅ morto (7) |
| M11 | `src/components/Services.astro` | card de serviço → `href="#contato"` | `Services.test.ts` | ✅ morto (1) |
| M12 | `src/components/Hero.astro` | palavras alternadas de volta como texto no `<h1>` | `Hero.test.ts` | ✅ morto (HOME-03) |
| M14 | `src/lib/seo/schema.ts:40` | `founder` → `#pessoa` | `schema.test.ts` | ✅ morto (1) |
| M15 | `src/components/Contact.astro` | link `/privacidade/` → `/privacidade` (nível de build) | `tests/build` | ✅ morto (6, HOST-06) |
| M13 (rodada 1) | `src/pages/index.astro:20` | `<BaseLayout ... title="Leonardo Gomes Assunção">` (sobrescreve o título da home) | `_index.test.ts`, `BaseLayout.test.ts`, depois `tests/build` inteiro | ❌ sobreviveu (31/31 e 38/38) → Fix 1 |
| M13 (rodada 2) | `src/pages/index.astro:20` | mesma mutação, em HEAD `87b3ddd` | `_index.test.ts` | ✅ morto (1 falhou de 8) |
| M13b (rodada 2) | `src/pages/index.astro:20` | `<BaseLayout ... description="Outra descrição…">` | `_index.test.ts` | ✅ morto (1 falhou de 8) |

**Profundidade do sensor**: ampliada (rodada 1: 16 mutações, 3 delas no nível de build; rodada 2: 2 mutações em worktree isolado `verify-wt2`, removido, porcelain igual à linha de base)
**Resultado**: rodada 1 15/16; rodada 2 2/2 mortos. Nenhum mutante vivo: ✅ PASS

---

## Qualidade do código

| Princípio | Status |
| --------- | ------ |
| Código mínimo | ✅ (`schema.ts` com funções puras pequenas; o conteúdo fica em `services.ts`) |
| Mudanças cirúrgicas | ✅ |
| Sem scope creep | ✅ (`scripts/icons.mjs` gera os ícones exigidos pelo ICON-01) |
| Segue os padrões do projeto | ✅ (testes com Container API + happy-dom, prefixo `_` em src/pages) |
| Checagem ancorada na spec | ✅ (HOME-01/02 agora na página renderizada) |
| Cobertura esperada por camada | ✅ funções puras 1:1; build com invariantes entre páginas |
| Todo teste mapeia para um requisito | ✅ |
| Diretrizes documentadas | tasks.md (Test Coverage Matrix) |

## Casos de borda

- [x] LD-09 com e sem LinkedIn (`schema.test.ts:75-82`)
- [x] SVC-11 sem dependência de `.reveal` (`_servico.test.ts:84`)
- [x] SVC-12 sem auto-link (`_servico.test.ts:76`, M6 morto)

---

## Gates

| Gate | Comando | Saída | Resultado |
| ---- | ------- | ---- | ------ |
| Tipos | `npm run check` | 0 | rodada 2: 0 erros, 0 avisos |
| Unit | `npm test` | 0 | rodada 2: 36 arquivos, 323 passaram (+1 HOME-01/02), 0 falharam, 0 pulados |
| Build | `npm run test:build` | 0 | rodada 2: 1 arquivo, 38 passaram, 0 falharam, 0 pulados |

- Integridade dos testes: nenhum arquivo de teste foi apagado (7 adicionados, 9 alterados). As asserções removidas foram trocadas por versões mais estritas ou atualizadas por mudança da spec: Services `#contato` → slugs; areaServed só Country → 3 lugares; host sem www → www; links `/privacidade` → `/privacidade/`. A contagem de testes antes da feature não foi medida.

---

## Planos de correção

### Fix 1: HOME-01/HOME-02 verificados na página inicial gerada

- **Causa raiz**: o título e a descrição da home vêm do valor padrão do `BaseLayout`. Os testes só confirmam esse padrão (`BaseLayout.test.ts:27`, `:37`), e o teste de build só exige títulos distintos (`secrets.test.ts:225`). Uma prop `title`/`description` em `index.astro` mudaria a home sem nenhum teste falhar.
- **Tarefa**: em `src/pages/_index.test.ts` (render da home), afirmar `doc.querySelector("title")?.textContent` igual a `"Criação de Sites e Sistemas Web em Canoas/RS | Leonardo Assunção"` e `meta[name="description"]` igual à descrição exata. Opcional: o mesmo em `dist/index.html` no describe de invariantes de `tests/build/secrets.test.ts`.
- **Verificação**: refazer M13; o mutante precisa morrer.
- **Prioridade**: Minor
- **Status**: ✅ Resolvido em `27d8bd6` e re-verificado na rodada 2 (M13 e M13b mortos)

---

## Atualização da rastreabilidade (proposta; spec.md não foi alterada pelo Verifier)

| Requisito | Novo status |
| ----------- | ---------- |
| HOME-01, HOME-02 | ✅ Verificados (rodada 2) |
| HOST-05 | ✅ Verificado na config; falta o `curl` depois do deploy |
| HOME-04 | ✅ Verificado no DOM; falta conferência visual em UAT |
| Os outros 37 | ✅ Verificados (rodada 1; nenhum código de produção mudou depois) |

## Resumo

**Geral**: ✅ Pronto (falta só o que é pós-deploy ou visual: `curl` do HOST-05 e conferência visual do HOME-04)
**Checagem ancorada na spec**: 41/41 ACs com evidência que discrimina; 0 spec-precision gaps
**Sensor**: rodada 1 15/16; rodada 2 2/2 (o sobrevivente M13 foi corrigido e morre)
**Gate**: 0 erros de tipo; 323 + 38 testes passaram
**Próximo passo**: UAT visual do hero (HOME-04), deploy e depois o `curl -I` em `https://leonardoassuncao.netlify.app/` (HOST-05) e os itens manuais de Success Criteria.

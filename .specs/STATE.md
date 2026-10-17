# STATE

## Decisions

### AD-001
- **Decision**: O site é Astro com saída estática; só endpoints que precisam de servidor usam `export const prerender = false`, publicados como funções serverless na Vercel via `@astrojs/vercel`.
- **Reason**: Página de marketing com quase nenhuma interatividade; HTML estático maximiza desempenho/SEO e mantém custo zero de servidor.
- **Trade-off**: Sem React/SSR completo; uma futura área logada exigiria rever esta escolha ou adicionar ilhas.
- **Scope**: Todo o site (páginas, endpoints, deploy).
- **Date**: 2026-10-04
- **Status**: superseded by AD-003

### AD-002
- **Decision**: E-mails transacionais do site saem pelo Resend, com a chave apenas em variável de ambiente de servidor (`astro:env`, `access: "secret"`).
- **Reason**: SDK oficial simples e plano gratuito suficiente; evita manter SMTP.
- **Trade-off**: Dependência de um fornecedor externo e da verificação de DNS do domínio.
- **Scope**: Formulário de contato e qualquer e-mail futuro enviado pelo site.
- **Date**: 2026-10-04
- **Status**: active

### AD-003
- **Decision**: O site é Astro com saída estática, e os endpoints sob demanda (`prerender = false`) rodam como Netlify Functions via `@astrojs/netlify`; o resto é estático em `dist/`.
- **Reason**: O plano gratuito da Vercel proíbe uso comercial (Fair Use Guidelines, 2026-09-14); o gratuito da Netlify permite, e o usuário não quer pagar hospedagem.
- **Trade-off**: Troca de fornecedor; o teste de build passa a depender da estrutura `.netlify/v1/functions/ssr/` do adaptador.
- **Scope**: Todo o site (páginas, endpoints, deploy). Substitui AD-001.
- **Date**: 2026-10-04
- **Status**: active

### AD-004
- **Decision**: O host canônico do site é `https://www.leonardoassuncao.com.br`; `site.url` usa esse valor e o subdomínio `leonardoassuncao.netlify.app` redireciona 301 para ele.
- **Reason**: A Netlify já serve o www com 200 e redireciona o domínio sem www para ele; canônica apontando para uma URL que redireciona confunde o Google.
- **Trade-off**: O e-mail continua em `@leonardoassuncao.com.br` (sem efeito); mudar o domínio principal no painel exigiria trocar `site.url` de volta.
- **Scope**: Canônicas, sitemap, robots, Open Graph e JSON-LD.
- **Date**: 2026-10-04
- **Status**: active

### AD-005
- **Decision**: Nenhuma página publica script executável inline; a CSP é um cabeçalho fixo em `netlify.toml` (`[[headers]] for = "/*"`) com `script-src 'self'`. Os scripts do Astro saem como arquivo (`vite.build.assetsInlineLimit: 0`) e o estado "com JS" no CSS usa `@media (scripting: enabled)`.
- **Reason**: Uma única regra cobre todo caminho (inclusive a 404 servida para URLs inexistentes), sem hashes por build nem recurso experimental do adaptador; o checker e `frame-ancestors` exigem cabeçalho, não `<meta>`.
- **Trade-off**: Todo script novo precisa ser módulo externo; terceiros (analytics, widgets) exigem editar a CSP e podem esbarrar no COEP `require-corp`.
- **Scope**: Todas as páginas e qualquer script/recurso futuro.
- **Date**: 2026-10-04
- **Status**: active

## Handoff

- **Feature**: `.specs/features/guias-nichos` (branch `feat/guias-nichos`, criada de `feat/guias-conteudo`; nenhuma das duas mesclada nem publicada)
- **Phase / Task**: Execute concluído, T1–T14 + correção do mutante M1b (teste do link de cluster de GN-11)
- **Completed**: Verificador PASS (sensor 13/13 após a correção), `validation.md` gravado; gate completo verde (687 unitários, 120 de build, 24 páginas)
- **In-progress** (file:line): none
- **Next step**: usuário revisar os 11 guias de nicho em `src/content/guias/` (faixas de preço da vidraçaria, fatos citados); depois merge de `feat/guias-conteudo` e `feat/guias-nichos` em main e push (deploy na Netlify) por onda, com autorização explícita
- **Blockers**: none
- **Uncommitted files**: none
- **Branch**: feat/guias-nichos

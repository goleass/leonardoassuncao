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

## Handoff

- **Feature**: `.specs/features/seo-ranqueamento`
- **Phase / Task**: Execute concluído (T1–T18); Verificador rodada 2 = PASS (41/41 ACs, 18 mutações, 0 sobreviventes)
- **Completed**: T1–T18 + correção de teste da rodada 1
- **In-progress** (file:line): none
- **Next step**: usuário revisa os textos de `src/data/services.ts`; com autorização, push da branch `feat/seo-ranqueamento`, merge e deploy. Depois do deploy: `curl -I https://leonardoassuncao.netlify.app/` (esperado 301 → www), Lighthouse em produção, Search Console (verificar domínio por DNS, enviar `sitemap-index.xml`, pedir indexação das 7 URLs), Perfil da Empresa no Google, Rich Results Test na home e numa página de serviço
- **Blockers**: autorização de push/deploy
- **Uncommitted files**: none
- **Branch**: feat/seo-ranqueamento

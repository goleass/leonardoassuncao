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

## Handoff

- **Feature**: `.specs/features/site-institucional`
- **Phase / Task**: Execute concluído (T1–T42); validação rodada 4 (extra, autorizada) = FAIL só por lacunas de teste
- **Completed**: T1–T42
- **In-progress** (file:line): none
- **Next step**: Deploy na Netlify (usuário). Pendente decisão do usuário: aplicar 2 correções de teste (bootstrap do formulário em `Contact.astro:150-151` → helper testado; posição do link de privacidade junto ao botão) e re-verificar, ou aceitar; depois UAT do checklist manual
- **Blockers**: decisão do usuário
- **Uncommitted files**: `.specs/features/site-institucional/validation.md`, `.specs/STATE.md`
- **Branch**: feat/site-institucional

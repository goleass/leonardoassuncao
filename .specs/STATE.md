# STATE

## Decisions

### AD-001
- **Decision**: O site é Astro com saída estática; só endpoints que precisam de servidor usam `export const prerender = false`, publicados como funções serverless na Vercel via `@astrojs/vercel`.
- **Reason**: Página de marketing com quase nenhuma interatividade; HTML estático maximiza desempenho/SEO e mantém custo zero de servidor.
- **Trade-off**: Sem React/SSR completo; uma futura área logada exigiria rever esta escolha ou adicionar ilhas.
- **Scope**: Todo o site (páginas, endpoints, deploy).
- **Date**: 2026-10-04
- **Status**: active

### AD-002
- **Decision**: E-mails transacionais do site saem pelo Resend, com a chave apenas em variável de ambiente de servidor (`astro:env`, `access: "secret"`).
- **Reason**: SDK oficial simples e plano gratuito suficiente; evita manter SMTP.
- **Trade-off**: Dependência de um fornecedor externo e da verificação de DNS do domínio.
- **Scope**: Formulário de contato e qualquer e-mail futuro enviado pelo site.
- **Date**: 2026-10-04
- **Status**: active

## Handoff


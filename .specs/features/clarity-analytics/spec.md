# Clarity Analytics Specification

## Problem Statement

O dono do site não tem dados de como os visitantes usam as páginas. O Microsoft Clarity (projeto `z96a82cx1w`) resolve isso, mas o snippet oficial é inline e a CSP e o COEP do site o bloqueiam (AD-005). A política de privacidade também precisa passar a declarar essa coleta.

## Goals

- [ ] O Clarity recebe dados de visitas no domínio oficial, sem violação de CSP ou COEP.
- [ ] Nenhuma página publica script executável inline.
- [ ] A página /privacidade descreve o Clarity antes da publicação.

## Out of Scope

| Feature | Reason |
| ------- | ------ |
| Banner de consentimento | Decisão do usuário: Clarity ativo para todos, com aviso em /privacidade |
| Eventos e tags personalizados | Não pedidos |
| Mudar `Cross-Origin-Resource-Policy` para melhorar a reprodução das gravações | Enfraquece um cabeçalho sem necessidade para a coleta |
| Deploy | Exige autorização separada |

---

## Assumptions & Open Questions

| Assumption / decision | Chosen default | Rationale | Confirmed? |
| --------------------- | -------------- | --------- | ---------- |
| Valor do COEP | `credentialless` | Os arquivos do Clarity não enviam CORP; este valor mantém o isolamento e aceita o script | y |
| Consentimento | Sem banner, com aviso em /privacidade | Decisão do usuário; base legal de legítimo interesse a confirmar juridicamente se o risco importar | y |
| Onde o Clarity roda | Só em `www.leonardoassuncao.com.br` | Testes, localhost e deploy previews não devem sujar os dados | n |
| Origens de script | `https://www.clarity.ms` e `https://scripts.clarity.ms` | São as duas observadas na tag; menor superfície que `*.clarity.ms` em script-src | n |
| Origens de conexão e imagem | `https://*.clarity.ms` e `https://c.bing.com` | Lista da documentação da Microsoft, que faz balanceamento entre subdomínios | n |
| Formulário nas gravações | `data-clarity-mask="true"` no formulário de contato | Garante a máscara mesmo se o modo do projeto mudar no painel | n |

**Open questions:** none - all resolved or logged above.

---

## User Stories

### P1: Rastrear visitas com o Clarity ⭐ MVP

**User Story**: Como dono do site, quero o Clarity ativo nas páginas publicadas para entender como os visitantes usam o site.

**Why P1**: É o pedido.

**Acceptance Criteria**:

1. CLAR-01: WHEN uma página é aberta em `www.leonardoassuncao.com.br` THEN o site SHALL carregar `https://www.clarity.ms/tag/z96a82cx1w` com um elemento `<script async>`.
2. CLAR-02: WHEN uma página é aberta em `www.leonardoassuncao.com.br` THEN o site SHALL criar a fila `window.clarity` antes de carregar a tag, guardando as chamadas em `window.clarity.q`.
3. CLAR-03: IF a página é aberta em qualquer outro host THEN o site SHALL não criar `window.clarity` e não fazer requisição ao Clarity.
4. CLAR-04: The site SHALL carregar o Clarity a partir de um módulo externo, sem `<script>` executável inline em nenhuma página.
5. CLAR-05: The site SHALL enviar em toda resposta a CSP com `script-src 'self' https://www.clarity.ms https://scripts.clarity.ms`, `img-src 'self' data: https://*.clarity.ms https://c.bing.com` e `connect-src 'self' https://*.clarity.ms https://c.bing.com`, sem `'unsafe-inline'` nem `'unsafe-eval'` em script-src.
6. CLAR-06: The site SHALL enviar em toda resposta `Cross-Origin-Embedder-Policy: credentialless`.
7. CLAR-07: WHEN uma página é aberta no domínio oficial sob os cabeçalhos publicados THEN o navegador SHALL carregar a tag, o `clarity.js`, o `c.gif` e o envio de dados sem violação de CSP nem bloqueio de COEP, mesmo sem cabeçalho CORP nessas respostas.
8. CLAR-08: The site SHALL marcar o formulário de contato com `data-clarity-mask="true"`.

**Independent Test**: abrir o `dist/` sob a URL oficial no Chromium, com os cabeçalhos do `netlify.toml`, e observar as requisições ao Clarity sem violação.

---

### P1: Declarar a coleta na política de privacidade ⭐ MVP

**User Story**: Como visitante, quero saber que minha navegação é analisada e por quem.

**Why P1**: O site não pode coletar dados que a própria política omite.

**Acceptance Criteria**:

1. CLAR-09: The /privacidade SHALL ter uma seção "Análise de navegação" que nomeia o Microsoft Clarity, os dados coletados (páginas, cliques, rolagem e gravações da sessão), os cookies `_clck` e `_clsk` como exemplos, como bloqueá-los no navegador e a finalidade de melhorar o site.
2. CLAR-10: The /privacidade SHALL informar que o conteúdo dos campos do formulário de contato é mascarado nas gravações.
3. CLAR-11: The /privacidade SHALL deixar de limitar sua introdução ao formulário de contato, citando também a análise de navegação.

4. CLAR-14: The /privacidade SHALL informar que, dependendo do navegador, a Microsoft também pode usar cookies próprios, inclusive para publicidade.

**Independent Test**: renderizar a página e ler as frases exigidas.

---

## Edge Cases

- CLAR-13: IF a tag do Clarity falhar ao carregar THEN a página SHALL manter o conteúdo e as animações de entrada, sem `pageerror`.
- CLAR-12: IF `window.clarity` já existe THEN o site SHALL manter a função existente, sem substituí-la, e SHALL carregar a tag.

---

## Requirement Traceability

| Requirement ID | Story | Phase | Status |
| -------------- | ----- | ----- | ------ |
| CLAR-01 | P1: Rastrear | Execute | Implementing |
| CLAR-02 | P1: Rastrear | Execute | Implementing |
| CLAR-03 | P1: Rastrear | Execute | Implementing |
| CLAR-04 | P1: Rastrear | Execute | Implementing |
| CLAR-05 | P1: Rastrear | Execute | Implementing |
| CLAR-06 | P1: Rastrear | Execute | Implementing |
| CLAR-07 | P1: Rastrear | Execute | Implementing |
| CLAR-08 | P1: Rastrear | Execute | Implementing |
| CLAR-09 | P1: Política | Execute | Implementing |
| CLAR-10 | P1: Política | Execute | Implementing |
| CLAR-11 | P1: Política | Execute | Implementing |
| CLAR-12 | P1: Rastrear | Execute | Implementing |
| CLAR-13 | P1: Rastrear | Execute | Implementing |
| CLAR-14 | P1: Política | Execute | Implementing |

**Coverage:** 14 total, 14 mapped to execute steps, 0 unmapped.

---

## Success Criteria

- [ ] Em uma execução real no Chromium, com a rede do Clarity, nenhuma requisição é bloqueada e o envio a `*.clarity.ms` responde com sucesso.
- [ ] Depois do deploy, o painel do Clarity mostra as visitas (confirmação do usuário).

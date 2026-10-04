# Site Institucional Context

**Gathered:** 2026-10-04
**Spec:** `.specs/features/site-institucional/spec.md`
**Status:** Ready for design

---

## Feature Boundary

Uma landing page única (mais `/privacidade` e 404) para a empresa Leonardo Gomes Assunção, fiel ao conceito aprovado no Claude Design, com formulário de contato que envia e-mail e oferece continuação no WhatsApp.

---

## Implementation Decisions

### Formulário de contato

- O envio manda um e-mail ao responsável (servidor + serviço de envio de e-mail).
- Depois do sucesso, o visitante vê a confirmação e um botão "Continuar no WhatsApp" com texto pré-preenchido.
- Em falha, o visitante recebe links de WhatsApp e e-mail como plano B, sem perder o que digitou.

### Escopo da primeira entrega

- Só a landing page, mais `/privacidade` e a página 404.
- Estudos de caso e blog ficam para fases seguintes.

### Direção visual (decidida durante a exploração no Claude Design)

- Linha editorial suíça: tipografia Archivo grande e levemente expandida, grid com linhas finas, sem cards arredondados, sombras ou degradês.
- Sem fonte monoespaçada, sem selo "Aceitando novos projetos".
- Paleta azul "marinho": fundo escuro #0A1A33, azul de marca #143E7A, destaque #5B95FF, cinzas frios.
- Animações: entrada do título, palavra alternada, faixa em movimento com pausa no hover, hover de preenchimento nos serviços, marcador percorrendo o fluxo de integrações, revelação ao rolar, linhas que se desenham.

### Agent's Discretion

- Tecnologia, hospedagem e serviço de envio de e-mail (etapa de Design).
- Menu mobile em painel abaixo de 768px.
- Limite de 5 envios/IP/hora, timeout de 10s, texto pré-preenchido do WhatsApp.

### Declined / Undiscussed Gray Areas → Assumptions

- Paleta final entre marinho/oceano/indigo → marinho (registrado nas premissas da spec).
- Seções Projetos e Depoimento sem conteúdo real → ocultas até haver itens configurados.
- Faixa de tecnologias → não exibida na v1.

---

## Specific References

- Canvas aprovado: https://claude.ai/artifact/MmTLyPvYTwvrUfahAWqsYj (prancheta "Landing page — desktop", paleta "marinho").
- Referência de tom: escritórios de engenharia/consultoria; evitar a estética "gerada por IA" (fundo escuro + bloco de código + itálico serifado + rótulos monoespaçados).

---

## Deferred Ideas

- Páginas de estudo de caso por projeto.
- Blog técnico para SEO.
- Botão flutuante de WhatsApp.
- Analytics com respeito à privacidade.
- Perfil no Google Meu Negócio, domínio e e-mail profissional (fora do código).

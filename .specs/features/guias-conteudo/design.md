# Guias de Conteúdo — Design

**Spec**: `.specs/features/guias-conteudo/spec.md`
**Status**: Draft

---

## Architecture Overview

Coleção de conteúdo do Astro (`glob` loader) lê `src/content/guias/*.md`. Uma única função pura, `selectGuides`, transforma as entradas em `Guide` (objeto simples), valida o que o zod não alcança (slug, marcadores no corpo) e remove rascunhos em produção. Todo consumidor (rota do guia, `/guias/`, páginas de serviço, `llms.txt`) passa por `loadGuides()`, que chama `getCollection` + `selectGuides`. Páginas e funções de JSON-LD recebem `Guide[]` por props/argumento, então os testes usam fixtures sem depender de `astro:content`.

O sitemap roda dentro do `astro.config.mjs`, onde `astro:content` não existe: `lastmod.ts` lê só as datas do frontmatter direto do disco.

```mermaid
graph TD
    MD[src/content/guias/*.md] --> CC[src/content.config.ts<br/>glob + zod]
    CC --> LG[loadGuides<br/>src/lib/guias/collection.ts]
    LG --> SG[selectGuides<br/>src/lib/guias/guias.ts]
    SG --> R1[/guias/slug/ página]
    SG --> R2[/guias/ índice]
    SG --> R3[/servico/ bloco Guias sobre]
    SG --> R4[/llms.txt]
    R1 --> LD[schema.ts<br/>articleNode / collectionNode]
    R2 --> LD
    MD -. frontmatter via fs .-> LM[lastmod.ts<br/>guideDates] --> SM[sitemap lastmod]
```

### Abordagens consideradas

| Abordagem | Veredito |
| --------- | -------- |
| **Coleção de conteúdo + função pura de seleção (escolhida)** | Markdown simples para o usuário escrever; validação zod de graça; lógica testável sem `astro:content`. |
| Guias em módulo TypeScript (`src/data/guias.ts`), como `services.ts` | Consistente com o padrão atual, mas 1.200+ palavras em strings TS é ruim de escrever e revisar; perde Markdown (listas, tabelas, links). |
| `import.meta.glob` de arquivos `.md` sem coleção | Evita a API de coleções, mas reimplementa validação de frontmatter e tipos à mão. |

---

## Code Reuse Analysis

### Existing Components to Leverage

| Component | Location | How to Use |
| --------- | -------- | ---------- |
| `BaseLayout` | `src/layouts/BaseLayout.astro` | Layout das duas páginas novas (title, description, schema). |
| `Header`, `Footer`, `Contact` | `src/components/` | Mesmas seções das páginas de serviço; Header e Footer ganham o link "Guias". |
| Estilos `.svc-hero`, `.crumbs`, `.svc-faq`, `.svc-others` | `src/pages/[servico].astro:112` (escopados) | Movidos sem mudança para `src/styles/article.css`, importado pelas páginas de serviço e de guia. |
| `breadcrumbNode`, `faqNode`, `jsonLdText`, refs `#leonardo`/`#empresa` | `src/lib/seo/schema.ts` | Reaproveitados; entram `articleNode` e `collectionNode` no mesmo arquivo. |
| `llmsText` | `src/lib/seo/llms.ts:10` | Ganha parâmetro `guides`. |
| `withLastmod` / `PAGE_SOURCES` | `src/lib/seo/lastmod.ts` | Ganha ramo para `/guias/` com datas do frontmatter. |
| `renderComponent`, `parseHtml` | `tests/render.ts` | Testes das páginas novas. |
| `services` | `src/data/services.ts` | Enum de `servico` no zod e nome/URL do serviço no guia. |

### Integration Points

| System | Integration Method |
| ------ | ------------------ |
| Sitemap (`@astrojs/sitemap`) | Páginas novas entram sozinhas (estáticas); rascunhos não são gerados em produção, então não aparecem. `serialize` preenche `lastmod`. |
| CSP (AD-005) | Páginas sem script novo; HTML do Markdown não contém `<script>`. Coberto pelo teste existente `tests/build/inline-scripts.test.ts` (lista de páginas ampliada). |
| `tests/build/titles.test.ts`, `inline-scripts.test.ts` | Listas `PAGES` ganham `guias/index.html` e as páginas de guia publicadas. |

---

## Components

### Content config

- **Purpose**: Declarar a coleção `guias` e validar o frontmatter.
- **Location**: `src/content.config.ts`
- **Interfaces**: `collections = { guias }`, com `glob({ pattern: "**/*.md", base: "./src/content/guias", generateId: ({ entry }) => entry.replace(/\.md$/, "") })`.
- **Schema** (zod de `astro/zod`): `title` string 30–65 (COL-04), `description` 70–160 (COL-04), `h1`, `resumo` não vazios, `servico` = `z.enum(services.map(s => s.slug))` (COL-03), `publishedAt` e `updatedAt?` `z.coerce.date()`, `faq` default `[]`, `draft` default `false`; `.refine(updatedAt >= publishedAt)` (COL-06).
- **Por que `generateId`**: o padrão do glob transforma o nome do arquivo em slug e esconderia um nome inválido; com o nome cru, `selectGuides` valida COL-05.
- **Reuses**: `services`.

### Guide model + selection

- **Purpose**: Converter entradas, validar o que o zod não vê, filtrar rascunhos e ordenar.
- **Location**: `src/lib/guias/guias.ts` (puro, sem `astro:content`)
- **Interfaces**:
  - `toGuide(entry): Guide`: `{ slug: entry.id, ...entry.data, body: entry.body ?? "", html: entry.rendered?.html ?? "" }`.
  - `selectGuides(entries, { includeDrafts }): Guide[]`: lança `Error` com o nome do arquivo para slug inválido (COL-05) ou marcador `[PREÇO:`, `[REVISAR:`, `[...]` em guia não rascunho (COL-07, frontmatter serializado + corpo); remove rascunhos quando `includeDrafts` é falso (COL-08/09); ordena por `lastDate` decrescente.
  - `lastDate(g): Date` = `updatedAt ?? publishedAt`.
  - `guidesFor(guides, servico): Guide[]` e `related(guides, guide, max = 3): Guide[]` (PAGE-08, EDGE-02/03).
  - `formatDate(d): string`: "17 de outubro de 2026", `Intl.DateTimeFormat("pt-BR", { dateStyle: "long", timeZone: "UTC" })` (datas YAML são meia-noite UTC).

### Collection loader

- **Purpose**: Único ponto que toca `astro:content`.
- **Location**: `src/lib/guias/collection.ts`
- **Interfaces**: `loadGuides(): Promise<Guide[]>` = `selectGuides((await getCollection("guias")).map(toGuide), { includeDrafts: import.meta.env.DEV })`.

### Guide page

- **Purpose**: `/guias/<slug>/` (PAGE-01..10, EDGE-02/04).
- **Location**: `src/pages/guias/[slug].astro`
- **Interfaces**: `getStaticPaths` async → `{ params: { slug }, props: { guide, related } }`. Props: `guide: Guide`, `related: Guide[]`.
- **Render**: hero com trilha, `<h1>`, `resumo`, autor (link `site.linkedin`), `<time datetime>` publicado/atualizado; corpo via `<Fragment set:html={guide.html} />` (HTML que o Astro já gerou do Markdown, sem chamar `render()`); FAQ em `<details>`; "Leia também"; bloco CTA (serviço, `#contato`, WhatsApp); `Contact`.
- **JSON-LD**: `articleNode`, `breadcrumbNode`, `faqNode` só quando há FAQ.
- **Reuses**: `article.css`, `BaseLayout`, `Header`, `Footer`, `Contact`. Estilos de texto corrido (h2, listas, tabelas, links) escopados com `:global()` sob `.guide__body`.

### Hub page

- **Purpose**: `/guias/` (HUB-01..06, EDGE-01, LD-04).
- **Location**: `src/pages/guias/index.astro`
- **Interfaces**: recebe `guides` de `loadGuides()` no frontmatter; para teste, aceita `Astro.props.guides` quando fornecido (`Astro.props.guides ?? await loadGuides()`).
- **Render**: um `<h2>` por serviço com guias (ordem de `services`), link para o serviço, lista com link, descrição e data; sem guias, "Os primeiros guias estão a caminho.".

### Service page block

- **Purpose**: "Guias sobre <name>" (LINK-01/02).
- **Location**: `src/pages/[servico].astro`
- **Change**: `getStaticPaths` passa a ser async e envia `guides: guidesFor(await loadGuides(), slug)` nas props; seção renderizada só com lista não vazia, antes de "Outros serviços".

### JSON-LD helpers

- **Location**: `src/lib/seo/schema.ts`
- **Interfaces**:
  - `articleNode(site, guide, service): Node` (LD-01).
  - `collectionNode(site, guides): Node`: `CollectionPage` com `url`, `name`, `hasPart: [{ "@type": "Article", url, headline }]` (LD-04).

### Sitemap dates

- **Location**: `src/lib/seo/lastmod.ts`
- **Interfaces**:
  - `guideDates(dir = "src/content/guias", read = fs): Record<string, string>`: `slug → updatedAt ?? publishedAt` (`YYYY-MM-DD`) para guias com `draft` diferente de `true`, lidos por regex nas linhas `publishedAt:`, `updatedAt:` e `draft:` do bloco de frontmatter.
  - `withLastmod`: `/guias/<slug>/` → `guideDates()[slug]` (SMAP-02); `/guias/` → maior data (SMAP-03); demais caminhos continuam no git.

### llms.txt

- **Location**: `src/lib/seo/llms.ts`, `src/pages/llms.txt.ts`
- **Change**: `llmsText(site, list, guides = [])` adiciona `/guias/` em "Páginas" (LLMS-03) e a seção `## Guias` quando há guias (LLMS-01/02). A rota passa a ser `async` com `loadGuides()`.

### Header / Footer

- **Change**: `{ href: "/guias/", label: "Guias" }` depois de "Processo" (LINK-03); link "Guias" no rodapé junto da lista de serviços (LINK-04).

---

## Data Models

```typescript
interface Guide {
  slug: string;          // nome do arquivo, ^[a-z0-9]+(-[a-z0-9]+)*$
  title: string;         // 30–65
  description: string;   // 70–160
  h1: string;
  resumo: string;        // 1–3 frases; resposta direta, citável por IA
  servico: Service["slug"];
  publishedAt: Date;
  updatedAt?: Date;      // >= publishedAt
  faq: { q: string; a: string }[];
  draft: boolean;
  body: string;          // Markdown cru (checagem de marcadores, contagem de palavras)
  html: string;          // HTML renderizado pelo Astro
}
```

Frontmatter de exemplo:

```yaml
---
title: "Quanto Custa um Sistema Sob Medida em 2026 | Leonardo Assunção"
description: "..."
h1: "Quanto custa um sistema sob medida"
resumo: "..."
servico: software-sob-medida
publishedAt: 2026-10-17
faq:
  - q: "..."
    a: "..."
draft: true
---
```

---

## Error Handling Strategy

| Error Scenario | Handling | User Impact |
| -------------- | -------- | ----------- |
| Frontmatter inválido (serviço, tamanho, datas) | zod falha na sincronização da coleção com o caminho do arquivo | Build quebra com mensagem do arquivo e campo |
| Slug inválido / marcador pendente | `selectGuides` lança `Error("guias/<arquivo>.md: ...")` | Build quebra apontando o arquivo |
| Frontmatter sem data legível no `lastmod` | `guideDates` omite o guia | Sitemap sem `<lastmod>` para ele (zod já teria quebrado o build antes) |

---

## Risks & Concerns

| Concern | Location (file:line) | Impact | Mitigation |
| ------- | -------------------- | ------ | ---------- |
| Estilos das páginas de serviço são escopados no arquivo da rota | `src/pages/[servico].astro:112` | Página de guia não teria o mesmo visual sem duplicar CSS | Mover as regras sem alteração para `src/styles/article.css`; testes existentes da página de serviço garantem que nada muda no HTML. |
| `getStaticPaths` do serviço é síncrono e o teste o chama assim | `src/pages/_servico.test.ts:17` | Ficar async quebra o teste | Atualizar o teste para `await getStaticPaths()` com `astro:content` mockado (`vi.mock`). |
| `astro:content` em testes vitest | `vitest.config.ts` | `getCollection` pode não funcionar fora do build | Só `collection.ts` importa `astro:content`; testes passam `Guide[]` por props ou mockam `../lib/guias/collection`. |
| Leitura do frontmatter por regex no `lastmod` | `src/lib/seo/lastmod.ts` | Formato YAML diferente (data entre aspas, outra indentação) não seria lido | Regex aceita aspas opcionais; zod obriga `YYYY-MM-DD`; teste com variações. Biblioteca YAML não justificada para três campos. |
| Contagem de palavras do conteúdo | `tests/content/` | Contar Markdown cru inclui sintaxe | Contar palavras do corpo sem frontmatter e sem marcação (`#`, `|`, `-`, URLs de link). |

---

## Tech Decisions

| Decision | Choice | Rationale |
| -------- | ------ | --------- |
| Corpo do guia | `guide.html` (`entry.rendered.html`) via `set:html` | Mantém a página pura em relação às props; dispensa `render()` e facilita os testes. HTML vem dos arquivos do próprio repositório. |
| Rascunho visível | `import.meta.env.DEV` | `astro dev` mostra; `astro build` não gera. |
| CSS compartilhado | `src/styles/article.css` | Menor mudança que dá o mesmo visual às duas páginas, sem novos componentes. |

> Nenhuma decisão de nível de projeto nova: o padrão de coleção vale só para os guias até outro conteúdo precisar dele.

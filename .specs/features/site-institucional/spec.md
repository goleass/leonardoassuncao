# Site Institucional — Leonardo Gomes Assunção — Specification

## Problem Statement

A empresa Leonardo Gomes Assunção (criação de sites, sistemas web, integrações e software sob medida) não tem presença online. Sem um site, quem procura um desenvolvedor não encontra a empresa, não avalia a sua capacidade técnica e não tem um caminho direto para pedir orçamento. O site precisa passar autoridade, ser bonito e responsivo e transformar visitas em contatos.

## Goals

- [ ] Publicar a landing page fiel ao conceito aprovado no Claude Design (direção editorial suíça, paleta "marinho", animações estratégicas).
- [ ] Gerar contatos qualificados: todo envio válido do formulário chega ao e-mail do responsável e oferece a continuação pelo WhatsApp.
- [ ] Lighthouse (mobile) com Performance ≥ 90, Acessibilidade ≥ 95, Boas práticas ≥ 95 e SEO = 100.

## Out of Scope

| Feature | Reason |
| ------- | ------ |
| Páginas de estudo de caso por projeto | Decidido: primeira entrega é só a landing page; entra numa fase seguinte. |
| Blog / artigos | Decidido: fora da primeira entrega. |
| Painel administrativo / CMS | O conteúdo muda pouco; é editado num arquivo de configuração no código. |
| Armazenamento das mensagens em banco de dados | O destino das mensagens é o e-mail; guardar dados pessoais aumenta a responsabilidade LGPD sem ganho agora. |
| Versão em outros idiomas | Público-alvo é o Brasil (pt-BR). |
| Botão flutuante de WhatsApp | Sugestão não confirmada; o WhatsApp já aparece no topo de contato e após o envio do formulário. |
| Ferramentas de analytics e banner de cookies | Não foi pedido; adicionar analytics depois exige revisar a política de privacidade. |
| Seletor de paleta (marinho/oceano/indigo) para o visitante | A paleta era só uma alavanca de exploração no canvas; o site publica uma única paleta. |
| Captcha visual (Turnstile/reCAPTCHA) | Honeypot + limite de envios cobrem o volume esperado; reavaliar se houver spam. |

---

## Assumptions & Open Questions

| Assumption / decision | Chosen default | Rationale | Confirmed? |
| --------------------- | -------------- | --------- | ---------- |
| Paleta final | "marinho": fundo escuro #0A1A33, azul de marca #143E7A, destaque #5B95FF, cinzas frios (#F0F2F5) | Foi a paleta padrão da última versão aprovada ("Gostei… azul"). | n |
| Conteúdo real (cidade, e-mail, WhatsApp, LinkedIn, CNPJ, prazo de resposta) | Lidos de um único arquivo de configuração; o build falha se algum valor obrigatório estiver vazio ou entre colchetes | Evita publicar o site com "[SEU_NUMERO]" e centraliza a edição. | n |
| Projetos e depoimento ainda não existem | Seções Projetos e Depoimento só aparecem quando houver ao menos 1 item configurado | Não publicar placeholders nem conteúdo inventado. | n |
| Lista de tecnologias exibida | Não exibida na v1 (a faixa em movimento já lista as especialidades) | O canvas final não tem a faixa de tecnologias; evita afirmar stack que não foi confirmada. | y |
| Menu no celular | Abaixo de 768px o menu vira botão "Menu" que abre um painel com os links | No canvas os links apenas quebravam linha; em produção isso ocupa a tela toda no celular. | n |
| Palavra fixa no título com movimento reduzido | "software" (frase "Construo software sob medida.") | É o termo mais abrangente dos quatro serviços. | n |
| Limite de envios do formulário | 5 envios por IP a cada 60 minutos, contagem em memória (zera se o servidor reiniciar) | Volume esperado é baixo; contagem distribuída seria complexidade sem necessidade agora. | n |
| Tempo máximo de espera do serviço de e-mail | 10 segundos | Acima disso o visitante tende a abandonar; mostramos o plano B (WhatsApp/e-mail). | n |
| Texto pré-preenchido no WhatsApp após envio | "Olá, Leonardo! Acabei de enviar uma mensagem pelo site sobre: <tipo de projeto>. Meu nome é <nome>." | Dá contexto sem repetir a mensagem inteira. | n |
| Navegadores suportados | Duas últimas versões de Chrome, Edge, Firefox e Safari (desktop e mobile) | Cobre praticamente todo o público. | n |
| Tecnologia, hospedagem e serviço de envio de e-mail | Definidos na etapa de Design | São decisões técnicas, não de produto. | y |

**Open questions:** none - all resolved or logged above (required before the spec is confirmed).

---

## User Stories

### P1: Landing page com o conteúdo aprovado ⭐ MVP

**User Story**: Como dono de empresa procurando um desenvolvedor, quero entender em poucos segundos o que a empresa faz e como ela trabalha para decidir se peço um orçamento.

**Why P1**: Sem a página não existe presença online; é o núcleo da entrega.

**Acceptance Criteria** (each line is one EARS pattern):

1. The site SHALL render, na URL raiz, as seções nesta ordem: cabeçalho, topo (hero), faixa de especialidades, Serviços, Integrações, Compromissos, Processo, Projetos (condicional), Depoimento (condicional), Perguntas frequentes, Contato e rodapé.
2. The site SHALL exibir no topo o título "Construo <palavra> sob medida." com as palavras alternadas "sites", "sistemas", "integrações" e "software".
3. The site SHALL listar em Serviços os 5 itens: Criação de sites, Sistemas web, Integrações e APIs, Software sob medida, Manutenção e evolução — cada um com número (01–05), título e descrição.
4. The site SHALL mostrar em Integrações o fluxo de 5 etapas: Pedido no site, Cliente cadastrado no ERP, Pagamento confirmado, Nota fiscal emitida, Cliente avisado no WhatsApp.
5. The site SHALL mostrar em Processo as 4 etapas: Diagnóstico, Proposta, Desenvolvimento, Entrega e suporte.
6. WHEN o visitante clica num link do menu (Serviços, Integrações, Processo, Projetos, Fale comigo) THEN the site SHALL rolar suavemente até a seção correspondente, deixando o título da seção visível abaixo do cabeçalho fixo.
7. WHEN o visitante clica numa pergunta frequente THEN the site SHALL expandir a resposta dela, e um novo clique SHALL recolhê-la.
8. The site SHALL ler e-mail, WhatsApp, LinkedIn, cidade/UF, CNPJ e prazo de resposta de um único arquivo de configuração.
9. IF algum valor obrigatório da configuração estiver vazio ou contiver texto entre colchetes THEN the build SHALL falhar com uma mensagem que nomeia o campo.
10. WHERE houver ao menos 1 projeto configurado the site SHALL exibir a seção Projetos com imagem, nome, categoria, ano e descrição de cada projeto.
11. IF não houver projeto configurado THEN the site SHALL omitir a seção Projetos e o link "Projetos" do menu.
12. WHERE houver um depoimento configurado the site SHALL exibir a citação com nome, cargo e empresa do autor.
13. The header SHALL permanecer fixo no topo da tela durante a rolagem.

**Independent Test**: Abrir a página, conferir a ordem e o texto das seções, clicar em cada item do menu e nas perguntas frequentes; rodar o build com um campo de configuração vazio e ver a falha.

---

### P1: Formulário de contato com e-mail e continuação no WhatsApp ⭐ MVP

**User Story**: Como visitante interessado, quero mandar uma mensagem pelo site e, se quiser, continuar a conversa no WhatsApp, para iniciar um projeto sem fricção.

**Why P1**: É a conversão do site; sem ele a página não gera negócio.

**Acceptance Criteria**:

1. WHEN o visitante envia o formulário com dados válidos THEN the server SHALL enviar um e-mail ao endereço configurado contendo nome, e-mail, tipo de projeto e mensagem, com o e-mail do visitante como "Responder para".
2. WHEN o envio é concluído com sucesso THEN the site SHALL substituir o formulário pela mensagem "Mensagem enviada! Respondo pessoalmente em até <prazo configurado>." e por um botão "Continuar no WhatsApp".
3. WHEN o visitante clica em "Continuar no WhatsApp" THEN the site SHALL abrir `https://wa.me/<número configurado>?text=<texto>` com o texto pré-preenchido definido nas premissas, codificado para URL.
4. The form SHALL ter os campos Nome (2–100 caracteres), E-mail (formato válido, até 254 caracteres), Tipo de projeto (Site, Sistema web, Integração, Outro) e Sobre o projeto (10–2000 caracteres), todos obrigatórios.
5. IF um campo estiver inválido no envio THEN the site SHALL mostrar, abaixo do campo, a mensagem de erro em português e não enviar a requisição.
6. IF a requisição chegar ao servidor com algum campo inválido THEN the server SHALL responder HTTP 400 com a lista de campos inválidos e não enviar e-mail.
7. WHILE o envio está em andamento the site SHALL desabilitar o botão e trocar o texto dele para "Enviando…".
8. IF o serviço de e-mail falhar ou não responder em 10 segundos THEN the server SHALL responder HTTP 502.
9. WHEN o servidor responde com erro 502 ou falha de rede THEN the site SHALL mostrar "Não foi possível enviar agora." com links para o WhatsApp e para o e-mail configurados, mantendo os dados digitados no formulário.
10. IF o campo oculto anti-spam (honeypot) vier preenchido THEN the server SHALL responder HTTP 200 sem enviar e-mail.
11. IF o mesmo IP fizer mais de 5 envios em 60 minutos THEN the server SHALL responder HTTP 429 sem enviar e-mail.
12. WHEN o servidor responde HTTP 429 THEN the site SHALL mostrar "Muitas tentativas. Tente novamente mais tarde ou chame no WhatsApp." com o link do WhatsApp.
13. The server SHALL NOT gravar o conteúdo das mensagens em disco ou banco de dados.
14. The site SHALL manter as credenciais do serviço de e-mail apenas no servidor, fora de qualquer arquivo enviado ao navegador.
15. WHEN um envio falha no servidor THEN the server SHALL registrar no log data/hora e código do erro, sem nome, e-mail ou mensagem do visitante.

**Independent Test**: Enviar o formulário válido e ver o e-mail chegar e o botão do WhatsApp com o texto correto; enviar com campos inválidos, com honeypot preenchido, 6 vezes seguidas e com o serviço de e-mail desligado, e conferir cada resposta.

---

### P1: Layout responsivo ⭐ MVP

**User Story**: Como visitante no celular, quero ler e navegar o site com conforto, já que a maioria das visitas vem do celular.

**Why P1**: Pedido explícito ("responsivo") e a maior parte do tráfego é mobile.

**Acceptance Criteria**:

1. The site SHALL exibir todo o conteúdo sem rolagem horizontal em larguras de 320px a 1920px.
2. WHILE a largura da tela é menor que 768px the header SHALL mostrar o nome da empresa e um botão "Menu" no lugar dos links.
3. WHEN o visitante toca em "Menu" THEN the site SHALL abrir um painel com os links de navegação e o botão "Fale comigo".
4. WHEN o visitante toca num link do painel ou pressiona Esc THEN the site SHALL fechar o painel.
5. The site SHALL ter áreas de toque de no mínimo 44×44px em todos os links, botões e campos.
6. WHILE a largura da tela é menor que 768px the site SHALL empilhar em uma coluna os blocos que ficam lado a lado no desktop (topo, Integrações, Compromissos, Processo, Perguntas frequentes, Contato).

**Independent Test**: Abrir o site em 320px, 390px, 768px, 1280px e 1920px, conferir ausência de rolagem horizontal e usar o menu no celular.

---

### P2: Animações estratégicas

**User Story**: Como visitante, quero perceber movimento com propósito, para que o site pareça moderno e bem-acabado sem atrapalhar a leitura.

**Why P2**: Pedido explícito e diferencial de percepção de qualidade, mas o site funciona sem ele.

**Acceptance Criteria**:

1. WHEN a página carrega THEN the site SHALL animar as 3 linhas do título do topo subindo em sequência, concluindo em até 1,5 segundo.
2. The hero SHALL alternar a palavra do título entre "sites", "sistemas", "integrações" e "software" em ciclo contínuo, com cada palavra visível por cerca de 2,5 segundos.
3. The site SHALL mover a faixa de especialidades continuamente da direita para a esquerda, em ciclo sem emenda visível.
4. WHEN o ponteiro do mouse está sobre a faixa de especialidades THEN the site SHALL pausar o movimento dela.
5. WHEN o ponteiro passa sobre um item de Serviços THEN the site SHALL preencher o fundo do item com a cor de marca da esquerda para a direita e girar a seta em -45°.
6. The site SHALL animar, em ciclo de 5 segundos, um marcador que percorre o fluxo de Integrações destacando cada etapa quando ele passa por ela.
7. WHEN uma seção entra na área visível pela primeira vez THEN the site SHALL revelá-la com transição de opacidade e deslocamento vertical, uma única vez.
8. WHILE o sistema do visitante estiver com "reduzir movimento" ativado the site SHALL exibir todo o conteúdo sem animações e com o título fixo "Construo software sob medida."
9. IF o JavaScript estiver desativado ou falhar THEN the site SHALL exibir todo o conteúdo visível, sem seções escondidas.
10. The site SHALL animar apenas as propriedades transform, opacity e background-size, mantendo o Cumulative Layout Shift abaixo de 0,1.

**Independent Test**: Carregar a página e observar cada animação; ativar "reduzir movimento" no sistema e recarregar; desativar o JavaScript e conferir que todo o conteúdo aparece.

---

### P2: SEO, compartilhamento e desempenho

**User Story**: Como dono da empresa, quero que o site apareça no Google e fique bonito ao ser compartilhado no WhatsApp/LinkedIn, para atrair clientes sem anúncios.

**Why P2**: Essencial para o site gerar visitas, mas não bloqueia a primeira publicação.

**Acceptance Criteria**:

1. The site SHALL declarar `lang="pt-BR"`, título "Leonardo Gomes Assunção — Sites, Sistemas Web e Integrações" e meta description de até 160 caracteres.
2. The site SHALL publicar tags Open Graph e Twitter Card com imagem de 1200×630px.
3. The site SHALL publicar `sitemap.xml`, `robots.txt` e URL canônica.
4. The site SHALL incluir dados estruturados JSON-LD do tipo `ProfessionalService` com nome, serviços, área atendida e contatos configurados.
5. The site SHALL obter no Lighthouse (mobile) Performance ≥ 90, Acessibilidade ≥ 95, Boas práticas ≥ 95 e SEO = 100.
6. The site SHALL carregar as fontes Archivo do próprio domínio, com `font-display: swap`.

**Independent Test**: Rodar Lighthouse em modo mobile; validar a página no Rich Results Test do Google; colar a URL no WhatsApp e ver a prévia.

---

### P2: Acessibilidade

**User Story**: Como visitante que navega por teclado ou leitor de tela, quero usar todo o site, incluindo o formulário.

**Why P2**: Qualidade e alcance; também pesa no SEO.

**Acceptance Criteria**:

1. The site SHALL ter contraste de no mínimo 4,5:1 em textos normais e 3:1 em textos de 24px ou mais.
2. The site SHALL permitir alcançar e acionar por teclado todos os links, botões, perguntas frequentes e campos, com indicador de foco visível.
3. The site SHALL associar cada campo do formulário a um `<label>` e anunciar erros e o resultado do envio para leitores de tela (`aria-live`).
4. The site SHALL oferecer um link "Pular para o conteúdo" como primeiro elemento focável.
5. The site SHALL usar um único `<h1>` e títulos `<h2>`/`<h3>` em ordem hierárquica.

**Independent Test**: Navegar o site inteiro só com Tab/Enter/Esc; rodar axe DevTools sem violações sérias; checar contraste das cores da paleta.

---

### P2: Política de privacidade e página 404

**User Story**: Como visitante, quero saber o que é feito com os dados que envio; e, se eu acessar um endereço errado, quero voltar ao site facilmente.

**Why P2**: O formulário coleta dados pessoais (LGPD); a 404 evita becos sem saída.

**Acceptance Criteria**:

1. The site SHALL publicar a página `/privacidade` informando quais dados o formulário coleta, a finalidade (responder ao contato), que as mensagens não são armazenadas no site e o e-mail para pedidos sobre dados pessoais.
2. The form SHALL exibir, junto ao botão de envio, o link para `/privacidade`.
3. WHEN o visitante acessa um endereço inexistente THEN the site SHALL responder HTTP 404 com uma página no visual do site e um link para a página inicial.
4. The footer SHALL exibir nome da empresa, CNPJ, cidade/UF, ano atual e link para `/privacidade`.

**Independent Test**: Abrir `/privacidade`, abrir `/qualquer-coisa` e conferir o status 404 e o link de volta.

---

## Edge Cases

- IF o visitante clicar em "Enviar mensagem" duas vezes seguidas THEN the site SHALL enviar uma única requisição.
- IF a mensagem tiver mais de 2000 caracteres THEN the site SHALL mostrar "A mensagem pode ter até 2000 caracteres." e não enviar.
- IF o nome ou a mensagem contiverem HTML THEN the server SHALL enviar o e-mail com o conteúdo como texto escapado.
- WHEN a largura for exatamente 768px THEN the header SHALL mostrar os links completos, sem o botão "Menu".
- IF uma imagem de projeto não carregar THEN the site SHALL manter o espaço reservado com proporção 16:11 e texto alternativo.

---

## Requirement Traceability

| Requirement ID | Story | Phase | Status |
| -------------- | ----- | ----- | ------ |
| PAGE-01 | P1: Landing page — ordem das seções | - | Implementing |
| PAGE-02 | P1: Landing page — título com palavras alternadas | - | Implementing |
| PAGE-03 | P1: Landing page — 5 serviços | - | Implementing |
| PAGE-04 | P1: Landing page — fluxo de integrações | - | Implementing |
| PAGE-05 | P1: Landing page — 4 etapas do processo | - | Implementing |
| PAGE-06 | P1: Landing page — navegação por âncoras | - | Implementing |
| PAGE-07 | P1: Landing page — perguntas frequentes | - | Implementing |
| PAGE-08 | P1: Landing page — configuração única | - | Implementing |
| PAGE-09 | P1: Landing page — build falha com placeholder | - | Implementing |
| PAGE-10 | P1: Landing page — seção Projetos condicional | - | Implementing |
| PAGE-11 | P1: Landing page — omissão sem projetos | - | Implementing |
| PAGE-12 | P1: Landing page — depoimento condicional | - | Implementing |
| PAGE-13 | P1: Landing page — cabeçalho fixo | - | Implementing |
| FORM-01 | P1: Formulário — envio do e-mail | - | Implementing |
| FORM-02 | P1: Formulário — mensagem de sucesso | - | Implementing |
| FORM-03 | P1: Formulário — continuar no WhatsApp | - | Implementing |
| FORM-04 | P1: Formulário — campos e limites | - | Implementing |
| FORM-05 | P1: Formulário — validação no navegador | - | Implementing |
| FORM-06 | P1: Formulário — validação no servidor (400) | - | Implementing |
| FORM-07 | P1: Formulário — estado "Enviando…" | - | Implementing |
| FORM-08 | P1: Formulário — falha do serviço de e-mail (502) | - | Implementing |
| FORM-09 | P1: Formulário — plano B na falha | - | Implementing |
| FORM-10 | P1: Formulário — honeypot | - | Implementing |
| FORM-11 | P1: Formulário — limite de envios (429) | - | Implementing |
| FORM-12 | P1: Formulário — mensagem de limite | - | Implementing |
| FORM-13 | P1: Formulário — sem armazenamento | - | Implementing |
| FORM-14 | P1: Formulário — credenciais só no servidor | - | Implementing |
| FORM-15 | P1: Formulário — log sem dados pessoais | - | Implementing |
| RESP-01 | P1: Responsivo — sem rolagem horizontal | - | Pending |
| RESP-02 | P1: Responsivo — botão Menu < 768px | - | Implementing |
| RESP-03 | P1: Responsivo — abrir painel | - | Implementing |
| RESP-04 | P1: Responsivo — fechar painel | - | Implementing |
| RESP-05 | P1: Responsivo — áreas de toque | - | Pending |
| RESP-06 | P1: Responsivo — empilhamento | - | Pending |
| ANIM-01 | P2: Animações — entrada do título | - | Implementing |
| ANIM-02 | P2: Animações — palavra alternada | - | Implementing |
| ANIM-03 | P2: Animações — faixa em movimento | - | Implementing |
| ANIM-04 | P2: Animações — pausa da faixa | - | Implementing |
| ANIM-05 | P2: Animações — hover dos serviços | - | Implementing |
| ANIM-06 | P2: Animações — fluxo de integrações | - | Implementing |
| ANIM-07 | P2: Animações — revelação ao rolar | - | Implementing |
| ANIM-08 | P2: Animações — reduzir movimento | - | Implementing |
| ANIM-09 | P2: Animações — sem JavaScript | - | Implementing |
| ANIM-10 | P2: Animações — propriedades e CLS | - | Implementing |
| SEO-01 | P2: SEO — idioma, título e descrição | - | Implementing |
| SEO-02 | P2: SEO — Open Graph | - | Implementing |
| SEO-03 | P2: SEO — sitemap, robots, canônica | - | Pending |
| SEO-04 | P2: SEO — JSON-LD | - | Implementing |
| SEO-05 | P2: SEO — Lighthouse | - | Pending |
| SEO-06 | P2: SEO — fontes locais | - | Implementing |
| A11Y-01 | P2: Acessibilidade — contraste | - | Implementing |
| A11Y-02 | P2: Acessibilidade — teclado e foco | - | Pending |
| A11Y-03 | P2: Acessibilidade — labels e aria-live | - | Implementing |
| A11Y-04 | P2: Acessibilidade — pular para o conteúdo | - | Implementing |
| A11Y-05 | P2: Acessibilidade — hierarquia de títulos | - | Implementing |
| LEGAL-01 | P2: Privacidade — página /privacidade | - | Pending |
| LEGAL-02 | P2: Privacidade — link no formulário | - | Implementing |
| LEGAL-03 | P2: Privacidade — página 404 | - | Pending |
| LEGAL-04 | P2: Privacidade — rodapé | - | Implementing |
| EDGE-01 | Edge: clique duplo envia uma vez | - | Implementing |
| EDGE-02 | Edge: mensagem acima de 2000 caracteres | - | Implementing |
| EDGE-03 | Edge: HTML escapado no e-mail | - | Implementing |
| EDGE-04 | Edge: largura exata de 768px | - | Pending |
| EDGE-05 | Edge: imagem de projeto que não carrega | - | Implementing |

**Coverage:** 64 total, 0 mapped to tasks, 64 unmapped ⚠️ (mapeamento acontece na etapa de Tasks)

### Implicit-requirement dimensions sweep

| Dimension | Resolution |
| --------- | ---------- |
| Input validation & bounds | FORM-04, FORM-05, FORM-06, EDGE-02, EDGE-03 |
| Failure / partial-failure states | FORM-08, FORM-09 |
| Idempotency / retry / duplicate handling | EDGE-01, FORM-07 |
| Auth boundaries & rate limits | FORM-11, FORM-12, FORM-14; sem autenticação porque o site é público |
| Concurrency / ordering | N/A because cada envio é uma requisição independente e sem estado compartilhado além do contador de limite |
| Data lifecycle / expiry | FORM-13, LEGAL-01; contador de limite expira em 60 minutos |
| Observability | FORM-15 |
| External-dependency failure | FORM-08, FORM-09 |
| State-transition integrity | Estados do formulário: parado → enviando → sucesso ou erro (FORM-02, FORM-07, FORM-09, FORM-12) |

---

## Success Criteria

- [ ] Todas as seções do canvas aprovado estão publicadas com o conteúdo real, sem nenhum texto entre colchetes.
- [ ] Um envio válido do formulário chega ao e-mail em menos de 1 minuto, em 100% dos testes manuais.
- [ ] Lighthouse mobile: Performance ≥ 90, Acessibilidade ≥ 95, Boas práticas ≥ 95, SEO = 100.
- [ ] Nenhuma rolagem horizontal em 320px, 390px, 768px, 1280px e 1920px.

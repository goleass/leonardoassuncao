---
title: "Integração com o Bling via API | Leonardo Assunção"
description: "Como integrar o Bling com loja virtual, planilhas e sistemas internos pela API v3: o que dá para automatizar, webhooks, limites e erros mais comuns."
h1: "Como fazer a integração com o Bling via API?"
resumo: "A integração com o Bling é feita pela API v3, que usa autenticação OAuth 2.0 e permite ler e gravar pedidos de venda, produtos, estoque, contatos, notas fiscais e contas a pagar e a receber. Para reagir a mudanças em tempo real, o Bling envia webhooks; para o resto, o sistema consulta a API respeitando o limite de 3 requisições por segundo e 120 mil por dia por conta."
servico: integracoes
publishedAt: 2026-10-17
faq:
  - q: "Preciso de um plano específico do Bling para usar a API?"
    a: "Os recursos disponíveis variam conforme o plano e mudam com o tempo. Antes de começar o projeto, confira no seu plano atual quais módulos estão liberados, principalmente notas fiscais e integrações."
  - q: "A integração com o Bling funciona em tempo real?"
    a: "Para pedidos de venda, produtos, estoque e notas fiscais, o Bling envia webhooks assim que algo é criado, alterado ou excluído, o que deixa a integração praticamente em tempo real. Para outros dados, o sistema consulta a API em intervalos definidos."
  - q: "O que acontece se o meu sistema ficar fora do ar?"
    a: "O Bling tenta reenviar os webhooks por até 3 dias. Se as falhas continuarem até o fim desse prazo, o webhook do recurso é desativado e precisa ser reativado manualmente. Por isso a integração precisa de monitoramento e de uma rotina de reprocessamento."
  - q: "Dá para integrar o Bling com o WhatsApp?"
    a: "Sim, com um sistema no meio. A integração lê os dados do Bling, como status do pedido ou nota emitida, e envia a mensagem pela API oficial do WhatsApp Business ou por uma plataforma de atendimento que ofereça API."
---

Muitas distribuidoras, atacados e lojas virtuais usam o Bling como ERP: é nele que ficam os produtos, o estoque, os pedidos e as notas fiscais. O problema começa quando os outros sistemas da empresa não conversam com ele. Alguém exporta planilha, digita pedido de novo, confere estoque à mão e corrige divergência no fim do dia.

A API do Bling resolve isso. Neste guia eu explico o que dá para automatizar, como a integração funciona por dentro, quais erros são mais comuns e quando um conector pronto basta. As informações técnicas seguem a documentação oficial da API v3 do Bling, em developer.bling.com.br.

## O que dá para automatizar com a API do Bling?

A API v3 do Bling é uma API REST, que troca dados no formato JSON. Ela cobre a maior parte dos cadastros e movimentos do ERP. Os recursos mais usados em integrações são estes:

| Recurso | Exemplos do que a integração faz |
| --- | --- |
| Pedidos de venda | Criar pedidos que chegam da loja virtual ou do sistema comercial, e acompanhar a situação de cada um. |
| Produtos | Cadastrar e atualizar produtos, preços e variações a partir de uma fonte única. |
| Estoque | Lançar entradas e saídas e consultar o saldo por depósito. |
| Contatos | Manter clientes e fornecedores iguais entre o Bling e o CRM ou o sistema interno. |
| Notas fiscais | Consultar notas emitidas e acompanhar a situação da NF-e e da NFC-e. |
| Contas a pagar e a receber | Levar títulos para um painel financeiro ou conciliar recebimentos. |

A API também tem endpoints para pedidos de compra, categorias, depósitos, logística e nota fiscal de serviço, entre outros. A lista completa e os campos de cada recurso estão na referência oficial, que é atualizada com frequência.

## Quais integrações com o Bling são mais comuns?

Na prática, quase toda integração com o Bling cai num destes casos:

- **Loja virtual própria:** os pedidos da loja entram no Bling automaticamente, e o estoque do Bling volta para a loja, para não vender o que não existe.
- **Planilhas:** relatórios que a equipe montava à mão passam a ser gerados com os dados do Bling, sem exportar e colar.
- **Sistema interno:** um painel de vendas, um portal do representante ou um sistema de separação e expedição que lê e grava no Bling.
- **WhatsApp de vendas:** o cliente recebe uma mensagem quando o pedido é faturado ou quando a nota é emitida, e o vendedor consulta estoque sem abrir o ERP.
- **Relatórios e indicadores:** um painel com vendas por representante, giro de estoque ou títulos vencidos, alimentado pela API.

Se o sistema interno ainda não existe, a página de [sistemas web](/sistemas-web/) mostra o que pode ser construído em volta do ERP.

## Como a integração com o Bling funciona por dentro?

Sem entrar em código, uma integração com o Bling tem quatro partes.

### Autenticação com OAuth 2.0

Na API v3, o acesso é feito por um aplicativo cadastrado na área do integrador do Bling. O dono da conta autoriza esse aplicativo, escolhendo quais dados ele pode acessar (os chamados escopos). O Bling usa o fluxo *authorization code* do OAuth 2.0: depois da autorização, a integração recebe um token de acesso e um token de renovação (*refresh token*), que vale 30 dias e serve para obter tokens novos sem pedir autorização de novo. Se a integração ficar parada mais tempo que isso, o dono da conta precisa autorizar outra vez.

### Webhooks ou consulta periódica

Existem duas formas de saber que algo mudou no Bling:

1. **Webhooks:** o Bling avisa o seu sistema, por uma requisição HTTP, sempre que um recurso é criado, alterado ou excluído. Hoje há webhooks para pedidos de venda, produtos, estoque, estoque virtual, produto do fornecedor, NF-e e NFC-e. Cada aviso vem assinado (cabeçalho `X-Bling-Signature-256`), e o sistema confere essa assinatura para ter certeza de que a mensagem veio do Bling.
2. **Consulta periódica (*polling*):** o sistema pergunta à API, de tempos em tempos, o que mudou. Serve para recursos sem webhook e como rede de segurança para os que têm.

O caminho mais confiável costuma ser combinar os dois: webhook para reagir rápido e uma consulta periódica para conferir se nada ficou para trás.

### Limites de requisição

O Bling limita o uso da API por conta, somando todos os aplicativos e módulos: 3 requisições por segundo e 120 mil requisições por dia. Acima disso, a API responde com o código 429 (*Too Many Requests*). Também há bloqueio temporário do IP quando uma aplicação gera erros ou requisições demais em poucos segundos. Uma integração bem feita controla o ritmo das chamadas, espera e tenta de novo quando recebe 429, e evita consultas desnecessárias.

### Filas e reprocessamento

O Bling não garante que os webhooks cheguem na ordem em que os eventos aconteceram, e o mesmo aviso pode chegar mais de uma vez. Além disso, o seu sistema precisa responder em até 5 segundos, senão o Bling considera a entrega como falha e tenta de novo. Por isso, a boa prática é receber o aviso, responder logo e processar depois, numa fila. Cada evento tem um identificador único, que permite ignorar repetições.

## Quais são os erros mais comuns numa integração com o Bling?

A maioria dos problemas não está na API, e sim em decisões que ninguém tomou antes de começar:

- **Estoque duplicado ou divergente.** Quando a loja e o Bling baixam estoque cada um por conta própria, o saldo diverge. É preciso definir um único dono do estoque e fazer os outros sistemas só consultarem.
- **Cadastro de produto diferente em cada sistema.** SKU, unidade de medida e variações precisam bater. Sem um código comum, a integração não sabe que dois cadastros são o mesmo produto.
- **Erros sem tratamento.** Uma falha de rede ou um campo obrigatório vazio não pode sumir em silêncio. A integração precisa registrar o erro, avisar alguém e permitir reprocessar o pedido depois da correção.
- **Webhook desativado sem ninguém perceber.** Se o seu sistema falhar por muito tempo, o Bling desativa o webhook depois das tentativas. Um alerta de monitoramento evita dias de pedidos parados.
- **Consultas com períodos longos demais.** A API recusa filtros por período com intervalo maior que um ano. Cargas de histórico precisam ser feitas em partes.
- **Credenciais expostas.** O *client secret* do aplicativo é uma senha e deve ficar só no servidor, nunca numa planilha compartilhada ou no código de uma página.

## Conector pronto ou integração sob medida?

Para muitos casos, existe um conector pronto na Central de Extensões do Bling, e ele pode ser a melhor escolha. A comparação abaixo ajuda a decidir:

| Situação | Conector pronto | Integração sob medida |
| --- | --- | --- |
| Loja em plataforma conhecida | Geralmente atende | Só se houver regra que o conector não cobre |
| Sistema interno ou loja própria | Não existe conector | Necessária |
| Regras específicas (preço por cliente, reserva de estoque, rateio) | Limitado às opções do conector | Feita para a regra |
| Custo | Mensalidade do conector | Desenvolvimento e manutenção |
| Controle sobre erros e reprocessamento | O que o conector oferece | Definido no projeto |

A minha recomendação é simples: se um conector pronto resolve o problema sem gambiarras, use o conector. A integração sob medida vale a pena quando a empresa tem um sistema próprio, quando as regras não cabem nas opções do conector ou quando os dados precisam passar por vários sistemas.

## Como funciona um projeto de integração com o Bling?

Um projeto de integração costuma seguir estas etapas:

1. **Diagnóstico:** entender quais sistemas estão envolvidos, quem é o dono de cada dado e onde a operação perde tempo hoje.
2. **Mapeamento de campos:** decidir, campo a campo, como cada informação passa de um sistema para o outro: código do produto, situação do pedido, depósito, forma de pagamento.
3. **Desenvolvimento:** autenticação, webhooks, consultas, fila de processamento, registro de erros e rotina de reprocessamento.
4. **Testes em homologação:** rodar a integração com dados de teste ou numa conta separada, cobrindo os casos difíceis, antes de ligá-la na operação real.
5. **Acompanhamento:** nas primeiras semanas em produção, conferir os registros, ajustar regras e garantir que os alertas funcionam.

A mesma abordagem vale para outros ERPs usados por distribuidoras e atacados, como o Tiny e o Omie. Os dois também oferecem API, mas autenticação, limites e recursos são diferentes, então o mapeamento sempre começa pela documentação atual de cada fornecedor.

## Integração com o Bling para empresas de Canoas e Porto Alegre

Canoas e a região metropolitana de Porto Alegre concentram muitas distribuidoras, atacados e operações de e-commerce, várias delas ao longo do eixo da BR-116. Eu atendo empresas de Canoas, Porto Alegre e região metropolitana, e de todo o Brasil de forma remota, com reuniões por vídeo e acompanhamento online.

Para ver como trabalho com APIs, ERPs e automações, acesse a página de [integrações](/integracoes/). Se a sua operação também tem frota própria, o guia sobre [integração de rastreamento veicular](/guias/integracao-rastreamento-veicular/) mostra como levar os dados do rastreador para o sistema de gestão. E se você já sabe quais sistemas precisam conversar com o Bling, [fale comigo](/#contato).

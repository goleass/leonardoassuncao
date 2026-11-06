---
title: "Custo da API do WhatsApp Subiu? Entenda | Leonardo Assunção"
description: "A fatura da API do WhatsApp subiu desde outubro? Veja o que mudou na cobrança e como descobrir qual fluxo do chatbot ou do CRM está gerando o custo."
h1: "A conta da API do WhatsApp subiu depois de outubro: como descobrir o que está gerando custo"
resumo: "Para descobrir o que está gerando custo, separe as mensagens entregues por número, categoria e fluxo do chatbot ou do CRM, porque desde 1º de outubro de 2026 a Meta cobra mensagens de serviço acima da franquia mensal e templates de utilidade enviados com a janela de atendimento aberta. Com essa divisão, fica mais fácil ver qual automação concentra o gasto e onde dá para enviar menos mensagens."
servico: integracoes
publishedAt: 2026-11-06
draft: false
faq:
  - q: "As mensagens de atendimento da API do WhatsApp agora são pagas?"
    a: "Sim, acima da franquia. A documentação da Meta informa que, desde 1º de outubro de 2026, cada número comercial tem 1.000 mensagens de serviço gratuitas por mês, e a cobrança começa na 1.001ª. A franquia não acumula de um mês para o outro."
  - q: "Quando o cliente manda mensagem para a empresa, isso é cobrado?"
    a: "Não. A cobrança da Meta recai sobre mensagens entregues pela empresa. A mensagem enviada pelo usuário não é cobrada, mas ela abre ou renova a janela de atendimento de 24 horas."
  - q: "O que acontece se eu não tiver forma de pagamento cadastrada?"
    a: "Segundo a Meta, depois de usar a franquia gratuita, as mensagens de serviço deixam de ser entregues se não houver uma forma de pagamento. Se o bot parece mudo no fim do mês, vale conferir isso no Billing Hub."
  - q: "Trocar de fornecedor reduz o custo da Meta?"
    a: "A tarifa da Meta segue a tabela dela, então trocar de fornecedor não muda a cobrança por mensagem. O que pode mudar é a mensalidade ou a taxa do intermediário, além da forma como o fluxo envia as mensagens."
  - q: "Vale juntar várias mensagens do bot em uma só?"
    a: "Pode valer. Como a cobrança é por mensagem entregue, um fluxo que quebra uma resposta em quatro balões custa mais do que um que resolve em uma mensagem. Só evite criar textos longos a ponto de atrapalhar a leitura."
---

A empresa não mudou o atendimento, o volume parece igual, e a fatura da API do WhatsApp veio maior. Quando o assunto chega ao financeiro, a pergunta é simples: o que está gerando esse custo? Pode ser difícil responder, porque a fatura mostra categorias e o problema está em um fluxo específico do chatbot ou do CRM.

Este guia explica o que mudou na cobrança e como chegar a uma resposta com dados. As regras foram conferidas em 5 de novembro de 2026 na [documentação de preços da WhatsApp Business Platform](https://developers.facebook.com/documentation/business-messaging/whatsapp/pricing), da Meta. A Meta só altera tarifas no início de cada trimestre, por isso confira a tabela vigente antes de usar qualquer valor. Este guia trata da API, e não do uso comum do aplicativo.

## O que mudou na cobrança da API do WhatsApp em outubro de 2026?

A Meta cobra por **mensagem entregue**, de acordo com a categoria e o país do número de destino. Duas mudanças de 1º de outubro de 2026 merecem atenção:

- **Mensagens de serviço.** São as mensagens livres, sem template, enviadas em resposta ao cliente com a janela de atendimento aberta. Elas eram gratuitas desde novembro de 2024. Agora cada número comercial tem 1.000 gratuitas por mês, e a cobrança começa na 1.001ª.
- **Templates de utilidade na janela aberta.** Um aviso de pedido enviado enquanto a conversa está aberta era gratuito desde julho de 2025. Esse benefício acabou.

A Meta informa que a tarifa de serviço, em cada mercado, é igual à de utilidade e autenticação, e que não há faixas de volume para serviço. Logo, enviar muito não reduz o preço unitário dessa categoria.

Outros pontos que vale conferir:

- a **janela de atendimento** dura 24 horas e é renovada a cada mensagem ou ligação do cliente;
- fora da janela, a empresa só pode enviar templates;
- a mensagem que o cliente envia para a empresa não é cobrada;
- quem chega por anúncio Click-to-WhatsApp, pelo aplicativo no celular, pode abrir uma janela gratuita de até 7 dias, se a empresa responder dentro da janela de atendimento;
- mensagens geradas pela Meta Business Agent têm uma cobrança própria, por tokens.

## Como descobrir o que está gerando o custo?

O objetivo é sair de "gastamos mais em serviço" para "o fluxo de segunda via gerou a maior parte das mensagens".

### 1. Comece pela fatura e pelo Billing Hub

Separe o gasto por mês, número e categoria: marketing, utilidade, autenticação e serviço. Compare setembro com outubro, lembrando que outubro já tem a nova regra. Se você usa um intermediário, separe também o que é tarifa da Meta e o que é mensalidade, taxa por usuário ou pacote do fornecedor. Em um boleto único, é difícil ver de onde veio o aumento.

### 2. Conte as mensagens por número

A franquia vale por número comercial. Uma operação com vários números tem uma franquia em cada um, e um número de baixo uso pode nunca passar dela, enquanto outro concentra quase toda a cobrança.

### 3. Registre cada envio com o fluxo de origem

A fatura não sabe o que é "confirmação de pedido" ou "bot de boas-vindas". Para isso, o seu sistema precisa guardar, a cada envio, pelo menos:

- o identificador da mensagem retornado pela API;
- o número comercial e o destinatário de forma protegida;
- o fluxo ou a automação que originou o envio;
- o template usado, quando houver;
- a categoria e a informação de cobrança recebidas no webhook de status.

A documentação da Meta informa que os webhooks trazem dados de preço. No caso das mensagens de serviço, o campo `type` muda de `free_customer_service` para `regular` quando a mensagem passa a ser cobrada. Consulte a estrutura vigente do webhook antes de implementar, porque esses detalhes podem mudar.

### 4. Monte um ranking simples

Com os registros, responda a quatro perguntas:

1. Quais cinco fluxos mais enviam mensagens?
2. Quantas mensagens cada conversa resolvida consome?
3. Quantos templates de utilidade saem com a janela aberta?
4. Em que dia do mês a franquia de cada número acaba?

Não é preciso um painel sofisticado. Uma consulta bem feita em uma tabela de envios já mostra o problema.

## Como a empresa controla isso hoje e o que perde?

A informação pode estar em lugares que não conversam. A fatura fica no financeiro, às vezes em uma planilha mensal. As regras do bot estão no CRM ou com quem configurou a ferramenta. Alguém anotou em um papel qual template servia para quê, e o pedido de um novo aviso chegou por uma mensagem de WhatsApp interna, sem estimativa de volume.

Assim, as perdas passam despercebidas:

- **Bot que fala demais.** Saudação, menu, confirmação e despedida saem em balões separados. Cada balão entregue conta.
- **Duas automações para o mesmo evento.** O CRM e a loja virtual enviam o mesmo aviso de pedido, e ninguém percebe porque o cliente só acha estranho.
- **Reenvio por erro de integração.** Uma falha faz o sistema repetir o envio, sem verificar se a mensagem anterior já tinha saído, e o custo cresce justamente quando há instabilidade.
- **Campanha sem medição.** Um disparo de marketing é aprovado sem que se saiba quantas pessoas responderam ou compraram.
- **Atendimento parado sem aviso.** Sem forma de pagamento, as mensagens de serviço deixam de ser entregues depois da franquia. Para o cliente, parece que o atendimento simplesmente não respondeu.

## Como reduzir o custo sem piorar o atendimento?

Depois de ter os dados, ataque primeiro o que mais pesa:

- **Junte mensagens.** Se três balões seguidos não dependem de resposta, avalie enviar um só.
- **Corte o que ninguém usa.** Se um aviso não muda a ação do cliente, questione se ele precisa existir.
- **Reveja as automações em dobro.** Decida qual sistema é o dono de cada aviso.
- **Evite reenvios.** Use uma chave própria para cada evento, para que uma nova tentativa não gere uma segunda mensagem ao cliente.
- **Trate o menu com cuidado.** Um menu mal desenhado gera voltas e mais mensagens. Reduzir etapas ajuda o cliente e o custo.
- **Use a janela de anúncios com critério.** Quem investe em Click-to-WhatsApp pode ter uma janela gratuita, mas ela só vale nas condições descritas pela Meta.
- **Combine com outros canais.** Um portal para consultar pedido e nota pode resolver perguntas que hoje consomem mensagens. O guia sobre [portal de pedidos para distribuidora](/guias/portal-de-pedidos-para-distribuidora/) mostra um exemplo de como tirar parte do trabalho do WhatsApp.

Não corte só olhando o custo. Remover um aviso de entrega pode gerar mais perguntas e, no fim, mais mensagens. Meça antes e depois.

## A ferramenta pronta não atende 100%: o que fazer?

**A ferramenta pronta basta** quando ela já mostra as mensagens por fluxo e categoria, permite ajustar o bot sem depender de terceiros e não duplica envios. Se os relatórios existem, o ganho está em usá-los e revisar os fluxos todo mês.

**Uma integração sob medida vale a pena** quando:

- a ferramenta mostra o total, mas não diz qual automação gastou;
- os avisos saem de vários sistemas, como loja, ERP e CRM, sem um controle central;
- é preciso aplicar regras próprias de reenvio, prioridade ou horário;
- o custo precisa ser atribuído por filial, cliente ou equipe;
- o bot depende de dados do ERP, e cada consulta gera uma troca longa de mensagens.

Nem sempre é preciso substituir a ferramenta. Às vezes basta registrar os envios em uma camada própria e deixar a ferramenta atual cuidando do atendimento. Para estimar o investimento, veja [quanto custa um sistema sob medida](/guias/quanto-custa-um-sistema-sob-medida/).

## Por onde começar nesta semana?

1. Confirme a forma de pagamento no Billing Hub.
2. Compare as faturas de setembro e outubro por categoria e número.
3. Liste todos os sistemas que enviam mensagens pelo mesmo número.
4. Escolha as duas automações com mais volume e leia uma conversa real do começo ao fim.
5. Se os dados por fluxo não existirem, comece a registrá-los antes de mudar qualquer coisa.

Com um mês de dados, a decisão fica mais fácil, e a discussão deixa de ser sobre impressão.

## Integrações de WhatsApp para empresas de Canoas e Porto Alegre

Eu atendo empresas de Canoas, Porto Alegre e região metropolitana, além de outras cidades de forma remota. Trabalho com integrações entre WhatsApp, CRM e ERP, e o primeiro passo é mostrar o que cada fluxo consome, antes de reescrever qualquer bot.

Na página de [integrações](/integracoes/) está o que eu faço com APIs e automações. Se a sua conta subiu e ninguém sabe explicar por quê, [fale comigo](/#contato) informando quais sistemas enviam mensagens pelo seu número e como você recebe a fatura hoje.

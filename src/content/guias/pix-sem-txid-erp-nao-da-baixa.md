---
title: "Pix na Chave: ERP Não Dá Baixa Sozinho | Leonardo Assunção"
description: "Cliente pagou direto na chave Pix e o ERP não baixou a cobrança? Entenda por que o webhook não avisa e como conciliar sem conferir o extrato à mão."
h1: "Cliente pagou o Pix direto na chave e o ERP não deu baixa: como resolver"
resumo: "Para resolver, a empresa precisa conciliar esses recebimentos pelo extrato ou pela consulta de Pix recebidos, porque um pagamento feito direto na chave não tem txid e, pela regra do Banco Central, o webhook da API Pix só informa Pix associado a um txid. A consulta traz candidatos, regras de pagador, valor e data sugerem a cobrança certa, e os casos duvidosos ficam para uma pessoa decidir."
servico: integracoes
publishedAt: 2026-11-05
draft: false
faq:
  - q: "Por que o webhook não avisou do Pix pago direto na chave?"
    a: "O Manual de Padrões para Iniciação do Pix, do Banco Central, diz que somente Pix associados a um txid são informados pela funcionalidade webhook. Sem txid, o webhook da API Pix não avisa, mesmo com o dinheiro já na conta."
  - q: "O dinheiro do Pix sem txid entra na conta normalmente?"
    a: "Sim. A falta do txid afeta a identificação do pagamento dentro do sistema da empresa. O crédito aparece na conta, mas o ERP não tem como ligá-lo sozinho a uma cobrança específica."
  - q: "Posso dar baixa automática só pelo valor do Pix?"
    a: "Não é recomendável. Duas cobranças podem ter o mesmo valor. Use também o CPF ou CNPJ do pagador, quando disponível, e a data, e mande para revisão humana tudo o que não tiver uma única correspondência."
  - q: "Como reduzir os pagamentos diretos na chave?"
    a: "Envie o QR Code ou o Pix Copia e Cola com cada cobrança, deixe esse código em destaque na mensagem e evite divulgar a chave como forma padrão de pagamento de boletos ou faturas. Alguns clientes continuarão pagando na chave, por isso a conciliação ainda é necessária."
  - q: "E se o cliente pagou em duplicidade ou errou o valor?"
    a: "Esse caso não deve receber baixa automática. Registre a diferença, avise o financeiro e combine com o cliente se o valor será devolvido ou usado em outra cobrança. A Resolução BCB nº 1 trata da devolução de Pix e define prazo e exceções."
---

O cliente manda o comprovante às 10h. O dinheiro está na conta, mas o ERP continua mostrando a cobrança em aberto. À tarde, o financeiro envia uma mensagem automática de atraso para quem já pagou. O cliente reclama, alguém procura o valor no extrato e dá a baixa manualmente.

Se esse cenário é comum na sua empresa, a integração pode até estar funcionando. O pagamento só chegou por um caminho que o webhook da cobrança não cobre. Neste guia eu explico por que isso acontece e como montar uma conciliação que reduz a conferência manual. As informações técnicas foram conferidas em 5 de novembro de 2026 no Manual de Padrões para Iniciação do Pix (versão 2.10.0) e na especificação da API Pix publicada pelo Banco Central.

## Por que o ERP não dá baixa quando o Pix vem direto na chave?

O ERP precisa de alguma informação que ligue o dinheiro recebido à cobrança aberta. No Pix, esse elo é o **txid**, o identificador da transação, quando a cobrança é paga com ele.

O caminho normal é este:

1. O sistema cria uma cobrança com um txid.
2. O cliente paga pelo QR Code ou pelo Pix Copia e Cola daquela cobrança.
3. O txid volta na informação do pagamento.
4. O provedor avisa o sistema, e o ERP baixa a cobrança certa.

Quando o cliente abre o aplicativo do banco e digita a chave Pix da empresa, o passo 1 não participa do pagamento. O dinheiro chega, mas não vem com o identificador daquela cobrança.

O manual do Banco Central é claro ao descrever o webhook: "Somente Pix associados a um txid serão informados via a funcionalidade webhook". Portanto, a falta do aviso, nesse caso, não indica que o webhook está quebrado. A funcionalidade foi definida assim.

O problema aparece em discussões técnicas públicas. Em uma [discussão de 2022 no repositório da API Pix](https://github.com/bacen/pix-api/issues/522), um integrador descreve exatamente esse cenário: clientes pagam na chave, o webhook não chega, e o ERP não consegue baixar a cobrança.

Vale um cuidado com o QR Code estático. Ele pode ter um txid próprio ou usar `***`, valor que o manual indica para quando se opta por não usar um identificador. E o Banco Central alerta que a consistência desses pagamentos fica a cargo do recebedor, porque o provedor não tem como garantir que o txid não se repita. Um QR Code fixo no balcão, com o mesmo txid em todas as vendas, não identifica qual venda foi paga.

## Como a empresa controla isso hoje e o que perde?

Sem conciliação automática, o controle fica manual e dividido entre várias pessoas:

- **Extrato em uma planilha.** O financeiro exporta o extrato, cola em uma planilha e procura cada valor nas cobranças abertas.
- **Comprovante no WhatsApp.** O cliente envia a imagem para o vendedor, que repassa para o financeiro, que precisa achar o pagamento correspondente.
- **Anotação em papel.** Na correria, alguém anota "cliente pagou" ao lado do pedido para liberar a entrega antes da baixa.

Esse processo gera perdas concretas:

1. **Cobrança enviada para quem já pagou.** A régua de cobrança segue o ERP. Se a baixa atrasou, a mensagem sai mesmo assim e desgasta o relacionamento.
2. **Pedido preso por pagamento já feito.** Se a expedição depende da baixa, a mercadoria fica parada até alguém conferir o extrato.
3. **Pedido liberado sem pagamento.** A liberação baseada em uma imagem do WhatsApp não prova que o valor entrou na conta. Um comprovante agendado ou editado pode passar.
4. **Baixa na cobrança errada.** Dois clientes pagam o mesmo valor no mesmo dia, e a pessoa escolhe o primeiro que encontra. Um fica com crédito indevido e o outro continua sendo cobrado.
5. **Fechamento que não bate.** Sobram valores sem dono no extrato, e o fim do mês vira uma investigação.

## Como conciliar o Pix sem txid no ERP?

A solução não depende de adivinhar. Ela segue uma ordem simples.

### 1. Buscar todos os recebimentos

O webhook continua cuidando dos pagamentos com txid. Para os demais, é preciso uma consulta periódica. A especificação da API Pix prevê a consulta de Pix recebidos com filtros como período, `txIdPresente`, CPF e CNPJ. O parâmetro `txIdPresente` filtra pela presença do identificador. Confirme com o seu provedor se ele está disponível e como funciona na prática.

Nem todo provedor entrega os mesmos dados nem oferece a API da mesma forma. Na discussão de 2022 citada acima, os participantes relatam que um provedor havia deixado de devolver o CPF ou CNPJ na consulta, e que a identificação do pagador acabou vindo de um extrato de conciliação. Por isso, confirme com o seu banco ou provedor qual canal traz o documento do pagador: API, extrato por API ou arquivo.

### 2. Guardar cada recebimento uma única vez

Cada Pix tem um identificador próprio, o `endToEndId`. O sistema deve guardá-lo para que uma consulta repetida não gere duas baixas. Sem esse controle, reprocessar o dia de ontem pode dar baixa em dobro.

### 3. Procurar a cobrança correspondente

Uma regra de correspondência segura usa mais de um dado:

| Situação encontrada | O que fazer |
| --- | --- |
| Mesmo CPF/CNPJ, valor exato e uma única cobrança aberta | Baixa automática, se a empresa aceitar essa regra |
| Mesmo CPF/CNPJ, com várias cobranças do mesmo valor | Revisão humana, ou regra definida para a mais antiga |
| Mesmo CPF/CNPJ, com valor diferente | Revisão humana |
| Valor exato, mas pagador desconhecido | Revisão humana, com a cobrança sugerida |
| Nenhuma correspondência | Fila de "recebido sem identificação" |

O pagador pode não ser o cliente cadastrado: o sócio paga no CPF, a empresa do grupo paga com outro CNPJ, ou um parente paga pelo cliente. Uma boa solução aprende com isso e permite vincular outro pagador ao cliente, sempre com a confirmação de uma pessoa.

### 4. Tratar a exceção em uma fila

A fila de revisão é o que torna a automação confiável. A tela mostra o recebimento, os candidatos e o motivo da dúvida. A pessoa escolhe a cobrança, e a decisão fica registrada com nome e data. Isso substitui a planilha paralela.

### 5. Reduzir o problema na origem

- Envie o QR Code ou o Pix Copia e Cola em toda cobrança.
- Coloque esse código logo na primeira mensagem, para o cliente não precisar procurar a chave.
- Evite usar a chave Pix como dado padrão no rodapé de orçamentos e faturas, se a empresa puder cobrar com QR Code.
- Na discussão citada, um participante sugere pedir ao provedor, quando houver essa opção, para recusar Pix sem txid. Avalie o impacto antes: nem todo negócio aceita recusar um pagamento.

## O sistema pronto não atende 100%: o que fazer?

Comece verificando o que você já tem. **O sistema pronto basta** quando o ERP ou o provedor de cobrança já concilia o extrato, mostra o pagador e permite revisar as divergências. Nesse caso, o trabalho é configurar, treinar a equipe e mudar a forma de enviar as cobranças. Se o volume de Pix na chave é pequeno, uma conferência diária também pode bastar.

**Vale fazer uma integração sob medida** quando:

- o volume diário torna a conferência manual um gargalo;
- o recebimento está em um banco, e as cobranças, em outro sistema que não conversa com ele;
- a empresa recebe em mais de uma conta ou por mais de um provedor;
- há regras próprias, como baixa parcial, pagamento de várias faturas em um Pix ou clientes que pagam pelo CNPJ de outra empresa do grupo;
- o pedido precisa ser liberado assim que a baixa acontece.

Essa conciliação pode ficar ao lado do ERP, sem substituí-lo: lê os recebimentos, aplica as regras, grava a baixa pela API e guarda o histórico. O guia sobre [integração com o Bling via API](/guias/integracao-bling-api/) mostra como funciona esse tipo de camada em um ERP muito usado. Para entender o que pesa no orçamento, veja [quanto custa um sistema sob medida](/guias/quanto-custa-um-sistema-sob-medida/).

## E quando o cliente paga errado?

Pagamento duplicado, valor a mais e pagamento de cobrança já cancelada não devem cair em uma baixa automática. Mande esses casos para a fila de revisão e registre o que foi combinado com o cliente.

Se a decisão for devolver, a Resolução BCB nº 1 estabelece que a devolução de um Pix seja iniciada em até 90 dias da transação original, com exceções previstas na própria norma. Por isso, não deixe valores sem identificação parados por muito tempo.

Antes de automatizar, escreva a regra da empresa para cada situação. Se nem a equipe consegue dizer qual cobrança receberia o pagamento, o sistema também não vai conseguir.

## Conciliação de Pix para empresas de Canoas e Porto Alegre

Eu atendo empresas de Canoas, Porto Alegre e região metropolitana, além de outras cidades de forma remota. Antes de falar em desenvolvimento, o primeiro passo é medir: quantos Pix por mês chegam sem txid, quantos são identificados pelo documento do pagador e quantos dependem de alguém perguntar ao cliente.

Na página de [integrações](/integracoes/) está o que eu faço com ERPs, bancos e APIs. Se quiser avaliar o seu caso, [fale comigo](/#contato) informando qual ERP e qual banco ou provedor você usa, e como o financeiro faz a baixa hoje.

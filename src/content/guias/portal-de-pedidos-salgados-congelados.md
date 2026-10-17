---
title: "Portal de Pedidos: Salgados Congelados | Leonardo Assunção"
description: "Como um portal de pedidos ajuda a fábrica de salgados congelados a juntar os pedidos de mercados e lanchonetes, planejar a produção por lote e montar a rota."
h1: "Portal de pedidos para fábrica de salgados congelados que vende para mercados e lanchonetes"
resumo: "Um portal de pedidos para fábrica de salgados congelados deixa cada mercado e lanchonete fazer o próprio pedido até um horário de corte, e a fábrica usa a soma desses pedidos para planejar a produção por sabor e por lote e montar a rota de entrega. A diferença para um portal de distribuidora é que o pedido não sai do estoque: ele decide o que vai ser produzido."
servico: sistemas-web
publishedAt: 2026-10-17
draft: false
faq:
  - q: "Qual a diferença entre o portal de uma fábrica de salgados e o de uma distribuidora?"
    a: "Na distribuidora, o pedido é separado de um estoque que já existe. Na fábrica de salgados, boa parte do pedido ainda vai ser produzida. Por isso o portal precisa de horário de corte, soma de pedidos por sabor para planejar a produção e ligação com a rota de entrega, e não só de catálogo e preço por cliente."
  - q: "O que é horário de corte e por que ele importa?"
    a: "É o horário até o qual o cliente pode fazer ou alterar o pedido para uma data de entrega. Depois do corte, a fábrica fecha a lista de produção. Sem esse horário, pedidos chegam enquanto a produção já está rodando, e a fábrica produz a mais ou a menos."
  - q: "O portal precisa controlar lote e validade?"
    a: "A RDC nº 727/2022 da Anvisa exige identificação do lote e prazo de validade no rótulo de alimentos embalados, e diz que o lote é definido pelo fabricante. O portal não substitui o controle de produção, mas registrar qual lote foi para cada pedido ajuda a responder rápido quando um cliente pergunta por um pacote específico."
  - q: "Lanchonete pequena vai usar portal para pedir salgado?"
    a: "Algumas sim, outras não. O cliente que pede toda semana a mesma lista ganha com o pedido repetido e com o pedido fixo semanal. Quem prefere mandar mensagem pode continuar, e alguém da fábrica lança o pedido no portal. O importante é que todo pedido termine no mesmo lugar antes do corte."
  - q: "Quanto custa um portal de pedidos para fábrica de salgados?"
    a: "Depende das regras de pedido, das integrações com o ERP e da parte de produção e rota que entra no sistema. O guia sobre quanto custa um sistema sob medida explica os fatores que pesam no orçamento."
---

Uma fábrica de salgados congelados que vende para mercados, padarias e lanchonetes recebe pedidos que se repetem. A lanchonete pede coxinha, kibe e risole toda semana. O mercado repõe a gôndola do freezer a cada entrega. Esses pedidos chegam por WhatsApp, por telefone, pelo vendedor ou "igual ao da semana passada", e alguém transforma tudo numa lista do que produzir amanhã.

Neste guia eu explico o que um portal de pedidos precisa ter para esse tipo de fábrica. O foco é o que diferencia a fábrica de uma distribuidora: o pedido decide a produção do dia, a produção sai em lotes e a entrega segue uma rota. Para a parte de catálogo B2B, preço por cliente e pedido mínimo, o guia sobre [portal de pedidos para distribuidora](/guias/portal-de-pedidos-para-distribuidora/) já cobre o assunto, e aqui eu não repito.

## Como a fábrica de salgados controla pedidos e produção hoje?

Em muitas fábricas pequenas e médias, o controle passa por quatro lugares:

- **WhatsApp**, onde chegam os pedidos dos mercados e lanchonetes, as alterações de última hora e os avisos de entrega.
- **Caderno ou quadro na produção**, com a lista do que produzir no dia, escrita a partir das mensagens.
- **Planilha**, com os clientes fixos, os pedidos da semana e, às vezes, a conta de massa e recheio por sabor.
- **Romaneio em papel**, que o motorista leva com a ordem das entregas e o que deixar em cada cliente.

Cada passagem de um lugar para o outro é uma cópia feita à mão. É nessas cópias que as perdas aparecem:

1. **Produção a mais ou a menos de um sabor.** A lanchonete mandou uma alteração depois que a lista de produção foi fechada. A fábrica produz 300 coxinhas a menos do que precisava, ou um sabor que ninguém pediu fica no freezer.
2. **Pedido fixo esquecido.** O mercado compra toda terça e não manda mensagem, porque "já é combinado". Numa semana em que a pessoa que lembrava está de folga, o pedido não entra na produção.
3. **Entrega montada errada no caminhão.** O romaneio diz uma coisa, a caixa diz outra. A lanchonete recebe o kibe do mercado vizinho, e a troca exige uma segunda viagem com produto congelado.
4. **Rota feita de cabeça.** O motorista decide a ordem das entregas na hora. Clientes que fecham cedo ficam para o fim, e o produto passa mais tempo fora da câmara do que precisava.
5. **Lote que ninguém sabe para onde foi.** Um cliente reclama de um pacote, e a fábrica não sabe quais outros clientes receberam produtos daquele mesmo lote.

Nenhuma dessas perdas vem de falta de cuidado. Elas vêm de a informação do pedido estar espalhada. Quando o pedido nasce num lugar só, com cliente, data de entrega, sabores e quantidades, a fábrica consegue somar, planejar e conferir a partir de um registro confiável.

## O que o portal de pedidos precisa ter para uma fábrica de salgados?

Além do que qualquer portal B2B tem, como login por cliente e preço da tabela de cada um, uma fábrica de salgados precisa de recursos ligados à produção e à entrega:

| Recurso | Por que importa na fábrica de salgados |
| --- | --- |
| Data de entrega escolhida no pedido | O cliente pede para um dia, e a fábrica produz para aquele dia, não para "quando der". |
| Horário de corte por data | Até o corte, o cliente altera à vontade. Depois, o pedido fica travado e a produção é fechada. |
| Pedido fixo semanal | O mercado que compra toda terça tem o pedido gerado sozinho, e só ajusta o que mudar. |
| Dias de entrega por região | O cliente só escolhe os dias em que o caminhão passa pela região dele. |
| Embalagem e unidade de venda | Pacote com tantas unidades, caixa com tantos pacotes. O cliente pede na unidade em que a fábrica vende. |
| Aviso de sabor indisponível | Quando falta um recheio, o portal deixa de oferecer o sabor para a data, em vez de aceitar e cortar depois. |
| Situação do pedido | Recebido, em produção, carregado, entregue, sem o cliente precisar perguntar. |

O pedido fixo semanal merece atenção. Em fábricas que vendem para lanchonetes, ele costuma ser a maior parte do volume. Se o portal gera esse pedido sozinho e pede só a confirmação ou o ajuste, o cliente faz menos trabalho do que mandando mensagem, e esse é o melhor argumento para ele usar o portal.

## Como os pedidos viram planejamento de produção por lote?

Esse é o ponto que mais separa a fábrica de uma distribuidora. Na hora do corte, o portal tem todos os pedidos de uma data de entrega. A partir deles, o sistema monta o planejamento:

1. **Soma por sabor e por tamanho.** Quantas coxinhas de frango de 25 g, quantos kibes de 50 g, para todos os clientes da data.
2. **Desconto do que já está pronto.** O que já está congelado na câmara entra na conta, e só a diferença vai para a produção.
3. **Conversão em massa e recheio.** Com a ficha técnica de cada sabor, o sistema calcula a quantidade de massa, de recheio e de embalagem. Esse cálculo usa os dados da própria fábrica, e não um número genérico.
4. **Ordem de produção por lote.** O que sai na mesma produção, nas mesmas condições, vira um lote com identificação própria.
5. **Ligação entre lote e pedido.** Na expedição, o sistema registra qual lote foi para qual cliente.

A RDC nº 727/2022 da Anvisa, que trata da rotulagem de alimentos embalados, lista a identificação do lote e o prazo de validade entre as informações obrigatórias do rótulo. Ela também define lote como o conjunto de produtos de um mesmo tipo, processados pelo mesmo fabricante, num espaço de tempo determinado e sob condições essencialmente iguais, e diz que o lote é determinado pelo fabricante, segundo os critérios dele. A Anvisa abriu em 2025 um processo de revisão dessa norma, então vale conferir a versão vigente no site da agência. O portal não cuida do rótulo, mas registrar o lote em cada pedido torna simples responder à pergunta "quem mais recebeu esse lote?".

## Como o pedido vira rota de entrega?

Com os pedidos fechados, a fábrica sabe quem recebe o quê em cada data. O sistema pode então:

- **agrupar os pedidos por região e por dia de entrega**, seguindo os dias de rota cadastrados para cada cliente;
- **gerar o romaneio de carga**, na ordem inversa das entregas, para que a primeira entrega fique na porta do baú;
- **mostrar o horário de recebimento de cada cliente**, porque muitos mercados recebem mercadoria só em certas janelas;
- **registrar a entrega**, com quem recebeu e qualquer divergência, para o financeiro cobrar o que foi entregue de fato.

Se a fábrica tem caminhões com rastreamento, dá para cruzar a rota planejada com a posição real dos veículos. O guia sobre [integração com rastreamento veicular](/guias/integracao-rastreamento-veicular/) explica como os dados de telemetria chegam a outro sistema.

## Sistema pronto ou sistema que não atende 100% da fábrica?

Existem ERPs para indústria de alimentos, sistemas de força de vendas e plataformas de pedido B2B prontos. Para muitas fábricas, uma combinação deles resolve, e é honesto dizer isso antes de falar em sob medida.

**Um sistema pronto costuma bastar quando:**

- o ERP da fábrica já tem módulo de produção com ficha técnica e controle de lote;
- a plataforma de pedidos se integra a esse ERP e aceita data de entrega e pedido recorrente;
- a rota é simples, com poucos dias de entrega e regiões fixas;
- a fábrica aceita ajustar um pouco o próprio processo ao que a ferramenta oferece.

**Um portal sob medida ou uma integração própria vale a pena quando:**

- **o corte e a produção têm regras da casa**, como corte diferente por região, produção em dois turnos ou sabores que só saem em certos dias;
- **o pedido fixo semanal é a maior parte do volume** e a ferramenta pronta trata cada pedido como avulso;
- **o planejamento de produção vive numa planilha à parte**, porque o sistema de pedidos não conversa com a produção. Essa planilha é exatamente onde as perdas da lista acima voltam;
- **a fábrica já usa um sistema que não atende 100%** e não quer trocar tudo: muitas vezes basta um módulo que junta os pedidos, calcula a produção e devolve tudo ao ERP.

O último caso é o mais comum. Trocar o ERP inteiro raramente é a resposta. Um portal de pedidos que entrega ao ERP o pedido certo, e à produção a lista certa, já resolve a parte que mais gera erro. O guia sobre [quanto custa um sistema sob medida](/guias/quanto-custa-um-sistema-sob-medida/) explica os fatores que entram no orçamento desse tipo de projeto.

## Por onde começar a organizar os pedidos da fábrica?

Antes de qualquer sistema, alguns passos já reduzem as perdas:

1. **Definir o horário de corte** e avisar todos os clientes. Só isso já evita boa parte da produção errada.
2. **Listar os pedidos fixos** de cada cliente, com sabores, quantidades e dia de entrega.
3. **Padronizar a unidade de venda** de cada produto: pacote, caixa, quantidade por pacote.
4. **Escrever a ficha técnica** de cada sabor, para a conta de massa e recheio não depender de uma pessoa.
5. **Cadastrar os dias de rota por região**, para saber quem pode receber em cada dia.

Com esses dados organizados, a migração para um portal fica muito mais rápida, e o sistema já nasce com as regras da fábrica.

## Portal de pedidos para fábricas de Canoas e Porto Alegre

Canoas, Porto Alegre e a região metropolitana concentram muitos mercados, padarias e lanchonetes que compram salgados congelados de fábricas da própria região. Eu desenvolvo sistemas web e integrações com ERPs para empresas de Canoas, Porto Alegre e região, e de todo o Brasil de forma remota.

Na página de [sistemas web](/sistemas-web/) estão os tipos de sistema que eu construo, como portais de clientes e painéis administrativos. Se a sua fábrica quer juntar os pedidos num lugar só e planejar a produção a partir deles, [fale comigo](/#contato) contando como os pedidos chegam hoje e qual sistema você usa.

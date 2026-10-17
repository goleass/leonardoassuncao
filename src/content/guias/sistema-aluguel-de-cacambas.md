---
title: "Sistema para Aluguel de Caçambas | Leonardo Assunção"
description: "O que um sistema para aluguel de caçambas precisa controlar: entregas, trocas e retiradas por endereço, prazo de permanência e caçambas no pátio."
h1: "Sistema para empresa de aluguel de caçambas: controlar entregas, retiradas e trocas por endereço"
resumo: "Um sistema para empresa de aluguel de caçambas precisa registrar cada caçamba com número próprio, saber em que endereço ela está desde quando, agendar entrega, troca e retirada como serviços ligados a esse endereço e avisar quando o prazo de permanência combinado vence. Com isso, o motorista sai com a rota certa, a caçamba esquecida na obra aparece na tela e o pátio mostra o que está disponível de verdade."
servico: software-sob-medida
publishedAt: 2026-10-17
draft: false
faq:
  - q: "Por que o sistema de caçambas precisa ser organizado por endereço, e não só por cliente?"
    a: "Porque o mesmo cliente, como uma construtora, pode ter caçambas em várias obras ao mesmo tempo. A entrega, a troca e a retirada acontecem num endereço específico, com uma caçamba específica. Se o sistema só conhece o cliente, o motorista não sabe qual caçamba trocar nem onde."
  - q: "Empresa de caçamba precisa emitir MTR no Rio Grande do Sul?"
    a: "A Portaria FEPAM nº 576/2026 torna obrigatório o sistema MTR Online para o transporte de resíduos no estado, mas lista exceções. Uma delas são os resíduos da construção civil, exceto os perigosos da Classe D. Como a regra pode mudar e cada caso tem detalhes, confirme a situação da sua operação com a FEPAM."
  - q: "Planilha não basta para controlar as caçambas?"
    a: "Com poucas caçambas e um só motorista, uma planilha bem cuidada funciona. Quando a frota de caçambas cresce, a planilha não avisa o vencimento do prazo, não monta a rota do dia e não mostra quais caçambas estão no pátio. É aí que caçambas ficam esquecidas nas obras."
  - q: "O sistema pode mostrar onde estão os caminhões?"
    a: "Pode, se os caminhões têm rastreador e a plataforma de rastreamento oferece API. O sistema cruza a rota planejada com a posição real e registra quando o caminhão passou no endereço. Sem rastreador, o motorista confirma cada serviço pelo celular."
  - q: "Sistema pronto ou sob medida para aluguel de caçambas?"
    a: "Se um sistema pronto controla caçambas por número e endereço, agenda trocas e retiradas e avisa o prazo de permanência, ele provavelmente basta. O sob medida vale quando a empresa tem regras próprias de cobrança e prazo, precisa integrar com o ERP ou com o rastreamento, ou quando o sistema atual não atende 100% e a equipe mantém uma planilha paralela."
---

Uma empresa de aluguel de caçambas não vende um produto que sai e não volta. Cada caçamba entra numa obra, fica lá por um tempo, é trocada quando enche e volta para o pátio. O dia a dia é uma agenda de entregas, trocas e retiradas em dezenas de endereços diferentes, com caminhões que precisam passar no lugar certo, com a caçamba certa, na hora combinada.

Neste guia eu explico o que um sistema para esse tipo de empresa precisa controlar, por que o endereço é a peça central, como o prazo de permanência vira aviso e cobrança, e quando um sistema pronto resolve sem precisar de nada sob medida.

## Como a empresa de caçambas controla entregas e retiradas hoje?

Em muitas empresas do ramo, o controle está espalhado:

- **WhatsApp**, onde chegam os pedidos de caçamba, os pedidos de troca ("encheu, pode vir buscar") e as mensagens com o endereço da obra.
- **Caderno ou quadro na parede**, com as caçambas que saíram e o endereço de cada uma.
- **Planilha**, com o cliente, a data de entrega e, às vezes, a data combinada para retirada.
- **Papel com o motorista**, com a lista de serviços do dia, montada de manhã.

Essa combinação funciona enquanto a empresa é pequena e a mesma pessoa atende o telefone e monta a rota. Quando cresce, as perdas aparecem:

1. **Caçamba esquecida na obra além do prazo.** O prazo combinado venceu, ninguém olhou a planilha e a caçamba ficou semanas no mesmo endereço. A empresa deixa de cobrar o período extra e fica com uma caçamba a menos no pátio.
2. **Troca agendada no endereço errado.** O cliente tem duas obras. O pedido de troca chegou pelo WhatsApp, foi anotado com o endereço da outra obra e o caminhão perdeu a viagem.
3. **Caçamba que "não está em lugar nenhum".** O quadro diz que a caçamba voltou, a planilha diz que está numa obra. Na hora de atender um pedido novo, a empresa não sabe quantas caçambas tem disponíveis de verdade.
4. **Retirada pedida e não feita.** O cliente pediu para retirar, a mensagem ficou sem resposta e a caçamba cheia continuou na rua. O cliente reclama, e a empresa perde a confiança de quem poderia contratar de novo.
5. **Serviço feito e não cobrado.** A troca extra foi feita no fim do dia, anotada no papel do motorista e nunca chegou ao financeiro.

O ponto em comum é que a informação de onde está cada caçamba não fica num lugar só. Organizar essa informação, com caçamba, endereço e datas no mesmo registro, é o que transforma a agenda do dia numa lista confiável.

## O que um sistema de aluguel de caçambas precisa controlar?

O centro do sistema é a caçamba no endereço. Cada caçamba tem número próprio, e cada vez que ela vai para uma obra, o sistema abre um período de locação ligado àquele endereço.

| Parte do sistema | O que controla |
| --- | --- |
| Caçambas | Número, tamanho, situação (no pátio, em obra, em manutenção) e histórico de onde esteve. |
| Clientes e endereços | Cada cliente com as suas obras, cada obra com endereço completo, ponto de referência e contato no local. |
| Locações | Qual caçamba está em qual endereço, desde quando e até quando foi combinado. |
| Serviços | Entrega, troca e retirada, cada um com data, endereço, caçamba e motorista. |
| Prazo de permanência | Data combinada de retirada, aviso antes de vencer e registro do período extra. |
| Pátio | Quantas caçambas estão disponíveis, por tamanho, a cada dia. |
| Cobrança | Período de locação, trocas e dias extras, prontos para faturar. |

### Entrega, troca e retirada são serviços diferentes

O sistema precisa tratar cada um como um serviço próprio:

- **Entrega:** uma caçamba do pátio vai para um endereço novo e abre uma locação.
- **Troca:** a caçamba cheia sai do endereço e uma vazia entra no lugar. São duas caçambas, um só endereço, e a locação continua.
- **Retirada:** a caçamba sai do endereço e a locação fecha.

Quando a troca é registrada como "retirada mais entrega" soltas, o histórico se perde e a cobrança fica confusa. Quando é registrada como troca, o sistema sabe que a obra continua ativa e que o prazo de permanência pode mudar.

## Como funcionam o prazo de permanência e a caçamba no pátio?

O prazo de permanência é o tempo que a caçamba pode ficar no endereço pelo valor combinado. Ele depende da regra da empresa e do que foi acertado com o cliente. O sistema não deve fixar esse prazo no código: ele fica configurável por tipo de locação ou por cliente.

Com o prazo registrado, o sistema faz o que a planilha não faz:

1. **Lista as caçambas que vencem** nos próximos dias, por endereço.
2. **Avisa o cliente** antes do vencimento, perguntando se quer troca, retirada ou mais prazo.
3. **Agenda o serviço** a partir da resposta, já com o endereço e a caçamba certos.
4. **Registra o período extra** quando a caçamba passa do prazo, para a cobrança sair certa.

Do outro lado está o pátio. Cada retirada devolve uma caçamba ao pátio, e cada entrega tira uma. O sistema mostra, para cada dia, quantas caçambas de cada tamanho estarão disponíveis. Isso evita aceitar um pedido para amanhã sem ter caçamba para entregar.

### As regras locais entram no sistema

Em Porto Alegre, a EPTC informa que o uso de caçambas na via pública é regulado pela Lei Municipal nº 10.474/2008 e que a empresa responsável precisa pedir autorização para uso da via com antecedência mínima de um dia útil, pelo formulário de Licenças para Obras e Eventos. A mesma orientação, publicada pela EPTC em agosto de 2026, diz que cada face lateral da caçamba deve trazer o número de identificação, o nome e o telefone da empresa. Em Canoas e nos outros municípios da região, as regras são definidas por cada prefeitura, e vale confirmar antes de configurar o sistema.

Para o sistema, isso significa: a entrega em via pública pode ter uma etapa de autorização antes de ser liberada para a rota, e o número da caçamba no sistema deve ser o mesmo pintado nela.

Sobre o transporte do resíduo, a Portaria FEPAM nº 576/2026 torna obrigatório o sistema MTR Online para o transporte de resíduos no Rio Grande do Sul, mas lista exceções. Uma delas são os resíduos da construção civil, exceto os perigosos da Classe D, a classificação da Resolução CONAMA nº 307/2002. Se a empresa recolhe resíduos que entram na obrigação, o sistema pode guardar o número do MTR de cada retirada.

## Como montar a rota do dia por endereço?

Com os serviços agendados, a rota do dia sai do sistema, e não da cabeça de quem atende:

- **agrupar os serviços por região**, para o caminhão não cruzar a cidade várias vezes;
- **levar em conta a capacidade do caminhão**, que carrega um número limitado de caçambas vazias para entregas e trocas;
- **mostrar o endereço completo, o ponto de referência e o contato no local** para cada parada;
- **confirmar cada serviço pelo celular do motorista**, com horário e, se possível, foto da caçamba no local.

Se os caminhões têm rastreador, dá para cruzar a rota planejada com a posição real e registrar quando o caminhão passou em cada endereço. O guia sobre [integração com rastreamento veicular](/guias/integracao-rastreamento-veicular/) explica como os dados de telemetria chegam a outro sistema.

## Sistema pronto ou sistema que não atende 100% da operação?

Existem sistemas prontos para locadoras de caçambas e sistemas genéricos de locação de equipamentos. Para muitas empresas, um deles resolve, e vale testar antes de pensar em sob medida.

**Um sistema pronto costuma bastar quando:**

- ele controla cada caçamba por número e por endereço;
- trata entrega, troca e retirada como serviços diferentes;
- avisa o vencimento do prazo de permanência;
- mostra as caçambas disponíveis no pátio.

**Um software sob medida, ou uma integração, vale a pena quando:**

- **a empresa tem regras próprias de prazo e cobrança**, como prazo diferente por tamanho de caçamba, pacotes de trocas para construtoras ou cobrança por período extra com regras da casa;
- **o sistema precisa conversar com o ERP**, para faturar e emitir nota sem digitar de novo;
- **os caminhões têm rastreamento** e a empresa quer cruzar a rota com a posição real;
- **a empresa já usa um sistema que não atende 100%**, e mantém uma planilha paralela de caçambas ou de prazos. Essa planilha é onde as caçambas esquecidas voltam a aparecer.

O último caso é o mais comum. Às vezes não é preciso trocar tudo: um módulo de prazos e avisos, ou uma integração com o rastreamento, resolve a parte que mais gera perda. Para entender o que pesa no orçamento, o guia sobre [quanto custa um sistema sob medida](/guias/quanto-custa-um-sistema-sob-medida/) explica os fatores.

## Por onde começar a organizar as caçambas?

Antes de qualquer sistema, alguns passos já reduzem as perdas:

1. **Numerar todas as caçambas** e usar o mesmo número em todo lugar: na caçamba, no caderno, na planilha.
2. **Registrar o endereço completo de cada obra**, com ponto de referência e contato no local.
3. **Anotar a data combinada de retirada** em cada entrega.
4. **Fazer uma contagem do pátio** toda semana e comparar com o que o controle diz.
5. **Separar os pedidos de troca e retirada** dos outros assuntos do WhatsApp, numa lista própria.

Com esses dados organizados, a migração para qualquer sistema fica mais rápida, e os avisos de prazo começam a funcionar desde o primeiro mês.

## Sistema para empresas de caçambas de Canoas e Porto Alegre

Canoas, Porto Alegre e a região metropolitana têm obras e reformas o ano todo, e cada uma delas pode ter uma caçamba na porta. Eu desenvolvo software sob medida para empresas de Canoas, Porto Alegre e região, e de todo o Brasil de forma remota.

Na página de [software sob medida](/software-sob-medida/) estão os tipos de sistema e automação que eu construo. Se a sua empresa quer controlar entregas, trocas e retiradas por endereço sem depender de planilha, [fale comigo](/#contato) contando como esse controle é feito hoje.

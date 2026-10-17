---
title: "Software para Recarga de Extintores | Leonardo Assunção"
description: "O que um software para empresa de recarga de extintores precisa controlar: cada equipamento, o cliente, os vencimentos de manutenção e o aviso antes de vencer."
h1: "Software para empresa de recarga de extintores controlar equipamentos, clientes e vencimentos"
resumo: "Um software para empresa de recarga de extintores precisa cadastrar cada extintor como um equipamento próprio, ligado ao cliente e ao local onde está instalado, guardar as datas de cada inspeção, manutenção e ensaio hidrostático, e avisar a empresa e o cliente antes de cada vencimento. Com isso, o retorno do cliente deixa de depender de alguém lembrar, e o histórico de cada equipamento fica pronto para consulta."
servico: software-sob-medida
publishedAt: 2026-10-17
draft: false
faq:
  - q: "Quais vencimentos um software de extintores precisa controlar?"
    a: "No mínimo, a próxima inspeção técnica, a próxima manutenção e o próximo ensaio hidrostático de cada extintor. As periodicidades seguem a ABNT NBR 12962 e o regulamento do Inmetro vigente, por isso o ideal é que o software permita configurar os prazos por tipo de extintor, em vez de deixá-los fixos no código."
  - q: "Quais são os níveis de manutenção de um extintor?"
    a: "Segundo o relatório de avaliação do regulamento publicado pelo Inmetro em 2026, a manutenção de 1º nível é feita no ato da inspeção, sem abrir o extintor; a de 2º nível exige abertura e recarga, nas dependências do prestador; e a de 3º nível é a revisão total, com ensaio hidrostático, também nas dependências do prestador."
  - q: "Planilha não basta para controlar os extintores dos clientes?"
    a: "Para poucos clientes, uma planilha bem organizada funciona. O problema aparece quando a carteira cresce: a planilha não avisa sozinha, não liga o extintor ao histórico de serviços e depende de alguém filtrar as datas todo mês. É aí que os vencimentos começam a passar sem aviso."
  - q: "O software pode avisar o cliente pelo WhatsApp?"
    a: "Pode, desde que a mensagem seja enviada pela API oficial do WhatsApp Business ou por uma plataforma de atendimento que ofereça API. O software identifica os extintores que vencem no período e dispara o aviso com a lista de equipamentos e o local de cada um."
  - q: "Preciso de software sob medida ou de um sistema pronto?"
    a: "Se um sistema pronto cadastra cada extintor, controla os vencimentos e avisa o cliente, ele provavelmente basta. O sob medida vale quando a empresa tem regras próprias de contrato, precisa integrar com o ERP e o financeiro, ou quando o sistema atual não atende 100% e a equipe mantém uma planilha paralela."
---

Uma empresa de recarga de extintores vive de retorno. O extintor que foi recarregado hoje vai precisar de nova inspeção, nova manutenção e, mais à frente, de ensaio hidrostático. Se a empresa sabe quando cada um vence e avisa o cliente na hora certa, o serviço volta sozinho. Se não sabe, o cliente descobre o vencimento numa fiscalização, ou numa emergência, e talvez chame outra empresa.

Neste guia eu explico o que um software para empresa de recarga de extintores precisa controlar, por que o equipamento é a peça central do sistema, como funcionam os avisos de vencimento e quando um sistema pronto resolve. As referências regulatórias são a ABNT NBR 12962, norma de inspeção e manutenção de extintores, e a Portaria Inmetro nº 58/2022, que reúne o regulamento técnico e os requisitos de avaliação da conformidade desse serviço.

## Como a empresa de extintores controla clientes e vencimentos hoje?

Em muitas empresas do ramo, o controle está dividido assim:

- **Ficha ou caderno de papel**, com os extintores retirados de cada cliente e a data do serviço.
- **Planilha**, com uma linha por cliente ou por extintor e a data do próximo vencimento, atualizada quando sobra tempo.
- **WhatsApp**, para combinar a retirada e a devolução, mandar orçamento e cobrar.
- **Memória de quem atende**, que sabe que "aquele condomínio vence em março".

Essa combinação funciona enquanto a carteira é pequena e a mesma pessoa cuida de tudo. Quando cresce, as perdas aparecem:

1. **Extintor vence e o cliente não é avisado.** A planilha tem a data, mas ninguém filtrou o mês. O cliente fica com o equipamento vencido e só descobre quando alguém aponta.
2. **Ensaio hidrostático esquecido.** A recarga é lembrada porque é frequente. O ensaio, mais espaçado, fica fora do controle, e o extintor segue em uso sem a revisão de 3º nível.
3. **Extintor trocado entre clientes.** Vários extintores iguais chegam à oficina no mesmo dia. Sem identificação ligada ao cadastro, o equipamento volta para o cliente errado, ou para o local errado dentro do mesmo cliente.
4. **Histórico que não se encontra.** O cliente pede o histórico dos extintores para uma vistoria, e a empresa precisa juntar fichas, mensagens e planilhas para montar a resposta.
5. **Serviço que não vira cobrança.** A troca de uma peça ou um extintor substituído ficou anotado no papel e não chegou ao financeiro.

O ponto em comum é a falta de um registro único por equipamento. Organizar essa informação é o que transforma vencimento em serviço agendado, e não em surpresa.

## O que um software de recarga de extintores precisa controlar?

O centro do sistema é o extintor, não o cliente. Cada extintor tem cadastro próprio, ligado a um cliente e a um local, e cada serviço feito fica registrado nele.

| Parte do sistema | O que controla |
| --- | --- |
| Cliente e locais | Empresa, condomínio ou residência, com cada local onde há extintores: bloco, andar, setor, veículo. |
| Cadastro do extintor | Tipo de agente, capacidade, fabricante, número de identificação e local de instalação. |
| Serviços realizados | Inspeção técnica, manutenção de 1º, 2º ou 3º nível, data, responsável e peças trocadas. |
| Próximos vencimentos | Próxima inspeção, próxima manutenção e próximo ensaio hidrostático, calculados a partir do último serviço. |
| Retirada e devolução | Quais extintores saíram de cada cliente, onde estão na oficina e quando voltam. |
| Avisos | Lista do que vence no período, por cliente, com envio de aviso antes do prazo. |
| Relatórios | Histórico por extintor e por cliente, pronto para entregar quando o cliente precisar. |

### Os níveis de manutenção no sistema

O relatório de avaliação do regulamento de inspeção técnica e manutenção de extintores, publicado pelo Inmetro em 2026, descreve a inspeção técnica como o exame externo, sem desmontagem, que define o nível de manutenção necessário. A manutenção tem três níveis:

- **1º nível:** feita geralmente no ato da inspeção, no local onde o extintor está, sem abertura nem recarga.
- **2º nível:** exige abertura e recarga do extintor, nas dependências do prestador do serviço.
- **3º nível:** revisão total do extintor, com ensaio hidrostático, também nas dependências do prestador.

O software precisa registrar qual nível foi feito em cada extintor, porque é isso que define a próxima data de cada tipo de serviço.

### Prazos configuráveis, não fixos

As periodicidades de inspeção, manutenção e ensaio seguem a ABNT NBR 12962 e o regulamento do Inmetro vigente, e podem variar por tipo de extintor. Normas e regulamentos mudam: o próprio Inmetro listou alterações na Portaria nº 58/2022, incluindo a Portaria Inmetro nº 314/2025, que criou um novo Selo de Identificação da Conformidade com QR Code. Por isso, um bom software não deixa os prazos escritos no código. Eles ficam numa tabela que a empresa ajusta quando a regra muda, e o sistema recalcula os vencimentos.

## Como funcionam os avisos de vencimento ao cliente?

O aviso é o que transforma o controle em receita. O fluxo é simples:

1. **O sistema calcula os vencimentos** de cada extintor a partir do último serviço e da regra configurada.
2. **Todo mês, gera a lista do que vence** nos próximos dias, agrupada por cliente e por local.
3. **A equipe recebe a lista** e decide a abordagem: ligar, mandar mensagem, agendar a retirada.
4. **O cliente recebe o aviso** com os extintores que vencem, o local de cada um e um caminho para agendar. Pelo WhatsApp, isso exige a API oficial do WhatsApp Business ou uma plataforma de atendimento com API.
5. **O agendamento vira ordem de serviço**, e o ciclo recomeça quando o extintor volta ao cliente.

Esse controle se parece com o de uma empresa de ar-condicionado com contratos de manutenção: equipamento cadastrado, histórico e visitas que se repetem. O guia sobre [sistema de ordens de serviço para ar-condicionado](/guias/sistema-ordem-de-servico-ar-condicionado/) mostra como a manutenção recorrente e o registro por equipamento funcionam nesse outro ramo, e muitas ideias valem para os dois.

## Sistema pronto ou sistema que não atende 100% da operação?

Existem sistemas prontos para empresas de extintores e sistemas genéricos de ordem de serviço que podem ser adaptados. Para muitas empresas, um deles resolve, e vale testar antes de pensar em sob medida.

**Um sistema pronto costuma bastar quando:**

- ele cadastra cada extintor individualmente, ligado ao cliente e ao local;
- calcula os vencimentos e permite ajustar os prazos;
- avisa a equipe e o cliente antes do vencimento;
- gera o histórico por equipamento que os clientes pedem.

**Um software sob medida, ou uma integração, vale a pena quando:**

- **a empresa tem contratos com regras próprias**, como inspeção periódica incluída, troca de extintor reserva ou atendimento por unidade de uma rede de clientes;
- **o sistema precisa conversar com o ERP e o financeiro**, para faturar o serviço, baixar peças do estoque e emitir a nota sem digitar de novo;
- **os clientes pedem relatórios num formato específico**, por exemplo por prédio ou por veículo de frota;
- **a empresa já usa um sistema que não atende 100%**, e mantém uma planilha paralela de vencimentos ou de equipamentos. Essa planilha é onde os avisos voltam a falhar.

O último ponto merece atenção. Um sistema que cuida da ordem de serviço, mas não dos vencimentos, deixa de fora justamente o que traz o cliente de volta. Às vezes não é preciso trocar tudo: um módulo de vencimentos e avisos integrado ao que já existe resolve.

Para entender o que pesa no orçamento de um sistema sob medida, o guia sobre [quanto custa um sistema sob medida](/guias/quanto-custa-um-sistema-sob-medida/) explica os fatores, como número de cadastros, perfis de acesso e integrações.

## Por onde começar a organizar os extintores dos clientes?

Antes de qualquer software, alguns passos já reduzem as perdas:

1. **Identificar cada extintor** com um código único ligado ao cadastro do cliente, para não trocar equipamentos na oficina.
2. **Registrar o local de cada um**: bloco, andar, setor ou veículo.
3. **Anotar o último serviço de cada nível**, inclusive a data do último ensaio hidrostático.
4. **Definir quem olha os vencimentos** e com que frequência.
5. **Medir quantos extintores venceram sem aviso** no último ano. Esse número mostra quanto serviço está ficando para trás.

Com esses dados organizados, a migração para qualquer sistema fica mais rápida, e os avisos começam a funcionar desde o primeiro mês.

## Software para empresas de extintores de Canoas e Porto Alegre

Canoas, Porto Alegre e a região metropolitana têm muitos condomínios, comércios, indústrias e frotas, e cada um deles tem extintores com vencimentos a controlar. Eu desenvolvo software sob medida para empresas de Canoas, Porto Alegre e região, e de todo o Brasil de forma remota.

Na página de [software sob medida](/software-sob-medida/) estão os tipos de sistema e automação que eu construo. Se a sua empresa quer controlar os vencimentos dos extintores dos clientes sem depender de planilha, [fale comigo](/#contato) contando como esse controle é feito hoje.

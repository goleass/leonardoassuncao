---
title: "Sistema de OS para Ar-Condicionado | Leonardo Assunção"
description: "O que um sistema de ordens de serviço precisa ter para empresa de ar-condicionado: visitas, técnicos em campo, manutenção preventiva e registros do PMOC."
h1: "Sistema de ordens de serviço para empresa de ar-condicionado: visitas, técnicos e manutenção recorrente"
resumo: "Um sistema de ordens de serviço para empresa de ar-condicionado precisa agendar visitas, mandar a OS certa para o técnico certo, registrar o que foi feito em cada equipamento e gerar sozinho as visitas da manutenção preventiva de cada contrato. Para clientes que exigem PMOC, ele também guarda o histórico de execução por equipamento, que a Portaria GM/MS 3.523/1998 manda manter disponível."
servico: sistemas-web
publishedAt: 2026-10-17
draft: false
faq:
  - q: "Qual a diferença entre OS corretiva, preventiva e de contrato?"
    a: "A OS corretiva nasce de um chamado: o aparelho parou ou está com defeito. A preventiva é planejada para evitar a falha, com limpeza, troca de filtro e verificação. A OS de contrato é a preventiva que se repete numa frequência combinada com o cliente, e o sistema deve gerá-la sozinho a partir do contrato."
  - q: "Toda empresa com ar-condicionado precisa de PMOC?"
    a: "A Lei 13.589/2018 exige PMOC dos sistemas de climatização em edifícios de uso público e coletivo com ambientes climatizados artificialmente. A Portaria GM/MS 3.523/1998 exige responsável técnico habilitado para sistemas com capacidade acima de 5 TR (60.000 BTU/h). Casos específicos devem ser confirmados com o responsável técnico ou com a vigilância sanitária."
  - q: "O sistema de OS substitui o responsável técnico do PMOC?"
    a: "Não. O plano e a responsabilidade técnica continuam com o profissional habilitado. O sistema organiza a execução: agenda as atividades do plano, registra o que cada técnico fez e guarda o histórico para consulta e fiscalização."
  - q: "O técnico precisa de internet para preencher a OS no celular?"
    a: "Não necessariamente. Um sistema web pode ser feito para funcionar no celular e guardar o preenchimento quando o sinal cai, por exemplo em casa de máquinas ou subsolo, e enviar quando a conexão volta. Isso precisa ser previsto no projeto."
  - q: "Vale mais um aplicativo pronto de ordens de serviço ou um sistema sob medida?"
    a: "Se a empresa faz principalmente instalação e conserto avulso, um aplicativo pronto de OS costuma bastar. O sistema sob medida vale quando a carteira de contratos de manutenção é grande, quando o PMOC exige registros que o aplicativo não guarda por equipamento ou quando a OS precisa conversar com o ERP e o financeiro."
---

Numa empresa de ar-condicionado, o trabalho se divide em três tipos de visita: a instalação, o conserto que surge de um chamado e a manutenção preventiva que se repete o ano inteiro. As duas primeiras aparecem sozinhas, porque o cliente liga. A terceira só acontece se alguém lembrar. É ali que a organização da empresa faz mais diferença, e é também ali que estão os contratos que dão receita previsível.

Neste guia eu explico o que um sistema de ordens de serviço precisa ter para esse tipo de empresa, como a manutenção recorrente e o PMOC entram no sistema, e quando um aplicativo pronto resolve. As referências legais são a Lei 13.589/2018 e a Portaria GM/MS 3.523/1998, conferidas no texto oficial.

## Como a empresa de ar-condicionado controla as visitas hoje?

Em muitas empresas pequenas e médias do ramo, o controle está espalhado:

- **WhatsApp**, para receber chamado, combinar horário com o cliente e mandar o endereço para o técnico.
- **Agenda de papel ou de celular**, com as visitas do dia, muitas vezes só na cabeça de quem distribui o serviço.
- **Talão de OS em papel**, preenchido pelo técnico e trazido de volta no fim do dia, ou no fim da semana.
- **Planilha de contratos**, com os clientes de manutenção e a data da última visita, atualizada quando dá.

Cada ferramenta funciona sozinha. O problema é que nenhuma delas sabe o que a outra sabe. As perdas são típicas do ramo:

1. **Preventiva esquecida.** O contrato prevê visita periódica, mas a planilha não avisa. O cliente liga reclamando do aparelho sujo, e a empresa descobre que a visita passou do prazo combinado.
2. **Registro do PMOC incompleto.** O técnico fez a limpeza, mas o papel com o que foi feito em cada equipamento se perdeu ou ficou ilegível. Quando o cliente ou a fiscalização pede o histórico, não há como provar a execução.
3. **Técnico sem informação.** O técnico chega sem saber o modelo do aparelho, a peça que faltou na última visita ou que o equipamento já teve o mesmo defeito. Volta para buscar peça, e a visita vira duas.
4. **Técnico no endereço errado.** O cliente tem várias unidades, o endereço foi passado por mensagem e o técnico vai à loja errada.
5. **Serviço feito e não cobrado.** A OS em papel não voltou para o escritório, e o serviço extra feito na visita nunca vira cobrança.

O que resolve não é ter mais uma ferramenta, e sim reunir a informação num só lugar: cliente, endereço, equipamento, contrato, OS e histórico, ligados entre si.

## O que um sistema de OS para ar-condicionado precisa ter?

O núcleo do sistema é o equipamento. Cada aparelho tem cadastro próprio, ligado ao cliente e ao endereço, e todo serviço feito fica no histórico dele.

| Parte do sistema | O que faz |
| --- | --- |
| Cadastro de clientes e endereços | Um cliente com várias unidades, cada uma com endereço, contato e horário de acesso. |
| Cadastro de equipamentos | Marca, modelo, capacidade, local de instalação e data de instalação de cada aparelho. |
| Abertura de chamado | O pedido do cliente vira OS com prioridade, endereço e equipamento já identificados. |
| Agenda e distribuição | Quem vai, quando e em qual ordem, com a agenda de cada técnico visível. |
| OS no celular | O técnico vê o histórico, preenche o que fez, registra fotos, peças usadas e assinatura do cliente. |
| Contratos de manutenção | Frequência da preventiva por cliente ou por equipamento, com geração automática das próximas OS. |
| Histórico por equipamento | Tudo o que foi feito em cada aparelho, com data, técnico e fotos. |
| Relatórios para o cliente | Relatório de visita e histórico do período, para o cliente e para o responsável técnico. |

### Corretiva, preventiva e contrato: três tipos de OS

O sistema precisa tratar os três tipos de forma diferente:

- **OS corretiva** nasce de um chamado. A urgência importa, e o técnico precisa chegar sabendo o histórico do aparelho.
- **OS preventiva** é planejada: limpeza, troca de filtro, verificação. Ela segue um roteiro de atividades, e o técnico marca item por item.
- **OS de contrato** é a preventiva que se repete. O contrato diz a frequência, e o sistema gera as próximas OS sozinho. Ninguém precisa lembrar.

A terceira é a que mais muda a rotina. Com as visitas do mês geradas a partir dos contratos, a agenda é montada com antecedência, as rotas podem ser agrupadas por região e a preventiva deixa de depender de memória.

## Como o PMOC entra no sistema de ordens de serviço?

A Lei 13.589/2018 determina que os edifícios de uso público e coletivo com ambientes de ar climatizado artificialmente tenham um Plano de Manutenção, Operação e Controle (PMOC) dos sistemas de climatização. A lei remete os parâmetros de qualidade do ar à Resolução nº 9/2003 da Anvisa e às normas da ABNT.

A Portaria GM/MS 3.523/1998, por sua vez, exige que sistemas com capacidade acima de 5 TR (15.000 kcal/h, ou 60.000 BTU/h) tenham um responsável técnico habilitado. A mesma portaria determina que o PMOC fique disponível no imóvel e que o registro da execução dos procedimentos do plano também seja mantido disponível.

É esse registro de execução que o sistema de OS organiza. Na prática:

- **As atividades do plano viram roteiros de OS.** Cada equipamento recebe as atividades e as frequências definidas pelo responsável técnico.
- **O sistema gera as OS no prazo.** Ninguém precisa conferir a planilha para saber o que vence no mês.
- **O técnico registra a execução no celular**, item por item, com data, nome e fotos.
- **O histórico fica guardado por equipamento**, pronto para virar relatório para o cliente e para o responsável técnico.

O sistema não substitui o profissional habilitado nem define o plano. Ele garante que o que foi planejado seja executado e que a execução fique registrada. Para uma empresa que presta manutenção para clientes com PMOC, isso é o que permite responder a um pedido de histórico em minutos, e não em dias.

## Aplicativo pronto ou sistema que não atende 100% da empresa?

Existem bons aplicativos prontos de ordem de serviço e de gestão de equipes de campo, e muitos atendem empresas de ar-condicionado. Antes de pensar em sistema sob medida, vale testar um deles.

**Um aplicativo pronto costuma bastar quando:**

- a maior parte do trabalho é instalação e conserto avulso;
- os contratos de manutenção são poucos e simples;
- os clientes não pedem relatório de PMOC por equipamento;
- o financeiro e a emissão de nota ficam num sistema separado, e lançar à mão não pesa.

**Um sistema sob medida, ou uma integração, vale a pena quando:**

- **a carteira de contratos é grande** e cada contrato tem frequências e roteiros próprios;
- **os clientes exigem histórico por equipamento** com os registros de execução do PMOC, num formato que o aplicativo não gera;
- **a OS precisa conversar com o ERP**, para cobrar o serviço, baixar a peça do estoque e emitir a nota sem digitar de novo;
- **a empresa já usa um sistema que não atende 100%**, e a equipe mantém uma planilha paralela de contratos ou de equipamentos. Essa planilha é onde a preventiva volta a ser esquecida.

O último sinal é o mais importante. Se o sistema cobre a OS mas não cobre o contrato, a parte mais valiosa da operação continua fora dele. Às vezes a saída é um módulo de contratos integrado ao sistema que já existe, e não trocar tudo.

Para entender o que entra no orçamento de um sistema assim, o guia sobre [quanto custa um sistema sob medida](/guias/quanto-custa-um-sistema-sob-medida/) explica os fatores que pesam no preço, como número de perfis, integrações e uso no celular.

## Por onde começar a organizar a operação?

Mesmo antes de qualquer sistema, alguns passos já reduzem as perdas:

1. **Cadastrar os equipamentos dos clientes de contrato**, com local, modelo e capacidade. É a base de tudo.
2. **Escrever a frequência e o roteiro de cada contrato**, junto com o responsável técnico quando houver PMOC.
3. **Padronizar a OS**: o que o técnico precisa registrar em toda visita, sem exceção.
4. **Definir quem distribui o serviço** e onde a agenda fica visível para todos.
5. **Medir as preventivas atrasadas** no mês. Esse número mostra o tamanho do problema e o ganho de resolver.

Com essas informações organizadas, qualquer sistema, pronto ou sob medida, começa com dados confiáveis.

## Sistema de OS para empresas de Canoas e Porto Alegre

Em Canoas, Porto Alegre e na região metropolitana, o verão longo e quente mantém a demanda por instalação e manutenção alta, e os contratos com comércio, escritórios e condomínios exigem preventiva organizada. Eu desenvolvo sistemas web para empresas de Canoas, Porto Alegre e região, e de todo o Brasil de forma remota.

Na página de [sistemas web](/sistemas-web/) estão os tipos de sistema que eu construo, como painéis administrativos e portais de clientes. Se a sua empresa quer organizar as ordens de serviço e os contratos de manutenção, [fale comigo](/#contato) contando como as visitas são controladas hoje.

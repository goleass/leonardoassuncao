---
title: "IBS e CBS na NF-e: Seu ERP Está Pronto? | Leonardo Assunção"
description: "A nota sai autorizada, mas o IBS e a CBS estão certos? Veja como conferir no XML e no ERP enquanto a rejeição automática está adiada."
h1: "Meu ERP já preenche IBS e CBS na NF-e? Como conferir antes de ter problema"
resumo: "Para saber se o seu ERP já preenche IBS e CBS, abra o XML de uma NF-e autorizada recente e confira se cada item traz CST, cClassTrib, base, alíquotas e valores desses tributos, além dos totais da nota. Uma nota autorizada não prova que está tudo certo, porque a Receita Federal e o Comitê Gestor do IBS adiaram a rejeição automática sem suspender a obrigação de informar esses dados."
servico: integracoes
publishedAt: 2026-11-05
draft: false
faq:
  - q: "Se a nota foi autorizada, o IBS e a CBS estão corretos?"
    a: "Não necessariamente. O Ato Técnico Conjunto RFB/CGIBS nº 1/2026 adiou as validações que rejeitariam notas sem essas informações. A autorização mostra que a nota passou nas regras ativas naquele momento, não que os campos da reforma foram preenchidos corretamente."
  - q: "Empresa do Simples Nacional já precisa preencher IBS e CBS na NF-e?"
    a: "O cronograma publicado pela Receita Federal e pelo Comitê Gestor do IBS, com o Ato Conjunto RFB/CGIBS nº 4/2026, coloca os documentos do Simples Nacional em 1º de janeiro de 2027. A empresa deve confirmar com o contador como isso se aplica ao seu caso e usar o tempo até lá para preparar o cadastro."
  - q: "O que é cClassTrib e quem deve definir esse código?"
    a: "É o código de classificação tributária do item, publicado nas tabelas oficiais da NF-e. Os três primeiros dígitos correspondem ao CST de IBS e CBS. A definição é uma decisão fiscal: o contador orienta a classificação, e o ERP precisa guardar e enviar o código correto."
  - q: "Preciso trocar de ERP para atender à reforma tributária?"
    a: "Só se o fornecedor não tiver como atender à documentação vigente ou se a sua operação depender de regras que ele não cobre. Antes disso, emita notas de teste, confira o XML e peça ao fornecedor a versão da Nota Técnica implementada."
  - q: "Empresa de serviços com NFS-e segue este mesmo roteiro?"
    a: "A lógica de conferir se os dados saem no documento é a mesma, mas o documento e as regras são outros. O comitê da NFS-e publica orientações próprias, por isso este guia trata da NF-e e da NFC-e."
---

A nota foi emitida, a SEFAZ autorizou e o cliente recebeu. Olhando só para a tela do ERP, parece que a reforma tributária não mudou nada. O problema é que, neste momento, a autorização deixou de ser uma boa prova de que os campos de IBS e CBS estão certos.

A obrigação existe, mas a trava automática foi adiada. Na prática, uma empresa pode passar meses emitindo notas sem esses dados, ou com códigos errados, sem receber nenhum aviso da SEFAZ. Neste guia eu mostro como conferir isso no XML e no ERP e o que fazer com o resultado. As informações legais foram conferidas em 5 de novembro de 2026 nas publicações da Receita Federal, do Comitê Gestor do IBS (CGIBS) e do Portal da NF-e. A classificação de cada produto continua sendo uma decisão a validar com o seu contador.

## O que já é obrigatório na NF-e e o que foi adiado?

São dois assuntos diferentes, e confundir os dois é o erro mais comum.

**A obrigação de informar.** O Ato Conjunto RFB/CGIBS nº 4, de 30 de julho de 2026, trouxe o cronograma de implementação dos documentos fiscais. Para a NF-e e a NFC-e do regime regular, nos casos listados pela Receita Federal, o início foi 3 de agosto de 2026. O próprio cronograma traz outras datas, como 1º de dezembro de 2026 para a NF-e de quem é sujeito passivo de IBS e CBS sem ser contribuinte de ICMS, e 1º de janeiro de 2027 para os documentos do Simples Nacional.

**A rejeição automática.** O Ato Técnico Conjunto RFB/CGIBS nº 1, de 31 de julho de 2026, é o ato citado pelo CGIBS para o adiamento das validações que começariam em 3 de agosto. A nota do CGIBS publicada em 6 de agosto de 2026 é direta: "não houve suspensão da obrigatoriedade de destaque e prestação das informações". O texto também afirma que o cronograma "permanece integralmente válido e sem alterações".

Resumindo: a nota pode ser autorizada sem os campos, mas isso não significa que a empresa esteja dispensada de informá-los.

Em 2026, os documentos usam a alíquota de teste de 0,1% para o IBS e 0,9% para a CBS. O CGIBS informou que a apuração desse período é apenas informativa, sem efeitos tributários, desde que as obrigações acessórias sejam cumpridas. Essa condição é mais um motivo para conferir os dados agora.

## Como conferir no XML se o ERP preenche IBS e CBS?

A tela do ERP mostra o que o sistema guarda. O XML mostra o que foi enviado. Por isso, a conferência começa nele.

1. **Escolha notas diferentes.** Separe uma venda comum, uma nota com mais de um item, uma devolução e uma operação que tenha tratamento especial na sua empresa. Testar uma só nota esconde a maior parte dos problemas.
2. **Use notas recentes.** Pegue documentos autorizados depois da última atualização do ERP, porque uma nota antiga não diz nada sobre a versão atual.
3. **Abra o XML de cada nota.** Em cada item, localize o grupo de IBS e CBS dentro dos impostos do produto. Confira se aparecem o CST, o cClassTrib, a base de cálculo, as alíquotas e os valores.
4. **Confira os totais.** A soma dos itens precisa bater com os totais de IBS e CBS da nota. Uma divergência aqui pode indicar arredondamento ou regra aplicada só em parte do documento.
5. **Compare com a tabela oficial.** Os três primeiros dígitos do cClassTrib correspondem ao CST de IBS e CBS. As tabelas são divulgadas pelo Informe Técnico 2025.002, cuja versão mais recente que localizei no Portal da NF-e foi a 1.70, de 1º de outubro de 2026. Confirme a versão vigente antes de usar.
6. **Teste em homologação.** Se o emissor permitir, envie notas de teste nesse ambiente. A documentação técnica traz validações para os dados informados, e descobrir uma rejeição em teste é muito melhor do que descobri-la quando a trava voltar a valer em produção.
7. **Pergunte ao fornecedor.** Peça, por escrito, qual versão da Nota Técnica 2025.002 o ERP implementa. O Ato Técnico Conjunto nº 1 aprovou a versão 1.51, e novas versões podem ter sido publicadas depois.

Os nomes exatos das tags podem mudar entre versões da documentação, então use a Nota Técnica vigente como referência, e não um print antigo.

## Como a empresa controla isso hoje e o que pode dar errado?

Em muitas empresas, a informação fiscal do produto está espalhada. O cadastro principal fica no ERP, mas a classificação nova aparece em uma planilha enviada pela contabilidade. A exceção de uma venda fica em um papel na mesa do faturamento. A dúvida sobre um item é resolvida em uma mensagem de WhatsApp com o contador, que ninguém mais consegue encontrar depois.

Esse arranjo funciona até alguém precisar responder quem definiu aquele código e quando. As perdas mais comuns são:

- **Produto novo sem classificação.** O comprador cadastra o item às pressas, o campo fica vazio ou recebe um código padrão, e todas as notas daquele produto saem iguais.
- **Código aplicado em massa.** Uma planilha preenche o mesmo cClassTrib para uma família inteira, mesmo havendo item com tratamento diferente. O erro se repete em todas as vendas e só aparece em uma revisão.
- **Devolução diferente da venda.** A nota de saída foi corrigida, mas a devolução usa outra rotina e continua sem os dados. A diferença passa despercebida porque a nota é autorizada.
- **Integração que apaga o campo.** A loja virtual ou o portal de pedidos cria a nota pela API sem enviar os dados novos. Na tela de emissão manual está tudo certo; nas notas automáticas, não.
- **Conversa perdida.** O contador autorizou uma regra pelo WhatsApp, o funcionário mudou de setor, e ninguém sabe por que aquele item foi configurado daquele jeito.

O risco também é operacional. Quando a validação for ativada em produção, os erros que hoje passam em silêncio podem virar notas paradas, com a expedição esperando e o caminhão no pátio. Até a publicação deste guia, não localizei uma nova data para essa ativação nas fontes oficiais, então a empresa não deve contar com um aviso de última hora.

## O que muda para quem está no Simples Nacional?

Para os optantes do Simples Nacional, o cronograma aponta 1º de janeiro de 2027, e a Receita Federal informou que as mudanças da Resolução CGSN nº 190/2026 produzem efeitos, em regra, a partir dessa data.

O prazo está perto, e a parte demorada costuma ser o cadastro, não o ERP. Vale usar as próximas semanas para:

- listar os produtos que a empresa realmente vende e remover os cadastros mortos;
- pedir ao contador a orientação de classificação dos itens mais vendidos;
- confirmar com o fornecedor do ERP quando a versão para o Simples estará disponível;
- testar as integrações que emitem nota automaticamente, e não só a tela manual.

Quem optou pelo regime regular para IBS e CBS deve tratar o assunto com o contador, porque as regras aplicáveis podem ser diferentes.

## O ERP não atende 100% da operação: o que fazer?

Muitas vezes o ERP pronto resolve. Ele costuma ser o lugar certo para os cadastros fiscais, e o fornecedor tem interesse em acompanhar as notas técnicas. **O sistema pronto basta** quando as notas saem de dentro dele, os itens são simples e o teste do XML passa em todos os tipos de operação.

Às vezes o problema está em volta do ERP. **Um ajuste na integração ou um desenvolvimento sob medida vale a pena** quando:

- a nota é gerada por outro sistema, e a integração não envia os novos campos;
- uma loja, um portal de pedidos ou um marketplace passa os dados de um jeito que o ERP não trata;
- a empresa precisa de uma conferência automática que aponte itens sem classificação antes da emissão;
- o volume de exceções é tão alto que depender de alguém olhando nota por nota deixou de ser viável.

Nesses casos, normalmente não é preciso substituir o ERP. Um relatório diário que leia os XMLs e aponte as notas com campos ausentes, por exemplo, já mostra o tamanho do problema e dá tempo de corrigir. O guia sobre [integração com o Bling via API](/guias/integracao-bling-api/) explica como essa camada funciona em um ERP popular, e a mesma lógica vale para outros sistemas.

Trocar de ERP só por causa da reforma raramente é o primeiro passo. Se o fornecedor atende à documentação e a falha está no cadastro, o sistema novo receberá o mesmo cadastro errado.

## Por onde começar se a conferência encontrou erro?

Separe o problema em três grupos, porque cada um tem um responsável:

| O que apareceu | Provável origem | Quem resolve |
| --- | --- | --- |
| Campos ausentes em todas as notas | Versão ou configuração do ERP | Fornecedor do ERP |
| Campos ausentes só nas notas automáticas | Integração que cria a nota | Quem mantém a integração |
| Código presente, mas possivelmente errado | Cadastro fiscal do produto | Contador e responsável pelo cadastro |

Depois, corrija primeiro os produtos que mais vendem e guarde a decisão em um lugar único, com data e responsável. Para notas já emitidas com falhas, pergunte ao contador qual é o tratamento adequado. Não saia cancelando ou reemitindo documentos por conta própria.

## Ajuda para empresas de Canoas e Porto Alegre

Eu atendo empresas de Canoas, Porto Alegre e região metropolitana, além de outras cidades de forma remota. A definição fiscal fica com o contador; a minha parte é técnica: verificar se os dados saem corretamente do ERP e das integrações, criar conferências automáticas e corrigir o que está no meio do caminho.

Na página de [integrações](/integracoes/) está o que eu faço com ERPs e APIs. Se você já sabe que uma integração está gerando notas sem os dados novos, [fale comigo](/#contato) com o nome do ERP e o tipo de nota afetado. Se a dúvida for de orçamento, o guia sobre [quanto custa um sistema sob medida](/guias/quanto-custa-um-sistema-sob-medida/) explica o que pesa no valor.

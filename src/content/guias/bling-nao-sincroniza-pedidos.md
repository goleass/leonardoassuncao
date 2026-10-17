---
title: "Bling Não Sincroniza Pedidos da Loja? | Leonardo Assunção"
description: "Pedidos da loja virtual não chegam ao Bling ou chegam errados? Veja como diagnosticar a falha e quando vale uma integração personalizada."
h1: "Minha loja virtual e o Bling não sincronizam os pedidos corretamente: quando preciso de uma integração personalizada?"
resumo: "Você precisa de uma integração personalizada quando o diagnóstico mostra que a falha não é de configuração, e sim de uma regra que o conector pronto não cobre: loja própria, várias lojas dividindo o mesmo estoque, preço por cliente ou um fluxo de pedido diferente do padrão. Antes disso, vale conferir o vínculo dos produtos, as situações de pedido importadas, os depósitos e o webhook, porque a maior parte das falhas de sincronização está nesses pontos."
servico: integracoes
publishedAt: 2026-10-17
draft: false
faq:
  - q: "Por que o pedido aparece na loja virtual e não aparece no Bling?"
    a: "As causas mais comuns são a importação automática desativada, a situação do pedido fora das situações escolhidas na configuração da integração, um produto do pedido sem vínculo com o cadastro do Bling ou a autorização da integração vencida. Comece conferindo esses quatro pontos antes de suspeitar do conector."
  - q: "Por que o estoque do Bling não atualiza na loja?"
    a: "Na central de ajuda do Bling, o vínculo de estoque e preço depende do campo 'ID na Loja' preenchido no carrinho multiloja do produto e do mesmo SKU no Bling e na plataforma. Produto simples só se vincula a produto simples, e variação só a variação. Se algum desses pontos estiver errado, o estoque não sai do Bling."
  - q: "O Bling pode receber o mesmo pedido duas vezes?"
    a: "Pode acontecer quando a integração reenvia o pedido depois de uma falha, ou quando alguém digita à mão um pedido que depois chega pela integração. A documentação da API v3 do Bling avisa que o mesmo webhook pode ser enviado mais de uma vez, então uma integração bem feita usa o número do pedido na loja para ignorar repetições."
  - q: "Trocar de conector resolve a falta de sincronização?"
    a: "Só se o problema for uma limitação do conector atual. Se a causa for cadastro de produto sem vínculo, SKU diferente ou depósito mal configurado, o conector novo vai falhar do mesmo jeito. Faça o diagnóstico primeiro e troque de ferramenta depois, se ainda for preciso."
  - q: "Quanto tempo leva para um pedido da loja chegar ao Bling?"
    a: "Depende de como a integração funciona. Quando ela usa os webhooks do Bling ou da loja, o pedido chega quase na hora. Quando usa consulta periódica, chega no próximo ciclo de consulta, que é definido por quem configurou a integração."
---

O cliente compra na loja virtual, o pagamento é aprovado e o pedido não aparece no Bling. Ou aparece com o produto errado, sem o frete, em duplicidade, ou com o estoque que não baixou. Quem vive isso no dia a dia sabe o efeito: alguém passa a conferir a loja e o ERP lado a lado, pedido por pedido, e a equipe perde a confiança no que o sistema mostra.

Neste guia eu mostro como diagnosticar a falha de sincronização entre a loja e o Bling, na ordem em que vale a pena conferir, e explico quando o problema não é de configuração, e sim um sinal de que o conector pronto não cobre a sua operação. As informações técnicas seguem a documentação oficial da API v3 do Bling, em developer.bling.com.br, e os artigos da central de ajuda do Bling.

## Como a loja controla os pedidos quando a sincronização falha?

Quando a integração não é confiável, a operação cria seus próprios remendos. Eles parecem inofensivos, mas cada um abre uma porta para erro:

- **Planilha de conferência.** Alguém exporta os pedidos da loja e os do Bling, cola numa planilha e procura os que faltam. A conferência depende de uma pessoa lembrar de fazer, todo dia.
- **Pedido digitado à mão.** Quando um pedido não entra, alguém lança no Bling manualmente. Horas depois a integração volta, traz o mesmo pedido, e agora ele existe duas vezes.
- **Papel na expedição.** A separação imprime a lista da loja, e não a do Bling, porque "a do Bling está atrasada". O que sai no papel não bate com o que foi faturado.
- **Venda pelo WhatsApp fora do sistema.** O vendedor fecha uma venda por mensagem, reserva o produto de cabeça e só lança depois. Nesse meio tempo, o mesmo item é vendido na loja.

As perdas são concretas e se repetem:

1. **Venda sem estoque.** O estoque do Bling não volta para a loja, e a loja vende o que já saiu. O resultado é cancelamento, estorno e reclamação.
2. **Pedido que nunca foi expedido.** O pedido ficou só na loja. Ninguém faturou, ninguém separou, e a empresa só descobre quando o cliente cobra.
3. **Nota fiscal em duplicidade.** O pedido duplicado é faturado duas vezes e alguém precisa cancelar a nota e explicar a diferença no financeiro.
4. **Preço ou frete divergente.** O pedido chega ao Bling com valor diferente do cobrado na loja, e a conciliação do recebimento não fecha.

O ponto central é este: a informação do pedido precisa ter um caminho único e confiável. Enquanto a equipe depender de planilha e memória para saber se um pedido existe, cada pessoa trabalha com uma versão diferente da verdade.

## Como diagnosticar por que os pedidos não sincronizam?

Antes de pensar em integração personalizada, confira estes pontos, nesta ordem. A maior parte das falhas está em algum deles.

### 1. A integração ainda está autorizada?

Integrações pela API v3 do Bling usam OAuth 2.0. Segundo a documentação oficial, o token de acesso vence e é renovado com um token de renovação (*refresh token*), que vale 30 dias. Se a integração ficou parada mais tempo que isso, ou se alguém revogou o acesso, ela para de funcionar até o dono da conta autorizar de novo. É o primeiro ponto a conferir quando tudo parou de uma vez.

### 2. A situação do pedido está entre as que são importadas?

Em várias integrações da central de extensões, a central de ajuda do Bling orienta escolher quais situações de pedido são importadas, e a importação automática vale para os pedidos que entram depois de ativada. Um pedido "aguardando pagamento" pode não ser importado se a configuração só traz pedidos "pagos". Pedidos anteriores à ativação também podem ficar de fora.

### 3. Os produtos do pedido estão vinculados?

Na central de ajuda do Bling, o vínculo entre o produto do Bling e o anúncio da loja é feito pelo campo "ID na Loja", no carrinho multiloja do produto. Esse campo liga estoque e preço. O SKU é usado para localizar os itens das vendas importadas e nas exportações, e precisa ser o mesmo no Bling e na plataforma. Além disso, produto simples só se vincula a produto simples, e variação só a variação. Um kit cadastrado como simples na loja e com variações no Bling quebra a sincronização.

### 4. Os depósitos estão mapeados?

Quando o Bling usa vários depósitos, a integração precisa saber de qual depósito sai o estoque de cada loja. Na central de atendimento da Nuvemshop, sobre a integração com o Bling, um depósito sem mapeamento aparece como causa de estoque que não chega à loja. A saída é mapear o depósito ou desligar a opção de múltiplos depósitos, se ela não for usada.

### 5. O webhook está ativo e respondendo?

Se a integração recebe avisos do Bling por webhook, vale saber como o Bling se comporta. A documentação da API v3 diz que o sistema que recebe precisa responder com sucesso em até 5 segundos. Se não responder, o Bling tenta de novo por até 3 dias. Se as falhas continuarem, o webhook daquele recurso é desativado e só volta quando alguém o reativa manualmente. Ou seja: uma loja fora do ar por alguns dias pode desligar a sincronização sem ninguém perceber.

### 6. A conta está batendo no limite da API?

O Bling limita a API por conta, somando todos os aplicativos ligados a ela: 3 requisições por segundo e 120 mil por dia, segundo a página de limites da documentação oficial. Acima disso, a API responde com o código 429. Também há bloqueio temporário do IP quando uma aplicação gera erros ou requisições demais em poucos segundos. Uma conta com vários conectores e uma planilha automatizada consultando tudo ao mesmo tempo pode esgotar o limite, e os pedidos ficam para trás.

Se depois desses seis pontos o problema continua, o próximo passo é olhar o registro de erros do conector. Um bom conector mostra qual pedido falhou e por quê. Se o seu não mostra, isso já é uma informação importante.

## O conector pronto não atende 100% da operação: o que fazer?

Muitas lojas não têm uma falha de configuração. Elas têm uma operação que o conector não foi feito para atender. E isso não significa que o conector é ruim: ele foi desenhado para o caso mais comum.

**Quando o conector pronto basta:**

- A loja está numa plataforma conhecida, que tem extensão na central do Bling.
- Existe um único estoque, uma tabela de preço e um fluxo de pedido padrão: pagou, faturou, enviou.
- O volume de pedidos cabe com folga nos limites da conta.
- Os erros que aparecem são resolvidos com ajuste de cadastro.

Nesses casos, a recomendação honesta é ficar com o conector, arrumar os cadastros e manter alguém responsável por olhar os erros. Uma integração personalizada não traria ganho que justifique o custo.

**Quando vale uma integração personalizada:**

- **Loja própria**, feita sob medida, sem conector na central de extensões.
- **Várias lojas e canais** dividindo o mesmo estoque, com regra de reserva que o conector não faz.
- **Preço por cliente ou por tabela**, como acontece quando a loja também atende revendas.
- **Kits, combos e produtos compostos** que precisam baixar o estoque de cada componente.
- **Fluxo de pedido diferente**, por exemplo pedido que passa por aprovação, por separação em outro sistema ou por um portal de representantes antes de chegar ao Bling.
- **Rastreabilidade de erro**: a empresa precisa saber, pedido por pedido, o que entrou, o que falhou e por quê, e reprocessar com um clique.

Uma integração personalizada não substitui o Bling. Ela fica no meio: recebe o pedido da loja, aplica as regras da empresa, grava no Bling pela API e devolve estoque e situação para a loja. O guia sobre [integração com o Bling via API](/guias/integracao-bling-api/) explica como essa peça funciona por dentro, com autenticação, webhooks, filas e reprocessamento.

## O que uma integração personalizada precisa fazer bem?

Se o diagnóstico apontou para uma integração própria, estes são os pontos que fazem a diferença entre ela funcionar ou virar mais uma fonte de erro:

| Ponto | Por que importa |
| --- | --- |
| Identificador único do pedido | Usar o número do pedido na loja para nunca criar o mesmo pedido duas vezes, mesmo quando o aviso chega repetido. |
| Fila de processamento | A documentação do Bling diz que os webhooks não chegam necessariamente na ordem e que o mesmo aviso pode vir mais de uma vez. Receber, responder rápido e processar depois evita perda e duplicidade. |
| Mapeamento de cadastro | Uma tabela de equivalência entre o produto da loja e o do Bling, revisada antes de ligar a integração. |
| Dono do estoque | Definir um único sistema que manda no saldo. Os outros só consultam. |
| Controle de ritmo | Respeitar os limites da API e esperar quando receber 429, em vez de insistir. |
| Registro e alerta | Todo pedido que falhar fica registrado com o motivo, e alguém recebe um aviso. |
| Reprocessamento | Depois de corrigir o cadastro, reenviar o pedido sem digitar nada de novo. |

Eu trabalho com integrações entre ERPs, lojas e sistemas internos, e é nesses pontos que concentro o projeto, porque são eles que tiram a planilha de conferência da rotina.

## Quanto custa e como começa uma integração personalizada?

O custo depende do número de sistemas envolvidos, das regras e do volume. Para entender o que pesa no orçamento, o guia sobre [quanto custa um sistema sob medida](/guias/quanto-custa-um-sistema-sob-medida/) explica como cada parte entra na conta.

O começo é sempre o mesmo:

1. **Levantar onde a sincronização falha hoje**, com exemplos reais de pedidos que deram errado.
2. **Descobrir se a causa é configuração ou regra.** Se for configuração, o problema se resolve sem desenvolver nada.
3. **Escrever as regras** que o conector não cobre: estoque, preço, kits, situação do pedido.
4. **Desenvolver e testar** com pedidos de teste antes de ligar na operação real.
5. **Acompanhar as primeiras semanas**, olhando o registro de erros junto com quem opera.

## Integração com o Bling para lojas de Canoas e Porto Alegre

Canoas e a região metropolitana de Porto Alegre têm muitas lojas virtuais que também vendem em balcão, por representante ou para revenda, e é aí que a sincronização com o Bling costuma ficar complicada. Eu atendo empresas de Canoas, Porto Alegre e região, e de todo o Brasil de forma remota.

Na página de [integrações](/integracoes/) está o que eu faço com APIs, ERPs e automações. Se você já sabe onde a sincronização falha, [fale comigo](/#contato) com dois ou três exemplos de pedidos que deram errado. É o jeito mais rápido de saber se o caminho é ajustar a configuração ou fazer uma integração própria.

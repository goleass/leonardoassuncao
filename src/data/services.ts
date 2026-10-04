// Conteúdo das páginas de serviço (SVC-01). A ordem é a mesma da seção "Serviços" da home.
// Sem clientes, números de projetos, anos de experiência ou métricas: nada que não possa ser comprovado (SVC-10).

export interface Service {
  slug: string;
  /** Nome curto: card da home, trilha de navegação, rodapé e JSON-LD. */
  name: string;
  /** Texto do card na home. */
  summary: string;
  title: string;
  description: string;
  h1: string;
  intro: string;
  sections: { title: string; paragraphs: string[]; items?: string[] }[];
  faq: { q: string; a: string }[];
}

export const services: Service[] = [
  {
    slug: "criacao-de-sites",
    name: "Criação de sites",
    summary:
      "Institucionais, landing pages e catálogos. Rápidos, bem posicionados no Google e pensados para gerar contato.",
    title: "Criação de Sites em Canoas/RS | Leonardo Assunção",
    description:
      "Criação de sites institucionais, landing pages e catálogos rápidos, otimizados para o Google e feitos para gerar contato. Canoas/RS e todo o Brasil.",
    h1: "Criação de sites profissionais para empresas",
    intro:
      "Um site bom não é só bonito. Ele carrega rápido no celular, aparece quando o cliente procura pelo que você vende e deixa claro o próximo passo: pedir um orçamento, chamar no WhatsApp ou ligar. Eu crio sites institucionais, landing pages e catálogos com esse objetivo, do texto à publicação, com código próprio que fica com a sua empresa.",
    sections: [
      {
        title: "Tipos de site que eu desenvolvo",
        paragraphs: [
          "Cada tipo de site resolve um problema diferente. Antes de começar, entendemos juntos qual deles faz sentido para o momento da sua empresa, para não pagar por páginas que ninguém vai visitar.",
        ],
        items: [
          "Site institucional: apresenta a empresa, os serviços e as formas de contato, e passa confiança para quem ainda não conhece o seu trabalho.",
          "Landing page: uma página focada numa única oferta ou campanha, com um caminho curto até o contato. Ideal para anúncios no Google e nas redes sociais.",
          "Catálogo de produtos: mostra o que você vende com fotos, descrições e categorias, e leva o cliente para o WhatsApp ou para o formulário de pedido.",
          "Site com área de conteúdo: páginas de serviço, perguntas frequentes e artigos que ajudam o site a aparecer em mais buscas ao longo do tempo.",
        ],
      },
      {
        title: "Pensado para aparecer no Google",
        paragraphs: [
          "Boa parte dos clientes chega pela busca. Por isso o SEO técnico entra desde a primeira linha de código, e não como um ajuste depois que o site está pronto.",
          "Na prática, isso significa páginas que carregam rápido mesmo em conexões lentas, títulos e descrições escritos para as buscas que o seu cliente faz, estrutura de cabeçalhos correta, sitemap, dados estruturados para o Google entender quem é a empresa e onde ela atende, e endereços limpos para cada página.",
          "Também deixo o site pronto para o Google Search Console, a ferramenta gratuita que mostra por quais termos o site aparece e quantas pessoas clicam. Assim você acompanha o resultado com dados, e não com achismo.",
        ],
      },
      {
        title: "Feito para gerar contato",
        paragraphs: [
          "Visita que não vira conversa não paga o site. Cada página tem uma chamada clara para a ação, o WhatsApp fica a um toque no celular e o formulário de contato envia a mensagem direto para o seu e-mail.",
          "O texto é escrito para o seu cliente, com as dúvidas que ele realmente tem, e não com jargão. Se você já tem textos e fotos, eu organizo e adapto. Se não tem, ajudo a definir o conteúdo de cada página durante o projeto.",
        ],
      },
      {
        title: "O que está incluído",
        paragraphs: [
          "O projeto cobre tudo o que é preciso para o site ir ao ar e continuar funcionando. A proposta lista cada item antes de começar, para não haver surpresa no meio do caminho.",
        ],
        items: [
          "Layout responsivo, que funciona bem no celular, no tablet e no computador.",
          "Publicação no seu domínio, com certificado de segurança (HTTPS).",
          "Formulário de contato e botão de WhatsApp.",
          "Configuração de SEO técnico e envio do sitemap ao Google.",
          "Política de privacidade adequada ao que o site coleta.",
          "Código-fonte e acessos entregues à sua empresa.",
        ],
      },
      {
        title: "Como funciona o projeto",
        paragraphs: [
          "Começamos com uma conversa para entender o negócio, o público e o objetivo do site. Depois você recebe uma proposta por escrito com páginas, prazo e investimento. Durante o desenvolvimento você acompanha uma versão de teste e pede ajustes antes da publicação. Depois que o site vai ao ar, continuo disponível para correções e para as próximas melhorias.",
          "Atendo empresas de Canoas, Porto Alegre e região metropolitana, e de qualquer cidade do Brasil de forma remota, com reuniões por vídeo e acompanhamento online.",
        ],
      },
    ],
    faq: [
      {
        q: "Quanto custa criar um site?",
        a: "Depende do tipo de site, da quantidade de páginas e do que precisa ser integrado. Depois da conversa inicial você recebe uma proposta fechada, com valor e prazo definidos antes de começar.",
      },
      {
        q: "Em quanto tempo o site fica pronto?",
        a: "Uma landing page costuma ficar pronta em poucas semanas. Sites institucionais e catálogos levam mais tempo, conforme o número de páginas e a disponibilidade do conteúdo. O prazo exato vai na proposta.",
      },
      {
        q: "O site vai aparecer no Google?",
        a: "O site sai pronto para ser encontrado: rápido, com SEO técnico e enviado ao Google. A posição nas buscas depende também da concorrência e do conteúdo ao longo do tempo, e ninguém pode garantir a primeira posição.",
      },
      {
        q: "Eu vou conseguir atualizar o site depois?",
        a: "Sim. Podemos combinar um formato em que você mesmo edita textos e fotos, ou eu faço as atualizações sob demanda. O código e os acessos ficam sempre com a sua empresa.",
      },
    ],
  },
  {
    slug: "sistemas-web",
    name: "Sistemas web",
    summary:
      "Painéis administrativos, CRMs, portais de clientes e plataformas desenhadas em torno do seu processo, não o contrário.",
    title: "Desenvolvimento de Sistemas Web | Leonardo Assunção",
    description:
      "Desenvolvimento de sistemas web sob medida: painéis administrativos, CRMs, portais de clientes e plataformas desenhadas em torno do processo da sua empresa.",
    h1: "Desenvolvimento de sistemas web sob medida",
    intro:
      "Planilhas espalhadas, informações repetidas em vários lugares e tarefas que dependem da memória de uma pessoa são sinais de que a operação cresceu mais que as ferramentas. Um sistema web feito para o seu processo coloca tudo num lugar só, acessível pelo navegador, no computador ou no celular, sem instalar nada.",
    sections: [
      {
        title: "Que tipo de sistema eu desenvolvo",
        paragraphs: [
          "Sistema web é qualquer aplicação que roda no navegador e guarda os dados num servidor. Alguns exemplos do que pode ser construído:",
        ],
        items: [
          "Painel administrativo: cadastro de clientes, produtos, pedidos e serviços, com busca, filtros e relatórios.",
          "CRM: acompanhamento de oportunidades de venda, histórico de contato e tarefas da equipe comercial.",
          "Portal do cliente: área onde o seu cliente acompanha pedidos, baixa documentos, abre chamados ou faz agendamentos.",
          "Plataforma interna: controle de estoque, ordens de serviço, escalas, aprovações e outros fluxos específicos da sua operação.",
        ],
      },
      {
        title: "O sistema se adapta ao seu processo",
        paragraphs: [
          "Sistemas prontos obrigam a empresa a mudar o jeito de trabalhar para caber na ferramenta. Um sistema sob medida faz o caminho inverso: primeiro eu entendo como a operação funciona hoje, onde estão os gargalos e o que precisa ser controlado, e só depois desenho as telas e as regras.",
          "Isso evita pagar por dezenas de funções que ninguém usa e, ao mesmo tempo, permite implementar aquela regra específica do seu negócio que nenhum produto do mercado atende.",
        ],
      },
      {
        title: "Segurança e controle de acesso",
        paragraphs: [
          "Cada pessoa vê e altera só o que precisa. O sistema tem login individual, níveis de permissão por perfil e registro de quem fez cada alteração importante. Os dados trafegam com criptografia (HTTPS) e ficam em servidores com cópias de segurança automáticas.",
          "O código-fonte, o banco de dados e os acessos aos servidores ficam com a sua empresa. Você não fica preso a uma mensalidade de plataforma nem depende de mim para acessar os próprios dados.",
        ],
      },
      {
        title: "Entregas em etapas",
        paragraphs: [
          "Sistemas grandes não precisam ficar prontos de uma vez para começarem a ser úteis. Eu divido o projeto em entregas menores, começando pelo que resolve a maior dor. Você começa a usar a primeira parte cedo, dá retorno com base no uso real e as próximas etapas já incorporam esse aprendizado.",
          "Em cada ciclo você recebe uma versão de teste para validar antes de ir para produção. Assim não há caixa-preta: você acompanha o que está sendo construído do começo ao fim.",
        ],
      },
      {
        title: "Sinais de que a empresa precisa de um sistema",
        paragraphs: [
          "Nem toda empresa precisa de um sistema próprio. Mas alguns sinais mostram que as ferramentas atuais já custam mais do que parecem:",
        ],
        items: [
          "A mesma informação é digitada em duas ou mais planilhas ou sistemas.",
          "Só uma pessoa sabe onde está cada dado ou como fazer determinado processo.",
          "Relatórios simples levam horas para serem montados à mão.",
          "Erros de digitação geram retrabalho, cobranças erradas ou clientes insatisfeitos.",
          "A equipe cresceu e ficou difícil saber quem está cuidando de quê.",
        ],
      },
      {
        title: "Integração com o que você já usa",
        paragraphs: [
          "Um sistema novo raramente vive sozinho. Ele pode receber pedidos do site, consultar ou enviar dados para o ERP, gerar cobranças, emitir notas e mandar avisos pelo WhatsApp ou por e-mail. Essas integrações eliminam a digitação repetida e reduzem erros.",
          "Atendo empresas de Canoas, Porto Alegre e região metropolitana, e de todo o Brasil de forma remota.",
        ],
      },
    ],
    faq: [
      {
        q: "Quanto custa desenvolver um sistema web?",
        a: "O valor depende das funções, das integrações e do número de perfis de usuário. Depois do diagnóstico você recebe uma proposta com escopo, prazo e investimento de cada etapa, antes de qualquer desenvolvimento.",
      },
      {
        q: "Preciso instalar alguma coisa nos computadores?",
        a: "Não. O sistema roda no navegador e funciona no computador, no tablet e no celular. Basta ter acesso à internet e um login.",
      },
      {
        q: "Consigo migrar os dados das minhas planilhas?",
        a: "Na maioria dos casos, sim. Os dados atuais são analisados, organizados e importados para o sistema novo como parte do projeto.",
      },
      {
        q: "O que acontece depois que o sistema fica pronto?",
        a: "O sistema continua tendo suporte: correções, ajustes e novas funções conforme a operação muda. As condições de suporte vão descritas na proposta.",
      },
    ],
  },
  {
    slug: "integracoes",
    name: "Integrações e APIs",
    summary:
      "ERP, pagamentos, WhatsApp, marketplaces e emissão fiscal conectados, para os dados fluírem sem digitação manual.",
    title: "Integração de Sistemas, ERP e APIs | Leonardo Assunção",
    description:
      "Integração de sistemas: ERP, gateways de pagamento, WhatsApp, marketplaces e emissão de nota fiscal conectados, para os dados fluírem sem digitação manual.",
    h1: "Integração de sistemas, ERP e APIs",
    intro:
      "Quando cada sistema da empresa funciona isolado, alguém precisa copiar dados de um para o outro. Isso consome horas, gera erros de digitação e atrasa o atendimento. Uma integração faz os sistemas conversarem sozinhos: o pedido que entra pelo site vira cadastro no ERP, cobrança, nota fiscal e mensagem para o cliente, sem ninguém digitar nada.",
    sections: [
      {
        title: "O que pode ser integrado",
        paragraphs: [
          "Quase todo sistema moderno oferece uma forma de troca de dados. Estas são as integrações mais comuns:",
        ],
        items: [
          "ERPs: sincronização de clientes, produtos, estoque, pedidos e financeiro.",
          "Gateways de pagamento: geração de cobranças, Pix e boletos, e baixa automática quando o pagamento é confirmado.",
          "WhatsApp Business: avisos de pedido, confirmações, lembretes e atendimento integrado ao sistema.",
          "Marketplaces: envio de produtos e preços, e recebimento de pedidos num só lugar.",
          "Emissão fiscal: geração automática de notas fiscais a partir dos pedidos ou serviços.",
          "Planilhas e BI: dados consolidados para relatórios e painéis de indicadores.",
        ],
      },
      {
        title: "Como uma integração funciona",
        paragraphs: [
          "Os sistemas trocam informações por APIs e webhooks. A API é a porta pela qual um sistema consulta ou envia dados para outro. O webhook é um aviso automático: quando algo acontece num sistema, como um pagamento aprovado, ele avisa o outro na hora.",
          "Quando o sistema não tem API, ainda há caminhos, como a importação e a exportação de arquivos em horários programados. Antes de começar, eu analiso a documentação de cada sistema envolvido e confirmo o que é possível.",
        ],
      },
      {
        title: "Exemplos de fluxos automatizados",
        paragraphs: [
          "Uma integração costuma ligar várias etapas que hoje dependem de alguém. Alguns fluxos comuns:",
        ],
        items: [
          "Venda no site: o pedido cria o cliente no ERP, gera a cobrança, emite a nota quando o pagamento é aprovado e avisa o cliente pelo WhatsApp.",
          "Estoque unificado: uma venda no marketplace baixa o estoque no ERP e atualiza a quantidade disponível nos outros canais.",
          "Cobrança recorrente: mensalidades geradas automaticamente, lembretes antes do vencimento e baixa assim que o pagamento cai.",
          "Relatórios automáticos: dados de vendas, financeiro e atendimento reunidos numa planilha ou painel atualizado sem intervenção manual.",
        ],
      },
      {
        title: "Confiabilidade em primeiro lugar",
        paragraphs: [
          "Integração que falha em silêncio é pior que não ter integração. Por isso cada fluxo tem tratamento de erro, novas tentativas automáticas quando um serviço externo fica fora do ar e registro de cada troca de dados, para saber exatamente o que aconteceu e quando.",
          "Quando algo não pode ser resolvido automaticamente, o sistema avisa a pessoa responsável, em vez de perder o dado. As credenciais de acesso aos serviços ficam guardadas com segurança e nunca expostas no navegador.",
        ],
      },
      {
        title: "Do diagnóstico à operação",
        paragraphs: [
          "O trabalho começa mapeando o caminho que a informação percorre hoje: onde ela nasce, quem digita, onde ela precisa chegar. A partir disso eu proponho a integração que elimina mais trabalho manual com menos complexidade.",
          "A implantação é feita por etapas, com testes em ambiente separado antes de ligar no sistema real. Depois de publicada, a integração é acompanhada para garantir que continua funcionando quando um dos sistemas muda de versão.",
          "Atendo empresas de Canoas, Porto Alegre e região metropolitana, e de todo o Brasil de forma remota.",
        ],
      },
    ],
    faq: [
      {
        q: "Dá para integrar com o sistema que eu já uso?",
        a: "Na maioria dos casos, sim. Se o sistema tem API, webhook ou exportação de dados, é possível integrar. A análise da documentação faz parte do diagnóstico, antes de qualquer compromisso.",
      },
      {
        q: "A integração para de funcionar se um dos sistemas mudar?",
        a: "Mudanças grandes em um sistema externo podem exigir ajustes. Por isso a integração registra cada troca de dados e avisa quando algo falha, e o suporte depois da entrega cobre essas adaptações.",
      },
      {
        q: "Preciso trocar meu ERP para integrar?",
        a: "Não. A ideia é conectar os sistemas que você já usa. Trocar de ERP só é recomendado quando o sistema atual não oferece nenhuma forma de troca de dados.",
      },
      {
        q: "Os dados ficam seguros?",
        a: "Sim. A comunicação entre os sistemas é criptografada, as credenciais ficam guardadas no servidor e cada acesso tem só as permissões necessárias.",
      },
    ],
  },
  {
    slug: "software-sob-medida",
    name: "Software sob medida",
    summary: "Automações, APIs próprias, aplicações internas e consultoria técnica para decisões de tecnologia.",
    title: "Software Sob Medida para Empresas | Leonardo Assunção",
    description:
      "Desenvolvimento de software sob medida: automações, APIs próprias, aplicações internas e consultoria técnica para decisões de tecnologia na sua empresa.",
    h1: "Software sob medida para empresas",
    intro:
      "Nem todo problema cabe num produto pronto. Às vezes a empresa precisa de uma automação que elimina uma tarefa repetitiva, de uma API para conectar parceiros, de uma ferramenta interna para um fluxo único ou de alguém que ajude a decidir qual tecnologia adotar. Software sob medida é construído exatamente para esse problema, e o código fica com você.",
    sections: [
      {
        title: "O que entra em software sob medida",
        paragraphs: [
          "É o serviço para necessidades que não se encaixam num site ou num sistema web tradicional. Alguns exemplos:",
        ],
        items: [
          "Automação de processos: rotinas que rodam sozinhas, como gerar relatórios, conciliar pagamentos, organizar arquivos ou enviar avisos.",
          "APIs próprias: uma porta de entrada segura para parceiros, aplicativos ou outros sistemas acessarem os dados da sua empresa.",
          "Aplicações internas: ferramentas específicas para a equipe, como calculadoras de orçamento, geradores de documentos e painéis de acompanhamento.",
          "Consultoria técnica: apoio para escolher fornecedores, avaliar propostas, planejar a arquitetura de um projeto ou entender o que dá para melhorar no que já existe.",
        ],
      },
      {
        title: "Quando vale a pena fazer sob medida",
        paragraphs: [
          "Se existe um produto pronto que resolve bem o problema, a um custo razoável, eu vou dizer isso. Sob medida faz sentido quando a regra do negócio é específica demais, quando as ferramentas do mercado exigem adaptações que custam mais do que construir, ou quando a empresa quer ser dona da solução, sem depender de mensalidade e das decisões de outro fornecedor.",
          "Essa avaliação faz parte da primeira conversa. O objetivo é resolver o problema com o menor custo total, e não vender desenvolvimento.",
        ],
      },
      {
        title: "Automação que devolve tempo à equipe",
        paragraphs: [
          "Tarefas repetitivas, feitas todos os dias do mesmo jeito, são as melhores candidatas à automação. Copiar dados entre planilhas, conferir pagamentos, montar relatórios semanais e responder a mensagens padrão consomem horas que a equipe poderia usar no que exige atenção humana.",
          "Uma automação bem feita roda de forma confiável, avisa quando encontra algo fora do padrão e registra o que fez, para que qualquer pessoa consiga conferir o resultado.",
        ],
      },
      {
        title: "Consultoria para decisões de tecnologia",
        paragraphs: [
          "Escolher um sistema, contratar um fornecedor ou planejar um projeto de software envolve decisões técnicas que afetam a empresa por anos. Uma opinião independente ajuda a comparar alternativas, entender riscos e evitar contratos que prendem a empresa a uma solução difícil de trocar.",
          "A consultoria pode ser pontual, para uma decisão específica, ou contínua, como apoio técnico para quem não tem uma equipe de tecnologia própria.",
        ],
      },
      {
        title: "Documentação e independência",
        paragraphs: [
          "Todo software entregue vem com documentação: como ele funciona, onde está hospedado, como publicar uma nova versão e como recuperar o sistema em caso de problema. Isso protege a empresa e permite que qualquer desenvolvedor dê continuidade ao trabalho no futuro, se for preciso.",
        ],
      },
      {
        title: "Como trabalho",
        paragraphs: [
          "Um único responsável técnico acompanha o projeto do diagnóstico ao suporte. Você recebe uma proposta por escrito com escopo, prazo e investimento, acompanha versões de teste durante o desenvolvimento e recebe o código-fonte e a documentação no final.",
          "Atendo empresas de Canoas, Porto Alegre e região metropolitana, e de todo o Brasil de forma remota.",
        ],
      },
    ],
    faq: [
      {
        q: "Software sob medida é mais caro que um produto pronto?",
        a: "O investimento inicial costuma ser maior, mas não há mensalidade por usuário e a solução faz exatamente o que a empresa precisa. A comparação de custo total faz parte do diagnóstico.",
      },
      {
        q: "Quem fica com o código?",
        a: "A sua empresa. O código-fonte, a documentação e os acessos aos servidores são entregues a você, sem aluguel de plataforma.",
      },
      {
        q: "Dá para contratar só a consultoria, sem desenvolvimento?",
        a: "Sim. A consultoria técnica pode ser contratada sozinha, para avaliar propostas, fornecedores ou a arquitetura de um projeto.",
      },
      {
        q: "Como sei se o meu problema pode ser automatizado?",
        a: "Se a tarefa segue sempre os mesmos passos e usa dados que estão num sistema ou planilha, é bem provável que sim. Descreva a tarefa no formulário de contato e eu respondo com uma avaliação inicial.",
      },
    ],
  },
  {
    slug: "manutencao-de-sistemas",
    name: "Manutenção e evolução",
    summary: "Assumo sistemas que já existem: correções, melhorias de desempenho, segurança e novas funcionalidades.",
    title: "Manutenção de Sistemas e Sites | Leonardo Assunção",
    description:
      "Manutenção de sistemas e sites que já existem: correção de erros, melhoria de desempenho, atualizações de segurança e novas funcionalidades.",
    h1: "Manutenção e evolução de sistemas e sites",
    intro:
      "O desenvolvedor que fez o sistema sumiu, a agência encerrou o contrato ou ninguém mais tem coragem de mexer no código. É uma situação comum, e não exige começar do zero. Eu assumo sistemas e sites que já existem, entendo como eles funcionam, corrijo o que está quebrado e coloco a evolução de volta nos trilhos.",
    sections: [
      {
        title: "O que a manutenção cobre",
        paragraphs: ["A manutenção vai além de apagar incêndios. Ela inclui:"],
        items: [
          "Correção de erros: falhas que travam a operação, telas que não carregam, cálculos errados e integrações que pararam.",
          "Desempenho: páginas e consultas lentas otimizadas, para o sistema responder rápido mesmo com mais dados e usuários.",
          "Segurança: atualização de bibliotecas e servidores, correção de vulnerabilidades e revisão de acessos.",
          "Novas funcionalidades: as melhorias que a operação pede, implementadas sem quebrar o que já funciona.",
          "Documentação: registro de como o sistema funciona, para a empresa nunca mais depender de uma única pessoa.",
        ],
      },
      {
        title: "Assumindo um sistema que outra pessoa fez",
        paragraphs: [
          "O primeiro passo é um diagnóstico técnico. Eu analiso o código, a infraestrutura, as dependências e os pontos de risco, e entrego um relatório em linguagem clara: o que está bem, o que precisa de atenção urgente e o que pode esperar.",
          "Com esse mapa, definimos juntos as prioridades. Muitas vezes, poucas correções bem escolhidas já resolvem a maior parte dos problemas do dia a dia, e o resto entra num plano de evolução gradual.",
        ],
      },
      {
        title: "Sinais de que o sistema precisa de atenção",
        paragraphs: [
          "Problemas de manutenção costumam dar avisos antes de parar a operação. Vale agir quando:",
        ],
        items: [
          "O sistema fica cada vez mais lento, principalmente nos horários de maior uso.",
          "Erros aparecem de vez em quando e ninguém sabe explicar a causa.",
          "Qualquer mudança pequena demora semanas ou quebra outra parte do sistema.",
          "As bibliotecas e o servidor não recebem atualizações há muito tempo.",
          "Não existe cópia de segurança testada dos dados.",
          "Ninguém na empresa tem os acessos ao código e ao servidor.",
        ],
      },
      {
        title: "Reescrever ou evoluir?",
        paragraphs: [
          "Reescrever um sistema do zero parece tentador, mas é caro e arriscado: as regras de negócio acumuladas no código antigo precisam ser redescobertas. Na maioria dos casos, evoluir o sistema existente por partes entrega resultado mais rápido e com menos risco.",
          "Quando a reescrita é mesmo o melhor caminho, porque a tecnologia ficou obsoleta ou o custo de manter supera o de refazer, eu explico o motivo e proponho uma migração em etapas, com o sistema antigo funcionando até o novo estar pronto.",
        ],
      },
      {
        title: "Suporte contínuo",
        paragraphs: [
          "Sistemas precisam de cuidado constante: bibliotecas recebem atualizações de segurança, serviços externos mudam e a operação pede ajustes. O suporte contínuo inclui monitoramento, correções e um volume combinado de melhorias, com prioridades definidas junto com você.",
          "O mesmo vale para os projetos que eu desenvolvo: o projeto não termina quando vai ao ar. Atendo empresas de Canoas, Porto Alegre e região metropolitana, e de todo o Brasil de forma remota.",
        ],
      },
    ],
    faq: [
      {
        q: "Você assume sistemas feitos por outra empresa?",
        a: "Sim. O trabalho começa por um diagnóstico técnico do código e da infraestrutura, com um relatório claro do estado do sistema e das prioridades.",
      },
      {
        q: "Meu sistema está fora do ar. Dá para ajudar rápido?",
        a: "Chame pelo WhatsApp e descreva o problema. Sistemas parados têm prioridade, e o primeiro passo é recuperar o funcionamento antes de qualquer melhoria maior.",
      },
      {
        q: "Como é cobrada a manutenção?",
        a: "Pode ser por demanda, para correções pontuais, ou por um plano mensal de suporte com monitoramento e horas de melhoria. As condições vão por escrito na proposta.",
      },
      {
        q: "Preciso ter o código-fonte do sistema?",
        a: "Para corrigir e evoluir, sim, além dos acessos ao servidor. Se você não tem esses acessos, ajudo a entender como recuperá-los com o fornecedor anterior.",
      },
    ],
  },
];

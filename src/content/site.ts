import type { SiteContent } from './types'

// Todo o texto do site vive neste arquivo e em nenhum outro.
//
// A pagina segue uma narrativa deliberada: tese -> objeto -> perguntas ->
// diagnostico -> virada -> mecanica -> pessoas -> acao. Cada secao so faz
// sentido depois da anterior, e e por isso que as animacoes sao guiadas por
// rolagem: elas impoem o ritmo da leitura.
export const site: SiteContent = {
  brand: 'VizM\u00f6bel',

  nav: [
    { href: '#stage', label: { pt: 'O produto', de: 'Das Produkt' } },
    { href: '#answer', label: { pt: 'O problema', de: 'Das Problem' } },
    { href: '#solution', label: { pt: 'A solu\u00e7\u00e3o', de: 'Die L\u00f6sung' } },
    { href: '#flow', label: { pt: 'Como funciona', de: 'Ablauf' } },
    { href: '#team', label: { pt: 'Equipe', de: 'Team' } },
  ],

  sections: [
    {
      kind: 'hero',
      headline: {
        pt: 'Seu cliente v\u00ea o m\u00f3vel na pr\u00f3pria sala, em escala real.',
        de: 'Ihr Kunde sieht das M\u00f6belst\u00fcck im eigenen Wohnzimmer, ma\u00dfstabsgetreu.',
      },
      sub: {
        pt: 'Realidade aumentada direto no navegador. Sem app, sem cadastro, sem download.',
        de: 'Augmented Reality direkt im Browser. Keine App, keine Registrierung, kein Download.',
      },
      cta: { pt: 'Ver demonstra\u00e7\u00e3o', de: 'Demo ansehen' },
      cue: { pt: 'role para ver', de: 'weiter scrollen' },
    },

    {
      kind: 'stage',
      caption: {
        pt: '\u00c9 este objeto que vai parar na casa do seu cliente.',
        de: 'Dieses Objekt landet im Zuhause Ihres Kunden.',
      },
      modelName: { pt: 'Poltrona N\u00f3rdica', de: 'Sessel Nordic' },
      modelMeta: {
        pt: 'Modelo 3D \u00b7 1,8 MB \u00b7 pronto para AR',
        de: '3D-Modell \u00b7 1,8 MB \u00b7 AR-bereit',
      },
    },

    {
      kind: 'questions',
      questions: [
        {
          id: 'q1',
          side: 'left',
          text: {
            pt: 'Parece que falta alguma coisa na experi\u00eancia do seu cliente online?',
            de: 'Fehlt im Online-Erlebnis Ihrer Kunden etwas Entscheidendes?',
          },
        },
        {
          id: 'q2',
          side: 'right',
          text: {
            pt: 'Devolu\u00e7\u00f5es porque o m\u00f3vel n\u00e3o ficou bem no ambiente dele?',
            de: 'R\u00fccksendungen, weil das M\u00f6belst\u00fcck im Raum doch nicht passte?',
          },
        },
        {
          id: 'q3',
          side: 'left',
          text: {
            pt: 'Carrinho abandonado bem na hora de decidir o tamanho?',
            de: 'Kaufabbruch genau dann, wenn es um die Ma\u00dfe geht?',
          },
        },
      ],
    },

    {
      kind: 'answer',
      statement: {
        pt: 'O cliente n\u00e3o consegue visualizar o m\u00f3vel na casa dele.',
        de: 'Der Kunde kann sich das M\u00f6belst\u00fcck in seinem Zuhause nicht vorstellen.',
      },
      followUp: {
        pt: 'Ent\u00e3o deixa de comprar. Ou compra, recebe e devolve.',
        de: 'Also kauft er nicht. Oder er kauft, erh\u00e4lt die Lieferung und schickt sie zur\u00fcck.',
      },
      metrics: [
        {
          value: 20,
          decimals: 0,
          prefix: '',
          suffix: '%',
          label: {
            pt: 'das compras de m\u00f3veis online terminam em devolu\u00e7\u00e3o',
            de: 'der Online-M\u00f6belk\u00e4ufe enden in einer R\u00fccksendung',
          },
        },
        {
          value: 65,
          decimals: 0,
          prefix: '',
          suffix: '%',
          label: {
            pt: 'da margem consumida pela log\u00edstica reversa',
            de: 'der Marge verschlingt die Retourenlogistik',
          },
        },
      ],
    },

    {
      kind: 'solution',
      headline: {
        pt: 'Mas n\u00f3s levamos o seu produto at\u00e9 a casa do cliente.',
        de: 'Wir bringen Ihr Produkt zu ihm nach Hause.',
      },
      attributes: [
        {
          id: 'a1',
          side: 'left',
          title: {
            pt: 'Ele v\u00ea como o m\u00f3vel combina com o ambiente dele',
            de: 'Er sieht, wie das M\u00f6belst\u00fcck zu seinem Raum passt',
          },
          body: {
            pt: 'Digitalizamos seu cat\u00e1logo em modelos leves, e o cliente troca cor, tecido e madeira em tempo real, sem sair da cena e sem precisar imaginar nada.',
            de: 'Wir digitalisieren Ihren Katalog in leichte Modelle, und der Kunde wechselt Farbe, Stoff und Holz in Echtzeit \u2014 ohne die Szene zu verlassen und ohne sich etwas vorstellen zu m\u00fcssen.',
          },
        },
        {
          id: 'a2',
          side: 'right',
          title: {
            pt: 'Acaba a d\u00favida de tamanho, e com ela a devolu\u00e7\u00e3o',
            de: 'Die Ma\u00dffrage verschwindet \u2014 und mit ihr die R\u00fccksendung',
          },
          body: {
            pt: 'O m\u00f3vel encosta na parede certa e cabe no v\u00e3o certo, em escala real, com sombra no piso. A principal causa de arrependimento deixa de existir antes do pedido.',
            de: 'Das M\u00f6belst\u00fcck steht an der richtigen Wand und passt in die richtige Nische, ma\u00dfstabsgetreu und mit Schatten. Der h\u00e4ufigste Grund f\u00fcr Reue verschwindet vor der Bestellung.',
          },
        },
        {
          id: 'a3',
          side: 'left',
          title: {
            pt: 'Sua marca passa a ser a que levou a loja at\u00e9 a sala dele',
            de: 'Ihre Marke bringt den Laden in sein Wohnzimmer',
          },
          body: {
            pt: 'O visualizador roda dentro do seu e-commerce, no seu dom\u00ednio, sem p\u00e1gina intermedi\u00e1ria e sem aplicativo para o cliente baixar. O cr\u00e9dito da experi\u00eancia \u00e9 seu.',
            de: 'Der Viewer l\u00e4uft in Ihrem Shop, unter Ihrer Domain, ohne Zwischenseite und ohne App zum Herunterladen. Das Erlebnis zahlt auf Ihre Marke ein.',
          },
        },
      ],
    },

    {
      kind: 'flow',
      heading: { pt: 'Como funciona', de: 'So funktioniert es' },
      intro: {
        pt: 'Quatro passos que fecham um ciclo: o cliente sai da d\u00favida e volta para a compra.',
        de: 'Vier Schritte, die einen Kreis schlie\u00dfen: vom Zweifel zur\u00fcck zum Kauf.',
      },
      steps: [
        {
          id: 's1',
          title: { pt: 'Escolher o produto', de: 'Produkt w\u00e4hlen' },
          body: {
            pt: 'No seu cat\u00e1logo, onde hoje ficam as fotos.',
            de: 'In Ihrem Katalog, wo heute die Fotos stehen.',
          },
        },
        {
          id: 's2',
          title: { pt: 'Abrir o link', de: 'Link \u00f6ffnen' },
          body: {
            pt: 'Sem cadastro e sem download.',
            de: 'Ohne Registrierung, ohne Download.',
          },
        },
        {
          id: 's3',
          title: { pt: 'Ajustar o acabamento', de: 'Ausf\u00fchrung w\u00e4hlen' },
          body: {
            pt: 'Cor, tecido e madeira na hora.',
            de: 'Farbe, Stoff und Holz in Echtzeit.',
          },
        },
        {
          id: 's4',
          title: { pt: 'Ver em escala real', de: 'Ma\u00dfstabsgetreu sehen' },
          body: {
            pt: 'Na sala dele, com sombra e medida.',
            de: 'In seinem Raum, mit Schatten und Ma\u00df.',
          },
        },
      ],
    },

    {
      kind: 'about',
      heading: { pt: 'Quem somos', de: '\u00dcber uns' },
      paragraphs: [
        {
          pt: 'A VizM\u00f6bel nasceu na Serra Ga\u00facha, no meio da maior concentra\u00e7\u00e3o de f\u00e1bricas de m\u00f3veis do Brasil, a partir de uma constata\u00e7\u00e3o simples: o setor vende um produto que ocupa espa\u00e7o, mas o vende por fotos que n\u00e3o t\u00eam escala.',
          de: 'VizM\u00f6bel entstand in der Serra Ga\u00facha, inmitten der gr\u00f6\u00dften M\u00f6belindustrieregion Brasiliens, aus einer schlichten Beobachtung: Die Branche verkauft Produkte, die Raum einnehmen \u2014 \u00fcber Fotos ohne Ma\u00dfstab.',
        },
        {
          pt: 'Nosso nome junta visualiza\u00e7\u00e3o e M\u00f6bel, a palavra alem\u00e3 para m\u00f3veis. \u00c9 uma homenagem \u00e0 origem imigrante das marcenarias da regi\u00e3o e um lembrete de para onde queremos levar essa tecnologia.',
          de: 'Unser Name verbindet Visualisierung und M\u00f6bel. Eine Hommage an die Einwanderergeschichte der Tischlereien der Region \u2014 und ein Hinweis darauf, wohin wir diese Technologie bringen wollen.',
        },
        {
          pt: 'Trabalhamos com quem fabrica, n\u00e3o com quem apenas revende. A diferen\u00e7a aparece no detalhe: a junta encaixa, a textura acompanha a fibra da madeira e a medida bate com a ficha t\u00e9cnica.',
          de: 'Wir arbeiten mit Herstellern, nicht mit Wiederverk\u00e4ufern. Der Unterschied liegt im Detail: Die Verbindung sitzt, die Textur folgt der Holzmaserung, und das Ma\u00df stimmt mit dem Datenblatt \u00fcberein.',
        },
      ],
    },

    {
      kind: 'team',
      heading: { pt: 'Equipe', de: 'Team' },
      members: [
        {
          name: 'Selton',
          initials: 'SE',
          place: 'Caxias do Sul',
          role: { pt: 'Gest\u00e3o', de: 'Gesch\u00e4ftsf\u00fchrung' },
        },
        {
          name: 'Carol',
          initials: 'CA',
          place: 'Porto Alegre',
          role: { pt: 'Marketing', de: 'Marketing' },
        },
        {
          name: 'Timo',
          initials: 'TI',
          place: 'Berlin',
          role: { pt: 'Produto', de: 'Produkt' },
        },
        {
          name: 'Fernando',
          initials: 'FE',
          place: 'Porto Alegre',
          role: { pt: 'Tecnologia', de: 'Technik' },
        },
      ],
    },

    {
      kind: 'cta',
      headline: {
        pt: 'Vamos colocar o seu cat\u00e1logo dentro da sala do cliente.',
        de: 'Bringen wir Ihren Katalog ins Wohnzimmer Ihrer Kunden.',
      },
      button: { pt: 'Falar com a equipe', de: 'Team kontaktieren' },
      note: {
        pt: 'Resposta em at\u00e9 um dia \u00fatil.',
        de: 'Antwort innerhalb eines Werktags.',
      },
    },
  ],
}

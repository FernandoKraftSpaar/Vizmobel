import type { SiteContent } from './types'

// Todo o texto do site vive neste arquivo e em nenhum outro. Nenhum componente
// contem string visivel ao usuario. Trocar o conteudo nunca exige abrir um
// arquivo de secao.
//
// O texto abaixo e provisorio e serve para dar volume real as animacoes --
// paragrafos curtos demais escondem defeitos que so aparecem com tres linhas.
export const site: SiteContent = {
  brand: 'VizM\u00f6bel',

  nav: [
    { id: 'hero', label: { pt: 'In\u00edcio', de: 'Start' } },
    { id: 'numbers', label: { pt: 'N\u00fameros', de: 'Zahlen' } },
    { id: 'services', label: { pt: 'Servi\u00e7os', de: 'Leistungen' } },
    { id: 'about', label: { pt: 'Quem somos', de: '\u00dcber uns' } },
    { id: 'process', label: { pt: 'Processo', de: 'Ablauf' } },
    { id: 'team', label: { pt: 'Equipe', de: 'Team' } },
  ],

  sections: [
    {
      kind: 'hero',
      eyebrow: {
        pt: 'Realidade aumentada para m\u00f3veis',
        de: 'Augmented Reality f\u00fcr M\u00f6bel',
      },
      headline: {
        pt: 'Seu cliente v\u00ea o m\u00f3vel na pr\u00f3pria sala, em escala real.',
        de: 'Ihr Kunde sieht das M\u00f6belst\u00fcck im eigenen Wohnzimmer, ma\u00dfstabsgetreu.',
      },
      sub: {
        pt: 'Sem cadastro, sem download, sem aplicativo. Um link abre a c\u00e2mera e o produto aparece no ch\u00e3o da casa dele, com sombra e propor\u00e7\u00e3o corretas.',
        de: 'Ohne Registrierung, ohne Download, ohne App. Ein Link \u00f6ffnet die Kamera, und das Produkt steht im Raum \u2014 mit korrektem Schatten und Ma\u00dfstab.',
      },
      cta: { pt: 'Ver demonstra\u00e7\u00e3o', de: 'Demo ansehen' },
      cardTitle: { pt: 'Poltrona N\u00f3rdica', de: 'Sessel Nordic' },
      cardMeta: {
        pt: 'Modelo 3D \u00b7 1,8 MB \u00b7 pronto para AR',
        de: '3D-Modell \u00b7 1,8 MB \u00b7 AR-bereit',
      },
    },

    {
      kind: 'numbers',
      heading: { pt: 'O problema em n\u00fameros', de: 'Das Problem in Zahlen' },
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
        {
          value: 91.5,
          decimals: 1,
          prefix: 'R$ ',
          suffix: ' bi',
          label: {
            pt: 'movimentados pelo setor moveleiro brasileiro por ano',
            de: 'Jahresumsatz der brasilianischen M\u00f6belbranche',
          },
        },
      ],
    },

    {
      kind: 'services',
      heading: { pt: 'O que fazemos', de: 'Was wir tun' },
      intro: {
        pt: 'Quatro entregas que cabem no fluxo que a sua f\u00e1brica j\u00e1 tem, sem trocar sistema e sem treinar equipe.',
        de: 'Vier Leistungen, die sich in Ihren bestehenden Ablauf einf\u00fcgen \u2014 ohne Systemwechsel, ohne Schulung.',
      },
      services: [
        {
          id: 'scan',
          title: { pt: 'Digitaliza\u00e7\u00e3o 3D', de: '3D-Digitalisierung' },
          body: {
            pt: 'Transformamos seu cat\u00e1logo em modelos leves o bastante para carregar em rede m\u00f3vel, modelados a partir do projeto original e n\u00e3o da foto.',
            de: 'Wir verwandeln Ihren Katalog in Modelle, die auch \u00fcber Mobilfunk sofort laden \u2014 modelliert aus der Originalkonstruktion, nicht aus dem Foto.',
          },
        },
        {
          id: 'viewer',
          title: { pt: 'Visualizador AR', de: 'AR-Viewer' },
          body: {
            pt: 'Um link por produto. O cliente abre no navegador do celular e o m\u00f3vel aparece em escala real, encostando na parede certa.',
            de: 'Ein Link pro Produkt. Der Kunde \u00f6ffnet ihn im Handy-Browser, und das M\u00f6belst\u00fcck erscheint ma\u00dfstabsgetreu an der richtigen Wand.',
          },
        },
        {
          id: 'config',
          title: {
            pt: 'Configurador de acabamentos',
            de: 'Ausstattungs-Konfigurator',
          },
          body: {
            pt: 'Cor, tecido e madeira trocados em tempo real, sem recarregar a cena e sem perder o posicionamento j\u00e1 feito.',
            de: 'Farbe, Stoff und Holz in Echtzeit wechseln \u2014 ohne Neuladen der Szene und ohne die Platzierung zu verlieren.',
          },
        },
        {
          id: 'embed',
          title: { pt: 'Embed no seu site', de: 'Embed f\u00fcr Ihre Website' },
          body: {
            pt: 'O mesmo motor roda dentro do seu e-commerce, no seu dom\u00ednio, sem depender de uma p\u00e1gina intermedi\u00e1ria nossa.',
            de: 'Dieselbe Engine l\u00e4uft in Ihrem Shop, unter Ihrer Domain, ohne Zwischenseite von uns.',
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
      kind: 'process',
      heading: { pt: 'Como funciona', de: 'So funktioniert es' },
      steps: [
        {
          title: { pt: 'Escolha o produto', de: 'Produkt ausw\u00e4hlen' },
          body: {
            pt: 'No cat\u00e1logo do site ou direto na p\u00e1gina do e-commerce, no mesmo lugar onde hoje ficam as fotos.',
            de: 'Im Katalog oder direkt auf der Produktseite im Shop \u2014 genau dort, wo heute die Fotos stehen.',
          },
        },
        {
          title: { pt: 'Abra o link', de: 'Link \u00f6ffnen' },
          body: {
            pt: 'Nenhum cadastro e nenhum download. O navegador do celular j\u00e1 basta, em Android e em iPhone.',
            de: 'Keine Registrierung, kein Download. Der Handy-Browser gen\u00fcgt, unter Android wie unter iOS.',
          },
        },
        {
          title: { pt: 'Escolha o acabamento', de: 'Ausf\u00fchrung w\u00e4hlen' },
          body: {
            pt: 'Cor e tecido trocados na hora. A permiss\u00e3o de c\u00e2mera \u00e9 pedida uma \u00fanica vez, e nada sai do aparelho.',
            de: 'Farbe und Stoff sofort wechseln. Die Kamerafreigabe wird nur einmal erfragt, und nichts verl\u00e4sst das Ger\u00e4t.',
          },
        },
        {
          title: { pt: 'Veja em escala real', de: 'Ma\u00dfstabsgetreu sehen' },
          body: {
            pt: 'O m\u00f3vel encosta na parede, cabe no v\u00e3o e projeta sombra no piso. A d\u00favida sobre tamanho acaba ali.',
            de: 'Das M\u00f6belst\u00fcck steht an der Wand, passt in die Nische und wirft Schatten auf den Boden. Die Gr\u00f6\u00dfenfrage ist damit beantwortet.',
          },
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

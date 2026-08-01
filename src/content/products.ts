import type { Localized } from './types'

/*
 * A vitrine.
 *
 * Mesma logica do catalogo de modelos: hoje literal, amanha resposta de
 * `GET /api/products`. Por isso `glbUrl` ja e `string | null` -- um produto
 * cadastrado sem modelo pronto e o estado normal de um catalogo real em
 * construcao, nao um caso de erro.
 */

const base = import.meta.env.BASE_URL

export type Product = {
  id: string
  name: Localized
  category: Localized
  /** Medidas em centimetros, como saem da ficha tecnica. */
  dimensions: string
  /** Nulo enquanto o modelo nao foi produzido. */
  glbUrl: string | null
  /** Cor de apresentacao do cartao ate existir uma miniatura renderizada. */
  swatch: string
}

export const products: Product[] = [
  {
    id: 'poltrona-nordica',
    name: { pt: 'Poltrona N\u00f3rdica', de: 'Sessel Nordic' },
    category: { pt: 'Estofados', de: 'Polsterm\u00f6bel' },
    dimensions: '78 \u00d7 82 \u00d7 74 cm',
    glbUrl: `${base}models/poltrona.glb`,
    swatch: '#d8ceb9',
  },
  {
    id: 'sofa-retratil',
    name: { pt: 'Sof\u00e1 Retr\u00e1til 3 Lugares', de: 'Sofa 3-Sitzer' },
    category: { pt: 'Estofados', de: 'Polsterm\u00f6bel' },
    dimensions: '210 \u00d7 95 \u00d7 88 cm',
    glbUrl: null,
    swatch: '#3a4356',
  },
  {
    id: 'mesa-jantar',
    name: { pt: 'Mesa de Jantar Carvalho', de: 'Esstisch Eiche' },
    category: { pt: 'Sala de jantar', de: 'Esszimmer' },
    dimensions: '180 \u00d7 90 \u00d7 76 cm',
    glbUrl: null,
    swatch: '#b98d53',
  },
  {
    id: 'buffet-ripado',
    name: { pt: 'Buffet Ripado', de: 'Sideboard Lamelle' },
    category: { pt: 'Sala de estar', de: 'Wohnzimmer' },
    dimensions: '160 \u00d7 45 \u00d7 80 cm',
    glbUrl: null,
    swatch: '#6b4a30',
  },
  {
    id: 'cadeira-escritorio',
    name: { pt: 'Cadeira de Escrit\u00f3rio', de: 'B\u00fcrostuhl' },
    category: { pt: 'Home office', de: 'Homeoffice' },
    dimensions: '62 \u00d7 62 \u00d7 118 cm',
    glbUrl: null,
    swatch: '#2b2b2e',
  },
  {
    id: 'estante-modular',
    name: { pt: 'Estante Modular', de: 'Modulregal' },
    category: { pt: 'Sala de estar', de: 'Wohnzimmer' },
    dimensions: '240 \u00d7 38 \u00d7 200 cm',
    glbUrl: null,
    swatch: '#8d8578',
  },
]

import type { HTMLAttributes, Ref } from 'react'

/*
 * O <model-viewer> e um custom element: existe no DOM, nao no React. Sem as
 * declaracoes abaixo o TSX o trataria como tag desconhecida e o `strict`
 * reprovaria o build.
 *
 * Tipamos apenas a fatia da API que realmente usamos. Um `any` aqui economiza
 * dez minutos hoje e devolve a conta na primeira troca de textura que falha em
 * silencio.
 */

export interface MvTexture {
  readonly name: string | null
}

export interface MvTextureInfo {
  setTexture(texture: MvTexture | null): void
}

export interface MvPbrMetallicRoughness {
  /** Nulo quando o material do GLB nao tem mapa de cor base. */
  readonly baseColorTexture: MvTextureInfo | null
  setBaseColorFactor(rgba: readonly [number, number, number, number]): void
  setRoughnessFactor(value: number): void
  setMetallicFactor(value: number): void
}

export interface MvMaterial {
  readonly name: string
  readonly pbrMetallicRoughness: MvPbrMetallicRoughness
}

export interface MvModel {
  readonly materials: readonly MvMaterial[]
}

export interface ModelViewerElement extends HTMLElement {
  /** Nulo ate o GLB terminar de carregar. */
  readonly model: MvModel | null
  readonly loaded: boolean
  /** Resolve quando o elemento terminou o ciclo de render pendente. */
  readonly updateComplete: Promise<boolean>
  canActivateAR: boolean
  createTexture(uri: string): Promise<MvTexture>
  activateAR(): Promise<void>
}

/*
 * Atributos booleanos sao tipados como string vazia, nao como boolean, e isso e
 * deliberado. O model-viewer decide por `hasAttribute`. Se passassemos
 * `ar={false}`, o React 19 escreveria `ar="false"` no HTML -- atributo presente,
 * valor irrelevante, AR ligada. Com `'' | undefined` a unica forma de desligar
 * e omitir, que e exatamente o que o DOM entende.
 */
type BooleanAttr = ''

export type ModelViewerAttributes = HTMLAttributes<HTMLElement> & {
  ref?: Ref<ModelViewerElement>
  src?: string
  alt?: string
  poster?: string
  ar?: BooleanAttr
  'ar-modes'?: string
  'ar-placement'?: 'floor' | 'wall'
  'camera-controls'?: BooleanAttr
  'disable-pan'?: BooleanAttr
  'disable-tap'?: BooleanAttr
  'interaction-prompt'?: 'auto' | 'none'
  'touch-action'?: 'pan-y' | 'pan-x' | 'none'
  loading?: 'auto' | 'lazy' | 'eager'
  reveal?: 'auto' | 'manual'
  'tone-mapping'?: 'auto' | 'aces' | 'agx' | 'commerce' | 'neutral'
  'environment-image'?: string
  'skybox-image'?: string
  exposure?: number
  'shadow-intensity'?: number
  'shadow-softness'?: number
  'field-of-view'?: string
  'min-field-of-view'?: string
  'max-field-of-view'?: string
  'camera-orbit'?: string
  'camera-target'?: string
  'min-camera-orbit'?: string
  'max-camera-orbit'?: string
  'interpolation-decay'?: number
}

declare module 'react' {
  namespace JSX {
    interface IntrinsicElements {
      'model-viewer': ModelViewerAttributes
    }
  }
}

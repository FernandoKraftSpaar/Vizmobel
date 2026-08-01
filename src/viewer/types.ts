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

/**
 * Estados publicados pelo evento `ar-status`.
 *
 * `session-started` significa que a camera abriu, nao que o movel apareceu:
 * entre um e outro o aparelho ainda esta procurando o plano do chao. Essa
 * distincao e a diferenca entre o visitante esperar e o visitante desistir.
 */
export type ArStatus =
  | 'not-presenting'
  | 'session-started'
  | 'object-placed'
  | 'failed'

export interface ModelViewerElement extends HTMLElement {
  /** Nulo ate o GLB terminar de carregar. */
  readonly model: MvModel | null
  readonly loaded: boolean
  /** Resolve quando o elemento terminou o ciclo de render pendente. */
  readonly updateComplete: Promise<boolean>
  /**
   * Falso ate a deteccao de suporte terminar, e nao existe evento avisando
   * quando ela termina. Por isso o valor e sondado, nao lido uma vez so.
   */
  canActivateAR: boolean
  createTexture(uri: string): Promise<MvTexture>
  activateAR(): Promise<void>
}

/*
 * Atributos booleanos sao tipados como string vazia, nao como boolean, e isso e
 * deliberado. O model-viewer decide por `hasAttribute`. Se passassemos
 * `ar={false}`, o React 19 escreveria `ar="false"` no HTML -- atributo presente,
 * valor irrelevante, AR ligada. Com a string vazia, a unica forma de desligar e
 * omitir, que e exatamente o que o DOM entende.
 */
type BooleanAttr = ''

/**
 * Torna tudo opcional E explicitamente anulavel.
 *
 * Sem o `| undefined`, `exactOptionalPropertyTypes` trata "propriedade ausente"
 * e "propriedade presente valendo undefined" como tipos diferentes -- e um
 * espalhamento condicional como `{...(cond ? { poster: url } : {})}` produz o
 * segundo caso. Fazer isto no mapeamento, e nao linha a linha, evita que o
 * proximo atributo adicionado reintroduza o mesmo erro.
 */
type JsxOptional<T> = { [K in keyof T]?: T[K] | undefined }

type ModelViewerOwnAttributes = {
  ref: Ref<ModelViewerElement>
  src: string
  alt: string
  poster: string
  ar: BooleanAttr
  'ar-modes': string
  'ar-placement': 'floor' | 'wall'
  /**
   * `fixed` trava o tamanho no que o GLB declara em metros.
   *
   * O padrao (`auto`) deixa o visitante redimensionar a peca com dois dedos, o
   * que soa generoso e destroi a unica promessa que a ferramenta faz: mostrar
   * se o movel CABE. Um sofa que o cliente encolheu ate caber nao responde
   * pergunta nenhuma, e a devolucao acontece igual.
   */
  'ar-scale': 'auto' | 'fixed'
  'camera-controls': BooleanAttr
  'disable-pan': BooleanAttr
  'disable-tap': BooleanAttr
  'interaction-prompt': 'auto' | 'none'
  'touch-action': 'pan-y' | 'pan-x' | 'none'
  loading: 'auto' | 'lazy' | 'eager'
  reveal: 'auto' | 'manual'
  'tone-mapping': 'auto' | 'aces' | 'agx' | 'commerce' | 'neutral'
  'environment-image': string
  'skybox-image': string
  exposure: number
  'shadow-intensity': number
  'shadow-softness': number
  'field-of-view': string
  'min-field-of-view': string
  'max-field-of-view': string
  'camera-orbit': string
  'camera-target': string
  'min-camera-orbit': string
  'max-camera-orbit': string
  'interpolation-decay': number
}

export type ModelViewerAttributes = HTMLAttributes<HTMLElement> &
  JsxOptional<ModelViewerOwnAttributes>

declare module 'react' {
  namespace JSX {
    interface IntrinsicElements {
      'model-viewer': ModelViewerAttributes
    }
  }
}

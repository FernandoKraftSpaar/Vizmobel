import type { Localized } from '../content/types'

/*
 * ESTE ARQUIVO E O CONTRATO, NAO O CONTEUDO.
 *
 * Hoje o catalogo e um literal TypeScript. Amanha ele vem de
 * `GET /api/models/:id`, com `textureUrl` e `glbUrl` apontando para o blob
 * storage e o resto das colunas vindo do banco. O codigo do viewer nao muda
 * nessa transicao: ele ja consome `ModelConfig`, e um literal e um JSON
 * desserializado tem a mesma forma.
 *
 * Por isso nao ha funcao, classe ou import do React aqui. Tudo que existe
 * abaixo precisa sobreviver a um `JSON.parse`.
 */

const base = import.meta.env.BASE_URL

/** Um acabamento aplicavel a um material nomeado do GLB. */
export type Finish = {
  id: string
  label: Localized
  /**
   * Nome do material dentro do GLB. Precisa bater exatamente com o que o
   * modelador nomeou no Blender. Errar aqui falha em silencio.
   */
  material: string
  /** Mapa de cor base. Nulo usa `color` como cor lisa. */
  textureUrl: string | null
  /** sRGB de 0 a 1. Serve de amostra na interface e de cor lisa sem textura. */
  color: readonly [number, number, number]
  /** 0 espelhado, 1 completamente fosco. */
  roughness: number
  /** 0 dieletrico (tecido, madeira), 1 condutor (metal). Evite o meio-termo. */
  metalness: number
}

export type FinishGroup = {
  id: string
  label: Localized
  finishes: Finish[]
}

export type ModelConfig = {
  id: string
  glbUrl: string
  posterUrl: string | null
  /** HDR do ambiente. Nulo usa a iluminacao neutra padrao. */
  environmentUrl: string | null
  alt: Localized
  exposure: number
  shadowIntensity: number
  shadowSoftness: number
  fieldOfView: string
  minFieldOfView: string
  cameraTarget: string
  minCameraOrbit: string
  maxCameraOrbit: string
  /**
   * Vazio enquanto nao houver catalogo real. A interface de acabamentos so
   * aparece quando isto chegar preenchido -- um seletor com opcoes inventadas
   * promete uma configuracao que o produto ainda nao entrega.
   */
  groups: FinishGroup[]
}

export const poltrona: ModelConfig = {
  id: 'poltrona-nordica',
  glbUrl: `${base}models/poltrona.glb`,
  posterUrl: null,
  environmentUrl: null,
  alt: {
    pt: 'Poltrona em vista tridimensional, girando conforme a rolagem',
    de: 'Sessel in dreidimensionaler Ansicht, dreht sich beim Scrollen',
  },
  exposure: 1.15,
  shadowIntensity: 1.2,
  shadowSoftness: 0.95,
  /*
   * Angulo de visao fechado, como no prototipo. Lente tele achata a
   * perspectiva e faz o movel parecer maior e mais caro; grande angular
   * distorce as proporcoes e denuncia que aquilo e um render.
   */
  fieldOfView: '19deg',
  minFieldOfView: '10deg',
  cameraTarget: '0m 0.35m 0m',
  minCameraOrbit: 'auto 0deg 2.2m',
  maxCameraOrbit: 'auto 88deg 5m',
  groups: [],
}

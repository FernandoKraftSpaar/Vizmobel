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
  /**
   * Mapa de cor base. Nulo usa `color` como cor lisa -- e o que permite a v1
   * funcionar com o .glb sozinho, antes de qualquer JPG entrar no repositorio.
   */
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
  fieldOfView: '24deg',
  minFieldOfView: '12deg',
  cameraTarget: '0m 0.35m 0m',
  minCameraOrbit: 'auto 0deg 2.4m',
  maxCameraOrbit: 'auto 88deg 6m',
  groups: [
    {
      id: 'upholstery',
      label: { pt: 'Estofado', de: 'Polster' },
      finishes: [
        {
          id: 'areia',
          label: { pt: 'Areia', de: 'Sand' },
          material: 'Fabric_mtl',
          textureUrl: null,
          color: [0.847, 0.804, 0.733],
          roughness: 0.9,
          metalness: 0,
        },
        {
          id: 'grafite',
          label: { pt: 'Grafite', de: 'Graphit' },
          material: 'Fabric_mtl',
          textureUrl: null,
          color: [0.227, 0.227, 0.235],
          roughness: 0.88,
          metalness: 0,
        },
        {
          id: 'musgo',
          label: { pt: 'Verde musgo', de: 'Moosgruen' },
          material: 'Fabric_mtl',
          textureUrl: null,
          color: [0.29, 0.365, 0.306],
          roughness: 0.9,
          metalness: 0,
        },
        {
          id: 'terracota',
          label: { pt: 'Terracota', de: 'Terrakotta' },
          material: 'Fabric_mtl',
          textureUrl: null,
          color: [0.706, 0.38, 0.29],
          roughness: 0.9,
          metalness: 0,
        },
      ],
    },
    {
      id: 'frame',
      label: { pt: 'Estrutura', de: 'Gestell' },
      finishes: [
        {
          id: 'carvalho',
          label: { pt: 'Carvalho', de: 'Eiche' },
          material: 'Legs_mtl',
          textureUrl: null,
          color: [0.725, 0.541, 0.325],
          roughness: 0.35,
          metalness: 0,
        },
        {
          id: 'nogueira',
          label: { pt: 'Nogueira', de: 'Nussbaum' },
          material: 'Legs_mtl',
          textureUrl: null,
          color: [0.42, 0.267, 0.161],
          roughness: 0.3,
          metalness: 0,
        },
        {
          id: 'ebano',
          label: { pt: 'Ebano', de: 'Ebenholz' },
          material: 'Legs_mtl',
          textureUrl: null,
          color: [0.169, 0.137, 0.125],
          roughness: 0.28,
          metalness: 0,
        },
        {
          id: 'latao',
          label: { pt: 'Latao', de: 'Messing' },
          material: 'Legs_mtl',
          textureUrl: null,
          color: [0.69, 0.553, 0.247],
          // Metal e o unico caso em que metalness 1 e correto. Valores
          // intermediarios nao existem na fisica que o PBR modela.
          roughness: 0.18,
          metalness: 1,
        },
      ],
    },
  ],
}

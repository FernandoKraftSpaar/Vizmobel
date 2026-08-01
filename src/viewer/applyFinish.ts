import type { Finish } from './catalog'
import type { ModelViewerElement, MvTexture } from './types'

/*
 * Texturas sao caras: cada `createTexture` baixa e envia a imagem para a GPU.
 * O prototipo repetia esse trabalho a cada clique, inclusive ao voltar para um
 * acabamento ja visto. O cache e por URL e vive enquanto a pagina viver.
 */
const textureCache = new Map<string, Promise<MvTexture>>()

function getTexture(
  viewer: ModelViewerElement,
  url: string,
): Promise<MvTexture> {
  const cached = textureCache.get(url)
  if (cached) return cached

  const created = viewer.createTexture(url)
  textureCache.set(url, created)
  // Uma promessa rejeitada no cache envenenaria todas as tentativas futuras.
  created.catch(() => textureCache.delete(url))
  return created
}

/**
 * Aplica um acabamento ao material correspondente do GLB.
 *
 * Duas diferencas em relacao ao prototipo:
 *
 * 1. Rugosidade e metalicidade sao escritas sempre. No original elas estavam
 *    dentro do `if (baseColorTexture)`, entao trocar para latao num material
 *    sem mapa de cor nao fazia nada -- nem a textura, nem o brilho.
 * 2. Sem textura, cai para cor lisa. E o que permite a poltrona funcionar
 *    assim que o .glb chega, sem depender de nenhum JPG.
 */
export async function applyFinish(
  viewer: ModelViewerElement,
  finish: Finish,
): Promise<void> {
  await viewer.updateComplete

  const model = viewer.model
  if (!model) return

  const material = model.materials.find((m) => m.name === finish.material)
  if (!material) {
    console.warn(
      `[viewer] Material "${finish.material}" nao existe no GLB. ` +
        `Disponiveis: ${model.materials.map((m) => m.name).join(', ')}`,
    )
    return
  }

  const pbr = material.pbrMetallicRoughness
  const [r, g, b] = finish.color

  if (finish.textureUrl && pbr.baseColorTexture) {
    pbr.baseColorTexture.setTexture(await getTexture(viewer, finish.textureUrl))
  } else {
    if (pbr.baseColorTexture) pbr.baseColorTexture.setTexture(null)
    pbr.setBaseColorFactor([r, g, b, 1])
  }

  pbr.setRoughnessFactor(finish.roughness)
  pbr.setMetallicFactor(finish.metalness)
}

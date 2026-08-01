import { gsap } from '../gsap'
import { motion } from '../tokens'

export type ParallaxLayer = { el: HTMLElement; depth: number }

export type CardTiltConfig = {
  card: HTMLElement
  maxTilt: number
  perspective: number
  followEase: string
  followDuration: number
  liftZ: number
  parallaxLayers: ParallaxLayer[]
}

export const cardTiltDefaults = {
  maxTilt: 8,
  perspective: 900,
  // Sem ".out": em quickTo a curva e aplicada continuamente, nao a um trecho
  // com inicio e fim definidos.
  followEase: 'power3',
  followDuration: motion.duration.ui,
  liftZ: 40,
} as const satisfies Omit<CardTiltConfig, 'card' | 'parallaxLayers'>

const noop = () => {}

/**
 * Inclinacao 3D seguindo o cursor, com paralaxe interna por camada.
 *
 * Prova a tese de que perspectiva convincente nao exige WebGL: e apenas
 * transformPerspective + rotationX/rotationY no DOM.
 */
export function createCardTilt(cfg: CardTiltConfig): () => void {
  const { card } = cfg

  // Em dispositivos sem hover real o efeito nao faz sentido e ainda captura
  // eventos de toque que deveriam rolar a pagina.
  if (window.matchMedia('(hover: none)').matches) return noop

  gsap.set(card, {
    transformPerspective: cfg.perspective,
    transformStyle: 'preserve-3d',
  })

  const o = { duration: cfg.followDuration, ease: cfg.followEase }

  // quickTo mantem UM tween vivo e apenas reescreve o destino. gsap.to criaria
  // ~120 tweens por segundo disputando o mesmo alvo.
  const rx = gsap.quickTo(card, 'rotationX', o)
  const ry = gsap.quickTo(card, 'rotationY', o)
  const tz = gsap.quickTo(card, 'z', o)

  const layers = cfg.parallaxLayers.map((layer) => ({
    x: gsap.quickTo(layer.el, 'x', o),
    y: gsap.quickTo(layer.el, 'y', o),
    depth: layer.depth,
  }))

  // getBoundingClientRect forca o navegador a recalcular layout. Medimos ao
  // entrar, ao redimensionar e ao rolar -- nunca dentro do pointermove.
  let rect = card.getBoundingClientRect()
  const measure = () => {
    rect = card.getBoundingClientRect()
  }

  const ac = new AbortController()
  const { signal } = ac

  card.addEventListener('pointerenter', measure, { signal })

  card.addEventListener(
    'pointermove',
    (e) => {
      const nx = (e.clientX - rect.left) / rect.width - 0.5
      const ny = (e.clientY - rect.top) / rect.height - 0.5

      ry(nx * cfg.maxTilt * 2)
      // Negativo: o cursor "empurra" a borda proxima para tras.
      rx(ny * -cfg.maxTilt * 2)
      tz(cfg.liftZ)

      for (const layer of layers) {
        layer.x(nx * layer.depth)
        layer.y(ny * layer.depth)
      }
    },
    { signal },
  )

  card.addEventListener(
    'pointerleave',
    () => {
      rx(0)
      ry(0)
      tz(0)
      for (const layer of layers) {
        layer.x(0)
        layer.y(0)
      }
    },
    { signal },
  )

  window.addEventListener('scroll', measure, { signal, passive: true })

  const ro = new ResizeObserver(measure)
  ro.observe(card)

  return () => {
    ac.abort()
    ro.disconnect()
    gsap.killTweensOf(card)
    for (const layer of cfg.parallaxLayers) gsap.killTweensOf(layer.el)
  }
}

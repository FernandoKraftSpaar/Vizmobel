import { gsap, runtime } from '../gsap'
import { motion } from '../tokens'

export type SlideInConfig = {
  items: HTMLElement[]
  distance: number
  narrowDistance: number
  rotate: number
  duration: number
  ease: string
  start: string
}

export const slideInDefaults = {
  distance: 120,
  // No celular a distancia precisa cair: 120px a partir da borda coloca o
  // elemento fora da viewport e o navegador cria rolagem horizontal.
  narrowDistance: 44,
  // Uma inclinacao minima faz o elemento parecer entrar em arco em vez de
  // deslizar num trilho. Acima de uns 3 graus vira desenho animado.
  rotate: 2,
  duration: motion.duration.base,
  ease: motion.ease.expo,
  start: 'top 82%',
} as const satisfies Omit<SlideInConfig, 'items'>

/**
 * Entrada direcional, um elemento por vez.
 *
 * A direcao vem do atributo data-side de cada elemento, nao de um parametro:
 * assim a alternancia esquerda/direita e definida no conteudo, e reordenar a
 * lista nao exige tocar em codigo de animacao.
 */
export function createSlideIn(cfg: SlideInConfig): () => void {
  const mm = gsap.matchMedia()

  mm.add(
    {
      isNarrow: '(max-width: 767px) and (prefers-reduced-motion: no-preference)',
      isWide: '(min-width: 768px) and (prefers-reduced-motion: no-preference)',
      isReduced: '(prefers-reduced-motion: reduce)',
    },
    (ctx) => {
      const conditions = (ctx.conditions ?? {}) as Record<string, boolean | undefined>

      if (conditions['isReduced'] === true) {
        gsap.set(cfg.items, { clearProps: 'all' })
        return
      }

      const distance =
        conditions['isNarrow'] === true ? cfg.narrowDistance : cfg.distance

      for (const el of cfg.items) {
        const direction = el.dataset['side'] === 'right' ? 1 : -1

        gsap.from(el, {
          x: direction * distance,
          rotation: direction * cfg.rotate,
          opacity: 0,
          duration: cfg.duration,
          ease: cfg.ease,
          scrollTrigger: {
            trigger: el,
            start: cfg.start,
            once: true,
            markers: runtime.debug,
          },
        })
      }
    },
  )

  // mm.revert() mata os tweens e os ScrollTriggers criados dentro do bloco.
  return () => mm.revert()
}

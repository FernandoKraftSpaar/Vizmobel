import { gsap } from '../gsap'
import { motion } from '../tokens'

export type RollButtonConfig = {
  button: HTMLElement
  duration: number
  ease: string
}

export const rollButtonDefaults = {
  duration: motion.duration.ui,
  ease: motion.ease.inOutStrong,
} as const satisfies Omit<RollButtonConfig, 'button'>

const noop = () => {}

/**
 * Rotulo que rola no hover.
 *
 * O botao contem duas copias empilhadas do texto dentro de um container com
 * overflow hidden. Subir exatamente 50% da altura coloca a segunda copia na
 * posicao da primeira -- funciona com qualquer texto e qualquer tamanho de
 * fonte, sem medir nada.
 *
 * Melhor relacao impacto/esforco do projeto inteiro.
 */
export function createRollButton(cfg: RollButtonConfig): () => void {
  const inner = cfg.button.querySelector<HTMLElement>('[data-roll-inner]')
  if (!inner) return noop

  const to = gsap.quickTo(inner, 'yPercent', {
    duration: cfg.duration,
    ease: cfg.ease,
  })

  const ac = new AbortController()
  const { signal } = ac

  const enter = () => to(-50)
  const leave = () => to(0)

  cfg.button.addEventListener('pointerenter', enter, { signal })
  cfg.button.addEventListener('pointerleave', leave, { signal })
  // Teclado recebe o mesmo retorno visual que o mouse.
  cfg.button.addEventListener('focus', enter, { signal })
  cfg.button.addEventListener('blur', leave, { signal })

  return () => {
    ac.abort()
    gsap.killTweensOf(inner)
  }
}

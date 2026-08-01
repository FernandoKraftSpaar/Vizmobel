import { gsap, runtime } from '../gsap'
import { motion } from '../tokens'

export type CounterConfig = {
  el: HTMLElement
  to: number
  from: number
  duration: number
  ease: string
  decimals: number
  prefix: string
  suffix: string
  locale: string
  start: string
}

export const counterDefaults = {
  from: 0,
  duration: motion.duration.count,
  ease: motion.ease.out,
  decimals: 0,
  prefix: '',
  suffix: '',
  locale: 'pt-BR',
  start: 'top 85%',
} as const satisfies Omit<CounterConfig, 'el' | 'to'>

/**
 * Contagem numerica disparada ao entrar na viewport.
 *
 * Repare que o GSAP nao esta animando o DOM: ele interpola um objeto
 * JavaScript comum, e o onUpdate escreve o resultado na tela. Esse e o
 * conceito mais poderoso da biblioteca -- e o mesmo mecanismo que alimentara
 * os uniforms do WebGL quando o visualizador AR entrar no projeto.
 */
export function createCounter(cfg: CounterConfig): () => void {
  const state = { value: cfg.from }

  const write = () => {
    cfg.el.textContent =
      cfg.prefix +
      state.value.toLocaleString(cfg.locale, {
        minimumFractionDigits: cfg.decimals,
        maximumFractionDigits: cfg.decimals,
      }) +
      cfg.suffix
  }

  write()

  const tween = gsap.to(state, {
    value: cfg.to,
    duration: cfg.duration,
    ease: cfg.ease,
    // Sem snap o numero vira um borrao de casas decimais tremendo.
    snap: { value: cfg.decimals === 0 ? 1 : 1 / 10 ** cfg.decimals },
    onUpdate: write,
    scrollTrigger: {
      trigger: cfg.el,
      start: cfg.start,
      once: true,
      markers: runtime.debug,
    },
  })

  return () => {
    tween.scrollTrigger?.kill()
    tween.kill()
  }
}

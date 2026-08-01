import { gsap, runtime } from '../gsap'

// Mesmo motivo de textLines.ts: derivamos o tipo em vez de escrever
// gsap.core.Timeline, que depende do namespace global nao sombreado.
export type MotionTimeline = ReturnType<typeof gsap.timeline>

export type ScrubPinConfig = {
  section: HTMLElement
  build: (tl: MotionTimeline) => void
  pin: boolean
  scrub: number | boolean
  start: string
  end: string
  anticipatePin: number
}

export const scrubPinDefaults = {
  pin: true,
  scrub: 1,
  start: 'top top',
  end: '+=150%',
  anticipatePin: 1,
} as const satisfies Omit<ScrubPinConfig, 'section' | 'build'>

/**
 * Fixa uma secao na tela e amarra uma timeline ao progresso do scroll.
 *
 * ATENCAO as posicoes usadas dentro de `build`: com scrub ativo elas NAO sao
 * segundos, e sim fracoes da distancia percorrida. Passar 0 significa "no
 * inicio do trecho" e 0.45 significa "depois de 45% dele". Entender isso
 * resolve a maior parte da confusao com ScrollTrigger.
 */
export function createScrubPin(cfg: ScrubPinConfig): () => void {
  const tl = gsap.timeline({
    scrollTrigger: {
      trigger: cfg.section,
      start: cfg.start,
      end: cfg.end,
      pin: cfg.pin,
      scrub: cfg.scrub,
      anticipatePin: cfg.anticipatePin,
      invalidateOnRefresh: true,
      markers: runtime.debug,
    },
  })

  cfg.build(tl)

  return () => {
    tl.scrollTrigger?.kill()
    tl.kill()
  }
}

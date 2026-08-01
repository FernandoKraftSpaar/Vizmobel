import { gsap } from '../gsap'

export type OrbitFlowConfig = {
  section: HTMLElement
  nodes: HTMLElement[]
  /** Deslocamento vertical de entrada, em pixels. */
  rise: number
  scaleFrom: number
  /** Duracao de cada passo, em fracao do trecho rolado. */
  step: number
  /** Sobreposicao entre um passo e o seguinte. */
  overlap: number
  end: string
}

export const orbitFlowDefaults = {
  rise: 34,
  scaleFrom: 0.86,
  step: 1,
  overlap: 0.25,
  end: '+=150%',
} as const satisfies Omit<OrbitFlowConfig, 'section' | 'nodes'>

/**
 * Os passos surgindo em ordem sobre uma elipse imaginaria.
 *
 * A versao anterior desenhava um anel e revelava os quatro nos praticamente
 * juntos: a figura era bonita e ilegivel, porque nada dizia por onde comecar.
 * Aqui o traco sumiu e a ordem virou tempo -- cada passo aparece no seu turno,
 * e o circulo se forma na cabeca de quem le em vez de estar desenhado na tela.
 *
 * A elipse nao existe no DOM. As posicoes vem de seno e cosseno calculados no
 * componente, o que permite trocar quatro passos por cinco sem mexer aqui.
 */
export function createOrbitFlow(cfg: OrbitFlowConfig): () => void {
  if (cfg.nodes.length === 0) return () => {}

  const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
  if (reduced) {
    gsap.set(cfg.nodes, { opacity: 1, y: 0, scale: 1 })
    return () => {}
  }

  // Fixar so faz sentido onde a elipse cabe. No celular os nos viram uma lista
  // empilhada pelo CSS, e prender a tela ali seria prisao, nao ritmo.
  const wide = window.matchMedia('(min-width: 900px)').matches

  const tl = gsap.timeline({
    scrollTrigger: {
      trigger: cfg.section,
      start: wide ? 'top top' : 'top 78%',
      end: wide ? cfg.end : 'bottom 60%',
      scrub: 1,
      pin: wide,
      anticipatePin: wide ? 1 : 0,
    },
  })

  cfg.nodes.forEach((node, index) => {
    tl.from(
      node,
      {
        opacity: 0,
        y: cfg.rise,
        scale: cfg.scaleFrom,
        ease: 'none',
        duration: cfg.step,
      },
      index * (cfg.step - cfg.overlap),
    )
  })

  return () => {
    tl.scrollTrigger?.kill()
    tl.kill()
  }
}

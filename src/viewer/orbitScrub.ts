import { gsap } from '../motion/gsap'
import type { ModelViewerElement } from './types'

type MotionTween = ReturnType<typeof gsap.to>

/*
 * A ponte entre o GSAP e o 3D.
 *
 * O GSAP nao sabe o que e uma camera. Ele sabe interpolar numeros dentro de um
 * objeto JavaScript comum. Entao animamos `{ theta, phi, radius }` e, a cada
 * quadro, traduzimos esses tres numeros para o atributo que o model-viewer
 * entende. E o mesmo mecanismo do contador de numeros -- e sera o mesmo
 * mecanismo se um dia trocarmos por Three.js, onde o alvo passa a ser um
 * uniform de shader.
 */

export type OrbitScrubConfig = {
  viewer: ModelViewerElement
  trigger: HTMLElement
  /** Angulo horizontal em graus, inicio e fim da rolagem. */
  fromTheta: number
  toTheta: number
  /** Angulo vertical em graus. 90 e a altura do olho. */
  fromPhi: number
  toPhi: number
  /** Distancia da camera em metros. Menor aproxima. */
  fromRadius: number
  toRadius: number
  start: string
  end: string
}

/*
 * O percurso da camera e curto de proposito. A versao anterior comecava a 4,4m
 * e o objeto entrava pequeno: a rolagem tinha que aproximar antes de o visitante
 * conseguir ver o movel. Agora ele ja nasce enquadrado e a rolagem so gira e
 * aproxima o suficiente para dar vida.
 */
export const orbitScrubDefaults = {
  fromTheta: -20,
  toTheta: 34,
  fromPhi: 84,
  toPhi: 74,
  fromRadius: 3.5,
  toRadius: 3,
  start: 'top bottom',
  end: 'bottom top',
} as const satisfies Omit<OrbitScrubConfig, 'viewer' | 'trigger'>

export function createOrbitScrub(cfg: OrbitScrubConfig): () => void {
  const { viewer } = cfg

  const state = {
    theta: cfg.fromTheta,
    phi: cfg.fromPhi,
    radius: cfg.fromRadius,
  }

  const write = () => {
    viewer.setAttribute(
      'camera-orbit',
      `${state.theta.toFixed(2)}deg ${state.phi.toFixed(2)}deg ${state.radius.toFixed(3)}m`,
    )
  }

  write()

  const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
  if (reduced) {
    // Quem pediu menos movimento recebe um enquadramento fixo e decente, nao
    // uma camera parada num extremo do percurso.
    state.theta = (cfg.fromTheta + cfg.toTheta) / 2
    state.radius = cfg.toRadius
    write()
    return () => {}
  }

  const tween: MotionTween = gsap.to(state, {
    theta: cfg.toTheta,
    phi: cfg.toPhi,
    radius: cfg.toRadius,
    ease: 'none',
    onUpdate: write,
    scrollTrigger: {
      trigger: cfg.trigger,
      start: cfg.start,
      end: cfg.end,
      scrub: 1,
    },
  })

  /*
   * Assim que o visitante toca no objeto, a rolagem para de mandar na camera.
   * Sem isto, cada pixel rolado desfaz o giro que ele acabou de fazer com o
   * dedo -- a interacao parece quebrada, e a culpa nao e obvia.
   */
  const release = () => {
    tween.scrollTrigger?.kill()
    tween.kill()
  }

  viewer.addEventListener('pointerdown', release, { once: true, passive: true })

  return () => {
    viewer.removeEventListener('pointerdown', release)
    tween.scrollTrigger?.kill()
    tween.kill()
  }
}

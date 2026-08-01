import { gsap, ScrollTrigger } from '../gsap'

export type HeaderWaveConfig = {
  path: SVGPathElement
  /** Largura do viewBox. Nao e a largura na tela: o SVG estica. */
  width: number
  /** Altura do viewBox, em pixels reais. */
  height: number
  /** Deslocamento maximo da crista, em unidades do viewBox. */
  maxAmplitude: number
  /** Quanto de velocidade vira amplitude. Menor = onda mais discreta. */
  velocityScale: number
  duration: number
  /** Tempo parado, em ms, antes de a onda voltar a reta. */
  settleAfter: number
}

export const headerWaveDefaults = {
  width: 1200,
  height: 28,
  maxAmplitude: 16,
  velocityScale: 0.01,
  duration: 0.5,
  settleAfter: 140,
} as const satisfies Omit<HeaderWaveConfig, 'path'>

/**
 * A borda inferior do menu como superficie de liquido.
 *
 * A onda nao e decorativa por acaso: ela informa. A amplitude vem da
 * VELOCIDADE da rolagem, nao da posicao, entao a barra reage ao gesto do
 * visitante em vez de tocar uma animacao fixa. Rolagem lenta quase nao
 * deforma; um empurrao forte estica a crista e ela relaxa sozinha.
 *
 * O sinal e invertido de proposito: descendo, a onda afunda, como se o
 * conteudo estivesse puxando o menu por baixo.
 */
function curve(width: number, height: number, amplitude: number): string {
  const mid = height / 2
  // Q traca a primeira metade; T espelha o ponto de controle e fecha a
  // segunda com a curvatura oposta. Duas cristas com um comando so.
  return `M0 0 H${width} V${mid} Q${width * 0.75} ${mid + amplitude} ${width / 2} ${mid} T0 ${mid} Z`
}

export function createHeaderWave(cfg: HeaderWaveConfig): () => void {
  const state = { amp: 0 }
  const render = () => {
    cfg.path.setAttribute('d', curve(cfg.width, cfg.height, state.amp))
  }

  render()

  const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
  if (reduced) return () => {}

  // quickTo em vez de gsap.to: a rolagem dispara dezenas de vezes por segundo e
  // criar um tween novo a cada evento seria lixo para o coletor. Ease sem
  // sufixo .out porque quickTo ja interpola a partir do valor corrente.
  const push = gsap.quickTo(state, 'amp', {
    duration: cfg.duration,
    ease: 'power3',
    onUpdate: render,
  })

  let settle = 0

  const trigger = ScrollTrigger.create({
    start: 0,
    end: 'max',
    onUpdate(self) {
      const amplitude = gsap.utils.clamp(
        -cfg.maxAmplitude,
        cfg.maxAmplitude,
        -self.getVelocity() * cfg.velocityScale,
      )
      push(amplitude)

      // O evento de rolagem nao avisa quando para. Sem este relogio a onda
      // congelaria deformada no ultimo quadro rolado.
      window.clearTimeout(settle)
      settle = window.setTimeout(() => push(0), cfg.settleAfter)
    },
  })

  return () => {
    window.clearTimeout(settle)
    trigger.kill()
    gsap.killTweensOf(state)
  }
}

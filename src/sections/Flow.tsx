import { useRef, type CSSProperties } from 'react'
import { useGSAP } from '@gsap/react'
import { gsap } from '../motion/gsap'
import { createWaveFlow, waveFlowDefaults } from '../motion/effects'
import { useLang } from '../lang'
import type { FlowSection } from '../content/types'

/*
 * A senoide vive em coordenadas de 0 a 100, nos dois eixos, e o SVG estica
 * para a caixa real. Como o traco usa vector-effect, esticar nao engorda a
 * linha.
 *
 * AMPLITUDE em 26 nao e estetica: e o teto que mantem o no mais baixo dentro
 * da caixa. O centro de um passo fica em 50 + 26 = 76% da altura, e como o
 * bloco de texto tem cerca de 110px, sobra folga ate a borda em qualquer
 * altura de banda que o CSS produza.
 */
const AMPLITUDE = 26
const SAMPLES = 120

/**
 * Altura da curva na posicao `t`, medida em passos.
 *
 * O cosseno deslocado faz cada passo inteiro cair exatamente numa crista ou
 * num vale alternadamente, e a curva cruzar a linha media entre eles. Sem esse
 * alinhamento os nos flutuariam em pontos arbitrarios do traco.
 */
function sineY(t: number): number {
  return 50 - AMPLITUDE * Math.cos(Math.PI * (t - 0.5))
}

function buildPath(count: number): string {
  const points: string[] = []
  for (let i = 0; i <= SAMPLES; i += 1) {
    const t = (i / SAMPLES) * count
    const x = (t / count) * 100
    points.push(`${i === 0 ? 'M' : 'L'}${x.toFixed(2)} ${sineY(t).toFixed(2)}`)
  }
  return points.join(' ')
}

/** Posicao do passo sobre a curva. Meio intervalo desloca do canto. */
function seat(index: number, count: number): CSSProperties {
  const t = index + 0.5
  return {
    '--x': `${((t / count) * 100).toFixed(2)}%`,
    '--y': `${sineY(t).toFixed(2)}%`,
  } as CSSProperties
}

/**
 * O fluxo de aquisicao como onda.
 *
 * A forma agora rima com a borda do menu, e isso nao e enfeite: repetir um
 * mesmo gesto em lugares diferentes e o que faz uma interface parecer
 * desenhada por uma pessoa so.
 */
export function Flow({ data }: { data: FlowSection }) {
  const root = useRef<HTMLElement>(null)
  const curve = useRef<SVGPathElement>(null)
  const { t, lang } = useLang()

  const count = data.steps.length

  useGSAP(
    () => {
      const section = root.current
      if (!section) return undefined

      const nodes = gsap.utils.toArray<HTMLElement>('[data-wave-node]', section)
      if (nodes.length === 0) return undefined

      return createWaveFlow({
        ...waveFlowDefaults,
        section,
        path: curve.current,
        nodes,
      })
    },
    { scope: root, dependencies: [lang], revertOnUpdate: true },
  )

  return (
    <section id="flow" ref={root} className="section section--soft flow">
      <div className="container">
        <h2 className="heading">{t(data.heading)}</h2>
        <p className="lead">{t(data.intro)}</p>

        <div className="waveflow">
          <svg
            className="waveflow__svg"
            viewBox="0 0 100 100"
            preserveAspectRatio="none"
            aria-hidden="true"
          >
            <path
              ref={curve}
              className="waveflow__path"
              d={buildPath(count)}
              vectorEffect="non-scaling-stroke"
            />
          </svg>

          {data.steps.map((step, index) => (
            <div
              key={step.id}
              className="waveflow__node"
              style={seat(index, count)}
              data-wave-node=""
            >
              <span className="waveflow__n">
                {String(index + 1).padStart(2, '0')}
              </span>
              <h3 className="waveflow__title">{t(step.title)}</h3>
              <p className="waveflow__body">{t(step.body)}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

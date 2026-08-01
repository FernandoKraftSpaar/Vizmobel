import { useRef } from 'react'
import { useGSAP } from '@gsap/react'
import { gsap } from '../motion/gsap'
import { createOrbitFlow } from '../motion/effects'
import { useLang } from '../lang'
import type { FlowSection } from '../content/types'

// Quatro posicoes cardeais sobre a circunferencia.
const POSITIONS = ['top', 'right', 'bottom', 'left'] as const

/**
 * O fluxo de aquisicao desenhado como ciclo, nao como esteira.
 *
 * A forma carrega o argumento: uma fila de quatro caixas termina: um circulo
 * volta ao inicio. O que estamos descrevendo e um cliente que sai da duvida e
 * retorna a compra, entao a figura fecha.
 */
export function Flow({ data }: { data: FlowSection }) {
  const root = useRef<HTMLElement>(null)
  const ring = useRef<SVGCircleElement>(null)
  const { t, lang } = useLang()

  useGSAP(
    () => {
      const section = root.current
      const ringEl = ring.current
      if (!section || !ringEl) return undefined

      const nodes = gsap.utils.toArray<HTMLElement>('[data-orbit-node]', section)
      if (nodes.length === 0) return undefined

      return createOrbitFlow({ section, ring: ringEl, nodes })
    },
    { scope: root, dependencies: [lang], revertOnUpdate: true },
  )

  return (
    <section id="flow" ref={root} className="section section--soft flow">
      <div className="container">
        <h2 className="heading">{t(data.heading)}</h2>
        <p className="lead">{t(data.intro)}</p>

        <div className="orbit">
          <svg className="orbit__svg" viewBox="0 0 100 100" aria-hidden="true">
            {/* Trilho estatico: sem ele o circulo parece incompleto ate o fim
                da rolagem. */}
            <circle className="orbit__track" cx="50" cy="50" r="42" />
            <circle ref={ring} className="orbit__ring" cx="50" cy="50" r="42" />
          </svg>

          {data.steps.map((step, index) => (
            <div
              key={step.id}
              className={`orbit__node orbit__node--${POSITIONS[index] ?? 'top'}`}
              data-orbit-node=""
            >
              <span className="orbit__n">{String(index + 1).padStart(2, '0')}</span>
              <h3 className="orbit__title">{t(step.title)}</h3>
              <p className="orbit__body">{t(step.body)}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

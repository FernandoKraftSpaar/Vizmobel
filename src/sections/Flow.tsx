import { useRef, type CSSProperties } from 'react'
import { useGSAP } from '@gsap/react'
import { gsap } from '../motion/gsap'
import { createOrbitFlow, orbitFlowDefaults } from '../motion/effects'
import { useLang } from '../lang'
import type { FlowSection } from '../content/types'

// Raios em porcentagem da caixa. O horizontal e maior que o vertical: a tela e
// deitada, e uma circunferencia perfeita desperdicaria as laterais.
const RADIUS_X = 44
const RADIUS_Y = 36

/** Posicao do passo sobre a elipse, comecando no topo e girando no sentido horario. */
function seat(index: number, total: number): CSSProperties {
  const radians = ((-90 + (index * 360) / total) * Math.PI) / 180
  return {
    '--x': `${50 + RADIUS_X * Math.cos(radians)}%`,
    '--y': `${50 + RADIUS_Y * Math.sin(radians)}%`,
  } as CSSProperties
}

/**
 * O fluxo de aquisicao como ciclo -- agora sem desenhar o ciclo.
 *
 * A forma continua carregando o argumento: uma fila termina, um circulo volta
 * ao inicio, e o que descrevemos e um cliente que sai da duvida e retorna a
 * compra. Mas o traco dourado atrapalhava mais do que ajudava, porque
 * competia com o texto e ainda assim nao dizia por onde comecar. A ordem agora
 * e dada pelo tempo: um passo de cada vez, na sequencia.
 */
export function Flow({ data }: { data: FlowSection }) {
  const root = useRef<HTMLElement>(null)
  const { t, lang } = useLang()

  useGSAP(
    () => {
      const section = root.current
      if (!section) return undefined

      const nodes = gsap.utils.toArray<HTMLElement>('[data-orbit-node]', section)
      if (nodes.length === 0) return undefined

      return createOrbitFlow({ ...orbitFlowDefaults, section, nodes })
    },
    { scope: root, dependencies: [lang], revertOnUpdate: true },
  )

  return (
    <section id="flow" ref={root} className="section section--soft flow">
      <div className="container">
        <h2 className="heading">{t(data.heading)}</h2>
        <p className="lead">{t(data.intro)}</p>

        <div className="orbit">
          {data.steps.map((step, index) => (
            <div
              key={step.id}
              className="orbit__node"
              style={seat(index, data.steps.length)}
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

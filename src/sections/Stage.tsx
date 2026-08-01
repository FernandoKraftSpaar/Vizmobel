import { useRef } from 'react'
import { useGSAP } from '@gsap/react'
import { createScrubPin, scrubPinDefaults } from '../motion/effects'
import { useLang } from '../lang'
import { ModelStage } from '../viewer/ModelStage'
import { poltrona } from '../viewer/catalog'
import type { StageSection } from '../content/types'

/**
 * O objeto conquista o palco.
 *
 * A secao fica fixa enquanto o conjunto cresce de 42% ate o tamanho final. So
 * depois disso a legenda aparece. A ordem importa: apresentar o objeto e
 * explica-lo ao mesmo tempo obriga o olho a escolher, e ele escolhe o texto.
 *
 * A inclinacao pelo cursor saiu daqui. O model-viewer tem controle de camera
 * proprio, e duas fontes de rotacao disputando o mesmo ponteiro produzem um
 * objeto que parece ter vontade propria.
 */
export function Stage({ data }: { data: StageSection }) {
  const root = useRef<HTMLElement>(null)
  const { t, lang } = useLang()

  useGSAP(
    () => {
      const el = root.current
      if (!el) return undefined

      const card = el.querySelector<HTMLElement>('[data-stage-card]')
      const caption = el.querySelector<HTMLElement>('[data-stage-caption]')
      if (!card || !caption) return undefined

      return createScrubPin({
        ...scrubPinDefaults,
        section: el,
        end: '+=130%',
        build: (tl) => {
          // Posicoes 0 e 0.5 sao fracoes do trecho rolado, nao segundos.
          tl.from(
            card,
            { scale: 0.42, yPercent: 12, opacity: 0, ease: 'none', duration: 1 },
            0,
          )
          tl.from(
            caption,
            { opacity: 0, y: 28, ease: 'none', duration: 0.45 },
            0.5,
          )
        },
      })
    },
    { scope: root, dependencies: [lang], revertOnUpdate: true },
  )

  return (
    <section id="stage" ref={root} className="section section--stage">
      <div className="container stage">
        <div className="stage__card" data-stage-card="">
          <ModelStage config={poltrona} />
          <div className="stage__meta">
            <strong>{t(data.modelName)}</strong>
            <span>{t(data.modelMeta)}</span>
          </div>
        </div>

        <p className="stage__caption" data-stage-caption="">
          {t(data.caption)}
        </p>
      </div>
    </section>
  )
}

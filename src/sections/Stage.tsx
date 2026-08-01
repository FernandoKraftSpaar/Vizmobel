import { useRef } from 'react'
import { useGSAP } from '@gsap/react'
import { gsap } from '../motion/gsap'
import {
  createScrubPin,
  scrubPinDefaults,
  createCardTilt,
  cardTiltDefaults,
  type ParallaxLayer,
} from '../motion/effects'
import { useLang } from '../lang'
import type { StageSection } from '../content/types'

/**
 * O objeto conquista o palco.
 *
 * A secao fica fixa enquanto o cartao cresce de 38% ate o tamanho final. So
 * depois disso a legenda aparece. A ordem importa: apresentar o objeto e
 * explica-lo ao mesmo tempo obriga o olho a escolher, e ele escolhe o texto.
 *
 * A inclinacao pelo cursor convive com a entrada porque as duas animacoes
 * escrevem em componentes diferentes da transformacao -- escala e deslocamento
 * de um lado, rotacao e profundidade do outro.
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

      const parallaxLayers: ParallaxLayer[] = gsap.utils
        .toArray<HTMLElement>('[data-tilt-layer]', card)
        .map((layer) => ({
          el: layer,
          depth: Number(layer.dataset['depth'] ?? 0),
        }))

      const stopPin = createScrubPin({
        ...scrubPinDefaults,
        section: el,
        end: '+=130%',
        build: (tl) => {
          // Posicoes 0 e 0.5 sao fracoes do trecho rolado, nao segundos.
          tl.from(
            card,
            { scale: 0.38, yPercent: 14, opacity: 0, ease: 'none', duration: 1 },
            0,
          )
          tl.from(
            caption,
            { opacity: 0, y: 28, ease: 'none', duration: 0.45 },
            0.5,
          )
        },
      })

      const stopTilt = createCardTilt({
        ...cardTiltDefaults,
        card,
        parallaxLayers,
      })

      return () => {
        stopTilt()
        stopPin()
      }
    },
    { scope: root, dependencies: [lang], revertOnUpdate: true },
  )

  return (
    <section id="stage" ref={root} className="section section--stage">
      <div className="container stage">
        <div className="tiltcard" data-stage-card="">
          <div className="tiltcard__glow" data-tilt-layer="" data-depth="26" />
          <div className="tiltcard__shape" data-tilt-layer="" data-depth="-18" />
          <div className="tiltcard__meta" data-tilt-layer="" data-depth="12">
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

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
 * A secao e uma grade de duas faixas: o objeto ocupa a faixa elastica e a
 * legenda a faixa rigida, no rodape. Isso resolve dois problemas de uma vez.
 *
 * A legenda ja esteve dentro do fluxo, e entao a grade centralizava o conjunto
 * cartao+legenda -- o objeto ficava permanentemente acima do centro. Depois
 * ficou absoluta, e passou a atravessar o cartao em telas baixas, porque nada
 * reservava o espaco dela. Duas faixas dao o centramento da primeira solucao e
 * a garantia de nao colidir da segunda: sao caixas vizinhas, nao sobrepostas.
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
        // Trecho fixado mais curto: a versao longa cobrava rolagem demais por
        // pouca mudanca, e a sensacao era de pagina travada.
        end: '+=90%',
        build: (tl) => {
          // Posicoes 0 e 0.3 sao fracoes do trecho rolado, nao segundos.
          tl.from(
            card,
            { scale: 0.94, opacity: 0, ease: 'none', duration: 0.45 },
            0,
          )
          tl.from(
            caption,
            { opacity: 0, y: 18, ease: 'none', duration: 0.35 },
            0.3,
          )
        },
      })
    },
    { scope: root, dependencies: [lang], revertOnUpdate: true },
  )

  return (
    <section id="stage" ref={root} className="section section--stage">
      <div className="stage">
        <div className="stage__card" data-stage-card="">
          <ModelStage config={poltrona} />
          <div className="stage__meta">
            <strong>{t(data.modelName)}</strong>
            <span>{t(data.modelMeta)}</span>
          </div>
        </div>
      </div>

      <p className="stage__caption" data-stage-caption="">
        {t(data.caption)}
      </p>
    </section>
  )
}

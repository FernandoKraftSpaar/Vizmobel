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
 * A entrada e discreta de proposito. Fazer o cartao crescer de 42% ate o
 * tamanho final custava metade da secao so para o movel ficar visivel, e a
 * escala grande demais atrapalhava a leitura da forma. Agora ele entra quase
 * pronto e quem se aproxima e a camera -- movimento que existe no espaco 3D
 * em vez de ser um zoom aplicado por cima da imagem.
 *
 * A legenda esta fora do fluxo. Enquanto ocupava espaco abaixo do cartao, a
 * grade centralizava o conjunto, e o objeto ficava permanentemente acima do
 * centro optico da tela.
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
        end: '+=120%',
        build: (tl) => {
          // Posicoes 0 e 0.35 sao fracoes do trecho rolado, nao segundos.
          tl.from(
            card,
            { scale: 0.92, opacity: 0, ease: 'none', duration: 0.5 },
            0,
          )
          tl.from(
            caption,
            { opacity: 0, y: 20, ease: 'none', duration: 0.4 },
            0.35,
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

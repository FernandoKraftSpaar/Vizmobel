import { useRef } from 'react'
import { useGSAP } from '@gsap/react'
import { gsap } from '../motion/gsap'
import { createScrubPin, scrubPinDefaults } from '../motion/effects/scrubPin'
import { Heading } from '../components/Heading'
import { useLang } from '../lang'
import type { ProcessSection } from '../content/types'

export function Process({ data }: { data: ProcessSection }) {
  const { t, lang } = useLang()
  const root = useRef<HTMLElement>(null)

  useGSAP(
    () => {
      const el = root.current
      if (!el) return undefined

      const steps = gsap.utils.toArray<HTMLElement>('[data-step]', el)
      const first = steps[0]
      if (!first) return undefined

      // Os passos ficam empilhados no mesmo lugar. Todos comecam ocultos,
      // menos o primeiro.
      gsap.set(steps, { autoAlpha: 0, y: 40 })
      gsap.set(first, { autoAlpha: 1, y: 0 })

      return createScrubPin({
        ...scrubPinDefaults,
        section: el,
        // A distancia de scroll cresce com o numero de passos. Fixar um valor
        // faria quatro passos passarem rapido demais e dois, devagar demais.
        end: `+=${steps.length * 100}%`,
        build: (tl) => {
          steps.forEach((step, i) => {
            // Estas posicoes NAO sao segundos: com scrub ativo, sao fracoes da
            // distancia percorrida.
            if (i > 0) {
              tl.to(
                step,
                { autoAlpha: 1, y: 0, duration: 0.4, ease: 'power2.out' },
                i,
              )
            }
            if (i < steps.length - 1) {
              tl.to(
                step,
                { autoAlpha: 0, y: -30, duration: 0.4, ease: 'power2.in' },
                i + 0.5,
              )
            }
          })
        },
      })
    },
    // Trocar de idioma muda a altura dos textos; o trecho fixado precisa ser
    // remedido do zero.
    { scope: root, dependencies: [lang], revertOnUpdate: true },
  )

  return (
    <section
      id="process"
      ref={root}
      className="section section--dark process"
    >
      <div className="container">
        <Heading text={t(data.heading)} />

        <div className="process__stage">
          {data.steps.map((step, index) => (
            <div className="step" data-step="" key={step.title.pt}>
              <span className="step__n">
                {String(index + 1).padStart(2, '0')} / {data.steps.length}
              </span>
              <h3 className="step__title">{t(step.title)}</h3>
              <p className="step__body">{t(step.body)}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

import { RollButton } from '../components/RollButton'
import { useCardTilt } from '../motion/react/useCardTilt'
import { useTextLines } from '../motion/react/useTextLines'
import { useLang } from '../lang'
import type { HeroSection } from '../content/types'

export function Hero({ data }: { data: HeroSection }) {
  const { t } = useLang()
  const titleRef = useTextLines<HTMLHeadingElement>(t(data.headline))
  const cardRef = useCardTilt<HTMLDivElement>()

  return (
    <section id="hero" className="section section--hero">
      <div className="container hero__grid">
        <div>
          <p className="eyebrow">{t(data.eyebrow)}</p>
          <h1 ref={titleRef} className="hero__title">
            {t(data.headline)}
          </h1>
          <p className="hero__sub">{t(data.sub)}</p>
          <RollButton label={t(data.cta)} size="lg" />
        </div>

        {/* As tres camadas se movem em profundidades diferentes. A leitura de
            data-depth acontece no hook, entao a profundidade viaja no HTML. */}
        <div ref={cardRef} className="tiltcard">
          <div className="tiltcard__glow" data-tilt-layer="" data-depth="16" />
          <div className="tiltcard__shape" data-tilt-layer="" data-depth="30" />
          <div className="tiltcard__meta" data-tilt-layer="" data-depth="9">
            <strong>{t(data.cardTitle)}</strong>
            <span>{t(data.cardMeta)}</span>
          </div>
        </div>
      </div>
    </section>
  )
}

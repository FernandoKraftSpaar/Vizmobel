import { RollButton } from '../components/RollButton'
import { useTextLines } from '../motion/react/useTextLines'
import { useLang } from '../lang'
import type { CtaSection } from '../content/types'

export function Cta({ data }: { data: CtaSection }) {
  const { t } = useLang()
  const titleRef = useTextLines<HTMLHeadingElement>(t(data.headline))

  return (
    <section id="cta" className="section section--dark">
      <div className="container cta">
        <h2 ref={titleRef} className="cta__title">
          {t(data.headline)}
        </h2>
        <RollButton label={t(data.button)} variant="gold" size="lg" />
        <p className="cta__note">{t(data.note)}</p>
      </div>
    </section>
  )
}

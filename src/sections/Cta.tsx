import { useTextLines } from '../motion/react/useTextLines'
import { RollButton } from '../components/RollButton'
import { useLang } from '../lang'
import type { CtaSection } from '../content/types'

export function Cta({ data }: { data: CtaSection }) {
  const { t, lang } = useLang()
  const titleRef = useTextLines<HTMLHeadingElement>(lang)

  return (
    <section id="cta" className="section section--dark">
      <div className="container cta">
        <h2 className="cta__title" ref={titleRef}>
          {t(data.headline)}
        </h2>

        <RollButton label={t(data.button)} variant="gold" size="lg" />

        <p className="cta__note">{t(data.note)}</p>
      </div>
    </section>
  )
}

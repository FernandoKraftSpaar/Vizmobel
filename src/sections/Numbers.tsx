import { Counter } from '../components/Counter'
import { Heading } from '../components/Heading'
import { useLang } from '../lang'
import type { NumbersSection } from '../content/types'

export function Numbers({ data }: { data: NumbersSection }) {
  const { t, lang } = useLang()
  const locale = lang === 'pt' ? 'pt-BR' : 'de-DE'

  return (
    <section id="numbers" className="section section--dark">
      <div className="container">
        <Heading text={t(data.heading)} />

        <div className="metrics" data-animate-group="">
          {data.metrics.map((metric) => (
            <div className="metric" key={metric.label.pt} data-animate="">
              <Counter
                value={metric.value}
                decimals={metric.decimals}
                prefix={metric.prefix}
                suffix={metric.suffix}
                locale={locale}
              />
              <p className="metric__label">{t(metric.label)}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

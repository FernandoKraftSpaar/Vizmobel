import { useTextLines } from '../motion/react/useTextLines'
import { Counter } from '../components/Counter'
import { useLang } from '../lang'
import type { AnswerSection } from '../content/types'

/**
 * O diagnostico, centralizado e sozinho na tela.
 *
 * Depois de tres perguntas vindas das laterais, a resposta vir do centro e um
 * contraste deliberado: o movimento para de balancar e assenta. Os numeros
 * entram depois da frase, como confirmacao, nunca antes -- dado que chega
 * antes do argumento e so ruido.
 */
export function Answer({ data }: { data: AnswerSection }) {
  const { t, lang } = useLang()
  const titleRef = useTextLines<HTMLHeadingElement>(lang)
  const locale = lang === 'pt' ? 'pt-BR' : 'de-DE'

  return (
    <section id="answer" className="section section--dark">
      <div className="container answer" data-animate-group="">
        <h2 className="answer__statement" ref={titleRef}>
          {t(data.statement)}
        </h2>

        <p className="answer__follow" data-animate="">
          {t(data.followUp)}
        </p>

        <div className="answer__metrics">
          {data.metrics.map((metric) => (
            <div key={metric.suffix + metric.value} className="metric" data-animate="">
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

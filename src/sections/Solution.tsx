import { useTextLines } from '../motion/react/useTextLines'
import { useSlideIn } from '../motion/react/useSlideIn'
import { useLang } from '../lang'
import type { SolutionSection } from '../content/types'

/**
 * A virada.
 *
 * Os atributos voltam a alternar os lados, agora somando em vez de perguntar.
 * A simetria com a secao de perguntas e proposital: mesma coreografia, sinal
 * invertido.
 */
export function Solution({ data }: { data: SolutionSection }) {
  const { t, lang } = useLang()
  const headingRef = useTextLines<HTMLHeadingElement>(lang)
  const listRef = useSlideIn<HTMLDivElement>(lang)

  return (
    <section id="solution" className="section">
      <div className="container">
        <h2 className="solution__heading" ref={headingRef}>
          {t(data.headline)}
        </h2>

        <div className="attributes" ref={listRef}>
          {data.attributes.map((attribute, index) => (
            <article
              key={attribute.id}
              className="attribute"
              data-slide-in=""
              data-side={attribute.side}
            >
              <span className="attribute__index">
                {String(index + 1).padStart(2, '0')}
              </span>
              <h3 className="attribute__title">{t(attribute.title)}</h3>
              <p className="attribute__body">{t(attribute.body)}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  )
}

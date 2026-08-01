import { useSlideIn } from '../motion/react/useSlideIn'
import { useLang } from '../lang'
import type { QuestionsSection } from '../content/types'

/**
 * As perguntas entram alternando os lados.
 *
 * A alternancia nao e enfeite: ela obriga o olho a atravessar a tela a cada
 * pergunta, o que impoe uma pausa entre uma e outra. Lidas em bloco, tres
 * perguntas viram uma lista. Lidas uma a uma, viram uma conversa.
 */
export function Questions({ data }: { data: QuestionsSection }) {
  const { t, lang } = useLang()
  const ref = useSlideIn<HTMLDivElement>(lang)

  return (
    <section id="questions" className="section section--soft">
      <div className="container questions" ref={ref}>
        {data.questions.map((question) => (
          <p
            key={question.id}
            className="question"
            data-slide-in=""
            data-side={question.side}
          >
            {t(question.text)}
          </p>
        ))}
      </div>
    </section>
  )
}

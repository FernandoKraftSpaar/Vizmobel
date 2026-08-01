import { Heading } from '../components/Heading'
import { Paragraph } from '../components/Paragraph'
import { useLang } from '../lang'
import type { AboutSection } from '../content/types'

export function About({ data }: { data: AboutSection }) {
  const { t } = useLang()

  return (
    <section id="about" className="section section--soft">
      <div className="container">
        <Heading text={t(data.heading)} />

        <div className="prose">
          {data.paragraphs.map((paragraph) => (
            <Paragraph key={paragraph.pt} text={t(paragraph)} />
          ))}
        </div>
      </div>
    </section>
  )
}

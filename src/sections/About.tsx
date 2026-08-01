import { useTextLines } from '../motion/react/useTextLines'
import { useLang } from '../lang'
import type { AboutSection } from '../content/types'

export function About({ data }: { data: AboutSection }) {
  const { t, lang } = useLang()
  const headingRef = useTextLines<HTMLHeadingElement>(lang)

  return (
    <section id="about" className="section">
      <div className="container" data-animate-group="">
        <h2 className="heading" ref={headingRef}>
          {t(data.heading)}
        </h2>

        <div className="prose">
          {data.paragraphs.map((paragraph) => (
            <p key={paragraph.pt} data-animate="">
              {t(paragraph)}
            </p>
          ))}
        </div>
      </div>
    </section>
  )
}

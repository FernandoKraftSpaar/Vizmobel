import { Heading } from '../components/Heading'
import { useCardTilt } from '../motion/react/useCardTilt'
import { useLang } from '../lang'
import type { ServicesSection } from '../content/types'

function ServiceCard({
  index,
  title,
  body,
}: {
  index: number
  title: string
  body: string
}) {
  // Inclinacao mais discreta que a do hero: sao quatro cards lado a lado, e o
  // mesmo angulo do cartao grande deixaria a grade inteira instavel.
  const ref = useCardTilt<HTMLElement>({ maxTilt: 5, liftZ: 18 })

  return (
    <article ref={ref} className="card" data-animate="">
      <span className="card__index">
        {String(index + 1).padStart(2, '0')}
      </span>
      <h3 className="card__title">{title}</h3>
      <p className="card__body">{body}</p>
    </article>
  )
}

export function Services({ data }: { data: ServicesSection }) {
  const { t } = useLang()

  return (
    <section id="services" className="section">
      <div className="container">
        <Heading text={t(data.heading)} />
        <p className="lead">{t(data.intro)}</p>

        <div className="cards" data-animate-group="">
          {data.services.map((service, index) => (
            <ServiceCard
              key={service.id}
              index={index}
              title={t(service.title)}
              body={t(service.body)}
            />
          ))}
        </div>
      </div>
    </section>
  )
}

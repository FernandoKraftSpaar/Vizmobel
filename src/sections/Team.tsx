import { useLang } from '../lang'
import type { TeamSection } from '../content/types'

export function Team({ data }: { data: TeamSection }) {
  const { t } = useLang()

  return (
    <section id="team" className="section section--soft">
      <div className="container" data-animate-group="">
        <h2 className="heading">{t(data.heading)}</h2>

        <div className="team">
          {data.members.map((member) => (
            <article key={member.name} className="member" data-animate="">
              <div className="member__avatar" aria-hidden="true">
                {member.initials}
              </div>
              <p className="member__name">{member.name}</p>
              <p className="member__role">{t(member.role)}</p>
              <p className="member__place">{member.place}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  )
}

import { Heading } from '../components/Heading'
import { useLang } from '../lang'
import type { TeamSection } from '../content/types'

export function Team({ data }: { data: TeamSection }) {
  const { t } = useLang()

  return (
    <section id="team" className="section">
      <div className="container">
        <Heading text={t(data.heading)} />

        <div className="team" data-animate-group="">
          {data.members.map((member) => (
            <div className="member" key={member.name} data-animate="">
              <div className="member__avatar" aria-hidden="true">
                {member.initials}
              </div>
              <p className="member__name">{member.name}</p>
              <p className="member__role">{t(member.role)}</p>
              <p className="member__place">{member.place}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

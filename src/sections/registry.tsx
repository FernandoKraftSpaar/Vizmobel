import type { ReactNode } from 'react'
import type { Section } from '../content/types'
import { Hero } from './Hero'
import { Stage } from './Stage'
import { Questions } from './Questions'
import { Answer } from './Answer'
import { Solution } from './Solution'
import { Flow } from './Flow'
import { About } from './About'
import { Team } from './Team'
import { Cta } from './Cta'

/**
 * Traduz um item de conteudo no componente correspondente.
 *
 * O ramo default nao trata erro em tempo de execucao: ele existe para impedir
 * o build. Atribuir `section` a `never` so compila se todos os tipos tiverem
 * sido cobertos acima. Criar uma secao nova e esquecer de renderiza-la vira
 * erro de compilacao, nao uma tela em branco em producao.
 */
export function renderSection(section: Section): ReactNode {
  switch (section.kind) {
    case 'hero':
      return <Hero key="hero" data={section} />
    case 'stage':
      return <Stage key="stage" data={section} />
    case 'questions':
      return <Questions key="questions" data={section} />
    case 'answer':
      return <Answer key="answer" data={section} />
    case 'solution':
      return <Solution key="solution" data={section} />
    case 'flow':
      return <Flow key="flow" data={section} />
    case 'about':
      return <About key="about" data={section} />
    case 'team':
      return <Team key="team" data={section} />
    case 'cta':
      return <Cta key="cta" data={section} />
    default: {
      const exhaustive: never = section
      return exhaustive
    }
  }
}

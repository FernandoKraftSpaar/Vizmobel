import type { Section } from '../content/types'
import { Hero } from './Hero'
import { Numbers } from './Numbers'
import { Services } from './Services'
import { About } from './About'
import { Process } from './Process'
import { Team } from './Team'
import { Cta } from './Cta'

/**
 * Ponte entre o conteudo de dados e os componentes.
 *
 * O `switch` sobre a uniao discriminada faz o TypeScript estreitar o tipo em
 * cada ramo, entao <Hero data={section} /> recebe exatamente HeroSection.
 *
 * O `default` nao existe para tratar erro em tempo de execucao: ele existe
 * para quebrar o build. Se alguem acrescentar um tipo de secao em types.ts e
 * esquecer de trata-lo aqui, `section` deixa de ser `never` e a atribuicao
 * falha na compilacao, nao em producao.
 */
export function renderSection(section: Section) {
  switch (section.kind) {
    case 'hero':
      return <Hero key={section.kind} data={section} />
    case 'numbers':
      return <Numbers key={section.kind} data={section} />
    case 'services':
      return <Services key={section.kind} data={section} />
    case 'about':
      return <About key={section.kind} data={section} />
    case 'process':
      return <Process key={section.kind} data={section} />
    case 'team':
      return <Team key={section.kind} data={section} />
    case 'cta':
      return <Cta key={section.kind} data={section} />
    default: {
      const exhaustive: never = section
      return exhaustive
    }
  }
}

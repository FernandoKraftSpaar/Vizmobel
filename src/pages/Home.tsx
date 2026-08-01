import { site } from '../content/site'
import { renderSection } from '../sections/registry'

/** A narrativa completa, na ordem definida em `site.ts`. */
export function Home() {
  return <>{site.sections.map((section) => renderSection(section))}</>
}

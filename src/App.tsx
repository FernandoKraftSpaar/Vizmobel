import { useGSAP } from '@gsap/react'
import { site } from './content/site'
import { LANGS } from './content/types'
import { renderSection } from './sections/registry'
import { setupResponsiveMotion } from './motion/effects/responsive'
import { useLang } from './lang'

export function App() {
  const { t, lang, setLang } = useLang()

  // A coreografia global vive aqui e nao em cada secao. O layout effect do
  // componente pai roda DEPOIS dos filhos, entao neste ponto todo elemento
  // marcado com data-animate ja existe no DOM.
  useGSAP(() => setupResponsiveMotion(), {
    dependencies: [lang],
    revertOnUpdate: true,
  })

  return (
    <>
      <header className="header">
        <div className="container header__inner">
          <span className="brand">{site.brand}</span>

          <nav className="nav">
            {site.nav.map((item) => (
              <a key={item.id} href={`#${item.id}`}>
                {t(item.label)}
              </a>
            ))}
          </nav>

          <div className="langswitch">
            {LANGS.map((code) => (
              <button
                key={code}
                type="button"
                aria-pressed={lang === code}
                onClick={() => setLang(code)}
              >
                {code.toUpperCase()}
              </button>
            ))}
          </div>
        </div>
      </header>

      <main>{site.sections.map((section) => renderSection(section))}</main>

      <footer className="footer container">
        <span>
          {new Date().getFullYear()} {site.brand}
        </span>
        <span>Caxias do Sul \u00b7 Berlin</span>
      </footer>
    </>
  )
}

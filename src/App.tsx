import { useRef, type MouseEvent } from 'react'
import { useGSAP } from '@gsap/react'
import { site } from './content/site'
import { LANGS } from './content/types'
import { renderSection } from './sections/registry'
import { setupResponsiveMotion } from './motion/effects/responsive'
import { createHeaderReact, headerReactDefaults } from './motion/effects'
import { logoMark, logoWordmark } from './assets'
import { useLang } from './lang'

/**
 * Rolagem suave feita por JavaScript, e nao por scroll-behavior no CSS.
 *
 * A propriedade global aplica suavizacao a TODA rolagem da pagina, inclusive
 * aos ajustes que o proprio ScrollTrigger executa ao fixar uma secao e ao
 * recalcular posicoes. Com duas secoes fixadas, isso produz tremor. Aqui o
 * movimento e pedido explicitamente, num unico lugar, e some para quem
 * configurou movimento reduzido.
 */
function scrollToSection(event: MouseEvent<HTMLAnchorElement>, href: string) {
  const target = document.querySelector(href)
  if (!target) return

  event.preventDefault()
  const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
  target.scrollIntoView({
    behavior: reduced ? 'auto' : 'smooth',
    block: 'start',
  })
}

export function App() {
  const { t, lang, setLang } = useLang()
  const header = useRef<HTMLElement>(null)

  // A coreografia global vive aqui e nao em cada secao. O layout effect do
  // componente pai roda DEPOIS dos filhos, entao neste ponto todo elemento
  // marcado com data-animate ja existe no DOM.
  useGSAP(() => setupResponsiveMotion(), {
    dependencies: [lang],
    revertOnUpdate: true,
  })

  // Sem dependencia de idioma: o menu reage a rolagem, nao a texto.
  useGSAP(
    () => {
      const el = header.current
      if (!el) return undefined
      return createHeaderReact({ ...headerReactDefaults, header: el })
    },
    { scope: header },
  )

  return (
    <>
      <header className="header" ref={header}>
        <div className="container header__inner">
          <a className="brand" href="#hero" onClick={(e) => scrollToSection(e, '#hero')}>
            <img className="brand__mark" src={logoMark} alt={site.brand} />
          </a>

          <nav className="nav">
            {site.nav.map((item) => (
              <a
                key={item.href}
                href={item.href}
                onClick={(e) => scrollToSection(e, item.href)}
              >
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
        {/* loading="lazy" importa aqui: o logotipo por extenso e um SVG
            pesado e fica muito abaixo da primeira dobra. */}
        <img
          className="footer__wordmark"
          src={logoWordmark}
          alt={site.brand}
          loading="lazy"
          decoding="async"
        />

        <span>
          {new Date().getFullYear()} {site.brand} · {site.cities.join(' · ')}
        </span>
      </footer>
    </>
  )
}

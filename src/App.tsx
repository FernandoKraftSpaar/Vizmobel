import { useRef, type MouseEvent } from 'react'
import { useGSAP } from '@gsap/react'
import { site } from './content/site'
import { LANGS } from './content/types'
import { setupResponsiveMotion } from './motion/effects/responsive'
import {
  createHeaderReact,
  headerReactDefaults,
  createHeaderWave,
  headerWaveDefaults,
} from './motion/effects'
import { logoMark, logoWordmark } from './assets'
import { useLang } from './lang'
import { useRoute, navigate } from './router'
import { Home } from './pages/Home'
import { Catalog } from './pages/Catalog'

/**
 * Rolagem suave feita por JavaScript, e nao por scroll-behavior no CSS.
 *
 * A propriedade global aplica suavizacao a TODA rolagem da pagina, inclusive
 * aos ajustes que o proprio ScrollTrigger executa ao fixar uma secao e ao
 * recalcular posicoes. Com secoes fixadas, isso produz tremor. Aqui o
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
  const route = useRoute()
  const header = useRef<HTMLElement>(null)
  const wave = useRef<SVGPathElement>(null)

  // A coreografia global vive aqui e nao em cada secao. O layout effect do
  // componente pai roda DEPOIS dos filhos, entao neste ponto todo elemento
  // marcado com data-animate ja existe no DOM. Trocar de rota troca o DOM
  // inteiro, entao a rota entra nas dependencias junto com o idioma.
  useGSAP(() => setupResponsiveMotion(), {
    dependencies: [lang, route],
    revertOnUpdate: true,
  })

  // Sem dependencia de idioma nem de rota: o menu reage a rolagem, nao a texto.
  useGSAP(
    () => {
      const el = header.current
      const path = wave.current
      if (!el || !path) return undefined

      const stopReact = createHeaderReact({ ...headerReactDefaults, header: el })
      const stopWave = createHeaderWave({ ...headerWaveDefaults, path })

      return () => {
        stopReact()
        stopWave()
      }
    },
    { scope: header },
  )

  const onHome = route === 'home'

  return (
    <>
      <header className="header" ref={header}>
        <div className="container header__inner">
          <a
            className="brand"
            href="#/"
            onClick={(e) => {
              if (!onHome) return
              scrollToSection(e, '#hero')
            }}
          >
            <img className="brand__mark" src={logoMark} alt={site.brand} />
          </a>

          {onHome ? (
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
          ) : (
            <nav className="nav">
              <a
                href="#/"
                onClick={(e) => {
                  e.preventDefault()
                  navigate('home')
                }}
              >
                {lang === 'pt' ? 'In\u00edcio' : 'Startseite'}
              </a>
            </nav>
          )}

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

        {/* A borda que ondula. preserveAspectRatio="none" deixa o viewBox de
            1200 unidades esticar ate a largura real sem deformar a altura. */}
        <svg
          className="header__wave"
          viewBox="0 0 1200 28"
          preserveAspectRatio="none"
          aria-hidden="true"
        >
          <path ref={wave} d="M0 0 H1200 V14 H0 Z" />
        </svg>
      </header>

      <main>{onHome ? <Home /> : <Catalog />}</main>

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
          {new Date().getFullYear()} {site.brand} \u00b7 {site.cities.join(' \u00b7 ')}
        </span>
      </footer>
    </>
  )
}

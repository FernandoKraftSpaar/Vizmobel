import { useRef } from 'react'
import { useGSAP } from '@gsap/react'
import { createHeroIntro, heroIntroDefaults } from '../motion/effects'
import { RollButton } from '../components/RollButton'
import { useLang } from '../lang'
import { navigate } from '../router'
import type { HeroSection } from '../content/types'

/**
 * Hero centralizado ocupando a viewport inteira, agora em bloco azul.
 *
 * O fundo institucional resolve um problema que o branco criava: a primeira
 * tela nao tinha identidade nenhuma ate o visitante rolar. Com o navy, a marca
 * se apresenta antes da primeira palavra ser lida.
 *
 * O botao mudou para dourado por necessidade, nao por gosto: navy sobre navy
 * desapareceria. O dourado tambem passa a ser o unico ponto quente da tela,
 * que e exatamente onde queremos o clique.
 */
export function Hero({ data }: { data: HeroSection }) {
  const root = useRef<HTMLElement>(null)
  const { t, lang } = useLang()

  useGSAP(
    () => {
      const el = root.current
      if (!el) return undefined

      const title = el.querySelector<HTMLElement>('[data-hero-title]')
      const sub = el.querySelector<HTMLElement>('[data-hero-sub]')
      const action = el.querySelector<HTMLElement>('[data-hero-action]')
      if (!title || !sub || !action) return undefined

      return createHeroIntro({
        ...heroIntroDefaults,
        title,
        sub,
        action,
        cue: el.querySelector<HTMLElement>('[data-hero-cue]'),
      })
    },
    { scope: root, dependencies: [lang], revertOnUpdate: true },
  )

  return (
    <section id="hero" ref={root} className="section section--hero">
      <div className="container hero">
        <h1 className="hero__title" data-hero-title="">
          {t(data.headline)}
        </h1>

        <p className="hero__sub" data-hero-sub="">
          {t(data.sub)}
        </p>

        <div data-hero-action="">
          <RollButton
            label={t(data.cta)}
            variant="gold"
            size="lg"
            onClick={() => navigate('catalog')}
          />
        </div>
      </div>

      <div className="hero__cue" data-hero-cue="">
        <span>{t(data.cue)}</span>
        <svg width="13" height="20" viewBox="0 0 13 20" aria-hidden="true">
          <path
            d="M6.5 1v16M1 12l5.5 5.5L12 12"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </div>
    </section>
  )
}

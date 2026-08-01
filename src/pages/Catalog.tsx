import { useRef } from 'react'
import { useGSAP } from '@gsap/react'
import { gsap } from '../motion/gsap'
import { ModelStage } from '../viewer/ModelStage'
import { poltrona } from '../viewer/catalog'
import { products } from '../content/products'
import { navigate } from '../router'
import { useLang } from '../lang'
import type { Localized } from '../content/types'

const copy = {
  back: { pt: 'Voltar', de: 'Zur\u00fcck' },
  title: {
    pt: 'Cat\u00e1logo em realidade aumentada',
    de: 'Katalog in Augmented Reality',
  },
  intro: {
    pt: 'Escolha uma pe\u00e7a, gire com o dedo e toque em ver na sua sala para abrir a c\u00e2mera do celular. Sem app e sem cadastro.',
    de: 'W\u00e4hlen Sie ein St\u00fcck, drehen Sie es mit dem Finger und tippen Sie auf Im Raum ansehen, um die Kamera zu \u00f6ffnen. Ohne App, ohne Registrierung.',
  },
  soon: { pt: 'Modelo em produ\u00e7\u00e3o', de: 'Modell in Arbeit' },
  live: { pt: 'Dispon\u00edvel em AR', de: 'In AR verf\u00fcgbar' },
  grid: { pt: 'Pe\u00e7as do catr\u00e1logo', de: 'St\u00fccke im Katalog' },
} satisfies Record<string, Localized>

/**
 * A vitrine, e a base do que vira e-commerce.
 *
 * Uma peca esta viva e as outras nao, e isso e mostrado em vez de escondido.
 * Cartao vazio com aviso honesto vale mais que catalogo curto: quem visita
 * entende a extensao do que sera possivel, e a pagina ja tem a forma final
 * quando os modelos chegarem do blob storage.
 */
export function Catalog() {
  const root = useRef<HTMLDivElement>(null)
  const { t, lang } = useLang()

  useGSAP(
    () => {
      const el = root.current
      if (!el) return undefined

      const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
      if (reduced) return undefined

      const hero = el.querySelector<HTMLElement>('[data-catalog-hero]')
      const cards = gsap.utils.toArray<HTMLElement>('[data-pcard]', el)

      const tl = gsap.timeline()

      // A entrada por escala e o gesto de aproximacao pedido: a peca cresce em
      // direcao a quem chega. expo.out concentra quase todo o movimento no
      // inicio, entao o zoom parece rapido sem ser brusco no fim.
      if (hero) {
        tl.from(hero, {
          scale: 0.82,
          opacity: 0,
          duration: 1.1,
          ease: 'expo.out',
        })
      }

      if (cards.length > 0) {
        tl.from(
          cards,
          {
            y: 28,
            opacity: 0,
            duration: 0.6,
            ease: 'power3.out',
            stagger: 0.06,
          },
          '-=0.6',
        )
      }

      return () => {
        tl.kill()
      }
    },
    { scope: root, dependencies: [lang], revertOnUpdate: true },
  )

  return (
    <div className="container catalog" ref={root}>
      <div className="catalog__head">
        <button
          type="button"
          className="catalog__back"
          onClick={() => navigate('home')}
        >
          &larr; {t(copy.back)}
        </button>

        <h1 className="catalog__title">{t(copy.title)}</h1>
        <p className="lead">{t(copy.intro)}</p>
      </div>

      <div className="catalog__hero" data-catalog-hero="">
        <ModelStage config={poltrona} />
      </div>

      <h2 className="catalog__subtitle">{t(copy.grid)}</h2>

      <div className="catalog__grid">
        {products.map((product) => (
          <article
            key={product.id}
            className={`pcard${product.glbUrl ? '' : ' pcard--soon'}`}
            data-pcard=""
          >
            <div
              className="pcard__thumb"
              style={{ background: product.swatch }}
              aria-hidden="true"
            />

            <div className="pcard__body">
              <span className="pcard__category">{t(product.category)}</span>
              <h3 className="pcard__name">{t(product.name)}</h3>
              <span className="pcard__dims">{product.dimensions}</span>
            </div>

            <span className="pcard__tag">
              {product.glbUrl ? t(copy.live) : t(copy.soon)}
            </span>
          </article>
        ))}
      </div>
    </div>
  )
}

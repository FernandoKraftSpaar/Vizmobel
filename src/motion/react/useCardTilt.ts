import { useRef } from 'react'
import { useGSAP } from '@gsap/react'
import { gsap } from '../gsap'
import {
  createCardTilt,
  cardTiltDefaults,
  type CardTiltConfig,
} from '../effects/cardTilt'

type Overrides = Partial<Omit<CardTiltConfig, 'card' | 'parallaxLayers'>>

export function useCardTilt<T extends HTMLElement>(overrides: Overrides = {}) {
  const ref = useRef<T>(null)

  useGSAP(
    () => {
      const card = ref.current
      if (!card) return undefined

      // As camadas de paralaxe sao descobertas pelo DOM, nao passadas por
      // prop: assim o componente decide quantas quer, e a profundidade viaja
      // no proprio HTML via data-depth.
      const parallaxLayers = gsap.utils
        .toArray<HTMLElement>('[data-tilt-layer]', card)
        .map((el) => ({ el, depth: Number(el.dataset['depth'] ?? 0) }))

      return createCardTilt({
        ...cardTiltDefaults,
        ...overrides,
        card,
        parallaxLayers,
      })
    },
    { scope: ref },
  )

  return ref
}

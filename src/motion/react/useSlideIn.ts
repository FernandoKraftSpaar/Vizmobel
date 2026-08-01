import { useRef } from 'react'
import { useGSAP } from '@gsap/react'
import { gsap } from '../gsap'
import { createSlideIn, slideInDefaults, type SlideInConfig } from '../effects/slideIn'

type Overrides = Partial<Omit<SlideInConfig, 'items'>>

/**
 * Aplica entrada direcional a todos os filhos marcados com data-slide-in
 * dentro do elemento referenciado.
 *
 * `key` deve mudar quando o texto muda (troca de idioma), porque a altura dos
 * elementos muda junto e os pontos de disparo precisam ser remedidos.
 */
export function useSlideIn<T extends HTMLElement>(
  key: string,
  overrides: Overrides = {},
) {
  const ref = useRef<T>(null)

  useGSAP(
    () => {
      const root = ref.current
      if (!root) return undefined

      const items = gsap.utils.toArray<HTMLElement>('[data-slide-in]', root)
      if (items.length === 0) return undefined

      return createSlideIn({ ...slideInDefaults, ...overrides, items })
    },
    { scope: ref, dependencies: [key], revertOnUpdate: true },
  )

  return ref
}

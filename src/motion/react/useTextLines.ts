import { useRef } from 'react'
import { useGSAP } from '@gsap/react'
import {
  createTextLines,
  textLinesDefaults,
  type TextLinesConfig,
} from '../effects/textLines'

type Overrides = Partial<Omit<TextLinesConfig, 'target'>>

/**
 * O hook e fino de proposito: ele so cuida de ref, escopo e limpeza.
 * Toda a logica de animacao vive no efeito vanilla.
 */
export function useTextLines<T extends HTMLElement>(
  key: string,
  overrides: Overrides = {},
) {
  const ref = useRef<T>(null)

  useGSAP(
    () => {
      if (!ref.current) return undefined
      return createTextLines({
        ...textLinesDefaults,
        ...overrides,
        target: ref.current,
      })
    },
    // `key` muda quando o idioma troca: o texto e outro, entao a divisao em
    // linhas precisa ser refeita do zero.
    { scope: ref, dependencies: [key], revertOnUpdate: true },
  )

  return ref
}

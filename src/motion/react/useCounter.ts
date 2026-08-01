import { useRef } from 'react'
import { useGSAP } from '@gsap/react'
import {
  createCounter,
  counterDefaults,
  type CounterConfig,
} from '../effects/counter'

type Overrides = Partial<Omit<CounterConfig, 'el' | 'to'>>

export function useCounter(to: number, overrides: Overrides = {}) {
  const ref = useRef<HTMLSpanElement>(null)

  // Extraidos para servirem de dependencia: trocar o idioma muda o locale, e
  // a formatacao do numero precisa ser refeita.
  const locale = overrides.locale ?? counterDefaults.locale
  const decimals = overrides.decimals ?? counterDefaults.decimals

  useGSAP(
    () => {
      if (!ref.current) return undefined
      return createCounter({
        ...counterDefaults,
        ...overrides,
        el: ref.current,
        to,
      })
    },
    { scope: ref, dependencies: [to, locale, decimals], revertOnUpdate: true },
  )

  return ref
}

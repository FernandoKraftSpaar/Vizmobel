import { useRef } from 'react'
import { useGSAP } from '@gsap/react'
import {
  createRollButton,
  rollButtonDefaults,
  type RollButtonConfig,
} from '../effects/rollButton'

type Overrides = Partial<Omit<RollButtonConfig, 'button'>>

export function useRollButton(overrides: Overrides = {}) {
  const ref = useRef<HTMLButtonElement>(null)

  useGSAP(
    () => {
      if (!ref.current) return undefined
      return createRollButton({
        ...rollButtonDefaults,
        ...overrides,
        button: ref.current,
      })
    },
    { scope: ref },
  )

  return ref
}

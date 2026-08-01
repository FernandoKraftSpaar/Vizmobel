import { useCounter } from '../motion/react/useCounter'

type Props = {
  value: number
  decimals: number
  prefix: string
  suffix: string
  locale: string
  className?: string
}

export function Counter({
  value,
  decimals,
  prefix,
  suffix,
  locale,
  className = 'metric__value',
}: Props) {
  const ref = useCounter(value, { decimals, prefix, suffix, locale })
  // O conteudo e escrito pelo efeito, nunca pelo React: se ambos escrevessem
  // no mesmo no de texto, um sobrescreveria o outro a cada frame.
  return <span ref={ref} className={className} />
}

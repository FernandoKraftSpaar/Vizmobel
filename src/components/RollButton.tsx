import { useRollButton } from '../motion/react/useRollButton'

type Props = {
  label: string
  variant?: 'navy' | 'gold'
  size?: 'md' | 'lg'
  onClick?: () => void
}

/**
 * Duas copias identicas do rotulo, empilhadas dentro de um recorte de altura
 * fixa. O efeito sobe o conjunto em 50% -- exatamente a altura de uma copia.
 *
 * A segunda copia leva aria-hidden: visualmente ela e essencial, mas para um
 * leitor de tela seria o texto do botao repetido duas vezes.
 */
export function RollButton({
  label,
  variant = 'navy',
  size = 'md',
  onClick,
}: Props) {
  const ref = useRollButton()

  return (
    <button
      ref={ref}
      type="button"
      className={`roll roll--${variant} roll--${size}`}
      onClick={onClick}
    >
      <span className="roll__viewport">
        <span className="roll__inner" data-roll-inner="">
          <span className="roll__line">{label}</span>
          <span className="roll__line" aria-hidden="true">
            {label}
          </span>
        </span>
      </span>
    </button>
  )
}

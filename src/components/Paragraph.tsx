import { useTextLines } from '../motion/react/useTextLines'

export function Paragraph({
  text,
  className = '',
}: {
  text: string
  className?: string
}) {
  const ref = useTextLines<HTMLParagraphElement>(text, { stagger: 0.05 })
  return (
    <p ref={ref} className={className}>
      {text}
    </p>
  )
}

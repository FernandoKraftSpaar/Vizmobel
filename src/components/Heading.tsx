import { useTextLines } from '../motion/react/useTextLines'

export function Heading({
  text,
  className = '',
}: {
  text: string
  className?: string
}) {
  const ref = useTextLines<HTMLHeadingElement>(text)
  return (
    <h2 ref={ref} className={`heading ${className}`.trim()}>
      {text}
    </h2>
  )
}

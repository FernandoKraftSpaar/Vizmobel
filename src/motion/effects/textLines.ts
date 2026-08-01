import { gsap, SplitText, runtime } from '../gsap'
import { motion } from '../tokens'

// Derivar o tipo da propria funcao evita escrever gsap.core.Tween. O import
// default cria um binding local chamado `gsap` que sombreia o namespace
// global de mesmo nome, e a anotacao nem sempre resolve.
type Tween = ReturnType<typeof gsap.from>

export type TextLinesConfig = {
  target: HTMLElement
  yPercent: number
  duration: number
  ease: string
  stagger: number
  start: string
}

export const textLinesDefaults = {
  yPercent: 110,
  duration: motion.duration.base,
  ease: motion.ease.expo,
  stagger: motion.stagger.base,
  start: 'top 85%',
} as const satisfies Omit<TextLinesConfig, 'target'>

/**
 * Revela um bloco de texto linha a linha, como se cada linha subisse por tras
 * de uma cortina.
 *
 * O efeito de cortina vem de `mask: 'lines'`: o SplitText embrulha cada linha
 * num container com overflow hidden. Sem a mascara, a linha apenas aparece.
 *
 * `autoSplit` refaz a divisao quando a fonte termina de carregar ou quando o
 * container muda de largura. Sem isso, uma quebra de linha calculada com a
 * fonte de fallback fica errada depois que a fonte real chega.
 */
export function createTextLines(cfg: TextLinesConfig): () => void {
  let tween: Tween | undefined

  const split = SplitText.create(cfg.target, {
    type: 'lines',
    mask: 'lines',
    autoSplit: true,
    aria: 'auto',
    onSplit(self: SplitText) {
      tween = gsap.from(self.lines, {
        yPercent: cfg.yPercent,
        opacity: 0,
        duration: cfg.duration,
        ease: cfg.ease,
        stagger: cfg.stagger,
        scrollTrigger: {
          trigger: cfg.target,
          start: cfg.start,
          once: true,
          markers: runtime.debug,
        },
      })
      return tween
    },
  })

  // split.revert() nao e opcional: o SplitText troca o <h2> por dezenas de
  // divs. Sem o revert, o React remonta sobre o DOM ja fragmentado e o texto
  // aparece duplicado na tela.
  return () => {
    tween?.scrollTrigger?.kill()
    tween?.kill()
    split.revert()
  }
}

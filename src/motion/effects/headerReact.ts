import { gsap, ScrollTrigger } from '../gsap'

export type HeaderReactConfig = {
  header: HTMLElement
  compactAfter: number
  hideAfter: number
  duration: number
}

export const headerReactDefaults = {
  compactAfter: 80,
  hideAfter: 320,
  duration: 0.4,
} as const satisfies Omit<HeaderReactConfig, 'header'>

/**
 * Menu que reage a rolagem em duas etapas independentes.
 *
 * Compactar e esconder sao coisas diferentes de proposito. Sobre o hero o
 * menu e alto e transparente, porque ali ele nao deve competir com o titulo.
 * Passados alguns pixels ele encolhe e ganha fundo, porque a partir dai
 * precisa se destacar do conteudo. E some ao descer, porque quem esta lendo
 * quer a tela inteira -- mas volta imediatamente ao subir, porque subir e o
 * gesto de quem procura navegacao.
 *
 * A troca de aparencia fica no CSS via classe; so o deslocamento e animado
 * pelo GSAP. Animar cor e altura por JavaScript seria desperdicio.
 */
export function createHeaderReact(cfg: HeaderReactConfig): () => void {
  const shift = gsap.quickTo(cfg.header, 'yPercent', {
    duration: cfg.duration,
    ease: 'power3.out',
  })

  const trigger = ScrollTrigger.create({
    start: 0,
    end: 'max',
    onUpdate(self) {
      const y = self.scroll()
      cfg.header.classList.toggle('is-compact', y > cfg.compactAfter)

      const scrollingDown = self.direction === 1
      shift(scrollingDown && y > cfg.hideAfter ? -100 : 0)
    },
  })

  return () => {
    trigger.kill()
    gsap.killTweensOf(cfg.header)
    cfg.header.classList.remove('is-compact')
  }
}

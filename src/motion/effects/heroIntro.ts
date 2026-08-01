import { gsap, SplitText } from '../gsap'
import { motion } from '../tokens'

type Timeline = ReturnType<typeof gsap.timeline>
type Tween = ReturnType<typeof gsap.to>

export type HeroIntroConfig = {
  title: HTMLElement
  sub: HTMLElement
  action: HTMLElement
  cue: HTMLElement | null
  delay: number
}

export const heroIntroDefaults = {
  delay: 0.15,
} as const satisfies Omit<HeroIntroConfig, 'title' | 'sub' | 'action' | 'cue'>

/**
 * Abertura do hero, disparada no carregamento e nao pela rolagem.
 *
 * Duas escolhas fazem a diferenca entre isto e um fade generico:
 *
 * 1. O escalonamento. Titulo, subtitulo e botao entram em momentos distintos
 *    e com sobreposicao negativa, de modo que um comeca antes de o anterior
 *    terminar. Tudo entrando junto parece transicao de slide.
 *
 * 2. O exagero que assenta. As linhas do titulo comecam com scaleY em 1.12 e
 *    terminam em 1. O olho le isso como massa em movimento desacelerando, nao
 *    como um objeto teletransportado.
 */
export function createHeroIntro(cfg: HeroIntroConfig): () => void {
  let tl: Timeline | undefined
  let cueLoop: Tween | undefined

  const split = SplitText.create(cfg.title, {
    type: 'lines',
    mask: 'lines',
    autoSplit: true,
    aria: 'auto',
    onSplit(self: SplitText) {
      tl = gsap.timeline({ delay: cfg.delay })

      tl.from(self.lines, {
        yPercent: 130,
        opacity: 0,
        scaleY: 1.12,
        transformOrigin: '50% 100%',
        duration: 1.05,
        ease: motion.ease.expo,
        stagger: 0.09,
      })

      // Posicoes negativas puxam o inicio para tras: o subtitulo comeca
      // enquanto a ultima linha do titulo ainda esta chegando.
      tl.from(
        cfg.sub,
        { y: 26, opacity: 0, duration: 0.7, ease: motion.ease.out },
        '-=0.55',
      )

      tl.from(
        cfg.action,
        { y: 18, opacity: 0, scale: 0.96, duration: 0.6, ease: motion.ease.out },
        '-=0.45',
      )

      if (cfg.cue) {
        tl.from(cfg.cue, { opacity: 0, duration: 0.5 }, '-=0.25')
      }

      return tl
    },
  })

  if (cfg.cue) {
    cueLoop = gsap.to(cfg.cue, {
      y: 8,
      repeat: -1,
      yoyo: true,
      duration: 1.1,
      ease: motion.ease.inOut,
      delay: cfg.delay + 1.8,
    })
  }

  return () => {
    cueLoop?.kill()
    tl?.kill()
    split.revert()
  }
}

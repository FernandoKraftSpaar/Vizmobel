import { gsap } from '../gsap'
import { motion } from '../tokens'

/**
 * Coreografia global de entrada, sensivel a breakpoint e a preferencia de
 * movimento reduzido.
 *
 * gsap.matchMedia faz duas coisas que um `if (window.innerWidth)` jamais
 * faria: reverte automaticamente todos os tweens criados dentro do bloco
 * quando a condicao deixa de valer, e reexecuta o bloco correto quando ela
 * volta. Girar o celular nao deixa animacao orfa.
 *
 * Tratar prefers-reduced-motion como mais uma condicao resolve acessibilidade
 * dentro da mesma estrutura, sem codigo paralelo.
 */
export function setupResponsiveMotion(): () => void {
  const mm = gsap.matchMedia()

  mm.add(
    {
      isDesktop: '(min-width: 1024px) and (prefers-reduced-motion: no-preference)',
      isMobile: '(max-width: 1023px) and (prefers-reduced-motion: no-preference)',
      isReduced: '(prefers-reduced-motion: reduce)',
    },
    (ctx) => {
      const conditions = (ctx.conditions ?? {}) as Record<string, boolean | undefined>
      const root = document.documentElement

      if (conditions['isReduced'] === true) {
        root.dataset['reducedMotion'] = 'true'
        gsap.set('[data-animate]', { clearProps: 'all', opacity: 1, x: 0, y: 0 })
        return
      }

      delete root.dataset['reducedMotion']

      const isMobile = conditions['isMobile'] === true
      const distance = isMobile ? motion.distance.sm : motion.distance.md
      const stagger = isMobile ? motion.stagger.tight : motion.stagger.base
      const start = isMobile ? 'top 92%' : 'top 82%'

      // Cada grupo revela seus proprios filhos, para que o stagger nao
      // atravesse a pagina inteira.
      for (const group of gsap.utils.toArray<HTMLElement>('[data-animate-group]')) {
        const items = gsap.utils.toArray<HTMLElement>('[data-animate]', group)
        if (items.length === 0) continue

        gsap.from(items, {
          y: distance,
          opacity: 0,
          duration: motion.duration.base,
          ease: motion.ease.out,
          stagger,
          scrollTrigger: { trigger: group, start, once: true },
        })
      }
    },
  )

  return () => mm.revert()
}

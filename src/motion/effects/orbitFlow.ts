import { gsap, runtime } from '../gsap'

export type OrbitFlowConfig = {
  section: HTMLElement
  ring: SVGGeometryElement
  nodes: HTMLElement[]
}

/**
 * Fluxo de aquisicao desenhado como ciclo.
 *
 * O traco do circulo cresce por strokeDashoffset em vez do DrawSVGPlugin.
 * Para uma forma que nos mesmos desenhamos, sem transformacoes aninhadas nem
 * unidades relativas, o plugin nao resolve nada que o dash nao resolva -- e
 * evita carregar mais um plugin no bundle.
 *
 * A tecnica: definimos o tracejado com exatamente o comprimento total da
 * linha e empurramos o deslocamento para o mesmo valor. A linha existe, mas
 * comeca inteiramente fora de vista. Levar o deslocamento a zero a revela
 * progressivamente.
 *
 * No celular o pin e desligado. Fixar uma segunda secao numa tela baixa
 * transforma a pagina num tunel do qual o usuario nao sabe quando vai sair.
 */
export function createOrbitFlow(cfg: OrbitFlowConfig): () => void {
  const length = cfg.ring.getTotalLength()
  gsap.set(cfg.ring, { strokeDasharray: length, strokeDashoffset: length })

  const mm = gsap.matchMedia()

  mm.add(
    {
      isDesktop: '(min-width: 900px) and (prefers-reduced-motion: no-preference)',
      isMobile: '(max-width: 899px) and (prefers-reduced-motion: no-preference)',
      isReduced: '(prefers-reduced-motion: reduce)',
    },
    (ctx) => {
      const conditions = (ctx.conditions ?? {}) as Record<string, boolean | undefined>

      if (conditions['isReduced'] === true) {
        gsap.set(cfg.ring, { strokeDashoffset: 0 })
        gsap.set(cfg.nodes, { autoAlpha: 1, scale: 1 })
        return
      }

      gsap.set(cfg.nodes, { autoAlpha: 0, scale: 0.72 })

      if (conditions['isMobile'] === true) {
        const trigger = { trigger: cfg.section, start: 'top 70%', once: true }

        gsap.to(cfg.ring, {
          strokeDashoffset: 0,
          duration: 1.4,
          ease: 'none',
          scrollTrigger: trigger,
        })

        gsap.to(cfg.nodes, {
          autoAlpha: 1,
          scale: 1,
          duration: 0.5,
          stagger: 0.16,
          ease: 'back.out(1.7)',
          scrollTrigger: trigger,
        })

        return
      }

      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: cfg.section,
          start: 'top top',
          end: '+=170%',
          pin: true,
          scrub: 1,
          anticipatePin: 1,
          invalidateOnRefresh: true,
          markers: runtime.debug,
        },
      })

      // Com scrub ativo estes numeros sao fracoes da distancia rolada, nao
      // segundos. O traco leva o percurso inteiro; cada no acende quando o
      // traco chega ate ele.
      tl.to(cfg.ring, {
        strokeDashoffset: 0,
        ease: 'none',
        duration: cfg.nodes.length,
      })

      cfg.nodes.forEach((node, index) => {
        tl.to(
          node,
          { autoAlpha: 1, scale: 1, duration: 0.35, ease: 'back.out(1.7)' },
          index * 0.95,
        )
      })
    },
  )

  return () => mm.revert()
}

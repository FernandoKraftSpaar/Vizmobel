import { gsap } from '../gsap'

export type WaveFlowConfig = {
  section: HTMLElement
  /** A senoide desenhada atras dos passos. Nulo desliga o traco. */
  path: SVGPathElement | null
  nodes: HTMLElement[]
  /** Deslocamento vertical de entrada, em pixels. */
  rise: number
  scaleFrom: number
  /** Duracao de cada passo, em fracao do trecho rolado. */
  step: number
  /** Sobreposicao entre um passo e o seguinte. */
  overlap: number
  end: string
}

export const waveFlowDefaults = {
  rise: 28,
  scaleFrom: 0.88,
  step: 1,
  overlap: 0.28,
  end: '+=150%',
} as const satisfies Omit<WaveFlowConfig, 'section' | 'path' | 'nodes'>

/**
 * Os passos surgindo em ordem ao longo de uma senoide.
 *
 * A elipse anterior tinha um defeito de geometria, nao de ajuste: com quatro
 * nos distribuidos por 360 graus, um deles cai obrigatoriamente no ponto mais
 * baixo da figura. Numa caixa alta o suficiente para a elipse ser reconhecivel,
 * esse ponto fica abaixo da dobra -- e o passo 3 desaparecia enquanto 1, 2 e 4
 * ficavam visiveis. A secao prometia ordem e escondia justamente o meio dela.
 *
 * A senoide corrige pela forma. Os nos alternam acima e abaixo de uma unica
 * linha media, entao a excursao vertical e a metade da de um circulo de mesma
 * largura, e nenhum passo ocupa posicao privilegiada.
 *
 * O traco voltou, mas com uma diferenca que importa: ele se DESENHA conforme a
 * rolagem, sempre um pouco a frente do proximo passo. O anel antigo mostrava o
 * circuito inteiro pronto antes da primeira leitura, que era o motivo de ele
 * atrapalhar. Uma linha que avanca nao antecipa nada -- ela conduz.
 */
export function createWaveFlow(cfg: WaveFlowConfig): () => void {
  if (cfg.nodes.length === 0) return () => {}

  const span = cfg.nodes.length * (cfg.step - cfg.overlap) + cfg.overlap

  const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
  if (reduced) {
    gsap.set(cfg.nodes, { opacity: 1, y: 0, scale: 1 })
    if (cfg.path) gsap.set(cfg.path, { strokeDashoffset: 0 })
    return () => {}
  }

  // Fixar so faz sentido onde a senoide cabe. No celular os passos viram lista
  // empilhada pelo CSS, e prender a tela ali seria prisao, nao ritmo.
  const wide = window.matchMedia('(min-width: 900px)').matches

  const tl = gsap.timeline({
    scrollTrigger: {
      trigger: cfg.section,
      start: wide ? 'top top' : 'top 78%',
      end: wide ? cfg.end : 'bottom 60%',
      scrub: 1,
      pin: wide,
      anticipatePin: wide ? 1 : 0,
    },
  })

  /*
   * Desenho progressivo sem plugin.
   *
   * DrawSVG faria isto em uma linha, mas o recurso nativo resolve: um traco
   * pontilhado com um unico segmento do tamanho da curva inteira, deslocado
   * para fora e trazido de volta. `getTotalLength` mede a curva real, entao
   * trocar quatro passos por cinco nao exige recalcular nada aqui.
   */
  if (cfg.path) {
    const length = cfg.path.getTotalLength()
    gsap.set(cfg.path, {
      strokeDasharray: length,
      strokeDashoffset: length,
    })
    tl.to(
      cfg.path,
      { strokeDashoffset: 0, ease: 'none', duration: span },
      0,
    )
  }

  cfg.nodes.forEach((node, index) => {
    tl.from(
      node,
      {
        opacity: 0,
        y: cfg.rise,
        scale: cfg.scaleFrom,
        ease: 'none',
        duration: cfg.step,
      },
      index * (cfg.step - cfg.overlap),
    )
  })

  return () => {
    tl.scrollTrigger?.kill()
    tl.kill()
  }
}

/*
 * O bundle do model-viewer passa de 300 KB. Se ele entrar no carregamento
 * inicial, disputa banda com o hero e derruba o LCP -- justamente a metrica que
 * o cliente sente como "o site demorou".
 *
 * Entao ele nao entra pelo `import`. Entra por script injetado, uma unica vez,
 * quando a secao do produto se aproxima da tela.
 */

export const MODEL_VIEWER_SRC =
  'https://ajax.googleapis.com/ajax/libs/model-viewer/4.0.0/model-viewer.min.js'

let pending: Promise<void> | null = null

/**
 * Carrega o model-viewer sob demanda e resolve quando o custom element estiver
 * registrado. Chamadas concorrentes compartilham a mesma promessa.
 */
export function loadModelViewer(src: string = MODEL_VIEWER_SRC): Promise<void> {
  if (customElements.get('model-viewer')) return Promise.resolve()
  if (pending) return pending

  pending = new Promise<void>((resolve, reject) => {
    const script = document.createElement('script')
    script.type = 'module'
    script.src = src
    script.crossOrigin = 'anonymous'

    script.addEventListener('load', () => {
      // O `load` do script dispara antes de o elemento se registrar.
      void customElements.whenDefined('model-viewer').then(() => resolve())
    })

    script.addEventListener('error', () => {
      // Zera o cache: uma falha de rede nao deve condenar as tentativas
      // seguintes a devolver a mesma promessa rejeitada para sempre.
      pending = null
      reject(new Error(`Falha ao carregar o model-viewer de ${src}`))
    })

    document.head.append(script)
  })

  return pending
}

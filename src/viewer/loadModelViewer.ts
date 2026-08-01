/*
 * O bundle do model-viewer passa de 300 KB. Se ele entrar no carregamento
 * inicial, disputa banda com o hero e derruba o LCP -- justamente a metrica que
 * o cliente sente como "o site demorou".
 *
 * Entao ele nao entra pelo `import`. Entra por script injetado, uma unica vez.
 */

export const MODEL_VIEWER_SRC =
  'https://ajax.googleapis.com/ajax/libs/model-viewer/4.0.0/model-viewer.min.js'

const CDN_ORIGIN = 'https://ajax.googleapis.com'

let pending: Promise<void> | null = null
let warmed = false

function link(attrs: Record<string, string>): void {
  const el = document.createElement('link')
  for (const [key, value] of Object.entries(attrs)) el.setAttribute(key, value)
  document.head.append(el)
}

/**
 * Prepara a rede antes de precisar dela.
 *
 * Sem isto o navegador so descobre o dominio do CDN quando o script e
 * injetado, e paga DNS, TCP e TLS em serie antes do primeiro byte. O preload do
 * modelo resolve um problema maior: sem ele, o GLB so comeca a baixar depois
 * que o script termina e o elemento monta. Duas esperas em fila viram uma.
 *
 * Preload e nao fetch porque o navegador reaproveita o preload na requisicao
 * que o model-viewer fara depois. Um fetch manual arriscaria baixar duas vezes.
 */
export function warmConnections(modelUrl: string): void {
  if (warmed) return
  warmed = true

  link({ rel: 'preconnect', href: CDN_ORIGIN, crossorigin: 'anonymous' })
  link({ rel: 'dns-prefetch', href: CDN_ORIGIN })
  link({ rel: 'preload', as: 'fetch', href: modelUrl, crossorigin: 'anonymous' })
}

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

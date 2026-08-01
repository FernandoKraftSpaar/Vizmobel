import { useCallback, useEffect, useRef, useState } from 'react'
import { useLang } from '../lang'
import { loadModelViewer, warmConnections } from './loadModelViewer'
import type { ModelConfig } from './catalog'
import type { ArStatus, ModelViewerElement } from './types'

type Phase = 'loading' | 'ready' | 'failed'

/**
 * O aparelho tem tela sensivel ao toque?
 *
 * Esta pergunta substituiu `canActivateAR` como criterio para MOSTRAR o botao.
 * `canActivateAR` e assincrono: so vira verdadeiro depois que o GLB carrega e a
 * deteccao de suporte resolve. Qualquer prazo que a gente invente para esperar
 * por ele expira antes num aparelho lento, e a interface conclui "sem AR" de
 * forma permanente. A classe do aparelho, ao contrario, e conhecida no primeiro
 * quadro e nao muda.
 */
function detectHandheld(): boolean {
  if (typeof window === 'undefined') return false
  return (
    window.matchMedia('(pointer: coarse)').matches ||
    window.navigator.maxTouchPoints > 0
  )
}

/**
 * O Safari aceita abrir o Quick Look?
 *
 * `relList.supports('ar')` e literalmente o sinalizador que o model-viewer
 * consulta para decidir se existe AR no iOS. Se ele for falso, nao ha atributo,
 * arquivo ou configuracao que faca a camera abrir naquele navegador -- e saber
 * disso muda o diagnostico de "nosso codigo esta errado" para "este navegador
 * nao tem a funcao".
 */
function supportsQuickLook(): boolean {
  if (typeof document === 'undefined') return false
  try {
    const anchor = document.createElement('a')
    return anchor.relList.supports('ar')
  } catch {
    return false
  }
}

/**
 * Os fatos que decidem se a AR abre, em texto que cabe num print de tela.
 *
 * Existe porque depurar AR a distancia sem isto e adivinhacao: o navegador esta
 * na mao de outra pessoa, o console nao esta acessivel e cada rodada de palpite
 * custa um build. Cinco linhas na tela resolvem em uma rodada.
 */
function diagnostics(el: ModelViewerElement | null): Array<[string, string]> {
  const nav = window.navigator
  const ua = nav.userAgent
  const platform =
    /iPhone|iPad|iPod/.test(ua) || (/Mac/.test(ua) && nav.maxTouchPoints > 1)
      ? 'iOS'
      : /Android/.test(ua)
        ? 'Android'
        : 'outro'

  return [
    ['plataforma', platform],
    ['navegador', /CriOS|FxiOS|EdgiOS/.test(ua) ? 'nao-Safari no iOS' : 'ok'],
    ['protocolo', window.location.protocol],
    ['quick-look', supportsQuickLook() ? 'sim' : 'nao'],
    ['webxr', 'xr' in nav ? 'sim' : 'nao'],
    ['modelo carregado', el?.loaded ? 'sim' : 'nao'],
    ['canActivateAR', el?.canActivateAR ? 'sim' : 'nao'],
  ]
}

const copy = {
  loading: { pt: 'carregando o modelo', de: 'Modell wird geladen' },
  broken: { pt: '3D indisponivel', de: '3D nicht verf\u00fcgbar' },
  cta: { pt: 'Ver no seu ambiente', de: 'Im eigenen Raum ansehen' },
  ctaWait: { pt: 'Preparando o modelo...', de: 'Modell wird vorbereitet...' },
  hint: {
    pt: 'Aponte a c\u00e2mera para o ch\u00e3o e mova o aparelho devagar.',
    de: 'Richten Sie die Kamera auf den Boden und bewegen Sie das Ger\u00e4t langsam.',
  },
  searching: { pt: 'Procurando o ch\u00e3o...', de: 'Boden wird gesucht...' },
  placed: {
    pt: 'Pe\u00e7a posicionada em escala real. Ande em volta para ver de todos os \u00e2ngulos.',
    de: 'St\u00fcck in realer Gr\u00f6\u00dfe platziert. Gehen Sie herum, um alle Winkel zu sehen.',
  },
  failed: {
    pt: 'N\u00e3o foi poss\u00edvel abrir a c\u00e2mera. Se voc\u00ea recusou a permiss\u00e3o, toque de novo e autorize.',
    de: 'Die Kamera konnte nicht ge\u00f6ffnet werden. Falls Sie die Berechtigung abgelehnt haben, tippen Sie erneut und erlauben Sie den Zugriff.',
  },
  unsupported: {
    pt: 'Este navegador n\u00e3o abriu a realidade aumentada. Toque em detalhes t\u00e9cnicos e me envie o que aparece.',
    de: 'Dieser Browser hat AR nicht ge\u00f6ffnet. Tippen Sie auf technische Details und senden Sie mir die Anzeige.',
  },
  diag: { pt: 'detalhes t\u00e9cnicos', de: 'technische Details' },
  deskTitle: {
    pt: 'A c\u00e2mera est\u00e1 no celular',
    de: 'Die Kamera ist am Smartphone',
  },
  deskBody: {
    pt: 'Abra este mesmo endere\u00e7o no seu telefone para colocar a pe\u00e7a na sua sala. Aqui no computador voc\u00ea pode girar e aproximar o modelo com o cursor.',
    de: '\u00d6ffnen Sie dieselbe Adresse auf Ihrem Telefon, um das St\u00fcck in Ihren Raum zu stellen. Am Computer k\u00f6nnen Sie das Modell mit dem Cursor drehen und heranzoomen.',
  },
} as const

/** Le o estado da AR sem confiar na forma do detalhe do evento. */
function readStatus(event: Event): ArStatus | null {
  const detail: unknown = (event as CustomEvent<unknown>).detail
  if (typeof detail !== 'object' || detail === null) return null

  const status = (detail as { status?: unknown }).status
  return status === 'not-presenting' ||
    status === 'session-started' ||
    status === 'object-placed' ||
    status === 'failed'
    ? status
    : null
}

/**
 * O motor de AR com a nossa casca.
 *
 * O botao NAO usa `slot="ar-button"`. O slot obriga a viver dentro da caixa do
 * canvas, herda o empilhamento do shadow DOM e some sem avisar quando o
 * elemento decide que nao ha suporte. Chamando `activateAR()` por conta
 * propria, o botao e nosso em posicao, tamanho e cor.
 */
export function ArStage({ config }: { config: ModelConfig }) {
  const viewer = useRef<ModelViewerElement>(null)
  const { t } = useLang()

  const [phase, setPhase] = useState<Phase>('loading')
  const [modelLoaded, setModelLoaded] = useState(false)
  const [status, setStatus] = useState<ArStatus>('not-presenting')
  const [unsupported, setUnsupported] = useState(false)
  const [report, setReport] = useState<Array<[string, string]>>([])

  const [handheld] = useState(detectHandheld)

  // Sem IntersectionObserver aqui, ao contrario do palco da home: nesta pagina
  // o visualizador e o motivo da visita e abre acima da dobra. Adiar seria
  // economizar rede as custas da unica coisa que a pessoa veio ver.
  useEffect(() => {
    warmConnections(config.glbUrl)

    let cancelled = false
    loadModelViewer().then(
      () => {
        if (!cancelled) setPhase('ready')
      },
      (error: unknown) => {
        console.error(error)
        if (!cancelled) setPhase('failed')
      },
    )

    return () => {
      cancelled = true
    }
  }, [config.glbUrl])

  useEffect(() => {
    if (phase !== 'ready') return undefined

    const el = viewer.current
    if (!el) return undefined

    // O GLB pode ja estar em cache e o evento `load` ter disparado antes deste
    // efeito rodar. Sem esta leitura direta, o botao ficaria travado em
    // "preparando" para sempre em toda segunda visita.
    if (el.loaded) setModelLoaded(true)

    const onLoad = () => setModelLoaded(true)
    const onStatus = (event: Event) => {
      const next = readStatus(event)
      if (next) setStatus(next)
    }

    el.addEventListener('load', onLoad)
    el.addEventListener('ar-status', onStatus)

    return () => {
      el.removeEventListener('load', onLoad)
      el.removeEventListener('ar-status', onStatus)
    }
  }, [phase])

  const enterAr = useCallback(() => {
    const el = viewer.current
    if (!el) return

    /*
     * TENTA PRIMEIRO, JULGA DEPOIS.
     *
     * A versao anterior consultava `canActivateAR` ANTES e desistia se fosse
     * falso. Isso transformava um sinalizador que pode estar atrasado num veto
     * definitivo. Agora a chamada acontece de qualquer jeito: se houver
     * qualquer modo de AR disponivel, a camera abre; se nao houver, o
     * model-viewer nao faz nada e o julgamento vem na linha seguinte.
     *
     * A ordem tambem protege o gesto: `activateAR` precisa nascer do toque, e
     * qualquer espera antes dela faria o navegador recusar a camera em
     * silencio.
     */
    void el.activateAR().catch((error: unknown) => {
      console.error(error)
      setStatus('failed')
    })

    if (el.canActivateAR) {
      setUnsupported(false)
      setReport([])
    } else {
      setUnsupported(true)
      setReport(diagnostics(el))
    }
  }, [])

  const message = unsupported
    ? t(copy.unsupported)
    : status === 'session-started'
      ? t(copy.searching)
      : status === 'object-placed'
        ? t(copy.placed)
        : status === 'failed'
          ? t(copy.failed)
          : t(copy.hint)

  const bad = unsupported || status === 'failed'

  return (
    <div className="demo">
      <div className="demo__frame">
        {phase === 'ready' ? (
          <model-viewer
            ref={viewer}
            className="demo__canvas"
            src={config.glbUrl}
            alt={t(config.alt)}
            ar=""
            ar-modes="webxr scene-viewer quick-look"
            ar-placement="floor"
            ar-scale="fixed"
            camera-controls=""
            disable-pan=""
            interaction-prompt="none"
            touch-action="pan-y"
            loading="eager"
            reveal="auto"
            tone-mapping="commerce"
            exposure={config.exposure}
            shadow-intensity={config.shadowIntensity}
            shadow-softness={config.shadowSoftness}
            field-of-view={config.fieldOfView}
            min-field-of-view={config.minFieldOfView}
            camera-target={config.cameraTarget}
            min-camera-orbit={config.minCameraOrbit}
            max-camera-orbit={config.maxCameraOrbit}
            {...(config.usdzUrl ? { 'ios-src': config.usdzUrl } : {})}
            {...(config.environmentUrl
              ? { 'environment-image': config.environmentUrl }
              : {})}
            {...(config.posterUrl ? { poster: config.posterUrl } : {})}
          />
        ) : (
          <div className="demo__placeholder" aria-hidden="true">
            <span>{phase === 'failed' ? t(copy.broken) : t(copy.loading)}</span>
          </div>
        )}
      </div>

      <div className="demo__bar">
        {handheld ? (
          <>
            <button
              type="button"
              className="demo__cta"
              onClick={enterAr}
              disabled={!modelLoaded}
              data-ar-cta=""
            >
              <span className="demo__cta-icon" aria-hidden="true">
                <svg width="19" height="19" viewBox="0 0 20 20" fill="none">
                  <path
                    d="M10 2.6 17 6.4v7.2L10 17.4 3 13.6V6.4z"
                    stroke="currentColor"
                    strokeWidth="1.5"
                    strokeLinejoin="round"
                  />
                  <path
                    d="M3 6.4 10 10.2l7-3.8M10 10.2v7.2"
                    stroke="currentColor"
                    strokeWidth="1.5"
                    strokeLinejoin="round"
                  />
                </svg>
              </span>
              {modelLoaded ? t(copy.cta) : t(copy.ctaWait)}
            </button>

            {/* aria-live faz o leitor de tela anunciar a mudanca de estado. Em
                AR o visitante costuma estar de pe, longe da tela, com o
                aparelho apontado para o chao -- o retorno precisa existir por
                mais de um canal. */}
            <p
              className={`demo__status${bad ? ' demo__status--bad' : ''}`}
              aria-live="polite"
            >
              {message}
            </p>

            {report.length > 0 && (
              <details className="demo__diag">
                <summary>{t(copy.diag)}</summary>
                <dl className="demo__diag-list">
                  {report.map(([key, value]) => (
                    <div key={key} className="demo__diag-row">
                      <dt>{key}</dt>
                      <dd>{value}</dd>
                    </div>
                  ))}
                </dl>
              </details>
            )}
          </>
        ) : (
          <div className="demo__fallback">
            <strong className="demo__fallback-title">{t(copy.deskTitle)}</strong>
            <p className="demo__fallback-body">{t(copy.deskBody)}</p>
            <code className="demo__url">
              {typeof window === 'undefined' ? '' : window.location.href}
            </code>
          </div>
        )}
      </div>
    </div>
  )
}

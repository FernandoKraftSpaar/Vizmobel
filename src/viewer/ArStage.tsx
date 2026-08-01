import { useCallback, useEffect, useRef, useState } from 'react'
import { useLang } from '../lang'
import { loadModelViewer, warmConnections } from './loadModelViewer'
import type { ModelConfig } from './catalog'
import type { ArStatus, ModelViewerElement } from './types'

type Phase = 'loading' | 'ready' | 'failed'
type Support = 'checking' | 'available' | 'unavailable'

/*
 * Sondagem em vez de leitura unica.
 *
 * `canActivateAR` nasce falso e vira verdadeiro quando a deteccao de suporte
 * termina -- no WebXR isso depende de uma promessa do navegador. Nao existe
 * evento anunciando a virada, entao ou se pergunta de novo ou se conclui
 * "sem AR" para um aparelho que tem AR. Oito tentativas a cada 400ms cobrem
 * folgadamente o pior caso observado sem deixar o rodape do cartao indeciso.
 */
const PROBE_INTERVAL = 400
const PROBE_TRIES = 8

const copy = {
  loading: { pt: 'carregando o modelo', de: 'Modell wird geladen' },
  broken: { pt: '3D indisponivel', de: '3D nicht verf\u00fcgbar' },
  cta: { pt: 'Ver no seu ambiente', de: 'Im eigenen Raum ansehen' },
  hint: {
    pt: 'Aponte a c\u00e2mera para o ch\u00e3o e mova o aparelho devagar.',
    de: 'Richten Sie die Kamera auf den Boden und bewegen Sie das Ger\u00e4t langsam.',
  },
  searching: {
    pt: 'Procurando o ch\u00e3o...',
    de: 'Boden wird gesucht...',
  },
  placed: {
    pt: 'Pe\u00e7a posicionada em escala real. Ande em volta para ver de todos os \u00e2ngulos.',
    de: 'St\u00fcck in realer Gr\u00f6\u00dfe platziert. Gehen Sie herum, um alle Winkel zu sehen.',
  },
  failed: {
    pt: 'N\u00e3o foi poss\u00edvel abrir a c\u00e2mera neste aparelho.',
    de: 'Die Kamera konnte auf diesem Ger\u00e4t nicht ge\u00f6ffnet werden.',
  },
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
 * A diferenca central em relacao ao prototipo: o botao NAO usa
 * `slot="ar-button"`. O slot obriga a viver dentro da caixa do canvas, herda o
 * empilhamento do shadow DOM e some sem avisar quando o elemento decide que
 * nao ha suporte. Chamando `activateAR()` por conta propria, o botao e nosso em
 * posicao, tamanho e cor, e o desaparecimento vira decisao explicita -- com
 * alternativa no lugar, em vez de um vazio.
 */
export function ArStage({ config }: { config: ModelConfig }) {
  const viewer = useRef<ModelViewerElement>(null)
  const { t, lang } = useLang()

  const [phase, setPhase] = useState<Phase>('loading')
  const [support, setSupport] = useState<Support>('checking')
  const [status, setStatus] = useState<ArStatus>('not-presenting')

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

    let tries = 0
    let id = 0

    const probe = () => {
      if (el.canActivateAR) {
        window.clearInterval(id)
        setSupport('available')
        return
      }

      tries += 1
      if (tries >= PROBE_TRIES) {
        window.clearInterval(id)
        setSupport('unavailable')
      }
    }

    id = window.setInterval(probe, PROBE_INTERVAL)
    probe()

    return () => window.clearInterval(id)
  }, [phase])

  useEffect(() => {
    if (phase !== 'ready') return undefined

    const el = viewer.current
    if (!el) return undefined

    const onStatus = (event: Event) => {
      const next = readStatus(event)
      if (next) setStatus(next)
    }

    el.addEventListener('ar-status', onStatus)
    return () => el.removeEventListener('ar-status', onStatus)
  }, [phase])

  const enterAr = useCallback(() => {
    const el = viewer.current
    if (!el) return

    // activateAR precisa nascer de um gesto do usuario. Este clique e o gesto,
    // entao nada de await antes da chamada -- esperar por qualquer promessa
    // aqui perderia a permissao e o navegador recusaria a camera em silencio.
    void el.activateAR().catch((error: unknown) => {
      console.error(error)
      setStatus('failed')
    })
  }, [])

  const message =
    status === 'session-started'
      ? t(copy.searching)
      : status === 'object-placed'
        ? t(copy.placed)
        : status === 'failed'
          ? t(copy.failed)
          : t(copy.hint)

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
            {...(config.environmentUrl
              ? { 'environment-image': config.environmentUrl }
              : {})}
            {...(config.posterUrl ? { poster: config.posterUrl } : {})}
          />
        ) : (
          <div className="demo__placeholder" aria-hidden="true">
            <span>
              {phase === 'failed' ? t(copy.broken) : t(copy.loading)}
            </span>
          </div>
        )}
      </div>

      <div className="demo__bar">
        {support === 'available' ? (
          <>
            <button
              type="button"
              className="demo__cta"
              onClick={enterAr}
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
              {t(copy.cta)}
            </button>

            {/* aria-live faz o leitor de tela anunciar a mudanca de estado. Em
                AR o visitante costuma estar de pe, longe da tela, com o
                aparelho apontado para o chao -- o retorno precisa existir por
                mais de um canal. */}
            <p
              className={`demo__status${status === 'failed' ? ' demo__status--bad' : ''}`}
              aria-live="polite"
            >
              {message}
            </p>
          </>
        ) : support === 'unavailable' ? (
          <div className="demo__fallback">
            <strong className="demo__fallback-title">{t(copy.deskTitle)}</strong>
            <p className="demo__fallback-body">{t(copy.deskBody)}</p>
            <code className="demo__url">
              {typeof window === 'undefined' ? '' : window.location.href}
            </code>
          </div>
        ) : (
          <p className="demo__status">
            {lang === 'pt' ? 'verificando o aparelho' : 'Ger\u00e4t wird gepr\u00fcft'}
          </p>
        )}
      </div>
    </div>
  )
}

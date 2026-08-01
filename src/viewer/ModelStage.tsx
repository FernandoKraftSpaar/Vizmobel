import { useEffect, useRef, useState } from 'react'
import { useLang } from '../lang'
import { loadModelViewer, warmConnections } from './loadModelViewer'
import { createOrbitScrub, orbitScrubDefaults } from './orbitScrub'
import type { ModelConfig } from './catalog'
import type { ModelViewerElement } from './types'

/**
 * O produto no palco.
 *
 * O seletor de acabamentos foi retirado ate o catalogo real existir. O motor de
 * troca continua em `applyFinish.ts`: quando `config.groups` deixar de vir
 * vazio do banco, a interface volta sem que nada aqui precise mudar de forma.
 */
export function ModelStage({ config }: { config: ModelConfig }) {
  const wrap = useRef<HTMLDivElement>(null)
  const viewer = useRef<ModelViewerElement>(null)
  const { t, lang } = useLang()

  const [ready, setReady] = useState(false)
  const [failed, setFailed] = useState(false)

  useEffect(() => {
    const el = wrap.current
    if (!el) return undefined

    // Abre conexao com o CDN e reserva o download do modelo imediatamente, para
    // que script e GLB baixem em paralelo em vez de um depois do outro.
    warmConnections(config.glbUrl)

    let cancelled = false
    let started = false

    const start = () => {
      if (started) return
      started = true
      observer.disconnect()
      window.clearTimeout(timer)

      loadModelViewer().then(
        () => {
          if (!cancelled) setReady(true)
        },
        (error: unknown) => {
          console.error(error)
          if (!cancelled) setFailed(true)
        },
      )
    }

    /*
     * Duas partidas, a que vier primeiro.
     *
     * A rolagem antecipa o carregamento com margem larga. Mas depender so dela
     * era o defeito: quem rola rapido chegava na secao antes do download
     * terminar. Entao um cronometro curto dispara sozinho logo apos a primeira
     * pintura, quando a rede ja esta livre do que importa para o hero.
     */
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries.some((entry) => entry.isIntersecting)) start()
      },
      { rootMargin: '1400px 0px' },
    )
    observer.observe(el)

    // setTimeout e nao requestIdleCallback: o Safari ainda nao implementa a
    // segunda, e e justamente no iPhone que a AR importa mais.
    const timer = window.setTimeout(start, 1200)

    return () => {
      cancelled = true
      observer.disconnect()
      window.clearTimeout(timer)
    }
  }, [config.glbUrl])

  // Liga a camera a rolagem, mas so depois que o elemento existe no DOM.
  useEffect(() => {
    const el = viewer.current
    const section = wrap.current
    if (!ready || !el || !section) return undefined

    return createOrbitScrub({
      ...orbitScrubDefaults,
      viewer: el,
      trigger: section,
    })
  }, [ready])

  return (
    <div className="viewer" ref={wrap}>
      <div className="viewer__frame">
        {ready && !failed ? (
          <model-viewer
            ref={viewer}
            className="viewer__canvas"
            src={config.glbUrl}
            alt={t(config.alt)}
            ar=""
            ar-modes="webxr scene-viewer quick-look"
            ar-placement="floor"
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
          >
            <button className="viewer__ar" slot="ar-button" type="button">
              {lang === 'pt' ? 'Ver na sua sala' : 'Im Raum ansehen'}
            </button>
          </model-viewer>
        ) : (
          <div className="viewer__placeholder" aria-hidden="true">
            <span>{failed ? '3D indisponivel' : 'carregando'}</span>
          </div>
        )}
      </div>
    </div>
  )
}

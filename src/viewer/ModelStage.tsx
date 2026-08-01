import { useEffect, useRef, useState } from 'react'
import { useLang } from '../lang'
import { applyFinish } from './applyFinish'
import { loadModelViewer } from './loadModelViewer'
import { createOrbitScrub, orbitScrubDefaults } from './orbitScrub'
import type { Finish, ModelConfig } from './catalog'
import type { ModelViewerElement } from './types'

/**
 * O produto no palco: modelo 3D, seletor de acabamentos e o botao de AR.
 *
 * O componente carrega o motor sozinho, quando a secao se aproxima da tela, e
 * nao renderiza nada de 3D antes disso.
 */
export function ModelStage({ config }: { config: ModelConfig }) {
  const wrap = useRef<HTMLDivElement>(null)
  const viewer = useRef<ModelViewerElement>(null)
  const { t, lang } = useLang()

  const [ready, setReady] = useState(false)
  const [failed, setFailed] = useState(false)
  const [selected, setSelected] = useState<Record<string, string>>({})

  // 1. Carrega o motor quando a secao se aproxima -- 400px antes de aparecer,
  //    para que o download termine enquanto o visitante ainda esta rolando.
  useEffect(() => {
    const el = wrap.current
    if (!el) return undefined

    let cancelled = false

    const observer = new IntersectionObserver(
      (entries) => {
        if (!entries.some((entry) => entry.isIntersecting)) return
        observer.disconnect()
        loadModelViewer().then(
          () => {
            if (!cancelled) setReady(true)
          },
          (error: unknown) => {
            console.error(error)
            if (!cancelled) setFailed(true)
          },
        )
      },
      { rootMargin: '400px 0px' },
    )

    observer.observe(el)

    return () => {
      cancelled = true
      observer.disconnect()
    }
  }, [])

  // 2. Liga a camera a rolagem, mas so depois que o elemento existe no DOM.
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

  function choose(group: string, finish: Finish) {
    setSelected((current) => ({ ...current, [group]: finish.id }))
    const el = viewer.current
    if (!el) return
    void applyFinish(el, finish).catch((error: unknown) => {
      console.error('[viewer] Falha ao aplicar acabamento', error)
    })
  }

  return (
    <div className="viewer" ref={wrap}>
      <div className="viewer__frame">
        {ready && !failed ? (
          <model-viewer
            ref={viewer}
            class="viewer__canvas"
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
            <span>{failed ? '3D indisponivel' : 'carregando 3D'}</span>
          </div>
        )}
      </div>

      <div className="finishes">
        {config.groups.map((group) => (
          <div className="finishes__group" key={group.id}>
            <span className="finishes__label">{t(group.label)}</span>
            <div className="finishes__row" role="group" aria-label={t(group.label)}>
              {group.finishes.map((finish) => {
                const [r, g, b] = finish.color
                const active = selected[group.id] === finish.id
                return (
                  <button
                    key={finish.id}
                    type="button"
                    className="swatch"
                    aria-pressed={active}
                    aria-label={t(finish.label)}
                    title={t(finish.label)}
                    disabled={!ready || failed}
                    onClick={() => choose(group.id, finish)}
                    style={{
                      background: `rgb(${Math.round(r * 255)} ${Math.round(g * 255)} ${Math.round(b * 255)})`,
                    }}
                  />
                )
              })}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

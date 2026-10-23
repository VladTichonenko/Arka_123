import { useCallback, useEffect, useRef, useState } from 'react'
import { createPortal } from 'react-dom'
import { ArrowsOut, ArrowCounterClockwise, X } from '@phosphor-icons/react'
import './virtual-tour.css'

const PANORAMA = '/images/space/room-panorama.webp'

function Panorama({ onReady, onError }: { onReady: () => void; onError: () => void }) {
  const hostRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const host = hostRef.current
    if (!host) return
    let disposed = false
    let cleanup = () => {}

    import('three').then((THREE) => {
      if (disposed) return
      const scene = new THREE.Scene()
      const camera = new THREE.PerspectiveCamera(73, 1, 0.1, 1000)
      const renderer = new THREE.WebGLRenderer({ antialias: true, powerPreference: 'low-power' })
      renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2))
      renderer.outputColorSpace = THREE.SRGBColorSpace
      host.appendChild(renderer.domElement)
      const geometry = new THREE.SphereGeometry(500, 64, 40)
      geometry.scale(-1, 1, 1)
      const material = new THREE.MeshBasicMaterial({ side: THREE.DoubleSide })
      scene.add(new THREE.Mesh(geometry, material))

      let yaw = Math.PI
      let pitch = 0
      let dragging = false
      let lastX = 0
      let lastY = 0
      const draw = () => {
        camera.lookAt(Math.sin(yaw) * Math.cos(pitch), Math.sin(pitch), Math.cos(yaw) * Math.cos(pitch))
        renderer.render(scene, camera)
      }
      const resize = () => {
        const { width, height } = host.getBoundingClientRect()
        camera.aspect = width / Math.max(height, 1)
        camera.updateProjectionMatrix()
        renderer.setSize(width, height, false)
        draw()
      }
      const observer = new ResizeObserver(resize)
      observer.observe(host)
      new THREE.TextureLoader().load(PANORAMA, (texture) => {
        if (disposed) { texture.dispose(); return }
        texture.colorSpace = THREE.SRGBColorSpace
        material.map = texture
        material.needsUpdate = true
        draw()
        onReady()
      }, undefined, () => { if (!disposed) onError() })

      const pointerDown = (event: PointerEvent) => {
        dragging = true
        lastX = event.clientX
        lastY = event.clientY
        renderer.domElement.setPointerCapture(event.pointerId)
      }
      const pointerMove = (event: PointerEvent) => {
        if (!dragging) return
        yaw -= (event.clientX - lastX) * 0.0045
        pitch = Math.max(-1.15, Math.min(1.15, pitch + (event.clientY - lastY) * 0.0045))
        lastX = event.clientX
        lastY = event.clientY
        draw()
      }
      const pointerUp = () => { dragging = false }
      const keyDown = (event: KeyboardEvent) => {
        if (!['ArrowLeft', 'ArrowRight', 'ArrowUp', 'ArrowDown', 'Home'].includes(event.key)) return
        event.preventDefault()
        if (event.key === 'Home') { yaw = Math.PI; pitch = 0 }
        if (event.key === 'ArrowLeft') yaw += 0.12
        if (event.key === 'ArrowRight') yaw -= 0.12
        if (event.key === 'ArrowUp') pitch = Math.max(-1.15, pitch - 0.12)
        if (event.key === 'ArrowDown') pitch = Math.min(1.15, pitch + 0.12)
        draw()
      }
      const canvas = renderer.domElement
      canvas.tabIndex = 0
      canvas.setAttribute('role', 'img')
      canvas.setAttribute('aria-label', 'Панорама зала. Потяните изображение или используйте стрелки для поворота. Клавиша Home возвращает исходный вид.')
      canvas.addEventListener('pointerdown', pointerDown)
      canvas.addEventListener('pointermove', pointerMove)
      canvas.addEventListener('pointerup', pointerUp)
      canvas.addEventListener('pointercancel', pointerUp)
      canvas.addEventListener('keydown', keyDown)
      resize()
      cleanup = () => {
        observer.disconnect()
        canvas.removeEventListener('pointerdown', pointerDown)
        canvas.removeEventListener('pointermove', pointerMove)
        canvas.removeEventListener('pointerup', pointerUp)
        canvas.removeEventListener('pointercancel', pointerUp)
        canvas.removeEventListener('keydown', keyDown)
        material.map?.dispose()
        material.dispose()
        geometry.dispose()
        renderer.dispose()
        canvas.remove()
      }
    }).catch(() => { if (!disposed) onError() })

    return () => { disposed = true; cleanup() }
  }, [onReady, onError])

  return <div className="virtual-tour__canvas" ref={hostRef} />
}

export function VirtualTour({ onClose }: { onClose: () => void }) {
  const [ready, setReady] = useState(false)
  const [failed, setFailed] = useState(false)
  const [viewKey, setViewKey] = useState(0)
  const dialogRef = useRef<HTMLDialogElement>(null)
  const fullscreenRef = useRef<HTMLDivElement>(null)
  const onReady = useCallback(() => setReady(true), [])
  const onError = useCallback(() => setFailed(true), [])

  useEffect(() => {
    const dialog = dialogRef.current
    const previousOverflow = document.body.style.overflow
    const previousFocus = document.activeElement instanceof HTMLElement && document.activeElement !== document.body
      ? document.activeElement
      : document.getElementById('virtual-tour')
    dialog?.showModal()
    document.body.style.overflow = 'hidden'
    const fullscreenHost = fullscreenRef.current
    if (window.matchMedia('(max-width: 760px)').matches && document.fullscreenEnabled) {
      void fullscreenHost?.requestFullscreen?.().catch(() => {})
    }
    return () => {
      if (document.fullscreenElement === fullscreenHost) void document.exitFullscreen().catch(() => {})
      dialog?.close()
      document.body.style.overflow = previousOverflow
      previousFocus?.focus({ preventScroll: true })
    }
  }, [])

  const resetView = () => {
    setReady(false)
    setFailed(false)
    setViewKey((value) => value + 1)
  }
  const toggleFullscreen = () => {
    if (document.fullscreenElement) void document.exitFullscreen()
    else void fullscreenRef.current?.requestFullscreen?.().catch(() => {})
  }

  return createPortal(
    <dialog className="virtual-tour" aria-labelledby="virtual-tour-title" aria-describedby="virtual-tour-note" ref={dialogRef} onCancel={onClose} onClick={(event) => { if (event.target === event.currentTarget) onClose() }}>
      <div className="virtual-tour__content" ref={fullscreenRef}>
      <div className="virtual-tour__header">
        <div>
          <h2 id="virtual-tour-title">Обзор зала АРКА 123 на 360°</h2>
          <p>Поверните панораму мышью, пальцем или стрелками на клавиатуре.</p>
        </div>
        <button className="virtual-tour__close" type="button" onClick={onClose} aria-label="Закрыть обзор зала"><X size={23} aria-hidden="true" /></button>
      </div>
      <div className="virtual-tour__viewport">
        <img className="virtual-tour__poster" src="/images/space/room-main.webp" alt="Зал АРКА 123 с арочными окнами" loading="lazy" />
        {!failed && <Panorama key={viewKey} onReady={onReady} onError={onError} />}
        {!ready && !failed && <span className="virtual-tour__loading" role="status">Загружаем панораму…</span>}
        {failed && <div className="virtual-tour__error" role="alert"><p>Не удалось открыть панораму.</p><button type="button" onClick={resetView}>Попробовать ещё раз</button></div>}
        {ready && !failed && <div className="virtual-tour__controls"><span>Потяните, чтобы осмотреть зал</span><button type="button" onClick={resetView} aria-label="Вернуть исходный вид"><ArrowCounterClockwise size={19} /></button><button type="button" onClick={toggleFullscreen} aria-label="Развернуть или уменьшить панораму"><ArrowsOut size={19} /></button></div>}
      </div>
      <p className="virtual-tour__note" id="virtual-tour-note">Обзор из одной точки · 360°. Панорама создана по фотографиям с помощью ИИ. Планировка и отдельные детали могут отличаться от реального зала.</p>
      </div>
    </dialog>,
    document.body,
  )
}

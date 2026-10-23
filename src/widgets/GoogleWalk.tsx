import { useEffect, useRef, useState } from 'react'
import { createPortal } from 'react-dom'
import { ArrowSquareOut, ArrowsOut, X } from '@phosphor-icons/react'
import '../shared/styles/google-walk.css'

// Same coordinate-based Street View embed used by newsellyourbrick.
const location = '53.931095,27.650135'
const apiKey = String(import.meta.env.VITE_GOOGLE_MAPS_EMBED_API_KEY || '').trim()
const embedUrl = apiKey
  ? `https://www.google.com/maps/embed/v1/streetview?${new URLSearchParams({ key: apiKey, location, radius: '120', fov: '80', pitch: '0', language: 'ru' })}`
  : 'https://www.google.com/maps/embed?origin=mfe&pb=!6m6!1m5!2m2!1d53.931095!2d27.650135!4f-0!5f1&hl=ru'
const mapsUrl = `https://www.google.com/maps/@?api=1&map_action=pano&viewpoint=${location}`

function Panorama() {
  return <iframe src={embedUrl} title="Google Street View — прогулка возле АРКИ 123" referrerPolicy="strict-origin-when-cross-origin" allow="fullscreen; accelerometer; gyroscope" allowFullScreen />
}

function WalkDialog({ onClose }: { onClose: () => void }) {
  const dialogRef = useRef<HTMLDialogElement>(null)

  useEffect(() => {
    const dialog = dialogRef.current
    const previousOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    dialog?.showModal()
    return () => {
      document.body.style.overflow = previousOverflow
    }
  }, [])

  return createPortal(
    <dialog ref={dialogRef} className="google-walk-dialog" aria-label="Панорамная прогулка возле АРКИ 123" onCancel={onClose} onClose={onClose}>
      <Panorama />
      <button type="button" className="google-walk-dialog__close" onClick={onClose} aria-label="Закрыть прогулку" autoFocus><X size={26} /></button>
    </dialog>, document.body,
  )
}

export function GoogleWalk() {
  const [fullscreen, setFullscreen] = useState(false)
  const [nearby, setNearby] = useState(false)
  const rootRef = useRef<HTMLDivElement>(null)
  const expandRef = useRef<HTMLButtonElement>(null)
  useEffect(() => {
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) {
        setNearby(true)
        observer.disconnect()
      }
    }, { rootMargin: '400px' })
    if (rootRef.current) observer.observe(rootRef.current)
    return () => observer.disconnect()
  }, [])
  const close = () => {
    setFullscreen(false)
    window.requestAnimationFrame(() => expandRef.current?.focus())
  }

  return (
    <div ref={rootRef} className="google-walk">
      <div className="google-walk__frame">{nearby && <Panorama />}</div>
      <div className="google-walk__toolbar">
        <div><strong>Прогулка у АРКИ</strong><span>360° · Google Street View</span></div>
        <a href={mapsUrl} target="_blank" rel="noreferrer" aria-label="Открыть прогулку в Google Maps" title="Открыть в Google Maps"><ArrowSquareOut size={21} /></a>
        <button ref={expandRef} type="button" onClick={() => setFullscreen(true)} aria-label="Развернуть прогулку на весь экран" title="На весь экран"><ArrowsOut size={21} /></button>
      </div>
      {fullscreen && <WalkDialog onClose={close} />}
    </div>
  )
}

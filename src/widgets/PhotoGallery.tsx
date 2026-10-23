import { useEffect, useRef, useState } from 'react'
import { ArrowLeft, ArrowRight, ArrowUpRight, X } from '@phosphor-icons/react'

const photos = [
  { src: '/images/space/room-main.webp', alt: 'Открытый зал АРКА 123 с арочными окнами', label: 'Общий вид зала' },
  { src: '/images/space/room-arches.webp', alt: 'Арочные окна помещения', label: 'Окна и дневной свет' },
  { src: '/images/space/room-library-view.webp', alt: 'Вид на Национальную библиотеку из окна', label: 'Вид на Библиотеку' },
  { src: '/images/space/room-glass.webp', alt: 'Стеклянная перегородка в помещении', label: 'Стеклянные перегородки' },
  { src: '/images/space/building-front.webp', alt: 'Фасад здания с арочными окнами', label: 'Фасад здания' },
  { src: '/images/space/building-arch.webp', alt: 'Арка между зданиями', label: 'Арка между домами' },
]

const previewPhotos = photos.slice(0, 5)
const morePhotoIndex = previewPhotos.length - 1
const remainingPhotoCount = photos.length - morePhotoIndex

export function PhotoGallery() {
  const [selected, setSelected] = useState<number | null>(null)
  const isOpen = selected !== null
  const dialogRef = useRef<HTMLDialogElement>(null)

  useEffect(() => {
    if (!isOpen) return
    const dialog = dialogRef.current
    if (!dialog) return
    const previousOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    dialog.showModal()
    return () => {
      document.body.style.overflow = previousOverflow
      dialog.close()
    }
  }, [isOpen])

  return (
    <section className="gallery-section" id="gallery" aria-labelledby="gallery-title">
      <div className="container">
        <h2 id="gallery-title" className="visually-hidden">Фотогалерея пространства АРКА 123</h2>
        <div className="gallery-grid">
          {previewPhotos.map((photo, index) => (
            <button className={`gallery-item ${index === morePhotoIndex ? 'gallery-item--more' : ''}`} type="button" key={photo.src} onClick={() => setSelected(index)} aria-haspopup="dialog" aria-label={index === morePhotoIndex ? `Посмотреть ещё ${remainingPhotoCount} фото` : `Открыть фото: ${photo.label}`}>
              <img src={photo.src} alt={photo.alt} loading="lazy" />
              {index === morePhotoIndex && <span className="gallery-item__more"><strong>+ {remainingPhotoCount} фото</strong><span>Здание и его архитектура</span></span>}
              <span className="gallery-item__panel"><span>{index === morePhotoIndex ? 'Вся галерея' : photo.label}</span><span className="gallery-item__arrow"><ArrowUpRight size={20} weight="thin" aria-hidden="true" /></span></span>
            </button>
          ))}
        </div>
      </div>
      <dialog className="gallery-lightbox" ref={dialogRef} aria-label="Фотогалерея АРКА 123" onCancel={(event) => { event.preventDefault(); setSelected(null) }} onClick={(event) => { if (event.target === event.currentTarget) setSelected(null) }} onKeyDown={(event) => {
        if (event.key !== 'ArrowLeft' && event.key !== 'ArrowRight') return
        event.preventDefault()
        const direction = event.key === 'ArrowLeft' ? -1 : 1
        setSelected((current) => current === null ? null : (current + direction + photos.length) % photos.length)
      }}>
        {selected !== null && <>
          <button className="gallery-lightbox__close" type="button" onClick={() => setSelected(null)} aria-label="Закрыть галерею" autoFocus><X size={26} /></button>
          <button className="gallery-lightbox__nav gallery-lightbox__nav--prev" type="button" onClick={() => setSelected((selected + photos.length - 1) % photos.length)} aria-label="Предыдущее фото"><ArrowLeft size={25} /></button>
          <figure>
            <img src={photos[selected].src} alt={photos[selected].alt} />
            <figcaption aria-live="polite"><span>{photos[selected].label}</span><span>{String(selected + 1).padStart(2, '0')} / {String(photos.length).padStart(2, '0')}</span></figcaption>
          </figure>
          <button className="gallery-lightbox__nav gallery-lightbox__nav--next" type="button" onClick={() => setSelected((selected + 1) % photos.length)} aria-label="Следующее фото"><ArrowRight size={25} /></button>
        </>}
      </dialog>
    </section>
  )
}

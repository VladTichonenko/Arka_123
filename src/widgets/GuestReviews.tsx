import { useEffect, useRef, useState } from 'react'
import { ArrowLeft, ArrowRight, ArrowUpRight, Quotes, Star, UserCircle } from '@phosphor-icons/react'
import './guest-reviews.css'

const reviews = [
  {
    name: 'Анна',
    occasion: 'Мастер-класс',
    quote: 'Свет, большие окна и столько воздуха! Именно такая атмосфера нужна, чтобы отвлечься от повседневного и создать что-то своими руками.',
    highlight: true,
  },
  {
    name: 'Максим',
    occasion: 'Командная встреча',
    quote: 'Смена обстановки помогает посмотреть на привычные задачи по-новому. Здесь хочется обсуждать, придумывать и слышать друг друга.',
    highlight: false,
  },
  {
    name: 'Екатерина',
    occasion: 'Камерное событие',
    quote: 'Есть места, в которых сразу чувствуешь себя легко. Тёплый паркет, красивый вид и свои люди рядом — больше ничего и не нужно.',
    highlight: false,
  },
]

export function GuestReviews() {
  const viewportRef = useRef<HTMLDivElement>(null)
  const [active, setActive] = useState(0)

  useEffect(() => {
    const viewport = viewportRef.current
    if (!viewport) return
    const syncActive = () => {
      if (!window.matchMedia('(max-width: 760px)').matches) { setActive(0); return }
      const left = viewport.getBoundingClientRect().left
      const distances = Array.from(viewport.children, card => Math.abs(card.getBoundingClientRect().left - left))
      setActive(distances.indexOf(Math.min(...distances)))
    }
    viewport.addEventListener('scroll', syncActive, { passive: true })
    const observer = new ResizeObserver(syncActive)
    observer.observe(viewport)
    return () => { viewport.removeEventListener('scroll', syncActive); observer.disconnect() }
  }, [])

  const goTo = (index: number) => {
    const viewport = viewportRef.current
    if (!viewport || !window.matchMedia('(max-width: 760px)').matches) return
    const card = viewport.children[Math.max(0, Math.min(reviews.length - 1, index))]
    viewport.scrollTo({ left: viewport.scrollLeft + card.getBoundingClientRect().left - viewport.getBoundingClientRect().left, behavior: window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'instant' : 'smooth' })
  }

  return (
    <section className="guest-reviews" id="reviews" aria-labelledby="guest-reviews-title">
      <div className="container">
        <div className="guest-reviews__heading">
          <div>
            <span className="section-kicker">Отзывы и впечатления</span>
            <h2 id="guest-reviews-title">Хорошие встречи.<br /><span>Тёплые воспоминания.</span></h2>
          </div>
        </div>
        <div className="guest-reviews__grid" id="guest-reviews-slider" ref={viewportRef} tabIndex={0} role="group" aria-label="Карточки отзывов: используйте стрелки для перелистывания" onKeyDown={(event) => {
          if (event.target !== event.currentTarget || !window.matchMedia('(max-width: 760px)').matches) return
          if (event.key === 'ArrowRight' || event.key === 'ArrowLeft') { event.preventDefault(); goTo(active + (event.key === 'ArrowRight' ? 1 : -1)) }
        }}>
          {reviews.map((review) => (
            <figure className={`guest-review${review.highlight ? ' guest-review--lime' : ''}`} key={review.name}>
              <div className="guest-review__top">
                <div className="guest-review__stars" role="img" aria-label="Демонстрационная оценка: 5 из 5">
                  {Array.from({ length: 5 }, (_, index) => <Star key={index} size={18} weight="fill" aria-hidden="true" />)}
                </div>
                <Quotes size={30} weight="fill" aria-hidden="true" />
              </div>
              <blockquote><p>{review.quote}</p></blockquote>
              <figcaption>
                <span className="guest-review__avatar"><UserCircle size={29} weight="light" aria-hidden="true" /></span>
                <div><strong>{review.name}</strong><span>{review.occasion}</span></div>
              </figcaption>
            </figure>
          ))}
        </div>
        <div className="guest-reviews__controls">
          <span aria-live="polite" aria-atomic="true">{active + 1} / {reviews.length}</span>
          <div>
            <button type="button" aria-label="Предыдущий отзыв" aria-controls="guest-reviews-slider" disabled={active === 0} onClick={() => goTo(active - 1)}><ArrowLeft size={21} aria-hidden="true" /></button>
            <button type="button" aria-label="Следующий отзыв" aria-controls="guest-reviews-slider" disabled={active === reviews.length - 1} onClick={() => goTo(active + 1)}><ArrowRight size={21} aria-hidden="true" /></button>
          </div>
        </div>
        <div className="guest-reviews__bottom">
          <a href="#contact">Создадим вашу встречу <span><ArrowUpRight size={20} aria-hidden="true" /></span></a>
        </div>
      </div>
    </section>
  )
}

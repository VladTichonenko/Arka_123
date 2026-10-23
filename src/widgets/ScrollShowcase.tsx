import { useEffect, useRef, useState } from 'react'
import { ArrowLeft, ArrowRight, ArrowUpRight } from '@phosphor-icons/react'

const formats = [
  {
    title: 'Мастер-класс',
    headline: ['Показать.', 'Попробовать.'],
    description: 'Для практических занятий за столами. Обсудите рабочие места и материалы под вашу программу.',
    cta: 'Организовать мастер-класс',
    image: '/images/formats/workshop-arina.webp',
    alt: 'Концептуальная ИИ-сцена: Арина и участница мастер-класса с керамикой в зале АРКА 123',
  },
  {
    title: 'Семинар',
    headline: ['Выступление.', 'Затем — вопросы.'],
    description: 'Запланируйте доклад и обсуждение. Число слушателей, рассадку и технику уточните заранее.',
    cta: 'Провести семинар',
    image: '/images/formats/seminar-arina.webp',
    alt: 'Концептуальная ИИ-сцена: Арина проводит семинар у флипчарта в зале АРКА 123',
  },
  {
    title: 'Презентация',
    headline: ['Покажите проект.', 'Обсудите детали.'],
    description: 'Представьте продукт или проект. При выборе расстановки учтите экран, место ведущего и обзор для гостей.',
    cta: 'Обсудить презентацию',
    image: '/images/formats/presentation-arina.webp',
    alt: 'Концептуальная ИИ-сцена: Арина с микрофоном у сиреневой трибуны в зале АРКА 123',
  },
  {
    title: 'Командная встреча',
    headline: ['Работа вместе.', 'Вне офиса.'],
    description: 'Для обсуждения задач и работы в группах. Укажите, нужен ли общий стол или отдельные рабочие зоны.',
    cta: 'Собрать команду',
    image: '/images/formats/team-arina.webp',
    alt: 'Концептуальная ИИ-сцена: Арина обсуждает идеи с командой за столом в зале АРКА 123',
  },
  {
    title: 'Камерное событие',
    headline: ['Небольшой круг.', 'Живой разговор.'],
    description: 'Для встреч клуба и небольших дискуссий. Число гостей, длительность и условия проведения обсудите до аренды.',
    cta: 'Запланировать встречу',
    image: '/images/formats/gathering-arina.webp',
    alt: 'Концептуальная ИИ-сцена: Арина и гости с чашками за разговором в зале АРКА 123',
  },
]

export function ScrollShowcase() {
  const sectionRef = useRef<HTMLElement>(null)
  const viewportRef = useRef<HTMLDivElement>(null)
  const trackRef = useRef<HTMLDivElement>(null)
  const [offset, setOffset] = useState(0)
  const [active, setActive] = useState(0)

  useEffect(() => {
    let frame = 0

    const update = () => {
      frame = 0
      const section = sectionRef.current
      const track = trackRef.current
      const viewport = viewportRef.current
      if (!section || !track || !viewport) return
      const isMobile = window.matchMedia('(max-width: 760px)').matches
      if (isMobile) {
        const positions = Array.from(track.children, (card) => Math.abs((card as HTMLElement).offsetLeft - viewport.scrollLeft - 18))
        setActive(positions.indexOf(Math.min(...positions)))
        setOffset(0)
        return
      }

      const sticky = section.querySelector<HTMLElement>('.showcase-sticky')
      const stickyTop = sticky ? parseFloat(getComputedStyle(sticky).top) || 0 : 0
      const sectionTop = section.getBoundingClientRect().top + window.scrollY - stickyTop
      const travel = Math.max(1, section.offsetHeight - (sticky?.offsetHeight ?? window.innerHeight))
      const progress = Math.min(1, Math.max(0, (window.scrollY - sectionTop) / travel))
      const maxOffset = Math.max(0, track.scrollWidth - (viewportRef.current?.clientWidth ?? window.innerWidth))
      setOffset(progress * maxOffset)
      setActive(Math.round(progress * (formats.length - 1)))
    }

    const scheduleUpdate = () => {
      if (!frame) frame = window.requestAnimationFrame(update)
    }

    update()
    window.addEventListener('scroll', scheduleUpdate, { passive: true })
    window.addEventListener('resize', scheduleUpdate)
    return () => {
      window.removeEventListener('scroll', scheduleUpdate)
      window.removeEventListener('resize', scheduleUpdate)
      if (frame) window.cancelAnimationFrame(frame)
    }
  }, [])

  const goTo = (index: number) => {
    const next = Math.max(0, Math.min(formats.length - 1, index))
    const section = sectionRef.current
    const viewport = viewportRef.current
    const card = trackRef.current?.children[next] as HTMLElement | undefined

    const behavior = window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'instant' : 'smooth'
    if (window.matchMedia('(max-width: 760px)').matches) {
      if (card && viewport) viewport.scrollTo({ left: card.offsetLeft - 18, behavior })
    } else if (section) {
      const sticky = section.querySelector<HTMLElement>('.showcase-sticky')
      const stickyTop = sticky ? parseFloat(getComputedStyle(sticky).top) || 0 : 0
      const sectionTop = section.getBoundingClientRect().top + window.scrollY - stickyTop
      const travel = section.offsetHeight - (sticky?.offsetHeight ?? window.innerHeight)
      window.scrollTo({ top: sectionTop + (travel * next) / (formats.length - 1), behavior })
    }
    setActive(next)
  }

  const onMobileScroll = () => {
    const viewport = viewportRef.current
    const cards = trackRef.current?.children
    if (!viewport || !cards || !window.matchMedia('(max-width: 760px)').matches) return
    const positions = Array.from(cards, (card) => Math.abs((card as HTMLElement).offsetLeft - viewport.scrollLeft - 18))
    setActive(positions.indexOf(Math.min(...positions)))
  }

  return (
    <section className="showcase-scroll" id="formats" ref={sectionRef} aria-labelledby="formats-title" aria-roledescription="карусель">
      <div className="showcase-sticky">
        <div className="container showcase-head">
          <div>
            <span className="section-kicker">Форматы событий</span>
            <h2 id="formats-title">Как использовать<br />{' '}<em>пространство.</em></h2>
          </div>
          <div className="showcase-intro"><p>Пять сценариев аренды. Выберите формат и обсудите расстановку под вашу программу.</p></div>
        </div>
        <div className="showcase-viewport" ref={viewportRef} onScroll={onMobileScroll} tabIndex={0} aria-label="Форматы событий: используйте стрелки для перелистывания" onKeyDown={(event) => {
          if (event.target !== event.currentTarget) return
          if (event.key === 'ArrowRight' || event.key === 'ArrowLeft') {
            event.preventDefault()
            goTo(active + (event.key === 'ArrowRight' ? 1 : -1))
          }
        }}>
          <div className="showcase-track" ref={trackRef} style={{ transform: `translate3d(${-offset}px, 0, 0)` }}>
            {formats.map((format, index) => (
              <article className={`format-card ${active === index ? 'format-card--active' : ''}`} key={format.title} aria-label={format.title}>
                <div className="format-card__top">
                  <span className="format-card__badge">{format.title}</span>
                </div>
                <div className="format-card__visual">
                  <img src={format.image} alt={format.alt} width={1536} height={1024} loading="lazy" />
                </div>
                <div className="format-card__bottom">
                  <h3>{format.headline.map((line) => <span key={line}>{line}</span>)}</h3>
                  <p>{format.description}</p>
                  <a href="#contact" className="format-card__link" aria-label={`Обсудить формат: ${format.title}`} onFocus={() => {
                    if (active !== index) goTo(index)
                  }}>
                    <span>{format.cta}</span><span className="format-card__arrow"><ArrowUpRight size={19} aria-hidden="true" /></span>
                  </a>
                </div>
              </article>
            ))}
          </div>
        </div>
        <div className="container showcase-controls">
          <span className="showcase-status" aria-live="polite" aria-atomic="true">{formats[active].title}</span>
          <div className="showcase-progress" aria-hidden="true"><span style={{ width: `${((active + 1) / formats.length) * 100}%` }} /></div>
          <div className="showcase-buttons">
            <button type="button" aria-label="Предыдущий формат" onClick={() => goTo(active - 1)} disabled={active === 0}><ArrowLeft size={23} /></button>
            <button type="button" aria-label="Следующий формат" onClick={() => goTo(active + 1)} disabled={active === formats.length - 1}><ArrowRight size={23} /></button>
          </div>
        </div>
      </div>
    </section>
  )
}

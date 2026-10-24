import { useEffect, useRef, useState } from 'react'
import { ArrowDown, ArrowUpRight, MouseSimple } from '@phosphor-icons/react'
import { createScrollVideo } from '../shared/lib/scroll-video'
import type { ScrollVideoStatus } from '../shared/lib/scroll-video'
import './arina-scroll-story.css'

const ORBIT_VIDEO = import.meta.env.VITE_ARINA_ORBIT_VIDEO_URL?.trim() || '/videos/arina-orbit-wide.mp4'
const POSTER = '/images/arina-scroll/orbit-poster.webp'

const chapters = [
  { label: 'Зал', heading: 'Начнём с общего вида', text: 'Я Арина, ваш гид по АРКЕ. Осмотритесь: паркет, колонны и высокие окна. Для выбора расстановки важно увидеть зал с разных сторон.', fact: '123 м²', detail: 'площадь пространства для занятий и встреч', link: '#gallery', cta: 'Настоящие фото зала' },
  { label: 'Окна', heading: 'Посмотрите к окнам', text: 'Арочные окна — главная особенность зала. Они пропускают дневной свет и открывают вид на Национальную библиотеку.', fact: '4 × 3,5 м', detail: 'размер больших арочных окон', link: '#virtual-tour', cta: 'Осмотреть зал на 360°' },
  { label: 'Расстановка', heading: 'Как пройдёт ваша встреча?', text: 'Для семинара важен обзор ведущего, для мастер-класса — рабочие места. Укажите число участников и нужную технику: эти детали уточняются до аренды.', fact: 'Под ваш формат', detail: 'вместимость и расстановку нужно согласовать', link: '#contact', cta: 'Обсудить расстановку' },
]
const clamp = (value: number) => Math.max(0, Math.min(1, value))

export function ArinaScrollStory() {
  const sectionRef = useRef<HTMLElement>(null)
  const stageRef = useRef<HTMLDivElement>(null)
  const videoRef = useRef<HTMLVideoElement>(null)
  const progressRef = useRef(0)
  const scrubberRef = useRef<ReturnType<typeof createScrollVideo> | null>(null)
  const [active, setActive] = useState(0)
  const [loadVideo, setLoadVideo] = useState(false)
  const [videoStatus, setVideoStatus] = useState<ScrollVideoStatus>('loading')
  const [reduced, setReduced] = useState(false)
  const [shortViewport, setShortViewport] = useState(false)
  const [inView, setInView] = useState(false)
  const canAnimate = Boolean(ORBIT_VIDEO) && !reduced && !shortViewport

  useEffect(() => {
    const video = videoRef.current
    if (!video || !canAnimate || !loadVideo) return
    const scrubber = createScrollVideo(video, () => progressRef.current, setVideoStatus)
    scrubberRef.current = scrubber
    return () => { scrubber.destroy(); scrubberRef.current = null }
  }, [canAnimate, loadVideo])

  useEffect(() => {
    const stage = stageRef.current
    if (!stage) return
    const observer = new IntersectionObserver(([entry]) => setInView(entry.isIntersecting), { threshold: .35 })
    observer.observe(stage)
    return () => observer.disconnect()
  }, [])

  useEffect(() => {
    const media = window.matchMedia('(prefers-reduced-motion: reduce)')
    const short = window.matchMedia('(max-height: 500px)')
    const sync = () => { setReduced(media.matches); setShortViewport(short.matches) }
    sync()
    media.addEventListener('change', sync)
    short.addEventListener('change', sync)
    return () => { media.removeEventListener('change', sync); short.removeEventListener('change', sync) }
  }, [])

  useEffect(() => {
    const section = sectionRef.current
    if (!section || !canAnimate) return
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) { setLoadVideo(true); observer.disconnect() }
    }, { rootMargin: '800px' })
    observer.observe(section)
    return () => observer.disconnect()
  }, [canAnimate])

  useEffect(() => {
    const section = sectionRef.current
    const stage = stageRef.current
    if (!section || !stage) return
    let frame = 0
    let visible = false

    const update = () => {
      frame = 0
      if (!canAnimate) {
        stage.style.setProperty('--orbit-title-opacity', '1')
        return
      }
      const top = parseFloat(getComputedStyle(stage).top) || 0
      const progress = clamp((top - section.getBoundingClientRect().top) / Math.max(1, section.offsetHeight - stage.offsetHeight))
      progressRef.current = progress
      setActive(Math.min(2, Math.floor(progress * 3)))
      stage.style.setProperty('--orbit-progress', String(progress))
      stage.style.setProperty('--orbit-title-opacity', String(clamp(1 - progress / .18)))
      scrubberRef.current?.sync()
    }
    const schedule = () => { if (!frame) frame = requestAnimationFrame(update) }
    const scroll = () => { if (visible) schedule() }
    const observer = new IntersectionObserver(([entry]) => { visible = entry.isIntersecting; if (visible) schedule() }, { rootMargin: '100px' })
    observer.observe(section)
    const resize = new ResizeObserver(schedule)
    resize.observe(stage)
    window.addEventListener('scroll', scroll, { passive: true })
    window.addEventListener('resize', schedule)
    window.addEventListener('pageshow', schedule)
    document.addEventListener('visibilitychange', schedule)
    update()
    return () => {
      observer.disconnect()
      resize.disconnect()
      window.removeEventListener('scroll', scroll)
      window.removeEventListener('resize', schedule)
      window.removeEventListener('pageshow', schedule)
      document.removeEventListener('visibilitychange', schedule)
      cancelAnimationFrame(frame)
    }
  }, [canAnimate, loadVideo])

  const goTo = (index: number) => {
    const section = sectionRef.current
    const stage = stageRef.current
    if (!section || !stage) return
    if (!canAnimate) { setActive(index); return }
    const top = parseFloat(getComputedStyle(stage).top) || 0
    const start = window.scrollY + section.getBoundingClientRect().top - top
    const distance = section.offsetHeight - stage.offsetHeight
    window.scrollTo({ top: start + distance * (index + .15) / 3, behavior: reduced ? 'instant' : 'smooth' })
  }

  const chapter = chapters[active]
  return (
    <section className={`arina-orbit ${canAnimate ? 'arina-orbit--animated' : ''} ${inView ? 'arina-orbit--in-view' : ''}`} id="arina-story" ref={sectionRef} aria-labelledby="arina-orbit-title">
      <div className="arina-orbit__stage" ref={stageRef}>
        <img className="arina-orbit__poster" src={POSTER} alt="Арина в чёрном жакете с брошью 123 стоит в центре светлого зала АРКА 123" width={1672} height={941} loading="lazy" />
        {canAnimate && <video className={`arina-orbit__video ${videoStatus === 'ready' || videoStatus === 'stalled' ? 'is-ready' : ''}`} ref={videoRef} src={loadVideo ? ORBIT_VIDEO : undefined} poster={POSTER} muted playsInline preload="auto" disablePictureInPicture aria-hidden="true" />}

        {canAnimate && loadVideo && videoStatus !== 'ready' && <div className="arina-orbit__video-status">
          <span role="status">{videoStatus === 'error' ? 'Не удалось загрузить анимацию.' : videoStatus === 'stalled' ? 'Анимация загружается дольше обычного.' : 'Загружаем анимацию…'}</span>
          {(videoStatus === 'stalled' || videoStatus === 'error') && <button type="button" onClick={() => scrubberRef.current?.retry()}>Повторить загрузку</button>}
        </div>}

        <div className="arina-orbit__top"><span>АРКА 123 <span>/</span> ОСМОТР ПРОСТРАНСТВА</span><a href="#experience">К планированию встречи <ArrowDown size={15} aria-hidden="true" /></a></div>

        <div className="arina-orbit__cards">
        <aside className="arina-orbit__story-card" aria-label="Рассказ Арины">
          <div className="arina-orbit__host"><img src="/images/arina-arka-123.jpg" alt="" width={36} height={36} /><span><strong>Арина</strong><span>Показываю зал и детали</span></span><span className="arina-orbit__chapter-number">0{active + 1}</span></div>
          <h3>{chapter.heading}</h3><p>{chapter.text}</p>
        </aside>

        <h2 id="arina-orbit-title" className="arina-orbit__title">Пространство<br />для ваших встреч.</h2>

        <aside className="arina-orbit__fact-card" aria-label="О пространстве"><span className="arina-orbit__card-kicker">ДЛЯ ВАШЕГО СОБЫТИЯ</span><strong>{chapter.fact}</strong><p>{chapter.detail}</p><a href={chapter.link}>{chapter.cta}<ArrowUpRight size={18} aria-hidden="true" /></a></aside>
        </div>

        <div className="arina-orbit__bottom">
          <nav aria-label="Главы рассказа Арины">{chapters.map((item, index) => <button type="button" key={item.label} aria-label={`Глава ${index + 1}: ${item.label}`} aria-current={active === index ? 'step' : undefined} onClick={() => goTo(index)}>0{index + 1}<span>{item.label}</span></button>)}</nav>
          {canAnimate && <div className="arina-orbit__scroll-hint"><MouseSimple size={18} aria-hidden="true" /><span>Листайте, чтобы осмотреться</span></div>}
          <span className="arina-orbit__scene-note">Сцена с ИИ · Арина — фирменный персонаж</span>
        </div>
        {canAnimate && <div className="arina-orbit__progress" aria-hidden="true"><span /></div>}
      </div>
    </section>
  )
}

import { useEffect, useRef, useState } from 'react'
import { createPortal } from 'react-dom'
import { Link } from 'react-router-dom'
import { ArrowUpRight, List, X } from '@phosphor-icons/react'
import { ArkaMark } from '../shared/ui/ArkaMark'
import './mobile-navigation.css'

const navigation = [
  { href: '#about', label: 'Об АРКЕ' },
  { href: '#arina-story', label: 'Пространство' },
  { href: '#formats', label: 'Форматы' },
  { href: '#gallery', label: 'Галерея' },
  { href: '#pricing', label: 'Цены' },
]
type MenuPhase = 'closed' | 'opening' | 'open' | 'closing'

export function SiteHeader() {
  const [animationKey, setAnimationKey] = useState(0)
  const [menuPhase, setMenuPhase] = useState<MenuPhase>('closed')
  const menuOpen = menuPhase !== 'closed'
  const menuRef = useRef<HTMLDialogElement>(null)
  const menuButtonRef = useRef<HTMLButtonElement>(null)
  const closeButtonRef = useRef<HTMLButtonElement>(null)
  const navigationAfterClose = useRef<string | null>(null)

  useEffect(() => {
    if (!menuOpen) return
    const mobile = window.matchMedia('(max-width: 900px)')
    const dialog = menuRef.current
    const menuButton = menuButtonRef.current
    if (!mobile.matches || !dialog) {
      setMenuPhase('closed')
      return
    }
    const previousOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    dialog.showModal()
    closeButtonRef.current?.focus({ preventScroll: true })
    let frame = requestAnimationFrame(() => {
      frame = requestAnimationFrame(() => setMenuPhase(current => current === 'opening' ? 'open' : current))
    })
    const onResize = () => { if (!mobile.matches) setMenuPhase('closed') }
    mobile.addEventListener('change', onResize)
    return () => {
      cancelAnimationFrame(frame)
      dialog.close()
      document.body.style.overflow = previousOverflow
      mobile.removeEventListener('change', onResize)
      if (mobile.matches) menuButton?.focus({ preventScroll: true })
      const href = navigationAfterClose.current
      navigationAfterClose.current = null
      if (href) {
        if (window.location.hash !== href) window.location.hash = href
        else document.getElementById(href.slice(1))?.scrollIntoView({ behavior: window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth' })
      }
    }
  }, [menuOpen])

  useEffect(() => {
    if (menuPhase !== 'closing') return
    // Also release the dialog if motion is disabled or a transition is interrupted.
    const timer = window.setTimeout(() => setMenuPhase('closed'), window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 0 : 400)
    return () => window.clearTimeout(timer)
  }, [menuPhase])

  const closeMenu = (href?: string) => {
    if (menuPhase === 'closing') return
    navigationAfterClose.current = href ?? null
    setMenuPhase(menuPhase === 'opening' ? 'closed' : 'closing')
  }

  const goHome = () => {
    setAnimationKey((current) => current + 1)
    setMenuPhase('closed')
    window.scrollTo({ top: 0, behavior: window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth' })
  }

  return (
    <>
    <header className="site-header">
      <div className="container header-inner">
        <Link className="brand" to="/" aria-label="Арка 123 — главная" onClick={goHome}>
          <span className={`brand-lockup ${animationKey > 0 ? 'brand-lockup--animated' : ''}`} key={animationKey}>
            <ArkaMark animated={animationKey > 0} className="brand-mark" />
            <span className="brand-wordmark">АРКА <strong>123</strong></span>
          </span>
        </Link>
        <nav className="header-nav" aria-label="Основная навигация">
          {navigation.map((item) => <a href={item.href} key={item.href}>{item.label}</a>)}
        </nav>
        <div className="header-actions">
          <span className="header-location">Минск <span> / </span> напротив Библиотеки</span>
          <a className="header-cta" href="#contact">Контакты <ArrowUpRight size={20} /></a>
        </div>
        <button ref={menuButtonRef} className="header-menu-button" type="button" aria-label="Открыть меню" aria-expanded={menuOpen} aria-controls="mobile-menu" aria-haspopup="dialog" onClick={() => setMenuPhase('opening')}><List size={28} aria-hidden="true" /></button>
      </div>
    </header>
    {createPortal(
      <dialog className={`mobile-menu${menuPhase === 'open' ? ' mobile-menu--visible' : ''}${menuPhase === 'closing' ? ' mobile-menu--closing' : ''}`} id="mobile-menu" ref={menuRef} aria-labelledby="mobile-menu-title" onCancel={(event) => { event.preventDefault(); closeMenu() }} onClick={(event) => { if (event.target === event.currentTarget) closeMenu() }}>
        <div className="mobile-menu__panel" onTransitionEnd={(event) => { if (event.target === event.currentTarget && event.propertyName === 'transform' && menuPhase === 'closing') setMenuPhase('closed') }}>
          <div className="mobile-menu__header">
            <span className="mobile-menu__brand" id="mobile-menu-title"><ArkaMark className="mobile-menu__mark" />АРКА 123</span>
            <button ref={closeButtonRef} className="mobile-menu__close" type="button" aria-label="Закрыть меню" onClick={() => closeMenu()}><X size={24} aria-hidden="true" /></button>
          </div>
          <nav className="mobile-menu__navigation" aria-label="Мобильная навигация">
            {navigation.map((item) => <a href={item.href} key={item.href} onClick={(event) => { event.preventDefault(); closeMenu(item.href) }}>{item.label}<ArrowUpRight size={22} aria-hidden="true" /></a>)}
          </nav>
          <div className="mobile-menu__details">
            <a className="mobile-menu__cta" href="#contact" onClick={(event) => { event.preventDefault(); closeMenu('#contact') }}>Обсудить аренду<ArrowUpRight size={21} aria-hidden="true" /></a>
            <address className="mobile-menu__contacts">
              <a href="tel:+375336867911">+375 33 686-79-11</a>
              <a href="mailto:vlad6867911@gmail.com">vlad6867911@gmail.com</a>
              <span>Минск, Петра Мстиславца, 10<br />Напротив Национальной библиотеки</span>
            </address>
          </div>
        </div>
      </dialog>, document.body,
    )}
    </>
  )
}

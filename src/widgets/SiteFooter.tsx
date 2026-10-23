import { useState } from 'react'
import { ArrowUpRight, EnvelopeSimple, Phone } from '@phosphor-icons/react'
import { ArkaMark } from '../shared/ui/ArkaMark'
import { ContactForm } from './ContactForm'
import { VirtualTour } from './VirtualTour'

export function SiteFooter() {
  const [tourOpen, setTourOpen] = useState(false)

  return (
    <footer className="site-footer site-footer--light" id="contact">
      <ContactForm onOpenTour={() => setTourOpen(true)} />
      {tourOpen && <VirtualTour onClose={() => setTourOpen(false)} />}
      <div className="footer-drawer">
      <div className="container footer-information">
        <a className="footer-signature" href="#about" aria-label="АРКА 123 — о пространстве"><ArkaMark className="footer-signature__mark" /><span>АРКА 123</span></a>
        <div className="footer-invitation">
          <p>Зал для занятий.<br /><span>Место для встреч.</span></p>
          <a href="#contact">Обсудить аренду зала <ArrowUpRight size={18} aria-hidden="true" /></a>
          <address className="footer-contacts" aria-label="Контакты для аренды">
            <a href="tel:+375336867911"><Phone size={18} aria-hidden="true" /><span>+375 33 686-79-11</span></a>
            <a href="mailto:vlad6867911@gmail.com"><EnvelopeSimple size={18} aria-hidden="true" /><span>vlad6867911@gmail.com</span></a>
          </address>
        </div>
        <div className="footer-address"><span className="footer-information__label">ВСТРЕЧАЕМСЯ В МИНСКЕ</span><address>ул. Петра Мстиславца, 10<br /><span>Напротив Национальной<br />библиотеки</span></address><a href="https://www.google.com/maps/search/?api=1&query=Минск+Петра+Мстиславца+10" target="_blank" rel="noreferrer">Проложить маршрут <ArrowUpRight size={14} aria-hidden="true" /></a></div>
        <nav className="footer-navigation" aria-label="Навигация в футере"><span className="footer-information__label">АРКА 123</span><a href="#about">О пространстве</a><a href="#formats">Форматы событий</a><a href="#gallery">Галерея</a><a href="#pricing">Стоимость аренды</a><a href="#virtual-tour" onClick={(event) => { event.preventDefault(); setTourOpen(true) }}>Обзор зала 360°</a><a href="#google-rating">Адрес и здание</a></nav>
      </div>
      <div className="container footer-legal"><span>© 2026 АРКА 123</span><span>Аренда зала для мастер-классов, семинаров и встреч</span><a href="#top" onClick={(event) => { event.preventDefault(); window.scrollTo({ top: 0, behavior: window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth' }) }}>Наверх ↑</a></div>
      <div className="footer-marquee">
        <p className="footer-marquee__accessible">АРКА 123 — место для ваших идей</p>
        <div className="footer-marquee__track" aria-hidden="true">{[0, 1].map((copy) => <span className="footer-marquee__group" key={copy}>АРКА 123 — МЕСТО ДЛЯ ВАШИХ ИДЕЙ.</span>)}</div>
      </div>
      </div>
    </footer>
  )
}

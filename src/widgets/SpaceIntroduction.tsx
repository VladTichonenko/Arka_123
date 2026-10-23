import { ArrowUpRight, Check } from '@phosphor-icons/react'
import './space-introduction.css'

function PhotoBenefit({ title, description }: { title: string; description: string }) {
  return (
    <span className="space-photo-benefit">
      <span className="space-photo-benefit__icon"><Check size={18} weight="bold" aria-hidden="true" /></span>
      <span className="space-photo-benefit__copy"><strong>{title}</strong><span>{description}</span></span>
    </span>
  )
}

export function SpaceIntroduction() {
  return (
    <section className="space-introduction" id="our-space" aria-labelledby="our-space-title">
      <div className="container space-introduction__layout">
        <div className="space-introduction__copy">
          <span className="section-kicker">О пространстве</span>
          <h2 id="our-space-title">Арочные окна. Открытый зал.</h2>
          <p>АРКА 123 находится на <mark className="space-introduction__highlight">Петра Мстиславца, 10</mark>. В названии — площадь зала и его архитектура: большие арочные окна внутри и арка, соединяющая два высоких дома снаружи.</p>
          <p>Паркет, потолки высотой до 4,5 м и дневной свет задают характер интерьера. Основная зона подходит для разных сценариев; при планировании расстановки важно учитывать колонны и проходы.</p>
          <a className="space-introduction__cta" href="#contact">
            Обсудить аренду
            <span><ArrowUpRight size={21} aria-hidden="true" /></span>
          </a>
        </div>
        <figure className="space-introduction__image space-introduction__image--window">
          <img src="/images/space/room-arches.webp" alt="Дневной свет и вид на Национальную библиотеку через арочное окно АРКИ 123" width={941} height={1672} loading="lazy" />
        </figure>
        <figure className="space-introduction__image space-introduction__image--room">
          <img src="/images/space/room-main.webp" alt="Открытый зал АРКА 123 с двумя арочными окнами, тёплым паркетом и высокими потолками" width={1600} height={900} loading="lazy" />
          <figcaption className="space-introduction__benefits">
            <PhotoBenefit title="123 м² площади зала" description="Для занятий и встреч" />
            <PhotoBenefit title="Окна 4 × 3,5 м" description="Естественное дневное освещение" />
            <PhotoBenefit title="Вид на Библиотеку" description="Минск, Петра Мстиславца, 10" />
          </figcaption>
        </figure>
      </div>
    </section>
  )
}

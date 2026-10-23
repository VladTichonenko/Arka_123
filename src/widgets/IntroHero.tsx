import { ArrowRight, Check } from '@phosphor-icons/react'
import './intro-hero.css'

export function IntroHero() {
  return (
    <section className="campaign-hero" aria-labelledby="home-title">
      <div className="campaign-hero__inner">
        <div className="campaign-hero__copy">
          <h1 id="home-title">Зал в аренду<br />напротив<br />Библиотеки.</h1>
          <p>123 м² в Минске для мастер-классов, семинаров и встреч. Арочные окна 4 × 3,5 м, дневной свет и вид на Национальную библиотеку.</p>
          <a className="campaign-hero__button" href="#formats">
            Выбрать формат
            <span><ArrowRight size={15} weight="bold" aria-hidden="true" /></span>
          </a>
        </div>
        <div className="campaign-hero__visual">
          <a className="campaign-hero__photo" href="#gallery" aria-label="Посмотреть фотографии пространства АРКА 123">
            <img src="/images/space/room-light.webp" alt="Светлый зал АРКА 123 с арочными окнами и паркетом" width="941" height="1672" fetchPriority="high" />
          </a>
          <div className="campaign-hero__area">
            <div><span>Пространство</span><span className="campaign-hero__city">Минск</span></div>
            <strong>123 м²</strong>
          </div>
          <a className="campaign-hero__location" href="#contact">
            <span><Check size={12} weight="bold" aria-hidden="true" /></span>
            Напротив Национальной библиотеки
          </a>
        </div>
      </div>
    </section>
  )
}

import { ArrowUpRight, MapPin, Sparkle } from '@phosphor-icons/react'

const occasions = ['Мастер-классы', 'Семинары', 'Презентации', 'Командные встречи', 'Камерные события']

export function SpaceExperience() {
  return (
    <section className="experience-section" id="experience" aria-labelledby="experience-title">
      <div className="container">
        <div className="experience-heading">
          <span className="experience-eyebrow">ЗНАКОМСТВО С АРКОЙ 123</span>
          <h2 id="experience-title">От общего вида<br /><span>к вашей расстановке.</span></h2>
          <p>Для занятия нужны рабочие места, для семинара — обзор выступающего. Начните с программы и числа участников.</p>
        </div>

        <div className="experience-intro">
          <div className="experience-portrait">
            <img src="/images/arina/portrait-blue.webp" alt="Арина, представительница АРКИ 123, в чёрном жакете с фирменной брошью" width={1000} height={1250} loading="lazy" />
            <div className="experience-person">
              <img src="/images/arina-arka-123.jpg" alt="" width={44} height={44} />
              <div><strong>Арина — ваш гид</strong><span>Знакомит с залом и форматами</span></div>
              <span className="experience-person__mark"><Sparkle size={19} aria-hidden="true" /></span>
            </div>
          </div>

          <div className="experience-welcome" id="arina-welcome">
            <img className="experience-welcome__photo" src="/images/arina/welcome-space.webp" alt="Концептуальная сцена: Арина знакомит гостью со светлым пространством с арочными окнами" width={1500} height={1000} loading="lazy" />
            <div className="experience-plan">
              <span className="experience-plan__eyebrow">ПЛАНИРУЕМ ВСТРЕЧУ</span>
              <h3>Дата. Гости.<br />Программа.</h3>
              <div className="experience-plan__facts"><div><strong>123</strong><span>м² — площадь зала</span></div><div><strong>5</strong><span>сценариев для примера</span></div></div>
              <div className="experience-plan__location"><MapPin size={15} aria-hidden="true" /><span>Минск · напротив Библиотеки</span></div>
              <a href="#contact">Обсудить расстановку <ArrowUpRight size={18} aria-hidden="true" /></a>
            </div>
            <span className="experience-welcome__caption">Пример встречи в интерьере АРКИ</span>
          </div>
        </div>

        <div className="experience-occasions" aria-label="Форматы событий">
          <span>Выберите сценарий для вашего зала</span>
          <div>{occasions.map((occasion) => <a key={occasion} href="#formats">{occasion}</a>)}</div>
        </div>
      </div>
    </section>
  )
}

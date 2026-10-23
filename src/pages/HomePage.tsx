import { ArrowUpRight, CalendarBlank, Check, Clock, Plus, Sun } from '@phosphor-icons/react'
import { SpaceExperience } from '../widgets/SpaceExperience'
import { GoogleRatingMap } from '../widgets/GoogleRatingMap'
import { ScrollShowcase } from '../widgets/ScrollShowcase'
import { PhotoGallery } from '../widgets/PhotoGallery'
import { SpaceAdvantages } from '../widgets/SpaceAdvantages'
import { ArinaScrollStory } from '../widgets/ArinaScrollStory'
import { IntroHero } from '../widgets/IntroHero'
import { SpaceIntroduction } from '../widgets/SpaceIntroduction'
import { GuestReviews } from '../widgets/GuestReviews'

const services = [
  {
    number: '01', title: 'Время аренды',
    description: 'Укажите дату и продолжительность. Учтите время на подготовку, встречу гостей и завершение мероприятия.',
    details: 'Продумайте весь день встречи: от первого приезда организатора до выхода последнего гостя. Так будет проще выбрать подходящую продолжительность аренды.',
    checklist: [
      'Укажите желаемую дату, время начала и окончания мероприятия.',
      'Добавьте время на расстановку, подготовку материалов и проверку техники, а также на сбор вещей после встречи.',
      'До бронирования уточните доступность даты, порядок оплаты, условия переноса и отмены, а также возможность продления.',
    ],
  },
  {
    number: '02', title: 'Расстановка',
    description: 'Расскажите о числе участников и программе: нужны ли рабочие столы, общий стол или места для слушателей.',
    details: 'Расстановка зависит от того, как будет проходить встреча. Для практики важна рабочая поверхность, для выступления — хороший обзор, для обсуждения — возможность видеть друг друга.',
    checklist: [
      'Сообщите число гостей, ведущих и организаторов, а также основные этапы программы.',
      'Опишите желаемый вариант: места для слушателей, общий стол или отдельные рабочие группы. Возможность такой расстановки нужно согласовать.',
      'Уточните размеры и количество мебели, расположение колонн и проходов, а также кто и когда подготовит зал.',
    ],
  },
  {
    number: '03', title: 'Оснащение',
    description: 'Перечислите нужную мебель и технику. Их наличие, состав аренды и возможные доплаты уточняются до бронирования.',
    details: 'Составьте список всего, что понадобится для вашей программы. Наличие оборудования и мебели, их характеристики и стоимость согласуются отдельно перед арендой.',
    checklist: [
      'Перечислите нужную мебель и технику: например, столы, стулья, экран, проектор или звук. Это список пожеланий, а не перечень оборудования зала.',
      'Если привозите свою технику, уточните подключение, расположение розеток и время на проверку совместимости.',
      'Согласуйте, что входит в стоимость, какие позиции потребуют доплаты и что необходимо привезти самостоятельно.',
    ],
  },
]

const tariffs = [
  { title: 'На час', duration: 'Для короткого занятия или рабочей встречи.', price: '120', unit: '/ час', detail: 'От 2 часов · минимум от 240 BYN', period: 'Почасовая аренда', icon: Clock, featured: false, features: ['Консультация или небольшое занятие', 'Один блок программы', 'Продолжительность от двух часов', '123 м² площади зала'] },
  { title: 'Полдня', duration: 'Для мастер-класса с практикой или семинара.', price: '420', unit: '/ 4 часа', detail: 'Четыре часа аренды', period: 'Аренда на 4 часа', icon: Sun, featured: true, features: ['Практическое занятие', 'Выступление и обсуждение', 'Командная рабочая сессия', '123 м² площади зала'] },
  { title: 'Весь день', duration: 'Для программы из нескольких занятий или встреч.', price: '760', unit: '/ 8 часов', detail: 'Восемь часов аренды', period: 'Аренда на 8 часов', icon: CalendarBlank, featured: false, features: ['Несколько блоков программы', 'Серия занятий или презентаций', 'Длительная встреча команды', '123 м² площади зала'] },
]

export function HomePage() {
  return (
    <>
      <IntroHero />

      <section className="intro-about" id="about" aria-labelledby="about-title">
        <div className="intro-about__heading">
          <h2 id="about-title">Что важно знать<br />о вашем будущем зале.</h2>
        </div>
        <div className="intro-cards">
          <a className="intro-card intro-card--photo" href="#formats">
            <img className="intro-card__background" src="/images/space/room-main.webp" alt="Зал АРКА 123 с арочными окнами" loading="lazy" />
            <span className="intro-card__number">01.</span>
            <div className="intro-card__copy"><h3>Для ваших занятий</h3><p>Мастер-классы, семинары,<br />презентации и встречи команды.<br />Выберите сценарий аренды.</p><span className="intro-card__link">Посмотреть форматы</span></div>
            <span className="intro-card__arrow"><ArrowUpRight size={20} /></span>
          </a>
          <a className="intro-card intro-card--lime" href="#arina-story">
            <span className="intro-card__number">02.</span>
            <div className="intro-card__copy"><h3>123 м² в Минске</h3><p>Зал на Петра Мстиславца, 10.<br />В названии — его площадь<br />и архитектура здания.</p><span className="intro-card__link">Познакомиться с залом</span></div>
            <img className="intro-card__building" src="/images/space/building-arch.webp" alt="Арка в здании, где находится пространство" loading="lazy" />
            <span className="intro-card__arrow"><ArrowUpRight size={20} /></span>
          </a>
          <a className="intro-card intro-card--photo" href="#gallery">
            <img className="intro-card__background" src="/images/space/room-windows.webp" alt="Арочные окна и дневной свет в АРКЕ 123" loading="lazy" />
            <span className="intro-card__number">03.</span>
            <div className="intro-card__copy"><h3>Окна 4 × 3,5 м</h3><p>Дневной свет, арочная форма<br />и вид на Национальную библиотеку.<br />Рассмотрите зал на фотографиях.</p><span className="intro-card__link">Посмотреть фотографии</span></div>
            <span className="intro-card__arrow"><ArrowUpRight size={20} /></span>
          </a>
        </div>
      </section>

      <SpaceIntroduction />
      <ArinaScrollStory />
      <SpaceExperience />
      <GoogleRatingMap />

      <ScrollShowcase />
      <SpaceAdvantages />
      <PhotoGallery />

      <section className="services-section" id="services" aria-labelledby="services-title">
        <div className="container">
          <div className="section-heading services-heading">
            <div><span className="section-kicker">Подготовка к аренде</span><h2 id="services-title">Что обсудить<br /><em>перед арендой.</em></h2></div>
            <p>Программа встречи определяет расстановку и оснащение. Согласуйте детали заранее, чтобы зал подходил вашим задачам.</p>
          </div>
          <div className="services-list">
            {services.map((service) => (
              <details className="service-item" key={service.number}>
                <summary className="service-row" aria-labelledby={`service-title-${service.number}`}>
                  <span className="service-row__number" aria-hidden="true">{service.number}</span>
                  <span className="service-row__title" id={`service-title-${service.number}`}>{service.title}</span>
                  <span className="service-row__description">{service.description}</span>
                  <Plus className="service-row__toggle" size={23} aria-hidden="true" />
                </summary>
                <div className="service-details">
                  <p>{service.details}</p>
                  <ul>{service.checklist.map((item) => <li key={item}>{item}</li>)}</ul>
                </div>
              </details>
            ))}
          </div>
        </div>
      </section>

      <section className="pricing-section" id="pricing" aria-labelledby="tariffs-title">
        <div className="container">
          <div className="tariffs-heading"><div><span className="rental-eyebrow">РАЗОВАЯ АРЕНДА</span><h2 id="tariffs-title">Выберите время<br />для вашей встречи.</h2></div><p>Сравните почасовой вариант,<br />четыре или восемь часов в зале.</p></div>
          <div className="tariff-grid" id="tariffs">
            {tariffs.map((tariff, index) => (
              <article className={`rental-card ${tariff.featured ? 'rental-card--featured' : ''}`} key={tariff.title} aria-labelledby={`tariff-title-${index}`}>
                <div className="rental-card__heading">
                  <span className="rental-card__icon"><tariff.icon size={23} weight="regular" aria-hidden="true" /></span>
                  <div><h4 id={`tariff-title-${index}`}>{tariff.title}</h4><span>{tariff.period}</span></div>
                </div>
                <p className="rental-card__description">{tariff.duration}</p>
                <div className="rental-card__features"><span>Формат и условия</span><ul>{tariff.features.map((feature) => <li key={feature}><Check size={14} weight="bold" aria-hidden="true" /><span>{feature}</span></li>)}</ul></div>
                <div className="rental-card__price"><span>от</span><strong>{tariff.price}</strong><span>BYN <small>{tariff.unit}</small></span></div>
                <p className="rental-card__detail">{tariff.detail}</p>
                <a className="rental-card__cta" href="#contact" aria-label={`Обсудить тариф ${tariff.title}`}>Обсудить аренду <ArrowUpRight size={18} aria-hidden="true" /></a>
              </article>
            ))}
          </div>
          <p className="pricing-note">Цены демонстрационные. Доступность даты, состав аренды, мебель и техника, время на подготовку, доплаты, условия оплаты и отмены согласуются до бронирования.</p>
        </div>
      </section>

      <GuestReviews />
    </>
  )
}

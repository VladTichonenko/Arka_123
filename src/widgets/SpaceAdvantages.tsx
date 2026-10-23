import { ArrowUpRight, Bank, CornersOut, MapPin, Sun } from '@phosphor-icons/react'
import './space-advantages.css'

const advantages = [
  { icon: Sun, title: 'Окна 4 × 3,5 м', description: 'Дневной свет и вид\nна Национальную библиотеку.' },
  { icon: Bank, title: 'Потолки до 4,5 м', description: 'Высокий зал с паркетом\nи подвесными светильниками.' },
  { icon: CornersOut, title: '123 м² площади', description: 'Расстановка зависит от программы,\nчисла гостей и проходов.' },
  { icon: MapPin, title: 'Мстиславца, 10', description: 'Здание с большой аркой —\nориентир для ваших гостей.' },
]

export function SpaceAdvantages() {
  return (
    <section className="space-advantages" id="advantages" aria-labelledby="advantages-title">
      <div className="container">
        <div className="space-advantages__heading">
          <h2 id="advantages-title">Характеристики<br /><span>пространства.</span></h2>
          <p>Размеры, свет и архитектура —<br />то, что важно при выборе зала.</p>
        </div>
        <div className="space-advantages__grid">
          {advantages.map(({ icon: Icon, title, description }) => (
            <article className="space-advantage" key={title}>
              <span className="space-advantage__icon"><Icon size={25} weight="regular" aria-hidden="true" /></span>
              <h3>{title}</h3>
              <p>{description}</p>
            </article>
          ))}
        </div>
        <div className="space-plan" id="floor-plan">
          <div className="space-plan__copy">
            <span className="space-plan__eyebrow">ПЛАН ПРОСТРАНСТВА</span>
            <h3>Для встреч,<br />которые запомнятся.</h3>
            <p>Дневной свет, высокие арочные окна и тёплый паркет — в АРКЕ <mark className="space-plan__highlight">приятно быть вместе</mark>. Здесь легко настроиться на творчество, поделиться идеями и провести время с командой. А вид на Национальную библиотеку добавляет встрече особое настроение.</p>
            <a className="space-plan__cta" href="#contact">Обсудить расстановку <span><ArrowUpRight size={18} aria-hidden="true" /></span></a>
          </div>
          <figure className="space-plan__drawing">
            <img src="/images/space/room-plan-concept.webp" alt="Концептуальный вид сверху: открытый зал с окнами и компактной зоной у входа" width="1536" height="1024" loading="lazy" />
            <figcaption><span>Открытая планировка</span><strong>123 м²</strong></figcaption>
          </figure>
          <div className="space-plan__photo">
            <img src="/images/space/room-light.webp" alt="Настоящее фото зала: арочные окна и паркет в дневном свете" width="941" height="1672" loading="lazy" />
            <span>Арочные окна и паркет: настоящий зал.</span>
          </div>
        </div>
      </div>
    </section>
  )
}

import { ArrowUpRight, GoogleLogo, MapPin, NavigationArrow, Star } from '@phosphor-icons/react'
import { GoogleWalk } from './GoogleWalk'
import './google-rating-map.css'

const coordinates = '53.931095,27.650135'
const mapUrl = `https://www.google.com/maps/search/?${new URLSearchParams({ api: '1', query: coordinates })}`
const directionsUrl = `https://www.google.com/maps/dir/?${new URLSearchParams({ api: '1', destination: coordinates })}`

export function GoogleRatingMap() {
  return (
    <section className="rating-map" id="google-rating" aria-labelledby="rating-map-title">
      <div className="container">
        <div className="rating-map__heading">
          <div>
            <span className="section-kicker">АРКА 123 / НА КАРТЕ</span>
            <h2 id="rating-map-title">Найдите здание.<br /><span>Осмотритесь снаружи.</span></h2>
          </div>
          <p>Минск, Петра Мстиславца, 10.<br />Ориентир — Национальная библиотека.</p>
        </div>

        <div className="rating-map__grid">
          <div className="rating-map__rating">
            <div className="rating-map__google"><span><GoogleLogo size={23} weight="bold" aria-hidden="true" /></span><span>Google</span></div>
            <div className="rating-map__score" aria-label="Оценка: 5 из 5"><strong>5.0</strong><span>/ 5</span></div>
            <div className="rating-map__stars" aria-hidden="true">{[1, 2, 3, 4, 5].map((star) => <Star key={star} size={30} weight="fill" />)}</div>
            <h3>Наша оценка<br />на картах Google</h3>
            <a className="rating-map__open" href={mapUrl} target="_blank" rel="noreferrer"><span>Открыть Google Maps</span><ArrowUpRight size={20} aria-hidden="true" /></a>
          </div>

          <div className="rating-map__location">
            <div className="rating-map__frame">
              <GoogleWalk />
            </div>
            <div className="rating-map__address">
              <span className="rating-map__pin"><MapPin size={22} aria-hidden="true" /></span>
              <div><strong>Минск, Петра Мстиславца, 10</strong><span>Панорама показывает здание и пространство вокруг него.</span></div>
              <a href={directionsUrl} target="_blank" rel="noreferrer" aria-label="Проложить маршрут к АРКЕ 123 в Google Maps"><span>Маршрут</span><NavigationArrow size={20} aria-hidden="true" /></a>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

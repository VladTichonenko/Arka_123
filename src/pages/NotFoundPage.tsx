import { Link } from 'react-router-dom'

export function NotFoundPage() {
  return (
    <div className="container not-found">
      <span className="eyebrow">Ошибка 404</span>
      <h1>Страница не найдена</h1>
      <p>Проверьте адрес или вернитесь на главную страницу.</p>
      <Link className="button-link" to="/">На главную</Link>
    </div>
  )
}

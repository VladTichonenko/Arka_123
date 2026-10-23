import { useRef, useState, type FormEvent } from 'react'
import { ArrowUpRight, ArrowsOut, CaretDown } from '@phosphor-icons/react'
import { bookingEmailParams, sendBookingEmail, todayInMinsk } from '../shared/lib/booking-email'

const emailConfig = {
  serviceId: import.meta.env.VITE_EMAILJS_SERVICE_ID?.trim() || 'default_service',
  templateId: import.meta.env.VITE_EMAILJS_TEMPLATE_ID?.trim() || '',
  publicKey: import.meta.env.VITE_EMAILJS_PUBLIC_KEY?.trim() || '',
}
const isEmailConfigured = Boolean(emailConfig.templateId && emailConfig.publicKey)

export function ContactForm({ onOpenTour }: { onOpenTour: () => void }) {
  const [message, setMessage] = useState('')
  const [isSending, setIsSending] = useState(false)
  const [hasError, setHasError] = useState(false)
  const submittingRef = useRef(false)
  const lastSentRef = useRef(0)
  const extraFieldsRef = useRef<HTMLDetailsElement>(null)

  const submit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    if (submittingRef.current) return
    const form = event.currentTarget
    const data = new FormData(form)
    if (String(data.get('website') || '')) return
    setHasError(false)
    if (!isEmailConfigured) {
      setHasError(true)
      setMessage('Отправка писем ещё настраивается. Попробуйте немного позже.')
      return
    }
    if (Date.now() - lastSentRef.current < 30000) {
      setHasError(true)
      setMessage('Заявка уже отправлена. Подождите полминуты перед повторной отправкой.')
      return
    }
    try {
      const params = bookingEmailParams({ name: String(data.get('name') || ''), email: String(data.get('email') || ''), phone: String(data.get('phone') || ''), startDate: String(data.get('startDate') || ''), days: Number(data.get('days')), comment: String(data.get('comment') || '') })
      submittingRef.current = true
      setIsSending(true)
      setMessage('')
      await sendBookingEmail(emailConfig, params)
      lastSentRef.current = Date.now()
      setMessage(`Готово! Письмо с деталями заявки отправлено на ${params.to_email}. Проверьте входящие и папку «Спам». Дату и условия аренды согласуем отдельно.`)
      form.reset()
      if (extraFieldsRef.current) extraFieldsRef.current.open = false
    } catch (error) {
      setHasError(true)
      setMessage(error instanceof Error && error.name === 'Error' ? error.message : 'Не удалось отправить письмо. Проверьте подключение и попробуйте ещё раз.')
    } finally {
      submittingRef.current = false
      setIsSending(false)
    }
  }

  return (
    <section className="footer-inquiry" aria-labelledby="footer-inquiry-title">
      <img className="footer-inquiry__photo" src="/images/space/room-light.webp" alt="Светлый зал АРКА 123 с арочными окнами" loading="lazy" />
      <div className="footer-inquiry__tour-arch">
        <button className="footer-inquiry__tour" id="virtual-tour" type="button" onClick={onOpenTour} aria-haspopup="dialog"><span><ArrowsOut size={23} aria-hidden="true" /></span>Осмотреть зал на 360°</button>
      </div>
      <div className="container footer-inquiry__inner">
        <div className="footer-inquiry__card">
          <span className="footer-inquiry__eyebrow">ЗАПРОС НА АРЕНДУ</span>
          <h2 id="footer-inquiry-title">Обсудим<br /><em>вашу встречу.</em></h2>
          <p className="footer-inquiry__intro">Выберите дату и число суток — пришлём детали заявки на почту.</p>
          <form className="footer-inquiry__form" onSubmit={submit} onChange={() => { if (!isSending) setMessage('') }} aria-busy={isSending}>
            <div className="footer-inquiry__contact-fields">
              <label><span className="footer-inquiry__label">Ваше имя</span><input name="name" type="text" autoComplete="name" placeholder="Ваше имя" maxLength={100} disabled={isSending} required /></label>
              <label><span className="footer-inquiry__label">Ваш e-mail</span><input name="email" type="email" autoComplete="email" placeholder="E-mail для письма" maxLength={254} disabled={isSending} required /></label>
            </div>
            <div className="footer-inquiry__dates">
              <label><span className="footer-inquiry__field-label">Дата начала</span><input name="startDate" type="date" min={todayInMinsk()} disabled={isSending} required /></label>
              <label><span className="footer-inquiry__field-label">Количество суток</span><input name="days" type="number" min={1} max={365} step={1} defaultValue={1} disabled={isSending} required /></label>
            </div>
            <details className="footer-inquiry__extra" ref={extraFieldsRef}>
              <summary>Телефон и детали встречи <CaretDown size={14} aria-hidden="true" /></summary>
              <div className="footer-inquiry__extra-fields">
                <label><span className="footer-inquiry__label">Телефон, необязательно</span><input name="phone" type="tel" autoComplete="tel" placeholder="Телефон, необязательно" maxLength={40} disabled={isSending} /></label>
                <label><span className="footer-inquiry__label">Гости и формат встречи</span><textarea name="comment" rows={2} placeholder="Число гостей, время начала и формат встречи" maxLength={2000} disabled={isSending} /></label>
              </div>
            </details>
            <label className="footer-inquiry__honeypot" aria-hidden="true">Сайт<input name="website" type="text" tabIndex={-1} autoComplete="off" /></label>
            <p className="footer-inquiry__privacy">Данные передадим через EmailJS только для письма и ответа на заявку.</p>
            <button type="submit" disabled={isSending}>{isSending ? 'Отправляем письмо…' : 'Отправить заявку'} <ArrowUpRight size={20} aria-hidden="true" /></button>
            <p className="footer-inquiry__notice">{isEmailConfigured ? 'Дату и условия аренды подтвердим отдельно.' : 'Отправка писем ещё настраивается.'}</p>
            {message && <p className={`footer-inquiry__message ${hasError ? 'footer-inquiry__message--error' : ''}`} role={hasError ? 'alert' : 'status'}>{message}</p>}
          </form>
        </div>
      </div>
    </section>
  )
}

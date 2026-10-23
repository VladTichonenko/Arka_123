export interface BookingRequest {
  name: string
  email: string
  phone: string
  startDate: string
  days: number
  comment: string
}

export interface EmailConfig {
  serviceId: string
  templateId: string
  publicKey: string
}

export function todayInMinsk() {
  return new Intl.DateTimeFormat('en-CA', { timeZone: 'Europe/Minsk', year: 'numeric', month: '2-digit', day: '2-digit' }).format(new Date())
}

export function bookingEmailParams(booking: BookingRequest, today = todayInMinsk()) {
  const name = booking.name.trim()
  const email = booking.email.trim()
  const date = new Date(`${booking.startDate}T12:00:00Z`)
  if (!name || name.length > 100) throw new Error('Укажите ваше имя.')
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) || email.length > 254) throw new Error('Укажите корректный e-mail для письма.')
  if (!/^\d{4}-\d{2}-\d{2}$/.test(booking.startDate) || !Number.isFinite(date.getTime()) || date.toISOString().slice(0, 10) !== booking.startDate || booking.startDate < today) {
    throw new Error('Выберите дату начала не раньше сегодняшнего дня.')
  }
  if (!Number.isInteger(booking.days) || booking.days < 1 || booking.days > 365) throw new Error('Укажите продолжительность от 1 до 365 суток.')
  if (booking.comment.length > 2000 || booking.phone.length > 40) throw new Error('Сократите комментарий или номер телефона.')
  const duration = booking.days === 1 ? 'одни сутки' : `${booking.days} ${new Intl.PluralRules('ru').select(booking.days) === 'one' ? 'сутки' : 'суток'}`
  return {
    name,
    to_email: email,
    phone: booking.phone.trim(),
    start_date: new Intl.DateTimeFormat('ru-RU', { day: 'numeric', month: 'long', year: 'numeric', timeZone: 'Europe/Minsk' }).format(date),
    duration,
    days: booking.days,
    comment: booking.comment.trim(),
  }
}

export async function sendBookingEmail(config: EmailConfig, params: ReturnType<typeof bookingEmailParams>, fetcher: typeof fetch = fetch) {
  const response = await fetcher('https://api.emailjs.com/api/v1.0/email/send', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ service_id: config.serviceId, template_id: config.templateId, user_id: config.publicKey, template_params: params }),
    signal: AbortSignal.timeout(20000),
  })
  if (!response.ok) throw new Error(response.status === 429 ? 'Слишком много запросов. Попробуйте отправить заявку чуть позже.' : 'Письмо не отправлено. Попробуйте ещё раз через несколько минут.')
}

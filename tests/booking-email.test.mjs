import test from 'node:test'
import assert from 'node:assert/strict'
import { bookingEmailParams, sendBookingEmail } from '../src/shared/lib/booking-email.ts'

const request = { name: '  Влад  ', email: 'vlad@example.com', phone: '', startDate: '2026-10-24', days: 3, comment: '<script>alert(1)</script>' }
const today = '2026-10-23'

test('produces recipient, Russian date and duration without injecting HTML', () => {
  const params = bookingEmailParams(request, today)
  assert.equal(params.name, 'Влад')
  assert.equal(params.to_email, 'vlad@example.com')
  assert.equal(params.duration, '3 суток')
  assert.match(params.start_date, /24 октября 2026/)
  assert.equal(params.comment, request.comment) // EmailJS escapes double-braced variables.
  assert.equal(bookingEmailParams({ ...request, days: 1 }, today).duration, 'одни сутки')
  assert.equal(bookingEmailParams({ ...request, days: 21 }, today).duration, '21 сутки')
})

test('rejects invalid/past dates, missing name, invalid email and fractional duration', () => {
  for (const change of [{ startDate: '2026-10-22' }, { startDate: '2026-02-30' }, { startDate: '' }, { name: '   ' }, { email: 'bad@example' }, { days: 0 }, { days: 1.5 }, { days: NaN }, { days: 366 }]) {
    assert.throws(() => bookingEmailParams({ ...request, ...change }, today))
  }
})

test('sends JSON to the official endpoint with the selected recipient and public credentials', async () => {
  const params = bookingEmailParams(request, today)
  let calls = 0
  await sendBookingEmail({ serviceId: 'service_test', templateId: 'template_test', publicKey: 'public_test' }, params, async (url, options) => {
    calls++
    assert.equal(url, 'https://api.emailjs.com/api/v1.0/email/send')
    assert.equal(options.method, 'POST')
    assert.equal(options.headers['Content-Type'], 'application/json')
    const body = JSON.parse(options.body)
    assert.equal(body.service_id, 'service_test')
    assert.equal(body.template_params.to_email, request.email)
    assert.equal(body.user_id, 'public_test')
    assert.equal('accessToken' in body, false)
    return new Response('OK', { status: 200 })
  })
  assert.equal(calls, 1)
})

test('rejects failed delivery, rate limits and network failures', async () => {
  const config = { serviceId: 's', templateId: 't', publicKey: 'p' }
  const params = bookingEmailParams(request, today)
  await assert.rejects(sendBookingEmail(config, params, async () => new Response('Bad request', { status: 400 })), /не отправлено/)
  await assert.rejects(sendBookingEmail(config, params, async () => new Response('Limit', { status: 429 })), /Слишком много/)
  await assert.rejects(sendBookingEmail(config, params, async () => { throw new TypeError('network') }), /network/)
})

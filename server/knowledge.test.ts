import { test } from 'node:test'
import assert from 'node:assert/strict'
import { calculateRentalQuote, explicitQuoteInput, systemPrompt } from './knowledge.ts'

test('published prices, minimum and fractional preliminary estimate', () => {
  for (const [hours, amount] of [[1, 240], [2, 240], [2.5, 300], [3, 360], [4, 420], [5, 600], [8, 760], [10, 1200]]) {
    const quote = calculateRentalQuote({ hours })
    assert.ok(!('error' in quote))
    assert.equal(quote.amount, amount)
  }
  const quote = calculateRentalQuote({ hours: 7 })
  assert.ok(!('error' in quote))
  assert.equal(quote.amount, 840)
  assert.match(quote.alternative!, /760/)
})

test('time intervals use the calculator, including midnight with explicit dates', () => {
  const morning = calculateRentalQuote({ start: '10:00', end: '14:00' })
  assert.ok(!('error' in morning))
  assert.equal(morning.amount, 420)
  const overnight = calculateRentalQuote({ start: '2026-10-24T22:00+03:00', end: '2026-10-25T02:00+03:00' })
  assert.ok(!('error' in overnight))
  assert.equal(overnight.requestedHours, 4)
  assert.equal(overnight.amount, 420)
  assert.ok('error' in calculateRentalQuote({ start: '22:00', end: '02:00' }))
})

test('invalid or ambiguous duration is not silently priced', () => {
  for (const hours of [0, -1, NaN, Infinity, 25]) assert.ok('error' in calculateRentalQuote({ hours }))
  assert.ok('error' in calculateRentalQuote({}))
  assert.ok('error' in calculateRentalQuote({ start: 'tomorrow', end: 'tonight' }))
  assert.ok('error' in calculateRentalQuote({ start: '10:00' }))
  assert.ok('error' in calculateRentalQuote({ start: '2026-02-30T10:00+03:00', end: '2026-03-02T14:00+03:00' }))
})

test('explicit duration is distinct from arrival time and alternative durations', () => {
  assert.deepEqual(explicitQuoteInput('На 8 часов в субботу'), { hours: 8 })
  assert.deepEqual(explicitQuoteInput('Только на 1 час'), { hours: 1 })
  assert.deepEqual(explicitQuoteInput('с 10:00 до 14:00, 15 человек'), { start: '10:00', end: '14:00' })
  assert.equal(explicitQuoteInput('Начинаем в 16 часов, 20 гостей'), null)
  assert.equal(explicitQuoteInput('На 4 или 8 часов'), null)
  assert.equal(explicitQuoteInput('с 22:00 до 02:00'), null)
})

test('knowledge includes owner contacts, known facts and no invented availability', () => {
  const prompt = systemPrompt(new Date('2026-10-23T12:00:00Z'))
  for (const fact of ['123 м²', '4 × 3,5', '4,5 м', 'Петра Мстиславца, 10', '120 BYN', '420 BYN', '760 BYN', 'vlad6867911@gmail.com', '+375336867911', 'не подключена к календарю']) assert.ok(prompt.includes(fact))
})

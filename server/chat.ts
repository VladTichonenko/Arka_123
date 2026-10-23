import type { IncomingMessage, ServerResponse } from 'node:http'
import { bookingContacts, calculateRentalQuote, explicitQuoteInput, systemPrompt } from './knowledge.ts'

type ChatMessage = { role: 'user' | 'assistant'; content: string }
type Config = { apiKey: string; model?: string; fetchImpl?: typeof fetch }
const tools = [{ type: 'function', function: {
  name: 'calculate_rental_quote',
  description: 'Точный предварительный расчёт длительности и стоимости аренды АРКИ 123. Вызови для любых числовых расчётов; передай часы либо начало и конец.',
  parameters: { type: 'object', properties: {
    hours: { type: 'number', description: 'Длительность в часах, допускаются дробные часы.' },
    start: { type: 'string', description: 'Начало: HH:mm или ISO-дата с +03:00.' },
    end: { type: 'string', description: 'Окончание в том же формате, что start.' },
  }, additionalProperties: false },
} }]

export function createChatMiddleware(config: Config) {
  const model = config.model || 'qwen/qwen3.7-flash'
  const fetchImpl = config.fetchImpl || fetch
  const visitors = new Map<string, { count: number; reset: number }>()
  let inFlight = 0
  const json = (res: ServerResponse, status: number, value: unknown) => {
    res.writeHead(status, { 'Content-Type': 'application/json; charset=utf-8', 'Cache-Control': 'no-store' })
    res.end(JSON.stringify(value))
  }
  return async (req: IncomingMessage, res: ServerResponse, next: () => void) => {
    const path = req.url?.split('?')[0]
    if (path !== '/api/chat' && path !== '/api/chat/health') return next()
    if (path === '/api/chat/health' && req.method === 'GET') return json(res, 200, { available: Boolean(config.apiKey), model })
    if (req.method !== 'POST' || path !== '/api/chat') return json(res, 405, { error: 'Метод не поддерживается.' })
    const origin = req.headers.origin
    if (origin) {
      try { if (new URL(origin).host !== req.headers.host) return json(res, 403, { error: 'Запрос разрешён только с сайта АРКА 123.' }) }
      catch { return json(res, 403, { error: 'Недопустимый источник запроса.' }) }
    }
    if (!config.apiKey) return json(res, 503, { error: 'Помощник временно недоступен. Свяжитесь с владельцем.', contacts: bookingContacts })
    const now = Date.now()
    for (const [key, value] of visitors) if (value.reset <= now) visitors.delete(key)
    const ip = req.socket.remoteAddress || 'local'
    const visitor = visitors.get(ip) || { count: 0, reset: now + 60_000 }
    if (visitor.count >= 20 || inFlight >= 4) return json(res, 429, { error: 'Слишком много вопросов подряд. Попробуйте через минуту.', contacts: bookingContacts })
    visitor.count++
    visitors.set(ip, visitor)
    inFlight++
    try {
      const chunks: Buffer[] = []
      let bytes = 0
      for await (const chunk of req) {
        const buffer = Buffer.isBuffer(chunk) ? chunk : Buffer.from(chunk)
        bytes += buffer.length
        if (bytes > 28_000) return json(res, 413, { error: 'Сообщение слишком длинное.' })
        chunks.push(buffer)
      }
      const body = Buffer.concat(chunks).toString('utf8')
      let payload: { messages?: ChatMessage[] }
      try { payload = JSON.parse(body) } catch { return json(res, 400, { error: 'Некорректный запрос.' }) }
      const history = payload?.messages
      if (!Array.isArray(history) || !history.length || history.length > 14 || history.some(m => !m || !['user', 'assistant'].includes(m.role) || typeof m.content !== 'string' || !m.content.trim() || m.content.length > (m.role === 'user' ? 1000 : 5000)) || history.at(-1)?.role !== 'user' || history.reduce((n, m) => n + m.content.length, 0) > 18_000) return json(res, 400, { error: 'Не удалось прочитать историю. Сократите сообщение или начните новый диалог.' })
      const messages: Record<string, unknown>[] = [{ role: 'system', content: systemPrompt() }, ...history.map(m => ({ role: m.role, content: m.content }))]
      const signal = AbortSignal.timeout(55_000)
      const completion = async (toolChoice: unknown) => {
        const response = await fetchImpl('https://openrouter.ai/api/v1/chat/completions', {
          method: 'POST', signal,
          headers: { Authorization: `Bearer ${config.apiKey}`, 'Content-Type': 'application/json', 'X-Title': 'ARKA 123 - Arina' },
          body: JSON.stringify({ model, messages, tools, tool_choice: toolChoice, temperature: 0.25, max_tokens: 1000, reasoning: { enabled: false }, provider: { require_parameters: true } }),
        })
        if (!response.ok) throw new Error(`Upstream status ${response.status}`)
        const data = await response.json() as { error?: unknown; choices?: { message: { content?: string; tool_calls?: { id: string; function: { name: string; arguments: string } }[] } }[] }
        if (!data || typeof data !== 'object' || ('error' in data && data.error) || !('choices' in data) || !Array.isArray(data.choices) || !data.choices[0]?.message) throw new Error('Empty upstream response')
        return data.choices[0].message
      }
      const last = history.at(-1)!.content
      const quotes: ReturnType<typeof calculateRentalQuote>[] = []
      const explicit = explicitQuoteInput(last)
      if (explicit) {
        const quote = calculateRentalQuote(explicit)
        if (!('error' in quote)) {
          quotes.push(quote)
          messages.push({ role: 'system', content: `Серверный калькулятор уже выполнил расчёт по последнему вопросу: ${JSON.stringify(quote)}. Сразу назови эту предварительную цену. Не требуй дату и время для выдачи этой цены. Для подтверждения брони дай контакты владельца.` })
        }
      }
      let answer = await completion(quotes.length ? 'none' : 'auto')
      if (answer.tool_calls?.length) {
        const calls = answer.tool_calls.slice(0, 3)
        messages.push({ role: 'assistant', content: answer.content || null, tool_calls: calls })
        for (const call of calls) {
          let result: ReturnType<typeof calculateRentalQuote>
          try { result = call.function?.name === 'calculate_rental_quote' ? calculateRentalQuote(JSON.parse(call.function.arguments)) : { error: 'Неизвестный инструмент.' } }
          catch { result = { error: 'Уточните длительность или время начала и окончания.' } }
          quotes.push(result)
          messages.push({ role: 'tool', tool_call_id: call.id, content: JSON.stringify(result) })
        }
        answer = await completion('none')
      }
      const reply = typeof answer.content === 'string' ? answer.content.trim() : ''
      if (!reply) throw new Error('Empty answer')
      const booking = quotes.some(q => !('error' in q)) || /брон|зарезерв|запис|снять|контакт|телефон|почт|арендовать/i.test(last)
      json(res, 200, { reply, contacts: booking ? bookingContacts : null, quotes: quotes.filter(q => !('error' in q)) })
    } catch {
      json(res, 502, { error: 'Арина сейчас не может ответить. Попробуйте ещё раз или свяжитесь с владельцем.', contacts: bookingContacts })
    } finally { inFlight-- }
  }
}

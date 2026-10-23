import { useEffect, useRef, useState, type FormEvent, type PointerEvent } from 'react'
import { ArrowUpRight, ArrowsInSimple, ArrowsOutSimple, ChatCircleDots, PaperPlaneTilt, X } from '@phosphor-icons/react'
import { chatDrawerBounds, shouldDismissChatDrawer } from '../shared/lib/chat-viewport'
import '../shared/styles/manager-chat.css'

type HistoryMessage = { role: 'user' | 'assistant'; content: string }
type Quote = { requestedHours: number; amount: number; currency: string; tariff: string }
type Message = { id: number; author: 'visitor' | 'guide'; text: string; quotes?: Quote[]; contacts?: boolean }
const bookingContacts = { email: 'vlad6867911@gmail.com', phone: '+375336867911' }


const suggestions = [
  { question: 'Стоимость аренды', shortLabel: 'Стоимость' },
  { question: 'Какие форматы?', shortLabel: 'Форматы' },
  { question: 'Как добраться?', shortLabel: 'Как добраться?' },
]

export function ManagerChat() {
  const [isOpen, setIsOpen] = useState(false)
  const [isExpanded, setIsExpanded] = useState(false)
  const [isMobile, setIsMobile] = useState(() => window.matchMedia('(max-width: 760px)').matches)
  const [isClosing, setIsClosing] = useState(false)
  const [keyboardOpen, setKeyboardOpen] = useState(false)
  const [isDragging, setIsDragging] = useState(false)
  const [hasDragged, setHasDragged] = useState(false)
  const [draft, setDraft] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const pendingRef = useRef(false)
  const requestRef = useRef<AbortController | null>(null)
  const failedHistoryRef = useRef<HistoryMessage[] | null>(null)
  const [messages, setMessages] = useState<Message[]>([
    { id: 0, author: 'guide', text: 'Здравствуйте! Я Арина, ИИ-помощник АРКИ 123. Расскажу о зале, помогу рассчитать аренду и подскажу, как связаться с владельцем для бронирования.' },
  ])
  const launcherRef = useRef<HTMLButtonElement>(null)
  const closeRef = useRef<HTMLButtonElement>(null)
  const historyRef = useRef<HTMLDivElement>(null)
  const panelRef = useRef<HTMLDialogElement>(null)
  const restingViewport = useRef<{ height: number; width: number; keyboard: boolean } | null>(null)
  const dragRef = useRef<{ pointerId: number; startY: number; lastY: number; lastTime: number; distance: number; velocity: number } | null>(null)
  const ignoreHandleClick = useRef(false)
  const settleFrame = useRef(0)
  const nextId = useRef(1)
  const wasOpened = useRef(false)

  useEffect(() => () => { const active = requestRef.current; requestRef.current = null; active?.abort(); cancelAnimationFrame(settleFrame.current) }, [])

  useEffect(() => {
    const mobile = window.matchMedia('(max-width: 760px)')
    const sync = () => setIsMobile(mobile.matches)
    mobile.addEventListener('change', sync)
    return () => mobile.removeEventListener('change', sync)
  }, [])

  useEffect(() => {
    if (!isOpen) {
      if (wasOpened.current) launcherRef.current?.focus({ preventScroll: true })
      return
    }
    const panel = panelRef.current
    if (!panel) return
    const previousOverflow = document.body.style.overflow
    wasOpened.current = true
    if (isMobile) {
      panel.showModal()
      document.body.style.overflow = 'hidden'
    } else panel.show()
    closeRef.current?.focus({ preventScroll: true })
    return () => {
      panel.close()
      if (isMobile) document.body.style.overflow = previousOverflow
    }
  }, [isOpen, isMobile])

  useEffect(() => {
    const panel = panelRef.current
    if (!isOpen || !isMobile || !panel) {
      restingViewport.current = null
      setKeyboardOpen(false)
      return
    }
    const viewport = window.visualViewport
    let frame = 0
    const update = () => {
      frame = 0
      const visibleHeight = viewport?.height ?? window.innerHeight
      const width = window.innerWidth
      const previous = restingViewport.current
      const restingHeight = !previous || previous.width !== width ? visibleHeight : previous.height
      const editing = panel.contains(document.activeElement) && document.activeElement?.matches('textarea, input')
      const keyboard = Boolean((editing || previous?.keyboard) && restingHeight - visibleHeight > 100)
      const height = keyboard ? restingHeight : visibleHeight
      restingViewport.current = { height, width, keyboard }
      const bounds = chatDrawerBounds(height, visibleHeight, viewport?.offsetTop ?? 0, isExpanded)
      panel.style.setProperty('--chat-sheet-height', `${bounds.height}px`)
      panel.style.setProperty('--chat-sheet-top', `${bounds.top}px`)
      setKeyboardOpen(keyboard)
    }
    const schedule = () => { if (!frame) frame = requestAnimationFrame(update) }
    update()
    viewport?.addEventListener('resize', schedule)
    viewport?.addEventListener('scroll', schedule)
    window.addEventListener('resize', schedule)
    panel.addEventListener('focusin', schedule)
    panel.addEventListener('focusout', schedule)
    return () => {
      cancelAnimationFrame(frame)
      viewport?.removeEventListener('resize', schedule)
      viewport?.removeEventListener('scroll', schedule)
      window.removeEventListener('resize', schedule)
      panel.removeEventListener('focusin', schedule)
      panel.removeEventListener('focusout', schedule)
      panel.style.removeProperty('--chat-sheet-height')
      panel.style.removeProperty('--chat-sheet-top')
    }
  }, [isOpen, isMobile, isExpanded])

  useEffect(() => {
    if (!isClosing) return
    const timer = window.setTimeout(() => { setIsOpen(false); setIsClosing(false) }, 280)
    return () => window.clearTimeout(timer)
  }, [isClosing])

  const closeChat = () => {
    if (isMobile && !window.matchMedia('(prefers-reduced-motion: reduce)').matches) setIsClosing(true)
    else { setIsOpen(false); setIsClosing(false) }
  }

  const startDrag = (event: PointerEvent<HTMLButtonElement>) => {
    if (!isMobile || isClosing || !event.isPrimary || event.button !== 0) return
    event.preventDefault()
    cancelAnimationFrame(settleFrame.current)
    ignoreHandleClick.current = false
    const initialY = panelRef.current ? new DOMMatrixReadOnly(getComputedStyle(panelRef.current).transform).m42 : 0
    panelRef.current?.style.setProperty('--chat-drag-y', `${initialY}px`)
    dragRef.current = { pointerId: event.pointerId, startY: event.clientY - initialY, lastY: event.clientY, lastTime: event.timeStamp, distance: initialY, velocity: 0 }
    event.currentTarget.setPointerCapture(event.pointerId)
    setHasDragged(true)
    setIsDragging(true)
  }

  const moveDrag = (event: PointerEvent<HTMLButtonElement>) => {
    const drag = dragRef.current
    if (!drag || drag.pointerId !== event.pointerId) return
    drag.distance = Math.max(0, event.clientY - drag.startY)
    drag.velocity = (event.clientY - drag.lastY) / Math.max(1, event.timeStamp - drag.lastTime)
    drag.lastY = event.clientY
    drag.lastTime = event.timeStamp
    if (drag.distance > 5) ignoreHandleClick.current = true
    panelRef.current?.style.setProperty('--chat-drag-y', `${drag.distance}px`)
  }

  const finishDrag = (event: PointerEvent<HTMLButtonElement>, cancelled = false) => {
    const drag = dragRef.current
    if (!drag || drag.pointerId !== event.pointerId) return
    dragRef.current = null
    setIsDragging(false)
    if (event.currentTarget.hasPointerCapture(event.pointerId)) event.currentTarget.releasePointerCapture(event.pointerId)
    if (!cancelled && shouldDismissChatDrawer(drag.distance, drag.velocity, panelRef.current?.offsetHeight ?? 500)) {
      ignoreHandleClick.current = true
      closeChat()
    } else {
      settleFrame.current = requestAnimationFrame(() => panelRef.current?.style.setProperty('--chat-drag-y', '0px'))
    }
  }

  useEffect(() => {
    const history = historyRef.current
    if (history) history.scrollTop = history.scrollHeight
  }, [messages, isOpen, isExpanded, isLoading, error])

  useEffect(() => {
    const history = historyRef.current
    if (!isOpen || !history) return
    const observer = new ResizeObserver(() => {
      history.scrollTop = history.scrollHeight
    })
    observer.observe(history)
    return () => observer.disconnect()
  }, [isOpen])

  const requestReply = async (history: HistoryMessage[]) => {
    if (pendingRef.current) return
    pendingRef.current = true
    setIsLoading(true)
    setError(null)
    const controller = new AbortController()
    requestRef.current = controller
    const timeout = window.setTimeout(() => controller.abort(), 65_000)
    try {
      const response = await fetch('/api/chat', {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ messages: history }), signal: controller.signal,
      })
      const result = await response.json()
      if (!response.ok || typeof result.reply !== 'string' || !result.reply.trim()) {
        throw new Error(typeof result.error === 'string' ? result.error : 'Не удалось получить ответ. Попробуйте ещё раз.')
      }
      failedHistoryRef.current = null
      const replyId = nextId.current++
      setMessages(current => [...current, { id: replyId, author: 'guide', text: result.reply, quotes: result.quotes, contacts: Boolean(result.contacts) }])
    } catch {
      if (requestRef.current !== controller) return
      failedHistoryRef.current = history
      setError('Арина сейчас не может ответить. Попробуйте ещё раз или свяжитесь с владельцем.')
    } finally {
      window.clearTimeout(timeout)
      if (requestRef.current === controller) {
        pendingRef.current = false
        setIsLoading(false)
      }
    }
  }

  const send = (question: string) => {
    const text = question.trim().slice(0, 1000)
    if (!text || pendingRef.current) return
    const history: HistoryMessage[] = [...messages.filter(m => m.id !== 0).map(m => ({ role: m.author === 'visitor' ? 'user' as const : 'assistant' as const, content: m.text })), { role: 'user' as const, content: text }].slice(-12)
    while (history.length > 1 && history.reduce((n, m) => n + m.content.length, 0) > 16_000) history.shift()
    const visitorId = nextId.current++
    setMessages(current => [...current, { id: visitorId, author: 'visitor', text }])
    setDraft('')
    void requestReply(history)
  }

  const submit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    send(draft)
  }

  return (
    <aside className="manager-chat" aria-label="Помощь с арендой пространства">
      <button
        ref={launcherRef}
        className="manager-chat__launcher"
        type="button"
        hidden={isOpen}
        aria-label="Открыть чат с Ариной"
        aria-expanded={isOpen}
        aria-controls="manager-chat-panel"
        onClick={() => { cancelAnimationFrame(settleFrame.current); dragRef.current = null; setIsDragging(false); setHasDragged(false); if (isMobile) setIsExpanded(false); setIsOpen(true) }}
      >
        <span className="manager-chat__avatar"><img src="/images/arina-arka-123.jpg" alt="" /></span>
        <span className="manager-chat__launcher-copy"><strong>Арина, АРКА 123</strong><span>Вопросы об аренде?</span></span>
        <span className="manager-chat__launcher-icon"><ChatCircleDots size={23} weight="regular" /></span>
      </button>

      {isOpen && (
        <dialog
          ref={panelRef}
          id="manager-chat-panel"
          className={`manager-chat__panel ${isExpanded ? 'manager-chat__panel--expanded' : ''} ${isClosing ? 'manager-chat__panel--closing' : ''} ${keyboardOpen ? 'manager-chat__panel--keyboard' : ''} ${hasDragged ? 'manager-chat__panel--touched' : ''} ${isDragging ? 'manager-chat__panel--dragging' : ''}`}
          aria-modal={isMobile}
          aria-labelledby="manager-chat-title"
          onCancel={(event) => { event.preventDefault(); closeChat() }}
          onClick={(event) => { if (event.target === event.currentTarget) closeChat() }}
          onAnimationEnd={(event) => { if (event.target === event.currentTarget && event.animationName === 'chat-drawer-out') { setIsOpen(false); setIsClosing(false) } }}
          onKeyDown={(event) => {
            if (event.key === 'Escape') {
              event.stopPropagation()
              event.preventDefault()
              closeChat()
            }
          }}
        >
          <button className="manager-chat__drag-handle" type="button" aria-label="Закрыть чат: потяните вниз или нажмите" onPointerDown={startDrag} onPointerMove={moveDrag} onPointerUp={event => finishDrag(event)} onPointerCancel={event => finishDrag(event, true)} onClick={event => { if (!ignoreHandleClick.current || event.detail === 0) closeChat(); ignoreHandleClick.current = false }}><span /></button>
          <header className="manager-chat__header">
            <span className="manager-chat__avatar"><img src="/images/arina-arka-123.jpg" alt="Портрет Арины" /></span>
            <div className="manager-chat__identity"><h2 id="manager-chat-title">Арина</h2><span>ИИ-консультант по аренде</span></div>
            <div className="manager-chat__actions">
              <button type="button" aria-label={isExpanded ? 'Уменьшить чат' : 'Развернуть чат'} aria-pressed={isExpanded} title={isExpanded ? 'Уменьшить' : 'Развернуть'} onClick={() => setIsExpanded((value) => !value)}>{isExpanded ? <ArrowsInSimple size={19} /> : <ArrowsOutSimple size={19} />}</button>
              <button ref={closeRef} type="button" aria-label="Свернуть чат" title="Свернуть" onClick={closeChat}><X size={20} /></button>
            </div>
          </header>

          <div className="manager-chat__history" ref={historyRef}>
            <p className="manager-chat__intro">Размеры зала, форматы и условия аренды</p>
            <div className="manager-chat__messages" role="log" aria-label="Сообщения чата" aria-live="polite" aria-relevant="additions">
              {messages.map((message) => (
                <div className={`manager-chat__message manager-chat__message--${message.author}`} key={message.id}>
                  <span className="manager-chat__author">{message.author === 'visitor' ? 'Вы' : 'Арина · ИИ-помощник'}</span>
                  <p>{message.text}</p>
                  {message.quotes?.map((quote, index) => (
                    <div className="manager-chat__quote" key={index}>
                      <span>Предварительный расчёт</span>
                      <strong>{quote.amount.toLocaleString('ru-RU')} {quote.currency}</strong>
                      <span>{quote.requestedHours.toLocaleString('ru-RU')} ч · {quote.tariff}</span>
                      <small>По тарифам сайта. Итог и доступность даты подтвердит владелец.</small>
                    </div>
                  ))}
                  {message.contacts && <div className="manager-chat__contacts"><span>Для подтверждения брони</span><a href={`mailto:${bookingContacts.email}`}>{bookingContacts.email}</a><a href={`tel:${bookingContacts.phone}`}>{bookingContacts.phone}</a></div>}
                </div>
              ))}
            </div>
            {isLoading && <p className="manager-chat__loading" role="status">Арина отвечает…</p>}
            {error && <div className="manager-chat__error" role="alert"><p>{error}</p><button type="button" disabled={isLoading} onClick={() => { if (failedHistoryRef.current) void requestReply(failedHistoryRef.current) }}>Повторить</button><div className="manager-chat__contacts"><a href={`mailto:${bookingContacts.email}`}>{bookingContacts.email}</a><a href={`tel:${bookingContacts.phone}`}>{bookingContacts.phone}</a></div></div>}
          </div>

          <div className="manager-chat__bottom">
            <div className="manager-chat__suggestions" aria-label="Частые вопросы">
              {suggestions.map(({ question, shortLabel }) => (
                <button key={question} type="button" aria-label={question} disabled={isLoading} onClick={() => send(question)}>
                  <span className="manager-chat__suggestion-full">{question}</span>
                  <span className="manager-chat__suggestion-short" aria-hidden="true">{shortLabel}</span>
                  <ArrowUpRight size={13} aria-hidden="true" />
                </button>
              ))}
            </div>
            <form className="manager-chat__form" onSubmit={submit}>
              <label className="manager-chat__input-label" htmlFor="manager-chat-input">Ваше сообщение</label>
              <textarea id="manager-chat-input" rows={2} maxLength={1000} value={draft} placeholder="Напишите свой вопрос…" onChange={(event) => setDraft(event.target.value)} onKeyDown={(event) => {
                if (event.key === 'Enter' && !event.shiftKey && !event.nativeEvent.isComposing) {
                  event.preventDefault()
                  send(draft)
                }
              }} />
              <button type="submit" aria-label="Отправить сообщение" disabled={!draft.trim() || isLoading}><PaperPlaneTilt size={20} weight="fill" /></button>
            </form>
            <p className="manager-chat__notice">ИИ-помощник · обработка через OpenRouter. Бронь подтверждает владелец.</p>
          </div>
        </dialog>
      )}
    </aside>
  )
}

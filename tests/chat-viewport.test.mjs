import test from 'node:test'
import assert from 'node:assert/strict'
import { chatDrawerBounds, shouldDismissChatDrawer } from '../src/shared/lib/chat-viewport.ts'

test('обычный drawer занимает 70% видимого экрана', () => {
  const bounds = chatDrawerBounds(800, 800)
  assert.equal(bounds.height, 560)
  assert.equal(bounds.top + bounds.height, 800)
})

test('клавиатура ограничивает drawer доступной областью и сохраняет его нижний край над ней', () => {
  for (const visibleHeight of [280, 350, 430, 500]) {
    const bounds = chatDrawerBounds(800, visibleHeight, 95)
    assert.ok(bounds.height <= 560)
    assert.ok(bounds.top >= 95)
    assert.equal(bounds.top + bounds.height, 95 + visibleHeight)
    assert.ok(bounds.height <= visibleHeight - 8)
  }
})

test('развёрнутый чат заполняет видимую область с клавиатурой и без неё', () => {
  for (const visibleHeight of [300, 450, 800]) {
    const bounds = chatDrawerBounds(800, visibleHeight, 40, true)
    assert.deepEqual(bounds, { top: 40, height: visibleHeight })
  }
})

test('ручка отличает случайное движение, длинное перетягивание и быстрый жест', () => {
  assert.equal(shouldDismissChatDrawer(8, 1.5, 700), false)
  assert.equal(shouldDismissChatDrawer(55, .1, 700), false)
  assert.equal(shouldDismissChatDrawer(130, .1, 700), true)
  assert.equal(shouldDismissChatDrawer(35, .8, 700), true)
  assert.equal(shouldDismissChatDrawer(70, .1, 300), true)
})

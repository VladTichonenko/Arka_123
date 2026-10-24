import test from 'node:test'
import assert from 'node:assert/strict'
import { createScrollVideo } from '../src/shared/lib/scroll-video.ts'

class Video extends EventTarget {
  readyState = 0
  duration = NaN
  seeking = false
  error = null
  time = 0
  seeks = []
  loads = 0
  rejectSeek = false
  get currentTime() { return this.time }
  set currentTime(value) {
    if (this.rejectSeek) throw new Error('Seek temporarily unavailable')
    this.time = value
    this.seeks.push(value)
    this.seeking = true
    this.readyState = 1
  }
  emit(type) { this.dispatchEvent(new Event(type)) }
  metadata() { this.duration = 12; this.readyState = 1; this.emit('loadedmetadata') }
  finish(readyState = 2) { this.seeking = false; this.readyState = readyState; this.emit('seeked') }
  load() { this.loads++; this.readyState = 0; this.time = 0; this.seeking = false; this.error = null }
}

function setup(t, initialProgress = .5) {
  t.mock.timers.enable({ apis: ['setTimeout'] })
  const video = new Video()
  const statuses = []
  let progress = initialProgress
  const controller = createScrollVideo(video, () => progress, status => statuses.push(status))
  t.after(() => controller.destroy())
  return { video, statuses, controller, setProgress: value => { progress = value } }
}

test('metadata-only preload can initiate a seek without waiting for loadeddata', t => {
  const { video, statuses } = setup(t)
  video.metadata()
  assert.deepEqual(video.seeks, [5.975])
  video.finish()
  assert.deepEqual(statuses, ['loading', 'ready'])
})

test('buffering recovers on canplay without another scroll or loadeddata event', t => {
  const { video, controller, setProgress, statuses } = setup(t, .2)
  video.metadata()
  setProgress(.8)
  controller.sync() // Latest scroll arrives while seeking.
  video.finish(1) // seeked fires before the new frame is decoded.
  assert.equal(video.currentTime, 9.56)
  video.finish(1)
  video.readyState = 2
  video.emit('canplay')
  assert.equal(statuses.at(-1), 'ready')
  t.mock.timers.tick(12_000)
  assert.equal(statuses.at(-1), 'ready')
})

test('only one seek runs at a time and reverse scroll wins after it completes', t => {
  const { video, controller, setProgress } = setup(t, .8)
  video.metadata()
  for (const progress of [.9, 1, .6, .1]) {
    setProgress(progress)
    controller.sync()
  }
  assert.equal(video.seeks.length, 1)
  video.finish()
  assert.equal(video.seeks.length, 2)
  assert.equal(video.currentTime, 1.195)
  video.finish()
  controller.sync()
  assert.equal(video.seeks.length, 2)
})

test('late metadata and progress resume the most recent scroll position', t => {
  const { video, controller, setProgress, statuses } = setup(t)
  setProgress(.75)
  controller.sync()
  assert.deepEqual(video.seeks, [])
  video.duration = 12
  video.readyState = 1
  video.emit('progress')
  assert.equal(video.currentTime, 8.962499999999999)
  video.finish()
  assert.equal(statuses.at(-1), 'ready')
})

test('a stuck seek offers retry after a bounded wait, even with ongoing scroll', t => {
  const { video, controller, setProgress, statuses } = setup(t)
  video.metadata()
  t.mock.timers.tick(8_000)
  setProgress(.9)
  controller.sync()
  t.mock.timers.tick(4_000)
  assert.equal(statuses.at(-1), 'stalled')
  controller.retry()
  assert.equal(video.loads, 1)
  assert.equal(statuses.at(-1), 'loading')
  video.metadata()
  assert.equal(video.currentTime, 10.754999999999999)
  video.finish()
  assert.equal(statuses.at(-1), 'ready')
})

test('a network error can be retried without remounting the scene', t => {
  const { video, controller, statuses } = setup(t)
  video.error = { code: 2 }
  video.emit('error')
  assert.equal(statuses.at(-1), 'error')
  t.mock.timers.tick(20_000)
  assert.equal(statuses.at(-1), 'error')
  controller.retry()
  video.metadata()
  video.finish()
  assert.equal(statuses.at(-1), 'ready')
})

test('continuous successful scrubbing does not time out while catching up', t => {
  const { video, setProgress, statuses } = setup(t, .1)
  video.metadata()
  for (let step = 2; step < 10; step++) {
    t.mock.timers.tick(3_000)
    setProgress(step / 10)
    video.finish()
  }
  assert.equal(statuses.includes('stalled'), false)
  assert.equal(statuses.at(-1), 'ready')
})

test('temporarily rejected seek recovers when more data arrives', t => {
  const { video, statuses } = setup(t)
  video.rejectSeek = true
  assert.doesNotThrow(() => video.metadata())
  video.rejectSeek = false
  video.emit('progress')
  video.finish()
  assert.equal(statuses.at(-1), 'ready')
})

test('cleanup cancels timers and media listeners', t => {
  const { video, controller, statuses } = setup(t)
  controller.destroy()
  video.metadata()
  video.emit('error')
  controller.sync()
  controller.retry()
  t.mock.timers.tick(20_000)
  assert.deepEqual(video.seeks, [])
  assert.equal(video.loads, 0)
  assert.deepEqual(statuses, ['loading'])
})

test('cached video is ready without relying on a future loadeddata event', t => {
  const { video, controller, statuses, setProgress } = setup(t, 0)
  video.duration = 12
  video.readyState = 4
  controller.sync()
  assert.equal(statuses.at(-1), 'ready')
  setProgress(2)
  controller.sync()
  assert.equal(video.currentTime, 11.95)
  video.finish()
  setProgress(-1)
  controller.sync()
  assert.equal(video.currentTime, 0)
})

export type ScrollVideoStatus = 'loading' | 'ready' | 'stalled' | 'error'

const MEDIA_EVENTS = ['loadedmetadata', 'durationchange', 'loadeddata', 'canplay', 'progress', 'seeked'] as const
const SEEK_TOLERANCE = .025
const WAIT_TIMEOUT = 12_000

/** Keep one seek in flight and catch up to the latest scroll position after buffering. */
export function createScrollVideo(
  video: HTMLVideoElement,
  getProgress: () => number,
  onStatus: (status: ScrollVideoStatus) => void,
) {
  let disposed = false
  let status: ScrollVideoStatus = 'loading'
  let timeout: ReturnType<typeof setTimeout> | undefined

  const report = (next: ScrollVideoStatus) => {
    if (disposed || next === status) return
    status = next
    onStatus(next)
  }
  const clearWait = () => {
    clearTimeout(timeout)
    timeout = undefined
  }
  const wait = () => {
    // More scroll events must not postpone the warning indefinitely.
    if (timeout !== undefined || status === 'stalled') return
    timeout = setTimeout(() => {
      timeout = undefined
      report('stalled')
    }, WAIT_TIMEOUT)
  }
  const sync = () => {
    if (disposed || status === 'error') return
    if (video.error) { fail(); return }
    // HAVE_METADATA is sufficient for seeking. Waiting for a decoded frame here
    // can deadlock a paused video when the browser only preloads metadata.
    if (video.readyState < 1 || !Number.isFinite(video.duration) || video.duration <= 0 || video.seeking) {
      wait()
      return
    }
    const progress = Math.max(0, Math.min(1, getProgress()))
    const target = progress * Math.max(0, video.duration - .05)
    if (Math.abs(video.currentTime - target) > SEEK_TOLERANCE) {
      wait()
      try {
        video.currentTime = target
      } catch {
        // Metadata/seekability may change during a network suspension. Retry
        // on the next media event rather than aborting the scroll handler.
      }
      return
    }
    if (video.readyState >= 2) {
      clearWait()
      report('ready')
    } else {
      wait()
    }
  }
  const fail = () => { clearWait(); report('error') }
  const mediaUpdate = () => {
    if (disposed || status === 'error') return
    if (video.readyState >= 2 && !video.seeking) {
      // A decoded frame is real progress even if scrolling already requested
      // another one. Continuous scrubbing must not trigger a false timeout.
      clearWait()
      report('ready')
    }
    sync()
  }

  for (const event of MEDIA_EVENTS) video.addEventListener(event, mediaUpdate)
  video.addEventListener('error', fail)
  onStatus('loading')
  sync()

  return {
    sync,
    retry() {
      if (disposed) return
      clearWait()
      report('loading')
      // load() resets a stuck seek too; the next metadata event restores the
      // current scroll position instead of starting the scene from zero.
      video.load()
      sync()
    },
    destroy() {
      disposed = true
      clearWait()
      for (const event of MEDIA_EVENTS) video.removeEventListener(event, mediaUpdate)
      video.removeEventListener('error', fail)
    },
  }
}

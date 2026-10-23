import { useEffect, useState } from 'react'
import { ArkaMark } from '../shared/ui/ArkaMark'

type IntroPreloaderProps = {
  onReveal: () => void
  onComplete: () => void
}

const REVEAL_AT_MS = 5050
const COMPLETE_AT_MS = 6000

export function IntroPreloader({ onReveal, onComplete }: IntroPreloaderProps) {
  const [isExiting, setIsExiting] = useState(false)

  useEffect(() => {
    const previousOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'

    const revealTimer = window.setTimeout(() => {
      setIsExiting(true)
      onReveal()
    }, REVEAL_AT_MS)
    const completeTimer = window.setTimeout(onComplete, COMPLETE_AT_MS)

    return () => {
      window.clearTimeout(revealTimer)
      window.clearTimeout(completeTimer)
      document.body.style.overflow = previousOverflow
    }
  }, [onReveal, onComplete])

  const skip = () => {
    onReveal()
    onComplete()
  }

  return (
    <div className={`preloader ${isExiting ? 'preloader--exiting' : ''}`} role="dialog" aria-modal="true" aria-label="Загрузка сайта Арка 123">
      <button className="preloader-skip" type="button" onClick={skip}>Пропустить</button>
      <div className="preloader-lockup">
        <ArkaMark animated className="preloader-mark" />
        <div className="preloader-copy">
          <div className="preloader-title-wrap">
            <span className="preloader-title">АРКА 123</span>
          </div>
          <div className="preloader-tagline" aria-label="Встречаемся напротив Библиотеки.">
            <span>Встречаемся напротив</span>
            <span>Библиотеки.</span>
          </div>
        </div>
      </div>
    </div>
  )
}

import { useCallback, useEffect, useState } from 'react'
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import { MainLayout } from './MainLayout'
import { HomePage } from '../pages/HomePage'
import { NotFoundPage } from '../pages/NotFoundPage'
import { IntroPreloader } from '../widgets/IntroPreloader'

function prefersReducedMotion() {
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches
}

export function App() {
  const [showPreloader, setShowPreloader] = useState(() => !prefersReducedMotion())
  const [isRevealed, setIsRevealed] = useState(() => prefersReducedMotion())
  const revealSite = useCallback(() => setIsRevealed(true), [])
  const completeIntro = useCallback(() => setShowPreloader(false), [])

  useEffect(() => {
    if (showPreloader || window.location.hash !== '#arina-story') return
    const frame = requestAnimationFrame(() => document.getElementById('arina-story')?.scrollIntoView({ block: 'start', behavior: 'instant' }))
    return () => cancelAnimationFrame(frame)
  }, [showPreloader])

  return (
    <BrowserRouter>
      <div className={`site-frame ${isRevealed ? 'site-frame--revealed' : ''}`} inert={showPreloader} aria-hidden={showPreloader}>
        <Routes>
          <Route element={<MainLayout />}>
            <Route index element={<HomePage />} />
            <Route path="*" element={<NotFoundPage />} />
          </Route>
        </Routes>
      </div>
      {showPreloader && <IntroPreloader onReveal={revealSite} onComplete={completeIntro} />}
    </BrowserRouter>
  )
}

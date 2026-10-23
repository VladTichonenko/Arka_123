import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import '@fontsource-variable/manrope/wght.css'
import './shared/styles/global.css'
import './shared/styles/site.css'
import './shared/styles/intro.css'
import './shared/styles/experience.css'
import './shared/styles/footer.css'
import { App } from './app/App'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
)

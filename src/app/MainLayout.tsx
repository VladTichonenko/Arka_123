import { Outlet } from 'react-router-dom'
import { SiteFooter } from '../widgets/SiteFooter'
import { SiteHeader } from '../widgets/SiteHeader'
import { ManagerChat } from '../widgets/ManagerChat'

export function MainLayout() {
  return (
    <div className="app-shell">
      <SiteHeader />
      <main id="main-content" className="main-content">
        <Outlet />
      </main>
      <SiteFooter />
      <ManagerChat />
    </div>
  )
}

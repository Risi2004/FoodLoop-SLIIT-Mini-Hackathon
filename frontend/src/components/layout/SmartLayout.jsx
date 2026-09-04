import { Outlet } from 'react-router-dom'
import authService from '../../services/auth.service'
import Navbar from '../common/Navbar'
import Header from './Header'
import Footer from './Footer'
import './Layout.css'

/**
 * Uses role chrome when logged in; public Navbar + Footer otherwise.
 * For shared pages: About, Contact, Privacy, Terms, Receipt.
 */
export default function SmartLayout() {
  const role = (authService.getRole() || '').toUpperCase()
  const isRole = ['DRIVER', 'DONOR', 'RECEIVER'].includes(role)

  if (isRole) {
    return (
      <div className="fl-layout">
        <Header role={role} />
        <main className="fl-layout__main">
          <Outlet />
        </main>
        <Footer role={role} />
      </div>
    )
  }

  return (
    <div className="fl-layout fl-layout--public">
      <Navbar />
      <main className="fl-layout__main">
        <Outlet />
      </main>
      <Footer />
    </div>
  )
}

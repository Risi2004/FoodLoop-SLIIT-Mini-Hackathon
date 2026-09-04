import { Outlet } from 'react-router-dom'
import Header from './Header'
import Footer from './Footer'
import './Layout.css'

export default function Layout({ role = 'DRIVER' }) {
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

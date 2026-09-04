import { Outlet } from 'react-router-dom'
import Header from './Header'
import Footer from './Footer'
import './Layout.css'

export default function Layout() {
  return (
    <div className="fl-layout">
      <Header />
      <main className="fl-layout__main">
        <Outlet />
      </main>
      <Footer />
    </div>
  )
}

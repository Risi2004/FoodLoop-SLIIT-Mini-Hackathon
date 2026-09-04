import React, { useState, useEffect } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { ArrowRight, Menu, X } from 'lucide-react'
import Logo from '../Logo'
import './Navbar.css'

export default function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const location = useLocation()
  const isHome = location.pathname === '/'

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 30)
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  return (
    <header className={`navbar-header ${isScrolled ? 'scrolled' : ''}`}>
      <div className="navbar-container container">
        <Link to="/" className="navbar-brand" aria-label="FoodLoop home">
          <Logo />
        </Link>

        <nav className="navbar-links">
          {isHome ? (
            <>
              <a href="#home" className="nav-link active">Home</a>
              <a href="#about" className="nav-link">About us</a>
              <a href="#how-it-works" className="nav-link">How It Works</a>
              <a href="#contact" className="nav-link">Contact us</a>
            </>
          ) : (
            <>
              <Link to="/" className="nav-link">Home</Link>
              <Link to="/about" className="nav-link">About us</Link>
              <Link to="/#how-it-works" className="nav-link">How It Works</Link>
              <Link to="/contact" className="nav-link">Contact us</Link>
            </>
          )}
        </nav>

        <div className="navbar-actions">
          <Link to="/login" className="login-btn">
            <span>Login</span>
            <div className="login-btn-arrow">
              <ArrowRight size={15} />
            </div>
          </Link>

          <button
            className="mobile-menu-toggle"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label="Toggle navigation menu"
            type="button"
          >
            {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {mobileMenuOpen && (
        <div className="mobile-drawer">
          <Link to="/" onClick={() => setMobileMenuOpen(false)}>Home</Link>
          <Link to="/about" onClick={() => setMobileMenuOpen(false)}>About us</Link>
          <a href="#how-it-works" onClick={() => setMobileMenuOpen(false)}>How It Works</a>
          <Link to="/contact" onClick={() => setMobileMenuOpen(false)}>Contact us</Link>
          <Link to="/login" className="login-btn mobile" onClick={() => setMobileMenuOpen(false)}>
            <span>Login</span>
            <ArrowRight size={16} />
          </Link>
        </div>
      )}
    </header>
  )
}

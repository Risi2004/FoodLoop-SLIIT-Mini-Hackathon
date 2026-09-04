import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { ArrowRight, Leaf, Menu, X } from 'lucide-react';
import './Navbar.css';

export default function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 30) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const isHome = location.pathname === '/';

  return (
    <header className={`navbar-header ${isScrolled ? 'scrolled' : ''}`}>
      <div className="navbar-container container">
        {/* Brand Logo */}
        <Link to="/" className="navbar-brand">
          <div className="brand-icon-wrapper">
            <div className="brand-icon-ring">
              <Leaf className="brand-leaf-icon" size={20} />
            </div>
          </div>
          <div className="brand-text-block">
            <span className="brand-title">Food<span className="highlight">Loop</span></span>
            <span className="brand-tagline">Zero Waste, Infinite Impact</span>
          </div>
        </Link>

        {/* Desktop Nav Links */}
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
              <Link to="/#about" className="nav-link">About us</Link>
              <Link to="/#how-it-works" className="nav-link">How It Works</Link>
              <Link to="/#contact" className="nav-link">Contact us</Link>
            </>
          )}
        </nav>

        {/* Right CTA */}
        <div className="navbar-actions">
          <Link to="/login" className="login-btn">
            <span>Login</span>
            <div className="login-btn-arrow">
              <ArrowRight size={15} />
            </div>
          </Link>

          {/* Mobile Menu Toggle */}
          <button 
            className="mobile-menu-toggle"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label="Toggle navigation menu"
          >
            {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="mobile-drawer">
          <Link to="/" onClick={() => setMobileMenuOpen(false)}>Home</Link>
          <a href="#about" onClick={() => setMobileMenuOpen(false)}>About us</a>
          <a href="#how-it-works" onClick={() => setMobileMenuOpen(false)}>How It Works</a>
          <a href="#contact" onClick={() => setMobileMenuOpen(false)}>Contact us</a>
          <Link to="/login" className="login-btn mobile" onClick={() => setMobileMenuOpen(false)}>
            <span>Login</span>
            <ArrowRight size={16} />
          </Link>
        </div>
      )}
    </header>
  );
}

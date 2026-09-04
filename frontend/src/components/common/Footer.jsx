import React from 'react';
import { Leaf, MessageCircle } from 'lucide-react';
import './Footer.css';

export default function Footer() {
  return (
    <footer className="foodloop-footer">
      <div className="container">
        <div className="footer-main-grid">
          {/* Brand Info */}
          <div className="footer-brand-col">
            <div className="footer-brand-header">
              <div className="footer-logo-ring">
                <Leaf size={22} className="footer-leaf-icon" />
              </div>
              <div className="footer-brand-text">
                <span className="footer-title">Food<span className="highlight">Loop</span></span>
                <span className="footer-tagline">Zero Waste, Infinite Impact</span>
              </div>
            </div>
            
            <p className="footer-about-text">
              An AI-powered real-time food rescue ecosystem connecting surplus food from businesses and donors to verified NGOs and families in need.
            </p>

            {/* Social Icons */}
            <div className="footer-social-row">
              <span className="social-label">Follow us</span>
              <div className="social-icon-links">
                {/* WhatsApp */}
                <a href="#whatsapp" className="social-link" aria-label="WhatsApp">
                  <MessageCircle size={18} />
                </a>
                {/* Facebook */}
                <a href="#facebook" className="social-link" aria-label="Facebook">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"/>
                  </svg>
                </a>
                {/* Instagram */}
                <a href="#instagram" className="social-link" aria-label="Instagram">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <rect width="20" height="20" x="2" y="2" rx="5" ry="5"/>
                    <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/>
                    <line x1="17.5" x2="17.51" y1="6.5" y2="6.5"/>
                  </svg>
                </a>
                {/* Twitter / X */}
                <a href="#twitter" className="social-link" aria-label="Twitter">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-18 11.6 2.2.1 4.4-.6 6-2C3 15.5.5 9.6 3 5c2.2 2.6 5.6 4.1 9 4-.9-4.2 4-6.6 7-3.8 1.1 0 3-1.2 3-1.2z"/>
                  </svg>
                </a>
              </div>
            </div>
          </div>

          {/* Quick Links */}
          <div className="footer-links-col">
            <h4 className="footer-col-title">Quick Links</h4>
            <ul className="footer-nav-list">
              <li><a href="#home">Home</a></li>
              <li><a href="#about">About us</a></li>
              <li><a href="#how-it-works">How It Works</a></li>
              <li><a href="#contact">Contact us</a></li>
            </ul>
          </div>

          {/* Legal */}
          <div className="footer-links-col">
            <h4 className="footer-col-title">Legal</h4>
            <ul className="footer-nav-list">
              <li><a href="#privacy">Privacy Policy</a></li>
              <li><a href="#terms">Terms & Conditions</a></li>
              <li><a href="#safety">Food Safety Guidelines</a></li>
            </ul>
          </div>

          {/* Credit */}
          <div className="footer-credit-col">
            <div className="developed-by-box">
              <span className="dev-label">Designed & Developed by</span>
              <span className="dev-name">SE_015</span>
            </div>
          </div>
        </div>

        {/* Bottom Copyright */}
        <div className="footer-bottom-bar">
          <p>© 2026 FoodLoop. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}

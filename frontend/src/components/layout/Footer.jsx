import { Link } from 'react-router-dom'
import Logo from '../Logo'
import { PUBLIC_FOOTER_LINKS, getRoleConfig } from '../../config/navConfig'
import './Footer.css'

const LEGAL_LINKS = [
  { to: '/privacy', label: 'Privacy Policy' },
  { to: '/terms', label: 'Terms & Conditions' },
]

export default function Footer({ role = null }) {
  const quickLinks = role
    ? getRoleConfig(role).footerLinks
    : PUBLIC_FOOTER_LINKS

  return (
    <footer className="fl-footer">
      <div className="fl-footer__inner">
        <div className="fl-footer__brand">
          <div className="fl-footer__logo">
            <Logo />
          </div>
          <p className="fl-footer__desc">
            A high-tech, real-time digital ecosystem powered by Artificial
            Intelligence that bridges the critical gap between food surplus and
            food scarcity to build a sustainable circular economy.
          </p>
          <div className="fl-footer__social">
            <span>follow us</span>
            <div className="fl-footer__social-icons" aria-label="Social links">
              <a href="#" aria-label="WhatsApp">
                W
              </a>
              <a href="#" aria-label="Facebook">
                f
              </a>
              <a href="#" aria-label="Instagram">
                Ig
              </a>
              <a href="#" aria-label="X">
                X
              </a>
            </div>
          </div>
        </div>

        <div className="fl-footer__col">
          <h3>Quick Links</h3>
          <ul>
            {quickLinks.map(({ to, label }) => (
              <li key={`${to}-${label}`}>
                <Link to={to}>{label}</Link>
              </li>
            ))}
          </ul>
        </div>

        <div className="fl-footer__col">
          <h3>Legal</h3>
          <ul>
            {LEGAL_LINKS.map(({ to, label }) => (
              <li key={to}>
                <Link to={to}>{label}</Link>
              </li>
            ))}
          </ul>
        </div>

        <div className="fl-footer__credit">
          <p>
            Designed &amp; Developed by <strong>HyperNova</strong>
          </p>
        </div>
      </div>

      <div className="fl-footer__bottom">
        <p>© {new Date().getFullYear()} FoodLoop. All rights reserved.</p>
      </div>
    </footer>
  )
}

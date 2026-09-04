import { NavLink } from 'react-router-dom'
import Logo from '../Logo'
import './Header.css'

const NAV_LINKS = [
  { to: '/', label: 'Home', end: true },
  { to: '/about', label: 'About us' },
  { to: '/contact', label: 'Contact us' },
  { to: '/delivery', label: 'Delivery' },
  { to: '/my-pickups', label: 'MyPickups' },
]

export default function Header() {
  return (
    <header className="fl-header">
      <div className="fl-header__inner">
        <NavLink to="/" className="fl-header__brand" aria-label="FoodLoop home">
          <Logo />
        </NavLink>

        <nav className="fl-header__nav" aria-label="Main">
          {NAV_LINKS.map(({ to, label, end }) => (
            <NavLink
              key={to}
              to={to}
              end={end}
              className={({ isActive }) =>
                `fl-header__link${isActive ? ' is-active' : ''}`
              }
            >
              {label}
            </NavLink>
          ))}
        </nav>

        <div className="fl-header__actions">
          <NavLink
            to="/notifications"
            className="fl-header__icon-btn"
            aria-label="Notifications"
          >
            <svg viewBox="0 0 24 24" width="22" height="22" aria-hidden="true">
              <path
                fill="currentColor"
                d="M12 22a2.5 2.5 0 0 0 2.45-2h-4.9A2.5 2.5 0 0 0 12 22Zm8-6V11a8 8 0 1 0-16 0v5l-2 2v1h20v-1l-2-2Z"
              />
            </svg>
          </NavLink>

          <NavLink to="/profile" className="fl-header__profile">
            <span>User_Name</span>
            <span className="fl-header__avatar" aria-hidden="true">
              <svg viewBox="0 0 24 24" width="18" height="18">
                <path
                  fill="currentColor"
                  d="M12 12a4.5 4.5 0 1 0-4.5-4.5A4.5 4.5 0 0 0 12 12Zm0 2.25c-4 0-7.5 2-7.5 4.5V21h15v-2.25c0-2.5-3.5-4.5-7.5-4.5Z"
                />
              </svg>
            </span>
          </NavLink>
        </div>
      </div>
    </header>
  )
}

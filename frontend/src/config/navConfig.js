/** Role-aware navigation configs matching Figma designs */

export const DRIVER_NAV = [
  { to: '/driver', label: 'Home', end: true },
  { to: '/about', label: 'About us' },
  { to: '/contact', label: 'Contact us' },
  { to: '/delivery', label: 'Delivery' },
  { to: '/my-pickups', label: 'MyPickups' },
]

export const DONOR_NAV = [
  { to: '/donor', label: 'Home', end: true },
  { to: '/about', label: 'About us' },
  { to: '/contact', label: 'Contact us' },
  { to: '/donor/donations', label: 'MyDonation' },
]

export const RECEIVER_NAV = [
  { to: '/receiver', label: 'Home', end: true },
  { to: '/about', label: 'About us' },
  { to: '/contact', label: 'Contact us' },
  { to: '/receiver/find', label: 'FindFood' },
  { to: '/receiver/claims', label: 'MyClaims' },
]

export const PUBLIC_FOOTER_LINKS = [
  { to: '/', label: 'Home' },
  { to: '/about', label: 'About Us' },
  { to: '/contact', label: 'Contact Us' },
]

export const ROLE_CONFIG = {
  DRIVER: {
    home: '/driver',
    profile: '/profile',
    notifications: '/notifications',
    nav: DRIVER_NAV,
    footerLinks: DRIVER_NAV.map(({ to, label }) => ({ to, label })),
  },
  DONOR: {
    home: '/donor',
    profile: '/donor/profile',
    notifications: '/donor/notifications',
    nav: DONOR_NAV,
    footerLinks: DONOR_NAV.map(({ to, label }) => ({ to, label })),
  },
  RECEIVER: {
    home: '/receiver',
    profile: '/receiver/profile',
    notifications: '/receiver/notifications',
    nav: RECEIVER_NAV,
    footerLinks: RECEIVER_NAV.map(({ to, label }) => ({ to, label })),
  },
}

export function getRoleConfig(role) {
  const key = (role || '').toUpperCase()
  return ROLE_CONFIG[key] || ROLE_CONFIG.DRIVER
}

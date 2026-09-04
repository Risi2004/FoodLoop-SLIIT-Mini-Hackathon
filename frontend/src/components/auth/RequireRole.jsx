import { Navigate, Outlet, useLocation } from 'react-router-dom'
import authService from '../../services/auth.service'

/**
 * Gate a route subtree behind authentication and an allowed role.
 * `redirectTo` receives the attempted location so login can bounce back.
 */
export default function RequireRole({ allow = [], redirectTo = '/login' }) {
  const location = useLocation()

  if (!authService.isAuthenticated()) {
    return <Navigate to={redirectTo} state={{ from: location }} replace />
  }

  const role = (authService.getRole() || '').toUpperCase()
  const allowed = allow.map((value) => value.toUpperCase())

  if (allowed.length > 0 && !allowed.includes(role)) {
    return <Navigate to={authService.getDashboardPath(role)} replace />
  }

  return <Outlet />
}

/**
 * Resolve API server root (no trailing /api).
 * Supports Vercel `VITE_API_BASE_URL` (.../api) and local `VITE_API_URL` (server root).
 */
function resolveApiRoot() {
  const explicit = import.meta.env.VITE_API_BASE_URL
  const root = import.meta.env.VITE_API_URL

  let base = explicit || root || 'http://localhost:5000'
  base = String(base).replace(/\/+$/, '')

  if (base.endsWith('/api')) {
    base = base.slice(0, -4)
  }

  return base || 'http://localhost:5000'
}

const API_URL = resolveApiRoot()

function getAuthToken() {
  return (
    localStorage.getItem('foodloop_token') ||
    localStorage.getItem('token') ||
    ''
  )
}

export async function apiRequest(path, options = {}) {
  const token = getAuthToken()
  const normalizedPath = path.startsWith('/') ? path : `/${path}`
  const response = await fetch(`${API_URL}${normalizedPath}`, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...(options.headers || {}),
    },
  })

  const data = await response.json().catch(() => ({}))

  if (!response.ok) {
    throw new Error(data.message || data.error || `Request failed (${response.status})`)
  }

  return data
}

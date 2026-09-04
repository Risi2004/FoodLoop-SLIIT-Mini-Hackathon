const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000'

function getAuthToken() {
  return (
    localStorage.getItem('foodloop_token') ||
    localStorage.getItem('token') ||
    ''
  )
}

export async function apiRequest(path, options = {}) {
  const token = getAuthToken()
  const response = await fetch(`${API_URL}${path}`, {
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

import axios from 'axios'

function resolveApiBase() {
  const explicit = import.meta.env.VITE_API_BASE_URL
  const root = import.meta.env.VITE_API_URL
  let base = explicit || (root ? `${root}/api` : '/api')
  base = String(base).replace(/\/+$/, '')
  if (!base.endsWith('/api') && !base.startsWith('/')) {
    base = `${base}/api`
  }
  return base
}

const axiosInstance = axios.create({
  baseURL: resolveApiBase(),
  headers: {
    'Content-Type': 'application/json',
  },
})

axiosInstance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('foodloop_token') || localStorage.getItem('token')
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  (error) => Promise.reject(error)
)

export default axiosInstance

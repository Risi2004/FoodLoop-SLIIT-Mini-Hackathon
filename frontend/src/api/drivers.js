import { apiRequest } from './client'

const DRIVER_CACHE_KEY = 'foodloop_driver_id'

export function getDriver(driverId) {
  return apiRequest(`/api/drivers/${driverId}`)
}

export function updateDriver(driverId, payload) {
  return apiRequest(`/api/drivers/${driverId}`, {
    method: 'PATCH',
    body: JSON.stringify(payload),
  })
}

export async function getMyDriver() {
  const driver = await apiRequest('/api/drivers/me')
  if (driver?._id) {
    sessionStorage.setItem(DRIVER_CACHE_KEY, driver._id)
  }
  return driver
}

export function updateMyDriver(payload) {
  return apiRequest('/api/drivers/me', {
    method: 'PATCH',
    body: JSON.stringify(payload),
  })
}

export async function resolveDriverId() {
  const cached = sessionStorage.getItem(DRIVER_CACHE_KEY)
  if (cached) return cached

  const driver = await getMyDriver()
  if (!driver?._id) {
    throw new Error('No driver profile found for this account. Please log in as a registered driver.')
  }
  return driver._id
}

export function clearDriverCache() {
  sessionStorage.removeItem(DRIVER_CACHE_KEY)
}

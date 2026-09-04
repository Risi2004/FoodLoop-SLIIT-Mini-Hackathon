import { apiRequest, getDriverId } from './client'

export function getAvailablePickups() {
  return apiRequest('/api/pickups/available')
}

export function confirmPickup(pickupId) {
  const driverId = getDriverId()
  if (!driverId) {
    return Promise.reject(
      new Error('VITE_DRIVER_ID is missing. Run backend seed and set it in frontend/.env')
    )
  }

  return apiRequest(`/api/pickups/${pickupId}/confirm`, {
    method: 'POST',
    body: JSON.stringify({ driverId }),
  })
}

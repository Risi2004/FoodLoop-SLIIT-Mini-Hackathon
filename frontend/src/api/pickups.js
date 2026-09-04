import { apiRequest, getDriverId } from './client'

function requireDriverId() {
  const driverId = getDriverId()
  if (!driverId) {
    throw new Error(
      'VITE_DRIVER_ID is missing. Run backend seed and set it in frontend/.env'
    )
  }
  return driverId
}

export function getAvailablePickups() {
  return apiRequest('/api/pickups/available')
}

export function confirmPickup(pickupId) {
  const driverId = requireDriverId()

  return apiRequest(`/api/pickups/${pickupId}/confirm`, {
    method: 'POST',
    body: JSON.stringify({ driverId }),
  })
}

export function getMyPickups() {
  const driverId = requireDriverId()
  return apiRequest(`/api/pickups/my/${driverId}`)
}

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

export function updateDriverLocation(pickupId, { lat, lng }) {
  const driverId = requireDriverId()

  return apiRequest(`/api/pickups/${pickupId}/location`, {
    method: 'PATCH',
    body: JSON.stringify({ driverId, lat, lng }),
  })
}

export function completePickup(pickupId) {
  const driverId = requireDriverId()

  return apiRequest(`/api/pickups/${pickupId}/complete`, {
    method: 'POST',
    body: JSON.stringify({ driverId }),
  })
}

export function getMyPickups() {
  const driverId = requireDriverId()
  return apiRequest(`/api/pickups/my/${driverId}`)
}

export function getTracking(trackingId) {
  return apiRequest(`/api/pickups/tracking/${trackingId}`)
}

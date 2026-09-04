import { apiRequest } from './client'
import { resolveDriverId } from './drivers'

export function getAvailablePickups() {
  return apiRequest('/api/pickups/available')
}

export async function confirmPickup(pickupId) {
  const driverId = await resolveDriverId()

  return apiRequest(`/api/pickups/${pickupId}/confirm`, {
    method: 'POST',
    body: JSON.stringify({ driverId }),
  })
}

export async function updateDriverLocation(pickupId, { lat, lng }) {
  const driverId = await resolveDriverId()

  return apiRequest(`/api/pickups/${pickupId}/location`, {
    method: 'PATCH',
    body: JSON.stringify({ driverId, lat, lng }),
  })
}

export async function completePickup(pickupId) {
  const driverId = await resolveDriverId()

  return apiRequest(`/api/pickups/${pickupId}/complete`, {
    method: 'POST',
    body: JSON.stringify({ driverId }),
  })
}

export async function getMyPickups() {
  const driverId = await resolveDriverId()
  return apiRequest(`/api/pickups/my/${driverId}`)
}

export function getTracking(trackingId) {
  return apiRequest(`/api/pickups/tracking/${trackingId}`)
}

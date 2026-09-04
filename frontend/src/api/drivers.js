import { apiRequest } from './client'

export function getDriver(driverId) {
  return apiRequest(`/api/drivers/${driverId}`)
}

export function updateDriver(driverId, payload) {
  return apiRequest(`/api/drivers/${driverId}`, {
    method: 'PATCH',
    body: JSON.stringify(payload),
  })
}

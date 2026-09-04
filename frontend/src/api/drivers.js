import { apiRequest } from './client'

export function getDriver(driverId) {
  return apiRequest(`/api/drivers/${driverId}`)
}

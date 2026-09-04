import FoodLoopMap, { DEMO_POINTS } from '../map/FoodLoopMap'
import './TrackingMap.css'

function buildRoutePoints(pickup) {
  if (!pickup) {
    return [DEMO_POINTS.pickup, DEMO_POINTS.driver, DEMO_POINTS.dropoff]
  }

  const points = []
  if (pickup.pickupLocation) {
    points.push({ ...pickup.pickupLocation, label: 'Pickup' })
  }
  if (pickup.driverLocation) {
    points.push({ ...pickup.driverLocation, label: 'Driver' })
  }
  if (pickup.dropoffLocation) {
    points.push({ ...pickup.dropoffLocation, label: 'Drop-off' })
  }

  return points.length
    ? points
    : [DEMO_POINTS.pickup, DEMO_POINTS.driver, DEMO_POINTS.dropoff]
}

export default function TrackingMap({ pickup = null }) {
  const points = buildRoutePoints(pickup)
  const center = pickup?.driverLocation || pickup?.pickupLocation || DEMO_POINTS.driver

  return (
    <section className="tracking-map" aria-label="Live delivery map">
      <div className="tracking-map__canvas">
        <FoodLoopMap center={center} points={points} showRoute />
      </div>
    </section>
  )
}

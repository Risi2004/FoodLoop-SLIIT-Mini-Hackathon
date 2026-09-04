import FoodLoopMap, { DEMO_POINTS } from '../map/FoodLoopMap'
import './TrackingMap.css'

function buildRoutePoints(pickup, liveDriver = null) {
  if (!pickup && !liveDriver) {
    return [DEMO_POINTS.pickup, DEMO_POINTS.driver, DEMO_POINTS.dropoff]
  }

  const points = []
  const pickupLoc = pickup?.pickupLocation
  const dropoffLoc = pickup?.dropoffLocation
  const driverLoc = liveDriver || pickup?.driverLocation

  if (pickupLoc) points.push({ ...pickupLoc, label: 'Pickup' })
  if (driverLoc) points.push({ ...driverLoc, label: 'Driver (live)' })
  if (dropoffLoc) points.push({ ...dropoffLoc, label: 'Drop-off' })

  return points.length
    ? points
    : [DEMO_POINTS.pickup, DEMO_POINTS.driver, DEMO_POINTS.dropoff]
}

export default function TrackingMap({ pickup = null, liveDriver = null }) {
  const points = buildRoutePoints(pickup, liveDriver)
  const center =
    liveDriver ||
    pickup?.driverLocation ||
    pickup?.pickupLocation ||
    DEMO_POINTS.driver

  return (
    <section className="tracking-map" aria-label="Live delivery map">
      <div className="tracking-map__live-badge">Live tracking</div>
      <div className="tracking-map__canvas">
        <FoodLoopMap
          mapId={`tracking-${pickup?.trackingId || 'demo'}`}
          center={center}
          points={points}
          showRoute
          followDriver={Boolean(liveDriver || pickup?.status === 'in_transit')}
        />
      </div>
    </section>
  )
}

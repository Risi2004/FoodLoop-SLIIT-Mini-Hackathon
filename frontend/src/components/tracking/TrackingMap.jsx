import FoodLoopMap, { DEMO_POINTS } from '../map/FoodLoopMap'
import './TrackingMap.css'

export default function TrackingMap() {
  return (
    <section className="tracking-map" aria-label="Live delivery map">
      <div className="tracking-map__canvas">
        <FoodLoopMap
          center={DEMO_POINTS.driver}
          points={[DEMO_POINTS.pickup, DEMO_POINTS.driver, DEMO_POINTS.dropoff]}
        />
      </div>
    </section>
  )
}

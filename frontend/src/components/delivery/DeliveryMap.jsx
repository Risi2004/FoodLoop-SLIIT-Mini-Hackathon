import FoodLoopMap, { DEMO_POINTS } from '../map/FoodLoopMap'
import './DeliveryMap.css'

export default function DeliveryMap({ currentLocation = 'Gampaha, Sri Lanka' }) {
  return (
    <section className="delivery-map" aria-label="Delivery map">
      <div className="delivery-map__location">
        <svg viewBox="0 0 24 24" width="16" height="16" aria-hidden="true">
          <path
            fill="currentColor"
            d="M12 2a7 7 0 0 0-7 7c0 5.25 7 13 7 13s7-7.75 7-13a7 7 0 0 0-7-7Zm0 9.5A2.5 2.5 0 1 1 14.5 9 2.5 2.5 0 0 1 12 11.5Z"
          />
        </svg>
        <span>
          Current Location: <strong>{currentLocation}</strong>
        </span>
      </div>

      <div className="delivery-map__canvas">
        <FoodLoopMap
          center={DEMO_POINTS.driver}
          points={[DEMO_POINTS.pickup, DEMO_POINTS.driver, DEMO_POINTS.dropoff]}
        />
      </div>
    </section>
  )
}

import { Link } from 'react-router-dom'
import './InTransitBanner.css'

export default function InTransitBanner({ pickup }) {
  if (!pickup) return null

  return (
    <section className="in-transit">
      <div className="in-transit__bg" aria-hidden="true" />

      <article className="in-transit__card">
        <div className="in-transit__card-top">
          <span className="in-transit__status">{pickup.status}</span>
          <Link
            to={`/tracking/${pickup.trackingId}`}
            className="in-transit__map-link"
          >
            <svg viewBox="0 0 24 24" width="16" height="16" aria-hidden="true">
              <path
                fill="currentColor"
                d="M12 2a7 7 0 0 0-7 7c0 5.25 7 13 7 13s7-7.75 7-13a7 7 0 0 0-7-7Zm0 9.5A2.5 2.5 0 1 1 14.5 9 2.5 2.5 0 0 1 12 11.5Z"
              />
            </svg>
            Live Track
          </Link>
        </div>

        <h3>{pickup.donorName}</h3>
        <p className="in-transit__meta">
          {pickup.itemLabel} • {pickup.weightKg} kg
        </p>
        <p className="in-transit__distance">{pickup.distanceKm}km away</p>
        <p className="in-transit__eta">
          <svg viewBox="0 0 24 24" width="15" height="15" aria-hidden="true">
            <path
              fill="currentColor"
              d="M12 2a10 10 0 1 0 10 10A10 10 0 0 0 12 2Zm1 10.6V7h-2v7h6v-2Z"
            />
          </svg>
          ETA {pickup.etaMinutes}m
        </p>
        <Link to={`/tracking/${pickup.trackingId}`} className="in-transit__cta">
          Open live map & complete delivery
        </Link>
      </article>
    </section>
  )
}

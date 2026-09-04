import './HistoryCard.css'

export default function HistoryCard({ pickup }) {
  return (
    <article className="history-card">
      <div className="history-card__top">
        <span className="history-card__status">
          <svg viewBox="0 0 24 24" width="14" height="14" aria-hidden="true">
            <path
              fill="currentColor"
              d="M9.5 16.2 5.8 12.5l1.4-1.4 2.3 2.3 5.8-5.8 1.4 1.4Z"
            />
          </svg>
          Supplied
        </span>
        <span className="history-card__distance">
          {pickup.distanceKm}km Distance
        </span>
      </div>

      <h3>{pickup.donorName}</h3>
      <p className="history-card__meta">
        {pickup.itemLabel} • {pickup.weightKg} kg
      </p>
      <p className="history-card__when">{pickup.deliveredLabel}</p>
    </article>
  )
}

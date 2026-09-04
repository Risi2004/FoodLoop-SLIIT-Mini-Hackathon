import './PickupCard.css'

export default function PickupCard({ pickup, onConfirm, confirming = false }) {
  const {
    donorName,
    itemLabel,
    weightKg,
    distanceKm,
    expiresInMinutes,
  } = pickup

  return (
    <article className="pickup-card">
      <div className="pickup-card__top">
        <h3 className="pickup-card__title">{donorName}</h3>
        <span className="pickup-card__distance">{distanceKm}km away</span>
      </div>

      <p className="pickup-card__meta">
        {itemLabel} • {weightKg} kg
      </p>

      {expiresInMinutes !== null && expiresInMinutes !== undefined && (
        <p className="pickup-card__expiry">
          <svg viewBox="0 0 24 24" width="16" height="16" aria-hidden="true">
            <path
              fill="currentColor"
              d="M12 2a10 10 0 1 0 10 10A10 10 0 0 0 12 2Zm1 10.6V7h-2v7h6v-2Z"
            />
          </svg>
          Expires in {expiresInMinutes}m
        </p>
      )}

      <button
        type="button"
        className="pickup-card__confirm"
        disabled={confirming}
        onClick={(event) => {
          event.stopPropagation()
          onConfirm?.(pickup)
        }}
      >
        <svg viewBox="0 0 24 24" width="18" height="18" aria-hidden="true">
          <path
            fill="currentColor"
            d="M3 7h11v8H3Zm12 2h2.2l2.3 3H20v3h-1.1a2.5 2.5 0 0 1-4.8 0H9.9a2.5 2.5 0 0 1-4.8 0H3v-1h17v-4.2L17.8 9H15Zm-9.5 8.5A1.5 1.5 0 1 0 7 17a1.5 1.5 0 0 0-1.5 1.5Zm9 0A1.5 1.5 0 1 0 16 17a1.5 1.5 0 0 0-1.5 1.5Z"
          />
        </svg>
        {confirming ? 'Confirming...' : 'Confirm pickup'}
      </button>
    </article>
  )
}

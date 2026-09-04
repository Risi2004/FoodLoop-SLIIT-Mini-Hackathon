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
        <div className="delivery-map__grid" aria-hidden="true" />

        <div className="delivery-map__route delivery-map__route--long">
          <span>1.5KM</span>
        </div>
        <div className="delivery-map__route delivery-map__route--short">
          <span>0.5KM</span>
        </div>

        <div className="delivery-map__pin delivery-map__pin--donor" title="Pickup">
          <svg viewBox="0 0 24 24" width="18" height="18" aria-hidden="true">
            <path
              fill="currentColor"
              d="M4 8h16v11H4Zm2-4h4l1 2h6l1-2h2v2H4V4Z"
            />
          </svg>
        </div>
        <div className="delivery-map__pin delivery-map__pin--driver" title="Driver">
          <svg viewBox="0 0 24 24" width="18" height="18" aria-hidden="true">
            <path
              fill="currentColor"
              d="M3 7h11v8H3Zm12 2h2.2l2.3 3H20v3h-1.1a2.5 2.5 0 0 1-4.8 0H9.9a2.5 2.5 0 0 1-4.8 0H3v-1h17v-4.2L17.8 9H15Z"
            />
          </svg>
        </div>
        <div className="delivery-map__pin delivery-map__pin--receiver" title="Drop-off">
          <svg viewBox="0 0 24 24" width="18" height="18" aria-hidden="true">
            <path
              fill="currentColor"
              d="M12 2a7 7 0 0 0-7 7c0 5.25 7 13 7 13s7-7.75 7-13a7 7 0 0 0-7-7Zm0 9.5A2.5 2.5 0 1 1 14.5 9 2.5 2.5 0 0 1 12 11.5Z"
            />
          </svg>
        </div>

        <div className="delivery-map__zoom" role="group" aria-label="Zoom controls">
          <button type="button" aria-label="Zoom in">
            +
          </button>
          <button type="button" aria-label="Zoom out">
            −
          </button>
        </div>
      </div>
    </section>
  )
}

import './TrackingMap.css'

export default function TrackingMap() {
  return (
    <section className="tracking-map" aria-label="Live delivery map">
      <div className="tracking-map__canvas">
        <div className="tracking-map__grid" aria-hidden="true" />
        <div className="tracking-map__route" aria-hidden="true" />

        <div className="tracking-map__pin tracking-map__pin--start" title="Pickup">
          <svg viewBox="0 0 24 24" width="16" height="16" aria-hidden="true">
            <path
              fill="currentColor"
              d="M12 2a7 7 0 0 0-7 7c0 5.25 7 13 7 13s7-7.75 7-13a7 7 0 0 0-7-7Zm0 9.5A2.5 2.5 0 1 1 14.5 9 2.5 2.5 0 0 1 12 11.5Z"
            />
          </svg>
        </div>

        <div className="tracking-map__pin tracking-map__pin--driver" title="Driver">
          <svg viewBox="0 0 24 24" width="18" height="18" aria-hidden="true">
            <path
              fill="currentColor"
              d="M5 16a2 2 0 1 0 2 2 2 2 0 0 0-2-2Zm10 0a2 2 0 1 0 2 2 2 2 0 0 0-2-2ZM4 9h9l1.5 3H19v4h-1.1a3 3 0 0 0-5.8 0H9.9a3 3 0 0 0-5.8 0H3v-2.5A4.5 4.5 0 0 1 4 9Z"
            />
          </svg>
        </div>

        <div className="tracking-map__pin tracking-map__pin--end" title="Drop-off">
          <svg viewBox="0 0 24 24" width="16" height="16" aria-hidden="true">
            <path
              fill="currentColor"
              d="M12 2a7 7 0 0 0-7 7c0 5.25 7 13 7 13s7-7.75 7-13a7 7 0 0 0-7-7Zm0 9.5A2.5 2.5 0 1 1 14.5 9 2.5 2.5 0 0 1 12 11.5Z"
            />
          </svg>
        </div>

        <div className="tracking-map__zoom" role="group" aria-label="Zoom controls">
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

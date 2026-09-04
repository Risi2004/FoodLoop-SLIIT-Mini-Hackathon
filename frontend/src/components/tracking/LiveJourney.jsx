import './LiveJourney.css'

export default function LiveJourney({ steps }) {
  return (
    <article className="live-journey">
      <div className="live-journey__head">
        <h3>Live Journey</h3>
        <svg viewBox="0 0 24 24" width="18" height="18" aria-hidden="true">
          <path
            fill="currentColor"
            d="M12 3a9 9 0 1 0 9 9h-2a7 7 0 1 1-7-7V3Zm1 0v8h8a9 9 0 0 0-8-8Z"
          />
        </svg>
      </div>

      <ol className="live-journey__list">
        {steps.map((step) => (
          <li
            key={step.id}
            className={`live-journey__step live-journey__step--${step.tone} is-${step.status}`}
          >
            <span className="live-journey__dot" aria-hidden="true" />
            <div className="live-journey__content">
              <div className="live-journey__title-row">
                <strong>{step.title}</strong>
                {step.badge && (
                  <span className="live-journey__badge">{step.badge}</span>
                )}
              </div>
              <p>{step.detail}</p>
              <time>{step.time}</time>
            </div>
          </li>
        ))}
      </ol>
    </article>
  )
}

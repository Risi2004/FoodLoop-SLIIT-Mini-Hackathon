import './ImpactProgress.css'

export default function ImpactProgress({
  current,
  goal,
  badge = 'Community Hero',
}) {
  const percent = Math.min(100, Math.round((current / goal) * 100))
  const remaining = Math.max(0, goal - current)

  return (
    <article className="impact-progress">
      <div className="impact-progress__head">
        <h3>Your Impact Progress</h3>
        <span className="impact-progress__badge">{badge}</span>
      </div>

      <div className="impact-progress__row">
        <span className="impact-progress__star" aria-hidden="true">
          <svg viewBox="0 0 24 24" width="22" height="22">
            <path
              fill="currentColor"
              d="m12 2 2.9 6.3L22 9.3l-5 4.9 1.2 7-6.2-3.3L5.8 21 7 14.2 2 9.3l7.1-1L12 2Z"
            />
          </svg>
        </span>
        <div className="impact-progress__bar-wrap">
          <div className="impact-progress__meta">
            <span>
              {current}/{goal} Pickups Completed
            </span>
            <strong>{percent}%</strong>
          </div>
          <div
            className="impact-progress__track"
            role="progressbar"
            aria-valuenow={percent}
            aria-valuemin={0}
            aria-valuemax={100}
          >
            <div
              className="impact-progress__fill"
              style={{ width: `${percent}%` }}
            />
          </div>
        </div>
      </div>

      <p className="impact-progress__note">
        Just {remaining} more pickup{remaining === 1 ? '' : 's'} to earn your
        next badge!
      </p>
    </article>
  )
}

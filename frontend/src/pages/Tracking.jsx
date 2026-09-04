import { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { getTracking } from '../api/pickups'
import TrackingMap from '../components/tracking/TrackingMap'
import LiveJourney from '../components/tracking/LiveJourney'
import ImpactProgress from '../components/pickups/ImpactProgress'
import './Tracking.css'

export default function Tracking() {
  const { id } = useParams()
  const [pickup, setPickup] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    let active = true

    async function load() {
      setLoading(true)
      setError('')
      try {
        const data = await getTracking(id)
        if (!active) return
        setPickup(data)
      } catch (err) {
        if (!active) return
        setError(err.message || 'Failed to load tracking')
      } finally {
        if (active) setLoading(false)
      }
    }

    load()
    return () => {
      active = false
    }
  }, [id])

  const driver = pickup?.driver || {}
  const stats = driver.stats || {}
  const journey = (pickup?.journey || []).map((step, index) => ({
    id: `step-${index}`,
    title: step.title,
    detail: step.detail,
    time: step.timeLabel,
    status: step.status,
    tone: step.tone,
    badge: step.badge,
  }))

  return (
    <div className="page tracking-page">
      <div className="tracking-shell">
        <div className="tracking-shell__top">
          <div>
            <Link to="/my-pickups" className="tracking-shell__back">
              <svg viewBox="0 0 24 24" width="16" height="16" aria-hidden="true">
                <path
                  fill="currentColor"
                  d="M14.7 6.3 9 12l5.7 5.7 1.4-1.4L11.8 12l4.3-4.3Z"
                />
              </svg>
              Back to My pickups
            </Link>
            <p className="tracking-shell__id">
              Tracking ID:{' '}
              <strong>#{pickup?.trackingId || id}</strong>
            </p>
          </div>

          <button type="button" className="tracking-shell__help">
            Get Help
          </button>
        </div>

        {error && <p className="tracking-shell__error">{error}</p>}
        {loading && <p className="tracking-shell__status">Loading tracking...</p>}

        {!loading && pickup && (
          <div className="tracking-shell__body">
            <TrackingMap pickup={pickup} />

            <aside className="tracking-panel">
              <article className="tracking-card">
                <div className="tracking-card__row">
                  <div>
                    <p className="tracking-card__label">Current Location</p>
                    <p className="tracking-card__value">
                      {pickup.distanceKm}km to recipient (
                      {pickup.recipientLabel || 'Destination'})
                    </p>
                  </div>
                  <div className="tracking-card__driver">
                    <span className="tracking-card__avatar" aria-hidden="true">
                      <svg viewBox="0 0 24 24" width="18" height="18">
                        <path
                          fill="currentColor"
                          d="M12 12a4.5 4.5 0 1 0-4.5-4.5A4.5 4.5 0 0 0 12 12Zm0 2.25c-4 0-7.5 2-7.5 4.5V21h15v-2.25c0-2.5-3.5-4.5-7.5-4.5Z"
                        />
                      </svg>
                    </span>
                    <div>
                      <strong>{driver.name || 'Driver'}</strong>
                      <span>({driver.role || 'Volunteer'})</span>
                    </div>
                  </div>
                </div>

                <div className="tracking-card__meta-grid">
                  <p>
                    <span>Vehicle Type</span>
                    <strong>{driver.vehicleType || 'scooter'}</strong>
                  </p>
                  <p>
                    <span>Vehicle Number</span>
                    <strong>{driver.vehicleNumber || '—'}</strong>
                  </p>
                </div>
              </article>

              <article className="tracking-card tracking-card--item">
                <div className="tracking-card__item-media" aria-hidden="true" />
                <div>
                  <h3>
                    {pickup.itemLabel} ({pickup.weightKg} kg)
                  </h3>
                  <p>From {pickup.donorName}</p>
                  <span className="tracking-card__chip">
                    Status: {pickup.status}
                  </span>
                </div>
              </article>

              <LiveJourney steps={journey} />

              <ImpactProgress
                current={stats.impactCurrent ?? 0}
                goal={stats.impactGoal ?? 15}
                badge={stats.impactBadge ?? 'Community Hero'}
              />
            </aside>
          </div>
        )}
      </div>
    </div>
  )
}

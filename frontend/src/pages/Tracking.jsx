import { Link, useParams } from 'react-router-dom'
import { trackingDetails } from '../data/mockTracking'
import { driverStats } from '../data/mockDriverPickups'
import TrackingMap from '../components/tracking/TrackingMap'
import LiveJourney from '../components/tracking/LiveJourney'
import ImpactProgress from '../components/pickups/ImpactProgress'
import './Tracking.css'

export default function Tracking() {
  const { id } = useParams()
  const tracking = trackingDetails[id] ?? trackingDetails['FL-8829-01']

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
              Tracking ID: <strong>#{tracking.trackingId}</strong>
            </p>
          </div>

          <button type="button" className="tracking-shell__help">
            <svg viewBox="0 0 24 24" width="18" height="18" aria-hidden="true">
              <path
                fill="currentColor"
                d="M12 2a7 7 0 0 0-7 7v2H4v8h16v-8h-1V9a7 7 0 0 0-7-7Zm-3 9h6v1.5a3 3 0 0 1-6 0V11Zm3 9a2 2 0 0 1-2-2h4a2 2 0 0 1-2 2Z"
              />
            </svg>
            Get Help
          </button>
        </div>

        <div className="tracking-shell__body">
          <TrackingMap />

          <aside className="tracking-panel">
            <article className="tracking-card">
              <div className="tracking-card__row">
                <div>
                  <p className="tracking-card__label">Current Location</p>
                  <p className="tracking-card__value">
                    {tracking.distanceToRecipient} to recipient (
                    {tracking.recipientLabel})
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
                    <strong>{tracking.driver.name}</strong>
                    <span>({tracking.driver.role})</span>
                  </div>
                </div>
              </div>

              <div className="tracking-card__meta-grid">
                <p>
                  <span>Vehicle Type</span>
                  <strong>{tracking.vehicleType}</strong>
                </p>
                <p>
                  <span>Vehicle Number</span>
                  <strong>{tracking.vehicleNumber}</strong>
                </p>
              </div>
            </article>

            <article className="tracking-card tracking-card--item">
              <div className="tracking-card__item-media" aria-hidden="true" />
              <div>
                <h3>
                  {tracking.item.name} ({tracking.item.quantityLabel})
                </h3>
                <p>Claimed by {tracking.item.claimedBy}</p>
                <span className="tracking-card__chip">
                  {tracking.item.availableLabel}
                </span>
              </div>
            </article>

            <LiveJourney steps={tracking.journey} />

            <ImpactProgress
              current={driverStats.impactCurrent}
              goal={driverStats.impactGoal}
              badge={driverStats.impactBadge}
            />
          </aside>
        </div>
      </div>
    </div>
  )
}

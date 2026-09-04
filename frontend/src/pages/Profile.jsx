import { Link } from 'react-router-dom'
import { driverProfile } from '../data/mockDriverProfile'
import {
  completedPickups,
  driverStats,
} from '../data/mockDriverPickups'
import StatCard from '../components/pickups/StatCard'
import ImpactProgress from '../components/pickups/ImpactProgress'
import HistoryCard from '../components/pickups/HistoryCard'
import './Profile.css'

const truckIcon = (
  <svg viewBox="0 0 24 24" width="18" height="18">
    <path
      fill="currentColor"
      d="M3 7h11v8H3Zm12 2h2.2l2.3 3H20v3h-1.1a2.5 2.5 0 0 1-4.8 0H9.9a2.5 2.5 0 0 1-4.8 0H3v-1h17v-4.2L17.8 9H15Z"
    />
  </svg>
)

const routeIcon = (
  <svg viewBox="0 0 24 24" width="18" height="18">
    <path
      fill="currentColor"
      d="M6 4a3 3 0 1 1-2 5.8V12a4 4 0 0 0 4 4h4a6 6 0 0 1 6 6v.2a3 3 0 1 1-2 0V18a4 4 0 0 0-4-4H8a6 6 0 0 1-6-6V9.8A3 3 0 0 1 6 4Z"
    />
  </svg>
)

const mealsIcon = (
  <svg viewBox="0 0 24 24" width="18" height="18">
    <path
      fill="currentColor"
      d="M7 2v9a3 3 0 0 0 2 2.8V22h2V13.8A3 3 0 0 0 13 11V2h-2v9h-2V2Zm10 0c-1.7 2.5-2 4.8-2 8 0 2.2.6 3.8 2 5v7h2V2Z"
    />
  </svg>
)

export default function Profile() {
  const recentMissions = completedPickups.slice(0, 3)

  return (
    <div className="page profile-page">
      <section className="profile-hero">
        <div className="profile-hero__identity">
          <div className="profile-hero__avatar" aria-hidden="true">
            <svg viewBox="0 0 24 24" width="48" height="48">
              <path
                fill="currentColor"
                d="M12 12a4.5 4.5 0 1 0-4.5-4.5A4.5 4.5 0 0 0 12 12Zm0 2.25c-4 0-7.5 2-7.5 4.5V21h15v-2.25c0-2.5-3.5-4.5-7.5-4.5Z"
              />
            </svg>
          </div>
          <div>
            <h1>{driverProfile.name}</h1>
            <p>
              {driverProfile.role} • {driverProfile.joinedLabel}
            </p>
            <Link to="/profile/edit" className="profile-hero__edit">
              Edit
            </Link>
          </div>
        </div>

        <aside className="profile-verification">
          <h2>Verification</h2>
          <div className="profile-verification__list">
            {driverProfile.verification.map((item) => (
              <article key={item.id} className="profile-verification__card">
                <span className="profile-verification__check" aria-hidden="true">
                  <svg viewBox="0 0 24 24" width="16" height="16">
                    <path
                      fill="currentColor"
                      d="M9.5 16.2 5.8 12.5l1.4-1.4 2.3 2.3 5.8-5.8 1.4 1.4Z"
                    />
                  </svg>
                </span>
                <div>
                  <strong>{item.title}</strong>
                  <p>{item.detail}</p>
                </div>
              </article>
            ))}
          </div>
        </aside>
      </section>

      <div className="profile-layout">
        <aside className="profile-sidebar">
          <article className="profile-info-card">
            <h2>Personal Information</h2>
            <dl>
              <div>
                <dt>Email</dt>
                <dd>{driverProfile.email}</dd>
              </div>
              <div>
                <dt>Contact No</dt>
                <dd>{driverProfile.contactNo}</dd>
              </div>
              <div>
                <dt>Address</dt>
                <dd>{driverProfile.address}</dd>
              </div>
            </dl>
          </article>

          <article className="profile-badges-card">
            <h2>Achievements & Badges</h2>
            <div className="profile-badges">
              {driverProfile.badges.map((badge) => (
                <div key={badge.id} className="profile-badge">
                  <span className="profile-badge__icon" aria-hidden="true">
                    <svg viewBox="0 0 24 24" width="22" height="22">
                      <path
                        fill="currentColor"
                        d="m12 2 2.9 6.3L22 9.3l-5 4.9 1.2 7-6.2-3.3L5.8 21 7 14.2 2 9.3l7.1-1L12 2Z"
                      />
                    </svg>
                  </span>
                  <span>{badge.label}</span>
                </div>
              ))}
            </div>
          </article>

          <ImpactProgress
            current={driverStats.impactCurrent}
            goal={driverStats.impactGoal}
            badge={driverStats.impactBadge}
          />
        </aside>

        <div className="profile-main">
          <div className="profile-stats">
            <StatCard
              label="Deliveries Completed"
              value={driverStats.deliveriesCompleted}
              trend={driverStats.deliveriesTrend}
              icon={truckIcon}
            />
            <StatCard
              label="Distance Traveled"
              value={`${driverStats.distanceKm}KM`}
              trend={driverStats.distanceTrend}
              icon={routeIcon}
            />
            <StatCard
              label="Meals Saved"
              value={driverProfile.mealsSaved}
              trend={driverProfile.mealsTrend}
              icon={mealsIcon}
            />
          </div>

          <section className="profile-missions">
            <div className="profile-missions__head">
              <h2>Recent Missions</h2>
              <Link to="/my-pickups">View All</Link>
            </div>
            <div className="profile-missions__grid">
              {recentMissions.map((pickup) => (
                <HistoryCard key={pickup.id} pickup={pickup} />
              ))}
            </div>
          </section>
        </div>
      </div>
    </div>
  )
}

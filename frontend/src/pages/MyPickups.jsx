import {
  completedPickups,
  driverStats,
  inTransitPickup,
} from '../data/mockDriverPickups'
import StatCard from '../components/pickups/StatCard'
import ImpactProgress from '../components/pickups/ImpactProgress'
import InTransitBanner from '../components/pickups/InTransitBanner'
import HistoryCard from '../components/pickups/HistoryCard'
import './MyPickups.css'

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

export default function MyPickups() {
  return (
    <div className="page my-pickups-page">
      <div className="my-pickups-page__layout">
        <aside className="my-pickups-sidebar">
          <h1>My pickups</h1>

          <StatCard
            label="Deliveries Completed"
            value={driverStats.deliveriesCompleted}
            trend={driverStats.deliveriesTrend}
            icon={truckIcon}
          />
          <StatCard
            label="Distance Traveled"
            value={`${driverStats.distanceKm} KM`}
            trend={driverStats.distanceTrend}
            icon={routeIcon}
          />
          <ImpactProgress
            current={driverStats.impactCurrent}
            goal={driverStats.impactGoal}
            badge={driverStats.impactBadge}
          />
        </aside>

        <div className="my-pickups-main">
          <section className="my-pickups-section">
            <h2>In Transit Pickups</h2>
            <InTransitBanner pickup={inTransitPickup} />
          </section>

          <section className="my-pickups-section">
            <h2>Completed History</h2>
            <div className="my-pickups-history">
              {completedPickups.map((pickup) => (
                <HistoryCard key={pickup.id} pickup={pickup} />
              ))}
            </div>
          </section>
        </div>
      </div>
    </div>
  )
}

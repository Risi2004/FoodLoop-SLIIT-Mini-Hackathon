import { useEffect, useState } from 'react'
import { getDriverId } from '../api/client'
import { getDriver } from '../api/drivers'
import { getMyPickups } from '../api/pickups'
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

function formatStatus(status) {
  if (status === 'in_transit') return 'In Transit'
  if (status === 'completed') return 'Supplied'
  return status
}

function formatDeliveredLabel(updatedAt) {
  if (!updatedAt) return 'Delivered recently'
  const date = new Date(updatedAt)
  return `Delivered ${date.toLocaleDateString()}`
}

export default function MyPickups() {
  const [stats, setStats] = useState(null)
  const [inTransit, setInTransit] = useState([])
  const [completed, setCompleted] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    let active = true

    async function load() {
      setLoading(true)
      setError('')
      try {
        const driverId = getDriverId()
        if (!driverId) {
          throw new Error(
            'VITE_DRIVER_ID is missing. Run backend seed and set it in frontend/.env'
          )
        }

        const [driver, pickups] = await Promise.all([
          getDriver(driverId),
          getMyPickups(),
        ])

        if (!active) return

        setStats(driver.stats || {})
        setInTransit(
          (pickups.inTransit || []).map((pickup) => ({
            id: pickup._id,
            trackingId: pickup.trackingId,
            donorName: pickup.donorName,
            itemLabel: pickup.itemLabel,
            weightKg: pickup.weightKg,
            distanceKm: pickup.distanceKm,
            etaMinutes: pickup.etaMinutes ?? 15,
            status: formatStatus(pickup.status),
          }))
        )
        setCompleted(
          (pickups.completed || []).map((pickup) => ({
            id: pickup._id,
            donorName: pickup.donorName,
            itemLabel: pickup.itemLabel,
            weightKg: pickup.weightKg,
            distanceKm: pickup.distanceKm,
            deliveredLabel: formatDeliveredLabel(pickup.updatedAt),
          }))
        )
      } catch (err) {
        if (!active) return
        setError(err.message || 'Failed to load pickups')
      } finally {
        if (active) setLoading(false)
      }
    }

    load()
    return () => {
      active = false
    }
  }, [])

  const activePickup = inTransit[0] || null

  return (
    <div className="page my-pickups-page">
      <div className="my-pickups-page__layout">
        <aside className="my-pickups-sidebar">
          <h1>My pickups</h1>

          <StatCard
            label="Deliveries Completed"
            value={stats?.deliveriesCompleted ?? '—'}
            trend="+12% this month"
            icon={truckIcon}
          />
          <StatCard
            label="Distance Traveled"
            value={stats ? `${stats.distanceKm} KM` : '—'}
            trend="+5% vs average"
            icon={routeIcon}
          />
          <ImpactProgress
            current={stats?.impactCurrent ?? 0}
            goal={stats?.impactGoal ?? 15}
            badge={stats?.impactBadge ?? 'Community Hero'}
          />
        </aside>

        <div className="my-pickups-main">
          {error && <p className="my-pickups-error">{error}</p>}
          {loading && <p className="my-pickups-status">Loading your pickups...</p>}

          <section className="my-pickups-section">
            <h2>In Transit Pickups</h2>
            {activePickup ? (
              <InTransitBanner pickup={activePickup} />
            ) : (
              !loading && (
                <p className="my-pickups-empty">No pickups in transit right now.</p>
              )
            )}
          </section>

          <section className="my-pickups-section">
            <h2>Completed History</h2>
            {completed.length > 0 ? (
              <div className="my-pickups-history">
                {completed.map((pickup) => (
                  <HistoryCard key={pickup.id} pickup={pickup} />
                ))}
              </div>
            ) : (
              !loading && (
                <p className="my-pickups-empty">No completed deliveries yet.</p>
              )
            )}
          </section>
        </div>
      </div>
    </div>
  )
}

import { useEffect, useState } from 'react'
import { confirmPickup, getAvailablePickups } from '../api/pickups'
import PickupCard from '../components/delivery/PickupCard'
import DeliveryMap from '../components/delivery/DeliveryMap'
import './Delivery.css'

function minutesUntil(expiresAt) {
  if (!expiresAt) return null
  const diffMs = new Date(expiresAt).getTime() - Date.now()
  return Math.max(0, Math.ceil(diffMs / 60000))
}

function mapPickup(pickup) {
  return {
    id: pickup._id,
    donorName: pickup.donorName,
    itemLabel: pickup.itemLabel,
    weightKg: pickup.weightKg,
    distanceKm: pickup.distanceKm,
    locationLabel: pickup.locationLabel,
    expiresInMinutes: minutesUntil(pickup.expiresAt),
    pickupLocation: pickup.pickupLocation,
    dropoffLocation: pickup.dropoffLocation,
    driverLocation: pickup.driverLocation,
  }
}

export default function Delivery() {
  const [pickups, setPickups] = useState([])
  const [selectedId, setSelectedId] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [confirmingId, setConfirmingId] = useState(null)

  useEffect(() => {
    let active = true

    async function loadPickups() {
      setLoading(true)
      setError('')
      try {
        const data = await getAvailablePickups()
        if (!active) return
        const mapped = (data.pickups || []).map(mapPickup)
        setPickups(mapped)
        setSelectedId(mapped[0]?.id ?? null)
      } catch (err) {
        if (!active) return
        setError(err.message || 'Failed to load pickups')
      } finally {
        if (active) setLoading(false)
      }
    }

    loadPickups()
    return () => {
      active = false
    }
  }, [])

  const selected = pickups.find((p) => p.id === selectedId) ?? pickups[0]

  async function handleConfirm(pickup) {
    setConfirmingId(pickup.id)
    setError('')
    try {
      await confirmPickup(pickup.id)
      setPickups((prev) => {
        const next = prev.filter((item) => item.id !== pickup.id)
        setSelectedId((current) => {
          if (current !== pickup.id) return current
          return next[0]?.id ?? null
        })
        return next
      })
    } catch (err) {
      setError(err.message || 'Failed to confirm pickup')
    } finally {
      setConfirmingId(null)
    }
  }

  return (
    <div className="page delivery-page">
      <div className="delivery-page__layout">
        <aside className="delivery-list">
          <div className="delivery-list__header">
            <h1>Available List</h1>
            <span className="delivery-list__count">
              {pickups.length} Pickups Found
            </span>
          </div>

          {error && <p className="delivery-list__error">{error}</p>}

          <div className="delivery-list__items">
            {loading ? (
              <p className="delivery-list__empty">Loading available pickups...</p>
            ) : pickups.length === 0 ? (
              <p className="delivery-list__empty">
                No available pickups right now. Check back soon.
              </p>
            ) : (
              pickups.map((pickup) => (
                <div
                  key={pickup.id}
                  className={`delivery-list__item${
                    selected?.id === pickup.id ? ' is-selected' : ''
                  }`}
                  onClick={() => setSelectedId(pickup.id)}
                >
                  <PickupCard
                    pickup={pickup}
                    confirming={confirmingId === pickup.id}
                    onConfirm={handleConfirm}
                  />
                </div>
              ))
            )}
          </div>
        </aside>

        <DeliveryMap
          pickup={selected}
          currentLocation={
            selected
              ? `${selected.locationLabel || 'Gampaha'}, Sri Lanka`
              : 'Gampaha, Sri Lanka'
          }
        />
      </div>
    </div>
  )
}

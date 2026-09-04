import { useState } from 'react'
import { availablePickups } from '../data/mockPickups'
import PickupCard from '../components/delivery/PickupCard'
import DeliveryMap from '../components/delivery/DeliveryMap'
import './Delivery.css'

export default function Delivery() {
  const [selectedId, setSelectedId] = useState(availablePickups[0]?.id ?? null)
  const [confirmedIds, setConfirmedIds] = useState([])

  const pickups = availablePickups.filter((p) => !confirmedIds.includes(p.id))
  const selected = pickups.find((p) => p.id === selectedId) ?? pickups[0]

  function handleConfirm(pickup) {
    setConfirmedIds((prev) => [...prev, pickup.id])
    setSelectedId((current) => {
      if (current !== pickup.id) return current
      const remaining = pickups.filter((p) => p.id !== pickup.id)
      return remaining[0]?.id ?? null
    })
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

          <div className="delivery-list__items">
            {pickups.length === 0 ? (
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
                  <PickupCard pickup={pickup} onConfirm={handleConfirm} />
                </div>
              ))
            )}
          </div>
        </aside>

        <DeliveryMap
          currentLocation={
            selected
              ? `${selected.locationLabel}, Sri Lanka`
              : 'Gampaha, Sri Lanka'
          }
        />
      </div>
    </div>
  )
}

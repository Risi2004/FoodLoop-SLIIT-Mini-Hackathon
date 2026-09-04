import { useEffect, useMemo, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { getTracking } from '../api/pickups'
import './DigitalReceipt.css'

export default function DigitalReceipt() {
  const { id } = useParams()
  const [pickup, setPickup] = useState(null)
  const [loading, setLoading] = useState(Boolean(id))
  const [error, setError] = useState('')

  useEffect(() => {
    if (!id) {
      setLoading(false)
      return
    }

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
        setError(err.message || 'Receipt not found')
      } finally {
        if (active) setLoading(false)
      }
    }

    load()
    return () => {
      active = false
    }
  }, [id])

  const receipt = useMemo(() => {
    if (!pickup) {
      return {
        id: id || 'FL-DEMO-2048',
        issuedAt: new Date().toISOString(),
        donor: 'Green Kitchen Collective',
        receiver: 'Hope Community Kitchen',
        driver: 'Kasun Perera',
        foodName: 'Vegetable Rice Packs',
        quantity: '24 packs',
        pickupAddress: 'Demo pickup address',
        dropoffAddress: 'Demo drop-off address',
        status: 'Delivered',
        distanceKm: 2,
        peopleFed: 18,
        methaneSavedKg: 0.5,
        vehicleType: 'scooter',
        vehicleNumber: 'WP CAB-1234',
      }
    }

    const peopleFed = Math.max(1, Math.round((pickup.weightKg || 1) * 2))
    return {
      id: pickup.trackingId,
      issuedAt: pickup.updatedAt || new Date().toISOString(),
      donor: pickup.donorName,
      receiver: pickup.recipientLabel || 'Community recipient',
      driver: pickup.driver?.name || 'Volunteer Driver',
      foodName: pickup.itemLabel,
      quantity: `${pickup.weightKg} kg`,
      pickupAddress: pickup.locationLabel || 'Pickup location',
      dropoffAddress: pickup.recipientLabel || 'Drop-off location',
      status: pickup.status === 'completed' ? 'Delivered' : pickup.status,
      distanceKm: pickup.distanceKm || pickup.driver?.stats?.distanceKm || 2,
      peopleFed,
      methaneSavedKg: Number(((pickup.weightKg || 1) * 0.05).toFixed(2)),
      vehicleType: pickup.driver?.vehicleType || 'scooter',
      vehicleNumber: pickup.driver?.vehicleNumber || '—',
    }
  }, [pickup, id])

  function handlePrint() {
    window.print()
  }

  function handleShare() {
    const text = `FoodLoop impact: ${receipt.peopleFed} people fed from ${receipt.foodName} (${receipt.id})`
    if (navigator.share) {
      navigator.share({ title: 'FoodLoop Impact', text }).catch(() => {})
    } else if (navigator.clipboard) {
      navigator.clipboard.writeText(text).catch(() => {})
    }
  }

  return (
    <div className="digital-receipt">
      <div className="page digital-receipt__inner">
        <div className="digital-receipt__toolbar no-print fl-hero-on-dark">
          <div>
            <Link to="/my-pickups" className="digital-receipt__back">
              Back to My pickups
            </Link>
            <h1>Donation Successfully Completed</h1>
            <p className="digital-receipt__subtitle">
              Your contribution has reached those in need.
            </p>
          </div>
          <div className="digital-receipt__toolbar-actions">
            <button type="button" className="btn-secondary" onClick={handlePrint}>
              PDF / Print
            </button>
            <button type="button" className="btn-lime" onClick={handleShare}>
              Share Impact
            </button>
          </div>
        </div>

        {loading && <p className="digital-receipt__status">Loading receipt...</p>}
        {error && <p className="digital-receipt__error">{error}</p>}

        {!loading && (
          <article className="digital-receipt__card page-stub">
            <header className="digital-receipt__brand">
              <div className="digital-receipt__check" aria-hidden="true">
                ✓
              </div>
              <p>FoodLoop</p>
              <h2>Donation Delivery Receipt</h2>
              <span className="digital-receipt__badge">
                Journey Status: {receipt.status}
              </span>
              <span>Receipt #{receipt.id}</span>
            </header>

            <dl className="digital-receipt__grid">
              <div>
                <dt>Delivered</dt>
                <dd>{new Date(receipt.issuedAt).toLocaleString()}</dd>
              </div>
              <div>
                <dt>Donor</dt>
                <dd>{receipt.donor}</dd>
              </div>
              <div>
                <dt>Receiver</dt>
                <dd>{receipt.receiver}</dd>
              </div>
              <div>
                <dt>Driver</dt>
                <dd>{receipt.driver}</dd>
              </div>
              <div>
                <dt>Item</dt>
                <dd>
                  {receipt.foodName} · {receipt.quantity}
                </dd>
              </div>
              <div>
                <dt>Vehicle</dt>
                <dd>
                  {receipt.vehicleType} · {receipt.vehicleNumber}
                </dd>
              </div>
              <div>
                <dt>Pickup</dt>
                <dd>{receipt.pickupAddress}</dd>
              </div>
              <div>
                <dt>Drop-off</dt>
                <dd>{receipt.dropoffAddress}</dd>
              </div>
            </dl>

            <div className="digital-receipt__impact">
              <article>
                <span>Distance Traveled</span>
                <strong>{Number(receipt.distanceKm || 0).toFixed(1)} KM</strong>
              </article>
              <article>
                <span>People Fed</span>
                <strong>{receipt.peopleFed}</strong>
              </article>
              <article>
                <span>Methane Saved</span>
                <strong>{receipt.methaneSavedKg} KG</strong>
              </article>
            </div>

            <footer className="digital-receipt__footer">
              <p>
                This receipt confirms redistribution facilitated through FoodLoop. Thank
                you for keeping surplus food in the community loop.
              </p>
            </footer>
          </article>
        )}
      </div>
    </div>
  )
}

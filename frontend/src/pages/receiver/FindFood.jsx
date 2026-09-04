import { useEffect, useMemo, useState } from 'react'
import { getActiveDonations, claimDonation } from '../../api/donationApi'
import ClaimModal from '../../components/receiver/ClaimModal'
import FoodLoopMap from '../../components/map/FoodLoopMap'
import './FindFood.css'

const CLAIMS_KEY = 'foodloop_claims'
const FILTERS = ['All', 'Nearby', 'Expiring soon', 'Prepared meals', 'Produce']

function readClaims() {
  try {
    const raw = localStorage.getItem(CLAIMS_KEY)
    const parsed = raw ? JSON.parse(raw) : []
    return Array.isArray(parsed) ? parsed : []
  } catch {
    return []
  }
}

function appendClaim(claim) {
  const next = [claim, ...readClaims()]
  localStorage.setItem(CLAIMS_KEY, JSON.stringify(next))
}

function donationCoords(donation) {
  const lat = donation?.location?.lat ?? donation?.lat ?? donation?.coordinates?.lat
  const lng = donation?.location?.lng ?? donation?.lng ?? donation?.coordinates?.lng
  if (typeof lat === 'number' && typeof lng === 'number') {
    return { lat, lng, label: donation.foodName || 'Surplus' }
  }
  return null
}

export default function FindFood() {
  const [donations, setDonations] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [query, setQuery] = useState('')
  const [filter, setFilter] = useState('All')
  const [selectedDonation, setSelectedDonation] = useState(null)

  async function fetchDonations() {
    setLoading(true)
    setError('')
    try {
      const res = await getActiveDonations()
      setDonations(Array.isArray(res.data) ? res.data : [])
    } catch (err) {
      setError(err.response?.data?.error || err.message || 'Failed to load donations')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchDonations()
  }, [])

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase()
    return donations.filter((donation) => {
      const name = (donation.foodName || '').toLowerCase()
      const donor = (donation.donorId?.businessName || '').toLowerCase()
      const address = (donation.pickupAddress || '').toLowerCase()
      const matchesQuery = !q || name.includes(q) || donor.includes(q) || address.includes(q)

      if (!matchesQuery) return false
      if (filter === 'All' || filter === 'Nearby') return true
      if (filter === 'Expiring soon') {
        if (!donation.expiryDate) return false
        const days =
          (new Date(donation.expiryDate).getTime() - Date.now()) / (1000 * 60 * 60 * 24)
        return days >= 0 && days <= 3
      }
      if (filter === 'Prepared meals') {
        return /meal|cooked|prepared|rice|curry|bread/i.test(donation.foodName || '')
      }
      if (filter === 'Produce') {
        return /fruit|veg|produce|salad|greens/i.test(donation.foodName || '')
      }
      return true
    })
  }, [donations, query, filter])

  const mapPoints = useMemo(
    () => filtered.map(donationCoords).filter(Boolean),
    [filtered]
  )

  async function handleClaim(donationId, quantity) {
    try {
      const res = await claimDonation(donationId, quantity)
      const source = donations.find((d) => d._id === donationId)
      const remaining = res.data?.donation?.remainingQuantity

      setDonations((prev) =>
        prev.map((d) =>
          d._id === donationId
            ? { ...d, remainingQuantity: remaining ?? d.remainingQuantity }
            : d
        )
      )

      appendClaim({
        id: donationId,
        foodName: source?.foodName || selectedDonation?.name || 'Donation',
        quantity,
        at: new Date().toISOString(),
      })

      setSelectedDonation(null)
    } catch (err) {
      alert(err.response?.data?.error || 'Claim failed')
    }
  }

  return (
    <div className="find-food">
      <div className="page find-food__layout">
        <section className="find-food__list fl-panel">
          <header className="find-food__list-head">
            <h1>Find Surplus Food</h1>
            <p>Browse active listings and claim what your community can use.</p>
          </header>

          <div className="find-food__controls">
            <input
              type="search"
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Search food, donor, or area"
              aria-label="Search surplus food"
            />
            <div className="find-food__pills" role="list">
              {FILTERS.map((item) => (
                <button
                  key={item}
                  type="button"
                  role="listitem"
                  className={filter === item ? 'is-active' : ''}
                  onClick={() => setFilter(item)}
                >
                  {item}
                </button>
              ))}
            </div>
          </div>

          {loading && <p className="find-food__status">Loading donations...</p>}
          {error && !loading && <p className="find-food__status is-error">{error}</p>}

          {!loading && !error && filtered.length === 0 && (
            <div className="empty-state find-food__empty">
              <h3>No surplus matches</h3>
              <p>Try another filter or check back soon.</p>
            </div>
          )}

          <div className="find-food__cards">
            {filtered.map((donation) => (
              <article key={donation._id} className="find-food-card">
                <div className="find-food-card__top">
                  <h2>{donation.foodName}</h2>
                  <span>
                    {donation.remainingQuantity} {donation.unit || 'units'}
                  </span>
                </div>
                <p>
                  <strong>From:</strong>{' '}
                  {donation.donorId?.businessName || 'Community donor'}
                </p>
                <p>
                  <strong>Pickup:</strong> {donation.pickupAddress || 'Address TBA'}
                </p>
                <p>
                  <strong>Expires:</strong>{' '}
                  {donation.expiryDate
                    ? new Date(donation.expiryDate).toLocaleDateString()
                    : 'N/A'}
                </p>
                <button
                  type="button"
                  className="btn-lime"
                  disabled={!donation.remainingQuantity}
                  onClick={() =>
                    setSelectedDonation({
                      id: donation._id,
                      max: donation.remainingQuantity,
                      name: donation.foodName,
                    })
                  }
                >
                  Claim now
                </button>
              </article>
            ))}
          </div>
        </section>

        <aside className="find-food__map fl-panel">
          {mapPoints.length > 0 ? (
            <FoodLoopMap points={mapPoints} showRoute={false} />
          ) : (
            <div className="find-food__map-placeholder">
              <span>Map preview</span>
              <h2>Locations appear when listings include coordinates</h2>
              <p>
                Listings without map pins still show in the list. Claim surplus and
                arrange pickup using the address on each card.
              </p>
            </div>
          )}
        </aside>
      </div>

      {selectedDonation && (
        <ClaimModal
          donation={selectedDonation}
          onConfirm={handleClaim}
          onCancel={() => setSelectedDonation(null)}
        />
      )}
    </div>
  )
}

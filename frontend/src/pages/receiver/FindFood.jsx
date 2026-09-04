import { useEffect, useMemo, useState } from 'react'
import { getActiveDonations, claimDonation } from '../../api/donationApi'
import ClaimModal from '../../components/receiver/ClaimModal'
import findFoodMapImg from '../../assets/images/find-food-map.png'
import './FindFood.css'

const CLAIMS_KEY = 'foodloop_claims'
const FILTERS = ['All', 'Nearby', 'Expiring soon', 'Prepared meals', 'Produce']

const AREA_CENTERS = [
  { label: 'Gampaha', lat: 7.084, lng: 80.01 },
  { label: 'Colombo', lat: 6.927, lng: 79.861 },
  { label: 'Nugegoda', lat: 6.872, lng: 79.889 },
  { label: 'Negombo', lat: 7.209, lng: 79.838 },
  { label: 'Kadawatha', lat: 7.001, lng: 79.95 },
]

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

function hashString(value) {
  let hash = 0
  const text = String(value || '')
  for (let i = 0; i < text.length; i += 1) {
    hash = (hash << 5) - hash + text.charCodeAt(i)
    hash |= 0
  }
  return Math.abs(hash)
}

function donationCoords(donation, index = 0) {
  const lat = donation?.location?.lat ?? donation?.lat ?? donation?.coordinates?.lat
  const lng = donation?.location?.lng ?? donation?.lng ?? donation?.coordinates?.lng
  if (typeof lat === 'number' && typeof lng === 'number') {
    return {
      lat,
      lng,
      label: donation.foodName || 'Surplus',
    }
  }

  const address = (donation.pickupAddress || '').toLowerCase()
  const area =
    AREA_CENTERS.find((item) => address.includes(item.label.toLowerCase())) ||
    AREA_CENTERS[index % AREA_CENTERS.length]

  const seed = hashString(donation._id || donation.foodName || index)
  const latJitter = ((seed % 100) - 50) * 0.00035
  const lngJitter = (((seed >> 3) % 100) - 50) * 0.00035

  return {
    lat: area.lat + latJitter,
    lng: area.lng + lngJitter,
    label: donation.foodName || 'Surplus',
  }
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

  const [activePinId, setActivePinId] = useState(null)

  const mapPins = useMemo(
    () =>
      filtered.slice(0, 6).map((donation, index) => ({
        ...donationCoords(donation, index),
        id: donation._id,
        foodName: donation.foodName,
        remainingQuantity: donation.remainingQuantity,
        unit: donation.unit,
        donorName: donation.donorId?.businessName || 'Community donor',
        donation,
      })),
    [filtered]
  )

  function openClaim(donation) {
    if (!donation?.remainingQuantity) return
    setSelectedDonation({
      id: donation._id,
      max: donation.remainingQuantity,
      name: donation.foodName,
    })
  }

  function handlePinClick(pin) {
    setActivePinId(pin.id)
    const card = document.getElementById(`find-food-card-${pin.id}`)
    if (card) {
      card.scrollIntoView({ behavior: 'smooth', block: 'nearest' })
    }
    openClaim(pin.donation)
  }

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
              <article
                key={donation._id}
                id={`find-food-card-${donation._id}`}
                className={`find-food-card${
                  activePinId === donation._id ? ' is-active' : ''
                }`}
              >
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
                  onClick={() => openClaim(donation)}
                >
                  Claim now
                </button>
              </article>
            ))}
          </div>
        </section>

        <aside className="find-food__map fl-panel">
          <div className="find-food__map-location">
            <svg viewBox="0 0 24 24" width="16" height="16" aria-hidden="true">
              <path
                fill="currentColor"
                d="M12 2a7 7 0 0 0-7 7c0 5.25 7 13 7 13s7-7.75 7-13a7 7 0 0 0-7-7Zm0 9.5A2.5 2.5 0 1 1 14.5 9 2.5 2.5 0 0 1 12 11.5Z"
              />
            </svg>
            <span>
              Current Location: <strong>Gampaha, Sri Lanka</strong>
            </span>
          </div>
          <div className="find-food__map-canvas">
            <img
              src={findFoodMapImg}
              alt="Map view of surplus pickup areas near Gampaha"
              className="find-food__map-image"
            />
            <div className="find-food__map-pins">
              {mapPins.map((pin, index) => (
                <button
                  key={pin.id}
                  type="button"
                  className={`find-food__pin is-${index + 1}${
                    activePinId === pin.id ? ' is-active' : ''
                  }`}
                  aria-label={`Open claim for ${pin.foodName}`}
                  title={`${pin.foodName} — ${pin.remainingQuantity} ${pin.unit || 'units'}`}
                  onClick={() => handlePinClick(pin)}
                >
                  <span className="find-food__pin-tip">
                    <strong>{pin.foodName}</strong>
                    <em>
                      {pin.remainingQuantity} {pin.unit || 'units'}
                    </em>
                  </span>
                </button>
              ))}
            </div>
          </div>
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

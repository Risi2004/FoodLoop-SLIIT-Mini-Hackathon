import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import axios from '../../api/axiosInstance'
import './MyDonations.css'

function formatExpiry(value) {
  if (!value) return 'N/A'
  return new Date(value).toLocaleDateString()
}

export default function MyDonations() {
  const [donations, setDonations] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    let active = true

    async function load() {
      setLoading(true)
      setError('')
      try {
        const res = await axios.get('/donations/mine')
        if (!active) return
        setDonations(Array.isArray(res.data) ? res.data : [])
      } catch (err) {
        if (!active) return
        setError(err.response?.data?.error || 'Failed to load donations')
      } finally {
        if (active) setLoading(false)
      }
    }

    load()
    return () => {
      active = false
    }
  }, [])

  return (
    <div className="my-donations">
      <div className="page my-donations__inner">
        <header className="my-donations__intro fl-hero-on-dark">
          <div>
            <h1>My Donations</h1>
            <p>Track surplus you have posted and what is still available.</p>
          </div>
          <Link to="/donor/new" className="my-donations__cta">
            New Donation
          </Link>
        </header>

        {loading && <p className="my-donations__status">Loading your donations...</p>}
        {error && <p className="my-donations__error">{error}</p>}

        {!loading && !error && donations.length === 0 && (
          <div className="my-donations__empty">
            <h2>No donations yet</h2>
            <p>Post your first surplus listing and start creating impact.</p>
            <Link to="/donor/new">Start Donating with AI</Link>
          </div>
        )}

        {!loading && donations.length > 0 && (
          <div className="my-donations__grid">
            {donations.map((donation) => (
              <article key={donation._id} className="donation-card">
                <div className="donation-card__head">
                  <h2>{donation.foodName}</h2>
                  <span className={`donation-card__badge status-${donation.status || 'active'}`}>
                    {donation.status || 'active'}
                  </span>
                </div>

                <dl className="donation-card__meta">
                  <div>
                    <dt>Total</dt>
                    <dd>
                      {donation.totalQuantity} {donation.unit}
                    </dd>
                  </div>
                  <div>
                    <dt>Remaining</dt>
                    <dd>
                      {donation.remainingQuantity ?? donation.totalQuantity} {donation.unit}
                    </dd>
                  </div>
                  <div>
                    <dt>Expires</dt>
                    <dd>{formatExpiry(donation.expiryDate)}</dd>
                  </div>
                </dl>

                <p className="donation-card__address">
                  <strong>Pickup</strong>
                  {donation.pickupAddress}
                </p>

                {donation.description && (
                  <p className="donation-card__desc">{donation.description}</p>
                )}
              </article>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

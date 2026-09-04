import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import './MyClaims.css'

const CLAIMS_KEY = 'foodloop_claims'

function readClaims() {
  try {
    const raw = localStorage.getItem(CLAIMS_KEY)
    const parsed = raw ? JSON.parse(raw) : []
    return Array.isArray(parsed) ? parsed : []
  } catch {
    return []
  }
}

export default function MyClaims() {
  const [claims, setClaims] = useState([])

  useEffect(() => {
    setClaims(readClaims())
  }, [])

  return (
    <div className="my-claims">
      <div className="page my-claims__inner">
        <header className="fl-section-head my-claims__head">
          <h2>My Claims</h2>
          <p>Surplus you have claimed through Find Food</p>
        </header>

        {claims.length === 0 ? (
          <section className="page-stub my-claims__empty">
            <h1>No claims yet</h1>
            <p>
              When you successfully claim surplus on Find Food, those claims appear
              here for quick reference.
            </p>
            <Link to="/receiver/find" className="btn-lime">
              Find surplus food
            </Link>
          </section>
        ) : (
          <div className="my-claims__list">
            {claims.map((claim, index) => (
              <article key={`${claim.id}-${claim.at}-${index}`} className="my-claim-card">
                <div>
                  <h3>{claim.foodName || 'Donation'}</h3>
                  <p>
                    Quantity claimed: <strong>{claim.quantity}</strong>
                  </p>
                  <p className="my-claim-card__meta">
                    {claim.at
                      ? new Date(claim.at).toLocaleString()
                      : 'Claim time unavailable'}
                  </p>
                </div>
                <span className="my-claim-card__badge">Claimed</span>
              </article>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

import { Link } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import './DonorProfile.css'

const verification = [
  { id: 'biz', title: 'Business Verified', detail: 'Kitchen / storefront confirmed' },
  { id: 'fssai', title: 'License on File', detail: 'Food safety documents reviewed' },
]

const badges = [
  { id: 'first', label: 'First Gift' },
  { id: 'gold', label: 'Gold Donor' },
  { id: 'impact', label: 'Impact Maker' },
]

export default function DonorProfile() {
  const { user } = useAuth()

  const stored = (() => {
    try {
      const raw = localStorage.getItem('foodloop_user') || localStorage.getItem('user')
      return raw ? JSON.parse(raw) : null
    } catch {
      return null
    }
  })()

  const profile = { ...stored, ...user }
  const displayName =
    profile?.businessName || profile?.name || profile?.email?.split('@')[0] || 'Donor'
  const email = profile?.email || '—'
  const phone = profile?.phone || profile?.contactPhone || profile?.contactNo || '—'
  const address = profile?.address || profile?.kitchenAddress || '—'

  return (
    <div className="donor-profile">
      <div className="page donor-profile__inner">
        <section className="donor-profile__hero">
          <div className="donor-profile__identity">
            <div className="donor-profile__avatar" aria-hidden="true">
              <svg viewBox="0 0 24 24" width="48" height="48">
                <path
                  fill="currentColor"
                  d="M12 12a4.5 4.5 0 1 0-4.5-4.5A4.5 4.5 0 0 0 12 12Zm0 2.25c-4 0-7.5 2-7.5 4.5V21h15v-2.25c0-2.5-3.5-4.5-7.5-4.5Z"
                />
              </svg>
            </div>
            <div>
              <h1>{displayName}</h1>
              <p>Donor · Food surplus partner</p>
              <Link to="/donor/profile/edit" className="donor-profile__edit">
                Edit
              </Link>
            </div>
          </div>

          <aside className="donor-profile__verification">
            <h2>Verification</h2>
            <div className="donor-profile__verification-list">
              {verification.map((item) => (
                <article key={item.id} className="donor-profile__verification-card">
                  <span className="donor-profile__check" aria-hidden="true">
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

        <div className="donor-profile__layout">
          <aside className="donor-profile__sidebar">
            <article className="donor-profile__info-card">
              <h2>Personal Information</h2>
              <dl>
                <div>
                  <dt>Email</dt>
                  <dd>{email}</dd>
                </div>
                <div>
                  <dt>Role</dt>
                  <dd>Donor</dd>
                </div>
                <div>
                  <dt>Contact No</dt>
                  <dd>{phone}</dd>
                </div>
                <div>
                  <dt>Address</dt>
                  <dd>{address}</dd>
                </div>
              </dl>
            </article>

            <article className="donor-profile__badges-card">
              <h2>Achievements & Badges</h2>
              <div className="donor-profile__badges">
                {badges.map((badge) => (
                  <div key={badge.id} className="donor-profile__badge">
                    <span className="donor-profile__badge-icon" aria-hidden="true">
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
          </aside>

          <div className="donor-profile__main">
            <div className="donor-profile__stats">
              <article className="donor-stat-card">
                <span>Donations Posted</span>
                <strong>12</strong>
                <em>+3 this month</em>
              </article>
              <article className="donor-stat-card">
                <span>Meals Diverted</span>
                <strong>480</strong>
                <em>+18% impact</em>
              </article>
              <article className="donor-stat-card">
                <span>Active Listings</span>
                <strong>3</strong>
                <em>Ready for pickup</em>
              </article>
            </div>

            <section className="donor-profile__impact">
              <div className="donor-profile__impact-head">
                <h2>Impact Snapshot</h2>
                <Link to="/donor/donations">View donations</Link>
              </div>
              <p>
                Keep posting surplus to unlock Gold and Centurion donor rewards. Your next
                milestone is 100 verified donations.
              </p>
              <div className="donor-profile__impact-bar" aria-hidden="true">
                <div style={{ width: '48%' }} />
              </div>
              <p className="donor-profile__impact-meta">48 / 100 toward Gold Donor</p>
            </section>
          </div>
        </div>
      </div>
    </div>
  )
}

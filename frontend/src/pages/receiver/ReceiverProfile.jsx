import { Link } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import './ReceiverProfile.css'

function readStoredUser() {
  try {
    const raw = localStorage.getItem('foodloop_user') || localStorage.getItem('user')
    return raw ? JSON.parse(raw) : null
  } catch {
    return null
  }
}

export function mergeReceiverProfile(user) {
  const stored = readStoredUser()
  const profile = { ...stored, ...user }
  return {
    name:
      profile?.organizationName ||
      profile?.name ||
      profile?.fullName ||
      profile?.email?.split('@')[0] ||
      'Community Receiver',
    email: profile?.email || '',
    contactNo: profile?.phone || profile?.contactPhone || profile?.contactNo || '',
    address: profile?.address || profile?.organizationAddress || '',
    role: profile?.role || 'RECEIVER',
    joinedAt: profile?.joinedAt || profile?.createdAt || null,
  }
}

export default function ReceiverProfile() {
  const { user } = useAuth()
  const profile = mergeReceiverProfile(user)

  const joinedLabel = profile.joinedAt
    ? `Joined ${new Date(profile.joinedAt).toLocaleString('en', {
        month: 'short',
        year: 'numeric',
      })}`
    : 'FoodLoop receiver'

  return (
    <div className="receiver-profile">
      <div className="page receiver-profile__inner">
        <section className="receiver-profile__hero">
          <div className="receiver-profile__identity">
            <div className="receiver-profile__avatar" aria-hidden="true">
              <svg viewBox="0 0 24 24" width="48" height="48">
                <path
                  fill="currentColor"
                  d="M12 12a4.5 4.5 0 1 0-4.5-4.5A4.5 4.5 0 0 0 12 12Zm0 2.25c-4 0-7.5 2-7.5 4.5V21h15v-2.25c0-2.5-3.5-4.5-7.5-4.5Z"
                />
              </svg>
            </div>
            <div>
              <h1>{profile.name}</h1>
              <p>
                {profile.role} • {joinedLabel}
              </p>
              <Link to="/receiver/profile/edit" className="receiver-profile__edit">
                Edit
              </Link>
            </div>
          </div>
        </section>

        <section className="receiver-profile__card">
          <h2>Personal Information</h2>
          <dl>
            <div>
              <dt>Email</dt>
              <dd>{profile.email || '—'}</dd>
            </div>
            <div>
              <dt>Contact No</dt>
              <dd>{profile.contactNo || '—'}</dd>
            </div>
            <div>
              <dt>Address</dt>
              <dd>{profile.address || '—'}</dd>
            </div>
          </dl>
        </section>
      </div>
    </div>
  )
}

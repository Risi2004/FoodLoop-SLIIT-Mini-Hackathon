import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import './DonorEditProfile.css'

function readStoredUser() {
  try {
    const raw = localStorage.getItem('foodloop_user') || localStorage.getItem('user')
    return raw ? JSON.parse(raw) : null
  } catch {
    return null
  }
}

export default function DonorEditProfile() {
  const navigate = useNavigate()
  const { user, login } = useAuth()
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')
  const [form, setForm] = useState({
    name: '',
    email: '',
    phone: '',
    address: '',
  })

  useEffect(() => {
    const stored = readStoredUser()
    const profile = { ...stored, ...user }
    setForm({
      name: profile?.businessName || profile?.name || '',
      email: profile?.email || '',
      phone: profile?.phone || profile?.contactPhone || profile?.contactNo || '',
      address: profile?.address || profile?.kitchenAddress || '',
    })
  }, [user])

  function handleChange(event) {
    const { name, value } = event.target
    setForm((prev) => ({ ...prev, [name]: value }))
  }

  function handleSubmit(event) {
    event.preventDefault()
    setSaving(true)
    setError('')

    try {
      const stored = readStoredUser() || {}
      const updated = {
        ...stored,
        ...user,
        name: form.name.trim(),
        businessName: form.name.trim(),
        email: form.email.trim() || stored.email || user?.email,
        phone: form.phone.trim(),
        contactPhone: form.phone.trim(),
        address: form.address.trim(),
      }

      localStorage.setItem('foodloop_user', JSON.stringify(updated))
      localStorage.setItem('user', JSON.stringify(updated))

      const token =
        localStorage.getItem('foodloop_token') || localStorage.getItem('token') || ''
      if (token && login) {
        login(token, updated)
      }

      navigate('/donor/profile')
    } catch {
      setError('Failed to save profile locally')
    } finally {
      setSaving(false)
    }
  }

  const displayName = form.name || 'Donor'

  return (
    <div className="donor-edit-profile">
      <div className="page donor-edit-profile__inner">
        <header className="donor-edit-profile__intro fl-hero-on-dark">
          <h1>
            Edit <span>Profile</span>
          </h1>
          <p>Manage your donor profile and contact preferences.</p>
        </header>

        {error && <p className="donor-edit-profile__error">{error}</p>}

        <div className="donor-edit-profile__layout">
          <aside className="donor-edit-summary">
            <div className="donor-edit-summary__avatar-wrap">
              <div className="donor-edit-summary__avatar" aria-hidden="true">
                <svg viewBox="0 0 24 24" width="56" height="56">
                  <path
                    fill="currentColor"
                    d="M12 12a4.5 4.5 0 1 0-4.5-4.5A4.5 4.5 0 0 0 12 12Zm0 2.25c-4 0-7.5 2-7.5 4.5V21h15v-2.25c0-2.5-3.5-4.5-7.5-4.5Z"
                  />
                </svg>
              </div>
            </div>
            <span className="donor-edit-summary__badge">Active Donor</span>
            <h2>{displayName}</h2>
            <p className="donor-edit-summary__meta">Food surplus partner</p>
          </aside>

          <form className="donor-edit-form" onSubmit={handleSubmit}>
            <div className="donor-edit-form__head">
              <h2>Personal Information</h2>
            </div>

            <label className="donor-edit-field">
              <span>Display name</span>
              <input
                name="name"
                value={form.name}
                onChange={handleChange}
                placeholder="Business or contact name"
                required
              />
            </label>

            <label className="donor-edit-field">
              <span>Email</span>
              <input type="email" name="email" value={form.email} readOnly />
            </label>

            <label className="donor-edit-field">
              <span>Phone</span>
              <input
                name="phone"
                value={form.phone}
                onChange={handleChange}
                placeholder="+94 ..."
              />
            </label>

            <label className="donor-edit-field">
              <span>Address</span>
              <textarea
                name="address"
                rows={4}
                value={form.address}
                onChange={handleChange}
                placeholder="Kitchen / storefront address"
              />
            </label>

            <div className="donor-edit-form__actions">
              <button
                type="button"
                className="donor-edit-form__cancel"
                onClick={() => navigate('/donor/profile')}
              >
                Cancel
              </button>
              <button type="submit" className="donor-edit-form__save" disabled={saving}>
                {saving ? 'Saving...' : 'Save'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}

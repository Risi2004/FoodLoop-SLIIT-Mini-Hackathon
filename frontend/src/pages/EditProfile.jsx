import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { getDriverId } from '../api/client'
import { getDriver, updateDriver } from '../api/drivers'
import './EditProfile.css'

export default function EditProfile() {
  const navigate = useNavigate()
  const [driverName, setDriverName] = useState('')
  const [joinedLabel, setJoinedLabel] = useState('')
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')
  const [form, setForm] = useState({
    name: '',
    email: '',
    contactNo: '',
    address: '',
  })

  useEffect(() => {
    let active = true

    async function load() {
      try {
        const driverId = getDriverId()
        if (!driverId) throw new Error('VITE_DRIVER_ID is missing in frontend/.env')
        const driver = await getDriver(driverId)
        if (!active) return
        setDriverName(driver.name)
        setJoinedLabel(
          driver.joinedAt
            ? `Member Since ${new Date(driver.joinedAt).toLocaleString('en', {
                month: 'short',
                year: 'numeric',
              })}`
            : ''
        )
        setForm({
          name: driver.name || '',
          email: driver.email || '',
          contactNo: driver.contactNo || '',
          address: driver.address || '',
        })
      } catch (err) {
        if (!active) return
        setError(err.message || 'Failed to load profile')
      }
    }

    load()
    return () => {
      active = false
    }
  }, [])

  function handleChange(event) {
    const { name, value } = event.target
    setForm((prev) => ({ ...prev, [name]: value }))
  }

  async function handleSubmit(event) {
    event.preventDefault()
    setSaving(true)
    setError('')
    try {
      const driverId = getDriverId()
      await updateDriver(driverId, form)
      navigate('/profile')
    } catch (err) {
      setError(err.message || 'Failed to save profile')
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="edit-profile-page">
      <div className="page edit-profile-page__inner">
        <header className="edit-profile-page__intro">
          <h1>
            Edit <span>Profile</span>
          </h1>
          <p>Manage your public profile and personal preferences.</p>
        </header>

        {error && <p className="edit-profile-page__error">{error}</p>}

        <div className="edit-profile-page__layout">
          <aside className="edit-profile-summary">
            <div className="edit-profile-summary__avatar-wrap">
              <div className="edit-profile-summary__avatar" aria-hidden="true">
                <svg viewBox="0 0 24 24" width="56" height="56">
                  <path
                    fill="currentColor"
                    d="M12 12a4.5 4.5 0 1 0-4.5-4.5A4.5 4.5 0 0 0 12 12Zm0 2.25c-4 0-7.5 2-7.5 4.5V21h15v-2.25c0-2.5-3.5-4.5-7.5-4.5Z"
                  />
                </svg>
              </div>
              <button
                type="button"
                className="edit-profile-summary__camera"
                aria-label="Change profile photo"
              >
                <svg viewBox="0 0 24 24" width="16" height="16" aria-hidden="true">
                  <path
                    fill="currentColor"
                    d="M9 4h6l1.2 2H20v14H4V6h3.8Zm3 4.5A4.5 4.5 0 1 0 16.5 13 4.5 4.5 0 0 0 12 8.5Zm0 2A2.5 2.5 0 1 1 9.5 13 2.5 2.5 0 0 1 12 10.5Z"
                  />
                </svg>
              </button>
            </div>

            <span className="edit-profile-summary__badge">Active Driver</span>
            <h2>{driverName || form.name || 'Driver'}</h2>
            <p className="edit-profile-summary__meta">{joinedLabel}</p>
          </aside>

          <form className="edit-profile-form" onSubmit={handleSubmit}>
            <div className="edit-profile-form__head">
              <h2>Personal Information</h2>
            </div>

            <label className="edit-profile-field">
              <span>Username</span>
              <input name="name" value={form.name} onChange={handleChange} required />
            </label>

            <label className="edit-profile-field">
              <span>Email</span>
              <input
                type="email"
                name="email"
                value={form.email}
                onChange={handleChange}
                required
              />
            </label>

            <label className="edit-profile-field">
              <span>Contact number</span>
              <input
                name="contactNo"
                value={form.contactNo}
                onChange={handleChange}
                required
              />
            </label>

            <label className="edit-profile-field">
              <span>Address</span>
              <textarea
                name="address"
                rows={4}
                value={form.address}
                onChange={handleChange}
                required
              />
            </label>

            <div className="edit-profile-form__actions">
              <button
                type="button"
                className="edit-profile-form__cancel"
                onClick={() => navigate('/profile')}
              >
                Cancel
              </button>
              <button type="submit" className="edit-profile-form__save" disabled={saving}>
                {saving ? 'Saving...' : 'Save'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}

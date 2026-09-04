import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import { mergeReceiverProfile } from './ReceiverProfile'
import './ReceiverProfileEdit.css'

function readStoredUser() {
  try {
    const raw = localStorage.getItem('foodloop_user') || localStorage.getItem('user')
    return raw ? JSON.parse(raw) : null
  } catch {
    return null
  }
}

export default function ReceiverProfileEdit() {
  const navigate = useNavigate()
  const { user, login } = useAuth()
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')
  const [form, setForm] = useState({
    name: '',
    email: '',
    contactNo: '',
    address: '',
  })

  useEffect(() => {
    const profile = mergeReceiverProfile(user)
    setForm({
      name: profile.name || '',
      email: profile.email || '',
      contactNo: profile.contactNo || '',
      address: profile.address || '',
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
        organizationName: form.name.trim(),
        email: form.email.trim() || stored.email || user?.email,
        phone: form.contactNo.trim(),
        contactPhone: form.contactNo.trim(),
        contactNo: form.contactNo.trim(),
        address: form.address.trim(),
        organizationAddress: form.address.trim(),
      }

      localStorage.setItem('foodloop_user', JSON.stringify(updated))
      localStorage.setItem('user', JSON.stringify(updated))

      const token =
        localStorage.getItem('foodloop_token') || localStorage.getItem('token') || ''
      if (token && login) {
        login(token, updated)
      }

      navigate('/receiver/profile')
    } catch {
      setError('Failed to save profile locally')
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="receiver-profile-edit">
      <div className="page receiver-profile-edit__inner">
        <header className="receiver-profile-edit__intro fl-hero-on-dark">
          <h1>
            Edit <span>Profile</span>
          </h1>
          <p>Manage your public profile and personal preferences.</p>
        </header>

        {error && <p className="receiver-profile-edit__error">{error}</p>}

        <form className="receiver-profile-edit__form" onSubmit={handleSubmit}>
          <label>
            <span>Organization / name</span>
            <input name="name" value={form.name} onChange={handleChange} required />
          </label>
          <label>
            <span>Email</span>
            <input
              type="email"
              name="email"
              value={form.email}
              onChange={handleChange}
              required
            />
          </label>
          <label>
            <span>Contact number</span>
            <input
              name="contactNo"
              value={form.contactNo}
              onChange={handleChange}
            />
          </label>
          <label>
            <span>Address</span>
            <textarea
              name="address"
              rows={4}
              value={form.address}
              onChange={handleChange}
            />
          </label>

          <div className="receiver-profile-edit__actions">
            <button
              type="button"
              className="receiver-profile-edit__cancel"
              onClick={() => navigate('/receiver/profile')}
            >
              Cancel
            </button>
            <button type="submit" className="btn-lime" disabled={saving}>
              {saving ? 'Saving...' : 'Save'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

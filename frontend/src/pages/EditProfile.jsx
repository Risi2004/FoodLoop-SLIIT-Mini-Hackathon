import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { driverProfile } from '../data/mockDriverProfile'
import './EditProfile.css'

export default function EditProfile() {
  const navigate = useNavigate()
  const [form, setForm] = useState({
    username: driverProfile.name,
    email: driverProfile.email,
    contactNo: driverProfile.contactNo,
    address: driverProfile.address,
  })

  function handleChange(event) {
    const { name, value } = event.target
    setForm((prev) => ({ ...prev, [name]: value }))
  }

  function handleSubmit(event) {
    event.preventDefault()
    navigate('/profile')
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
          <h2>{driverProfile.name}</h2>
          <p className="edit-profile-summary__meta">Member Since May 2023</p>

          <button type="button" className="edit-profile-summary__password">
            <svg viewBox="0 0 24 24" width="16" height="16" aria-hidden="true">
              <path
                fill="currentColor"
                d="M17 9V8a5 5 0 0 0-10 0v1H5v12h14V9Zm-8 0V8a3 3 0 0 1 6 0v1Zm3 5.2a1.8 1.8 0 1 1 1.8-1.8A1.8 1.8 0 0 1 12 14.2Z"
              />
            </svg>
            Change Password
          </button>
        </aside>

        <form className="edit-profile-form" onSubmit={handleSubmit}>
          <div className="edit-profile-form__head">
            <svg viewBox="0 0 24 24" width="18" height="18" aria-hidden="true">
              <path
                fill="currentColor"
                d="M12 12a4.5 4.5 0 1 0-4.5-4.5A4.5 4.5 0 0 0 12 12Zm0 2.25c-4 0-7.5 2-7.5 4.5V21h15v-2.25c0-2.5-3.5-4.5-7.5-4.5Z"
              />
            </svg>
            <h2>Personal Information</h2>
          </div>

          <label className="edit-profile-field">
            <span>Username</span>
            <input
              name="username"
              value={form.username}
              onChange={handleChange}
              placeholder="Eg:-jjhon."
            />
          </label>

          <label className="edit-profile-field">
            <span>Email</span>
            <input
              type="email"
              name="email"
              value={form.email}
              onChange={handleChange}
              placeholder="Eg:-jjhon@gmail.com."
            />
          </label>

          <label className="edit-profile-field">
            <span>Contact number</span>
            <input
              name="contactNo"
              value={form.contactNo}
              onChange={handleChange}
              placeholder="Eg:-0758261526."
            />
          </label>

          <label className="edit-profile-field">
            <span>Address</span>
            <textarea
              name="address"
              rows={4}
              value={form.address}
              onChange={handleChange}
              placeholder="Eg:-malikavatha road, colombo-08."
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
            <button type="submit" className="edit-profile-form__save">
              Save
            </button>
          </div>
        </form>
      </div>
      </div>
    </div>
  )
}

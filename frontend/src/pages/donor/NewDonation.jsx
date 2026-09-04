import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { createDonation } from '../../api/donationApi'
import './NewDonation.css'

const UNITS = ['pieces', 'kg', 'liters', 'boxes', 'portions']
const STORAGE_OPTIONS = ['Hot', 'Cold', 'Dry']

export default function NewDonation() {
  const navigate = useNavigate()
  const [form, setForm] = useState({
    foodName: '',
    description: '',
    totalQuantity: 1,
    unit: 'pieces',
    pickupAddress: '',
    expiryDate: '',
  })
  const [storage, setStorage] = useState('Cold')
  const [confirmed, setConfirmed] = useState(false)
  const [fileName, setFileName] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')

  function handleChange(event) {
    const { name, value } = event.target
    setForm((prev) => ({ ...prev, [name]: value }))
  }

  function adjustQuantity(delta) {
    setForm((prev) => ({
      ...prev,
      totalQuantity: Math.max(1, Number(prev.totalQuantity || 1) + delta),
    }))
  }

  function handleFileChange(event) {
    const file = event.target.files?.[0]
    setFileName(file ? file.name : '')
  }

  async function handleSubmit(event) {
    event.preventDefault()
    if (!confirmed) {
      setError('Please confirm the donation details before posting.')
      return
    }

    setSubmitting(true)
    setError('')
    setSuccess('')

    try {
      await createDonation({
        foodName: form.foodName.trim(),
        description: form.description.trim(),
        totalQuantity: Number(form.totalQuantity),
        unit: form.unit,
        pickupAddress: form.pickupAddress.trim(),
        expiryDate: form.expiryDate,
      })
      setSuccess('Donation posted successfully!')
      setTimeout(() => navigate('/donor/donations'), 800)
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to post donation')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="new-donation">
      <div className="page new-donation__inner">
        <header className="new-donation__intro">
          <h1>
            New <span>donation</span>
          </h1>
          <p>Upload surplus details and let FoodLoop prepare your listing.</p>
        </header>

        <div className="new-donation__progress">
          <div className="new-donation__progress-meta">
            <span>Profile completion</span>
            <strong>8/10 Completed</strong>
          </div>
          <div className="new-donation__progress-track" aria-hidden="true">
            <div className="new-donation__progress-fill" style={{ width: '80%' }} />
          </div>
        </div>

        <div className="new-donation__layout">
          <aside className="new-donation__upload">
            <label className="new-donation__dropzone">
              <input
                type="file"
                accept="image/*"
                onChange={handleFileChange}
                aria-label="Upload food photo"
              />
              <span className="new-donation__dropzone-icon" aria-hidden="true">
                <svg viewBox="0 0 24 24" width="36" height="36">
                  <path
                    fill="currentColor"
                    d="M19 15v4H5v-4H3v4a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-4Zm-6-1.5V4h-2v9.5L8.4 11l-1.4 1.4L12 17.4l5-4.9L15.6 11Z"
                  />
                </svg>
              </span>
              <strong>Drop food photo here</strong>
              <p>or click to browse · JPG, PNG</p>
              {fileName && <em>{fileName}</em>}
            </label>

            <div className="new-donation__ai-banner">
              <span className="new-donation__ai-badge">AI Analysis</span>
              <p>
                Detected ready-to-donate surplus with <strong>98% confidence</strong>.
                Review suggested fields on the right.
              </p>
            </div>
          </aside>

          <form className="new-donation__form" onSubmit={handleSubmit}>
            <label className="new-donation__field">
              <span>Food name</span>
              <input
                name="foodName"
                value={form.foodName}
                onChange={handleChange}
                placeholder="e.g. Assorted Pastries"
                required
              />
            </label>

            <label className="new-donation__field">
              <span>Category / description</span>
              <textarea
                name="description"
                rows={3}
                value={form.description}
                onChange={handleChange}
                placeholder="Bakery · Vegetarian · Packaged"
              />
            </label>

            <div className="new-donation__row">
              <div className="new-donation__field">
                <span>Quantity</span>
                <div className="new-donation__qty">
                  <button type="button" onClick={() => adjustQuantity(-1)} aria-label="Decrease">
                    −
                  </button>
                  <input
                    name="totalQuantity"
                    type="number"
                    min="1"
                    value={form.totalQuantity}
                    onChange={handleChange}
                    required
                  />
                  <button type="button" onClick={() => adjustQuantity(1)} aria-label="Increase">
                    +
                  </button>
                </div>
              </div>

              <label className="new-donation__field">
                <span>Unit</span>
                <select name="unit" value={form.unit} onChange={handleChange}>
                  {UNITS.map((unit) => (
                    <option key={unit} value={unit}>
                      {unit}
                    </option>
                  ))}
                </select>
              </label>
            </div>

            <div className="new-donation__field">
              <span>Storage</span>
              <div className="new-donation__storage" role="group" aria-label="Storage type">
                {STORAGE_OPTIONS.map((option) => (
                  <button
                    key={option}
                    type="button"
                    className={storage === option ? 'is-active' : ''}
                    onClick={() => setStorage(option)}
                  >
                    {option}
                  </button>
                ))}
              </div>
            </div>

            <label className="new-donation__field">
              <span>Pickup address</span>
              <textarea
                name="pickupAddress"
                rows={2}
                value={form.pickupAddress}
                onChange={handleChange}
                placeholder="Kitchen / storefront address"
                required
              />
            </label>

            <label className="new-donation__field">
              <span>Expiry date</span>
              <input
                type="date"
                name="expiryDate"
                value={form.expiryDate}
                onChange={handleChange}
                required
              />
            </label>

            <label className="new-donation__confirm">
              <input
                type="checkbox"
                checked={confirmed}
                onChange={(event) => setConfirmed(event.target.checked)}
              />
              <span>
                I confirm this food is safe to donate and details above are accurate.
              </span>
            </label>

            {error && <p className="new-donation__error">{error}</p>}
            {success && <p className="new-donation__success">{success}</p>}

            <button type="submit" className="new-donation__submit" disabled={submitting}>
              {submitting ? 'Posting...' : 'Post Donation'}
            </button>
          </form>
        </div>
      </div>
    </div>
  )
}

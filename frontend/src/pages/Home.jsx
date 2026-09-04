import { useState } from 'react'
import { Link } from 'react-router-dom'
import {
  driverHomeFeatures,
  driverRewardTiers,
} from '../data/mockDriverHome'
import './Home.css'

export default function Home() {
  const [feedback, setFeedback] = useState('')
  const [contact, setContact] = useState({
    name: '',
    email: '',
    subject: 'General Inquiry',
    message: '',
  })

  function handleContactChange(event) {
    const { name, value } = event.target
    setContact((prev) => ({ ...prev, [name]: value }))
  }

  function handleFeedbackSubmit(event) {
    event.preventDefault()
    setFeedback('')
  }

  function handleContactSubmit(event) {
    event.preventDefault()
    setContact({
      name: '',
      email: '',
      subject: 'General Inquiry',
      message: '',
    })
  }

  return (
    <div className="driver-home">
      <section className="page driver-hero">
        <div className="driver-hero__copy">
          <h1>Real-Time Logistics: Efficient Pickups for Maximum Impact</h1>
          <p>
            Access a reliable stream of high-quality nutrition to serve your
            community and reduce operational costs.
          </p>
          <Link to="/delivery" className="driver-hero__cta">
            <svg viewBox="0 0 24 24" width="18" height="18" aria-hidden="true">
              <path
                fill="currentColor"
                d="M5 16a2 2 0 1 0 2 2 2 2 0 0 0-2-2Zm10 0a2 2 0 1 0 2 2 2 2 0 0 0-2-2ZM4 9h9l1.5 3H19v4h-1.1a3 3 0 0 0-5.8 0H9.9a3 3 0 0 0-5.8 0H3v-2.5A4.5 4.5 0 0 1 4 9Z"
              />
            </svg>
            Pick Orders
          </Link>
          <div className="driver-hero__proof">
            <div className="driver-hero__avatars" aria-hidden="true">
              <span />
              <span />
              <span />
            </div>
            <p>1,260+ meals diverted from landfills</p>
          </div>
        </div>

        <div className="driver-hero__visual" aria-hidden="true">
          <div className="driver-hero__visual-card">
            <div className="driver-hero__holo" />
            <div className="driver-hero__crate">FoodLoop</div>
          </div>
        </div>
      </section>

      <section className="page driver-features">
        <div className="driver-section-head">
          <h2>Navigate & Claim</h2>
          <p>Advanced tools for the modern surplus hero</p>
        </div>
        <div className="driver-features__grid">
          {driverHomeFeatures.map((feature) => (
            <article key={feature.id} className="driver-feature-card">
              <span className="driver-feature-card__icon" aria-hidden="true">
                <svg viewBox="0 0 24 24" width="22" height="22">
                  <path
                    fill="currentColor"
                    d="M12 2 4 5v6c0 5 3.4 9.4 8 11 4.6-1.6 8-6 8-11V5Zm-1 14-4-4 1.4-1.4L11 13.2l4.6-4.6L17 10Z"
                  />
                </svg>
              </span>
              <h3>{feature.title}</h3>
              <p>{feature.description}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="page driver-feedback">
        <h2>Tell us what you think about FoodLoop</h2>
        <form className="driver-feedback__form" onSubmit={handleFeedbackSubmit}>
          <textarea
            value={feedback}
            onChange={(event) => setFeedback(event.target.value)}
            placeholder="Share your experience as a volunteer driver..."
            rows={5}
          />
          <button type="submit">
            Send
            <svg viewBox="0 0 24 24" width="16" height="16" aria-hidden="true">
              <path fill="currentColor" d="M3 12 21 3l-7.5 18-2.4-7.1L3 12Z" />
            </svg>
          </button>
        </form>
      </section>

      <section className="page driver-rewards">
        <div className="driver-section-head">
          <h2>Achievements & Milestone Rewards</h2>
          <p>Unlock prestige as you bridge the food gap</p>
        </div>
        <div className="driver-rewards__grid">
          {driverRewardTiers.map((tier) => (
            <article
              key={tier.id}
              className={`driver-reward-card${tier.popular ? ' is-popular' : ''}`}
            >
              {tier.popular && (
                <span className="driver-reward-card__tag">Most Popular</span>
              )}
              <h3>{tier.name}</h3>
              <p className="driver-reward-card__req">{tier.requirement}</p>
              <ul>
                {tier.perks.map((perk) => (
                  <li key={perk}>{perk}</li>
                ))}
              </ul>
            </article>
          ))}
        </div>
      </section>

      <section className="page driver-contact">
        <div className="driver-contact__info">
          <h2>We&apos;d love to hear from you.</h2>
          <p>
            Questions about pickups, partnerships, or volunteering? Reach out and
            we&apos;ll get back to you.
          </p>
          <div className="driver-contact__rows">
            <p>
              <strong>Email</strong>
              foodloop@gmail.com
            </p>
            <p>
              <strong>Location</strong>
              Colombo, Sri Lanka
            </p>
          </div>
        </div>

        <form className="driver-contact__form" onSubmit={handleContactSubmit}>
          <div className="driver-contact__row">
            <label>
              <span>Name</span>
              <input
                name="name"
                value={contact.name}
                onChange={handleContactChange}
                placeholder="Your name"
              />
            </label>
            <label>
              <span>Email</span>
              <input
                type="email"
                name="email"
                value={contact.email}
                onChange={handleContactChange}
                placeholder="Your email"
              />
            </label>
          </div>

          <label>
            <span>Subject</span>
            <select
              name="subject"
              value={contact.subject}
              onChange={handleContactChange}
            >
              <option>General Inquiry</option>
              <option>Pickup Support</option>
              <option>Partnership</option>
            </select>
          </label>

          <label>
            <span>Message</span>
            <textarea
              name="message"
              rows={5}
              value={contact.message}
              onChange={handleContactChange}
              placeholder="Write your message..."
            />
          </label>

          <button type="submit">Send Message</button>
        </form>
      </section>
    </div>
  )
}

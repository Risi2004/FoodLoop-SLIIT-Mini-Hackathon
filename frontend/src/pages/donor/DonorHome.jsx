import { useState } from 'react'
import { Link } from 'react-router-dom'
import './DonorHome.css'

const features = [
  {
    id: 'vision',
    title: 'Computer Vision',
    description:
      'Snap a photo of surplus food and let AI identify items, portions, and packaging in seconds.',
  },
  {
    id: 'freshness',
    title: 'Freshness Scoring',
    description:
      'Automatic quality scores help receivers trust every donation before claiming pickup.',
  },
  {
    id: 'categorize',
    title: 'Auto-Categorization',
    description:
      'Food type, storage needs, and tags are filled for you so posting takes less effort.',
  },
]

const rewardTiers = [
  {
    id: 'silver',
    name: 'Silver Donor',
    requirement: '25+ Verified Donations',
    popular: false,
    perks: ['Digital Badge for Website', 'Basic Impact Reporting'],
  },
  {
    id: 'gold',
    name: 'Gold Donor',
    requirement: '100+ Verified Donations',
    popular: true,
    perks: [
      'Priority Listing Status',
      "'Featured' in NGO Portal",
      'Quarterly CSR Consult',
    ],
  },
  {
    id: 'centurion',
    name: 'Centurion Donor',
    requirement: '250+ Verified Donations',
    popular: false,
    perks: [
      'Custom Impact Dashboard',
      'Press Kit & Media Support',
      'Annual Impact Award',
    ],
  },
]

export default function DonorHome() {
  const [feedback, setFeedback] = useState('')

  function handleFeedbackSubmit(event) {
    event.preventDefault()
    setFeedback('')
  }

  return (
    <div className="donor-home">
      <section className="page donor-home__hero">
        <div className="donor-home__hero-copy">
          <h1>Turn Your Surplus into Social Impact.</h1>
          <p>
            Post leftover meals in minutes with AI-assisted listing. Reduce waste,
            feed communities, and track the good you create.
          </p>
          <Link to="/donor/new" className="donor-home__cta">
            Start Donating with AI
          </Link>
          <div className="donor-home__proof">
            <div className="donor-home__avatars" aria-hidden="true">
              <span />
              <span />
              <span />
            </div>
            <p>3,400+ kg surplus redirected this month</p>
          </div>
        </div>

        <div className="donor-home__hero-visual" aria-hidden="true">
          <div className="donor-home__visual-card">
            <div className="donor-home__holo" />
            <div className="donor-home__crate">FoodLoop</div>
          </div>
        </div>
      </section>

      <section className="page donor-home__features">
        <div className="fl-section-head">
          <h2>AI-Powered Donation Tools</h2>
          <p>Smarter listing so surplus reaches people faster</p>
        </div>
        <div className="donor-home__feature-grid">
          {features.map((feature) => (
            <article key={feature.id} className="donor-feature-card">
              <span className="donor-feature-card__icon" aria-hidden="true">
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

      <section className="page donor-home__feedback">
        <h2>Tell us what you think about FoodLoop</h2>
        <form className="donor-home__feedback-form" onSubmit={handleFeedbackSubmit}>
          <textarea
            value={feedback}
            onChange={(event) => setFeedback(event.target.value)}
            placeholder="Share your experience as a donor..."
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

      <section className="page donor-home__rewards">
        <div className="fl-section-head">
          <h2>Achievements & Milestone Rewards</h2>
          <p>Unlock prestige as you bridge the food gap</p>
        </div>
        <div className="donor-home__reward-grid">
          {rewardTiers.map((tier) => (
            <article
              key={tier.id}
              className={`donor-reward-card${tier.popular ? ' is-popular' : ''}`}
            >
              {tier.popular && (
                <span className="donor-reward-card__tag">Most Popular</span>
              )}
              <h3>{tier.name}</h3>
              <p className="donor-reward-card__req">{tier.requirement}</p>
              <ul>
                {tier.perks.map((perk) => (
                  <li key={perk}>{perk}</li>
                ))}
              </ul>
            </article>
          ))}
        </div>
      </section>
    </div>
  )
}

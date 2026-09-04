import { useState } from 'react'
import { Link } from 'react-router-dom'
import {
  driverHomeFeatures,
  driverRewardTiers,
} from '../data/mockDriverHome'
import driverHeroImg from '../assets/images/driver-hero.png'
import RoleContact from '../components/home/RoleContact'
import '../styles/roleHome.css'

const FEATURE_ICONS = {
  freshness: (
    <svg viewBox="0 0 24 24" width="22" height="22" aria-hidden="true">
      <path
        fill="currentColor"
        d="M12 2 4 5v6c0 5 3.4 9.4 8 11 4.6-1.6 8-6 8-11V5Zm-1 14-4-4 1.4-1.4L11 13.2l4.6-4.6L17 10Z"
      />
    </svg>
  ),
  traceability: (
    <svg viewBox="0 0 24 24" width="22" height="22" aria-hidden="true">
      <path
        fill="currentColor"
        d="M12 2a7 7 0 0 0-7 7c0 5.25 7 13 7 13s7-7.75 7-13a7 7 0 0 0-7-7Zm0 9.5A2.5 2.5 0 1 1 14.5 9 2.5 2.5 0 0 1 12 11.5Z"
      />
    </svg>
  ),
  routing: (
    <svg viewBox="0 0 24 24" width="22" height="22" aria-hidden="true">
      <path
        fill="currentColor"
        d="M12 2 4.5 20.3 5.7 21l5.3-2.2L16.3 21l1.2-.7Zm0 3.5 4.8 11.3-3.7-1.5L12 9.8l-1.1 5.5-3.7 1.5Z"
      />
    </svg>
  ),
}

export default function Home() {
  const [feedback, setFeedback] = useState('')
  const [feedbackSent, setFeedbackSent] = useState(false)

  function handleFeedbackSubmit(event) {
    event.preventDefault()
    setFeedback('')
    setFeedbackSent(true)
    setTimeout(() => setFeedbackSent(false), 2500)
  }

  return (
    <div className="role-home">
      <section className="page role-home__hero">
        <div className="role-home__copy fl-hero-on-dark">
          <p className="role-home__kicker">Driver Hub</p>
          <h1>
            Efficient Pickups for
            <span> Maximum Impact</span>
          </h1>
          <p>
            Access a reliable stream of high-quality nutrition to serve your
            community and reduce operational costs.
          </p>
          <div className="role-home__actions">
            <Link to="/delivery" className="role-home__cta">
              Pick Orders
            </Link>
            <Link to="/my-pickups" className="role-home__cta-ghost">
              My Pickups
            </Link>
          </div>
          <div className="role-home__proof">
            <div className="role-home__avatars" aria-hidden="true">
              <span />
              <span />
              <span />
            </div>
            <p>1.2M+ meals diverted from landfills</p>
          </div>
        </div>

        <div className="role-home__visual-card">
          <img
            src={driverHeroImg}
            alt="FoodLoop volunteer delivering surplus meals to the community"
          />
          <div className="role-home__badge">Live route ready</div>
        </div>
      </section>

      <section className="page">
        <div className="fl-section-head">
          <p className="role-home__eyebrow">Driver Tools</p>
          <h2>Navigate &amp; Claim</h2>
          <p>Advanced tools for the modern surplus hero</p>
        </div>
        <div className="role-home__feature-grid">
          {driverHomeFeatures.map((feature) => (
            <article key={feature.id} className="role-feature-card">
              <span className="role-feature-card__icon">
                {FEATURE_ICONS[feature.id] || FEATURE_ICONS.freshness}
              </span>
              <h3>{feature.title}</h3>
              <p>{feature.description}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="page role-home__feedback">
        <h2>Tell us what you think about FoodLoop</h2>
        <form className="role-home__feedback-form" onSubmit={handleFeedbackSubmit}>
          <textarea
            value={feedback}
            onChange={(event) => setFeedback(event.target.value)}
            placeholder="Share your experience as a volunteer driver..."
            rows={5}
            required
          />
          <div className="role-home__feedback-actions">
            {feedbackSent && (
              <span className="role-home__toast">Thanks for the feedback!</span>
            )}
            <button type="submit">Send</button>
          </div>
        </form>
      </section>

      <section className="page">
        <div className="fl-section-head">
          <h2>Achievements &amp; Milestone Rewards</h2>
          <p>Unlock prestige as you bridge the food gap</p>
        </div>
        <div className="role-home__reward-grid">
          {driverRewardTiers.map((tier) => (
            <article
              key={tier.id}
              className={`role-reward-card${tier.popular ? ' is-popular' : ''}`}
            >
              {tier.popular && (
                <span className="role-reward-card__tag">Most Popular</span>
              )}
              <h3>{tier.name}</h3>
              <p className="role-reward-card__req">{tier.requirement}</p>
              <ul>
                {tier.perks.map((perk) => (
                  <li key={perk}>{perk}</li>
                ))}
              </ul>
            </article>
          ))}
        </div>
      </section>

      <RoleContact
        blurb="Questions about pickups, partnerships, or volunteering? Reach out and we'll get back to you."
        subjects={['General Inquiry', 'Pickup Support', 'Partnership']}
      />
    </div>
  )
}

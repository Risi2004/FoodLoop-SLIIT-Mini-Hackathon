import { useState } from 'react'
import { Link } from 'react-router-dom'
import donorHeroImg from '../../assets/images/donor-hero.png'
import RoleContact from '../../components/home/RoleContact'
import '../../styles/roleHome.css'

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
  const [sent, setSent] = useState(false)

  function handleFeedbackSubmit(event) {
    event.preventDefault()
    setFeedback('')
    setSent(true)
    window.setTimeout(() => setSent(false), 2500)
  }

  return (
    <div className="role-home">
      <section className="page role-home__hero">
        <div className="role-home__copy fl-hero-on-dark">
          <p className="role-home__kicker">Donor Hub</p>
          <h1>Turn Your Surplus into Social Impact.</h1>
          <p>
            Post leftover meals in minutes with AI-assisted listing. Reduce waste,
            feed communities, and track the good you create.
          </p>
          <div className="role-home__actions">
            <Link to="/donor/new" className="role-home__cta">
              Start Donating with AI
            </Link>
            <Link to="/donor/donations" className="role-home__cta-ghost">
              My Donations
            </Link>
          </div>
          <div className="role-home__proof">
            <div className="role-home__avatars" aria-hidden="true">
              <span />
              <span />
              <span />
            </div>
            <p>1.2k+ meals donated</p>
          </div>
        </div>

        <div className="role-home__visual-card">
          <img
            src={donorHeroImg}
            alt="Smartphone scanning surplus bakery food for donation"
          />
          <div className="role-home__badge">FoodLoop</div>
        </div>
      </section>

      <section className="page">
        <div className="fl-section-head">
          <p className="role-home__eyebrow">The Technology</p>
          <h2>Snap &amp; List AI</h2>
          <p>Smarter listing so surplus reaches people faster</p>
        </div>
        <div className="role-home__feature-grid">
          {features.map((feature) => (
            <article key={feature.id} className="role-feature-card">
              <span className="role-feature-card__icon" aria-hidden="true">
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

      <section className="page role-home__feedback">
        <h2>Tell us what you think about FoodLoop</h2>
        <form className="role-home__feedback-form" onSubmit={handleFeedbackSubmit}>
          <textarea
            value={feedback}
            onChange={(event) => setFeedback(event.target.value)}
            placeholder="Share your experience as a donor..."
            rows={5}
            required
          />
          <div className="role-home__feedback-actions">
            {sent && <span className="role-home__toast">Thanks for the feedback!</span>}
            <button type="submit">Send</button>
          </div>
        </form>
      </section>

      <section className="page">
        <div className="fl-section-head">
          <h2>Earn Your Status</h2>
          <p>Unlock prestige as you bridge the food gap</p>
        </div>
        <div className="role-home__reward-grid">
          {rewardTiers.map((tier) => (
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
        blurb="Questions about donations, partnerships, or volunteering? Reach out and we'll get back to you."
        subjects={['General Inquiry', 'Donation Support', 'Partnership']}
      />
    </div>
  )
}

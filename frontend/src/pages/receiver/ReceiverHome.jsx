import { useState } from 'react'
import { Link } from 'react-router-dom'
import receiverHeroImg from '../../assets/images/receiver.png'
import RoleContact from '../../components/home/RoleContact'
import '../../styles/roleHome.css'

const features = [
  {
    id: 'find',
    title: 'Nearby Surplus Discovery',
    description:
      'Browse verified listings close to your kitchen so you can claim fresh surplus faster.',
  },
  {
    id: 'claim',
    title: 'One-Tap Claims',
    description:
      'Reserve what your community needs in seconds and coordinate pickup with clear status updates.',
  },
  {
    id: 'impact',
    title: 'Impact Tracking',
    description:
      'See meals received, badges earned, and community score so every claim stays measurable.',
  },
]

const rewardTiers = [
  {
    id: 'bronze',
    name: 'Community Ally',
    requirement: '25+ Verified Claims',
    popular: false,
    perks: ['Claim priority alerts', 'Basic impact report'],
  },
  {
    id: 'silver',
    name: 'Kitchen Champion',
    requirement: '100+ Verified Claims',
    popular: true,
    perks: ['Featured NGO profile', 'Weekly surplus digest', 'Priority support'],
  },
  {
    id: 'gold',
    name: 'Impact Leader',
    requirement: '250+ Verified Claims',
    popular: false,
    perks: ['Custom impact dashboard', 'Partnership invites', 'Annual recognition'],
  },
]

export default function ReceiverHome() {
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
          <p className="role-home__kicker">Receiver Hub</p>
          <h1>Empowering Communities through Nutritious Surplus</h1>
          <p>
            Discover verified surplus nearby, claim what your community needs, and
            track the impact you create with every pickup.
          </p>
          <div className="role-home__actions">
            <Link to="/receiver/find" className="role-home__cta">
              Claim Food
            </Link>
            <Link to="/receiver/claims" className="role-home__cta-ghost">
              My Claims
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
            src={receiverHeroImg}
            alt="Community receiver reviewing available surplus listings"
          />
          <div className="role-home__badge">Ready to claim</div>
        </div>
      </section>

      <section className="page">
        <div className="fl-section-head">
          <p className="role-home__eyebrow">Receiver Tools</p>
          <h2>Find, Claim &amp; Measure</h2>
          <p>Everything your kitchen needs to turn surplus into meals</p>
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
            placeholder="What worked well on your last claim?"
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
          <h2>Community Milestones</h2>
          <p>Unlock recognition as you feed more people</p>
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
        blurb="Questions about claims, partnerships, or volunteering? Reach out and we'll get back to you."
        subjects={['General Inquiry', 'Claim Support', 'Partnership']}
      />
    </div>
  )
}

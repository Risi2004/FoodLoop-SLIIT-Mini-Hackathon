import { useState } from 'react'
import { Link } from 'react-router-dom'
import './ReceiverHome.css'

const METRICS = [
  { id: 'meals', label: 'Meals Claimed', value: '128', hint: '+18 this month' },
  { id: 'badges', label: 'Badges Earned', value: '6', hint: 'Community Champion' },
  { id: 'impact', label: 'Impact Score', value: '92', hint: 'Top 15% locally' },
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
    <div className="receiver-home">
      <section className="page receiver-home__hero">
        <div className="receiver-home__hero-copy">
          <p className="receiver-home__kicker">Receiver Hub</p>
          <h1>Empowering Communities through Nutritious Surplus</h1>
          <p>
            Discover verified surplus nearby, claim what your community needs, and
            track the impact you create with every pickup.
          </p>
          <div className="receiver-home__actions">
            <Link to="/receiver/find" className="btn-lime">
              Find Food
            </Link>
            <Link to="/receiver/claims" className="btn-secondary">
              My Claims
            </Link>
          </div>
        </div>

        <div className="receiver-home__hero-visual" aria-hidden="true">
          <div className="receiver-home__hero-card">
            <span>Surplus nearby</span>
            <strong>24 listings</strong>
            <p>Fresh produce & prepared meals ready to claim</p>
          </div>
        </div>
      </section>

      <section className="page receiver-home__metrics">
        <div className="fl-section-head">
          <h2>Your community impact</h2>
          <p>Mock snapshot of meals, recognition, and overall score</p>
        </div>
        <div className="receiver-home__metrics-grid">
          {METRICS.map((metric) => (
            <article key={metric.id} className="receiver-metric-card">
              <p>{metric.label}</p>
              <strong>{metric.value}</strong>
              <span>{metric.hint}</span>
            </article>
          ))}
        </div>
      </section>

      <section className="page receiver-home__feedback">
        <div className="fl-section-head">
          <h2>Share feedback</h2>
          <p>Tell us how FoodLoop helps your community</p>
        </div>
        <form className="receiver-home__feedback-form" onSubmit={handleFeedbackSubmit}>
          <textarea
            value={feedback}
            onChange={(event) => setFeedback(event.target.value)}
            placeholder="What worked well on your last claim?"
            rows={5}
            required
          />
          <button type="submit" className="btn-primary">
            {sent ? 'Thanks!' : 'Send feedback'}
          </button>
        </form>
      </section>
    </div>
  )
}

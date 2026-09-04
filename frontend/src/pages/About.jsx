import { Link } from 'react-router-dom'
import './About.css'

const PILLARS = [
  {
    title: 'Reduce',
    text: 'Divert surplus food from landfills before it becomes waste.',
  },
  {
    title: 'Redistribute',
    text: 'Match verified surplus with nearby community receivers in real time.',
  },
  {
    title: 'Support',
    text: 'Empower donors, drivers, and NGOs with transparent logistics tools.',
  },
  {
    title: 'Promote',
    text: 'Celebrate impact with digital receipts, badges, and public trust.',
  },
]

const VALUES = [
  {
    title: 'Transparency',
    text: 'Every donation can be tracked from listing to delivery with a clear chain of custody.',
  },
  {
    title: 'Food Safety',
    text: 'Freshness checks, expiry awareness, and verification keep redistribution responsible.',
  },
  {
    title: 'Community Impact',
    text: 'We measure meals diverted, people fed, and methane avoided — not vanity metrics.',
  },
]

export default function About() {
  return (
    <div className="about-page">
      <section className="page about-hero">
        <div className="about-hero__copy">
          <p className="about-kicker">About FoodLoop</p>
          <h1>Connecting Surplus to Sustenance</h1>
          <p>
            FoodLoop is a real-time digital ecosystem that bridges food surplus and food
            scarcity. AI-assisted listing, verified logistics, and transparent tracking turn
            waste into nourishment.
          </p>
          <div className="about-hero__actions">
            <Link to="/signup/donor" className="btn-lime">
              Join as Donor
            </Link>
            <Link to="/signup/driver" className="btn-secondary about-hero__ghost">
              Volunteer as Driver
            </Link>
          </div>
        </div>
        <div className="about-hero__panel" aria-hidden="true">
          <div className="about-hero__stat">
            <strong>182k+</strong>
            <span>People Fed</span>
          </div>
          <div className="about-hero__stat">
            <strong>45.6t</strong>
            <span>Food Saved</span>
          </div>
          <div className="about-hero__stat">
            <strong>9.3t</strong>
            <span>Methane Avoided</span>
          </div>
        </div>
      </section>

      <section className="page about-mission">
        <div className="fl-section-head">
          <h2>Our Mission</h2>
          <p>Four pillars that keep the circular food economy moving</p>
        </div>
        <div className="about-mission__grid">
          {PILLARS.map((item) => (
            <article key={item.title} className="about-card">
              <h3>{item.title}</h3>
              <p>{item.text}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="page about-values">
        <div className="fl-section-head">
          <h2>Why FoodLoop Matters</h2>
          <p>Trust, safety, and measurable community outcomes</p>
        </div>
        <div className="about-values__grid">
          {VALUES.map((item) => (
            <article key={item.title} className="about-card about-card--dark">
              <h3>{item.title}</h3>
              <p>{item.text}</p>
            </article>
          ))}
        </div>
      </section>
    </div>
  )
}

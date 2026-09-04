import { Link } from 'react-router-dom'
import aboutEnvImg from '../assets/images/about-env.png'
import aboutEconImg from '../assets/images/about-econ.png'
import aboutSocialImg from '../assets/images/about-social.png'
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
]

const JOURNEY = [
  {
    id: 'env',
    title: 'Environmental Impact',
    blurb:
      'Every redirected meal cuts methane and protects water systems that would otherwise absorb landfill waste.',
    points: [
      { label: 'Methane Reduction', icon: 'leaf' },
      { label: 'Water Conservation', icon: 'drop' },
    ],
    image: aboutEnvImg,
    imageAlt: 'Community composting bins in a garden',
    side: 'text-left',
  },
  {
    id: 'econ',
    title: 'Economic Value',
    blurb:
      'Donors reduce disposal costs while communities gain reliable nutrition through efficient surplus logistics.',
    points: [
      { label: 'Disposal Savings', icon: 'coin' },
      { label: 'Supply Chain Efficiency', icon: 'loop' },
    ],
    image: aboutEconImg,
    imageAlt: 'Food logistics warehouse preparing surplus for delivery',
    side: 'text-right',
  },
  {
    id: 'social',
    title: 'Social Responsibility',
    blurb:
      'Verified surplus reaches people who need it — strengthening local food security and public wellbeing.',
    points: [
      { label: 'Vulnerable Communities', icon: 'people' },
      { label: 'Public Health', icon: 'heart' },
    ],
    image: aboutSocialImg,
    imageAlt: 'Volunteers distributing fresh produce to the community',
    side: 'text-left',
  },
]

const POINT_ICONS = {
  leaf: (
    <svg viewBox="0 0 24 24" width="16" height="16" aria-hidden="true">
      <path
        fill="currentColor"
        d="M17 8C8 10 5.9 16.2 4 21c1.5-.4 3-.5 4.4-.4 5.3.4 9.1-2.4 11-8.6 1.4-4.5.4-8.5.4-8.5S22.5 6.7 17 8Z"
      />
    </svg>
  ),
  drop: (
    <svg viewBox="0 0 24 24" width="16" height="16" aria-hidden="true">
      <path
        fill="currentColor"
        d="M12 2.7S7 9.1 7 13.2a5 5 0 0 0 10 0C17 9.1 12 2.7 12 2.7Z"
      />
    </svg>
  ),
  coin: (
    <svg viewBox="0 0 24 24" width="16" height="16" aria-hidden="true">
      <path
        fill="currentColor"
        d="M12 2a10 10 0 1 0 10 10A10 10 0 0 0 12 2Zm1 14.5v1.2h-2V16.4a3.3 3.3 0 0 1-2.4-1.1l1.4-1.4a1.7 1.7 0 0 0 1.3.6c.7 0 1.1-.3 1.1-.8s-.5-.8-1.6-.8c-1.6 0-2.7-.8-2.7-2.2a2.4 2.4 0 0 1 2.1-2.3V6.3h2v1.1a2.8 2.8 0 0 1 1.9.9l-1.3 1.4a1.4 1.4 0 0 0-1.1-.5c-.6 0-.9.3-.9.7s.5.7 1.7.7c1.8 0 2.8.9 2.8 2.3a2.6 2.6 0 0 1-2.3 2.4Z"
      />
    </svg>
  ),
  loop: (
    <svg viewBox="0 0 24 24" width="16" height="16" aria-hidden="true">
      <path
        fill="currentColor"
        d="M17.7 7.7A7 7 0 0 0 6.3 6.3L4.9 4.9 4 10h5.1L7.5 8.4a5 5 0 1 1 1.5 7.7l.9 1.8a7 7 0 0 0 7.8-10.2ZM6.3 16.3A7 7 0 0 0 17.7 17.7l1.4 1.4.9-5.1H15l1.6 1.6a5 5 0 1 1-1.5-7.7l-.9-1.8a7 7 0 0 0-7.9 10.2Z"
      />
    </svg>
  ),
  people: (
    <svg viewBox="0 0 24 24" width="16" height="16" aria-hidden="true">
      <path
        fill="currentColor"
        d="M16 11a3 3 0 1 0-3-3 3 3 0 0 0 3 3ZM8 11a3 3 0 1 0-3-3 3 3 0 0 0 3 3Zm0 2c-2.7 0-8 1.3-8 4v2h10v-2c0-2.7-5.3-4-8-4Zm8 0c-.3 0-.7 0-1 .1A5.4 5.4 0 0 1 18 17v2h6v-2c0-2.7-5.3-4-8-4Z"
      />
    </svg>
  ),
  heart: (
    <svg viewBox="0 0 24 24" width="16" height="16" aria-hidden="true">
      <path
        fill="currentColor"
        d="M12 21s-7.2-4.4-9.5-8.3A5.4 5.4 0 0 1 12 6.2a5.4 5.4 0 0 1 9.5 6.5C19.2 16.6 12 21 12 21Z"
      />
    </svg>
  ),
}

const MARKER_ICONS = {
  env: POINT_ICONS.leaf,
  econ: POINT_ICONS.coin,
  social: POINT_ICONS.people,
}

export default function About() {
  return (
    <div className="about-page">
      <section className="about-top">
        <div className="page about-top__inner">
          <div className="about-story-card">
            <p className="about-story-card__badge">The Food Loop Story</p>
            <h1>
              Every Meal Has <span>A Destiny.</span>
            </h1>
            <p>
              We ensure that destiny is fulfillment, not waste. Join us on a journey to
              close the loop.
            </p>
          </div>
        </div>
      </section>

      <section className="page about-mission">
        <h2>
          We are building a transparent loop to minimize waste and{' '}
          <span>maximize humanity</span>
        </h2>
        <div className="about-mission__grid">
          <div className="about-mission__copy">
            <p className="about-mission__lead">Ideally,</p>
            <p>
              FoodLoop connects donors, volunteer drivers, and community receivers so
              surplus food moves quickly, safely, and with full visibility.
            </p>
            <p>
              From AI-assisted listing to live routing and digital receipts, every step
              is designed to keep nutrition in the community and out of landfills.
            </p>
            <div className="about-mission__actions">
              <Link to="/signup/donor" className="btn-lime">
                Join as Donor
              </Link>
              <Link to="/signup/driver" className="btn-secondary">
                Volunteer as Driver
              </Link>
            </div>
          </div>
          <div className="about-mission__orb" aria-hidden="true">
            <strong>03</strong>
            <span>Entities</span>
            <span>One Loop</span>
          </div>
        </div>
      </section>

      <section className="page about-pillars">
        <div className="fl-section-head">
          <h2>Our Mission</h2>
          <p>Three roles that keep the circular food economy moving</p>
        </div>
        <div className="about-pillars__grid">
          {PILLARS.map((item) => (
            <article key={item.title} className="about-card">
              <h3>{item.title}</h3>
              <p>{item.text}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="page about-journey">
        <p className="about-journey__badge">Our Impact Journey</p>
        <div className="about-journey__list">
          {JOURNEY.map((item) => (
            <article
              key={item.id}
              className={`about-journey__row is-${item.side}`}
            >
              <div className="about-journey__content">
                <h3>{item.title}</h3>
                <p>{item.blurb}</p>
                <ul>
                  {item.points.map((point) => (
                    <li key={point.label}>
                      <span className="about-journey__point-icon">
                        {POINT_ICONS[point.icon]}
                      </span>
                      {point.label}
                    </li>
                  ))}
                </ul>
              </div>

              <div className="about-journey__marker" aria-hidden="true">
                {MARKER_ICONS[item.id]}
              </div>

              <figure className="about-journey__media">
                <img src={item.image} alt={item.imageAlt} />
              </figure>
            </article>
          ))}
        </div>
      </section>
    </div>
  )
}

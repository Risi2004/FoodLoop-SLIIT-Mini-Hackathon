import './AdminDashboard.css'

const STATS = [
  { label: 'Active users', value: '1,284' },
  { label: 'Open donations', value: '96' },
  { label: 'Claims today', value: '43' },
  { label: 'Drivers online', value: '27' },
]

export default function AdminDashboard() {
  return (
    <div className="admin-dashboard">
      <div className="page admin-dashboard__inner">
        <header className="fl-section-head admin-dashboard__head">
          <h2>Admin Dashboard</h2>
          <p>High-level FoodLoop operations snapshot</p>
        </header>

        <div className="admin-dashboard__stats">
          {STATS.map((stat) => (
            <article key={stat.label} className="admin-stat-card">
              <p>{stat.label}</p>
              <strong>{stat.value}</strong>
            </article>
          ))}
        </div>

        <section className="page-stub admin-dashboard__note">
          <h1>Operations shell</h1>
          <p>
            This admin view is a styling shell for upcoming moderation, reporting, and
            verification workflows.
          </p>
        </section>
      </div>
    </div>
  )
}

import './StatCard.css'

export default function StatCard({ label, value, trend, icon }) {
  return (
    <article className="stat-card">
      <div className="stat-card__top">
        <span className="stat-card__icon" aria-hidden="true">
          {icon}
        </span>
        <p className="stat-card__label">{label}</p>
      </div>
      <p className="stat-card__value">{value}</p>
      {trend && <p className="stat-card__trend">{trend}</p>}
    </article>
  )
}

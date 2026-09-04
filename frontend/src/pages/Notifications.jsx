import { useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { driverNotifications } from '../data/mockNotifications'
import authService from '../services/auth.service'
import './Notifications.css'

export default function Notifications() {
  const navigate = useNavigate()
  const [items, setItems] = useState(driverNotifications)
  const role = (authService.getRole() || '').toUpperCase()

  const groups = useMemo(() => {
    const today = items.filter((item) => item.group === 'today')
    const earlier = items.filter((item) => item.group === 'earlier')
    return [
      { id: 'today', label: 'Today', items: today },
      { id: 'earlier', label: 'Earlier', items: earlier },
    ].filter((group) => group.items.length > 0)
  }, [items])

  function handleDismiss(id) {
    setItems((prev) => prev.filter((item) => item.id !== id))
  }

  function handlePrimaryAction() {
    if (role === 'DONOR') navigate('/donor/new')
    else if (role === 'RECEIVER') navigate('/receiver/find')
    else navigate('/delivery')
  }

  const primaryLabel =
    role === 'DONOR' ? 'Post Donation' : role === 'RECEIVER' ? 'Find Food' : 'Claim Item'

  return (
    <div className="notifications-page">
      <div className="page notifications-page__inner">
        <section className="notifications-panel">
          {groups.length === 0 ? (
            <p className="notifications-empty">You&apos;re all caught up.</p>
          ) : (
            groups.map((group) => (
              <div key={group.id} className="notifications-group">
                <h2>{group.label}</h2>
                <div className="notifications-group__list">
                  {group.items.map((item) => (
                    <article key={item.id} className="notification-card">
                      <div className="notification-card__top">
                        <h3>{item.title}</h3>
                        <time>{item.timeLabel}</time>
                      </div>
                      <p>{item.body}</p>
                      <div className="notification-card__actions">
                        <button type="button" onClick={handlePrimaryAction}>
                          {primaryLabel}
                        </button>
                        <button
                          type="button"
                          className="is-dismiss"
                          onClick={() => handleDismiss(item.id)}
                        >
                          Dismiss
                        </button>
                      </div>
                    </article>
                  ))}
                </div>
              </div>
            ))
          )}
        </section>
      </div>
    </div>
  )
}

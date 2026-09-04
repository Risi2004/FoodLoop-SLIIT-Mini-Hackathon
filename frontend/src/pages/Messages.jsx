import './Messages.css'

const MESSAGES = [
  {
    id: 'm1',
    from: 'Green Kitchen Collective',
    preview: 'Pickup window moved to 5:30 PM — crates will be at the side door.',
    time: '12 min ago',
    unread: true,
  },
  {
    id: 'm2',
    from: 'FoodLoop Support',
    preview: 'Your organization verification documents were approved.',
    time: '2 hr ago',
    unread: true,
  },
  {
    id: 'm3',
    from: 'A. Perera',
    preview: 'Arrived at drop-off. Please confirm receiving handoff.',
    time: 'Yesterday',
    unread: false,
  },
]

export default function Messages() {
  return (
    <div className="messages-page">
      <div className="page messages-page__inner">
        <header className="fl-section-head messages-page__head">
          <h2>Messages</h2>
          <p>Conversation shell for donation coordination</p>
        </header>

        <div className="messages-page__list">
          {MESSAGES.map((message) => (
            <article
              key={message.id}
              className={`message-card${message.unread ? ' is-unread' : ''}`}
            >
              <div className="message-card__top">
                <h3>{message.from}</h3>
                <time>{message.time}</time>
              </div>
              <p>{message.preview}</p>
            </article>
          ))}
        </div>
      </div>
    </div>
  )
}

import { useState } from 'react'

const INITIAL = {
  name: '',
  email: '',
  subject: 'General Inquiry',
  message: '',
}

export default function RoleContact({
  blurb = 'Questions about FoodLoop or want to partner with us? Reach out and we will get back to you.',
  subjects = ['General Inquiry', 'Partnership', 'Support'],
}) {
  const [contact, setContact] = useState(INITIAL)
  const [sent, setSent] = useState(false)

  function handleChange(event) {
    const { name, value } = event.target
    setContact((prev) => ({ ...prev, [name]: value }))
  }

  function handleSubmit(event) {
    event.preventDefault()
    setContact(INITIAL)
    setSent(true)
    window.setTimeout(() => setSent(false), 2500)
  }

  return (
    <section className="role-contact-wrap">
      <div className="page role-contact">
        <div className="role-contact__info">
          <h2>We&apos;d love to hear from you.</h2>
          <p>{blurb}</p>
          <div className="role-contact__rows">
            <p>
              <strong>Email Us</strong>
              foodloop@gmail.com
            </p>
            <p>
              <strong>Visit Us</strong>
              Colombo, Sri Lanka
            </p>
          </div>
        </div>

        <form className="role-contact__form" onSubmit={handleSubmit}>
          <div className="role-contact__row">
            <label>
              <span>Name</span>
              <input
                name="name"
                value={contact.name}
                onChange={handleChange}
                placeholder="Your name"
                required
              />
            </label>
            <label>
              <span>Email</span>
              <input
                type="email"
                name="email"
                value={contact.email}
                onChange={handleChange}
                placeholder="Your email"
                required
              />
            </label>
          </div>

          <label>
            <span>Subject</span>
            <select name="subject" value={contact.subject} onChange={handleChange}>
              {subjects.map((subject) => (
                <option key={subject}>{subject}</option>
              ))}
            </select>
          </label>

          <label>
            <span>Message</span>
            <textarea
              name="message"
              rows={5}
              value={contact.message}
              onChange={handleChange}
              placeholder="Write your message..."
              required
            />
          </label>

          {sent && (
            <p className="role-contact__toast">Message sent — we&apos;ll reply soon.</p>
          )}
          <button type="submit">Send Message</button>
        </form>
      </div>
    </section>
  )
}

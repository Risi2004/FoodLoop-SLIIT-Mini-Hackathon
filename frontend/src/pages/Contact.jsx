import ContactSection from '../components/landing/ContactSection'
import './Contact.css'

export default function Contact() {
  return (
    <div className="contact-page">
      <div className="contact-page__intro page">
        <h1>Contact us</h1>
        <p>Have questions about FoodLoop or want to partner with us? We are here to help.</p>
      </div>
      <ContactSection />
    </div>
  )
}

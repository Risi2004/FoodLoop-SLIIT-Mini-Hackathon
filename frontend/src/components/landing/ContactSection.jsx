import React, { useState } from 'react';
import { Mail, MapPin, Send, CheckCircle } from 'lucide-react';
import './ContactSection.css';

export default function ContactSection() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    role: 'Donor / Restaurant',
    message: ''
  });
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.name || !formData.email || !formData.message) return;
    setIsSubmitted(true);
    setTimeout(() => {
      setIsSubmitted(false);
      setFormData({ name: '', email: '', role: 'Donor / Restaurant', message: '' });
    }, 4000);
  };

  return (
    <section id="contact" className="contact-section">
      <div className="container">
        <div className="contact-grid">
          {/* Left Column: Info */}
          <div className="contact-info-col">
            <div className="contact-badge">
              <span className="badge-dot"></span>
              <span>Get In Touch</span>
            </div>

            <h2 className="contact-heading">We'd love to hear from you.</h2>
            <p className="contact-subheading">
              Have questions about FoodLoop or want to partner with us? Drop a line and our team will get back to you shortly.
            </p>

            <div className="contact-cards-stack">
              <div className="contact-card-item">
                <div className="contact-card-icon-box">
                  <Mail size={22} className="contact-icon" />
                </div>
                <div className="contact-card-details">
                  <h4>Email Us</h4>
                  <p>Our friendly team is here to help.</p>
                  <a href="mailto:foodloop@gmail.com" className="contact-link">
                    foodloop@gmail.com
                  </a>
                </div>
              </div>

              <div className="contact-card-item">
                <div className="contact-card-icon-box">
                  <MapPin size={22} className="contact-icon" />
                </div>
                <div className="contact-card-details">
                  <h4>Visit Us</h4>
                  <p>Come say hello at our office HQ.</p>
                  <span className="contact-highlight">
                    Colombo, Sri Lanka
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Form */}
          <div className="contact-form-col">
            <div className="contact-form-card">
              {isSubmitted ? (
                <div className="form-success-state">
                  <CheckCircle size={54} className="success-icon" />
                  <h3>Message Sent Successfully!</h3>
                  <p>Thank you for reaching out. A FoodLoop coordinator will respond within 24 hours.</p>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="contact-form">
                  <div className="form-row">
                    <div className="form-group">
                      <label htmlFor="name">Name</label>
                      <input 
                        id="name" 
                        type="text" 
                        placeholder="John Doe" 
                        value={formData.name}
                        onChange={(e) => setFormData({...formData, name: e.target.value})}
                        required
                      />
                    </div>
                    <div className="form-group">
                      <label htmlFor="email">Email</label>
                      <input 
                        id="email" 
                        type="email" 
                        placeholder="john@example.com" 
                        value={formData.email}
                        onChange={(e) => setFormData({...formData, email: e.target.value})}
                        required
                      />
                    </div>
                  </div>

                  <div className="form-group">
                    <label htmlFor="role">Category / Role</label>
                    <select 
                      id="role"
                      value={formData.role}
                      onChange={(e) => setFormData({...formData, role: e.target.value})}
                    >
                      <option value="Donor / Restaurant">Donor / Restaurant</option>
                      <option value="Volunteer">Volunteer</option>
                      <option value="NGO Representative">NGO Representative</option>
                      <option value="General Inquiry">General Inquiry</option>
                    </select>
                  </div>

                  <div className="form-group">
                    <label htmlFor="message">Message</label>
                    <textarea 
                      id="message" 
                      rows={4}
                      placeholder="Tell us how we can help..." 
                      value={formData.message}
                      onChange={(e) => setFormData({...formData, message: e.target.value})}
                      required
                    ></textarea>
                  </div>

                  <button type="submit" className="contact-submit-btn">
                    <span>Send Message</span>
                    <Send size={16} />
                  </button>
                </form>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

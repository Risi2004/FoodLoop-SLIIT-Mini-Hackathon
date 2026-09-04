import React from 'react';
import { Link } from 'react-router-dom';
import { Lightbulb, Box, Check, Link2, Eye, HeartHandshake } from 'lucide-react';
import './VisionMission.css';

export default function VisionMission() {
  return (
    <section id="about" className="vision-mission-section">
      <div className="container">
        {/* Section Header */}
        <div className="section-header text-center">
          <h2 className="section-title">
            Connecting Surplus<br />to <span className="highlight-green">Sustenance</span>
          </h2>
          <p className="section-subtitle">
            We are building a world where food waste is a story of the past. By enabling transparent, traceable food donations everywhere, surplus finds its way to someone in need.
          </p>
        </div>

        {/* Bento Grid */}
        <div className="vision-mission-grid">
          {/* Card 01: Vision */}
          <div className="bento-card vision-card">
            <div className="card-top-row">
              <div className="card-icon-badge lightbulb-badge">
                <Lightbulb size={24} className="bulb-icon" />
              </div>
              <span className="card-number">01</span>
            </div>
            <h3 className="card-title">Our Vision</h3>
            <p className="card-body-text">
              To create a seamless, technology-driven ecosystem where no food goes to waste and hunger is eradicated through community collaboration and verification. We envision a future of abundance shared equitably.
            </p>
          </div>

          {/* Card 02: Mission */}
          <div className="bento-card mission-card">
            <div className="card-top-row">
              <div className="card-icon-badge box-badge">
                <Box size={24} className="box-icon" />
              </div>
              <span className="card-number light">02</span>
            </div>
            <h3 className="card-title light">Our Mission</h3>
            <ul className="mission-list">
              <li>
                <div className="check-bullet"><Check size={14} /></div>
                <div>
                  <strong>Reduce:</strong> Food waste at the source through smart management
                </div>
              </li>
              <li>
                <div className="check-bullet"><Check size={14} /></div>
                <div>
                  <strong>Redistribute:</strong> Surplus efficiently using real-time routing
                </div>
              </li>
              <li>
                <div className="check-bullet"><Check size={14} /></div>
                <div>
                  <strong>Support:</strong> Vulnerable communities and soup kitchens
                </div>
              </li>
              <li>
                <div className="check-bullet"><Check size={14} /></div>
                <div>
                  <strong>Promote:</strong> A culture of civic responsibility and care
                </div>
              </li>
            </ul>
          </div>

          {/* Card 03: Why FoodLoop Matters */}
          <div className="bento-card matters-card">
            <div className="card-icon-badge link-badge">
              <Link2 size={24} className="link-icon" />
            </div>
            <h3 className="card-title light">Why FoodLoop Matters</h3>
            <p className="card-body-text light">
              Transparency isn't just a feature; it's the foundation of trust. Every meal tracked is a meal delivered, and every impact verified is a story validated.
            </p>
          </div>

          {/* Card 04: Join CTA */}
          <div className="bento-card cta-card">
            <h3 className="cta-headline">
              Join us in turning<br />
              <span className="highlight-green">surplus into support.</span>
            </h3>
            <p className="cta-tagline">Together, we can close the gap.</p>
            
            <div className="cta-button-group">
              <Link to="/signup/driver" className="cta-volunteer-btn">
                <span>Join as Volunteer</span>
                <Eye size={16} />
              </Link>
              <Link to="/signup/donor" className="cta-donate-btn">
                <span>Donate Food</span>
                <HeartHandshake size={16} />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

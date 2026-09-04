import React from 'react';
import { CheckCircle2, Sparkles, Scan, ArrowUpRight } from 'lucide-react';
import heroImg from '../../assets/hero-kitchen.jpg';
import './HeroSection.css';

export default function HeroSection() {
  return (
    <section id="home" className="hero-section">
      <div className="hero-image-wrapper">
        <img 
          src={heroImg} 
          alt="FoodLoop Food Rescue & Listing with AI" 
          className="hero-bg-img"
        />
        <div className="hero-overlay"></div>

        {/* Floating AI Verification Badge */}
        <div className="hero-verified-badge glass-panel-dark animate-float">
          <div className="verified-badge-icon">
            <CheckCircle2 className="check-icon" size={22} />
          </div>
          <div className="verified-badge-text">
            <div className="verified-title-row">
              <span className="verified-title">FRESHNESS VERIFIED</span>
              <span className="live-dot"></span>
            </div>
            <span className="verified-subtitle">Listing ready for collection</span>
          </div>
        </div>

        {/* Floating Scan Target Effect */}
        <div className="hero-scanner-frame">
          <div className="scan-corner tl"></div>
          <div className="scan-corner tr"></div>
          <div className="scan-corner bl"></div>
          <div className="scan-corner br"></div>
          <div className="scan-bar"></div>
        </div>

        {/* Bottom Hero Glass Card */}
        <div className="hero-content-container container">
          <div className="hero-glass-card glass-panel-dark">
            <div className="card-badge">
              <Sparkles size={16} className="sparkle-icon" />
              <span>Smart Rescue System</span>
            </div>
            <h1 className="hero-title">
              AI-powered photo uploads for instant food categorization and listing.
            </h1>
            <p className="hero-desc">
              Transform surplus edible food into life-saving meals with automated nutritional categorization, instant quality estimation, and frictionless NGO distribution.
            </p>
            <div className="hero-actions">
              <a href="#about" className="hero-primary-btn">
                <span>Explore Platform</span>
                <ArrowUpRight size={18} />
              </a>
              <a href="#how-it-works" className="hero-secondary-btn">
                <span>See How It Works</span>
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

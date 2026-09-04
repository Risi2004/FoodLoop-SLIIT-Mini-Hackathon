import React from 'react';
import Navbar from '../components/common/Navbar';
import HeroSection from '../components/landing/HeroSection';
import StatsCounter from '../components/landing/StatsCounter';
import VisionMission from '../components/landing/VisionMission';
import TransparencyLoop from '../components/landing/TransparencyLoop';
import ContactSection from '../components/landing/ContactSection';
import Footer from '../components/layout/Footer';
import ChatBotWidget from '../components/common/ChatBotWidget';
import './LandingPage.css';

export default function LandingPage() {
  return (
    <div className="landing-page">
      <Navbar />
      <main className="landing-main">
        <HeroSection />
        <StatsCounter />
        <VisionMission />
        <TransparencyLoop />
        <ContactSection />
      </main>
      <Footer />
      <ChatBotWidget />
    </div>
  );
}

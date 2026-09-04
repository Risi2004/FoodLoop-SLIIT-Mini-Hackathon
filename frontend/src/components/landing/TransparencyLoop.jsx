import React from 'react';
import { 
  PlusCircle, 
  ShieldCheck, 
  Building, 
  Truck, 
  FileCheck2,
  ChevronRight
} from 'lucide-react';
import './TransparencyLoop.css';

const steps = [
  {
    id: 1,
    icon: <PlusCircle size={26} />,
    title: "Donor Add Foods",
    badgeText: "Red Status",
    badgeClass: "badge-red",
    desc: "Donor lists surplus food details and location."
  },
  {
    id: 2,
    icon: <ShieldCheck size={26} />,
    title: "Verified & Checked",
    badgeText: "PROCESSING",
    badgeClass: "badge-processing",
    desc: "System or volunteer verifies food quality and safety."
  },
  {
    id: 3,
    icon: <Building size={26} />,
    title: "Reached NGO",
    badgeText: "GREEN Status",
    badgeClass: "badge-green",
    desc: "Food is collected by volunteer or reached NGO hub."
  },
  {
    id: 4,
    icon: <Truck size={26} />,
    title: "Delivered to Needy",
    badgeText: "BLUE Status",
    badgeClass: "badge-blue",
    desc: "Final distribution to beneficiaries is completed."
  },
  {
    id: 5,
    icon: <FileCheck2 size={26} />,
    title: "Digital Receipt",
    badgeText: "IMPACT REPORT",
    badgeClass: "badge-impact",
    desc: "Donor receives a transparent report of the impact."
  }
];

export default function TransparencyLoop() {
  return (
    <section id="how-it-works" className="transparency-section">
      <div className="container">
        {/* Section Header */}
        <div className="section-header text-center">
          <h2 className="section-title">
            How the <span className="highlight-green">Transparency Loop</span> Works
          </h2>
          <p className="section-subtitle">
            Follow the journey of your food donation from listing to delivery with live status updates at every stage.
          </p>
        </div>

        {/* Steps Flow Grid */}
        <div className="steps-container">
          <div className="steps-grid">
            {steps.map((step, idx) => (
              <div key={step.id} className="step-card-wrapper">
                <div className="step-card">
                  <div className="step-icon-ring">
                    {step.icon}
                  </div>
                  <h3 className="step-title">{step.title}</h3>
                  <div className={`step-badge ${step.badgeClass}`}>
                    {step.badgeText}
                  </div>
                  <p className="step-desc">{step.desc}</p>
                </div>
                {idx < steps.length - 1 && (
                  <div className="step-connector">
                    <ChevronRight size={20} className="connector-arrow" />
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

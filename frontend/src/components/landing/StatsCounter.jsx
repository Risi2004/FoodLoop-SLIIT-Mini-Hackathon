import React from 'react';
import { 
  UserCheck, 
  Users, 
  Building2, 
  Coffee, 
  HeartHandshake, 
  Flame 
} from 'lucide-react';
import './StatsCounter.css';

const statsData = [
  {
    id: 1,
    icon: <UserCheck size={28} className="stat-icon" />,
    number: "12,540+",
    label: "Donors",
    sublabel: "Registered"
  },
  {
    id: 2,
    icon: <Users size={28} className="stat-icon" />,
    number: "3,280+",
    label: "Volunteers",
    sublabel: "Registered"
  },
  {
    id: 3,
    icon: <Building2 size={28} className="stat-icon" />,
    number: "1,120+",
    label: "NGOs",
    sublabel: "Registered"
  },
  {
    id: 4,
    icon: <Coffee size={28} className="stat-icon" />,
    number: "45,600 kg",
    label: "Food",
    sublabel: "Saved"
  },
  {
    id: 5,
    icon: <HeartHandshake size={28} className="stat-icon" />,
    number: "182,000+",
    label: "People",
    sublabel: "Fed"
  },
  {
    id: 6,
    icon: <Flame size={28} className="stat-icon" />,
    number: "9.3 tons",
    label: "Methane",
    sublabel: "Saved"
  }
];

export default function StatsCounter() {
  return (
    <section className="stats-section">
      <div className="stats-container container">
        <div className="stats-grid">
          {statsData.map((item) => (
            <div key={item.id} className="stat-card">
              <div className="stat-icon-container">
                {item.icon}
              </div>
              <div className="stat-number">{item.number}</div>
              <div className="stat-label">
                <span className="stat-main-text">{item.label}</span>
                <span className="stat-sub-text">{item.sublabel}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

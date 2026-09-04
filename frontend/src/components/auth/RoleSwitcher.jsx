import React from 'react';
import { Bike, Car, Truck } from 'lucide-react';
import './RoleSwitcher.css';

export default function RoleSwitcher({ 
  currentRole, 
  onRoleChange, 
  selectedVehicle, 
  onVehicleChange 
}) {
  const roles = [
    { id: 'donor', label: 'Donor' },
    { id: 'receiver', label: 'Receiver' },
    { id: 'driver', label: 'Driver' }
  ];

  const vehicles = [
    { id: 'scooter', label: 'Scooter', icon: <Bike size={18} /> },
    { id: 'motorcycle', label: 'Motorcycle', icon: <Bike size={18} /> },
    { id: 'car', label: 'Car', icon: <Car size={18} /> },
    { id: 'truck', label: 'Truck/Van', icon: <Truck size={18} /> }
  ];

  return (
    <div className="role-switcher-container">
      {/* Main Role Selector */}
      <div className="role-pill-bar">
        <span className="role-bar-label">Your Role</span>
        <div className="role-options">
          {roles.map((role) => (
            <button
              key={role.id}
              type="button"
              className={`role-option-btn ${currentRole === role.id ? 'active' : ''}`}
              onClick={() => onRoleChange(role.id)}
            >
              {role.label}
            </button>
          ))}
        </div>
      </div>

      {/* Driver Vehicle Sub-selector */}
      {currentRole === 'driver' && (
        <div className="vehicle-pill-bar animate-fade-in">
          <span className="vehicle-bar-label">Vehicle Types</span>
          <div className="vehicle-options">
            {vehicles.map((v) => (
              <button
                key={v.id}
                type="button"
                className={`vehicle-btn ${selectedVehicle === v.id ? 'active' : ''}`}
                onClick={() => onVehicleChange && onVehicleChange(v.id)}
                title={v.label}
              >
                {v.icon}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

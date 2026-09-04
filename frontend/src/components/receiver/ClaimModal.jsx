import React, { useState } from 'react';

const ClaimModal = ({ donation, onConfirm, onCancel }) => {
  const [quantity, setQuantity] = useState(1);

  const handleConfirm = () => {
    if (quantity > 0 && quantity <= donation.max) {
      onConfirm(donation.id, quantity);
    } else {
      alert(`Please enter a quantity between 1 and ${donation.max}`);
    }
  };

  return (
    <div style={{
      position: 'fixed',
      top: 0, left: 0, right: 0, bottom: 0,
      backgroundColor: 'rgba(0,0,0,0.5)',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center'
    }}>
      <div style={{ background: 'white', padding: '2rem', borderRadius: '8px', minWidth: '300px' }}>
        <h3>Claim: {donation.name}</h3>
        <p>Available: {donation.max}</p>
        <input
          type="number"
          min="1"
          max={donation.max}
          value={quantity}
          onChange={(e) => setQuantity(Number(e.target.value))}
        />
        <div style={{ marginTop: '1rem' }}>
          <button onClick={handleConfirm} style={{ marginRight: '1rem' }}>Confirm</button>
          <button onClick={onCancel}>Cancel</button>
        </div>
      </div>
    </div>
  );
};

export default ClaimModal;
import React, { useState } from 'react';
import './ClaimModal.css';

const ClaimModal = ({ donation, onConfirm, onCancel }) => {
  const [quantity, setQuantity] = useState(1);
  const maxQuantity = donation.remainingQuantity;

  const handleConfirm = () => {
    if (quantity < 1) {
      alert('Please enter a quantity of at least 1.');
      return;
    }
    if (quantity > maxQuantity) {
      alert(`Only ${maxQuantity} ${donation.unit} available.`);
      return;
    }
    onConfirm(donation._id, quantity);
  };

  return (
    <div className="modal-overlay" onClick={onCancel}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <h2>Claim Donation</h2>
        <p className="food-name">{donation.foodName}</p>
        <p className="available-info">
          <strong>Available:</strong> {maxQuantity} {donation.unit}
        </p>
        <p className="donor-info">
          <strong>From:</strong> {donation.donorId?.businessName || 'Unknown'}
        </p>

        <div className="quantity-control">
          <label htmlFor="quantity">How many {donation.unit} do you need?</label>
          <div className="quantity-input-group">
            <button
              type="button"
              onClick={() => setQuantity(Math.max(1, quantity - 1))}
              disabled={quantity <= 1}
            >
              −
            </button>
            <input
              id="quantity"
              type="number"
              min="1"
              max={maxQuantity}
              value={quantity}
              onChange={(e) => {
                const val = parseInt(e.target.value) || 1;
                setQuantity(Math.min(maxQuantity, Math.max(1, val)));
              }}
            />
            <button
              type="button"
              onClick={() => setQuantity(Math.min(maxQuantity, quantity + 1))}
              disabled={quantity >= maxQuantity}
            >
              +
            </button>
          </div>
          <p className="helper-text">Max: {maxQuantity} {donation.unit}</p>
        </div>

        <div className="modal-actions">
          <button className="btn-cancel" onClick={onCancel}>Cancel</button>
          <button className="btn-confirm" onClick={handleConfirm}>
            Confirm Claim
          </button>
        </div>
      </div>
    </div>
  );
};

export default ClaimModal;
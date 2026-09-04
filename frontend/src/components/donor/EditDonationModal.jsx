import React, { useState } from 'react';
import './EditDonationModal.css';

const EditDonationModal = ({ donation, onSave, onCancel }) => {
  const [form, setForm] = useState({
    foodName: donation.foodName || '',
    description: donation.description || '',
    pickupAddress: donation.pickupAddress || '',
    expiryDate: donation.expiryDate ? donation.expiryDate.split('T')[0] : '',
    unit: donation.unit || 'pieces',
  });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave(donation._id, form);
  };

  return (
    <div className="modal-overlay" onClick={onCancel}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <h2>Edit Donation</h2>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Food Name</label>
            <input
              name="foodName"
              value={form.foodName}
              onChange={handleChange}
              required
            />
          </div>
          <div className="form-group">
            <label>Description</label>
            <textarea
              name="description"
              value={form.description}
              onChange={handleChange}
              rows="3"
            />
          </div>
          <div className="form-group">
            <label>Pickup Address</label>
            <input
              name="pickupAddress"
              value={form.pickupAddress}
              onChange={handleChange}
              required
            />
          </div>
          <div className="form-group">
            <label>Expiry Date</label>
            <input
              type="date"
              name="expiryDate"
              value={form.expiryDate}
              onChange={handleChange}
            />
          </div>
          <div className="form-group">
            <label>Unit</label>
            <input
              name="unit"
              value={form.unit}
              onChange={handleChange}
              placeholder="e.g., pieces, kg, litres"
            />
          </div>
          <div className="modal-actions">
            <button type="button" className="btn-cancel" onClick={onCancel}>
              Cancel
            </button>
            <button type="submit" className="btn-confirm">
              Save Changes
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditDonationModal;
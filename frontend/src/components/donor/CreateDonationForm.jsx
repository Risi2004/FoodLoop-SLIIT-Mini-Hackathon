import React, { useState } from 'react';
import { createDonation } from '../../api/donationApi';

const CreateDonationForm = ({ onSuccess }) => {  // <-- accept prop
  const [form, setForm] = useState({
    foodName: '',
    totalQuantity: '',
    description: '',
    pickupAddress: '',
    expiryDate: '',
    unit: 'pieces'
  });
  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await createDonation({ ...form, totalQuantity: Number(form.totalQuantity) });
      setSuccess('Donation posted successfully!');
      setForm({
        foodName: '',
        totalQuantity: '',
        description: '',
        pickupAddress: '',
        expiryDate: '',
        unit: 'pieces'
      });
      setError('');
      if (onSuccess) onSuccess(); // <-- call parent refresh
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to post donation');
      setSuccess('');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="donation-form">
      {/* ... all the inputs unchanged ... */}
      <div className="form-row">
        <div className="form-group">
          <label>Food Name</label>
          <input name="foodName" placeholder="e.g., Bread, Rice" value={form.foodName} onChange={handleChange} required />
        </div>
        <div className="form-group">
          <label>Total Quantity</label>
          <input name="totalQuantity" type="number" placeholder="Quantity" value={form.totalQuantity} onChange={handleChange} required />
        </div>
      </div>
      {/* ... rest unchanged ... */}
      {success && <p className="success">{success}</p>}
      {error && <p className="error">{error}</p>}
      <button type="submit" className="btn-primary">Post Donation</button>
    </form>
  );
};

export default CreateDonationForm;
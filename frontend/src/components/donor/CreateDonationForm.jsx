import React, { useState } from 'react';
import { createDonation } from '../../api/donationApi';

const CreateDonationForm = () => {
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
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to post donation');
      setSuccess('');
    }
  };

  return (
    <form onSubmit={handleSubmit} style={{ border: '1px solid #ccc', padding: '1rem', margin: '1rem 0' }}>
      <input name="foodName" placeholder="Food Name" value={form.foodName} onChange={handleChange} required />
      <input name="totalQuantity" type="number" placeholder="Total Quantity" value={form.totalQuantity} onChange={handleChange} required />
      <input name="unit" placeholder="Unit (e.g., pieces, kg)" value={form.unit} onChange={handleChange} />
      <textarea name="description" placeholder="Description" value={form.description} onChange={handleChange} />
      <input name="pickupAddress" placeholder="Pickup Address" value={form.pickupAddress} onChange={handleChange} required />
      <input name="expiryDate" type="date" value={form.expiryDate} onChange={handleChange} />
      <button type="submit">Post Donation</button>
      {success && <p style={{ color: 'green' }}>{success}</p>}
      {error && <p style={{ color: 'red' }}>{error}</p>}
    </form>
  );
};

export default CreateDonationForm;
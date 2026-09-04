import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import axios from '../api/axiosInstance';

const Register = () => {
  const [form, setForm] = useState({
    email: '',
    password: '',
    role: 'donor',
    businessName: '',
    fssaiLicense: '',
    businessType: 'restaurant',
    kitchenAddress: '',
    contactPhone: '',
  });
  const [error, setError] = useState('');
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post('/auth/register', form);
      login(res.data.token, res.data.user);
      if (res.data.user.role === 'donor') navigate('/donor');
      else if (res.data.user.role === 'receiver') navigate('/receiver');
    } catch (err) {
      setError(err.response?.data?.error || 'Registration failed');
    }
  };

  return (
    <div>
      <h2>Register</h2>
      <form onSubmit={handleSubmit}>
        <input name="email" placeholder="Email" value={form.email} onChange={handleChange} required />
        <input name="password" placeholder="Password" type="password" value={form.password} onChange={handleChange} required />
        <select name="role" value={form.role} onChange={handleChange}>
          <option value="donor">Donor (Hotel/Restaurant)</option>
          <option value="receiver">Receiver (NGO/Charity)</option>
        </select>

        {form.role === 'donor' && (
          <>
            <input name="businessName" placeholder="Business Name" value={form.businessName} onChange={handleChange} required />
            <input name="fssaiLicense" placeholder="FSSAI License" value={form.fssaiLicense} onChange={handleChange} required />
            <select name="businessType" value={form.businessType} onChange={handleChange}>
              <option value="hotel">Hotel</option>
              <option value="restaurant">Restaurant</option>
              <option value="caterer">Caterer</option>
              <option value="other">Other</option>
            </select>
            <input name="kitchenAddress" placeholder="Kitchen Address" value={form.kitchenAddress} onChange={handleChange} />
            <input name="contactPhone" placeholder="Contact Phone" value={form.contactPhone} onChange={handleChange} />
          </>
        )}

        {form.role === 'receiver' && (
          <>
            <input name="orgName" placeholder="Organization Name" value={form.orgName} onChange={handleChange} required />
            <select name="orgType" value={form.orgType || 'ngo'} onChange={handleChange}>
              <option value="ngo">NGO</option>
              <option value="soup_kitchen">Soup Kitchen</option>
              <option value="religious">Religious Institute</option>
              <option value="community_center">Community Center</option>
              <option value="other">Other</option>
            </select>
            <input name="registrationNumber" placeholder="Registration Number" value={form.registrationNumber} onChange={handleChange} />
            <input name="pickupAddress" placeholder="Pickup Address" value={form.pickupAddress} onChange={handleChange} />
            <input name="contactPhone" placeholder="Contact Phone" value={form.contactPhone} onChange={handleChange} />
          </>
        )}

        <button type="submit">Register</button>
        {error && <p style={{ color: 'red' }}>{error}</p>}
      </form>
    </div>
  );
};

export default Register;
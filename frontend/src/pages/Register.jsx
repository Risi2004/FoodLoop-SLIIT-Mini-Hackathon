import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate, Link } from 'react-router-dom';
import axios from '../api/axiosInstance';
import './Register.css';  // <-- import the new styles

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
    // fields for receiver (add these for completeness)
    orgName: '',
    orgType: 'ngo',
    registrationNumber: '',
    pickupAddress: '',
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
    <div className="register-page">
      <div className="register-container">
        <h1>Create Account</h1>
        <form onSubmit={handleSubmit}>
          {/* Role Selection */}
          <div className="form-group">
            <label>Your Role</label>
            <div className="role-options">
              <label>
                <input
                  type="radio"
                  name="role"
                  value="donor"
                  checked={form.role === 'donor'}
                  onChange={handleChange}
                />
                Donor
              </label>
              <label>
                <input
                  type="radio"
                  name="role"
                  value="receiver"
                  checked={form.role === 'receiver'}
                  onChange={handleChange}
                />
                Receiver
              </label>
            </div>
          </div>

          {/* Email */}
          <div className="form-group">
            <label>Email</label>
            <input
              name="email"
              type="email"
              placeholder="john@example.com"
              value={form.email}
              onChange={handleChange}
              required
            />
          </div>

          {/* Password */}
          <div className="form-group">
            <label>Password</label>
            <input
              name="password"
              type="password"
              placeholder="********"
              value={form.password}
              onChange={handleChange}
              required
            />
          </div>

          {/* Conditional fields for donor */}
          {form.role === 'donor' && (
            <>
              <div className="form-group">
                <label>Business Name</label>
                <input
                  name="businessName"
                  placeholder="Your hotel/restaurant name"
                  value={form.businessName}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="form-group">
                <label>FSSAI License</label>
                <input
                  name="fssaiLicense"
                  placeholder="License number"
                  value={form.fssaiLicense}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="form-group">
                <label>Business Type</label>
                <select name="businessType" value={form.businessType} onChange={handleChange}>
                  <option value="hotel">Hotel</option>
                  <option value="restaurant">Restaurant</option>
                  <option value="caterer">Caterer</option>
                  <option value="other">Other</option>
                </select>
              </div>
              <div className="form-group">
                <label>Kitchen Address</label>
                <input
                  name="kitchenAddress"
                  placeholder="Address"
                  value={form.kitchenAddress}
                  onChange={handleChange}
                />
              </div>
              <div className="form-group">
                <label>Contact Phone</label>
                <input
                  name="contactPhone"
                  placeholder="Phone number"
                  value={form.contactPhone}
                  onChange={handleChange}
                />
              </div>
            </>
          )}

          {/* Conditional fields for receiver */}
          {form.role === 'receiver' && (
            <>
              <div className="form-group">
                <label>Organization Name</label>
                <input
                  name="orgName"
                  placeholder="NGO / Charity name"
                  value={form.orgName}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="form-group">
                <label>Organization Type</label>
                <select name="orgType" value={form.orgType} onChange={handleChange}>
                  <option value="ngo">NGO</option>
                  <option value="soup_kitchen">Soup Kitchen</option>
                  <option value="religious">Religious Institute</option>
                  <option value="community_center">Community Center</option>
                  <option value="other">Other</option>
                </select>
              </div>
              <div className="form-group">
                <label>Registration Number</label>
                <input
                  name="registrationNumber"
                  placeholder="Reg. number"
                  value={form.registrationNumber}
                  onChange={handleChange}
                />
              </div>
              <div className="form-group">
                <label>Pickup Address</label>
                <input
                  name="pickupAddress"
                  placeholder="Address"
                  value={form.pickupAddress}
                  onChange={handleChange}
                />
              </div>
              <div className="form-group">
                <label>Contact Phone</label>
                <input
                  name="contactPhone"
                  placeholder="Phone number"
                  value={form.contactPhone}
                  onChange={handleChange}
                />
              </div>
            </>
          )}

          {error && <p className="error">{error}</p>}
          <button type="submit" className="btn-primary">Register</button>
        </form>
        <p className="login-link">
          Already have an account? <Link to="/login">Sign In</Link>
        </p>
      </div>
    </div>
  );
};

export default Register;
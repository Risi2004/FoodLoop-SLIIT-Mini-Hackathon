import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Leaf, Eye, EyeOff, HeartHandshake, ArrowLeft, AlertCircle } from 'lucide-react';
import authService from '../services/auth.service';
import loginHeroImg from '../assets/images/login.png';
import './LoginPage.css';

export default function LoginPage() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    identifier: '',
    password: '',
    rememberMe: false
  });
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage('');
    setLoading(true);

    try {
      await authService.login(formData.identifier, formData.password);
      navigate('/');
    } catch (err) {
      setErrorMessage(err.message || 'Login failed. Please check your credentials.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page-wrapper">
      {/* Back to Home Button */}
      <Link to="/" className="auth-back-home">
        <ArrowLeft size={16} />
        <span>Back to Home</span>
      </Link>

      <div className="login-split-container">
        {/* Left Form Section */}
        <div className="login-form-side">
          {/* Brand */}
          <Link to="/" className="login-brand">
            <div className="login-logo-ring">
              <Leaf size={22} className="login-leaf-icon" />
            </div>
            <div className="login-brand-text">
              <span className="brand-name">Food<span className="brand-green">Loop</span></span>
              <span className="brand-slogan">Zero Waste. Infinite Impact</span>
            </div>
          </Link>

          {/* Heading */}
          <div className="login-heading-block">
            <h1 className="login-title">Welcome Back</h1>
            <p className="login-subtitle">Connect to minimize waste and maximize impact.</p>
          </div>

          {/* Green Form Card */}
          <div className="login-card">
            {errorMessage && (
              <div className="auth-error-banner">
                <AlertCircle size={18} className="error-banner-icon" />
                <span>{errorMessage}</span>
              </div>
            )}

            <form onSubmit={handleSubmit} className="login-form">
              <div className="auth-field-group">
                <label htmlFor="identifier">Email or Username</label>
                <input 
                  id="identifier"
                  type="text"
                  placeholder="Eg:-jjhon.John Doe@gmail.com"
                  value={formData.identifier}
                  onChange={(e) => setFormData({...formData, identifier: e.target.value})}
                  required
                />
              </div>

              <div className="auth-field-group">
                <label htmlFor="password">Password</label>
                <div className="password-input-wrap">
                  <input 
                    id="password"
                    type={showPassword ? 'text' : 'password'}
                    placeholder="••••••••••••"
                    value={formData.password}
                    onChange={(e) => setFormData({...formData, password: e.target.value})}
                    required
                  />
                  <button 
                    type="button" 
                    className="password-toggle-btn"
                    onClick={() => setShowPassword(!showPassword)}
                    aria-label="Toggle password visibility"
                  >
                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
              </div>

              <div className="login-options-row">
                <a href="#forgot" className="forgot-password-link">Forgot Password?</a>
                <label className="remember-me-label">
                  <input 
                    type="checkbox"
                    checked={formData.rememberMe}
                    onChange={(e) => setFormData({...formData, rememberMe: e.target.checked})}
                  />
                  <span className="custom-checkbox"></span>
                </label>
              </div>

              <button type="submit" className="login-submit-btn" disabled={loading}>
                {loading ? 'Signing in...' : 'Login'}
              </button>
            </form>
          </div>

          {/* Signup Links */}
          <div className="login-footer-links">
            <span className="footer-prompt">Don't have an account?</span>
            <div className="signup-role-links">
              <span>Sign up as a </span>
              <Link to="/signup/donor" className="role-link">Donor</Link>
              <span>, </span>
              <Link to="/signup/driver" className="role-link">Volunteer</Link>
              <span> or </span>
              <Link to="/signup/receiver" className="role-link">NGO</Link>
            </div>
          </div>
        </div>

        {/* Right Hero Image Section */}
        <div className="login-image-side">
          <img 
            src={loginHeroImg} 
            alt="FoodLoop Volunteers Delivering Food" 
            className="login-side-image"
          />
          <div className="login-image-overlay"></div>

          {/* Testimonial / Impact Quote Box */}
          <div className="login-quote-badge">
            <div className="quote-icon-circle">
              <HeartHandshake size={22} className="quote-icon" />
            </div>
            <div className="quote-text-block">
              <p className="quote-body">
                "Last year alone, we rescued <span className="quote-highlight">over 50 tons of food</span> and served <span className="quote-highlight">20,000 meals</span> to those in need."
              </p>
              <span className="quote-author">— The Food Loop Impact Report</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

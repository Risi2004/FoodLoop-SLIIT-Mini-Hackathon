import React, { useState, useEffect, useRef } from 'react';
import { Link, useParams, useNavigate } from 'react-router-dom';
import { User, Camera, ArrowLeft, Package, CheckCircle2 } from 'lucide-react';
import RoleSwitcher from '../components/auth/RoleSwitcher';
import FileUploadField from '../components/auth/FileUploadField';

import donorHeroImg from '../assets/images/donor.png';
import receiverHeroImg from '../assets/images/receiver.png';
import driverHeroImg from '../assets/images/driver.png';

import './SignupPage.css';

export default function SignupPage() {
  const { roleType } = useParams();
  const navigate = useNavigate();
  const profileInputRef = useRef(null);

  // Default to donor if not provided
  const currentRole = ['donor', 'receiver', 'driver'].includes(roleType) ? roleType : 'donor';

  const [formData, setFormData] = useState({
    // Common
    email: '',
    contactNo: '',
    address: '',
    password: '',
    retypePassword: '',
    profilePhoto: null,
    
    // Donor specific
    businessName: '',
    businessType: '',
    donorBusinessReg: null,
    donorAddressProof: null,

    // Receiver specific
    receiverName: '',
    receiverType: '',
    receiverBusinessReg: null,
    receiverAddressProof: null,

    // Driver specific
    driverName: '',
    vehicleNumber: '',
    vehicleType: 'scooter',
    driverNic: null,
    driverLicense: null
  });

  const [profilePreview, setProfilePreview] = useState(null);
  const [loading, setLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const handleRoleChange = (newRole) => {
    navigate(`/signup/${newRole}`);
  };

  const handleProfilePhotoChange = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      setFormData({ ...formData, profilePhoto: file });
      setProfilePreview(URL.createObjectURL(file));
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (formData.password !== formData.retypePassword) {
      alert("Passwords do not match!");
      return;
    }
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setIsSuccess(true);
    }, 1200);
  };

  // Role Metadata
  const roleConfig = {
    donor: {
      title: "Create Donor Account",
      image: donorHeroImg,
      badgeText: null,
      headline: (
        <>
          Turn Surplus into <span className="text-green-highlight">Sustenance</span>
        </>
      ),
      subtext: "Join our community of donors and ensure no food goes to waste. Your contributions feed families, not landfills.",
      showAvatarStack: true
    },
    receiver: {
      title: "Create Receiver Account",
      image: receiverHeroImg,
      badgeText: "Connecting 500+ NGOs",
      headline: (
        <>
          Partner with us to <span className="text-green-highlight">end hunger</span>
        </>
      ),
      subtext: "Join the transparency loop. Connect with donors and volunteers to distribute surplus food efficiently to those in need.",
      showAvatarStack: false
    },
    driver: {
      title: "Create Volunteer Driver Account",
      image: driverHeroImg,
      badgeText: "Connecting 500+ NGOs",
      headline: (
        <>
          Partner with us to <span className="text-green-highlight">end hunger</span>
        </>
      ),
      subtext: "Join the transparency loop. Connect with donors and volunteers to distribute surplus food efficiently to those in need.",
      showAvatarStack: false
    }
  };

  const config = roleConfig[currentRole];

  return (
    <div className="auth-page-wrapper">
      {/* Back Button */}
      <Link to="/" className="auth-back-home">
        <ArrowLeft size={16} />
        <span>Back to Home</span>
      </Link>

      <div className="signup-split-container">
        {/* Left Side: Hero Image & Quotes */}
        <div className="signup-image-side">
          <img 
            src={config.image} 
            alt={config.title} 
            className="signup-side-image"
          />
          <div className="signup-image-overlay"></div>

          {/* Optional Top-Left Badge */}
          {config.badgeText && (
            <div className="signup-top-badge glass-panel-dark">
              <span>{config.badgeText}</span>
            </div>
          )}

          {/* Bottom Headline & Content */}
          <div className="signup-image-content">
            <h2 className="signup-image-headline">{config.headline}</h2>
            <p className="signup-image-subtext">{config.subtext}</p>

            {/* Donor Avatar Stack */}
            {config.showAvatarStack && (
              <div className="active-donors-row">
                <div className="donor-avatar-stack">
                  <div className="donor-avatar-circle icon-yellow"><Package size={16} /></div>
                  <div className="donor-avatar-circle icon-yellow"><Package size={16} /></div>
                  <div className="donor-avatar-circle icon-yellow"><Package size={16} /></div>
                  <div className="donor-avatar-circle icon-yellow"><Package size={16} /></div>
                  <div className="donor-avatar-circle icon-yellow"><Package size={16} /></div>
                </div>
                <div className="active-donors-text">
                  <span>Active donors</span>
                  <span>worldwide</span>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Right Side: Form */}
        <div className="signup-form-side">
          <div className="signup-form-inner">
            {/* Title */}
            <h1 className="signup-page-title">{config.title}</h1>

            {/* Profile Photo Uploader */}
            <div className="profile-upload-center">
              <div 
                className="profile-photo-circle"
                onClick={() => profileInputRef.current?.click()}
              >
                {profilePreview ? (
                  <img src={profilePreview} alt="Profile" className="profile-preview-img" />
                ) : (
                  <User size={46} className="profile-default-icon" />
                )}
                <div className="profile-cam-badge">
                  <Camera size={14} />
                </div>
              </div>
              <input 
                type="file" 
                ref={profileInputRef} 
                onChange={handleProfilePhotoChange}
                accept="image/*"
                style={{ display: 'none' }}
              />
              <span className="profile-upload-label">
                Profile Photo {currentRole === 'receiver' ? '(File Upload)' : ''}
              </span>
            </div>

            {/* Role Switcher Tab Bar */}
            <div className="role-switcher-wrap">
              <RoleSwitcher 
                currentRole={currentRole}
                onRoleChange={handleRoleChange}
                selectedVehicle={formData.vehicleType}
                onVehicleChange={(v) => setFormData({...formData, vehicleType: v})}
              />
            </div>

            {/* Success State or Form */}
            {isSuccess ? (
              <div className="signup-success-view">
                <CheckCircle2 size={64} className="success-check-icon" />
                <h2>Account Created Successfully!</h2>
                <p>
                  Welcome to FoodLoop. Your {currentRole} registration has been submitted for instant verification.
                </p>
                <button className="goto-login-btn" onClick={() => navigate('/login')}>
                  Proceed to Login
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="signup-main-form">
                {/* 1. Donor Fields */}
                {currentRole === 'donor' && (
                  <>
                    <div className="form-two-col">
                      <div className="signup-field-group">
                        <label htmlFor="businessName">Business Name</label>
                        <input 
                          id="businessName"
                          type="text" 
                          placeholder="xmksn"
                          value={formData.businessName}
                          onChange={(e) => setFormData({...formData, businessName: e.target.value})}
                          required
                        />
                      </div>
                      <div className="signup-field-group">
                        <label htmlFor="businessType">Business Type</label>
                        <select 
                          id="businessType"
                          value={formData.businessType}
                          onChange={(e) => setFormData({...formData, businessType: e.target.value})}
                          required
                        >
                          <option value="">Select</option>
                          <option value="Restaurant">Restaurant / Cafe</option>
                          <option value="Supermarket">Supermarket / Grocery</option>
                          <option value="Bakery">Bakery / Confectionery</option>
                          <option value="Hotel">Hotel / Catering</option>
                          <option value="Event Organizer">Event Organizer</option>
                          <option value="Individual">Individual Donor</option>
                        </select>
                      </div>
                    </div>

                    <FileUploadField 
                      id="donorBusinessReg"
                      label="Business Registration Cards"
                      onChange={(file) => setFormData({...formData, donorBusinessReg: file})}
                    />

                    <div className="signup-field-group">
                      <label htmlFor="email">Email</label>
                      <input 
                        id="email"
                        type="email" 
                        placeholder="Eg:-John Doe@gmail.com"
                        value={formData.email}
                        onChange={(e) => setFormData({...formData, email: e.target.value})}
                        required
                      />
                    </div>

                    <div className="signup-field-group">
                      <label htmlFor="contactNo">Contact No</label>
                      <input 
                        id="contactNo"
                        type="tel" 
                        placeholder="Eg:-854558415"
                        value={formData.contactNo}
                        onChange={(e) => setFormData({...formData, contactNo: e.target.value})}
                        required
                      />
                    </div>

                    <div className="signup-field-group">
                      <label htmlFor="address">Address</label>
                      <input 
                        id="address"
                        type="text" 
                        placeholder="Eg:-colombo"
                        value={formData.address}
                        onChange={(e) => setFormData({...formData, address: e.target.value})}
                        required
                      />
                    </div>

                    <FileUploadField 
                      id="donorAddressProof"
                      label="Address Proof"
                      onChange={(file) => setFormData({...formData, donorAddressProof: file})}
                    />
                  </>
                )}

                {/* 2. Receiver Fields */}
                {currentRole === 'receiver' && (
                  <>
                    <div className="form-two-col">
                      <div className="signup-field-group">
                        <label htmlFor="receiverName">Receiver Name</label>
                        <input 
                          id="receiverName"
                          type="text" 
                          placeholder="xmksn"
                          value={formData.receiverName}
                          onChange={(e) => setFormData({...formData, receiverName: e.target.value})}
                          required
                        />
                      </div>
                      <div className="signup-field-group">
                        <label htmlFor="receiverType">Receiver Type</label>
                        <select 
                          id="receiverType"
                          value={formData.receiverType}
                          onChange={(e) => setFormData({...formData, receiverType: e.target.value})}
                          required
                        >
                          <option value="">Select</option>
                          <option value="Registered NGO">Registered NGO</option>
                          <option value="Community Kitchen">Community / Soup Kitchen</option>
                          <option value="Orphanage">Orphanage / Children Home</option>
                          <option value="Elder Home">Elders Care Home</option>
                          <option value="Shelter">Homeless Shelter</option>
                          <option value="School Feeding">School Feeding Program</option>
                        </select>
                      </div>
                    </div>

                    <FileUploadField 
                      id="receiverBusinessReg"
                      label="Business Registration Cards"
                      onChange={(file) => setFormData({...formData, receiverBusinessReg: file})}
                    />

                    <div className="signup-field-group">
                      <label htmlFor="email">Email</label>
                      <input 
                        id="email"
                        type="email" 
                        placeholder="Eg:-John Doe@gmail.com"
                        value={formData.email}
                        onChange={(e) => setFormData({...formData, email: e.target.value})}
                        required
                      />
                    </div>

                    <div className="signup-field-group">
                      <label htmlFor="contactNo">Contact No</label>
                      <input 
                        id="contactNo"
                        type="tel" 
                        placeholder="Eg:-854558415"
                        value={formData.contactNo}
                        onChange={(e) => setFormData({...formData, contactNo: e.target.value})}
                        required
                      />
                    </div>

                    <div className="signup-field-group">
                      <label htmlFor="address">Address</label>
                      <input 
                        id="address"
                        type="text" 
                        placeholder="Eg:-colombo"
                        value={formData.address}
                        onChange={(e) => setFormData({...formData, address: e.target.value})}
                        required
                      />
                    </div>

                    <FileUploadField 
                      id="receiverAddressProof"
                      label="Address Proof"
                      onChange={(file) => setFormData({...formData, receiverAddressProof: file})}
                    />
                  </>
                )}

                {/* 3. Driver Fields */}
                {currentRole === 'driver' && (
                  <>
                    <div className="form-two-col">
                      <div className="signup-field-group">
                        <label htmlFor="driverName">Driver Name</label>
                        <input 
                          id="driverName"
                          type="text" 
                          placeholder="xmksn"
                          value={formData.driverName}
                          onChange={(e) => setFormData({...formData, driverName: e.target.value})}
                          required
                        />
                      </div>
                      <div className="signup-field-group">
                        <label htmlFor="vehicleNumber">Vehicle number</label>
                        <input 
                          id="vehicleNumber"
                          type="text" 
                          placeholder="BYD 2344"
                          value={formData.vehicleNumber}
                          onChange={(e) => setFormData({...formData, vehicleNumber: e.target.value})}
                          required
                        />
                      </div>
                    </div>

                    <div className="signup-field-group">
                      <label htmlFor="email">Email</label>
                      <input 
                        id="email"
                        type="email" 
                        placeholder="Eg:-John Doe@gmail.com"
                        value={formData.email}
                        onChange={(e) => setFormData({...formData, email: e.target.value})}
                        required
                      />
                    </div>

                    <div className="signup-field-group">
                      <label htmlFor="contactNo">Contact No</label>
                      <input 
                        id="contactNo"
                        type="tel" 
                        placeholder="Eg:-854558415"
                        value={formData.contactNo}
                        onChange={(e) => setFormData({...formData, contactNo: e.target.value})}
                        required
                      />
                    </div>

                    <div className="signup-field-group">
                      <label htmlFor="address">Address</label>
                      <input 
                        id="address"
                        type="text" 
                        placeholder="Eg:-colombo"
                        value={formData.address}
                        onChange={(e) => setFormData({...formData, address: e.target.value})}
                        required
                      />
                    </div>

                    <FileUploadField 
                      id="driverNic"
                      label="NIC (Front & Back view)"
                      onChange={(file) => setFormData({...formData, driverNic: file})}
                    />

                    <FileUploadField 
                      id="driverLicense"
                      label="Driving License (Front & Back view)"
                      onChange={(file) => setFormData({...formData, driverLicense: file})}
                    />
                  </>
                )}

                {/* Common Password Fields */}
                <div className="form-two-col">
                  <div className="signup-field-group">
                    <label htmlFor="password">Password</label>
                    <input 
                      id="password"
                      type="password" 
                      placeholder="••••••••"
                      value={formData.password}
                      onChange={(e) => setFormData({...formData, password: e.target.value})}
                      required
                    />
                  </div>
                  <div className="signup-field-group">
                    <label htmlFor="retypePassword">Retype Password</label>
                    <input 
                      id="retypePassword"
                      type="password" 
                      placeholder="••••••••"
                      value={formData.retypePassword}
                      onChange={(e) => setFormData({...formData, retypePassword: e.target.value})}
                      required
                    />
                  </div>
                </div>

                {/* Submit Button */}
                <button type="submit" className="create-account-btn" disabled={loading}>
                  {loading ? 'Creating Account...' : 'Create Account'}
                </button>

                {/* Sign in footer */}
                <div className="signup-footer-bar">
                  <span>Already have an account? </span>
                  <Link to="/login" className="signin-link">Sign In</Link>
                </div>
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

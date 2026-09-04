import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { getActiveDonations, claimDonation } from '../api/donationApi';
import ClaimModal from '../components/receiver/ClaimModal';
import './ReceiverDashboard.css';

const ReceiverDashboard = () => {
  const { user, logout } = useAuth();
  const [donations, setDonations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedDonation, setSelectedDonation] = useState(null);
  const [error, setError] = useState('');

  const fetchDonations = async () => {
    try {
      setLoading(true);
      const res = await getActiveDonations();
      setDonations(res.data);
      setError('');
    } catch (err) {
      setError('Failed to load donations. Please try again.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDonations();
  }, []);

  const handleClaim = async (donationId, quantity) => {
    try {
      const res = await claimDonation(donationId, quantity);
      // Update local state with new remaining quantity
      setDonations((prev) =>
        prev.map((d) =>
          d._id === donationId
            ? { ...d, remainingQuantity: res.data.donation.remainingQuantity }
            : d
        )
      );
      setSelectedDonation(null);
    } catch (err) {
      alert(err.response?.data?.error || 'Claim failed. Please try again.');
    }
  };

  return (
    <div className="receiver-dashboard">
      <div className="dashboard-header">
        <h1>Available Donations</h1>
        <div className="header-right">
          <span className="user-email">{user?.email}</span>
          <button onClick={logout} className="logout-btn">Logout</button>
        </div>
      </div>

      {error && <p className="error-message">{error}</p>}

      {loading ? (
        <div className="loading-spinner">Loading available donations...</div>
      ) : donations.length === 0 ? (
        <div className="empty-state">
          <p>No active donations available at the moment.</p>
          <p className="sub-text">Check back later – new donations are added regularly.</p>
        </div>
      ) : (
        <div className="donation-grid">
          {donations.map((donation) => (
            <div key={donation._id} className="donation-card">
              <div className="card-header">
                <h3>{donation.foodName}</h3>
                <span className="status-badge active">Available</span>
              </div>
              <p className="donor-name">
                <strong>From:</strong> {donation.donorId?.businessName || 'Unknown'}
              </p>
              <p className="quantity">
                <strong>Available:</strong> {donation.remainingQuantity} {donation.unit}
              </p>
              <p className="expiry">
                <strong>Expires:</strong> {donation.expiryDate ? new Date(donation.expiryDate).toLocaleDateString() : 'N/A'}
              </p>
              <p className="pickup">
                <strong>Pickup:</strong> {donation.pickupAddress}
              </p>
              <button
                className="claim-btn"
                onClick={() => setSelectedDonation(donation)}
                disabled={donation.remainingQuantity === 0}
              >
                Claim
              </button>
            </div>
          ))}
        </div>
      )}

      {selectedDonation && (
        <ClaimModal
          donation={selectedDonation}
          onConfirm={handleClaim}
          onCancel={() => setSelectedDonation(null)}
        />
      )}
    </div>
  );
};

export default ReceiverDashboard;
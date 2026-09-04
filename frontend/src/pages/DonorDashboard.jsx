import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import CreateDonationForm from '../components/donor/CreateDonationForm';
import EditDonationModal from '../components/donor/EditDonationModal';
import ConfirmDeleteModal from '../components/donor/ConfirmDeleteModal';
import axios from '../api/axiosInstance';
import './DonorDashboard.css';

const DonorDashboard = () => {
  const { user, logout } = useAuth();
  const [donations, setDonations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingDonation, setEditingDonation] = useState(null);
  const [deletingDonationId, setDeletingDonationId] = useState(null);

  const fetchDonations = async () => {
    try {
      const res = await axios.get('/donations/mine');
      setDonations(res.data);
    } catch (err) {
      console.error('Failed to fetch donations:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDonations();
  }, []);

  const handleDonationCreated = () => {
    fetchDonations();
  };

  const handleEditClick = (donation) => {
    setEditingDonation(donation);
  };

  const handleEditSave = async (donationId, updatedData) => {
    try {
      await axios.put(`/donations/${donationId}`, updatedData);
      setEditingDonation(null);
      fetchDonations();
    } catch (err) {
      alert(err.response?.data?.error || 'Failed to update donation');
    }
  };

  const handleDeleteClick = (donationId) => {
    setDeletingDonationId(donationId);
  };

  const handleDeleteConfirm = async () => {
    try {
      await axios.delete(`/donations/${deletingDonationId}`);
      setDeletingDonationId(null);
      fetchDonations();
    } catch (err) {
      alert(err.response?.data?.error || 'Failed to delete donation');
    }
  };

  return (
    <div className="dashboard">
      <div className="dashboard-header">
        <h1>Donor Dashboard</h1>
        <button onClick={logout} className="logout-btn">Logout</button>
      </div>

      <p className="welcome-text">Welcome, {user?.email}</p>

      <div className="donation-section">
        <h2>Create New Donation</h2>
        <CreateDonationForm onSuccess={handleDonationCreated} />
      </div>

      <div className="donation-list-section">
        <h2>My Donations</h2>
        {loading ? (
          <p>Loading your donations...</p>
        ) : donations.length === 0 ? (
          <p className="empty-message">You haven't posted any donations yet.</p>
        ) : (
          <div className="donation-grid">
            {donations.map((donation) => (
              <div key={donation._id} className="donation-card">
                <h3>{donation.foodName}</h3>
                <p><strong>Total:</strong> {donation.totalQuantity} {donation.unit}</p>
                <p><strong>Remaining:</strong> {donation.remainingQuantity} {donation.unit}</p>
                <p><strong>Status:</strong>
                  <span className={`status-badge ${donation.status}`}>
                    {donation.status}
                  </span>
                </p>
                <p><strong>Expires:</strong> {donation.expiryDate ? new Date(donation.expiryDate).toLocaleDateString() : 'N/A'}</p>
                <p className="pickup-address"><strong>Pickup:</strong> {donation.pickupAddress}</p>
                
                <div className="card-actions">
                  <button 
                    className="btn-edit" 
                    onClick={() => handleEditClick(donation)}
                  >
                    ✎ Edit
                  </button>
                  <button 
                    className="btn-delete" 
                    onClick={() => handleDeleteClick(donation._id)}
                  >
                    ✕ Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {editingDonation && (
        <EditDonationModal
          donation={editingDonation}
          onSave={handleEditSave}
          onCancel={() => setEditingDonation(null)}
        />
      )}

      {deletingDonationId && (
        <ConfirmDeleteModal
          onConfirm={handleDeleteConfirm}
          onCancel={() => setDeletingDonationId(null)}
        />
      )}
    </div>
  );
};

export default DonorDashboard;
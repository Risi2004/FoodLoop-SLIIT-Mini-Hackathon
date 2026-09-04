import React from 'react';
import { useAuth } from '../context/AuthContext';
import CreateDonationForm from '../components/donor/CreateDonationForm';

const DonorDashboard = () => {
  const { user, logout } = useAuth();

  return (
    <div>
      <h1>Donor Dashboard</h1>
      <p>Welcome, {user?.email}</p>
      <button onClick={logout}>Logout</button>

      <h2>Create New Donation</h2>
      <CreateDonationForm />
    </div>
  );
};

export default DonorDashboard;
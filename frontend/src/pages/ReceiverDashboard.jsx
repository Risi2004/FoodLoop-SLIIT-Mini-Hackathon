import React from 'react';
import { useAuth } from '../context/AuthContext';
import DonationList from '../components/receiver/DonationList';

const ReceiverDashboard = () => {
  const { user, logout } = useAuth();

  return (
    <div>
      <h1>Receiver Dashboard</h1>
      <p>Welcome, {user?.email}</p>
      <button onClick={logout}>Logout</button>
      <DonationList />
    </div>
  );
};

export default ReceiverDashboard;
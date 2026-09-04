import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import LandingPage from './pages/LandingPage';
import LoginPage from './pages/LoginPage';
import SignupPage from './pages/SignupPage';
import DonorDashboard from './pages/DonorDashboard';
import ReceiverDashboard from './pages/ReceiverDashboard';

// Driver management
import Layout from './components/layout/Layout';
import Home from './pages/Home';
import About from './pages/About';
import Contact from './pages/Contact';
import Delivery from './pages/Delivery';
import MyPickups from './pages/MyPickups';
import Profile from './pages/Profile';
import EditProfile from './pages/EditProfile';
import Notifications from './pages/Notifications';
import Tracking from './pages/Tracking';
import './App.css';

const PrivateRoute = ({ children, allowedRoles }) => {
  const { user, loading } = useAuth();
  if (loading) return <div className="loading-spinner"><div className="spinner"></div></div>;
  if (!user) return <Navigate to="/login" replace />;
  if (allowedRoles) {
    const userRole = (user.role || '').toUpperCase();
    const hasRole = allowedRoles.some((r) => r.toUpperCase() === userRole);
    if (!hasRole) return <Navigate to="/" replace />;
  }
  return children;
};

function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="app-root">
          <Routes>
            {/* Landing & Marketing */}
            <Route path="/" element={<LandingPage />} />

            {/* Authentication */}
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<Navigate to="/signup/donor" replace />} />
            <Route path="/signup" element={<Navigate to="/signup/donor" replace />} />
            <Route path="/signup/:roleType" element={<SignupPage />} />

            {/* Donor & Receiver Dashboards */}
            <Route
              path="/donor"
              element={
                <PrivateRoute allowedRoles={['DONOR', 'donor']}>
                  <DonorDashboard />
                </PrivateRoute>
              }
            />
            <Route
              path="/receiver"
              element={
                <PrivateRoute allowedRoles={['RECEIVER', 'receiver']}>
                  <ReceiverDashboard />
                </PrivateRoute>
              }
            />

            {/* Driver Management */}
            <Route element={<Layout />}>
              <Route path="/driver" element={<Home />} />
              <Route path="/about" element={<About />} />
              <Route path="/contact" element={<Contact />} />
              <Route path="/delivery" element={<Delivery />} />
              <Route path="/my-pickups" element={<MyPickups />} />
              <Route path="/profile" element={<Profile />} />
              <Route path="/profile/edit" element={<EditProfile />} />
              <Route path="/notifications" element={<Notifications />} />
              <Route path="/tracking/:id" element={<Tracking />} />
            </Route>

            {/* Fallback */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;

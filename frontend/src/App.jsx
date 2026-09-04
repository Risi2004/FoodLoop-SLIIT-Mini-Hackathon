import React from 'react'
import { BrowserRouter as Router, Routes, Route, Navigate, Outlet, useLocation } from 'react-router-dom'
import { AuthProvider } from './context/AuthContext'
import LandingPage from './pages/LandingPage'
import LoginPage from './pages/LoginPage'
import SignupPage from './pages/SignupPage'

import Layout from './components/layout/Layout'
import SmartLayout from './components/layout/SmartLayout'
import RequireRole from './components/auth/RequireRole'
import authService from './services/auth.service'

import Home from './pages/Home'
import About from './pages/About'
import Contact from './pages/Contact'
import Delivery from './pages/Delivery'
import MyPickups from './pages/MyPickups'
import Profile from './pages/Profile'
import EditProfile from './pages/EditProfile'
import Notifications from './pages/Notifications'
import Tracking from './pages/Tracking'

import DonorHome from './pages/donor/DonorHome'
import NewDonation from './pages/donor/NewDonation'
import MyDonations from './pages/donor/MyDonations'
import DonorProfile from './pages/donor/DonorProfile'
import DonorEditProfile from './pages/donor/DonorEditProfile'

import ReceiverHome from './pages/receiver/ReceiverHome'
import FindFood from './pages/receiver/FindFood'
import MyClaims from './pages/receiver/MyClaims'
import ReceiverProfile from './pages/receiver/ReceiverProfile'
import ReceiverProfileEdit from './pages/receiver/ReceiverProfileEdit'

import PrivacyPolicy from './pages/PrivacyPolicy'
import TermsConditions from './pages/TermsConditions'
import DigitalReceipt from './pages/DigitalReceipt'
import Messages from './pages/Messages'
import Reviews from './pages/Reviews'
import AdminDashboard from './pages/admin/AdminDashboard'
import UserManagement from './pages/admin/UserManagement'

import './App.css'

/** Outlet-based role gate (same storage keys as driver RequireRole) */
function RoleOutlet({ allow = [] }) {
  const location = useLocation()

  if (!authService.isAuthenticated()) {
    return <Navigate to="/login" state={{ from: location }} replace />
  }

  const role = (authService.getRole() || '').toUpperCase()
  const allowed = allow.map((value) => value.toUpperCase())

  if (allowed.length > 0 && !allowed.includes(role)) {
    return <Navigate to={authService.getDashboardPath(role)} replace />
  }

  return <Outlet />
}

function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="app-root">
          <Routes>
            <Route path="/" element={<LandingPage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<Navigate to="/signup/donor" replace />} />
            <Route path="/signup" element={<Navigate to="/signup/donor" replace />} />
            <Route path="/signup/:roleType" element={<SignupPage />} />

            <Route element={<SmartLayout />}>
              <Route path="/about" element={<About />} />
              <Route path="/contact" element={<Contact />} />
              <Route path="/privacy" element={<PrivacyPolicy />} />
              <Route path="/terms" element={<TermsConditions />} />
              <Route path="/receipt" element={<DigitalReceipt />} />
              <Route path="/receipt/:id" element={<DigitalReceipt />} />
              <Route path="/messages" element={<Messages />} />
              <Route path="/reviews" element={<Reviews />} />
              <Route path="/admin" element={<AdminDashboard />} />
              <Route path="/admin/users" element={<UserManagement />} />
            </Route>

            <Route element={<RoleOutlet allow={['DONOR']} />}>
              <Route element={<Layout role="DONOR" />}>
                <Route path="/donor" element={<DonorHome />} />
                <Route path="/donor/new" element={<NewDonation />} />
                <Route path="/donor/donations" element={<MyDonations />} />
                <Route path="/donor/profile" element={<DonorProfile />} />
                <Route path="/donor/profile/edit" element={<DonorEditProfile />} />
                <Route path="/donor/notifications" element={<Notifications />} />
              </Route>
            </Route>

            <Route element={<RoleOutlet allow={['RECEIVER']} />}>
              <Route element={<Layout role="RECEIVER" />}>
                <Route path="/receiver" element={<ReceiverHome />} />
                <Route path="/receiver/find" element={<FindFood />} />
                <Route path="/receiver/claims" element={<MyClaims />} />
                <Route path="/receiver/profile" element={<ReceiverProfile />} />
                <Route path="/receiver/profile/edit" element={<ReceiverProfileEdit />} />
                <Route path="/receiver/notifications" element={<Notifications />} />
              </Route>
            </Route>

            <Route element={<RequireRole allow={['DRIVER']} />}>
              <Route element={<Layout role="DRIVER" />}>
                <Route path="/driver" element={<Home />} />
                <Route path="/delivery" element={<Delivery />} />
                <Route path="/my-pickups" element={<MyPickups />} />
                <Route path="/profile" element={<Profile />} />
                <Route path="/profile/edit" element={<EditProfile />} />
                <Route path="/notifications" element={<Notifications />} />
                <Route path="/tracking/:id" element={<Tracking />} />
              </Route>
            </Route>

            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </div>
      </Router>
    </AuthProvider>
  )
}

export default App

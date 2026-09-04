import React from 'react'
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import LandingPage from './pages/LandingPage'
import LoginPage from './pages/LoginPage'
import SignupPage from './pages/SignupPage'
import Layout from './components/layout/Layout'
import Home from './pages/Home'
import About from './pages/About'
import Contact from './pages/Contact'
import Delivery from './pages/Delivery'
import MyPickups from './pages/MyPickups'
import Profile from './pages/Profile'
import EditProfile from './pages/EditProfile'
import Notifications from './pages/Notifications'
import Tracking from './pages/Tracking'
import './App.css'

function App() {
  return (
    <Router>
      <div className="app-root">
        <Routes>
          {/* Auth / marketing */}
          <Route path="/" element={<LandingPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/signup" element={<Navigate to="/signup/donor" replace />} />
          <Route path="/signup/:roleType" element={<SignupPage />} />

          {/* Driver management */}
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

          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </div>
    </Router>
  )
}

export default App

import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom'
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

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<Layout />}>
          <Route index element={<Home />} />
          <Route path="about" element={<About />} />
          <Route path="contact" element={<Contact />} />
          <Route path="delivery" element={<Delivery />} />
          <Route path="my-pickups" element={<MyPickups />} />
          <Route path="profile" element={<Profile />} />
          <Route path="profile/edit" element={<EditProfile />} />
          <Route path="notifications" element={<Notifications />} />
          <Route path="tracking/:id" element={<Tracking />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Route>
      </Routes>
    </BrowserRouter>
  )
}

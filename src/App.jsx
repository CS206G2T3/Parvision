import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import LoginPage from './pages/LoginPage'
import ForgotPasswordPage from './pages/ForgotPasswordPage'
import HomePage from './pages/HomePage'
import ProfilePage from './pages/ProfilePage'
import CollectionPage from './pages/CollectionPage'
import ClubDetailPage from './pages/ClubDetailPage'
import ActivityPage from './pages/ActivityPage'
import VideoPage from './pages/VideoPage'

export default function App() {
  return (
    <BrowserRouter>
      <div className="phone-wrapper">
        <div className="phone-frame">
          <Routes>
            <Route path="/" element={<Navigate to="/login" replace />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/forgot-password" element={<ForgotPasswordPage />} />
            <Route path="/home" element={<HomePage />} />
            <Route path="/profile" element={<ProfilePage />} />
            <Route path="/collection" element={<CollectionPage />} />
            <Route path="/collection/:category" element={<ClubDetailPage />} />
            <Route path="/activity" element={<ActivityPage />} />
            <Route path="/video" element={<VideoPage />} />
          </Routes>
        </div>
      </div>
    </BrowserRouter>
  )
}

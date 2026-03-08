import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import LoginPage from './pages/LoginPage'
import ForgotPasswordPage from './pages/ForgotPasswordPage'
import HomePage from './pages/HomePage'
import ProfilePage from './pages/ProfilePage'
import CollectionPage from './pages/CollectionPage'
import ClubDetailPage from './pages/ClubDetailPage'
import ActivityPage from './pages/ActivityPage'
import VideoPage from './pages/VideoPage'
import DrillsPage from './pages/DrillsPage'
import UploadPage from './pages/UploadPage'
import UploadSelectModePage from './pages/UploadSelectModePage'
import UploadProcessingPage from './pages/UploadProcessingPage'
import UploadResultsPage from './pages/UploadResultsPage'
import GalleryPage from './pages/GalleryPage'
import BallTracerSetupPage from './pages/BallTracerSetupPage'
import CommunitiesPage from './pages/CommunitiesPage'

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
            <Route path="/drills" element={<DrillsPage />} />
            <Route path="/upload" element={<UploadPage />} />
            <Route path="/upload/gallery" element={<GalleryPage />} />
            <Route path="/upload/select-mode" element={<UploadSelectModePage />} />
            <Route path="/upload/ball-tracer-setup" element={<BallTracerSetupPage />} />
            <Route path="/upload/processing" element={<UploadProcessingPage />} />
            <Route path="/upload/results" element={<UploadResultsPage />} />
            <Route path="/community" element={<CommunitiesPage />} />
          </Routes>
        </div>
      </div>
    </BrowserRouter>
  )
}

import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { AuthProvider } from './context/AuthContext'
import ProtectedRoute from './components/ProtectedRoute'
import LoginPage from './pages/LoginPage'
import SignUpPage from './pages/SignUpPage'
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
import DrillDetailPage from './pages/DrillDetailPage'

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <div className="phone-wrapper">
          <div className="phone-frame">
            <Routes>
              <Route path="/" element={<Navigate to="/login" replace />} />
              <Route path="/login" element={<LoginPage />} />
              <Route path="/signup" element={<SignUpPage />} />
              <Route path="/forgot-password" element={<ForgotPasswordPage />} />
              <Route path="/home" element={<ProtectedRoute><HomePage /></ProtectedRoute>} />
              <Route path="/profile" element={<ProtectedRoute><ProfilePage /></ProtectedRoute>} />
              <Route path="/collection" element={<ProtectedRoute><CollectionPage /></ProtectedRoute>} />
              <Route path="/collection/:category" element={<ProtectedRoute><ClubDetailPage /></ProtectedRoute>} />
              <Route path="/activity" element={<ProtectedRoute><ActivityPage /></ProtectedRoute>} />
              <Route path="/video" element={<ProtectedRoute><VideoPage /></ProtectedRoute>} />
              <Route path="/drills" element={<ProtectedRoute><DrillsPage /></ProtectedRoute>} />
              <Route path="/drills/:id" element={<ProtectedRoute><DrillDetailPage /></ProtectedRoute>} />
              <Route path="/upload" element={<ProtectedRoute><UploadPage /></ProtectedRoute>} />
              <Route path="/upload/gallery" element={<ProtectedRoute><GalleryPage /></ProtectedRoute>} />
              <Route path="/upload/select-mode" element={<ProtectedRoute><UploadSelectModePage /></ProtectedRoute>} />
              <Route path="/upload/ball-tracer-setup" element={<ProtectedRoute><BallTracerSetupPage /></ProtectedRoute>} />
              <Route path="/upload/processing" element={<ProtectedRoute><UploadProcessingPage /></ProtectedRoute>} />
              <Route path="/upload/results" element={<ProtectedRoute><UploadResultsPage /></ProtectedRoute>} />
              <Route path="/community" element={<ProtectedRoute><CommunitiesPage /></ProtectedRoute>} />
            </Routes>
          </div>
        </div>
      </BrowserRouter>
    </AuthProvider>
  )
}

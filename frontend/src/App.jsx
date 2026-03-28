import { useState, useCallback } from 'react'
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { AuthProvider, useAuth } from './context/AuthContext'
import SplashScreen from './components/SplashScreen'

// Pages
import LoginPage           from './pages/LoginPage'
import SignUpPage          from './pages/SignUpPage'
import ForgotPasswordPage  from './pages/ForgotPasswordPage'
import HomePage            from './pages/HomePage'
import UploadPage          from './pages/UploadPage'
import GalleryPage         from './pages/GalleryPage'
import UploadSelectModePage   from './pages/UploadSelectModePage'
import BallTracerSetupPage    from './pages/BallTracerSetupPage'
import UploadProcessingPage   from './pages/UploadProcessingPage'
import UploadResultsPage      from './pages/UploadResultsPage'
import CommunitiesPage     from './pages/CommunitiesPage'
import ActivityPage        from './pages/ActivityPage'
import VideoPage           from './pages/VideoPage'
import CollectionPage      from './pages/CollectionPage'
import ClubDetailPage      from './pages/ClubDetailPage'
import DrillsPage          from './pages/DrillsPage'
import DrillDetailPage     from './pages/DrillDetailPage'
import ProfilePage         from './pages/ProfilePage'
import CheckInPage         from './pages/CheckInPage'
import TakeOffPage         from './pages/TakeOffPage'
import SearchPage          from './pages/SearchPage'

function ProtectedRoute({ children }) {
  const { user } = useAuth()
  return user ? children : <Navigate to="/login" replace />
}

function AppRoutes() {
  return (
    <Routes>
      {/* Auth */}
      <Route path="/login"           element={<LoginPage />} />
      <Route path="/signup"          element={<SignUpPage />} />
      <Route path="/forgot-password" element={<ForgotPasswordPage />} />

      {/* Protected */}
      <Route path="/home"       element={<ProtectedRoute><HomePage /></ProtectedRoute>} />
      <Route path="/upload"     element={<ProtectedRoute><UploadPage /></ProtectedRoute>} />
      <Route path="/upload/gallery"          element={<ProtectedRoute><GalleryPage /></ProtectedRoute>} />
      <Route path="/upload/select-mode"      element={<ProtectedRoute><UploadSelectModePage /></ProtectedRoute>} />
      <Route path="/upload/ball-tracer-setup" element={<ProtectedRoute><BallTracerSetupPage /></ProtectedRoute>} />
      <Route path="/upload/processing"       element={<ProtectedRoute><UploadProcessingPage /></ProtectedRoute>} />
      <Route path="/upload/results"          element={<ProtectedRoute><UploadResultsPage /></ProtectedRoute>} />
      <Route path="/community"  element={<ProtectedRoute><CommunitiesPage /></ProtectedRoute>} />
      <Route path="/activity"   element={<ProtectedRoute><ActivityPage /></ProtectedRoute>} />
      <Route path="/video"      element={<ProtectedRoute><VideoPage /></ProtectedRoute>} />
      <Route path="/collection" element={<ProtectedRoute><CollectionPage /></ProtectedRoute>} />
      <Route path="/collection/:category" element={<ProtectedRoute><ClubDetailPage /></ProtectedRoute>} />
      <Route path="/drills"     element={<ProtectedRoute><DrillsPage /></ProtectedRoute>} />
      <Route path="/drills/:id" element={<ProtectedRoute><DrillDetailPage /></ProtectedRoute>} />
      <Route path="/profile"    element={<ProtectedRoute><ProfilePage /></ProtectedRoute>} />
      <Route path="/check-in"   element={<ProtectedRoute><CheckInPage /></ProtectedRoute>} />
      <Route path="/take-off"   element={<ProtectedRoute><TakeOffPage /></ProtectedRoute>} />
      <Route path="/search"     element={<ProtectedRoute><SearchPage /></ProtectedRoute>} />

      {/* Default */}
      <Route path="*" element={<Navigate to="/login" replace />} />
    </Routes>
  )
}

export default function App() {
  const [splashDone, setSplashDone] = useState(false)
  const handleSplashFinish = useCallback(() => setSplashDone(true), [])

  return (
    <AuthProvider>
      <BrowserRouter>
        {/* Splash sits on top until it fades out */}
        {!splashDone && <SplashScreen onFinish={handleSplashFinish} duration={2200} />}
        <AppRoutes />
      </BrowserRouter>
    </AuthProvider>
  )
}
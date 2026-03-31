import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import loginLogo from '../assets/loginpagelogo.png'
import alternateEmail from '../assets/alternate_email.png'
import { IMG_LOCK_ICON, IMG_ARROW_BACK, IMG_GB_FLAG, IMG_EXPAND_MORE } from '../icons'

const IMG_GOLF_ILLUSTRATION = loginLogo
const IMG_EMAIL_ICON = alternateEmail

export default function LoginPage() {
  const navigate = useNavigate()
  const { login } = useAuth()
  const [identifier, setIdentifier] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState(false)
  const [success, setSuccess] = useState(false)
  const [loading, setLoading] = useState(false)
  const [toast, setToast] = useState('')
  const showToast = (msg) => { setToast(msg); setTimeout(() => setToast(''), 2000) }

  const handleLogin = async (e) => {
    e.preventDefault()
    setLoading(true)
    try {
      const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001'
      const res = await fetch(`${API_URL}/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ identifier, password }),
      })
      if (res.ok) {
        login(await res.json())
        setSuccess(true)
        setTimeout(() => navigate('/home', { replace: true }), 1500)
      } else {
        setError(true)
      }
    } catch {
      setError(true)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="relative w-full bg-[#fcfcfc] flex flex-col min-h-[852px]">

      {/* Header bar */}
      <div className="relative w-full h-[69px] bg-[#fcfcfc] flex-shrink-0">
        <button
          onClick={() => navigate(-1)}
          className="absolute left-6 top-[53px] w-6 h-6 flex items-center justify-center"
          aria-label="Go back"
        >
          <img src={IMG_ARROW_BACK} alt="Back" className="w-full h-full object-contain" />
        </button>
        <div className="absolute right-[24px] top-[53px] flex items-center gap-1 px-2 py-[6px] rounded">
          <img src={IMG_GB_FLAG} alt="English" className="w-[22px] h-[22px] rounded-full object-cover" />
          <img src={IMG_EXPAND_MORE} alt="Expand" className="w-[18px] h-[18px]" />
        </div>
      </div>

      {/* Golf illustration — always shown */}
      <div className="flex-shrink-0 px-6 mt--5">
          <img
            src={IMG_GOLF_ILLUSTRATION}
            alt="Golf illustration"
            className="w-full max-w-[360px] h-[360px] object-contain mx-auto"
          />
        </div>

      {/* Login title */}
      <div className={`px-6 flex-shrink-0 ${error ? 'mt-4' : 'mt-[-30px]'}`}>
        <h1
          className="text-[34px] font-bold leading-[41px] tracking-[0.374px] text-[#1c1c1e]"
          style={{ fontFamily: '-apple-system, "SF Pro Display", system-ui, sans-serif' }}
        >
          Login
        </h1>
        <p
          className="mt-1 text-[15px] font- leading-[20px] tracking-[-0.5px] text-[#38383a]"
          style={{ fontFamily: '-apple-system, "SF Pro Text", system-ui, sans-serif' }}
        >
          Please Sign in to continue.
        </p>
      </div>

      {/* Success banner */}
      {success && (
        <div className="mx-6 mt-4 px-4 py-3 bg-[#f0fff4] border border-[#248a3d] rounded-[12px]">
          <p className="text-[#248a3d] text-[14px] font-medium" style={{ fontFamily: 'Inter, system-ui, sans-serif' }}>
            Login successful!
          </p>
        </div>
      )}

      {/* Error banner — same position as success */}
      {error && (
        <div className="mx-6 mt-4 flex items-center gap-2.5 bg-[#fff0f0] border border-[#ff3b30] rounded-[14px] px-4 py-3">
          <div className="w-5 h-5 rounded-full bg-[#ff3b30] flex items-center justify-center flex-shrink-0">
            <svg width="10" height="10" viewBox="0 0 10 10" fill="none">
              <path d="M2.5 2.5L7.5 7.5M7.5 2.5L2.5 7.5" stroke="white" strokeWidth="1.8" strokeLinecap="round" />
            </svg>
          </div>
          <p className="text-[#ff3b30] text-[14px] font-medium" style={{ fontFamily: '-apple-system, "SF Pro Text", system-ui, sans-serif' }}>
            Incorrect username or password. Please try again.
          </p>
        </div>
      )}

      {/* Form */}
      <form onSubmit={handleLogin} className="px-6 mt-6 flex flex-col gap-4 flex-shrink-0">

        {/* Phone / Email input */}
        <div className="relative flex items-center rounded-[32px] h-[54px] px-4 gap-3 bg-[#f4f4f4]">
          <img src={IMG_EMAIL_ICON} alt="Email" className="w-6 h-6 flex-shrink-0 object-contain" />
          <input
            type="text"
            value={identifier}
            onChange={(e) => { setIdentifier(e.target.value); setError(false) }}
            placeholder="Username or phone number"
            className="flex-1 bg-transparent text-[16px] font-medium text-[#1c1c1e] placeholder-[rgba(60,60,67,0.6)] focus:outline-none"
            style={{ fontFamily: 'Inter, system-ui, sans-serif' }}
          />
        </div>

        {/* Password input — red border on error */}
        <div className="relative flex items-center rounded-[32px] h-[54px] px-4 gap-3 bg-[#f4f4f4]">
          <img
            src={IMG_LOCK_ICON}
            alt="Password"
            className="w-6 h-6 flex-shrink-0 object-contain"
            style={error ? { filter: 'invert(27%) sepia(99%) saturate(3000%) hue-rotate(347deg) brightness(90%)' } : {}}
          />
          <input
            type="password"
            value={password}
            onChange={(e) => { setPassword(e.target.value); setError(false) }}
            placeholder="Password"
            className={`flex-1 bg-transparent text-[16px] font-medium placeholder-[rgba(60,60,67,0.6)] focus:outline-none ${
              error ? 'text-[#ff3b30]' : 'text-[#1c1c1e]'
            }`}
            style={{ fontFamily: 'Inter, system-ui, sans-serif' }}
          />
        </div>

        {/* Forgot password */}
        <div className="flex justify-end -mt-1">
          <button
            type="button"
            onClick={() => navigate('/forgot-password')}
            className="text-[13px] font-semibold leading-[18px] tracking-[-0.078px] text-[#248a3d]"
            style={{ fontFamily: '-apple-system, "SF Pro Text", system-ui, sans-serif' }}
          >
            Forgot Password?
          </button>
        </div>

        {/* Login button */}
        <button
          type="submit"
          disabled={loading || success}
          className="w-full h-[56px] bg-[#248a3d] rounded-[16px] flex items-center justify-center gap-2 mt-1 active:opacity-80 transition-opacity disabled:opacity-80"
        >
          {(loading || success) && (
            <svg className="animate-spin" width="20" height="20" viewBox="0 0 24 24" fill="none">
              <circle cx="12" cy="12" r="10" stroke="rgba(255,255,255,0.3)" strokeWidth="3" />
              <path d="M12 2a10 10 0 0 1 10 10" stroke="white" strokeWidth="3" strokeLinecap="round" />
            </svg>
          )}
          <span
            className="text-[20px] font-semibold leading-[25px] tracking-[0.38px] text-white"
            style={{ fontFamily: '-apple-system, "SF Pro Display", system-ui, sans-serif' }}
          >
            {success ? 'Login successful!' : loading ? 'Signing in…' : 'Login'}
          </span>
        </button>
      </form>

      {/* Sign Up link */}
      <div className="px-6 mt-4 flex justify-center">
        <p
          className="text-[13px] leading-[18px] tracking-[-0.078px] text-[rgba(60,60,67,0.6)]"
          style={{ fontFamily: '-apple-system, "SF Pro Text", system-ui, sans-serif' }}
        >
          Don&apos;t have an account?{' '}
          <button
            type="button"
            onClick={() => navigate('/signup')}
            className="font-semibold text-[#248a3d]"
          >
            Sign Up
          </button>
        </p>
      </div>

      {toast && (
        <div className="absolute bottom-20 left-1/2 -translate-x-1/2 bg-[#1c1c1e] text-white text-[13px] font-medium px-4 py-2 rounded-full shadow-lg pointer-events-none whitespace-nowrap">
          {toast}
        </div>
      )}

      {/* Footer */}
      <div className="px-6 mt-auto pb-8 pt-6 flex-shrink-0">
        <p
          className="text-[13px] leading-[18px] tracking-[-0.078px] text-center text-[rgba(60,60,67,0.6)]"
          style={{ fontFamily: '-apple-system, "SF Pro Text", system-ui, sans-serif' }}
        >
          © 2023 F2Tech. All rights reserved{' '}
          <button type="button" onClick={() => showToast('Coming soon')} className="font-semibold text-[#248a3d]">Terms &amp; Conditions</button>
          {' '}and{' '}
          <button type="button" onClick={() => showToast('Coming soon')} className="font-semibold text-[#248a3d]">Privacy Policy</button>
        </p>
      </div>
    </div>
  )
}
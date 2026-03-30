import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import signupLogo from '../assets/signuplogo.png'
import { IMG_EMAIL_ICON, IMG_LOCK_ICON, IMG_ARROW_BACK, IMG_GB_FLAG, IMG_EXPAND_MORE } from '../icons'

const IMG_GOLF_ILLUSTRATION = signupLogo

export default function SignUpPage() {
  const navigate = useNavigate()
  const [name, setName] = useState('')
  const [phone, setPhone] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [error, setError] = useState('')
  const [success, setSuccess] = useState(false)
  const [loading, setLoading] = useState(false)
  const [toast, setToast] = useState('')
  const showToast = (msg) => { setToast(msg); setTimeout(() => setToast(''), 2000) }

  const handleSignUp = async (e) => {
    e.preventDefault()
    setError('')

    if (!name || !phone || !password || !confirmPassword) {
      setError('All fields are required')
      return
    }
    if (password.length < 6) {
      setError('Password must be at least 6 characters')
      return
    }
    if (password !== confirmPassword) {
      setError('Passwords do not match')
      return
    }

    setLoading(true)
    try {
      const res = await fetch('/api/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, phone, password }),
      })

      if (res.status === 201) {
        setSuccess(true)
        setTimeout(() => navigate('/login'), 1500)
      } else if (res.status === 409) {
        setError('Phone number already registered')
      } else {
        setError('Registration failed. Please try again.')
      }
    } catch {
      setError('Could not connect to server. Please try again.')
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
      <div className="flex-shrink-0 px-6">
        <img
          src={IMG_GOLF_ILLUSTRATION}
          alt="Golf illustration"
          className="w-full max-w-[360px] h-[260px] object-contain mx-auto"
        />
      </div>

      {/* Sign Up title */}
      <div className={`px-6 flex-shrink-0 ${error ? 'mt-0' : 'mt-2'}`}>
        <h1
          className="text-[34px] font-bold leading-[41px] tracking-[0.374px] text-[#1c1c1e]"
          style={{ fontFamily: '-apple-system, "SF Pro Display", system-ui, sans-serif' }}
        >
          Sign Up
        </h1>
        <p
          className="mt-1 text-[15px] leading-[20px] tracking-[-0.5px] text-[#38383a]"
          style={{ fontFamily: '-apple-system, "SF Pro Text", system-ui, sans-serif' }}
        >
          Create your account to continue.
        </p>
      </div>

      {/* Success banner */}
      {success && (
        <div className="mx-6 mt-4 px-4 py-3 bg-[#f0fff4] border border-[#248a3d] rounded-[12px]">
          <p className="text-[#248a3d] text-[14px] font-medium" style={{ fontFamily: 'Inter, system-ui, sans-serif' }}>
            Account created successfully!
          </p>
        </div>
      )}

      {/* Error banner */}
      {error && (
        <div className="mx-6 mt-4 flex items-center gap-2.5 bg-[#fff0f0] border border-[#ff3b30] rounded-[14px] px-4 py-3">
          <div className="w-5 h-5 rounded-full bg-[#ff3b30] flex items-center justify-center flex-shrink-0">
            <svg width="10" height="10" viewBox="0 0 10 10" fill="none">
              <path d="M2.5 2.5L7.5 7.5M7.5 2.5L2.5 7.5" stroke="white" strokeWidth="1.8" strokeLinecap="round" />
            </svg>
          </div>
          <p className="text-[#ff3b30] text-[14px] font-medium" style={{ fontFamily: '-apple-system, "SF Pro Text", system-ui, sans-serif' }}>
            {error}
          </p>
        </div>
      )}

      {/* Form */}
      <form onSubmit={handleSignUp} className="px-6 mt-6 flex flex-col gap-4 flex-shrink-0">

        {/* Full name */}
        <div className="relative flex items-center bg-[#f4f4f4] rounded-[32px] h-[54px] px-4 gap-3">
          <img src={IMG_EMAIL_ICON} alt="Name" className="w-6 h-6 flex-shrink-0 object-contain" />
          <input
            type="text"
            value={name}
            onChange={(e) => { setName(e.target.value); setError('') }}
            placeholder="Full name"
            className="flex-1 bg-transparent text-[16px] font-medium text-[#1c1c1e] placeholder-[rgba(60,60,67,0.6)] focus:outline-none"
            style={{ fontFamily: 'Inter, system-ui, sans-serif' }}
          />
        </div>

        {/* Phone */}
        <div className="relative flex items-center bg-[#f4f4f4] rounded-[32px] h-[54px] px-4 gap-3">
          <img src={IMG_EMAIL_ICON} alt="Phone" className="w-6 h-6 flex-shrink-0 object-contain" />
          <input
            type="text"
            value={phone}
            onChange={(e) => { setPhone(e.target.value); setError('') }}
            placeholder="Phone number"
            className="flex-1 bg-transparent text-[16px] font-medium text-[#1c1c1e] placeholder-[rgba(60,60,67,0.6)] focus:outline-none"
            style={{ fontFamily: 'Inter, system-ui, sans-serif' }}
          />
        </div>

        {/* Password */}
        <div className="relative flex items-center bg-[#f4f4f4] rounded-[32px] h-[54px] px-4 gap-3">
          <img src={IMG_LOCK_ICON} alt="Password" className="w-6 h-6 flex-shrink-0 object-contain" />
          <input
            type="password"
            value={password}
            onChange={(e) => { setPassword(e.target.value); setError('') }}
            placeholder="Password"
            className="flex-1 bg-transparent text-[16px] font-medium text-[#1c1c1e] placeholder-[rgba(60,60,67,0.6)] focus:outline-none"
            style={{ fontFamily: 'Inter, system-ui, sans-serif' }}
          />
        </div>

        {/* Confirm password */}
        <div className="relative flex items-center bg-[#f4f4f4] rounded-[32px] h-[54px] px-4 gap-3">
          <img src={IMG_LOCK_ICON} alt="Confirm password" className="w-6 h-6 flex-shrink-0 object-contain" />
          <input
            type="password"
            value={confirmPassword}
            onChange={(e) => { setConfirmPassword(e.target.value); setError('') }}
            placeholder="Confirm password"
            className="flex-1 bg-transparent text-[16px] font-medium text-[#1c1c1e] placeholder-[rgba(60,60,67,0.6)] focus:outline-none"
            style={{ fontFamily: 'Inter, system-ui, sans-serif' }}
          />
        </div>

        {/* Sign Up button */}
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
            {success ? 'Account created!' : loading ? 'Creating account…' : 'Sign Up'}
          </span>
        </button>
      </form>

      {/* Already have an account link */}
      <div className="px-6 mt-4 flex justify-center">
        <p
          className="text-[13px] leading-[18px] tracking-[-0.078px] text-[rgba(60,60,67,0.6)]"
          style={{ fontFamily: '-apple-system, "SF Pro Text", system-ui, sans-serif' }}
        >
          Already have an account?{' '}
          <button
            type="button"
            onClick={() => navigate('/login')}
            className="font-semibold text-[#248a3d]"
          >
            Login
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
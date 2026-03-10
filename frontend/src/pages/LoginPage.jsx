import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

const IMG_GOLF_ILLUSTRATION = 'https://www.figma.com/api/mcp/asset/64b12603-5224-4f20-abdd-913a646fd78e'
const IMG_EMAIL_ICON = 'https://www.figma.com/api/mcp/asset/3c9764e1-5263-4c7f-ae7d-57fc6717d929'
const IMG_LOCK_ICON = 'https://www.figma.com/api/mcp/asset/79a192b0-d0e4-4932-9ac4-0d325b84a446'
const IMG_ARROW_BACK = 'https://www.figma.com/api/mcp/asset/286037a0-e4af-450d-85e2-d8e666de88b1'
const IMG_GB_FLAG = 'https://www.figma.com/api/mcp/asset/15fef1d1-f5ff-470f-934e-3a3367af82ab'
const IMG_EXPAND_MORE = 'https://www.figma.com/api/mcp/asset/233ccfdb-a5de-4c86-a986-7df17bf0fd1c'

export default function LoginPage() {
  const navigate = useNavigate()
  const { login } = useAuth()
  const [phone, setPhone] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState(false)
  const [loading, setLoading] = useState(false)

  const handleLogin = async (e) => {
    e.preventDefault()
    setLoading(true)
    try {
      const res = await fetch('/api/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ phone, password }),
      })
      if (res.ok) {
        login(await res.json())
        navigate('/home', { replace: true })
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
    <div className="relative w-full bg-white flex flex-col min-h-[852px]">

      {/* Header bar */}
      <div className="relative w-full h-[129px] bg-white flex-shrink-0">
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

      {/* Golf illustration — hidden when error state is shown */}
      {!error && (
        <div className="flex-shrink-0 px-6 mt-2">
          <img
            src={IMG_GOLF_ILLUSTRATION}
            alt="Golf illustration"
            className="w-full max-w-[345px] h-[242px] object-contain mx-auto"
          />
        </div>
      )}

      {/* Login title */}
      <div className={`px-6 flex-shrink-0 ${error ? 'mt-10' : 'mt-6'}`}>
        <h1
          className="text-[34px] font-bold leading-[41px] tracking-[0.374px] text-[#1c1c1e]"
          style={{ fontFamily: '-apple-system, "SF Pro Display", system-ui, sans-serif' }}
        >
          Login
        </h1>
        <p
          className="mt-1 text-[15px] font-semibold leading-[20px] tracking-[-0.5px] text-[#38383a]"
          style={{ fontFamily: '-apple-system, "SF Pro Text", system-ui, sans-serif' }}
        >
          Please Sign in to continue.
        </p>
      </div>

      {/* Form */}
      <form onSubmit={handleLogin} className="px-6 mt-6 flex flex-col gap-4 flex-shrink-0">

        {/* Phone / Email input */}
        <div className="relative flex items-center bg-[#f4f4f4] rounded-[32px] h-[54px] px-4 gap-3">
          <img src={IMG_EMAIL_ICON} alt="Email" className="w-6 h-6 flex-shrink-0 object-contain" />
          <input
            type="text"
            value={phone}
            onChange={(e) => { setPhone(e.target.value); setError(false) }}
            placeholder="Name or phone number"
            className="flex-1 bg-transparent text-[16px] font-medium text-[#1c1c1e] placeholder-[rgba(60,60,67,0.6)] focus:outline-none"
            style={{ fontFamily: 'Inter, system-ui, sans-serif' }}
          />
        </div>

        {/* Password input — red border on error */}
        <div className={`relative flex items-center rounded-[32px] h-[54px] px-4 gap-3 ${
          error
            ? 'bg-white border-2 border-[#ff3b30]'
            : 'bg-[#f4f4f4]'
        }`}>
          <img
            src={IMG_LOCK_ICON}
            alt="Password"
            className={`w-6 h-6 flex-shrink-0 object-contain ${error ? 'tint-red' : ''}`}
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
          {error && (
            <span
              className="text-[#ff3b30] text-[14px] font-medium whitespace-nowrap flex-shrink-0"
              style={{ fontFamily: 'Inter, system-ui, sans-serif' }}
            >
              Wrong password
            </span>
          )}
        </div>

        {/* Forgot password */}
        <div className="flex justify-end">
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
          disabled={loading}
          className="w-full h-[56px] bg-[#248a3d] rounded-[16px] flex items-center justify-center mt-1 active:opacity-80 transition-opacity disabled:opacity-60"
        >
          <span
            className="text-[20px] font-semibold leading-[25px] tracking-[0.38px] text-white"
            style={{ fontFamily: '-apple-system, "SF Pro Display", system-ui, sans-serif' }}
          >
            {loading ? 'Signing in…' : 'Login'}
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

      {/* Footer */}
      <div className="px-6 mt-auto pb-8 pt-6 flex-shrink-0">
        <p
          className="text-[13px] leading-[18px] tracking-[-0.078px] text-center text-[rgba(60,60,67,0.6)]"
          style={{ fontFamily: '-apple-system, "SF Pro Text", system-ui, sans-serif' }}
        >
          © 2023 F2Tech. All rights reserved{' '}
          <button type="button" className="font-semibold text-[#248a3d]">Terms &amp; Conditions</button>
          {' '}and{' '}
          <button type="button" className="font-semibold text-[#248a3d]">Privacy Policy</button>
        </p>
      </div>
    </div>
  )
}

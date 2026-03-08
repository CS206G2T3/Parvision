import { useState } from 'react'
import { useNavigate } from 'react-router-dom'

const IMG_ARROW_BACK = 'https://www.figma.com/api/mcp/asset/286037a0-e4af-450d-85e2-d8e666de88b1'
const IMG_GB_FLAG = 'https://www.figma.com/api/mcp/asset/15fef1d1-f5ff-470f-934e-3a3367af82ab'
const IMG_EXPAND_MORE = 'https://www.figma.com/api/mcp/asset/233ccfdb-a5de-4c86-a986-7df17bf0fd1c'
const IMG_EMAIL_ICON = 'https://www.figma.com/api/mcp/asset/3c9764e1-5263-4c7f-ae7d-57fc6717d929'

export default function ForgotPasswordPage() {
  const navigate = useNavigate()
  const [phone, setPhone] = useState('')
  const [sent, setSent] = useState(false)

  const handleSubmit = (e) => {
    e.preventDefault()
    // TODO: connect to password reset API
    setSent(true)
  }

  return (
    <div className="relative w-full bg-white flex flex-col min-h-[852px]">

      {/* Header bar */}
      <div className="relative w-full h-[129px] bg-white flex-shrink-0">
        <button
          onClick={() => navigate('/login')}
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

      <div className="px-6 mt-8 flex flex-col flex-1">

        {/* Title */}
        <h1
          className="text-[34px] font-bold leading-[41px] tracking-[0.374px] text-[#1c1c1e]"
          style={{ fontFamily: '-apple-system, "SF Pro Display", system-ui, sans-serif' }}
        >
          Forgot{'\n'}Password?
        </h1>
        <p
          className="mt-2 text-[15px] font-medium leading-[22px] tracking-[-0.3px] text-[rgba(60,60,67,0.6)]"
          style={{ fontFamily: '-apple-system, "SF Pro Text", system-ui, sans-serif' }}
        >
          Enter your phone number and we'll send you a reset link.
        </p>

        {/* Success message */}
        {sent && (
          <div className="mt-6 bg-[#e5f8e9] border border-[#248a3d] rounded-2xl px-4 py-3">
            <p
              className="text-[15px] font-semibold text-[#248a3d] leading-[22px]"
              style={{ fontFamily: '-apple-system, "SF Pro Text", system-ui, sans-serif' }}
            >
              Reset link sent! Check your messages.
            </p>
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="mt-8 flex flex-col gap-4">

          {/* Phone input */}
          <div className="relative flex items-center bg-[#f4f4f4] rounded-[32px] h-[54px] px-4 gap-3">
            <img src={IMG_EMAIL_ICON} alt="Phone" className="w-6 h-6 flex-shrink-0 object-contain" />
            <input
              type="text"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="Phone number"
              className="flex-1 bg-transparent text-[16px] font-medium text-[#1c1c1e] placeholder-[rgba(60,60,67,0.6)] focus:outline-none"
              style={{ fontFamily: 'Inter, system-ui, sans-serif' }}
            />
          </div>

          {/* Submit button */}
          <button
            type="submit"
            className="w-full h-[56px] bg-[#248a3d] rounded-[16px] flex items-center justify-center mt-2 active:opacity-80 transition-opacity"
          >
            <span
              className="text-[20px] font-semibold leading-[25px] tracking-[0.38px] text-white"
              style={{ fontFamily: '-apple-system, "SF Pro Display", system-ui, sans-serif' }}
            >
              Send Reset Link
            </span>
          </button>

          {/* Back to login */}
          <button
            type="button"
            onClick={() => navigate('/login')}
            className="w-full h-[56px] border-2 border-[#248a3d] rounded-[16px] flex items-center justify-center active:opacity-80 transition-opacity"
          >
            <span
              className="text-[20px] font-semibold leading-[25px] tracking-[0.38px] text-[#248a3d]"
              style={{ fontFamily: '-apple-system, "SF Pro Display", system-ui, sans-serif' }}
            >
              Back to Login
            </span>
          </button>
        </form>
      </div>

      {/* Footer */}
      <div className="px-6 pb-8 pt-6 flex-shrink-0">
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

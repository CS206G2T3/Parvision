import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import patrickAvatar from '../assets/patrick.png'
import { IMG_ARROW_BACK } from '../icons'

export default function AccountInformationPage() {
  const navigate = useNavigate()
  const [toast, setToast] = useState('')
  const showToast = (msg) => { setToast(msg); setTimeout(() => setToast(''), 2000) }

  const fields = [
    { label: 'Full Name', value: 'Jared Mango' },
    { label: 'Username', value: 'jaredmango21' },
    { label: 'Email', value: 'jaredmango21@gmail.com' },
    { label: 'Phone Number', value: '+65 9123 4567' },
    { label: 'Date of Birth', value: '12 March 2000' },
    { label: 'Handicap', value: '14.2' },
  ]

  return (
    <div className="relative w-full bg-[#f4f4f4] flex flex-col min-h-[852px]">
      <div className="bg-white pt-14 pb-4 px-5 flex-shrink-0">
        <div className="relative flex items-center justify-center mb-1">
          <button onClick={() => navigate('/profile')} className="absolute left-0">
            <img src={IMG_ARROW_BACK} alt="Back" className="w-5 h-5 object-contain" />
          </button>
          <h1 className="text-[18px] font-bold text-[#1c1c1e]"
            style={{ fontFamily: '-apple-system, "SF Pro Display", system-ui, sans-serif' }}>
            Account Information
          </h1>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto pb-8">
        <div className="flex flex-col items-center mt-6 mb-5">
          <div className="relative">
            <img src={patrickAvatar} alt="Profile"
              className="w-[80px] h-[80px] rounded-full object-cover border-4 border-white shadow-md" />
            <button onClick={() => showToast('Coming soon')}
              className="absolute bottom-0 right-0 w-7 h-7 bg-[#248a3d] rounded-full flex items-center justify-center border-2 border-white">
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round">
                <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
                <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
              </svg>
            </button>
          </div>
          <button onClick={() => showToast('Coming soon')}
            className="mt-2 text-[13px] font-semibold text-[#248a3d]"
            style={{ fontFamily: '-apple-system, "SF Pro Text", system-ui, sans-serif' }}>
            Change Photo
          </button>
        </div>

        <div className="mx-4 bg-white rounded-2xl overflow-hidden">
          {fields.map((field, i) => (
            <div key={i}>
              <button onClick={() => showToast('Coming soon')}
                className="w-full flex items-center justify-between px-4 py-4 active:bg-[#f9f9f9] transition-colors">
                <div className="text-left">
                  <p className="text-[12px] text-[rgba(60,60,67,0.5)] leading-[16px]"
                    style={{ fontFamily: '-apple-system, "SF Pro Text", system-ui, sans-serif' }}>
                    {field.label}
                  </p>
                  <p className="text-[15px] font-medium text-[#1c1c1e] leading-[20px] mt-0.5"
                    style={{ fontFamily: '-apple-system, "SF Pro Text", system-ui, sans-serif' }}>
                    {field.value}
                  </p>
                </div>
                <svg width="8" height="14" viewBox="0 0 8 14" fill="none">
                  <path d="M1 1L7 7L1 13" stroke="rgba(60,60,67,0.3)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </button>
              {i < fields.length - 1 && <div className="h-px bg-[#f0f0f0] mx-4" />}
            </div>
          ))}
        </div>
      </div>

      {toast && (
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 bg-[#1c1c1e] text-white text-[13px] font-medium px-4 py-2 rounded-full shadow-lg pointer-events-none">
          {toast}
        </div>
      )}
    </div>
  )
}
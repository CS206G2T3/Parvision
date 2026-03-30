import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import BottomNav from '../components/BottomNav'
import patrickAvatar from '../assets/patrick.png'
import { useAuth } from '../context/AuthContext'

function SettingsRow({ icon, label, onPress, danger }) {
  return (
    <button
      onClick={onPress}
      className="w-full flex items-center justify-between px-5 py-[15px] active:bg-[#f4f4f4] transition-colors"
    >
      <div className="flex items-center gap-4">
        <div className={`w-9 h-9 rounded-xl flex items-center justify-center ${danger ? 'bg-[#ffebe5]' : 'bg-[#e5f8e9]'}`}>
          <span className="text-[18px]">{icon}</span>
        </div>
        <span
          className={`text-[15px] font-medium leading-[22px] ${danger ? 'text-[#ff3b30]' : 'text-[#1c1c1e]'}`}
          style={{ fontFamily: '-apple-system, "SF Pro Text", system-ui, sans-serif' }}
        >
          {label}
        </span>
      </div>
      <div className={`w-7 h-7 rounded-lg border flex items-center justify-center ${danger ? 'border-[#ffccc9]' : 'border-[#c7e5d0]'}`}>
        <svg width="7" height="12" viewBox="0 0 8 14" fill="none">
          <path d="M1 1L7 7L1 13" stroke={danger ? '#ff3b30' : '#248a3d'} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </div>
    </button>
  )
}

function SectionHeader({ title }) {
  return (
    <p
      className="px-5 pt-5 pb-2 text-[16px] font-bold text-[rgba(60,60,67,0.45)]"
      style={{ fontFamily: '-apple-system, "SF Pro Text", system-ui, sans-serif' }}
    >
      {title}
    </p>
  )
}

function Divider() {
  return <div className="h-px bg-[#f0f0f0] mx-5" />
}

export default function ProfilePage() {
  const navigate = useNavigate()
  const { logout } = useAuth()
  const [toast, setToast] = useState('')

  const showToast = (msg) => {
    setToast(msg)
    setTimeout(() => setToast(''), 2500)
  }

  return (
    <div className="relative w-full bg-[#f4f4f4] flex flex-col min-h-[852px]">

      {/* Green header */}
      <div className="bg-[#248a3d] pt-10 pb-6 px-5 flex-shrink-0 relative overflow-hidden">

        {/* Decorative circles */}
        <div className="absolute -top-10 -right-10 w-48 h-48 rounded-full bg-white/5" />
        <div className="absolute -top-4 -right-4 w-32 h-32 rounded-full bg-white/5" />
        <div className="absolute bottom-0 left-10 w-24 h-24 rounded-full bg-white/5" />
        <div className="absolute -bottom-6 -left-6 w-36 h-36 rounded-full bg-white/5" />
        <div className="absolute top-6 right-32 w-16 h-16 rounded-full bg-white/5" />

        <h1
          className="text-[18px] font-bold text-white leading-[22px] mb-2"
          style={{ fontFamily: '-apple-system, "SF Pro Display", system-ui, sans-serif' }}
        >
          Profile
        </h1>

        {/* Avatar + name side by side, centered */}
        <div className="flex items-center justify-center gap-4">
          <img
            src={patrickAvatar}
            alt="Jared Mango"
            className="w-[65px] h-[65px] rounded-full object-cover flex-shrink-0"
            style={{ border: '3px solid rgba(255,255,255,0.4)' }}
          />
          <div className="flex flex-col">
            <p
              className="text-[20px] font-bold text-white leading-[24px]"
              style={{ fontFamily: '-apple-system, "SF Pro Display", system-ui, sans-serif' }}
            >
              Jared Mango
            </p>
            <p
              className="text-[13px] text-white/70 leading-[18px] mt-0.5"
              style={{ fontFamily: '-apple-system, "SF Pro Text", system-ui, sans-serif' }}
            >
              jaredmango21@gmail.com
            </p>
          </div>
        </div>
      </div>

      {/* Settings — single white card */}
      <div className="flex-1 overflow-y-auto pb-[80px]">
        <div className="bg-white rounded-t-3xl -mt-4 relative z-10 min-h-full pt-4">

          <SectionHeader title="Account Settings" />
          <SettingsRow icon="👤" label="Account Information" onPress={() => navigate('/profile/account')} />
          <Divider />
          <SettingsRow icon="🔒" label="Password and Security" onPress={() => navigate('/forgot-password')} />
          <Divider />
          <SettingsRow icon="⭐" label="Membership" onPress={() => navigate('/profile/membership')} />

          <SectionHeader title="Community Settings" />
          <SettingsRow icon="👥" label="Friends & Social" onPress={() => navigate('/community', { state: { tab: 'friends' } })} />
          <Divider />
          <SettingsRow icon="💬" label="Direct Messages" onPress={() => showToast('Coming soon')} />

          <SectionHeader title="Others" />
          <SettingsRow icon="❓" label="FAQ" onPress={() => navigate('/profile/faq')} />
          <Divider />
          <SettingsRow icon="📞" label="Contact us" onPress={() => navigate('/profile/contact')} />
          <Divider />
          <SettingsRow
            icon="🚪"
            label="Log out"
            danger
            onPress={() => { logout(); navigate('/login') }}
          />

          <div className="h-8" />
        </div>
      </div>

      <BottomNav />

      {toast && (
        <div className="absolute bottom-[90px] left-1/2 -translate-x-1/2 bg-[#1c1c1e] text-white text-[13px] font-medium px-4 py-2 rounded-full shadow-lg pointer-events-none">
          {toast}
        </div>
      )}
    </div>
  )
}
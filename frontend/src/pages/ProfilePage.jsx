import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import BottomNav from '../components/BottomNav'
import patrickAvatar from '../assets/patrick.png'
import { useAuth } from '../context/AuthContext'

function SettingsRow({ icon, label, onPress, danger }) {
  return (
    <button
      onClick={onPress}
      className="w-full flex items-center justify-between px-4 py-[14px] bg-white active:bg-[#f4f4f4] transition-colors"
    >
      <div className="flex items-center gap-3">
        <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${danger ? 'bg-[#ffebe5]' : 'bg-[#e5f8e9]'}`}>
          <span className="text-[16px]">{icon}</span>
        </div>
        <span
          className={`text-[15px] font-medium leading-[22px] ${danger ? 'text-[#ff3b30]' : 'text-[#1c1c1e]'}`}
          style={{ fontFamily: '-apple-system, "SF Pro Text", system-ui, sans-serif' }}
        >
          {label}
        </span>
      </div>
      {!danger && (
        <svg width="8" height="14" viewBox="0 0 8 14" fill="none">
          <path d="M1 1L7 7L1 13" stroke="rgba(60,60,67,0.4)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      )}
    </button>
  )
}

function SectionHeader({ title }) {
  return (
    <p
      className="px-4 pt-5 pb-2 text-[13px] font-semibold uppercase tracking-[0.5px] text-[rgba(60,60,67,0.5)]"
      style={{ fontFamily: '-apple-system, "SF Pro Text", system-ui, sans-serif' }}
    >
      {title}
    </p>
  )
}

function Divider() {
  return <div className="h-px bg-[#f0f0f0] ml-[60px]" />
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
      <div className="bg-[#248a3d] pt-14 pb-8 px-5 flex-shrink-0">
        <h1
          className="text-[20px] font-bold text-white leading-[25px] mb-5"
          style={{ fontFamily: '-apple-system, "SF Pro Display", system-ui, sans-serif' }}
        >
          Profile
        </h1>
        <div className="flex items-center gap-4">
          <img
            src={patrickAvatar}
            alt="Jared Mango"
            className="w-[60px] h-[60px] rounded-full object-cover border-2 border-white/30"
          />
          <div>
            <p
              className="text-[18px] font-bold text-white leading-[22px]"
              style={{ fontFamily: '-apple-system, "SF Pro Display", system-ui, sans-serif' }}
            >
              Jared Mango
            </p>
            <p
              className="text-[13px] text-white/70 leading-[18px] mt-0.5"
              style={{ fontFamily: '-apple-system, "SF Pro Text", system-ui, sans-serif' }}
            >
              jaredmango@gmail.com
            </p>
          </div>
        </div>
      </div>

      {/* Settings list */}
      <div className="flex-1 overflow-y-auto pb-[80px]">

        <SectionHeader title="Account Settings" />
        <div className="bg-white rounded-2xl mx-4 overflow-hidden">
          <SettingsRow icon="👤" label="Account Information" onPress={() => showToast('Coming soon')} />
          <Divider />
          <SettingsRow icon="🔒" label="Password and Security" onPress={() => navigate('/forgot-password')} />
          <Divider />
          <SettingsRow icon="⭐" label="Membership" onPress={() => showToast('Coming soon')} />
        </div>

        <SectionHeader title="Community Settings" />
        <div className="bg-white rounded-2xl mx-4 overflow-hidden">
          <SettingsRow icon="👥" label="Friends & Social" onPress={() => navigate('/community', { state: { tab: 'friends' } })} />
          <Divider />
          <SettingsRow icon="💬" label="Direct Messages" onPress={() => showToast('Coming soon')} />
        </div>

        <SectionHeader title="Others" />
        <div className="bg-white rounded-2xl mx-4 overflow-hidden">
          <SettingsRow icon="❓" label="FAQ" onPress={() => showToast('Coming soon')} />
          <Divider />
          <SettingsRow icon="📞" label="Contact us" onPress={() => showToast('Coming soon')} />
          <Divider />
          <SettingsRow
            icon="🚪"
            label="Log out"
            danger
            onPress={() => { logout(); navigate('/login') }}
          />
        </div>

        <div className="h-4" />
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

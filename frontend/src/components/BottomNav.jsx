import { useNavigate, useLocation } from 'react-router-dom'

function HomeIcon({ active }) {
  return (
    <svg width="26" height="26" viewBox="0 0 24 24" fill="none">
      <path d="M3 12L12 3L21 12V21H15V15H9V21H3V12Z"
        stroke={active ? '#248a3d' : 'rgba(60,60,67,0.4)'}
        strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
        fill={active ? 'rgba(36,138,61,0.12)' : 'none'}
      />
    </svg>
  )
}

function VideoIcon({ active }) {
  return (
    <svg width="26" height="26" viewBox="0 0 24 24" fill="none">
      <rect x="2" y="6" width="14" height="12" rx="2"
        stroke={active ? '#248a3d' : 'rgba(60,60,67,0.4)'}
        strokeWidth="2" fill={active ? 'rgba(36,138,61,0.12)' : 'none'} />
      <path d="M16 10L22 7V17L16 14V10Z"
        stroke={active ? '#248a3d' : 'rgba(60,60,67,0.4)'}
        strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
        fill={active ? 'rgba(36,138,61,0.12)' : 'none'}
      />
    </svg>
  )
}

function CommunitiesIcon({ active }) {
  return (
    <svg width="26" height="26" viewBox="0 0 24 24" fill="none">
      <circle cx="9" cy="8" r="3"
        stroke={active ? '#248a3d' : 'rgba(60,60,67,0.4)'}
        strokeWidth="2" fill={active ? 'rgba(36,138,61,0.12)' : 'none'} />
      <circle cx="17" cy="8" r="2.5"
        stroke={active ? '#248a3d' : 'rgba(60,60,67,0.4)'}
        strokeWidth="1.8" fill={active ? 'rgba(36,138,61,0.12)' : 'none'} />
      <path d="M3 20C3 17.239 5.686 15 9 15C12.314 15 15 17.239 15 20"
        stroke={active ? '#248a3d' : 'rgba(60,60,67,0.4)'}
        strokeWidth="2" strokeLinecap="round" fill="none" />
      <path d="M15 15.5C16.083 15.179 17.394 15.5 18.5 16.5C19.5 17.4 19.9 18.6 20 20"
        stroke={active ? '#248a3d' : 'rgba(60,60,67,0.4)'}
        strokeWidth="1.8" strokeLinecap="round" fill="none" />
    </svg>
  )
}

function ActivityIcon({ active }) {
  return (
    <svg width="26" height="26" viewBox="0 0 24 24" fill="none">
      <circle cx="12" cy="12" r="9"
        stroke={active ? '#248a3d' : 'rgba(60,60,67,0.4)'}
        strokeWidth="2" fill={active ? 'rgba(36,138,61,0.12)' : 'none'} />
      <path d="M8 12L11 15L16 9"
        stroke={active ? '#248a3d' : 'rgba(60,60,67,0.4)'}
        strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}

function ProfileIcon({ active }) {
  return (
    <svg width="26" height="26" viewBox="0 0 24 24" fill="none">
      <circle cx="12" cy="8" r="4"
        stroke={active ? '#248a3d' : 'rgba(60,60,67,0.4)'}
        strokeWidth="2" fill={active ? 'rgba(36,138,61,0.12)' : 'none'} />
      <path d="M4 20C4 16.686 7.582 14 12 14C16.418 14 20 16.686 20 20"
        stroke={active ? '#248a3d' : 'rgba(60,60,67,0.4)'}
        strokeWidth="2" strokeLinecap="round" />
    </svg>
  )
}

const NAV_ITEMS = [
  { path: '/home', Icon: HomeIcon },
  { path: '/upload', Icon: VideoIcon },
  { path: '/community', Icon: CommunitiesIcon },
  { path: '/profile', Icon: ProfileIcon },
]

export default function BottomNav() {
  const navigate = useNavigate()
  const { pathname } = useLocation()

  return (
    <div className="absolute bottom-0 left-0 right-0 bg-white border-t border-[#f0f0f0] pb-safe z-50">
      <div className="flex items-center justify-around h-[60px] px-2">
        {NAV_ITEMS.map(({ path, Icon }) => {
          const active = pathname === path || pathname.startsWith(path + '/')
          return (
            <button
              key={path}
              onClick={() => navigate(path)}
              className="flex items-center justify-center flex-1 h-full"
            >
              <Icon active={active} />
            </button>
          )
        })}
      </div>
    </div>
  )
}

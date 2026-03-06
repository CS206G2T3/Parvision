import { useNavigate, useLocation } from 'react-router-dom'

const IMG_SCANNER = 'https://www.figma.com/api/mcp/asset/cdc9525f-4e22-4fcd-bf9c-e98a524cacd4'

function HomeIcon({ active }) {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
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
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
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

function ActivityIcon({ active }) {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
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
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
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
  { path: '/home', label: 'Home', Icon: HomeIcon },
  { path: '/video', label: 'Video', Icon: VideoIcon },
  { path: '/activity', label: 'Activity', Icon: ActivityIcon },
  { path: '/profile', label: 'Profile', Icon: ProfileIcon },
]

export default function BottomNav() {
  const navigate = useNavigate()
  const { pathname } = useLocation()

  return (
    <div className="absolute bottom-0 left-0 right-0 bg-white border-t border-[#f0f0f0] pb-safe">
      <div className="flex items-center justify-around h-[68px] px-2">
        {NAV_ITEMS.map(({ path, label, Icon }) => {
          const active = pathname === path
          return (
            <button
              key={path}
              onClick={() => navigate(path)}
              className="flex flex-col items-center justify-center gap-[3px] flex-1 h-full"
            >
              <Icon active={active} />
              <span
                className={`text-[10px] font-semibold tracking-[-0.24px] ${active ? 'text-[#248a3d]' : 'text-[rgba(60,60,67,0.4)]'}`}
                style={{ fontFamily: '-apple-system, "SF Pro Text", system-ui, sans-serif' }}
              >
                {label}
              </span>
            </button>
          )
        })}
      </div>
    </div>
  )
}

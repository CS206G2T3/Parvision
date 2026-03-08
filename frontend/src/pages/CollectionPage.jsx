import { useNavigate } from 'react-router-dom'
import BottomNav from '../components/BottomNav'

// Mock data — replace with API
const CLUB_CATEGORIES = [
  { id: 'drivers', label: 'Drivers', count: 2, icon: '🏌️' },
  { id: 'irons', label: 'Irons', count: 4, icon: '⛳' },
  { id: 'wedges', label: 'Wedges', count: 3, icon: '🥏' },
  { id: 'putters', label: 'Putters', count: 5, icon: '🏒' },
  { id: 'miscellaneous', label: 'Miscellaneous', count: 2, icon: '🎒' },
]

function CategoryRow({ id, label, count, icon, onPress }) {
  return (
    <button
      onClick={onPress}
      className="w-full flex items-center justify-between px-4 py-4 bg-white active:bg-[#f4f4f4] transition-colors"
    >
      <div className="flex items-center gap-4">
        <div className="w-10 h-10 bg-[#f4f4f4] rounded-xl flex items-center justify-center flex-shrink-0">
          <span className="text-[20px]">{icon}</span>
        </div>
        <span
          className="text-[17px] font-semibold text-[#1c1c1e] leading-[22px]"
          style={{ fontFamily: '-apple-system, "SF Pro Text", system-ui, sans-serif' }}
        >
          {label}
        </span>
      </div>
      <div className="flex items-center gap-2">
        <span
          className="text-[15px] font-medium text-[rgba(60,60,67,0.5)]"
          style={{ fontFamily: '-apple-system, "SF Pro Text", system-ui, sans-serif' }}
        >
          ({count})
        </span>
        <svg width="8" height="14" viewBox="0 0 8 14" fill="none">
          <path d="M1 1L7 7L1 13" stroke="rgba(60,60,67,0.4)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </div>
    </button>
  )
}

function Divider() {
  return <div className="h-px bg-[#f0f0f0] ml-[68px]" />
}

export default function CollectionPage() {
  const navigate = useNavigate()
  const totalClubs = CLUB_CATEGORIES.reduce((sum, c) => sum + c.count, 0)

  return (
    <div className="relative w-full bg-[#f4f4f4] flex flex-col min-h-[852px]">

      {/* Header */}
      <div className="bg-white pt-14 pb-4 px-5 flex-shrink-0">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 bg-[#f4f4f4] rounded-2xl flex items-center justify-center">
            <span className="text-[28px]">🎒</span>
          </div>
          <div>
            <h1
              className="text-[17px] font-bold text-[#1c1c1e] uppercase tracking-[0.5px] leading-[22px]"
              style={{ fontFamily: '-apple-system, "SF Pro Display", system-ui, sans-serif' }}
            >
              My Golf Collection
            </h1>
            <p
              className="text-[13px] text-[rgba(60,60,67,0.5)] leading-[18px] mt-0.5"
              style={{ fontFamily: '-apple-system, "SF Pro Text", system-ui, sans-serif' }}
            >
              Your gear, always ready
            </p>
          </div>
        </div>

        {/* Search bar */}
        <div className="flex items-center bg-[#f4f4f4] rounded-[14px] h-[40px] px-3 gap-2 mt-4">
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
            <circle cx="7" cy="7" r="5" stroke="rgba(60,60,67,0.4)" strokeWidth="1.5" />
            <path d="M11 11L14 14" stroke="rgba(60,60,67,0.4)" strokeWidth="1.5" strokeLinecap="round" />
          </svg>
          <span
            className="text-[14px] text-[rgba(60,60,67,0.4)]"
            style={{ fontFamily: '-apple-system, "SF Pro Text", system-ui, sans-serif' }}
          >
            Search
          </span>
        </div>
      </div>

      {/* Club categories */}
      <div className="flex-1 overflow-y-auto pb-[80px] mt-4 px-4">
        <p
          className="text-[13px] font-semibold text-[rgba(60,60,67,0.5)] uppercase tracking-[0.5px] mb-2 px-1"
          style={{ fontFamily: '-apple-system, "SF Pro Text", system-ui, sans-serif' }}
        >
          Clubs bag ({totalClubs} clubs)
        </p>

        <div className="bg-white rounded-2xl overflow-hidden">
          {CLUB_CATEGORIES.map((cat, i) => (
            <div key={cat.id}>
              <CategoryRow
                {...cat}
                onPress={() => navigate(`/collection/${cat.id}`)}
              />
              {i < CLUB_CATEGORIES.length - 1 && <Divider />}
            </div>
          ))}
        </div>
      </div>

      <BottomNav />
    </div>
  )
}

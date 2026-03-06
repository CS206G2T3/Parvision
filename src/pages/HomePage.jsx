import { useNavigate } from 'react-router-dom'
import BottomNav from '../components/BottomNav'

const IMG_AVATAR = 'https://www.figma.com/api/mcp/asset/77a45933-0f2d-445e-9c01-452499169297'
const IMG_DRILL_THUMB = 'https://www.figma.com/api/mcp/asset/2151a0f3-738b-42a5-9908-a98fd32b027f'

// Mock data — replace with API
const COMMUNITY_POSTS = [
  { id: 1, user: 'Nam Significat...', time: '2h ago', excerpt: 'Practiced with a team! Finally got a good swing feeling going...' },
  { id: 2, user: 'Marcel Hinz', time: '4h ago', excerpt: 'Great session today, swing mechanic is really improving...' },
  { id: 3, user: 'Skye', time: '5h ago', excerpt: 'Broken different offsets...' },
]

const CLUBS = [
  { id: 'drivers', label: 'Driver', emoji: '🏌️' },
  { id: 'irons', label: 'Iron', emoji: '⛳' },
  { id: 'wedges', label: 'Wedge', emoji: '🥏' },
  { id: 'putters', label: 'Putter', emoji: '🏒' },
]

function StatBadge({ value, label, color }) {
  return (
    <div className={`flex flex-col items-center px-3 py-2 rounded-2xl ${color}`}>
      <span
        className="text-[17px] font-bold text-white leading-[20px]"
        style={{ fontFamily: '-apple-system, "SF Pro Display", system-ui, sans-serif' }}
      >
        {value}
      </span>
      <span
        className="text-[9px] font-semibold text-white/90 uppercase tracking-[0.5px] mt-0.5 text-center leading-[12px]"
        style={{ fontFamily: '-apple-system, "SF Pro Text", system-ui, sans-serif' }}
      >
        {label}
      </span>
    </div>
  )
}

function StreakDot({ filled }) {
  return (
    <div className={`w-8 h-8 rounded-full border-2 flex items-center justify-center ${
      filled ? 'bg-[#f97316] border-[#f97316]' : 'border-[#e5e5ea] bg-white'
    }`}>
      {filled && (
        <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
          <path d="M3 7L6 10L11 4" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      )}
    </div>
  )
}

export default function HomePage() {
  const navigate = useNavigate()

  return (
    <div className="relative w-full bg-white flex flex-col min-h-[852px]">

      {/* Header */}
      <div className="px-5 pt-14 pb-3 flex items-start justify-between flex-shrink-0">
        <div>
          <p
            className="text-[13px] text-[rgba(60,60,67,0.6)] leading-[18px]"
            style={{ fontFamily: '-apple-system, "SF Pro Text", system-ui, sans-serif' }}
          >
            Hello, Jared
          </p>
          <h1
            className="text-[22px] font-bold leading-[28px] text-[#1c1c1e] mt-0.5"
            style={{ fontFamily: '-apple-system, "SF Pro Display", system-ui, sans-serif' }}
          >
            Ready to Perfect your{' '}
            <span className="text-[#248a3d]">Game?</span>
          </h1>
        </div>
        <button onClick={() => navigate('/profile')}>
          <img
            src={IMG_AVATAR}
            alt="Profile"
            className="w-10 h-10 rounded-full object-cover mt-1"
          />
        </button>
      </div>

      {/* Streak / stats row */}
      <div className="px-5 flex items-center gap-3 mt-1 flex-shrink-0">
        <StatBadge value="6" label={`Days\nStreak`} color="bg-[#f97316]" />
        <StatBadge value="14.2" label="Handicap" color="bg-[#ef4444]" />
        <div className="flex items-center gap-2 ml-1">
          {[true, true, true, true, true, true, false].map((filled, i) => (
            <StreakDot key={i} filled={filled} />
          ))}
        </div>
      </div>

      {/* Scrollable content */}
      <div className="flex-1 overflow-y-auto pb-[80px] mt-4">

        {/* Suggested Drills */}
        <section className="px-5">
          <div className="flex items-center justify-between mb-3">
            <h2
              className="text-[17px] font-semibold text-[#1c1c1e] leading-[22px]"
              style={{ fontFamily: '-apple-system, "SF Pro Text", system-ui, sans-serif' }}
            >
              Suggested Drills
            </h2>
            <button
              onClick={() => navigate('/video')}
              className="text-[13px] font-semibold text-[#248a3d]"
              style={{ fontFamily: '-apple-system, "SF Pro Text", system-ui, sans-serif' }}
            >
              View All →
            </button>
          </div>

          {/* Drill card */}
          <div className="relative rounded-2xl overflow-hidden h-[180px] w-full">
            <img src={IMG_DRILL_THUMB} alt="Dynamic Warm Up" className="w-full h-full object-cover" />
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
            <div className="absolute bottom-0 left-0 right-0 p-4">
              <span className="inline-block bg-[#248a3d] text-white text-[10px] font-bold uppercase tracking-[0.8px] px-2 py-1 rounded mb-1">
                Dynamic Warm Up
              </span>
              <div className="flex gap-2 mt-1">
                <span className="text-white/80 text-[11px]">✓ Prevents injury</span>
                <span className="text-white/80 text-[11px]">✓ Improves flexibility</span>
              </div>
            </div>
            {/* Play button */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
              <div className="w-12 h-12 bg-white/30 backdrop-blur-sm rounded-full flex items-center justify-center">
                <svg width="20" height="20" viewBox="0 0 20 20" fill="white">
                  <path d="M6 4L16 10L6 16V4Z" />
                </svg>
              </div>
            </div>
          </div>
        </section>

        {/* Community */}
        <section className="px-5 mt-6">
          <div className="flex items-center justify-between mb-3">
            <h2
              className="text-[17px] font-semibold text-[#1c1c1e] leading-[22px]"
              style={{ fontFamily: '-apple-system, "SF Pro Text", system-ui, sans-serif' }}
            >
              Community
            </h2>
            <button className="text-[13px] font-semibold text-[#248a3d]">
              See More →
            </button>
          </div>

          {/* Scrollable posts row */}
          <div className="flex gap-3 overflow-x-auto pb-1 -mx-5 px-5">
            {COMMUNITY_POSTS.map((post) => (
              <div
                key={post.id}
                className="flex-shrink-0 w-[150px] bg-[#f4f4f4] rounded-2xl p-3"
              >
                <div className="flex items-center gap-2 mb-2">
                  <div className="w-7 h-7 bg-[#c7c7cc] rounded-full flex-shrink-0" />
                  <span
                    className="text-[11px] font-semibold text-[#1c1c1e] truncate"
                    style={{ fontFamily: '-apple-system, "SF Pro Text", system-ui, sans-serif' }}
                  >
                    {post.user}
                  </span>
                </div>
                <p
                  className="text-[11px] text-[rgba(60,60,67,0.7)] leading-[15px] line-clamp-3"
                  style={{ fontFamily: '-apple-system, "SF Pro Text", system-ui, sans-serif' }}
                >
                  {post.excerpt}
                </p>
                <div className="flex gap-3 mt-2">
                  <span className="text-[10px] text-[rgba(60,60,67,0.5)]">♡ 0</span>
                  <span className="text-[10px] text-[rgba(60,60,67,0.5)]">💬 0</span>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* My Clubs */}
        <section className="px-5 mt-6">
          <div className="flex items-center justify-between mb-3">
            <h2
              className="text-[17px] font-semibold text-[#1c1c1e] leading-[22px]"
              style={{ fontFamily: '-apple-system, "SF Pro Text", system-ui, sans-serif' }}
            >
              My Clubs
            </h2>
            <button
              onClick={() => navigate('/collection')}
              className="text-[13px] font-semibold text-[#248a3d]"
            >
              View Collection →
            </button>
          </div>

          <div className="flex gap-3">
            {CLUBS.map((club) => (
              <button
                key={club.id}
                onClick={() => navigate(`/collection/${club.id}`)}
                className="flex-1 flex flex-col items-center gap-2 bg-[#f4f4f4] rounded-2xl py-4"
              >
                <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center shadow-sm">
                  <span className="text-[18px]">{club.emoji}</span>
                </div>
                <span
                  className="text-[11px] font-semibold text-[#38383a]"
                  style={{ fontFamily: '-apple-system, "SF Pro Text", system-ui, sans-serif' }}
                >
                  {club.label}
                </span>
              </button>
            ))}
          </div>
        </section>

      </div>

      <BottomNav />
    </div>
  )
}

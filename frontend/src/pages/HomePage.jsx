import { useNavigate } from 'react-router-dom'
import { useState, useRef } from 'react'
import BottomNav from '../components/BottomNav'
import patrickAvatar from '../assets/patrick.png'
import warmupImg from '../assets/warmup.jpeg'
import clubDriverImg from '../assets/club_driver.png'
import clubIronImg from '../assets/club_iron.png'
import clubWedgeImg from '../assets/club_wedge.png'
import clubPutterImg from '../assets/club_putter.png'
import { loadPosts } from '../data/communityPosts'
import proIcon from '../assets/pro_icon.png'
import badgeIcon from '../assets/badge_icon.png'

// M T W T F S S — index 2 (W) is today, 0 and 1 are completed
const WEEK_DAYS = [
  { label: 'M', state: 'done' },
  { label: 'T', state: 'done' },
  { label: 'W', state: 'today' },
  { label: 'T', state: 'empty' },
  { label: 'F', state: 'empty' },
  { label: 'S', state: 'empty' },
  { label: 'S', state: 'empty' },
]

const CLUBS = [
  { id: 'drivers', label: 'Driver', img: clubDriverImg },
  { id: 'irons',   label: 'Iron',   img: clubIronImg   },
  { id: 'wedges',  label: 'Wedge',  img: clubWedgeImg  },
  { id: 'putters', label: 'Putter', img: clubPutterImg },
]

// Days that have a streak fire — Feb 2025
const STREAK_DAYS = new Set([14, 15, 16, 17, 18, 19, 20, 21])
const MONTH_NAMES = ['JAN','FEB','MAR','APR','MAY','JUN','JUL','AUG','SEP','OCT','NOV','DEC']
const DAY_LABELS  = ['MON','TUE','WED','THU','FRI','SAT','SUN']

// ── Streak day dot ──────────────────────────────────────────────────────────
function DayDot({ label, state }) {
  return (
    <div className="flex flex-col items-center gap-1 flex-1">
      <span
        className="text-[11px] font-semibold text-[rgba(60,60,67,0.5)]"
        style={{ fontFamily: '-apple-system, "SF Pro Text", system-ui, sans-serif' }}
      >
        {label}
      </span>
      {state === 'done' && (
        <div className="w-8 h-8 rounded-full bg-[#f97316] flex items-center justify-center">
          <span className="text-[16px]">🔥</span>
        </div>
      )}
      {state === 'today' && (
        <div className="w-8 h-8 rounded-full bg-[#f97316] flex items-center justify-center">
          <span className="text-[16px]">🔥</span>
        </div>
      )}
      {state === 'empty' && (
        <div className="w-8 h-8 rounded-full border-2 border-[#e5e5ea] bg-[#f4f4f4]" />
      )}
    </div>
  )
}

// ── Streak calendar modal ───────────────────────────────────────────────────
function StreakCalendar({ onClose }) {
  const [month, setMonth] = useState(1)
  const [year]  = useState(2025)

  const firstDay   = new Date(year, month, 1)
  const startOffset = (firstDay.getDay() + 6) % 7
  const daysInMonth = new Date(year, month + 1, 0).getDate()
  const cells = []
  for (let i = 0; i < startOffset; i++) cells.push(null)
  for (let d = 1; d <= daysInMonth; d++) cells.push(d)
  while (cells.length % 7 !== 0) cells.push(null)

  const isStreak = (d) => month === 1 && STREAK_DAYS.has(d)

  return (
    <div
      className="absolute inset-0 z-50 flex items-center justify-center"
      style={{ backdropFilter: 'blur(8px)', backgroundColor: 'rgba(0,0,0,0.35)' }}
      onClick={onClose}
    >
      <div
        className="bg-white rounded-3xl mx-6 w-full shadow-2xl overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between px-5 pt-5 pb-3">
          <button onClick={() => setMonth(m => Math.max(0, m - 1))}
            className="w-8 h-8 flex items-center justify-center rounded-full active:bg-[#f4f4f4]">
            <svg width="8" height="14" viewBox="0 0 8 14" fill="none">
              <path d="M7 1L1 7L7 13" stroke="#1c1c1e" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </button>
          <p className="text-[16px] font-bold text-[#1c1c1e]"
            style={{ fontFamily: '-apple-system, "SF Pro Display", system-ui, sans-serif' }}>
            {MONTH_NAMES[month]} {year}
          </p>
          <button onClick={() => setMonth(m => Math.min(11, m + 1))}
            className="w-8 h-8 flex items-center justify-center rounded-full active:bg-[#f4f4f4]">
            <svg width="8" height="14" viewBox="0 0 8 14" fill="none">
              <path d="M1 1L7 7L1 13" stroke="#1c1c1e" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </button>
        </div>
        <div className="grid grid-cols-7 px-2 pb-1">
          {DAY_LABELS.map(d => (
            <div key={d} className="text-center text-[10px] font-semibold text-[rgba(60,60,67,0.45)] py-1"
              style={{ fontFamily: '-apple-system, "SF Pro Text", system-ui, sans-serif' }}>
              {d}
            </div>
          ))}
        </div>
        <div className="grid grid-cols-7 px-2 pb-5 gap-y-1">
          {cells.map((day, i) => (
            <div key={i} className="flex items-center justify-center h-10">
              {day ? (
                isStreak(day) ? (
                  <div className="w-9 h-9 rounded-full bg-[#fef3c7] flex items-center justify-center">
                    <span className="text-[18px] leading-none">🔥</span>
                  </div>
                ) : (
                  <div className="w-9 h-9 rounded-full flex items-center justify-center">
                    <span className="text-[14px] font-medium text-[#1c1c1e]"
                      style={{ fontFamily: '-apple-system, "SF Pro Text", system-ui, sans-serif' }}>
                      {day}
                    </span>
                  </div>
                )
              ) : null}
            </div>
          ))}
        </div>
      </div>
      <button
        onClick={onClose}
        className="absolute bottom-[100px] left-1/2 -translate-x-1/2 w-10 h-10 rounded-full bg-white/20 border border-white/40 flex items-center justify-center"
      >
        <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
          <path d="M1 1L13 13M13 1L1 13" stroke="white" strokeWidth="2.5" strokeLinecap="round" />
        </svg>
      </button>
    </div>
  )
}

// ── Community card ──────────────────────────────────────────────────────────
function CommunityCard({ user, time, excerpt, likes, comments, tags, img, video, avatarColor }) {
  const videoRef  = useRef(null)
  const [isPlaying, setIsPlaying] = useState(false)

  const togglePlay = (e) => {
    e.stopPropagation()
    const vid = videoRef.current
    if (!vid) return
    if (vid.paused) { vid.play(); setIsPlaying(true) }
    else            { vid.pause(); setIsPlaying(false) }
  }

  return (
    <div className="flex-shrink-0 w-[160px] bg-white rounded-2xl overflow-hidden shadow-sm border border-[#f0f0f0]">
      {video && (
        <div className="h-[100px] overflow-hidden relative">
          <video ref={videoRef} src={`${video}#t=0.001`}
            className="w-full h-full object-cover" muted playsInline loop preload="auto" poster={img || undefined} />
          <button onClick={togglePlay}
            className="absolute bottom-1.5 right-1.5 w-6 h-6 rounded-full bg-black/50 flex items-center justify-center">
            {isPlaying
              ? <svg width="10" height="10" viewBox="0 0 10 10" fill="white"><rect x="1" y="1" width="3" height="8" rx="0.5"/><rect x="6" y="1" width="3" height="8" rx="0.5"/></svg>
              : <svg width="10" height="10" viewBox="0 0 10 10" fill="white"><path d="M2.5 1L8.5 5L2.5 9V1Z"/></svg>
            }
          </button>
        </div>
      )}
      {img && !video && (
        <div className="h-[100px] overflow-hidden">
          <img src={img} alt={user} className="w-full h-full object-cover" />
        </div>
      )}
      <div className="p-2.5">
        <div className="flex items-center gap-1.5 mb-1.5">
          <div className="w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0 text-white text-[9px] font-bold"
            style={{ backgroundColor: avatarColor }}>
            {user[0]}
          </div>
          <div className="min-w-0">
            <p className="text-[11px] font-semibold text-[#1c1c1e] truncate leading-[14px]"
              style={{ fontFamily: '-apple-system, "SF Pro Text", system-ui, sans-serif' }}>{user}</p>
            <p className="text-[10px] text-[rgba(60,60,67,0.4)] leading-[13px]">{time}</p>
          </div>
        </div>
        {tags.length > 0 && (
          <div className="flex flex-wrap gap-1 mb-1.5">
            {tags.map(tag => (
              <span key={tag} className="text-[9px] font-semibold bg-[#e5f8e9] text-[#248a3d] px-1.5 py-0.5 rounded-full">{tag}</span>
            ))}
          </div>
        )}
        <p className="text-[11px] text-[rgba(60,60,67,0.7)] leading-[15px] line-clamp-2 mb-2"
          style={{ fontFamily: '-apple-system, "SF Pro Text", system-ui, sans-serif' }}>{excerpt}</p>
        <div className="flex gap-3">
          <span className="text-[10px] text-[rgba(60,60,67,0.5)]">♡ {likes}</span>
          <span className="text-[10px] text-[rgba(60,60,67,0.5)]">💬 {comments}</span>
        </div>
      </div>
    </div>
  )
}

// ── Main page ───────────────────────────────────────────────────────────────
export default function HomePage() {
  const navigate = useNavigate()
  const [showStreak, setShowStreak]     = useState(false)
  const [communityPosts]                = useState(() => loadPosts())

  return (
    <div className="relative w-full bg-white flex flex-col min-h-[852px]">

      {/* ── Header ── */}
      <div className="px-5 pt-8 pb-0 relative flex-shrink-0">
        <div className="flex-1">
          {/* Greeting */}
          <p className="text-[25px] font-bold text-[#1c1c1e] leading-[28px]"
            style={{ fontFamily: '-apple-system, "SF Pro Display", system-ui, sans-serif' }}>
            Hello, Jared
          </p>

          {/* Membership tier badge */}
          <div className="mt-1">
            <div className="inline-flex items-center gap-1.5 bg-[#248a3d] px-3 py-1 rounded-full">
              <img src={proIcon} alt="pro" className="w-5 h-5 object-contain" />
              <span className="text-white text-[13px] font-light"
                style={{ fontFamily: '-apple-system, "SF Pro Text", system-ui, sans-serif' }}>
                Parvision Pro
              </span>
            </div>
          </div>

          {/* Badges collected */}
          <div className="mt-1">
            <button className="inline-flex items-center gap-1.5 bg-[#fef3c7] px-3 py-1 rounded-full">
              <img src={badgeIcon} alt="badge" className="w-5 h-5 object-contain" />
              <span className="text-[#d97706] text-[13px] font-light"
                style={{ fontFamily: '-apple-system, "SF Pro Text", system-ui, sans-serif' }}>
                13 Badges Collected
              </span>
            </button>
          </div>

          {/* Main heading */}
          <h1 className="text-[25px] font-bold leading-[34px] text-[#1c1c1e] mt-1.5"
            style={{ fontFamily: '-apple-system, "SF Pro Display", system-ui, sans-serif' }}>
            Ready to Perfect your{' '}
            <span className="text-[#248a3d]">Game</span>?
          </h1>
        </div>

        {/* Profile avatar */}
        <button onClick={() => navigate('/profile')} className="absolute top-10 right-8">
          <img src={patrickAvatar} alt="Profile"
            className="w-14 h-14 rounded-full object-cover border-2 border-[#e5f8e9]" />
        </button>
      </div>

      {/* ── Full-width Streak Calendar card ── */}
      <div className="px-5 mt-2 flex-shrink-0">
        <button
          onClick={() => setShowStreak(true)}
          className="w-full bg-white border border-[#f0f0f0] rounded-2xl px-4 py-3 shadow-sm active:opacity-80 transition-opacity"
          style={{ boxShadow: '0 1px 4px rgba(0,0,0,0.06)' }}
        >
          {/* Day labels */}
          <div className="flex mb-2">
            {WEEK_DAYS.map((d, i) => (
              <div key={i} className="flex-1 text-center">
                <span className="text-[11px] font-semibold text-[rgba(60,60,67,0.5)]"
                  style={{ fontFamily: '-apple-system, "SF Pro Text", system-ui, sans-serif' }}>
                  {d.label}
                </span>
              </div>
            ))}
          </div>
          {/* Dots */}
          <div className="flex">
            {WEEK_DAYS.map((d, i) => (
              <div key={i} className="flex-1 flex justify-center">
                {d.state === 'done' || d.state === 'today' ? (
                  <div className="w-8 h-8 rounded-full bg-[#f97316] flex items-center justify-center">
                    <span className="text-[16px]">🔥</span>
                  </div>
                ) : (
                  <div className="w-8 h-8 rounded-full border-2 border-[#e5e5ea] bg-[#f9f9f9]" />
                )}
              </div>
            ))}
          </div>
        </button>
      </div>

      {/* ── Scrollable content ── */}
      <div className="flex-1 overflow-y-auto pb-[72px] mt-3">

        {/* Suggested Drills */}
        <section className="px-5">
          <div className="flex items-end justify-between mb-1.5">
            <div>
              <h2 className="text-[20px] font-bold text-[#1c1c1e] leading-[26px]"
                style={{ fontFamily: '-apple-system, "SF Pro Display", system-ui, sans-serif' }}>
                Suggested Drills
              </h2>
              <p className="text-[14px] text-[rgba(60,60,67,0.5)] leading-[18px]">Based on your recent swings</p>
            </div>
            <button onClick={() => navigate('/drills')}
              className="text-[15px] font-semibold text-[#248a3d] whitespace-nowrap"
              style={{ fontFamily: '-apple-system, "SF Pro Text", system-ui, sans-serif' }}>
              View All →
            </button>
          </div>

          <div className="relative rounded-2xl overflow-hidden h-[210px] w-full">
            <img src={warmupImg} alt="Dynamic Warm Up" className="w-full h-full object-cover" />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />
            <div className="absolute bottom-0 left-0 right-0 p-4">
              <p className="text-white text-[20px] font-bold leading-[24px] uppercase tracking-[0.5px]"
                style={{ fontFamily: '-apple-system, "SF Pro Display", system-ui, sans-serif' }}>
                Dynamic Warm Up
              </p>
              <p className="text-white/80 text-[14px] mt-0.5 mb-2">15 Minutes</p>
              <div className="flex flex-col gap-1">
                {['Prevents Injury', 'Improves Flexibility'].map(point => (
                  <div key={point} className="flex items-center gap-1.5">
                    <div className="w-4 h-4 rounded-full bg-[#248a3d] flex items-center justify-center flex-shrink-0">
                      <svg width="8" height="7" viewBox="0 0 8 7" fill="none">
                        <path d="M1 3.5L3 5.5L7 1.5" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                    </div>
                    <span className="text-white text-[14px] font-medium">{point}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Community */}
        <section className="mt-6">
          <div className="px-5 flex items-end justify-between mb-2">
            <div>
              <h2 className="text-[20px] font-bold text-[#1c1c1e] leading-[26px]"
                style={{ fontFamily: '-apple-system, "SF Pro Display", system-ui, sans-serif' }}>
                Community
              </h2>
              <p className="text-[14px] text-[rgba(60,60,67,0.5)] leading-[18px]">See what others are up to</p>
            </div>
            <button onClick={() => navigate('/community')}
              className="text-[15px] font-semibold text-[#248a3d] whitespace-nowrap">
              See More →
            </button>
          </div>
          <div className="flex gap-3 overflow-x-auto pb-1 px-5 scrollbar-hide">
            {communityPosts.slice(0, 5).map((post) => (
              <CommunityCard key={post.id} {...post} excerpt={post.body} />
            ))}
          </div>
        </section>

        {/* My Clubs */}
        <section className="px-5 mt-6 mb-2">
          <div className="bg-[#f9f9f9] rounded-3xl px-4 pt-4 pb-5 border border-[#f0f0f0]">
            <div className="flex items-end justify-between mb-4">
              <div>
                <h2 className="text-[20px] font-bold text-[#1c1c1e] leading-[26px]"
                  style={{ fontFamily: '-apple-system, "SF Pro Display", system-ui, sans-serif' }}>
                  My Clubs
                </h2>
                <p className="text-[14px] text-[rgba(60,60,67,0.5)] leading-[18px]">Track your Gear</p>
              </div>
              <button onClick={() => navigate('/collection')}
                className="text-[15px] font-semibold text-[#248a3d] whitespace-nowrap">
                View Collection →
              </button>
            </div>
            <div className="flex justify-between">
              {CLUBS.map((club) => (
                <button key={club.id} onClick={() => navigate(`/collection/${club.id}`)}
                  className="flex flex-col items-center gap-2 flex-1 active:opacity-70 transition-opacity">
                  <div className="h-[70px] flex items-end justify-center">
                    <img src={club.img} alt={club.label} className="h-full w-auto object-contain" />
                  </div>
                  <span className="text-[14px] font-semibold text-[#38383a]"
                    style={{ fontFamily: '-apple-system, "SF Pro Text", system-ui, sans-serif' }}>
                    {club.label}
                  </span>
                </button>
              ))}
            </div>
          </div>
        </section>

      </div>

      <BottomNav />

      {/* Streak calendar modal */}
      {showStreak && <StreakCalendar onClose={() => setShowStreak(false)} />}
    </div>
  )
}
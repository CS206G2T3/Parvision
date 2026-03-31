import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import clubDriverImg from '../assets/club_driver.png'
import clubIronImg from '../assets/club_iron.png'
import clubWedgeImg from '../assets/club_wedge.png'
import clubPutterImg from '../assets/club_putter.png'
import golfBagImg from '../assets/golfbag.png'
import glovesImg from '../assets/gloves.png'

const CLUB_CATEGORIES = [
  {
    id: 'drivers',
    label: 'Drivers',
    count: 2,
    countLabel: 'clubs',
    img: clubDriverImg,
  },
  {
    id: 'irons',
    label: 'Irons',
    count: 4,
    countLabel: 'clubs',
    img: clubIronImg,
  },
  {
    id: 'wedges',
    label: 'Wedges',
    count: 3,
    countLabel: 'clubs',
    img: clubWedgeImg,
  },
  {
    id: 'putters',
    label: 'Putters',
    count: 5,
    countLabel: 'clubs',
    img: clubPutterImg,
  },
  {
    id: 'miscellaneous',
    label: 'Miscellaneous',
    count: 2,
    countLabel: 'items',
    img: glovesImg,
  },
]

function ClubCard({ id, label, count, countLabel, img, onPress }) {
  return (
    <button
      onClick={onPress}
      className="w-full flex items-center justify-between bg-white rounded-2xl px-4 py-3 active:opacity-75 transition-opacity"
      style={{ boxShadow: '0 1px 4px rgba(0,0,0,0.07)' }}
    >
      {/* Club image */}
      <div className="w-[72px] h-[72px] flex items-center justify-center flex-shrink-0">
        {img ? (
          <img src={img} alt={label} className="h-full w-auto object-contain" />
        ) : (
          <div className="w-14 h-14 bg-[#f4f4f4] rounded-xl flex items-center justify-center">
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none">
              <path d="M5 20L12 4L19 20" stroke="#c7c7cc" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
              <path d="M8 14H16" stroke="#c7c7cc" strokeWidth="1.5" strokeLinecap="round" />
            </svg>
          </div>
        )}
      </div>

      {/* Label + count */}
      <div className="flex-1 text-left px-3">
        <p
          className="text-[20px] font-bold text-[#1c1c1e] leading-[26px]"
          style={{ fontFamily: '-apple-system, "SF Pro Display", system-ui, sans-serif' }}
        >
          {label}
        </p>
        <p
          className="text-[13px] text-[rgba(60,60,67,0.45)] mt-0.5"
          style={{ fontFamily: '-apple-system, "SF Pro Text", system-ui, sans-serif' }}
        >
          ({count} {countLabel})
        </p>
      </div>

      {/* Chevron */}
      <svg width="8" height="14" viewBox="0 0 8 14" fill="none" className="flex-shrink-0">
        <path d="M1 1L7 7L1 13" stroke="rgba(60,60,67,0.3)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    </button>
  )
}

export default function CollectionPage() {
  const navigate = useNavigate()
  const [query, setQuery] = useState('')

  const totalClubs = CLUB_CATEGORIES.reduce((sum, c) => sum + c.count, 0)
  const filtered = CLUB_CATEGORIES.filter((c) =>
    c.label.toLowerCase().includes(query.toLowerCase())
  )

  // Split into main clubs and miscellaneous
  const mainClubs = filtered.filter((c) => c.id !== 'miscellaneous')
  const misc      = filtered.filter((c) => c.id === 'miscellaneous')

  return (
    <div className="w-full bg-[#f4f4f4] flex flex-col min-h-screen">

      {/* Header */}
      <div className="bg-white pt-12 pb-4 px-5 flex-shrink-0">

        {/* Back */}
        <button
          onClick={() => navigate('/home')}
          className="flex items-center gap-1 mb-4"
        >
          <svg width="8" height="14" viewBox="0 0 8 14" fill="none">
            <path d="M7 1L1 7L7 13" stroke="#1c1c1e" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
          <span
            className="text-[15px] font-medium text-[#1c1c1e] ml-1"
            style={{ fontFamily: '-apple-system, "SF Pro Text", system-ui, sans-serif' }}
          >
            Home
          </span>
        </button>

        {/* Title row */}
        <div className="flex items-center gap-4 mb-4">
          <div className="w-[88px] h-[88px] bg-white rounded-2xl flex items-center justify-center flex-shrink-0 overflow-hidden" style={{ boxShadow: '0 1px 4px rgba(0,0,0,0.08)' }}>
            <img src={golfBagImg} alt="Golf Bag" className="w-[76px] h-[76px] object-contain" />
          </div>
          <div>
            <h1
              className="text-[20px] font-bold text-[#1c1c1e] uppercase tracking-[0.5px] leading-[26px]"
              style={{ fontFamily: '-apple-system, "SF Pro Display", system-ui, sans-serif' }}
            >
              My Golf{'\n'}Collection
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
        <div className="flex items-center bg-[#f4f4f4] rounded-[14px] h-[40px] px-3 gap-2">
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
            <circle cx="7" cy="7" r="5" stroke="rgba(60,60,67,0.4)" strokeWidth="1.5" />
            <path d="M11 11L14 14" stroke="rgba(60,60,67,0.4)" strokeWidth="1.5" strokeLinecap="round" />
          </svg>
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search"
            className="flex-1 bg-transparent text-[14px] text-[#1c1c1e] placeholder-[rgba(60,60,67,0.4)] focus:outline-none"
            style={{ fontFamily: '-apple-system, "SF Pro Text", system-ui, sans-serif' }}
          />
          {query.length > 0 && (
            <button onClick={() => setQuery('')} className="text-[rgba(60,60,67,0.5)] text-[18px] leading-none">×</button>
          )}
        </div>
      </div>

      {/* List */}
      <div className="flex-1 px-4 pb-10 mt-4">

        {/* Main clubs section */}
        {mainClubs.length > 0 && (
          <div className="mb-5">
            <p
              className="text-[12px] font-semibold text-[rgba(60,60,67,0.45)] uppercase tracking-[0.5px] mb-2 px-1"
              style={{ fontFamily: '-apple-system, "SF Pro Text", system-ui, sans-serif' }}
            >
              Clubs bag ({totalClubs} clubs)
            </p>
            <div className="flex flex-col gap-3">
              {mainClubs.map((cat) => (
                <ClubCard
                  key={cat.id}
                  {...cat}
                  onPress={() => navigate(`/collection/${cat.id}`)}
                />
              ))}
            </div>
          </div>
        )}

        {/* Miscellaneous section */}
        {misc.length > 0 && (
          <div>
            <p
              className="text-[12px] font-semibold text-[rgba(60,60,67,0.45)] uppercase tracking-[0.5px] mb-2 px-1"
              style={{ fontFamily: '-apple-system, "SF Pro Text", system-ui, sans-serif' }}
            >
              Miscellaneous ({misc[0].count} items)
            </p>
            <div className="flex flex-col gap-3">
              {misc.map((cat) => (
                <ClubCard
                  key={cat.id}
                  {...cat}
                  onPress={() => navigate(`/collection/${cat.id}`)}
                />
              ))}
            </div>
          </div>
        )}

        {filtered.length === 0 && (
          <div className="flex flex-col items-center justify-center pt-16 gap-3">
            <span className="text-[32px]">🔍</span>
            <p
              className="text-[15px] font-semibold text-[#1c1c1e]"
              style={{ fontFamily: '-apple-system, "SF Pro Text", system-ui, sans-serif' }}
            >
              No clubs found
            </p>
          </div>
        )}
      </div>
    </div>
  )
}
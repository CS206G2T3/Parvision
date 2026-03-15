import { useState } from 'react'
import { useNavigate } from 'react-router-dom'

import warmup from '../assets/warmup.jpeg'
import { IMG_ARROW_BACK } from '../icons'
const IMG_DRILL_THUMB = warmup

const CATEGORIES = ['All', 'Warm Up', 'Driving', 'Irons', 'Putting', 'Short Game', 'Fitness']

const DRILLS = [
  { id: 1, title: 'Dynamic Warm Up', duration: '15 min', category: 'Warm Up', level: 'Beginner', thumb: IMG_DRILL_THUMB },
  { id: 2, title: 'Driver Power Drill', duration: '20 min', category: 'Driving', level: 'Intermediate', thumb: IMG_DRILL_THUMB },
  { id: 3, title: 'Iron Swing Technique', duration: '18 min', category: 'Irons', level: 'Intermediate', thumb: IMG_DRILL_THUMB },
  { id: 4, title: 'Putting Fundamentals', duration: '22 min', category: 'Putting', level: 'Beginner', thumb: IMG_DRILL_THUMB },
  { id: 5, title: 'Chipping Around The Green', duration: '12 min', category: 'Short Game', level: 'Beginner', thumb: IMG_DRILL_THUMB },
  { id: 6, title: 'Bunker Shot Basics', duration: '14 min', category: 'Short Game', level: 'Intermediate', thumb: IMG_DRILL_THUMB },
  { id: 7, title: 'Long Iron Control', duration: '25 min', category: 'Irons', level: 'Advanced', thumb: IMG_DRILL_THUMB },
  { id: 8, title: 'Distance Putting', duration: '17 min', category: 'Putting', level: 'Intermediate', thumb: IMG_DRILL_THUMB },
  { id: 9, title: 'Core Strength For Golf', duration: '30 min', category: 'Fitness', level: 'Beginner', thumb: IMG_DRILL_THUMB },
  { id: 10, title: 'Full Swing Sequence', duration: '28 min', category: 'Driving', level: 'Advanced', thumb: IMG_DRILL_THUMB },
]

const LEVEL_COLORS = {
  Beginner: { bg: 'bg-[#e5f8e9]', text: 'text-[#248a3d]' },
  Intermediate: { bg: 'bg-[#f8e0be]', text: 'text-[#c47a1e]' },
  Advanced: { bg: 'bg-[#ffebe5]', text: 'text-[#ff3b30]' },
}

function DrillCard({ id, title, duration, category, level, thumb, onClick }) {
  const levelColor = LEVEL_COLORS[level] || LEVEL_COLORS.Beginner
  return (
    <div onClick={onClick} className="relative rounded-2xl overflow-hidden h-[160px] w-full cursor-pointer active:opacity-90 transition-opacity">
      <img src={thumb} alt={title} className="w-full h-full object-cover" />
      <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/10 to-transparent" />

      {/* Top badges */}
      <div className="absolute top-3 left-3 flex gap-2">
        <span className="bg-[#248a3d] text-white text-[10px] font-bold uppercase tracking-[0.5px] px-2 py-1 rounded-full">
          {category}
        </span>
        <span className={`${levelColor.bg} ${levelColor.text} text-[10px] font-bold uppercase tracking-[0.5px] px-2 py-1 rounded-full`}>
          {level}
        </span>
      </div>

      {/* Bottom info + play button */}
      <div className="absolute bottom-0 left-0 right-0 p-3 flex items-end justify-between">
        <div>
          <p className="text-white text-[15px] font-semibold leading-[20px]">{title}</p>
          <p className="text-white/70 text-[12px] mt-0.5">⏱ {duration}</p>
        </div>
        <div className="w-10 h-10 bg-white/30 backdrop-blur-sm rounded-full flex items-center justify-center flex-shrink-0">
          <svg width="16" height="16" viewBox="0 0 16 16" fill="white">
            <path d="M5 3L13 8L5 13V3Z" />
          </svg>
        </div>
      </div>
    </div>
  )
}

export default function DrillsPage() {
  const navigate = useNavigate()
  const [activeCategory, setActiveCategory] = useState('All')
  const [query, setQuery] = useState('')

  const filtered = DRILLS.filter((d) => {
    const matchesCategory = activeCategory === 'All' || d.category === activeCategory
    const matchesQuery = d.title.toLowerCase().includes(query.toLowerCase())
    return matchesCategory && matchesQuery
  })

  return (
    <div className="relative w-full bg-[#f4f4f4] flex flex-col min-h-[852px]">

      {/* Header */}
      <div className="bg-white pt-14 pb-4 px-5 flex-shrink-0">
        <button
          onClick={() => navigate('/home')}
          className="flex items-center gap-2 mb-4"
          aria-label="Go back"
        >
          <img src={IMG_ARROW_BACK} alt="Back" className="w-5 h-5 object-contain" />
        </button>

        <h1
          className="text-[22px] font-bold text-[#1c1c1e] leading-[28px]"
          style={{ fontFamily: '-apple-system, "SF Pro Display", system-ui, sans-serif' }}
        >
          Suggested Drills
        </h1>
        <p
          className="text-[13px] text-[rgba(60,60,67,0.5)] mt-0.5"
          style={{ fontFamily: '-apple-system, "SF Pro Text", system-ui, sans-serif' }}
        >
          {DRILLS.length} drills to perfect your game
        </p>

        {/* Search bar */}
        <div className="flex items-center bg-[#f4f4f4] rounded-[14px] h-[40px] px-3 gap-2 mt-4">
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
            <circle cx="7" cy="7" r="5" stroke="rgba(60,60,67,0.4)" strokeWidth="1.5" />
            <path d="M11 11L14 14" stroke="rgba(60,60,67,0.4)" strokeWidth="1.5" strokeLinecap="round" />
          </svg>
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search drills..."
            className="flex-1 bg-transparent text-[14px] text-[#1c1c1e] placeholder-[rgba(60,60,67,0.4)] focus:outline-none"
            style={{ fontFamily: 'Inter, system-ui, sans-serif' }}
          />
          {query.length > 0 && (
            <button onClick={() => setQuery('')} className="text-[rgba(60,60,67,0.5)] text-[18px] leading-none">×</button>
          )}
        </div>

        {/* Category filter chips */}
        <div className="flex gap-2 mt-3 overflow-x-auto pb-1 -mx-5 px-5">
          {CATEGORIES.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`flex-shrink-0 px-4 py-1.5 rounded-full text-[13px] font-semibold transition-colors ${
                activeCategory === cat
                  ? 'bg-[#248a3d] text-white'
                  : 'bg-[#f4f4f4] text-[rgba(60,60,67,0.6)]'
              }`}
              style={{ fontFamily: '-apple-system, "SF Pro Text", system-ui, sans-serif' }}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Drill list */}
      <div className="flex-1 overflow-y-auto pb-8 px-4 mt-3">
        {filtered.length > 0 ? (
          <div className="flex flex-col gap-3">
            {filtered.map((drill) => (
              <DrillCard key={drill.id} {...drill} onClick={() => navigate(`/drills/${drill.id}`)} />
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center pt-16 gap-3">
            <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center">
              <span className="text-[28px]">🏌️</span>
            </div>
            <p
              className="text-[17px] font-semibold text-[#1c1c1e]"
              style={{ fontFamily: '-apple-system, "SF Pro Text", system-ui, sans-serif' }}
            >
              No drills found
            </p>
            <p
              className="text-[14px] text-[rgba(60,60,67,0.5)] text-center"
              style={{ fontFamily: '-apple-system, "SF Pro Text", system-ui, sans-serif' }}
            >
              Try a different search or category.
            </p>
          </div>
        )}
      </div>
    </div>
  )
}

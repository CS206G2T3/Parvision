import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import BottomNav from '../components/BottomNav'

import warmup from '../assets/warmup.jpeg'
const IMG_DRILL_THUMB = warmup

const DAYS = ['MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT', 'SUN']

const MONTH_NAMES = ['JAN','FEB','MAR','APR','MAY','JUN','JUL','AUG','SEP','OCT','NOV','DEC']

// Generate mock active days up to a given day in a month (roughly every other day)
function generateActiveDays(totalDays, upToDay) {
  const active = new Set()
  for (let d = 1; d <= Math.min(totalDays, upToDay); d++) {
    if (d % 2 === 1 || d % 7 === 0) active.add(d)
  }
  return active
}

const VIDEOS = [
  { id: 1, title: 'Dynamic Warm Up', duration: '15 min', thumb: IMG_DRILL_THUMB },
  { id: 2, title: 'Putting Fundamentals', duration: '22 min', thumb: IMG_DRILL_THUMB },
  { id: 3, title: 'Iron Swing Technique', duration: '18 min', thumb: IMG_DRILL_THUMB },
]

function CalendarCell({ day, active, today }) {
  if (!day) return <div className="flex-1 aspect-square" />
  return (
    <div className="flex-1 flex items-center justify-center aspect-square">
      <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
        today ? 'bg-[#f97316]' : active ? 'bg-[#f97316]/80' : ''
      }`}>
        <span
          className={`text-[13px] font-semibold ${
            today || active ? 'text-white' : 'text-[rgba(60,60,67,0.5)]'
          }`}
          style={{ fontFamily: '-apple-system, "SF Pro Text", system-ui, sans-serif' }}
        >
          {day}
        </span>
      </div>
    </div>
  )
}

function VideoCard({ title, duration, thumb }) {
  return (
    <div className="relative rounded-2xl overflow-hidden h-[130px] flex-shrink-0 w-[220px]">
      <img src={thumb} alt={title} className="w-full h-full object-cover" />
      <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />
      <div className="absolute bottom-0 left-0 right-0 p-3">
        <p className="text-white text-[13px] font-semibold leading-[17px]">{title}</p>
        <p className="text-white/70 text-[11px] mt-0.5">{duration}</p>
      </div>
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
        <div className="w-10 h-10 bg-white/30 backdrop-blur-sm rounded-full flex items-center justify-center">
          <svg width="16" height="16" viewBox="0 0 16 16" fill="white">
            <path d="M5 3L13 8L5 13V3Z" />
          </svg>
        </div>
      </div>
    </div>
  )
}

export default function ActivityPage() {
  const navigate = useNavigate()
  const now = new Date()
  const [viewYear, setViewYear] = useState(now.getFullYear())
  const [viewMonth, setViewMonth] = useState(now.getMonth()) // 0-indexed

  const isCurrentMonth = viewYear === now.getFullYear() && viewMonth === now.getMonth()
  const today = isCurrentMonth ? now.getDate() : null
  const totalDays = new Date(viewYear, viewMonth + 1, 0).getDate()
  // getDay() returns 0=Sun..6=Sat; convert to Mon-first (0=Mon..6=Sun)
  const firstDow = new Date(viewYear, viewMonth, 1).getDay()
  const startOffset = (firstDow + 6) % 7
  const activeDays = generateActiveDays(totalDays, today ?? totalDays)
  const monthLabel = `${MONTH_NAMES[viewMonth]} ${viewYear}`

  const goBack = () => {
    if (viewMonth === 0) { setViewMonth(11); setViewYear(y => y - 1) }
    else setViewMonth(m => m - 1)
  }
  const goForward = () => {
    const nextMonth = viewMonth === 11 ? 0 : viewMonth + 1
    const nextYear = viewMonth === 11 ? viewYear + 1 : viewYear
    if (nextYear > now.getFullYear() || (nextYear === now.getFullYear() && nextMonth > now.getMonth())) return
    setViewMonth(nextMonth); if (viewMonth === 11) setViewYear(y => y + 1)
  }

  const cells = []
  for (let i = 0; i < startOffset; i++) cells.push(null)
  for (let d = 1; d <= totalDays; d++) cells.push(d)
  while (cells.length % 7 !== 0) cells.push(null)
  const weeks = []
  for (let i = 0; i < cells.length; i += 7) weeks.push(cells.slice(i, i + 7))

  return (
    <div className="relative w-full bg-[#f4f4f4] flex flex-col min-h-[852px]">

      {/* Header */}
      <div className="bg-white pt-14 pb-4 px-5 flex-shrink-0">
        <div className="flex items-center justify-between">
          <h1
            className="text-[22px] font-bold text-[#1c1c1e] leading-[28px]"
            style={{ fontFamily: '-apple-system, "SF Pro Display", system-ui, sans-serif' }}
          >
            Activity
          </h1>
          {/* Streak badge */}
          <div className="flex items-center gap-1 bg-[#f97316] px-3 py-1.5 rounded-full">
            <span className="text-white text-[13px] font-bold">🔥 6 Days Streak</span>
          </div>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto pb-[80px] mt-3">

        {/* Calendar card */}
        <div className="mx-4 bg-white rounded-2xl p-4 shadow-sm">
          {/* Month nav */}
          <div className="flex items-center justify-between mb-3">
            <button onClick={goBack} className="w-7 h-7 flex items-center justify-center rounded-full bg-[#f4f4f4] active:opacity-60">
              <svg width="8" height="14" viewBox="0 0 8 14" fill="none">
                <path d="M7 1L1 7L7 13" stroke="#1c1c1e" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </button>
            <span
              className="text-[15px] font-bold text-[#1c1c1e]"
              style={{ fontFamily: '-apple-system, "SF Pro Text", system-ui, sans-serif' }}
            >
              {monthLabel}
            </span>
            <button onClick={goForward} className={`w-7 h-7 flex items-center justify-center rounded-full bg-[#f4f4f4] transition-opacity ${isCurrentMonth ? 'opacity-30 pointer-events-none' : 'active:opacity-60'}`}>
              <svg width="8" height="14" viewBox="0 0 8 14" fill="none">
                <path d="M1 1L7 7L1 13" stroke="#1c1c1e" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </button>
          </div>

          {/* Day headers */}
          <div className="flex mb-1">
            {DAYS.map((d) => (
              <div key={d} className="flex-1 flex items-center justify-center">
                <span
                  className="text-[10px] font-semibold text-[rgba(60,60,67,0.4)] uppercase"
                  style={{ fontFamily: '-apple-system, "SF Pro Text", system-ui, sans-serif' }}
                >
                  {d}
                </span>
              </div>
            ))}
          </div>

          {/* Weeks */}
          {weeks.map((week, wi) => (
            <div key={wi} className="flex">
              {week.map((day, di) => (
                <CalendarCell
                  key={di}
                  day={day}
                  active={day && activeDays.has(day)}
                  today={day === today}
                />
              ))}
            </div>
          ))}
        </div>

        {/* Stats row */}
        <div className="mx-4 mt-3 flex gap-3">
          <div className="flex-1 bg-white rounded-2xl p-4 text-center">
            <p className="text-[22px] font-bold text-[#f97316]">{activeDays.size}</p>
            <p className="text-[11px] text-[rgba(60,60,67,0.5)] mt-0.5 font-semibold uppercase tracking-[0.3px]">Active Days</p>
          </div>
          <div className="flex-1 bg-white rounded-2xl p-4 text-center">
            <p className="text-[22px] font-bold text-[#248a3d]">23</p>
            <p className="text-[11px] text-[rgba(60,60,67,0.5)] mt-0.5 font-semibold uppercase tracking-[0.3px]">Drills Done</p>
          </div>
          <div className="flex-1 bg-white rounded-2xl p-4 text-center">
            <p className="text-[22px] font-bold text-[#1c1c1e]">6h</p>
            <p className="text-[11px] text-[rgba(60,60,67,0.5)] mt-0.5 font-semibold uppercase tracking-[0.3px]">Practice</p>
          </div>
        </div>

        {/* Recent videos */}
        <div className="mt-5 px-4">
          <div className="flex items-center justify-between mb-3">
            <h2
              className="text-[17px] font-semibold text-[#1c1c1e]"
              style={{ fontFamily: '-apple-system, "SF Pro Text", system-ui, sans-serif' }}
            >
              Recent Drills
            </h2>
            <button
              onClick={() => navigate('/video')}
              className="text-[13px] font-semibold text-[#248a3d]"
            >
              View All →
            </button>
          </div>

          <div className="flex gap-3 overflow-x-auto pb-1 -mx-4 px-4">
            {VIDEOS.map((v) => <VideoCard key={v.id} {...v} />)}
          </div>
        </div>

      </div>

      <BottomNav />
    </div>
  )
}

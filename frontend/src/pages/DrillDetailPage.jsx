import { useNavigate, useParams } from 'react-router-dom'

import warmup from '../assets/warmup.jpeg'
import { IMG_ARROW_BACK } from '../icons'
const IMG_DRILL_THUMB = warmup

const DRILLS = [
  { id: 1, title: 'Dynamic Warm Up', duration: '15 min', category: 'Warm Up', level: 'Beginner', thumb: IMG_DRILL_THUMB, description: 'A full-body warm-up routine designed to prepare your muscles and joints for a round of golf. Includes dynamic stretches, rotational movements, and light cardio.' },
  { id: 2, title: 'Driver Power Drill', duration: '20 min', category: 'Driving', level: 'Intermediate', thumb: IMG_DRILL_THUMB, description: 'Maximise your driving distance with this power-focused drill. Focus on hip rotation, lag, and release through the impact zone.' },
  { id: 3, title: 'Iron Swing Technique', duration: '18 min', category: 'Irons', level: 'Intermediate', thumb: IMG_DRILL_THUMB, description: 'Build a consistent iron swing with drills targeting ball-first contact, proper divot pattern, and controlled trajectory.' },
  { id: 4, title: 'Putting Fundamentals', duration: '22 min', category: 'Putting', level: 'Beginner', thumb: IMG_DRILL_THUMB, description: 'Master the basics of putting: alignment, grip pressure, stroke tempo, and reading simple breaks on the green.' },
  { id: 5, title: 'Chipping Around The Green', duration: '12 min', category: 'Short Game', level: 'Beginner', thumb: IMG_DRILL_THUMB, description: 'Learn to chip with confidence using a consistent setup, controlled swing, and proper club selection for various lies.' },
  { id: 6, title: 'Bunker Shot Basics', duration: '14 min', category: 'Short Game', level: 'Intermediate', thumb: IMG_DRILL_THUMB, description: 'Take the fear out of bunkers by mastering the splash shot — open face, steep swing, and accelerating through the sand.' },
  { id: 7, title: 'Long Iron Control', duration: '25 min', category: 'Irons', level: 'Advanced', thumb: IMG_DRILL_THUMB, description: 'Advanced techniques for controlling trajectory and distance with long irons, including punch shots and controlled fades.' },
  { id: 8, title: 'Distance Putting', duration: '17 min', category: 'Putting', level: 'Intermediate', thumb: IMG_DRILL_THUMB, description: 'Eliminate three-putts by developing better distance control from 20–50 feet using rhythm-based stroke drills.' },
  { id: 9, title: 'Core Strength For Golf', duration: '30 min', category: 'Fitness', level: 'Beginner', thumb: IMG_DRILL_THUMB, description: 'A golf-specific core workout that builds rotational power and stability to improve your swing speed and injury resilience.' },
  { id: 10, title: 'Full Swing Sequence', duration: '28 min', category: 'Driving', level: 'Advanced', thumb: IMG_DRILL_THUMB, description: 'A comprehensive breakdown of the full swing from takeaway to follow-through, with drills for each phase of the motion.' },
]

const LEVEL_COLORS = {
  Beginner: { bg: 'bg-[#e5f8e9]', text: 'text-[#248a3d]' },
  Intermediate: { bg: 'bg-[#f8e0be]', text: 'text-[#c47a1e]' },
  Advanced: { bg: 'bg-[#ffebe5]', text: 'text-[#ff3b30]' },
}

const STEPS = [
  'Set up in your normal address position.',
  'Focus on the key movement cue for this drill.',
  'Perform 10 repetitions at 50% speed.',
  'Gradually increase to full speed over the next sets.',
  'Record your swing and review with the AI coach.',
]

export default function DrillDetailPage() {
  const navigate = useNavigate()
  const { id } = useParams()
  const drill = DRILLS.find((d) => d.id === Number(id)) || DRILLS[0]
  const levelColor = LEVEL_COLORS[drill.level] || LEVEL_COLORS.Beginner

  return (
    <div className="relative w-full bg-[#f4f4f4] flex flex-col min-h-[852px]">

      {/* Thumbnail hero */}
      <div className="relative h-[260px] flex-shrink-0">
        <img src={drill.thumb} alt={drill.title} className="w-full h-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />

        {/* Back button */}
        <button
          onClick={() => navigate('/drills')}
          className="absolute left-5 top-14 w-9 h-9 bg-black/30 backdrop-blur-sm rounded-full flex items-center justify-center z-10"
          aria-label="Go back"
        >
          <img src={IMG_ARROW_BACK} alt="Back" className="w-4 h-4 object-contain brightness-0 invert" />
        </button>

        {/* Badges */}
        <div className="absolute top-14 right-5 flex gap-2 z-10">
          <span className="bg-[#248a3d] text-white text-[10px] font-bold uppercase tracking-[0.5px] px-2 py-1 rounded-full">
            {drill.category}
          </span>
          <span className={`${levelColor.bg} ${levelColor.text} text-[10px] font-bold uppercase tracking-[0.5px] px-2 py-1 rounded-full`}>
            {drill.level}
          </span>
        </div>

        {/* Play button */}
        <button className="absolute inset-0 flex items-center justify-center">
          <div className="w-16 h-16 bg-white/30 backdrop-blur-sm rounded-full flex items-center justify-center border-2 border-white/50">
            <svg width="24" height="24" viewBox="0 0 16 16" fill="white">
              <path d="M5 3L13 8L5 13V3Z" />
            </svg>
          </div>
        </button>

        {/* Title overlay */}
        <div className="absolute bottom-4 left-5 right-5">
          <h1
            className="text-[22px] font-bold text-white leading-[28px]"
            style={{ fontFamily: '-apple-system, "SF Pro Display", system-ui, sans-serif' }}
          >
            {drill.title}
          </h1>
          <p className="text-white/70 text-[13px] mt-1">⏱ {drill.duration}</p>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto pb-[100px] px-5 mt-4">

        {/* Description */}
        <div className="bg-white rounded-2xl p-4 mb-4">
          <p
            className="text-[13px] font-semibold uppercase tracking-[0.5px] text-[rgba(60,60,67,0.5)] mb-2"
            style={{ fontFamily: '-apple-system, "SF Pro Text", system-ui, sans-serif' }}
          >
            About this drill
          </p>
          <p
            className="text-[15px] text-[#1c1c1e] leading-[22px]"
            style={{ fontFamily: '-apple-system, "SF Pro Text", system-ui, sans-serif' }}
          >
            {drill.description}
          </p>
        </div>

        {/* Steps */}
        <div className="bg-white rounded-2xl p-4">
          <p
            className="text-[13px] font-semibold uppercase tracking-[0.5px] text-[rgba(60,60,67,0.5)] mb-3"
            style={{ fontFamily: '-apple-system, "SF Pro Text", system-ui, sans-serif' }}
          >
            How to do it
          </p>
          <div className="flex flex-col gap-3">
            {STEPS.map((step, i) => (
              <div key={i} className="flex items-start gap-3">
                <div className="w-6 h-6 rounded-full bg-[#248a3d] flex items-center justify-center flex-shrink-0 mt-0.5">
                  <span className="text-white text-[11px] font-bold">{i + 1}</span>
                </div>
                <p
                  className="text-[14px] text-[#1c1c1e] leading-[20px] flex-1"
                  style={{ fontFamily: '-apple-system, "SF Pro Text", system-ui, sans-serif' }}
                >
                  {step}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Start button */}
      <div className="absolute bottom-0 left-0 right-0 bg-white border-t border-[#f0f0f0] px-5 py-4">
        <button
          onClick={() => navigate('/upload')}
          className="w-full h-[54px] bg-[#248a3d] rounded-[16px] flex items-center justify-center active:opacity-80 transition-opacity"
        >
          <span
            className="text-[17px] font-semibold text-white"
            style={{ fontFamily: '-apple-system, "SF Pro Display", system-ui, sans-serif' }}
          >
            Start Drill — Record Swing
          </span>
        </button>
      </div>
    </div>
  )
}

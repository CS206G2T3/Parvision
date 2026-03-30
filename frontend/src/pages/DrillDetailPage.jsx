import { useNavigate, useParams } from 'react-router-dom'

import warmup from '../assets/warmup.jpeg'
import drillWarmUpGroup from '../assets/drill_warm_up_group.png'
import drillTechniqueReview from '../assets/drill_technique_review.png'
import drillFullSwing from '../assets/drill_full_swing.png'
import drillShortGame from '../assets/drill_short_game.png'
import drillDriving from '../assets/drill_driving.png'
import drillPutting from '../assets/drill_putting.png'
import drillBunker from '../assets/drill_bunker.png'
import { IMG_ARROW_BACK } from '../icons'

const DRILLS = [
  {
    id: 1, title: 'Dynamic Warm Up', duration: '15 min', category: 'Warm Up', level: 'Beginner',
    thumb: warmup,
    description: 'A full-body warm-up routine designed to prepare your muscles and joints for a round of golf. Includes dynamic stretches, rotational movements, and light cardio.',
    focusAreas: ['Hip Mobility', 'Shoulder Rotation', 'Spine Flexibility'],
    youtubeUrl: 'https://www.youtube.com/watch?v=jM_7WHyfSRE&pp=ygUUZ29sZiBkeW5hbWljIHdhcm0gdXA%3D',
  },
  {
    id: 2, title: 'Driver Power Drill', duration: '20 min', category: 'Driving', level: 'Intermediate',
    thumb: drillDriving,
    description: 'Maximise your driving distance with this power-focused drill. Focus on hip rotation, lag, and release through the impact zone.',
    focusAreas: ['Hip Rotation', 'Lag & Release', 'Weight Transfer'],
    youtubeUrl: null,
  },
  {
    id: 3, title: 'Iron Swing Technique', duration: '18 min', category: 'Irons', level: 'Intermediate',
    thumb: drillFullSwing,
    description: 'Build a consistent iron swing with drills targeting ball-first contact, proper divot pattern, and controlled trajectory.',
    focusAreas: ['Ball-First Contact', 'Divot Pattern', 'Trajectory Control'],
    youtubeUrl: null,
  },
  {
    id: 4, title: 'Putting Fundamentals', duration: '22 min', category: 'Putting', level: 'Beginner',
    thumb: drillPutting,
    description: 'Master the basics of putting: alignment, grip pressure, stroke tempo, and reading simple breaks on the green.',
    focusAreas: ['Alignment', 'Stroke Tempo', 'Green Reading'],
    youtubeUrl: null,
  },
  {
    id: 5, title: 'Chipping Around The Green', duration: '12 min', category: 'Short Game', level: 'Beginner',
    thumb: drillShortGame,
    description: 'Learn to chip with confidence using a consistent setup, controlled swing, and proper club selection for various lies.',
    focusAreas: ['Club Selection', 'Setup Consistency', 'Soft Hands'],
    youtubeUrl: null,
  },
  {
    id: 6, title: 'Bunker Shot Basics', duration: '14 min', category: 'Short Game', level: 'Intermediate',
    thumb: drillBunker,
    description: 'Take the fear out of bunkers by mastering the splash shot — open face, steep swing, and accelerating through the sand.',
    focusAreas: ['Open Clubface', 'Steep Swing Path', 'Sand Entry Point'],
    youtubeUrl: null,
  },
  {
    id: 7, title: 'Long Iron Control', duration: '25 min', category: 'Irons', level: 'Advanced',
    thumb: drillFullSwing,
    description: 'Advanced techniques for controlling trajectory and distance with long irons, including punch shots and controlled fades.',
    focusAreas: ['Trajectory Control', 'Punch Shots', 'Controlled Fade'],
    youtubeUrl: null,
  },
  {
    id: 8, title: 'Core Strength For Golf', duration: '30 min', category: 'Fitness', level: 'Beginner',
    thumb: drillWarmUpGroup,
    description: 'A golf-specific core workout that builds rotational power and stability to improve your swing speed and injury resilience.',
    focusAreas: ['Rotational Power', 'Core Stability', 'Injury Prevention'],
    youtubeUrl: null,
  },
  {
    id: 9, title: 'Full Swing Sequence', duration: '28 min', category: 'Driving', level: 'Advanced',
    thumb: drillTechniqueReview,
    description: 'A comprehensive breakdown of the full swing from takeaway to follow-through, with drills for each phase of the motion.',
    focusAreas: ['Takeaway', 'Downswing Sequence', 'Follow-Through'],
    youtubeUrl: null,
  },
]

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

  const handleStartDrill = () => {
    if (drill.youtubeUrl) {
      window.open(drill.youtubeUrl, '_blank')
    } else {
      navigate('/upload')
    }
  }

  return (
    <div className="relative w-full bg-[#f4f4f4] flex flex-col min-h-[852px]">

      {/* Thumbnail hero */}
      <div className="relative h-[240px] flex-shrink-0">
        <img src={drill.thumb} alt={drill.title} className="w-full h-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />

        {/* Back button */}
        <button
          onClick={() => navigate('/drills')}
          className="absolute left-5 top-10 w-9 h-9 bg-black/30 backdrop-blur-sm rounded-full flex items-center justify-center z-10"
          aria-label="Go back"
        >
          <img src={IMG_ARROW_BACK} alt="Back" className="w-4 h-4 object-contain brightness-0 invert" />
        </button>

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

        {/* Key Focus Areas */}
        <div className="bg-white rounded-2xl p-4 mb-4">
          <p
            className="text-[13px] font-semibold uppercase tracking-[0.5px] text-[rgba(60,60,67,0.5)] mb-3"
            style={{ fontFamily: '-apple-system, "SF Pro Text", system-ui, sans-serif' }}
          >
            Key Focus Areas
          </p>
          <div className="flex flex-col gap-2.5">
            {drill.focusAreas.map((area) => (
              <div key={area} className="flex items-center gap-3">
                <div className="w-6 h-6 rounded-full bg-[#248a3d] flex items-center justify-center flex-shrink-0">
                  <svg width="12" height="10" viewBox="0 0 12 10" fill="none">
                    <path d="M1 5L4.5 8.5L11 1.5" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </div>
                <span
                  className="text-[15px] font-medium text-[#1c1c1e]"
                  style={{ fontFamily: '-apple-system, "SF Pro Text", system-ui, sans-serif' }}
                >
                  {area}
                </span>
              </div>
            ))}
          </div>
        </div>

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
          onClick={handleStartDrill}
          className="w-full h-[54px] bg-[#248a3d] rounded-[16px] flex items-center justify-center gap-2 active:opacity-80 transition-opacity"
        >
          {drill.youtubeUrl && (
            <svg width="18" height="18" viewBox="0 0 24 24" fill="white">
              <path d="M19.615 3.184c-3.604-.246-11.631-.245-15.23 0-3.897.266-4.356 2.62-4.385 8.816.029 6.185.484 8.549 4.385 8.816 3.6.245 11.626.246 15.23 0 3.897-.266 4.356-2.62 4.385-8.816-.029-6.185-.484-8.549-4.385-8.816zm-10.615 12.816v-8l8 3.993-8 4.007z"/>
            </svg>
          )}
          <span
            className="text-[17px] font-semibold text-white"
            style={{ fontFamily: '-apple-system, "SF Pro Display", system-ui, sans-serif' }}
          >
            Start Drill
          </span>
        </button>
      </div>
    </div>
  )
}
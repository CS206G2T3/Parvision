import { useState, useRef, useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom'

import warmup from '../assets/warmup.jpeg'
import drillWarmUpGroup from '../assets/drill_warm_up_group.png'
import drillTechniqueReview from '../assets/drill_technique_review.png'
import drillFullSwing from '../assets/drill_full_swing.png'
import drillShortGame from '../assets/drill_short_game.png'
import drillDriving from '../assets/drill_driving.png'
import drillPutting from '../assets/drill_putting.png'
import drillBunker from '../assets/drill_bunker.png'
import dynamicWarmupVideo from '../assets/dynamicwarmup.mp4'
import { IMG_ARROW_BACK } from '../icons'

const DRILLS = [
  {
    id: 1, title: 'Dynamic Warm Up', duration: '15 min', category: 'Warm Up', level: 'Beginner',
    thumb: warmup,
    description: 'A full-body warm-up routine designed to prepare your muscles and joints for a round of golf. Includes dynamic stretches, rotational movements, and light cardio.',
    focusAreas: ['Prevents Injury', 'Improves Flexibility', 'Activates Rotation'],
    youtubeUrl: null,
    localVideo: dynamicWarmupVideo,
  },
  {
    id: 2, title: 'Driver Power Drill', duration: '20 min', category: 'Driving', level: 'Intermediate',
    thumb: drillDriving,
    description: 'Maximise your driving distance with this power-focused drill. Focus on hip rotation, lag, and release through the impact zone.',
    focusAreas: ['Increases Distance', 'Improves Hip Rotation', 'Builds Swing Power'],
    youtubeUrl: null,
    localVideo: null,
  },
  {
    id: 3, title: 'Iron Swing Technique', duration: '18 min', category: 'Irons', level: 'Intermediate',
    thumb: drillFullSwing,
    description: 'Build a consistent iron swing with drills targeting ball-first contact, proper divot pattern, and controlled trajectory.',
    focusAreas: ['Improves Ball Striking', 'Sharpens Consistency', 'Controls Trajectory'],
    youtubeUrl: null,
    localVideo: null,
  },
  {
    id: 4, title: 'Putting Fundamentals', duration: '22 min', category: 'Putting', level: 'Beginner',
    thumb: drillPutting,
    description: 'Master the basics of putting: alignment, grip pressure, stroke tempo, and reading simple breaks on the green.',
    focusAreas: ['Reduces Putts Per Round', 'Improves Alignment', 'Builds Stroke Tempo'],
    youtubeUrl: null,
    localVideo: null,
  },
  {
    id: 5, title: 'Chipping Around The Green', duration: '12 min', category: 'Short Game', level: 'Beginner',
    thumb: drillShortGame,
    description: 'Learn to chip with confidence using a consistent setup, controlled swing, and proper club selection for various lies.',
    focusAreas: ['Saves Strokes', 'Improves Touch & Feel', 'Builds Short Game Confidence'],
    youtubeUrl: null,
    localVideo: null,
  },
  {
    id: 6, title: 'Bunker Shot Basics', duration: '14 min', category: 'Short Game', level: 'Intermediate',
    thumb: drillBunker,
    description: 'Take the fear out of bunkers by mastering the splash shot — open face, steep swing, and accelerating through the sand.',
    focusAreas: ['Eliminates Bunker Fear', 'Improves Sand Escapes', 'Builds Clubface Control'],
    youtubeUrl: null,
    localVideo: null,
  },
  {
    id: 7, title: 'Long Iron Control', duration: '25 min', category: 'Irons', level: 'Advanced',
    thumb: drillFullSwing,
    description: 'Advanced techniques for controlling trajectory and distance with long irons, including punch shots and controlled fades.',
    focusAreas: ['Improves Shot Shaping', 'Increases Long Iron Accuracy', 'Reduces Dispersion'],
    youtubeUrl: null,
    localVideo: null,
  },
  {
    id: 8, title: 'Core Strength For Golf', duration: '30 min', category: 'Fitness', level: 'Beginner',
    thumb: drillWarmUpGroup,
    description: 'A golf-specific core workout that builds rotational power and stability to improve your swing speed and injury resilience.',
    focusAreas: ['Prevents Back Injury', 'Increases Swing Speed', 'Builds Core Stability'],
    youtubeUrl: null,
    localVideo: null,
  },
  {
    id: 9, title: 'Full Swing Sequence', duration: '28 min', category: 'Driving', level: 'Advanced',
    thumb: drillTechniqueReview,
    description: 'A comprehensive breakdown of the full swing from takeaway to follow-through, with drills for each phase of the motion.',
    focusAreas: ['Grooves Muscle Memory', 'Improves Swing Sequencing', 'Maximises Clubhead Speed'],
    youtubeUrl: null,
    localVideo: null,
  },
]

const STEPS = [
  'Set up in your normal address position.',
  'Focus on the key movement cue for this drill.',
  'Perform 10 repetitions at 50% speed.',
  'Gradually increase to full speed over the next sets.',
  'Record your swing and review with the AI coach.',
]

// ── Video Popup ────────────────────────────────────────────────────────────────
function VideoPopup({ videoSrc, title, onClose }) {
  const videoRef = useRef(null)
  const [playing, setPlaying] = useState(false)
  const [progress, setProgress] = useState(0)
  const [currentTime, setCurrentTime] = useState(0)
  const [duration, setDuration] = useState(0)
  const [visible, setVisible] = useState(false)
  const [fullscreen, setFullscreen] = useState(false)

  useEffect(() => {
    requestAnimationFrame(() => setVisible(true))
    const v = videoRef.current
    if (v) v.play().then(() => setPlaying(true)).catch(() => {})
  }, [])

  const handleClose = () => {
    setVisible(false)
    setTimeout(onClose, 250)
  }

  const togglePlay = () => {
    const v = videoRef.current
    if (!v) return
    if (playing) { v.pause() } else { v.play() }
    setPlaying(!playing)
  }

  const handleTimeUpdate = () => {
    const v = videoRef.current
    if (!v) return
    setCurrentTime(v.currentTime)
    setProgress(v.duration ? (v.currentTime / v.duration) * 100 : 0)
  }

  const handleSeek = (e) => {
    const v = videoRef.current
    if (!v || !v.duration) return
    const rect = e.currentTarget.getBoundingClientRect()
    const ratio = (e.clientX - rect.left) / rect.width
    v.currentTime = ratio * v.duration
  }

  const formatTime = (s) => {
    const m = Math.floor(s / 60)
    const sec = Math.floor(s % 60)
    return `${m}:${sec.toString().padStart(2, '0')}`
  }

  const skipBack = () => { if (videoRef.current) videoRef.current.currentTime = Math.max(0, videoRef.current.currentTime - 10) }
  const skipForward = () => { if (videoRef.current) videoRef.current.currentTime = Math.min(videoRef.current.duration || 0, videoRef.current.currentTime + 10) }

  return (
    // Outer wrapper — switches between popup backdrop and fullscreen black
    <div
      className="absolute inset-0 z-50 flex items-center justify-center"
      style={{
        backgroundColor: fullscreen
          ? 'black'
          : visible ? 'rgba(0,0,0,0.55)' : 'rgba(0,0,0,0)',
        transition: 'background-color 0.25s ease',
      }}
      onClick={!fullscreen ? handleClose : undefined}
    >
      {/* ── FULLSCREEN layout ── */}
      {fullscreen && (
        <div
          className="absolute inset-0 flex flex-col"
          style={{ opacity: visible ? 1 : 0, transition: 'opacity 0.25s ease' }}
        >
          {/* Video fills all available space */}
          <div className="flex-1 relative bg-black" onClick={togglePlay}>
            <video
              ref={videoRef}
              src={videoSrc}
              className="w-full h-full object-contain"
              playsInline
              onTimeUpdate={handleTimeUpdate}
              onLoadedMetadata={() => setDuration(videoRef.current?.duration || 0)}
              onEnded={() => setPlaying(false)}
            />
            {!playing && (
              <div className="absolute inset-0 flex items-center justify-center bg-black/20 pointer-events-none">
                <div className="w-14 h-14 rounded-full bg-black/50 flex items-center justify-center">
                  <svg width="22" height="22" viewBox="0 0 24 24" fill="white">
                    <path d="M5 3L21 12L5 21V3Z" />
                  </svg>
                </div>
              </div>
            )}
          </div>

          {/* Bottom controls bar — always visible, no scrolling needed */}
          <div className="flex-shrink-0 bg-[#1c1c1e] px-4 pt-3" style={{ paddingBottom: 36 }}>
            {/* Title + action buttons row */}
            <div className="flex items-center justify-between mb-3">
              <p
                className="text-white text-[14px] font-semibold truncate flex-1 mr-3"
                style={{ fontFamily: '-apple-system, "SF Pro Text", system-ui, sans-serif' }}
              >
                {title}
              </p>
              <div className="flex items-center gap-2">
                {/* Minimise */}
                <button
                  onClick={() => setFullscreen(false)}
                  className="w-7 h-7 rounded-full bg-white/15 flex items-center justify-center active:opacity-60"
                >
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round">
                    <path d="M8 3v3a2 2 0 0 1-2 2H3M21 8h-3a2 2 0 0 1-2-2V3M3 16h3a2 2 0 0 0 2 2v3M16 21v-3a2 2 0 0 1 2-2h3" />
                  </svg>
                </button>
                {/* Close */}
                <button
                  onClick={handleClose}
                  className="w-7 h-7 rounded-full bg-white/15 flex items-center justify-center active:opacity-60"
                >
                  <svg width="10" height="10" viewBox="0 0 10 10" fill="none">
                    <path d="M1 1L9 9M9 1L1 9" stroke="white" strokeWidth="1.8" strokeLinecap="round" />
                  </svg>
                </button>
              </div>
            </div>

            {/* Progress bar */}
            <div className="flex items-center gap-2 mb-3">
              <span className="text-white/50 text-[11px] w-8 text-right flex-shrink-0"
                style={{ fontFamily: '-apple-system, "SF Pro Text", system-ui, sans-serif' }}>
                {formatTime(currentTime)}
              </span>
              <div className="flex-1 h-1 bg-white/20 rounded-full cursor-pointer" onClick={handleSeek}>
                <div className="h-1 bg-[#248a3d] rounded-full relative pointer-events-none" style={{ width: `${progress}%` }}>
                  <div className="absolute right-0 top-1/2 -translate-y-1/2 w-3 h-3 bg-[#248a3d] rounded-full -mr-1.5 shadow" />
                </div>
              </div>
              <span className="text-white/50 text-[11px] w-8 flex-shrink-0"
                style={{ fontFamily: '-apple-system, "SF Pro Text", system-ui, sans-serif' }}>
                {formatTime(duration)}
              </span>
            </div>

            {/* Playback buttons */}
            <div className="flex items-center justify-center gap-8">
              <button onClick={skipBack} className="active:opacity-60">
                <svg width="28" height="28" viewBox="0 0 28 28" fill="none">
                  <path d="M14 4C8.477 4 4 8.477 4 14s4.477 10 10 10 10-4.477 10-10" stroke="white" strokeWidth="2" strokeLinecap="round" />
                  <path d="M14 4L10.5 7.5M14 4L17.5 7.5" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                  <text x="14" y="16" textAnchor="middle" fill="white" fontSize="7" fontWeight="700" fontFamily="-apple-system, sans-serif">10</text>
                </svg>
              </button>
              <button onClick={togglePlay} className="w-12 h-12 rounded-full bg-[#248a3d] flex items-center justify-center shadow-md active:opacity-80">
                {playing ? (
                  <svg width="18" height="18" viewBox="0 0 18 18" fill="white">
                    <rect x="3" y="2" width="4" height="14" rx="1.5" />
                    <rect x="11" y="2" width="4" height="14" rx="1.5" />
                  </svg>
                ) : (
                  <svg width="18" height="18" viewBox="0 0 18 18" fill="white">
                    <path d="M4 2L15 9L4 16V2Z" />
                  </svg>
                )}
              </button>
              <button onClick={skipForward} className="active:opacity-60">
                <svg width="28" height="28" viewBox="0 0 28 28" fill="none">
                  <path d="M14 4C19.523 4 24 8.477 24 14s-4.477 10-10 10S4 19.523 4 14" stroke="white" strokeWidth="2" strokeLinecap="round" />
                  <path d="M14 4L17.5 7.5M14 4L10.5 7.5" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                  <text x="14" y="16" textAnchor="middle" fill="white" fontSize="7" fontWeight="700" fontFamily="-apple-system, sans-serif">10</text>
                </svg>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ── POPUP (small window) layout ── */}
      {!fullscreen && (
        <div
          className="bg-[#1c1c1e] flex flex-col overflow-hidden"
          style={{
            width: 'calc(100% - 40px)',
            borderRadius: 24,
            transform: visible ? 'scale(1) translateY(0)' : 'scale(0.92) translateY(24px)',
            opacity: visible ? 1 : 0,
            transition: 'transform 0.25s ease, opacity 0.25s ease',
            boxShadow: '0 24px 60px rgba(0,0,0,0.5)',
          }}
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="flex items-center justify-between px-4 pt-4 pb-2">
            <p
              className="text-white text-[15px] font-semibold truncate flex-1 mr-3"
              style={{ fontFamily: '-apple-system, "SF Pro Text", system-ui, sans-serif' }}
            >
              {title}
            </p>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setFullscreen(true)}
                className="w-7 h-7 rounded-full bg-white/15 flex items-center justify-center active:opacity-60"
              >
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round">
                  <path d="M8 3H5a2 2 0 0 0-2 2v3M21 8V5a2 2 0 0 0-2-2h-3M3 16v3a2 2 0 0 0 2 2h3M16 21h3a2 2 0 0 0 2-2v-3" />
                </svg>
              </button>
              <button
                onClick={handleClose}
                className="w-7 h-7 rounded-full bg-white/15 flex items-center justify-center active:opacity-60"
              >
                <svg width="10" height="10" viewBox="0 0 10 10" fill="none">
                  <path d="M1 1L9 9M9 1L1 9" stroke="white" strokeWidth="1.8" strokeLinecap="round" />
                </svg>
              </button>
            </div>
          </div>

          {/* Video */}
          <div className="relative w-full bg-black" style={{ aspectRatio: '16/9' }} onClick={togglePlay}>
            <video
              ref={videoRef}
              src={videoSrc}
              className="w-full h-full object-contain"
              playsInline
              onTimeUpdate={handleTimeUpdate}
              onLoadedMetadata={() => setDuration(videoRef.current?.duration || 0)}
              onEnded={() => setPlaying(false)}
            />
            {!playing && (
              <div className="absolute inset-0 flex items-center justify-center bg-black/20">
                <div className="w-14 h-14 rounded-full bg-black/50 flex items-center justify-center">
                  <svg width="22" height="22" viewBox="0 0 24 24" fill="white">
                    <path d="M5 3L21 12L5 21V3Z" />
                  </svg>
                </div>
              </div>
            )}
          </div>

          {/* Controls */}
          <div className="px-4 pt-3 pb-4">
            <div className="flex items-center gap-2 mb-3">
              <span className="text-white/50 text-[11px] w-8 text-right flex-shrink-0"
                style={{ fontFamily: '-apple-system, "SF Pro Text", system-ui, sans-serif' }}>
                {formatTime(currentTime)}
              </span>
              <div className="flex-1 h-1 bg-white/20 rounded-full cursor-pointer" onClick={handleSeek}>
                <div className="h-1 bg-[#248a3d] rounded-full relative pointer-events-none" style={{ width: `${progress}%` }}>
                  <div className="absolute right-0 top-1/2 -translate-y-1/2 w-3 h-3 bg-[#248a3d] rounded-full -mr-1.5 shadow" />
                </div>
              </div>
              <span className="text-white/50 text-[11px] w-8 flex-shrink-0"
                style={{ fontFamily: '-apple-system, "SF Pro Text", system-ui, sans-serif' }}>
                {formatTime(duration)}
              </span>
            </div>
            <div className="flex items-center justify-center gap-8">
              <button onClick={skipBack} className="active:opacity-60">
                <svg width="28" height="28" viewBox="0 0 28 28" fill="none">
                  <path d="M14 4C8.477 4 4 8.477 4 14s4.477 10 10 10 10-4.477 10-10" stroke="white" strokeWidth="2" strokeLinecap="round" />
                  <path d="M14 4L10.5 7.5M14 4L17.5 7.5" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                  <text x="14" y="16" textAnchor="middle" fill="white" fontSize="7" fontWeight="700" fontFamily="-apple-system, sans-serif">10</text>
                </svg>
              </button>
              <button onClick={togglePlay} className="w-12 h-12 rounded-full bg-[#248a3d] flex items-center justify-center shadow-md active:opacity-80">
                {playing ? (
                  <svg width="18" height="18" viewBox="0 0 18 18" fill="white">
                    <rect x="3" y="2" width="4" height="14" rx="1.5" />
                    <rect x="11" y="2" width="4" height="14" rx="1.5" />
                  </svg>
                ) : (
                  <svg width="18" height="18" viewBox="0 0 18 18" fill="white">
                    <path d="M4 2L15 9L4 16V2Z" />
                  </svg>
                )}
              </button>
              <button onClick={skipForward} className="active:opacity-60">
                <svg width="28" height="28" viewBox="0 0 28 28" fill="none">
                  <path d="M14 4C19.523 4 24 8.477 24 14s-4.477 10-10 10S4 19.523 4 14" stroke="white" strokeWidth="2" strokeLinecap="round" />
                  <path d="M14 4L17.5 7.5M14 4L10.5 7.5" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                  <text x="14" y="16" textAnchor="middle" fill="white" fontSize="7" fontWeight="700" fontFamily="-apple-system, sans-serif">10</text>
                </svg>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

// ── Main page ──────────────────────────────────────────────────────────────────
export default function DrillDetailPage() {
  const navigate = useNavigate()
  const { id } = useParams()
  const drill = DRILLS.find((d) => d.id === Number(id)) || DRILLS[0]
  const [showVideo, setShowVideo] = useState(false)

  const handleStartDrill = () => {
    if (drill.localVideo) {
      setShowVideo(true)
    } else if (drill.youtubeUrl) {
      window.open(drill.youtubeUrl, '_blank')
    } else {
      navigate('/upload')
    }
  }

  return (
    <div className="relative w-full bg-[#f4f4f4] flex flex-col h-screen overflow-hidden">

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
      <div className="flex-1 overflow-y-auto px-5 mt-4 pb-4">

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

      {/* Start button — always pinned at bottom, never needs scrolling */}
      <div className="flex-shrink-0 bg-white border-t border-[#f0f0f0] px-5 py-4">
        <button
          onClick={handleStartDrill}
          className="w-full h-[54px] bg-[#248a3d] rounded-[16px] flex items-center justify-center gap-2 active:opacity-80 transition-opacity"
        >
          {/* Play icon */}
          <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
            <path d="M4 2L15 9L4 16V2Z" fill="white" />
          </svg>
          <span
            className="text-[17px] font-semibold text-white"
            style={{ fontFamily: '-apple-system, "SF Pro Display", system-ui, sans-serif' }}
          >
            Start Drill
          </span>
        </button>
      </div>

      {/* Video popup */}
      {showVideo && drill.localVideo && (
        <VideoPopup
          videoSrc={drill.localVideo}
          title={drill.title}
          onClose={() => setShowVideo(false)}
        />
      )}
    </div>
  )
}
import { useState, useRef, useCallback } from 'react'
import { useNavigate } from 'react-router-dom'
import ballTracerSetupImg from '../assets/balltracer-setup.png'

export default function BallTracerSetupPage() {
  const navigate = useNavigate()
  const [playing, setPlaying] = useState(false)
  const [currentSec, setCurrentSec] = useState(2)
  const TOTAL_SEC = 9
  const progress = (currentSec / TOTAL_SEC) * 100
  const stepBack = () => setCurrentSec((t) => Math.max(0, t - 1))
  const stepForward = () => setCurrentSec((t) => Math.min(TOTAL_SEC, t + 1))

  // Marker position as % of container
  const [markerPos, setMarkerPos] = useState({ x: 50, y: 40 })
  const [dragging, setDragging] = useState(false)
  const videoRef = useRef(null)

  const getRelativePos = useCallback((clientX, clientY) => {
    const rect = videoRef.current?.getBoundingClientRect()
    if (!rect) return null
    const x = Math.max(0, Math.min(100, ((clientX - rect.left) / rect.width) * 100))
    const y = Math.max(0, Math.min(100, ((clientY - rect.top) / rect.height) * 100))
    return { x, y }
  }, [])

  // Mouse events
  const onMouseDown = (e) => { e.preventDefault(); setDragging(true) }
  const onMouseMove = useCallback((e) => {
    if (!dragging) return
    const pos = getRelativePos(e.clientX, e.clientY)
    if (pos) setMarkerPos(pos)
  }, [dragging, getRelativePos])
  const onMouseUp = () => setDragging(false)

  // Touch events
  const onTouchStart = (e) => { e.preventDefault(); setDragging(true) }
  const onTouchMove = useCallback((e) => {
    if (!dragging) return
    const t = e.touches[0]
    const pos = getRelativePos(t.clientX, t.clientY)
    if (pos) setMarkerPos(pos)
  }, [dragging, getRelativePos])
  const onTouchEnd = () => setDragging(false)

  return (
    <div
      className="relative w-full bg-white flex flex-col min-h-[852px]"
      onMouseMove={onMouseMove}
      onMouseUp={onMouseUp}
      onTouchMove={onTouchMove}
      onTouchEnd={onTouchEnd}
    >

      {/* Header */}
      <div className="flex items-center justify-between px-5 pt-14 pb-4 border-b border-[#f0f0f0] flex-shrink-0">
        <button
          onClick={() => navigate('/upload/select-mode')}
          className="flex items-center gap-1"
        >
          <svg width="8" height="14" viewBox="0 0 8 14" fill="none">
            <path d="M7 1L1 7L7 13" stroke="#248a3d" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
          <span
            className="text-[15px] font-medium text-[#248a3d] ml-1"
            style={{ fontFamily: '-apple-system, "SF Pro Text", system-ui, sans-serif' }}
          >
            Back
          </span>
        </button>
        <p
          className="text-[17px] font-bold text-[#1c1c1e] uppercase tracking-[1px]"
          style={{ fontFamily: '-apple-system, "SF Pro Display", system-ui, sans-serif' }}
        >
          Upload
        </p>
        <div className="w-14" />
      </div>

      <div className="flex-1 flex flex-col px-5 pt-4">

        {/* Title */}
        <p
          className="text-[17px] font-bold text-[#1c1c1e] leading-[22px]"
          style={{ fontFamily: '-apple-system, "SF Pro Display", system-ui, sans-serif' }}
        >
          Ball Tracer Setup
        </p>
        <p
          className="text-[13px] text-[rgba(60,60,67,0.5)] mt-0.5 mb-4"
          style={{ fontFamily: '-apple-system, "SF Pro Text", system-ui, sans-serif' }}
        >
          Drag the marker onto the ball before impact
        </p>

        {/* Video with draggable marker */}
        <div
          ref={videoRef}
          className="relative rounded-2xl overflow-hidden w-full"
          style={{ aspectRatio: '9/16', touchAction: 'none' }}
        >
          <img src={ballTracerSetupImg} alt="Swing video" className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-black/10" />

          {/* Draggable marker */}
          <div
            className="absolute cursor-grab active:cursor-grabbing"
            style={{
              left: `${markerPos.x}%`,
              top: `${markerPos.y}%`,
              transform: 'translate(-50%, -50%)',
              touchAction: 'none',
            }}
            onMouseDown={onMouseDown}
            onTouchStart={onTouchStart}
          >
            {/* Outer ring */}
            <div className="relative">
              <div
                className="w-9 h-9 rounded-full border-[3px] flex items-center justify-center"
                style={{
                  borderColor: dragging ? '#ff3b30' : 'white',
                  backgroundColor: dragging ? 'rgba(255,59,48,0.2)' : 'rgba(255,255,255,0.2)',
                  boxShadow: '0 0 0 1px rgba(0,0,0,0.3)',
                }}
              >
                {/* Inner dot */}
                <div
                  className="w-3 h-3 rounded-full"
                  style={{ backgroundColor: dragging ? '#ff3b30' : 'white' }}
                />
              </div>
            </div>
          </div>
        </div>

        {/* Progress bar */}
        <div className="mt-4 flex items-center gap-2">
          <span
            className="text-[12px] text-[rgba(60,60,67,0.5)] w-8 text-right flex-shrink-0"
            style={{ fontFamily: '-apple-system, "SF Pro Text", system-ui, sans-serif' }}
          >
            0:0{currentSec}
          </span>
          <div className="flex-1 h-1 bg-[#e5e5ea] rounded-full">
            <div
              className="h-1 bg-[#248a3d] rounded-full relative"
              style={{ width: `${progress}%` }}
            >
              <div className="absolute right-0 top-1/2 -translate-y-1/2 w-3.5 h-3.5 bg-[#248a3d] rounded-full -mr-1.5 shadow" />
            </div>
          </div>
          <span
            className="text-[12px] text-[rgba(60,60,67,0.5)] w-8 flex-shrink-0"
            style={{ fontFamily: '-apple-system, "SF Pro Text", system-ui, sans-serif' }}
          >
            0:09
          </span>
        </div>

        {/* Playback controls */}
        <div className="flex items-center justify-center gap-8 mt-4">
          <button onClick={stepBack} className="w-10 h-10 flex items-center justify-center active:opacity-60">
            <svg width="28" height="28" viewBox="0 0 28 28" fill="none">
              <path d="M22 22L10 14L22 6V22Z" fill="#248a3d" />
              <rect x="5" y="5" width="3.5" height="18" rx="1.5" fill="#248a3d" />
            </svg>
          </button>
          <button
            onClick={() => setPlaying(!playing)}
            className="w-14 h-14 bg-[#248a3d] rounded-full flex items-center justify-center shadow-md active:opacity-80"
          >
            {playing ? (
              <svg width="20" height="20" viewBox="0 0 20 20" fill="white">
                <rect x="3" y="2" width="5" height="16" rx="2" />
                <rect x="12" y="2" width="5" height="16" rx="2" />
              </svg>
            ) : (
              <svg width="20" height="20" viewBox="0 0 20 20" fill="white">
                <path d="M5 3L17 10L5 17V3Z" />
              </svg>
            )}
          </button>
          <button onClick={stepForward} className="w-10 h-10 flex items-center justify-center active:opacity-60">
            <svg width="28" height="28" viewBox="0 0 28 28" fill="none">
              <path d="M6 22L18 14L6 6V22Z" fill="#248a3d" />
              <rect x="19.5" y="5" width="3.5" height="18" rx="1.5" fill="#248a3d" />
            </svg>
          </button>
        </div>

        {/* Confirm button */}
        <button
          onClick={() => navigate('/upload/processing', { state: { mode: 'ball-tracer' } })}
          className="w-full h-[52px] bg-[#248a3d] rounded-2xl flex items-center justify-center gap-2 mt-6 active:opacity-80 transition-opacity"
        >
          <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
            <path d="M3 9L7 13L15 5" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
          <span
            className="text-white text-[17px] font-bold"
            style={{ fontFamily: '-apple-system, "SF Pro Display", system-ui, sans-serif' }}
          >
            Confirm
          </span>
        </button>

      </div>
    </div>
  )
}

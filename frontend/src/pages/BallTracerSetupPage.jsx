import { useState, useRef, useCallback } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'

export default function BallTracerSetupPage() {
  const navigate = useNavigate()
  const { state } = useLocation()
  const video = state?.video || null
  const thumb = state?.thumb || null

  // Video playback
  const videoRef = useRef(null)
  const containerRef = useRef(null)
  const [playing, setPlaying] = useState(false)
  const [currentTime, setCurrentTime] = useState(0)
  const [duration, setDuration] = useState(0)
  const progress = duration ? (currentTime / duration) * 100 : 0

  const formatTime = (s) => `0:${String(Math.floor(s)).padStart(2, '0')}`

  const togglePlay = () => {
    const v = videoRef.current
    if (!v) return
    if (playing) { v.pause() } else { v.play() }
    setPlaying(!playing)
  }

  const stepBack = () => {
    if (videoRef.current) videoRef.current.currentTime = Math.max(0, videoRef.current.currentTime - 1)
  }
  const stepForward = () => {
    if (videoRef.current) videoRef.current.currentTime = Math.min(videoRef.current.duration || 0, videoRef.current.currentTime + 1)
  }

  const handleTimeUpdate = () => {
    const v = videoRef.current
    if (!v) return
    setCurrentTime(v.currentTime)
  }

  const handleSeek = (e) => {
    const v = videoRef.current
    if (!v || !v.duration) return
    const rect = e.currentTarget.getBoundingClientRect()
    const ratio = (e.clientX - rect.left) / rect.width
    v.currentTime = ratio * v.duration
  }

  // Marker position as % of container
  const [markerPos, setMarkerPos] = useState({ x: 50, y: 40 })
  const [dragging, setDragging] = useState(false)

  const getRelativePos = useCallback((clientX, clientY) => {
    const rect = containerRef.current?.getBoundingClientRect()
    if (!rect) return null
    const x = Math.max(0, Math.min(100, ((clientX - rect.left) / rect.width) * 100))
    const y = Math.max(0, Math.min(100, ((clientY - rect.top) / rect.height) * 100))
    return { x, y }
  }, [])

  const onMouseDown = (e) => { e.preventDefault(); e.stopPropagation(); setDragging(true) }
  const onMouseMove = useCallback((e) => {
    if (!dragging) return
    const pos = getRelativePos(e.clientX, e.clientY)
    if (pos) setMarkerPos(pos)
  }, [dragging, getRelativePos])
  const onMouseUp = () => setDragging(false)

  const onTouchStart = (e) => { e.preventDefault(); e.stopPropagation(); setDragging(true) }
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
      <div className="sticky top-0 z-10 bg-white flex items-center justify-between px-5 pt-14 pb-4 border-b border-[#f0f0f0] flex-shrink-0">
        <button
          onClick={() => navigate('/upload/select-mode', { state: { thumb, video } })}
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
          Ball Trace
        </p>
        <button
          onClick={() => navigate('/upload/processing', { state: { mode: 'ball-tracer', video, thumb } })}
          className="text-[15px] font-semibold text-[#248a3d]"
          style={{ fontFamily: '-apple-system, "SF Pro Text", system-ui, sans-serif' }}
        >
          Done ›
        </button>
      </div>

      <div className="flex-1 flex flex-col px-5 pt-4">

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
          ref={containerRef}
          className="relative rounded-2xl overflow-hidden w-full"
          style={{ aspectRatio: '9/16', touchAction: 'none' }}
        >
          {video ? (
            <video
              ref={videoRef}
              src={video}
              poster={thumb || undefined}
              className="w-full h-full object-cover"
              playsInline
              preload="auto"
              onTimeUpdate={handleTimeUpdate}
              onLoadedMetadata={() => {
                const v = videoRef.current
                if (!v) return
                setDuration(v.duration || 0)
                v.currentTime = 0.01
              }}
              onEnded={() => setPlaying(false)}
            />
          ) : (
            <div className="w-full h-full bg-[#1c1c1e] flex items-center justify-center">
              <p className="text-white/40 text-[13px]">No video selected</p>
            </div>
          )}
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
            <div className="relative">
              <div
                className="w-9 h-9 rounded-full border-[3px] flex items-center justify-center"
                style={{
                  borderColor: dragging ? '#ff3b30' : 'white',
                  backgroundColor: dragging ? 'rgba(255,59,48,0.2)' : 'rgba(255,255,255,0.2)',
                  boxShadow: '0 0 0 1px rgba(0,0,0,0.3)',
                }}
              >
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
            {formatTime(currentTime)}
          </span>
          <div className="flex-1 h-1 bg-[#e5e5ea] rounded-full cursor-pointer" onClick={handleSeek}>
            <div className="h-1 bg-[#248a3d] rounded-full relative pointer-events-none" style={{ width: `${progress}%` }}>
              <div className="absolute right-0 top-1/2 -translate-y-1/2 w-3.5 h-3.5 bg-[#248a3d] rounded-full -mr-1.5 shadow" />
            </div>
          </div>
          <span
            className="text-[12px] text-[rgba(60,60,67,0.5)] w-8 flex-shrink-0"
            style={{ fontFamily: '-apple-system, "SF Pro Text", system-ui, sans-serif' }}
          >
            {formatTime(duration)}
          </span>
        </div>

        {/* Playback controls */}
        <div className="flex items-center justify-center gap-8 mt-4 mb-6">
          <button onClick={stepBack} className="w-10 h-10 flex items-center justify-center active:opacity-60">
            <svg width="28" height="28" viewBox="0 0 28 28" fill="none">
              <path d="M22 22L10 14L22 6V22Z" fill="#248a3d" />
              <rect x="5" y="5" width="3.5" height="18" rx="1.5" fill="#248a3d" />
            </svg>
          </button>
          <button
            onClick={togglePlay}
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

      </div>
    </div>
  )
}

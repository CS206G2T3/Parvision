import { useState, useRef, useEffect } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'

export default function NameSwingPage() {
  const navigate = useNavigate()
  const { state } = useLocation()
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')

  const resultVideo = state?.resultVideo || null
  const thumb = state?.thumb || null
  const mode = state?.mode || 'swing-analyser'

  const videoRef = useRef(null)
  const [playing, setPlaying] = useState(false)
  const [progress, setProgress] = useState(0)
  const [currentTime, setCurrentTime] = useState(0)
  const [duration, setDuration] = useState(0)

  const formatTime = (s) => {
    const m = Math.floor(s / 60)
    const sec = Math.floor(s % 60)
    return `${m}:${sec.toString().padStart(2, '0')}`
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

  const stepBack = () => {
    if (videoRef.current) videoRef.current.currentTime = Math.max(0, videoRef.current.currentTime - 1)
  }
  const stepForward = () => {
    if (videoRef.current) videoRef.current.currentTime = Math.min(videoRef.current.duration || 0, videoRef.current.currentTime + 1)
  }

  const handleSave = () => {
    if (!title.trim()) return
    const history = JSON.parse(localStorage.getItem('parvision_upload_history') || '[]')
    const entry = {
      id: Date.now().toString(),
      title: title.trim(),
      description: description.trim(),
      mode,
      resultVideo,
      thumb,
      date: new Date().toISOString(),
    }
    history.unshift(entry)
    localStorage.setItem('parvision_upload_history', JSON.stringify(history))
    navigate('/upload')
  }

  return (
    <div className="relative w-full bg-[#f4f4f4] flex flex-col min-h-[852px]">

      {/* Header */}
      <div className="flex items-center justify-between px-5 pt-14 pb-3 bg-white border-b border-[#f0f0f0] flex-shrink-0">
        <button onClick={() => navigate(-1)} className="flex items-center gap-1">
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
          Results
        </p>
        <button
          onClick={handleSave}
          disabled={!title.trim()}
          className={`text-[15px] font-semibold ${title.trim() ? 'text-[#248a3d]' : 'text-[rgba(36,138,61,0.35)]'}`}
          style={{ fontFamily: '-apple-system, "SF Pro Text", system-ui, sans-serif' }}
        >
          Done ›
        </button>
      </div>

      <div className="flex-1 overflow-y-auto pb-8">

        {/* Video player */}
        {resultVideo ? (
          <div className="mx-5 mt-4">
            <div className="relative rounded-2xl overflow-hidden bg-black" style={{ aspectRatio: '9/16' }}>
              <video
                ref={videoRef}
                src={resultVideo}
                className="w-full h-full object-contain"
                onTimeUpdate={handleTimeUpdate}
                onLoadedMetadata={() => {
                const v = videoRef.current
                if (!v) return
                setDuration(v.duration || 0)
                v.currentTime = 0.01
              }}
                onEnded={() => setPlaying(false)}
                playsInline
              />
            </div>

            {/* Progress bar */}
            <div className="mt-3 flex items-center gap-2">
              <span className="text-[12px] text-[rgba(60,60,67,0.5)] w-8 text-right flex-shrink-0">{formatTime(currentTime)}</span>
              <div className="flex-1 h-1 bg-[#e5e5ea] rounded-full cursor-pointer" onClick={handleSeek}>
                <div className="h-1 bg-[#248a3d] rounded-full relative pointer-events-none" style={{ width: `${progress}%` }}>
                  <div className="absolute right-0 top-1/2 -translate-y-1/2 w-3.5 h-3.5 bg-[#248a3d] rounded-full -mr-1.5 shadow" />
                </div>
              </div>
              <span className="text-[12px] text-[rgba(60,60,67,0.5)] w-8 flex-shrink-0">{formatTime(duration)}</span>
            </div>

            {/* Playback controls */}
            <div className="flex items-center justify-center gap-8 mt-3">
              <button onClick={stepBack} className="w-10 h-10 flex items-center justify-center active:opacity-60">
                <svg width="26" height="26" viewBox="0 0 26 26" fill="none">
                  <path d="M20 20L9 13L20 6V20Z" fill="#248a3d" />
                  <rect x="4" y="5" width="3" height="16" rx="1.5" fill="#248a3d" />
                </svg>
              </button>
              <button onClick={togglePlay}
                className="w-[52px] h-[52px] bg-[#248a3d] rounded-full flex items-center justify-center shadow-md active:opacity-80">
                {playing ? (
                  <svg width="18" height="18" viewBox="0 0 18 18" fill="white">
                    <rect x="3" y="2" width="4" height="14" rx="1.5" /><rect x="11" y="2" width="4" height="14" rx="1.5" />
                  </svg>
                ) : (
                  <svg width="18" height="18" viewBox="0 0 18 18" fill="white">
                    <path d="M4 2L15 9L4 16V2Z" />
                  </svg>
                )}
              </button>
              <button onClick={stepForward} className="w-10 h-10 flex items-center justify-center active:opacity-60">
                <svg width="26" height="26" viewBox="0 0 26 26" fill="none">
                  <path d="M6 20L17 13L6 6V20Z" fill="#248a3d" />
                  <rect x="19" y="5" width="3" height="16" rx="1.5" fill="#248a3d" />
                </svg>
              </button>
            </div>
          </div>
        ) : thumb ? (
          <div className="mx-5 mt-4 rounded-2xl overflow-hidden h-[220px]">
            <img src={thumb} alt="Swing" className="w-full h-full object-cover" />
          </div>
        ) : null}

        {/* Name Your Swing form */}
        <div className="mx-5 mt-5 bg-white rounded-2xl border border-[#f0f0f0] px-5 py-5"
          style={{ boxShadow: '0 1px 6px rgba(0,0,0,0.06)' }}>

          <p
            className="text-[13px] font-bold text-[rgba(60,60,67,0.5)] uppercase tracking-[1px] mb-4"
            style={{ fontFamily: '-apple-system, "SF Pro Display", system-ui, sans-serif' }}
          >
            Name Your Swing
          </p>

          <div className="mb-4">
            <label
              className="text-[13px] font-medium text-[rgba(60,60,67,0.6)] mb-1.5 block"
              style={{ fontFamily: '-apple-system, "SF Pro Text", system-ui, sans-serif' }}
            >
              Title
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. Chill Range Sess"
              className="w-full h-[44px] border border-[#e5e5ea] rounded-xl px-3 text-[15px] text-[#1c1c1e] placeholder-[rgba(60,60,67,0.35)] focus:outline-none focus:border-[#248a3d]"
              style={{ fontFamily: '-apple-system, "SF Pro Text", system-ui, sans-serif' }}
            />
          </div>

          <div>
            <label
              className="text-[13px] font-medium text-[rgba(60,60,67,0.6)] mb-1.5 block"
              style={{ fontFamily: '-apple-system, "SF Pro Text", system-ui, sans-serif' }}
            >
              Description
            </label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Add a note about this session..."
              rows={4}
              className="w-full border border-[#e5e5ea] rounded-xl px-3 py-2.5 text-[15px] text-[#1c1c1e] placeholder-[rgba(60,60,67,0.35)] focus:outline-none focus:border-[#248a3d] resize-none leading-[22px]"
              style={{ fontFamily: '-apple-system, "SF Pro Text", system-ui, sans-serif' }}
            />
          </div>
        </div>


      </div>
    </div>
  )
}

import { useState, useRef, useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom'

function formatDate(iso) {
  return new Date(iso).toLocaleDateString('en-US', {
    weekday: 'long', month: 'long', day: 'numeric', year: 'numeric',
  })
}

export default function SwingHistoryDetailPage() {
  const navigate = useNavigate()
  const { id } = useParams()
  const [entry, setEntry] = useState(null)
  const [showDelete, setShowDelete] = useState(false)
  const [toast, setToast] = useState('')

  const videoRef = useRef(null)
  const [playing, setPlaying] = useState(false)
  const [progress, setProgress] = useState(0)
  const [currentTime, setCurrentTime] = useState(0)
  const [duration, setDuration] = useState(0)

  useEffect(() => {
    const history = JSON.parse(localStorage.getItem('parvision_upload_history') || '[]')
    const found = history.find((h) => h.id === id)
    setEntry(found || null)
  }, [id])

  const showToast = (msg) => { setToast(msg); setTimeout(() => setToast(''), 2200) }

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

  const handleDelete = () => {
    const history = JSON.parse(localStorage.getItem('parvision_upload_history') || '[]')
    const updated = history.filter((h) => h.id !== id)
    localStorage.setItem('parvision_upload_history', JSON.stringify(updated))
    navigate('/upload/history')
  }

  const handleShare = () => {
    if (!entry) return
    navigate('/community', {
      state: {
        draft: {
          type: entry.mode,
          caption: `${entry.title} — ${entry.description || 'Check out my swing!'} 🏌️`,
          tag: entry.mode === 'ball-tracer' ? 'Ball Tracer' : 'Swing Analyzer',
        },
      },
    })
  }

  if (!entry) {
    return (
      <div className="relative w-full bg-white flex flex-col min-h-[852px] items-center justify-center">
        <p className="text-[16px] text-[rgba(60,60,67,0.5)]">Swing not found</p>
        <button onClick={() => navigate('/upload/history')} className="mt-4 text-[#248a3d] text-[15px] font-semibold">
          Back to History
        </button>
      </div>
    )
  }

  return (
    <div className="relative w-full bg-[#f4f4f4] flex flex-col min-h-[852px]">

      {/* Header */}
      <div className="flex items-center justify-between px-5 pt-14 pb-3 bg-white border-b border-[#f0f0f0] flex-shrink-0">
        <button onClick={() => navigate('/upload/history')} className="flex items-center gap-1">
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
          My Swing
        </p>
        <button
          onClick={() => setShowDelete(true)}
          className="w-8 h-8 flex items-center justify-center"
        >
          <svg width="4" height="18" viewBox="0 0 4 18" fill="none">
            <circle cx="2" cy="2" r="1.5" fill="rgba(60,60,67,0.5)" />
            <circle cx="2" cy="9" r="1.5" fill="rgba(60,60,67,0.5)" />
            <circle cx="2" cy="16" r="1.5" fill="rgba(60,60,67,0.5)" />
          </svg>
        </button>
      </div>

      <div className="flex-1 overflow-y-auto pb-28">

        {/* Video player */}
        {entry.resultVideo ? (
          <div className="mx-5 mt-4">
            <div className="relative rounded-2xl overflow-hidden bg-black" style={{ aspectRatio: '9/16' }}>
              <video
                ref={videoRef}
                src={entry.resultVideo}
                className="w-full h-full object-contain"
                onTimeUpdate={handleTimeUpdate}
                onLoadedMetadata={() => setDuration(videoRef.current?.duration || 0)}
                onEnded={() => setPlaying(false)}
                playsInline
              />
              {/* Tap to play overlay when paused */}
              {!playing && (
                <button
                  onClick={togglePlay}
                  className="absolute inset-0 flex items-center justify-center"
                >
                  <div className="w-16 h-16 bg-black/40 rounded-full flex items-center justify-center backdrop-blur-sm">
                    <svg width="22" height="22" viewBox="0 0 18 18" fill="white">
                      <path d="M4 2L15 9L4 16V2Z" />
                    </svg>
                  </div>
                </button>
              )}
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
        ) : entry.thumb ? (
          <div className="mx-5 mt-4 rounded-2xl overflow-hidden h-[220px]">
            <img src={entry.thumb} alt={entry.title} className="w-full h-full object-cover" />
          </div>
        ) : null}

        {/* Info card */}
        <div className="mx-5 mt-5 bg-white rounded-2xl border border-[#f0f0f0] px-5 py-5"
          style={{ boxShadow: '0 1px 6px rgba(0,0,0,0.06)' }}>

          <div className="flex items-start justify-between gap-2 mb-2">
            <h2
              className="text-[20px] font-bold text-[#1c1c1e] leading-[24px]"
              style={{ fontFamily: '-apple-system, "SF Pro Display", system-ui, sans-serif' }}
            >
              {entry.title}
            </h2>
            <span className="text-[11px] font-medium text-[rgba(60,60,67,0.6)] border border-[#e0e0e0] rounded-full px-2 py-0.5 flex-shrink-0 mt-1">
              ↗ {entry.mode === 'ball-tracer' ? 'Ball Tracer' : 'Swing Analyser'}
            </span>
          </div>

          <p
            className="text-[12px] text-[rgba(60,60,67,0.45)] mb-3"
            style={{ fontFamily: '-apple-system, "SF Pro Text", system-ui, sans-serif' }}
          >
            {formatDate(entry.date)}
          </p>

          {entry.description ? (
            <p
              className="text-[14px] text-[rgba(60,60,67,0.75)] leading-[21px]"
              style={{ fontFamily: '-apple-system, "SF Pro Text", system-ui, sans-serif' }}
            >
              {entry.description}
            </p>
          ) : (
            <p
              className="text-[14px] text-[rgba(60,60,67,0.35)] italic leading-[21px]"
              style={{ fontFamily: '-apple-system, "SF Pro Text", system-ui, sans-serif' }}
            >
              No description added
            </p>
          )}
        </div>

      </div>

      {/* Sticky action buttons */}
      <div className="flex-shrink-0 px-5 pt-3 pb-6 bg-white border-t border-[#f0f0f0] flex gap-3">
        <button
          onClick={handleShare}
          className="flex-1 flex items-center justify-center gap-2 h-[48px] bg-[#248a3d] rounded-2xl active:opacity-80"
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
            <circle cx="18" cy="5" r="3" stroke="white" strokeWidth="2" />
            <circle cx="6" cy="12" r="3" stroke="white" strokeWidth="2" />
            <circle cx="18" cy="19" r="3" stroke="white" strokeWidth="2" />
            <path d="M8.59 13.51l6.83 3.98M15.41 6.51l-6.82 3.98" stroke="white" strokeWidth="2" strokeLinecap="round" />
          </svg>
          <span className="text-white text-[14px] font-semibold"
            style={{ fontFamily: '-apple-system, "SF Pro Text", system-ui, sans-serif' }}>
            Share
          </span>
        </button>
        <button
          onClick={() => showToast('Saved to device')}
          className="flex-1 flex items-center justify-center gap-2 h-[48px] bg-[#f4f4f4] rounded-2xl active:opacity-80"
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
            <path d="M12 3V15M8 11L12 15L16 11M4 17V20H20V17" stroke="#1c1c1e" strokeWidth="2" strokeLinecap="round" />
          </svg>
          <span className="text-[#1c1c1e] text-[14px] font-semibold"
            style={{ fontFamily: '-apple-system, "SF Pro Text", system-ui, sans-serif' }}>
            Download
          </span>
        </button>
      </div>

      {toast && (
        <div className="absolute bottom-24 left-1/2 -translate-x-1/2 bg-[#1c1c1e] text-white text-[13px] font-medium px-4 py-2 rounded-full shadow-lg pointer-events-none whitespace-nowrap">
          {toast}
        </div>
      )}

      {/* Delete confirmation sheet */}
      {showDelete && (
        <div className="phone-overlay z-50 flex flex-col justify-end">
          <div className="absolute inset-0 bg-black/40" onClick={() => setShowDelete(false)} />
          <div className="relative bg-white rounded-t-3xl px-5 pt-5 pb-10">
            <div className="w-10 h-1 bg-[#c7c7cc] rounded-full mx-auto mb-5" />
            <p
              className="text-[17px] font-bold text-[#1c1c1e] text-center mb-1"
              style={{ fontFamily: '-apple-system, "SF Pro Display", system-ui, sans-serif' }}
            >
              Delete Swing?
            </p>
            <p
              className="text-[14px] text-[rgba(60,60,67,0.55)] text-center mb-6 leading-[20px]"
              style={{ fontFamily: '-apple-system, "SF Pro Text", system-ui, sans-serif' }}
            >
              "{entry.title}" will be permanently removed from your history.
            </p>
            <button
              onClick={handleDelete}
              className="w-full h-[52px] bg-[#ff3b30] rounded-2xl flex items-center justify-center mb-3 active:opacity-80"
            >
              <span className="text-white text-[17px] font-bold"
                style={{ fontFamily: '-apple-system, "SF Pro Display", system-ui, sans-serif' }}>
                Delete
              </span>
            </button>
            <button
              onClick={() => setShowDelete(false)}
              className="w-full h-[52px] bg-[#f4f4f4] rounded-2xl flex items-center justify-center active:opacity-80"
            >
              <span className="text-[#1c1c1e] text-[17px] font-semibold"
                style={{ fontFamily: '-apple-system, "SF Pro Display", system-ui, sans-serif' }}>
                Cancel
              </span>
            </button>
          </div>
        </div>
      )}
    </div>
  )
}

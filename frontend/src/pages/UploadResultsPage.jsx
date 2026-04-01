import { useState, useRef, useEffect } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import balltraceImg from '../assets/balltrace.png'
import balltraceVideo from '../assets/balltrace.mp4'
import warmupImg from '../assets/warmup.jpeg'
import { loadPosts, savePosts } from '../data/communityPosts'

const MY_COMMUNITIES = [
  { id: 1, name: 'Singapore\nGolfers', abbr: 'SG', color: '#248a3d' },
  { id: 2, name: 'Scratch\nClub',      abbr: 'SC', color: '#409cff' },
  { id: 3, name: 'Beginners\nCorner',  abbr: 'BC', color: '#f97316' },
  { id: 4, name: 'Weekend\nWarriors',  abbr: 'WW', color: '#a855f7' },
]

const AVAILABLE_TAGS = ['Ball Tracer', 'Swing Analyzer', 'Warmup', 'Course Review', 'Tips & Tricks', 'Gear Talk']

function ShareModal({ draft, videoSrc, onClose }) {
  const [caption, setCaption] = useState(draft.caption)
  const [selectedCommunity, setSelectedCommunity] = useState(MY_COMMUNITIES[0])
  const [selectedTags, setSelectedTags] = useState(draft.tag ? [draft.tag] : [])
  const [posted, setPosted] = useState(false)

  const toggleTag = (tag) => setSelectedTags((prev) => prev.includes(tag) ? [] : [tag])

  const handlePost = () => {
    if (!caption.trim()) return
    const newPost = {
      id: Date.now(),
      community: selectedCommunity.name.replace('\n', ' '),
      communityColor: selectedCommunity.color,
      communityAbbr: selectedCommunity.abbr,
      user: 'Jared Mango',
      avatarColor: '#409cff',
      avatarLetter: 'J',
      time: 'just now',
      body: caption.trim(),
      likes: 0,
      comments: 0,
      img: null,
      video: videoSrc,
      tags: selectedTags,
    }
    savePosts([newPost, ...loadPosts()])
    setPosted(true)
    setTimeout(() => onClose(), 1800)
  }

  return (
    <div className="phone-overlay flex flex-col" style={{ background: 'rgba(0,0,0,0.55)', zIndex: 40 }}>
      {posted ? (
        /* ── Success state ── */
        <div className="mx-4 mt-14 bg-white rounded-3xl flex flex-col items-center py-14 px-6"
          style={{ boxShadow: '0 8px 40px rgba(0,0,0,0.18)' }}>
          <div className="w-16 h-16 rounded-full bg-[#248a3d] flex items-center justify-center mb-5"
            style={{ boxShadow: '0 4px 20px rgba(36,138,61,0.35)' }}>
            <svg width="28" height="22" viewBox="0 0 28 22" fill="none">
              <path d="M2 11L10 19L26 3" stroke="white" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </div>
          <p className="text-[22px] font-bold text-[#1c1c1e] mb-1"
            style={{ fontFamily: '-apple-system, "SF Pro Display", system-ui, sans-serif' }}>
            Posted!
          </p>
          <p className="text-[14px] text-[rgba(60,60,67,0.5)] text-center"
            style={{ fontFamily: '-apple-system, "SF Pro Text", system-ui, sans-serif' }}>
            Your swing is live in the community
          </p>
        </div>
      ) : (
        /* ── Compose state ── */
        <div className="mx-4 mt-14 bg-white rounded-3xl overflow-hidden"
          style={{ boxShadow: '0 8px 40px rgba(0,0,0,0.18)' }}>

          {/* Header */}
          <div className="flex items-center justify-between px-4 pt-4 pb-3 border-b border-[#f0f0f0]">
            <button onClick={onClose}
              className="text-[15px] text-[rgba(60,60,67,0.5)]"
              style={{ fontFamily: '-apple-system, "SF Pro Text", system-ui, sans-serif' }}>
              Cancel
            </button>
            <p className="text-[16px] font-bold text-[#1c1c1e]"
              style={{ fontFamily: '-apple-system, "SF Pro Display", system-ui, sans-serif' }}>
              New Post
            </p>
            <button
              onClick={handlePost}
              disabled={!caption.trim()}
              className="px-4 py-1.5 rounded-full text-[14px] font-semibold bg-[#248a3d] text-white disabled:opacity-40 transition-all"
              style={{ fontFamily: '-apple-system, "SF Pro Text", system-ui, sans-serif' }}>
              Post
            </button>
          </div>

          {/* Author + caption */}
          <div className="flex gap-3 px-4 pt-4 pb-3">
            <div className="w-9 h-9 rounded-full bg-[#409cff] flex items-center justify-center text-white text-[14px] font-bold flex-shrink-0">J</div>
            <div className="flex-1">
              <p className="text-[13px] font-semibold text-[#1c1c1e] mb-1"
                style={{ fontFamily: '-apple-system, "SF Pro Text", system-ui, sans-serif' }}>
                Jared Mango
              </p>
              <textarea
                value={caption}
                onChange={(e) => setCaption(e.target.value)}
                rows={2}
                placeholder="What's on your mind?"
                className="w-full text-[14px] text-[#1c1c1e] placeholder-[rgba(60,60,67,0.35)] resize-none focus:outline-none leading-[20px]"
                style={{ fontFamily: '-apple-system, "SF Pro Text", system-ui, sans-serif' }}
              />
            </div>
          </div>

          {/* Video preview */}
          <div className="mx-4 mb-3 flex gap-3 items-center bg-[#f4f4f4] rounded-2xl p-2.5">
            <div className="rounded-xl overflow-hidden bg-black flex-shrink-0" style={{ width: 48, aspectRatio: '9/16' }}>
              <video src={videoSrc} className="w-full h-full object-cover" muted playsInline autoPlay loop />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-[13px] font-semibold text-[#1c1c1e] truncate"
                style={{ fontFamily: '-apple-system, "SF Pro Text", system-ui, sans-serif' }}>
                {draft.type === 'ball-tracer' ? 'Ball Trace Video' : 'Swing Analysis Video'}
              </p>
              <p className="text-[11px] text-[rgba(60,60,67,0.45)]">Tap to preview</p>
            </div>
            {selectedTags.length > 0 && (
              <div className="flex flex-wrap gap-1 flex-shrink-0">
                {selectedTags.map((t) => (
                  <span key={t} className="text-[11px] font-semibold bg-[#e5f8e9] text-[#248a3d] px-2.5 py-1 rounded-full">{t}</span>
                ))}
              </div>
            )}
          </div>

          {/* Tags */}
          <div className="px-4 pb-3">
            <p className="text-[11px] font-semibold uppercase tracking-[0.5px] text-[rgba(60,60,67,0.4)] mb-2"
              style={{ fontFamily: '-apple-system, "SF Pro Text", system-ui, sans-serif' }}>
              Tags
            </p>
            <div className="flex flex-wrap gap-2">
              {AVAILABLE_TAGS.map((tag) => (
                <button key={tag} onClick={() => toggleTag(tag)}
                  className="px-3 py-1.5 rounded-full text-[12px] font-semibold transition-all"
                  style={{
                    backgroundColor: selectedTags.includes(tag) ? '#248a3d' : '#f4f4f4',
                    color: selectedTags.includes(tag) ? 'white' : '#1c1c1e',
                    fontFamily: '-apple-system, "SF Pro Text", system-ui, sans-serif',
                  }}>
                  {tag}
                </button>
              ))}
            </div>
          </div>

          {/* Post to community */}
          <div className="px-4 pb-4 border-t border-[#f0f0f0] pt-3">
            <p className="text-[11px] font-semibold uppercase tracking-[0.5px] text-[rgba(60,60,67,0.4)] mb-2"
              style={{ fontFamily: '-apple-system, "SF Pro Text", system-ui, sans-serif' }}>
              Post to
            </p>
            <div className="flex gap-2 overflow-x-auto no-scrollbar">
              {MY_COMMUNITIES.map((c) => (
                <button key={c.id} onClick={() => setSelectedCommunity(c)}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[12px] font-semibold flex-shrink-0 transition-all"
                  style={{
                    backgroundColor: selectedCommunity.id === c.id ? c.color : '#f4f4f4',
                    color: selectedCommunity.id === c.id ? 'white' : '#1c1c1e',
                    fontFamily: '-apple-system, "SF Pro Text", system-ui, sans-serif',
                  }}>
                  {c.name.replace('\n', ' ')}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

/* ── Swing Analyser data ── */
const SWING_DATA = {
  v1: {
    items: [
      { id: 1, good: false, title: 'C-Posture (Rounded Back)', detail: 'Upper back and shoulders are overly rounded at address. This restricts the ability to rotate properly during the backswing, leading to inconsistent strikes. Aim for a straight back.' },
      { id: 2, good: false, title: 'Disconnected Arms', detail: 'Arms are too far from body. Try letting the arms hang naturally straight down from the shoulders for fewer "heel" or "shank" shots.' },
      { id: 3, good: false, title: 'Excessive Knee Flex', detail: 'Knees are bent at 25° which is too much. This position makes it difficult to rotate the hips properly and often leads to an inefficient, "arms-only" swing. Aim for a bend of 15° to 20°.' },
      { id: 4, good: true,  title: 'Straight Left Arm', detail: 'Good job keeping the left arm straight as it acts as a fixed radius for the swing arc!' },
      { id: 5, good: true,  title: 'Stable Lower Body', detail: 'Hips stay relatively quiet on the backswing, storing rotational energy effectively.' },
      { id: 6, good: true,  title: 'Head Position', detail: 'Head remains behind the ball at impact — great for solid contact.' },
    ],
    drill: { title: 'Dynamic Warm Up', duration: '15 Minutes', points: ['Prevents Injury', 'Improves Flexibility', 'Activates Rotation'] },
  },
  v2: {
    items: [
      { id: 1, good: false, title: 'Early Extension', detail: 'Hips are thrusting toward the ball during the downswing. This forces the arms to reroute and causes inconsistent strikes — focus on maintaining your spine angle through impact.' },
      { id: 2, good: false, title: 'Over-the-Top Swing Path', detail: 'Club is coming over the plane on the downswing, promoting a pull or slice. Work on dropping the club into the slot from the inside.' },
      { id: 3, good: false, title: 'Cupped Lead Wrist', detail: 'Lead wrist is slightly cupped at the top of the backswing, opening the clubface. Aim for a flatter or bowed wrist for more control.' },
      { id: 4, good: false, title: 'Narrow Stance', detail: 'Stance width is slightly narrower than ideal for a full swing, reducing base stability. Widen your feet to roughly shoulder-width for better balance.' },
      { id: 5, good: true,  title: 'Good Tempo', detail: 'Backswing-to-downswing ratio is close to the ideal 3:1, producing smooth, repeatable timing.' },
      { id: 6, good: true,  title: 'Proper Weight Shift', detail: 'Weight transfers well onto the lead foot through impact, generating power effectively.' },
      { id: 7, good: true,  title: 'Square Clubface at Address', detail: 'Clubface is well-aligned to the target line at setup, reducing the risk of offline shots.' },
    ],
    drill: { title: 'Hip Rotation Drill', duration: '10 Minutes', points: ['Fixes Early Extension', 'Trains Proper Sequencing', 'Builds Core Stability'] },
  },
}

/* ── Feedback item (inline, no expand) ── */
function FeedbackItem({ good, title, detail }) {
  return (
    <div className="py-3.5 border-b border-[#f0f0f0] last:border-0 flex gap-3">
      <div className={`w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5 ${good ? 'bg-[#248a3d]' : 'bg-[#ff3b30]'}`}>
        {good ? (
          <svg width="12" height="10" viewBox="0 0 12 10" fill="none">
            <path d="M1.5 5L4.5 8L10.5 1.5" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        ) : (
          <svg width="10" height="10" viewBox="0 0 10 10" fill="none">
            <path d="M2.5 2.5L7.5 7.5M7.5 2.5L2.5 7.5" stroke="white" strokeWidth="2" strokeLinecap="round" />
          </svg>
        )}
      </div>
      <div className="flex-1 min-w-0">
        <p
          className="text-[14px] font-bold text-[#1c1c1e] leading-[19px]"
          style={{ fontFamily: '-apple-system, "SF Pro Text", system-ui, sans-serif' }}
        >
          {title}
        </p>
        <p
          className="text-[13px] text-[rgba(60,60,67,0.65)] leading-[18px] mt-0.5"
          style={{ fontFamily: '-apple-system, "SF Pro Text", system-ui, sans-serif' }}
        >
          {detail}
        </p>
      </div>
    </div>
  )
}

/* ── Ball Tracer results ── */
function BallTracerResults({ onShare }) {
  const [playing, setPlaying] = useState(false)
  const [toast, setToast] = useState('')
  const showToast = (msg) => { setToast(msg); setTimeout(() => setToast(''), 2000) }
  const [progress, setProgress] = useState(0)
  const [duration, setDuration] = useState(0)
  const [currentTime, setCurrentTime] = useState(0)
  const videoRef = useRef(null)

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

  return (
    <div className="flex-1 overflow-y-auto pb-8">
      {/* Video */}
      <div className="relative mx-5 mt-4 rounded-2xl overflow-hidden bg-black" style={{ aspectRatio: '9/16' }}>
        <video
          ref={videoRef}
          src={balltraceVideo}
          className="w-full h-full object-contain"
          onTimeUpdate={handleTimeUpdate}
          onLoadedMetadata={() => {
            const v = videoRef.current
            if (!v) return
            setDuration(v.duration || 0)
            v.play().then(() => setPlaying(true)).catch(() => {})
          }}
          onEnded={() => setPlaying(false)}
          autoPlay
          muted
          playsInline
        />
      </div>

      {/* Progress bar */}
      <div className="mx-5 mt-3 flex items-center gap-2">
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
        <button onClick={stepBack} className="w-10 h-10 flex items-center justify-center">
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
        <button onClick={stepForward} className="w-10 h-10 flex items-center justify-center">
          <svg width="26" height="26" viewBox="0 0 26 26" fill="none">
            <path d="M6 20L17 13L6 6V20Z" fill="#248a3d" />
            <rect x="19" y="5" width="3" height="16" rx="1.5" fill="#248a3d" />
          </svg>
        </button>
      </div>

      {/* Action buttons */}
      <div className="mx-5 mt-6 flex gap-3">
        <button
          onClick={() => onShare({ type: 'ball-tracer', caption: 'Check out my ball trace! 🏌️ #BallTracer', tag: 'Ball Tracer' })}
          className="flex-1 flex items-center justify-center gap-2 h-[48px] bg-[#248a3d] rounded-2xl active:opacity-80"
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
            <circle cx="18" cy="5" r="3" stroke="white" strokeWidth="2" />
            <circle cx="6" cy="12" r="3" stroke="white" strokeWidth="2" />
            <circle cx="18" cy="19" r="3" stroke="white" strokeWidth="2" />
            <path d="M8.59 13.51l6.83 3.98M15.41 6.51l-6.82 3.98" stroke="white" strokeWidth="2" strokeLinecap="round" />
          </svg>
          <span className="text-white text-[14px] font-semibold"
            style={{ fontFamily: '-apple-system, "SF Pro Text", system-ui, sans-serif' }}>Share</span>
        </button>
        <button onClick={() => showToast('Saved to device')} className="flex-1 flex items-center justify-center gap-2 h-[48px] bg-[#f4f4f4] rounded-2xl active:opacity-80">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
            <path d="M12 3V15M8 11L12 15L16 11M4 17V20H20V17" stroke="#1c1c1e" strokeWidth="2" strokeLinecap="round" />
          </svg>
          <span className="text-[#1c1c1e] text-[14px] font-semibold"
            style={{ fontFamily: '-apple-system, "SF Pro Text", system-ui, sans-serif' }}>Download</span>
        </button>
      </div>
      {toast && (
        <div className="mx-5 mt-3 bg-[#1c1c1e] text-white text-[13px] font-medium px-4 py-2 rounded-full text-center pointer-events-none">
          {toast}
        </div>
      )}
    </div>
  )
}

/* ── Swing Analyser results ── */
function SwingAnalyserResults({ videoSrc, onShare }) {
  const data = videoSrc?.includes('Bodyanalysed2') ? SWING_DATA.v2 : SWING_DATA.v1
  const SUGGESTED_DRILL = data.drill
  const [playing, setPlaying] = useState(false)
  const [progress, setProgress] = useState(0)
  const [currentTime, setCurrentTime] = useState(0)
  const [duration, setDuration] = useState(0)
  const [toast, setToast] = useState('')
  const videoRef = useRef(null)

  useEffect(() => {
    const v = videoRef.current
    if (v) { v.play().then(() => setPlaying(true)).catch(() => {}) }
  }, [])

  const showToast = (msg) => { setToast(msg); setTimeout(() => setToast(''), 2000) }
  const formatTime = (s) => `0:${String(Math.floor(s)).padStart(2, '0')}`

  const togglePlay = () => {
    const v = videoRef.current
    if (!v) return
    if (playing) { v.pause() } else { v.play() }
    setPlaying(!playing)
  }

  const stepBack = () => { if (videoRef.current) videoRef.current.currentTime = Math.max(0, videoRef.current.currentTime - 1) }
  const stepForward = () => { if (videoRef.current) videoRef.current.currentTime = Math.min(videoRef.current.duration || 0, videoRef.current.currentTime + 1) }

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

  const issueCount = data.items.filter(i => !i.good).length
  const goodCount = data.items.filter(i => i.good).length

  return (
    <div className="flex-1 overflow-y-auto pb-10">

      {/* Body analysis video */}
      <div className="relative mx-5 mt-4 rounded-2xl overflow-hidden bg-[#1c1c1e]" style={{ aspectRatio: '9/16' }}>
        <video
          ref={videoRef}
          src={videoSrc}
          className="w-full h-full object-contain"
          autoPlay
          muted
          playsInline
          onTimeUpdate={handleTimeUpdate}
          onLoadedMetadata={() => setDuration(videoRef.current?.duration || 0)}
          onEnded={() => setPlaying(false)}
        />
      </div>

      {/* Progress bar */}
      <div className="mx-5 mt-3 flex items-center gap-2">
        <span className="text-[12px] text-[rgba(60,60,67,0.5)] w-8 text-right flex-shrink-0">{formatTime(currentTime)}</span>
        <div className="flex-1 h-1 bg-[#e5e5ea] rounded-full cursor-pointer" onClick={handleSeek}>
          <div className="h-1 bg-[#248a3d] rounded-full relative pointer-events-none" style={{ width: `${progress}%` }}>
            <div className="absolute right-0 top-1/2 -translate-y-1/2 w-3.5 h-3.5 bg-[#248a3d] rounded-full -mr-1.5 shadow" />
          </div>
        </div>
        <span className="text-[12px] text-[rgba(60,60,67,0.5)] w-8 flex-shrink-0">{formatTime(duration)}</span>
      </div>

      {/* Playback controls */}
      <div className="flex items-center justify-center gap-8 mt-2 mb-5">
        <button onClick={stepBack} className="w-10 h-10 flex items-center justify-center active:opacity-60">
          <svg width="24" height="24" viewBox="0 0 26 26" fill="none">
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
          <svg width="24" height="24" viewBox="0 0 26 26" fill="none">
            <path d="M6 20L17 13L6 6V20Z" fill="#248a3d" />
            <rect x="19" y="5" width="3" height="16" rx="1.5" fill="#248a3d" />
          </svg>
        </button>
      </div>

      {/* Swing Feedback card */}
      <div className="mx-5 mb-5 bg-white rounded-2xl border border-[#f0f0f0] overflow-hidden"
        style={{ boxShadow: '0 1px 6px rgba(0,0,0,0.06)' }}>

        {/* Section header */}
        <div className="px-4 pt-4 pb-3 border-b border-[#f0f0f0]">
          <div className="flex items-center gap-2">
            {/* Golfer icon */}
            <div className="w-7 h-7 rounded-full bg-[#e8f5ec] flex items-center justify-center flex-shrink-0">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                <circle cx="12" cy="5" r="2.5" fill="#248a3d" />
                <path d="M8 10C8 8.9 9.3 8 12 8s4 .9 4 2v3l2 5h-2.5L14 14h-4l-1.5 4H6l2-5v-3z" fill="#248a3d" />
                <path d="M10 14v5M14 14v5" stroke="#248a3d" strokeWidth="1.5" strokeLinecap="round" />
              </svg>
            </div>
            <p
              className="text-[13px] font-bold text-[#248a3d] uppercase tracking-[1px]"
              style={{ fontFamily: '-apple-system, "SF Pro Display", system-ui, sans-serif' }}
            >
              Swing Feedback
            </p>
            {/* Score badges */}
            <div className="ml-auto flex items-center gap-1.5">
              <div className="flex items-center gap-1 bg-[#fff0f0] px-2 py-0.5 rounded-full">
                <div className="w-3.5 h-3.5 rounded-full bg-[#ff3b30] flex items-center justify-center">
                  <svg width="7" height="7" viewBox="0 0 10 10" fill="none">
                    <path d="M2.5 2.5L7.5 7.5M7.5 2.5L2.5 7.5" stroke="white" strokeWidth="1.8" strokeLinecap="round" />
                  </svg>
                </div>
                <span className="text-[11px] font-bold text-[#ff3b30]">{issueCount}</span>
              </div>
              <div className="flex items-center gap-1 bg-[#f0faf3] px-2 py-0.5 rounded-full">
                <div className="w-3.5 h-3.5 rounded-full bg-[#248a3d] flex items-center justify-center">
                  <svg width="8" height="6" viewBox="0 0 10 8" fill="none">
                    <path d="M1 4L3.5 6.5L9 1" stroke="white" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </div>
                <span className="text-[11px] font-bold text-[#248a3d]">{goodCount}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Feedback items — issues first, then good */}
        <div className="px-4">
          {[...data.items.filter(i => !i.good), ...data.items.filter(i => i.good)].map((item) => (
            <FeedbackItem key={item.id} {...item} />
          ))}
        </div>
      </div>

      {/* Suggested Drill */}
      <div className="mx-5 mb-5">
        <p
          className="text-[13px] font-bold text-[#1c1c1e] uppercase tracking-[1px] mb-2"
          style={{ fontFamily: '-apple-system, "SF Pro Display", system-ui, sans-serif' }}
        >
          Suggested Drill
        </p>
        <div className="relative rounded-2xl overflow-hidden h-[210px]">
          <img src={warmupImg} alt="Drill" className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />
          <div className="absolute bottom-0 left-0 right-0 p-4">
            <p className="text-white text-[16px] font-bold uppercase tracking-[0.5px] mb-0.5"
              style={{ fontFamily: '-apple-system, "SF Pro Display", system-ui, sans-serif' }}>
              {SUGGESTED_DRILL.title}
            </p>
            <p className="text-white/80 text-[12px] mb-2">{SUGGESTED_DRILL.duration}</p>
            <div className="flex flex-wrap gap-2">
              {SUGGESTED_DRILL.points.map((p) => (
                <div key={p} className="flex items-center gap-1">
                  <div className="w-3.5 h-3.5 rounded-full bg-[#248a3d] flex items-center justify-center flex-shrink-0">
                    <svg width="7" height="6" viewBox="0 0 7 6" fill="none">
                      <path d="M1 3L2.5 4.5L6 1.5" stroke="white" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  </div>
                  <span className="text-white text-[10px] font-medium">{p}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Action buttons */}
      <div className="mx-5 flex gap-3">
        <button
          onClick={() => onShare({ type: 'swing-analyser', caption: 'Check out my swing analysis! 🏌️ #SwingAnalyzer', tag: 'Swing Analyzer' })}
          className="flex-1 flex items-center justify-center gap-2 h-[48px] bg-[#248a3d] rounded-2xl active:opacity-80"
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
            <circle cx="18" cy="5" r="3" stroke="white" strokeWidth="2" />
            <circle cx="6" cy="12" r="3" stroke="white" strokeWidth="2" />
            <circle cx="18" cy="19" r="3" stroke="white" strokeWidth="2" />
            <path d="M8.59 13.51l6.83 3.98M15.41 6.51l-6.82 3.98" stroke="white" strokeWidth="2" strokeLinecap="round" />
          </svg>
          <span className="text-white text-[14px] font-semibold"
            style={{ fontFamily: '-apple-system, "SF Pro Text", system-ui, sans-serif' }}>Share Swing</span>
        </button>
        <button onClick={() => showToast('Saved to device')} className="flex-1 flex items-center justify-center gap-2 h-[48px] bg-[#f4f4f4] rounded-2xl active:opacity-80">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
            <path d="M12 3V15M8 11L12 15L16 11M4 17V20H20V17" stroke="#1c1c1e" strokeWidth="2" strokeLinecap="round" />
          </svg>
          <span className="text-[#1c1c1e] text-[14px] font-semibold"
            style={{ fontFamily: '-apple-system, "SF Pro Text", system-ui, sans-serif' }}>Download</span>
        </button>
      </div>

      {toast && (
        <div className="mx-5 mt-3 bg-[#1c1c1e] text-white text-[13px] font-medium px-4 py-2 rounded-full text-center pointer-events-none">
          {toast}
        </div>
      )}

    </div>
  )
}

/* ── Main page ── */
export default function UploadResultsPage() {
  const navigate = useNavigate()
  const { state } = useLocation()
  const isBallTracer = state?.mode === 'ball-tracer'
  const selectedVideo = state?.video || '/Bodyanalysed1.mp4'
  const thumb = state?.thumb || null

  const [shareDraft, setShareDraft] = useState(null)

  const handleShare = (draft) => setShareDraft(draft)
  const handleShareClose = () => setShareDraft(null)

  const sharedVideoSrc = isBallTracer ? balltraceVideo : selectedVideo

  return (
    <div className="relative w-full bg-[#f4f4f4] flex flex-col min-h-[852px]">

      {/* Header */}
      <div className="flex items-center justify-between px-5 pt-14 pb-3 bg-white border-b border-[#f0f0f0] flex-shrink-0">
        <button onClick={() => navigate('/upload')} className="flex items-center gap-1">
          <svg width="8" height="14" viewBox="0 0 8 14" fill="none">
            <path d="M7 1L1 7L7 13" stroke="#248a3d" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
          <span className="text-[15px] font-medium text-[#248a3d] ml-1"
            style={{ fontFamily: '-apple-system, "SF Pro Text", system-ui, sans-serif' }}>Back</span>
        </button>
        <p className="text-[17px] font-bold text-[#1c1c1e] uppercase tracking-[1px]"
          style={{ fontFamily: '-apple-system, "SF Pro Display", system-ui, sans-serif' }}>
          {isBallTracer ? 'Ball Trace' : 'Swing Analysis'}
        </p>
        <button
          onClick={() => navigate('/upload/name-swing', {
            state: {
              mode: isBallTracer ? 'ball-tracer' : 'swing-analyser',
              resultVideo: isBallTracer ? balltraceVideo : selectedVideo,
              thumb: isBallTracer ? balltraceImg : thumb,
            },
          })}
          className="text-[15px] font-semibold text-[#248a3d]"
          style={{ fontFamily: '-apple-system, "SF Pro Text", system-ui, sans-serif' }}>
          Done ›
        </button>
      </div>

      {isBallTracer
        ? <BallTracerResults onShare={handleShare} />
        : <SwingAnalyserResults videoSrc={selectedVideo} onShare={handleShare} />
      }

      {shareDraft && (
        <ShareModal draft={shareDraft} videoSrc={sharedVideoSrc} onClose={handleShareClose} />
      )}

    </div>
  )
}

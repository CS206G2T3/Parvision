import { useState } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import balltraceImg from '../assets/balltrace.png'
import bodyanalyseImg from '../assets/bodyanalyse.png'
import swingImg from '../assets/swing.png'
import warmupImg from '../assets/warmup.jpeg'

/* ── Swing Analyser data ── */
const WHATS_RIGHT = [
  { id: 1, title: 'Good Club Path', detail: 'Club travels on a consistent inside-out path through impact, promoting a draw ball flight.' },
  { id: 2, title: 'Stable Lower Body', detail: 'Hips stay relatively quiet on the backswing, storing rotational energy effectively.' },
  { id: 3, title: 'Head Position', detail: 'Head remains behind the ball at impact — great for solid contact.' },
]

const WHATS_WRONG = [
  {
    id: 1, type: 'error',
    title: 'C-Posture (Rounded Back)',
    detail: 'Upper back and shoulders are caved, causing a C-posture. This restricts rotation during the backswing, leading to inconsistent strikes. Aim for a straighter back at address.',
  },
  {
    id: 2, type: 'error',
    title: 'Disconnected Arms',
    detail: 'Lead arm is disconnecting from your body at the top of the backswing. Keep the arms connected for more consistent ball striking.',
  },
  {
    id: 3, type: 'error',
    title: 'Excessive Knee Flex',
    detail: 'Knees bent at ~30° — too much. This makes weight transfer difficult. Aim for a smaller knee flex of around 15–20°.',
  },
  {
    id: 4, type: 'warning',
    title: 'Straight Left Arm',
    detail: 'Lead arm slightly bent at the top of backswing. Keep it straight for more consistent ball striking.',
  },
]

const SUGGESTED_DRILL = {
  title: 'Dynamic Warm Up',
  duration: '15 Minutes',
  points: ['Prevents Injury', 'Improves Flexibility', 'Activates Rotation'],
}

/* ── Sub-components ── */
function CheckRow({ title, detail, expanded, onToggle }) {
  return (
    <button onClick={onToggle} className="w-full text-left py-3 border-b border-[#f0f0f0] last:border-0">
      <div className="flex items-start gap-3">
        <div className="w-5 h-5 rounded-full bg-[#248a3d] flex items-center justify-center flex-shrink-0 mt-0.5">
          <svg width="10" height="8" viewBox="0 0 10 8" fill="none">
            <path d="M1 4L3.5 6.5L9 1" stroke="white" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-[14px] font-semibold text-[#1c1c1e] leading-[19px]"
            style={{ fontFamily: '-apple-system, "SF Pro Text", system-ui, sans-serif' }}>
            {title}
          </p>
          {expanded && (
            <p className="text-[12px] text-[rgba(60,60,67,0.65)] leading-[17px] mt-1"
              style={{ fontFamily: '-apple-system, "SF Pro Text", system-ui, sans-serif' }}>
              {detail}
            </p>
          )}
        </div>
        <svg width="8" height="14" viewBox="0 0 8 14" fill="none"
          className={`flex-shrink-0 mt-1 transition-transform duration-200 ${expanded ? 'rotate-90' : ''}`}>
          <path d="M1 1L7 7L1 13" stroke="rgba(60,60,67,0.35)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </div>
    </button>
  )
}

function IssueRow({ type, title, detail, expanded, onToggle }) {
  const isError = type === 'error'
  return (
    <button onClick={onToggle} className="w-full text-left py-3 border-b border-[#f0f0f0] last:border-0">
      <div className="flex items-start gap-3">
        <div className={`w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5 ${isError ? 'bg-[#ff3b30]' : 'bg-[#f97316]'}`}>
          {isError ? (
            <svg width="10" height="10" viewBox="0 0 10 10" fill="none">
              <path d="M2.5 2.5L7.5 7.5M7.5 2.5L2.5 7.5" stroke="white" strokeWidth="1.8" strokeLinecap="round" />
            </svg>
          ) : (
            <svg width="10" height="10" viewBox="0 0 10 10" fill="none">
              <path d="M5 3V5.5M5 7.2H5.01" stroke="white" strokeWidth="1.8" strokeLinecap="round" />
            </svg>
          )}
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-[14px] font-semibold text-[#1c1c1e] leading-[19px]"
            style={{ fontFamily: '-apple-system, "SF Pro Text", system-ui, sans-serif' }}>
            {title}
          </p>
          {expanded && (
            <p className="text-[12px] text-[rgba(60,60,67,0.65)] leading-[17px] mt-1"
              style={{ fontFamily: '-apple-system, "SF Pro Text", system-ui, sans-serif' }}>
              {detail}
            </p>
          )}
        </div>
        <svg width="8" height="14" viewBox="0 0 8 14" fill="none"
          className={`flex-shrink-0 mt-1 transition-transform duration-200 ${expanded ? 'rotate-90' : ''}`}>
          <path d="M1 1L7 7L1 13" stroke="rgba(60,60,67,0.35)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </div>
    </button>
  )
}

/* ── Ball Tracer results ── */
function BallTracerResults({ navigate }) {
  const [playing, setPlaying] = useState(false)

  return (
    <div className="flex-1 overflow-y-auto pb-8">
      {/* Video with arc overlay */}
      <div className="relative mx-5 mt-4 rounded-2xl overflow-hidden h-[260px]">
        <img src={balltraceImg} alt="Ball Trace" className="w-full h-full object-cover" />
      </div>

      {/* Progress bar */}
      <div className="mx-5 mt-3 flex items-center gap-2">
        <span className="text-[12px] text-[rgba(60,60,67,0.5)] w-8 text-right flex-shrink-0">0:08</span>
        <div className="flex-1 h-1 bg-[#e5e5ea] rounded-full">
          <div className="h-1 bg-[#248a3d] rounded-full relative" style={{ width: '89%' }}>
            <div className="absolute right-0 top-1/2 -translate-y-1/2 w-3.5 h-3.5 bg-[#248a3d] rounded-full -mr-1.5 shadow" />
          </div>
        </div>
        <span className="text-[12px] text-[rgba(60,60,67,0.5)] w-8 flex-shrink-0">0:09</span>
      </div>

      {/* Playback controls */}
      <div className="flex items-center justify-center gap-8 mt-3">
        <button className="w-10 h-10 flex items-center justify-center">
          <svg width="26" height="26" viewBox="0 0 26 26" fill="none">
            <path d="M20 20L9 13L20 6V20Z" fill="#248a3d" />
            <rect x="4" y="5" width="3" height="16" rx="1.5" fill="#248a3d" />
          </svg>
        </button>
        <button onClick={() => setPlaying(!playing)}
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
        <button className="w-10 h-10 flex items-center justify-center">
          <svg width="26" height="26" viewBox="0 0 26 26" fill="none">
            <path d="M6 20L17 13L6 6V20Z" fill="#248a3d" />
            <rect x="19" y="5" width="3" height="16" rx="1.5" fill="#248a3d" />
          </svg>
        </button>
      </div>

      {/* Action buttons */}
      <div className="mx-5 mt-6 flex gap-3">
        <button className="flex-1 flex items-center justify-center gap-2 h-[48px] bg-[#248a3d] rounded-2xl active:opacity-80">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
            <path d="M4 12V20H20V12M12 3V15M8 11L12 15L16 11" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
          <span className="text-white text-[14px] font-semibold"
            style={{ fontFamily: '-apple-system, "SF Pro Text", system-ui, sans-serif' }}>Share</span>
        </button>
        <button className="flex-1 flex items-center justify-center gap-2 h-[48px] bg-[#f4f4f4] rounded-2xl active:opacity-80">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
            <path d="M12 3V15M8 11L12 15L16 11M4 17V20H20V17" stroke="#1c1c1e" strokeWidth="2" strokeLinecap="round" />
          </svg>
          <span className="text-[#1c1c1e] text-[14px] font-semibold"
            style={{ fontFamily: '-apple-system, "SF Pro Text", system-ui, sans-serif' }}>Download</span>
        </button>
      </div>
    </div>
  )
}

/* ── Swing Analyser results ── */
function SwingAnalyserResults({ navigate }) {
  const [expandedRight, setExpandedRight] = useState(null)
  const [expandedWrong, setExpandedWrong] = useState(null)
  const [playing, setPlaying] = useState(false)

  return (
    <div className="flex-1 overflow-y-auto pb-10">

      {/* Body analysis image */}
      <div className="relative mx-5 mt-4 rounded-2xl overflow-hidden h-[280px] bg-[#1c1c1e]">
        <img src={bodyanalyseImg} alt="Body Analysis" className="w-full h-full object-contain" />
      </div>

      {/* Playback controls */}
      <div className="mx-5 mt-3 flex items-center gap-2">
        <span className="text-[12px] text-[rgba(60,60,67,0.5)] w-8 text-right flex-shrink-0">0:04</span>
        <div className="flex-1 h-1 bg-[#e5e5ea] rounded-full">
          <div className="h-1 bg-[#248a3d] rounded-full relative" style={{ width: '50%' }}>
            <div className="absolute right-0 top-1/2 -translate-y-1/2 w-3.5 h-3.5 bg-[#248a3d] rounded-full -mr-1.5 shadow" />
          </div>
        </div>
        <span className="text-[12px] text-[rgba(60,60,67,0.5)] w-8 flex-shrink-0">0:09</span>
      </div>
      <div className="flex items-center justify-center gap-8 mt-2 mb-4">
        <button className="w-10 h-10 flex items-center justify-center">
          <svg width="24" height="24" viewBox="0 0 26 26" fill="none">
            <path d="M20 20L9 13L20 6V20Z" fill="#248a3d" />
            <rect x="4" y="5" width="3" height="16" rx="1.5" fill="#248a3d" />
          </svg>
        </button>
        <button onClick={() => setPlaying(!playing)}
          className="w-[48px] h-[48px] bg-[#248a3d] rounded-full flex items-center justify-center shadow-md active:opacity-80">
          {playing ? (
            <svg width="16" height="16" viewBox="0 0 18 18" fill="white">
              <rect x="3" y="2" width="4" height="14" rx="1.5" /><rect x="11" y="2" width="4" height="14" rx="1.5" />
            </svg>
          ) : (
            <svg width="16" height="16" viewBox="0 0 18 18" fill="white">
              <path d="M4 2L15 9L4 16V2Z" />
            </svg>
          )}
        </button>
        <button className="w-10 h-10 flex items-center justify-center">
          <svg width="24" height="24" viewBox="0 0 26 26" fill="none">
            <path d="M6 20L17 13L6 6V20Z" fill="#248a3d" />
            <rect x="19" y="5" width="3" height="16" rx="1.5" fill="#248a3d" />
          </svg>
        </button>
      </div>

      {/* Score pill */}
      <div className="mx-5 mb-5">
        <div className="bg-[#f4f4f4] rounded-2xl px-4 py-3 flex items-center justify-between">
          <div className="text-center flex-1">
            <p className="text-[11px] font-semibold uppercase tracking-[0.5px] text-[rgba(60,60,67,0.5)] mb-0.5"
              style={{ fontFamily: '-apple-system, "SF Pro Text", system-ui, sans-serif' }}>Correct</p>
            <p className="text-[22px] font-bold text-[#248a3d]"
              style={{ fontFamily: '-apple-system, "SF Pro Display", system-ui, sans-serif' }}>
              {WHATS_RIGHT.length}
            </p>
          </div>
          <div className="w-px h-10 bg-[#e5e5ea]" />
          <div className="text-center flex-1">
            <p className="text-[11px] font-semibold uppercase tracking-[0.5px] text-[rgba(60,60,67,0.5)] mb-0.5"
              style={{ fontFamily: '-apple-system, "SF Pro Text", system-ui, sans-serif' }}>Issues</p>
            <p className="text-[22px] font-bold text-[#ff3b30]"
              style={{ fontFamily: '-apple-system, "SF Pro Display", system-ui, sans-serif' }}>
              {WHATS_WRONG.filter(i => i.type === 'error').length}
            </p>
          </div>
          <div className="w-px h-10 bg-[#e5e5ea]" />
          <div className="text-center flex-1">
            <p className="text-[11px] font-semibold uppercase tracking-[0.5px] text-[rgba(60,60,67,0.5)] mb-0.5"
              style={{ fontFamily: '-apple-system, "SF Pro Text", system-ui, sans-serif' }}>Warnings</p>
            <p className="text-[22px] font-bold text-[#f97316]"
              style={{ fontFamily: '-apple-system, "SF Pro Display", system-ui, sans-serif' }}>
              {WHATS_WRONG.filter(i => i.type === 'warning').length}
            </p>
          </div>
        </div>
      </div>

      {/* What's Right */}
      <div className="mx-5 mb-4">
        <div className="flex items-center gap-2 mb-2">
          <div className="w-5 h-5 bg-[#248a3d] rounded-md flex items-center justify-center">
            <svg width="11" height="9" viewBox="0 0 11 9" fill="none">
              <path d="M1 4.5L3.5 7L9.5 1" stroke="white" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </div>
          <p className="text-[15px] font-bold text-[#1c1c1e] uppercase tracking-[0.5px]"
            style={{ fontFamily: '-apple-system, "SF Pro Display", system-ui, sans-serif' }}>
            What's Right
          </p>
        </div>
        <div className="bg-white rounded-2xl px-4 overflow-hidden border border-[#f0f0f0]">
          {WHATS_RIGHT.map((item) => (
            <CheckRow
              key={item.id}
              {...item}
              expanded={expandedRight === item.id}
              onToggle={() => setExpandedRight(p => p === item.id ? null : item.id)}
            />
          ))}
        </div>
      </div>

      {/* What's Wrong */}
      <div className="mx-5 mb-5">
        <div className="flex items-center gap-2 mb-2">
          <div className="w-5 h-5 bg-[#ff3b30] rounded-md flex items-center justify-center">
            <svg width="10" height="10" viewBox="0 0 10 10" fill="none">
              <path d="M2.5 2.5L7.5 7.5M7.5 2.5L2.5 7.5" stroke="white" strokeWidth="1.8" strokeLinecap="round" />
            </svg>
          </div>
          <p className="text-[15px] font-bold text-[#1c1c1e] uppercase tracking-[0.5px]"
            style={{ fontFamily: '-apple-system, "SF Pro Display", system-ui, sans-serif' }}>
            Issues Found
          </p>
        </div>
        <div className="bg-white rounded-2xl px-4 overflow-hidden border border-[#f0f0f0]">
          {WHATS_WRONG.map((item) => (
            <IssueRow
              key={item.id}
              {...item}
              expanded={expandedWrong === item.id}
              onToggle={() => setExpandedWrong(p => p === item.id ? null : item.id)}
            />
          ))}
        </div>
      </div>

      {/* Suggested Drill */}
      <div className="mx-5 mb-5">
        <div className="flex items-center gap-2 mb-2">
          <div className="w-5 h-5 bg-[#f59e0b] rounded-md flex items-center justify-center">
            <svg width="11" height="11" viewBox="0 0 24 24" fill="white">
              <path d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z" />
            </svg>
          </div>
          <p className="text-[15px] font-bold text-[#1c1c1e] uppercase tracking-[0.5px]"
            style={{ fontFamily: '-apple-system, "SF Pro Display", system-ui, sans-serif' }}>
            Suggested Drill
          </p>
        </div>
        <div className="relative rounded-2xl overflow-hidden h-[140px]">
          <img src={warmupImg} alt="Dynamic Warm Up" className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />
          <div className="absolute bottom-0 left-0 right-0 p-4">
            <p className="text-white text-[16px] font-bold leading-[20px] uppercase tracking-[0.5px] mb-0.5"
              style={{ fontFamily: '-apple-system, "SF Pro Display", system-ui, sans-serif' }}>
              {SUGGESTED_DRILL.title}
            </p>
            <p className="text-white/80 text-[12px] mb-2">{SUGGESTED_DRILL.duration}</p>
            <div className="flex gap-3">
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
        <button className="flex-1 flex items-center justify-center gap-2 h-[48px] bg-[#248a3d] rounded-2xl active:opacity-80">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
            <path d="M4 12V20H20V12M12 3V15M8 11L12 15L16 11" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
          <span className="text-white text-[14px] font-semibold"
            style={{ fontFamily: '-apple-system, "SF Pro Text", system-ui, sans-serif' }}>Share Swing</span>
        </button>
        <button className="flex-1 flex items-center justify-center gap-2 h-[48px] bg-[#f4f4f4] rounded-2xl active:opacity-80">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
            <path d="M12 3V15M8 11L12 15L16 11M4 17V20H20V17" stroke="#1c1c1e" strokeWidth="2" strokeLinecap="round" />
          </svg>
          <span className="text-[#1c1c1e] text-[14px] font-semibold"
            style={{ fontFamily: '-apple-system, "SF Pro Text", system-ui, sans-serif' }}>Download</span>
        </button>
      </div>

    </div>
  )
}

/* ── Main page ── */
export default function UploadResultsPage() {
  const navigate = useNavigate()
  const { state } = useLocation()
  const isBallTracer = state?.mode === 'ball-tracer'

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
        <button onClick={() => navigate('/home')}
          className="text-[15px] font-semibold text-[#248a3d]"
          style={{ fontFamily: '-apple-system, "SF Pro Text", system-ui, sans-serif' }}>
          Done ›
        </button>
      </div>

      {isBallTracer
        ? <BallTracerResults navigate={navigate} />
        : <SwingAnalyserResults navigate={navigate} />
      }

    </div>
  )
}

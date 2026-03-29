import { useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import BottomNav from '../components/BottomNav'
import swingImg from '../assets/swing.png'
import foursomeImg from '../assets/foursome.png'
import golfIcon from '../assets/upload_golf_icon.png'

const PREVIOUS_UPLOADS = [
  {
    id: 1,
    title: 'Friday Night Iron Swing',
    date: '1d ago',
    duration: '0:35',
    thumb: swingImg,
    tag: 'Ball Tracer',
    desc: 'Swinging at Orchid Country Club, ball kept swerving left but massive improvement from last time.',
  },
  {
    id: 2,
    title: 'Chill Range Zero',
    date: '3d ago',
    duration: '0:09',
    thumb: foursomeImg,
    tag: 'Swing Analyser',
    desc: 'Casual range session, working on follow-through consistency.',
  },
]

export default function UploadPage() {
  const navigate = useNavigate()
  const fileRef = useRef(null)
  const [dragging, setDragging] = useState(false)

  const handleFileSelect = () => {
    navigate('/upload/gallery')
  }

  return (
    <div className="relative w-full bg-white flex flex-col min-h-[852px]">

      {/* ── Header ── */}
      <div className="bg-[#248a3d] pt-12 pb-4 px-5 flex-shrink-0 relative overflow-hidden flex items-center gap-4">
        {/* Golf course icon */}
        <div className="flex-shrink-0">
          <img src={golfIcon} alt="golf" className="w-[90px] h-[90px] object-contain" />
        </div>
        {/* Text */}
        <div>
          <h1
            className="text-[30px] font-black text-white uppercase tracking-[2px] leading-[34px]"
            style={{ fontFamily: '-apple-system, "SF Pro Display", system-ui, sans-serif' }}
          >
            UPLOAD
          </h1>
          <p className="text-white/80 text-[13px] font-medium mt-0.5 tracking-wide">Optimise Every Swing</p>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto pb-[80px]">

        {/* Instructions + drop zone card */}
        <div className="mx-4 mt-4 bg-white rounded-2xl border border-[#f0f0f0] px-4 pt-4 pb-5"
          style={{ boxShadow: '0 1px 6px rgba(0,0,0,0.06)' }}>
          <p
            className="text-[17px] font-bold text-[#1c1c1e] leading-[22px] mb-3"
            style={{ fontFamily: '-apple-system, "SF Pro Display", system-ui, sans-serif' }}
          >
            Upload Your Swing Video
          </p>
          <div className="flex flex-col gap-2.5">
            {[
              'Select a video file',
              'Select ball tracer or swing analyser',
              'Position body and ball inside frame',
            ].map((tip, i) => (
              <div key={i} className="flex items-center gap-3">
                <div className="w-6 h-6 rounded-full bg-[#248a3d] flex items-center justify-center flex-shrink-0">
                  <span className="text-white text-[12px] font-bold">{i + 1}</span>
                </div>
                <p
                  className="text-[14px] text-[#1c1c1e] leading-[18px]"
                  style={{ fontFamily: '-apple-system, "SF Pro Text", system-ui, sans-serif' }}
                >
                  {tip}
                </p>
              </div>
            ))}
          </div>

          {/* Drop zone */}
          <button
            onClick={handleFileSelect}
            onDragOver={(e) => { e.preventDefault(); setDragging(true) }}
            onDragLeave={() => setDragging(false)}
            onDrop={(e) => { e.preventDefault(); setDragging(false); handleFileSelect() }}
            className={`w-full mt-4 border border-dashed rounded-xl flex flex-col items-center justify-center py-7 gap-2 transition-colors ${
              dragging ? 'border-[#248a3d] bg-[#e5f8e9]' : 'border-[#c7c7cc] bg-[#fafafa]'
            }`}
          >
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none">
              <path d="M21 15V19C21 20.1 20.1 21 19 21H5C3.9 21 3 20.1 3 19V15" stroke="#248a3d" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              <path d="M17 8L12 3L7 8" stroke="#248a3d" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              <path d="M12 3V15" stroke="#248a3d" strokeWidth="2" strokeLinecap="round" />
            </svg>
            <p
              className="text-[14px] font-semibold text-[#248a3d]"
              style={{ fontFamily: '-apple-system, "SF Pro Text", system-ui, sans-serif' }}
            >
              Click to upload
            </p>
            <p
              className="text-[11px] text-[rgba(60,60,67,0.45)]"
              style={{ fontFamily: '-apple-system, "SF Pro Text", system-ui, sans-serif' }}
            >
              Supports MP4, WebM or OGG ( Max: 100MB )
            </p>
          </button>
          <input ref={fileRef} type="file" accept="video/*" className="hidden" onChange={handleFileSelect} />
        </div>

        {/* Previous Uploads */}
        <div className="mx-4 mt-5">
          <p
            className="text-[19px] font-bold text-[#1c1c1e] mb-3"
            style={{ fontFamily: '-apple-system, "SF Pro Display", system-ui, sans-serif' }}
          >
            Previous Uploads
          </p>

          <div className="bg-white rounded-2xl border border-[#f0f0f0] overflow-hidden"
            style={{ boxShadow: '0 1px 6px rgba(0,0,0,0.06)' }}>
            {PREVIOUS_UPLOADS.map((upload, idx) => (
              <div key={upload.id}>
                <button
                  onClick={() => navigate('/upload/select-mode', { state: { thumb: upload.thumb } })}
                  className="flex items-start gap-3 p-4 w-full text-left active:bg-[#f9f9f9] transition-colors"
                >
                  {/* Thumbnail */}
                  <div className="w-[90px] h-[68px] rounded-xl flex-shrink-0 overflow-hidden relative">
                    <img src={upload.thumb} alt={upload.title} className="w-full h-full object-cover" />
                    <div className="absolute bottom-1 left-1 bg-black/60 rounded px-1">
                      <span className="text-white text-[10px] font-semibold">{upload.duration}</span>
                    </div>
                  </div>

                  <div className="flex-1 min-w-0">
                    {/* Title + date + menu */}
                    <div className="flex items-center justify-between gap-1">
                      <p
                        className="text-[14px] font-semibold text-[#1c1c1e] truncate"
                        style={{ fontFamily: '-apple-system, "SF Pro Text", system-ui, sans-serif' }}
                      >
                        {upload.title}
                      </p>
                      <div className="flex items-center gap-1.5 flex-shrink-0">
                        <span className="text-[12px] text-[rgba(60,60,67,0.45)]">{upload.date}</span>
                        <span className="text-[rgba(60,60,67,0.4)] text-[16px] leading-none tracking-widest">···</span>
                      </div>
                    </div>

                    {/* Tag chip */}
                    <div className="mt-1">
                      <span className="text-[11px] font-medium text-[rgba(60,60,67,0.6)] border border-[#e0e0e0] rounded-full px-2 py-0.5">
                        ↗ {upload.tag}
                      </span>
                    </div>

                    {/* Description */}
                    <p
                      className="text-[12px] text-[rgba(60,60,67,0.55)] mt-1.5 leading-[16px] line-clamp-2"
                      style={{ fontFamily: '-apple-system, "SF Pro Text", system-ui, sans-serif' }}
                    >
                      {upload.desc}
                    </p>
                  </div>
                </button>
                {idx < PREVIOUS_UPLOADS.length - 1 && (
                  <div className="h-px bg-[#f0f0f0] mx-4" />
                )}
              </div>
            ))}

            {/* View full history */}
            <div className="h-px bg-[#f0f0f0]" />
            <button
              onClick={() => navigate('/upload/history')}
              className="w-full py-3.5 flex items-center justify-center gap-1.5 active:bg-[#f9f9f9] transition-colors"
            >
              <span
                className="text-[14px] font-semibold text-[#1c1c1e]"
                style={{ fontFamily: '-apple-system, "SF Pro Text", system-ui, sans-serif' }}
              >
                View full history
              </span>
              <svg width="7" height="12" viewBox="0 0 7 12" fill="none">
                <path d="M1 1L6 6L1 11" stroke="#1c1c1e" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </button>
          </div>
        </div>

      </div>

      <BottomNav />
    </div>
  )
}
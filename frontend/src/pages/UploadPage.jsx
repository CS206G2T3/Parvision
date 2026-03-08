import { useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import BottomNav from '../components/BottomNav'

const PREVIOUS_UPLOADS = [
  { id: 1, title: 'Friday Night Iron Swing', date: 'Feb 14, 2025', duration: '0:14' },
  { id: 2, title: 'Chill Range Zero', date: 'Feb 10, 2025', duration: '0:09' },
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

      {/* Header */}
      <div className="bg-[#248a3d] pt-14 pb-5 px-5 flex-shrink-0">
        <h1
          className="text-[20px] font-bold text-white uppercase tracking-[1px] leading-[25px]"
          style={{ fontFamily: '-apple-system, "SF Pro Display", system-ui, sans-serif' }}
        >
          Upload
        </h1>
        <p className="text-white/70 text-[13px] mt-0.5">Swing Analyser Ready!</p>
      </div>

      <div className="flex-1 overflow-y-auto pb-[80px] px-5">

        {/* Instructions */}
        <div className="mt-5">
          <p
            className="text-[17px] font-bold text-[#1c1c1e] leading-[22px]"
            style={{ fontFamily: '-apple-system, "SF Pro Display", system-ui, sans-serif' }}
          >
            Upload Your Swing Video
          </p>
          <div className="mt-3 flex flex-col gap-2">
            {[
              'Select a video file',
              'Swing must show a full swing silhouette',
              'Position body and full body frame',
            ].map((tip, i) => (
              <div key={i} className="flex items-start gap-2">
                <div className="w-4 h-4 rounded-full bg-[#248a3d] flex items-center justify-center flex-shrink-0 mt-0.5">
                  <svg width="8" height="8" viewBox="0 0 8 8" fill="none">
                    <path d="M1.5 4L3.5 6L6.5 2" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </div>
                <p
                  className="text-[13px] text-[rgba(60,60,67,0.7)] leading-[18px]"
                  style={{ fontFamily: '-apple-system, "SF Pro Text", system-ui, sans-serif' }}
                >
                  {tip}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Drop zone */}
        <button
          onClick={handleFileSelect}
          onDragOver={(e) => { e.preventDefault(); setDragging(true) }}
          onDragLeave={() => setDragging(false)}
          onDrop={(e) => { e.preventDefault(); setDragging(false); handleFileSelect() }}
          className={`w-full mt-5 border-2 border-dashed rounded-2xl flex flex-col items-center justify-center py-10 gap-3 transition-colors ${
            dragging ? 'border-[#248a3d] bg-[#e5f8e9]' : 'border-[#c7c7cc] bg-[#f9f9f9]'
          }`}
        >
          <div className="w-14 h-14 bg-[#e5f8e9] rounded-full flex items-center justify-center">
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none">
              <path d="M21 15V19C21 20.1 20.1 21 19 21H5C3.9 21 3 20.1 3 19V15" stroke="#248a3d" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              <path d="M17 8L12 3L7 8" stroke="#248a3d" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              <path d="M12 3V15" stroke="#248a3d" strokeWidth="2" strokeLinecap="round" />
            </svg>
          </div>
          <div className="text-center">
            <p
              className="text-[15px] font-semibold text-[#1c1c1e]"
              style={{ fontFamily: '-apple-system, "SF Pro Text", system-ui, sans-serif' }}
            >
              Click to select
            </p>
            <p
              className="text-[12px] text-[rgba(60,60,67,0.5)] mt-0.5"
              style={{ fontFamily: '-apple-system, "SF Pro Text", system-ui, sans-serif' }}
            >
              MP4, MOV up to 100MB
            </p>
          </div>
        </button>
        <input ref={fileRef} type="file" accept="video/*" className="hidden" onChange={handleFileSelect} />

        {/* Previous uploads */}
        <div className="mt-7">
          <p
            className="text-[17px] font-semibold text-[#1c1c1e] mb-3"
            style={{ fontFamily: '-apple-system, "SF Pro Text", system-ui, sans-serif' }}
          >
            Previous Uploads
          </p>
          <div className="flex flex-col gap-3">
            {PREVIOUS_UPLOADS.map((upload) => (
              <button
                key={upload.id}
                onClick={() => navigate('/upload/select-mode')}
                className="flex items-center gap-3 bg-[#f4f4f4] rounded-2xl p-3 w-full text-left active:opacity-80 transition-opacity"
              >
                {/* Thumbnail placeholder */}
                <div className="w-[72px] h-[54px] bg-[#c7c7cc] rounded-xl flex-shrink-0 flex items-center justify-center overflow-hidden">
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                    <circle cx="12" cy="12" r="9" fill="rgba(255,255,255,0.3)" />
                    <path d="M10 8L16 12L10 16V8Z" fill="white" />
                  </svg>
                </div>
                <div className="flex-1 min-w-0">
                  <p
                    className="text-[14px] font-semibold text-[#1c1c1e] truncate"
                    style={{ fontFamily: '-apple-system, "SF Pro Text", system-ui, sans-serif' }}
                  >
                    {upload.title}
                  </p>
                  <p
                    className="text-[12px] text-[rgba(60,60,67,0.5)] mt-0.5"
                    style={{ fontFamily: '-apple-system, "SF Pro Text", system-ui, sans-serif' }}
                  >
                    {upload.date} · {upload.duration}
                  </p>
                </div>
                <svg width="8" height="14" viewBox="0 0 8 14" fill="none" className="flex-shrink-0">
                  <path d="M1 1L7 7L1 13" stroke="rgba(60,60,67,0.4)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </button>
            ))}
          </div>
        </div>
      </div>

      <BottomNav />
    </div>
  )
}

import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'

function formatDate(iso) {
  const d = new Date(iso)
  const now = new Date()
  const diff = Math.floor((now - d) / 1000)
  if (diff < 60) return 'Just now'
  if (diff < 3600) return `${Math.floor(diff / 60)}m ago`
  if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`
  if (diff < 604800) return `${Math.floor(diff / 86400)}d ago`
  return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
}

export default function UploadHistoryPage() {
  const navigate = useNavigate()
  const [history, setHistory] = useState([])

  useEffect(() => {
    const data = JSON.parse(localStorage.getItem('parvision_upload_history') || '[]')
    setHistory(data)
  }, [])

  return (
    <div className="relative w-full bg-[#f4f4f4] flex flex-col min-h-[852px]">

      {/* Header */}
      <div className="flex items-center justify-between px-5 pt-14 pb-4 bg-white border-b border-[#f0f0f0] flex-shrink-0">
        <button onClick={() => navigate('/upload')} className="flex items-center gap-1">
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
          Upload History
        </p>
        <div className="w-14" />
      </div>

      <div className="flex-1 overflow-y-auto pb-8">

        {history.length === 0 ? (
          <div className="flex flex-col items-center justify-center pt-24 px-8">
            <div className="w-16 h-16 rounded-full bg-[#f0f0f0] flex items-center justify-center mb-4">
              <svg width="28" height="28" viewBox="0 0 24 24" fill="none">
                <path d="M21 15V19C21 20.1 20.1 21 19 21H5C3.9 21 3 20.1 3 19V15" stroke="#c7c7cc" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                <path d="M17 8L12 3L7 8" stroke="#c7c7cc" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                <path d="M12 3V15" stroke="#c7c7cc" strokeWidth="2" strokeLinecap="round" />
              </svg>
            </div>
            <p
              className="text-[17px] font-semibold text-[#1c1c1e] text-center mb-1"
              style={{ fontFamily: '-apple-system, "SF Pro Display", system-ui, sans-serif' }}
            >
              No uploads yet
            </p>
            <p
              className="text-[14px] text-[rgba(60,60,67,0.5)] text-center leading-[20px]"
              style={{ fontFamily: '-apple-system, "SF Pro Text", system-ui, sans-serif' }}
            >
              Upload and analyse a swing to see it here
            </p>
            <button
              onClick={() => navigate('/upload/gallery')}
              className="mt-6 h-[48px] px-8 bg-[#248a3d] rounded-2xl flex items-center justify-center active:opacity-80"
            >
              <span
                className="text-white text-[15px] font-semibold"
                style={{ fontFamily: '-apple-system, "SF Pro Text", system-ui, sans-serif' }}
              >
                Upload a Swing
              </span>
            </button>
          </div>
        ) : (
          <div className="mx-4 mt-4">
            <div className="bg-white rounded-2xl border border-[#f0f0f0] overflow-hidden"
              style={{ boxShadow: '0 1px 6px rgba(0,0,0,0.06)' }}>
              {history.map((item, idx) => (
                <div key={item.id}>
                  <button
                    onClick={() => navigate(`/upload/history/${item.id}`)}
                    className="flex items-start gap-3 p-4 w-full text-left active:bg-[#f9f9f9] transition-colors"
                  >
                    {/* Thumbnail */}
                    <div className="w-[90px] h-[68px] rounded-xl flex-shrink-0 overflow-hidden relative bg-[#f0f0f0]">
                      {item.thumb ? (
                        <img src={item.thumb} alt={item.title} className="w-full h-full object-cover" />
                      ) : (
                        <div className="w-full h-full bg-gradient-to-br from-[#248a3d]/30 to-[#248a3d]/10 flex items-center justify-center">
                          <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                            <path d="M8 5L19 12L8 19V5Z" fill="#248a3d" />
                          </svg>
                        </div>
                      )}
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between gap-1">
                        <p
                          className="text-[14px] font-semibold text-[#1c1c1e] truncate"
                          style={{ fontFamily: '-apple-system, "SF Pro Text", system-ui, sans-serif' }}
                        >
                          {item.title}
                        </p>
                        <span className="text-[12px] text-[rgba(60,60,67,0.45)] flex-shrink-0">
                          {formatDate(item.date)}
                        </span>
                      </div>

                      <div className="mt-1">
                        <span className="text-[11px] font-medium text-[rgba(60,60,67,0.6)] border border-[#e0e0e0] rounded-full px-2 py-0.5">
                          ↗ {item.mode === 'ball-tracer' ? 'Ball Tracer' : 'Swing Analyser'}
                        </span>
                      </div>

                      {item.description ? (
                        <p
                          className="text-[12px] text-[rgba(60,60,67,0.55)] mt-1.5 leading-[16px] line-clamp-2"
                          style={{ fontFamily: '-apple-system, "SF Pro Text", system-ui, sans-serif' }}
                        >
                          {item.description}
                        </p>
                      ) : null}
                    </div>

                    <svg width="7" height="12" viewBox="0 0 7 12" fill="none" className="flex-shrink-0 mt-2">
                      <path d="M1 1L6 6L1 11" stroke="rgba(60,60,67,0.3)" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  </button>
                  {idx < history.length - 1 && <div className="h-px bg-[#f0f0f0] mx-4" />}
                </div>
              ))}
            </div>
          </div>
        )}

      </div>
    </div>
  )
}

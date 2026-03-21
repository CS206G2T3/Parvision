import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import swingImg from '../assets/swing.png'

// Mock gallery items — videos and images mixed like a real photo library
const GALLERY_ITEMS = [
  { id: 1, type: 'image', bg: 'linear-gradient(135deg, #a855f7, #ec4899, #f97316)' },
  { id: 2, type: 'image', bg: 'linear-gradient(135deg, #3b82f6, #8b5cf6, #06b6d4)' },
  { id: 3, type: 'image', bg: 'linear-gradient(135deg, #10b981, #059669, #1d4ed8)' },
  { id: 4, type: 'video', duration: '0:14', thumb: swingImg },
  { id: 5, type: 'video', duration: '0:09', thumb: swingImg },
  { id: 6, type: 'image', bg: 'linear-gradient(135deg, #84cc16, #22c55e)' },
  { id: 7, type: 'image', bg: 'linear-gradient(135deg, #ec4899, #f43f5e)' },
  { id: 8, type: 'image', bg: 'linear-gradient(135deg, #f97316, #ef4444, #7c3aed)' },
  { id: 9, type: 'image', bg: 'linear-gradient(135deg, #0ea5e9, #6366f1)' },
  { id: 10, type: 'image', bg: 'linear-gradient(135deg, #f59e0b, #ef4444)' },
  { id: 11, type: 'image', bg: 'linear-gradient(135deg, #8b5cf6, #3b82f6)' },
  { id: 12, type: 'image', bg: 'linear-gradient(135deg, #06b6d4, #0284c7)' },
]

export default function GalleryPage() {
  const navigate = useNavigate()
  const [selected, setSelected] = useState(null)
  const [query, setQuery] = useState('')

  const toggle = (id) => setSelected((prev) => (prev === id ? null : id))

  const filteredItems = query.trim() === ''
    ? GALLERY_ITEMS
    : GALLERY_ITEMS.filter((item) => item.type.includes(query.toLowerCase().trim()))

  const handleDone = () => {
    if (!selected) return
    const item = GALLERY_ITEMS.find((i) => i.id === selected)
    navigate('/upload/select-mode', { state: { thumb: item?.thumb || null } })
  }

  return (
    <div className="relative w-full bg-white flex flex-col min-h-[852px]">

      {/* Top bar */}
      <div className="pt-14 px-5 pb-3 flex-shrink-0">
        <h1
          className="text-[22px] font-bold text-[#1c1c1e] leading-[28px] mb-3"
          style={{ fontFamily: '-apple-system, "SF Pro Display", system-ui, sans-serif' }}
        >
          Gallery
        </h1>

        {/* Sheet handle + Cancel/Done row */}
        <div className="bg-white rounded-t-3xl pt-2">
          <div className="w-10 h-1 bg-[#c7c7cc] rounded-full mx-auto mb-3" />
          <div className="flex items-center justify-between mb-3">
            <button
              onClick={() => navigate('/upload')}
              className="text-[17px] font-medium text-[#409cff]"
              style={{ fontFamily: '-apple-system, "SF Pro Text", system-ui, sans-serif' }}
            >
              Cancel
            </button>
            <button
              onClick={handleDone}
              disabled={!selected}
              className={`text-[17px] font-semibold ${selected ? 'text-[#409cff]' : 'text-[rgba(64,156,255,0.4)]'}`}
              style={{ fontFamily: '-apple-system, "SF Pro Text", system-ui, sans-serif' }}
            >
              Done
            </button>
          </div>

          {/* Search bar */}
          <div className="flex items-center bg-[#f4f4f4] rounded-[12px] h-[36px] px-3 gap-2 mb-3">
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
              <circle cx="6" cy="6" r="4.5" stroke="rgba(60,60,67,0.4)" strokeWidth="1.5" />
              <path d="M10 10L12.5 12.5" stroke="rgba(60,60,67,0.4)" strokeWidth="1.5" strokeLinecap="round" />
            </svg>
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search"
              className="flex-1 bg-transparent text-[14px] text-[#1c1c1e] placeholder-[rgba(60,60,67,0.4)] focus:outline-none"
              style={{ fontFamily: 'Inter, system-ui, sans-serif' }}
            />
            <svg width="14" height="14" viewBox="0 0 24 24" fill="rgba(60,60,67,0.4)">
              <path d="M12 1a3 3 0 0 0-3 3v8a3 3 0 0 0 6 0V4a3 3 0 0 0-3-3z" />
              <path d="M19 10v2a7 7 0 0 1-14 0v-2M12 19v4M8 23h8" stroke="rgba(60,60,67,0.4)" strokeWidth="2" strokeLinecap="round" fill="none" />
            </svg>
          </div>
        </div>
      </div>

      {/* Grid */}
      <div className="flex-1 overflow-y-auto pb-[72px]">
        <div className="grid grid-cols-3 gap-[2px]">
          {filteredItems.map((item) => {
            const isSelected = selected === item.id
            return (
              <button
                key={item.id}
                onClick={() => toggle(item.id)}
                className="relative aspect-square"
              >
                {/* Thumbnail */}
                {item.type === 'video' ? (
                  <img
                    src={item.thumb}
                    alt="video"
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div
                    className="w-full h-full"
                    style={{ background: item.bg }}
                  />
                )}

                {/* Duration badge for videos */}
                {item.type === 'video' && (
                  <span className="absolute bottom-1.5 left-2 text-white text-[11px] font-semibold drop-shadow">
                    {item.duration}
                  </span>
                )}

                {/* Selection indicator */}
                <div className="absolute top-1.5 right-1.5">
                  {isSelected ? (
                    <div className="w-6 h-6 rounded-full bg-[#409cff] border-2 border-white flex items-center justify-center shadow">
                      <svg width="12" height="10" viewBox="0 0 12 10" fill="none">
                        <path d="M1.5 5L4.5 8L10.5 1.5" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                    </div>
                  ) : (
                    <div className="w-6 h-6 rounded-full border-2 border-white shadow" />
                  )}
                </div>

                {/* Dim overlay when another item is selected */}
                {selected && !isSelected && (
                  <div className="absolute inset-0 bg-black/20" />
                )}
              </button>
            )
          })}
        </div>
      </div>

      {/* Show Selected button */}
      {selected && (
        <div className="absolute bottom-0 left-0 right-0 bg-white border-t border-[#f0f0f0] px-5 py-4">
          <button
            onClick={handleDone}
            className="text-[17px] font-semibold text-[#409cff] w-full text-center"
            style={{ fontFamily: '-apple-system, "SF Pro Text", system-ui, sans-serif' }}
          >
            Show Selected (1)
          </button>
        </div>
      )}
    </div>
  )
}

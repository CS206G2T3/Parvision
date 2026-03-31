import { useState, useRef, useCallback } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import vid1Png from '../assets/Bodyanalysed1_thumbnail.png'

const CHECKS = [
  'Full body visible in frame',
  'Good lighting on subject',
  'Camera positioned at hip height',
]

export default function SwingAnalyserSetupPage() {
  const navigate = useNavigate()
  const { state } = useLocation()
  const thumb = state?.thumb || vid1Png
  const video = state?.video || '/Bodyanalysed1.mp4'

  const containerRef = useRef(null)

  // Guide box: center (x,y) and size (w,h) as % of container
  const [guide, setGuide] = useState({ x: 50, y: 50, w: 62, h: 76 })
  const dragMode = useRef(null)
  const dragStart = useRef({ clientX: 0, clientY: 0, guide: null })

  const startDrag = (mode, e) => {
    e.preventDefault()
    e.stopPropagation()
    const clientX = e.touches ? e.touches[0].clientX : e.clientX
    const clientY = e.touches ? e.touches[0].clientY : e.clientY
    dragMode.current = mode
    dragStart.current = { clientX, clientY, guide: { ...guide } }
  }

  const onMove = useCallback((e) => {
    if (!dragMode.current) return
    const clientX = e.touches ? e.touches[0].clientX : e.clientX
    const clientY = e.touches ? e.touches[0].clientY : e.clientY
    const rect = containerRef.current?.getBoundingClientRect()
    if (!rect) return

    const dx = ((clientX - dragStart.current.clientX) / rect.width) * 100
    const dy = ((clientY - dragStart.current.clientY) / rect.height) * 100
    const g = dragStart.current.guide
    const MIN_W = 20
    const MIN_H = 20

    setGuide(() => {
      switch (dragMode.current) {
        case 'move': return { ...g, x: g.x + dx, y: g.y + dy }
        case 'tl':   return { x: g.x + dx / 2, y: g.y + dy / 2, w: Math.max(MIN_W, g.w - dx), h: Math.max(MIN_H, g.h - dy) }
        case 'tr':   return { x: g.x + dx / 2, y: g.y + dy / 2, w: Math.max(MIN_W, g.w + dx), h: Math.max(MIN_H, g.h - dy) }
        case 'bl':   return { x: g.x + dx / 2, y: g.y + dy / 2, w: Math.max(MIN_W, g.w - dx), h: Math.max(MIN_H, g.h + dy) }
        case 'br':   return { x: g.x + dx / 2, y: g.y + dy / 2, w: Math.max(MIN_W, g.w + dx), h: Math.max(MIN_H, g.h + dy) }
        default:     return g
      }
    })
  }, [])

  const onEnd = useCallback(() => { dragMode.current = null }, [])

  const isActive = dragMode.current !== null
  const isResizing = isActive && dragMode.current !== 'move'

  return (
    <div
      className="relative w-full bg-white flex flex-col min-h-[852px]"
      onMouseMove={onMove}
      onMouseUp={onEnd}
      onTouchMove={onMove}
      onTouchEnd={onEnd}
    >

      {/* Header */}
      <div className="flex items-center justify-between px-5 pt-14 pb-4 border-b border-[#f0f0f0] flex-shrink-0">
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
          Swing Analyser
        </p>
        <button
          onClick={() => navigate('/upload/processing', { state: { mode: 'swing-analyser', video, thumb } })}
          className="text-[15px] font-semibold text-[#248a3d]"
          style={{ fontFamily: '-apple-system, "SF Pro Text", system-ui, sans-serif' }}
        >
          Done ›
        </button>
      </div>

      <div className="flex-1 flex flex-col px-5 pt-4 pb-6">

        <p
          className="text-[17px] font-bold text-[#1c1c1e] leading-[22px]"
          style={{ fontFamily: '-apple-system, "SF Pro Display", system-ui, sans-serif' }}
        >
          Body Position Setup
        </p>
        <p
          className="text-[13px] text-[rgba(60,60,67,0.5)] mt-0.5 mb-4"
          style={{ fontFamily: '-apple-system, "SF Pro Text", system-ui, sans-serif' }}
        >
          Drag to move · drag corners to resize
        </p>

        {/* Static image with draggable/resizable guide overlay */}
        <div
          ref={containerRef}
          className="relative rounded-2xl overflow-hidden w-full select-none"
          style={{ aspectRatio: '9/16', touchAction: 'none' }}
        >
          <img
            src={vid1Png}
            alt="Swing frame"
            className="w-full h-full object-cover pointer-events-none"
            draggable={false}
          />
          <div className="absolute inset-0 bg-black/20 pointer-events-none" />

          {/* Guide box */}
          <div
            className="absolute"
            style={{
              left: `${guide.x}%`,
              top: `${guide.y}%`,
              width: `${guide.w}%`,
              height: `${guide.h}%`,
              transform: 'translate(-50%, -50%)',
              touchAction: 'none',
            }}
          >
            {/* Border + outer shadow */}
            <div
              className="absolute inset-0 rounded-xl cursor-grab active:cursor-grabbing"
              style={{
                border: `2px solid ${isActive ? '#f97316' : '#248a3d'}`,
                boxShadow: '0 0 0 9999px rgba(0,0,0,0.30)',
              }}
              onMouseDown={(e) => startDrag('move', e)}
              onTouchStart={(e) => startDrag('move', e)}
            />

            {/* Label */}
            <div className="absolute -top-7 left-1/2 -translate-x-1/2 whitespace-nowrap pointer-events-none">
              <div className={`px-3 py-1 rounded-full ${isResizing ? 'bg-[#f97316]' : 'bg-[#248a3d]'}`}>
                <p className="text-white text-[11px] font-semibold">
                  {isResizing ? 'Resizing...' : isActive ? 'Moving...' : 'Drag to reposition'}
                </p>
              </div>
            </div>

            {/* Corner resize handles — larger touch target with visible dot inside */}
            {[
              { corner: 'tl', style: { top: -14, left: -14 } },
              { corner: 'tr', style: { top: -14, right: -14 } },
              { corner: 'bl', style: { bottom: -14, left: -14 } },
              { corner: 'br', style: { bottom: -14, right: -14 } },
            ].map(({ corner, style }) => (
              <div
                key={corner}
                className="absolute w-7 h-7 flex items-center justify-center z-10 cursor-pointer"
                style={{ ...style, touchAction: 'none' }}
                onMouseDown={(e) => startDrag(corner, e)}
                onTouchStart={(e) => startDrag(corner, e)}
              >
                <div className="w-5 h-5 rounded-full bg-white border-[2.5px] border-[#248a3d] shadow-md" />
              </div>
            ))}
          </div>
        </div>

        {/* Checklist */}
        <div className="mt-5 space-y-3">
          {CHECKS.map((check, i) => (
            <div key={i} className="flex items-center gap-3">
              <div className="w-5 h-5 rounded-full bg-[#248a3d] flex items-center justify-center flex-shrink-0">
                <svg width="10" height="8" viewBox="0 0 10 8" fill="none">
                  <path d="M1 4L3.5 6.5L9 1" stroke="white" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </div>
              <p
                className="text-[14px] text-[#1c1c1e]"
                style={{ fontFamily: '-apple-system, "SF Pro Text", system-ui, sans-serif' }}
              >
                {check}
              </p>
            </div>
          ))}
        </div>

      </div>
    </div>
  )
}

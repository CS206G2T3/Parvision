import { useEffect, useState } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'

export default function UploadProcessingPage() {
  const navigate = useNavigate()
  const { state } = useLocation()
  const mode = state?.mode || 'ball-tracer'
  const video = state?.video || null
  const thumb = state?.thumb || null
  const isBallTracer = mode === 'ball-tracer'

  const [dotCount, setDotCount] = useState(1)
  const [ballScale, setBallScale] = useState(0.3)

  // Animate the ball growing
  useEffect(() => {
    const scales = [0.3, 0.5, 0.75, 1.0]
    let i = 0
    const interval = setInterval(() => {
      i = (i + 1) % scales.length
      setBallScale(scales[i])
    }, 600)
    return () => clearInterval(interval)
  }, [])

  // Animate dots
  useEffect(() => {
    const interval = setInterval(() => {
      setDotCount((d) => (d % 3) + 1)
    }, 500)
    return () => clearInterval(interval)
  }, [])

  // Auto-navigate to results after 3 seconds
  useEffect(() => {
    const timer = setTimeout(() => {
      navigate('/upload/results', { state: { mode, video, thumb } })
    }, 3000)
    return () => clearTimeout(timer)
  }, [navigate, mode, video, thumb])

  return (
    <div className="relative w-full bg-[#248a3d] flex flex-col items-center justify-center min-h-[852px]">

      {/* Animated ball */}
      <div
        className="w-32 h-32 bg-white rounded-full flex items-center justify-center transition-transform duration-500 ease-in-out mb-10"
        style={{ transform: `scale(${ballScale})` }}
      >
        {isBallTracer ? (
          <div className="w-20 h-20 bg-white rounded-full border-4 border-[#248a3d]/30" />
        ) : (
          <span className="text-5xl">🏌️</span>
        )}
      </div>

      {/* Text */}
      <p
        className="text-white text-[18px] font-bold uppercase tracking-[2px] text-center"
        style={{ fontFamily: '-apple-system, "SF Pro Display", system-ui, sans-serif' }}
      >
        {isBallTracer ? 'Generating Ball Tracer' : 'Analysing Swing'}
        {'.'.repeat(dotCount)}
      </p>
      <p
        className="text-white/60 text-[13px] mt-3 text-center px-10 leading-[18px]"
        style={{ fontFamily: '-apple-system, "SF Pro Text", system-ui, sans-serif' }}
      >
        {isBallTracer
          ? 'Get Parvision Pro For Unlimited Swing Analysis'
          : 'AI is reviewing your swing form...'}
      </p>
    </div>
  )
}

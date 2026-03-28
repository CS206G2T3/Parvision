import { useEffect, useState } from 'react'
import parVisionLogo from '../assets/parvision_logo.png'

/**
 * SplashScreen
 * Shows for `duration` ms, then calls onFinish() so the parent
 * can switch to the main app. Fades out smoothly before unmounting.
 */
export default function SplashScreen({ onFinish, duration = 2200 }) {
  const [fadeOut, setFadeOut] = useState(false)

  useEffect(() => {
    // Start fade-out slightly before the full duration ends
    const fadeTimer = setTimeout(() => setFadeOut(true), duration - 500)
    // Tell parent we're done after full duration
    const doneTimer = setTimeout(() => onFinish(), duration)

    return () => {
      clearTimeout(fadeTimer)
      clearTimeout(doneTimer)
    }
  }, [duration, onFinish])

  return (
    <div
      className="fixed inset-0 flex flex-col items-center justify-center z-50 transition-opacity duration-500"
      style={{
        background: 'linear-gradient(160deg, #ffffff 0%, #f0faf3 50%, #e6f5ea 100%)',
        opacity: fadeOut ? 0 : 1,
      }}
    >
      {/* Logo */}
      <div
        className="flex items-center justify-center transition-transform duration-700"
        style={{
          transform: fadeOut ? 'scale(0.95)' : 'scale(1)',
        }}
      >
        <img
          src={parVisionLogo}
          alt="ParVision — AI Golf Coaching"
          className="w-72 h-72 object-contain drop-shadow-lg"
        />
      </div>

      {/* Loading dots */}
      {!fadeOut && (
        <div className="flex gap-2 mt-8">
          {[0, 1, 2].map((i) => (
            <div
              key={i}
              className="w-2 h-2 rounded-full bg-[#248a3d]"
              style={{
                animation: `bounce 1.2s ease-in-out ${i * 0.2}s infinite`,
              }}
            />
          ))}
        </div>
      )}

      <style>{`
        @keyframes bounce {
          0%, 80%, 100% { transform: scale(0.6); opacity: 0.4; }
          40%            { transform: scale(1);   opacity: 1;   }
        }
      `}</style>
    </div>
  )
}

import { useEffect, useState } from 'react'
import parVisionLogo from '../assets/parvision_logo.png'

/**
 * SplashScreen
 * Shows for `duration` ms, then calls onFinish() so the parent
 * can switch to the main app. Fades out smoothly before unmounting.
 */
export default function SplashScreen({ onFinish, duration = 6000 }) {
  const [fadeOut, setFadeOut] = useState(false)
  const [entered, setEntered] = useState(false)

  useEffect(() => {
    // Trigger entrance animation on next tick
    const enterTimer = setTimeout(() => setEntered(true), 50)
    // Start fade-out slightly before the full duration ends
    const fadeTimer = setTimeout(() => setFadeOut(true), duration - 600)
    // Tell parent we're done after full duration
    const doneTimer = setTimeout(() => onFinish(), duration)

    return () => {
      clearTimeout(enterTimer)
      clearTimeout(fadeTimer)
      clearTimeout(doneTimer)
    }
  }, [duration, onFinish])

  return (
    <div
      className="absolute inset-0 flex flex-col items-center justify-center z-50 overflow-hidden"
      style={{
        background: '#ffffff',
        opacity: fadeOut ? 0 : 1,
        transition: 'opacity 0.6s ease-in-out',
      }}
    >
      {/* Logo + rings — all centered together */}
      <div
        style={{
          position: 'relative',
          width: 288,
          height: 288,
          transform: entered && !fadeOut ? 'scale(1) translateY(0)' : fadeOut ? 'scale(0.94) translateY(4px)' : 'scale(0.82) translateY(16px)',
          opacity: entered && !fadeOut ? 1 : fadeOut ? 0 : 0,
          transition: entered ? 'transform 0.75s cubic-bezier(0.34, 1.56, 0.64, 1), opacity 0.6s ease' : 'none',
        }}
      >
        {/* Rings — absolutely centered on the logo */}
        {[
          { size: 340, border: '2px solid rgba(36,138,61,0.30)', delay: '0s' },
          { size: 460, border: '2px solid rgba(36,138,61,0.18)', delay: '0.5s' },
          { size: 580, border: '1.5px solid rgba(36,138,61,0.09)', delay: '1s' },
        ].map(({ size, border, delay }) => (
          <div
            key={size}
            className="rounded-full"
            style={{
              position: 'absolute',
              width: size,
              height: size,
              top: '50%',
              left: '50%',
              transform: 'translate(-50%, -50%)',
              border,
              animation: `ringPulse 3s ease-in-out ${delay} infinite`,
              pointerEvents: 'none',
            }}
          />
        ))}

        {/* Glow */}
        <div
          className="rounded-full"
          style={{
            position: 'absolute',
            width: 280,
            height: 280,
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            background: 'radial-gradient(circle, rgba(36,138,61,0.10) 0%, transparent 70%)',
            filter: 'blur(24px)',
            animation: 'glowPulse 2.5s ease-in-out infinite',
            pointerEvents: 'none',
          }}
        />

        {/* Logo circle */}
        <div
          style={{
            width: 288,
            height: 288,
            borderRadius: '50%',
            overflow: 'hidden',
            filter: 'drop-shadow(0 4px 16px rgba(0,0,0,0.08))',
            position: 'relative',
          }}
        >
          <img
            src={parVisionLogo}
            alt="ParVision — AI Golf Coaching"
            style={{ width: '100%', height: '100%', objectFit: 'cover' }}
          />
        </div>
      </div>

      {/* Tagline */}
      <div
        style={{
          opacity: entered && !fadeOut ? 1 : 0,
          transform: entered && !fadeOut ? 'translateY(0)' : 'translateY(8px)',
          transition: 'opacity 0.7s ease 0.45s, transform 0.7s ease 0.45s',
          marginTop: '1.25rem',
        }}
      >
        <p
          style={{
            fontFamily: 'system-ui, -apple-system, sans-serif',
            fontSize: '0.75rem',
            fontWeight: 700,
            letterSpacing: '0.25em',
            textTransform: 'uppercase',
            color: '#248a3d',
            opacity: 1,
            textShadow: '0 0 20px rgba(36,138,61,0.2)',
          }}
        >
          AI Golf Coaching
        </p>
      </div>

      {/* Progress bar */}
      {!fadeOut && (
        <div
          style={{
            position: 'absolute',
            bottom: '2.5rem',
            width: '6rem',
            height: '2px',
            borderRadius: '999px',
            background: 'rgba(36,138,61,0.15)',
            overflow: 'hidden',
            opacity: entered ? 1 : 0,
            transition: 'opacity 0.5s ease 0.8s',
          }}
        >
          <div
            style={{
              height: '100%',
              borderRadius: '999px',
              background: 'linear-gradient(90deg, #248a3d, #4caf72)',
              animation: `progressFill ${duration - 800}ms cubic-bezier(0.4, 0, 0.6, 1) 0.3s forwards`,
              width: '0%',
            }}
          />
        </div>
      )}

      <style>{`
        @keyframes ringPulse {
          0%, 100% { transform: translate(-50%, -50%) scale(1);    opacity: 1; }
          50%       { transform: translate(-50%, -50%) scale(1.06); opacity: 0.35; }
        }
        @keyframes glowPulse {
          0%, 100% { opacity: 0.7; transform: translate(-50%, -50%) scale(1); }
          50%       { opacity: 1;   transform: translate(-50%, -50%) scale(1.1); }
        }
        @keyframes progressFill {
          from { width: 0%; }
          to   { width: 100%; }
        }
      `}</style>
    </div>
  )
}

import { useNavigate, useLocation } from 'react-router-dom'
import { useState, useEffect, useRef } from 'react'

let cachedBubbleX = null

function HomeIcon({ active }) {
  return (
    <svg width="26" height="26" viewBox="0 0 24 24" fill="none">
      <path d="M3 12L12 3L21 12V21H15V15H9V21H3V12Z"
        stroke={active ? 'white' : 'rgba(60,60,67,0.4)'}
        strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
        fill={active ? 'rgba(255,255,255,0.3)' : 'none'} />
    </svg>
  )
}

function VideoIcon({ active }) {
  return (
    <svg width="26" height="26" viewBox="0 0 24 24" fill="none">
      <rect x="2" y="6" width="14" height="12" rx="2"
        stroke={active ? 'white' : 'rgba(60,60,67,0.4)'}
        strokeWidth="2" fill={active ? 'rgba(255,255,255,0.3)' : 'none'} />
      <path d="M16 10L22 7V17L16 14V10Z"
        stroke={active ? 'white' : 'rgba(60,60,67,0.4)'}
        strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
        fill={active ? 'rgba(255,255,255,0.3)' : 'none'} />
    </svg>
  )
}

function CommunitiesIcon({ active }) {
  return (
    <svg width="26" height="26" viewBox="0 0 24 24" fill="none">
      <circle cx="9" cy="8" r="3"
        stroke={active ? 'white' : 'rgba(60,60,67,0.4)'}
        strokeWidth="2" fill={active ? 'rgba(255,255,255,0.3)' : 'none'} />
      <circle cx="17" cy="8" r="2.5"
        stroke={active ? 'white' : 'rgba(60,60,67,0.4)'}
        strokeWidth="1.8" fill={active ? 'rgba(255,255,255,0.25)' : 'none'} />
      <path d="M3 20C3 17.239 5.686 15 9 15C12.314 15 15 17.239 15 20"
        stroke={active ? 'white' : 'rgba(60,60,67,0.4)'}
        strokeWidth="2" strokeLinecap="round" fill="none" />
      <path d="M15 15.5C16.083 15.179 17.394 15.5 18.5 16.5C19.5 17.4 19.9 18.6 20 20"
        stroke={active ? 'white' : 'rgba(60,60,67,0.4)'}
        strokeWidth="1.8" strokeLinecap="round" fill="none" />
    </svg>
  )
}

function ProfileIcon({ active }) {
  return (
    <svg width="26" height="26" viewBox="0 0 24 24" fill="none">
      <circle cx="12" cy="8" r="4"
        stroke={active ? 'white' : 'rgba(60,60,67,0.4)'}
        strokeWidth="2" fill={active ? 'rgba(255,255,255,0.3)' : 'none'} />
      <path d="M4 20C4 16.686 7.582 14 12 14C16.418 14 20 16.686 20 20"
        stroke={active ? 'white' : 'rgba(60,60,67,0.4)'}
        strokeWidth="2" strokeLinecap="round" />
    </svg>
  )
}

const NAV_ITEMS = [
  { path: '/home',      Icon: HomeIcon },
  { path: '/upload',    Icon: VideoIcon },
  { path: '/community', Icon: CommunitiesIcon },
  { path: '/profile',   Icon: ProfileIcon },
]

const BUBBLE_SIZE = 58

export default function BottomNav() {
  const navigate     = useNavigate()
  const { pathname } = useLocation()

  const activeIndex = NAV_ITEMS.findIndex(
    ({ path }) => pathname === path || pathname.startsWith(path + '/')
  )

  const navRef   = useRef(null)
  const itemRefs = useRef([])

  const [bubbleX, setBubbleX] = useState(cachedBubbleX)
  const [ready, setReady]     = useState(cachedBubbleX !== null)

  const measure = (index) => {
    const item = itemRefs.current[index]
    const nav  = navRef.current
    if (!item || !nav) return null
    const ir = item.getBoundingClientRect()
    const nr = nav.getBoundingClientRect()
    return ir.left - nr.left + ir.width / 2 - BUBBLE_SIZE / 2
  }

  useEffect(() => {
    if (cachedBubbleX !== null) return
    requestAnimationFrame(() => {
      const x = measure(activeIndex)
      if (x !== null) {
        cachedBubbleX = x
        setBubbleX(x)
        setReady(true)
      }
    })
  }, [])

  useEffect(() => {
    if (!ready) return
    requestAnimationFrame(() => {
      const x = measure(activeIndex)
      if (x !== null) {
        cachedBubbleX = x
        setBubbleX(x)
      }
    })
  }, [activeIndex, ready])

  return (
    <>
      {/* Spacer so page content doesn't hide behind the fixed bar */}
      <div style={{ height: 80 }} />

      {/* Fixed bar — constrained to phone frame on desktop via .bottom-nav-bar */}
      <div
        className="bottom-nav-bar"
        style={{
          zIndex: 100,
          backgroundColor: 'white',
          borderTop: '1px solid #f0f0f0',
          boxShadow: '0 -2px 12px rgba(0,0,0,0.06)',
        }}
      >
        <div
          ref={navRef}
          className="relative flex items-center justify-around px-2 overflow-visible"
          style={{ height: 60 }}
        >
          {/* Floating bubble */}
          <div
            className="absolute rounded-full bg-[#248a3d] pointer-events-none"
            style={{
              width:      BUBBLE_SIZE,
              height:     BUBBLE_SIZE,
              left:       bubbleX ?? 0,
              top:        '50%',
              transform:  'translateY(-68%)',
              opacity:    ready ? 1 : 0,
              transition: ready ? 'left 0.4s cubic-bezier(0.34, 1.3, 0.64, 1)' : 'none',
              boxShadow:  '0 4px 16px rgba(36,138,61,0.4)',
            }}
          />

          {NAV_ITEMS.map(({ path, Icon }, i) => {
            const active = i === activeIndex
            return (
              <button
                key={path}
                ref={el => itemRefs.current[i] = el}
                onClick={() => navigate(path)}
                className="relative flex items-center justify-center flex-1 h-full z-10"
                style={{
                  transform:  active ? 'translateY(-8px)' : 'translateY(0px)',
                  transition: 'transform 0.4s cubic-bezier(0.34, 1.3, 0.64, 1)',
                }}
              >
                <Icon active={active} />
              </button>
            )
          })}
        </div>
      </div>
    </>
  )
}
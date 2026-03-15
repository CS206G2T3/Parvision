import { useNavigate, useParams } from 'react-router-dom'

import { IMG_ARROW_BACK } from '../icons'

// Mock club data — replace with API
const CLUB_DATA = {
  drivers: {
    label: 'Drivers',
    icon: '🏌️',
    items: [
      { id: 1, name: 'Inesis 100 Right Handed Graphite', brand: 'Decathlon', description: 'My first ever driver, hope to take on...' },
      { id: 2, name: 'Callaway Elyte Driver', brand: 'Callaway', description: 'Premium driver with adjustable loft...' },
    ],
  },
  irons: {
    label: 'Irons',
    icon: '⛳',
    items: [
      { id: 1, name: 'Ping G430 Iron Set', brand: 'Ping', description: '7-PW iron set, forgiving and consistent...' },
      { id: 2, name: 'TaylorMade Stealth 2 Iron', brand: 'TaylorMade', description: 'Low CG for high launch angle...' },
      { id: 3, name: 'Titleist T300 Iron', brand: 'Titleist', description: 'Forged face for incredible feel...' },
      { id: 4, name: 'Cobra AEROJET Iron', brand: 'Cobra', description: 'Aero-inspired design for speed...' },
    ],
  },
  wedges: {
    label: 'Wedges',
    icon: '🥏',
    items: [
      { id: 1, name: 'Vokey SM9 52°', brand: 'Titleist', description: 'Gap wedge, precise spin control...' },
      { id: 2, name: 'Callaway Jaws MD5 56°', brand: 'Callaway', description: 'Sand wedge with aggressive grooves...' },
      { id: 3, name: 'Cleveland RTX 6 60°', brand: 'Cleveland', description: 'Lob wedge for short game shots...' },
    ],
  },
  putters: {
    label: 'Putters',
    icon: '🏒',
    items: [
      { id: 1, name: 'Scotty Cameron Special Select', brand: 'Scotty Cameron', description: 'Tour-proven mallet putter...' },
      { id: 2, name: 'Odyssey White Hot OG', brand: 'Odyssey', description: 'Classic White Hot insert for feel...' },
      { id: 3, name: 'TaylorMade Spider GT', brand: 'TaylorMade', description: 'High MOI spider design...' },
      { id: 4, name: 'Ping Anser 2', brand: 'Ping', description: 'Blade putter, trusted by tour pros...' },
      { id: 5, name: 'Evnroll ER2V', brand: 'Evnroll', description: 'Sweet-face technology for true roll...' },
    ],
  },
  miscellaneous: {
    label: 'Miscellaneous',
    icon: '🎒',
    items: [
      { id: 1, name: 'Golf Bag Pro', brand: 'TaylorMade', description: 'Lightweight stand bag...' },
      { id: 2, name: 'Golf Glove L', brand: 'FootJoy', description: 'Left hand glove, premium leather...' },
    ],
  },
}

function ClubRow({ name, brand, description }) {
  return (
    <div className="flex items-center gap-4 px-4 py-4">
      {/* Club image placeholder */}
      <div className="w-12 h-12 bg-[#f4f4f4] rounded-xl flex items-center justify-center flex-shrink-0">
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
          <path d="M5 20L12 4L19 20" stroke="#c7c7cc" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
          <path d="M8 14H16" stroke="#c7c7cc" strokeWidth="1.5" strokeLinecap="round" />
        </svg>
      </div>
      <div className="flex-1 min-w-0">
        <p
          className="text-[15px] font-semibold text-[#1c1c1e] leading-[20px] truncate"
          style={{ fontFamily: '-apple-system, "SF Pro Text", system-ui, sans-serif' }}
        >
          {name}
        </p>
        <p
          className="text-[12px] text-[#248a3d] font-medium leading-[16px] mt-0.5"
          style={{ fontFamily: '-apple-system, "SF Pro Text", system-ui, sans-serif' }}
        >
          {brand}
        </p>
        <p
          className="text-[12px] text-[rgba(60,60,67,0.5)] leading-[16px] mt-0.5 truncate"
          style={{ fontFamily: '-apple-system, "SF Pro Text", system-ui, sans-serif' }}
        >
          {description}
        </p>
      </div>
      <svg width="8" height="14" viewBox="0 0 8 14" fill="none" className="flex-shrink-0">
        <path d="M1 1L7 7L1 13" stroke="rgba(60,60,67,0.4)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    </div>
  )
}

function Divider() {
  return <div className="h-px bg-[#f0f0f0] ml-[68px]" />
}

export default function ClubDetailPage() {
  const navigate = useNavigate()
  const { category } = useParams()
  const data = CLUB_DATA[category] || CLUB_DATA.drivers

  return (
    <div className="relative w-full bg-[#f4f4f4] flex flex-col min-h-[852px]">

      {/* Header */}
      <div className="bg-white pt-14 pb-4 px-5 flex-shrink-0">
        <button
          onClick={() => navigate('/collection')}
          className="flex items-center gap-2 mb-4"
          aria-label="Go back"
        >
          <img src={IMG_ARROW_BACK} alt="Back" className="w-5 h-5 object-contain" />
        </button>

        <div className="flex items-center gap-3">
          <span className="text-[28px]">{data.icon}</span>
          <div>
            <h1
              className="text-[22px] font-bold text-[#1c1c1e] leading-[28px]"
              style={{ fontFamily: '-apple-system, "SF Pro Display", system-ui, sans-serif' }}
            >
              {data.label}
              <span className="text-[16px] font-medium text-[rgba(60,60,67,0.5)] ml-2">
                ({data.items.length})
              </span>
            </h1>
          </div>
        </div>
      </div>

      {/* Club list */}
      <div className="flex-1 overflow-y-auto pb-8 mt-4 px-4">
        <div className="bg-white rounded-2xl overflow-hidden">
          {data.items.map((item, i) => (
            <div key={item.id}>
              <ClubRow {...item} />
              {i < data.items.length - 1 && <Divider />}
            </div>
          ))}
        </div>
      </div>

    </div>
  )
}

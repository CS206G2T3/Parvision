import { useState } from 'react'
import { useNavigate } from 'react-router-dom'

import { IMG_ARROW_BACK, IMG_ARROW_IMPORT, IMG_WAREHOUSE, IMG_SPORTS_GOLF, IMG_SCANNER } from '../icons'

// Mock equipment list — replace with API data
const EQUIPMENT = [
  { id: 1, name: 'Driver TM-R15', club: 'Fairway 1', icon: IMG_SPORTS_GOLF },
  { id: 2, name: 'Iron Set 7-PW', club: 'Fairway 1', icon: IMG_SPORTS_GOLF },
  { id: 3, name: 'Golf Bag Pro', club: 'Storage A', icon: IMG_WAREHOUSE },
  { id: 4, name: 'Putter Scotty', club: 'Fairway 3', icon: IMG_SPORTS_GOLF },
  { id: 5, name: 'Wedge 56°', club: 'Storage B', icon: IMG_WAREHOUSE },
]

function EquipmentCard({ name, club, icon, selected, onToggle }) {
  return (
    <button
      onClick={onToggle}
      className={`w-full flex items-center justify-between px-4 py-3 rounded-2xl border-2 transition-all ${
        selected
          ? 'border-[#248a3d] bg-[#e5f8e9]'
          : 'border-transparent bg-[#f4f4f4]'
      }`}
    >
      <div className="flex items-center gap-3">
        <div className="bg-[#1c1c1e] flex items-center justify-center w-8 h-8 rounded-lg flex-shrink-0">
          <img src={icon} alt={name} className="w-[14px] h-[14px] object-contain" />
        </div>
        <div className="text-left">
          <p
            className="text-[15px] font-semibold text-[#1c1c1e] leading-[20px]"
            style={{ fontFamily: '-apple-system, "SF Pro Text", system-ui, sans-serif' }}
          >
            {name}
          </p>
          <p
            className="text-[12px] text-[rgba(60,60,67,0.6)] leading-[16px]"
            style={{ fontFamily: '-apple-system, "SF Pro Text", system-ui, sans-serif' }}
          >
            {club}
          </p>
        </div>
      </div>
      <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center flex-shrink-0 ${
        selected ? 'border-[#248a3d] bg-[#248a3d]' : 'border-[rgba(60,60,67,0.3)]'
      }`}>
        {selected && (
          <svg width="12" height="9" viewBox="0 0 12 9" fill="none">
            <path d="M1 4.5L4.5 8L11 1" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        )}
      </div>
    </button>
  )
}

export default function CheckInPage() {
  const navigate = useNavigate()
  const [selected, setSelected] = useState(new Set())
  const [confirmed, setConfirmed] = useState(false)

  const toggle = (id) => {
    setSelected((prev) => {
      const next = new Set(prev)
      next.has(id) ? next.delete(id) : next.add(id)
      return next
    })
  }

  const handleConfirm = () => {
    // TODO: call check-in API with selected IDs
    setConfirmed(true)
    setTimeout(() => navigate('/home'), 1500)
  }

  return (
    <div className="relative w-full bg-white flex flex-col min-h-[852px]">

      {/* Header */}
      <div className="relative w-full bg-white pt-14 px-6 pb-4 flex-shrink-0">
        <button
          onClick={() => navigate('/home')}
          className="mb-4 w-6 h-6 flex items-center justify-center"
          aria-label="Go back"
        >
          <img src={IMG_ARROW_BACK} alt="Back" className="w-full h-full object-contain" />
        </button>

        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-[#409cff] rounded-full flex items-center justify-center flex-shrink-0">
            <div className="-rotate-135 w-4 h-4 flex items-center justify-center">
              <img src={IMG_ARROW_IMPORT} alt="Check-in" className="w-full h-full object-contain" />
            </div>
          </div>
          <h1
            className="text-[28px] font-bold leading-[34px] tracking-[0.374px] text-[#1c1c1e]"
            style={{ fontFamily: '-apple-system, "SF Pro Display", system-ui, sans-serif' }}
          >
            Check-in
          </h1>
        </div>
        <p
          className="mt-1 text-[15px] text-[rgba(60,60,67,0.6)] leading-[22px]"
          style={{ fontFamily: '-apple-system, "SF Pro Text", system-ui, sans-serif' }}
        >
          Select the equipment you are returning.
        </p>
      </div>

      {/* Equipment list */}
      <div className="flex-1 overflow-y-auto px-6 pb-[120px]">
        <div className="flex flex-col gap-3">
          {EQUIPMENT.map((item) => (
            <EquipmentCard
              key={item.id}
              {...item}
              selected={selected.has(item.id)}
              onToggle={() => toggle(item.id)}
            />
          ))}
        </div>
      </div>

      {/* Confirm button */}
      <div className="absolute bottom-0 left-0 right-0 px-6 pb-8 bg-white pt-4">
        {confirmed ? (
          <div className="w-full h-[56px] bg-[#e5f8e9] rounded-[16px] flex items-center justify-center gap-2">
            <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
              <path d="M4 10.5L8 14.5L16 6.5" stroke="#248a3d" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
            <span
              className="text-[18px] font-semibold text-[#248a3d]"
              style={{ fontFamily: '-apple-system, "SF Pro Display", system-ui, sans-serif' }}
            >
              Checked In!
            </span>
          </div>
        ) : (
          <button
            onClick={handleConfirm}
            disabled={selected.size === 0}
            className={`w-full h-[56px] rounded-[16px] flex items-center justify-center transition-opacity ${
              selected.size > 0 ? 'bg-[#248a3d] active:opacity-80' : 'bg-[#c7c7cc]'
            }`}
          >
            <span
              className="text-[20px] font-semibold text-white"
              style={{ fontFamily: '-apple-system, "SF Pro Display", system-ui, sans-serif' }}
            >
              Confirm Check-in{selected.size > 0 ? ` (${selected.size})` : ''}
            </span>
          </button>
        )}
      </div>
    </div>
  )
}

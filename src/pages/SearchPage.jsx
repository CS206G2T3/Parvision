import { useState } from 'react'
import { useNavigate } from 'react-router-dom'

const IMG_HOME_ICON = 'https://www.figma.com/api/mcp/asset/5bc9bbe7-b586-48da-b84a-3ce14bf60e4b'
const IMG_SEARCH_ICON = 'https://www.figma.com/api/mcp/asset/dcf5294f-c990-42b1-8668-cea7358acbf2'
const IMG_SCANNER = 'https://www.figma.com/api/mcp/asset/cdc9525f-4e22-4fcd-bf9c-e98a524cacd4'
const IMG_TAKE_OFF_PLAY = 'https://www.figma.com/api/mcp/asset/da2d40a8-6cdc-4b63-a5f8-c333b6fbbe4e'
const IMG_WAREHOUSE = 'https://www.figma.com/api/mcp/asset/f8870019-6cee-42af-bdef-6c309c498110'
const IMG_SPORTS_GOLF = 'https://www.figma.com/api/mcp/asset/dbd6b671-258d-41d8-b337-e40371edb4a8'
const IMG_RUNNING_ERRORS = 'https://www.figma.com/api/mcp/asset/cd37a274-1efe-4338-a22a-ebd9dc17a86f'
const IMG_DIRECTIONS = 'https://www.figma.com/api/mcp/asset/ab67a061-c891-4479-8b6d-4550d6f97c1e'

// Mock data — replace with API data
const ALL_ITEMS = [
  { id: 1, name: 'Driver TM-R15', status: 'Playing', statusColor: 'bg-[#e5f8e9]', statusText: 'text-[#248a3d]', icon: IMG_SPORTS_GOLF },
  { id: 2, name: 'Iron Set 7-PW', status: 'Storage', statusColor: 'bg-[#f8e0be]', statusText: 'text-[#c47a1e]', icon: IMG_WAREHOUSE },
  { id: 3, name: 'Putter Scotty', status: 'Playing', statusColor: 'bg-[#e5f8e9]', statusText: 'text-[#248a3d]', icon: IMG_SPORTS_GOLF },
  { id: 4, name: 'Golf Bag Pro', status: 'Overdue', statusColor: 'bg-[#ffebe5]', statusText: 'text-[#ff3b30]', icon: IMG_RUNNING_ERRORS },
  { id: 5, name: 'Wedge 56°', status: 'Take Off', statusColor: 'bg-[#eaeaea]', statusText: 'text-[#38383a]', icon: IMG_DIRECTIONS },
  { id: 6, name: 'Fairway Wood 3W', status: 'Storage', statusColor: 'bg-[#f8e0be]', statusText: 'text-[#c47a1e]', icon: IMG_WAREHOUSE },
  { id: 7, name: 'Hybrid 4H', status: 'Playing', statusColor: 'bg-[#e5f8e9]', statusText: 'text-[#248a3d]', icon: IMG_SPORTS_GOLF },
  { id: 8, name: 'Golf Glove L', status: 'Overdue', statusColor: 'bg-[#ffebe5]', statusText: 'text-[#ff3b30]', icon: IMG_RUNNING_ERRORS },
]

function ItemRow({ name, status, statusColor, statusText, icon }) {
  return (
    <div className="flex items-center justify-between px-4 py-3 bg-white rounded-2xl shadow-sm border border-[#f4f4f4]">
      <div className="flex items-center gap-3">
        <div className="bg-[#1c1c1e] flex items-center justify-center w-8 h-8 rounded-lg flex-shrink-0">
          <img src={icon} alt={status} className="w-[14px] h-[14px] object-contain" />
        </div>
        <span
          className="text-[15px] font-medium text-[#1c1c1e] leading-[22px]"
          style={{ fontFamily: '-apple-system, "SF Pro Text", system-ui, sans-serif' }}
        >
          {name}
        </span>
      </div>
      <span className={`text-[12px] font-semibold px-3 py-1 rounded-full ${statusColor} ${statusText}`}>
        {status}
      </span>
    </div>
  )
}

export default function SearchPage() {
  const navigate = useNavigate()
  const [query, setQuery] = useState('')

  const filtered = ALL_ITEMS.filter((item) =>
    item.name.toLowerCase().includes(query.toLowerCase()) ||
    item.status.toLowerCase().includes(query.toLowerCase())
  )

  return (
    <div className="relative w-full bg-white flex flex-col min-h-[852px]">

      {/* Header */}
      <div className="w-full bg-white pt-14 px-6 pb-4 flex-shrink-0">
        <h1
          className="text-[28px] font-bold leading-[34px] tracking-[0.374px] text-[#1c1c1e] mb-4"
          style={{ fontFamily: '-apple-system, "SF Pro Display", system-ui, sans-serif' }}
        >
          Search
        </h1>

        {/* Search bar */}
        <div className="flex items-center bg-[#f4f4f4] rounded-[14px] h-[44px] px-4 gap-2">
          <img src={IMG_SEARCH_ICON} alt="Search" className="w-5 h-5 object-contain opacity-50 flex-shrink-0" />
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search equipment, status..."
            autoFocus
            className="flex-1 bg-transparent text-[16px] text-[#1c1c1e] placeholder-[rgba(60,60,67,0.4)] focus:outline-none"
            style={{ fontFamily: 'Inter, system-ui, sans-serif' }}
          />
          {query.length > 0 && (
            <button
              onClick={() => setQuery('')}
              className="text-[rgba(60,60,67,0.5)] text-[18px] leading-none flex-shrink-0"
              aria-label="Clear"
            >
              ×
            </button>
          )}
        </div>
      </div>

      {/* Results */}
      <div className="flex-1 overflow-y-auto px-6 pb-[100px]">
        {query.length === 0 ? (
          <div>
            <p
              className="text-[13px] font-semibold uppercase tracking-[0.5px] text-[rgba(60,60,67,0.4)] mb-3"
              style={{ fontFamily: '-apple-system, "SF Pro Text", system-ui, sans-serif' }}
            >
              All Equipment
            </p>
            <div className="flex flex-col gap-2">
              {ALL_ITEMS.map((item) => <ItemRow key={item.id} {...item} />)}
            </div>
          </div>
        ) : filtered.length > 0 ? (
          <div>
            <p
              className="text-[13px] font-semibold uppercase tracking-[0.5px] text-[rgba(60,60,67,0.4)] mb-3"
              style={{ fontFamily: '-apple-system, "SF Pro Text", system-ui, sans-serif' }}
            >
              {filtered.length} result{filtered.length !== 1 ? 's' : ''}
            </p>
            <div className="flex flex-col gap-2">
              {filtered.map((item) => <ItemRow key={item.id} {...item} />)}
            </div>
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center pt-16 gap-3">
            <div className="w-16 h-16 bg-[#f4f4f4] rounded-full flex items-center justify-center">
              <img src={IMG_SEARCH_ICON} alt="No results" className="w-8 h-8 object-contain opacity-30" />
            </div>
            <p
              className="text-[17px] font-semibold text-[#1c1c1e]"
              style={{ fontFamily: '-apple-system, "SF Pro Text", system-ui, sans-serif' }}
            >
              No results for "{query}"
            </p>
            <p
              className="text-[15px] text-[rgba(60,60,67,0.5)] text-center"
              style={{ fontFamily: '-apple-system, "SF Pro Text", system-ui, sans-serif' }}
            >
              Try searching for a different name or status.
            </p>
          </div>
        )}
      </div>

      {/* Bottom nav */}
      <div className="absolute bottom-0 left-0 right-0 px-6 pb-[10px]">
        <div className="relative h-[69px]">
          <div className="absolute inset-[14px_0_0_0] bg-[#f4f4f4] rounded-[50px] shadow-nav" />

          {/* Home tab */}
          <button
            onClick={() => navigate('/home')}
            className="absolute left-[10%] bottom-[12px] flex flex-col items-center gap-1"
          >
            <img src={IMG_HOME_ICON} alt="Home" className="w-6 h-6 object-contain opacity-50" />
            <span
              className="text-[10px] font-semibold tracking-[-0.24px] text-[rgba(60,60,67,0.6)]"
              style={{ fontFamily: '-apple-system, "SF Pro Text", system-ui, sans-serif' }}
            >
              Home
            </span>
          </button>

          {/* Scanner FAB */}
          <div className="absolute left-1/2 -translate-x-1/2 top-0 w-16 h-16 flex items-center justify-center">
            <div className="w-16 h-16 rounded-[40px] shadow-lg relative">
              <div className="absolute inset-0 bg-white rounded-[32px] shadow-[1px_1px_10px_0px_rgba(0,0,0,0.2)]" />
              <div className="absolute inset-[3px] bg-[#248a3d] rounded-[32px] flex items-center justify-center">
                <img src={IMG_SCANNER} alt="Scanner" className="w-[28px] h-[28px] object-contain" />
              </div>
            </div>
          </div>

          {/* Search tab (active) */}
          <button className="absolute right-[10%] bottom-[12px] flex flex-col items-center gap-1">
            <img src={IMG_SEARCH_ICON} alt="Search" className="w-6 h-6 object-contain" style={{ filter: 'invert(40%) sepia(76%) saturate(500%) hue-rotate(96deg) brightness(85%)' }} />
            <span
              className="text-[10px] font-semibold tracking-[-0.24px] text-[#248a3d]"
              style={{ fontFamily: '-apple-system, "SF Pro Text", system-ui, sans-serif' }}
            >
              Search
            </span>
          </button>
        </div>
      </div>
    </div>
  )
}

import BottomNav from '../components/BottomNav'

const IMG_DRILL_THUMB = 'https://www.figma.com/api/mcp/asset/2151a0f3-738b-42a5-9908-a98fd32b027f'

const VIDEOS = [
  { id: 1, title: 'Dynamic Warm Up', duration: '15 min', category: 'Warm Up', thumb: IMG_DRILL_THUMB },
  { id: 2, title: 'Putting Fundamentals', duration: '22 min', category: 'Putting', thumb: IMG_DRILL_THUMB },
  { id: 3, title: 'Iron Swing Technique', duration: '18 min', category: 'Irons', thumb: IMG_DRILL_THUMB },
  { id: 4, title: 'Driver Power Drill', duration: '20 min', category: 'Driving', thumb: IMG_DRILL_THUMB },
  { id: 5, title: 'Chipping Around The Green', duration: '12 min', category: 'Short Game', thumb: IMG_DRILL_THUMB },
  { id: 6, title: 'Bunker Shot Basics', duration: '14 min', category: 'Short Game', thumb: IMG_DRILL_THUMB },
]

const CATEGORIES = ['All', 'Warm Up', 'Driving', 'Irons', 'Putting', 'Short Game']

function VideoCard({ title, duration, category, thumb }) {
  return (
    <div className="relative rounded-2xl overflow-hidden h-[160px] w-full">
      <img src={thumb} alt={title} className="w-full h-full object-cover" />
      <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/10 to-transparent" />
      <div className="absolute top-3 left-3">
        <span className="bg-[#248a3d] text-white text-[10px] font-bold uppercase tracking-[0.5px] px-2 py-1 rounded-full">
          {category}
        </span>
      </div>
      <div className="absolute bottom-0 left-0 right-0 p-3 flex items-end justify-between">
        <div>
          <p className="text-white text-[15px] font-semibold leading-[20px]">{title}</p>
          <p className="text-white/70 text-[12px] mt-0.5">{duration}</p>
        </div>
        <div className="w-10 h-10 bg-white/30 backdrop-blur-sm rounded-full flex items-center justify-center flex-shrink-0">
          <svg width="16" height="16" viewBox="0 0 16 16" fill="white">
            <path d="M5 3L13 8L5 13V3Z" />
          </svg>
        </div>
      </div>
    </div>
  )
}

export default function VideoPage() {
  return (
    <div className="relative w-full bg-[#f4f4f4] flex flex-col min-h-[852px]">

      {/* Header */}
      <div className="bg-white pt-14 pb-4 px-5 flex-shrink-0">
        <h1
          className="text-[22px] font-bold text-[#1c1c1e] leading-[28px]"
          style={{ fontFamily: '-apple-system, "SF Pro Display", system-ui, sans-serif' }}
        >
          Drills &amp; Videos
        </h1>
        <p
          className="text-[13px] text-[rgba(60,60,67,0.5)] mt-0.5"
          style={{ fontFamily: '-apple-system, "SF Pro Text", system-ui, sans-serif' }}
        >
          Perfect your game with expert guidance
        </p>

        {/* Category filter */}
        <div className="flex gap-2 mt-4 overflow-x-auto pb-1 -mx-5 px-5">
          {CATEGORIES.map((cat, i) => (
            <button
              key={cat}
              className={`flex-shrink-0 px-4 py-1.5 rounded-full text-[13px] font-semibold ${
                i === 0
                  ? 'bg-[#248a3d] text-white'
                  : 'bg-[#f4f4f4] text-[rgba(60,60,67,0.6)]'
              }`}
              style={{ fontFamily: '-apple-system, "SF Pro Text", system-ui, sans-serif' }}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Video grid */}
      <div className="flex-1 overflow-y-auto pb-[80px] px-4 mt-3">
        <div className="flex flex-col gap-3">
          {VIDEOS.map((v) => <VideoCard key={v.id} {...v} />)}
        </div>
      </div>

      <BottomNav />
    </div>
  )
}

import { useNavigate, useParams } from 'react-router-dom'
import { IMG_ARROW_BACK } from '../icons'

// Category header images
import clubDriverImg   from '../assets/club_driver.png'
import clubIronImg     from '../assets/club_iron.png'
import clubWedgeImg    from '../assets/club_wedge.png'
import clubPutterImg   from '../assets/club_putter.png'
import glovesImg       from '../assets/gloves.png'

// Per-item images — only drivers have individual images for now
import driver1Img  from '../assets/driver1.png'
import driver2Img  from '../assets/driver2.png'

const CLUB_DATA = {
  drivers: {
    label: 'Drivers',
    headerImg: clubDriverImg,
    items: [
      { id: 1, name: 'Inesis 100 Right Handed Graphite', brand: 'Decathlon',  description: 'My first ever driver, hope to take on...', img: driver1Img },
      { id: 2, name: 'Callaway Elyte Driver',            brand: 'Callaway',   description: 'Premium driver with adjustable loft...',  img: driver2Img },
    ],
  },
  irons: {
    label: 'Irons',
    headerImg: clubIronImg,
    items: [
      { id: 1, name: 'Ping G430 Iron Set',        brand: 'Ping',       description: '7-PW iron set, forgiving and consistent...', img: clubIronImg },
      { id: 2, name: 'TaylorMade Stealth 2 Iron', brand: 'TaylorMade', description: 'Low CG for high launch angle...',             img: clubIronImg },
      { id: 3, name: 'Titleist T300 Iron',         brand: 'Titleist',   description: 'Forged face for incredible feel...',          img: clubIronImg },
      { id: 4, name: 'Cobra AEROJET Iron',         brand: 'Cobra',      description: 'Aero-inspired design for speed...',           img: clubIronImg },
    ],
  },
  wedges: {
    label: 'Wedges',
    headerImg: clubWedgeImg,
    items: [
      { id: 1, name: 'Vokey SM9 52°',         brand: 'Titleist',  description: 'Gap wedge, precise spin control...',    img: clubWedgeImg },
      { id: 2, name: 'Callaway Jaws MD5 56°', brand: 'Callaway',  description: 'Sand wedge with aggressive grooves...',  img: clubWedgeImg },
      { id: 3, name: 'Cleveland RTX 6 60°',   brand: 'Cleveland', description: 'Lob wedge for short game shots...',      img: clubWedgeImg },
    ],
  },
  putters: {
    label: 'Putters',
    headerImg: clubPutterImg,
    items: [
      { id: 1, name: 'Scotty Cameron Special Select', brand: 'Scotty Cameron', description: 'Tour-proven mallet putter...',          img: clubPutterImg },
      { id: 2, name: 'Odyssey White Hot OG',           brand: 'Odyssey',       description: 'Classic White Hot insert for feel...',   img: clubPutterImg },
      { id: 3, name: 'TaylorMade Spider GT',           brand: 'TaylorMade',    description: 'High MOI spider design...',              img: clubPutterImg },
      { id: 4, name: 'Ping Anser 2',                   brand: 'Ping',          description: 'Blade putter, trusted by tour pros...',  img: clubPutterImg },
      { id: 5, name: 'Evnroll ER2V',                   brand: 'Evnroll',       description: 'Sweet-face technology for true roll...',  img: clubPutterImg },
    ],
  },
  miscellaneous: {
    label: 'Miscellaneous',
    headerImg: glovesImg,
    items: [
      { id: 1, name: 'Golf Bag Pro',  brand: 'TaylorMade', description: 'Lightweight stand bag...',            img: glovesImg },
      { id: 2, name: 'Golf Glove L',  brand: 'FootJoy',    description: 'Left hand glove, premium leather...', img: glovesImg },
    ],
  },
}

function ClubRow({ name, brand, description, img }) {
  return (
    <div className="flex items-center gap-4 px-4 py-4">
      {/* Club image */}
      <div className="w-[60px] h-[60px] bg-[#f9f9f9] rounded-xl flex items-center justify-center flex-shrink-0">
        {img ? (
          <img src={img} alt={name} className="w-full h-full object-contain p-1" />
        ) : (
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
            <path d="M5 20L12 4L19 20" stroke="#c7c7cc" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
            <path d="M8 14H16" stroke="#c7c7cc" strokeWidth="1.5" strokeLinecap="round" />
          </svg>
        )}
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
  return <div className="h-px bg-[#f0f0f0] ml-[76px]" />
}

export default function ClubDetailPage() {
  const navigate = useNavigate()
  const { category } = useParams()
  const data = CLUB_DATA[category] || CLUB_DATA.drivers

  return (
    <div className="relative w-full bg-[#f4f4f4] flex flex-col min-h-screen">

      {/* Header */}
      <div className="bg-white pt-14 pb-4 px-5 flex-shrink-0">
        <button
          onClick={() => navigate('/collection')}
          className="flex items-center gap-1 mb-4"
          aria-label="Go back"
        >
          <svg width="8" height="14" viewBox="0 0 8 14" fill="none">
            <path d="M7 1L1 7L7 13" stroke="#248a3d" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
          <span
            className="text-[15px] font-medium text-[#248a3d] ml-1"
            style={{ fontFamily: '-apple-system, "SF Pro Text", system-ui, sans-serif' }}
          >
            Collection
          </span>
        </button>

        <div className="flex items-center gap-4">
          {/* Category header image */}
          <div className="w-[64px] h-[64px] bg-white rounded-2xl flex items-center justify-center flex-shrink-0"
            style={{ boxShadow: '0 1px 4px rgba(0,0,0,0.08)' }}>
            <img src={data.headerImg} alt={data.label} className="w-[54px] h-[54px] object-contain" />
          </div>
          <div>
            <h1
              className="text-[22px] font-bold text-[#1c1c1e] leading-[28px]"
              style={{ fontFamily: '-apple-system, "SF Pro Display", system-ui, sans-serif' }}
            >
              {data.label}
            </h1>
            <p
              className="text-[13px] text-[rgba(60,60,67,0.5)] mt-0.5"
              style={{ fontFamily: '-apple-system, "SF Pro Text", system-ui, sans-serif' }}
            >
              {data.items.length} {data.items.length === 1 ? 'club' : 'clubs'} in your bag
            </p>
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
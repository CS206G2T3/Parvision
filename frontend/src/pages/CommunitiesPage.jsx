import { useState } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import BottomNav from '../components/BottomNav'
import foursomeImg from '../assets/foursome.png'
import swingImg from '../assets/swing.png'
import balltraceVideo from '../assets/balltrace.mp4'

// ── data ──────────────────────────────────────────────────────────────────────

const MY_COMMUNITIES = [
  { id: 1, name: 'Singapore\nGolfers',  abbr: 'SG',  color: '#248a3d' },
  { id: 2, name: 'Scratch\nClub',       abbr: 'SC',  color: '#409cff' },
  { id: 3, name: 'Beginners\nCorner',   abbr: 'BC',  color: '#f97316' },
  { id: 4, name: 'Weekend\nWarriors',   abbr: 'WW',  color: '#a855f7' },
]

const ALL_COMMUNITIES = [
  { id: 1, name: 'Singapore Golfers',  members: '2.4k', color: '#248a3d', abbr: 'SG',  joined: true  },
  { id: 2, name: 'Scratch Club',       members: '340',  color: '#409cff', abbr: 'SC',  joined: true  },
  { id: 3, name: 'Beginners Corner',   members: '1.1k', color: '#f97316', abbr: 'BC',  joined: true  },
  { id: 4, name: 'Weekend Warriors',   members: '876',  color: '#a855f7', abbr: 'WW',  joined: true  },
  { id: 5, name: 'Iron Masters',       members: '512',  color: '#ec4899', abbr: 'IM',  joined: false },
  { id: 6, name: 'Ladies Golf SG',     members: '1.8k', color: '#06b6d4', abbr: 'LG',  joined: false },
  { id: 7, name: 'Par Seekers',        members: '229',  color: '#f59e0b', abbr: 'PS',  joined: false },
  { id: 8, name: 'Senior Swingers',    members: '704',  color: '#84cc16', abbr: 'SS',  joined: false },
]

const POSTS = [
  {
    id: 1,
    community: 'Weekend Warriors',
    communityColor: '#a855f7',
    communityAbbr: 'WW',
    user: 'Non-Significant Other',
    avatarColor: '#a3c4a8',
    avatarLetter: 'N',
    time: '1h ago',
    body: 'Weekend foursome was a blast! Finally shot under 90 for the first time this season 🎉 The new wedge made all the difference on the back nine.',
    likes: 12,
    comments: 3,
    img: foursomeImg,
    tags: [],
  },
  {
    id: 2,
    community: 'Singapore Golfers',
    communityColor: '#248a3d',
    communityAbbr: 'SG',
    user: 'Marcus Hooy',
    avatarColor: '#f97316',
    avatarLetter: 'M',
    time: '2h ago',
    body: 'Swing looking slightly rough this session 😅 Hoping the Swing Analyzer feedback helps me fix my C-posture before the weekend round.',
    likes: 40,
    comments: 7,
    img: swingImg,
    tags: ['Swing Analyzer'],
  },
  {
    id: 3,
    community: 'Scratch Club',
    communityColor: '#409cff',
    communityAbbr: 'SC',
    user: 'Marcus Hooy',
    avatarColor: '#f97316',
    avatarLetter: 'M',
    time: '5h ago',
    body: 'Golden hour session at Sentosa. Different energy when the light hits like that. Ball tracing showed 247 yards — best drive this year 🔥',
    likes: 213,
    comments: 0,
    img: swingImg,
    tags: ['Ball Tracer'],
  },
  {
    id: 4,
    community: 'Beginners Corner',
    communityColor: '#f97316',
    communityAbbr: 'BC',
    user: 'Fairway Phil',
    avatarColor: '#a855f7',
    avatarLetter: 'F',
    time: '1d ago',
    body: 'Did the Dynamic Warmup routine before the game today — huge difference in my hip mobility by hole 5. Highly recommend it to everyone just starting out!',
    likes: 88,
    comments: 14,
    img: null,
    tags: ['Warmup'],
  },
]

// ── sub-components ─────────────────────────────────────────────────────────────

function CommunityBubble({ name, abbr, color, active, onPress }) {
  return (
    <button onClick={onPress} className="flex flex-col items-center gap-1.5 flex-shrink-0">
      <div
        className={`w-[56px] h-[56px] rounded-full flex items-center justify-center text-white text-[12px] font-bold shadow-sm ${active ? 'ring-2 ring-[#248a3d] ring-offset-2' : ''}`}
        style={{ backgroundColor: color }}
      >
        {abbr}
      </div>
      <span
        className="text-[10px] text-[#1c1c1e] text-center leading-[13px] w-[60px]"
        style={{ fontFamily: '-apple-system, "SF Pro Text", system-ui, sans-serif', whiteSpace: 'pre-line' }}
      >
        {name}
      </span>
    </button>
  )
}

function PostCard({ post }) {
  const [liked, setLiked] = useState(false)

  return (
    <div className="bg-white rounded-2xl mx-4 mb-3 overflow-hidden shadow-sm" style={{ boxShadow: '0 1px 3px rgba(0,0,0,0.07)' }}>
      {/* Community header */}
      <div className="flex items-center px-4 pt-3.5 pb-2 gap-2">
        <div
          className="w-6 h-6 rounded-md flex items-center justify-center text-white text-[9px] font-bold flex-shrink-0"
          style={{ backgroundColor: post.communityColor }}
        >
          {post.communityAbbr}
        </div>
        <span
          className="text-[12px] font-semibold flex-1"
          style={{ color: post.communityColor, fontFamily: '-apple-system, "SF Pro Text", system-ui, sans-serif' }}
        >
          {post.community}
        </span>
        <button className="text-[rgba(60,60,67,0.35)]">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
            <circle cx="5" cy="12" r="2" /><circle cx="12" cy="12" r="2" /><circle cx="19" cy="12" r="2" />
          </svg>
        </button>
      </div>

      {/* Divider */}
      <div className="h-px bg-[#f0f0f0] mx-4" />

      {/* User row */}
      <div className="flex items-center px-4 pt-3 pb-2 gap-2.5">
        <div
          className="w-9 h-9 rounded-full flex items-center justify-center text-white text-[13px] font-bold flex-shrink-0"
          style={{ backgroundColor: post.avatarColor }}
        >
          {post.avatarLetter}
        </div>
        <div className="flex-1 min-w-0">
          <p
            className="text-[13px] font-semibold text-[#1c1c1e] leading-[17px]"
            style={{ fontFamily: '-apple-system, "SF Pro Text", system-ui, sans-serif' }}
          >
            {post.user}
          </p>
          <p className="text-[11px] text-[rgba(60,60,67,0.45)] leading-[15px]">{post.time}</p>
        </div>
      </div>

      {/* Body text */}
      <p
        className="text-[14px] text-[#1c1c1e] leading-[20px] px-4 pb-3"
        style={{ fontFamily: '-apple-system, "SF Pro Text", system-ui, sans-serif' }}
      >
        {post.body}
      </p>

      {/* Image */}
      {post.img && (
        <div className="mx-4 mb-3 rounded-xl overflow-hidden h-[180px]">
          <img src={post.img} alt="post" className="w-full h-full object-cover" />
        </div>
      )}

      {/* Tags */}
      {post.tags.length > 0 && (
        <div className="flex flex-wrap gap-1.5 px-4 pb-3">
          {post.tags.map((tag) => (
            <span
              key={tag}
              className="text-[11px] font-semibold bg-[#e5f8e9] text-[#248a3d] px-2.5 py-0.5 rounded-full"
            >
              {tag}
            </span>
          ))}
        </div>
      )}

      {/* Action row */}
      <div className="flex items-center px-4 pb-3.5 gap-5 border-t border-[#f4f4f4] pt-2.5">
        <button
          onClick={() => setLiked(!liked)}
          className="flex items-center gap-1.5"
        >
          <svg width="18" height="18" viewBox="0 0 24 24"
            fill={liked ? '#ff3b30' : 'none'}
            stroke={liked ? '#ff3b30' : 'rgba(60,60,67,0.45)'}
            strokeWidth="2"
          >
            <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78L12 21.23l8.84-8.84a5.5 5.5 0 0 0 0-7.78z" />
          </svg>
          <span
            className={`text-[13px] font-medium ${liked ? 'text-[#ff3b30]' : 'text-[rgba(60,60,67,0.5)]'}`}
            style={{ fontFamily: '-apple-system, "SF Pro Text", system-ui, sans-serif' }}
          >
            {liked ? post.likes + 1 : post.likes}
          </span>
        </button>
        <button className="flex items-center gap-1.5">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none"
            stroke="rgba(60,60,67,0.45)" strokeWidth="2" strokeLinecap="round">
            <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
          </svg>
          <span
            className="text-[13px] font-medium text-[rgba(60,60,67,0.5)]"
            style={{ fontFamily: '-apple-system, "SF Pro Text", system-ui, sans-serif' }}
          >
            {post.comments}
          </span>
        </button>
        <button className="flex items-center gap-1.5 ml-auto">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none"
            stroke="rgba(60,60,67,0.45)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M4 12v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8M16 6l-4-4-4 4M12 2v13" />
          </svg>
        </button>
      </div>
    </div>
  )
}

function CommunityRow({ c, onToggle }) {
  return (
    <div className="flex items-center px-4 py-3.5 gap-3">
      <div
        className="w-11 h-11 rounded-xl flex items-center justify-center text-white text-[11px] font-bold flex-shrink-0"
        style={{ backgroundColor: c.color }}
      >
        {c.abbr}
      </div>
      <div className="flex-1 min-w-0">
        <p
          className="text-[15px] font-semibold text-[#1c1c1e] leading-[20px] truncate"
          style={{ fontFamily: '-apple-system, "SF Pro Text", system-ui, sans-serif' }}
        >
          {c.name}
        </p>
        <p className="text-[12px] text-[rgba(60,60,67,0.5)] leading-[16px]">{c.members} members</p>
      </div>
      <button
        onClick={onToggle}
        className={`px-3.5 py-1.5 rounded-full text-[12px] font-semibold flex-shrink-0 transition-all ${
          c.joined
            ? 'bg-[#e5f8e9] text-[#248a3d] border border-[#b8e8c4]'
            : 'bg-[#248a3d] text-white'
        }`}
        style={{ fontFamily: '-apple-system, "SF Pro Text", system-ui, sans-serif' }}
      >
        {c.joined ? 'Joined' : 'Join'}
      </button>
    </div>
  )
}

// ── main page ──────────────────────────────────────────────────────────────────

function ComposeSheet({ draft, onClose, onPost }) {
  const [caption, setCaption] = useState(draft.caption)
  const [selectedCommunity, setSelectedCommunity] = useState(MY_COMMUNITIES[0])
  const [posted, setPosted] = useState(false)

  const handlePost = () => {
    setPosted(true)
    setTimeout(() => { onPost(); onClose() }, 900)
  }

  return (
    <div className="absolute inset-0 z-40" style={{ background: 'rgba(0,0,0,0.55)' }}>
      {/* Card */}
      <div className="mx-4 mt-14 bg-white rounded-3xl overflow-hidden" style={{ boxShadow: '0 8px 40px rgba(0,0,0,0.18)' }}>

        {/* Header */}
        <div className="flex items-center justify-between px-4 pt-4 pb-3 border-b border-[#f0f0f0]">
          <button onClick={onClose}
            className="text-[15px] text-[rgba(60,60,67,0.5)]"
            style={{ fontFamily: '-apple-system, "SF Pro Text", system-ui, sans-serif' }}>
            Cancel
          </button>
          <p className="text-[16px] font-bold text-[#1c1c1e]"
            style={{ fontFamily: '-apple-system, "SF Pro Display", system-ui, sans-serif' }}>
            New Post
          </p>
          <button onClick={handlePost}
            className={`px-4 py-1.5 rounded-full text-[14px] font-semibold transition-all ${posted ? 'bg-[#e5f8e9] text-[#248a3d]' : 'bg-[#248a3d] text-white'}`}
            style={{ fontFamily: '-apple-system, "SF Pro Text", system-ui, sans-serif' }}>
            {posted ? 'Posted ✓' : 'Post'}
          </button>
        </div>

        {/* Author row + caption */}
        <div className="flex gap-3 px-4 pt-4 pb-3">
          <div className="w-9 h-9 rounded-full bg-[#f97316] flex items-center justify-center text-white text-[14px] font-bold flex-shrink-0">
            M
          </div>
          <div className="flex-1">
            <p className="text-[13px] font-semibold text-[#1c1c1e] mb-1"
              style={{ fontFamily: '-apple-system, "SF Pro Text", system-ui, sans-serif' }}>
              Marcus Hooy
            </p>
            <textarea
              value={caption}
              onChange={(e) => setCaption(e.target.value)}
              rows={2}
              placeholder="What's on your mind?"
              className="w-full text-[14px] text-[#1c1c1e] placeholder-[rgba(60,60,67,0.35)] resize-none focus:outline-none leading-[20px]"
              style={{ fontFamily: '-apple-system, "SF Pro Text", system-ui, sans-serif' }}
            />
          </div>
        </div>

        {/* Video thumbnail row */}
        <div className="mx-4 mb-3 flex gap-3 items-center bg-[#f4f4f4] rounded-2xl p-2.5">
          <div className="rounded-xl overflow-hidden bg-black flex-shrink-0" style={{ width: 48, aspectRatio: '9/16' }}>
            <video src={balltraceVideo} className="w-full h-full object-cover" muted playsInline autoPlay loop />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-[13px] font-semibold text-[#1c1c1e] truncate"
              style={{ fontFamily: '-apple-system, "SF Pro Text", system-ui, sans-serif' }}>
              Ball Trace Video
            </p>
            <p className="text-[11px] text-[rgba(60,60,67,0.45)]"
              style={{ fontFamily: '-apple-system, "SF Pro Text", system-ui, sans-serif' }}>
              Tap to preview
            </p>
          </div>
          <span className="text-[11px] font-semibold bg-[#e5f8e9] text-[#248a3d] px-2.5 py-1 rounded-full flex-shrink-0">
            {draft.tag}
          </span>
        </div>

        {/* Post to */}
        <div className="px-4 pb-4 border-t border-[#f0f0f0] pt-3">
          <p className="text-[11px] font-semibold uppercase tracking-[0.5px] text-[rgba(60,60,67,0.4)] mb-2"
            style={{ fontFamily: '-apple-system, "SF Pro Text", system-ui, sans-serif' }}>
            Post to
          </p>
          <div className="flex gap-2 overflow-x-auto no-scrollbar">
            {MY_COMMUNITIES.map((c) => (
              <button
                key={c.id}
                onClick={() => setSelectedCommunity(c)}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[12px] font-semibold flex-shrink-0 transition-all"
                style={{
                  backgroundColor: selectedCommunity.id === c.id ? c.color : '#f4f4f4',
                  color: selectedCommunity.id === c.id ? 'white' : '#1c1c1e',
                  fontFamily: '-apple-system, "SF Pro Text", system-ui, sans-serif',
                }}>
                {c.name.replace('\n', ' ')}
              </button>
            ))}
          </div>
        </div>

      </div>
    </div>
  )
}

export default function CommunitiesPage() {
  const navigate = useNavigate()
  const { state } = useLocation()
  const [tab, setTab] = useState('feed')       // 'feed' | 'communities'
  const [showCompose, setShowCompose] = useState(!!state?.draft)
  const [composeDraft] = useState(state?.draft || null)
  const [activeCommunity, setActiveCommunity] = useState(null)
  const [query, setQuery] = useState('')
  const [communities, setCommunities] = useState(ALL_COMMUNITIES)

  const toggleJoin = (id) => {
    setCommunities((prev) =>
      prev.map((c) => (c.id === id ? { ...c, joined: !c.joined } : c))
    )
  }

  const filteredCommunities = communities.filter((c) =>
    !query || c.name.toLowerCase().includes(query.toLowerCase())
  )

  const filteredPosts = activeCommunity
    ? POSTS.filter((p) => p.community === activeCommunity)
    : POSTS

  return (
    <div className="relative w-full bg-[#f4f4f4] flex flex-col min-h-[852px]">

      {/* ── Header ── */}
      <div className="bg-white border-b border-[#f0f0f0] pt-14 flex-shrink-0">
        <div className="px-5 pb-3 flex items-center justify-between">
          <h1
            className="text-[22px] font-bold text-[#1c1c1e] leading-[28px]"
            style={{ fontFamily: '-apple-system, "SF Pro Display", system-ui, sans-serif' }}
          >
            Communities
          </h1>
          <div className="flex items-center gap-2.5">
            <button className="w-8 h-8 flex items-center justify-center text-[#1c1c1e]">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none"
                stroke="rgba(60,60,67,0.6)" strokeWidth="2" strokeLinecap="round">
                <circle cx="11" cy="11" r="8" />
                <path d="M21 21l-4.35-4.35" />
              </svg>
            </button>
            <button className="w-8 h-8 bg-[#248a3d] rounded-full flex items-center justify-center shadow-sm">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none"
                stroke="white" strokeWidth="2.5" strokeLinecap="round">
                <line x1="12" y1="5" x2="12" y2="19" />
                <line x1="5" y1="12" x2="19" y2="12" />
              </svg>
            </button>
          </div>
        </div>

        {/* Tab bar */}
        <div className="flex px-5 gap-6">
          {[
            { key: 'feed',        label: 'Feed'        },
            { key: 'communities', label: 'Communities' },
          ].map(({ key, label }) => (
            <button
              key={key}
              onClick={() => setTab(key)}
              className={`pb-3 text-[15px] font-semibold border-b-2 transition-colors ${
                tab === key
                  ? 'text-[#248a3d] border-[#248a3d]'
                  : 'text-[rgba(60,60,67,0.4)] border-transparent'
              }`}
              style={{ fontFamily: '-apple-system, "SF Pro Text", system-ui, sans-serif' }}
            >
              {label}
            </button>
          ))}
        </div>
      </div>

      {/* ── Scrollable body ── */}
      <div className="flex-1 overflow-y-auto pb-[76px]">

        {/* ══ FEED TAB ══ */}
        {tab === 'feed' && (
          <>
            {/* My Communities horizontal scroll */}
            <div className="bg-white px-5 pt-4 pb-4 mb-2 border-b border-[#f0f0f0]">
              <p
                className="text-[12px] font-semibold text-[rgba(60,60,67,0.45)] uppercase tracking-[0.4px] mb-3"
                style={{ fontFamily: '-apple-system, "SF Pro Text", system-ui, sans-serif' }}
              >
                My Groups
              </p>
              <div className="flex gap-4 overflow-x-auto pb-1 no-scrollbar">
                {/* "All" bubble */}
                <button
                  onClick={() => setActiveCommunity(null)}
                  className="flex flex-col items-center gap-1.5 flex-shrink-0"
                >
                  <div
                    className={`w-[56px] h-[56px] rounded-full flex items-center justify-center shadow-sm transition-all ${
                      activeCommunity === null
                        ? 'ring-2 ring-[#248a3d] ring-offset-2'
                        : ''
                    }`}
                    style={{ background: activeCommunity === null ? '#248a3d' : 'linear-gradient(135deg,#248a3d,#409cff)' }}
                  >
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none"
                      stroke="white" strokeWidth="2" strokeLinecap="round">
                      <rect x="3" y="3" width="7" height="7" rx="1" />
                      <rect x="14" y="3" width="7" height="7" rx="1" />
                      <rect x="3" y="14" width="7" height="7" rx="1" />
                      <rect x="14" y="14" width="7" height="7" rx="1" />
                    </svg>
                  </div>
                  <span
                    className="text-[10px] text-[#1c1c1e] text-center leading-[13px] w-[60px]"
                    style={{ fontFamily: '-apple-system, "SF Pro Text", system-ui, sans-serif' }}
                  >
                    All
                  </span>
                </button>

                {MY_COMMUNITIES.map((c) => (
                  <CommunityBubble
                    key={c.id}
                    name={c.name}
                    abbr={c.abbr}
                    color={c.color}
                    active={activeCommunity === c.name}
                    onPress={() =>
                      setActiveCommunity((prev) =>
                        prev === c.name ? null : c.name
                      )
                    }
                  />
                ))}
              </div>
            </div>

            {/* Posts */}
            <div className="pt-2">
              {filteredPosts.length > 0 ? (
                filteredPosts.map((post) => (
                  <PostCard key={post.id} post={post} />
                ))
              ) : (
                <div className="flex flex-col items-center justify-center py-20 px-8 text-center">
                  <div className="w-14 h-14 rounded-full bg-[#e5f8e9] flex items-center justify-center mb-4">
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none"
                      stroke="#248a3d" strokeWidth="2" strokeLinecap="round">
                      <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
                    </svg>
                  </div>
                  <p
                    className="text-[16px] font-semibold text-[#1c1c1e] mb-1"
                    style={{ fontFamily: '-apple-system, "SF Pro Display", system-ui, sans-serif' }}
                  >
                    No posts yet
                  </p>
                  <p
                    className="text-[14px] text-[rgba(60,60,67,0.5)]"
                    style={{ fontFamily: '-apple-system, "SF Pro Text", system-ui, sans-serif' }}
                  >
                    Be the first to share something in this community.
                  </p>
                </div>
              )}
            </div>
          </>
        )}

        {/* ══ COMMUNITIES TAB ══ */}
        {tab === 'communities' && (
          <div>
            {/* Search bar */}
            <div className="bg-white px-5 py-3 border-b border-[#f0f0f0]">
              <div className="flex items-center bg-[#f4f4f4] rounded-[12px] h-[36px] px-3 gap-2">
                <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                  <circle cx="6" cy="6" r="4.5" stroke="rgba(60,60,67,0.4)" strokeWidth="1.5" />
                  <path d="M10 10L12.5 12.5" stroke="rgba(60,60,67,0.4)" strokeWidth="1.5" strokeLinecap="round" />
                </svg>
                <input
                  type="text"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="Search communities"
                  className="flex-1 bg-transparent text-[14px] text-[#1c1c1e] placeholder-[rgba(60,60,67,0.4)] focus:outline-none"
                  style={{ fontFamily: '-apple-system, "SF Pro Text", system-ui, sans-serif' }}
                />
                {query ? (
                  <button onClick={() => setQuery('')} className="text-[rgba(60,60,67,0.4)]">
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
                      <circle cx="12" cy="12" r="10" opacity="0.3" />
                      <path d="M15 9l-6 6M9 9l6 6" stroke="rgba(60,60,67,0.7)" strokeWidth="2" strokeLinecap="round" fill="none" />
                    </svg>
                  </button>
                ) : null}
              </div>
            </div>

            {/* Joined section */}
            {filteredCommunities.some((c) => c.joined) && (
              <div className="px-4 pt-5">
                <p
                  className="text-[13px] font-semibold uppercase tracking-[0.5px] text-[rgba(60,60,67,0.45)] mb-2 px-1"
                  style={{ fontFamily: '-apple-system, "SF Pro Text", system-ui, sans-serif' }}
                >
                  My Communities
                </p>
                <div className="bg-white rounded-2xl overflow-hidden" style={{ boxShadow: '0 1px 3px rgba(0,0,0,0.06)' }}>
                  {filteredCommunities
                    .filter((c) => c.joined)
                    .map((c, i, arr) => (
                      <div key={c.id}>
                        <CommunityRow c={c} onToggle={() => toggleJoin(c.id)} />
                        {i < arr.length - 1 && <div className="h-px bg-[#f0f0f0] ml-[68px]" />}
                      </div>
                    ))}
                </div>
              </div>
            )}

            {/* Discover section */}
            {filteredCommunities.some((c) => !c.joined) && (
              <div className="px-4 pt-5 pb-4">
                <p
                  className="text-[13px] font-semibold uppercase tracking-[0.5px] text-[rgba(60,60,67,0.45)] mb-2 px-1"
                  style={{ fontFamily: '-apple-system, "SF Pro Text", system-ui, sans-serif' }}
                >
                  Discover
                </p>
                <div className="bg-white rounded-2xl overflow-hidden" style={{ boxShadow: '0 1px 3px rgba(0,0,0,0.06)' }}>
                  {filteredCommunities
                    .filter((c) => !c.joined)
                    .map((c, i, arr) => (
                      <div key={c.id}>
                        <CommunityRow c={c} onToggle={() => toggleJoin(c.id)} />
                        {i < arr.length - 1 && <div className="h-px bg-[#f0f0f0] ml-[68px]" />}
                      </div>
                    ))}
                </div>
              </div>
            )}

            {/* Trending tags */}
            <div className="px-4 pt-4 pb-6">
              <p
                className="text-[13px] font-semibold uppercase tracking-[0.5px] text-[rgba(60,60,67,0.45)] mb-3 px-1"
                style={{ fontFamily: '-apple-system, "SF Pro Text", system-ui, sans-serif' }}
              >
                Trending Tags
              </p>
              <div className="flex flex-wrap gap-2">
                {['#SwingAnalyzer', '#BallTracer', '#FairwayLife', '#WeekendGolf', '#Handicap', '#DynamicWarmup', '#GolfFit', '#SentosaGolf'].map((tag) => (
                  <button
                    key={tag}
                    className="px-3.5 py-1.5 bg-white rounded-full border border-[#e5e5ea] text-[13px] font-medium text-[#1c1c1e] active:bg-[#f4f4f4] shadow-sm"
                    style={{ fontFamily: '-apple-system, "SF Pro Text", system-ui, sans-serif', boxShadow: '0 1px 2px rgba(0,0,0,0.05)' }}
                  >
                    {tag}
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>

      <BottomNav />

      {showCompose && composeDraft && (
        <ComposeSheet
          draft={composeDraft}
          onClose={() => setShowCompose(false)}
          onPost={() => setShowCompose(false)}
        />
      )}
    </div>
  )
}

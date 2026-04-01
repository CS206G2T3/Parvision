import { useState, useRef, useEffect, useCallback } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import BottomNav from '../components/BottomNav'
import balltraceVideo from '../assets/balltrace.mp4'
import { loadPosts, savePosts } from '../data/communityPosts'
import { useAuth } from '../context/AuthContext'

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


const INITIAL_COMMENTS = {
  1: [
    { id: 1, user: 'Sandy Wedge', avatarColor: '#409cff', avatarLetter: 'S', time: '55m ago', text: 'Under 90 is massive! What wedge did you switch to?' },
    { id: 2, user: 'Fairway Phil', avatarColor: '#a855f7', avatarLetter: 'F', time: '50m ago', text: 'Love the energy! Same thing happened to me when I got fitted 🙌' },
    { id: 3, user: 'Coach Dave', avatarColor: '#248a3d', avatarLetter: 'C', time: '45m ago', text: 'Great milestone! Which course were you at?' },
    { id: 4, user: 'Iron Ian', avatarColor: '#ec4899', avatarLetter: 'I', time: '40m ago', text: 'Sub-90 is where it starts getting fun. Well done!' },
    { id: 5, user: 'Non-Significant Other', avatarColor: '#a3c4a8', avatarLetter: 'N', time: '35m ago', text: 'Switched to a 56° Cleveland RTX this season — game changer around the green.' },
    { id: 6, user: 'Weekend Wanda', avatarColor: '#f59e0b', avatarLetter: 'W', time: '28m ago', text: 'The back nine always makes or breaks a round. Clutch finish 🔥' },
    { id: 7, user: 'Par Pete', avatarColor: '#84cc16', avatarLetter: 'P', time: '20m ago', text: 'Getting fitted is the single best investment you can make tbh.' },
    { id: 8, user: 'Birdie Bob', avatarColor: '#06b6d4', avatarLetter: 'B', time: '15m ago', text: 'Next goal: under 85! You\'ve got this 💪' },
    { id: 9, user: 'Sandy Wedge', avatarColor: '#409cff', avatarLetter: 'S', time: '12m ago', text: 'Ooh nice, I\'ve been eyeing that wedge. Might pull the trigger.' },
    { id: 10, user: 'Marcus Hooy', avatarColor: '#f97316', avatarLetter: 'M', time: '10m ago', text: 'Let\'s play a round this weekend!' },
    { id: 11, user: 'Non-Significant Other', avatarColor: '#a3c4a8', avatarLetter: 'N', time: '5m ago', text: 'Saturday works for me! Seletar or Kranji?' },
    { id: 12, user: 'Fairway Phil', avatarColor: '#a855f7', avatarLetter: 'F', time: '2m ago', text: 'Count me in if there\'s a spot 🙋' },
  ],
  2: [
    { id: 1, user: 'Coach Dave', avatarColor: '#248a3d', avatarLetter: 'C', time: '1h 50m ago', text: 'C-posture is usually a setup issue — try widening your stance slightly.' },
    { id: 2, user: 'Iron Ian', avatarColor: '#ec4899', avatarLetter: 'I', time: '1h 40m ago', text: 'Swing Analyzer caught my C-posture too. Night and day after fixing it!' },
    { id: 3, user: 'Sandy Wedge', avatarColor: '#409cff', avatarLetter: 'S', time: '1h 30m ago', text: 'What feedback did the AI give you on the takeaway?' },
    { id: 4, user: 'Weekend Wanda', avatarColor: '#f59e0b', avatarLetter: 'W', time: '1h 10m ago', text: 'Keep at it Marcus! Looked solid to me tbh 💪' },
    { id: 5, user: 'Birdie Bob', avatarColor: '#06b6d4', avatarLetter: 'B', time: '55m ago', text: 'The C-posture creep is real especially when you\'re tired. Core work helps a lot.' },
    { id: 6, user: 'Par Pete', avatarColor: '#84cc16', avatarLetter: 'P', time: '45m ago', text: 'I had the same issue — hip rotation drills fixed it in 2 weeks.' },
    { id: 7, user: 'Marcus Hooy', avatarColor: '#f97316', avatarLetter: 'M', time: '38m ago', text: 'AI flagged my hip slide too. Didn\'t even notice it until I watched it back 😅' },
    { id: 8, user: 'Coach Dave', avatarColor: '#248a3d', avatarLetter: 'C', time: '30m ago', text: 'Hip slide and C-posture often come together. Fix the setup and both tend to clean up.' },
    { id: 9, user: 'Iron Ian', avatarColor: '#ec4899', avatarLetter: 'I', time: '22m ago', text: 'Wall drill for the hip slide is really effective. Try it at home.' },
    { id: 10, user: 'Fairway Phil', avatarColor: '#a855f7', avatarLetter: 'F', time: '15m ago', text: 'Tag me when you post the improved one!' },
    { id: 11, user: 'Sandy Wedge', avatarColor: '#409cff', avatarLetter: 'S', time: '8m ago', text: 'Following this thread — want to see the before/after 👀' },
    { id: 12, user: 'Weekend Wanda', avatarColor: '#f59e0b', avatarLetter: 'W', time: '5m ago', text: 'This is why I love this community. So much useful advice 🙌' },
    { id: 13, user: 'Par Pete', avatarColor: '#84cc16', avatarLetter: 'P', time: '3m ago', text: 'Marcus post the next swing, we\'ll all review it!' },
    { id: 14, user: 'Birdie Bob', avatarColor: '#06b6d4', avatarLetter: 'B', time: '2m ago', text: 'Great progress, looking forward to the next post!' },
  ],
  4: [
    { id: 1, user: 'Marcus Hooy', avatarColor: '#f97316', avatarLetter: 'M', time: '22h ago', text: 'I\'m down! Haven\'t been to OCC in ages' },
    { id: 2, user: 'Iron Ian', avatarColor: '#ec4899', avatarLetter: 'I', time: '20h ago', text: 'Count me in! Do they have mats or is it off grass?' },
    { id: 3, user: 'Sandy Wedge', avatarColor: '#409cff', avatarLetter: 'S', time: '18h ago', text: 'Saturday works for me, how many bays are we grabbing?' },
    { id: 4, user: 'Fairway Phil', avatarColor: '#a855f7', avatarLetter: 'F', time: '16h ago', text: 'OCC range is solid. I\'ll be there! Need to work on my irons anyway' },
    { id: 5, user: 'Coach Dave', avatarColor: '#248a3d', avatarLetter: 'C', time: '12h ago', text: 'Great spot. I can give some tips if anyone wants swing feedback on the day' },
    { id: 6, user: 'Weekend Wanda', avatarColor: '#f59e0b', avatarLetter: 'W', time: '8h ago', text: '7pm perfect, just nice after the heat dies down 🙌' },
    { id: 7, user: 'Par Pete', avatarColor: '#84cc16', avatarLetter: 'P', time: '4h ago', text: 'Is parking easy there on Saturday evenings?' },
    { id: 8, user: 'Birdie Bob', avatarColor: '#06b6d4', avatarLetter: 'B', time: '2h ago', text: 'Let\'s go! I\'ll bring extra balls to share 🏌️' },
    { id: 9, user: 'Iron Ian', avatarColor: '#ec4899', avatarLetter: 'I', time: '1h ago', text: 'Parking is fine, there\'s a big lot right next to the range' },
    { id: 10, user: 'Sandy Wedge', avatarColor: '#409cff', avatarLetter: 'S', time: '30m ago', text: 'Can we do a mini closest-to-pin challenge while we\'re there? 😂' },
    { id: 11, user: 'Non-Significant Other', avatarColor: '#a3c4a8', avatarLetter: 'N', time: '15m ago', text: 'I\'m coming too! Should we grab dinner after?' },
    { id: 12, user: 'Coach Dave', avatarColor: '#248a3d', avatarLetter: 'C', time: '5m ago', text: 'Dinner sounds good, there\'s a hawker centre nearby' },
    { id: 13, user: 'Marcus Hooy', avatarColor: '#f97316', avatarLetter: 'M', time: '1m ago', text: 'This is gonna be a great session, see everyone Saturday! 🔥' },
    { id: 14, user: 'Weekend Wanda', avatarColor: '#f59e0b', avatarLetter: 'W', time: 'just now', text: 'Love OpenJio posts like these, best way to meet up 💚' },
  ],
}

const AVAILABLE_TAGS = [
  'Ball Tracer',
  'Swing Analyzer',
  'Warmup',
  'Course Review',
  'Tips & Tricks',
  'Gear Talk',
  'OpenJio',
]

// ── sub-components ─────────────────────────────────────────────────────────────

function ActionSheet({ options, onClose, style }) {
  return (
    <div className="phone-overlay flex flex-col justify-end" style={{ background: 'rgba(0,0,0,0.45)', zIndex: 50, ...style }} onClick={onClose}>
      <div className="mx-3 mb-3 flex flex-col gap-2" onClick={(e) => e.stopPropagation()}>
        <div className="bg-white rounded-2xl overflow-hidden">
          <div className="w-10 h-1 bg-[#e5e5ea] rounded-full mx-auto mt-2.5 mb-1" />
          {options.map((opt, i) => (
            <div key={i}>
              {i > 0 && <div className="h-px bg-[#f0f0f0]" />}
              <button
                onClick={() => { opt.onTap(); onClose() }}
                className={`w-full py-3.5 text-[17px] font-normal text-center ${opt.destructive ? 'text-[#ff3b30]' : 'text-[#007aff]'}`}
                style={{ fontFamily: '-apple-system, "SF Pro Text", system-ui, sans-serif' }}
              >
                {opt.label}
              </button>
            </div>
          ))}
        </div>
        <button
          onClick={onClose}
          className="bg-white rounded-2xl py-3.5 text-[17px] font-semibold text-[#007aff] text-center"
          style={{ fontFamily: '-apple-system, "SF Pro Text", system-ui, sans-serif' }}
        >
          Cancel
        </button>
      </div>
    </div>
  )
}

function ConfirmDialog({ title, message, confirmLabel, onConfirm, onCancel, destructive }) {
  return (
    <div className="phone-overlay flex items-center justify-center" style={{ background: 'rgba(0,0,0,0.45)', zIndex: 50 }} onClick={onCancel}>
      <div className="bg-white rounded-2xl mx-10 overflow-hidden" style={{ boxShadow: '0 8px 40px rgba(0,0,0,0.18)', minWidth: 270 }} onClick={(e) => e.stopPropagation()}>
        <div className="pt-5 pb-4 px-5 text-center">
          <p className="text-[17px] font-bold text-[#1c1c1e] mb-1"
            style={{ fontFamily: '-apple-system, "SF Pro Display", system-ui, sans-serif' }}>
            {title}
          </p>
          <p className="text-[14px] text-[rgba(60,60,67,0.6)] leading-[19px]"
            style={{ fontFamily: '-apple-system, "SF Pro Text", system-ui, sans-serif' }}>
            {message}
          </p>
        </div>
        <div className="border-t border-[#f0f0f0] flex">
          <button
            onClick={onCancel}
            className="flex-1 py-3 text-[17px] text-[#007aff] font-normal text-center border-r border-[#f0f0f0]"
            style={{ fontFamily: '-apple-system, "SF Pro Text", system-ui, sans-serif' }}
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            className={`flex-1 py-3 text-[17px] font-semibold text-center ${destructive ? 'text-[#ff3b30]' : 'text-[#007aff]'}`}
            style={{ fontFamily: '-apple-system, "SF Pro Text", system-ui, sans-serif' }}
          >
            {confirmLabel}
          </button>
        </div>
      </div>
    </div>
  )
}

function CommentSheet({ post, comments, onClose, onAddComment, onEditComment, onDeleteComment }) {
  const [text, setText] = useState('')
  const inputRef = useRef(null)
  const [commentActionId, setCommentActionId] = useState(null)
  const [editingCommentId, setEditingCommentId] = useState(null)
  const [editText, setEditText] = useState('')

  const submit = () => {
    const trimmed = text.trim()
    if (!trimmed) return
    onAddComment(post.id, trimmed)
    setText('')
  }

  return (
    <div className="phone-overlay flex flex-col justify-end" style={{ background: 'rgba(0,0,0,0.45)', zIndex: 110 }} onClick={onClose}>
      <div
        className="bg-white rounded-t-3xl flex flex-col"
        style={{ maxHeight: '75%', boxShadow: '0 -4px 30px rgba(0,0,0,0.15)' }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Handle + header */}
        <div className="flex-shrink-0 pt-3 pb-2 border-b border-[#f0f0f0]">
          <div className="w-10 h-1 bg-[#e5e5ea] rounded-full mx-auto mb-3" />
          <div className="flex items-center justify-between px-5 pb-1">
            <p className="text-[17px] font-bold text-[#1c1c1e]"
              style={{ fontFamily: '-apple-system, "SF Pro Display", system-ui, sans-serif' }}>
              Comments
            </p>
            <span className="text-[13px] text-[rgba(60,60,67,0.45)]"
              style={{ fontFamily: '-apple-system, "SF Pro Text", system-ui, sans-serif' }}>
              {comments.length}
            </span>
          </div>
        </div>

        {/* Comment list */}
        <div className="flex-1 overflow-y-auto px-5 py-3">
          {comments.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <div className="w-12 h-12 rounded-full bg-[#f4f4f4] flex items-center justify-center mb-3">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="rgba(60,60,67,0.35)" strokeWidth="2" strokeLinecap="round">
                  <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
                </svg>
              </div>
              <p className="text-[14px] text-[rgba(60,60,67,0.5)]"
                style={{ fontFamily: '-apple-system, "SF Pro Text", system-ui, sans-serif' }}>
                No comments yet. Be the first!
              </p>
            </div>
          ) : (
            <div className="flex flex-col gap-4">
              {comments.map((c) => (
                <div
                  key={c.id}
                  className="flex gap-3"
                >
                  <div
                    className="w-8 h-8 rounded-full flex items-center justify-center text-white text-[12px] font-bold flex-shrink-0 mt-0.5"
                    style={{ backgroundColor: c.avatarColor }}
                  >
                    {c.avatarLetter}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <span className="text-[13px] font-semibold text-[#1c1c1e]"
                        style={{ fontFamily: '-apple-system, "SF Pro Text", system-ui, sans-serif' }}>
                        {c.user}
                      </span>
                      <span className="text-[11px] text-[rgba(60,60,67,0.4)]">{c.time}</span>
                      <div className="flex-1" />
                      {editingCommentId !== c.id && (
                        <button
                          onClick={(e) => {
                            e.stopPropagation()
                            if (c.user === 'Jared Mango') setCommentActionId(c.id)
                          }}
                          className={`w-6 h-6 flex items-center justify-center rounded-full transition-colors ${c.user === 'Jared Mango' ? 'active:bg-[#f0f0f0]' : 'opacity-30'}`}
                        >
                          <svg width="14" height="14" viewBox="0 0 16 16" fill="rgba(60,60,67,0.45)">
                            <circle cx="3" cy="8" r="1.5" />
                            <circle cx="8" cy="8" r="1.5" />
                            <circle cx="13" cy="8" r="1.5" />
                          </svg>
                        </button>
                      )}
                    </div>
                    {editingCommentId === c.id ? (
                      <div className="mt-1 flex flex-col gap-1.5" onClick={(e) => e.stopPropagation()}>
                        <input
                          type="text"
                          value={editText}
                          onChange={(e) => setEditText(e.target.value)}
                          onKeyDown={(e) => {
                            if (e.key === 'Enter' && editText.trim()) {
                              onEditComment(post.id, c.id, editText.trim())
                              setEditingCommentId(null)
                            }
                          }}
                          autoFocus
                          className="w-full text-[14px] text-[#1c1c1e] bg-[#f4f4f4] rounded-lg px-3 py-1.5 focus:outline-none focus:ring-1 focus:ring-[#248a3d]"
                          style={{ fontFamily: '-apple-system, "SF Pro Text", system-ui, sans-serif' }}
                        />
                        <div className="flex gap-2">
                          <button
                            onClick={() => setEditingCommentId(null)}
                            className="text-[12px] text-[rgba(60,60,67,0.5)] font-medium"
                            style={{ fontFamily: '-apple-system, "SF Pro Text", system-ui, sans-serif' }}
                          >
                            Cancel
                          </button>
                          <button
                            onClick={() => {
                              if (editText.trim()) {
                                onEditComment(post.id, c.id, editText.trim())
                                setEditingCommentId(null)
                              }
                            }}
                            className="text-[12px] text-[#248a3d] font-semibold"
                            style={{ fontFamily: '-apple-system, "SF Pro Text", system-ui, sans-serif' }}
                          >
                            Save
                          </button>
                        </div>
                      </div>
                    ) : (
                      <p className="text-[14px] text-[#1c1c1e] leading-[20px] mt-0.5"
                        style={{ fontFamily: '-apple-system, "SF Pro Text", system-ui, sans-serif' }}>
                        {c.text}
                      </p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Comment ActionSheet */}
        {commentActionId && (
          <ActionSheet
            style={{ zIndex: 60 }}
            options={[
              { label: 'Edit', onTap: () => {
                const c = comments.find((x) => x.id === commentActionId)
                if (c) { setEditingCommentId(c.id); setEditText(c.text) }
              }},
              { label: 'Delete', destructive: true, onTap: () => {
                onDeleteComment(post.id, commentActionId)
              }},
            ]}
            onClose={() => setCommentActionId(null)}
          />
        )}

        {/* Input row */}
        <div className="flex-shrink-0 border-t border-[#f0f0f0] px-4 pt-3 pb-6 flex items-center gap-3" style={{ paddingBottom: 'max(1.5rem, env(safe-area-inset-bottom, 1.5rem))' }}>
          <div className="w-8 h-8 rounded-full bg-[#409cff] flex items-center justify-center text-white text-[12px] font-bold flex-shrink-0">
            J
          </div>
          <div className="flex-1 flex items-center bg-[#f4f4f4] rounded-full px-4 h-[36px]">
            <input
              ref={inputRef}
              type="text"
              value={text}
              onChange={(e) => setText(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && submit()}
              placeholder="Add a comment…"
              className="flex-1 bg-transparent text-[14px] text-[#1c1c1e] placeholder-[rgba(60,60,67,0.4)] focus:outline-none"
              style={{ fontFamily: '-apple-system, "SF Pro Text", system-ui, sans-serif' }}
            />
          </div>
          <button
            onClick={submit}
            disabled={!text.trim()}
            className="w-8 h-8 rounded-full bg-[#248a3d] flex items-center justify-center disabled:opacity-30 transition-opacity"
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <line x1="22" y1="2" x2="11" y2="13" />
              <polygon points="22 2 15 22 11 13 2 9 22 2" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  )
}

function ShareSheet({ friends, onClose }) {
  const [sentIds, setSentIds] = useState(new Set())

  const handleSend = (friendId) => {
    setSentIds((prev) => new Set(prev).add(friendId))
  }

  return (
    <div className="phone-overlay" style={{ position: 'fixed', inset: 0, zIndex: 50, display: 'flex', flexDirection: 'column', justifyContent: 'flex-end' }}>
      <div style={{ flex: 1, background: 'rgba(0,0,0,0.45)' }} onClick={onClose} />
      <div style={{ background: '#fff', borderRadius: '20px 20px 0 0', maxHeight: '55vh', display: 'flex', flexDirection: 'column' }}>
        {/* Drag handle */}
        <div className="flex justify-center pt-2.5 pb-1">
          <div className="w-9 h-[5px] rounded-full bg-[#e0e0e0]" />
        </div>

        {/* Header */}
        <div className="px-4 pb-3 pt-1 border-b border-[#f0f0f0]">
          <p
            className="text-[17px] font-bold text-[#1c1c1e] text-center"
            style={{ fontFamily: '-apple-system, "SF Pro Display", system-ui, sans-serif' }}
          >
            Share with Friends
          </p>
          <p
            className="text-[13px] text-[rgba(60,60,67,0.5)] text-center mt-0.5"
            style={{ fontFamily: '-apple-system, "SF Pro Text", system-ui, sans-serif' }}
          >
            {friends.length} friend{friends.length !== 1 ? 's' : ''}
          </p>
        </div>

        {/* Friends list or empty state */}
        <div className="overflow-y-auto flex-1" style={{ WebkitOverflowScrolling: 'touch' }}>
          {friends.length > 0 ? (
            friends.map((f) => {
              const avatarColor = '#' + ((f.friendId * 987654 + 333) % 0xffffff).toString(16).padStart(6, '0')
              const sent = sentIds.has(f.friendId)
              return (
                <div key={f.friendId} className="flex items-center px-4 py-3 gap-3">
                  <div
                    className="w-10 h-10 rounded-full flex items-center justify-center text-white text-[14px] font-bold flex-shrink-0"
                    style={{ backgroundColor: avatarColor }}
                  >
                    {f.friendName.charAt(0).toUpperCase()}
                  </div>
                  <p
                    className="flex-1 text-[15px] font-medium text-[#1c1c1e] truncate"
                    style={{ fontFamily: '-apple-system, "SF Pro Text", system-ui, sans-serif' }}
                  >
                    {f.friendName}
                  </p>
                  <button
                    onClick={() => handleSend(f.friendId)}
                    disabled={sent}
                    className="px-4 py-1.5 rounded-full text-[13px] font-semibold flex-shrink-0 transition-all"
                    style={{
                      fontFamily: '-apple-system, "SF Pro Text", system-ui, sans-serif',
                      backgroundColor: sent ? '#f4f4f4' : '#248a3d',
                      color: sent ? 'rgba(60,60,67,0.5)' : '#fff',
                    }}
                  >
                    {sent ? 'Sent' : 'Send'}
                  </button>
                </div>
              )
            })
          ) : (
            <div className="flex flex-col items-center justify-center py-12 px-8 text-center">
              <div className="w-14 h-14 rounded-full bg-[#f4f4f4] flex items-center justify-center mb-3">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none"
                  stroke="rgba(60,60,67,0.35)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
                  <circle cx="9" cy="7" r="4" />
                  <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
                  <path d="M16 3.13a4 4 0 0 1 0 7.75" />
                </svg>
              </div>
              <p
                className="text-[16px] font-semibold text-[#1c1c1e] mb-1"
                style={{ fontFamily: '-apple-system, "SF Pro Display", system-ui, sans-serif' }}
              >
                No friends yet
              </p>
              <p
                className="text-[13px] text-[rgba(60,60,67,0.5)]"
                style={{ fontFamily: '-apple-system, "SF Pro Text", system-ui, sans-serif' }}
              >
                Add friends to share posts
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

function CommunityBubble({ name, abbr, color, active, onPress }) {
  return (
    <button onClick={onPress} className="flex flex-col items-center gap-1.5 flex-shrink-0">
      <div
        className={`w-[44px] h-[44px] rounded-full flex items-center justify-center text-white text-[11px] font-bold shadow-sm ${active ? 'ring-2 ring-[#248a3d] ring-offset-2' : ''}`}
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

function PostCard({ post, commentCount, onCommentPress, isOwn, onMenuPress, onSharePress, onLike, liked }) {
  const [playing, setPlaying] = useState(false)
  const videoRef = useRef(null)

  const togglePlay = () => {
    const v = videoRef.current
    if (!v) return
    if (playing) { v.pause() } else { v.play() }
    setPlaying(!playing)
  }

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
        <button className="text-[rgba(60,60,67,0.35)]" onClick={() => onMenuPress && onMenuPress()}>
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

      {/* Video / Image */}
      {post.video && (
        <div className="mx-4 mb-3 rounded-xl overflow-hidden relative cursor-pointer" onClick={togglePlay}>
          <video ref={videoRef} src={`${post.video}#t=0.001`}  className="w-full" style={{ display: 'block' }} muted playsInline loop />
          {!playing && (
            <div className="absolute inset-0 flex items-center justify-center bg-black/20">
              <div className="w-14 h-14 rounded-full bg-white/90 flex items-center justify-center shadow-lg">
                <svg width="22" height="22" viewBox="0 0 24 24" fill="#1c1c1e">
                  <polygon points="6,3 21,12 6,21" />
                </svg>
              </div>
            </div>
          )}
        </div>
      )}
      {post.img && !post.video && (
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
          onClick={() => { onLike && onLike(post.id, !liked) }}
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
            {post.likes}
          </span>
        </button>
        <button onClick={onCommentPress} className="flex items-center gap-1.5">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none"
            stroke="rgba(60,60,67,0.45)" strokeWidth="2" strokeLinecap="round">
            <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
          </svg>
          <span
            className="text-[13px] font-medium text-[rgba(60,60,67,0.5)]"
            style={{ fontFamily: '-apple-system, "SF Pro Text", system-ui, sans-serif' }}
          >
            {commentCount}
          </span>
        </button>
        <button className="flex items-center gap-1.5 ml-auto" onClick={onSharePress}>
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
  const [selectedTags, setSelectedTags] = useState(draft.tag ? [draft.tag] : [])

  const toggleTag = (tag) => {
    setSelectedTags((prev) =>
      prev.includes(tag) ? [] : [tag]
    )
  }

  const handlePost = () => {
    setPosted(true)
    setTimeout(() => { onPost({ caption, community: selectedCommunity, tags: selectedTags }); onClose() }, 900)
  }

  return (
    <div className="phone-overlay" style={{ background: 'rgba(0,0,0,0.55)', zIndex: 40 }}>
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
          <div className="w-9 h-9 rounded-full bg-[#409cff] flex items-center justify-center text-white text-[14px] font-bold flex-shrink-0">
            J
          </div>
          <div className="flex-1">
            <p className="text-[13px] font-semibold text-[#1c1c1e] mb-1"
              style={{ fontFamily: '-apple-system, "SF Pro Text", system-ui, sans-serif' }}>
              Jared Mango
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
          {selectedTags.length > 0 && (
            <div className="flex flex-wrap gap-1 flex-shrink-0">
              {selectedTags.map((t) => (
                <span key={t} className="text-[11px] font-semibold bg-[#e5f8e9] text-[#248a3d] px-2.5 py-1 rounded-full">
                  {t}
                </span>
              ))}
            </div>
          )}
        </div>

        {/* Tags */}
        <div className="px-4 pb-3">
          <p className="text-[11px] font-semibold uppercase tracking-[0.5px] text-[rgba(60,60,67,0.4)] mb-2"
            style={{ fontFamily: '-apple-system, "SF Pro Text", system-ui, sans-serif' }}>
            Tags
          </p>
          <div className="flex flex-wrap gap-2">
            {AVAILABLE_TAGS.map((tag) => (
              <button
                key={tag}
                onClick={() => toggleTag(tag)}
                className="px-3 py-1.5 rounded-full text-[12px] font-semibold transition-all"
                style={{
                  backgroundColor: selectedTags.includes(tag) ? '#248a3d' : '#f4f4f4',
                  color: selectedTags.includes(tag) ? 'white' : '#1c1c1e',
                  fontFamily: '-apple-system, "SF Pro Text", system-ui, sans-serif',
                }}>
                {tag}
              </button>
            ))}
          </div>
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

function EditPostSheet({ post, onClose, onSave }) {
  const [caption, setCaption] = useState(post.body)

  return (
    <div className="phone-overlay" style={{ background: 'rgba(0,0,0,0.55)', zIndex: 40 }}>
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
            Edit Post
          </p>
          <button
            onClick={() => { if (caption.trim()) { onSave(post.id, caption.trim()); onClose() } }}
            disabled={!caption.trim()}
            className="px-4 py-1.5 rounded-full text-[14px] font-semibold bg-[#248a3d] text-white disabled:opacity-40 transition-all"
            style={{ fontFamily: '-apple-system, "SF Pro Text", system-ui, sans-serif' }}>
            Save
          </button>
        </div>

        {/* Author row + caption */}
        <div className="flex gap-3 px-4 pt-4 pb-4">
          <div className="w-9 h-9 rounded-full bg-[#409cff] flex items-center justify-center text-white text-[14px] font-bold flex-shrink-0">
            J
          </div>
          <div className="flex-1">
            <p className="text-[13px] font-semibold text-[#1c1c1e] mb-1"
              style={{ fontFamily: '-apple-system, "SF Pro Text", system-ui, sans-serif' }}>
              Jared Mango
            </p>
            <textarea
              value={caption}
              onChange={(e) => setCaption(e.target.value)}
              rows={3}
              autoFocus
              placeholder="What's on your mind?"
              className="w-full text-[14px] text-[#1c1c1e] placeholder-[rgba(60,60,67,0.35)] resize-none focus:outline-none leading-[20px]"
              style={{ fontFamily: '-apple-system, "SF Pro Text", system-ui, sans-serif' }}
            />
          </div>
        </div>
      </div>
    </div>
  )
}

export default function CommunitiesPage() {
  const navigate = useNavigate()
  const { state } = useLocation()
  const { user } = useAuth()
  const [tab, setTab] = useState(state?.tab || 'feed')       // 'feed' | 'communities' | 'friends'
  const [showCompose, setShowCompose] = useState(!!state?.draft)
  const [composeDraft, setComposeDraft] = useState(state?.draft || null)
  const [posts, setPosts] = useState(() => loadPosts())
  const postRefs = useRef({})
  const [highlightPostId, setHighlightPostId] = useState(null)

  const openCompose = (draft = { type: 'swing-analyser', caption: '', tag: 'Swing Analyzer' }) => {
    setComposeDraft(draft)
    setShowCompose(true)
  }

  const addPost = ({ caption, community, tags }) => {
    if (!caption.trim()) return
    const newPost = {
      id: Date.now(),
      community: community.name.replace('\n', ' '),
      communityColor: community.color,
      communityAbbr: community.abbr,
      user: 'Jared Mango',
      avatarColor: '#409cff',
      avatarLetter: 'J',
      time: 'just now',
      body: caption.trim(),
      likes: 0,
      comments: 0,
      img: null,
      video: balltraceVideo,
      tags: tags || [],
    }
    setPosts((prev) => {
      const updated = [newPost, ...prev]
      savePosts(updated)
      return updated
    })
  }

  const [activeCommunity, setActiveCommunity] = useState(null)
  const [query, setQuery] = useState('')
  const [postSearch, setPostSearch] = useState('')
  const [communities, setCommunities] = useState(ALL_COMMUNITIES)
  const [activeCommentPostId, setActiveCommentPostId] = useState(null)
  const [allComments, setAllComments] = useState(() => {
    try {
      const saved = localStorage.getItem('parvision_comments')
      return saved ? JSON.parse(saved) : INITIAL_COMMENTS
    } catch {
      return INITIAL_COMMENTS
    }
  })

  const [likedPostIds, setLikedPostIds] = useState(() => {
    try {
      const saved = localStorage.getItem('parvision_liked_posts')
      return saved ? new Set(JSON.parse(saved)) : new Set()
    } catch {
      return new Set()
    }
  })
  const [actionSheetPostId, setActionSheetPostId] = useState(null)
  const [editingPost, setEditingPost] = useState(null)
  const [deleteConfirmPostId, setDeleteConfirmPostId] = useState(null)

  // ── Friends state ──
  const [friends, setFriends] = useState([])
  const [friendRequests, setFriendRequests] = useState([])
  const [outgoingRequests, setOutgoingRequests] = useState([])
  const [friendsSubTab, setFriendsSubTab] = useState('list') // 'list' | 'requests'
  const [friendSearch, setFriendSearch] = useState('')
  const [friendSearchResults, setFriendSearchResults] = useState([])
  const [removeFriendConfirm, setRemoveFriendConfirm] = useState(null)
  const [sharePostId, setSharePostId] = useState(null)
  const [hiddenPostIds, setHiddenPostIds] = useState(new Set())
  const [reportConfirmPostId, setReportConfirmPostId] = useState(null)

  useEffect(() => {
    if (state?.postId) {
      setTab('feed')
      setActiveCommunity(null)
      setTimeout(() => {
        const el = postRefs.current[state.postId]
        if (el) {
          el.scrollIntoView({ behavior: 'smooth', block: 'center' })
          setHighlightPostId(state.postId)
          setTimeout(() => setHighlightPostId(null), 1500)
        }
      }, 100)
    }
  }, [state?.postId])

  const fetchFriendsData = useCallback(() => {
    if (!user?.id) return
    fetch(`/api/friends?userId=${user.id}`).then(r => r.json()).then(setFriends).catch(() => {})
    fetch(`/api/friendRequests?toUserId=${user.id}&status=pending`).then(r => r.json()).then(setFriendRequests).catch(() => {})
    fetch(`/api/friendRequests?fromUserId=${user.id}&status=pending`).then(r => r.json()).then(setOutgoingRequests).catch(() => {})
  }, [user?.id])

  useEffect(() => {
    fetchFriendsData()
  }, [fetchFriendsData])

  const searchFriendsDebounceRef = useRef(null)
  useEffect(() => {
    if (friendsSubTab !== 'list' || !friendSearch.trim()) {
      setFriendSearchResults([])
      return
    }
    clearTimeout(searchFriendsDebounceRef.current)
    searchFriendsDebounceRef.current = setTimeout(() => {
      fetch(`/api/users/search?q=${encodeURIComponent(friendSearch.trim())}`)
        .then(r => r.json())
        .then(setFriendSearchResults)
        .catch(() => {})
    }, 300)
  }, [friendSearch, friendsSubTab])

  const sendFriendRequest = async (toUser) => {
    if (!user?.id) return
    const requests = await fetch('/api/friendRequests').then(r => r.json())
    const nextId = requests.length > 0 ? Math.max(...requests.map(r => r.id)) + 1 : 1
    await fetch('/api/friendRequests', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        id: nextId,
        fromUserId: user.id,
        toUserId: toUser.id,
        fromUserName: user.name,
        toUserName: toUser.name,
        status: 'pending',
        createdAt: new Date().toISOString(),
      }),
    })
    fetchFriendsData()
  }

  const acceptRequest = async (requestId) => {
    await fetch('/api/friends/accept', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ requestId }),
    })
    fetchFriendsData()
  }

  const rejectRequest = async (requestId) => {
    await fetch('/api/friends/reject', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ requestId }),
    })
    fetchFriendsData()
  }

  const cancelRequest = async (requestId) => {
    await fetch(`/api/friendRequests/${requestId}`, { method: 'DELETE' })
    fetchFriendsData()
  }

  const removeFriend = async (friendId) => {
    await fetch('/api/friends/remove', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ userId: user.id, friendId }),
    })
    fetchFriendsData()
  }

  const getFriendStatus = (targetUserId) => {
    if (friends.some(f => f.friendId === targetUserId)) return 'friends'
    if (outgoingRequests.some(r => r.toUserId === targetUserId)) return 'pending-out'
    if (friendRequests.some(r => r.fromUserId === targetUserId)) return 'pending-in'
    return 'none'
  }

  const addComment = (postId, text) => {
    setAllComments((prev) => {
      const updated = {
        ...prev,
        [postId]: [
          ...(prev[postId] || []),
          {
            id: Date.now(),
            user: 'Jared Mango',
            avatarColor: '#409cff',
            avatarLetter: 'J',
            time: 'just now',
            text,
          },
        ],
      }
      localStorage.setItem('parvision_comments', JSON.stringify(updated))
      setPosts((prev) => {
        const synced = prev.map((p) => p.id === postId ? { ...p, comments: updated[postId].length } : p)
        savePosts(synced)
        return synced
      })
      return updated
    })
  }

  const likePost = (postId, isLiked) => {
    setPosts((prev) => {
      const updated = prev.map((p) => p.id === postId ? { ...p, likes: p.likes + (isLiked ? 1 : -1) } : p)
      savePosts(updated)
      return updated
    })
    setLikedPostIds((prev) => {
      const updated = new Set(prev)
      if (isLiked) updated.add(postId); else updated.delete(postId)
      localStorage.setItem('parvision_liked_posts', JSON.stringify([...updated]))
      return updated
    })
  }

  const editPost = (postId, newBody) => {
    setPosts((prev) => {
      const updated = prev.map((p) => p.id === postId ? { ...p, body: newBody } : p)
      savePosts(updated)
      return updated
    })
  }

  const deletePost = (postId) => {
    setPosts((prev) => {
      const updated = prev.filter((p) => p.id !== postId)
      savePosts(updated)
      return updated
    })
    setAllComments((prev) => {
      const updated = { ...prev }
      delete updated[postId]
      localStorage.setItem('parvision_comments', JSON.stringify(updated))
      return updated
    })
  }

  const editComment = (postId, commentId, newText) => {
    setAllComments((prev) => {
      const updated = {
        ...prev,
        [postId]: (prev[postId] || []).map((c) =>
          c.id === commentId ? { ...c, text: newText } : c
        ),
      }
      localStorage.setItem('parvision_comments', JSON.stringify(updated))
      return updated
    })
  }

  const deleteComment = (postId, commentId) => {
    setAllComments((prev) => {
      const updated = {
        ...prev,
        [postId]: (prev[postId] || []).filter((c) => c.id !== commentId),
      }
      localStorage.setItem('parvision_comments', JSON.stringify(updated))
      setPosts((prev) => {
        const synced = prev.map((p) => p.id === postId ? { ...p, comments: updated[postId].length } : p)
        savePosts(synced)
        return synced
      })
      return updated
    })
  }

  const toggleJoin = (id) => {
    setCommunities((prev) =>
      prev.map((c) => (c.id === id ? { ...c, joined: !c.joined } : c))
    )
  }

  const filteredCommunities = communities.filter((c) =>
    !query || c.name.toLowerCase().includes(query.toLowerCase())
  )

  const filteredPosts = (activeCommunity
    ? posts.filter((p) => p.community === activeCommunity)
    : posts
  ).filter((p) => !hiddenPostIds.has(p.id))
   .filter((p) => !postSearch.trim() || p.body?.toLowerCase().includes(postSearch.trim().toLowerCase()) || p.user?.toLowerCase().includes(postSearch.trim().toLowerCase()) || p.community?.toLowerCase().includes(postSearch.trim().toLowerCase()))

  const actionSheetTarget = actionSheetPostId ? posts.find((p) => p.id === actionSheetPostId) : null
  const isActionSheetOwn = actionSheetTarget?.user === 'Jared Mango'

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
        </div>

        {/* Tab bar */}
        <div className="flex px-5 gap-6">
          {[
            { key: 'feed',        label: 'Feed'        },
            { key: 'communities', label: 'Communities' },
            { key: 'friends',     label: 'Friends'     },
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
              <div className="flex gap-4 overflow-x-auto p-1 no-scrollbar">
                {/* "All" bubble */}
                <button
                  onClick={() => setActiveCommunity(null)}
                  className="flex flex-col items-center gap-1.5 flex-shrink-0"
                >
                  <div
                    className={`w-[44px] h-[44px] rounded-full flex items-center justify-center shadow-sm transition-all ${
                      activeCommunity === null
                        ? 'ring-2 ring-[#248a3d] ring-offset-2'
                        : ''
                    }`}
                    style={{ background: activeCommunity === null ? '#248a3d' : 'linear-gradient(135deg,#248a3d,#409cff)' }}
                  >
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none"
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
                    active={activeCommunity === c.name.replace('\n', ' ')}
                    onPress={() =>
                      setActiveCommunity((prev) =>
                        prev === c.name.replace('\n', ' ') ? null : c.name.replace('\n', ' ')
                      )
                    }
                  />
                ))}
              </div>
            </div>

            {/* Search bar + Add Post */}
            <div className="bg-white px-5 py-3 border-b border-[#f0f0f0] flex items-center gap-2.5">
              <div className="flex-1 flex items-center bg-[#f4f4f4] rounded-[12px] h-[36px] px-3 gap-2">
                <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                  <circle cx="6" cy="6" r="4.5" stroke="rgba(60,60,67,0.4)" strokeWidth="1.5" />
                  <path d="M10 10L12.5 12.5" stroke="rgba(60,60,67,0.4)" strokeWidth="1.5" strokeLinecap="round" />
                </svg>
                <input
                  type="text"
                  value={postSearch}
                  onChange={(e) => setPostSearch(e.target.value)}
                  placeholder="Search posts"
                  className="flex-1 bg-transparent text-[14px] text-[#1c1c1e] placeholder-[rgba(60,60,67,0.4)] focus:outline-none"
                  style={{ fontFamily: '-apple-system, "SF Pro Text", system-ui, sans-serif' }}
                />
                {postSearch ? (
                  <button onClick={() => setPostSearch('')} className="text-[rgba(60,60,67,0.4)]">
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
                      <circle cx="12" cy="12" r="10" opacity="0.3" />
                      <path d="M15 9l-6 6M9 9l6 6" stroke="rgba(60,60,67,0.7)" strokeWidth="2" strokeLinecap="round" fill="none" />
                    </svg>
                  </button>
                ) : null}
              </div>
              <button onClick={() => openCompose()} className="w-9 h-9 bg-[#248a3d] rounded-full flex items-center justify-center shadow-sm flex-shrink-0">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none"
                  stroke="white" strokeWidth="2.5" strokeLinecap="round">
                  <line x1="12" y1="5" x2="12" y2="19" />
                  <line x1="5" y1="12" x2="19" y2="12" />
                </svg>
              </button>
            </div>

            {/* Hidden posts banner */}
            {hiddenPostIds.size > 0 && (
              <div className="flex items-center justify-between px-5 py-2.5 bg-white border-b border-[#f0f0f0]">
                <span className="text-[13px] text-[rgba(60,60,67,0.6)]" style={{ fontFamily: '-apple-system, "SF Pro Text", system-ui, sans-serif' }}>
                  {hiddenPostIds.size} hidden {hiddenPostIds.size === 1 ? 'post' : 'posts'}
                </span>
                <button
                  className="text-[13px] font-semibold text-[#007aff]"
                  style={{ fontFamily: '-apple-system, "SF Pro Text", system-ui, sans-serif' }}
                  onClick={() => setHiddenPostIds(new Set())}
                >
                  Unhide All
                </button>
              </div>
            )}

            {/* Posts */}
            <div className="pt-2">
              {filteredPosts.length > 0 ? (
                filteredPosts.map((post) => (
                  <div
                    key={post.id}
                    ref={(el) => { postRefs.current[post.id] = el }}
                    className={`transition-colors duration-700 ${highlightPostId === post.id ? 'bg-[#e5f8e9] rounded-2xl' : ''}`}
                  >
                    <PostCard
                      post={post}
                      commentCount={(allComments[post.id] || []).length}
                      onCommentPress={() => setActiveCommentPostId(post.id)}
                      isOwn={post.user === 'Jared Mango'}
                      onMenuPress={() => setActionSheetPostId(post.id)}
                      onSharePress={() => setSharePostId(post.id)}
                      onLike={likePost}
                      liked={likedPostIds.has(post.id)}
                    />
                  </div>
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

        {/* ══ FRIENDS TAB ══ */}
        {tab === 'friends' && (
          <div>
            {/* Sub-tab pills */}
            <div className="bg-white px-5 py-3 border-b border-[#f0f0f0] flex gap-2">
              {[
                { key: 'list', label: 'My Friends' },
                { key: 'requests', label: 'Requests', badge: friendRequests.length },
              ].map(({ key, label, badge }) => (
                <button
                  key={key}
                  onClick={() => setFriendsSubTab(key)}
                  className={`px-3.5 py-1.5 rounded-full text-[13px] font-semibold transition-all relative ${
                    friendsSubTab === key
                      ? 'bg-[#248a3d] text-white'
                      : 'bg-[#f4f4f4] text-[rgba(60,60,67,0.6)]'
                  }`}
                  style={{ fontFamily: '-apple-system, "SF Pro Text", system-ui, sans-serif' }}
                >
                  {label}
                  {badge > 0 && (
                    <span className="absolute -top-1 -right-1 w-[18px] h-[18px] bg-[#ff3b30] text-white text-[10px] font-bold rounded-full flex items-center justify-center">
                      {badge}
                    </span>
                  )}
                </button>
              ))}
            </div>

            {/* ── My Friends sub-tab ── */}
            {friendsSubTab === 'list' && (
              <div>
                {/* Search bar — always visible for searching friends + adding new ones */}
                <div className="bg-white px-5 py-3 border-b border-[#f0f0f0]">
                  <div className="flex items-center bg-[#f4f4f4] rounded-[12px] h-[36px] px-3 gap-2">
                    <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                      <circle cx="6" cy="6" r="4.5" stroke="rgba(60,60,67,0.4)" strokeWidth="1.5" />
                      <path d="M10 10L12.5 12.5" stroke="rgba(60,60,67,0.4)" strokeWidth="1.5" strokeLinecap="round" />
                    </svg>
                    <input
                      type="text"
                      value={friendSearch}
                      onChange={(e) => setFriendSearch(e.target.value)}
                      placeholder="Search or add friends"
                      className="flex-1 bg-transparent text-[14px] text-[#1c1c1e] placeholder-[rgba(60,60,67,0.4)] focus:outline-none"
                      style={{ fontFamily: '-apple-system, "SF Pro Text", system-ui, sans-serif' }}
                    />
                    {friendSearch ? (
                      <button onClick={() => setFriendSearch('')} className="text-[rgba(60,60,67,0.4)]">
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
                          <circle cx="12" cy="12" r="10" opacity="0.3" />
                          <path d="M15 9l-6 6M9 9l6 6" stroke="rgba(60,60,67,0.7)" strokeWidth="2" strokeLinecap="round" fill="none" />
                        </svg>
                      </button>
                    ) : null}
                  </div>
                </div>

                {(() => {
                  const query = friendSearch.trim().toLowerCase();
                  const filteredFriends = query
                    ? friends.filter(f => f.friendName?.charAt(0)?.toLowerCase() === query.charAt(0))
                    : friends;
                  const friendIds = new Set(friends.map(f => f.friendId));
                  const nonFriendResults = friendSearchResults.filter(u => u.id !== user?.id && !friendIds.has(u.id));

                  return (
                    <div className="px-4 pt-4">
                      {/* Existing friends */}
                      {filteredFriends.length > 0 && (
                        <>
                          {query && (
                            <p className="text-[12px] font-semibold text-[rgba(60,60,67,0.5)] uppercase tracking-wide mb-2 px-1" style={{ fontFamily: '-apple-system, "SF Pro Text", system-ui, sans-serif' }}>
                              My Friends
                            </p>
                          )}
                          <div className="bg-white rounded-2xl overflow-hidden mb-4" style={{ boxShadow: '0 1px 3px rgba(0,0,0,0.06)' }}>
                            {filteredFriends.map((f, i) => (
                              <div key={f.id}>
                                <div className="flex items-center px-4 py-3.5 gap-3">
                                  <div
                                    className="w-11 h-11 rounded-full flex items-center justify-center text-white text-[15px] font-bold flex-shrink-0"
                                    style={{ backgroundColor: '#' + ((f.friendId * 987654 + 333) % 0xffffff).toString(16).padStart(6, '0') }}
                                  >
                                    {f.friendName?.charAt(0)?.toUpperCase() || '?'}
                                  </div>
                                  <div className="flex-1 min-w-0">
                                    <p className="text-[15px] font-semibold text-[#1c1c1e] leading-[20px] truncate" style={{ fontFamily: '-apple-system, "SF Pro Text", system-ui, sans-serif' }}>{f.friendName}</p>
                                  </div>
                                  <button
                                    onClick={() => setRemoveFriendConfirm(f)}
                                    className="px-3 py-1.5 rounded-full text-[12px] font-semibold text-[#ff3b30] bg-[#fff5f5]"
                                    style={{ fontFamily: '-apple-system, "SF Pro Text", system-ui, sans-serif' }}
                                  >
                                    Remove
                                  </button>
                                </div>
                                {i < filteredFriends.length - 1 && <div className="h-px bg-[#f0f0f0] ml-[68px]" />}
                              </div>
                            ))}
                          </div>
                        </>
                      )}

                      {/* Search results — non-friends from API */}
                      {query && nonFriendResults.length > 0 && (
                        <>
                          <p className="text-[12px] font-semibold text-[rgba(60,60,67,0.5)] uppercase tracking-wide mb-2 px-1" style={{ fontFamily: '-apple-system, "SF Pro Text", system-ui, sans-serif' }}>
                            Add Friends
                          </p>
                          <div className="bg-white rounded-2xl overflow-hidden mb-4" style={{ boxShadow: '0 1px 3px rgba(0,0,0,0.06)' }}>
                            {nonFriendResults.map((u, i) => {
                              const status = getFriendStatus(u.id);
                              return (
                                <div key={u.id}>
                                  <div className="flex items-center px-4 py-3.5 gap-3">
                                    <div
                                      className="w-11 h-11 rounded-full flex items-center justify-center text-white text-[15px] font-bold flex-shrink-0"
                                      style={{ backgroundColor: '#' + ((u.id * 987654 + 333) % 0xffffff).toString(16).padStart(6, '0') }}
                                    >
                                      {u.name?.charAt(0)?.toUpperCase() || '?'}
                                    </div>
                                    <div className="flex-1 min-w-0">
                                      <p className="text-[15px] font-semibold text-[#1c1c1e] leading-[20px] truncate" style={{ fontFamily: '-apple-system, "SF Pro Text", system-ui, sans-serif' }}>{u.name}</p>
                                    </div>
                                    {status === 'none' && (
                                      <button
                                        onClick={() => sendFriendRequest(u)}
                                        className="px-3 py-1.5 rounded-full text-[12px] font-semibold bg-[#248a3d] text-white"
                                        style={{ fontFamily: '-apple-system, "SF Pro Text", system-ui, sans-serif' }}
                                      >
                                        Add Friend
                                      </button>
                                    )}
                                    {status === 'pending-out' && (
                                      <span className="px-3 py-1.5 rounded-full text-[12px] font-semibold text-[rgba(60,60,67,0.5)] bg-[#f4f4f4]" style={{ fontFamily: '-apple-system, "SF Pro Text", system-ui, sans-serif' }}>Pending</span>
                                    )}
                                    {status === 'pending-in' && (
                                      <span className="px-3 py-1.5 rounded-full text-[12px] font-semibold text-[#f97316] bg-[#fff7ed]" style={{ fontFamily: '-apple-system, "SF Pro Text", system-ui, sans-serif' }}>Respond</span>
                                    )}
                                  </div>
                                  {i < nonFriendResults.length - 1 && <div className="h-px bg-[#f0f0f0] ml-[68px]" />}
                                </div>
                              );
                            })}
                          </div>
                        </>
                      )}

                      {/* Empty states */}
                      {!query && friends.length === 0 && (
                        <div className="flex flex-col items-center justify-center py-16 text-center">
                          <div className="w-14 h-14 bg-[#f4f4f4] rounded-full flex items-center justify-center mb-3">
                            <span className="text-[24px]">👥</span>
                          </div>
                          <p className="text-[15px] font-semibold text-[#1c1c1e] mb-1" style={{ fontFamily: '-apple-system, "SF Pro Text", system-ui, sans-serif' }}>No friends yet</p>
                          <p className="text-[13px] text-[rgba(60,60,67,0.5)]" style={{ fontFamily: '-apple-system, "SF Pro Text", system-ui, sans-serif' }}>Search above to find and add friends</p>
                        </div>
                      )}

                      {query && filteredFriends.length === 0 && nonFriendResults.length === 0 && (
                        <div className="flex flex-col items-center justify-center py-16 text-center">
                          <p className="text-[15px] font-semibold text-[#1c1c1e] mb-1" style={{ fontFamily: '-apple-system, "SF Pro Text", system-ui, sans-serif' }}>No results</p>
                          <p className="text-[13px] text-[rgba(60,60,67,0.5)]" style={{ fontFamily: '-apple-system, "SF Pro Text", system-ui, sans-serif' }}>No users found matching "{friendSearch}"</p>
                        </div>
                      )}
                    </div>
                  );
                })()}
              </div>
            )}

            {/* ── Requests sub-tab ── */}
            {friendsSubTab === 'requests' && (
              <div className="px-4 pt-4">
                {/* Incoming */}
                {friendRequests.length > 0 && (
                  <>
                    <p className="text-[13px] font-semibold uppercase tracking-[0.5px] text-[rgba(60,60,67,0.45)] mb-2 px-1" style={{ fontFamily: '-apple-system, "SF Pro Text", system-ui, sans-serif' }}>Incoming</p>
                    <div className="bg-white rounded-2xl overflow-hidden mb-4" style={{ boxShadow: '0 1px 3px rgba(0,0,0,0.06)' }}>
                      {friendRequests.map((r, i) => (
                        <div key={r.id}>
                          <div className="flex items-center px-4 py-3.5 gap-3">
                            <div
                              className="w-11 h-11 rounded-full flex items-center justify-center text-white text-[15px] font-bold flex-shrink-0"
                              style={{ backgroundColor: '#' + ((r.fromUserId * 987654 + 333) % 0xffffff).toString(16).padStart(6, '0') }}
                            >
                              {r.fromUserName?.charAt(0)?.toUpperCase() || '?'}
                            </div>
                            <div className="flex-1 min-w-0">
                              <p className="text-[15px] font-semibold text-[#1c1c1e] leading-[20px] truncate" style={{ fontFamily: '-apple-system, "SF Pro Text", system-ui, sans-serif' }}>{r.fromUserName}</p>
                            </div>
                            <div className="flex gap-2 flex-shrink-0">
                              <button
                                onClick={() => acceptRequest(r.id)}
                                className="px-3 py-1.5 rounded-full text-[12px] font-semibold bg-[#248a3d] text-white"
                                style={{ fontFamily: '-apple-system, "SF Pro Text", system-ui, sans-serif' }}
                              >
                                Accept
                              </button>
                              <button
                                onClick={() => rejectRequest(r.id)}
                                className="px-3 py-1.5 rounded-full text-[12px] font-semibold border border-[#ff3b30] text-[#ff3b30]"
                                style={{ fontFamily: '-apple-system, "SF Pro Text", system-ui, sans-serif' }}
                              >
                                Reject
                              </button>
                            </div>
                          </div>
                          {i < friendRequests.length - 1 && <div className="h-px bg-[#f0f0f0] ml-[68px]" />}
                        </div>
                      ))}
                    </div>
                  </>
                )}

                {/* Outgoing */}
                {outgoingRequests.length > 0 && (
                  <>
                    <p className="text-[13px] font-semibold uppercase tracking-[0.5px] text-[rgba(60,60,67,0.45)] mb-2 px-1" style={{ fontFamily: '-apple-system, "SF Pro Text", system-ui, sans-serif' }}>Sent</p>
                    <div className="bg-white rounded-2xl overflow-hidden mb-4" style={{ boxShadow: '0 1px 3px rgba(0,0,0,0.06)' }}>
                      {outgoingRequests.map((r, i) => (
                        <div key={r.id}>
                          <div className="flex items-center px-4 py-3.5 gap-3">
                            <div
                              className="w-11 h-11 rounded-full flex items-center justify-center text-white text-[15px] font-bold flex-shrink-0"
                              style={{ backgroundColor: '#' + ((r.toUserId * 987654 + 333) % 0xffffff).toString(16).padStart(6, '0') }}
                            >
                              {r.toUserName?.charAt(0)?.toUpperCase() || '?'}
                            </div>
                            <div className="flex-1 min-w-0">
                              <p className="text-[15px] font-semibold text-[#1c1c1e] leading-[20px] truncate" style={{ fontFamily: '-apple-system, "SF Pro Text", system-ui, sans-serif' }}>{r.toUserName}</p>
                            </div>
                            <button
                              onClick={() => cancelRequest(r.id)}
                              className="px-3 py-1.5 rounded-full text-[12px] font-semibold text-[rgba(60,60,67,0.5)] bg-[#f4f4f4]"
                              style={{ fontFamily: '-apple-system, "SF Pro Text", system-ui, sans-serif' }}
                            >
                              Cancel
                            </button>
                          </div>
                          {i < outgoingRequests.length - 1 && <div className="h-px bg-[#f0f0f0] ml-[68px]" />}
                        </div>
                      ))}
                    </div>
                  </>
                )}

                {friendRequests.length === 0 && outgoingRequests.length === 0 && (
                  <div className="flex flex-col items-center justify-center py-16 text-center">
                    <div className="w-14 h-14 bg-[#f4f4f4] rounded-full flex items-center justify-center mb-3">
                      <span className="text-[24px]">📬</span>
                    </div>
                    <p className="text-[15px] font-semibold text-[#1c1c1e] mb-1" style={{ fontFamily: '-apple-system, "SF Pro Text", system-ui, sans-serif' }}>No pending requests</p>
                    <p className="text-[13px] text-[rgba(60,60,67,0.5)]" style={{ fontFamily: '-apple-system, "SF Pro Text", system-ui, sans-serif' }}>Friend requests will appear here</p>
                  </div>
                )}
              </div>
            )}

          </div>
        )}
      </div>

      <BottomNav />

      {showCompose && composeDraft !== undefined && (
        <ComposeSheet
          draft={composeDraft}
          onClose={() => setShowCompose(false)}
          onPost={addPost}
        />
      )}

      {activeCommentPostId !== null && (
        <CommentSheet
          post={posts.find((p) => p.id === activeCommentPostId)}
          comments={allComments[activeCommentPostId] || []}
          onClose={() => setActiveCommentPostId(null)}
          onAddComment={addComment}
          onEditComment={editComment}
          onDeleteComment={deleteComment}
        />
      )}

      {actionSheetPostId && (
        <ActionSheet
          options={isActionSheetOwn
            ? [
                { label: 'Edit Post', onTap: () => { if (actionSheetTarget) setEditingPost(actionSheetTarget) }},
                { label: 'Delete Post', destructive: true, onTap: () => { setDeleteConfirmPostId(actionSheetPostId) }},
              ]
            : [
                { label: 'Report Post', destructive: true, onTap: () => { setReportConfirmPostId(actionSheetPostId) }},
                { label: 'Hide Post', onTap: () => { setHiddenPostIds(prev => new Set([...prev, actionSheetPostId])) }},
              ]
          }
          onClose={() => setActionSheetPostId(null)}
        />
      )}

      {editingPost && (
        <EditPostSheet
          post={editingPost}
          onClose={() => setEditingPost(null)}
          onSave={(postId, newBody) => { editPost(postId, newBody); setEditingPost(null) }}
        />
      )}

      {deleteConfirmPostId && (
        <ConfirmDialog
          title="Delete Post?"
          message="This can't be undone."
          confirmLabel="Delete"
          destructive
          onConfirm={() => { deletePost(deleteConfirmPostId); setDeleteConfirmPostId(null) }}
          onCancel={() => setDeleteConfirmPostId(null)}
        />
      )}

      {reportConfirmPostId && (
        <ConfirmDialog
          title="Report Post?"
          message="This post will be reported to the community moderators for review."
          confirmLabel="Report"
          destructive
          onConfirm={() => setReportConfirmPostId(null)}
          onCancel={() => setReportConfirmPostId(null)}
        />
      )}

      {removeFriendConfirm && (
        <ConfirmDialog
          title="Remove Friend?"
          message={`Remove ${removeFriendConfirm.friendName} from your friends list?`}
          confirmLabel="Remove"
          destructive
          onConfirm={() => { removeFriend(removeFriendConfirm.friendId); setRemoveFriendConfirm(null) }}
          onCancel={() => setRemoveFriendConfirm(null)}
        />
      )}

      {sharePostId !== null && (
        <ShareSheet
          friends={friends}
          onClose={() => setSharePostId(null)}
        />
      )}
    </div>
  )
}

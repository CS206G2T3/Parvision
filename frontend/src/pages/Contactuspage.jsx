import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { IMG_ARROW_BACK } from '../icons'

export default function ContactUsPage() {
  const navigate = useNavigate()
  const [subject, setSubject] = useState('')
  const [message, setMessage] = useState('')
  const [sent, setSent] = useState(false)

  const handleSend = () => {
    if (!subject.trim() || !message.trim()) return
    setSent(true)
    setTimeout(() => { setSent(false); setSubject(''); setMessage('') }, 2500)
  }

  const contacts = [
    { icon: '📧', label: 'Email', value: 'support@parvision.app' },
    { icon: '📱', label: 'WhatsApp', value: '+65 8888 0000' },
    { icon: '🌐', label: 'Website', value: 'www.parvision.app' },
  ]

  return (
    <div className="relative w-full bg-[#f4f4f4] flex flex-col min-h-[852px]">
      <div className="bg-white pt-14 pb-4 px-5 flex-shrink-0">
        <div className="relative flex items-center justify-center mb-1">
          <button onClick={() => navigate('/profile')} className="absolute left-0">
            <img src={IMG_ARROW_BACK} alt="Back" className="w-5 h-5 object-contain" />
          </button>
          <h1 className="text-[18px] font-bold text-[#1c1c1e]"
            style={{ fontFamily: '-apple-system, "SF Pro Display", system-ui, sans-serif' }}>
            Contact Us
          </h1>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto pb-8 px-4">
        <div className="mt-4 bg-white rounded-2xl overflow-hidden mb-4">
          {contacts.map((c, i) => (
            <div key={i}>
              <div className="flex items-center gap-3 px-4 py-4">
                <div className="w-9 h-9 bg-[#e5f8e9] rounded-xl flex items-center justify-center flex-shrink-0">
                  <span className="text-[18px]">{c.icon}</span>
                </div>
                <div>
                  <p className="text-[12px] text-[rgba(60,60,67,0.5)]"
                    style={{ fontFamily: '-apple-system, "SF Pro Text", system-ui, sans-serif' }}>{c.label}</p>
                  <p className="text-[15px] font-medium text-[#1c1c1e]"
                    style={{ fontFamily: '-apple-system, "SF Pro Text", system-ui, sans-serif' }}>{c.value}</p>
                </div>
              </div>
              {i < contacts.length - 1 && <div className="h-px bg-[#f0f0f0] mx-4" />}
            </div>
          ))}
        </div>

        <div className="bg-white rounded-2xl p-4">
          <p className="text-[15px] font-bold text-[#1c1c1e] mb-4"
            style={{ fontFamily: '-apple-system, "SF Pro Display", system-ui, sans-serif' }}>
            Send us a message
          </p>
          <div className="mb-3">
            <p className="text-[12px] text-[rgba(60,60,67,0.5)] mb-1.5"
              style={{ fontFamily: '-apple-system, "SF Pro Text", system-ui, sans-serif' }}>Subject</p>
            <input type="text" value={subject} onChange={(e) => setSubject(e.target.value)}
              placeholder="What's this about?"
              className="w-full bg-[#f4f4f4] rounded-[14px] px-4 h-[44px] text-[14px] text-[#1c1c1e] placeholder-[rgba(60,60,67,0.4)] focus:outline-none"
              style={{ fontFamily: '-apple-system, "SF Pro Text", system-ui, sans-serif' }} />
          </div>
          <div className="mb-4">
            <p className="text-[12px] text-[rgba(60,60,67,0.5)] mb-1.5"
              style={{ fontFamily: '-apple-system, "SF Pro Text", system-ui, sans-serif' }}>Message</p>
            <textarea value={message} onChange={(e) => setMessage(e.target.value)}
              placeholder="Describe your issue or question..." rows={5}
              className="w-full bg-[#f4f4f4] rounded-[14px] px-4 py-3 text-[14px] text-[#1c1c1e] placeholder-[rgba(60,60,67,0.4)] focus:outline-none resize-none"
              style={{ fontFamily: '-apple-system, "SF Pro Text", system-ui, sans-serif' }} />
          </div>
          <button onClick={handleSend} disabled={!subject.trim() || !message.trim()}
            className={`w-full h-[50px] rounded-[14px] flex items-center justify-center gap-2 transition-all ${
              sent ? 'bg-[#e5f8e9]' : 'bg-[#248a3d] active:opacity-80 disabled:opacity-40'
            }`}>
            {sent ? (
              <>
                <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
                  <path d="M3 9L7 13L15 5" stroke="#248a3d" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
                <span className="text-[16px] font-semibold text-[#248a3d]"
                  style={{ fontFamily: '-apple-system, "SF Pro Display", system-ui, sans-serif' }}>Message Sent!</span>
              </>
            ) : (
              <span className="text-[16px] font-semibold text-white"
                style={{ fontFamily: '-apple-system, "SF Pro Display", system-ui, sans-serif' }}>Send Message</span>
            )}
          </button>
        </div>
      </div>
    </div>
  )
}
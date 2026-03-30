import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { IMG_ARROW_BACK } from '../icons'

const FAQS = [
  { q: 'What is ParVision?', a: 'ParVision is a golf coaching app that uses AI to analyse your swing, track your progress, and suggest personalised drills to improve your game.' },
  { q: 'How does the Swing Analyser work?', a: 'Upload a video of your swing and our AI will analyse your posture, club path, and technique, giving you detailed feedback on what to improve.' },
  { q: 'What is Ball Tracer?', a: 'Ball Tracer tracks the path of your golf ball after impact, giving you insights into launch angle, direction, and distance.' },
  { q: 'How do I upload a swing video?', a: 'Tap the camera icon in the bottom nav to go to the Upload page, then select a video from your gallery or record one directly.' },
  { q: 'What video formats are supported?', a: 'We support MP4, WebM, and OGG formats up to 100MB in size.' },
  { q: 'How do I track my progress?', a: 'Your activity and completed drills are tracked on the Activity page, accessible from your profile.' },
  { q: 'Can I share my swing with friends?', a: 'Yes! After analysing your swing, you can share the results directly to the Community feed for feedback from other golfers.' },
  { q: 'What is ParVision Pro?', a: 'ParVision Pro is our premium membership that gives you unlimited swing analyses, advanced drill recommendations, and priority support.' },
  { q: 'How do I cancel my membership?', a: 'You can manage your membership from Profile → Membership. Contact us if you need further assistance.' },
]

export default function FAQPage() {
  const navigate = useNavigate()
  const [expanded, setExpanded] = useState(null)

  return (
    <div className="relative w-full bg-[#f4f4f4] flex flex-col min-h-[852px]">
      <div className="bg-white pt-14 pb-4 px-5 flex-shrink-0">
        <div className="relative flex items-center justify-center mb-1">
          <button onClick={() => navigate('/profile')} className="absolute left-0">
            <img src={IMG_ARROW_BACK} alt="Back" className="w-5 h-5 object-contain" />
          </button>
          <h1 className="text-[18px] font-bold text-[#1c1c1e]"
            style={{ fontFamily: '-apple-system, "SF Pro Display", system-ui, sans-serif' }}>
            FAQ
          </h1>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto pb-8 px-4 mt-4">
        <div className="bg-white rounded-2xl overflow-hidden">
          {FAQS.map((faq, i) => (
            <div key={i}>
              <button onClick={() => setExpanded(expanded === i ? null : i)}
                className="w-full flex items-center justify-between px-4 py-4 text-left active:bg-[#f9f9f9] transition-colors">
                <p className="text-[15px] font-semibold text-[#1c1c1e] flex-1 pr-3 leading-[20px]"
                  style={{ fontFamily: '-apple-system, "SF Pro Text", system-ui, sans-serif' }}>
                  {faq.q}
                </p>
                <svg width="12" height="12" viewBox="0 0 12 12" fill="none"
                  className={`flex-shrink-0 transition-transform duration-200 ${expanded === i ? 'rotate-180' : ''}`}>
                  <path d="M1 4L6 9L11 4" stroke="rgba(60,60,67,0.4)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </button>
              {expanded === i && (
                <div className="px-4 pb-4">
                  <p className="text-[14px] text-[rgba(60,60,67,0.7)] leading-[21px]"
                    style={{ fontFamily: '-apple-system, "SF Pro Text", system-ui, sans-serif' }}>
                    {faq.a}
                  </p>
                </div>
              )}
              {i < FAQS.length - 1 && <div className="h-px bg-[#f0f0f0] mx-4" />}
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
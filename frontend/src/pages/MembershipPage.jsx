import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { IMG_ARROW_BACK } from '../icons'

const FEATURES_FREE = [
  'Basic posture classification metrics',
  'Limited swing uploads',
  'Community viewing access',
  'Drill recommendations',
  'Ad-supported experience',
]

const FEATURES_PRO = [
  'Everything in Free',
  'More swing uploads',
  'More personalised & structured development pathway',
  'Ad Free',
]

const FEATURES_FAMILY = [
  'Everything in Pro',
  'Up to 5 members',
  'Ad Free',
]

function CheckIcon({ green }) {
  return (
    <div className={`w-4 h-4 rounded-full flex items-center justify-center flex-shrink-0 ${green ? 'bg-[#248a3d]' : 'bg-[#e5e5ea]'}`}>
      <svg width="8" height="7" viewBox="0 0 8 7" fill="none">
        <path d="M1 3.5L3 5.5L7 1.5" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    </div>
  )
}

function TierCard({ title, badge, price, sub, features, cta, highlight, current }) {
  return (
    <div
      className={`rounded-3xl overflow-hidden border ${highlight ? 'border-[#248a3d]' : 'border-[#f0f0f0] shadow-sm'}`}
      style={highlight ? { boxShadow: '0 4px 24px rgba(36,138,61,0.18)' } : {}}
    >
      <div className={`px-5 pt-5 pb-4 ${highlight ? 'bg-[#248a3d]' : 'bg-white'}`}>
        <div className="flex items-center justify-between mb-1">
          <p
            className={`text-[17px] font-bold leading-[22px] ${highlight ? 'text-white' : 'text-[#1c1c1e]'}`}
            style={{ fontFamily: '-apple-system, "SF Pro Display", system-ui, sans-serif' }}
          >
            {title}
          </p>
          {badge && (
            <span className={`text-[11px] font-bold px-2.5 py-1 rounded-full ${highlight ? 'bg-white/20 text-white' : 'bg-[#e5f8e9] text-[#248a3d]'}`}>
              {badge}
            </span>
          )}
          {current && !badge && (
            <span className="text-[11px] font-semibold px-2.5 py-1 rounded-full bg-[#e5f8e9] text-[#248a3d]">
              Current
            </span>
          )}
        </div>
        <div className="flex items-end gap-1 mt-2">
          <span
            className={`text-[32px] font-bold leading-none ${highlight ? 'text-white' : 'text-[#1c1c1e]'}`}
            style={{ fontFamily: '-apple-system, "SF Pro Display", system-ui, sans-serif' }}
          >
            {price}
          </span>
          {sub && (
            <span className={`text-[13px] font-medium pb-1 ${highlight ? 'text-white/70' : 'text-[rgba(60,60,67,0.5)]'}`}>
              {sub}
            </span>
          )}
        </div>
      </div>

      <div className="bg-white px-5 pt-4 pb-5">
        <div className="flex flex-col gap-2.5">
          {features.map((feat, i) => (
            <div key={i} className="flex items-center gap-2.5">
              <CheckIcon green={highlight} />
              <span
                className="text-[14px] text-[rgba(60,60,67,0.8)] leading-[19px]"
                style={{ fontFamily: '-apple-system, "SF Pro Text", system-ui, sans-serif' }}
              >
                {feat}
              </span>
            </div>
          ))}
        </div>

        <button
          className={`w-full mt-5 py-3.5 rounded-2xl text-[15px] font-semibold transition-opacity active:opacity-75 ${
            highlight ? 'bg-[#248a3d] text-white' : 'bg-[#f4f4f4] text-[#1c1c1e]'
          }`}
          style={{ fontFamily: '-apple-system, "SF Pro Text", system-ui, sans-serif' }}
        >
          {cta}
        </button>
      </div>
    </div>
  )
}

export default function MembershipPage() {
  const navigate = useNavigate()
  const [billing, setBilling] = useState('monthly')

  const proPrice    = billing === 'monthly' ? 'S$9.90' : 'S$99'
  const proSub      = billing === 'monthly' ? '/ month' : '/ year'
  const familyPrice = billing === 'monthly' ? 'S$7.90' : 'S$79'
  const familySub   = billing === 'monthly' ? '/ month for 5 pax' : '/ year for 5 pax'

  return (
    <div className="relative w-full bg-[#f4f4f4] flex flex-col min-h-[852px]">

      {/* Green header */}
      <div className="bg-[#248a3d] pt-14 pb-10 px-5 flex-shrink-0 relative overflow-hidden">
        <div className="absolute -top-10 -right-10 w-48 h-48 rounded-full bg-white/5" />
        <div className="absolute -top-4 -right-4 w-32 h-32 rounded-full bg-white/5" />
        <div className="absolute bottom-0 left-10 w-24 h-24 rounded-full bg-white/5" />
        <div className="absolute -bottom-6 -left-6 w-36 h-36 rounded-full bg-white/5" />
        <div className="absolute top-6 right-32 w-16 h-16 rounded-full bg-white/5" />

        <div className="relative flex items-center justify-center mb-5">
          <button onClick={() => navigate('/profile')} className="absolute left-0 w-8 h-8 flex items-center justify-center">
            <img src={IMG_ARROW_BACK} alt="Back" className="w-5 h-5 object-contain brightness-0 invert" />
          </button>
          <h1
            className="text-[18px] font-bold text-white"
            style={{ fontFamily: '-apple-system, "SF Pro Display", system-ui, sans-serif' }}
          >
            Membership
          </h1>
        </div>

        <p
          className="text-[26px] font-bold text-white leading-[32px] text-center"
          style={{ fontFamily: '-apple-system, "SF Pro Display", system-ui, sans-serif' }}
        >
          Level Up Your Game
        </p>
        <p
          className="text-[14px] text-white/70 text-center mt-1.5 leading-[20px]"
          style={{ fontFamily: '-apple-system, "SF Pro Text", system-ui, sans-serif' }}
        >
          Choose the plan that fits your game
        </p>

        {/* Billing toggle */}
        <div className="flex items-center justify-center mt-5">
          <div className="flex bg-white/15 rounded-full p-1 gap-1">
            {['monthly', 'yearly'].map((opt) => (
              <button
                key={opt}
                onClick={() => setBilling(opt)}
                className={`px-4 py-1.5 rounded-full text-[13px] font-semibold transition-all ${
                  billing === opt ? 'bg-white text-[#248a3d]' : 'text-white/80'
                }`}
                style={{ fontFamily: '-apple-system, "SF Pro Text", system-ui, sans-serif' }}
              >
                {opt === 'monthly' ? 'Monthly' : 'Yearly'}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Tier cards */}
      <div className="flex-1 overflow-y-auto pb-10">
        <div className="bg-white rounded-t-3xl -mt-4 relative z-10 pt-5 px-4">

          {billing === 'yearly' && (
            <div className="mb-3 mx-1 bg-[#e5f8e9] rounded-2xl px-4 py-2.5 flex items-center gap-2">
              <span className="text-[18px]">🎉</span>
              <p
                className="text-[13px] font-semibold text-[#248a3d]"
                style={{ fontFamily: '-apple-system, "SF Pro Text", system-ui, sans-serif' }}
              >
                Save S$19.80 with the yearly plan!
              </p>
            </div>
          )}

          <div className="flex flex-col gap-4">
            <TierCard
              title="Free"
              price="S$0"
              sub="/ month"
              features={FEATURES_FREE}
              cta="Current Plan"
              current
            />
            <TierCard
              title="Parvision Pro"
              badge="Most Popular"
              price={proPrice}
              sub={proSub}
              features={FEATURES_PRO}
              cta="Upgrade to Pro"
              highlight
            />
            <TierCard
              title="Family Plan"
              badge="5 members"
              price={familyPrice}
              sub={familySub}
              features={FEATURES_FAMILY}
              cta="Get Family Plan"
            />
          </div>

          {/* Pay-as-you-go */}
          <div className="mt-5 mb-2 rounded-3xl bg-[#f9f9f9] border border-[#f0f0f0] px-5 py-4">
            <div className="flex items-center gap-2 mb-2">
              <div className="w-8 h-8 rounded-xl bg-[#fff3cd] flex items-center justify-center flex-shrink-0">
                <span className="text-[16px]">⚡</span>
              </div>
              <p
                className="text-[16px] font-bold text-[#1c1c1e]"
                style={{ fontFamily: '-apple-system, "SF Pro Display", system-ui, sans-serif' }}
              >
                Need More Uploads?
              </p>
            </div>
            <p
              className="text-[14px] text-[rgba(60,60,67,0.7)] leading-[21px]"
              style={{ fontFamily: '-apple-system, "SF Pro Text", system-ui, sans-serif' }}
            >
              Already on Pro but need extra? Top up at{' '}
              <span className="font-bold text-[#1c1c1e]">S$1.90 for every 10 additional uploads</span>{' '}
              per month. Pay only when you need it.
            </p>
            <button
              className="mt-3 w-full py-3 rounded-2xl bg-[#1c1c1e] text-white text-[14px] font-semibold active:opacity-75 transition-opacity"
              style={{ fontFamily: '-apple-system, "SF Pro Text", system-ui, sans-serif' }}
            >
              Buy Extra Uploads — S$1.90 / 10
            </button>
          </div>

          <p
            className="text-center text-[12px] text-[rgba(60,60,67,0.4)] mt-4 mb-2 px-4 leading-[18px]"
            style={{ fontFamily: '-apple-system, "SF Pro Text", system-ui, sans-serif' }}
          >
            All prices in SGD. Cancel anytime. Yearly plans billed once upfront.
          </p>

        </div>
      </div>
    </div>
  )
}

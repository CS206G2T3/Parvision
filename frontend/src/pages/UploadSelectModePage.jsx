import { useNavigate, useLocation } from 'react-router-dom'

import warmup from '../assets/warmup.jpeg'
import modeBallTracer from '../assets/mode_ball_tracer.png'
import modeSwingAnalyser from '../assets/mode_swing_analyser.png'

export default function UploadSelectModePage() {
  const navigate = useNavigate()
  const { state } = useLocation()
  const IMG_DRILL_THUMB = state?.thumb || warmup

  return (
    <div className="relative w-full bg-white flex flex-col min-h-[852px]">

      {/* Header */}
      <div className="flex items-center justify-between px-5 pt-14 pb-4 border-b border-[#f0f0f0] flex-shrink-0">
        <button
          onClick={() => navigate('/upload/gallery')}
          className="flex items-center gap-1"
        >
          <svg width="8" height="14" viewBox="0 0 8 14" fill="none">
            <path d="M7 1L1 7L7 13" stroke="#248a3d" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
          <span
            className="text-[15px] font-medium text-[#248a3d] ml-1"
            style={{ fontFamily: '-apple-system, "SF Pro Text", system-ui, sans-serif' }}
          >
            Back
          </span>
        </button>
        <p
          className="text-[17px] font-bold text-[#1c1c1e] uppercase tracking-[1px]"
          style={{ fontFamily: '-apple-system, "SF Pro Display", system-ui, sans-serif' }}
        >
          Upload
        </p>
        <div className="w-14" />
      </div>

      {/* Video preview */}
      <div className="relative mx-5 mt-4 rounded-2xl overflow-hidden h-[300px]">
        <img src={IMG_DRILL_THUMB} alt="Selected swing video" className="w-full h-full object-cover" />
        <div className="absolute inset-0 bg-black/10" />
      </div>

      {/* Select Mode label */}
      <div className="flex justify-center mt-5">
        <div className="bg-[#248a3d] px-6 py-2 rounded-full flex items-center gap-2">
          <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
            <path d="M7 1L7 7M7 7L7 13M1 7H7M7 7H13" stroke="white" strokeWidth="2" strokeLinecap="round" />
          </svg>
          <span
            className="text-white text-[14px] font-bold uppercase tracking-[1px]"
            style={{ fontFamily: '-apple-system, "SF Pro Display", system-ui, sans-serif' }}
          >
            Select Mode
          </span>
        </div>
      </div>

      {/* Mode cards */}
      <div className="px-5 mt-5 flex gap-5 justify-center">

        {/* Ball Tracer */}
        <button
          onClick={() => navigate('/upload/ball-tracer-setup')}
          className="flex-1 flex flex-col items-center gap-3 active:opacity-80 transition-opacity"
        >
          <div className="w-20 h-20 rounded-full overflow-hidden border-4 border-[#f0f0f0] shadow-md">
            <img src={modeBallTracer} alt="Ball Tracer" className="w-full h-full object-cover" />
          </div>
          <div className="text-center">
            <p
              className="text-[16px] font-bold text-[#1c1c1e]"
              style={{ fontFamily: '-apple-system, "SF Pro Display", system-ui, sans-serif' }}
            >
              Ball Tracer
            </p>
            <p
              className="text-[12px] text-[rgba(60,60,67,0.5)] mt-0.5 leading-[16px]"
              style={{ fontFamily: '-apple-system, "SF Pro Text", system-ui, sans-serif' }}
            >
              Track Your Ball Path
            </p>
          </div>
        </button>

        {/* Swing Analyzer */}
        <button
          onClick={() => navigate('/upload/processing', { state: { mode: 'swing-analyser' } })}
          className="flex-1 flex flex-col items-center gap-3 active:opacity-80 transition-opacity"
        >
          <div className="w-20 h-20 rounded-full overflow-hidden border-4 border-[#f0f0f0] shadow-md">
            <img src={modeSwingAnalyser} alt="Swing Analyzer" className="w-full h-full object-cover" />
          </div>
          <div className="text-center">
            <p
              className="text-[16px] font-bold text-[#1c1c1e]"
              style={{ fontFamily: '-apple-system, "SF Pro Display", system-ui, sans-serif' }}
            >
              Swing Analyzer
            </p>
            <p
              className="text-[12px] text-[rgba(60,60,67,0.5)] mt-0.5 leading-[16px]"
              style={{ fontFamily: '-apple-system, "SF Pro Text", system-ui, sans-serif' }}
            >
              Examine Your Swing Form
            </p>
          </div>
        </button>

      </div>
    </div>
  )
}

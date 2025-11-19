import React, { useState, useEffect } from 'react'
import BackgroundEntity from './components/BackgroundEntity'
import ZodiacCarousel from './components/ZodiacCarousel'

function App() {
  const [selected, setSelected] = useState(null)
  const [focusEntity, setFocusEntity] = useState(false)
  const [fadeOthers, setFadeOthers] = useState(false)

  const handleSelect = (z) => {
    // Trigger visual sequence
    setSelected(z)
    setFadeOthers(true)
    // After a small delay, bring entity closer and sharper
    setTimeout(() => setFocusEntity(true), 50)
  }

  useEffect(() => {
    if (selected) {
      // Keep entity in foreground after animation finishes
      const t = setTimeout(() => {}, 1500)
      return () => clearTimeout(t)
    }
  }, [selected])

  return (
    <div className="relative min-h-screen overflow-hidden bg-gradient-to-br from-[#0a0f2a] via-[#111236] to-[#1a1240]">
      <BackgroundEntity focus={focusEntity} />

      {/* Misty auric accents */}
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute -left-20 -top-20 w-[60vmin] h-[60vmin] rounded-full bg-cyan-400/10 blur-[100px]" />
        <div className="absolute right-0 top-1/2 -translate-y-1/2 w-[70vmin] h-[70vmin] rounded-full bg-indigo-500/10 blur-[120px]" />
        <div className="absolute left-1/2 bottom-0 -translate-x-1/2 w-[80vmin] h-[40vmin] rounded-[50%] bg-blue-300/10 blur-[120px]" />
      </div>

      {/* Main stage */}
      <div className="relative z-10 flex flex-col items-center justify-center min-h-screen">
        {/* Title aura glow bar (no text) */}
        <div className="mt-20 mb-12 w-40 h-px bg-gradient-to-r from-transparent via-cyan-300/50 to-transparent blur-[1px]" />

        {/* Carousel */}
        <div className="w-full max-w-5xl">
          <ZodiacCarousel onSelect={handleSelect} faded={fadeOthers} />
        </div>

        {/* Selected emblem pinned to bottom center after animation */}
        <div
          className={[
            'fixed left-1/2 bottom-8 -translate-x-1/2 transition-all duration-[1500ms]',
            selected ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6',
          ].join(' ')}
        >
          {selected && (
            <div className="flex items-center justify-center">
              <div className="w-16 h-16 rounded-full bg-gradient-to-br from-amber-300/20 via-blue-300/10 to-indigo-300/20 border border-amber-200/20 text-4xl text-blue-50 flex items-center justify-center shadow-[0_0_50px_20px_rgba(251,191,36,0.15)]">
                {selected.symbol}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Cinematic edge vignette */}
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_55%,rgba(0,0,0,0.6))]" />

      {/* Subtle grain */}
      <div className="pointer-events-none absolute inset-0 opacity-[0.07] mix-blend-plus-lighter" style={{ backgroundImage: 'url("data:image/svg+xml;utf8,<svg xmlns=\'http://www.w3.org/2000/svg\' width=\'60\' height=\'60\' viewBox=\'0 0 60 60\'><filter id=\'n\'><feTurbulence type=\'fractalNoise\' baseFrequency=\'0.65\' numOctaves=\'2\'/></filter><rect width=\'100%\' height=\'100%\' filter=\'url(%23n)\' opacity=\'0.5\'/></svg>" )' }} />
    </div>
  )
}

export default App

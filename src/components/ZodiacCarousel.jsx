import React, { useMemo, useRef, useState, useEffect } from 'react'

const zodiac = [
  { key: 'aries', label: 'Aries', symbol: '♈' },
  { key: 'taurus', label: 'Taurus', symbol: '♉' },
  { key: 'gemini', label: 'Gemini', symbol: '♊' },
  { key: 'cancer', label: 'Cancer', symbol: '♋' },
  { key: 'leo', label: 'Leo', symbol: '♌' },
  { key: 'virgo', label: 'Virgo', symbol: '♍' },
  { key: 'libra', label: 'Libra', symbol: '♎' },
  { key: 'scorpio', label: 'Scorpio', symbol: '♏' },
  { key: 'sagittarius', label: 'Sagittarius', symbol: '♐' },
  { key: 'capricorn', label: 'Capricorn', symbol: '♑' },
  { key: 'aquarius', label: 'Aquarius', symbol: '♒' },
  { key: 'pisces', label: 'Pisces', symbol: '♓' },
]

const easeInOutCubic = (t) => (t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2)

function ZodiacCarousel({ onSelect, faded }) {
  const containerRef = useRef(null)
  const [angle, setAngle] = useState(0) // radians offset for scroll position
  const [isDragging, setDragging] = useState(false)
  const dragRef = useRef({ startX: 0, startAngle: 0 })

  const radius = 220 // px radius for semicircle
  const itemSize = 64

  const positions = useMemo(() => {
    // Map items onto semicircle from -90deg to +90deg around center
    // angle offset controls which item is centered
    const base = -Math.PI / 2
    return zodiac.map((z, i) => {
      const step = (i / (zodiac.length - 1)) * Math.PI
      const a = base + step + angle
      const x = Math.cos(a) * radius
      const y = Math.sin(a) * 60 // smaller vertical displacement for arc illusion
      return { ...z, x, y, a }
    })
  }, [angle])

  const centerIndex = useMemo(() => {
    // Find item closest to center (a closest to 0 -> cos ~ 1)
    let min = Infinity
    let idx = 0
    positions.forEach((p, i) => {
      const dist = Math.abs(p.a)
      if (dist < min) { min = dist; idx = i }
    })
    return idx
  }, [positions])

  // Drag/scroll interactions
  useEffect(() => {
    const el = containerRef.current
    if (!el) return

    let momentum = 0
    let raf

    const onWheel = (e) => {
      e.preventDefault()
      const delta = e.deltaY || e.deltaX
      setAngle((prev) => prev + delta * -0.0015)
      momentum = delta * -0.0012
      cancelAnimationFrame(raf)
      const decay = () => {
        momentum *= 0.95
        if (Math.abs(momentum) > 0.0001) {
          setAngle((prev) => prev + momentum)
          raf = requestAnimationFrame(decay)
        }
      }
      raf = requestAnimationFrame(decay)
    }

    const onPointerDown = (e) => {
      setDragging(true)
      const x = e.clientX || (e.touches && e.touches[0].clientX)
      dragRef.current = { startX: x, startAngle: angle }
    }
    const onPointerMove = (e) => {
      if (!isDragging) return
      const x = e.clientX || (e.touches && e.touches[0].clientX)
      if (!x) return
      const dx = x - dragRef.current.startX
      setAngle(dragRef.current.startAngle + dx * 0.006)
    }
    const onPointerUp = () => setDragging(false)

    el.addEventListener('wheel', onWheel, { passive: false })
    el.addEventListener('pointerdown', onPointerDown)
    window.addEventListener('pointermove', onPointerMove)
    window.addEventListener('pointerup', onPointerUp)
    // Touch support
    el.addEventListener('touchstart', (e) => onPointerDown(e.touches[0]))
    window.addEventListener('touchmove', (e) => onPointerMove(e.touches[0]))
    window.addEventListener('touchend', onPointerUp)

    return () => {
      el.removeEventListener('wheel', onWheel)
      el.removeEventListener('pointerdown', onPointerDown)
      window.removeEventListener('pointermove', onPointerMove)
      window.removeEventListener('pointerup', onPointerUp)
      window.removeEventListener('touchmove', (e) => onPointerMove(e.touches[0]))
      window.removeEventListener('touchend', onPointerUp)
    }
  }, [angle, isDragging])

  return (
    <div ref={containerRef} className="relative w-full h-[50vh] select-none">
      <div className="absolute left-1/2 top-[55%] -translate-x-1/2 -translate-y-1/2 perspective-[1200px]">
        {positions.map((p, i) => {
          const depth = Math.cos(p.a)
          const scale = 0.8 + depth * 0.25 + (i === centerIndex ? 0.05 : 0)
          const glow = 0.25 + depth * 0.35 + (i === centerIndex ? 0.2 : 0)
          const translateZ = depth * 140
          const opacity = faded ? (i === centerIndex ? 1 : 0) : Math.max(0.08, 0.25 + depth * 0.8)
          const rotateY = (p.x / radius) * -12 // subtle parallax

          return (
            <button
              key={p.key}
              onClick={() => onSelect && onSelect(p)}
              className={[
                'absolute -translate-x-1/2 -translate-y-1/2 will-change-transform',
                'transition-[transform,filter,opacity] duration-700',
                'ease-[cubic-bezier(0.645,0.045,0.355,1)]', // easeInOutCubic-like
                i === centerIndex && !faded ? 'drop-shadow-[0_0_25px_rgba(56,189,248,0.35)]' : 'drop-shadow-[0_0_12px_rgba(56,189,248,0.18)]',
              ].join(' ')}
              style={{
                left: `calc(50% + ${p.x}px)`,
                top: `calc(50% + ${p.y}px)`,
                transform: `translate(-50%,-50%) translateZ(${translateZ}px) rotateY(${rotateY}deg) scale(${scale})`,
                filter: `brightness(${0.9 + glow * 0.4})`,
                opacity,
              }}
            >
              <span
                className={[
                  'w-16 h-16 rounded-full flex items-center justify-center',
                  'bg-gradient-to-br from-indigo-500/20 via-cyan-400/10 to-indigo-300/20',
                  'text-4xl font-semibold text-blue-100',
                  'border border-cyan-300/20 backdrop-blur-[2px]',
                  'transition-[transform,box-shadow] duration-700',
                  i === centerIndex && !faded ? 'shadow-[0_0_60px_15px_rgba(56,189,248,0.25)]' : 'shadow-[0_0_28px_8px_rgba(56,189,248,0.15)]',
                ].join(' ')}
              >
                {p.symbol}
              </span>
            </button>
          )
        })}
      </div>
    </div>
  )
}

export default ZodiacCarousel

import React from 'react'

function BackgroundEntity({ focus }) {
  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden">
      {/* Sky */}
      <div className="absolute inset-0 bg-gradient-to-b from-[#0a1440] via-[#1b2b6b] to-[#0d2b2a]" />

      {/* Distant glow (moon/haze) */}
      <div
        className={[
          'absolute left-1/2 top-[22%] -translate-x-1/2 -translate-y-1/2 rounded-full',
          'w-[42vmin] h-[42vmin] opacity-60',
          'bg-[radial-gradient(circle_at_50%_50%,rgba(170,200,255,0.75),rgba(120,160,255,0.25)_45%,transparent_70%)]',
          'transition-all duration-[1500ms] ease-[cubic-bezier(0.645,0.045,0.355,1)]',
          focus ? 'scale-110 opacity-80 blur-sm' : 'scale-100 opacity-60 blur-[2px]'
        ].join(' ')}
      />

      {/* Subtle moving clouds */}
      <div className="absolute inset-x-0 top-0 h-1/2 overflow-hidden opacity-35">
        <div className="absolute -left-1/4 top-10 w-[160%] h-24 bg-[radial-gradient(ellipse_at_center,rgba(200,220,255,0.15),transparent_60%)] blur-[18px] animate-clouds" />
        <div className="absolute -left-1/3 top-32 w-[170%] h-28 bg-[radial-gradient(ellipse_at_center,rgba(180,210,255,0.12),transparent_65%)] blur-[16px] animate-clouds-slow" />
      </div>

      {/* Distant hills silhouette */}
      <div
        className={[
          'absolute inset-x-0 bottom-[26vh] h-[22vh]',
          'bg-[radial-gradient(120vmin_30vmin_at_20%_100%,rgba(20,60,60,0.9),transparent_70%),radial-gradient(120vmin_28vmin_at_80%_100%,rgba(22,52,70,0.9),transparent_70%)]',
          'transition-all duration-[1500ms] ease-[cubic-bezier(0.645,0.045,0.355,1)]',
          focus ? 'blur-[2px] opacity-90' : 'blur-[4px] opacity-75'
        ].join(' ')}
      />

      {/* Parallax tree lines (back, mid, front) */}
      <ParallaxTrees layer="back" focus={focus} />
      <ParallaxTrees layer="mid" focus={focus} />
      <ParallaxTrees layer="front" focus={focus} />

      {/* Meadow ground */}
      <div className="absolute inset-x-0 bottom-0 h-[38vh]">
        {/* Base gradient grass */}
        <div className="absolute inset-0 bg-gradient-to-t from-[#0f3b2f] via-[#0f3b2f]/95 to-[#134f3d]/40" />
        {/* Rolling mist line */}
        <div className="absolute inset-x-0 top-0 h-24 bg-[radial-gradient(80%_50%_at_50%_0%,rgba(200,240,255,0.12),transparent_70%)] blur-[14px]" />
        {/* Wind shimmer */}
        <div className="absolute inset-0 opacity-25 mix-blend-screen animate-waves bg-[repeating-linear-gradient(90deg,rgba(180,255,220,0.12)_0_12px,transparent_12px_28px)]" />
      </div>

      {/* Fireflies */}
      <Fireflies focus={focus} />

      {/* Vignette for cinematic tone */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_60%,rgba(0,0,0,0.55))]" />

      <style>{`
        @keyframes sway {
          0%, 100% { transform: rotate(-1.5deg); }
          50% { transform: rotate(1.5deg); }
        }
        @keyframes swaySlow {
          0%, 100% { transform: rotate(-1deg); }
          50% { transform: rotate(1deg); }
        }
        @keyframes waves {
          0% { background-position: 0 0; }
          100% { background-position: 200px 0; }
        }
        @keyframes clouds {
          0% { transform: translateX(0); }
          100% { transform: translateX(-10%); }
        }
        .animate-clouds { animation: clouds 30s linear infinite; }
        .animate-clouds-slow { animation: clouds 55s linear infinite; }
        .animate-waves { animation: waves 12s linear infinite; }
      `}</style>
    </div>
  )
}

function ParallaxTrees({ layer, focus }) {
  const settings = {
    back: { bottom: '30vh', scale: 0.7, blur: 6, opacity: 0.45, count: 6, color: '#0d2f2a' },
    mid: { bottom: '22vh', scale: 0.9, blur: 4, opacity: 0.6, count: 7, color: '#114237' },
    front: { bottom: '14vh', scale: 1.1, blur: 2, opacity: 0.85, count: 8, color: '#155d4c' },
  }[layer]

  const trees = Array.from({ length: settings.count }).map((_, i) => {
    const left = 5 + (i * (90 / (settings.count - 1))) + (layer === 'front' ? (i % 2 ? 2 : -2) : 0)
    const swayDelay = (i % 5) * 0.8
    return (
      <div
        key={`${layer}-${i}`}
        className="absolute"
        style={{ left: `${left}%`, bottom: settings.bottom }}
      >
        <Tree
          scale={settings.scale}
          blur={focus ? Math.max(0, settings.blur - 2) : settings.blur}
          opacity={focus ? Math.min(1, settings.opacity + 0.1) : settings.opacity}
          color={settings.color}
          swayDelay={swayDelay}
          strong={layer === 'front'}
        />
      </div>
    )
  })

  return <div className="absolute inset-x-0 bottom-0">{trees}</div>
}

function Tree({ scale = 1, blur = 4, opacity = 0.6, color = '#134e4a', swayDelay = 0, strong = false }) {
  return (
    <div
      className={[
        'origin-bottom',
        strong ? 'animate-[sway_6s_ease-in-out_infinite]' : 'animate-[swaySlow_9s_ease-in-out_infinite]',
        'transition-all duration-[1500ms] ease-[cubic-bezier(0.645,0.045,0.355,1)]'
      ].join(' ')}
      style={{ animationDelay: `${swayDelay}s`, filter: `blur(${blur}px)`, opacity, transform: `scale(${scale})` }}
    >
      {/* Trunk */}
      <div className="relative h-[16vmin] w-[0.9vmin] mx-auto" style={{ background: `linear-gradient(${color}, ${color})` }} />
      {/* Canopy */}
      <div className="relative -mt-2 mx-auto w-[12vmin] h-[12vmin]">
        <div className="absolute inset-0 rounded-[45%] bg-[radial-gradient(circle_at_50%_40%,rgba(34,197,94,0.35),transparent_65%)]" />
        <div
          className="absolute inset-0 rounded-[45%] shadow-[0_0_60px_12px_rgba(56,189,248,0.08)]"
          style={{ background: `radial-gradient(circle at 50% 60%, ${hexToRgba(color,0.95)}, ${hexToRgba(color,0.6)} 60%, transparent 70%)` }}
        />
        <div className="absolute -top-3 left-1/2 -translate-x-1/2 w-[7vmin] h-[7vmin] rounded-[48%] bg-[radial-gradient(circle_at_50%_40%,rgba(125,211,252,0.18),transparent_70%)]" />
      </div>
    </div>
  )
}

function Fireflies({ focus }) {
  const flies = Array.from({ length: 22 }).map((_, i) => {
    const left = Math.random() * 100
    const bottom = 8 + Math.random() * 30
    const size = 0.3 + Math.random() * 0.8
    const delay = Math.random() * 6
    return (
      <div
        key={`ff-${i}`}
        className="absolute rounded-full"
        style={{
          left: `${left}%`,
          bottom: `${bottom}vh`,
          width: `${size}vmin`,
          height: `${size}vmin`,
          boxShadow: `0 0 ${1.5 + size*3}px ${0.5 + size}px rgba(180,220,255,${focus ? 0.9 : 0.6})`,
          background: `radial-gradient(circle, rgba(180,220,255,${focus ? 0.9 : 0.7}) 0%, rgba(56,189,248,0.0) 70%)`,
          animation: `ff-float ${6 + Math.random() * 6}s ease-in-out ${delay}s infinite alternate`,
          opacity: focus ? 0.9 : 0.6,
          filter: focus ? 'blur(0.5px)' : 'blur(1px)'
        }}
      />
    )
  })

  return (
    <div className="absolute inset-0">
      {flies}
      <style>{`
        @keyframes ff-float {
          0% { transform: translateY(0) translateX(0); opacity: 0.5; }
          50% { transform: translateY(8px) translateX(6px); opacity: 1; }
          100% { transform: translateY(-6px) translateX(-4px); opacity: 0.6; }
        }
      `}</style>
    </div>
  )
}

function hexToRgba(hex, alpha = 1) {
  const h = hex.replace('#','')
  const bigint = parseInt(h, 16)
  const r = (bigint >> 16) & 255
  const g = (bigint >> 8) & 255
  const b = bigint & 255
  return `rgba(${r}, ${g}, ${b}, ${alpha})`
}

export default BackgroundEntity

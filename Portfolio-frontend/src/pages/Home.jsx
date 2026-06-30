import { Link } from 'react-router-dom'
import { useEffect, useRef, useState } from 'react'
import api from '../utils/axios'

/* ─── Cursor Glow ────────────────────────────────────────── */
function CursorGlow() {
  const glowRef = useRef(null)
  const trailRef = useRef(null)
  const pos = useRef({ x: -200, y: -200 })
  const trail = useRef({ x: -200, y: -200 })
  const raf = useRef(null)
  const [clicks, setClicks] = useState([])

  useEffect(() => {
    const onMove = (e) => {
      pos.current = { x: e.clientX, y: e.clientY }
    }

    const onClick = (e) => {
      const id = Date.now()
      setClicks(prev => [...prev, { id, x: e.clientX, y: e.clientY }])
      setTimeout(() => setClicks(prev => prev.filter(c => c.id !== id)), 900)
    }

    const animate = () => {
      trail.current.x += (pos.current.x - trail.current.x) * 0.10
      trail.current.y += (pos.current.y - trail.current.y) * 0.10

      if (glowRef.current) {
        glowRef.current.style.transform = `translate(${pos.current.x - 24}px, ${pos.current.y - 24}px)`
      }
      if (trailRef.current) {
        trailRef.current.style.transform = `translate(${trail.current.x - 200}px, ${trail.current.y - 200}px)`
      }
      raf.current = requestAnimationFrame(animate)
    }

    window.addEventListener('mousemove', onMove)
    window.addEventListener('click', onClick)
    raf.current = requestAnimationFrame(animate)

    return () => {
      window.removeEventListener('mousemove', onMove)
      window.removeEventListener('click', onClick)
      cancelAnimationFrame(raf.current)
    }
  }, [])

  return (
    <>
      {/* Soft trailing orb */}
      <div
        ref={trailRef}
        className="fixed top-0 left-0 w-[400px] h-[400px] rounded-full pointer-events-none z-[9998]"
        style={{
          background: 'radial-gradient(circle, rgba(139,92,246,0.13) 0%, rgba(99,102,241,0.07) 40%, transparent 70%)',
          willChange: 'transform',
        }}
      />

      {/* Sharp cursor dot */}
      <div
        ref={glowRef}
        className="fixed top-0 left-0 w-12 h-12 rounded-full pointer-events-none z-[9999]"
        style={{
          background: 'radial-gradient(circle, rgba(167,139,250,0.9) 0%, rgba(99,102,241,0.5) 40%, transparent 75%)',
          boxShadow: '0 0 12px 4px rgba(139,92,246,0.5), 0 0 30px 8px rgba(99,102,241,0.25)',
          willChange: 'transform',
        }}
      />

      {/* Click burst particles */}
      {clicks.map(c => (
        <ClickBurst key={c.id} x={c.x} y={c.y} />
      ))}
    </>
  )
}

/* ─── ClickBurst ─────────────────────────────────────────── */
function ClickBurst({ x, y }) {
  const particles = Array.from({ length: 10 }, (_, i) => {
    const angle = (360 / 10) * i
    const dist = 40 + Math.random() * 35
    const rad = (angle * Math.PI) / 180
    const dx = Math.cos(rad) * dist
    const dy = Math.sin(rad) * dist
    const colors = ['#818cf8', '#a78bfa', '#38bdf8', '#f472b6', '#34d399', '#fb923c']
    const color = colors[Math.floor(Math.random() * colors.length)]
    const size = 4 + Math.random() * 5
    return { i, dx, dy, color, size }
  })

  return (
    <div
      className="fixed pointer-events-none z-[9999]"
      style={{ left: x, top: y }}
    >
      {particles.map(p => (
        <div
          key={p.i}
          style={{
            position: 'absolute',
            width: p.size,
            height: p.size,
            borderRadius: '50%',
            background: p.color,
            boxShadow: `0 0 6px 2px ${p.color}88`,
            animation: `burst 0.85s ease-out forwards`,
            '--dx': `${p.dx}px`,
            '--dy': `${p.dy}px`,
          }}
        />
      ))}
    </div>
  )
}

/* ─── useInView ──────────────────────────────────────────── */
function useInView(threshold = 0.15) {
  const ref = useRef(null)
  const [visible, setVisible] = useState(false)
  useEffect(() => {
    const el = ref.current
    if (!el) return
    const obs = new IntersectionObserver(([e]) => {
      if (e.isIntersecting) { setVisible(true); obs.disconnect() }
    }, { threshold })
    obs.observe(el)
    return () => obs.disconnect()
  }, [threshold])
  return [ref, visible]
}

/* ─── useTypingEffect ────────────────────────────────────── */
function useTypingEffect(words, speed = 80, pause = 1800) {
  const [displayed, setDisplayed] = useState('')
  const [wordIdx, setWordIdx] = useState(0)
  const [charIdx, setCharIdx] = useState(0)
  const [deleting, setDeleting] = useState(false)

  useEffect(() => {
    const current = words[wordIdx]
    let timeout

    if (!deleting && charIdx < current.length) {
      timeout = setTimeout(() => setCharIdx(c => c + 1), speed)
    } else if (!deleting && charIdx === current.length) {
      timeout = setTimeout(() => setDeleting(true), pause)
    } else if (deleting && charIdx > 0) {
      timeout = setTimeout(() => setCharIdx(c => c - 1), speed / 2)
    } else {
      setDeleting(false)
      setWordIdx(w => (w + 1) % words.length)
    }

    setDisplayed(current.slice(0, charIdx))
    return () => clearTimeout(timeout)
  }, [charIdx, deleting, wordIdx, words, speed, pause])

  return displayed
}

/* ─── Particles ──────────────────────────────────────────── */
function Particles() {
  const colors = ['bg-indigo-500', 'bg-violet-500', 'bg-cyan-500', 'bg-pink-500', 'bg-emerald-500', 'bg-amber-500']
  const particles = Array.from({ length: 18 }, (_, i) => ({
    id: i,
    x: Math.random() * 100,
    size: Math.random() * 4 + 2,
    delay: Math.random() * 6,
    duration: Math.random() * 6 + 8,
    color: colors[Math.floor(Math.random() * colors.length)],
  }))

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {particles.map(p => (
        <div
          key={p.id}
          className={`absolute rounded-full ${p.color} opacity-60`}
          style={{
            left: `${p.x}%`,
            bottom: '-10px',
            width: p.size,
            height: p.size,
            animation: `drift ${p.duration}s ${p.delay}s ease-in infinite`,
          }}
        />
      ))}
    </div>
  )
}

/* ─── Orb ────────────────────────────────────────────────── */
function Orb({ className }) {
  return <div className={`absolute rounded-full blur-3xl pointer-events-none ${className}`} />
}

/* ─── SpinRing ───────────────────────────────────────────── */
function SpinRing({ className, style }) {
  return (
    <div
      className={`absolute rounded-full border border-dashed pointer-events-none opacity-20 animate-spin-slow ${className}`}
      style={style}
    />
  )
}

/* ─── MarqueeStrip ───────────────────────────────────────── */
const techBadges = [
  { label: 'React',        color: 'text-cyan-400',    dot: 'bg-cyan-400' },
  { label: 'Node.js',      color: 'text-emerald-400', dot: 'bg-emerald-400' },
  { label: 'MongoDB',      color: 'text-green-400',   dot: 'bg-green-400' },
  { label: 'Express',      color: 'text-gray-400',    dot: 'bg-gray-400' },
  { label: 'Tailwind CSS', color: 'text-sky-400',     dot: 'bg-sky-400' },
  { label: 'REST APIs',    color: 'text-violet-400',  dot: 'bg-violet-400' },
  { label: 'JWT Auth',     color: 'text-amber-400',   dot: 'bg-amber-400' },
  { label: 'Vite',         color: 'text-purple-400',  dot: 'bg-purple-400' },
  { label: 'JavaScript',   color: 'text-yellow-400',  dot: 'bg-yellow-400' },
  { label: 'Open Source',  color: 'text-pink-400',    dot: 'bg-pink-400' },
]

function MarqueeStrip() {
  const tripled = [...techBadges, ...techBadges, ...techBadges]
  return (
    <div className="relative overflow-hidden py-5 border-y border-white/5 select-none bg-gray-950/60 backdrop-blur">
      <div className="flex animate-marquee whitespace-nowrap gap-10 w-max">
        {tripled.map((t, i) => (
          <span key={i} className={`text-xs font-semibold tracking-[0.18em] uppercase flex items-center gap-3 ${t.color}`}>
            <span className={`w-1.5 h-1.5 rounded-full ${t.dot} inline-block shadow-lg`} />
            {t.label}
          </span>
        ))}
      </div>
    </div>
  )
}

/* ─── BlogCard ───────────────────────────────────────────── */
function BlogCard({ blog, index, visible }) {
  const accentColors = [
    { border: 'hover:border-indigo-500/60',  tag: 'bg-indigo-600/20 text-indigo-300 border-indigo-500/25',    read: 'text-indigo-400',  glow: 'hover:shadow-indigo-950/50' },
    { border: 'hover:border-violet-500/60',  tag: 'bg-violet-600/20 text-violet-300 border-violet-500/25',    read: 'text-violet-400',  glow: 'hover:shadow-violet-950/50' },
    { border: 'hover:border-cyan-500/60',    tag: 'bg-cyan-600/20 text-cyan-300 border-cyan-500/25',          read: 'text-cyan-400',    glow: 'hover:shadow-cyan-950/50' },
    { border: 'hover:border-pink-500/60',    tag: 'bg-pink-600/20 text-pink-300 border-pink-500/25',          read: 'text-pink-400',    glow: 'hover:shadow-pink-950/50' },
    { border: 'hover:border-emerald-500/60', tag: 'bg-emerald-600/20 text-emerald-300 border-emerald-500/25', read: 'text-emerald-400', glow: 'hover:shadow-emerald-950/50' },
  ]
  const ac = accentColors[index % accentColors.length]

  return (
    <Link
      to={`/blogs/${blog._id}`}
      className={`group relative rounded-2xl overflow-hidden border border-white/8 bg-gray-900/60 backdrop-blur ${ac.border} transition-all duration-500 hover:-translate-y-2 hover:shadow-2xl ${ac.glow} flex flex-col`}
      style={{
        opacity: visible ? 1 : 0,
        transform: visible ? 'translateY(0)' : 'translateY(48px)',
        transition: `opacity 0.7s ease ${index * 0.12}s, transform 0.7s cubic-bezier(0.34,1.2,0.64,1) ${index * 0.12}s, border-color 0.3s, box-shadow 0.3s`,
      }}
    >
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-white/20 to-transparent" />

      {blog.thumbnail ? (
        <img src={blog.thumbnail} alt={blog.title} className="w-full h-44 object-cover group-hover:scale-105 transition-transform duration-700" />
      ) : (
        <div className="w-full h-44 bg-gradient-to-br from-indigo-950 via-gray-900 to-violet-950 flex items-center justify-center overflow-hidden relative">
          <span className="text-5xl opacity-20 group-hover:scale-125 transition-transform duration-700">📝</span>
          <div className="absolute inset-0 bg-gradient-to-t from-gray-900/60 to-transparent" />
        </div>
      )}

      <div className="p-5 flex flex-col flex-1">
        {blog.tag && (
          <span className={`text-xs ${ac.tag} border px-2.5 py-0.5 rounded-full w-fit mb-3 font-semibold tracking-wide`}>
            {blog.tag}
          </span>
        )}
        <h3 className="text-white font-semibold leading-snug group-hover:text-indigo-200 transition-colors flex-1 mb-3 line-clamp-2">
          {blog.title}
        </h3>
        <div className="flex items-center justify-between text-xs text-gray-500 mt-auto pt-3 border-t border-white/5">
          <span>{blog.createdAt ? new Date(blog.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) : ''}</span>
          <span className={`${ac.read} group-hover:translate-x-1.5 transition-transform inline-flex items-center gap-1 font-medium`}>
            Read <span>→</span>
          </span>
        </div>
      </div>
    </Link>
  )
}

/* ─── ToolCard ───────────────────────────────────────────── */
function ToolCard({ tool, index, visible }) {
  const accentColors = [
    { glow: 'hover:shadow-cyan-950/50',    border: 'hover:border-cyan-500/50',    btn: 'bg-cyan-600/20 hover:bg-cyan-600 text-cyan-400 hover:text-white border-cyan-500/30 hover:border-cyan-500' },
    { glow: 'hover:shadow-emerald-950/50', border: 'hover:border-emerald-500/50', btn: 'bg-emerald-600/20 hover:bg-emerald-600 text-emerald-400 hover:text-white border-emerald-500/30 hover:border-emerald-500' },
    { glow: 'hover:shadow-violet-950/50',  border: 'hover:border-violet-500/50',  btn: 'bg-violet-600/20 hover:bg-violet-600 text-violet-400 hover:text-white border-violet-500/30 hover:border-violet-500' },
  ]
  const ac = accentColors[index % accentColors.length]

  return (
    <div
      className={`group rounded-2xl border border-white/8 bg-gray-900/60 backdrop-blur p-5 flex flex-col ${ac.border} transition-all duration-500 hover:-translate-y-2 hover:shadow-2xl ${ac.glow} relative overflow-hidden`}
      style={{
        opacity: visible ? 1 : 0,
        transform: visible ? 'translateY(0)' : 'translateY(48px)',
        transition: `opacity 0.7s ease ${index * 0.14}s, transform 0.7s cubic-bezier(0.34,1.2,0.64,1) ${index * 0.14}s`,
      }}
    >
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-white/15 to-transparent" />

      {tool.thumbnail ? (
        <img src={tool.thumbnail} alt={tool.name} className="w-full h-36 object-cover rounded-xl mb-4 group-hover:scale-105 transition-transform duration-700" />
      ) : (
        <div className="w-full h-36 rounded-xl bg-gradient-to-br from-cyan-950 via-gray-900 to-indigo-950 flex items-center justify-center mb-4 overflow-hidden relative">
          <span className="text-4xl opacity-25 group-hover:scale-125 transition-transform duration-700">🛠️</span>
        </div>
      )}

      <div className="flex items-center gap-2 mb-2 flex-wrap">
        <span className={`text-xs px-2.5 py-0.5 rounded-full font-bold border tracking-wide ${
          tool.type === 'FREE'
            ? 'bg-emerald-500/15 text-emerald-400 border-emerald-500/25'
            : 'bg-violet-500/15 text-violet-400 border-violet-500/25'
        }`}>{tool.type}</span>
        {tool.tag && (
          <span className="text-xs text-gray-500 bg-white/5 px-2 py-0.5 rounded-full border border-white/8">{tool.tag}</span>
        )}
      </div>

      <h3 className="text-white font-semibold mb-1 group-hover:text-cyan-200 transition-colors">{tool.name}</h3>
      <p className="text-gray-400 text-sm flex-1 mb-4 leading-relaxed">{tool.shortDescription}</p>

      {tool.link && (
        <a href={tool.link} target="_blank" rel="noopener noreferrer"
          className={`mt-auto text-sm text-center py-2.5 rounded-xl border font-semibold transition-all duration-300 ${ac.btn}`}>
          Open Tool →
        </a>
      )}
    </div>
  )
}

/* ─── StatItem ───────────────────────────────────────────── */
function StatItem({ value, label, delay, visible, gradient }) {
  return (
    <div
      className="text-center group"
      style={{
        opacity: visible ? 1 : 0,
        transform: visible ? 'translateY(0) scale(1)' : 'translateY(28px) scale(0.9)',
        transition: `opacity 0.6s ease ${delay}s, transform 0.6s cubic-bezier(0.34,1.4,0.64,1) ${delay}s`,
      }}
    >
      <div className={`text-4xl font-black mb-2 bg-gradient-to-r ${gradient} bg-clip-text text-transparent`}>
        {value}
      </div>
      <p className="text-sm text-gray-500 font-medium tracking-wide">{label}</p>
    </div>
  )
}

/* ═══════════════════════════════════════════════════════════
   HOME PAGE
═══════════════════════════════════════════════════════════ */
export default function Home() {
  const [blogs, setBlogs] = useState([])
  const [tools, setTools] = useState([])

  const [heroRef,   heroVisible]   = useInView(0.05)
  const [blogsRef,  blogsVisible]  = useInView(0.08)
  const [toolsRef,  toolsVisible]  = useInView(0.08)
  const [authorRef, authorVisible] = useInView(0.08)
  const [ctaRef,    ctaVisible]    = useInView(0.08)
  const [statsRef,  statsVisible]  = useInView(0.15)
  const [featRef,   featVisible]   = useInView(0.05)

  const typingWords = ['Developer', 'Creator', 'Builder', 'Problem Solver', 'Open Source Fan']
  const typed = useTypingEffect(typingWords, 75, 2000)

  useEffect(() => {
    api.get('/blog/get-all').then(r => setBlogs((r.data.Blogs || []).slice(0, 5))).catch(() => {})
    api.get('/tools/free-tools').then(r => setTools((r.data.freeTools || []).slice(0, 3))).catch(() => {})
  }, [])

  return (
    <div className="bg-gray-950 overflow-x-hidden font-sans">

      {/* ══ CURSOR GLOW ══ */}
      <CursorGlow />

      {/* Inject burst keyframes */}
      <style>{`
        @keyframes burst {
          0%   { transform: translate(0, 0) scale(1); opacity: 1; }
          100% { transform: translate(var(--dx), var(--dy)) scale(0); opacity: 0; }
        }
      `}</style>

      {/* ════════ HERO ════════ */}
      <section className="relative min-h-screen flex flex-col items-center justify-center text-center px-4 pt-24 pb-16 overflow-hidden">

        {/* Background orbs */}
        <Orb className="w-[900px] h-[900px] bg-indigo-600/8 -top-60 left-1/2 -translate-x-1/2" />
        <Orb className="w-[500px] h-[500px] bg-violet-600/10 top-1/3 -left-48" />
        <Orb className="w-[400px] h-[400px] bg-cyan-600/8 top-1/2 -right-40" />
        <Orb className="w-64 h-64 bg-pink-600/8 bottom-20 left-1/4" />
        <Orb className="w-48 h-48 bg-emerald-600/8 bottom-32 right-1/4" />

        {/* Spinning rings */}
        <SpinRing className="w-[600px] h-[600px] border-indigo-500 top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2" />
        <SpinRing className="w-[800px] h-[800px] border-violet-500 top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2" style={{ animationDirection: 'reverse' }} />

        {/* Grid lines overlay */}
        <div
          className="absolute inset-0 opacity-[0.035]"
          style={{
            backgroundImage: 'linear-gradient(#6366f1 1px,transparent 1px),linear-gradient(90deg,#6366f1 1px,transparent 1px)',
            backgroundSize: '72px 72px',
          }}
        />

        {/* Particles */}
        <Particles />

        <div
          ref={heroRef}
          className="relative z-10 max-w-5xl mx-auto"
          style={{
            opacity: heroVisible ? 1 : 0,
            transform: heroVisible ? 'translateY(0)' : 'translateY(40px)',
            transition: 'opacity 1s ease, transform 1s ease',
          }}
        >
          {/* Eyebrow badge */}
          <div className="inline-flex items-center gap-2.5 bg-gradient-to-r from-indigo-600/15 via-violet-600/15 to-cyan-600/15 border border-white/10 px-5 py-2 rounded-full text-sm font-semibold mb-10 backdrop-blur">
            <span className="w-2 h-2 rounded-full bg-indigo-400 animate-pulse shadow-lg shadow-indigo-500/50" />
            <span className="bg-gradient-to-r from-indigo-300 via-violet-300 to-cyan-300 bg-clip-text text-transparent">
              Developer · Creator · Builder
            </span>
            <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse shadow-lg shadow-cyan-500/50" />
          </div>

          {/* Headline */}
          <h1 className="text-5xl sm:text-6xl md:text-8xl font-black text-white leading-[1.05] tracking-tight mb-4">
            Welcome to{' '}
            <br className="sm:hidden" />
            <span className="relative inline-block mt-2">
              <span className="relative z-10 bg-gradient-to-r from-indigo-400 via-violet-400 via-50% to-cyan-400 bg-clip-text text-transparent animate-shimmer">
                Digifello AI
              </span>
              <span className="absolute -bottom-1 left-0 right-0 h-1 bg-gradient-to-r from-indigo-500 via-violet-500 to-cyan-500 rounded-full blur-sm opacity-70" />
              <span className="absolute -bottom-1 left-0 right-0 h-px bg-gradient-to-r from-indigo-400 via-violet-400 to-cyan-400 rounded-full" />
            </span>
          </h1>

          {/* Typing effect */}
          <div className="h-12 flex items-center justify-center mb-6 mt-2">
            <span className="text-xl sm:text-2xl font-bold text-gray-300">
              I am a{' '}
              <span className="bg-gradient-to-r from-pink-400 via-violet-400 to-indigo-400 bg-clip-text text-transparent">
                {typed}
              </span>
              <span className="cursor-blink text-violet-400 ml-0.5">|</span>
            </span>
          </div>

          <p className="text-gray-400 text-lg sm:text-xl max-w-2xl mx-auto mb-12 leading-relaxed">
            Sharing knowledge through in-depth blogs, shipping productivity tools, and turning ideas into real software —{' '}
            <span className="text-gray-300 font-medium">one build at a time.</span>
          </p>

          {/* CTA buttons */}
          <div className="flex flex-wrap gap-4 justify-center mb-16">
            <Link
              to="/blogs"
              className="group relative px-7 py-3.5 rounded-xl bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-500 hover:to-violet-500 text-white font-bold text-sm shadow-2xl shadow-indigo-900/50 hover:shadow-indigo-800/70 transition-all duration-300 hover:-translate-y-1 animate-glow overflow-hidden"
            >
              <span className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/10 to-white/0 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700" />
              <span className="relative z-10 flex items-center gap-2">
                <span>📝</span> Read Blogs
              </span>
            </Link>
            <Link
              to="/tools"
              className="group px-7 py-3.5 rounded-xl bg-white/5 hover:bg-white/10 text-white font-bold text-sm border border-white/12 hover:border-cyan-500/50 backdrop-blur transition-all duration-300 hover:-translate-y-1 hover:text-cyan-300 relative overflow-hidden"
            >
              <span className="absolute inset-0 bg-gradient-to-r from-cyan-500/0 via-cyan-500/5 to-cyan-500/0 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700" />
              <span className="relative z-10 flex items-center gap-2"><span>🛠️</span> Browse Tools</span>
            </Link>
            <Link
              to="/tool-request"
              className="px-7 py-3.5 rounded-xl text-pink-400 hover:text-pink-300 font-bold text-sm border border-pink-500/30 hover:border-pink-400/60 hover:bg-pink-950/30 transition-all duration-300 hover:-translate-y-1"
            >
              ✨ Request a Tool →
            </Link>
          </div>

          {/* Scroll hint */}
          <div className="flex flex-col items-center gap-1 text-gray-600 text-xs">
            <span className="tracking-widest uppercase text-[10px]">scroll</span>
            <div className="w-5 h-8 border border-gray-700 rounded-full flex items-start justify-center p-1">
              <div className="w-1 h-2 bg-indigo-500 rounded-full animate-bounce" />
            </div>
          </div>
        </div>
      </section>

      {/* ════════ MARQUEE ════════ */}
      <MarqueeStrip />

      {/* ════════ STATS ════════ */}
      <section className="relative py-20 px-4 overflow-hidden" ref={statsRef}>
        <div className="absolute inset-0 bg-gradient-to-b from-indigo-950/10 via-violet-950/10 to-transparent pointer-events-none" />
        <Orb className="w-[500px] h-32 bg-indigo-600/10 left-1/2 -translate-x-1/2 top-0 blur-2xl" />

        <div className="max-w-5xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-10 relative z-10">
          {[
            { value: '5+',   label: 'Blog Posts',    delay: 0,    gradient: 'from-indigo-400 to-violet-400' },
            { value: '10+',  label: 'Tools Built',   delay: 0.12, gradient: 'from-cyan-400 to-emerald-400' },
            { value: '100%', label: 'Open to Ideas', delay: 0.24, gradient: 'from-pink-400 to-rose-400' },
            { value: '∞',    label: 'Curiosity',     delay: 0.36, gradient: 'from-amber-400 to-orange-400' },
          ].map(s => <StatItem key={s.label} {...s} visible={statsVisible} />)}
        </div>
      </section>

      {/* ════════ BLOGS ════════ */}
      <section className="relative py-24 px-4 overflow-hidden" ref={blogsRef}>
        <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-indigo-500/30 to-transparent" />
        <Orb className="w-[400px] h-[400px] bg-violet-600/8 -right-32 top-10" />
        <Orb className="w-64 h-64 bg-indigo-600/6 -left-16 bottom-10" />

        <div className="max-w-6xl mx-auto relative z-10">
          <div
            style={{
              opacity: blogsVisible ? 1 : 0,
              transform: blogsVisible ? 'translateY(0)' : 'translateY(28px)',
              transition: 'opacity 0.7s ease, transform 0.7s ease',
            }}
            className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-14"
          >
            <div>
              <div className="flex items-center gap-2 mb-3">
                <div className="w-8 h-px bg-gradient-to-r from-indigo-500 to-violet-500" />
                <p className="text-xs font-bold tracking-[0.25em] uppercase bg-gradient-to-r from-indigo-400 to-violet-400 bg-clip-text text-transparent">From the blog</p>
              </div>
              <h2 className="text-4xl sm:text-5xl font-black text-white leading-tight">
                Recent{' '}
                <span className="bg-gradient-to-r from-indigo-400 via-violet-400 to-pink-400 bg-clip-text text-transparent">
                  Articles
                </span>
              </h2>
              <p className="text-gray-500 mt-2 text-sm">Technical deep-dives, tutorials &amp; thoughts.</p>
            </div>
            <Link to="/blogs" className="group text-sm text-indigo-400 hover:text-indigo-300 border border-indigo-500/30 hover:border-indigo-400/60 px-5 py-2.5 rounded-xl transition-all whitespace-nowrap self-start sm:self-auto hover:bg-indigo-950/40 font-semibold flex items-center gap-1.5">
              View all blogs <span className="group-hover:translate-x-1 transition-transform inline-block">→</span>
            </Link>
          </div>

          {blogs.length === 0 ? (
            <div className="text-center py-24 text-gray-600 flex flex-col items-center gap-3">
              <span className="text-5xl opacity-30">📝</span>
              <p>No blogs yet — check back soon.</p>
            </div>
          ) : (
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {blogs.slice(0, 3).map((b, i) => <BlogCard key={b._id} blog={b} index={i} visible={blogsVisible} />)}
            </div>
          )}

          {blogs.length > 3 && (
            <div
              className="mt-6 grid sm:grid-cols-2 gap-5"
              style={{ opacity: blogsVisible ? 1 : 0, transition: 'opacity 0.7s ease 0.55s' }}
            >
              {blogs.slice(3, 5).map((b) => (
                <Link
                  key={b._id}
                  to={`/blogs/${b._id}`}
                  className="group flex items-center gap-4 rounded-2xl border border-white/8 bg-gray-900/60 p-4 hover:border-indigo-500/40 transition-all duration-300 hover:-translate-y-0.5 hover:shadow-lg hover:shadow-indigo-950/40"
                >
                  {b.thumbnail && <img src={b.thumbnail} alt={b.title} className="w-16 h-16 object-cover rounded-xl flex-shrink-0" />}
                  <div className="min-w-0">
                    {b.tag && <span className="text-xs text-indigo-400 font-semibold">{b.tag} · </span>}
                    <p className="text-white text-sm font-semibold group-hover:text-indigo-300 transition-colors truncate">{b.title}</p>
                    <p className="text-gray-500 text-xs mt-0.5">{b.createdAt ? new Date(b.createdAt).toLocaleDateString() : ''}</p>
                  </div>
                  <span className="ml-auto text-gray-600 group-hover:text-indigo-400 group-hover:translate-x-1.5 transition-all text-lg flex-shrink-0">→</span>
                </Link>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* ════════ TOOLS ════════ */}
      <section className="relative py-24 px-4 overflow-hidden" ref={toolsRef}>
        <div className="absolute inset-0 bg-gradient-to-b from-cyan-950/10 via-transparent to-transparent pointer-events-none" />
        <Orb className="w-[400px] h-[400px] bg-cyan-600/8 -left-32 top-0" />
        <Orb className="w-72 h-72 bg-emerald-600/8 right-10 bottom-10" />
        <Orb className="w-48 h-48 bg-indigo-600/10 right-1/3 top-1/2" />

        <div className="max-w-6xl mx-auto relative z-10">
          <div
            style={{
              opacity: toolsVisible ? 1 : 0,
              transform: toolsVisible ? 'translateY(0)' : 'translateY(28px)',
              transition: 'opacity 0.7s ease, transform 0.7s ease',
            }}
            className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-14"
          >
            <div>
              <div className="flex items-center gap-2 mb-3">
                <div className="w-8 h-px bg-gradient-to-r from-cyan-500 to-emerald-500" />
                <p className="text-xs font-bold tracking-[0.25em] uppercase bg-gradient-to-r from-cyan-400 to-emerald-400 bg-clip-text text-transparent">What I've built</p>
              </div>
              <h2 className="text-4xl sm:text-5xl font-black text-white leading-tight">
                Free{' '}
                <span className="bg-gradient-to-r from-cyan-400 via-emerald-400 to-teal-400 bg-clip-text text-transparent">
                  Tools
                </span>
              </h2>
              <p className="text-gray-500 mt-2 text-sm">Productivity tools, free to use, built for the community.</p>
            </div>
            <Link to="/tools" className="group text-sm text-cyan-400 hover:text-cyan-300 border border-cyan-500/30 hover:border-cyan-400/60 px-5 py-2.5 rounded-xl transition-all whitespace-nowrap self-start sm:self-auto hover:bg-cyan-950/30 font-semibold flex items-center gap-1.5">
              All tools <span className="group-hover:translate-x-1 transition-transform inline-block">→</span>
            </Link>
          </div>

          {tools.length === 0 ? (
            <div className="text-center py-24 text-gray-600 flex flex-col items-center gap-3">
              <span className="text-5xl opacity-30">🛠️</span>
              <p>Tools coming soon.</p>
            </div>
          ) : (
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {tools.map((t, i) => <ToolCard key={t._id} tool={t} index={i} visible={toolsVisible} />)}
            </div>
          )}
        </div>
      </section>

      {/* ════════ AUTHOR ════════ */}
      <section className="relative py-28 px-4 overflow-hidden" ref={authorRef}>
        <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-violet-500/30 to-transparent" />
        <Orb className="w-[600px] h-[600px] bg-violet-600/8 left-1/2 -translate-x-1/2 top-1/2 -translate-y-1/2" />
        <Orb className="w-64 h-64 bg-pink-600/6 right-0 top-0" />

        <div
          className="max-w-4xl mx-auto relative z-10"
          style={{
            opacity: authorVisible ? 1 : 0,
            transform: authorVisible ? 'translateY(0)' : 'translateY(48px)',
            transition: 'opacity 0.9s ease, transform 0.9s ease',
          }}
        >
          <div className="flex items-center justify-center gap-2 mb-10">
            <div className="w-8 h-px bg-gradient-to-r from-transparent to-violet-500" />
            <p className="text-xs font-bold tracking-[0.25em] uppercase bg-gradient-to-r from-violet-400 to-pink-400 bg-clip-text text-transparent">The person behind it</p>
            <div className="w-8 h-px bg-gradient-to-l from-transparent to-pink-500" />
          </div>

          <div className="relative rounded-3xl border border-white/8 overflow-hidden">
            <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-indigo-500 via-violet-500 via-40% to-pink-500 to-cyan-500" />
            <div className="bg-gradient-to-br from-gray-900/90 via-gray-950/90 to-gray-900/90 backdrop-blur-sm p-8 sm:p-12">
              <div className="absolute top-0 right-0 w-80 h-80 bg-violet-600/8 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
              <div className="absolute bottom-0 left-0 w-64 h-64 bg-pink-600/6 rounded-full blur-3xl translate-y-1/2 -translate-x-1/2" />
              <div className="absolute bottom-0 right-0 w-48 h-48 bg-cyan-600/6 rounded-full blur-3xl translate-y-1/3 translate-x-1/3" />

              <div className="relative z-10 flex flex-col sm:flex-row items-center sm:items-start gap-8">
                <div className="flex-shrink-0">
                  <div className="relative animate-float">
                    <div className="w-32 h-32 sm:w-40 sm:h-40 rounded-2xl bg-gradient-to-br from-indigo-600 via-violet-600 to-pink-600 flex items-center justify-center text-6xl font-black text-white shadow-2xl shadow-violet-900/60 overflow-hidden">
                      <span>D</span>
                    </div>
                    <div className="absolute inset-0 rounded-2xl border-2 border-violet-500/30 animate-glow" />
                    <div className="absolute -bottom-2 -right-2 w-7 h-7 bg-emerald-500 rounded-full border-[3px] border-gray-950 flex items-center justify-center shadow-lg shadow-emerald-500/50">
                      <div className="w-2.5 h-2.5 bg-white rounded-full animate-pulse" />
                    </div>
                  </div>
                </div>

                <div className="flex-1 text-center sm:text-left">
                  <h2 className="text-3xl sm:text-4xl font-black text-white mb-1">Digifello</h2>
                  <p className="text-sm font-semibold mb-5 bg-gradient-to-r from-indigo-400 via-violet-400 to-pink-400 bg-clip-text text-transparent">
                    Full-Stack Developer · Writer · Builder
                  </p>
                  <p className="text-gray-400 leading-relaxed mb-3">
                    I'm a full-stack developer passionate about building useful digital tools and sharing knowledge through technical writing.
                    I work with <span className="text-white font-semibold">Node.js, React, MongoDB</span>, and a range of modern web technologies.
                  </p>
                  <p className="text-gray-400 leading-relaxed mb-6">
                    This platform is where I share blogs on what I learn, publish tools I build, and take custom tool requests.
                    <span className="text-white font-medium"> If you have an idea for a tool — let's make it happen.</span>
                  </p>

                  <div className="flex flex-wrap gap-2 mb-7 justify-center sm:justify-start">
                    {[
                      { label: 'Node.js',      color: 'border-emerald-500/30 text-emerald-400 bg-emerald-500/8' },
                      { label: 'React',        color: 'border-cyan-500/30 text-cyan-400 bg-cyan-500/8' },
                      { label: 'MongoDB',      color: 'border-green-500/30 text-green-400 bg-green-500/8' },
                      { label: 'Express',      color: 'border-gray-500/30 text-gray-400 bg-gray-500/8' },
                      { label: 'REST APIs',    color: 'border-violet-500/30 text-violet-400 bg-violet-500/8' },
                      { label: 'JWT Auth',     color: 'border-amber-500/30 text-amber-400 bg-amber-500/8' },
                      { label: 'Tailwind CSS', color: 'border-sky-500/30 text-sky-400 bg-sky-500/8' },
                    ].map(sk => (
                      <span key={sk.label} className={`text-xs px-3 py-1.5 rounded-full border font-semibold ${sk.color}`}>
                        {sk.label}
                      </span>
                    ))}
                  </div>

                  <div className="flex flex-wrap gap-3 justify-center sm:justify-start">
                    <Link to="/about" className="px-6 py-3 rounded-xl bg-gradient-to-r from-violet-600 to-pink-600 hover:from-violet-500 hover:to-pink-500 text-white text-sm font-bold transition-all shadow-lg shadow-violet-900/40 hover:-translate-y-0.5 hover:shadow-violet-800/60">
                      More About Me
                    </Link>
                    <Link to="/tool-request" className="px-6 py-3 rounded-xl bg-white/5 hover:bg-white/10 text-gray-300 hover:text-white text-sm font-bold border border-white/10 hover:border-white/20 transition-all hover:-translate-y-0.5">
                      Request a Tool
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ════════ FEATURES GRID ════════ */}
      <section className="relative py-24 px-4 overflow-hidden" ref={featRef}>
        <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-white/8 to-transparent" />
        <Orb className="w-72 h-72 bg-indigo-600/8 right-0 top-10" />
        <Orb className="w-64 h-64 bg-pink-600/6 left-0 bottom-10" />

        <div className="max-w-6xl mx-auto relative z-10">
          <div className="text-center mb-14">
            <div className="flex items-center justify-center gap-2 mb-3">
              <div className="w-8 h-px bg-gradient-to-r from-transparent to-pink-500" />
              <p className="text-xs font-bold tracking-[0.25em] uppercase text-gray-500">Everything in one place</p>
              <div className="w-8 h-px bg-gradient-to-l from-transparent to-indigo-500" />
            </div>
            <h2 className="text-4xl sm:text-5xl font-black text-white">
              What you'll{' '}
              <span className="bg-gradient-to-r from-pink-400 via-violet-400 to-indigo-400 bg-clip-text text-transparent">
                find here
              </span>
            </h2>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {[
              {
                icon: '📝', emoji_bg: 'from-indigo-950 to-gray-900',
                gradient: 'from-indigo-600/15 via-indigo-600/5 to-transparent',
                border: 'border-indigo-500/20 hover:border-indigo-500/60',
                accent: 'from-indigo-400 to-violet-400',
                glow: 'hover:shadow-indigo-950/60',
                title: 'Technical Blogs',
                desc: 'In-depth articles and tutorials on web development, Node.js, React, APIs and more.',
                cta: 'Read blogs →', to: '/blogs',
              },
              {
                icon: '🛠️', emoji_bg: 'from-cyan-950 to-gray-900',
                gradient: 'from-cyan-600/15 via-cyan-600/5 to-transparent',
                border: 'border-cyan-500/20 hover:border-cyan-500/60',
                accent: 'from-cyan-400 to-emerald-400',
                glow: 'hover:shadow-cyan-950/60',
                title: 'Productivity Tools',
                desc: 'Free and paid tools built to save you time and boost your workflow.',
                cta: 'Browse tools →', to: '/tools',
              },
              {
                icon: '💡', emoji_bg: 'from-violet-950 to-gray-900',
                gradient: 'from-violet-600/15 via-violet-600/5 to-transparent',
                border: 'border-violet-500/20 hover:border-violet-500/60',
                accent: 'from-violet-400 to-pink-400',
                glow: 'hover:shadow-violet-950/60',
                title: 'Custom Tool Requests',
                desc: 'Have an idea for a tool? Submit a request with your description and budget.',
                cta: 'Submit request →', to: '/tool-request',
              },
              {
                icon: '💬', emoji_bg: 'from-pink-950 to-gray-900',
                gradient: 'from-pink-600/15 via-pink-600/5 to-transparent',
                border: 'border-pink-500/20 hover:border-pink-500/60',
                accent: 'from-pink-400 to-rose-400',
                glow: 'hover:shadow-pink-950/60',
                title: 'Community Comments',
                desc: 'Join the conversation — comment on blogs and share your perspective.',
                cta: 'Read articles →', to: '/blogs',
              },
              {
                icon: '🔐', emoji_bg: 'from-amber-950 to-gray-900',
                gradient: 'from-amber-600/15 via-amber-600/5 to-transparent',
                border: 'border-amber-500/20 hover:border-amber-500/60',
                accent: 'from-amber-400 to-orange-400',
                glow: 'hover:shadow-amber-950/60',
                title: 'Secure Accounts',
                desc: 'JWT-based auth with OTP email verification and token refresh built-in.',
                cta: 'Create account →', to: '/register',
              },
              {
                icon: '📊', emoji_bg: 'from-emerald-950 to-gray-900',
                gradient: 'from-emerald-600/15 via-emerald-600/5 to-transparent',
                border: 'border-emerald-500/20 hover:border-emerald-500/60',
                accent: 'from-emerald-400 to-teal-400',
                glow: 'hover:shadow-emerald-950/60',
                title: 'Request Dashboard',
                desc: 'Track all your tool requests and see their status in real time.',
                cta: 'Go to dashboard →', to: '/dashboard',
              },
            ].map((f, i) => (
              <Link
                key={f.title}
                to={f.to}
                className={`group relative rounded-2xl border ${f.border} bg-gradient-to-br ${f.gradient} p-6 transition-all duration-300 hover:-translate-y-2 hover:shadow-xl ${f.glow} overflow-hidden`}
                style={{
                  opacity: featVisible ? 1 : 0,
                  transform: featVisible ? 'translateY(0)' : 'translateY(40px)',
                  transition: `opacity 0.6s ease ${i * 0.08}s, transform 0.6s cubic-bezier(0.34,1.2,0.64,1) ${i * 0.08}s, border-color 0.3s, box-shadow 0.3s`,
                }}
              >
                <div className={`absolute top-0 left-0 right-0 h-px bg-gradient-to-r ${f.gradient} opacity-60`} />
                <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/4 to-white/0 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700 pointer-events-none" />

                <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${f.emoji_bg} flex items-center justify-center text-2xl mb-4 border border-white/5 group-hover:scale-110 transition-transform duration-300`}>
                  {f.icon}
                </div>
                <h3 className="font-bold text-white mb-2 text-base">{f.title}</h3>
                <p className="text-gray-400 text-sm leading-relaxed mb-4">{f.desc}</p>
                <span className={`text-sm font-bold bg-gradient-to-r ${f.accent} bg-clip-text text-transparent group-hover:translate-x-1.5 inline-flex items-center gap-1 transition-transform`}>
                  {f.cta}
                </span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ════════ CTA BANNER ════════ */}
      <section className="relative py-28 px-4 overflow-hidden" ref={ctaRef}>
        <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-indigo-500/30 to-transparent" />
        <div className="absolute bottom-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-violet-500/20 to-transparent" />
        <Orb className="w-[600px] h-72 bg-indigo-600/12 left-1/2 -translate-x-1/2 top-1/2 -translate-y-1/2" />
        <Orb className="w-64 h-64 bg-violet-600/8 left-10 bottom-0" />
        <Orb className="w-64 h-64 bg-pink-600/6 right-10 top-0" />
        <SpinRing className="w-[400px] h-[400px] border-indigo-500/20 top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2" />

        <div
          className="max-w-3xl mx-auto text-center relative z-10"
          style={{
            opacity: ctaVisible ? 1 : 0,
            transform: ctaVisible ? 'translateY(0)' : 'translateY(36px)',
            transition: 'opacity 0.9s ease, transform 0.9s ease',
          }}
        >
          <div className="inline-flex items-center gap-2 bg-gradient-to-r from-indigo-600/15 to-violet-600/15 border border-white/10 px-4 py-1.5 rounded-full text-xs font-bold tracking-widest uppercase text-indigo-300 mb-8">
            <span className="w-1.5 h-1.5 rounded-full bg-indigo-400 animate-pulse" />
            Let's collaborate
          </div>

          <h2 className="text-4xl sm:text-5xl font-black text-white mb-5 leading-tight">
            Got an idea for a tool?{' '}
            <br className="hidden sm:block" />
            <span className="bg-gradient-to-r from-indigo-400 via-violet-400 to-pink-400 bg-clip-text text-transparent animate-shimmer">
              Let's build it.
            </span>
          </h2>
          <p className="text-gray-400 text-lg mb-10 max-w-xl mx-auto leading-relaxed">
            Submit your tool idea with a budget, and I'll bring it to life. Join others who've already requested custom tools.
          </p>
          <div className="flex flex-wrap gap-4 justify-center">
            <Link
              to="/register"
              className="group relative px-8 py-4 rounded-xl bg-gradient-to-r from-indigo-600 via-violet-600 to-pink-600 hover:from-indigo-500 hover:via-violet-500 hover:to-pink-500 text-white font-bold shadow-2xl shadow-indigo-900/50 hover:shadow-indigo-800/70 transition-all duration-300 hover:-translate-y-1 overflow-hidden"
            >
              <span className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/10 to-white/0 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700" />
              <span className="relative z-10">🚀 Create Free Account</span>
            </Link>
            <Link
              to="/tool-request"
              className="group px-8 py-4 rounded-xl bg-white/5 hover:bg-white/10 text-white font-bold border border-white/10 hover:border-violet-500/50 transition-all duration-300 hover:-translate-y-1 hover:text-violet-300 relative overflow-hidden"
            >
              <span className="absolute inset-0 bg-gradient-to-r from-violet-500/0 via-violet-500/5 to-violet-500/0 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700" />
              <span className="relative z-10">✨ Request a Tool</span>
            </Link>
          </div>
        </div>
      </section>
    </div>
  )
}
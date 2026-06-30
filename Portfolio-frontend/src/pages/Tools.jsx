import { useEffect, useMemo, useRef, useState } from 'react'
import api from '../utils/axios'

/* ─── Cursor Glow (same as Home / Blogs) ─────────────────── */
function CursorGlow() {
  const glowRef = useRef(null)
  const trailRef = useRef(null)
  const pos = useRef({ x: -200, y: -200 })
  const trail = useRef({ x: -200, y: -200 })
  const raf = useRef(null)
  const [clicks, setClicks] = useState([])

  useEffect(() => {
    const onMove = (e) => { pos.current = { x: e.clientX, y: e.clientY } }
    const onClick = (e) => {
      const id = Date.now()
      setClicks(prev => [...prev, { id, x: e.clientX, y: e.clientY }])
      setTimeout(() => setClicks(prev => prev.filter(c => c.id !== id)), 900)
    }
    const animate = () => {
      trail.current.x += (pos.current.x - trail.current.x) * 0.10
      trail.current.y += (pos.current.y - trail.current.y) * 0.10
      if (glowRef.current) glowRef.current.style.transform = `translate(${pos.current.x - 24}px, ${pos.current.y - 24}px)`
      if (trailRef.current) trailRef.current.style.transform = `translate(${trail.current.x - 200}px, ${trail.current.y - 200}px)`
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
      <div ref={trailRef} className="fixed top-0 left-0 w-[400px] h-[400px] rounded-full pointer-events-none z-[9998]"
        style={{ background: 'radial-gradient(circle, rgba(139,92,246,0.13) 0%, rgba(99,102,241,0.07) 40%, transparent 70%)', willChange: 'transform' }} />
      <div ref={glowRef} className="fixed top-0 left-0 w-12 h-12 rounded-full pointer-events-none z-[9999]"
        style={{
          background: 'radial-gradient(circle, rgba(167,139,250,0.9) 0%, rgba(99,102,241,0.5) 40%, transparent 75%)',
          boxShadow: '0 0 12px 4px rgba(139,92,246,0.5), 0 0 30px 8px rgba(99,102,241,0.25)',
          willChange: 'transform',
        }} />
      {clicks.map(c => <ClickBurst key={c.id} x={c.x} y={c.y} />)}
    </>
  )
}

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
    <div className="fixed pointer-events-none z-[9999]" style={{ left: x, top: y }}>
      {particles.map(p => (
        <div key={p.i} style={{
          position: 'absolute', width: p.size, height: p.size, borderRadius: '50%',
          background: p.color, boxShadow: `0 0 6px 2px ${p.color}88`,
          animation: `burst 0.85s ease-out forwards`, '--dx': `${p.dx}px`, '--dy': `${p.dy}px`,
        }} />
      ))}
    </div>
  )
}

function useInView(threshold = 0.1) {
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

function Orb({ className }) {
  return <div className={`absolute rounded-full blur-3xl pointer-events-none ${className}`} />
}

// Robust date getter: falls back to the timestamp embedded in Mongo's ObjectId
// whenever createdAt is missing/invalid, so Newest/Oldest sorting always works.
function getToolTime(tool) {
  const fromField = tool?.createdAt ? new Date(tool.createdAt).getTime() : NaN
  if (!isNaN(fromField)) return fromField
  if (tool?._id && /^[0-9a-fA-F]{24}$/.test(tool._id)) {
    return parseInt(tool._id.substring(0, 8), 16) * 1000
  }
  return 0
}

const accentColors = [
  { glow: 'hover:shadow-cyan-950/50',    border: 'hover:border-cyan-500/50',    btn: 'bg-cyan-600/20 hover:bg-cyan-600 text-cyan-400 hover:text-white border-cyan-500/30 hover:border-cyan-500', tag: 'bg-cyan-600/20 text-cyan-300 border-cyan-500/25' },
  { glow: 'hover:shadow-emerald-950/50', border: 'hover:border-emerald-500/50', btn: 'bg-emerald-600/20 hover:bg-emerald-600 text-emerald-400 hover:text-white border-emerald-500/30 hover:border-emerald-500', tag: 'bg-emerald-600/20 text-emerald-300 border-emerald-500/25' },
  { glow: 'hover:shadow-violet-950/50',  border: 'hover:border-violet-500/50',  btn: 'bg-violet-600/20 hover:bg-violet-600 text-violet-400 hover:text-white border-violet-500/30 hover:border-violet-500', tag: 'bg-violet-600/20 text-violet-300 border-violet-500/25' },
  { glow: 'hover:shadow-pink-950/50',    border: 'hover:border-pink-500/50',    btn: 'bg-pink-600/20 hover:bg-pink-600 text-pink-400 hover:text-white border-pink-500/30 hover:border-pink-500', tag: 'bg-pink-600/20 text-pink-300 border-pink-500/25' },
  { glow: 'hover:shadow-amber-950/50',   border: 'hover:border-amber-500/50',   btn: 'bg-amber-600/20 hover:bg-amber-600 text-amber-400 hover:text-white border-amber-500/30 hover:border-amber-500', tag: 'bg-amber-600/20 text-amber-300 border-amber-500/25' },
]

/* ─── Featured Tool (latest) ─────────────────────────────── */
function FeaturedTool({ tool, visible }) {
  const ac = accentColors[0]
  return (
    <a
      href={tool.link}
      target="_blank"
      rel="noopener noreferrer"
      className={`group relative rounded-3xl overflow-hidden border border-white/10 bg-gray-900/60 backdrop-blur flex flex-col md:flex-row ${ac.border} transition-all duration-500 hover:-translate-y-1 hover:shadow-2xl ${ac.glow}`}
      style={{
        opacity: visible ? 1 : 0,
        transform: visible ? 'translateY(0)' : 'translateY(36px)',
        transition: 'opacity 0.7s ease, transform 0.7s cubic-bezier(0.34,1.2,0.64,1)',
      }}
    >
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-white/20 to-transparent z-10" />
      <div className="md:w-1/2 relative overflow-hidden">
        {tool.thumbnail ? (
          <img src={tool.thumbnail} alt={tool.name} className="w-full h-56 md:h-full object-cover group-hover:scale-105 transition-transform duration-700" />
        ) : (
          <div className="w-full h-56 md:h-full bg-gradient-to-br from-cyan-950 via-gray-900 to-indigo-950 flex items-center justify-center">
            <span className="text-6xl opacity-20">🛠️</span>
          </div>
        )}
        <span className="absolute top-4 left-4 text-xs font-bold tracking-widest uppercase bg-cyan-600/90 text-white px-3 py-1 rounded-full shadow-lg flex items-center gap-1.5">
          <span className="w-1.5 h-1.5 bg-white rounded-full animate-pulse" /> Newest
        </span>
      </div>
      <div className="p-7 md:p-9 flex flex-col justify-center md:w-1/2">
        <div className="flex items-center gap-2 mb-4 flex-wrap">
          <span className={`text-xs px-2.5 py-0.5 rounded-full font-bold border tracking-wide ${
            tool.type === 'FREE'
              ? 'bg-emerald-500/15 text-emerald-400 border-emerald-500/25'
              : 'bg-violet-500/15 text-violet-400 border-violet-500/25'
          }`}>{tool.type}</span>
          {tool.tag && <span className={`text-xs ${ac.tag} border px-2.5 py-0.5 rounded-full font-semibold tracking-wide`}>{tool.tag}</span>}
        </div>
        <h2 className="text-2xl sm:text-3xl font-black text-white leading-snug mb-3 group-hover:text-cyan-200 transition-colors">
          {tool.name}
        </h2>
        <p className="text-gray-400 leading-relaxed mb-6">{tool.shortDescription}</p>
        <span className="text-cyan-400 font-semibold inline-flex items-center gap-1.5 group-hover:translate-x-1.5 transition-transform w-fit">
          Open tool <span>→</span>
        </span>
      </div>
    </a>
  )
}

/* ─── Tool Card ──────────────────────────────────────────── */
function ToolCard({ tool, index, visible }) {
  const ac = accentColors[index % accentColors.length]
  return (
    <div
      className={`group rounded-2xl border border-white/8 bg-gray-900/60 backdrop-blur p-5 flex flex-col ${ac.border} transition-all duration-500 hover:-translate-y-2 hover:shadow-2xl ${ac.glow} relative overflow-hidden`}
      style={{
        opacity: visible ? 1 : 0,
        transform: visible ? 'translateY(0)' : 'translateY(40px)',
        transition: `opacity 0.6s ease ${(index % 9) * 0.06}s, transform 0.6s cubic-bezier(0.34,1.2,0.64,1) ${(index % 9) * 0.06}s`,
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
      <p className="text-gray-400 text-sm flex-1 mb-4 leading-relaxed line-clamp-3">{tool.shortDescription}</p>

      <div className="flex items-center justify-between text-xs text-gray-500 mb-3 pt-3 border-t border-white/5">
        <span>{tool.createdAt ? new Date(getToolTime(tool)).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) : ''}</span>
      </div>

      {tool.link && (
        <a href={tool.link} target="_blank" rel="noopener noreferrer"
          className={`mt-auto text-sm text-center py-2.5 rounded-xl border font-semibold transition-all duration-300 ${ac.btn}`}>
          Open Tool →
        </a>
      )}
    </div>
  )
}

/* ─── Skeleton Card ──────────────────────────────────────── */
function SkeletonCard() {
  return (
    <div className="rounded-2xl overflow-hidden border border-white/8 bg-gray-900/60 animate-pulse p-5">
      <div className="w-full h-36 bg-white/5 rounded-xl mb-4" />
      <div className="h-4 w-16 bg-white/5 rounded-full mb-3" />
      <div className="h-4 w-full bg-white/5 rounded mb-2" />
      <div className="h-4 w-2/3 bg-white/5 rounded mb-4" />
      <div className="h-9 w-full bg-white/5 rounded-xl" />
    </div>
  )
}

const SORTS = [
  { id: 'newest', label: 'Newest', icon: '🕓' },
  { id: 'oldest', label: 'Oldest', icon: null },
  { id: 'az',     label: 'A–Z', icon: null },
]

/* ═══════════════════════════════════════════════════════════
   TOOLS PAGE
═══════════════════════════════════════════════════════════ */
export default function Tools() {
  const [freeTools, setFreeTools] = useState([])
  const [paidTools, setPaidTools] = useState([])
  const [tab, setTab] = useState('free')
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [query, setQuery] = useState('')
  const [activeTag, setActiveTag] = useState('All')
  const [sort, setSort] = useState('newest')

  const [heroRef, heroVisible] = useInView(0.05)
  const [gridRef, gridVisible] = useInView(0.03)

  useEffect(() => {
    setLoading(true)
    Promise.all([
      api.get('/tools/free-tools').then(r => setFreeTools(r.data.freeTools || [])).catch(() => {}),
      api.get('/tools/paid-tools').then(r => setPaidTools(r.data.paidTools || [])).catch(() => {})
    ]).catch(() => setError('Failed to load tools'))
      .finally(() => setLoading(false))
  }, [])

  const baseList = tab === 'free' ? freeTools : paidTools

  // Tags derived from the active tab's tools, ranked by frequency
  const tags = useMemo(() => {
    const counts = {}
    baseList.forEach(t => {
      const tg = t.tag || 'general'
      counts[tg] = (counts[tg] || 0) + 1
    })
    const sorted = Object.entries(counts).sort((a, b) => b[1] - a[1]).map(([t]) => t)
    return ['All', ...sorted]
  }, [baseList])

  // Reset tag filter when switching tabs (Free/Paid have different tag sets)
  useEffect(() => { setActiveTag('All') }, [tab])

  const filtered = useMemo(() => {
    let list = [...baseList]
    if (activeTag !== 'All') list = list.filter(t => (t.tag || 'general') === activeTag)
    if (query.trim()) {
      const q = query.trim().toLowerCase()
      list = list.filter(t =>
        t.name?.toLowerCase().includes(q) ||
        t.tag?.toLowerCase().includes(q) ||
        t.shortDescription?.toLowerCase().includes(q)
      )
    }
    switch (sort) {
      case 'oldest': list.sort((a, b) => getToolTime(a) - getToolTime(b)); break
      case 'az':     list.sort((a, b) => (a.name || '').localeCompare(b.name || '')); break
      default:       list.sort((a, b) => getToolTime(b) - getToolTime(a))
    }
    return list
  }, [baseList, activeTag, query, sort])

  const featured = !query.trim() && activeTag === 'All' && sort === 'newest' && filtered.length > 0 ? filtered[0] : null
  const restList = featured ? filtered.slice(1) : filtered

  return (
    <div className="bg-gray-950 min-h-screen overflow-x-hidden font-sans relative">
      <CursorGlow />
      <style>{`
        @keyframes burst {
          0%   { transform: translate(0, 0) scale(1); opacity: 1; }
          100% { transform: translate(var(--dx), var(--dy)) scale(0); opacity: 0; }
        }
      `}</style>

      {/* ════ HEADER ════ */}
      <section className="relative pt-28 pb-12 px-4 overflow-hidden">
        <Orb className="w-[700px] h-[700px] bg-cyan-600/8 -top-72 left-1/2 -translate-x-1/2" />
        <Orb className="w-[350px] h-[350px] bg-indigo-600/8 top-10 -left-32" />
        <Orb className="w-72 h-72 bg-emerald-600/8 top-0 -right-20" />
        <div
          className="absolute inset-0 opacity-[0.03] pointer-events-none"
          style={{ backgroundImage: 'linear-gradient(#6366f1 1px,transparent 1px),linear-gradient(90deg,#6366f1 1px,transparent 1px)', backgroundSize: '72px 72px' }}
        />

        <div ref={heroRef} className="max-w-6xl mx-auto relative z-10"
          style={{
            opacity: heroVisible ? 1 : 0,
            transform: heroVisible ? 'translateY(0)' : 'translateY(28px)',
            transition: 'opacity 0.8s ease, transform 0.8s ease',
          }}
        >
          <div className="flex items-center gap-2 mb-4">
            <div className="w-8 h-px bg-gradient-to-r from-cyan-500 to-emerald-500" />
            <p className="text-xs font-bold tracking-[0.25em] uppercase bg-gradient-to-r from-cyan-400 to-emerald-400 bg-clip-text text-transparent">What I've built</p>
          </div>
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-black text-white leading-tight mb-4">
            Productivity{' '}
            <span className="bg-gradient-to-r from-cyan-400 via-emerald-400 to-teal-400 bg-clip-text text-transparent">
              Tools
            </span>
          </h1>
          <p className="text-gray-400 text-lg max-w-2xl mb-10">
            Free and paid tools, built for the community to save time and boost workflow.
          </p>

          {/* ── Search bar ── */}
          <div className="relative max-w-2xl mb-7">
            <span className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-500">🔍</span>
            <input
              type="text"
              value={query}
              onChange={e => setQuery(e.target.value)}
              placeholder="Search tools, topics, tags..."
              className="w-full bg-gray-900/70 border border-white/10 focus:border-cyan-500/60 rounded-2xl pl-12 pr-12 py-4 text-white placeholder-gray-500 outline-none backdrop-blur transition-all focus:ring-2 focus:ring-cyan-500/20"
            />
            {query && (
              <button
                onClick={() => setQuery('')}
                className="absolute right-5 top-1/2 -translate-y-1/2 text-gray-500 hover:text-white transition-colors"
              >✕</button>
            )}
          </div>

          {/* ── Free / Paid Tabs ── */}
          <div className="flex gap-2 mb-6">
            <button
              onClick={() => setTab('free')}
              className={`px-5 py-2.5 rounded-xl font-semibold text-sm transition-all duration-300 ${
                tab === 'free'
                  ? 'bg-gradient-to-r from-emerald-600 to-teal-600 text-white shadow-lg shadow-emerald-900/40'
                  : 'bg-white/5 text-gray-400 hover:text-white border border-white/10 hover:border-white/25'
              }`}>
              🆓 Free Tools ({freeTools.length})
            </button>
            <button
              onClick={() => setTab('paid')}
              className={`px-5 py-2.5 rounded-xl font-semibold text-sm transition-all duration-300 ${
                tab === 'paid'
                  ? 'bg-gradient-to-r from-violet-600 to-indigo-600 text-white shadow-lg shadow-violet-900/40'
                  : 'bg-white/5 text-gray-400 hover:text-white border border-white/10 hover:border-white/25'
              }`}>
              💎 Paid Tools ({paidTools.length})
            </button>
          </div>

          {/* ── Tag pills ── */}
          {tags.length > 1 && (
            <div className="flex flex-wrap gap-2 mb-6">
              {tags.map(t => (
                <button
                  key={t}
                  onClick={() => setActiveTag(t)}
                  className={`text-xs font-semibold px-3.5 py-2 rounded-full border transition-all duration-300 ${
                    activeTag === t
                      ? 'bg-cyan-600 border-cyan-500 text-white shadow-lg shadow-cyan-900/40'
                      : 'bg-white/5 border-white/10 text-gray-400 hover:text-white hover:border-white/25'
                  }`}
                >
                  {t === 'All' ? '✨ All' : t}
                </button>
              ))}
            </div>
          )}

          {/* ── Sort tabs ── */}
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-xs text-gray-500 font-semibold uppercase tracking-wider mr-1">Sort:</span>
            {SORTS.map(s => (
              <button
                key={s.id}
                onClick={() => setSort(s.id)}
                className={`text-xs font-bold px-3 py-1.5 rounded-lg transition-all duration-300 flex items-center gap-1.5 ${
                  sort === s.id
                    ? 'bg-gradient-to-r from-cyan-600/30 to-emerald-600/30 text-cyan-300 border border-cyan-500/40'
                    : 'text-gray-500 hover:text-gray-300 border border-transparent'
                }`}
              >
                {s.icon} {s.label}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* ════ CONTENT ════ */}
      <section className="relative max-w-6xl mx-auto px-4 pb-28" ref={gridRef}>
        {error && <div className="text-red-400 mb-6">{error}</div>}

        {loading ? (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {Array.from({ length: 6 }).map((_, i) => <SkeletonCard key={i} />)}
          </div>
        ) : filtered.length === 0 ? (
          <div className="text-center py-28 text-gray-500 flex flex-col items-center gap-4">
            <span className="text-6xl opacity-20">🔍</span>
            <p className="text-lg">No {tab} tools match your search.</p>
            {(query || activeTag !== 'All') && (
              <button
                onClick={() => { setQuery(''); setActiveTag('All') }}
                className="text-cyan-400 hover:text-cyan-300 text-sm font-semibold border border-cyan-500/30 hover:border-cyan-400/60 px-4 py-2 rounded-xl transition-all"
              >Clear filters</button>
            )}
          </div>
        ) : (
          <>
            {featured && (
              <div className="mb-10">
                <FeaturedTool tool={featured} visible={gridVisible} />
              </div>
            )}

            <div className="flex items-center justify-between mb-6">
              <p className="text-sm text-gray-500">
                {restList.length} tool{restList.length !== 1 ? 's' : ''} {activeTag !== 'All' && <>in <span className="text-gray-300 font-medium">{activeTag}</span></>}
              </p>
            </div>

            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {restList.map((t, i) => <ToolCard key={t._id} tool={t} index={i} visible={gridVisible} />)}
            </div>
          </>
        )}
      </section>
    </div>
  )
}
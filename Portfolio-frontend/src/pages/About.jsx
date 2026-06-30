import { Link } from 'react-router-dom'
import { useEffect, useRef, useState } from 'react'

/* ─── Cursor Glow (same as Home / Blogs / Tools) ─────────── */
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

function useInView(threshold = 0.12) {
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

/* ─── Data (from resume) ─────────────────────────────────── */
const skillGroups = [
  {
    title: 'Languages', icon: '💻',
    items: ['C', 'C++', 'Python', 'Java', 'JavaScript', 'Kotlin', 'HTML', 'CSS'],
    accent: 'from-indigo-400 to-violet-400', border: 'border-indigo-500/20 hover:border-indigo-500/50', dot: 'bg-indigo-400',
  },
  {
    title: 'Frameworks & Tools', icon: '🧰',
    items: ['FastAPI', 'SQLite', 'SQLAlchemy', 'Git', 'Uvicorn', 'n8n', 'Swagger UI'],
    accent: 'from-cyan-400 to-emerald-400', border: 'border-cyan-500/20 hover:border-cyan-500/50', dot: 'bg-cyan-400',
  },
  {
    title: 'Cybersecurity', icon: '🛡️',
    items: ['Digital Forensics', 'Anti-Forensics Detection', 'Endpoint Monitoring', 'Honeypot Deception', 'Risk Scoring'],
    accent: 'from-pink-400 to-rose-400', border: 'border-pink-500/20 hover:border-pink-500/50', dot: 'bg-pink-400',
  },
  {
    title: 'AI / GenAI', icon: '🤖',
    items: ['Google Gemini API', 'OpenAI GPT-4o-mini', 'LLM Pipelines', 'AI Content Generation'],
    accent: 'from-violet-400 to-purple-400', border: 'border-violet-500/20 hover:border-violet-500/50', dot: 'bg-violet-400',
  },
]

const projects = [
  {
    name: 'DAFDN — Defensive Agent For Digital Forensics Network',
    stack: 'Python · FastAPI · SQLite · SQLAlchemy · HTML · CSS · JavaScript',
    desc: 'Windows-based multi-layer endpoint agent detecting anti-forensics via SHA-256 integrity checks, registry analysis and Windows Event Log monitoring. Risk scoring engine with honeypot deception; FastAPI backend with Gemini AI alert analysis and a live browser dashboard.',
    link: 'https://github.com/Mitul0000/DAFDN',
    accent: 'indigo', emoji: '🕵️',
  },
  {
    name: 'AI Productivity Manager',
    stack: 'n8n · Google Gemini · Telegram Bot API · Gmail · Google Calendar & Tasks API',
    desc: 'Telegram bot that manages Gmail (summarise, reply, send last 5 emails), Calendar events and Tasks via natural language. Memory-enabled Gemini AI agent connecting multiple Google APIs through a single conversational interface.',
    link: 'https://github.com/Mitul0000/AI-Productivity-Manager',
    accent: 'cyan', emoji: '🧠',
  },
  {
    name: 'Affiliate Marketing Automation with WordPress',
    stack: 'n8n · OpenAI GPT-4o-mini · Google Sheets · WordPress REST API · Telegram',
    desc: 'Reads blog topics from Google Sheets, generates SEO-optimised posts via GPT-4o-mini, auto-publishes to WordPress with featured images. Humanizer + structured output parser produce title, slug and meta; Telegram notifies on publish.',
    link: 'https://github.com/Mitul0000/Affiliate-Marketing-automation-with-wordpress',
    accent: 'emerald', emoji: '📝',
  },
  {
    name: 'Digifello AI',
    stack: 'Python · JavaScript · HTML · CSS',
    desc: 'A platform currently in development that hosts a collection of AI-powered tools — users can request new tools to be built and added to the platform. (You\'re looking at it!)',
    link: 'https://github.com/Mitul0000/Digifello-ai',
    accent: 'violet', emoji: '✨',
  },
  {
    name: 'Syllabus2Video AI',
    stack: 'Python · JavaScript · HTML · CSS',
    desc: 'Generative AI tool that converts academic syllabi into structured video content outlines and topic-wise scripts for educators.',
    link: 'https://github.com/Mitul0000/Syllabus2Video-AI',
    accent: 'pink', emoji: '🎬',
  },
]

const projectAccents = {
  indigo:  { border: 'hover:border-indigo-500/50',  glow: 'hover:shadow-indigo-950/50',  tag: 'bg-indigo-600/20 text-indigo-300 border-indigo-500/25',   bar: 'from-indigo-500 to-violet-500' },
  cyan:    { border: 'hover:border-cyan-500/50',     glow: 'hover:shadow-cyan-950/50',    tag: 'bg-cyan-600/20 text-cyan-300 border-cyan-500/25',         bar: 'from-cyan-500 to-emerald-500' },
  emerald: { border: 'hover:border-emerald-500/50',  glow: 'hover:shadow-emerald-950/50', tag: 'bg-emerald-600/20 text-emerald-300 border-emerald-500/25', bar: 'from-emerald-500 to-teal-500' },
  violet:  { border: 'hover:border-violet-500/50',   glow: 'hover:shadow-violet-950/50',  tag: 'bg-violet-600/20 text-violet-300 border-violet-500/25',   bar: 'from-violet-500 to-pink-500' },
  pink:    { border: 'hover:border-pink-500/50',     glow: 'hover:shadow-pink-950/50',    tag: 'bg-pink-600/20 text-pink-300 border-pink-500/25',         bar: 'from-pink-500 to-rose-500' },
}

const certifications = [
  'Fortinet Certified Fundamentals in Cybersecurity — Fortinet',
  'Fortinet Certified Associate in Cybersecurity — Fortinet',
]

const languages = [
  { name: 'English', level: 'Professional Proficiency', pct: 90 },
  { name: 'Bengali', level: 'Native', pct: 100 },
  { name: 'Hindi', level: 'Professional Proficiency', pct: 90 },
]

/* ─── Section components ──────────────────────────────────── */
function ProjectCard({ p, index, visible }) {
  const ac = projectAccents[p.accent]
  return (
    <a
      href={p.link}
      target="_blank"
      rel="noopener noreferrer"
      className={`group relative rounded-2xl overflow-hidden border border-white/8 bg-gray-900/60 backdrop-blur ${ac.border} transition-all duration-500 hover:-translate-y-2 hover:shadow-2xl ${ac.glow} flex flex-col p-6`}
      style={{
        opacity: visible ? 1 : 0,
        transform: visible ? 'translateY(0)' : 'translateY(40px)',
        transition: `opacity 0.6s ease ${index * 0.08}s, transform 0.6s cubic-bezier(0.34,1.2,0.64,1) ${index * 0.08}s`,
      }}
    >
      <div className={`absolute top-0 left-0 right-0 h-1 bg-gradient-to-r ${ac.bar} opacity-70`} />
      <div className="flex items-start justify-between gap-3 mb-3">
        <span className="text-3xl">{p.emoji}</span>
        <span className="text-gray-600 group-hover:text-white group-hover:translate-x-1 transition-all text-lg">↗</span>
      </div>
      <h3 className="text-white font-bold text-lg leading-snug mb-2 group-hover:text-indigo-200 transition-colors">{p.name}</h3>
      <p className="text-gray-400 text-sm leading-relaxed mb-4 flex-1">{p.desc}</p>
      <div className="flex flex-wrap gap-1.5">
        {p.stack.split(' · ').map(s => (
          <span key={s} className={`text-[11px] ${ac.tag} border px-2 py-0.5 rounded-full font-medium`}>{s}</span>
        ))}
      </div>
    </a>
  )
}

/* ═══════════════════════════════════════════════════════════
   ABOUT PAGE
═══════════════════════════════════════════════════════════ */
export default function About() {
  const [heroRef, heroVisible] = useInView(0.05)
  const [eduRef, eduVisible] = useInView(0.1)
  const [skillsRef, skillsVisible] = useInView(0.08)
  const [projRef, projVisible] = useInView(0.05)
  const [langRef, langVisible] = useInView(0.15)
  const [ctaRef, ctaVisible] = useInView(0.1)

  return (
    <div className="bg-gray-950 min-h-screen overflow-x-hidden font-sans relative">
      <CursorGlow />
      <style>{`
        @keyframes burst {
          0%   { transform: translate(0, 0) scale(1); opacity: 1; }
          100% { transform: translate(var(--dx), var(--dy)) scale(0); opacity: 0; }
        }
        @keyframes float-slow {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-14px); }
        }
      `}</style>

      {/* ════════ HERO ════════ */}
      <section className="relative pt-32 pb-20 px-4 overflow-hidden">
        <Orb className="w-[800px] h-[800px] bg-indigo-600/8 -top-72 left-1/2 -translate-x-1/2" />
        <Orb className="w-[400px] h-[400px] bg-violet-600/10 top-10 -left-40" />
        <Orb className="w-72 h-72 bg-cyan-600/8 top-0 -right-20" />
        <div
          className="absolute inset-0 opacity-[0.03] pointer-events-none"
          style={{ backgroundImage: 'linear-gradient(#6366f1 1px,transparent 1px),linear-gradient(90deg,#6366f1 1px,transparent 1px)', backgroundSize: '72px 72px' }}
        />

        <div
          ref={heroRef}
          className="max-w-5xl mx-auto relative z-10 flex flex-col md:flex-row items-center gap-12"
          style={{
            opacity: heroVisible ? 1 : 0,
            transform: heroVisible ? 'translateY(0)' : 'translateY(36px)',
            transition: 'opacity 0.9s ease, transform 0.9s ease',
          }}
        >
          {/* Profile picture slot */}
          <div className="flex-shrink-0" style={{ animation: 'float-slow 5s ease-in-out infinite' }}>
            <div className="relative">
              <div className="absolute -inset-3 rounded-[2rem] bg-gradient-to-br from-indigo-600/40 via-violet-600/30 to-cyan-600/30 blur-2xl" />
              <div className="relative w-44 h-44 sm:w-56 sm:h-56 rounded-[2rem] bg-gradient-to-br from-indigo-600 via-violet-600 to-pink-600 p-1 shadow-2xl shadow-violet-900/50">
                <div className="w-full h-full rounded-[1.85rem] bg-gray-900 flex items-center justify-center overflow-hidden">
                  {/* Replace this block with: <img src="/your-photo.jpg" alt="Mitul Chowdhury" className="w-full h-full object-cover rounded-[1.85rem]" /> */}
                  <span className="text-7xl font-black text-white/90">M</span>
                </div>
              </div>
              <div className="absolute -bottom-2 -right-2 w-9 h-9 bg-emerald-500 rounded-full border-4 border-gray-950 flex items-center justify-center shadow-lg shadow-emerald-500/50">
                <div className="w-3 h-3 bg-white rounded-full animate-pulse" />
              </div>
            </div>
          </div>

          {/* Intro text */}
          <div className="text-center md:text-left">
            <div className="inline-flex items-center gap-2.5 bg-gradient-to-r from-indigo-600/15 via-violet-600/15 to-cyan-600/15 border border-white/10 px-4 py-1.5 rounded-full text-xs font-bold tracking-widest uppercase mb-5 backdrop-blur">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
              <span className="bg-gradient-to-r from-indigo-300 via-violet-300 to-cyan-300 bg-clip-text text-transparent">Available for collaboration</span>
            </div>
            <h1 className="text-4xl sm:text-5xl font-black text-white leading-tight mb-3">
              Mitul{' '}
              <span className="bg-gradient-to-r from-indigo-400 via-violet-400 to-cyan-400 bg-clip-text text-transparent">
                Chowdhury
              </span>
            </h1>
            <p className="text-lg font-semibold mb-5 bg-gradient-to-r from-indigo-400 via-violet-400 to-pink-400 bg-clip-text text-transparent">
              Cybersecurity Engineer · Full-Stack Developer · AI Builder
            </p>
            <p className="text-gray-400 leading-relaxed max-w-xl mb-3">
              B.Tech–M.Tech Integrated student in <span className="text-white font-medium">Computer Science &amp; Engineering (Cyber Security)</span> at National Forensic Sciences University. I build digital forensics tools, AI-driven automations, and full-stack web platforms — and I write about what I learn along the way.
            </p>
            <p className="text-gray-400 leading-relaxed max-w-xl mb-7">
              This platform is where I share blogs, ship free and paid tools, and take custom build requests.{' '}
              <span className="text-white font-medium">Got an idea? Let's build it.</span>
            </p>

            <div className="flex flex-wrap gap-3 justify-center md:justify-start">
              <Link to="/tool-request" className="px-6 py-3 rounded-xl bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-500 hover:to-violet-500 text-white text-sm font-bold transition-all shadow-lg shadow-indigo-900/40 hover:-translate-y-0.5">
                Request a Tool
              </Link>
              <a href="https://github.com/Mitul0000" target="_blank" rel="noopener noreferrer" className="px-6 py-3 rounded-xl bg-white/5 hover:bg-white/10 text-gray-300 hover:text-white text-sm font-bold border border-white/10 hover:border-white/20 transition-all hover:-translate-y-0.5">
                GitHub ↗
              </a>
              <a href="https://medium.com/@mitul_digifello" target="_blank" rel="noopener noreferrer" className="px-6 py-3 rounded-xl bg-white/5 hover:bg-white/10 text-gray-300 hover:text-white text-sm font-bold border border-white/10 hover:border-white/20 transition-all hover:-translate-y-0.5">
                Medium ↗
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* ════════ EDUCATION + CERTIFICATIONS ════════ */}
      <section className="relative py-16 px-4 overflow-hidden" ref={eduRef}>
        <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-indigo-500/30 to-transparent" />
        <Orb className="w-72 h-72 bg-indigo-600/8 -left-20 top-10" />

        <div
          className="max-w-5xl mx-auto grid md:grid-cols-2 gap-6 relative z-10"
          style={{
            opacity: eduVisible ? 1 : 0,
            transform: eduVisible ? 'translateY(0)' : 'translateY(28px)',
            transition: 'opacity 0.7s ease, transform 0.7s ease',
          }}
        >
          {/* Education */}
          <div className="rounded-2xl border border-white/8 bg-gray-900/60 backdrop-blur p-7 relative overflow-hidden">
            <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-indigo-500/40 to-transparent" />
            <div className="flex items-center gap-2 mb-5">
              <span className="text-2xl">🎓</span>
              <h2 className="text-xl font-bold text-white">Education</h2>
            </div>
            <div className="relative pl-5 border-l-2 border-indigo-500/30">
              <span className="absolute -left-[7px] top-1 w-3 h-3 rounded-full bg-indigo-500 shadow-lg shadow-indigo-500/50" />
              <p className="text-white font-semibold">National Forensic Sciences University, Gandhinagar</p>
              <p className="text-indigo-300 text-sm mb-1">B.Tech–M.Tech Integrated, CSE (Cyber Security)</p>
              <p className="text-gray-500 text-xs mb-3">2025 – 2030 · Currently Semester II</p>
              <div className="flex gap-4 text-xs text-gray-400">
                <span>ISC (XII): <span className="text-white font-semibold">93%</span></span>
                <span>ICSE (X): <span className="text-white font-semibold">95.4%</span></span>
              </div>
              <p className="text-gray-500 text-xs mt-2">Himali Boarding School, Kurseong, Darjeeling</p>
            </div>
          </div>

          {/* Certifications + Languages */}
          <div className="flex flex-col gap-6">
            <div className="rounded-2xl border border-white/8 bg-gray-900/60 backdrop-blur p-7 relative overflow-hidden flex-1">
              <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-emerald-500/40 to-transparent" />
              <div className="flex items-center gap-2 mb-5">
                <span className="text-2xl">📜</span>
                <h2 className="text-xl font-bold text-white">Certifications</h2>
              </div>
              <ul className="space-y-3">
                {certifications.map(c => (
                  <li key={c} className="flex items-start gap-2.5 text-sm text-gray-300">
                    <span className="text-emerald-400 mt-0.5">✓</span>
                    {c}
                  </li>
                ))}
              </ul>
            </div>

            <div className="rounded-2xl border border-white/8 bg-gray-900/60 backdrop-blur p-7 relative overflow-hidden">
              <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-pink-500/40 to-transparent" />
              <div className="flex items-center gap-2 mb-5">
                <span className="text-2xl">🌐</span>
                <h2 className="text-xl font-bold text-white">Languages</h2>
              </div>
              <div className="space-y-3">
                {languages.map((l, i) => (
                  <div key={l.name}>
                    <div className="flex justify-between text-xs text-gray-400 mb-1">
                      <span className="text-white font-medium">{l.name}</span>
                      <span>{l.level}</span>
                    </div>
                    <div className="h-1.5 rounded-full bg-white/5 overflow-hidden">
                      <div
                        className="h-full rounded-full bg-gradient-to-r from-pink-500 to-violet-500"
                        style={{
                          width: langVisible ? `${l.pct}%` : '0%',
                          transition: `width 1s cubic-bezier(0.34,1.2,0.64,1) ${i * 0.15 + 0.2}s`,
                        }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ════════ SKILLS ════════ */}
      <section className="relative py-20 px-4 overflow-hidden" ref={skillsRef}>
        <div className="absolute inset-0 bg-gradient-to-b from-cyan-950/10 via-transparent to-transparent pointer-events-none" />
        <Orb className="w-96 h-96 bg-cyan-600/8 -right-32 top-10" />

        <div className="max-w-5xl mx-auto relative z-10">
          <div className="text-center mb-12">
            <div className="flex items-center justify-center gap-2 mb-3">
              <div className="w-8 h-px bg-gradient-to-r from-transparent to-cyan-500" />
              <p className="text-xs font-bold tracking-[0.25em] uppercase text-gray-500">What I work with</p>
              <div className="w-8 h-px bg-gradient-to-l from-transparent to-emerald-500" />
            </div>
            <h2 className="text-3xl sm:text-4xl font-black text-white">
              Technical{' '}
              <span className="bg-gradient-to-r from-cyan-400 via-emerald-400 to-indigo-400 bg-clip-text text-transparent">
                Skills
              </span>
            </h2>
          </div>

          <div className="grid sm:grid-cols-2 gap-5">
            {skillGroups.map((g, i) => (
              <div
                key={g.title}
                className={`rounded-2xl border ${g.border} bg-gray-900/60 backdrop-blur p-6 transition-all duration-500 hover:-translate-y-1.5`}
                style={{
                  opacity: skillsVisible ? 1 : 0,
                  transform: skillsVisible ? 'translateY(0)' : 'translateY(32px)',
                  transition: `opacity 0.6s ease ${i * 0.1}s, transform 0.6s cubic-bezier(0.34,1.2,0.64,1) ${i * 0.1}s, border-color 0.3s`,
                }}
              >
                <div className="flex items-center gap-2.5 mb-4">
                  <span className="text-2xl">{g.icon}</span>
                  <h3 className={`font-bold bg-gradient-to-r ${g.accent} bg-clip-text text-transparent`}>{g.title}</h3>
                </div>
                <div className="flex flex-wrap gap-2">
                  {g.items.map(item => (
                    <span key={item} className="text-xs px-3 py-1.5 rounded-full border border-white/10 bg-white/5 text-gray-300 font-medium flex items-center gap-1.5">
                      <span className={`w-1.5 h-1.5 rounded-full ${g.dot}`} />
                      {item}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ════════ PROJECTS ════════ */}
      <section className="relative py-20 px-4 overflow-hidden" ref={projRef}>
        <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-white/8 to-transparent" />
        <Orb className="w-72 h-72 bg-violet-600/8 left-0 top-10" />
        <Orb className="w-64 h-64 bg-pink-600/6 right-0 bottom-10" />

        <div className="max-w-6xl mx-auto relative z-10">
          <div className="text-center mb-12">
            <div className="flex items-center justify-center gap-2 mb-3">
              <div className="w-8 h-px bg-gradient-to-r from-transparent to-violet-500" />
              <p className="text-xs font-bold tracking-[0.25em] uppercase text-gray-500">Things I've shipped</p>
              <div className="w-8 h-px bg-gradient-to-l from-transparent to-pink-500" />
            </div>
            <h2 className="text-3xl sm:text-4xl font-black text-white">
              Featured{' '}
              <span className="bg-gradient-to-r from-violet-400 via-pink-400 to-indigo-400 bg-clip-text text-transparent">
                Projects
              </span>
            </h2>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {projects.map((p, i) => <ProjectCard key={p.name} p={p} index={i} visible={projVisible} />)}
          </div>
        </div>
      </section>

      {/* ════════ CTA ════════ */}
      <section className="relative py-24 px-4 overflow-hidden" ref={ctaRef}>
        <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-indigo-500/30 to-transparent" />
        <Orb className="w-[600px] h-72 bg-indigo-600/12 left-1/2 -translate-x-1/2 top-1/2 -translate-y-1/2" />
        <Orb className="w-64 h-64 bg-violet-600/8 left-10 bottom-0" />

        <div
          className="max-w-2xl mx-auto text-center relative z-10"
          style={{
            opacity: ctaVisible ? 1 : 0,
            transform: ctaVisible ? 'translateY(0)' : 'translateY(32px)',
            transition: 'opacity 0.8s ease, transform 0.8s ease',
          }}
        >
          <h2 className="text-3xl sm:text-4xl font-black text-white mb-4">
            Have an idea?{' '}
            <span className="bg-gradient-to-r from-indigo-400 via-violet-400 to-pink-400 bg-clip-text text-transparent">
              Let's build it together.
            </span>
          </h2>
          <p className="text-gray-400 mb-8">
            Whether it's a security tool, an AI automation, or a full-stack platform — I'd love to hear about it.
          </p>
          <div className="flex flex-wrap gap-4 justify-center">
            <Link to="/tool-request" className="px-7 py-3.5 rounded-xl bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-500 hover:to-violet-500 text-white font-bold text-sm shadow-2xl shadow-indigo-900/50 transition-all duration-300 hover:-translate-y-1">
              ✨ Request a Tool
            </Link>
            <a href="mailto:mitulchowdhury042006@gmail.com" className="px-7 py-3.5 rounded-xl bg-white/5 hover:bg-white/10 text-white font-bold text-sm border border-white/12 hover:border-cyan-500/50 transition-all duration-300 hover:-translate-y-1 hover:text-cyan-300">
              📧 Email Me
            </a>
          </div>
        </div>
      </section>
    </div>
  )
}
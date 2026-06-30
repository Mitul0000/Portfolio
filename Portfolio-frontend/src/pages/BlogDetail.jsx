import { useEffect, useMemo, useRef, useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import api from '../utils/axios'
import { useAuth } from '../utils/AuthContext'

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

const accentColors = [
  { border: 'hover:border-indigo-500/60',  tag: 'bg-indigo-600/20 text-indigo-300 border-indigo-500/25',    read: 'text-indigo-400',  glow: 'hover:shadow-indigo-950/50' },
  { border: 'hover:border-violet-500/60',  tag: 'bg-violet-600/20 text-violet-300 border-violet-500/25',    read: 'text-violet-400',  glow: 'hover:shadow-violet-950/50' },
  { border: 'hover:border-cyan-500/60',    tag: 'bg-cyan-600/20 text-cyan-300 border-cyan-500/25',          read: 'text-cyan-400',    glow: 'hover:shadow-cyan-950/50' },
  { border: 'hover:border-pink-500/60',    tag: 'bg-pink-600/20 text-pink-300 border-pink-500/25',          read: 'text-pink-400',    glow: 'hover:shadow-pink-950/50' },
  { border: 'hover:border-emerald-500/60', tag: 'bg-emerald-600/20 text-emerald-300 border-emerald-500/25', read: 'text-emerald-400', glow: 'hover:shadow-emerald-950/50' },
]

function estimateReadTime(content) {
  if (!content) return 1
  const text = content.replace(/<[^>]*>/g, ' ')
  const words = text.trim().split(/\s+/).filter(Boolean).length
  return Math.max(1, Math.round(words / 200))
}

/* ─── Recommendation Card ────────────────────────────────── */
function RecommendCard({ blog, index }) {
  const ac = accentColors[index % accentColors.length]
  return (
    <Link
      to={`/blogs/${blog._id}`}
      className={`group relative rounded-2xl overflow-hidden border border-white/8 bg-gray-900/60 backdrop-blur ${ac.border} transition-all duration-300 hover:-translate-y-1.5 hover:shadow-xl ${ac.glow} flex flex-col`}
    >
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-white/20 to-transparent z-10" />
      {blog.thumbnail ? (
        <img src={blog.thumbnail} alt={blog.title} className="w-full h-36 object-cover group-hover:scale-105 transition-transform duration-700" />
      ) : (
        <div className="w-full h-36 bg-gradient-to-br from-indigo-950 via-gray-900 to-violet-950 flex items-center justify-center">
          <span className="text-4xl opacity-20">📝</span>
        </div>
      )}
      <div className="p-4 flex flex-col flex-1">
        {blog.tag && <span className={`text-[10px] ${ac.tag} border px-2 py-0.5 rounded-full w-fit mb-2 font-semibold tracking-wide`}>{blog.tag}</span>}
        <h3 className="text-white text-sm font-semibold leading-snug group-hover:text-indigo-200 transition-colors flex-1 mb-2 line-clamp-2">
          {blog.title}
        </h3>
        <div className="flex items-center justify-between text-[11px] text-gray-500 mt-auto pt-2 border-t border-white/5">
          <span>{blog.createdAt ? new Date(blog.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }) : ''}</span>
          <span className={`${ac.read} group-hover:translate-x-1 transition-transform inline-flex items-center gap-1 font-medium`}>
            Read →
          </span>
        </div>
      </div>
    </Link>
  )
}

const SORTS = [
  { id: 'recent',  label: 'Recent', icon: '🕓' },
  { id: 'popular', label: 'Popular', icon: '🔥' },
  { id: 'az',      label: 'A–Z', icon: null },
]

export default function BlogDetail() {
  const { blogId } = useParams()
  const { user } = useAuth()
  const [blog, setBlog] = useState(null)
  const [comments, setComments] = useState([])
  const [commentText, setCommentText] = useState('')
  const [loading, setLoading] = useState(true)
  const [commentLoading, setCommentLoading] = useState(false)
  const [error, setError] = useState('')
  const [commentError, setCommentError] = useState('')
  const [commentSuccess, setCommentSuccess] = useState('')

  // Recommendations
  const [allBlogs, setAllBlogs] = useState([])
  const [recQuery, setRecQuery] = useState('')
  const [recSort, setRecSort] = useState('recent')

  useEffect(() => {
    const fetchBlog = api.get(`/blog/get/${blogId}`)
    const fetchComments = api.get(`/comment/get${blogId}`)

    fetchBlog
      .then(res => setBlog(res.data.blogDetails))
      .catch(() => setError('Blog not found'))
      .finally(() => setLoading(false))

    fetchComments
      .then(res => setComments(res.data.comments || []))
      .catch(() => {}) // fail silently for comments

    api.get('/blog/get-all')
      .then(res => setAllBlogs(res.data.Blogs || []))
      .catch(() => {})

    // reset recommendation filters when navigating between articles
    setRecQuery('')
    setRecSort('recent')
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }, [blogId])

  const submitComment = async (e) => {
    e.preventDefault()
    if (!commentText.trim()) return
    setCommentLoading(true)
    setCommentError('')
    setCommentSuccess('')
    try {
      await api.post('/comment/post', {
        user: { _id: user.userId },
        blogId,
        content: commentText.trim()
      })
      setCommentSuccess('Comment posted!')
      setCommentText('')
      // Refresh comments
      const res = await api.get(`/comment/get${blogId}`)
      setComments(res.data.comments || [])
    } catch (err) {
      setCommentError(err.response?.data?.message || 'Failed to post comment')
    } finally {
      setCommentLoading(false)
    }
  }

  // Recommendations: everything except the current post, filtered + sorted
  const recommendations = useMemo(() => {
    let list = allBlogs.filter(b => b._id !== blogId)

    if (recQuery.trim()) {
      const q = recQuery.trim().toLowerCase()
      list = list.filter(b =>
        b.title?.toLowerCase().includes(q) ||
        b.tag?.toLowerCase().includes(q)
      )
    }

    switch (recSort) {
      case 'popular': list.sort((a, b) => (b.views || 0) - (a.views || 0)); break
      case 'az':      list.sort((a, b) => (a.title || '').localeCompare(b.title || '')); break
      default:        list.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
    }

    return list
  }, [allBlogs, blogId, recQuery, recSort])

  if (loading) return <div className="max-w-3xl mx-auto px-4 py-16 text-center text-gray-400">Loading...</div>
  if (error) return (
    <div className="max-w-3xl mx-auto px-4 py-16 text-center">
      <p className="text-red-400 mb-4">{error}</p>
      <Link to="/blogs" className="text-indigo-400 hover:underline">← Back to Blogs</Link>
    </div>
  )

  return (
    <div className="bg-gray-950 min-h-screen relative overflow-x-hidden">
      <CursorGlow />
      <style>{`
        @keyframes burst {
          0%   { transform: translate(0, 0) scale(1); opacity: 1; }
          100% { transform: translate(var(--dx), var(--dy)) scale(0); opacity: 0; }
        }
      `}</style>

      <Link
        to="/blogs"
        className="group fixed top-20 left-6 z-40 inline-flex items-center gap-2 text-sm text-gray-400 hover:text-indigo-300 font-semibold px-3.5 py-2 rounded-xl border border-white/10 hover:border-indigo-500/40 bg-gray-900/80 hover:bg-indigo-950/40 backdrop-blur transition-all duration-300 hover:-translate-x-0.5 shadow-lg"
      >
        <span className="group-hover:-translate-x-1 transition-transform">←</span> Back to Blogs
      </Link>

      <div className="max-w-3xl mx-auto px-4 pt-28 pb-10">

        {blog?.thumbnail && (
          <img src={blog.thumbnail} alt={blog.title}
            className="w-full h-64 object-cover rounded-xl mb-6 bg-gray-800" />
        )}

        <div className="flex items-center gap-3 mb-3">
          <span className="text-xs bg-indigo-900/60 text-indigo-300 px-2 py-0.5 rounded-full">{blog?.tag}</span>
          {blog?.createdAt && (
            <span className="text-gray-500 text-xs">{new Date(blog.createdAt).toLocaleDateString()}</span>
          )}
          <span className="text-gray-500 text-xs">·</span>
          <span className="text-gray-500 text-xs">{estimateReadTime(blog?.content)} min read</span>
          <span className="text-gray-500 text-xs">·</span>
          <span className="text-gray-500 text-xs">👁 {blog?.views || 0} views</span>
        </div>

        <h1 className="text-3xl font-bold text-white mb-6">{blog?.title}</h1>

        {/* Render HTML content */}
        <div
          className="prose prose-invert prose-indigo max-w-none text-gray-300 leading-relaxed
            [&_h1]:text-white [&_h2]:text-white [&_h3]:text-white
            [&_a]:text-indigo-400 [&_code]:bg-gray-800 [&_code]:px-1 [&_code]:rounded
            [&_pre]:bg-gray-800 [&_pre]:p-4 [&_pre]:rounded-lg [&_pre]:overflow-x-auto"
          dangerouslySetInnerHTML={{ __html: blog?.content || '' }}
        />

        {/* Comments */}
        <div className="mt-12 border-t border-gray-800 pt-8">
          <h2 className="text-xl font-bold text-white mb-6">Comments ({comments.length})</h2>

          {/* Post comment */}
          {user ? (
            <form onSubmit={submitComment} className="mb-8">
              {commentError && <div className="text-red-400 text-sm mb-2">{commentError}</div>}
              {commentSuccess && <div className="text-green-400 text-sm mb-2">{commentSuccess}</div>}
              <textarea
                value={commentText}
                onChange={e => setCommentText(e.target.value)}
                className="input-field resize-none mb-3"
                rows={3}
                placeholder="Write a comment..."
              />
              <button type="submit" disabled={commentLoading || !commentText.trim()} className="btn-primary">
                {commentLoading ? 'Posting...' : 'Post Comment'}
              </button>
            </form>
          ) : (
            <div className="bg-gray-800 rounded-lg px-4 py-3 mb-8 text-sm text-gray-400">
              <Link to="/login" className="text-indigo-400 hover:underline">Login</Link> to post a comment.
            </div>
          )}

          {/* Comments list */}
          {comments.length === 0 ? (
            <p className="text-gray-500 text-sm">No comments yet. Be the first!</p>
          ) : (
            <div className="space-y-4">
              {comments.map(c => (
                <div key={c._id} className="card">
                  <div className="flex items-center gap-2 mb-2">
                    <div className="w-7 h-7 rounded-full bg-indigo-700 flex items-center justify-center text-xs font-bold text-white">
                      {c.userId?.firstName?.[0] || '?'}
                    </div>
                    <span className="text-sm font-medium text-white">
                      {c.userId?.firstName} {c.userId?.lastName}
                    </span>
                    <span className="text-gray-500 text-xs ml-auto">
                      {new Date(c.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                  <p className="text-gray-300 text-sm">{c.content}</p>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* ════ MORE ARTICLES / RECOMMENDATIONS ════ */}
      <div className="border-t border-white/8 mt-4">
        <div className="max-w-6xl mx-auto px-4 py-16">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8">
            <div>
              <div className="flex items-center gap-2 mb-3">
                <div className="w-8 h-px bg-gradient-to-r from-indigo-500 to-violet-500" />
                <p className="text-xs font-bold tracking-[0.25em] uppercase bg-gradient-to-r from-indigo-400 to-violet-400 bg-clip-text text-transparent">
                  Keep reading
                </p>
              </div>
              <h2 className="text-2xl sm:text-3xl font-black text-white">
                More{' '}
                <span className="bg-gradient-to-r from-indigo-400 via-violet-400 to-cyan-400 bg-clip-text text-transparent">
                  Articles
                </span>
              </h2>
            </div>

            {/* Search + Sort */}
            <div className="flex flex-col gap-3 w-full sm:w-auto sm:items-end">
              <div className="relative w-full sm:w-72">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 text-sm">🔍</span>
                <input
                  type="text"
                  value={recQuery}
                  onChange={e => setRecQuery(e.target.value)}
                  placeholder="Search other articles..."
                  className="w-full bg-gray-900/70 border border-white/10 focus:border-indigo-500/60 rounded-xl pl-10 pr-9 py-2.5 text-sm text-white placeholder-gray-500 outline-none backdrop-blur transition-all focus:ring-2 focus:ring-indigo-500/20"
                />
                {recQuery && (
                  <button
                    onClick={() => setRecQuery('')}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-white transition-colors text-xs"
                  >✕</button>
                )}
              </div>

              <div className="flex items-center gap-2">
                <span className="text-[11px] text-gray-500 font-semibold uppercase tracking-wider">Sort:</span>
                {SORTS.map(s => (
                  <button
                    key={s.id}
                    onClick={() => setRecSort(s.id)}
                    className={`text-xs font-bold px-3 py-1.5 rounded-lg transition-all duration-300 flex items-center gap-1 ${
                      recSort === s.id
                        ? 'bg-gradient-to-r from-indigo-600/30 to-violet-600/30 text-indigo-300 border border-indigo-500/40'
                        : 'text-gray-500 hover:text-gray-300 border border-transparent'
                    }`}
                  >
                    {s.icon} {s.label}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {recommendations.length === 0 ? (
            <div className="text-center py-16 text-gray-500 flex flex-col items-center gap-3">
              <span className="text-4xl opacity-20">🔍</span>
              <p>No other articles match your search.</p>
            </div>
          ) : (
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
              {recommendations.slice(0, 8).map((b, i) => <RecommendCard key={b._id} blog={b} index={i} />)}
            </div>
          )}

          {recommendations.length > 8 && (
            <div className="text-center mt-10">
              <Link to="/blogs" className="text-sm text-indigo-400 hover:text-indigo-300 border border-indigo-500/30 hover:border-indigo-400/60 px-5 py-2.5 rounded-xl transition-all font-semibold inline-flex items-center gap-1.5">
                View all articles <span>→</span>
              </Link>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
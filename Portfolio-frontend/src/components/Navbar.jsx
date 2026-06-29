import { Link, useNavigate, useLocation } from 'react-router-dom'
import { useAuth } from '../utils/AuthContext'
import api from '../utils/axios'
import { useState, useEffect } from 'react'

export default function Navbar() {
  const { user, logout } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()
  const [menuOpen, setMenuOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)

  // Only be transparent on the home page
  const isHome = location.pathname === '/'

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40)
    window.addEventListener('scroll', onScroll, { passive: true })
    onScroll()
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  const handleLogout = async () => {
    try { await api.post('/auth/logout') } catch {}
    logout()
    navigate('/login')
  }

  const links = [
    { to: '/', label: 'Home' },
    { to: '/blogs', label: 'Blogs' },
    { to: '/tools', label: 'Tools' },
    { to: '/about', label: 'About' },
  ]
  if (user) {
    links.push({ to: '/tool-request', label: 'Request Tool' })
    links.push({ to: '/dashboard', label: 'Dashboard' })
  }

  const transparent = isHome && !scrolled

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
        transparent
          ? 'bg-transparent border-transparent'
          : 'bg-gray-950/90 backdrop-blur-md border-b border-gray-800/60 shadow-lg shadow-black/20'
      }`}
    >
      <div className="max-w-6xl mx-auto px-4 flex items-center justify-between h-16">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-2 group">
          <div className="w-8 h-8 rounded-lg bg-indigo-600 flex items-center justify-center text-white font-bold text-sm shadow-lg shadow-indigo-900/50 group-hover:scale-105 transition-transform">
            D
          </div>
          <span className="text-white font-bold text-lg tracking-tight">
            Digifello<span className="text-indigo-400"> AI</span>
          </span>
        </Link>

        {/* Desktop links */}
        <div className="hidden md:flex items-center gap-1">
          {links.map(l => (
            <Link
              key={l.to}
              to={l.to}
              className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-all duration-200 ${
                location.pathname === l.to
                  ? 'text-indigo-400 bg-indigo-950/60'
                  : 'text-gray-300 hover:text-white hover:bg-white/5'
              }`}
            >
              {l.label}
            </Link>
          ))}
        </div>

        {/* Auth buttons */}
        <div className="hidden md:flex items-center gap-2">
          {user ? (
            <button
              onClick={handleLogout}
              className="text-sm px-4 py-1.5 rounded-lg bg-gray-800 hover:bg-gray-700 text-gray-300 hover:text-white border border-gray-700 transition-all"
            >
              Logout
            </button>
          ) : (
            <>
              <Link to="/login" className="text-sm px-4 py-1.5 rounded-lg text-gray-300 hover:text-white hover:bg-white/5 transition-all">
                Login
              </Link>
              <Link to="/register" className="text-sm px-4 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white font-medium shadow-lg shadow-indigo-900/30 transition-all">
                Get Started
              </Link>
            </>
          )}
        </div>

        {/* Mobile toggle */}
        <button
          className="md:hidden w-9 h-9 flex items-center justify-center rounded-lg text-gray-300 hover:bg-white/10 transition-colors"
          onClick={() => setMenuOpen(!menuOpen)}
        >
          {menuOpen ? (
            <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
              <path strokeLinecap="round" d="M6 6l12 12M6 18L18 6"/>
            </svg>
          ) : (
            <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
              <path strokeLinecap="round" d="M4 6h16M4 12h16M4 18h16"/>
            </svg>
          )}
        </button>
      </div>

      {/* Mobile menu */}
      <div className={`md:hidden transition-all duration-300 overflow-hidden ${menuOpen ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'}`}>
        <div className="bg-gray-950/95 backdrop-blur-md border-t border-gray-800/60 px-4 py-4 flex flex-col gap-1">
          {links.map(l => (
            <Link
              key={l.to}
              to={l.to}
              className="px-3 py-2 rounded-lg text-sm text-gray-300 hover:text-white hover:bg-white/5 transition-colors"
              onClick={() => setMenuOpen(false)}
            >
              {l.label}
            </Link>
          ))}
          <div className="border-t border-gray-800 mt-2 pt-3 flex gap-2">
            {user ? (
              <button onClick={handleLogout} className="text-sm px-4 py-2 rounded-lg bg-gray-800 text-gray-300 w-full">Logout</button>
            ) : (
              <>
                <Link to="/login" onClick={() => setMenuOpen(false)} className="flex-1 text-center text-sm py-2 rounded-lg bg-gray-800 text-gray-300">Login</Link>
                <Link to="/register" onClick={() => setMenuOpen(false)} className="flex-1 text-center text-sm py-2 rounded-lg bg-indigo-600 text-white">Get Started</Link>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  )
}
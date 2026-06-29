import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../utils/AuthContext'
import api from '../utils/axios'
import { useState } from 'react'

export default function Navbar() {
  const { user, logout } = useAuth()
  const navigate = useNavigate()
  const [menuOpen, setMenuOpen] = useState(false)

  const handleLogout = async () => {
    try {
      await api.post('/auth/logout')
    } catch (err) {console.log(err)}
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

  return (
    <nav className="bg-gray-900 border-b border-gray-800 sticky top-0 z-50">
      <div className="max-w-6xl mx-auto px-4 flex items-center justify-between h-14">
        <Link to="/" className="text-indigo-400 font-bold text-lg tracking-tight">
          Digifello<span className="text-white"> AI</span>
        </Link>

        {/* Desktop */}
        <div className="hidden md:flex items-center gap-6">
          {links.map(l => (
            <Link key={l.to} to={l.to} className="text-gray-300 hover:text-white text-sm transition-colors">
              {l.label}
            </Link>
          ))}
          {user ? (
            <button onClick={handleLogout} className="btn-secondary text-sm py-1 px-3">
              Logout
            </button>
          ) : (
            <div className="flex gap-2">
              <Link to="/login" className="btn-secondary text-sm py-1 px-3">Login</Link>
              <Link to="/register" className="btn-primary text-sm py-1 px-3">Register</Link>
            </div>
          )}
        </div>

        {/* Mobile toggle */}
        <button className="md:hidden text-gray-300" onClick={() => setMenuOpen(!menuOpen)}>
          {menuOpen ? '✕' : '☰'}
        </button>
      </div>

      {/* Mobile menu */}
      {menuOpen && (
        <div className="md:hidden bg-gray-900 border-t border-gray-800 px-4 pb-4 flex flex-col gap-3">
          {links.map(l => (
            <Link key={l.to} to={l.to} className="text-gray-300 hover:text-white text-sm py-1"
              onClick={() => setMenuOpen(false)}>
              {l.label}
            </Link>
          ))}
          {user ? (
            <button onClick={handleLogout} className="btn-secondary text-sm py-1 px-3 w-fit">Logout</button>
          ) : (
            <div className="flex gap-2">
              <Link to="/login" className="btn-secondary text-sm py-1 px-3" onClick={() => setMenuOpen(false)}>Login</Link>
              <Link to="/register" className="btn-primary text-sm py-1 px-3" onClick={() => setMenuOpen(false)}>Register</Link>
            </div>
          )}
        </div>
      )}
    </nav>
  )
}

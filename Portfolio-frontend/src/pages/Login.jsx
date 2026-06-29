import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import api from '../utils/axios'
import { useAuth } from '../utils/AuthContext'

export default function Login() {
  const navigate = useNavigate()
  const { login } = useAuth()
  const [form, setForm] = useState({ email: '', password: '' })
  const [errors, setErrors] = useState({})
  const [globalError, setGlobalError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleChange = (e) => {
    setForm(prev => ({ ...prev, [e.target.name]: e.target.value }))
    setErrors(prev => ({ ...prev, [e.target.name]: '' }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setErrors({})
    setGlobalError('')
    try {
      const res = await api.post('/auth/login', form)
      if (res.data.success) {
        login(res.data.userId, res.data.token)
        navigate('/')
      }
    } catch (err) {
      const data = err.response?.data
      const status = err.response?.status
      // Email not verified
      if (status === 403) {
        navigate('/verify-otp')
        return
      }
      if (data?.errors) {
        const mapped = {}
        data.errors.forEach(e => { mapped[e.field] = e.message })
        setErrors(mapped)
      } else {
        setGlobalError(data?.message || 'Login failed')
      }
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        <div className="card">
          <h2 className="text-2xl font-bold text-white mb-6 text-center">Login</h2>

          {globalError && <div className="bg-red-900/40 border border-red-700 text-red-300 rounded-lg px-3 py-2 mb-4 text-sm">{globalError}</div>}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="text-sm text-gray-400 block mb-1">Email</label>
              <input name="email" type="email" value={form.email} onChange={handleChange}
                className="input-field" placeholder="john@example.com" />
              {errors.email && <p className="error-text">{errors.email}</p>}
            </div>
            <div>
              <label className="text-sm text-gray-400 block mb-1">Password</label>
              <input name="password" type="password" value={form.password} onChange={handleChange}
                className="input-field" placeholder="••••••••" />
              {errors.password && <p className="error-text">{errors.password}</p>}
            </div>

            <div className="text-right">
              <Link to="/forgot-password" className="text-indigo-400 text-sm hover:underline">Forgot password?</Link>
            </div>

            <button type="submit" disabled={loading} className="btn-primary w-full">
              {loading ? 'Logging in...' : 'Login'}
            </button>
          </form>

          <p className="text-center text-sm text-gray-500 mt-4">
            Don't have an account?{' '}
            <Link to="/register" className="text-indigo-400 hover:underline">Register</Link>
          </p>
        </div>
      </div>
    </div>
  )
}

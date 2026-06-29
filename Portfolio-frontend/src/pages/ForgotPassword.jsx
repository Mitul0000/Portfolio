import { useState } from 'react'
import { Link } from 'react-router-dom'
import api from '../utils/axios'

export default function ForgotPassword() {
  const [email, setEmail] = useState('')
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState('')
  const [error, setError] = useState('')

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setMessage('')
    setError('')
    try {
      const res = await api.post('/auth/forgot-password', { email })
      setMessage(res.data.message || 'Reset link sent to your email.')
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to send reset email.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        <div className="card">
          <h2 className="text-2xl font-bold text-white mb-2 text-center">Forgot Password</h2>
          <p className="text-gray-400 text-sm text-center mb-6">Enter your email to receive a password reset link.</p>

          {message && <div className="bg-green-900/40 border border-green-700 text-green-300 rounded-lg px-3 py-2 mb-4 text-sm">{message}</div>}
          {error && <div className="bg-red-900/40 border border-red-700 text-red-300 rounded-lg px-3 py-2 mb-4 text-sm">{error}</div>}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="text-sm text-gray-400 block mb-1">Email</label>
              <input type="email" value={email} onChange={e => setEmail(e.target.value)}
                className="input-field" placeholder="john@example.com" required />
            </div>
            <button type="submit" disabled={loading} className="btn-primary w-full">
              {loading ? 'Sending...' : 'Send Reset Link'}
            </button>
          </form>

          <p className="text-center text-sm text-gray-500 mt-4">
            <Link to="/login" className="text-indigo-400 hover:underline">Back to Login</Link>
          </p>
        </div>
      </div>
    </div>
  )
}

import { useState } from 'react'
import { useParams, useNavigate, Link } from 'react-router-dom'
import api from '../utils/axios'

export default function ResetPassword() {
  const { id, token } = useParams()
  const navigate = useNavigate()
  const [form, setForm] = useState({ New_password: '', Confirm_password: '' })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState(false)

  const handleChange = (e) => {
    setForm(prev => ({ ...prev, [e.target.name]: e.target.value }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (form.New_password !== form.Confirm_password) {
      return setError('Passwords do not match')
    }
    setLoading(true)
    setError('')
    try {
      await api.post(`/auth/reset-password/${id}/${token}`, {
        New_password: form.New_password,
        Confirm_password: form.Confirm_password
      })
      setSuccess(true)
      setTimeout(() => navigate('/login'), 2000)
    } catch (err) {
      setError(err.response?.data?.message || 'Something went wrong')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        <div className="card">
          <h2 className="text-2xl font-bold text-white mb-2 text-center">Reset Password</h2>
          <p className="text-gray-400 text-sm text-center mb-6">Enter your new password below.</p>

          {success && (
            <div className="bg-green-900/40 border border-green-700 text-green-300 rounded-lg px-3 py-2 mb-4 text-sm">
              ✅ Password reset successfully! Redirecting to login...
            </div>
          )}
          {error && (
            <div className="bg-red-900/40 border border-red-700 text-red-300 rounded-lg px-3 py-2 mb-4 text-sm">
              {error}
            </div>
          )}

          {!id || !token ? (
            <div className="text-center text-red-400 text-sm">
              Invalid reset link. Please request a new one.
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="text-sm text-gray-400 block mb-1">New Password</label>
                <input
                  name="New_password"
                  type="password"
                  value={form.New_password}
                  onChange={handleChange}
                  className="input-field"
                  placeholder="••••••••"
                  required
                />
              </div>
              <div>
                <label className="text-sm text-gray-400 block mb-1">Confirm Password</label>
                <input
                  name="Confirm_password"
                  type="password"
                  value={form.Confirm_password}
                  onChange={handleChange}
                  className="input-field"
                  placeholder="••••••••"
                  required
                />
              </div>
              <button type="submit" disabled={loading || success} className="btn-primary w-full">
                {loading ? 'Resetting...' : 'Reset Password'}
              </button>
            </form>
          )}

          <p className="text-center text-sm text-gray-500 mt-4">
            <Link to="/login" className="text-indigo-400 hover:underline">Back to Login</Link>
          </p>
        </div>
      </div>
    </div>
  )
}
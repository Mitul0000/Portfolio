import { useState } from 'react'
import { useLocation, useNavigate, Link } from 'react-router-dom'
import api from '../utils/axios'

export default function VerifyOtp() {
  const location = useLocation()
  const navigate = useNavigate()
  const [userId] = useState(location.state?.userId || '')
  const [otp, setOtp] = useState('')
  const [loading, setLoading] = useState(false)
  const [sendLoading, setSendLoading] = useState(false)
  const [message, setMessage] = useState('')
  const [error, setError] = useState('')

  const sendOtp = async () => {
    if (!userId) return setError('User ID missing. Please register again.')
    setSendLoading(true)
    setMessage('')
    setError('')
    try {
      const res = await api.post('/auth/generate-otp', { userId })
      setMessage(res.data.message || 'OTP sent to your email!')
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to send OTP')
    } finally {
      setSendLoading(false)
    }
  }

  const handleVerify = async (e) => {
    e.preventDefault()
    if (otp.length !== 6) return setError('Enter the 6-digit OTP')
    setLoading(true)
    setError('')
    try {
      const res = await api.post('/auth/verify-otp', { userId, otpReceiver: otp })
      if (res.data.success) {
        setMessage('Email verified! Redirecting to login...')
        setTimeout(() => navigate('/login'), 1500)
      }
    } catch (err) {
      setError(err.response?.data?.message || 'OTP verification failed')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        <div className="card">
          <h2 className="text-2xl font-bold text-white mb-2 text-center">Verify Email</h2>
          <p className="text-gray-400 text-sm text-center mb-6">
            Click "Send OTP" to receive a 6-digit code in your email.
          </p>

          {!userId && (
            <div className="bg-yellow-900/40 border border-yellow-700 text-yellow-300 rounded-lg px-3 py-2 mb-4 text-sm">
              No user ID found. Please <Link to="/register" className="underline">register</Link> first.
            </div>
          )}

          {message && <div className="bg-green-900/40 border border-green-700 text-green-300 rounded-lg px-3 py-2 mb-4 text-sm">{message}</div>}
          {error && <div className="bg-red-900/40 border border-red-700 text-red-300 rounded-lg px-3 py-2 mb-4 text-sm">{error}</div>}

          <div className="mb-4">
            <label className="text-sm text-gray-400 block mb-1">User ID</label>
            <input value={userId} readOnly className="input-field opacity-60 cursor-not-allowed" />
          </div>

          <button onClick={sendOtp} disabled={sendLoading || userId} className="btn-secondary w-full mb-5">
            {sendLoading ? 'Sending...' : 'Send OTP to Email'}
          </button>

          <form onSubmit={handleVerify} className="space-y-4">
            <div>
              <label className="text-sm text-gray-400 block mb-1">Enter 6-digit OTP</label>
              <input
                value={otp}
                onChange={e => setOtp(e.target.value.replace(/\D/g, '').slice(0, 6))}
                className="input-field text-center text-xl tracking-widest"
                placeholder="123456"
                maxLength={6}
              />
            </div>
            <button type="submit" disabled={loading || otp.length !== 6} className="btn-primary w-full">
              {loading ? 'Verifying...' : 'Verify OTP'}
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

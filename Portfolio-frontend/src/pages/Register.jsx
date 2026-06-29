import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import api from '../utils/axios'

export default function Register() {
  const navigate = useNavigate()
  const [form, setForm] = useState({
    firstName: '', lastName: '', email: '', password: '', confirmPassword: '', terms: false
  })
  const [errors, setErrors] = useState({})
  const [loading, setLoading] = useState(false)
  const [globalError, setGlobalError] = useState('')

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target
    setForm(prev => ({ ...prev, [name]: type === 'checkbox' ? checked : value }))
    setErrors(prev => ({ ...prev, [name]: '' }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setErrors({})
    setGlobalError('')
    try {
      const res = await api.post('/auth/register', {
        ...form,
        terms: form.terms === true // ensure boolean
      })
      if (res.data.success) {
        navigate('/verify-otp', { state: { userId: res.data.userId } })
      }
    } catch (err) {
      const data = err.response?.data
      if (data?.errors) {
        const mapped = {}
        data.errors.forEach(e => { mapped[e.field] = e.message })
        setErrors(mapped)
      } else {
        setGlobalError(data?.message || 'Registration failed')
      }
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-md">
        <div className="card">
          <h2 className="text-2xl font-bold text-white mb-6 text-center">Create Account</h2>

          {globalError && <div className="bg-red-900/40 border border-red-700 text-red-300 rounded-lg px-3 py-2 mb-4 text-sm">{globalError}</div>}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-sm text-gray-400 block mb-1">First Name</label>
                <input name="firstName" value={form.firstName} onChange={handleChange}
                  className="input-field" placeholder="John" />
                {errors.firstName && <p className="error-text">{errors.firstName}</p>}
              </div>
              <div>
                <label className="text-sm text-gray-400 block mb-1">Last Name</label>
                <input name="lastName" value={form.lastName} onChange={handleChange}
                  className="input-field" placeholder="Doe" />
                {errors.lastName && <p className="error-text">{errors.lastName}</p>}
              </div>
            </div>

            <div>
              <label className="text-sm text-gray-400 block mb-1">Email</label>
              <input name="email" type="email" value={form.email} onChange={handleChange}
                className="input-field" placeholder="john@example.com" />
              {errors.email && <p className="error-text">{errors.email}</p>}
            </div>

            <div>
              <label className="text-sm text-gray-400 block mb-1">Password</label>
              <input name="password" type="password" value={form.password} onChange={handleChange}
                className="input-field" placeholder="Test@1234" />
              {errors.password && <p className="error-text">{errors.password}</p>}
            </div>

            <div>
              <label className="text-sm text-gray-400 block mb-1">Confirm Password</label>
              <input name="confirmPassword" type="password" value={form.confirmPassword} onChange={handleChange}
                className="input-field" placeholder="Test@1234" />
              {errors.confirmPassword && <p className="error-text">{errors.confirmPassword}</p>}
            </div>

            <div className="flex items-center gap-2">
              <input name="terms" type="checkbox" checked={form.terms} onChange={handleChange}
                className="w-4 h-4 accent-indigo-500" id="terms" />
              <label htmlFor="terms" className="text-sm text-gray-400">
                I agree to the Terms &amp; Conditions
              </label>
            </div>
            {errors.terms && <p className="error-text">{errors.terms}</p>}

            <button type="submit" disabled={loading} className="btn-primary w-full mt-2">
              {loading ? 'Registering...' : 'Create Account'}
            </button>
          </form>

          <p className="text-center text-sm text-gray-500 mt-4">
            Already have an account?{' '}
            <Link to="/login" className="text-indigo-400 hover:underline">Login</Link>
          </p>
        </div>
      </div>
    </div>
  )
}

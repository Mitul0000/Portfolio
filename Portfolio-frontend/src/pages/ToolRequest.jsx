import { useState } from 'react'
import api from '../utils/axios'
import { useAuth } from '../utils/AuthContext'

export default function ToolRequest() {
  const { user } = useAuth()
  const [form, setForm] = useState({ name: '', email: '', toolDescription: '', budget: '' })
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)
  const [error, setError] = useState('')

  const handleChange = (e) => {
    setForm(prev => ({ ...prev, [e.target.name]: e.target.value }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    setSuccess(false)
    try {
      await api.post('/request/tool-request', {
        user: { _id: user.userId },
        name: form.name,
        email: form.email,
        toolDescription: form.toolDescription,
        budget: Number(form.budget) // must be number
      })
      setSuccess(true)
      setForm({ name: '', email: '', toolDescription: '', budget: '' })
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to submit request')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="max-w-2xl mx-auto px-4 py-10">
      <h1 className="text-3xl font-bold text-white mb-2">Request a Tool</h1>
      <p className="text-gray-400 mb-8">Describe the tool you need and your budget. I'll get back to you.</p>

      {success && (
        <div className="bg-green-900/40 border border-green-700 text-green-300 rounded-lg px-4 py-3 mb-6">
          ✅ Your request has been submitted! Check your dashboard for updates.
        </div>
      )}
      {error && (
        <div className="bg-red-900/40 border border-red-700 text-red-300 rounded-lg px-4 py-3 mb-6">
          {error}
        </div>
      )}

      <div className="card">
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="text-sm text-gray-400 block mb-1">Your Name</label>
            <input name="name" value={form.name} onChange={handleChange}
              className="input-field" placeholder="John Doe" required />
          </div>
          <div>
            <label className="text-sm text-gray-400 block mb-1">Email</label>
            <input name="email" type="email" value={form.email} onChange={handleChange}
              className="input-field" placeholder="john@example.com" required />
          </div>
          <div>
            <label className="text-sm text-gray-400 block mb-1">Tool Description</label>
            <textarea name="toolDescription" value={form.toolDescription} onChange={handleChange}
              className="input-field resize-none" rows={4}
              placeholder="Describe what the tool should do in detail..." required />
          </div>
          <div>
            <label className="text-sm text-gray-400 block mb-1">Budget (number)</label>
            <input name="budget" type="number" min="0" value={form.budget} onChange={handleChange}
              className="input-field" placeholder="500" required />
          </div>
          <button type="submit" disabled={loading} className="btn-primary w-full">
            {loading ? 'Submitting...' : 'Submit Request'}
          </button>
        </form>
      </div>
    </div>
  )
}

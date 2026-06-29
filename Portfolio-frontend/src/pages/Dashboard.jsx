import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import api from '../utils/axios'
import { useAuth } from '../utils/AuthContext'

const statusStyles = {
  PENDING: 'bg-yellow-900/50 text-yellow-300 border-yellow-700',
  APPROVED: 'bg-green-900/50 text-green-300 border-green-700',
  REJECTED: 'bg-red-900/50 text-red-300 border-red-700'
}

export default function Dashboard() {
  const { user } = useAuth()
  const [requests, setRequests] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    api.get('/request/get-requests', {
      data: { user: { _id: user.userId } }
    })
      .then(res => setRequests(res.data.requests || []))
      .catch(() => setError('Failed to load your requests'))
      .finally(() => setLoading(false))
  }, [user.userId])

  if (loading) return <div className="max-w-4xl mx-auto px-4 py-16 text-center text-gray-400">Loading your requests...</div>

  return (
    <div className="max-w-4xl mx-auto px-4 py-10">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-white">My Dashboard</h1>
          <p className="text-gray-400 mt-1">Your tool requests and their status.</p>
        </div>
        <Link to="/tool-request" className="btn-primary text-sm">+ New Request</Link>
      </div>

      {error && <div className="text-red-400 mb-6">{error}</div>}

      {requests.length === 0 && !error ? (
        <div className="card text-center py-16">
          <p className="text-gray-400 mb-4">You haven't made any tool requests yet.</p>
          <Link to="/tool-request" className="btn-primary inline-block">Request a Tool</Link>
        </div>
      ) : (
        <div className="space-y-4">
          {requests.map(req => (
            <div key={req._id} className="card">
              <div className="flex items-start justify-between gap-4 flex-wrap">
                <div className="flex-1 min-w-0">
                  <p className="text-white font-medium mb-1 truncate">{req.toolDescription}</p>
                  <div className="flex items-center gap-3 text-sm text-gray-400 flex-wrap">
                    <span>{req.name}</span>
                    <span>·</span>
                    <span>{req.email}</span>
                    <span>·</span>
                    <span>Budget: <span className="text-white">{req.budget}</span></span>
                    {req.createdAt && (
                      <>
                        <span>·</span>
                        <span>{new Date(req.createdAt).toLocaleDateString()}</span>
                      </>
                    )}
                  </div>
                </div>
                <span className={`text-xs px-2.5 py-1 rounded-full border font-medium whitespace-nowrap ${statusStyles[req.status] || statusStyles.PENDING}`}>
                  {req.status || 'PENDING'}
                </span>
              </div>

              {req.adminMessage && req.adminMessage !== 'No comment' && (
                <div className="mt-3 bg-gray-800 rounded-lg px-3 py-2 text-sm text-gray-300">
                  <span className="text-gray-500 text-xs block mb-1">Admin Note</span>
                  {req.adminMessage}
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

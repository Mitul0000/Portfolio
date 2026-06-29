import { useEffect, useState } from 'react'
import api from '../utils/axios'

function ToolCard({ tool }) {
  return (
    <div className="card flex flex-col">
      {tool.thumbnail && (
        <img src={tool.thumbnail} alt={tool.name}
          className="w-full h-40 object-cover rounded-lg mb-4 bg-gray-800" />
      )}
      <div className="flex items-center gap-2 mb-2">
        <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${
          tool.type === 'FREE'
            ? 'bg-green-900/50 text-green-300'
            : 'bg-purple-900/50 text-purple-300'
        }`}>
          {tool.type}
        </span>
        {tool.tag && (
          <span className="text-xs bg-gray-700 text-gray-300 px-2 py-0.5 rounded-full">{tool.tag}</span>
        )}
      </div>
      <h3 className="text-white font-semibold mb-1">{tool.name}</h3>
      <p className="text-gray-400 text-sm flex-1 mb-4">{tool.shortDescription}</p>
      {tool.link && (
        <a href={tool.link} target="_blank" rel="noopener noreferrer"
          className="btn-primary text-sm text-center">
          Open Tool →
        </a>
      )}
    </div>
  )
}

export default function Tools() {
  const [freeTools, setFreeTools] = useState([])
  const [paidTools, setPaidTools] = useState([])
  const [tab, setTab] = useState('free')
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    setLoading(true)
    Promise.all([
      api.get('/tools/free-tools').then(r => setFreeTools(r.data.freeTools || [])).catch(() => {}),
      api.get('/tools/paid-tools').then(r => setPaidTools(r.data.paidTools || [])).catch(() => {})
    ]).catch(() => setError('Failed to load tools'))
      .finally(() => setLoading(false))
  }, [])

  const displayed = tab === 'free' ? freeTools : paidTools

  if (loading) return <div className="max-w-6xl mx-auto px-4 py-16 text-center text-gray-400">Loading tools...</div>

  return (
    <div className="max-w-6xl mx-auto px-4 py-10">
      <h1 className="text-3xl font-bold text-white mb-2">Tools</h1>
      <p className="text-gray-400 mb-6">Discover free and paid tools to boost your productivity.</p>

      {/* Tabs */}
      <div className="flex gap-2 mb-8">
        <button
          onClick={() => setTab('free')}
          className={`px-5 py-2 rounded-lg font-medium text-sm transition-colors ${
            tab === 'free'
              ? 'bg-indigo-600 text-white'
              : 'bg-gray-800 text-gray-400 hover:text-white'
          }`}>
          Free Tools ({freeTools.length})
        </button>
        <button
          onClick={() => setTab('paid')}
          className={`px-5 py-2 rounded-lg font-medium text-sm transition-colors ${
            tab === 'paid'
              ? 'bg-indigo-600 text-white'
              : 'bg-gray-800 text-gray-400 hover:text-white'
          }`}>
          Paid Tools ({paidTools.length})
        </button>
      </div>

      {error && <div className="text-red-400 mb-4">{error}</div>}

      {displayed.length === 0 ? (
        <div className="text-center text-gray-500 py-20">No {tab} tools found yet.</div>
      ) : (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {displayed.map(tool => <ToolCard key={tool._id} tool={tool} />)}
        </div>
      )}
    </div>
  )
}

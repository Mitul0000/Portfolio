import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import api from '../utils/axios'

export default function Blogs() {
  const [blogs, setBlogs] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    api.get('/blog/get-all')
      .then(res => setBlogs(res.data.Blogs || []))
      .catch(err => {
        if (err.response?.status === 404) setBlogs([])
        else setError('Failed to load blogs')
      })
      .finally(() => setLoading(false))
  }, [])

  if (loading) return (
    <div className="max-w-6xl mx-auto px-4 py-16 text-center text-gray-400">Loading blogs...</div>
  )

  return (
    <div className="max-w-6xl mx-auto px-4 py-10">
      <h1 className="text-3xl font-bold text-white mb-2">Blogs</h1>
      <p className="text-gray-400 mb-8">Articles, tutorials and thoughts.</p>

      {error && <div className="text-red-400 mb-6">{error}</div>}

      {blogs.length === 0 && !error ? (
        <div className="text-center text-gray-500 py-20">No blogs found yet.</div>
      ) : (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {blogs.map((blog, i) => (
          
            <Link key={i} to={`/blogs/${blog._id || i}`}
              className="card hover:border-indigo-700 transition-colors group block">
              {blog.thumbnail && (
                <img src={blog.thumbnail} alt={blog.title}
                  className="w-full h-44 object-cover rounded-lg mb-4 bg-gray-800" />
              )}
              <div className="flex items-center gap-2 mb-2">
                <span className="text-xs bg-indigo-900/60 text-indigo-300 px-2 py-0.5 rounded-full">
                  {blog.tag || 'general'}
                </span>
              </div>
              <h3 className="text-white font-semibold group-hover:text-indigo-300 transition-colors leading-snug">
                {blog.title}
              </h3>
            </Link>
          ))}
        </div>
      )}
    </div>
  )
}

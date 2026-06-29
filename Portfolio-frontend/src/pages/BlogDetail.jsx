import { useEffect, useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import api from '../utils/axios'
import { useAuth } from '../utils/AuthContext'

export default function BlogDetail() {
  const { blogId } = useParams()
  const { user } = useAuth()
  const [blog, setBlog] = useState(null)
  const [comments, setComments] = useState([])
  const [commentText, setCommentText] = useState('')
  const [loading, setLoading] = useState(true)
  const [commentLoading, setCommentLoading] = useState(false)
  const [error, setError] = useState('')
  const [commentError, setCommentError] = useState('')
  const [commentSuccess, setCommentSuccess] = useState('')

  useEffect(() => {
    const fetchBlog = api.get(`/blog/get/${blogId}`)
    const fetchComments = api.get(`/comment/get${blogId}`)

    fetchBlog
      .then(res => setBlog(res.data.blogDetails))
      .catch(() => setError('Blog not found'))
      .finally(() => setLoading(false))

    fetchComments
      .then(res => setComments(res.data.comments || []))
      .catch(() => {}) // fail silently for comments
  }, [blogId])

  const submitComment = async (e) => {
    e.preventDefault()
    if (!commentText.trim()) return
    setCommentLoading(true)
    setCommentError('')
    setCommentSuccess('')
    try {
      await api.post('/comment/post', {
        user: { _id: user.userId },
        blogId,
        content: commentText.trim()
      })
      setCommentSuccess('Comment posted!')
      setCommentText('')
      // Refresh comments
      const res = await api.get(`/comment/get${blogId}`)
      setComments(res.data.comments || [])
    } catch (err) {
      setCommentError(err.response?.data?.message || 'Failed to post comment')
    } finally {
      setCommentLoading(false)
    }
  }

  if (loading) return <div className="max-w-3xl mx-auto px-4 py-16 text-center text-gray-400">Loading...</div>
  if (error) return (
    <div className="max-w-3xl mx-auto px-4 py-16 text-center">
      <p className="text-red-400 mb-4">{error}</p>
      <Link to="/blogs" className="text-indigo-400 hover:underline">← Back to Blogs</Link>
    </div>
  )

  return (
    <div className="max-w-3xl mx-auto px-4 py-10">
      <Link to="/blogs" className="text-indigo-400 text-sm hover:underline mb-6 inline-block">← All Blogs</Link>

      {blog?.thumbnail && (
        <img src={blog.thumbnail} alt={blog.title}
          className="w-full h-64 object-cover rounded-xl mb-6 bg-gray-800" />
      )}

      <div className="flex items-center gap-3 mb-3">
        <span className="text-xs bg-indigo-900/60 text-indigo-300 px-2 py-0.5 rounded-full">{blog?.tag}</span>
        {blog?.createdAt && (
          <span className="text-gray-500 text-xs">{new Date(blog.createdAt).toLocaleDateString()}</span>
        )}
      </div>

      <h1 className="text-3xl font-bold text-white mb-6">{blog?.title}</h1>

      {/* Render HTML content */}
      <div
        className="prose prose-invert prose-indigo max-w-none text-gray-300 leading-relaxed
          [&_h1]:text-white [&_h2]:text-white [&_h3]:text-white
          [&_a]:text-indigo-400 [&_code]:bg-gray-800 [&_code]:px-1 [&_code]:rounded
          [&_pre]:bg-gray-800 [&_pre]:p-4 [&_pre]:rounded-lg [&_pre]:overflow-x-auto"
        dangerouslySetInnerHTML={{ __html: blog?.content || '' }}
      />

      {/* Comments */}
      <div className="mt-12 border-t border-gray-800 pt-8">
        <h2 className="text-xl font-bold text-white mb-6">Comments ({comments.length})</h2>

        {/* Post comment */}
        {user ? (
          <form onSubmit={submitComment} className="mb-8">
            {commentError && <div className="text-red-400 text-sm mb-2">{commentError}</div>}
            {commentSuccess && <div className="text-green-400 text-sm mb-2">{commentSuccess}</div>}
            <textarea
              value={commentText}
              onChange={e => setCommentText(e.target.value)}
              className="input-field resize-none mb-3"
              rows={3}
              placeholder="Write a comment..."
            />
            <button type="submit" disabled={commentLoading || !commentText.trim()} className="btn-primary">
              {commentLoading ? 'Posting...' : 'Post Comment'}
            </button>
          </form>
        ) : (
          <div className="bg-gray-800 rounded-lg px-4 py-3 mb-8 text-sm text-gray-400">
            <Link to="/login" className="text-indigo-400 hover:underline">Login</Link> to post a comment.
          </div>
        )}

        {/* Comments list */}
        {comments.length === 0 ? (
          <p className="text-gray-500 text-sm">No comments yet. Be the first!</p>
        ) : (
          <div className="space-y-4">
            {comments.map(c => (
              <div key={c._id} className="card">
                <div className="flex items-center gap-2 mb-2">
                  <div className="w-7 h-7 rounded-full bg-indigo-700 flex items-center justify-center text-xs font-bold text-white">
                    {c.userId?.firstName?.[0] || '?'}
                  </div>
                  <span className="text-sm font-medium text-white">
                    {c.userId?.firstName} {c.userId?.lastName}
                  </span>
                  <span className="text-gray-500 text-xs ml-auto">
                    {new Date(c.createdAt).toLocaleDateString()}
                  </span>
                </div>
                <p className="text-gray-300 text-sm">{c.content}</p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

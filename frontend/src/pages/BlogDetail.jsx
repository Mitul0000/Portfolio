import React, { useState, useEffect, useRef } from 'react';
import { useParams, Link } from 'react-router-dom';
import api from '../utils/axios';
import { useAuth } from '../utils/AuthContext';
import { usePageTitle } from '../utils/pageUtils';
import { Spinner, ErrorState, Button } from '../components/UI';
import { ArrowLeft, Eye, Calendar, MessageSquare, Send, BookOpen } from 'lucide-react';

export default function BlogDetail() {
  const { blogId } = useParams();
  const { user } = useAuth();

  const [blog, setBlog] = useState(null);
  const [comments, setComments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Comment form state
  const [commentContent, setCommentContent] = useState('');
  const [submittingComment, setSubmittingComment] = useState(false);
  const [commentError, setCommentError] = useState('');

  // Guard against React StrictMode double effect fetch causing double views
  const hasFetchedRef = useRef(false);

  usePageTitle(blog?.title || 'Article');

  useEffect(() => {
    // Only call once per blogId
    if (hasFetchedRef.current === blogId) return;
    hasFetchedRef.current = blogId;

    setLoading(true);
    setError('');

    Promise.all([
      api.get(`/blog/get/${blogId}`),
      api.get(`/comment/get/${blogId}`), // with required slash
    ])
      .then(([blogRes, commentRes]) => {
        setBlog(blogRes.data?.blogDetails || null);
        setComments(commentRes.data?.comments || []);
      })
      .catch((err) => {
        setError('Article not found or unavailable.');
      })
      .finally(() => {
        setLoading(false);
      });
  }, [blogId]);

  const handleCommentSubmit = async (e) => {
    e.preventDefault();
    if (!commentContent.trim() || submittingComment) return;

    setSubmittingComment(true);
    setCommentError('');

    try {
      await api.post('/comment/post', {
        blogId,
        content: commentContent.trim(),
      });
      setCommentContent('');

      // Refresh comments list
      const res = await api.get(`/comment/get/${blogId}`);
      setComments(res.data?.comments || []);
    } catch (err) {
      setCommentError(
        err.response?.data?.message || 'Failed to post comment. Please try again.'
      );
    } finally {
      setSubmittingComment(false);
    }
  };

  if (loading) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-24 text-center">
        <Spinner size="lg" />
        <p className="text-xs text-muted mt-3">Loading article...</p>
      </div>
    );
  }

  if (error || !blog) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-20">
        <ErrorState
          title="Article Unavailable"
          message={error || 'The requested article could not be located.'}
          onRetry={() => {
            hasFetchedRef.current = false;
            window.location.reload();
          }}
        />
        <div className="text-center mt-6">
          <Link
            to="/blogs"
            className="text-xs text-text underline underline-offset-4 decoration-border hover:decoration-text"
          >
            ← Back to all articles
          </Link>
        </div>
      </div>
    );
  }

  // Check if content looks like HTML
  const isHtml = /<[a-z][\s\S]*>/i.test(blog.content || '');

  return (
    <article className="max-w-3xl mx-auto px-4 py-12">
      
      {/* Back button */}
      <div className="mb-8">
        <Link
          to="/blogs"
          className="inline-flex items-center gap-1.5 text-xs text-muted hover:text-text transition-colors group"
        >
          <ArrowLeft className="w-4 h-4 transition-transform group-hover:-translate-x-0.5" />
          <span>All articles</span>
        </Link>
      </div>

      {/* Meta Bar */}
      <div className="flex flex-wrap items-center gap-3 text-xs text-muted font-mono mb-4">
        {blog.tag && (
          <span className="text-text bg-surface/80 border border-border px-2.5 py-0.5 rounded-full font-medium">
            #{blog.tag}
          </span>
        )}
        <span className="flex items-center gap-1">
          <Calendar className="w-3.5 h-3.5" />
          {blog.createdAt
            ? new Date(blog.createdAt).toLocaleDateString('en-US', {
                month: 'short',
                day: 'numeric',
                year: 'numeric',
              })
            : 'Recently'}
        </span>
        <span>·</span>
        <span className="flex items-center gap-1">
          <Eye className="w-3.5 h-3.5" />
          {blog.views || 0} views
        </span>
      </div>

      {/* Article Title */}
      <h1 className="text-3xl sm:text-4xl font-normal text-text tracking-tight leading-tight mb-8">
        {blog.title}
      </h1>

      {/* Hero Thumbnail */}
      {blog.thumbnail && (
        <div className="aspect-[16/9] w-full rounded-xl overflow-hidden border border-border bg-surface mb-10">
          <img
            src={blog.thumbnail}
            alt={blog.title}
            className="w-full h-full object-cover"
            onError={(e) => {
              e.target.parentElement.style.display = 'none';
            }}
          />
        </div>
      )}

      {/* Article Body in Comfortable Reading Column (about 68 chars line length) */}
      <div className="text-base sm:text-lg leading-relaxed text-text/90 max-w-[68ch] space-y-6">
        {isHtml ? (
          <div
            className="prose prose-invert max-w-none space-y-4
              [&_h2]:text-2xl [&_h2]:font-semibold [&_h2]:text-text [&_h2]:mt-8 [&_h2]:mb-3
              [&_h3]:text-xl [&_h3]:font-medium [&_h3]:text-text [&_h3]:mt-6 [&_h3]:mb-2
              [&_p]:leading-relaxed [&_p]:text-text/90
              [&_ul]:list-disc [&_ul]:pl-5 [&_ul]:space-y-1.5
              [&_ol]:list-decimal [&_ol]:pl-5 [&_ol]:space-y-1.5
              [&_a]:text-text [&_a]:underline [&_a]:underline-offset-4
              [&_pre]:bg-surface [&_pre]:p-4 [&_pre]:rounded-lg [&_pre]:border [&_pre]:border-border [&_pre]:overflow-x-auto
              [&_code]:bg-surface [&_code]:px-1.5 [&_code]:py-0.5 [&_code]:rounded [&_code]:text-text font-mono"
            dangerouslySetInnerHTML={{ __html: blog.content }}
          />
        ) : (
          (blog.content || '')
            .split('\n\n')
            .filter(Boolean)
            .map((paragraph, index) => (
              <p key={index} className="leading-relaxed">
                {paragraph}
              </p>
            ))
        )}
      </div>

      {/* Discussion & Comments Section */}
      <div className="mt-16 pt-12 border-t border-border">
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-xl font-normal text-text flex items-center gap-2">
            <MessageSquare className="w-5 h-5 text-muted" />
            Discussion ({comments.length})
          </h2>
        </div>

        {/* Comment Input or Log in prompt */}
        {user ? (
          <form onSubmit={handleCommentSubmit} className="mb-10 space-y-3">
            {commentError && (
              <p className="text-xs text-accent-warm mb-2">{commentError}</p>
            )}
            <textarea
              value={commentContent}
              onChange={(e) => setCommentContent(e.target.value)}
              placeholder="Add your technical thoughts or questions..."
              maxLength={1000}
              rows={3}
              required
              className="w-full bg-surface border border-border rounded-lg p-3.5 text-sm text-text placeholder-muted focus:outline-none focus:border-text focus:ring-1 focus:ring-text/20 transition-all resize-y"
            />
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-mono text-muted">
                {commentContent.length}/1000 characters
              </span>
              <Button
                type="submit"
                variant="primary"
                size="sm"
                disabled={submittingComment || !commentContent.trim()}
              >
                {submittingComment ? 'Posting...' : 'Post Comment'} <Send className="w-3.5 h-3.5 ml-1" />
              </Button>
            </div>
          </form>
        ) : (
          <div className="p-6 rounded-xl border border-border bg-surface/30 text-center mb-10">
            <p className="text-sm text-muted mb-3">
              Only authenticated users can contribute to article discussions.
            </p>
            <Link
              to={`/login?redirect=${encodeURIComponent(window.location.pathname)}`}
            >
              <Button variant="secondary" size="sm">
                Log In to Comment
              </Button>
            </Link>
          </div>
        )}

        {/* Comments List */}
        {comments.length === 0 ? (
          <p className="text-xs text-muted py-6 italic text-center">
            No comments on this article yet. Be the first to share your thoughts.
          </p>
        ) : (
          <div className="divide-y divide-border/60">
            {comments.map((comment, idx) => (
              <div
                key={comment._id || idx}
                className="py-5 space-y-2"
              >
                <div className="flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2">
                    <div className="w-6 h-6 rounded-full bg-surface border border-border flex items-center justify-center text-[10px] font-mono font-semibold text-text">
                      {comment.userId?.firstName
                        ? comment.userId.firstName.charAt(0).toUpperCase()
                        : 'U'}
                    </div>
                    <span className="font-medium text-text">
                      {comment.userId
                        ? `${comment.userId.firstName} ${comment.userId.lastName}`
                        : 'Anonymous User'}
                    </span>
                  </div>
                  <span className="text-muted text-[11px] font-mono">
                    {comment.createdAt
                      ? new Date(comment.createdAt).toLocaleDateString('en-US', {
                          month: 'short',
                          day: 'numeric',
                        })
                      : 'Just now'}
                  </span>
                </div>
                <p className="text-xs text-text/85 leading-relaxed pl-8">
                  {comment.content}
                </p>
              </div>
            ))}
          </div>
        )}
      </div>

    </article>
  );
}
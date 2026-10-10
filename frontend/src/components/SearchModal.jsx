import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Search, X, Wrench, BookOpen, ExternalLink, ArrowRight } from 'lucide-react';
import api from '../utils/axios';

export default function SearchModal({ isOpen, onClose }) {
  const [query, setQuery] = useState('');
  const [tools, setTools] = useState([]);
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    if (!isOpen) return;
    setQuery('');
    setLoading(true);

    Promise.all([
      api.get('/tools/free-tools').catch(() => ({ data: { freeTools: [] } })),
      api.get('/tools/paid-tools').catch(() => ({ data: { paidTools: [] } })),
      api.get('/blog/get-all').catch(() => ({ data: { Blogs: [] } })),
    ])
      .then(([freeRes, paidRes, blogRes]) => {
        const allTools = [
          ...(freeRes.data?.freeTools || []),
          ...(paidRes.data?.paidTools || []),
        ];
        setTools(allTools);
        setBlogs(blogRes.data?.Blogs || []);
      })
      .finally(() => setLoading(false));

    const handleKeyDown = (e) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const q = query.trim().toLowerCase();
  const matchedTools = q
    ? tools.filter(
        (t) =>
          t.name?.toLowerCase().includes(q) ||
          t.shortDescription?.toLowerCase().includes(q) ||
          t.tag?.toLowerCase().includes(q)
      )
    : [];

  const matchedBlogs = q
    ? blogs.filter(
        (b) =>
          b.title?.toLowerCase().includes(q) ||
          b.tag?.toLowerCase().includes(q)
      )
    : [];

  const totalResults = matchedTools.length + matchedBlogs.length;

  const handleSelectBlog = (id) => {
    onClose();
    navigate(`/blogs/${id}`);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-20 px-4 bg-black/60 backdrop-blur-sm animate-fadeIn">
      <div
        className="w-full max-w-2xl bg-surface border border-border rounded-2xl shadow-2xl overflow-hidden flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Search Input Bar */}
        <div className="flex items-center px-4 py-3.5 border-b border-border gap-3">
          <Search className="w-5 h-5 text-muted shrink-0" />
          <input
            autoFocus
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search tools, blog articles, and tutorials..."
            className="w-full bg-transparent text-text placeholder-muted focus:outline-none text-base"
          />
          {query ? (
            <span className="text-xs text-muted font-mono shrink-0">
              {totalResults} {totalResults === 1 ? 'result' : 'results'}
            </span>
          ) : (
            <span className="text-xs text-muted border border-border px-1.5 py-0.5 rounded uppercase font-mono">
              ESC
            </span>
          )}
          <button
            onClick={onClose}
            className="text-muted hover:text-text p-1 rounded-md"
            aria-label="Close search"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Results Area */}
        <div className="max-h-[60vh] overflow-y-auto p-4 space-y-6">
          {loading ? (
            <div className="text-center py-10 text-muted text-sm">
              Indexing available tools and posts...
            </div>
          ) : !query ? (
            <div className="text-center py-8 text-muted text-sm">
              Type keywords above to find tools, articles, or guides.
            </div>
          ) : totalResults === 0 ? (
            <div className="text-center py-8 text-muted text-sm">
              No matching content found for "{query}".
            </div>
          ) : (
            <>
              {/* Tools results */}
              {matchedTools.length > 0 && (
                <div>
                  <div className="text-xs font-semibold text-muted uppercase tracking-wider mb-2.5 px-2">
                    Tools ({matchedTools.length})
                  </div>
                  <div className="space-y-1.5">
                    {matchedTools.map((tool) => (
                      <a
                        key={tool._id}
                        href={tool.link}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center justify-between p-3 rounded-lg hover:bg-bg border border-transparent hover:border-border transition-colors group"
                      >
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-lg bg-surface border border-border flex items-center justify-center text-muted group-hover:text-accent">
                            <Wrench className="w-4 h-4" />
                          </div>
                          <div>
                            <div className="text-sm font-medium text-text group-hover:text-accent flex items-center gap-2">
                              {tool.name}
                              <span
                                className={`text-[10px] px-2 py-0.2 rounded-full border ${
                                  tool.type === 'FREE'
                                    ? 'text-accent border-accent/40 bg-accent/10'
                                    : 'text-accent-sun border-accent-sun/40 bg-accent-sun/10'
                                }`}
                              >
                                {tool.type}
                              </span>
                            </div>
                            <div className="text-xs text-muted line-clamp-1">
                              {tool.shortDescription}
                            </div>
                          </div>
                        </div>
                        <ExternalLink className="w-4 h-4 text-muted group-hover:text-accent shrink-0 ml-2" />
                      </a>
                    ))}
                  </div>
                </div>
              )}

              {/* Blogs results */}
              {matchedBlogs.length > 0 && (
                <div>
                  <div className="text-xs font-semibold text-muted uppercase tracking-wider mb-2.5 px-2">
                    Blog Posts ({matchedBlogs.length})
                  </div>
                  <div className="space-y-1.5">
                    {matchedBlogs.map((blog) => (
                      <button
                        key={blog._id}
                        onClick={() => handleSelectBlog(blog._id)}
                        className="w-full text-left flex items-center justify-between p-3 rounded-lg hover:bg-bg border border-transparent hover:border-border transition-colors group"
                      >
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-lg bg-surface border border-border flex items-center justify-center text-muted group-hover:text-accent">
                            <BookOpen className="w-4 h-4" />
                          </div>
                          <div>
                            <div className="text-sm font-medium text-text group-hover:text-accent">
                              {blog.title}
                            </div>
                            <div className="text-xs text-muted flex items-center gap-2 mt-0.5">
                              {blog.tag && <span>#{blog.tag}</span>}
                              <span>·</span>
                              <span>{blog.views || 0} views</span>
                            </div>
                          </div>
                        </div>
                        <ArrowRight className="w-4 h-4 text-muted group-hover:text-accent shrink-0 ml-2" />
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}

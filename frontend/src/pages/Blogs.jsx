import React, { useState, useEffect, useMemo } from 'react';
import { Link } from 'react-router-dom';
import api from '../utils/axios';
import { usePageTitle } from '../utils/pageUtils';
import { Spinner, EmptyState, ErrorState, Button } from '../components/UI';
import blogCharImg from '../assets/blog_char.webp';
import { Search, Eye, Calendar, ArrowRight, BookOpen } from 'lucide-react';

export default function Blogs() {
  usePageTitle('Articles & Blog');

  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Search & Filter
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTag, setSelectedTag] = useState('ALL');
  const [sortBy, setSortBy] = useState('newest'); // 'newest' | 'views'

  const fetchBlogs = async () => {
    setLoading(true);
    setError('');
    try {
      const res = await api.get('/blog/get-all');
      // Backend returns 200 without 'Blogs' key when empty
      setBlogs(res.data?.Blogs ?? []);
    } catch (err) {
      setError('Failed to fetch articles. Please check your network connection.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBlogs();
  }, []);

  // Extract unique tags
  const availableTags = useMemo(() => {
    const tags = new Set();
    blogs.forEach((b) => {
      if (b.tag) tags.add(b.tag);
    });
    return Array.from(tags);
  }, [blogs]);

  // Filtered & sorted blogs
  const processedBlogs = useMemo(() => {
    let list = [...blogs];

    if (selectedTag !== 'ALL') {
      list = list.filter((b) => b.tag === selectedTag);
    }

    if (searchQuery.trim()) {
      const q = searchQuery.trim().toLowerCase();
      list = list.filter(
        (b) =>
          b.title?.toLowerCase().includes(q) ||
          b.tag?.toLowerCase().includes(q)
      );
    }

    if (sortBy === 'views') {
      list.sort((a, b) => (b.views || 0) - (a.views || 0));
    } else {
      list.sort((a, b) => new Date(b.createdAt || 0) - new Date(a.createdAt || 0));
    }

    return list;
  }, [blogs, selectedTag, searchQuery, sortBy]);

  return (
    <div className="max-w-6xl mx-auto px-4 py-12">
      
      {/* Two-Column Hero with Mascot and Headline */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center mb-16">
        <div className="lg:col-span-7 space-y-4">
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-normal text-text tracking-tight leading-tight">
            Read what we're building.
          </h1>
          <p className="text-2xl sm:text-3xl lg:text-4xl font-normal text-muted mt-2 tracking-tight">
            Notes on AI tools and the work behind them.
          </p>

          {/* Pill Search Input with Result Count */}
          <div className="pt-4 max-w-xl">
            <div className="pill-search-container">
              <Search className="w-4 h-4 text-muted shrink-0 mr-3" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search articles by title or topic..."
                className="w-full bg-transparent text-text placeholder-muted focus:outline-none text-sm"
              />
              <span className="text-xs font-mono text-muted shrink-0 pl-2">
                {processedBlogs.length} {processedBlogs.length === 1 ? 'article' : 'articles'}
              </span>
            </div>
            <p className="text-xs text-muted mt-2 px-3">
              Search by title or select tags below.
            </p>
          </div>
        </div>

        {/* Hero Illustration (Constant blog_char.webp Mascot - Enlarged) */}
        <div className="lg:col-span-5 flex justify-center">
          <div className="relative w-full max-w-[380px] sm:max-w-[460px] lg:max-w-[500px] aspect-square flex items-center justify-center">
            <img
              src={blogCharImg}
              alt="Digifello Blog Mascot"
              className="relative z-10 w-full h-full object-contain filter drop-shadow-[0_20px_35px_rgba(0,0,0,0.35)] hover:scale-105 transition-transform duration-500 pointer-events-none select-none"
            />
          </div>
        </div>
      </div>

      {/* Tags and Sorting Controls */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-border pb-4 mb-8">
        
        {/* Tag Filters */}
        <div className="flex flex-wrap items-center gap-1.5">
          <button
            onClick={() => setSelectedTag('ALL')}
            className={`px-2.5 py-1 rounded-md text-xs font-mono transition-colors ${
              selectedTag === 'ALL'
                ? 'bg-text text-bg border border-text font-semibold'
                : 'text-muted hover:text-text border border-transparent hover:border-border'
            }`}
          >
            all
          </button>
          {availableTags.map((tag) => (
            <button
              key={tag}
              onClick={() => setSelectedTag(tag)}
              className={`px-2.5 py-1 rounded-md text-xs font-mono transition-colors ${
                selectedTag === tag
                  ? 'bg-text text-bg border border-text font-semibold'
                  : 'text-muted hover:text-text border border-transparent hover:border-border'
              }`}
            >
              #{tag}
            </button>
          ))}
        </div>

        {/* Sort selector */}
        <div className="flex items-center gap-2 text-xs text-muted">
          <span>Sort by:</span>
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="bg-surface border border-border text-text rounded-md px-2 py-1 text-xs focus:outline-none focus:border-text"
          >
            <option value="newest">Newest first</option>
            <option value="views">Most viewed</option>
          </select>
        </div>
      </div>

      {/* Blogs Content */}
      {loading ? (
        <div className="py-24 text-center">
          <Spinner size="lg" />
          <p className="text-xs text-muted mt-3">Loading articles...</p>
        </div>
      ) : error ? (
        <ErrorState
          title="Could not load articles"
          message={error}
          onRetry={fetchBlogs}
        />
      ) : processedBlogs.length === 0 ? (
        <EmptyState
          title="No articles found"
          description={
            searchQuery || selectedTag !== 'ALL'
              ? 'No articles match your search or filter criteria.'
              : 'No articles have been published yet.'
          }
          action={
            (searchQuery || selectedTag !== 'ALL') && (
              <Button
                variant="secondary"
                size="sm"
                onClick={() => {
                  setSearchQuery('');
                  setSelectedTag('ALL');
                }}
              >
                Clear Filters
              </Button>
            )
          }
        />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {processedBlogs.map((blog) => (
            <Link
              key={blog._id}
              to={`/blogs/${blog._id}`}
              className="df-card overflow-hidden flex flex-col group"
            >
              {/* Thumbnail with fallback */}
              <div className="aspect-[16/10] w-full bg-surface border-b border-border/80 overflow-hidden relative">
                {blog.thumbnail ? (
                  <img
                    src={blog.thumbnail}
                    alt={blog.title}
                    className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                    onError={(e) => {
                      e.target.style.display = 'none';
                      e.target.nextSibling.style.display = 'flex';
                    }}
                  />
                ) : null}
                <div
                  className="w-full h-full items-center justify-center bg-surface text-muted"
                  style={{ display: blog.thumbnail ? 'none' : 'flex' }}
                >
                  <BookOpen className="w-8 h-8 opacity-40" />
                </div>
              </div>

              {/* Card Body */}
              <div className="p-5 flex-1 flex flex-col">
                <div className="flex items-center justify-between text-[11px] font-mono text-muted mb-2">
                  {blog.tag ? (
                    <span className="text-text/80 font-medium">#{blog.tag}</span>
                  ) : (
                    <span>Article</span>
                  )}
                  <span className="flex items-center gap-1">
                    <Eye className="w-3 h-3" /> {blog.views || 0}
                  </span>
                </div>

                <h2 className="text-base font-semibold text-text group-hover:underline underline-offset-2 transition-all line-clamp-2 mb-3">
                  {blog.title}
                </h2>

                <div className="mt-auto pt-3 border-t border-border/60 flex items-center justify-between text-xs text-muted">
                  <span className="flex items-center gap-1.5">
                    <Calendar className="w-3.5 h-3.5" />
                    {blog.createdAt
                      ? new Date(blog.createdAt).toLocaleDateString('en-US', {
                          month: 'short',
                          day: 'numeric',
                          year: 'numeric',
                        })
                      : 'Recently'}
                  </span>
                  <span className="font-semibold text-text group-hover:underline inline-flex items-center gap-1 transition-colors">
                    Read <ArrowRight className="w-3 h-3" />
                  </span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}

    </div>
  );
}
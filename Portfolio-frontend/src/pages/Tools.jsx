import React, { useState, useEffect, useMemo } from 'react';
import { Link } from 'react-router-dom';
import api from '../utils/axios';
import { usePageTitle } from '../utils/pageUtils';
import { Badge, Spinner, EmptyState, ErrorState, Button } from '../components/UI';
import toolsImg from '../assets/tools.png';
import { Search, ExternalLink, ArrowRight, Wrench, Sparkles } from 'lucide-react';

export default function Tools() {
  usePageTitle('Tools Showcase');

  const [freeTools, setFreeTools] = useState([]);
  const [paidTools, setPaidTools] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Filters
  const [activeTab, setActiveTab] = useState('ALL'); // ALL | FREE | PAID
  const [selectedTag, setSelectedTag] = useState('ALL');
  const [searchQuery, setSearchQuery] = useState('');

  const fetchTools = async () => {
    setLoading(true);
    setError('');
    try {
      const [freeRes, paidRes] = await Promise.all([
        api.get('/tools/free-tools'),
        api.get('/tools/paid-tools'),
      ]);
      setFreeTools(freeRes.data?.freeTools || []);
      setPaidTools(paidRes.data?.paidTools || []);
    } catch (err) {
      setError('Unable to load tools. Please check connection and try again.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTools();
  }, []);

  const allTools = useMemo(() => {
    return [...freeTools, ...paidTools];
  }, [freeTools, paidTools]);

  // Extract unique tags
  const availableTags = useMemo(() => {
    const tags = new Set();
    allTools.forEach((tool) => {
      if (tool.tag) tags.add(tool.tag);
    });
    return Array.from(tags);
  }, [allTools]);

  // Filter tools
  const filteredTools = useMemo(() => {
    let list = allTools;

    if (activeTab === 'FREE') {
      list = list.filter((t) => t.type === 'FREE');
    } else if (activeTab === 'PAID') {
      list = list.filter((t) => t.type === 'PAID');
    }

    if (selectedTag !== 'ALL') {
      list = list.filter((t) => t.tag === selectedTag);
    }

    if (searchQuery.trim()) {
      const q = searchQuery.trim().toLowerCase();
      list = list.filter(
        (t) =>
          t.name?.toLowerCase().includes(q) ||
          t.shortDescription?.toLowerCase().includes(q) ||
          t.tag?.toLowerCase().includes(q)
      );
    }

    return list;
  }, [allTools, activeTab, selectedTag, searchQuery]);

  return (
    <div className="max-w-6xl mx-auto px-4 py-12">
      
      {/* Two-Column Hero with Mascot and Headline */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center mb-16">
        <div className="lg:col-span-7 space-y-4">
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-normal text-text tracking-tight leading-tight">
            Specialized developer &amp; AI utilities.
          </h1>
          <p className="text-2xl sm:text-3xl lg:text-4xl font-normal text-muted mt-2 tracking-tight">
            Built for everyday workflows, forensic tasks, and productivity.
          </p>

          {/* Pill Search Input with count */}
          <div className="pt-4 max-w-xl">
            <div className="pill-search-container">
              <Search className="w-4 h-4 text-muted shrink-0 mr-3" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search tools by name, description, or tag..."
                className="w-full bg-transparent text-text placeholder-muted focus:outline-none text-sm"
              />
              <span className="text-xs font-mono text-muted shrink-0 pl-2">
                {filteredTools.length} {filteredTools.length === 1 ? 'tool' : 'tools'}
              </span>
            </div>
            <p className="text-xs text-muted mt-2 px-3">
              Filter by keyword or select categories below.
            </p>
          </div>
        </div>

        {/* Hero Illustration (Constant tools.png Mascot - Enlarged) */}
        <div className="lg:col-span-5 flex justify-center">
          <div className="relative w-full max-w-[380px] sm:max-w-[460px] lg:max-w-[500px] aspect-square flex items-center justify-center">
            <img
              src={toolsImg}
              alt="Digifello Tools Mascot"
              className="relative z-10 w-full h-full object-contain filter drop-shadow-[0_20px_35px_rgba(0,0,0,0.35)] hover:scale-105 transition-transform duration-500 pointer-events-none select-none"
            />
          </div>
        </div>
      </div>

      {/* Tabs & Tag Filter Bar */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-border pb-4 mb-8">
        
        {/* Type Tabs: All / Free / Paid */}
        <div className="flex items-center gap-1 bg-surface p-1 rounded-full border border-border">
          {['ALL', 'FREE', 'PAID'].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-4 py-1.5 rounded-full text-xs font-medium transition-all ${
                activeTab === tab
                  ? 'bg-bg text-text shadow-sm'
                  : 'text-muted hover:text-text'
              }`}
            >
              {tab === 'ALL' ? 'All Tools' : tab === 'FREE' ? 'Free Tools' : 'Paid Tools'}
            </button>
          ))}
        </div>

        {/* Tag Filters */}
        {availableTags.length > 0 && (
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
        )}
      </div>

      {/* Tools Content Grid */}
      {loading ? (
        <div className="py-24 text-center">
          <Spinner size="lg" />
          <p className="text-xs text-muted mt-3">Loading available tools...</p>
        </div>
      ) : error ? (
        <ErrorState
          title="Could not load tools"
          message={error}
          onRetry={fetchTools}
        />
      ) : filteredTools.length === 0 ? (
        <EmptyState
          title="No tools found"
          description={
            searchQuery || selectedTag !== 'ALL' || activeTab !== 'ALL'
              ? 'Try adjusting your search criteria or resetting the category filters.'
              : 'No tools are currently published in the catalog.'
          }
          action={
            (searchQuery || selectedTag !== 'ALL' || activeTab !== 'ALL') && (
              <Button
                variant="secondary"
                size="sm"
                onClick={() => {
                  setSearchQuery('');
                  setSelectedTag('ALL');
                  setActiveTab('ALL');
                }}
              >
                Reset Filters
              </Button>
            )
          }
        />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredTools.map((tool) => (
            <div
              key={tool._id}
              className="df-card overflow-hidden flex flex-col group"
            >
              {/* Thumbnail with neutral fallback */}
              <div className="aspect-[16/9] w-full bg-surface border-b border-border/80 overflow-hidden relative">
                {tool.thumbnail ? (
                  <img
                    src={tool.thumbnail}
                    alt={tool.name}
                    className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                    onError={(e) => {
                      e.target.style.display = 'none';
                      e.target.nextSibling.style.display = 'flex';
                    }}
                  />
                ) : null}
                <div
                  className="w-full h-full items-center justify-center bg-surface text-muted"
                  style={{ display: tool.thumbnail ? 'none' : 'flex' }}
                >
                  <Wrench className="w-8 h-8 opacity-40" />
                </div>
                
                {/* Type badge on card */}
                <div className="absolute top-3 right-3">
                  <Badge variant={tool.type === 'FREE' ? 'free' : 'paid'}>
                    {tool.type}
                  </Badge>
                </div>
              </div>

              {/* Card Body */}
              <div className="p-5 flex-1 flex flex-col">
                <div className="flex items-center gap-2 mb-2">
                  {tool.tag && (
                    <span className="text-[11px] font-mono text-muted">
                      #{tool.tag}
                    </span>
                  )}
                </div>

                <h3 className="text-base font-semibold text-text group-hover:underline underline-offset-2 transition-all mb-2">
                  {tool.name}
                </h3>

                <p className="text-xs text-muted leading-relaxed flex-1 line-clamp-3 mb-4">
                  {tool.shortDescription}
                </p>

                <div className="pt-3 border-t border-border/60 flex items-center justify-between">
                  <a
                    href={tool.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-xs font-semibold text-text hover:underline underline-offset-4 decoration-border inline-flex items-center gap-1.5"
                  >
                    Open Tool <ExternalLink className="w-3.5 h-3.5" />
                  </a>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Closing Callout: Centered without box */}
      <div className="mt-24 py-8 flex flex-col items-center text-center max-w-2xl mx-auto space-y-4">
        <h2 className="text-2xl sm:text-3xl font-normal text-text tracking-tight">
          Can't find what you need? Request a custom tool.
        </h2>
        <p className="text-xs sm:text-sm text-muted leading-relaxed max-w-xl mx-auto">
          Describe your problem statement, required inputs, and budget. We review technical feasibility and build customized web tooling.
        </p>
        <div className="pt-2">
          <Link to="/tool-request">
            <Button variant="primary">
              Request a Tool <ArrowRight className="w-4 h-4 ml-1.5" />
            </Button>
          </Link>
        </div>
      </div>

    </div>
  );
}
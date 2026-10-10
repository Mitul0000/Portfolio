import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../utils/axios';
import { usePageTitle } from '../utils/pageUtils';
import { siteContent } from '../data/siteContent';
import HeroArt from '../components/HeroArt';
import ImageSlot from '../components/ImageSlot';
import CustomToolFeature from '../components/CustomToolFeature';
import CapabilitiesCarousel from '../components/CapabilitiesCarousel';
import speakingImg from '../assets/speaking.png';
import { Button, Badge, Spinner } from '../components/UI';
import {
  ArrowRight,
  ExternalLink,
  Eye,
  Calendar,
  Check,
  Sparkles,
  BookOpen,
  Wrench,
  Layers,
  ArrowUpRight,
  Cpu,
  Shield,
  Workflow
} from 'lucide-react';

export default function Home() {
  usePageTitle(''); // Digifello

  const [latestBlogs, setLatestBlogs] = useState([]);
  const [loadingBlogs, setLoadingBlogs] = useState(true);
  const [activeSpeakingPillar, setActiveSpeakingPillar] = useState(0);
  const [pillarDirection, setPillarDirection] = useState('right');
  const [isPillarAnimating, setIsPillarAnimating] = useState(false);

  const handleSelectPillar = (nextIdx) => {
    if (nextIdx === activeSpeakingPillar) return;
    setPillarDirection(nextIdx > activeSpeakingPillar ? 'right' : 'left');
    setIsPillarAnimating(true);
    setActiveSpeakingPillar(nextIdx);
    setTimeout(() => setIsPillarAnimating(false), 200);
  };

  // Auto-cycle through the 4 engagement ways faster (every 2.8 seconds)
  useEffect(() => {
    const timer = setInterval(() => {
      setActiveSpeakingPillar((prev) => {
        const next = (prev + 1) % 4;
        setPillarDirection('right');
        setIsPillarAnimating(true);
        setTimeout(() => setIsPillarAnimating(false), 200);
        return next;
      });
    }, 2800);
    return () => clearInterval(timer);
  }, []);

  const getBlogExcerpt = (blog, maxLength = 120) => {
    if (blog.summary && blog.summary.trim()) {
      const s = blog.summary.trim();
      return s.length > maxLength ? `${s.slice(0, maxLength).trim()}...` : s;
    }
    if (blog.content && typeof blog.content === 'string') {
      const clean = blog.content.replace(/[#*`_~\[\]()>-]/g, ' ').replace(/\s+/g, ' ').trim();
      return clean.length > maxLength ? `${clean.slice(0, maxLength).trim()}...` : clean;
    }
    return 'Technical teardown and engineering architecture notes.';
  };

  useEffect(() => {
    // Fetch latest 4 blogs
    api.get('/blog/get-all')
      .then((res) => {
        const blogs = res.data?.Blogs ?? [];
        setLatestBlogs(blogs.slice(0, 4));
      })
      .catch(() => setLatestBlogs([]))
      .finally(() => setLoadingBlogs(false));
  }, []);

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8 sm:py-12 space-y-20 sm:space-y-28 lg:space-y-32">
      
      {/* ─── 1. HERO SECTION ─── */}
      <section className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center pt-2 sm:pt-6">
        <div className="lg:col-span-7 space-y-5 sm:space-y-6">
          <div>
            <h1 className="text-3xl sm:text-5xl lg:text-6xl font-normal text-text tracking-tight leading-[1.12]">
              {siteContent.brand.heroHeadline.part1}
            </h1>
            <p className="text-2xl sm:text-4xl lg:text-5xl font-normal text-muted mt-2 tracking-tight leading-[1.12]">
              {siteContent.brand.heroHeadline.part2}
            </p>
          </div>

          <p className="text-muted text-sm sm:text-base max-w-lg leading-relaxed">
            {siteContent.brand.heroDescription}
          </p>

          <div className="flex flex-wrap items-center gap-3 sm:gap-4 pt-1 sm:pt-2">
            <Link to="/tools">
              <Button variant="primary">
                Browse Tools <ArrowRight className="w-4 h-4 ml-1" />
              </Button>
            </Link>
            <Link to="/tool-request">
              <Button variant="secondary">
                Request a Custom Tool
              </Button>
            </Link>
          </div>
        </div>

        <div className="lg:col-span-5 hidden lg:block">
          <HeroArt />
        </div>
      </section>

      {/* ─── 2. NAVIGATION PILLARS (CHARACTER GUIDE: SPEAKING PRESENTATION - NO BOX-BOX) ─── */}
      <section className="space-y-6 sm:space-y-8">
        <div className="pb-2 flex items-end justify-between">
          <div className="inline-block border-b border-border/70 pb-3">
            <span className="text-xs font-mono font-semibold uppercase tracking-wider text-muted block mb-1">
              Guide // Overview
            </span>
            <h2 className="text-2xl sm:text-3xl font-normal text-text tracking-tight">
              Four ways to engage.
            </h2>
          </div>

          {/* Quick step counter */}
          <div className="flex items-center gap-2">
            {siteContent.pillars.map((_, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => setActiveSpeakingPillar(idx)}
                className={`h-1.5 rounded-full transition-all duration-300 ${
                  activeSpeakingPillar === idx ? 'w-6 bg-text' : 'w-2 bg-border hover:bg-text/50'
                }`}
                aria-label={`Jump to step ${idx + 1}`}
              />
            ))}
          </div>
        </div>

        {/* Character Speaking Stage: Pure animated character speech interaction */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 sm:gap-8 lg:gap-12 items-center py-2 sm:py-4">
          
          {/* Speaking Character Illustration */}
          <div className="lg:col-span-5 flex justify-center order-2 lg:order-1">
            <div className="relative w-full max-w-[280px] sm:max-w-[340px] lg:max-w-[380px] aspect-square flex items-center justify-center">
              {/* Subtle ambient backdrop aura */}
              <div className="absolute inset-6 sm:inset-8 rounded-full bg-accent/5 blur-2xl pointer-events-none" />

              {/* Character Presenting (speaking.png) */}
              <img
                src={speakingImg}
                alt="Digifello Mascot Presenting"
                className="relative z-10 w-full h-full object-contain filter drop-shadow-[0_15px_30px_rgba(0,0,0,0.35)] transition-transform duration-700 ease-out hover:scale-105"
              />
            </div>
          </div>

          {/* Dialogue & Speech Segment Display (Open layout) */}
          <div className="lg:col-span-7 space-y-6 order-1 lg:order-2">
            
            {/* Interactive Pillar Selector Tabs with Connecting Baseline Indicator */}
            <div className="relative border-b border-border/60 pb-3">
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                {siteContent.pillars.map((pillar, idx) => {
                  const isActive = activeSpeakingPillar === idx;
                  return (
                    <button
                      key={pillar.step}
                      type="button"
                      onClick={() => handleSelectPillar(idx)}
                      className={`group text-left py-2 px-3 rounded-lg transition-all duration-300 cursor-pointer ${
                        isActive
                          ? 'text-text font-semibold'
                          : 'text-muted hover:text-text'
                      }`}
                    >
                      <span className={`text-[11px] font-mono block transition-colors ${
                        isActive ? 'text-text font-semibold' : 'text-muted/60 group-hover:text-muted'
                      }`}>
                        {pillar.step}
                      </span>
                      <span className={`text-xs sm:text-sm font-medium transition-colors line-clamp-1 ${
                        isActive ? 'text-text font-semibold' : 'text-text/70 group-hover:text-text'
                      }`}>
                        {pillar.title}
                      </span>
                    </button>
                  );
                })}
              </div>

              {/* Dynamic Connecting Baseline Glider */}
              <div
                className="hidden sm:block absolute bottom-0 h-[2px] bg-text transition-all duration-500 ease-out shadow-[0_0_8px_rgba(var(--color-text),0.3)]"
                style={{
                  width: '25%',
                  left: `${activeSpeakingPillar * 25}%`,
                }}
              />
            </div>

            {/* Speaking Dialogue Speech Presentation Area with Directional Swipe Transition */}
            <div className="overflow-hidden">
              {(() => {
                const currentPillar = siteContent.pillars[activeSpeakingPillar];
                return (
                  <div
                    key={currentPillar.step}
                    className={`space-y-5 sm:space-y-6 transition-all duration-200 ease-out transform ${
                      isPillarAnimating
                        ? pillarDirection === 'right'
                          ? '-translate-x-8 opacity-0'
                          : 'translate-x-8 opacity-0'
                        : 'translate-x-0 opacity-100'
                    }`}
                  >
                    <div className="space-y-2.5 sm:space-y-3">
                      <h3 className="text-2xl sm:text-3xl lg:text-4xl font-normal text-text tracking-tight leading-tight">
                        {currentPillar.title}
                      </h3>

                      <p className="text-sm sm:text-base lg:text-lg text-muted leading-relaxed max-w-xl">
                        {currentPillar.description}
                      </p>
                    </div>

                    {/* Direct Action Link with large button */}
                    <div className="pt-2 flex flex-wrap items-center gap-3 sm:gap-4">
                      <Link to={currentPillar.link}>
                        <Button variant="primary">
                          {currentPillar.linkLabel} <ArrowRight className="w-4 h-4 ml-1.5" />
                        </Button>
                      </Link>
                      <span className="text-xs font-mono text-muted/60">
                        Step {activeSpeakingPillar + 1} of {siteContent.pillars.length}
                      </span>
                    </div>
                  </div>
                );
              })()}
            </div>

          </div>

        </div>
      </section>

      {/* ─── 3. HOW CUSTOM TOOL REQUESTS OPERATE (REFERENCE LAYOUT) ─── */}
      <CustomToolFeature />

      {/* ─── 4. ENGINEERING CAPABILITIES (INTERACTIVE 4-PART HEADER CAROUSEL & CONTENT SWAP) ─── */}
      <CapabilitiesCarousel />

      {/* ─── 6. LATEST POSTS (CURATED 4-ARTICLE GRID WITH THUMBNAIL & EXCERPT) ─── */}
      <section className="space-y-8">
        <div className="pb-2 flex items-end justify-between">
          <div className="inline-block border-b border-border/70 pb-3">
            <span className="text-xs font-mono font-semibold uppercase tracking-wider text-muted block mb-1">
              Articles // Publications
            </span>
            <h2 className="text-2xl sm:text-3xl font-normal text-text tracking-tight">
              Latest technical write-ups.
            </h2>
          </div>

          <Link
            to="/blogs"
            className="text-xs font-mono uppercase tracking-wider text-muted hover:text-text inline-flex items-center gap-1 transition-colors group mb-3"
          >
            Archive <ArrowRight className="w-3.5 h-3.5 ml-0.5 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>

        {loadingBlogs ? (
          <div className="py-16 text-center">
            <Spinner size="md" />
            <p className="text-xs text-muted mt-2 font-mono">Loading articles...</p>
          </div>
        ) : latestBlogs.length === 0 ? (
          <div className="py-12 text-center text-xs text-muted font-mono">
            New articles are being written. Browse back soon.
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
            {latestBlogs.slice(0, 4).map((blog) => (
              <Link
                key={blog._id}
                to={`/blogs/${blog._id}`}
                className="group flex flex-col justify-between p-4 rounded-xl border border-border/70 hover:border-text transition-all duration-300 bg-surface/30 hover:bg-surface/80 shadow-sm hover:shadow-md"
              >
                <div className="space-y-3">
                  {/* Thumbnail */}
                  <div className="aspect-[16/10] w-full rounded-lg overflow-hidden bg-surface border border-border/60 relative">
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
                      className="w-full h-full items-center justify-center bg-surface text-muted/40"
                      style={{ display: blog.thumbnail ? 'none' : 'flex' }}
                    >
                      <BookOpen className="w-5 h-5 opacity-40" />
                    </div>
                  </div>

                  {/* Meta info */}
                  <div className="flex items-center justify-between text-[11px] font-mono text-muted">
                    {blog.tag ? (
                      <span className="text-text/80 font-medium group-hover:text-text transition-colors">#{blog.tag}</span>
                    ) : (
                      <span>Writeup</span>
                    )}
                    <span className="flex items-center gap-1 text-muted/70">
                      <Eye className="w-3 h-3" /> {blog.views || 0}
                    </span>
                  </div>

                  {/* Title */}
                  <h3 className="text-sm sm:text-base font-medium text-text group-hover:underline underline-offset-2 transition-all line-clamp-2 leading-snug">
                    {blog.title}
                  </h3>

                  {/* Short Description (first segment of article text/summary) */}
                  <p className="text-xs text-muted leading-relaxed line-clamp-3">
                    {getBlogExcerpt(blog, 110)}
                  </p>
                </div>

                {/* Footer read link */}
                <div className="pt-3 mt-4 border-t border-border/50 flex items-center justify-between text-[11px] font-mono text-muted group-hover:text-text transition-colors">
                  <span>
                    {blog.createdAt
                      ? new Date(blog.createdAt).toLocaleDateString('en-US', {
                          month: 'short',
                          day: 'numeric',
                          year: 'numeric'
                        })
                      : 'Recent'}
                  </span>
                  <span className="inline-flex items-center gap-1 group-hover:underline">
                    Read <ArrowRight className="w-3 h-3 group-hover:translate-x-0.5 transition-transform" />
                  </span>
                </div>
              </Link>
            ))}
          </div>
        )}
      </section>

      {/* ─── 7. CONSULTANCY ADVISORY CHANNEL (CENTERED - NO DIVIDER) ─── */}
      <section className="relative py-8 flex flex-col items-center text-center max-w-2xl mx-auto space-y-6">
        <div className="space-y-3">
          <span className="text-xs font-mono font-semibold uppercase tracking-wider text-muted block">
            Advisory Channel // Private Direct Link
          </span>
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-normal text-text tracking-tight">
            Need direct technical guidance or architecture review?
          </h2>
          <p className="text-xs sm:text-sm text-muted leading-relaxed max-w-xl mx-auto">
            From evaluating LLM models to forensic endpoint audits, connect directly for focused technical consultations.
          </p>
        </div>

        <div className="flex flex-wrap items-center justify-center gap-5 pt-2">
          <Link to="/consultancy">
            <Button variant="primary">
              Book a Conversation <ArrowRight className="w-4 h-4 ml-1.5" />
            </Button>
          </Link>
          <a
            href={`mailto:${siteContent.consultancy.contact.email}`}
            className="text-xs font-mono uppercase tracking-wider text-muted hover:text-text underline underline-offset-4 decoration-border hover:decoration-text transition-colors"
          >
            Direct Email
          </a>
        </div>
      </section>

    </div>
  );
}
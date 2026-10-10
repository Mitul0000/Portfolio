import React from 'react';
import { usePageTitle } from '../utils/pageUtils';
import { siteContent } from '../data/siteContent';
import { Button } from '../components/UI';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';

export default function Services() {
  usePageTitle('Engineering Services');

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-12 sm:py-16 space-y-16 sm:space-y-20">
      
      {/* ─── Header: Editorial Overview ─── */}
      <div className="max-w-3xl space-y-4">
        <div className="inline-block border-b border-border/70 pb-3">
          <span className="text-xs font-mono font-semibold uppercase tracking-wider text-muted block mb-1">
            Topic Overview // Full Specification
          </span>
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-normal text-text tracking-tight leading-tight">
            Complete service breakdown.
          </h1>
        </div>
        <p className="text-xl sm:text-2xl font-normal text-muted tracking-tight pt-1">
          Engineering capabilities across web architecture, Android platforms, AI automation, and endpoint security.
        </p>
      </div>

      {/* ─── Structured Topics Breakdown (Open Layout - No Card Boxes) ─── */}
      <div className="divide-y divide-border/60">
        {siteContent.services.map((item, index) => (
          <div
            key={item.id}
            className={`py-12 sm:py-16 grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-14 items-start ${
              index === 0 ? 'pt-2' : ''
            }`}
          >
            {/* Left 4 Cols: Index, Title & Tagline */}
            <div className="lg:col-span-4 space-y-3">
              <span className="text-xs font-mono text-muted tracking-wider block">
                0{index + 1} // {item.badge.toUpperCase()}
              </span>

              <h2 className="text-2xl sm:text-3xl font-normal text-text tracking-tight">
                {item.title}
              </h2>

              <p className="text-sm font-medium text-text/80 leading-relaxed">
                {item.tagline}
              </p>

              <div className="pt-2">
                <Link to="/tool-request">
                  <span className="text-xs font-mono text-muted hover:text-text inline-flex items-center gap-1 group transition-colors">
                    Request this build <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                  </span>
                </Link>
              </div>
            </div>

            {/* Right 8 Cols: Detailed Description, Deliverables & Target Audience */}
            <div className="lg:col-span-8 space-y-6">
              <p className="text-sm sm:text-base text-muted leading-relaxed">
                {item.description}
              </p>

              {/* Deliverables Checklist Grid */}
              <div className="space-y-3 pt-1">
                <span className="text-xs font-mono font-semibold uppercase tracking-wider text-muted/70 block">
                  Core Deliverables &amp; Scope
                </span>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs text-text/90">
                  {(item.deliverables || item.included || []).map((deliv, i) => (
                    <div key={i} className="flex items-start gap-2.5 leading-relaxed">
                      <span className="w-1.5 h-1.5 rounded-full bg-text/40 shrink-0 mt-1.5" />
                      <span>{deliv}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Ideal Fit Note */}
              <div className="pt-2 text-xs font-mono text-muted flex items-baseline gap-2">
                <span className="text-text font-semibold uppercase shrink-0">Ideal For:</span>
                <span className="text-muted/80 font-sans text-xs sm:text-sm">
                  {item.idealFor || item.useCase}
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* ─── Closing Call to Action (Centered Open Layout, No Box) ─── */}
      <div className="pt-8 pb-12 flex flex-col items-center text-center max-w-2xl mx-auto space-y-4">
        <span className="text-xs font-mono uppercase tracking-wider text-muted block">
          Custom Development // Consultation
        </span>
        <h2 className="text-2xl sm:text-3xl lg:text-4xl font-normal text-text tracking-tight">
          Ready to kick off a dedicated build?
        </h2>
        <p className="text-xs sm:text-sm text-muted leading-relaxed max-w-xl mx-auto">
          Submit your requirements for custom tooling, or schedule a direct consultation to discuss scope, architecture, and timelines.
        </p>
        <div className="pt-3 flex flex-wrap items-center justify-center gap-4">
          <Link to="/tool-request">
            <Button variant="primary">
              Request a Custom Tool <ArrowRight className="w-4 h-4 ml-1.5" />
            </Button>
          </Link>
          <Link to="/consultancy">
            <Button variant="secondary">
              Contact for Consultancy
            </Button>
          </Link>
        </div>
      </div>

    </div>
  );
}

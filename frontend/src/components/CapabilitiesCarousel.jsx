import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { siteContent } from '../data/siteContent';
import {
  Check,
  ArrowRight,
  ChevronLeft,
  ChevronRight
} from 'lucide-react';
import { Button } from './UI';

export default function CapabilitiesCarousel() {
  const { services } = siteContent;
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [slideDirection, setSlideDirection] = useState('right'); // 'right' or 'left'
  const [animating, setAnimating] = useState(false);

  const handleSelect = (nextIdx) => {
    if (nextIdx === selectedIndex) return;
    const dir = nextIdx > selectedIndex ? 'right' : 'left';
    setSlideDirection(dir);
    setAnimating(true);
    setSelectedIndex(nextIdx);
    setTimeout(() => {
      setAnimating(false);
    }, 320);
  };

  const handlePrev = () => {
    const nextIdx = (selectedIndex - 1 + services.length) % services.length;
    handleSelect(nextIdx);
  };

  const handleNext = () => {
    const nextIdx = (selectedIndex + 1) % services.length;
    handleSelect(nextIdx);
  };

  const currentService = services[selectedIndex];

  // Connecting bridge indicator positioning (calculated per column index in 4 columns)
  // 4 items: centers are at 12.5%, 37.5%, 62.5%, 87.5%
  const indicatorOffsetPercent = (selectedIndex * 25) + 12.5;

  return (
    <section className="space-y-8">
      
      {/* Top Header Section */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 pb-2">
        <div className="inline-block border-b border-border/70 pb-3">
          <span className="text-xs font-mono font-semibold uppercase tracking-wider text-muted block mb-1">
            Capabilities // 04 Specialties
          </span>
          <h2 className="text-2xl sm:text-3xl font-normal text-text tracking-tight">
            Engineering capabilities.
          </h2>
        </div>

        {/* Prev / Next Header Selector Controls */}
        <div className="flex items-center gap-3">
          <span className="text-xs font-mono text-muted">
            0{selectedIndex + 1} / 0{services.length}
          </span>
          <div className="flex items-center gap-1.5">
            <button
              type="button"
              onClick={handlePrev}
              className="w-8 h-8 rounded-full border border-border bg-surface hover:border-text text-muted hover:text-text flex items-center justify-center transition-all cursor-pointer"
              aria-label="Previous capability"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <button
              type="button"
              onClick={handleNext}
              className="w-8 h-8 rounded-full border border-border bg-surface hover:border-text text-muted hover:text-text flex items-center justify-center transition-all cursor-pointer"
              aria-label="Next capability"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* 
        Sleek Unified Segmented Switcher:
        Clean borderless segmented tabs with pure theme states.
      */}
      <div className="border-b border-border/70 pb-4">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-2 sm:gap-4">
          {services.map((item, idx) => {
            const isSelected = idx === selectedIndex;

            return (
              <button
                key={item.id}
                type="button"
                onClick={() => handleSelect(idx)}
                className={`text-left py-3 px-3.5 rounded-lg transition-all duration-150 outline-none select-none cursor-pointer border ${
                  isSelected
                    ? 'border-border bg-surface text-text'
                    : 'border-transparent bg-transparent text-muted hover:text-text hover:bg-surface/30'
                }`}
              >
                <div className="flex items-center gap-2 mb-1.5">
                  <span className={`text-[11px] font-mono transition-colors ${
                    isSelected ? 'text-text font-semibold' : 'text-muted/60'
                  }`}>
                    0{idx + 1}
                  </span>
                  <span className="text-muted/30 font-mono text-[10px]">//</span>
                  <span className={`text-[10px] font-mono uppercase tracking-wider transition-colors ${
                    isSelected ? 'text-text/90 font-medium' : 'text-muted/60'
                  }`}>
                    {item.badge}
                  </span>
                </div>

                <div>
                  <h3 className={`text-xs sm:text-sm font-medium transition-colors line-clamp-1 ${
                    isSelected ? 'text-text font-semibold' : 'text-muted'
                  }`}>
                    {item.title}
                  </h3>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* 
        Bottom Section: Content Swapped with Directional Transition
      */}
      <div className="overflow-hidden">
        <div
          className={`py-6 sm:py-8 transition-all duration-300 ease-out transform ${
            animating
              ? slideDirection === 'right'
                ? '-translate-x-6 opacity-0'
                : 'translate-x-6 opacity-0'
              : 'translate-x-0 opacity-100'
          }`}
        >
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-center">
            
            {/* Left Detailed Text Column */}
            <div className="lg:col-span-7 space-y-6">
              
              <div className="space-y-3">
                <span className="text-xs font-mono font-semibold text-muted uppercase tracking-wider block">
                  Specialty 0{selectedIndex + 1} // {currentService.badge}
                </span>

                <h3 className="text-2xl sm:text-3xl lg:text-4xl font-normal text-text tracking-tight leading-tight">
                  {currentService.title}
                </h3>

                <p className="text-sm sm:text-base text-muted leading-relaxed max-w-xl">
                  {currentService.description}
                </p>
              </div>

              {/* Deliverables Checklist Grid */}
              <div className="space-y-3 pt-2">
                <h4 className="text-xs font-mono font-semibold uppercase tracking-wider text-muted">
                  Core Deliverables
                </h4>
                <ul className="grid sm:grid-cols-2 gap-2.5">
                  {(currentService.deliverables || currentService.included || []).map((point, i) => (
                    <li
                      key={i}
                      className="flex items-start gap-2.5 text-xs text-text/90 bg-bg/80 border border-border/80 p-3 rounded-xl"
                    >
                      <Check className="w-3.5 h-3.5 text-emerald-400 shrink-0 mt-0.5" />
                      <span className="leading-relaxed">{point}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Typical Use Case Box */}
              <div className="p-4 rounded-xl bg-bg border border-border/70 text-xs">
                <span className="font-semibold text-text block mb-1">
                  Target Application:
                </span>
                <p className="text-muted leading-relaxed">
                  {currentService.idealFor || currentService.useCase}
                </p>
              </div>

              {/* Navigation & Action Links */}
              <div className="pt-2 flex flex-wrap items-center gap-4">
                <Link to="/tool-request">
                  <Button variant="primary" size="sm">
                    Request a Dedicated Build <ArrowRight className="w-3.5 h-3.5 ml-1" />
                  </Button>
                </Link>
                <Link to="/services">
                  <Button variant="secondary" size="sm">
                    View Full Services Specification
                  </Button>
                </Link>
              </div>

            </div>

            {/* Right Visual / Technical Architecture Showcase */}
            <div className="lg:col-span-5 flex justify-center">
              <div className="w-full max-w-[420px] aspect-[4/3] rounded-2xl overflow-hidden border border-border bg-[#181920] p-6 shadow-xl flex flex-col justify-between font-mono text-xs">
                
                <div className="flex items-center justify-between border-b border-border/60 pb-3 text-[11px] text-muted">
                  <span className="text-[#a5b4fc]">capability_stack.json</span>
                  <span className="text-[#34d399] bg-[#064e3b]/30 px-2 py-0.5 rounded text-[10px]">active_spec</span>
                </div>

                {/* Code visual representing the selected capability */}
                <div className="my-auto space-y-2 text-[12px] leading-relaxed">
                  <div className="p-3.5 rounded-lg bg-[#22242e] border border-[#343746] text-[#e2e8f0]">
                    <span className="text-[#f472b6]">{'{'}</span><br />
                    &nbsp;&nbsp;<span className="text-[#38bdf8]">"domain"</span>: <span className="text-[#a7f3d0]">"{currentService.title}"</span>,<br />
                    &nbsp;&nbsp;<span className="text-[#38bdf8]">"category"</span>: <span className="text-[#fde047]">"{currentService.badge}"</span>,<br />
                    &nbsp;&nbsp;<span className="text-[#38bdf8]">"sla_readiness"</span>: <span className="text-[#34d399]">true</span>,<br />
                    &nbsp;&nbsp;<span className="text-[#38bdf8]">"deploy_mode"</span>: <span className="text-[#a7f3d0]">"Production / Container"</span><br />
                    <span className="text-[#f472b6]">{'}'}</span>
                  </div>
                </div>

                <div className="flex items-center justify-between border-t border-border/60 pt-3 text-[10px] text-muted">
                  <span>DIGIFELLO // ENG</span>
                  <span className="text-[#818cf8]">STAGE 0{selectedIndex + 1} OF 0{services.length}</span>
                </div>

              </div>
            </div>

          </div>
        </div>
      </div>

    </section>
  );
}

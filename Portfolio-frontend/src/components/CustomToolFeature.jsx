import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { siteContent } from '../data/siteContent';
import { ArrowRight } from 'lucide-react';
import { Button } from './UI';

export default function CustomToolFeature() {
  const { howCustomToolsOperate } = siteContent;
  const containerRef = useRef(null);
  const [scrollProgress, setScrollProgress] = useState(0); // 0 to 1
  const [activeStep, setActiveStep] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      if (!containerRef.current) return;
      const rect = containerRef.current.getBoundingClientRect();
      const windowHeight = window.innerHeight;
      
      // Calculate how far the section has scrolled through viewport
      const totalDist = rect.height - windowHeight * 0.4;
      const currentScroll = windowHeight * 0.6 - rect.top;
      
      if (totalDist > 0) {
        const progress = Math.min(Math.max(currentScroll / totalDist, 0), 1);
        setScrollProgress(progress);
        
        // 4 steps (0, 1, 2, 3)
        const step = Math.min(Math.floor(progress * howCustomToolsOperate.length), howCustomToolsOperate.length - 1);
        setActiveStep(step);
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener('scroll', handleScroll);
  }, [howCustomToolsOperate.length]);

  const renderFallbackVisual = (subtopic) => {
    switch (subtopic.iconType) {
      case 'requirements':
        return (
          <div className="w-full h-full flex flex-col justify-between p-7 bg-[#181920]">
            <div className="flex items-center justify-between text-xs font-mono">
              <span className="text-[#a5b4fc]">input_spec.json</span>
            </div>
            <div className="space-y-2.5 my-auto font-mono text-xs">
              <div className="p-3.5 rounded-lg bg-[#22242e] border border-[#343746] text-[#e2e8f0] leading-relaxed shadow-inner">
                <span className="text-[#f472b6] font-semibold">{'{'}</span><br />
                &nbsp;&nbsp;<span className="text-[#38bdf8]">"tool"</span>: <span className="text-[#a7f3d0]">"Log Analyzer"</span>,<br />
                &nbsp;&nbsp;<span className="text-[#38bdf8]">"inputs"</span>: [<span className="text-[#fde047]">"pcap"</span>, <span className="text-[#fde047]">"evtx"</span>],<br />
                &nbsp;&nbsp;<span className="text-[#38bdf8]">"mode"</span>: <span className="text-[#a7f3d0]">"Autonomous"</span>,<br />
                &nbsp;&nbsp;<span className="text-[#38bdf8]">"output"</span>: <span className="text-[#a7f3d0]">"Interactive Dashboard"</span><br />
                <span className="text-[#f472b6] font-semibold">{'}'}</span>
              </div>
            </div>
            <div className="text-[11px] font-mono text-[#94a3b8] flex items-center justify-between">
              <span className="text-[#818cf8]">STAGE 01</span>
              <span>INPUT CONTRACT</span>
            </div>
          </div>
        );
      case 'budget':
        return (
          <div className="w-full h-full flex flex-col justify-between p-7 bg-[#181920]">
            <div className="flex items-center justify-between text-xs font-mono">
              <span className="text-[#38bdf8]">scope_tiers.yaml</span>
            </div>
            <div className="space-y-3 my-auto font-mono">
              <div className="p-3.5 rounded-lg bg-[#22242e] border border-[#343746] flex items-center justify-between text-xs">
                <div>
                  <span className="text-[#34d399] font-medium block">tier: community_open</span>
                  <span className="text-[11px] text-[#94a3b8]">license: public_domain</span>
                </div>
                <span className="font-semibold text-[#a7f3d0] bg-[#064e3b]/50 border border-[#059669]/40 px-2 py-1 rounded text-xs">FREE</span>
              </div>
              <div className="p-3.5 rounded-lg bg-[#22242e] border border-[#343746] flex items-center justify-between text-xs">
                <div>
                  <span className="text-[#fde047] font-medium block">tier: bespoke_build</span>
                  <span className="text-[11px] text-[#94a3b8]">milestone: delivery</span>
                </div>
                <span className="font-semibold text-[#fef08a] bg-[#713f12]/50 border border-[#eab308]/40 px-2 py-1 rounded text-xs">$300 – $1,500</span>
              </div>
            </div>
            <div className="text-[11px] font-mono text-[#94a3b8] flex items-center justify-between">
              <span className="text-[#818cf8]">STAGE 02</span>
              <span>TRANSPARENT PRICING</span>
            </div>
          </div>
        );
      case 'review':
        return (
          <div className="w-full h-full flex flex-col justify-between p-7 bg-[#181920]">
            <div className="flex items-center justify-between text-xs font-mono">
              <span className="text-[#a5b4fc]">review_pipeline.sh</span>
            </div>
            <div className="space-y-2.5 my-auto font-mono text-xs">
              <div className="p-2.5 rounded bg-[#22242e] border border-[#343746] text-[#34d399] flex items-center justify-between">
                <span>[✓] api_limits_check</span>
                <span className="text-[10px] text-[#6ee7b7] bg-[#064e3b]/40 px-1.5 py-0.5 rounded">PASSED</span>
              </div>
              <div className="p-2.5 rounded bg-[#22242e] border border-[#343746] text-[#34d399] flex items-center justify-between">
                <span>[✓] dependency_audit</span>
                <span className="text-[10px] text-[#6ee7b7] bg-[#064e3b]/40 px-1.5 py-0.5 rounded">PASSED</span>
              </div>
              <div className="p-2.5 rounded bg-[#22242e] border border-[#343746] text-[#38bdf8] flex items-center justify-between">
                <span>[✓] hosting_overhead</span>
                <span className="text-[10px] text-[#7dd3fc] bg-[#075985]/40 px-1.5 py-0.5 rounded">OPTIMIZED</span>
              </div>
            </div>
            <div className="text-[11px] font-mono text-[#94a3b8] flex items-center justify-between">
              <span className="text-[#818cf8]">STAGE 03</span>
              <span>PRE-BUILD AUDIT</span>
            </div>
          </div>
        );
      case 'dashboard':
        return (
          <div className="w-full h-full flex flex-col justify-between p-7 bg-[#181920]">
            <div className="flex items-center justify-between text-xs font-mono">
              <span className="text-[#38bdf8]">request_feed.log</span>
            </div>
            <div className="space-y-2.5 my-auto font-mono">
              <div className="p-3.5 rounded-lg bg-[#22242e] border border-[#343746] flex items-center justify-between text-xs">
                <div>
                  <span className="text-[#f1f5f9] font-medium block">request_id: #084_parser</span>
                  <span className="text-[11px] text-[#94a3b8]">admin_note: "Prototype compiled"</span>
                </div>
                <span className="px-2 py-1 rounded bg-[#064e3b]/60 border border-[#059669]/50 text-[#34d399] text-[10px] font-semibold">
                  APPROVED
                </span>
              </div>
            </div>
            <div className="text-[11px] font-mono text-[#94a3b8] flex items-center justify-between">
              <span className="text-[#818cf8]">STAGE 04</span>
              <span>HANDOVER PIPELINE</span>
            </div>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <section ref={containerRef} className="relative space-y-20">
      
      {/* Section Header with Underline matching text width only */}
      <div className="pb-2">
        <div className="inline-block border-b border-border/70 pb-3">
          <span className="text-xs font-mono font-semibold uppercase tracking-wider text-muted block mb-1">
            Build Lifecycle
          </span>
          <h2 className="text-2xl sm:text-3xl font-normal text-text tracking-tight">
            How custom tool requests operate.
          </h2>
          <p className="text-xs text-muted mt-1 max-w-xl">
            Four stages from initial requirement to production handover.
          </p>
        </div>
      </div>

      {/* Main Container with Animated Center Progress Line */}
      <div className="relative">
        
        {/* Background Track Line extending down to the button */}
        <div className="hidden lg:block absolute left-1/2 top-0 bottom-[-56px] -translate-x-1/2 w-[2px] bg-border/40 pointer-events-none z-0" />

        {/* Animated Active Line flowing down as user scrolls, connecting all the way to button */}
        <div
          className="hidden lg:block absolute left-1/2 top-0 -translate-x-1/2 w-[2px] bg-text pointer-events-none transition-all duration-300 ease-out z-0"
          style={{ height: `${Math.min(Math.max(scrollProgress * 105, 4), 105)}%` }}
        />

        {/* Dynamic Tip on the moving line - placed behind node circles so numbers never get obscured */}
        <div
          className="hidden lg:block absolute left-1/2 -translate-x-1/2 w-2.5 h-2.5 rounded-full bg-text pointer-events-none transition-all duration-300 ease-out -translate-y-1.5 z-0"
          style={{ top: `${Math.min(Math.max(scrollProgress * 105, 4), 105)}%` }}
        />

        {/* Alternating Steps */}
        <div className="space-y-20 sm:space-y-28 lg:space-y-32">
          {howCustomToolsOperate.map((subtopic, index) => {
            const isImageLeft = index % 2 === 0;
            // Step is crossed when scroll line reaches this circle
            const stepThreshold = (index + 0.45) / howCustomToolsOperate.length;
            const isCrossed = scrollProgress >= stepThreshold;
            const isRevealed = scrollProgress >= (index / howCustomToolsOperate.length) - 0.12;

            return (
              <div
                key={subtopic.step}
                className="relative grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-20 items-center"
              >
                {/* Center Node Circle: Sits ON TOP (z-30) of the line so number is ALWAYS clearly visible. */}
                <div
                  className={`hidden lg:flex absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-9 h-9 rounded-full border items-center justify-center font-mono text-xs font-bold transition-all duration-500 z-30 select-none ${
                    isCrossed
                      ? 'bg-text text-bg border-text scale-110 shadow-sm'
                      : isRevealed
                        ? 'border-text/80 bg-surface text-text scale-105'
                        : 'border-border bg-bg text-muted/60 scale-95'
                  }`}
                >
                  0{index + 1}
                </div>

                {/* Image / Code Visual Column with Scroll-Triggered Slide-In */}
                <div
                  className={`lg:col-span-6 flex justify-center transition-all duration-700 ease-out ${
                    isImageLeft ? 'lg:order-1' : 'lg:order-2'
                  } ${
                    isRevealed
                      ? 'opacity-100 translate-x-0 translate-y-0'
                      : isImageLeft
                        ? 'opacity-20 -translate-x-8 translate-y-4'
                        : 'opacity-20 translate-x-8 translate-y-4'
                  }`}
                >
                  <div className="relative w-full max-w-[480px] aspect-[4/3] sm:aspect-[14/11] rounded-[24px] overflow-hidden border border-border bg-[#181920] shadow-xl">
                    {subtopic.image ? (
                      <img
                        src={subtopic.image}
                        alt={subtopic.headline.white}
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          e.target.style.display = 'none';
                          e.target.nextSibling.style.display = 'flex';
                        }}
                      />
                    ) : null}

                    {/* Code-colored visual preview */}
                    <div
                      className="w-full h-full"
                      style={{ display: subtopic.image ? 'none' : 'block' }}
                    >
                      {renderFallbackVisual(subtopic)}
                    </div>
                  </div>
                </div>

                {/* Text Description Column with Directional Slide-In */}
                <div
                  className={`lg:col-span-6 space-y-5 transition-all duration-700 ease-out ${
                    isImageLeft ? 'lg:order-2 lg:pl-6' : 'lg:order-1 lg:pr-6'
                  } ${
                    isRevealed
                      ? 'opacity-100 translate-x-0 translate-y-0'
                      : isImageLeft
                        ? 'opacity-20 translate-x-8 translate-y-4'
                        : 'opacity-20 -translate-x-8 translate-y-4'
                  }`}
                >
                  {/* Step indicator tag */}
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-mono font-semibold text-muted uppercase tracking-wider">
                      {subtopic.tag}
                    </span>
                  </div>

                  {/* Two-Tone Headline */}
                  <div>
                    <h3 className="text-2xl sm:text-3xl lg:text-[34px] font-normal text-text tracking-tight leading-[1.18]">
                      {subtopic.headline.white}
                    </h3>
                    <p className="text-xl sm:text-2xl lg:text-[28px] font-normal text-muted mt-2 tracking-tight leading-[1.18]">
                      {subtopic.headline.muted}
                    </p>
                  </div>

                  {/* Description */}
                  <p className="text-sm sm:text-base text-muted leading-relaxed max-w-xl">
                    {subtopic.description}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Clean Request Submission Call-To-Action directly connected with the vertical line */}
      <div className="relative pt-16 pb-4 text-center max-w-2xl mx-auto space-y-4">
        <span className="text-xs font-mono font-semibold uppercase tracking-wider text-muted">
          Initiate a Build
        </span>
        <h3 className="text-2xl sm:text-3xl font-normal text-text tracking-tight">
          Ready to submit your tool request?
        </h3>
        <p className="text-sm text-muted max-w-md mx-auto leading-relaxed">
          Describe the inputs, workflow, and desired outputs. We evaluate feasibility and propose the fastest development route within 48 hours.
        </p>

        {/* Button smoothly appears when the line reaches this section (scrollProgress >= 0.88) */}
        <div
          className={`pt-4 flex justify-center transition-all duration-700 ease-out transform ${
            scrollProgress >= 0.85
              ? 'opacity-100 translate-y-0 scale-100'
              : 'opacity-0 translate-y-6 scale-95 pointer-events-none'
          }`}
        >
          <Link to="/tool-request">
            <Button variant="primary">
              Submit a Tool Request <ArrowRight className="w-4 h-4 ml-1.5" />
            </Button>
          </Link>
        </div>
      </div>

    </section>
  );
}

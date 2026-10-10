import React from 'react';
import { Image, Sparkles } from 'lucide-react';

/**
 * ImageSlot - Interactive image container with configurable path and dimension guidance.
 * When `src` is empty, displays a clean dashed developer placeholder with exact recommended dimensions.
 */
export default function ImageSlot({
  src = '',
  alt = '',
  dimensions = '640x360 px',
  className = '',
  aspectRatio = 'aspect-[16/9]',
}) {
  if (src) {
    return (
      <div className={`relative overflow-hidden rounded-xl border border-border group-hover:border-white transition-all bg-surface ${aspectRatio} ${className}`}>
        <img
          src={src}
          alt={alt}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
          onError={(e) => {
            e.target.style.display = 'none';
            e.target.nextSibling.style.display = 'flex';
          }}
        />
        <div
          className="w-full h-full items-center justify-center bg-surface/80 flex-col gap-2 text-muted hidden"
        >
          <Image className="w-6 h-6 opacity-40" />
          <span className="text-[11px] font-mono text-muted">{dimensions}</span>
        </div>
      </div>
    );
  }

  return (
    <div
      className={`relative rounded-xl border border-dashed border-border/80 hover:border-white/60 bg-surface/40 flex flex-col items-center justify-center p-6 text-center transition-all group-hover:border-white/50 ${aspectRatio} ${className}`}
      title={`Image Slot (${dimensions})`}
    >
      <div className="w-10 h-10 rounded-full bg-surface border border-border flex items-center justify-center text-muted mb-2.5">
        <Image className="w-5 h-5 opacity-60" />
      </div>
      <span className="text-xs font-semibold text-text/80 mb-0.5">
        Image Slot
      </span>
      <span className="text-[11px] font-mono text-muted">
        Recommended: {dimensions}
      </span>
      <span className="text-[10px] text-muted/60 mt-1">
        Set path in <code className="text-text/70">siteContent.js</code>
      </span>
    </div>
  );
}

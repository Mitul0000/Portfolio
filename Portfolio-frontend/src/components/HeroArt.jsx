import React, { useState, useEffect } from 'react';
import char1 from '../assets/char_img_home_1.png';
import char2 from '../assets/char_img_home_2.png';
import char3 from '../assets/char_img_home_3.png';
import char4 from '../assets/char_img_home_4.png';

/**
 * Interactive rotating character showcase for Hero section.
 * Automatically cycles through the 4 Digifello character PNGs
 * with smooth cross-fade animation, floating depth, and status badge.
 */
export default function HeroArt({ className = '' }) {
  const characters = [
    { src: char1, label: 'Building Agents', tag: 'DEV // AGENTS' },
    { src: char2, label: 'Deep Work', tag: 'FLOW // CODE' },
    { src: char3, label: 'Break & Coffee', tag: 'CHILL // BREW' },
    { src: char4, label: 'Speed & Ship', tag: 'DEPLOY // FAST' },
  ];

  const [currentIndex, setCurrentIndex] = useState(0);

  // Auto-rotate character every 3.5 seconds
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % characters.length);
    }, 3500);
    return () => clearInterval(timer);
  }, [characters.length]);

  return (
    <div className={`relative flex items-center justify-center select-none ${className}`}>
      
      {/* Ambient Radial Backdrop Glow */}
      <div className="absolute inset-0 bg-radial from-white/[0.08] via-transparent to-transparent rounded-full blur-3xl pointer-events-none" />

      {/* Main Showcase Stage */}
      <div className="relative w-full max-w-[440px] aspect-square flex items-center justify-center">
        
        {/* Subtle Architectural Frame & Orbit Ring */}
        <div className="absolute inset-4 rounded-3xl border border-border/50 bg-surface/30 backdrop-blur-sm -rotate-2 transition-transform duration-700" />
        <div className="absolute inset-4 rounded-3xl border border-white/10 bg-[#161720]/80 rotate-1 shadow-2xl transition-transform duration-700" />

        {/* Character Image Container with Cross-Fade Transition */}
        <div className="relative z-10 w-[88%] h-[88%] flex items-center justify-center p-4">
          {characters.map((char, idx) => {
            const isActive = idx === currentIndex;
            return (
              <img
                key={idx}
                src={char.src}
                alt={char.label}
                className={`absolute max-w-full max-h-full object-contain filter drop-shadow-[0_16px_28px_rgba(0,0,0,0.65)] transition-all duration-700 ease-out transform ${
                  isActive
                    ? 'opacity-100 scale-100 translate-y-0 rotate-0 pointer-events-auto'
                    : 'opacity-0 scale-95 translate-y-4 -rotate-3 pointer-events-none'
                }`}
              />
            );
          })}
        </div>


        {/* Subtle Rotation Dots Selector */}
        <div className="absolute top-7 right-7 z-20 flex items-center gap-1.5">
          {characters.map((_, idx) => (
            <button
              key={idx}
              type="button"
              onClick={() => setCurrentIndex(idx)}
              className={`h-1.5 rounded-full transition-all duration-300 ${
                idx === currentIndex
                  ? 'w-5 bg-white'
                  : 'w-1.5 bg-border hover:bg-white/60'
              }`}
              aria-label={`Show character ${idx + 1}`}
            />
          ))}
        </div>

      </div>

    </div>
  );
}

import React, { useEffect, useState } from 'react';
import { ArrowUp } from 'lucide-react';

export const ScrollProgressButton: React.FC = () => {
  const [scrollProgress, setScrollProgress] = useState(0);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      const totalHeight = document.documentElement.scrollHeight - window.innerHeight;
      if (totalHeight > 0) {
        const progress = (window.scrollY / totalHeight) * 100;
        setScrollProgress(progress);
        setIsVisible(window.scrollY > 280);
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  if (!isVisible) return null;

  const radius = 18;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (scrollProgress / 100) * circumference;

  return (
    <button
      type="button"
      onClick={scrollToTop}
      aria-label="Scroll to top of page"
      className="fixed bottom-6 left-6 z-40 flex items-center justify-center w-11 h-11 rounded-full bg-white text-[#111110] border border-[#D8D4CA] shadow-md hover:bg-[#F7F6F2] transition-all hover:scale-105 active:scale-95 group"
    >
      {/* Circular Progress Ring */}
      <svg className="absolute w-11 h-11 -rotate-90 pointer-events-none" viewBox="0 0 44 44">
        <circle
          cx="22"
          cy="22"
          r={radius}
          className="text-[#E2DFD7] stroke-current"
          strokeWidth="2.5"
          fill="transparent"
        />
        <circle
          cx="22"
          cy="22"
          r={radius}
          className="text-[#1D4ED8] stroke-current transition-all duration-75"
          strokeWidth="2.5"
          strokeDasharray={circumference}
          strokeDashoffset={strokeDashoffset}
          strokeLinecap="round"
          fill="transparent"
        />
      </svg>
      <ArrowUp className="w-3.5 h-3.5 text-[#57554F] group-hover:text-[#111110] transition-colors" />
    </button>
  );
};

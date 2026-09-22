import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { ArrowUp } from 'lucide-react';
import { cn } from '@/lib/utils';

/** Scrolls window to top on route change or smoothly scrolls to target hash element */
export const RouteScrollToTop: React.FC = () => {
  const { pathname, hash } = useLocation();

  useEffect(() => {
    if (hash) {
      const targetId = decodeURIComponent(hash.replace('#', ''));
      let attempts = 0;
      const maxAttempts = 15;

      const scrollToElement = () => {
        const target = document.getElementById(targetId);
        if (target) {
          const navbarHeight = 85;
          const rect = target.getBoundingClientRect();
          const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
          const targetTop = rect.top + scrollTop - navbarHeight;

          window.scrollTo({
            top: Math.max(0, targetTop),
            behavior: 'smooth',
          });
        } else if (attempts < maxAttempts) {
          attempts += 1;
          setTimeout(scrollToElement, 60);
        }
      };

      // Initial slight delay to allow route component to mount
      const timer = setTimeout(scrollToElement, 50);
      return () => clearTimeout(timer);
    }

    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [pathname, hash]);

  return null;
};

/** Floating "back to top" button — appears after scrolling 300 px */
const ScrollToTop: React.FC = () => {
  const [visible, setVisible] = useState(false);
  const [scrollPct, setScrollPct] = useState(0);

  useEffect(() => {
    const onScroll = () => {
      const scrolled = window.scrollY;
      const total = document.documentElement.scrollHeight - window.innerHeight;
      setVisible(scrolled > 300);
      setScrollPct(total > 0 ? (scrolled / total) * 100 : 0);
    };

    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const handleClick = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // SVG circle progress ring
  const radius = 18;
  const circumference = 2 * Math.PI * radius;
  const dash = (scrollPct / 100) * circumference;

  return (
    <button
      onClick={handleClick}
      aria-label="Scroll to top"
      className={cn(
        'fixed bottom-8 right-6 z-50 w-12 h-12 flex items-center justify-center',
        'rounded-full bg-nova-secondary/90 backdrop-blur-md border border-nova-border',
        'shadow-nova-card hover:border-nova-primary/40 hover:bg-nova-surface transition-all duration-300 group',
        visible ? 'opacity-100 translate-y-0 pointer-events-auto' : 'opacity-0 translate-y-4 pointer-events-none'
      )}
    >
      {/* Progress ring */}
      <svg
        className="absolute inset-0 w-full h-full -rotate-90"
        viewBox="0 0 48 48"
        fill="none"
      >
        {/* Track */}
        <circle
          cx="24" cy="24" r={radius}
          stroke="#1E293B"
          strokeWidth="2.5"
          fill="none"
        />
        {/* Progress */}
        <circle
          cx="24" cy="24" r={radius}
          stroke="#10B981"
          strokeWidth="2.5"
          fill="none"
          strokeDasharray={`${dash} ${circumference}`}
          strokeLinecap="round"
          className="transition-all duration-150"
        />
      </svg>

      {/* Arrow icon */}
      <ArrowUp
        size={16}
        className="relative z-10 text-nova-text-muted group-hover:text-nova-accent transition-colors duration-200"
      />
    </button>
  );
};

export default ScrollToTop;

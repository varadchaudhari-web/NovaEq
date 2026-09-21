import React, { useEffect, useRef, useState } from 'react';

interface AnimatedCounterProps {
  to: number;
  prefix?: string;
  suffix?: string;
  decimals?: number;
  isIndian?: boolean;
  className?: string;
}

const easeOutCubic = (t: number) => 1 - Math.pow(1 - t, 3);

const AnimatedCounter: React.FC<AnimatedCounterProps> = ({
  to,
  prefix = '',
  suffix = '',
  decimals = 0,
  isIndian = false,
  className = '',
}) => {
  const [currentVal, setCurrentVal] = useState(0);
  const elementRef = useRef<HTMLSpanElement | null>(null);
  const hasAnimated = useRef(false);

  const formatNumber = (num: number) => {
    if (decimals > 0) {
      return num.toLocaleString('en-US', {
        minimumFractionDigits: decimals,
        maximumFractionDigits: decimals,
      });
    }
    const rounded = Math.round(num);
    return isIndian ? rounded.toLocaleString('en-IN') : rounded.toLocaleString('en-US');
  };

  useEffect(() => {
    const el = elementRef.current;
    if (!el) return;

    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReducedMotion) {
      setCurrentVal(to);
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && !hasAnimated.current) {
          hasAnimated.current = true;
          const startTime = performance.now();
          const duration = 1400;

          const step = (now: number) => {
            const progress = Math.min((now - startTime) / duration, 1);
            const eased = easeOutCubic(progress);
            setCurrentVal(to * eased);

            if (progress < 1) {
              requestAnimationFrame(step);
            } else {
              setCurrentVal(to);
            }
          };

          requestAnimationFrame(step);
          observer.unobserve(el);
        }
      },
      { threshold: 0.3 }
    );

    observer.observe(el);

    return () => {
      observer.disconnect();
    };
  }, [to]);

  return (
    <span ref={elementRef} className={`font-mono font-medium ${className}`}>
      {prefix}
      {formatNumber(currentVal)}
      {suffix}
    </span>
  );
};

export default AnimatedCounter;

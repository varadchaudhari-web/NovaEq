import React from 'react';
import { cn } from '@/lib/utils';

interface LogoProps {
  size?: 'sm' | 'md' | 'lg';
  showText?: boolean;
  className?: string;
}

const Logo: React.FC<LogoProps> = ({ size = 'md', showText = true, className }) => {
  const sizes = {
    sm: { icon: 24, text: 'text-lg', sub: 'text-xs' },
    md: { icon: 32, text: 'text-xl', sub: 'text-xs' },
    lg: { icon: 44, text: 'text-3xl', sub: 'text-sm' },
  };

  const s = sizes[size];

  return (
    <div className={cn('flex items-center gap-2.5', className)}>
      <svg
        width={s.icon}
        height={s.icon}
        viewBox="0 0 32 32"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="flex-shrink-0"
      >
        <rect width="32" height="32" rx="8" fill="url(#logoGrad)" />
        <path
          d="M6 22L12 11L18 17L24 8"
          stroke="#10B981"
          strokeWidth="2.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <circle cx="24" cy="8" r="2.5" fill="#10B981" />
        <circle cx="18" cy="17" r="2" fill="#60A5FA" opacity="0.8" />
        <circle cx="12" cy="11" r="2" fill="#60A5FA" opacity="0.8" />
        <defs>
          <linearGradient id="logoGrad" x1="0" y1="0" x2="32" y2="32">
            <stop offset="0%" stopColor="#1D4ED8" />
            <stop offset="100%" stopColor="#0F172A" />
          </linearGradient>
        </defs>
      </svg>
      {showText && (
        <div>
          <span className={cn('font-display font-bold text-nova-text leading-none', s.text)}>
            Nova<span className="text-nova-accent">Eq</span>
          </span>
          {size === 'lg' && (
            <p className="text-nova-text-muted text-xs mt-0.5">AI Investment Platform</p>
          )}
        </div>
      )}
    </div>
  );
};

export default Logo;

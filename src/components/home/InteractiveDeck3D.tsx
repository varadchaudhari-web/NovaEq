import React, { useState, useEffect, useCallback } from 'react';

export interface AISignalCardData {
  symbol: string;
  name: string;
  action: 'BUY' | 'SELL';
  target: string;
  risk: 'Low' | 'Medium' | 'High';
  confidence: number;
  expectedChange: string;
  avatarLetter: string;
  avatarBg: string;
}

const defaultSignals: AISignalCardData[] = [
  {
    symbol: 'NVDA',
    name: 'NVIDIA Corp.',
    action: 'BUY',
    target: '$1,050',
    risk: 'Medium',
    confidence: 94,
    expectedChange: '+19.96%',
    avatarLetter: 'N',
    avatarBg: 'from-emerald-700 to-emerald-500',
  },
  {
    symbol: 'MSFT',
    name: 'Microsoft Corp.',
    action: 'BUY',
    target: '$480',
    risk: 'Low',
    confidence: 88,
    expectedChange: '+12.74%',
    avatarLetter: 'M',
    avatarBg: 'from-blue-700 to-blue-500',
  },
  {
    symbol: 'TSLA',
    name: 'Tesla Inc.',
    action: 'SELL',
    target: '$140',
    risk: 'High',
    confidence: 79,
    expectedChange: '-21.5%',
    avatarLetter: 'T',
    avatarBg: 'from-rose-800 to-rose-500',
  },
];

interface InteractiveDeck3DProps {
  signals?: AISignalCardData[];
  onCardClick?: (signal: AISignalCardData) => void;
}

const InteractiveDeck3D: React.FC<InteractiveDeck3DProps> = ({
  signals = defaultSignals,
  onCardClick,
}) => {
  const [activeIndex, setActiveIndex] = useState(0);

  const nextCard = useCallback(() => {
    setActiveIndex((prev) => (prev + 1) % signals.length);
  }, [signals.length]);

  useEffect(() => {
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReducedMotion) return;

    const interval = setInterval(nextCard, 4200);
    return () => clearInterval(interval);
  }, [nextCard]);

  return (
    <div className="relative w-full max-w-lg mx-auto">
      {/* 3D Deck Container */}
      <div className="deck-container">
        {signals.map((signal, index) => {
          const diff = (index - activeIndex + signals.length) % signals.length;
          const translateZ = diff * -110;
          const translateY = diff * 26;
          const translateX = diff * 30;
          const rotateY = diff * -7;
          const scale = 1 - diff * 0.03;
          const opacity = diff > 2 ? 0 : 1 - diff * 0.26;
          const blur = diff === 0 ? 'none' : `blur(${diff * 1.2}px)`;
          const zIndex = signals.length - diff;

          const isBuy = signal.action === 'BUY';

          return (
            <div
              key={signal.symbol}
              onClick={() => {
                if (diff === 0 && onCardClick) {
                  onCardClick(signal);
                } else {
                  nextCard();
                }
              }}
              className="deck-card cursor-pointer p-6"
              style={{
                transform: `translate3d(${translateX}px, ${translateY}px, ${translateZ}px) rotateY(${rotateY}deg) scale(${scale})`,
                opacity,
                filter: blur,
                zIndex,
              }}
            >
              {/* Card Header */}
              <div className="flex items-center gap-3.5">
                <div
                  className={`w-11 h-11 rounded-xl bg-gradient-to-br ${signal.avatarBg} text-white font-display font-bold text-lg flex items-center justify-center shadow-md`}
                >
                  {signal.avatarLetter}
                </div>
                <div>
                  <h4 className="font-display font-bold text-lg text-nova-text leading-tight">
                    {signal.symbol}
                  </h4>
                  <span className="text-xs text-nova-text-muted">{signal.name}</span>
                </div>
                <div
                  className={`ml-auto px-3.5 py-1 rounded-full text-xs font-bold border ${
                    isBuy
                      ? 'text-emerald-400 bg-emerald-500/15 border-emerald-500/40'
                      : 'text-rose-400 bg-rose-500/15 border-rose-500/40'
                  }`}
                >
                  {signal.action}
                </div>
              </div>

              {/* Price / Upside Target */}
              <div className="my-6">
                <span
                  className={`text-3xl font-display font-bold block ${
                    isBuy ? 'text-emerald-400' : 'text-rose-400'
                  }`}
                >
                  {signal.expectedChange}
                </span>
                <span className="text-xs text-nova-text-muted mt-1 block">
                  Target: <strong className="text-nova-text">{signal.target}</strong> · Risk:{' '}
                  <strong
                    className={
                      signal.risk === 'Low'
                        ? 'text-emerald-400'
                        : signal.risk === 'Medium'
                        ? 'text-amber-400'
                        : 'text-rose-400'
                    }
                  >
                    {signal.risk}
                  </strong>
                </span>
              </div>

              {/* Confidence Bar */}
              <div className="grid grid-cols-[auto_1fr_auto] items-center gap-3 text-xs">
                <span className="text-nova-text-muted font-medium">AI Confidence</span>
                <div className="relative h-1.5 bg-slate-700/50 rounded-full overflow-hidden">
                  <div
                    className={`absolute inset-y-0 left-0 rounded-full transition-all duration-500 ${
                      isBuy
                        ? 'bg-gradient-to-r from-blue-500 to-emerald-400'
                        : 'bg-gradient-to-r from-amber-500 to-rose-500'
                    }`}
                    style={{ width: `${signal.confidence}%` }}
                  />
                </div>
                <b className="font-mono-nums font-semibold text-nova-text">
                  {signal.confidence}%
                </b>
              </div>
            </div>
          );
        })}
      </div>

      {/* Pagination Dot Bars */}
      <div className="flex justify-center gap-2.5 mt-8" role="tablist" aria-label="AI signals">
        {signals.map((signal, idx) => {
          const isCurrent = idx === activeIndex;
          return (
            <button
              key={signal.symbol}
              type="button"
              role="tab"
              aria-selected={isCurrent}
              aria-label={`Signal ${idx + 1}`}
              onClick={() => setActiveIndex(idx)}
              className={`h-1.5 rounded-full transition-all duration-300 ${
                isCurrent
                  ? 'w-11 bg-gradient-to-r from-blue-500 to-emerald-400'
                  : 'w-7 bg-slate-600/40 hover:bg-slate-500/60'
              }`}
            />
          );
        })}
      </div>
    </div>
  );
};

export default InteractiveDeck3D;

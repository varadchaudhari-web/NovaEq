import React, { useState, useEffect, useRef } from 'react';
import {
  Play,
  Pause,
  ChevronLeft,
  ChevronRight,
  Maximize2,
  Sparkles,
  CheckCircle2,
  ExternalLink,
  X,
  Layers,
  Zap,
  TrendingUp,
  Brain,
  ShieldCheck,
  Smartphone
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface ShowcaseItem {
  id: string;
  title: string;
  shortTitle: string;
  category: string;
  tagline: string;
  badge: string;
  badgeColor: string;
  description: string;
  imageUrl: string;
  icon: any;
  metrics: { label: string; value: string; positive?: boolean }[];
  features: string[];
  route: string;
}

const showcaseSlides: ShowcaseItem[] = [
  {
    id: 'terminal',
    title: 'Multi-Asset Trading Terminal',
    shortTitle: 'Trading Terminal',
    category: 'Institutional Execution',
    tagline: 'Sub-millisecond order routing with deep liquidity & multi-chart sync',
    badge: 'Ultra-Low Latency',
    badgeColor: 'emerald',
    icon: TrendingUp,
    description:
      'Experience lightning-fast multi-chart candlestick visualization, real-time Level 2 DOM order books, customized indicator scripts, and direct broker API integrations in a single unified dark-mode workspace.',
    imageUrl: '/images/terminal-preview.jpg',
    metrics: [
      { label: 'Latency', value: '< 1.2 ms', positive: true },
      { label: 'Indicators', value: '120+ Live' },
      { label: 'Uptime', value: '99.99%', positive: true },
    ],
    features: [
      'Multi-timeframe synced candlestick views (1s to 1M)',
      'Direct 1-click bracket orders (TP / SL / Trailing)',
      'Integrated volume profile & VWAP bands',
    ],
    route: '/markets',
  },
  {
    id: 'ai-engine',
    title: 'AI Signal & Sentiment Neural Matrix',
    shortTitle: 'AI Neural Matrix',
    category: 'Predictive Intelligence',
    tagline: 'Deep learning models analyzing 500+ quantitative & qualitative factors',
    badge: 'Machine Learning V3',
    badgeColor: 'blue',
    icon: Brain,
    description:
      'Our proprietary neural network digests live news sentiment, institutional dark-pool sweeps, balance sheet disclosures, and price anomalies to generate high-probability trade alerts with quantified conviction scores.',
    imageUrl: '/images/ai-insights-preview.jpg',
    metrics: [
      { label: 'Model Accuracy', value: '87.4%', positive: true },
      { label: 'Data Feeds', value: '10k+ / day' },
      { label: 'Alpha Gen', value: '+28.4% YoY', positive: true },
    ],
    features: [
      'Real-time BUY / ACCUMULATE / EXIT catalyst alerts',
      'Automated NLP sentiment scoring on earnings transcripts',
      'Dynamic multi-target risk-reward calculation',
    ],
    route: '/ai-insights',
  },
  {
    id: 'algo-bots',
    title: 'Algorithmic Strategy Builder & Backtester',
    shortTitle: 'Algo Bot Builder',
    category: 'Automated Alpha',
    tagline: 'Zero-code visual rule triggers & Python webhook engine',
    badge: 'Automated Fleet',
    badgeColor: 'amber',
    icon: Zap,
    description:
      'Construct sophisticated quantitative rules without code. Backtest across 10+ years of tick-level historical data with realistic slippage, fee modeling, and auto-deploy to live broker accounts.',
    imageUrl: '/images/algo-bots-preview.jpg',
    metrics: [
      { label: 'Backtest History', value: '10 Years' },
      { label: 'Drawdown Cap', value: '< 4.5%', positive: true },
      { label: 'Execution', value: 'Auto 24/7' },
    ],
    features: [
      'Visual drag-and-drop rule constructor',
      'Automated risk circuit breakers & volatility shields',
      'Webhook listener for custom TradingView alerts',
    ],
    route: '/markets',
  },
  {
    id: 'portfolio-risk',
    title: 'Institutional Risk & Factor Analytics',
    shortTitle: 'Risk Analytics',
    category: 'Wealth Protection',
    tagline: 'Comprehensive stress-testing and sector correlation analysis',
    badge: 'Smart Safeguard',
    badgeColor: 'purple',
    icon: ShieldCheck,
    description:
      'Monitor factor exposure, sector concentration, Sharpe ratio, beta drift, and VaR (Value at Risk) in real time. Receive automated smart rebalancing suggestions to safeguard capital across market cycles.',
    imageUrl: '/images/portfolio-analytics-preview.jpg',
    metrics: [
      { label: 'Sharpe Ratio', value: '2.84', positive: true },
      { label: 'Risk Calibrator', value: 'Live Matrix' },
      { label: 'Tax Harvest', value: '+14.2%', positive: true },
    ],
    features: [
      'Live sector correlation heatmaps & beta tracking',
      'Scenario simulation against historical market crashes',
      'One-tap tax-loss harvesting recommendations',
    ],
    route: '/about',
  },
  {
    id: 'mobile-trader',
    title: 'NovaEq Mobile & Tablet Ecosystem',
    shortTitle: 'Mobile Suite',
    category: 'Cross-Device',
    tagline: 'Seamless continuous sync across desktop, tablet, and mobile',
    badge: 'Anywhere, Anytime',
    badgeColor: 'cyan',
    icon: Smartphone,
    description:
      'Manage orders, receive push signals, track your live P&L, and execute high-conviction ideas from anywhere with our lightning-fast, battery-optimized progressive web and native apps.',
    imageUrl: '/images/mobile-trader-preview.jpg',
    metrics: [
      { label: 'App Rating', value: '4.9 / 5', positive: true },
      { label: 'Sync Speed', value: '< 50 ms' },
      { label: 'Encryption', value: '256-bit AES', positive: true },
    ],
    features: [
      'Biometric authentication with instant order dispatch',
      'Customizable lockscreen market widgets',
      'Instant push alerts for price levels and AI signals',
    ],
    route: '/pricing',
  },
];

const marqueeCards = [
  {
    title: 'Multi-Monitor Terminal',
    subtitle: 'Institutional Candlesticks',
    tag: 'Live Execution',
    url: '/images/terminal-preview.jpg',
    badge: '< 1.2ms',
  },
  {
    title: 'Neural Network AI',
    subtitle: 'Factor Models & Sentiment',
    tag: 'AI Intelligence',
    url: '/images/ai-insights-preview.jpg',
    badge: '87.4% Win',
  },
  {
    title: 'Visual Algo Bot Builder',
    subtitle: '10-Yr Backtested Logic',
    tag: 'Automated Bot',
    url: '/images/algo-bots-preview.jpg',
    badge: '24/7 Autopilot',
  },
  {
    title: 'Factor Risk Matrix',
    subtitle: 'Drawdown & Correlation',
    tag: 'Risk Analytics',
    url: '/images/portfolio-analytics-preview.jpg',
    badge: 'VaR 95%',
  },
  {
    title: 'Mobile Companion App',
    subtitle: 'Biometric Order Dispatch',
    tag: 'Mobile Suite',
    url: '/images/mobile-trader-preview.jpg',
    badge: '4.9 ★ Rating',
  },
];

export const PlatformGalleryShowcase: React.FC = () => {
  const navigate = useNavigate();
  const [activeIndex, setActiveIndex] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);
  const [lightboxImage, setLightboxImage] = useState<string | null>(null);
  const [lightboxTitle, setLightboxTitle] = useState<string>('');
  const [progress, setProgress] = useState(0);
  const [isHovered, setIsHovered] = useState(false);

  const SLIDE_DURATION = 5000; // ms per slide
  const currentSlide = showcaseSlides[activeIndex];

  // Auto-scroll Carousel timer & progress
  useEffect(() => {
    if (!isAutoPlaying || isHovered) return;

    const intervalStep = 50; // update progress every 50ms
    const timer = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          setActiveIndex((current) => (current + 1) % showcaseSlides.length);
          return 0;
        }
        return prev + (intervalStep / SLIDE_DURATION) * 100;
      });
    }, intervalStep);

    return () => clearInterval(timer);
  }, [isAutoPlaying, isHovered, activeIndex]);

  const handleNext = () => {
    setProgress(0);
    setActiveIndex((prev) => (prev + 1) % showcaseSlides.length);
  };

  const handlePrev = () => {
    setProgress(0);
    setActiveIndex((prev) => (prev - 1 + showcaseSlides.length) % showcaseSlides.length);
  };

  const handleSelect = (idx: number) => {
    setProgress(0);
    setActiveIndex(idx);
  };

  const openLightbox = (imgUrl: string, title: string) => {
    setLightboxImage(imgUrl);
    setLightboxTitle(title);
  };

  return (
    <section
      className="py-16 sm:py-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto relative overflow-hidden"
      id="platform-gallery"
    >
      {/* Ambient background glows */}
      <div className="absolute top-1/4 left-10 w-72 sm:w-96 h-72 sm:h-96 bg-blue-600/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-10 right-10 w-72 sm:w-96 h-72 sm:h-96 bg-emerald-600/10 rounded-full blur-3xl pointer-events-none" />

      {/* Section Header */}
      <div className="text-center max-w-3xl mx-auto mb-10 sm:mb-14">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full border border-blue-500/30 bg-blue-500/10 backdrop-blur-md text-xs font-semibold text-blue-300 mb-4 shadow-sm">
          <Sparkles size={13} className="text-blue-400" />
          <span>Interactive Visual Platform Showcase</span>
        </div>
        <h2 className="text-3xl sm:text-4xl lg:text-5xl font-display font-bold text-white mb-4 tracking-tight">
          Experience NovaEq{' '}
          <span className="bg-gradient-to-r from-blue-400 via-sky-300 to-emerald-400 bg-clip-text text-transparent">
            In Action
          </span>
        </h2>
        <p className="text-slate-400 text-sm sm:text-base leading-relaxed max-w-2xl mx-auto">
          High-performance trading terminals, predictive AI models, automated backtesting suites, and institutional risk analytics engineered for market precision.
        </p>
      </div>

      {/* ========================================================================= */}
      {/* 1. HERO SHOWCASE CARD WITH AUTO-SCROLL CAROUSEL & CONTROLS                */}
      {/* ========================================================================= */}
      <div
        className="border border-[#1c2a45] bg-gradient-to-b from-[#0e1a33]/90 via-[#0a1326]/90 to-[#070d1a]/95 backdrop-blur-xl rounded-2xl sm:rounded-3xl p-4 sm:p-7 lg:p-9 shadow-[0_20px_60px_-20px_rgba(0,0,0,0.8)] relative overflow-hidden mb-10 sm:mb-14"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        {/* Top Control Bar: Tabs & Play/Pause */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-5 border-b border-[#1c2a45]/80">
          {/* Slide Tab Buttons with Horizontal Scroll on Mobile */}
          <div className="flex items-center gap-2 overflow-x-auto pb-2 md:pb-0 scrollbar-none max-w-full">
            {showcaseSlides.map((slide, idx) => {
              const isActive = idx === activeIndex;
              const IconComp = slide.icon;
              return (
                <button
                  key={slide.id}
                  onClick={() => handleSelect(idx)}
                  className={`px-3 sm:px-3.5 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all duration-200 flex items-center gap-2 flex-shrink-0 ${
                    isActive
                      ? 'bg-blue-600 text-white shadow-md shadow-blue-500/25 border border-blue-400/40'
                      : 'bg-[#12203d]/60 text-slate-400 hover:text-slate-200 hover:bg-[#182b52] border border-[#1c2a45]'
                  }`}
                >
                  <IconComp size={13} className={isActive ? 'text-white' : 'text-slate-400'} />
                  <span>{slide.shortTitle}</span>
                </button>
              );
            })}
          </div>

          {/* Autoplay & Navigation Controls */}
          <div className="flex items-center justify-between sm:justify-end gap-2.5">
            <button
              onClick={() => setIsAutoPlaying(!isAutoPlaying)}
              className="px-3 py-1.5 rounded-lg border border-[#1c2a45] bg-[#0f1c33]/70 hover:bg-[#162747] text-slate-300 text-xs font-medium flex items-center gap-1.5 transition-colors"
              title={isAutoPlaying ? 'Pause Auto Scroll' : 'Start Auto Scroll'}
            >
              {isAutoPlaying ? (
                <>
                  <Pause size={12} className="text-amber-400" />
                  <span className="hidden sm:inline">Auto Scroll: On</span>
                  <span className="sm:hidden">Auto: On</span>
                </>
              ) : (
                <>
                  <Play size={12} className="text-emerald-400" />
                  <span className="hidden sm:inline">Auto Scroll: Paused</span>
                  <span className="sm:hidden">Paused</span>
                </>
              )}
            </button>

            <div className="flex items-center gap-1">
              <button
                onClick={handlePrev}
                className="w-8 h-8 rounded-lg border border-[#1c2a45] bg-[#0f1c33]/70 hover:bg-blue-600/30 hover:border-blue-500/40 text-slate-300 flex items-center justify-center transition-all"
                title="Previous Slide"
              >
                <ChevronLeft size={16} />
              </button>
              <button
                onClick={handleNext}
                className="w-8 h-8 rounded-lg border border-[#1c2a45] bg-[#0f1c33]/70 hover:bg-blue-600/30 hover:border-blue-500/40 text-slate-300 flex items-center justify-center transition-all"
                title="Next Slide"
              >
                <ChevronRight size={16} />
              </button>
            </div>
          </div>
        </div>

        {/* Progress Bar for Active Auto-Scroll */}
        <div className="w-full h-1 bg-[#15233e] rounded-full overflow-hidden my-5">
          <div
            className="h-full bg-gradient-to-r from-blue-500 via-sky-400 to-emerald-400 transition-all duration-75 ease-linear"
            style={{ width: `${isAutoPlaying && !isHovered ? progress : 100}%` }}
          />
        </div>

        {/* Slide Content Grid: Image Preview (Left) + Details (Right) */}
        <div className="grid lg:grid-cols-12 gap-6 lg:gap-8 items-center">
          {/* Image Showcase Box with Interactive Zoom & Overlay */}
          <div className="lg:col-span-7 relative group">
            <div
              className="relative rounded-2xl overflow-hidden border border-[#1c2a45] bg-[#091122] shadow-2xl aspect-[16/10] sm:aspect-[16/9.5] flex items-center justify-center cursor-pointer"
              onClick={() => openLightbox(currentSlide.imageUrl, currentSlide.title)}
            >
              <img
                src={currentSlide.imageUrl}
                alt={currentSlide.title}
                className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-700 ease-out"
                loading="lazy"
              />

              {/* Gradient Vignette Overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-[#070d1a] via-transparent to-black/30 pointer-events-none" />

              {/* Top Left Floating Tag */}
              <div className="absolute top-3 sm:top-4 left-3 sm:left-4 z-10 flex flex-wrap items-center gap-1.5 sm:gap-2">
                <span className="px-2.5 sm:px-3 py-1 rounded-full text-[11px] sm:text-xs font-mono font-bold bg-[#070d1a]/90 border border-[#1c2a45] text-emerald-400 backdrop-blur-md shadow-lg flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-emerald-400 live-dot-pulse" />
                  {currentSlide.badge}
                </span>
                <span className="px-2.5 sm:px-3 py-1 rounded-full text-[11px] sm:text-xs font-mono font-semibold bg-blue-600/85 text-white backdrop-blur-md shadow-md border border-blue-400/40">
                  {currentSlide.category}
                </span>
              </div>

              {/* Zoom / Lightbox Trigger Button */}
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  openLightbox(currentSlide.imageUrl, currentSlide.title);
                }}
                className="absolute bottom-3 sm:bottom-4 right-3 sm:right-4 z-10 p-2 sm:p-2.5 rounded-xl bg-[#0b1428]/90 hover:bg-blue-600 text-white border border-[#1c2a45] hover:border-blue-400/50 backdrop-blur-md shadow-lg transition-all transform group-hover:scale-105 flex items-center gap-1.5 text-xs font-medium"
                title="Click to zoom image"
              >
                <Maximize2 size={13} />
                <span className="hidden sm:inline">Inspect Fullscreen</span>
              </button>

              {/* Bottom Image Caption Bar */}
              <div className="absolute bottom-3 sm:bottom-4 left-3 sm:left-4 z-10 max-w-[70%] hidden sm:block">
                <span className="text-[11px] font-mono text-slate-300 bg-black/70 px-2.5 py-1 rounded-md backdrop-blur-sm line-clamp-1 border border-white/10">
                  {currentSlide.tagline}
                </span>
              </div>
            </div>
          </div>

          {/* Details & Features Column */}
          <div className="lg:col-span-5 flex flex-col justify-between">
            <div>
              <div className="flex items-center gap-2 mb-1.5">
                <span className="text-xs font-mono uppercase tracking-widest text-blue-400 font-bold">
                  {currentSlide.category}
                </span>
              </div>

              <h3 className="text-xl sm:text-2xl lg:text-3xl font-display font-bold text-white mb-3 leading-snug">
                {currentSlide.title}
              </h3>

              <p className="text-slate-300 text-xs sm:text-sm leading-relaxed mb-5">
                {currentSlide.description}
              </p>

              {/* Live Metrics Grid */}
              <div className="grid grid-cols-3 gap-2 p-3 sm:p-3.5 rounded-2xl bg-[#0b1428] border border-[#1c2a45] mb-5">
                {currentSlide.metrics.map((m, i) => (
                  <div key={i} className="text-center">
                    <span className="text-[10px] font-mono text-slate-400 uppercase block mb-0.5">
                      {m.label}
                    </span>
                    <b
                      className={`text-xs sm:text-sm md:text-base font-display font-bold ${
                        m.positive ? 'text-emerald-400' : 'text-slate-100'
                      }`}
                    >
                      {m.value}
                    </b>
                  </div>
                ))}
              </div>

              {/* Feature Highlights Checklist */}
              <div className="space-y-2 mb-6">
                {currentSlide.features.map((feat, i) => (
                  <div key={i} className="flex items-start gap-2.5 text-xs sm:text-sm text-slate-300">
                    <CheckCircle2 size={14} className="text-emerald-400 flex-shrink-0 mt-0.5" />
                    <span>{feat}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* CTA Button for Active Feature */}
            <div className="flex items-center gap-3">
              <button
                onClick={() => navigate(currentSlide.route)}
                className="inline-flex items-center gap-2 bg-gradient-to-r from-blue-500 to-blue-700 hover:from-blue-600 hover:to-blue-800 text-white font-semibold text-xs sm:text-sm py-2.5 sm:py-3 px-5 sm:px-6 rounded-xl shadow-lg shadow-blue-500/25 hover:-translate-y-0.5 transition-all"
              >
                <span>Launch {currentSlide.shortTitle}</span>
                <ExternalLink size={14} />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* 2. CONTINUOUS AUTO-SCROLLING MARQUEE OF PLATFORM SCREENSHOT CARDS         */}
      {/* ========================================================================= */}
      <div className="relative">
        <div className="flex items-center justify-between mb-4 px-1">
          <div>
            <h4 className="text-base sm:text-lg font-display font-bold text-white flex items-center gap-2">
              <span>Continuous Platform Visual Stream</span>
              <span className="text-[10px] sm:text-xs font-mono font-normal text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-full border border-emerald-500/20">
                Live Auto-Scroll
              </span>
            </h4>
            <p className="text-xs text-slate-400">Hover over any visual card to pause scrolling and inspect details.</p>
          </div>
        </div>

        {/* Marquee Wrapper with Edge Fade Gradients */}
        <div className="relative overflow-hidden rounded-2xl border border-[#1c2a45] bg-[#0a1224]/80 py-3 sm:py-4 select-none">
          {/* Left & Right Shadow Gradients */}
          <div className="absolute left-0 top-0 bottom-0 w-12 sm:w-20 bg-gradient-to-r from-[#0a1224] to-transparent z-10 pointer-events-none" />
          <div className="absolute right-0 top-0 bottom-0 w-12 sm:w-20 bg-gradient-to-l from-[#0a1224] to-transparent z-10 pointer-events-none" />

          {/* Marquee Track (Repeated twice for seamless loop) */}
          <div className="flex gap-4 animate-tape hover:[animation-play-state:paused] w-max cursor-pointer">
            {[...marqueeCards, ...marqueeCards].map((img, idx) => (
              <div
                key={idx}
                onClick={() => openLightbox(img.url, img.title)}
                className="w-64 sm:w-80 flex-shrink-0 bg-[#0e1a33] border border-[#1c2a45] hover:border-blue-500/50 rounded-2xl overflow-hidden p-3 transition-all duration-300 hover:-translate-y-1 hover:shadow-xl group"
              >
                <div className="relative aspect-[16/10] rounded-xl overflow-hidden mb-2.5 bg-[#060b14]">
                  <img
                    src={img.url}
                    alt={img.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    loading="lazy"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-transparent to-black/20" />
                  <span className="absolute top-2 left-2 text-[10px] font-mono px-2 py-0.5 rounded bg-black/75 border border-white/10 text-slate-200 backdrop-blur-sm">
                    {img.tag}
                  </span>
                  <div className="absolute bottom-2 right-2 p-1.5 rounded-lg bg-black/70 text-white group-hover:bg-blue-600 transition-colors">
                    <Maximize2 size={12} />
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <h5 className="text-xs font-display font-bold text-white group-hover:text-blue-300 transition-colors">
                      {img.title}
                    </h5>
                    <span className="text-[11px] text-slate-400">{img.subtitle}</span>
                  </div>
                  <span className="text-[10px] font-mono text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20">
                    {img.badge}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* 3. FULLSCREEN IMAGE LIGHTBOX MODAL                                         */}
      {/* ========================================================================= */}
      {lightboxImage && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/90 backdrop-blur-lg animate-fadeIn"
          onClick={() => setLightboxImage(null)}
        >
          <div
            className="relative max-w-5xl w-full bg-[#0b1428] border border-[#1c2a45] rounded-2xl sm:rounded-3xl overflow-hidden shadow-2xl p-3 sm:p-4"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between px-2 sm:px-3 py-2 border-b border-[#1c2a45]/60 mb-3">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 live-dot-pulse" />
                <span className="text-xs sm:text-sm font-mono text-slate-200 font-semibold truncate max-w-[240px] sm:max-w-none">
                  {lightboxTitle || 'NovaEq Platform Visual'}
                </span>
              </div>
              <button
                onClick={() => setLightboxImage(null)}
                className="w-8 h-8 rounded-full bg-[#1c2a45] hover:bg-rose-500 text-slate-200 hover:text-white flex items-center justify-center transition-colors"
                title="Close"
              >
                <X size={16} />
              </button>
            </div>

            <div className="rounded-xl sm:rounded-2xl overflow-hidden aspect-[16/10] sm:aspect-[16/9] bg-black">
              <img
                src={lightboxImage}
                alt={lightboxTitle || 'NovaEq High Resolution Visual'}
                className="w-full h-full object-contain"
              />
            </div>

            <div className="flex items-center justify-between mt-3 px-2 sm:px-3 py-1 text-xs text-slate-400">
              <span className="hidden sm:inline">Click outside or press Close to exit fullscreen</span>
              <button
                onClick={() => setLightboxImage(null)}
                className="px-4 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-medium transition-colors ml-auto"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};

export default PlatformGalleryShowcase;

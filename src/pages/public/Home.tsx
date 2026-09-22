import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Brain,
  Zap,
  BarChart2,
  Shield,
  Users,
  BookOpen,
  ArrowRight,
  Play,
  Check,
  X,
  ExternalLink,
  Sparkles,
  Layers,
  ChevronRight,
  TrendingUp,
  Activity,
  Award,
} from 'lucide-react';
import ThreeCandlestickTerrain from '@/components/home/ThreeCandlestickTerrain';
import LiveSparklineCanvas from '@/components/home/LiveSparklineCanvas';
import TiltCard from '@/components/home/TiltCard';
import InteractiveDeck3D, { AISignalCardData } from '@/components/home/InteractiveDeck3D';
import MarketTickerTape from '@/components/home/MarketTickerTape';
import AnimatedCounter from '@/components/home/AnimatedCounter';
import { useAppStore } from '@/stores/useAppStore';

interface FeatureModalData {
  id: string;
  title: string;
  category: string;
  badge: string;
  icon: any;
  color: string;
  description: string;
  highlights: string[];
  capabilities: { label: string; detail: string }[];
  targetRoute: string;
  dashboardTab?: string;
  metrics?: { label: string; val: string }[];
}

const Home: React.FC = () => {
  const navigate = useNavigate();
  const { isLoggedIn, openAuthModal, currentUser } = useAppStore();

  // Selected Card Modal State
  const [selectedFeature, setSelectedFeature] = useState<FeatureModalData | null>(null);

  // Mouse Parallax for Hero Panel & Typography
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const heroRef = useRef<HTMLElement | null>(null);

  // Live Ticking Portfolio Values
  const [portfolioVal, setPortfolioVal] = useState(284750);
  const [dayPnL, setDayPnL] = useState(6452.3);
  const [stockPrices, setStockPrices] = useState({
    NVDA: 875.3,
    AAPL: 193.42,
    TSLA: 178.3,
  });

  useEffect(() => {
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReducedMotion) return;

    const interval = setInterval(() => {
      const delta = (Math.random() - 0.45) * 80;
      setPortfolioVal((prev) => Math.round(prev + delta));
      setDayPnL((prev) => Math.max(100, prev + (Math.random() - 0.45) * 45));

      setStockPrices((prev) => ({
        NVDA: Number((prev.NVDA * (1 + (Math.random() - 0.48) * 0.003)).toFixed(2)),
        AAPL: Number((prev.AAPL * (1 + (Math.random() - 0.49) * 0.002)).toFixed(2)),
        TSLA: Number((prev.TSLA * (1 + (Math.random() - 0.51) * 0.004)).toFixed(2)),
      }));
    }, 1600);

    return () => clearInterval(interval);
  }, []);

  const handleHeroMouseMove = (e: React.MouseEvent<HTMLElement>) => {
    if (!heroRef.current) return;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    if (window.matchMedia('(pointer: coarse)').matches) return;

    const rect = heroRef.current.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width - 0.5;
    const y = (e.clientY - rect.top) / rect.height - 0.5;
    setMousePos({ x, y });
  };

  const handleHeroMouseLeave = () => {
    setMousePos({ x: 0, y: 0 });
  };

  const platformFeatures: FeatureModalData[] = [
    {
      id: 'ai-insights',
      title: 'AI-Powered Insights',
      category: 'Institutional Intelligence',
      badge: 'Machine Learning V3',
      icon: Brain,
      color: 'blue',
      description:
        'Our proprietary deep learning engine continuously evaluates 500+ quantitative and qualitative metrics across equities. It synthesizes quarterly financial filings, real-time options order flows, sector sentiment, and multi-factor macro indicators to produce high-probability trading setups.',
      highlights: [
        'Multi-factor machine learning models with 87.4% historical directional accuracy',
        'Instant multi-timeframe catalysts: earnings surprises, insider accumulation, and breakout detection',
        'Dynamic risk-reward scoring calibrated to individual risk tolerance profiles',
        'Automated sector rotation tracking across NIFTY, NASDAQ, and global indices',
      ],
      capabilities: [
        { label: 'Signal Engine', detail: 'Real-time BUY / SELL / HOLD ratings with confidence levels.' },
        { label: 'Sentiment Index', detail: 'Analyzes 10,000+ daily financial news articles & social feeds.' },
        { label: 'Valuation Matrix', detail: 'DCF, EV/EBITDA, and relative historical multiples updated live.' },
        { label: 'Risk Calibrator', detail: 'Tailors position sizing recommendations to protect your portfolio.' },
      ],
      metrics: [
        { label: 'Alpha Generated', val: '+28.4% YoY' },
        { label: 'Signals / Week', val: '45+ Verified' },
        { label: 'Data Points / Stock', val: '500+ Live' },
      ],
      targetRoute: '/ai-insights',
      dashboardTab: 'portfolio',
    },
    {
      id: 'algo-trading',
      title: 'Algorithmic Trading',
      category: 'Automated Execution',
      badge: 'Zero-Code & Python API',
      icon: Zap,
      color: 'emerald',
      description:
        'Design, simulate, and execute high-performance algorithmic trading strategies without writing complex code. Connect directly to exchange brokerages with ultra-low latency execution, smart trailing stop-losses, and automated portfolio rebalancing.',
      highlights: [
        'Visual drag-and-drop strategy builder with 80+ pre-built mathematical triggers',
        '10-year tick-by-tick backtesting engine with realistic slippage and fee modeling',
        'Sub-millisecond smart order routing directly to major brokerages and exchanges',
        'Continuous risk bounds monitoring with automated circuit breakers and max drawdown caps',
      ],
      capabilities: [
        { label: 'Visual Builder', detail: 'Construct RSI, MACD, Volume Profile, and Mean-Reversion rules in minutes.' },
        { label: 'Backtester', detail: 'Simulate against 10+ years of historical market tick data instantly.' },
        { label: 'Webhooks & API', detail: 'Integrate custom TradingView alerts or Python scripts seamlessly.' },
        { label: 'Live Auto-Pilot', detail: 'Hands-off trade placement with multi-broker execution support.' },
      ],
      metrics: [
        { label: 'Execution Speed', val: '< 12ms Avg' },
        { label: 'Active Bots', val: '14,200+' },
        { label: 'Strategy Templates', val: '35+ Ready' },
      ],
      targetRoute: '/learn',
      dashboardTab: 'trading',
    },
    {
      id: 'advanced-analytics',
      title: 'Advanced Analytics',
      category: 'Market Intelligence',
      badge: 'Pro Charting & Heatmaps',
      icon: BarChart2,
      color: 'amber',
      description:
        'Experience institutional grade charting powered by TradingView engines with real-time level 2 order books, multi-timeframe sector heatmaps, volume profile analysis, and options chain volatility surfaces.',
      highlights: [
        '80+ professional technical indicators including Supertrend, Fibonacci, VWAP, and Bollinger Bands',
        'Live market breadth trackers and sector correlation matrices',
        'Unusual options activity scanner detecting institutional block trades and dark pool flows',
        'Custom watchlists with cloud sync and multi-device push notifications',
      ],
      capabilities: [
        { label: 'Pro Charting', detail: 'Interactive candlestick, Renko, and Heikin-Ashi multi-charts.' },
        { label: 'Sector Heatmaps', detail: 'Live visual capital flow maps across all market sectors.' },
        { label: 'Order Book Depth', detail: 'Real-time Level 2 bid/ask liquidity visualization.' },
        { label: 'Smart Alerts', detail: 'Price alerts triggered by volatility, volume surges, or breakout lines.' },
      ],
      metrics: [
        { label: 'Data Latency', val: '< 50ms Live' },
        { label: 'Indicators', val: '80+ Built-in' },
        { label: 'Tracked Assets', val: '5,000+ Stocks' },
      ],
      targetRoute: '/markets',
      dashboardTab: 'markets',
    },
    {
      id: 'smart-risk',
      title: 'Smart Risk Management',
      category: 'Capital Protection',
      badge: 'Institutional Grade',
      icon: Shield,
      color: 'purple',
      description:
        'Protect your capital like an institutional fund. NovaEq automatically assesses your portfolio concentration risk, stress-tests against historical black-swan events, and calculates real-time Value-at-Risk (VaR).',
      highlights: [
        'Real-time portfolio stress testing against 2008 Crash, 2020 Pandemic, and Rate Hikes',
        'Automated Value-at-Risk (VaR) and conditional drawdown calculations',
        'Sector and asset concentration alerts to prevent overexposure',
        'Automated stop-loss trailing and hedging suggestion alerts',
      ],
      capabilities: [
        { label: 'VaR Calculator', detail: 'Predicts maximum estimated loss under 95% and 99% confidence intervals.' },
        { label: 'Stress Tester', detail: 'Simulates portfolio performance across extreme macro scenarios.' },
        { label: 'Rebalance Helper', detail: 'Generates optimal rebalancing orders to keep allocation on target.' },
        { label: 'Downside Shields', detail: 'Automated triggers to lock in profits and trim struggling holdings.' },
      ],
      metrics: [
        { label: 'Risk Coverage', val: '100% Monitored' },
        { label: 'Max Drawdown Saved', val: '14.2% Avg' },
        { label: 'Stress Scenarios', val: '18+ Presets' },
      ],
      targetRoute: '/markets',
      dashboardTab: 'portfolio',
    },
    {
      id: 'social-investing',
      title: 'Social Investing Network',
      category: 'Collaborative Alpha',
      badge: '125K+ Community',
      icon: Users,
      color: 'cyan',
      description:
        'Connect with verified high-performing investors, study verified trade logs, share actionable theses, and optionally copy vetted portfolio strategies in real time with transparent track records.',
      highlights: [
        'Verified trader leaderboards with audited win rates, Sharpe ratios, and total returns',
        'Live trade idea feeds with bullish/bearish sentiment tags and thesis breakdowns',
        'One-click portfolio copy trading with proportional position sizing and risk caps',
        'Interactive community discussions, comments, and direct peer collaboration',
      ],
      capabilities: [
        { label: 'Verified Rankings', detail: 'Audit-checked monthly leaderboard of the top market performers.' },
        { label: 'Copy Trading', detail: 'Mirror top portfolios automatically with custom allocation limits.' },
        { label: 'Insight Sharing', detail: 'Publish research notes and chart setups to build your following.' },
        { label: 'Peer Chat', detail: 'Discuss breaking news and earnings releases with seasoned traders.' },
      ],
      metrics: [
        { label: 'Verified Traders', val: '12,500+' },
        { label: 'Ideas Shared Daily', val: '8,400+' },
        { label: 'Top Trader Return', val: '+68.4% YTD' },
      ],
      targetRoute: '/community',
      dashboardTab: 'social',
    },
    {
      id: 'learning-academy',
      title: 'NovaEq Learning Academy',
      category: 'Education & Masterclasses',
      badge: '60+ Masterclasses',
      icon: BookOpen,
      color: 'indigo',
      description:
        'Master the financial markets from fundamentals to advanced quantitative modeling. Enjoy interactive video masterclasses, downloadable cheatsheets, live market webinars, and interactive knowledge quizzes.',
      highlights: [
        'Structured learning paths: Beginner Investor, Technical Analyst, and Options Quant',
        'Video masterclasses with full chapter progress tracking and completion certificates',
        'Weekly live webinars with senior SEBI-registered research analysts',
        'Comprehensive market blog with daily macro insights and actionable trade breakdowns',
      ],
      capabilities: [
        { label: 'Interactive Player', detail: 'Video player with modular curriculum, notes, and speed controls.' },
        { label: 'Live Webinars', detail: 'One-click registration for live analyst Q&A and trade breakdowns.' },
        { label: 'Research Blog', detail: 'Publish your own articles or learn from top financial writers.' },
        { label: 'Certifications', detail: 'Earn verified skill credentials upon passing module assessments.' },
      ],
      metrics: [
        { label: 'Courses Available', val: '60+ Modules' },
        { label: 'Active Students', val: '48,000+' },
        { label: 'Live Webinars / Wk', val: '4 Sessions' },
      ],
      targetRoute: '/learn',
      dashboardTab: 'portfolio',
    },
  ];

  const workflowSteps: FeatureModalData[] = [
    {
      id: 'step-01',
      title: 'Step 1: Instant Account Setup',
      category: 'Getting Started',
      badge: 'Under 2 Minutes',
      icon: Shield,
      color: 'blue',
      description:
        'Getting started on NovaEq is completely frictionless. Complete digital KYC in under 2 minutes with paperless verification, instant bank linking, and zero maintenance fees.',
      highlights: [
        '100% paperless digital verification compliant with industry security standards',
        'Instant multi-bank link via UPI and secure net banking gateways',
        'Free forever plan with full access to market feeds and basic AI signals',
        'Complete encryption and enterprise-grade 256-bit security',
      ],
      capabilities: [
        { label: 'Quick KYC', detail: 'Automated document verification with instant status approvals.' },
        { label: 'Multi-Broker Link', detail: 'Connect your existing broker or trade directly through NovaEq.' },
        { label: 'Zero Fees', detail: 'No hidden setup or annual maintenance charges.' },
      ],
      targetRoute: '/create-account',
      dashboardTab: 'portfolio',
    },
    {
      id: 'step-02',
      title: 'Step 2: AI Risk Profiling',
      category: 'Personalization',
      badge: 'Dynamic Calibration',
      icon: Brain,
      color: 'emerald',
      description:
        'Tell NovaEq your goals, investment horizon, and comfort level with volatility. Our neural network tailors every market recommendation, stop-loss threshold, and asset allocation strategy specifically to your persona.',
      highlights: [
        'Calibrated risk scoring based on investment duration and capital requirements',
        'Dynamic equity-to-debt asset allocation suggestions',
        'Personalized risk-reward guardrails to prevent emotional over-leveraging',
        'Update or adjust your risk parameters at any time from your settings',
      ],
      capabilities: [
        { label: 'Horizon Matching', detail: 'Optimizes for intraday, swing, or multi-year wealth accumulation.' },
        { label: 'Volatility Guard', detail: 'Sets strict drawdown caps to safeguard principal capital.' },
        { label: 'Adaptive Model', detail: 'Learns from your historical trading style over time.' },
      ],
      targetRoute: '/ai-insights',
      dashboardTab: 'portfolio',
    },
    {
      id: 'step-03',
      title: 'Step 3: Review Live High-Conviction Signals',
      category: 'Market Execution',
      badge: 'Actionable Intelligence',
      icon: Zap,
      color: 'amber',
      description:
        'Gain immediate access to verified BUY and SELL signals generated by our AI engine. Each recommendation comes with clear entry targets, multi-level profit goals, stop-loss bounds, and an explanation of the underlying catalyst.',
      highlights: [
        'Clear, unambiguous BUY / SELL / ACCUMULATE ratings with confidence percentages',
        'Transparent technical and fundamental catalysts documented for every signal',
        'Instant push and email notifications whenever high-probability setups trigger',
        'Historical signal performance ledger showing full transparency and win rates',
      ],
      capabilities: [
        { label: 'Target Projections', detail: 'Precise Target 1, Target 2, and Target 3 profit levels.' },
        { label: 'Stop-Loss Triggers', detail: 'Hard stop-loss guidelines calculated using Average True Range (ATR).' },
        { label: 'Catalyst Breakdown', detail: 'Summary of earnings momentum, volume spikes, or valuation gaps.' },
      ],
      targetRoute: '/ai-insights',
      dashboardTab: 'markets',
    },
    {
      id: 'step-04',
      title: 'Step 4: Deploy & Auto-Invest',
      category: 'Portfolio Scaling',
      badge: 'One-Click Execution',
      icon: BarChart2,
      color: 'purple',
      description:
        'Execute trades with a single click or let NovaEq algorithmic bots manage your positions automatically with smart trailing orders, automated rebalancing, and disciplined profit-taking.',
      highlights: [
        'One-click multi-leg order execution directly from your dashboard',
        'Automated algorithmic bot activation with predefined risk thresholds',
        'Smart trailing profit stops that lock in gains as stocks climb',
        'Comprehensive real-time P&L tracking with automated tax-ready reporting',
      ],
      capabilities: [
        { label: 'Smart Execution', detail: 'Dispatches orders with zero slippage and optimal timing.' },
        { label: 'Trailing Stops', detail: 'Locks in gains dynamically as the stock moves in your favor.' },
        { label: 'P&L Analytics', detail: 'Live portfolio dashboard with interactive performance breakdown.' },
      ],
      targetRoute: '/markets',
      dashboardTab: 'trading',
    },
  ];

  const handleOpenFeatureModal = (feature: FeatureModalData) => {
    setSelectedFeature(feature);
  };

  const handleOpenStepModal = (step: FeatureModalData) => {
    setSelectedFeature(step);
  };

  const handleLaunchInDashboard = (tab?: string) => {
    if (!isLoggedIn) {
      openAuthModal('Access NovaEq Dashboard — sign in to manage your portfolio and trades.');
      return;
    }
    const rolePath = currentUser?.role === 'trader' ? '/dashboard/trader' : '/dashboard/investor';
    navigate(rolePath, { state: { activeTab: tab || 'overview' } });
  };

  return (
    <div className="min-h-screen bg-[#070d1a] text-[#f8fafc] overflow-x-hidden selection:bg-blue-500/30 selection:text-white">
      {/* 3D HERO SECTION */}
      <section
        ref={heroRef}
        id="hero"
        onMouseMove={handleHeroMouseMove}
        onMouseLeave={handleHeroMouseLeave}
        className="relative min-h-screen flex items-center pt-28 pb-20 px-4 sm:px-6 lg:px-8 overflow-hidden"
      >
        {/* Three.js Interactive 3D Candlestick Canvas */}
        <ThreeCandlestickTerrain />

        {/* Ambient Glows */}
        <div
          className="absolute inset-0 pointer-events-none z-[1]"
          style={{
            background:
              'radial-gradient(60% 50% at 18% 34%, rgba(29, 78, 216, 0.28), transparent 70%), radial-gradient(45% 45% at 84% 22%, rgba(16, 185, 129, 0.16), transparent 72%), linear-gradient(180deg, rgba(7, 13, 26, 0.6) 0%, rgba(7, 13, 26, 0.12) 42%, rgba(7, 13, 26, 0.25) 78%, rgba(7, 13, 26, 0.85) 100%)',
          }}
        />

        {/* Hero Content Container */}
        <div className="relative z-10 max-w-7xl mx-auto w-full grid lg:grid-cols-[1.05fr_0.95fr] gap-12 lg:gap-16 items-center">
          {/* Left: Typography & Actions */}
          <div className="relative">
            {/* Live Indicator Badge */}
            <div className="inline-flex items-center gap-2.5 px-4 py-1.5 rounded-full border border-[#1c2a45] bg-[#0f1c33]/80 backdrop-blur-md text-xs font-semibold text-slate-300 mb-6 shadow-sm">
              <span className="w-2 h-2 rounded-full bg-emerald-400 live-dot-pulse" />
              <span>
                Live: Markets Open — NIFTY <strong className="text-emerald-400">+0.21%</strong>
              </span>
            </div>

            {/* Depth Parallax Heading */}
            <h1 className="text-5xl sm:text-6xl lg:text-7xl font-display font-bold tracking-tight leading-[1.06] mb-6">
              <span
                style={{
                  transform: `translate3d(${-mousePos.x * 8}px, ${-mousePos.y * 4}px, 0)`,
                }}
                className="block will-change-transform"
              >
                Invest Smarter
              </span>
              <span
                style={{
                  transform: `translate3d(${-mousePos.x * 16}px, ${-mousePos.y * 8}px, 0)`,
                }}
                className="block will-change-transform"
              >
                with{' '}
                <span className="bg-gradient-to-r from-blue-400 via-sky-300 to-emerald-400 bg-clip-text text-transparent font-extrabold">
                  AI-Powered
                </span>
              </span>
              <span
                style={{
                  transform: `translate3d(${-mousePos.x * 24}px, ${-mousePos.y * 12}px, 0)`,
                }}
                className="block will-change-transform"
              >
                Precision
              </span>
            </h1>

            {/* Description */}
            <p className="text-lg text-slate-400 leading-relaxed max-w-xl mb-8">
              Institutional-grade market intelligence, AI recommendations, algorithmic trading, and
              social investing — all in one unified platform built for the modern investor.
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-wrap gap-4 mb-8">
              <button
                onClick={() => navigate('/create-account')}
                className="inline-flex items-center gap-2.5 bg-gradient-to-r from-blue-500 to-blue-700 hover:from-blue-600 hover:to-blue-800 text-white font-semibold text-sm sm:text-base py-3.5 px-7 rounded-xl shadow-[0_10px_30px_-12px_rgba(59,130,246,0.85)] hover:shadow-[0_16px_38px_-14px_rgba(59,130,246,1)] hover:-translate-y-0.5 transition-all duration-200 group border border-blue-400/30"
              >
                <span>Start Free Today</span>
                <ArrowRight
                  size={16}
                  className="group-hover:translate-x-1 transition-transform duration-200"
                />
              </button>

              <button
                onClick={() =>
                  handleProtectedAction(
                    'Watch the NovaEq platform interactive demo — create a free account to get started.'
                  )
                }
                className="inline-flex items-center gap-2.5 bg-slate-800/40 hover:bg-slate-700/50 text-slate-200 border border-[#1c2a45] font-semibold text-sm sm:text-base py-3.5 px-6 rounded-xl hover:-translate-y-0.5 transition-all duration-200"
              >
                <span className="w-0 h-0 border-l-[7px] border-l-emerald-400 border-y-[4.5px] border-y-transparent" />
                <span>Watch Demo</span>
              </button>
            </div>

            {/* Micro Badges */}
            <ul className="flex flex-wrap gap-5 text-xs text-slate-400 font-medium">
              {['No credit card required', 'Free forever plan', 'SEBI compliant'].map((item) => (
                <li key={item} className="flex items-center gap-2">
                  <span className="w-4 h-4 rounded-full bg-emerald-500/20 border border-emerald-500/50 flex items-center justify-center">
                    <Check size={10} className="text-emerald-400" />
                  </span>
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Right: 3D Perspective Glass Hero Panel */}
          <div className="relative pt-6 lg:pt-0">
            <div
              className="hero-glass-panel p-6 sm:p-7 relative z-10"
              style={{
                transform: `perspective(1000px) rotateY(${-mousePos.x * 7}deg) rotateX(${
                  mousePos.y * 6
                }deg)`,
              }}
            >
              {/* Card Header */}
              <div className="flex items-start justify-between gap-4 pb-4 border-b border-[#1c2a45]/80">
                <div>
                  <h3 className="font-display font-bold text-lg text-nova-text">
                    Portfolio Overview
                  </h3>
                  <p className="text-xs text-slate-400">Live market snapshot · USD</p>
                </div>
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold text-emerald-400 bg-emerald-500/10 border border-emerald-500/30">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 live-dot-pulse" />
                  Live
                </span>
              </div>

              {/* KPIs */}
              <div className="grid grid-cols-3 gap-3 my-5">
                <div>
                  <span className="text-xs text-slate-400 block mb-0.5">Total Value</span>
                  <b className="font-mono text-xl sm:text-2xl font-bold text-slate-100">
                    ${portfolioVal.toLocaleString('en-US')}
                  </b>
                </div>
                <div>
                  <span className="text-xs text-slate-400 block mb-0.5">Day P&L</span>
                  <b className="font-mono text-xl sm:text-2xl font-bold text-emerald-400">
                    +${Math.round(dayPnL).toLocaleString('en-US')}
                  </b>
                </div>
                <div>
                  <span className="text-xs text-slate-400 block mb-0.5">Returns</span>
                  <b className="font-mono text-xl sm:text-2xl font-bold text-emerald-400">+13.9%</b>
                </div>
              </div>

              {/* Live Canvas Sparkline */}
              <div className="my-3">
                <LiveSparklineCanvas />
              </div>

              {/* Live Stocks List */}
              <div className="divide-y divide-[#1c2a45]/70 pt-2 text-sm">
                <div className="flex items-center justify-between py-2.5">
                  <span className="inline-flex items-center gap-2 font-medium text-slate-200">
                    <span className="w-2 h-2 rounded-full bg-emerald-400" />
                    NVDA
                  </span>
                  <span className="font-mono text-slate-300">${stockPrices.NVDA.toFixed(2)}</span>
                  <span className="font-mono font-semibold text-emerald-400">+2.16%</span>
                </div>
                <div className="flex items-center justify-between py-2.5">
                  <span className="inline-flex items-center gap-2 font-medium text-slate-200">
                    <span className="w-2 h-2 rounded-full bg-emerald-400" />
                    AAPL
                  </span>
                  <span className="font-mono text-slate-300">${stockPrices.AAPL.toFixed(2)}</span>
                  <span className="font-mono font-semibold text-emerald-400">+1.12%</span>
                </div>
                <div className="flex items-center justify-between py-2.5">
                  <span className="inline-flex items-center gap-2 font-medium text-slate-200">
                    <span className="w-2 h-2 rounded-full bg-rose-400" />
                    TSLA
                  </span>
                  <span className="font-mono text-slate-300">${stockPrices.TSLA.toFixed(2)}</span>
                  <span className="font-mono font-semibold text-rose-400">-2.83%</span>
                </div>
              </div>
            </div>

            {/* Floating Detached Chip Top Right */}
            <div className="absolute -top-4 -right-3 sm:-right-4 chip-ai-floating border border-[#1c2a45] bg-[#0f1c33]/90 backdrop-blur-md rounded-2xl p-3 sm:px-4 sm:py-3 flex items-center gap-3 shadow-[0_22px_50px_-28px_rgba(0,0,0,0.9)] z-20">
              <div className="w-8 h-8 rounded-xl bg-blue-500/20 text-blue-400 flex items-center justify-center">
                <Brain size={17} />
              </div>
              <div>
                <span className="text-[11px] text-slate-400 font-medium block leading-none mb-1">
                  AI Signal
                </span>
                <b className="text-xs sm:text-sm font-bold text-emerald-400 font-display">
                  BUY NVDA
                </b>
              </div>
            </div>

            {/* Floating Detached Chip Bottom Left */}
            <div className="absolute -bottom-4 -left-3 sm:-left-4 chip-gain-floating border border-[#1c2a45] bg-[#0f1c33]/90 backdrop-blur-md rounded-2xl p-3 sm:px-4 sm:py-3 flex items-center gap-3 shadow-[0_22px_50px_-28px_rgba(0,0,0,0.9)] z-20">
              <div>
                <span className="text-[11px] text-slate-400 font-medium block leading-none mb-1">
                  Today's Gain
                </span>
                <b className="font-mono text-xs sm:text-sm font-bold text-emerald-400">
                  +${dayPnL.toFixed(2)}
                </b>
              </div>
            </div>
          </div>
        </div>

        {/* Scroll Hint */}
        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-20 pointer-events-none hidden sm:block">
          <span className="border border-[#1c2a45] bg-[#070d1a]/80 backdrop-blur-md text-slate-400 text-[10px] font-mono tracking-widest px-3.5 py-1.5 rounded-full uppercase">
            Drag the 3D terrain · Scroll down
          </span>
        </div>
      </section>

      {/* INFINITE STOCK TICKER TAPE */}
      <MarketTickerTape />

      {/* ANIMATED STATS SECTION */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-5">
          <div className="text-center border border-[#1c2a45] bg-gradient-to-b from-[#0f1c33]/70 to-[#0b1428]/40 backdrop-blur-sm rounded-2xl p-6">
            <b className="text-2xl sm:text-3xl font-display font-bold bg-gradient-to-r from-blue-200 via-blue-400 to-emerald-300 bg-clip-text text-transparent block mb-1">
              <AnimatedCounter to={12400} prefix="₹" suffix=" Cr+" isIndian />
            </b>
            <span className="text-xs text-slate-400">Assets Under Tracking</span>
          </div>

          <div className="text-center border border-[#1c2a45] bg-gradient-to-b from-[#0f1c33]/70 to-[#0b1428]/40 backdrop-blur-sm rounded-2xl p-6">
            <b className="text-2xl sm:text-3xl font-display font-bold bg-gradient-to-r from-blue-200 via-blue-400 to-emerald-300 bg-clip-text text-transparent block mb-1">
              <AnimatedCounter to={125000} suffix="+" isIndian />
            </b>
            <span className="text-xs text-slate-400">Active Investors</span>
          </div>

          <div className="text-center border border-[#1c2a45] bg-gradient-to-b from-[#0f1c33]/70 to-[#0b1428]/40 backdrop-blur-sm rounded-2xl p-6">
            <b className="text-2xl sm:text-3xl font-display font-bold bg-gradient-to-r from-blue-200 via-blue-400 to-emerald-300 bg-clip-text text-transparent block mb-1">
              <AnimatedCounter to={98.7} decimals={1} suffix="%" />
            </b>
            <span className="text-xs text-slate-400">Uptime SLA</span>
          </div>

          <div className="text-center border border-[#1c2a45] bg-gradient-to-b from-[#0f1c33]/70 to-[#0b1428]/40 backdrop-blur-sm rounded-2xl p-6">
            <b className="text-2xl sm:text-3xl font-display font-bold bg-gradient-to-r from-blue-200 via-blue-400 to-emerald-300 bg-clip-text text-transparent block mb-1">
              <AnimatedCounter to={4.9} decimals={1} suffix="/5" />
            </b>
            <span className="text-xs text-slate-400">App Store Rating</span>
          </div>
        </div>
      </section>

      {/* 3D SPOTLIGHT FEATURES GRID */}
      <section className="py-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto" id="features">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <span className="font-mono text-xs text-blue-400 uppercase tracking-widest block mb-3">
            PLATFORM
          </span>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-display font-bold text-white mb-4">
            Everything You Need to{' '}
            <span className="bg-gradient-to-r from-blue-400 via-sky-300 to-emerald-400 bg-clip-text text-transparent">
              Win the Market
            </span>
          </h2>
          <p className="text-slate-400 text-sm sm:text-base">
            From your first trade to managing multi-crore portfolios — NovaEq scales seamlessly with your ambitions.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {platformFeatures.map((feat) => {
            const IconComp = feat.icon;
            const colorBorder =
              feat.color === 'blue'
                ? 'border-blue-500/30 text-blue-400 bg-blue-500/15'
                : feat.color === 'emerald'
                ? 'border-emerald-500/30 text-emerald-400 bg-emerald-500/15'
                : feat.color === 'amber'
                ? 'border-amber-500/30 text-amber-400 bg-amber-500/15'
                : feat.color === 'purple'
                ? 'border-purple-500/30 text-purple-400 bg-purple-500/15'
                : feat.color === 'cyan'
                ? 'border-cyan-500/30 text-cyan-400 bg-cyan-500/15'
                : 'border-indigo-500/30 text-indigo-400 bg-indigo-500/15';

            return (
              <TiltCard
                key={feat.id}
                className="p-8 sm:p-9 flex flex-col justify-between min-h-[300px] h-full transition-all group cursor-pointer"
                onClick={() => handleOpenFeatureModal(feat)}
              >
                <div>
                  <div
                    className={`w-12 h-12 rounded-xl border flex items-center justify-center mb-5 group-hover:scale-110 transition-transform ${colorBorder}`}
                  >
                    <IconComp size={24} />
                  </div>
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-[11px] font-mono font-semibold uppercase tracking-wider text-slate-400">
                      {feat.category}
                    </span>
                  </div>
                  <h3 className="text-xl font-display font-bold text-white mb-2.5">{feat.title}</h3>
                  <p className="text-sm text-slate-400 leading-relaxed line-clamp-3">
                    {feat.description}
                  </p>
                </div>
                <div className="pt-6 mt-auto flex items-center justify-between border-t border-[#1c2a45]/60">
                  <span className="text-xs font-semibold text-blue-400 inline-flex items-center gap-1.5 group-hover:translate-x-1 transition-transform">
                    View Details & Features &rarr;
                  </span>
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-[#111e37] border border-[#1c2a45] text-slate-400">
                    {feat.badge}
                  </span>
                </div>
              </TiltCard>
            );
          })}
        </div>
      </section>

      {/* AI RECOMMENDATION ENGINE & 3D STACK DECK */}
      <section
        className="py-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto relative overflow-hidden"
        id="ai"
      >
        <div className="absolute inset-0 bg-gradient-to-r from-blue-900/10 via-transparent to-emerald-900/10 pointer-events-none rounded-3xl" />

        <div className="grid lg:grid-cols-2 gap-16 items-center relative z-10">
          <div>
            <span className="font-mono text-xs text-blue-400 uppercase tracking-widest block mb-3">
              AI RECOMMENDATION ENGINE
            </span>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-display font-bold text-white mb-5 leading-tight">
              AI That Thinks{' '}
              <span className="bg-gradient-to-r from-blue-400 via-sky-300 to-emerald-400 bg-clip-text text-transparent">
                Like a Fund Manager
              </span>
            </h2>
            <p className="text-slate-400 text-sm sm:text-base leading-relaxed mb-6">
              Financial statements, live news sentiment, technical price action, and macroeconomic indicators — synthesized simultaneously to deliver clear, risk-calibrated recommendations tailored to your portfolio.
            </p>

            <ul className="space-y-3.5 mb-8 text-sm text-slate-300">
              {[
                'Personalized risk-adjusted recommendations',
                'Real-time sector rotation signals',
                'AI-powered portfolio optimization',
                'Diversification scoring & gap analysis',
              ].map((item) => (
                <li key={item} className="flex items-center gap-3">
                  <span className="w-5 h-5 rounded-md bg-emerald-500/15 border border-emerald-500/40 flex items-center justify-center flex-shrink-0">
                    <Check size={12} className="text-emerald-400" />
                  </span>
                  <span>{item}</span>
                </li>
              ))}
            </ul>

            <div className="flex flex-wrap gap-3">
              <button
                onClick={() => navigate('/ai-insights')}
                className="inline-flex items-center gap-2.5 bg-gradient-to-r from-blue-500 to-blue-700 hover:from-blue-600 hover:to-blue-800 text-white font-semibold text-sm py-3.5 px-7 rounded-xl shadow-lg shadow-blue-500/25 hover:shadow-blue-500/40 hover:-translate-y-0.5 transition-all"
              >
                <span>Explore AI Insights</span>
                <ArrowRight size={16} />
              </button>

              <button
                onClick={() => handleLaunchInDashboard('portfolio')}
                className="inline-flex items-center gap-2 bg-[#0f1c33]/80 hover:bg-[#14233e] text-slate-200 border border-[#1c2a45] font-semibold text-sm py-3.5 px-6 rounded-xl transition-all"
              >
                <span>Open in Dashboard</span>
                <ExternalLink size={15} className="text-blue-400" />
              </button>
            </div>
          </div>

          {/* 3D Stack Deck Carousel */}
          <div>
            <InteractiveDeck3D />
          </div>
        </div>
      </section>

      {/* 4-STEP FLOW ("Four Steps to Your First Trade") */}
      <section className="py-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto" id="flow">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <span className="font-mono text-xs text-blue-400 uppercase tracking-widest block mb-3">
            HOW IT WORKS
          </span>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-display font-bold text-white">
            Four Steps to Your{' '}
            <span className="bg-gradient-to-r from-blue-400 via-sky-300 to-emerald-400 bg-clip-text text-transparent">
              First Trade
            </span>
          </h2>
          <p className="text-slate-400 text-sm mt-3">Click on any step below to see detailed workflow instructions and dashboard actions.</p>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {workflowSteps.map((step) => (
            <div
              key={step.id}
              onClick={() => handleOpenStepModal(step)}
              className="border border-[#1c2a45] bg-gradient-to-b from-[#111e37]/80 to-[#0a1224]/70 rounded-2xl p-6 transition-all hover:-translate-y-1 hover:border-blue-500/40 cursor-pointer group flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between mb-3">
                  <span className="font-mono text-sm text-blue-400 font-semibold">
                    {step.title.split(':')[0]}
                  </span>
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-blue-500/10 border border-blue-500/30 text-blue-300">
                    {step.badge}
                  </span>
                </div>
                <h3 className="font-display font-bold text-base text-white mb-2 group-hover:text-blue-300 transition-colors">
                  {step.title.split(': ')[1]}
                </h3>
                <p className="text-xs text-slate-400 leading-relaxed line-clamp-3 mb-4">{step.description}</p>
              </div>
              <div className="pt-3 border-t border-[#1c2a45]/60 flex items-center justify-between text-xs text-blue-400 font-medium group-hover:translate-x-0.5 transition-transform">
                <span>View Details</span>
                <ChevronRight size={14} />
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* COMMUNITY TESTIMONIALS */}
      <section className="py-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto" id="social">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <span className="font-mono text-xs text-blue-400 uppercase tracking-widest block mb-3">
            COMMUNITY
          </span>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-display font-bold text-white">
            Trusted by{' '}
            <span className="bg-gradient-to-r from-blue-400 via-sky-300 to-emerald-400 bg-clip-text text-transparent">
              125,000+
            </span>{' '}
            Investors
          </h2>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          {[
            {
              quote:
                '“NovaEq’s AI signals cut my research time in half. The backtesting engine and risk controls are institutional grade.”',
              author: 'Rohan D.',
              role: 'Swing Trader · Pune',
              avatar: 'R',
              avatarBg: 'from-emerald-700 to-emerald-500',
            },
            {
              quote:
                '“The real-time risk scoring gave me absolute clarity on my portfolio exposure. The automated exit alerts protected my capital.”',
              author: 'Sneha K.',
              role: 'Long-term Investor · Mumbai',
              avatar: 'S',
              avatarBg: 'from-blue-700 to-blue-500',
            },
            {
              quote:
                '“The Academy and simulations helped me master options and quant models. I now execute strategies with total conviction.”',
              author: 'Aditya P.',
              role: 'Derivatives & Options · Bengaluru',
              avatar: 'A',
              avatarBg: 'from-rose-800 to-rose-500',
            },
          ].map((item) => (
            <figure
              key={item.author}
              className="border border-[#1c2a45] bg-[#14233e]/50 backdrop-blur-md rounded-2xl p-6 flex flex-col justify-between hover:border-blue-500/30 transition-all cursor-pointer"
              onClick={() => navigate('/community')}
            >
              <blockquote className="text-sm text-slate-300 leading-relaxed italic mb-6">
                {item.quote}
              </blockquote>
              <figcaption className="flex items-center gap-3 pt-4 border-t border-[#1c2a45]">
                <div
                  className={`w-10 h-10 rounded-xl bg-gradient-to-br ${item.avatarBg} text-white font-display font-bold flex items-center justify-center`}
                >
                  {item.avatar}
                </div>
                <div>
                  <b className="text-sm text-slate-200 block font-semibold">{item.author}</b>
                  <span className="text-xs text-slate-400">{item.role}</span>
                </div>
              </figcaption>
            </figure>
          ))}
        </div>
      </section>

      {/* FINAL GLASS CTA BANNER */}
      <section className="pb-28 px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto">
        <div className="border border-[#1c2a45] bg-gradient-to-br from-blue-900/30 via-slate-900/60 to-emerald-900/20 backdrop-blur-xl rounded-3xl p-10 sm:p-14 text-center relative overflow-hidden shadow-2xl">
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-display font-bold text-white mb-4">
            Ready to Grow Your Wealth?
          </h2>
          <p className="text-slate-300 text-sm sm:text-base max-w-md mx-auto mb-8">
            Start with our free forever plan. Unlock institutional AI signals today.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <button
              onClick={() => navigate('/create-account')}
              className="inline-flex items-center gap-2 bg-gradient-to-r from-blue-500 to-blue-700 hover:from-blue-600 hover:to-blue-800 text-white font-semibold text-sm sm:text-base py-3.5 px-8 rounded-xl shadow-lg shadow-blue-500/25 hover:-translate-y-0.5 transition-all"
            >
              <span>Start Investing Free</span>
              <ArrowRight size={16} />
            </button>
            <button
              onClick={() =>
                handleProtectedAction('Speak to a certified NovaEq wealth and trading specialist.')
              }
              className="inline-flex items-center gap-2 bg-slate-800/40 hover:bg-slate-700/50 text-slate-200 border border-[#1c2a45] font-semibold text-sm sm:text-base py-3.5 px-6 rounded-xl transition-all"
            >
              Talk to an expert
            </button>
          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* FEATURE & WORKFLOW SHOWCASE MODAL                                         */}
      {/* ========================================================================= */}
      {selectedFeature && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-black/80 backdrop-blur-md animate-fadeIn">
          <div
            className="relative w-full max-w-2xl bg-[#0b1428] border border-[#1c2a45] rounded-3xl shadow-[0_25px_60px_-15px_rgba(0,0,0,0.9)] overflow-hidden flex flex-col max-h-[90vh]"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="p-6 sm:p-8 bg-gradient-to-b from-[#12203d] to-[#0b1428] border-b border-[#1c2a45] relative">
              <button
                onClick={() => setSelectedFeature(null)}
                className="absolute top-5 right-5 w-9 h-9 rounded-full bg-[#1c2a45]/80 hover:bg-[#2a3c61] text-slate-300 flex items-center justify-center transition-colors"
                title="Close"
              >
                <X size={18} />
              </button>

              <div className="flex items-center gap-2 mb-2">
                <span className="text-xs font-mono font-bold uppercase tracking-wider text-blue-400 bg-blue-500/10 px-2.5 py-1 rounded-full border border-blue-500/25">
                  {selectedFeature.category}
                </span>
                <span className="text-xs font-mono text-slate-400 bg-slate-800/50 px-2.5 py-1 rounded-full border border-slate-700/40">
                  {selectedFeature.badge}
                </span>
              </div>

              <div className="flex items-center gap-4 mt-3">
                <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-blue-500/20 to-emerald-500/20 border border-blue-500/30 flex items-center justify-center text-blue-400 flex-shrink-0">
                  <selectedFeature.icon size={26} />
                </div>
                <div>
                  <h3 className="text-2xl font-display font-bold text-white">
                    {selectedFeature.title}
                  </h3>
                  <p className="text-xs text-slate-400 mt-0.5">NovaEq Core Intelligence Suite</p>
                </div>
              </div>
            </div>

            {/* Modal Body */}
            <div className="p-6 sm:p-8 overflow-y-auto space-y-6">
              {/* Detailed Explanation */}
              <div>
                <h4 className="text-xs font-mono uppercase tracking-wider text-slate-400 mb-2">
                  Feature Overview
                </h4>
                <p className="text-sm text-slate-200 leading-relaxed">
                  {selectedFeature.description}
                </p>
              </div>

              {/* Metrics if available */}
              {selectedFeature.metrics && (
                <div className="grid grid-cols-3 gap-3">
                  {selectedFeature.metrics.map((m, i) => (
                    <div
                      key={i}
                      className="p-3 rounded-xl bg-[#0f1c33] border border-[#1c2a45] text-center"
                    >
                      <span className="text-[11px] text-slate-400 block mb-0.5">{m.label}</span>
                      <b className="text-sm font-display font-bold text-emerald-400">{m.val}</b>
                    </div>
                  ))}
                </div>
              )}

              {/* Key Capabilities Grid */}
              <div>
                <h4 className="text-xs font-mono uppercase tracking-wider text-slate-400 mb-3">
                  Key Capabilities
                </h4>
                <div className="grid sm:grid-cols-2 gap-3">
                  {selectedFeature.capabilities.map((cap, i) => (
                    <div
                      key={i}
                      className="p-3.5 rounded-xl bg-[#0f1c33]/70 border border-[#1c2a45] flex items-start gap-2.5"
                    >
                      <span className="w-5 h-5 rounded-md bg-blue-500/15 border border-blue-500/30 flex items-center justify-center flex-shrink-0 mt-0.5">
                        <Check size={12} className="text-blue-400" />
                      </span>
                      <div>
                        <b className="text-xs font-semibold text-slate-200 block mb-0.5">
                          {cap.label}
                        </b>
                        <span className="text-xs text-slate-400 leading-normal">{cap.detail}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Highlights Checklist */}
              <div>
                <h4 className="text-xs font-mono uppercase tracking-wider text-slate-400 mb-2.5">
                  Platform Advantages
                </h4>
                <ul className="space-y-2">
                  {selectedFeature.highlights.map((h, i) => (
                    <li key={i} className="flex items-start gap-2.5 text-xs text-slate-300">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 mt-1.5 flex-shrink-0" />
                      <span>{h}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {/* Modal Footer with Actions */}
            <div className="p-5 sm:p-6 bg-[#080e1c] border-t border-[#1c2a45] flex flex-wrap items-center justify-between gap-3">
              <button
                onClick={() => setSelectedFeature(null)}
                className="px-5 py-2.5 rounded-xl border border-[#1c2a45] text-slate-400 hover:text-white hover:bg-slate-800/40 text-sm font-medium transition-colors"
              >
                Close
              </button>

              <div className="flex flex-wrap gap-3">
                <button
                  onClick={() => {
                    const target = selectedFeature.targetRoute;
                    setSelectedFeature(null);
                    navigate(target);
                  }}
                  className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-blue-600/20 hover:bg-blue-600/30 border border-blue-500/40 text-blue-300 text-sm font-semibold transition-all"
                >
                  <span>Explore {selectedFeature.title.split(' ')[0]} Page</span>
                  <ArrowRight size={15} />
                </button>

                <button
                  onClick={() => {
                    const tab = selectedFeature.dashboardTab;
                    setSelectedFeature(null);
                    handleLaunchInDashboard(tab);
                  }}
                  className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl bg-gradient-to-r from-blue-500 to-blue-700 hover:from-blue-600 hover:to-blue-800 text-white text-sm font-semibold shadow-lg shadow-blue-500/25 transition-all"
                >
                  <span>Go to Dashboard</span>
                  <ExternalLink size={15} />
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Home;

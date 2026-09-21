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
} from 'lucide-react';
import ThreeCandlestickTerrain from '@/components/home/ThreeCandlestickTerrain';
import LiveSparklineCanvas from '@/components/home/LiveSparklineCanvas';
import TiltCard from '@/components/home/TiltCard';
import InteractiveDeck3D, { AISignalCardData } from '@/components/home/InteractiveDeck3D';
import MarketTickerTape from '@/components/home/MarketTickerTape';
import AnimatedCounter from '@/components/home/AnimatedCounter';
import { useAppStore } from '@/stores/useAppStore';

const Home: React.FC = () => {
  const navigate = useNavigate();
  const { isLoggedIn, openAuthModal } = useAppStore();

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

  const handleProtectedAction = (reason: string) => {
    if (!isLoggedIn) {
      openAuthModal(reason);
    } else {
      navigate('/dashboard/investor');
    }
  };

  const handleSignalClick = (signal: AISignalCardData) => {
    handleProtectedAction(`View detailed AI analysis and signal breakdown for ${signal.symbol}.`);
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
          <TiltCard
            onClick={() =>
              handleProtectedAction('Access AI-Powered Insights — sign in to NovaEq.')
            }
          >
            <div className="w-12 h-12 rounded-xl bg-blue-500/15 border border-blue-500/30 text-blue-400 flex items-center justify-center mb-5">
              <Brain size={24} />
            </div>
            <h3 className="text-lg font-display font-bold text-white mb-2">AI-Powered Insights</h3>
            <p className="text-sm text-slate-400 leading-relaxed mb-4">
              Machine learning models analyze 500+ data points per stock to surface high-conviction alpha opportunities.
            </p>
            <span className="text-xs font-semibold text-blue-400 inline-flex items-center gap-1">
              Learn more &rarr;
            </span>
          </TiltCard>

          <TiltCard
            onClick={() =>
              handleProtectedAction('Explore Algorithmic Trading — sign in to NovaEq.')
            }
          >
            <div className="w-12 h-12 rounded-xl bg-emerald-500/15 border border-emerald-500/30 text-emerald-400 flex items-center justify-center mb-5">
              <Zap size={24} />
            </div>
            <h3 className="text-lg font-display font-bold text-white mb-2">Algorithmic Trading</h3>
            <p className="text-sm text-slate-400 leading-relaxed mb-4">
              Build, backtest, and deploy automated trading strategies with visual logic — zero coding required.
            </p>
            <span className="text-xs font-semibold text-emerald-400 inline-flex items-center gap-1">
              Learn more &rarr;
            </span>
          </TiltCard>

          <TiltCard
            onClick={() => handleProtectedAction('View Advanced Analytics — sign in to NovaEq.')}
          >
            <div className="w-12 h-12 rounded-xl bg-amber-500/15 border border-amber-500/30 text-amber-400 flex items-center justify-center mb-5">
              <BarChart2 size={24} />
            </div>
            <h3 className="text-lg font-display font-bold text-white mb-2">Advanced Analytics</h3>
            <p className="text-sm text-slate-400 leading-relaxed mb-4">
              TradingView-grade charting with 80+ technical indicators, multi-timeframe heatmaps, and sector flow analysis.
            </p>
            <span className="text-xs font-semibold text-amber-400 inline-flex items-center gap-1">
              Learn more &rarr;
            </span>
          </TiltCard>

          <TiltCard
            onClick={() => handleProtectedAction('Explore Smart Risk Tools — sign in to NovaEq.')}
          >
            <div className="w-12 h-12 rounded-xl bg-purple-500/15 border border-purple-500/30 text-purple-400 flex items-center justify-center mb-5">
              <Shield size={24} />
            </div>
            <h3 className="text-lg font-display font-bold text-white mb-2">
              Smart Risk Management
            </h3>
            <p className="text-sm text-slate-400 leading-relaxed mb-4">
              Real-time portfolio risk scoring, VaR simulations, and automated drawdown alerts to keep capital protected.
            </p>
            <span className="text-xs font-semibold text-purple-400 inline-flex items-center gap-1">
              Learn more &rarr;
            </span>
          </TiltCard>

          <TiltCard
            onClick={() => handleProtectedAction('Join Social Investing — sign in to NovaEq.')}
          >
            <div className="w-12 h-12 rounded-xl bg-cyan-500/15 border border-cyan-500/30 text-cyan-400 flex items-center justify-center mb-5">
              <Users size={24} />
            </div>
            <h3 className="text-lg font-display font-bold text-white mb-2">Social Investing</h3>
            <p className="text-sm text-slate-400 leading-relaxed mb-4">
              Follow top-ranked traders, automatically copy winning portfolios, and collaborate with 125K+ verified peers.
            </p>
            <span className="text-xs font-semibold text-cyan-400 inline-flex items-center gap-1">
              Learn more &rarr;
            </span>
          </TiltCard>

          <TiltCard
            onClick={() => handleProtectedAction('Access Learning Academy — sign in to NovaEq.')}
          >
            <div className="w-12 h-12 rounded-xl bg-indigo-500/15 border border-indigo-500/30 text-indigo-400 flex items-center justify-center mb-5">
              <BookOpen size={24} />
            </div>
            <h3 className="text-lg font-display font-bold text-white mb-2">Learning Academy</h3>
            <p className="text-sm text-slate-400 leading-relaxed mb-4">
              From market basics to options strategies and quant modeling — 60+ interactive courses with live progress tracking.
            </p>
            <span className="text-xs font-semibold text-indigo-400 inline-flex items-center gap-1">
              Learn more &rarr;
            </span>
          </TiltCard>
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

            <button
              onClick={() =>
                handleProtectedAction(
                  'Explore AI Insights Engine — create your free account on NovaEq.'
                )
              }
              className="inline-flex items-center gap-2.5 bg-gradient-to-r from-blue-500 to-blue-700 hover:from-blue-600 hover:to-blue-800 text-white font-semibold text-sm py-3.5 px-7 rounded-xl shadow-lg shadow-blue-500/25 transition-all"
            >
              <span>Explore AI Insights</span>
              <ArrowRight size={16} />
            </button>
          </div>

          {/* 3D Stack Deck Carousel */}
          <div>
            <InteractiveDeck3D onCardClick={handleSignalClick} />
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
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {[
            {
              step: '01',
              title: 'Open Your Account',
              desc: 'Seamless digital KYC in under 2 minutes with instant verification and paperless setup.',
            },
            {
              step: '02',
              title: 'Set Your Risk Profile',
              desc: 'AI calibrates your investment horizon and targets to structure an optimal asset allocation.',
            },
            {
              step: '03',
              title: 'Review Live Signals',
              desc: 'Actionable BUY/SELL recommendations paired with transparent confidence scores and catalysts.',
            },
            {
              step: '04',
              title: 'Deploy & Auto-Invest',
              desc: 'Execute trades with 1-click or activate automated algorithmic strategies with smart triggers.',
            },
          ].map((item) => (
            <div
              key={item.step}
              className="border border-[#1c2a45] bg-gradient-to-b from-[#111e37]/80 to-[#0a1224]/70 rounded-2xl p-6 transition-all hover:-translate-y-1 hover:border-blue-500/40"
            >
              <span className="font-mono text-sm text-blue-400 font-semibold block mb-3">
                {item.step}
              </span>
              <h3 className="font-display font-bold text-base text-white mb-2">{item.title}</h3>
              <p className="text-xs text-slate-400 leading-relaxed">{item.desc}</p>
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
              className="border border-[#1c2a45] bg-[#14233e]/50 backdrop-blur-md rounded-2xl p-6 flex flex-col justify-between"
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
    </div>
  );
};

export default Home;

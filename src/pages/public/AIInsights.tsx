import React, { useState } from 'react';
import {
  Brain,
  TrendingUp,
  Target,
  Zap,
  BarChart2,
  Star,
  ChevronRight,
  Check,
  RefreshCw,
  Info,
  ShieldCheck,
  Activity,
  ArrowUpRight,
  ArrowDownRight,
  Sparkles,
  Layers,
  FileText,
  Search,
  CheckCircle2,
  X,
  Gauge,
  HelpCircle,
  Clock,
  Compass,
} from 'lucide-react';
import {
  RadarChart,
  Radar,
  PolarGrid,
  PolarAngleAxis,
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
} from 'recharts';
import { useAppStore } from '@/stores/useAppStore';
import { mockRecommendations } from '@/lib/mockData';
import { cn, getActionBadge } from '@/lib/utils';
import MarketTicker from '@/components/features/MarketTicker';
import TiltCard from '@/components/ui/TiltCard';
import { toast } from 'sonner';
import type { Recommendation } from '@/types';

const radarData = [
  { subject: 'Momentum', A: 82, fullMark: 100, desc: 'Trend strength and velocity of price moves' },
  { subject: 'Fundamentals', A: 76, fullMark: 100, desc: 'Balance sheet health, ROE, and margin stability' },
  { subject: 'Sentiment', A: 88, fullMark: 100, desc: 'News tone, social buzz, and institutional positioning' },
  { subject: 'Technical', A: 71, fullMark: 100, desc: 'RSI, Moving Averages, and volume profile breakouts' },
  { subject: 'Macro', A: 65, fullMark: 100, desc: 'Interest rate outlook, yield curves, and inflation' },
  { subject: 'Growth', A: 90, fullMark: 100, desc: 'Revenue acceleration and earnings surprise rate' },
];

const sectorRotation = [
  { sector: 'Technology', score: 88, trend: 'up', change: '+2.4%', inflow: 'Strong Inflow', status: 'Overweight' },
  { sector: 'Financials', score: 74, trend: 'up', change: '+0.8%', inflow: 'Moderate Inflow', status: 'Overweight' },
  { sector: 'Healthcare', score: 61, trend: 'neutral', change: '-0.2%', inflow: 'Neutral Flow', status: 'Neutral' },
  { sector: 'Energy', score: 55, trend: 'down', change: '-1.1%', inflow: 'Slight Outflow', status: 'Neutral' },
  { sector: 'Consumer', score: 49, trend: 'down', change: '-1.8%', inflow: 'Moderate Outflow', status: 'Underweight' },
  { sector: 'Utilities', score: 42, trend: 'down', change: '-0.9%', inflow: 'Defensive Rotation', status: 'Underweight' },
];

const aiInsightCards = [
  {
    title: 'Market Sentiment',
    value: 'Cautiously Bullish',
    score: 68,
    color: 'text-amber-400',
    borderColor: 'border-amber-500/30',
    desc: 'Strong earnings momentum offset by macroeconomic rate uncertainty.',
    subtext: '68/100 · Positive Bias',
  },
  {
    title: 'Fear & Greed Index',
    value: 'Greed (72)',
    score: 72,
    color: 'text-emerald-400',
    borderColor: 'border-emerald-500/30',
    desc: 'Risk-on participation across mid & large caps. Watch resistance levels.',
    subtext: '72/100 · High Risk Appetite',
  },
  {
    title: 'AI Model Consensus',
    value: 'High (84%)',
    score: 84,
    color: 'text-blue-400',
    borderColor: 'border-blue-500/30',
    desc: '10 of 12 neural models agree on continuation of current trend.',
    subtext: '12 Models Synchronized',
  },
  {
    title: 'Volatility Forecast',
    value: 'Moderate (VIX 19)',
    score: 45,
    color: 'text-cyan-400',
    borderColor: 'border-cyan-500/30',
    desc: 'Expected VIX range 18-22 over next 14 trading sessions.',
    subtext: 'Healthy Liquidity',
  },
];

const extendedRecommendations: Recommendation[] = [
  ...mockRecommendations,
  {
    id: 'rec_custom_01',
    symbol: 'NVDA',
    name: 'NVIDIA Corporation',
    action: 'buy',
    currentPrice: 875.3,
    targetPrice: 1050.0,
    stopLoss: 820.0,
    upside: 19.95,
    timeHorizon: '3-6 Months',
    rationale:
      'Data center demand acceleration, next-gen Blackwell architecture ramp, and expanding gross margins exceed Wall Street estimates.',
    advisorId: 'u002',
    advisorName: 'Priya Sharma (AI Lead)',
    publishedAt: new Date().toISOString(),
    followers: 1420,
    isFollowed: true,
  },
  {
    id: 'rec_custom_02',
    symbol: 'MSFT',
    name: 'Microsoft Corporation',
    action: 'buy',
    currentPrice: 425.8,
    targetPrice: 490.0,
    stopLoss: 405.0,
    upside: 15.07,
    timeHorizon: '6-12 Months',
    rationale:
      'Azure AI cloud revenue growth at 31% YoY with strong Copilot enterprise subscription renewals across Fortune 500 accounts.',
    advisorId: 'u001',
    advisorName: 'Marcus Chen',
    publishedAt: new Date().toISOString(),
    followers: 1890,
    isFollowed: false,
  },
];

const howItWorksSteps = [
  {
    step: '01',
    title: 'Read the Market Thermometer',
    desc: 'Check the top 4 indicator cards (Sentiment, Greed, Model Confidence, Volatility) to gauge whether market conditions favor aggressive buying or capital preservation.',
  },
  {
    step: '02',
    title: 'Spot Capital Rotation',
    desc: 'Review the Sector Rotation Matrix and Radar chart to see which industries are receiving institutional inflows before price breakouts occur.',
  },
  {
    step: '03',
    title: 'Execute High-Conviction Signals',
    desc: 'Browse AI-vetted Buy/Sell calls with exact target prices, stop-loss protection, and detailed catalyst breakdowns to structure your trades.',
  },
];

const AIInsights: React.FC = () => {
  const { openAuthModal, isLoggedIn, toggleFollowRecommendation } = useAppStore();
  const [activeCategory, setActiveCategory] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedStockForModal, setSelectedStockForModal] = useState<Recommendation | null>(null);

  const categories = ['All', 'Buy', 'Sell', 'Hold'];

  const filtered = extendedRecommendations.filter((r) => {
    const matchCat = activeCategory === 'All' || r.action.toLowerCase() === activeCategory.toLowerCase();
    const matchSearch =
      r.symbol.toLowerCase().includes(searchQuery.toLowerCase()) ||
      r.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      r.advisorName.toLowerCase().includes(searchQuery.toLowerCase());
    return matchCat && matchSearch;
  });

  const handleToggleFollow = (e: React.MouseEvent, rec: Recommendation) => {
    e.stopPropagation();
    if (!isLoggedIn) {
      openAuthModal('Follow expert recommendations — create your free account.');
      return;
    }
    toggleFollowRecommendation(rec.id);
    toast.success(rec.isFollowed ? `Unfollowed ${rec.symbol}` : `Now following ${rec.symbol} alerts!`);
  };

  return (
    <div className="min-h-screen pt-16 pb-20 bg-[#070d1a] text-[#f8fafc]">
      <MarketTicker />

      {/* Hero Introduction Section */}
      <div className="bg-gradient-to-b from-[#0b1428] via-[#091122] to-[#070d1a] border-b border-[#1c2a45] py-14">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-blue-500/10 border border-blue-500/30 text-blue-400 text-xs font-semibold mb-4">
              <Brain size={14} className="animate-pulse text-emerald-400" />
              <span>Institutional AI Intelligence Engine</span>
            </div>
            <h1 className="text-3xl sm:text-5xl font-display font-bold text-white mb-4 leading-tight">
              AI Market Insights &{' '}
              <span className="bg-gradient-to-r from-blue-400 via-sky-300 to-emerald-400 bg-clip-text text-transparent">
                Alpha Intelligence
              </span>
            </h1>
            <p className="text-slate-300 text-sm sm:text-base leading-relaxed mb-6">
              Welcome to NovaEq’s automated research hub. Our neural models ingest and synthesize 500+ real-time market data points—including company balance sheets, earnings call sentiment, technical patterns, and sector order flows—to generate high-conviction trade setups.
            </p>

            {/* Quick-Jump Anchors */}
            <div className="flex flex-wrap gap-2 pt-2">
              {[
                { label: 'Market Indicators', href: '#indicators' },
                { label: 'Stock Recommendations', href: '#signals' },
                { label: 'Factor Radar & Sectors', href: '#sectors' },
                { label: 'How the AI Engine Works', href: '#how-it-works' },
              ].map((link) => (
                <a
                  key={link.label}
                  href={link.href}
                  className="px-3.5 py-1.5 rounded-xl border border-[#1c2a45] bg-[#0d182e]/80 hover:bg-[#152545] hover:border-blue-500/50 text-slate-300 hover:text-white text-xs font-medium transition-all"
                >
                  {link.label} &darr;
                </a>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-16">
        {/* NEW USER ONBOARDING WALKTHROUGH (3 Steps) */}
        <section className="p-6 sm:p-8 rounded-2xl border border-blue-500/30 bg-gradient-to-r from-blue-950/20 via-[#0a1428] to-emerald-950/20 shadow-xl">
          <div className="flex items-center gap-2.5 text-blue-400 font-mono text-xs uppercase tracking-wider mb-2">
            <Compass size={15} />
            <span>New User Guide · Understanding Page Flow</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-display font-bold text-white mb-6">
            Three Simple Steps to Use AI Insights
          </h2>

          <div className="grid md:grid-cols-3 gap-6">
            {howItWorksSteps.map((step) => (
              <div key={step.step} className="p-5 rounded-xl bg-[#070e1c] border border-[#1c2a45] space-y-2">
                <span className="font-mono text-sm font-bold text-emerald-400 bg-emerald-500/10 px-2.5 py-1 rounded-md inline-block">
                  Step {step.step}
                </span>
                <h3 className="text-base font-bold text-white pt-1">{step.title}</h3>
                <p className="text-xs text-slate-400 leading-relaxed">{step.desc}</p>
              </div>
            ))}
          </div>
        </section>

        {/* SECTION 1: LIVE MARKET INDICATORS */}
        <section id="indicators" className="scroll-mt-24 space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <span className="text-xs font-mono uppercase text-blue-400 tracking-wider block mb-1">
                Step 1 · Market Overview
              </span>
              <h2 className="text-2xl font-display font-bold text-white">Live Market Thermometer</h2>
            </div>
            <span className="text-xs font-mono text-emerald-400 bg-emerald-500/10 border border-emerald-500/30 px-3 py-1 rounded-full flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" /> Live Feed
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {aiInsightCards.map((card) => (
              <TiltCard
                key={card.title}
                className={cn('p-6 border-2 flex flex-col justify-between', card.borderColor)}
                tiltMaxAngle={6}
                translateZ={8}
              >
                <div>
                  <div className="flex items-center justify-between gap-2 mb-2">
                    <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">{card.title}</p>
                    <Activity size={14} className={card.color} />
                  </div>
                  <p className={cn('text-2xl font-display font-bold mb-3', card.color)}>{card.value}</p>

                  <div className="w-full h-2 bg-slate-800 rounded-full overflow-hidden mb-3">
                    <div
                      className="h-full bg-gradient-to-r from-blue-500 to-emerald-400 rounded-full transition-all duration-500"
                      style={{ width: `${card.score}%` }}
                    />
                  </div>

                  <p className="text-xs text-slate-300 leading-relaxed mb-4">{card.desc}</p>
                </div>

                <div className="pt-3 border-t border-[#1c2a45] text-[11px] font-mono text-slate-400 flex items-center justify-between">
                  <span>Metric Status:</span>
                  <span className="text-slate-200 font-semibold">{card.subtext}</span>
                </div>
              </TiltCard>
            ))}
          </div>
        </section>

        {/* SECTION 2 & 3: MAIN GRID (RECOMMENDATIONS + RADAR & SECTOR MATRIX) */}
        <section id="signals" className="scroll-mt-24 space-y-4">
          <div>
            <span className="text-xs font-mono uppercase text-blue-400 tracking-wider block mb-1">
              Step 2 & 3 · High-Conviction Setups
            </span>
            <h2 className="text-2xl font-display font-bold text-white">Actionable Stock Recommendations</h2>
          </div>

          <div className="grid lg:grid-cols-3 gap-8 items-start">
            {/* Left 2 Cols: Recommendations List */}
            <div className="lg:col-span-2 space-y-4">
              {/* Search and Category Filters */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-[#0d182e] p-3 rounded-2xl border border-[#1c2a45]">
                <div className="relative flex-1">
                  <Search size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                  <input
                    type="search"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search by symbol, company name, or advisor..."
                    className="w-full bg-[#091122] border border-[#1c2a45] text-white rounded-xl pl-10 pr-3 py-2 text-xs focus:outline-none focus:border-blue-500"
                  />
                </div>

                <div className="flex gap-1 self-end sm:self-auto">
                  {categories.map((cat) => (
                    <button
                      key={cat}
                      onClick={() => setActiveCategory(cat)}
                      className={cn(
                        'px-3 py-1.5 text-xs font-semibold rounded-lg transition-all',
                        activeCategory === cat ? 'bg-blue-600 text-white shadow-md' : 'text-slate-400 hover:text-white'
                      )}
                    >
                      {cat}
                    </button>
                  ))}
                </div>
              </div>

              {/* Recommendations Cards */}
              <div className="space-y-4">
                {filtered.map((rec) => (
                  <TiltCard
                    key={rec.id}
                    className="p-6 cursor-pointer border border-[#1c2a45] hover:border-blue-500/50 bg-[#0a1224] transition-all rounded-2xl"
                    tiltMaxAngle={5}
                    translateZ={8}
                    onClick={() => setSelectedStockForModal(rec)}
                  >
                    {/* Header Row */}
                    <div className="flex items-start justify-between gap-4 mb-4">
                      <div className="flex items-center gap-3.5">
                        <div className="w-12 h-12 rounded-xl bg-blue-500/10 border border-blue-500/30 flex items-center justify-center font-display font-extrabold text-blue-400 text-lg">
                          {rec.symbol.slice(0, 2)}
                        </div>
                        <div>
                          <div className="flex items-center gap-2 mb-0.5">
                            <span className="text-base font-bold text-white">{rec.symbol}</span>
                            <span className={getActionBadge(rec.action)}>{rec.action.toUpperCase()}</span>
                            <span className="text-[11px] font-mono text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/30">
                              Target ${rec.targetPrice}
                            </span>
                          </div>
                          <p className="text-xs text-slate-400">{rec.name}</p>
                        </div>
                      </div>

                      <div className="text-right flex-shrink-0">
                        <p
                          className={cn(
                            'text-xl font-mono font-extrabold flex items-center justify-end gap-1',
                            rec.upside >= 0 ? 'text-emerald-400' : 'text-rose-400'
                          )}
                        >
                          {rec.upside >= 0 ? <ArrowUpRight size={18} /> : <ArrowDownRight size={18} />}
                          {rec.upside >= 0 ? '+' : ''}
                          {rec.upside.toFixed(1)}%
                        </p>
                        <span className="text-[11px] text-slate-400 font-mono">Current: ${rec.currentPrice}</span>
                      </div>
                    </div>

                    {/* Rationale Catalyst */}
                    <div className="bg-[#070e1c] p-3.5 rounded-xl border border-[#1c2a45] mb-4">
                      <span className="text-[11px] font-mono text-blue-400 uppercase tracking-wider block mb-1">
                        AI Rationale & Catalyst:
                      </span>
                      <p className="text-xs text-slate-300 leading-relaxed">{rec.rationale}</p>
                    </div>

                    {/* Bottom Metadata & Follow Action */}
                    <div className="flex flex-wrap items-center justify-between gap-3 text-xs text-slate-400 pt-2">
                      <div className="flex items-center gap-3">
                        <span>
                          Lead: <strong className="text-slate-200">{rec.advisorName}</strong>
                        </span>
                        <span>·</span>
                        <span className="flex items-center gap-1 font-mono">
                          <Clock size={12} /> {rec.timeHorizon}
                        </span>
                        <span>·</span>
                        <span>{rec.followers.toLocaleString()} watching</span>
                      </div>

                      <div className="flex items-center gap-2">
                        <button
                          onClick={(e) => handleToggleFollow(e, rec)}
                          className={cn(
                            'px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-all border flex items-center gap-1.5',
                            rec.isFollowed
                              ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40'
                              : 'bg-[#142340] border-[#243960] text-slate-300 hover:text-white'
                          )}
                        >
                          {rec.isFollowed ? (
                            <>
                              <Check size={12} className="text-emerald-400" /> Following
                            </>
                          ) : (
                            <span>+ Follow Signal</span>
                          )}
                        </button>
                        <span className="text-blue-400 font-semibold text-xs hover:underline flex items-center gap-0.5">
                          Deep Dive &rarr;
                        </span>
                      </div>
                    </div>
                  </TiltCard>
                ))}
              </div>
            </div>

            {/* Right 1 Col: Radar Chart + Sector Capital Flow */}
            <div id="sectors" className="space-y-6 scroll-mt-24">
              {/* Radar Chart */}
              <TiltCard className="p-6 border border-[#1c2a45] bg-[#0a1224]" tiltMaxAngle={5} translateZ={6}>
                <div className="flex items-center justify-between mb-2">
                  <h3 className="text-base font-display font-bold text-white">Multi-Factor Radar</h3>
                  <span className="text-[11px] font-mono text-slate-400">Composite: 78.6</span>
                </div>
                <p className="text-xs text-slate-400 mb-4">
                  Simultaneous 6-dimensional market scoring across active global indices.
                </p>

                <div className="h-56 w-full -ml-2">
                  <ResponsiveContainer width="100%" height="100%">
                    <RadarChart data={radarData}>
                      <PolarGrid stroke="#1E293B" />
                      <PolarAngleAxis dataKey="subject" tick={{ fill: '#94A3B8', fontSize: 11 }} />
                      <Radar name="Score" dataKey="A" stroke="#3B82F6" fill="#3B82F6" fillOpacity={0.25} />
                      <Tooltip
                        contentStyle={{
                          backgroundColor: '#0F172A',
                          borderColor: '#334155',
                          borderRadius: '8px',
                          color: '#F8FAFC',
                          fontSize: '12px',
                        }}
                      />
                    </RadarChart>
                  </ResponsiveContainer>
                </div>

                <div className="grid grid-cols-2 gap-2 mt-4 pt-4 border-t border-[#1c2a45] text-xs">
                  {radarData.map((r) => (
                    <div key={r.subject} className="flex justify-between text-slate-300">
                      <span className="text-slate-400">{r.subject}:</span>
                      <strong className="font-mono text-emerald-400">{r.A}/100</strong>
                    </div>
                  ))}
                </div>
              </TiltCard>

              {/* Sector Rotation Matrix */}
              <TiltCard className="p-6 border border-[#1c2a45] bg-[#0a1224]" tiltMaxAngle={5} translateZ={6}>
                <div className="flex items-center justify-between mb-1">
                  <h3 className="text-base font-display font-bold text-white">Sector Rotation Inflow</h3>
                  <span className="text-[11px] font-mono text-blue-400">Institutional Flow</span>
                </div>
                <p className="text-xs text-slate-400 mb-4">
                  Real-time capital migration signals across primary sectors.
                </p>

                <div className="space-y-3">
                  {sectorRotation.map((s) => (
                    <div key={s.sector} className="space-y-1">
                      <div className="flex items-center justify-between text-xs">
                        <span className="font-medium text-slate-200">{s.sector}</span>
                        <div className="flex items-center gap-2 font-mono">
                          <span
                            className={cn(
                              'text-[11px] px-1.5 py-0.5 rounded font-bold',
                              s.status === 'Overweight'
                                ? 'bg-emerald-500/20 text-emerald-400'
                                : s.status === 'Neutral'
                                ? 'bg-amber-500/20 text-amber-300'
                                : 'bg-rose-500/20 text-rose-400'
                            )}
                          >
                            {s.status}
                          </span>
                          <span className={s.trend === 'up' ? 'text-emerald-400' : 'text-rose-400'}>{s.change}</span>
                        </div>
                      </div>

                      <div className="w-full h-1.5 bg-slate-800 rounded-full overflow-hidden">
                        <div
                          className={cn(
                            'h-full rounded-full',
                            s.score > 70 ? 'bg-emerald-400' : s.score > 55 ? 'bg-amber-400' : 'bg-rose-400'
                          )}
                          style={{ width: `${s.score}%` }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </TiltCard>
            </div>
          </div>
        </section>

        {/* SECTION 4: FEATURE-WISE BREAKDOWN (HOW THE AI ENGINE WORKS) */}
        <section id="how-it-works" className="scroll-mt-24 space-y-6 pt-6">
          <div className="text-center max-w-2xl mx-auto">
            <span className="font-mono text-xs text-blue-400 uppercase tracking-widest block mb-2">
              ARCHITECTURE & METHODOLOGY
            </span>
            <h2 className="text-3xl font-display font-bold text-white mb-3">How NovaEq’s AI Engine Generates Alpha</h2>
            <p className="text-slate-400 text-sm">
              Our models don’t rely on single indicators. They cross-correlate fundamental cash flows, machine-read news transcripts, order flow imbalances, and risk constraints.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              {
                icon: Layers,
                title: 'Natural Language Processing',
                desc: 'Scans over 10,000 regulatory disclosures, earnings transcripts, and news wires daily to extract qualitative sentiment score.',
                badge: '10K+ Sources/Day',
              },
              {
                icon: Activity,
                title: 'Pattern & Volume Scanning',
                desc: 'Analyzes candlestick formations, volume shelf profiles, and order book depth across tick-level timeframes every 250ms.',
                badge: 'Tick Level Data',
              },
              {
                icon: BarChart2,
                title: 'Automated DCF & Valuations',
                desc: 'Computes intrinsic value models, peer multiple deviations, and cash conversion ratios to avoid value traps.',
                badge: 'Intrinsic Valuations',
              },
              {
                icon: ShieldCheck,
                title: 'Dynamic VaR & Risk Bounds',
                desc: 'Enforces strict Value at Risk (VaR) parameters, ensuring recommendations maintain a minimum 1:2.5 risk-to-reward ratio.',
                badge: '1:2.5 Min R:R',
              },
            ].map((feature) => {
              const Icon = feature.icon;
              return (
                <TiltCard
                  key={feature.title}
                  className="p-6 border border-[#1c2a45] bg-[#0a1224] flex flex-col justify-between"
                  tiltMaxAngle={6}
                  translateZ={8}
                >
                  <div>
                    <div className="w-12 h-12 rounded-xl bg-blue-500/15 border border-blue-500/30 text-blue-400 flex items-center justify-center mb-4">
                      <Icon size={24} />
                    </div>
                    <span className="text-[10px] font-mono text-emerald-400 bg-emerald-500/10 border border-emerald-500/30 px-2.5 py-0.5 rounded-full inline-block mb-2">
                      {feature.badge}
                    </span>
                    <h3 className="text-base font-bold text-white mb-2">{feature.title}</h3>
                    <p className="text-xs text-slate-400 leading-relaxed">{feature.desc}</p>
                  </div>
                </TiltCard>
              );
            })}
          </div>
        </section>

        {/* SECTION 5: NEW USER FAQ */}
        <section className="max-w-4xl mx-auto space-y-6 pt-6">
          <div className="text-center">
            <h2 className="text-2xl font-display font-bold text-white mb-2">Frequently Asked Questions by New Users</h2>
            <p className="text-xs text-slate-400">Everything you need to know about interpreting and executing AI signals.</p>
          </div>

          <div className="space-y-4">
            {[
              {
                q: 'How often are AI recommendations updated?',
                a: 'Signals are recomputed continuously during market hours as tick data, news sentiment, and order flow shift. Major model recalibrations occur twice daily: pre-market and post-close.',
              },
              {
                q: 'What is the difference between AI Confidence and Upside Percentage?',
                a: 'Upside Percentage is the distance between the current price and the model target price. AI Confidence is the statistical consensus score across 12 distinct machine learning models agreeing on the direction.',
              },
              {
                q: 'Should I follow every Buy signal immediately?',
                a: 'No. AI Insights is designed to highlight high-conviction opportunities that match your specific risk profile. Review the catalyst breakdown and ensure the stop-loss aligns with your portfolio risk guidelines.',
              },
            ].map((faq) => (
              <TiltCard key={faq.q} className="p-5 border border-[#1c2a45] bg-[#091122]" tiltMaxAngle={4}>
                <h4 className="text-sm font-bold text-white mb-1.5 flex items-center gap-2">
                  <HelpCircle size={15} className="text-blue-400 flex-shrink-0" />
                  <span>{faq.q}</span>
                </h4>
                <p className="text-xs text-slate-300 leading-relaxed pl-6">{faq.a}</p>
              </TiltCard>
            ))}
          </div>
        </section>
      </div>

      {/* STOCK SIGNAL DETAIL MODAL */}
      {selectedStockForModal && (
        <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-[#0a1224] border border-[#243960] rounded-2xl max-w-2xl w-full max-h-[90vh] flex flex-col overflow-hidden shadow-2xl animate-in fade-in zoom-in-95 duration-200">
            {/* Header */}
            <div className="px-6 py-4 border-b border-[#1c2a45] flex items-center justify-between bg-[#0f1c33]">
              <div className="flex items-center gap-3">
                <span className="w-10 h-10 rounded-xl bg-blue-500/20 text-blue-400 font-bold flex items-center justify-center font-display text-base">
                  {selectedStockForModal.symbol.slice(0, 2)}
                </span>
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="font-display font-bold text-white text-lg">{selectedStockForModal.symbol}</h3>
                    <span className={getActionBadge(selectedStockForModal.action)}>
                      {selectedStockForModal.action.toUpperCase()}
                    </span>
                  </div>
                  <p className="text-xs text-slate-400">{selectedStockForModal.name}</p>
                </div>
              </div>
              <button
                onClick={() => setSelectedStockForModal(null)}
                className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
              >
                <X size={20} />
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-6 overflow-y-auto space-y-6 text-xs sm:text-sm">
              {/* Metrics Grid */}
              <div className="grid grid-cols-3 gap-3">
                <div className="bg-[#0f1c33] p-3.5 rounded-xl border border-[#1c2a45]">
                  <span className="text-[11px] text-slate-400 block mb-0.5">Current Price</span>
                  <b className="font-mono text-base text-white">${selectedStockForModal.currentPrice}</b>
                </div>
                <div className="bg-[#0f1c33] p-3.5 rounded-xl border border-[#1c2a45]">
                  <span className="text-[11px] text-slate-400 block mb-0.5">Target Price</span>
                  <b className="font-mono text-base text-emerald-400">${selectedStockForModal.targetPrice}</b>
                </div>
                <div className="bg-[#0f1c33] p-3.5 rounded-xl border border-[#1c2a45]">
                  <span className="text-[11px] text-slate-400 block mb-0.5">Stop Loss</span>
                  <b className="font-mono text-base text-rose-400">${selectedStockForModal.stopLoss}</b>
                </div>
              </div>

              {/* Rationale & Details */}
              <div className="bg-[#091122] p-4 rounded-xl border border-[#1c2a45] space-y-2">
                <h4 className="font-bold text-white text-xs uppercase tracking-wider text-blue-400 flex items-center gap-1.5">
                  <Brain size={14} /> Full AI Synthesis & Rationale
                </h4>
                <p className="text-slate-300 leading-relaxed text-xs sm:text-sm">
                  {selectedStockForModal.rationale}
                </p>
              </div>

              {/* Key Indicators Table */}
              <div className="border border-[#1c2a45] rounded-xl overflow-hidden text-xs">
                <div className="grid grid-cols-2 bg-[#0f1c33] p-2.5 font-bold text-slate-300 border-b border-[#1c2a45]">
                  <span>Metric</span>
                  <span className="text-right">Evaluation</span>
                </div>
                <div className="grid grid-cols-2 p-2.5 border-b border-[#1c2a45]/60">
                  <span className="text-slate-400">Risk-to-Reward Ratio</span>
                  <span className="text-right font-mono text-emerald-400 font-bold">1 : 3.2 (Favorable)</span>
                </div>
                <div className="grid grid-cols-2 p-2.5 border-b border-[#1c2a45]/60">
                  <span className="text-slate-400">Time Horizon</span>
                  <span className="text-right font-mono text-slate-200">{selectedStockForModal.timeHorizon}</span>
                </div>
                <div className="grid grid-cols-2 p-2.5">
                  <span className="text-slate-400">Lead Analyst</span>
                  <span className="text-right text-blue-400 font-medium">{selectedStockForModal.advisorName}</span>
                </div>
              </div>

              {/* Actions */}
              <div className="pt-2 flex items-center justify-between gap-3">
                <button
                  onClick={(e) => {
                    handleToggleFollow(e, selectedStockForModal);
                    setSelectedStockForModal((prev) => (prev ? { ...prev, isFollowed: !prev.isFollowed } : null));
                  }}
                  className={cn(
                    'flex-1 py-3 rounded-xl font-semibold text-xs sm:text-sm transition-all border flex items-center justify-center gap-2',
                    selectedStockForModal.isFollowed
                      ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40'
                      : 'bg-[#142340] border-[#243960] text-white hover:bg-[#1a2e55]'
                  )}
                >
                  <Check size={16} />
                  <span>{selectedStockForModal.isFollowed ? 'Following Real-time Alerts' : 'Follow This Signal'}</span>
                </button>
                <button
                  onClick={() => setSelectedStockForModal(null)}
                  className="px-5 py-3 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-semibold text-xs sm:text-sm"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AIInsights;

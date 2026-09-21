import React, { useState } from 'react';
import { Brain, TrendingUp, Target, Zap, BarChart2, Star, ChevronRight, Check, RefreshCw } from 'lucide-react';
import { RadarChart, Radar, PolarGrid, PolarAngleAxis, ResponsiveContainer, AreaChart, Area, XAxis, YAxis, Tooltip } from 'recharts';
import { useAppStore } from '@/stores/useAppStore';
import { mockRecommendations } from '@/lib/mockData';
import { cn, getActionBadge } from '@/lib/utils';
import MarketTicker from '@/components/features/MarketTicker';
import TiltCard from '@/components/ui/TiltCard';

const radarData = [
  { subject: 'Momentum', A: 82, fullMark: 100 },
  { subject: 'Fundamentals', A: 76, fullMark: 100 },
  { subject: 'Sentiment', A: 88, fullMark: 100 },
  { subject: 'Technical', A: 71, fullMark: 100 },
  { subject: 'Macro', A: 65, fullMark: 100 },
  { subject: 'Growth', A: 90, fullMark: 100 },
];

const sectorRotation = [
  { sector: 'Technology', score: 88, trend: 'up', change: '+2.4%' },
  { sector: 'Financials', score: 74, trend: 'up', change: '+0.8%' },
  { sector: 'Healthcare', score: 61, trend: 'neutral', change: '-0.2%' },
  { sector: 'Energy', score: 55, trend: 'down', change: '-1.1%' },
  { sector: 'Consumer', score: 49, trend: 'down', change: '-1.8%' },
  { sector: 'Utilities', score: 42, trend: 'down', change: '-0.9%' },
];

const aiInsightCards = [
  { title: 'Market Sentiment', value: 'Cautiously Bullish', score: 68, color: 'text-nova-yellow', desc: 'Mixed signals — strong earnings vs Fed uncertainty' },
  { title: 'Fear & Greed Index', value: 'Greed (72)', score: 72, color: 'text-nova-green', desc: 'Markets showing risk-on behavior. Watch for reversal.' },
  { title: 'AI Confidence Score', value: 'High (84%)', score: 84, color: 'text-nova-accent', desc: 'Strong data convergence across 12 AI models' },
  { title: 'Volatility Forecast', value: 'Moderate', score: 45, color: 'text-nova-primary-light', desc: 'VIX expected 18-22 range. Stable conditions.' },
];

const AIInsights: React.FC = () => {
  const { openAuthModal, isLoggedIn, toggleFollowRecommendation, recommendations } = useAppStore();
  const [activeCategory, setActiveCategory] = useState('All');

  const categories = ['All', 'Buy', 'Sell', 'Hold'];
  const filtered = recommendations.filter(r => activeCategory === 'All' || r.action === activeCategory.toLowerCase());

  return (
    <div className="min-h-screen pt-16">
      <MarketTicker />

      {/* Header */}
      <div className="bg-nova-surface border-b border-nova-border py-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-3 mb-3">
            <Brain size={24} className="text-nova-accent" />
            <h1 className="text-3xl font-display font-black text-nova-text">AI Market Insights</h1>
            <span className="nova-badge-green ml-2">Live AI</span>
          </div>
          <p className="text-nova-text-muted">Machine learning analysis across fundamentals, technicals, sentiment, and macro indicators</p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        {/* AI Insight Cards with 3D Tilt */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {aiInsightCards.map(card => (
            <TiltCard key={card.title} className="p-5" tiltMaxAngle={9}>
              <p className="text-xs text-nova-text-muted mb-2">{card.title}</p>
              <p className={`text-lg font-bold ${card.color} mb-1`}>{card.value}</p>
              <div className="w-full h-1.5 bg-nova-surface2 rounded-full mb-2">
                <div className="h-full bg-nova-accent rounded-full transition-all" style={{ width: `${card.score}%` }} />
              </div>
              <p className="text-xs text-nova-text-subtle">{card.desc}</p>
            </TiltCard>
          ))}
        </div>

        {/* Main Grid */}
        <div className="grid lg:grid-cols-3 gap-6">
          {/* Recommendations */}
          <div className="lg:col-span-2">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-display font-bold text-nova-text">Analyst Recommendations</h2>
              <div className="flex gap-1 bg-nova-surface2 p-1 rounded-lg">
                {categories.map(cat => (
                  <button key={cat} onClick={() => setActiveCategory(cat)}
                    className={cn('px-3 py-1.5 text-xs font-medium rounded-md transition-all',
                      activeCategory === cat ? 'bg-nova-primary text-white' : 'text-nova-text-muted hover:text-nova-text')}>
                    {cat}
                  </button>
                ))}
              </div>
            </div>
            <div className="space-y-3">
              {filtered.map(rec => (
                <TiltCard
                  key={rec.id}
                  className="p-5 cursor-pointer"
                  tiltMaxAngle={8}
                  translateZ={10}
                  onClick={() => !isLoggedIn && openAuthModal('Follow expert recommendations — sign in to NovaEq.')}
                >
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-nova-surface2 border border-nova-border flex items-center justify-center font-black text-nova-primary-light">
                        {rec.symbol.charAt(0)}
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="text-sm font-bold text-nova-text">{rec.symbol}</span>
                          <span className={getActionBadge(rec.action)}>{rec.action.toUpperCase()}</span>
                        </div>
                        <p className="text-xs text-nova-text-muted">{rec.name}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className={`text-lg font-bold ${rec.upside >= 0 ? 'text-nova-green' : 'text-nova-red'}`}>
                        {rec.upside >= 0 ? '+' : ''}{rec.upside.toFixed(1)}%
                      </p>
                      <p className="text-xs text-nova-text-muted">Target: ${rec.targetPrice}</p>
                    </div>
                  </div>
                  <p className="text-xs text-nova-text-muted mb-3 line-clamp-2">{rec.rationale}</p>
                  <div className="flex items-center justify-between">
                    <div className="flex gap-3 text-xs text-nova-text-muted">
                      <span>By <span className="text-nova-primary-light">{rec.advisorName}</span></span>
                      <span>·</span>
                      <span>{rec.timeHorizon}</span>
                      <span>·</span>
                      <span>{rec.followers.toLocaleString()} followers</span>
                    </div>
                    <button
                      onClick={e => {
                        e.stopPropagation();
                        if (isLoggedIn) toggleFollowRecommendation(rec.id);
                        else openAuthModal('Follow expert recommendations.');
                      }}
                      className={cn('text-xs px-3 py-1 rounded-lg border transition-all',
                        rec.isFollowed ? 'bg-nova-accent/10 border-nova-accent/30 text-nova-accent' : 'border-nova-border text-nova-text-muted hover:border-nova-primary/30')}>
                      {rec.isFollowed ? '✓ Following' : 'Follow'}
                    </button>
                  </div>
                </TiltCard>
              ))}
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-5">
            {/* Radar Chart with 3D Tilt */}
            <TiltCard className="p-5" tiltMaxAngle={7} translateZ={8}>
              <h3 className="text-sm font-bold text-nova-text mb-3">Market Analysis Radar</h3>
              <div className="h-48">
                <ResponsiveContainer width="100%" height="100%">
                  <RadarChart data={radarData}>
                    <PolarGrid stroke="#1E293B" />
                    <PolarAngleAxis dataKey="subject" tick={{ fill: '#64748B', fontSize: 10 }} />
                    <Radar name="Score" dataKey="A" stroke="#10B981" fill="#10B981" fillOpacity={0.15} />
                  </RadarChart>
                </ResponsiveContainer>
              </div>
            </TiltCard>

            {/* Sector Rotation with 3D Tilt */}
            <TiltCard className="p-5" tiltMaxAngle={7} translateZ={8}>
              <h3 className="text-sm font-bold text-nova-text mb-3">Sector Rotation Signals</h3>
              <div className="space-y-2.5">
                {sectorRotation.map(s => (
                  <div key={s.sector} className="flex items-center gap-2">
                    <span className="text-xs text-nova-text w-24 flex-shrink-0">{s.sector}</span>
                    <div className="flex-1 h-2 bg-nova-surface2 rounded-full overflow-hidden">
                      <div className={`h-full rounded-full ${s.score > 70 ? 'bg-nova-green' : s.score > 55 ? 'bg-nova-yellow' : 'bg-nova-red'}`}
                        style={{ width: `${s.score}%` }} />
                    </div>
                    <span className="text-xs font-semibold text-nova-text w-8 text-right">{s.score}</span>
                    <span className={`text-xs w-12 text-right ${s.trend === 'up' ? 'text-nova-green' : s.trend === 'down' ? 'text-nova-red' : 'text-nova-text-muted'}`}>
                      {s.change}
                    </span>
                  </div>
                ))}
              </div>
            </TiltCard>

            {/* CTA */}
            <div className="nova-card p-5 bg-gradient-to-br from-nova-primary/10 to-nova-accent/5 border-nova-primary/20">
              <Brain size={24} className="text-nova-accent mb-3" />
              <h3 className="text-sm font-bold text-nova-text mb-2">Full AI Intelligence Suite</h3>
              <p className="text-xs text-nova-text-muted mb-4">Unlock personalized AI stock picks, portfolio optimization, and risk analysis tailored to your profile.</p>
              <button onClick={() => openAuthModal('Unlock the full AI Intelligence Suite — create your free account.')} className="nova-btn-primary text-sm py-2 w-full">
                Unlock AI Suite
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AIInsights;

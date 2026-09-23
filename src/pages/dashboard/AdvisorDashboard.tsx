import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { Star, Users, BarChart2, Plus, Brain, Globe, TrendingUp, FileText, BookOpen } from 'lucide-react';
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';
import DashboardLayout from '@/components/layout/DashboardLayout';
import { useAppStore } from '@/stores/useAppStore';
import { formatCurrency, formatPercent, formatTimeAgo, getActionBadge, cn } from '@/lib/utils';
import ProfileSettingsPanel from '@/components/profile/ProfileSettingsPanel';
import type { RecommendationRisk } from '@/types';

const AdvisorDashboard: React.FC = () => {
  const {
    currentUser,
    recommendations,
    strategies,
    communityPosts,
    holdings,
    walletBalance,
    alerts,
    markAlertRead,
    addRecommendation,
    deleteRecommendation,
    addCommunityPost,
    marketStocks
  } = useAppStore();
  const location = useLocation();
  const [activeTab, setActiveTab] = useState((location.state as { activeTab?: string } | null)?.activeTab || 'overview');

  useEffect(() => {
    const stateTab = (location.state as { activeTab?: string } | null)?.activeTab;
    if (stateTab) {
      setActiveTab(stateTab);
    }
  }, [location.state]);

  const [showNewRec, setShowNewRec] = useState(false);
  const [newRec, setNewRec] = useState({ symbol: '', action: 'buy', targetPrice: '', risk: 'medium', rationale: '', timeHorizon: '6 months' });

  const totalAUM = 12500000;
  const clientCount = 40;
  const myRecs = recommendations.filter(r => r.advisorId === currentUser?.id);
  const publicStrategies = strategies.filter(s => s.isPublic);

  const growthData = Array.from({ length: 30 }, (_, i) => {
    const d = new Date(); d.setDate(d.getDate() - (29 - i));
    return { date: d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }), value: Math.round(11800000 + i * 23000 + Math.random() * 50000 - 20000) };
  });

  const handlePublishRecommendation = () => {
    const symbol = newRec.symbol.trim().toUpperCase();
    const currentPrice = marketStocks.find(stock => stock.symbol === symbol)?.price || 100;
    const targetPrice = Number(newRec.targetPrice);
    if (!symbol || !targetPrice || !newRec.rationale.trim()) return;

    addRecommendation({
      symbol,
      name: marketStocks.find(stock => stock.symbol === symbol)?.name || symbol,
      action: newRec.action as 'buy' | 'sell' | 'hold',
      targetPrice,
      currentPrice,
      upside: ((targetPrice - currentPrice) / currentPrice) * 100,
      risk: newRec.risk as RecommendationRisk,
      rationale: newRec.rationale.trim(),
      sector: marketStocks.find(stock => stock.symbol === symbol)?.sector || 'General',
      timeHorizon: newRec.timeHorizon,
    });

    // Also broadcast as an analyst idea to community
    addCommunityPost(
      `[ANALYST SETUP] ${newRec.action.toUpperCase()} ${symbol} | Target: ₹${targetPrice} | Horizon: ${newRec.timeHorizon}\n\n${newRec.rationale.trim()}`,
      symbol,
      newRec.action === 'buy' ? 'bullish' : newRec.action === 'sell' ? 'bearish' : 'neutral'
    );

    setShowNewRec(false);
    setNewRec({ symbol: '', action: 'buy', targetPrice: '', risk: 'medium', rationale: '', timeHorizon: '6 months' });
    setActiveTab('recommendations');
  };


  return (
    <DashboardLayout activeTab={activeTab} onTabChange={setActiveTab}>
      {activeTab === 'overview' && (
        <div className="space-y-6 animate-fade-in">
          <div className="flex items-center justify-between flex-wrap gap-4">
            <div>
              <h1 className="text-2xl font-display font-bold text-nova-text">Advisor Dashboard</h1>
              <p className="text-nova-text-muted text-sm">Managing {clientCount} client portfolios · CFA Certified</p>
            </div>
            <button onClick={() => setShowNewRec(true)} className="nova-btn-primary text-sm flex items-center gap-2"><Plus size={16} /> Publish Recommendation</button>
          </div>

          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            {[
              { label: 'Total AUM', value: formatCurrency(totalAUM), sub: 'Under management' },
              { label: 'Active Clients', value: String(clientCount), sub: 'Portfolios managed' },
              { label: 'Recommendations', value: String(myRecs.length), sub: `${myRecs.filter(r => r.isFollowed).length} followed` },
              { label: 'Avg Returns', value: '+17.6%', sub: 'vs 10.2% benchmark' },
            ].map(({ label, value, sub }) => (
              <div key={label} className="nova-stat-card"><p className="text-xs text-nova-text-muted mb-2">{label}</p><p className="text-xl font-bold text-nova-text">{value}</p><p className="text-xs text-nova-text-muted mt-1">{sub}</p></div>
            ))}
          </div>

          <div className="grid lg:grid-cols-2 gap-5">
            <div className="nova-card p-5">
              <h3 className="text-sm font-bold text-nova-text mb-4">AUM Growth (30 Days)</h3>
              <div className="h-52">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={growthData}>
                    <defs><linearGradient id="aumGrad" x1="0" y1="0" x2="0" y2="1"><stop offset="5%" stopColor="#1D4ED8" stopOpacity={0.2} /><stop offset="95%" stopColor="#1D4ED8" stopOpacity={0} /></linearGradient></defs>
                    <XAxis dataKey="date" tick={{ fill: '#64748B', fontSize: 10 }} axisLine={false} tickLine={false} interval={6} />
                    <YAxis tick={{ fill: '#64748B', fontSize: 10 }} axisLine={false} tickLine={false} tickFormatter={v => `$${(v / 1000).toFixed(0)}K`} />
                    <Tooltip contentStyle={{ background: '#1E293B', border: 'none', borderRadius: 8, fontSize: 11 }} formatter={(v: number) => [formatCurrency(v), 'AUM']} />
                    <Area type="monotone" dataKey="value" stroke="#1D4ED8" fill="url(#aumGrad)" strokeWidth={2} dot={false} />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </div>

            <div className="nova-card overflow-hidden">
              <div className="px-5 py-3 bg-nova-surface2 border-b border-nova-border"><h3 className="text-sm font-bold text-nova-text">My Recommendations</h3></div>
              {myRecs.slice(0, 5).map(rec => (
                <div key={rec.id} className="flex items-center justify-between px-5 py-3 border-t border-nova-border/50">
                  <div className="flex items-center gap-3">
                    <span className={getActionBadge(rec.action)}>{rec.action.toUpperCase()}</span>
                    <div><p className="text-sm font-bold text-nova-text">{rec.symbol}</p><p className="text-xs text-nova-text-muted">{rec.timeHorizon}</p></div>
                  </div>
                  <div className="text-right">
                    <p className={`text-sm font-bold ${rec.upside >= 0 ? 'text-nova-green' : 'text-nova-red'}`}>{rec.upside >= 0 ? '+' : ''}{rec.upside.toFixed(1)}%</p>
                    <p className="text-xs text-nova-text-muted">{rec.followers.toLocaleString()} followers</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="nova-card overflow-hidden">
            <div className="px-5 py-3 bg-nova-surface2 border-b border-nova-border"><h3 className="text-sm font-bold text-nova-text">Client Portfolio Snapshot</h3></div>
            <div className="grid md:grid-cols-3 gap-0 divide-x divide-nova-border">
              {[{ label: 'Gainers Today', count: 28, color: 'text-nova-green' }, { label: 'Flat', count: 5, color: 'text-nova-yellow' }, { label: 'Losers Today', count: 7, color: 'text-nova-red' }].map(({ label, count, color }) => (
                <div key={label} className="p-5 text-center"><p className={`text-3xl font-black ${color}`}>{count}</p><p className="text-xs text-nova-text-muted mt-1">{label}</p></div>
              ))}
            </div>
          </div>
        </div>
      )}

      {activeTab === 'research' && (
        <div className="space-y-5 animate-fade-in">
          <h2 className="nova-section-title">Research Lab</h2>
          <div className="grid md:grid-cols-2 gap-5">
            {[
              { title: 'NVDA — Strong Buy Thesis', date: 'Jan 12, 2024', status: 'Published', views: 1842 },
              { title: 'MSFT — Azure Growth Analysis', date: 'Jan 10, 2024', status: 'Published', views: 3120 },
              { title: 'Q1 2024 Market Outlook Report', date: 'Jan 8, 2024', status: 'Draft', views: 0 },
              { title: 'Healthcare Sector Deep Dive', date: 'Jan 5, 2024', status: 'Draft', views: 0 },
            ].map(r => (
              <div key={r.title} className="nova-card p-5 cursor-pointer">
                <div className="flex items-start justify-between mb-2">
                  <p className="text-sm font-bold text-nova-text">{r.title}</p>
                  <span className={cn('text-xs px-2 py-0.5 rounded-full', r.status === 'Published' ? 'nova-badge-green' : 'nova-badge-yellow')}>{r.status}</span>
                </div>
                <p className="text-xs text-nova-text-muted">{r.date}</p>
                {r.views > 0 && <p className="text-xs text-nova-accent mt-1">{r.views.toLocaleString()} followers reached</p>}
                <div className="flex gap-2 mt-3">
                  <button className="nova-btn-outline text-xs py-1.5 px-3">Edit</button>
                  {r.status === 'Draft' && <button className="nova-btn-accent text-xs py-1.5 px-3">Publish</button>}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {activeTab === 'recommendations' && (
        <div className="space-y-4 animate-fade-in">
          <div className="flex items-center justify-between">
            <h2 className="nova-section-title">My Recommendations</h2>
            <button onClick={() => setShowNewRec(true)} className="nova-btn-primary text-sm flex items-center gap-2"><Plus size={16} /> New</button>
          </div>
          {recommendations.map(rec => (
            <div key={rec.id} className="nova-card p-5">
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-nova-surface2 border border-nova-border flex items-center justify-center font-black text-nova-primary-light">{rec.symbol.charAt(0)}</div>
                  <div><div className="flex items-center gap-2 mb-0.5"><span className="text-sm font-bold text-nova-text">{rec.symbol}</span><span className={getActionBadge(rec.action)}>{rec.action.toUpperCase()}</span></div><p className="text-xs text-nova-text-muted">{rec.name}</p></div>
                </div>
                <div className="text-right"><p className={`text-lg font-bold ${rec.upside >= 0 ? 'text-nova-green' : 'text-nova-red'}`}>{rec.upside >= 0 ? '+' : ''}{rec.upside.toFixed(1)}%</p><p className="text-xs text-nova-text-muted">Target: ${rec.targetPrice}</p></div>
              </div>
              <p className="text-xs text-nova-text-muted mb-3">{rec.rationale}</p>
              <div className="flex items-center justify-between text-xs text-nova-text-muted pt-2 border-t border-nova-border/60">
                <div className="flex gap-4">
                  <span>{rec.followers.toLocaleString()} followers</span><span>·</span><span>{rec.timeHorizon}</span><span>·</span><span>{formatTimeAgo(rec.publishedAt)}</span>
                </div>
                <button
                  onClick={() => deleteRecommendation(rec.id)}
                  className="text-xs text-rose-400 hover:text-rose-300 font-medium"
                >
                  Delete
                </button>
              </div>
            </div>

          ))}
        </div>
      )}

      {activeTab === 'clients' && (
        <div className="space-y-5 animate-fade-in">
          <h2 className="nova-section-title">Client Portfolios</h2>
          <div className="nova-card overflow-hidden">
            <div className="grid grid-cols-6 px-5 py-2.5 bg-nova-surface2 text-xs font-bold text-nova-text-muted">
              {['Client', 'Portfolio Value', 'Returns', 'Risk Profile', 'KYC', 'Action'].map(h => <span key={h}>{h}</span>)}
            </div>
            {Array.from({ length: 8 }, (_, i) => ({
              name: ['James Patterson', 'Aisha Patel', 'Robert Kim', 'Diana Lopez', 'Michael Wong', 'Sofia Cruz', 'David Lee', 'Nina Patel'][i],
              value: [280000, 154000, 420000, 96000, 310000, 185000, 540000, 72000][i],
              returns: [12.4, 8.9, 18.2, -2.1, 14.7, 11.3, 22.8, 5.6][i],
              risk: ['Moderate', 'Conservative', 'Aggressive', 'Conservative', 'Moderate', 'Moderate', 'Aggressive', 'Conservative'][i],
              kyc: ['Approved', 'Approved', 'Approved', 'Pending', 'Approved', 'Approved', 'Approved', 'Submitted'][i],
            })).map(client => (
              <div key={client.name} className="grid grid-cols-6 px-5 py-3 border-t border-nova-border/50 items-center hover:bg-nova-surface2">
                <p className="text-sm font-semibold text-nova-text">{client.name}</p>
                <p className="text-sm text-nova-text">{formatCurrency(client.value)}</p>
                <p className={`text-sm font-semibold ${client.returns >= 0 ? 'text-nova-green' : 'text-nova-red'}`}>{formatPercent(client.returns)}</p>
                <p className="text-xs text-nova-text-muted">{client.risk}</p>
                <span className={cn('text-xs', client.kyc === 'Approved' ? 'nova-badge-green' : 'nova-badge-yellow')}>{client.kyc}</span>
                <button className="nova-btn-ghost text-xs py-1.5 px-3 w-fit">View</button>
              </div>
            ))}
          </div>
        </div>
      )}

      {activeTab === 'portfolios' && (
        <div className="space-y-5 animate-fade-in">
          <h2 className="nova-section-title">Managed Portfolios</h2>
          <div className="grid md:grid-cols-3 gap-4">
            {[
              { label: 'Growth Clients', value: '18', sub: '+16.4% avg returns' },
              { label: 'Balanced Clients', value: '14', sub: '+10.8% avg returns' },
              { label: 'Conservative Clients', value: '8', sub: '+7.2% avg returns' },
            ].map(item => (
              <div key={item.label} className="nova-card p-5">
                <p className="text-xs text-nova-text-muted mb-1">{item.label}</p>
                <p className="text-3xl font-black text-nova-text">{item.value}</p>
                <p className="text-xs text-nova-accent mt-1">{item.sub}</p>
              </div>
            ))}
          </div>
          <div className="nova-card overflow-hidden">
            <div className="grid grid-cols-5 px-5 py-2.5 bg-nova-surface2 text-xs font-bold text-nova-text-muted">
              {['Portfolio', 'AUM', 'Risk', 'Return', 'Action'].map(h => <span key={h}>{h}</span>)}
            </div>
            {[
              ['Aggressive Growth Model', 4200000, 'Aggressive', 18.2],
              ['Core Wealth Model', 3800000, 'Moderate', 12.6],
              ['Income Preservation', 1900000, 'Conservative', 7.4],
            ].map(([name, value, risk, returns]) => (
              <div key={String(name)} className="grid grid-cols-5 px-5 py-3 border-t border-nova-border/50 items-center hover:bg-nova-surface2">
                <p className="text-sm font-semibold text-nova-text">{String(name)}</p>
                <p className="text-sm text-nova-text">{formatCurrency(Number(value))}</p>
                <p className="text-xs text-nova-text-muted">{String(risk)}</p>
                <p className="text-sm font-semibold text-nova-green">{formatPercent(Number(returns))}</p>
                <button className="nova-btn-ghost text-xs py-1.5 px-3 w-fit">Review</button>
              </div>
            ))}
          </div>
        </div>
      )}

      {activeTab === 'marketplace' && (
        <div className="space-y-4 animate-fade-in">
          <h2 className="nova-section-title">Strategy Marketplace</h2>
          {publicStrategies.map(s => (
            <div key={s.id} className="nova-card p-5">
              <div className="flex items-start justify-between mb-3">
                <div><p className="text-sm font-bold text-nova-text">{s.name}</p><p className="text-xs text-nova-text-muted">By {s.creatorName}</p></div>
                <div className="flex items-center gap-3">
                  <span className="text-sm font-bold text-nova-green">+{s.returns}%</span>
                  <button className="nova-btn-outline text-xs py-1.5 px-3">Subscribe</button>
                </div>
              </div>
              <p className="text-xs text-nova-text-muted mb-3">{s.description}</p>
              <div className="grid grid-cols-4 gap-2 text-xs">
                {[{ l: 'Win Rate', v: `${s.winRate}%` }, { l: 'Max DD', v: `-${s.maxDrawdown}%` }, { l: 'Trades', v: String(s.trades) }, { l: 'Followers', v: String(s.followers) }].map(({ l, v }) => (
                  <div key={l} className="text-center nova-glass rounded-lg p-1.5"><p className="text-nova-text-muted">{l}</p><p className="font-semibold text-nova-text">{v}</p></div>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}

      {activeTab === 'ai-insights' && (
        <div className="space-y-5 animate-fade-in">
          <h2 className="nova-section-title">AI Analytics Suite</h2>
          <div className="grid md:grid-cols-2 gap-5">
            {[
              { title: 'Portfolio Correlation Matrix', desc: 'Analyze cross-asset correlations across 40 client portfolios', icon: BarChart2 },
              { title: 'Sentiment Analysis', desc: 'Real-time NLP analysis of 5,000+ news sources and earnings calls', icon: Brain },
              { title: 'Factor Attribution', desc: 'Decompose returns into alpha, beta, momentum, and quality factors', icon: TrendingUp },
              { title: 'Risk Forecast', desc: 'Monte Carlo simulations for 30/60/90 day portfolio outcomes', icon: Star },
            ].map(({ title, desc, icon: Icon }) => (
              <div key={title} className="nova-card p-5 cursor-pointer group">
                <Icon size={22} className="text-nova-accent mb-3 group-hover:scale-110 transition-transform" />
                <p className="text-sm font-bold text-nova-text mb-1">{title}</p>
                <p className="text-xs text-nova-text-muted">{desc}</p>
                <button className="nova-btn-outline text-xs py-1.5 px-3 mt-3">Generate Report</button>
              </div>
            ))}
          </div>
        </div>
      )}

      {activeTab === 'community' && (
        <div className="space-y-4 animate-fade-in">
          <h2 className="nova-section-title">Community</h2>
          {communityPosts.map(post => (
            <div key={post.id} className="nova-card p-5">
              <div className="flex items-start gap-3 mb-3"><img src={post.userAvatar} alt="" className="w-9 h-9 rounded-full object-cover" /><div><p className="text-sm font-bold text-nova-text">{post.userName}</p><p className="text-xs text-nova-text-muted">{formatTimeAgo(post.createdAt)}</p></div></div>
              <p className="text-sm text-nova-text-muted">{post.content.substring(0, 200)}...</p>
            </div>
          ))}
        </div>
      )}

      {activeTab === 'alerts' && (
        <div className="space-y-4 animate-fade-in">
          <h2 className="nova-section-title">Alerts</h2>
          {alerts.map(alert => (
            <div key={alert.id} onClick={() => markAlertRead(alert.id)}
              className={cn('nova-card p-4 cursor-pointer', !alert.isRead && 'border-nova-primary/30 bg-nova-primary/5')}>
              <div className="flex items-start gap-3">
                <div className={cn('w-2 h-2 rounded-full mt-2', !alert.isRead ? 'bg-nova-primary-light' : 'bg-transparent')} />
                <div><p className="text-sm font-semibold text-nova-text">{alert.title}</p><p className="text-xs text-nova-text-muted">{alert.message}</p></div>
              </div>
            </div>
          ))}
        </div>
      )}

      {activeTab === 'reports' && (
        <div className="space-y-4 animate-fade-in">
          <h2 className="nova-section-title">Reports & Analytics</h2>
          {[
            { title: 'Client Portfolio Report', action: () => { import('@/lib/pdfGenerator').then(m => m.generatePortfolioReport(currentUser!, holdings, walletBalance)); } },
            { title: 'Tax Report', action: () => { import('@/lib/pdfGenerator').then(m => m.generateTaxReport(currentUser!)); } },
            { title: 'Performance Benchmark', action: () => { import('@/lib/pdfGenerator').then(m => m.generatePerformanceReport(currentUser!, holdings)); } },
            { title: 'Risk Analysis', action: () => { import('@/lib/pdfGenerator').then(m => m.generateRiskReport(currentUser!, holdings)); } },
          ].map(r => (
            <div key={r.title} className="nova-card p-5 flex items-center justify-between">
              <p className="text-sm font-bold text-nova-text">{r.title}</p>
              <button onClick={r.action} className="nova-btn-primary text-sm py-2 px-5">Download PDF</button>
            </div>
          ))}
        </div>
      )}

      {activeTab === 'learning' && (
        <div className="space-y-5 animate-fade-in">
          <h2 className="nova-section-title">Publish Content</h2>
          <div className="nova-card p-5">
            <h3 className="text-sm font-bold text-nova-text mb-3">Create Course or Webinar</h3>
            <div className="space-y-3">
              <div><label className="nova-label">Title</label><input type="text" className="nova-input" placeholder="Advanced Options Strategies for 2024" /></div>
              <div><label className="nova-label">Category</label><select className="nova-input"><option>Trading</option><option>Investing</option><option>Algo Trading</option></select></div>
              <div><label className="nova-label">Description</label><textarea className="nova-input resize-none h-20" placeholder="What will students learn?" /></div>
              <button className="nova-btn-primary text-sm py-2.5">Publish Course</button>
            </div>
          </div>
        </div>
      )}

      {activeTab === 'settings' && (
        <div className="space-y-5 animate-fade-in">
          <h2 className="nova-section-title">Advisor Profile & Advisory Practice Settings</h2>
          <ProfileSettingsPanel />
        </div>
      )}

      {/* New Recommendation Modal */}
      {showNewRec && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4">
          <div className="glass-modal rounded-2xl border border-nova-border p-6 w-full max-w-md">
            <h3 className="text-lg font-bold text-nova-text mb-4">Publish Recommendation</h3>
            <div className="space-y-3 mb-4">
              <div className="grid grid-cols-2 gap-3">
                <div><label className="nova-label">Symbol</label><input type="text" value={newRec.symbol} onChange={e => setNewRec({ ...newRec, symbol: e.target.value.toUpperCase() })} className="nova-input" placeholder="NVDA" /></div>
                <div><label className="nova-label">Action</label><select value={newRec.action} onChange={e => setNewRec({ ...newRec, action: e.target.value })} className="nova-input"><option value="buy">BUY</option><option value="sell">SELL</option><option value="hold">HOLD</option></select></div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div><label className="nova-label">Target Price ($)</label><input type="number" value={newRec.targetPrice} onChange={e => setNewRec({ ...newRec, targetPrice: e.target.value })} className="nova-input" placeholder="1050" /></div>
                <div><label className="nova-label">Time Horizon</label><select value={newRec.timeHorizon} onChange={e => setNewRec({ ...newRec, timeHorizon: e.target.value })} className="nova-input"><option>3 months</option><option>6 months</option><option>12 months</option></select></div>
              </div>
              <div><label className="nova-label">Risk Level</label><select value={newRec.risk} onChange={e => setNewRec({ ...newRec, risk: e.target.value })} className="nova-input"><option value="low">Low</option><option value="medium">Medium</option><option value="high">High</option></select></div>
              <div><label className="nova-label">Rationale</label><textarea value={newRec.rationale} onChange={e => setNewRec({ ...newRec, rationale: e.target.value })} rows={3} className="nova-input resize-none" placeholder="Explain your thesis..." /></div>
            </div>
            <div className="flex gap-3">
              <button onClick={() => setShowNewRec(false)} className="nova-btn-ghost flex-1">Cancel</button>
              <button onClick={handlePublishRecommendation} className="nova-btn-primary flex-1">Publish</button>
            </div>
          </div>
        </div>
      )}
    </DashboardLayout>
  );
};

export default AdvisorDashboard;

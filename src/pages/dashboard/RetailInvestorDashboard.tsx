import React, { useState } from 'react';
import { useLocation } from 'react-router-dom';
import {
  TrendingUp, TrendingDown, PieChart, BarChart2, Activity, Plus, Bell, Star, Wallet,
  ArrowUpRight, ArrowDownRight, Target, RefreshCw
} from 'lucide-react';
import {
  AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer,
  PieChart as RPieChart, Pie, Cell, BarChart, Bar, Legend
} from 'recharts';
import DashboardLayout from '@/components/layout/DashboardLayout';
import { useAppStore } from '@/stores/useAppStore';
import { formatCurrency, formatPercent, formatTimeAgo, getPnLColor, getStatusBadge, cn } from '@/lib/utils';

const SECTOR_COLORS = ['#1D4ED8', '#10B981', '#F59E0B', '#8B5CF6', '#06B6D4', '#EF4444'];

const RetailInvestorDashboard: React.FC = () => {
  const {
    currentUser, holdings, orders, alerts, recommendations, walletBalance,
    communityPosts, marketStocks, watchlist, markAlertRead, toggleFollowRecommendation,
    addOrder, addToWatchlist, removeFromWatchlist,
  } = useAppStore();
  const location = useLocation();
  const [activeTab, setActiveTab] = useState((location.state as { activeTab?: string } | null)?.activeTab || 'overview');
  const [buySymbol, setBuySymbol] = useState('');
  const [buyQty, setBuyQty] = useState('');
  const [buyPrice, setBuyPrice] = useState('');
  const [showBuyModal, setShowBuyModal] = useState(false);

  const totalValue = holdings.reduce((s, h) => s + h.value, 0);
  const totalPnL = holdings.reduce((s, h) => s + h.pnl, 0);
  const totalInvested = totalValue - totalPnL;
  const pnlPercent = totalInvested > 0 ? (totalPnL / totalInvested) * 100 : 0;
  const dayChange = holdings.reduce((s, h) => s + h.change1d * h.quantity, 0);

  const sectorAlloc = holdings.reduce((acc, h) => {
    acc[h.sector] = (acc[h.sector] || 0) + h.value;
    return acc;
  }, {} as Record<string, number>);
  const pieData = Object.entries(sectorAlloc).map(([name, value]) => ({ name, value: Math.round(value) }));

  const growthData = currentUser?.portfolioValue
    ? Array.from({ length: 30 }, (_, i) => {
      const d = new Date(); d.setDate(d.getDate() - (29 - i));
      return { date: d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }), value: Math.round(240000 + i * 1500 + Math.random() * 3000 - 1000) };
    }) : [];

  const handleBuyOrder = () => {
    if (!buySymbol || !buyQty || !buyPrice) return;
    addOrder({ symbol: buySymbol.toUpperCase(), name: buySymbol.toUpperCase(), type: 'buy', quantity: Number(buyQty), price: Number(buyPrice), status: 'executed', total: Number(buyQty) * Number(buyPrice) });
    setShowBuyModal(false); setBuySymbol(''); setBuyQty(''); setBuyPrice('');
  };

  const unreadAlerts = alerts.filter(a => !a.isRead);

  return (
    <DashboardLayout activeTab={activeTab} onTabChange={setActiveTab}>
      {/* Overview */}
      {activeTab === 'overview' && (
        <div className="space-y-6 animate-fade-in">
          {/* Welcome */}
          <div className="flex items-center justify-between flex-wrap gap-4">
            <div>
              <h1 className="text-2xl font-display font-bold text-nova-text">Good morning, {currentUser?.name?.split(' ')[0]} 👋</h1>
              <p className="text-nova-text-muted text-sm">Your portfolio is performing well today.</p>
            </div>
            <button onClick={() => setShowBuyModal(true)} className="nova-btn-accent flex items-center gap-2">
              <Plus size={18} /> New Order
            </button>
          </div>

          {/* Key Metrics */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            {[
              { label: 'Portfolio Value', value: formatCurrency(totalValue), sub: `${dayChange >= 0 ? '+' : ''}${formatCurrency(dayChange)} today`, positive: dayChange >= 0, icon: PieChart },
              { label: 'Total P&L', value: formatCurrency(totalPnL), sub: formatPercent(pnlPercent), positive: totalPnL >= 0, icon: TrendingUp },
              { label: 'Cash Balance', value: formatCurrency(walletBalance), sub: 'Available to invest', positive: true, icon: Wallet },
              { label: 'Active Alerts', value: String(unreadAlerts.length), sub: 'Unread notifications', positive: true, icon: Bell },
            ].map(({ label, value, sub, positive, icon: Icon }) => (
              <div key={label} className="nova-stat-card" onClick={() => label === 'Active Alerts' && setActiveTab('alerts')}>
                <div className="flex items-center justify-between mb-3">
                  <p className="text-xs text-nova-text-muted">{label}</p>
                  <Icon size={16} className="text-nova-text-subtle" />
                </div>
                <p className="text-xl font-bold text-nova-text">{value}</p>
                <p className={`text-xs mt-1 ${positive ? 'text-nova-green' : 'text-nova-red'}`}>{sub}</p>
              </div>
            ))}
          </div>

          {/* Charts Row */}
          <div className="grid lg:grid-cols-3 gap-5">
            {/* Growth Chart */}
            <div className="lg:col-span-2 nova-card p-5">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-sm font-bold text-nova-text">Portfolio Growth (30 Days)</h3>
                <span className="nova-badge-green text-xs">+{formatPercent(pnlPercent, false)}</span>
              </div>
              <div className="h-48">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={growthData}>
                    <defs>
                      <linearGradient id="pfGrad" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#10B981" stopOpacity={0.2} />
                        <stop offset="95%" stopColor="#10B981" stopOpacity={0} />
                      </linearGradient>
                    </defs>
                    <XAxis dataKey="date" tick={{ fill: '#64748B', fontSize: 10 }} axisLine={false} tickLine={false} interval={6} />
                    <YAxis tick={{ fill: '#64748B', fontSize: 10 }} axisLine={false} tickLine={false} tickFormatter={v => `$${(v / 1000).toFixed(0)}K`} />
                    <Tooltip contentStyle={{ background: '#1E293B', border: 'none', borderRadius: 8, fontSize: 11 }} formatter={(v: number) => [formatCurrency(v), 'Value']} />
                    <Area type="monotone" dataKey="value" stroke="#10B981" fill="url(#pfGrad)" strokeWidth={2} dot={false} />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Sector Pie */}
            <div className="nova-card p-5">
              <h3 className="text-sm font-bold text-nova-text mb-4">Sector Allocation</h3>
              <div className="h-36">
                <ResponsiveContainer width="100%" height="100%">
                  <RPieChart>
                    <Pie data={pieData} cx="50%" cy="50%" innerRadius={40} outerRadius={65} dataKey="value" paddingAngle={2}>
                      {pieData.map((_, i) => <Cell key={i} fill={SECTOR_COLORS[i % SECTOR_COLORS.length]} />)}
                    </Pie>
                    <Tooltip formatter={(v: number) => [formatCurrency(v), 'Value']} contentStyle={{ background: '#1E293B', border: 'none', borderRadius: 8, fontSize: 11 }} />
                  </RPieChart>
                </ResponsiveContainer>
              </div>
              <div className="space-y-1.5 mt-2">
                {pieData.slice(0, 4).map((d, i) => (
                  <div key={d.name} className="flex items-center justify-between text-xs">
                    <div className="flex items-center gap-1.5">
                      <div className="w-2 h-2 rounded-full" style={{ background: SECTOR_COLORS[i] }} />
                      <span className="text-nova-text-muted truncate">{d.name}</span>
                    </div>
                    <span className="text-nova-text font-medium">{((d.value / totalValue) * 100).toFixed(1)}%</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Holdings Table */}
          <div className="nova-card overflow-hidden">
            <div className="flex items-center justify-between px-5 py-3 border-b border-nova-border bg-nova-surface2">
              <h3 className="text-sm font-bold text-nova-text">Holdings ({holdings.length})</h3>
              <button onClick={() => setActiveTab('portfolio')} className="text-xs text-nova-primary-light hover:underline">View All →</button>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead><tr className="text-xs text-nova-text-muted border-b border-nova-border">
                  {['Symbol', 'Qty', 'Avg Price', 'Current', 'Value', 'P&L', 'Change'].map(h => (
                    <th key={h} className="text-left px-4 py-2.5">{h}</th>
                  ))}
                </tr></thead>
                <tbody>
                  {holdings.slice(0, 5).map(h => (
                    <tr key={h.symbol} className="border-t border-nova-border/50 hover:bg-nova-surface2 transition-colors cursor-pointer">
                      <td className="px-4 py-3">
                        <p className="text-sm font-bold text-nova-text">{h.symbol}</p>
                        <p className="text-xs text-nova-text-muted">{h.sector}</p>
                      </td>
                      <td className="px-4 py-3 text-sm text-nova-text">{h.quantity}</td>
                      <td className="px-4 py-3 text-sm text-nova-text">${h.avgPrice.toFixed(2)}</td>
                      <td className="px-4 py-3 text-sm text-nova-text">${h.currentPrice.toFixed(2)}</td>
                      <td className="px-4 py-3 text-sm text-nova-text">{formatCurrency(h.value)}</td>
                      <td className={`px-4 py-3 text-sm font-semibold ${getPnLColor(h.pnl)}`}>
                        {h.pnl >= 0 ? '+' : ''}{formatCurrency(h.pnl)}
                      </td>
                      <td className={`px-4 py-3 text-sm font-semibold ${h.change1dPercent >= 0 ? 'text-nova-green' : 'text-nova-red'}`}>
                        {h.change1dPercent >= 0 ? <ArrowUpRight size={14} className="inline" /> : <ArrowDownRight size={14} className="inline" />}
                        {h.change1dPercent >= 0 ? '+' : ''}{h.change1dPercent.toFixed(2)}%
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Recent Alerts */}
          <div className="nova-card overflow-hidden">
            <div className="flex items-center justify-between px-5 py-3 border-b border-nova-border bg-nova-surface2">
              <h3 className="text-sm font-bold text-nova-text">Recent Alerts</h3>
              <button onClick={() => setActiveTab('alerts')} className="text-xs text-nova-primary-light hover:underline">View All →</button>
            </div>
            {alerts.slice(0, 4).map(alert => (
              <div key={alert.id} onClick={() => markAlertRead(alert.id)}
                className={cn('px-5 py-3 border-t border-nova-border/50 cursor-pointer hover:bg-nova-surface2 transition-colors flex items-start gap-3', !alert.isRead && 'bg-nova-primary/5')}>
                <div className={cn('w-2 h-2 rounded-full mt-1.5 flex-shrink-0', !alert.isRead ? 'bg-nova-primary-light' : 'bg-transparent')} />
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-nova-text">{alert.title}</p>
                  <p className="text-xs text-nova-text-muted mt-0.5 truncate">{alert.message}</p>
                </div>
                <span className="text-xs text-nova-text-subtle flex-shrink-0">{formatTimeAgo(alert.createdAt)}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Portfolio Tab */}
      {activeTab === 'portfolio' && (
        <div className="space-y-5 animate-fade-in">
          <h2 className="nova-section-title">Portfolio Holdings</h2>
          <div className="grid grid-cols-3 gap-4 mb-2">
            <div className="nova-card p-4 text-center"><p className="text-xs text-nova-text-muted mb-1">Total Value</p><p className="text-xl font-bold text-nova-text">{formatCurrency(totalValue)}</p></div>
            <div className="nova-card p-4 text-center"><p className="text-xs text-nova-text-muted mb-1">Total P&L</p><p className={`text-xl font-bold ${getPnLColor(totalPnL)}`}>{totalPnL >= 0 ? '+' : ''}{formatCurrency(totalPnL)}</p></div>
            <div className="nova-card p-4 text-center"><p className="text-xs text-nova-text-muted mb-1">P&L %</p><p className={`text-xl font-bold ${getPnLColor(totalPnL)}`}>{formatPercent(pnlPercent)}</p></div>
          </div>
          <div className="nova-card overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead><tr className="text-xs text-nova-text-muted bg-nova-surface2">
                  {['Symbol', 'Name', 'Qty', 'Avg Price', 'LTP', 'Value', 'P&L', 'P&L %', 'Day Chg'].map(h => (
                    <th key={h} className="text-left px-4 py-3">{h}</th>
                  ))}
                </tr></thead>
                <tbody>
                  {holdings.map(h => (
                    <tr key={h.symbol} className="border-t border-nova-border/50 hover:bg-nova-surface2 transition-colors">
                      <td className="px-4 py-3 text-sm font-bold text-nova-text">{h.symbol}</td>
                      <td className="px-4 py-3 text-sm text-nova-text-muted">{h.name}</td>
                      <td className="px-4 py-3 text-sm text-nova-text">{h.quantity}</td>
                      <td className="px-4 py-3 text-sm text-nova-text">${h.avgPrice.toFixed(2)}</td>
                      <td className="px-4 py-3 text-sm text-nova-text">${h.currentPrice.toFixed(2)}</td>
                      <td className="px-4 py-3 text-sm text-nova-text">{formatCurrency(h.value)}</td>
                      <td className={`px-4 py-3 text-sm font-semibold ${getPnLColor(h.pnl)}`}>{h.pnl >= 0 ? '+' : ''}{formatCurrency(h.pnl)}</td>
                      <td className={`px-4 py-3 text-sm font-semibold ${getPnLColor(h.pnlPercent)}`}>{formatPercent(h.pnlPercent)}</td>
                      <td className={`px-4 py-3 text-sm font-semibold ${h.change1dPercent >= 0 ? 'text-nova-green' : 'text-nova-red'}`}>{formatPercent(h.change1dPercent)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* Markets Tab */}
      {activeTab === 'markets' && (
        <div className="space-y-5 animate-fade-in">
          <h2 className="nova-section-title">Market Overview</h2>
          <div className="nova-card overflow-hidden">
            <div className="grid grid-cols-5 px-4 py-2.5 bg-nova-surface2 text-xs font-semibold text-nova-text-muted uppercase tracking-wider">
              <span className="col-span-2">Symbol</span>
              <span className="text-right">Price</span>
              <span className="text-right">Change</span>
              <span className="text-right">Watch</span>
            </div>
            {marketStocks.slice(0, 8).map(stock => (
              <div key={stock.symbol} className="grid grid-cols-5 px-4 py-3 border-t border-nova-border/50 hover:bg-nova-surface2 transition-colors">
                <div className="col-span-2">
                  <p className="text-sm font-bold text-nova-text">{stock.symbol}</p>
                  <p className="text-xs text-nova-text-muted truncate">{stock.name}</p>
                </div>
                <p className="text-sm font-semibold text-nova-text text-right self-center">${stock.price.toFixed(2)}</p>
                <p className={`text-sm font-semibold text-right self-center ${stock.changePercent >= 0 ? 'text-nova-green' : 'text-nova-red'}`}>
                  {formatPercent(stock.changePercent)}
                </p>
                <div className="flex justify-end self-center">
                  <button
                    onClick={() => watchlist.includes(stock.symbol) ? removeFromWatchlist(stock.symbol) : addToWatchlist(stock.symbol)}
                    className={cn(
                      'text-xs px-2 py-1 rounded-lg border transition-all',
                      watchlist.includes(stock.symbol)
                        ? 'bg-nova-accent/10 border-nova-accent/30 text-nova-accent'
                        : 'border-nova-border text-nova-text-muted hover:border-nova-primary/30 hover:text-nova-primary-light'
                    )}
                  >
                    {watchlist.includes(stock.symbol) ? 'Added' : 'Watch'}
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {activeTab === 'watchlist' && (
        <div className="space-y-5 animate-fade-in">
          <h2 className="nova-section-title">Watchlist</h2>
          {watchlist.length === 0 ? (
            <div className="text-center py-16 nova-card">
              <Star size={42} className="text-nova-text-subtle mx-auto mb-4" />
              <p className="text-lg font-bold text-nova-text mb-2">No stocks watched yet</p>
              <button onClick={() => setActiveTab('markets')} className="nova-btn-primary text-sm py-2 px-5">Browse Markets</button>
            </div>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
              {marketStocks.filter(stock => watchlist.includes(stock.symbol)).map(stock => (
                <div key={stock.symbol} className="nova-card p-5">
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <p className="text-lg font-bold text-nova-text">{stock.symbol}</p>
                      <p className="text-xs text-nova-text-muted">{stock.name}</p>
                    </div>
                    <button onClick={() => removeFromWatchlist(stock.symbol)} className="text-xs text-nova-text-subtle hover:text-nova-red transition-colors">
                      Remove
                    </button>
                  </div>
                  <p className="text-2xl font-black text-nova-text mb-1">${stock.price.toFixed(2)}</p>
                  <span className={`text-sm font-semibold ${stock.changePercent >= 0 ? 'text-nova-green' : 'text-nova-red'}`}>
                    {formatPercent(stock.changePercent)}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* AI Insights Tab */}
      {activeTab === 'ai-insights' && (
        <div className="space-y-5 animate-fade-in">
          <h2 className="nova-section-title">AI Insights</h2>
          <div className="nova-card p-5 border-nova-accent/20 bg-nova-accent/5">
            <p className="text-sm text-nova-text-muted">AI-powered market intelligence tailored for your {currentUser?.riskProfile} risk profile.</p>
          </div>
          <div className="grid md:grid-cols-2 gap-4">
            {[{ label: 'AI Portfolio Score', value: '82/100', desc: 'Well diversified across 4 sectors with balanced risk', color: 'text-nova-accent' },
              { label: 'Diversification Rating', value: 'B+', desc: 'Consider reducing Technology concentration from 62%', color: 'text-nova-yellow' },
              { label: 'Risk Level', value: 'Moderate', desc: 'Portfolio beta 1.24 — slightly above market', color: 'text-nova-primary-light' },
              { label: 'AI Recommendation', value: 'Hold & Add', desc: 'Market conditions support gradual position building', color: 'text-nova-green' }].map(item => (
              <div key={item.label} className="nova-card p-4">
                <p className="text-xs text-nova-text-muted mb-1">{item.label}</p>
                <p className={`text-2xl font-black ${item.color}`}>{item.value}</p>
                <p className="text-xs text-nova-text-subtle mt-1">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Recommendations Tab */}
      {activeTab === 'recommendations' && (
        <div className="space-y-4 animate-fade-in">
          <h2 className="nova-section-title">Expert Recommendations</h2>
          {recommendations.map(rec => (
            <div key={rec.id} className="nova-card p-5">
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-nova-surface2 border border-nova-border flex items-center justify-center font-black text-nova-primary-light">{rec.symbol.charAt(0)}</div>
                  <div>
                    <div className="flex items-center gap-2"><span className="text-sm font-bold text-nova-text">{rec.symbol}</span><span className={`nova-badge-${rec.action === 'buy' ? 'green' : rec.action === 'sell' ? 'red' : 'yellow'}`}>{rec.action.toUpperCase()}</span></div>
                    <p className="text-xs text-nova-text-muted">{rec.name} · By {rec.advisorName}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className={`text-lg font-bold ${rec.upside >= 0 ? 'text-nova-green' : 'text-nova-red'}`}>{rec.upside >= 0 ? '+' : ''}{rec.upside.toFixed(1)}%</p>
                  <p className="text-xs text-nova-text-muted">Target: ${rec.targetPrice}</p>
                </div>
              </div>
              <p className="text-xs text-nova-text-muted mb-3">{rec.rationale}</p>
              <div className="flex items-center justify-between">
                <span className="text-xs text-nova-text-subtle">{rec.followers.toLocaleString()} followers · {rec.timeHorizon}</span>
                <button onClick={() => toggleFollowRecommendation(rec.id)}
                  className={cn('text-xs px-3 py-1.5 rounded-lg border transition-all', rec.isFollowed ? 'bg-nova-accent/10 border-nova-accent/30 text-nova-accent' : 'border-nova-border text-nova-text-muted hover:border-nova-primary/30')}>
                  {rec.isFollowed ? '✓ Following' : 'Follow'}
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Alerts Tab */}
      {activeTab === 'alerts' && (
        <div className="space-y-4 animate-fade-in">
          <div className="flex items-center justify-between">
            <h2 className="nova-section-title">Alerts & Notifications</h2>
            <button onClick={() => useAppStore.getState().markAllAlertsRead()} className="nova-btn-ghost text-sm">Mark All Read</button>
          </div>
          {alerts.map(alert => (
            <div key={alert.id} onClick={() => markAlertRead(alert.id)}
              className={cn('nova-card p-4 cursor-pointer', !alert.isRead && 'border-nova-primary/30 bg-nova-primary/5')}>
              <div className="flex items-start gap-3">
                <div className={cn('w-2 h-2 rounded-full mt-2 flex-shrink-0', !alert.isRead ? 'bg-nova-primary-light' : 'bg-transparent')} />
                <div className="flex-1">
                  <div className="flex items-center justify-between mb-1">
                    <p className="text-sm font-semibold text-nova-text">{alert.title}</p>
                    <span className={cn('text-xs nova-badge', alert.type === 'price' ? 'nova-badge-blue' : alert.type === 'execution' ? 'nova-badge-green' : 'nova-badge-yellow')}>{alert.type}</span>
                  </div>
                  <p className="text-xs text-nova-text-muted">{alert.message}</p>
                  <p className="text-xs text-nova-text-subtle mt-1">{formatTimeAgo(alert.createdAt)}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Mutual Funds */}
      {activeTab === 'mutual-funds' && (
        <div className="space-y-4 animate-fade-in">
          <h2 className="nova-section-title">Mutual Funds & ETFs</h2>
          {useAppStore.getState().mutualFunds.map(fund => (
            <div key={fund.id} className="nova-card p-5 cursor-pointer">
              <div className="flex items-start justify-between mb-3">
                <div>
                  <p className="text-sm font-bold text-nova-text">{fund.name}</p>
                  <p className="text-xs text-nova-text-muted">{fund.category} · {fund.fundManager}</p>
                </div>
                <div className="text-right">
                  <p className="text-sm font-bold text-nova-green">+{fund.returns1y}%</p>
                  <p className="text-xs text-nova-text-muted">1Y Returns</p>
                </div>
              </div>
              <div className="grid grid-cols-4 gap-2 text-xs">
                {[{ l: '3Y Returns', v: `+${fund.returns3y}%`, c: 'text-nova-green' }, { l: '5Y Returns', v: `+${fund.returns5y}%`, c: 'text-nova-green' }, { l: 'AUM', v: fund.aum, c: 'text-nova-text' }, { l: 'Min SIP', v: `₹${fund.minSIP}`, c: 'text-nova-primary-light' }].map(({ l, v, c }) => (
                  <div key={l}><p className="text-nova-text-muted">{l}</p><p className={`font-semibold ${c}`}>{v}</p></div>
                ))}
              </div>
              <div className="flex items-center justify-between mt-3">
                <div className="flex">{'★'.repeat(fund.rating).split('').map((s, i) => <span key={i} className="text-nova-yellow text-sm">{s}</span>)}</div>
                <button className="nova-btn-primary text-xs py-1.5 px-4">Invest Now</button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Community */}
      {activeTab === 'community' && (
        <div className="space-y-4 animate-fade-in">
          <h2 className="nova-section-title">Community Feed</h2>
          {communityPosts.map(post => (
            <div key={post.id} className="nova-card p-5">
              <div className="flex items-start gap-3 mb-3">
                <img src={post.userAvatar} alt={post.userName} className="w-9 h-9 rounded-full object-cover" />
                <div><p className="text-sm font-bold text-nova-text">{post.userName}</p><p className="text-xs text-nova-text-muted capitalize">{post.userRole} · {formatTimeAgo(post.createdAt)}</p></div>
              </div>
              <p className="text-sm text-nova-text-muted mb-3">{post.content}</p>
              <div className="flex gap-4 text-xs text-nova-text-muted">
                <span>❤ {post.likes}</span><span>💬 {post.comments.length}</span><span>🔗 {post.shares}</span>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Leaderboard */}
      {activeTab === 'leaderboard' && (
        <div className="space-y-4 animate-fade-in">
          <h2 className="nova-section-title">Investor Leaderboard</h2>
          {useAppStore.getState().leaderboard.map(entry => (
            <div key={entry.userId} className="nova-card p-4 flex items-center gap-4">
              <span className="text-lg font-black text-nova-yellow w-6">#{entry.rank}</span>
              <img src={entry.userAvatar} alt={entry.userName} className="w-10 h-10 rounded-full object-cover" />
              <div className="flex-1"><p className="text-sm font-bold text-nova-text">{entry.userName}</p><p className="text-xs text-nova-text-muted capitalize">{entry.role}</p></div>
              <div className="text-right"><p className="text-sm font-bold text-nova-green">+{entry.returns}%</p><p className="text-xs text-nova-text-muted">{entry.winRate}% win rate</p></div>
              <button className="nova-btn-outline text-xs py-1.5 px-3">Follow</button>
            </div>
          ))}
        </div>
      )}

      {/* Learning */}
      {activeTab === 'learning' && (
        <div className="space-y-4 animate-fade-in">
          <h2 className="nova-section-title">Learning Hub</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
            {useAppStore.getState().courses.map(course => (
              <div key={course.id} className="nova-card overflow-hidden cursor-pointer">
                <img src={course.thumbnail} alt={course.title} className="w-full h-32 object-cover" />
                <div className="p-4">
                  <p className="text-sm font-bold text-nova-text mb-1">{course.title}</p>
                  <p className="text-xs text-nova-text-muted mb-2">{course.instructor} · {course.duration}</p>
                  {course.isEnrolled && course.progress > 0 && (
                    <div className="mb-2"><div className="w-full h-1.5 bg-nova-surface2 rounded-full"><div className="h-full bg-nova-accent rounded-full" style={{ width: `${course.progress}%` }} /></div><p className="text-xs text-nova-text-muted mt-1">{course.progress}% complete</p></div>
                  )}
                  <button className={cn('text-xs px-3 py-1.5 rounded-lg font-semibold w-full', course.isEnrolled ? 'bg-nova-accent/10 border border-nova-accent/30 text-nova-accent' : 'nova-btn-primary py-1.5')}>
                    {course.isEnrolled ? (course.progress === 100 ? 'Review' : 'Continue') : 'Enroll Free'}
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Wallet */}
      {activeTab === 'wallet' && (
        <div className="space-y-5 animate-fade-in">
          <h2 className="nova-section-title">Wallet & Payments</h2>
          <div className="nova-card p-6 bg-gradient-to-br from-nova-primary/10 to-nova-accent/5 border-nova-primary/20">
            <p className="text-nova-text-muted text-sm mb-1">Available Balance</p>
            <p className="text-4xl font-black text-nova-text">{formatCurrency(walletBalance)}</p>
            <div className="flex gap-3 mt-4">
              <button onClick={() => { const amt = Number(prompt('Deposit amount ($):')); if (amt > 0) useAppStore.getState().deposit(amt, 'Bank Transfer'); }} className="nova-btn-accent text-sm py-2 px-5">+ Add Funds</button>
              <button onClick={() => { const amt = Number(prompt('Withdraw amount ($):')); if (amt > 0) useAppStore.getState().withdraw(amt); }} className="nova-btn-outline text-sm py-2 px-5">Withdraw</button>
            </div>
          </div>
          <div className="nova-card overflow-hidden">
            <div className="px-5 py-3 bg-nova-surface2 border-b border-nova-border"><h3 className="text-sm font-bold text-nova-text">Transaction History</h3></div>
            {useAppStore.getState().walletTransactions.map(tx => (
              <div key={tx.id} className="flex items-center justify-between px-5 py-3 border-t border-nova-border/50">
                <div>
                  <p className="text-sm font-semibold text-nova-text">{tx.description}</p>
                  <p className="text-xs text-nova-text-muted">{tx.reference} · {formatTimeAgo(tx.timestamp)}</p>
                </div>
                <p className={`text-sm font-bold ${tx.amount > 0 ? 'text-nova-green' : 'text-nova-red'}`}>{tx.amount > 0 ? '+' : ''}{formatCurrency(Math.abs(tx.amount))}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Reports */}
      {activeTab === 'reports' && (
        <div className="space-y-4 animate-fade-in">
          <h2 className="nova-section-title">Downloadable Reports</h2>
          {[
            { title: 'Portfolio Report', desc: 'Complete holdings, P&L analysis, and sector allocation', action: () => { import('@/lib/pdfGenerator').then(m => m.generatePortfolioReport(currentUser!, holdings, walletBalance)); } },
            { title: 'Tax Report — FY 2023-24', desc: 'Capital gains summary, tax liability, and deductions', action: () => { import('@/lib/pdfGenerator').then(m => m.generateTaxReport(currentUser!)); } },
            { title: 'Performance Report', desc: 'Benchmark comparison, top performers, monthly returns', action: () => { import('@/lib/pdfGenerator').then(m => m.generatePerformanceReport(currentUser!, holdings)); } },
            { title: 'Risk Analysis Report', desc: 'Portfolio beta, VaR, drawdown, and risk recommendations', action: () => { import('@/lib/pdfGenerator').then(m => m.generateRiskReport(currentUser!, holdings)); } },
          ].map(report => (
            <div key={report.title} className="nova-card p-5 flex items-center justify-between">
              <div><p className="text-sm font-bold text-nova-text">{report.title}</p><p className="text-xs text-nova-text-muted">{report.desc}</p></div>
              <button onClick={report.action} className="nova-btn-primary text-sm py-2 px-5 flex-shrink-0">Download PDF</button>
            </div>
          ))}
        </div>
      )}

      {/* Settings */}
      {activeTab === 'settings' && (
        <div className="space-y-5 animate-fade-in">
          <h2 className="nova-section-title">Account Settings</h2>
          <div className="nova-card p-6">
            <div className="flex items-center gap-4 mb-6">
              <img src={currentUser?.avatar} alt={currentUser?.name} className="w-16 h-16 rounded-full object-cover" />
              <div>
                <p className="text-lg font-bold text-nova-text">{currentUser?.name}</p>
                <p className="text-sm text-nova-text-muted capitalize">{currentUser?.role} · {currentUser?.subscription} plan</p>
                <p className="text-xs text-nova-text-subtle">{currentUser?.email}</p>
              </div>
              <button className="nova-btn-outline text-sm ml-auto py-2 px-4">Edit Profile</button>
            </div>
            <div className="grid md:grid-cols-2 gap-4">
              {[['KYC Status', currentUser?.kycStatus || 'N/A'], ['Risk Profile', currentUser?.riskProfile || 'N/A'], ['Subscription', currentUser?.subscription || 'Free'], ['Member Since', currentUser?.joinDate || 'N/A']].map(([label, value]) => (
                <div key={label} className="flex justify-between py-2 border-b border-nova-border/50">
                  <span className="text-sm text-nova-text-muted">{label}</span>
                  <span className="text-sm font-semibold text-nova-text capitalize">{value}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Buy Order Modal */}
      {showBuyModal && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4">
          <div className="glass-modal rounded-2xl border border-nova-border p-6 w-full max-w-sm">
            <h3 className="text-lg font-bold text-nova-text mb-4">Place Order</h3>
            <div className="space-y-3 mb-4">
              <div><label className="nova-label">Symbol</label><input type="text" value={buySymbol} onChange={e => setBuySymbol(e.target.value)} className="nova-input" placeholder="AAPL" /></div>
              <div><label className="nova-label">Quantity</label><input type="number" value={buyQty} onChange={e => setBuyQty(e.target.value)} className="nova-input" placeholder="10" /></div>
              <div><label className="nova-label">Price ($)</label><input type="number" step="0.01" value={buyPrice} onChange={e => setBuyPrice(e.target.value)} className="nova-input" placeholder="193.42" /></div>
              {buyQty && buyPrice && <div className="bg-nova-surface2 rounded-lg p-3 text-sm"><span className="text-nova-text-muted">Total: </span><span className="text-nova-text font-bold">{formatCurrency(Number(buyQty) * Number(buyPrice))}</span></div>}
            </div>
            <div className="flex gap-3">
              <button onClick={() => setShowBuyModal(false)} className="nova-btn-ghost flex-1">Cancel</button>
              <button onClick={handleBuyOrder} className="nova-btn-accent flex-1">Execute Order</button>
            </div>
          </div>
        </div>
      )}
    </DashboardLayout>
  );
};

export default RetailInvestorDashboard;

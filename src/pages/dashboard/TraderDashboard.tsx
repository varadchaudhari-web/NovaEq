import React, { useState } from 'react';
import { useLocation } from 'react-router-dom';
import { Zap, TrendingUp, BarChart2, Activity, Plus, Play, Pause, Settings, Target } from 'lucide-react';
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer, BarChart, Bar } from 'recharts';
import DashboardLayout from '@/components/layout/DashboardLayout';
import { useAppStore } from '@/stores/useAppStore';
import { formatCurrency, formatPercent, formatTimeAgo, cn, getStatusBadge } from '@/lib/utils';
import { mockMarketStocks } from '@/lib/mockData';

const TraderDashboard: React.FC = () => {
  const { currentUser, strategies, orders, holdings, walletBalance, alerts, communityPosts,
    toggleStrategyStatus, addOrder, markAlertRead } = useAppStore();
  const location = useLocation();
  const [activeTab, setActiveTab] = useState((location.state as { activeTab?: string } | null)?.activeTab || 'overview');
  const [selectedStrategy, setSelectedStrategy] = useState(strategies[0]);
  const [showNewStrategy, setShowNewStrategy] = useState(false);
  const [newStrat, setNewStrat] = useState({ name: '', description: '', isPublic: false });
  const [quickOrder, setQuickOrder] = useState({ symbol: 'AAPL', quantity: '10', price: '193.42', orderType: 'Market' });

  const totalValue = holdings.reduce((s, h) => s + h.value, 0);
  const totalPnL = holdings.reduce((s, h) => s + h.pnl, 0);
  const todayPnL = orders.filter(o => o.status === 'executed').slice(0, 3).reduce((s, o) => s + (o.type === 'buy' ? -o.total : o.total), 0);

  const volumeData = orders.slice(0, 10).map(o => ({
    symbol: o.symbol,
    value: o.total,
    type: o.type,
  }));

  const handleNewOrder = (type: 'buy' | 'sell', symbol: string, price: number) => {
    addOrder({ symbol, name: symbol, type, quantity: 10, price, status: 'executed', total: 10 * price });
  };

  const handleQuickOrder = (type: 'buy' | 'sell') => {
    const symbol = quickOrder.symbol.trim().toUpperCase();
    const quantity = Number(quickOrder.quantity);
    const price = Number(quickOrder.price);
    if (!symbol || quantity <= 0 || price <= 0) return;
    addOrder({ symbol, name: symbol, type, quantity, price, status: 'executed', total: quantity * price });
    setActiveTab('orders');
  };

  return (
    <DashboardLayout activeTab={activeTab} onTabChange={setActiveTab}>
      {activeTab === 'overview' && (
        <div className="space-y-6 animate-fade-in">
          <div className="flex items-center justify-between flex-wrap gap-4">
            <div>
              <h1 className="text-2xl font-display font-bold text-nova-text">Trader Dashboard</h1>
              <p className="text-nova-text-muted text-sm">Welcome back, {currentUser?.name?.split(' ')[0]}. 3 active strategies running.</p>
            </div>
            <div className="flex gap-3">
              <button onClick={() => setActiveTab('algo')} className="nova-btn-outline text-sm flex items-center gap-2"><Zap size={16} /> Algo Manager</button>
              <button onClick={() => setActiveTab('trading')} className="nova-btn-accent text-sm flex items-center gap-2"><TrendingUp size={16} /> Trade Now</button>
            </div>
          </div>

          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            {[
              { label: 'Portfolio Value', value: formatCurrency(totalValue), sub: 'Total holdings' },
              { label: 'Total P&L', value: formatCurrency(totalPnL), sub: formatPercent((totalPnL / (totalValue - totalPnL)) * 100), pos: totalPnL >= 0 },
              { label: 'Active Strategies', value: String(strategies.filter(s => s.status === 'active').length), sub: 'Running live' },
              { label: 'Cash Balance', value: formatCurrency(walletBalance), sub: 'Available margin' },
            ].map(({ label, value, sub, pos }) => (
              <div key={label} className="nova-stat-card">
                <p className="text-xs text-nova-text-muted mb-2">{label}</p>
                <p className="text-xl font-bold text-nova-text">{value}</p>
                <p className={`text-xs mt-1 ${pos === false ? 'text-nova-red' : pos === true ? 'text-nova-green' : 'text-nova-text-muted'}`}>{sub}</p>
              </div>
            ))}
          </div>

          {/* Order Book + Recent */}
          <div className="grid lg:grid-cols-2 gap-5">
            <div className="nova-card overflow-hidden">
              <div className="flex items-center justify-between px-5 py-3 bg-nova-surface2 border-b border-nova-border">
                <h3 className="text-sm font-bold text-nova-text">Recent Orders</h3>
                <button onClick={() => setActiveTab('trading')} className="text-xs text-nova-primary-light">View All</button>
              </div>
              {orders.slice(0, 6).map(o => (
                <div key={o.id} className="flex items-center justify-between px-5 py-3 border-t border-nova-border/50">
                  <div className="flex items-center gap-3">
                    <span className={cn('text-xs font-bold px-2 py-0.5 rounded', o.type === 'buy' ? 'bg-nova-green/10 text-nova-green' : 'bg-nova-red/10 text-nova-red')}>{o.type.toUpperCase()}</span>
                    <div><p className="text-sm font-semibold text-nova-text">{o.symbol}</p><p className="text-xs text-nova-text-muted">{o.quantity} shares @ ${o.price.toFixed(2)}</p></div>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-bold text-nova-text">{formatCurrency(o.total)}</p>
                    <span className={`text-xs ${getStatusBadge(o.status)}`}>{o.status}</span>
                  </div>
                </div>
              ))}
            </div>

            <div className="nova-card overflow-hidden">
              <div className="flex items-center justify-between px-5 py-3 bg-nova-surface2 border-b border-nova-border">
                <h3 className="text-sm font-bold text-nova-text">Live Strategies</h3>
                <button onClick={() => setActiveTab('algo')} className="text-xs text-nova-primary-light">Manage</button>
              </div>
              {strategies.slice(0, 3).map(s => (
                <div key={s.id} className="flex items-center justify-between px-5 py-3 border-t border-nova-border/50">
                  <div>
                    <p className="text-sm font-semibold text-nova-text">{s.name}</p>
                    <p className="text-xs text-nova-text-muted">{s.trades} trades · {s.winRate}% win rate</p>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="text-right">
                      <p className="text-sm font-bold text-nova-green">+{s.returns}%</p>
                      <span className={getStatusBadge(s.status)}>{s.status}</span>
                    </div>
                    <button onClick={() => toggleStrategyStatus(s.id)} className={cn('w-8 h-8 rounded-full flex items-center justify-center transition-all', s.status === 'active' ? 'bg-nova-accent/10 text-nova-accent hover:bg-nova-red/10 hover:text-nova-red' : 'bg-nova-surface2 text-nova-text-muted hover:bg-nova-green/10 hover:text-nova-green')}>
                      {s.status === 'active' ? <Pause size={14} /> : <Play size={14} />}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Holdings */}
          <div className="nova-card overflow-hidden">
            <div className="px-5 py-3 bg-nova-surface2 border-b border-nova-border"><h3 className="text-sm font-bold text-nova-text">Open Positions</h3></div>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead><tr className="text-xs text-nova-text-muted"><th className="text-left px-4 py-2.5">Symbol</th><th className="text-left px-4 py-2.5">Qty</th><th className="text-left px-4 py-2.5">Entry</th><th className="text-left px-4 py-2.5">LTP</th><th className="text-left px-4 py-2.5">P&L</th><th className="text-left px-4 py-2.5">Action</th></tr></thead>
                <tbody>
                  {holdings.map(h => (
                    <tr key={h.symbol} className="border-t border-nova-border/50 hover:bg-nova-surface2">
                      <td className="px-4 py-3 text-sm font-bold text-nova-text">{h.symbol}</td>
                      <td className="px-4 py-3 text-sm text-nova-text">{h.quantity}</td>
                      <td className="px-4 py-3 text-sm text-nova-text">${h.avgPrice.toFixed(2)}</td>
                      <td className="px-4 py-3 text-sm text-nova-text">${h.currentPrice.toFixed(2)}</td>
                      <td className={`px-4 py-3 text-sm font-semibold ${h.pnl >= 0 ? 'text-nova-green' : 'text-nova-red'}`}>{h.pnl >= 0 ? '+' : ''}{formatCurrency(h.pnl)}</td>
                      <td className="px-4 py-3">
                        <button onClick={() => handleNewOrder('sell', h.symbol, h.currentPrice)} className="text-xs bg-nova-red/10 border border-nova-red/30 text-nova-red hover:bg-nova-red/20 px-3 py-1 rounded-lg font-semibold transition-all">Close</button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {activeTab === 'trading' && (
        <div className="space-y-5 animate-fade-in">
          <h2 className="nova-section-title">Markets</h2>
          <div className="grid lg:grid-cols-3 gap-5">
            <div className="lg:col-span-2 nova-card p-5">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-sm font-bold text-nova-text">Market Watch</h3>
              </div>
              <div className="space-y-2">
                {mockMarketStocks.slice(0, 8).map(stock => (
                  <div key={stock.symbol} className="flex items-center justify-between py-2 border-b border-nova-border/50">
                    <div><p className="text-sm font-bold text-nova-text">{stock.symbol}</p><p className="text-xs text-nova-text-muted">{stock.name}</p></div>
                    <p className="text-sm font-semibold text-nova-text">${stock.price.toFixed(2)}</p>
                    <span className={`text-xs font-semibold ${stock.changePercent >= 0 ? 'text-nova-green' : 'text-nova-red'}`}>{stock.changePercent >= 0 ? '+' : ''}{stock.changePercent.toFixed(2)}%</span>
                    <div className="flex gap-2">
                      <button onClick={() => handleNewOrder('buy', stock.symbol, stock.price)} className="text-xs bg-nova-green/10 border border-nova-green/30 text-nova-green hover:bg-nova-green/20 px-3 py-1 rounded font-semibold">B</button>
                      <button onClick={() => handleNewOrder('sell', stock.symbol, stock.price)} className="text-xs bg-nova-red/10 border border-nova-red/30 text-nova-red hover:bg-nova-red/20 px-3 py-1 rounded font-semibold">S</button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            <div className="nova-card p-5">
              <h3 className="text-sm font-bold text-nova-text mb-4">Quick Order</h3>
              <div className="space-y-3">
                <div><label className="nova-label">Symbol</label><input type="text" value={quickOrder.symbol} onChange={e => setQuickOrder({ ...quickOrder, symbol: e.target.value })} className="nova-input" placeholder="AAPL" /></div>
                <div className="grid grid-cols-2 gap-2">
                  <div><label className="nova-label">Quantity</label><input type="number" value={quickOrder.quantity} onChange={e => setQuickOrder({ ...quickOrder, quantity: e.target.value })} className="nova-input" placeholder="100" /></div>
                  <div><label className="nova-label">Price</label><input type="number" step="0.01" value={quickOrder.price} onChange={e => setQuickOrder({ ...quickOrder, price: e.target.value })} className="nova-input" placeholder="193.42" /></div>
                </div>
                <div><label className="nova-label">Order Type</label>
                  <select value={quickOrder.orderType} onChange={e => setQuickOrder({ ...quickOrder, orderType: e.target.value })} className="nova-input"><option>Market</option><option>Limit</option><option>Stop Loss</option><option>Stop Limit</option></select>
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <button onClick={() => handleQuickOrder('buy')} className="nova-btn-accent py-2.5 text-sm">BUY</button>
                  <button onClick={() => handleQuickOrder('sell')} className="bg-nova-red/10 border border-nova-red/30 text-nova-red hover:bg-nova-red/20 rounded-lg py-2.5 text-sm font-semibold transition-all">SELL</button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {activeTab === 'algo' && (
        <div className="space-y-5 animate-fade-in">
          <div className="flex items-center justify-between">
            <h2 className="nova-section-title">Algo Trading Strategies</h2>
            <button onClick={() => setShowNewStrategy(true)} className="nova-btn-primary text-sm flex items-center gap-2"><Plus size={16} /> New Strategy</button>
          </div>

          {strategies.map(s => (
            <div key={s.id} className="nova-card p-5 cursor-pointer" onClick={() => setSelectedStrategy(s)}>
              <div className="flex items-start justify-between mb-4">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <p className="text-sm font-bold text-nova-text">{s.name}</p>
                    <span className={getStatusBadge(s.status)}>{s.status}</span>
                    {s.isPublic && <span className="nova-badge-blue text-xs">Public</span>}
                  </div>
                  <p className="text-xs text-nova-text-muted">{s.description}</p>
                </div>
                <button onClick={e => { e.stopPropagation(); toggleStrategyStatus(s.id); }}
                  className={cn('flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-lg border transition-all', s.status === 'active' ? 'border-nova-red/30 text-nova-red hover:bg-nova-red/10' : 'border-nova-accent/30 text-nova-accent hover:bg-nova-accent/10')}>
                  {s.status === 'active' ? <><Pause size={12} /> Pause</> : <><Play size={12} /> Activate</>}
                </button>
              </div>
              <div className="grid grid-cols-4 gap-3 text-xs mb-4">
                {[{ l: 'Returns', v: `+${s.returns}%`, c: 'text-nova-green' }, { l: 'Win Rate', v: `${s.winRate}%`, c: 'text-nova-text' }, { l: 'Max DD', v: `-${s.maxDrawdown}%`, c: 'text-nova-red' }, { l: 'Trades', v: String(s.trades), c: 'text-nova-text' }].map(({ l, v, c }) => (
                  <div key={l} className="nova-glass rounded-lg p-2 text-center"><p className="text-nova-text-muted">{l}</p><p className={`font-bold ${c}`}>{v}</p></div>
                ))}
              </div>
              {s.backtestResults.length > 0 && (
                <div className="h-24">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={s.backtestResults.slice(-60)}>
                      <defs><linearGradient id={`sg${s.id}`} x1="0" y1="0" x2="0" y2="1"><stop offset="5%" stopColor="#10B981" stopOpacity={0.2} /><stop offset="95%" stopColor="#10B981" stopOpacity={0} /></linearGradient></defs>
                      <Area type="monotone" dataKey="value" stroke="#10B981" fill={`url(#sg${s.id})`} strokeWidth={1.5} dot={false} />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
              )}
              <div className="flex gap-2 mt-2">
                {s.tags.map(tag => <span key={tag} className="nova-badge-blue text-xs">{tag}</span>)}
              </div>
            </div>
          ))}

          {showNewStrategy && (
            <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4">
              <div className="glass-modal rounded-2xl border border-nova-border p-6 w-full max-w-sm">
                <h3 className="text-lg font-bold text-nova-text mb-4">New Strategy</h3>
                <div className="space-y-3 mb-4">
                  <div><label className="nova-label">Strategy Name</label><input type="text" value={newStrat.name} onChange={e => setNewStrat({ ...newStrat, name: e.target.value })} className="nova-input" placeholder="My Alpha Strategy" /></div>
                  <div><label className="nova-label">Description</label><textarea value={newStrat.description} onChange={e => setNewStrat({ ...newStrat, description: e.target.value })} className="nova-input resize-none h-20" placeholder="Describe your strategy logic..." /></div>
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input type="checkbox" checked={newStrat.isPublic} onChange={e => setNewStrat({ ...newStrat, isPublic: e.target.checked })} className="w-4 h-4 accent-nova-accent" />
                    <span className="text-sm text-nova-text-muted">Make public (visible in marketplace)</span>
                  </label>
                </div>
                <div className="flex gap-3">
                  <button onClick={() => setShowNewStrategy(false)} className="nova-btn-ghost flex-1">Cancel</button>
                  <button onClick={() => {
                    if (!newStrat.name) return;
                    useAppStore.getState().addStrategy({ name: newStrat.name, description: newStrat.description, status: 'draft', returns: 0, maxDrawdown: 0, winRate: 0, trades: 0, isPublic: newStrat.isPublic, followers: 0, tags: [] });
                    setShowNewStrategy(false); setNewStrat({ name: '', description: '', isPublic: false });
                  }} className="nova-btn-primary flex-1">Create</button>
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {activeTab === 'portfolio' && (
        <div className="space-y-5 animate-fade-in">
          <h2 className="nova-section-title">Portfolio & P&L</h2>
          <div className="nova-card overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead><tr className="text-xs text-nova-text-muted bg-nova-surface2">
                  {['Symbol', 'Qty', 'Entry', 'LTP', 'Value', 'P&L', 'P&L %', 'Day Chg'].map(h => <th key={h} className="text-left px-4 py-3">{h}</th>)}
                </tr></thead>
                <tbody>
                  {holdings.map(h => (
                    <tr key={h.symbol} className="border-t border-nova-border/50 hover:bg-nova-surface2">
                      <td className="px-4 py-3 text-sm font-bold text-nova-text">{h.symbol}</td>
                      <td className="px-4 py-3 text-sm text-nova-text">{h.quantity}</td>
                      <td className="px-4 py-3 text-sm">${h.avgPrice.toFixed(2)}</td>
                      <td className="px-4 py-3 text-sm">${h.currentPrice.toFixed(2)}</td>
                      <td className="px-4 py-3 text-sm">{formatCurrency(h.value)}</td>
                      <td className={`px-4 py-3 text-sm font-semibold ${h.pnl >= 0 ? 'text-nova-green' : 'text-nova-red'}`}>{h.pnl >= 0 ? '+' : ''}{formatCurrency(h.pnl)}</td>
                      <td className={`px-4 py-3 text-sm font-semibold ${h.pnl >= 0 ? 'text-nova-green' : 'text-nova-red'}`}>{formatPercent(h.pnlPercent)}</td>
                      <td className={`px-4 py-3 text-sm font-semibold ${h.change1dPercent >= 0 ? 'text-nova-green' : 'text-nova-red'}`}>{formatPercent(h.change1dPercent)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {activeTab === 'charts' && (
        <div className="space-y-5 animate-fade-in">
          <h2 className="nova-section-title">Advanced Charts</h2>
          <div className="nova-card p-5">
            <p className="text-nova-text-muted text-sm mb-4">TradingView-grade charting with 80+ technical indicators. Select a stock to analyze.</p>
            <select className="nova-input w-48 mb-4">
              {mockMarketStocks.map(s => <option key={s.symbol}>{s.symbol} — {s.name}</option>)}
            </select>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={mockMarketStocks[2].priceHistory.slice(-60)}>
                  <defs><linearGradient id="chartGrad" x1="0" y1="0" x2="0" y2="1"><stop offset="5%" stopColor="#1D4ED8" stopOpacity={0.3} /><stop offset="95%" stopColor="#1D4ED8" stopOpacity={0} /></linearGradient></defs>
                  <XAxis dataKey="date" tick={{ fill: '#64748B', fontSize: 10 }} axisLine={false} tickLine={false} interval={10} />
                  <YAxis tick={{ fill: '#64748B', fontSize: 10 }} axisLine={false} tickLine={false} tickFormatter={v => `$${v.toFixed(0)}`} />
                  <Tooltip contentStyle={{ background: '#1E293B', border: 'none', borderRadius: 8, fontSize: 11 }} />
                  <Area type="monotone" dataKey="price" stroke="#1D4ED8" fill="url(#chartGrad)" strokeWidth={2} dot={false} />
                </AreaChart>
              </ResponsiveContainer>
            </div>
            <div className="flex flex-wrap gap-2 mt-4">
              {['RSI', 'MACD', 'Bollinger Bands', 'EMA 50', 'EMA 200', 'Volume', 'ATR', 'Stochastic'].map(ind => (
                <button key={ind} className="nova-badge-blue text-xs cursor-pointer hover:bg-nova-primary/20 transition-colors">{ind}</button>
              ))}
            </div>
          </div>
        </div>
      )}

      {activeTab === 'screener' && (
        <div className="space-y-5 animate-fade-in">
          <h2 className="nova-section-title">Backtesting & Screener</h2>
          <div className="nova-card p-5">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-5">
              {[
                ['Backtest Return', '+18.4%', 'text-nova-green'],
                ['Win Rate', '64%', 'text-nova-accent'],
                ['Max Drawdown', '-7.2%', 'text-nova-red'],
                ['Trades Tested', '248', 'text-nova-text'],
              ].map(([label, value, color]) => (
                <div key={label} className="nova-glass rounded-lg p-3 text-center">
                  <p className="text-xs text-nova-text-muted">{label}</p>
                  <p className={`text-lg font-bold ${color}`}>{value}</p>
                </div>
              ))}
            </div>
            <div className="grid md:grid-cols-4 gap-4 mb-5">
              {[['Market Cap', 'Any'], ['P/E Ratio', 'Under 30'], ['Sector', 'All'], ['52W Change', 'Any']].map(([label, def]) => (
                <div key={label}><label className="nova-label">{label}</label><select className="nova-input"><option>{def}</option></select></div>
              ))}
            </div>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead><tr className="text-xs text-nova-text-muted bg-nova-surface2">{['Symbol', 'Price', 'Change', 'P/E', 'Volume', 'Sector', 'Action'].map(h => <th key={h} className="text-left px-4 py-2.5">{h}</th>)}</tr></thead>
                <tbody>
                  {mockMarketStocks.map(s => (
                    <tr key={s.symbol} className="border-t border-nova-border/50 hover:bg-nova-surface2">
                      <td className="px-4 py-3 text-sm font-bold text-nova-text">{s.symbol}</td>
                      <td className="px-4 py-3 text-sm">${s.price.toFixed(2)}</td>
                      <td className={`px-4 py-3 text-sm font-semibold ${s.changePercent >= 0 ? 'text-nova-green' : 'text-nova-red'}`}>{s.changePercent >= 0 ? '+' : ''}{s.changePercent.toFixed(2)}%</td>
                      <td className="px-4 py-3 text-sm text-nova-text-muted">{s.pe.toFixed(1)}</td>
                      <td className="px-4 py-3 text-sm text-nova-text-muted">{s.volume}</td>
                      <td className="px-4 py-3 text-sm text-nova-text-muted">{s.sector.split(' ')[0]}</td>
                      <td className="px-4 py-3">
                        <button onClick={() => handleNewOrder('buy', s.symbol, s.price)} className="text-xs nova-btn-accent py-1 px-3">Buy</button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {activeTab === 'orders' && (
        <div className="space-y-5 animate-fade-in">
          <h2 className="nova-section-title">Orders</h2>
          <div className="nova-card overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead><tr className="text-xs text-nova-text-muted bg-nova-surface2">
                  {['Order ID', 'Symbol', 'Type', 'Qty', 'Price', 'Total', 'Status'].map(h => <th key={h} className="text-left px-4 py-3">{h}</th>)}
                </tr></thead>
                <tbody>
                  {orders.map(o => (
                    <tr key={o.id} className="border-t border-nova-border/50 hover:bg-nova-surface2">
                      <td className="px-4 py-3 text-xs text-nova-text-muted">{o.id}</td>
                      <td className="px-4 py-3 text-sm font-bold text-nova-text">{o.symbol}</td>
                      <td className={`px-4 py-3 text-sm font-semibold ${o.type === 'buy' ? 'text-nova-green' : 'text-nova-red'}`}>{o.type.toUpperCase()}</td>
                      <td className="px-4 py-3 text-sm text-nova-text">{o.quantity}</td>
                      <td className="px-4 py-3 text-sm text-nova-text">${o.price.toFixed(2)}</td>
                      <td className="px-4 py-3 text-sm text-nova-text">{formatCurrency(o.total)}</td>
                      <td className={`px-4 py-3 text-xs ${getStatusBadge(o.status)}`}>{o.status}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
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
                <div><p className="text-sm font-semibold text-nova-text">{alert.title}</p><p className="text-xs text-nova-text-muted">{alert.message}</p><p className="text-xs text-nova-text-subtle mt-1">{formatTimeAgo(alert.createdAt)}</p></div>
              </div>
            </div>
          ))}
        </div>
      )}

      {activeTab === 'community' && (
        <div className="space-y-4 animate-fade-in">
          <h2 className="nova-section-title">Community</h2>
          {communityPosts.map(post => (
            <div key={post.id} className="nova-card p-5">
              <div className="flex items-start gap-3 mb-3"><img src={post.userAvatar} alt="" className="w-9 h-9 rounded-full object-cover" /><div><p className="text-sm font-bold text-nova-text">{post.userName}</p><p className="text-xs text-nova-text-muted capitalize">{post.userRole} · {formatTimeAgo(post.createdAt)}</p></div></div>
              <p className="text-sm text-nova-text-muted">{post.content}</p>
              <div className="flex gap-4 text-xs text-nova-text-muted mt-3">
                <span>❤ {post.likes}</span><span>💬 {post.comments.length}</span>
              </div>
            </div>
          ))}
        </div>
      )}

      {activeTab === 'leaderboard' && (
        <div className="space-y-4 animate-fade-in">
          <h2 className="nova-section-title">Leaderboard</h2>
          {useAppStore.getState().leaderboard.map(e => (
            <div key={e.userId} className="nova-card p-4 flex items-center gap-4">
              <span className="text-lg font-black text-nova-yellow w-6">#{e.rank}</span>
              <img src={e.userAvatar} alt={e.userName} className="w-10 h-10 rounded-full object-cover" />
              <div className="flex-1"><p className="text-sm font-bold text-nova-text">{e.userName}</p><p className="text-xs text-nova-text-muted capitalize">{e.role}</p></div>
              <div className="text-right"><p className="text-sm font-bold text-nova-green">+{e.returns}%</p><p className="text-xs text-nova-text-muted">{e.winRate}% win</p></div>
            </div>
          ))}
        </div>
      )}

      {activeTab === 'wallet' && (
        <div className="space-y-5 animate-fade-in">
          <h2 className="nova-section-title">Wallet</h2>
          <div className="nova-card p-6 bg-gradient-to-br from-nova-primary/10 to-nova-accent/5 border-nova-primary/20">
            <p className="text-nova-text-muted text-sm mb-1">Available Balance</p>
            <p className="text-4xl font-black text-nova-text">{formatCurrency(walletBalance)}</p>
            <div className="flex gap-3 mt-4">
              <button onClick={() => { const amt = Number(prompt('Deposit amount ($):')); if (amt > 0) useAppStore.getState().deposit(amt, 'Bank Transfer'); }} className="nova-btn-accent text-sm py-2 px-5">+ Deposit</button>
              <button onClick={() => { const amt = Number(prompt('Withdraw amount ($):')); if (amt > 0) useAppStore.getState().withdraw(amt); }} className="nova-btn-outline text-sm py-2 px-5">Withdraw</button>
            </div>
          </div>
        </div>
      )}

      {activeTab === 'reports' && (
        <div className="space-y-4 animate-fade-in">
          <h2 className="nova-section-title">Reports</h2>
          {[
            { title: 'Portfolio Report', action: () => { import('@/lib/pdfGenerator').then(m => m.generatePortfolioReport(currentUser!, holdings, walletBalance)); } },
            { title: 'Tax Report', action: () => { import('@/lib/pdfGenerator').then(m => m.generateTaxReport(currentUser!)); } },
            { title: 'Performance Report', action: () => { import('@/lib/pdfGenerator').then(m => m.generatePerformanceReport(currentUser!, holdings)); } },
            { title: 'Risk Analysis', action: () => { import('@/lib/pdfGenerator').then(m => m.generateRiskReport(currentUser!, holdings)); } },
          ].map(r => (
            <div key={r.title} className="nova-card p-5 flex items-center justify-between">
              <p className="text-sm font-bold text-nova-text">{r.title}</p>
              <button onClick={r.action} className="nova-btn-primary text-sm py-2 px-5">Download PDF</button>
            </div>
          ))}
        </div>
      )}

      {activeTab === 'settings' && (
        <div className="space-y-5 animate-fade-in">
          <h2 className="nova-section-title">Settings</h2>
          <div className="nova-card p-6">
            <div className="flex items-center gap-4 mb-4">
              <img src={currentUser?.avatar} alt="" className="w-16 h-16 rounded-full object-cover" />
              <div><p className="text-lg font-bold text-nova-text">{currentUser?.name}</p><p className="text-sm text-nova-text-muted capitalize">{currentUser?.role} · {currentUser?.subscription} plan</p></div>
            </div>
            <div className="grid md:grid-cols-2 gap-4">
              {[['KYC Status', currentUser?.kycStatus], ['Risk Profile', currentUser?.riskProfile], ['Subscription', currentUser?.subscription], ['Member Since', currentUser?.joinDate]].map(([l, v]) => (
                <div key={String(l)} className="flex justify-between py-2 border-b border-nova-border/50">
                  <span className="text-sm text-nova-text-muted">{l}</span><span className="text-sm font-semibold text-nova-text capitalize">{v}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </DashboardLayout>
  );
};

export default TraderDashboard;

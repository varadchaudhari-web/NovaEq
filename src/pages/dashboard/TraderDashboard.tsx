import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import {
  Zap,
  TrendingUp,
  BarChart2,
  Activity,
  Plus,
  Play,
  Pause,
  Settings,
  Target,
  Trash2,
  Edit3,
  Copy,
  CheckCircle2,
  AlertCircle,
  X,
  ExternalLink,
  Shield,
  ArrowUpRight,
  ArrowDownRight,
  Filter,
  Search,
} from 'lucide-react';
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer, BarChart, Bar } from 'recharts';
import DashboardLayout from '@/components/layout/DashboardLayout';
import { useAppStore } from '@/stores/useAppStore';
import { formatCurrency, formatPercent, formatTimeAgo, cn, getStatusBadge } from '@/lib/utils';
import { mockMarketStocks } from '@/lib/mockData';
import DepositModal from '@/components/wallet/DepositModal';
import WithdrawalModal from '@/components/wallet/WithdrawalModal';
import ProfileSettingsPanel from '@/components/profile/ProfileSettingsPanel';
import type { Strategy, Order, Holding } from '@/types';

const TraderDashboard: React.FC = () => {
  const {
    currentUser,
    strategies,
    orders,
    holdings,
    walletBalance,
    alerts,
    communityPosts,
    toggleStrategyStatus,
    addStrategy,
    updateStrategy,
    deleteStrategy,
    addOrder,
    cancelOrder,
    deleteOrder,
    closeHolding,
    updateHolding,
    markAlertRead,
  } = useAppStore();

  const location = useLocation();
  const [activeTab, setActiveTab] = useState(
    (location.state as { activeTab?: string; selectedSymbol?: string } | null)?.activeTab || 'overview'
  );

  useEffect(() => {
    const stateTab = (location.state as { activeTab?: string } | null)?.activeTab;
    if (stateTab) {
      setActiveTab(stateTab);
    }
  }, [location.state]);

  // Toast Notification State
  const [toastMessage, setToastMessage] = useState<{ text: string; type: 'success' | 'error' | 'info' } | null>(null);
  const [showDepositModal, setShowDepositModal] = useState(false);
  const [showWithdrawModal, setShowWithdrawModal] = useState(false);

  const showToast = (text: string, type: 'success' | 'error' | 'info' = 'success') => {
    setToastMessage({ text, type });
    setTimeout(() => setToastMessage(null), 3500);
  };

  // Trade Modal State
  const [tradeModalOpen, setTradeModalOpen] = useState(false);
  const [tradeForm, setTradeForm] = useState({
    symbol: (location.state as { selectedSymbol?: string } | null)?.selectedSymbol || 'AAPL',
    name: 'Apple Inc.',
    type: 'buy' as 'buy' | 'sell',
    orderType: 'Market' as 'Market' | 'Limit' | 'Stop Loss' | 'Stop Limit',
    quantity: 10,
    price: 193.42,
    targetPrice: 215.0,
    stopLossPrice: 180.0,
  });

  // Strategy Modals
  const [showNewStrategy, setShowNewStrategy] = useState(false);
  const [editingStrategy, setEditingStrategy] = useState<Strategy | null>(null);
  const [strategyForm, setStrategyForm] = useState({
    name: '',
    description: '',
    risk: 'Medium' as 'Low' | 'Medium' | 'High',
    tags: 'Momentum, Breakout',
    targetReturn: 18,
    maxDrawdown: 6,
    isPublic: true,
  });

  // Position Modification Modal
  const [editingPosition, setEditingPosition] = useState<Holding | null>(null);
  const [positionForm, setPositionForm] = useState({ targetPrice: 0, stopLossPrice: 0 });

  // Order Filter
  const [orderFilter, setOrderFilter] = useState<'all' | 'buy' | 'sell' | 'executed' | 'cancelled'>('all');
  const [orderSearch, setOrderSearch] = useState('');

  const totalValue = holdings.reduce((s, h) => s + h.value, 0);
  const totalPnL = holdings.reduce((s, h) => s + h.pnl, 0);

  // Open Trade Modal Helper
  const handleOpenTrade = (symbol: string, defaultType: 'buy' | 'sell' = 'buy', price?: number) => {
    const stock = mockMarketStocks.find((s) => s.symbol.toUpperCase() === symbol.toUpperCase());
    const currentPrice = price || stock?.price || 150.0;
    setTradeForm({
      symbol: symbol.toUpperCase(),
      name: stock?.name || symbol.toUpperCase(),
      type: defaultType,
      orderType: 'Market',
      quantity: 10,
      price: currentPrice,
      targetPrice: Number((currentPrice * (defaultType === 'buy' ? 1.12 : 0.88)).toFixed(2)),
      stopLossPrice: Number((currentPrice * (defaultType === 'buy' ? 0.94 : 1.06)).toFixed(2)),
    });
    setTradeModalOpen(true);
  };

  // Execute Trade Order
  const handleExecuteTrade = (e: React.FormEvent) => {
    e.preventDefault();
    if (!tradeForm.symbol || tradeForm.quantity <= 0 || tradeForm.price <= 0) {
      showToast('Please enter valid order parameters.', 'error');
      return;
    }

    const orderTotal = tradeForm.quantity * tradeForm.price;
    if (tradeForm.type === 'buy' && orderTotal > walletBalance) {
      showToast(`Insufficient wallet margin. Required: ${formatCurrency(orderTotal)}, Available: ${formatCurrency(walletBalance)}`, 'error');
      return;
    }

    addOrder({
      symbol: tradeForm.symbol.toUpperCase(),
      name: tradeForm.name,
      type: tradeForm.type,
      quantity: Number(tradeForm.quantity),
      price: Number(tradeForm.price),
      status: 'executed',
      total: orderTotal,
    });

    setTradeModalOpen(false);
    showToast(
      `${tradeForm.type.toUpperCase()} order executed for ${tradeForm.quantity} shares of ${tradeForm.symbol} at $${Number(tradeForm.price).toFixed(2)} (${formatCurrency(orderTotal)})!`,
      'success'
    );
  };

  // Create Strategy
  const handleSaveStrategy = (e: React.FormEvent) => {
    e.preventDefault();
    if (!strategyForm.name.trim()) {
      showToast('Please enter strategy name', 'error');
      return;
    }

    const tagArray = strategyForm.tags
      .split(',')
      .map((t) => t.trim())
      .filter(Boolean);

    if (editingStrategy) {
      updateStrategy(editingStrategy.id, {
        name: strategyForm.name,
        description: strategyForm.description,
        isPublic: strategyForm.isPublic,
        tags: tagArray,
        returns: strategyForm.targetReturn,
        maxDrawdown: strategyForm.maxDrawdown,
      });
      showToast(`Strategy "${strategyForm.name}" updated successfully!`, 'success');
      setEditingStrategy(null);
    } else {
      addStrategy({
        name: strategyForm.name,
        description: strategyForm.description,
        status: 'active',
        returns: strategyForm.targetReturn,
        maxDrawdown: strategyForm.maxDrawdown,
        winRate: 68,
        trades: 0,
        isPublic: strategyForm.isPublic,
        followers: 1,
        tags: tagArray.length > 0 ? tagArray : ['Quant', 'AI Signals'],
      });
      showToast(`New Strategy "${strategyForm.name}" created and deployed!`, 'success');
      setShowNewStrategy(false);
    }

    setStrategyForm({
      name: '',
      description: '',
      risk: 'Medium',
      tags: 'Momentum, Breakout',
      targetReturn: 18,
      maxDrawdown: 6,
      isPublic: true,
    });
  };

  // Duplicate Strategy
  const handleDuplicateStrategy = (strat: Strategy) => {
    addStrategy({
      name: `${strat.name} (Copy)`,
      description: strat.description,
      status: 'draft',
      returns: strat.returns,
      maxDrawdown: strat.maxDrawdown,
      winRate: strat.winRate,
      trades: 0,
      isPublic: false,
      followers: 0,
      tags: [...strat.tags, 'Cloned'],
    });
    showToast(`Strategy "${strat.name}" cloned into draft!`, 'info');
  };

  // Delete Strategy
  const handleDeleteStrategy = (strat: Strategy) => {
    if (confirm(`Are you sure you want to delete strategy "${strat.name}"?`)) {
      deleteStrategy(strat.id);
      showToast(`Strategy "${strat.name}" deleted.`, 'info');
    }
  };

  // Filtered Orders
  const filteredOrders = orders.filter((o) => {
    const matchSearch =
      o.symbol.toLowerCase().includes(orderSearch.toLowerCase()) ||
      o.id.toLowerCase().includes(orderSearch.toLowerCase());
    if (!matchSearch) return false;

    if (orderFilter === 'all') return true;
    if (orderFilter === 'buy') return o.type === 'buy';
    if (orderFilter === 'sell') return o.type === 'sell';
    if (orderFilter === 'executed') return o.status === 'executed';
    if (orderFilter === 'cancelled') return o.status === 'cancelled';
    return true;
  });

  return (
    <DashboardLayout activeTab={activeTab} onTabChange={setActiveTab}>
      {/* Toast Notification Banner */}
      {toastMessage && (
        <div
          className={cn(
            'fixed top-20 right-6 z-50 p-4 rounded-2xl shadow-2xl border flex items-center gap-3 animate-fadeIn max-w-md backdrop-blur-xl',
            toastMessage.type === 'success' && 'bg-emerald-950/90 border-emerald-500/40 text-emerald-200',
            toastMessage.type === 'error' && 'bg-rose-950/90 border-rose-500/40 text-rose-200',
            toastMessage.type === 'info' && 'bg-blue-950/90 border-blue-500/40 text-blue-200'
          )}
        >
          {toastMessage.type === 'success' && <CheckCircle2 size={20} className="text-emerald-400 flex-shrink-0" />}
          {toastMessage.type === 'error' && <AlertCircle size={20} className="text-rose-400 flex-shrink-0" />}
          {toastMessage.type === 'info' && <Zap size={20} className="text-blue-400 flex-shrink-0" />}
          <p className="text-xs font-semibold leading-relaxed flex-1">{toastMessage.text}</p>
          <button onClick={() => setToastMessage(null)} className="text-slate-400 hover:text-white">
            <X size={14} />
          </button>
        </div>
      )}

      {/* OVERVIEW TAB */}
      {activeTab === 'overview' && (
        <div className="space-y-6 animate-fade-in">
          <div className="flex items-center justify-between flex-wrap gap-4">
            <div>
              <h1 className="text-2xl font-display font-bold text-nova-text">Trader Terminal</h1>
              <p className="text-nova-text-muted text-sm">
                Welcome back, {currentUser?.name?.split(' ')[0]}. {strategies.filter((s) => s.status === 'active').length} active algo bots running.
              </p>
            </div>
            <div className="flex gap-3">
              <button
                onClick={() => setShowNewStrategy(true)}
                className="nova-btn-outline text-sm flex items-center gap-2"
              >
                <Plus size={16} /> New Strategy
              </button>
              <button
                onClick={() => handleOpenTrade('NVDA', 'buy', 875.3)}
                className="nova-btn-accent text-sm flex items-center gap-2"
              >
                <TrendingUp size={16} /> Place Trade
              </button>
            </div>
          </div>

          {/* Quick Metrics */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            {[
              { label: 'Portfolio Value', value: formatCurrency(totalValue), sub: 'Live Asset Value' },
              {
                label: 'Total P&L',
                value: formatCurrency(totalPnL),
                sub: formatPercent((totalPnL / Math.max(1, totalValue - totalPnL)) * 100),
                pos: totalPnL >= 0,
              },
              {
                label: 'Active Strategies',
                value: String(strategies.filter((s) => s.status === 'active').length),
                sub: `${strategies.length} total deployed`,
              },
              { label: 'Cash Balance', value: formatCurrency(walletBalance), sub: 'Available Margin' },
            ].map(({ label, value, sub, pos }) => (
              <div key={label} className="nova-stat-card">
                <p className="text-xs text-nova-text-muted mb-2">{label}</p>
                <p className="text-xl font-bold text-nova-text">{value}</p>
                <p
                  className={`text-xs mt-1 ${
                    pos === false ? 'text-nova-red' : pos === true ? 'text-nova-green' : 'text-nova-text-muted'
                  }`}
                >
                  {sub}
                </p>
              </div>
            ))}
          </div>

          {/* Order Book + Live Strategies */}
          <div className="grid lg:grid-cols-2 gap-5">
            {/* Orders Feed */}
            <div className="nova-card overflow-hidden">
              <div className="flex items-center justify-between px-5 py-3.5 bg-nova-surface2 border-b border-nova-border">
                <h3 className="text-sm font-bold text-nova-text">Recent Orders Execution</h3>
                <button onClick={() => setActiveTab('orders')} className="text-xs text-nova-primary-light hover:underline">
                  View All ({orders.length})
                </button>
              </div>
              <div className="divide-y divide-nova-border/50">
                {orders.slice(0, 5).map((o) => (
                  <div key={o.id} className="flex items-center justify-between px-5 py-3 hover:bg-nova-surface2/50 transition-colors">
                    <div className="flex items-center gap-3">
                      <span
                        className={cn(
                          'text-xs font-bold px-2 py-0.5 rounded uppercase',
                          o.type === 'buy' ? 'bg-nova-green/10 text-nova-green border border-nova-green/20' : 'bg-nova-red/10 text-nova-red border border-nova-red/20'
                        )}
                      >
                        {o.type}
                      </span>
                      <div>
                        <p className="text-sm font-semibold text-nova-text">{o.symbol}</p>
                        <p className="text-xs text-nova-text-muted">
                          {o.quantity} shares @ ${o.price.toFixed(2)}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="text-right">
                        <p className="text-sm font-bold text-nova-text">{formatCurrency(o.total)}</p>
                        <span className={`text-xs ${getStatusBadge(o.status)}`}>{o.status}</span>
                      </div>
                      <button
                        onClick={() => handleOpenTrade(o.symbol, o.type, o.price)}
                        className="text-xs p-1.5 rounded-lg border border-nova-border hover:bg-nova-surface2 text-slate-300"
                        title="Re-order"
                      >
                        <Copy size={13} />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Strategies Widget */}
            <div className="nova-card overflow-hidden">
              <div className="flex items-center justify-between px-5 py-3.5 bg-nova-surface2 border-b border-nova-border">
                <h3 className="text-sm font-bold text-nova-text">Algo Strategies</h3>
                <button onClick={() => setActiveTab('algo')} className="text-xs text-nova-primary-light hover:underline">
                  Manage ({strategies.length})
                </button>
              </div>
              <div className="divide-y divide-nova-border/50">
                {strategies.slice(0, 4).map((s) => (
                  <div key={s.id} className="flex items-center justify-between px-5 py-3 hover:bg-nova-surface2/50 transition-colors">
                    <div>
                      <div className="flex items-center gap-2">
                        <p className="text-sm font-semibold text-nova-text">{s.name}</p>
                        <span className={getStatusBadge(s.status)}>{s.status}</span>
                      </div>
                      <p className="text-xs text-nova-text-muted mt-0.5">
                        {s.trades} trades · {s.winRate}% win rate
                      </p>
                    </div>
                    <div className="flex items-center gap-2.5">
                      <span className="text-sm font-bold text-nova-green">+{s.returns}%</span>
                      <button
                        onClick={() => {
                          toggleStrategyStatus(s.id);
                          showToast(`Strategy ${s.name} ${s.status === 'active' ? 'paused' : 'activated'}.`, 'info');
                        }}
                        className={cn(
                          'w-8 h-8 rounded-lg flex items-center justify-center transition-all border',
                          s.status === 'active'
                            ? 'bg-amber-500/10 border-amber-500/30 text-amber-400 hover:bg-amber-500/20'
                            : 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400 hover:bg-emerald-500/20'
                        )}
                        title={s.status === 'active' ? 'Pause' : 'Activate'}
                      >
                        {s.status === 'active' ? <Pause size={14} /> : <Play size={14} />}
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Open Positions with Full CRUD */}
          <div className="nova-card overflow-hidden">
            <div className="flex items-center justify-between px-5 py-3.5 bg-nova-surface2 border-b border-nova-border">
              <h3 className="text-sm font-bold text-nova-text">Open Positions & Portfolio Holdings</h3>
              <button
                onClick={() => handleOpenTrade('AAPL', 'buy', 193.42)}
                className="nova-btn-primary text-xs py-1.5 px-3 flex items-center gap-1.5"
              >
                <Plus size={13} /> Buy New Asset
              </button>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="text-xs text-nova-text-muted bg-nova-surface2/30">
                    <th className="text-left px-4 py-2.5">Symbol</th>
                    <th className="text-left px-4 py-2.5">Qty</th>
                    <th className="text-left px-4 py-2.5">Entry Price</th>
                    <th className="text-left px-4 py-2.5">LTP</th>
                    <th className="text-left px-4 py-2.5">Market Value</th>
                    <th className="text-left px-4 py-2.5">Total P&L</th>
                    <th className="text-right px-4 py-2.5">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {holdings.map((h) => (
                    <tr key={h.symbol} className="border-t border-nova-border/50 hover:bg-nova-surface2/40">
                      <td className="px-4 py-3">
                        <p className="text-sm font-bold text-nova-text">{h.symbol}</p>
                        <p className="text-xs text-nova-text-muted">{h.name}</p>
                      </td>
                      <td className="px-4 py-3 text-sm font-mono text-nova-text">{h.quantity}</td>
                      <td className="px-4 py-3 text-sm font-mono text-nova-text">${h.avgPrice.toFixed(2)}</td>
                      <td className="px-4 py-3 text-sm font-mono text-nova-text">${h.currentPrice.toFixed(2)}</td>
                      <td className="px-4 py-3 text-sm font-mono font-semibold text-nova-text">{formatCurrency(h.value)}</td>
                      <td className={`px-4 py-3 text-sm font-mono font-semibold ${h.pnl >= 0 ? 'text-nova-green' : 'text-nova-red'}`}>
                        {h.pnl >= 0 ? '+' : ''}
                        {formatCurrency(h.pnl)} ({formatPercent(h.pnlPercent)})
                      </td>
                      <td className="px-4 py-3 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          <button
                            onClick={() => handleOpenTrade(h.symbol, 'buy', h.currentPrice)}
                            className="text-xs bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 hover:bg-emerald-500/20 px-2.5 py-1 rounded-lg font-semibold transition-all"
                            title="Buy more shares"
                          >
                            + Buy
                          </button>
                          <button
                            onClick={() => handleOpenTrade(h.symbol, 'sell', h.currentPrice)}
                            className="text-xs bg-rose-500/10 border border-rose-500/30 text-rose-400 hover:bg-rose-500/20 px-2.5 py-1 rounded-lg font-semibold transition-all"
                            title="Sell shares"
                          >
                            - Sell
                          </button>
                          <button
                            onClick={() => {
                              if (confirm(`Close entire position for ${h.quantity}x ${h.symbol}?`)) {
                                closeHolding(h.symbol);
                                showToast(`Position ${h.symbol} closed and funds added to cash balance.`, 'success');
                              }
                            }}
                            className="text-xs bg-slate-800 hover:bg-rose-900/40 text-slate-300 hover:text-rose-300 border border-nova-border px-2 py-1 rounded-lg transition-all"
                          >
                            Close All
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* TRADING / MARKETS TAB */}
      {activeTab === 'trading' && (
        <div className="space-y-6 animate-fade-in">
          <div className="flex items-center justify-between flex-wrap gap-4">
            <div>
              <h2 className="nova-section-title">Live Trading Terminal</h2>
              <p className="text-xs text-nova-text-muted">Place instant Market, Limit, and Stop-Loss orders with one click.</p>
            </div>
            <button
              onClick={() => handleOpenTrade('NVDA', 'buy', 875.3)}
              className="nova-btn-primary text-sm flex items-center gap-2"
            >
              <Plus size={16} /> New Order
            </button>
          </div>

          <div className="grid lg:grid-cols-3 gap-6">
            {/* Market Watch Table */}
            <div className="lg:col-span-2 nova-card overflow-hidden">
              <div className="px-5 py-3.5 bg-nova-surface2 border-b border-nova-border flex items-center justify-between">
                <h3 className="text-sm font-bold text-nova-text">Live Equities Watchlist</h3>
                <span className="text-xs text-nova-text-muted">Click Buy/Sell to open order modal</span>
              </div>
              <div className="divide-y divide-nova-border/50">
                {mockMarketStocks.map((stock) => (
                  <div
                    key={stock.symbol}
                    className="flex items-center justify-between p-4 hover:bg-nova-surface2/50 transition-colors"
                  >
                    <div>
                      <div className="flex items-center gap-2">
                        <p className="text-sm font-bold text-nova-text">{stock.symbol}</p>
                        <span className="text-[10px] px-2 py-0.5 rounded bg-slate-800 text-slate-300 border border-slate-700">
                          {stock.sector.split(' ')[0]}
                        </span>
                      </div>
                      <p className="text-xs text-nova-text-muted">{stock.name}</p>
                    </div>

                    <div className="text-center">
                      <p className="text-sm font-mono font-bold text-nova-text">${stock.price.toFixed(2)}</p>
                      <span
                        className={`text-xs font-semibold ${
                          stock.changePercent >= 0 ? 'text-nova-green' : 'text-nova-red'
                        }`}
                      >
                        {stock.changePercent >= 0 ? '+' : ''}
                        {stock.changePercent.toFixed(2)}%
                      </span>
                    </div>

                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => handleOpenTrade(stock.symbol, 'buy', stock.price)}
                        className="px-3.5 py-1.5 rounded-lg bg-emerald-500/15 border border-emerald-500/40 text-emerald-400 hover:bg-emerald-500/25 text-xs font-bold transition-all"
                      >
                        BUY
                      </button>
                      <button
                        onClick={() => handleOpenTrade(stock.symbol, 'sell', stock.price)}
                        className="px-3.5 py-1.5 rounded-lg bg-rose-500/15 border border-rose-500/40 text-rose-400 hover:bg-rose-500/25 text-xs font-bold transition-all"
                      >
                        SELL
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Quick Order Form Box */}
            <div className="nova-card p-5">
              <h3 className="text-sm font-bold text-nova-text mb-3">Quick Trade Pad</h3>
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  handleExecuteTrade(e);
                }}
                className="space-y-4"
              >
                <div>
                  <label className="nova-label">Select Asset Symbol</label>
                  <select
                    value={tradeForm.symbol}
                    onChange={(e) => {
                      const sym = e.target.value;
                      const s = mockMarketStocks.find((item) => item.symbol === sym);
                      setTradeForm({
                        ...tradeForm,
                        symbol: sym,
                        name: s?.name || sym,
                        price: s?.price || tradeForm.price,
                      });
                    }}
                    className="nova-input"
                  >
                    {mockMarketStocks.map((s) => (
                      <option key={s.symbol} value={s.symbol}>
                        {s.symbol} — {s.name} (${s.price.toFixed(2)})
                      </option>
                    ))}
                  </select>
                </div>

                <div className="grid grid-cols-2 gap-2 p-1 bg-nova-surface2 rounded-xl border border-nova-border">
                  <button
                    type="button"
                    onClick={() => setTradeForm({ ...tradeForm, type: 'buy' })}
                    className={cn(
                      'py-2 rounded-lg text-xs font-bold transition-all',
                      tradeForm.type === 'buy' ? 'bg-emerald-500 text-white shadow-md' : 'text-slate-400 hover:text-white'
                    )}
                  >
                    BUY / LONG
                  </button>
                  <button
                    type="button"
                    onClick={() => setTradeForm({ ...tradeForm, type: 'sell' })}
                    className={cn(
                      'py-2 rounded-lg text-xs font-bold transition-all',
                      tradeForm.type === 'sell' ? 'bg-rose-500 text-white shadow-md' : 'text-slate-400 hover:text-white'
                    )}
                  >
                    SELL / SHORT
                  </button>
                </div>

                <div>
                  <label className="nova-label">Order Execution Type</label>
                  <select
                    value={tradeForm.orderType}
                    onChange={(e) => setTradeForm({ ...tradeForm, orderType: e.target.value as any })}
                    className="nova-input"
                  >
                    <option>Market</option>
                    <option>Limit</option>
                    <option>Stop Loss</option>
                    <option>Stop Limit</option>
                  </select>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="nova-label">Quantity</label>
                    <input
                      type="number"
                      min="1"
                      value={tradeForm.quantity}
                      onChange={(e) => setTradeForm({ ...tradeForm, quantity: Math.max(1, Number(e.target.value)) })}
                      className="nova-input font-mono"
                    />
                  </div>
                  <div>
                    <label className="nova-label">Order Price ($)</label>
                    <input
                      type="number"
                      step="0.01"
                      value={tradeForm.price}
                      onChange={(e) => setTradeForm({ ...tradeForm, price: Math.max(0.01, Number(e.target.value)) })}
                      className="nova-input font-mono"
                    />
                  </div>
                </div>

                {/* Calculation Summary */}
                <div className="p-3.5 rounded-xl bg-nova-surface2/60 border border-nova-border space-y-1.5 text-xs">
                  <div className="flex justify-between text-slate-400">
                    <span>Order Value:</span>
                    <span className="font-mono text-white font-bold">
                      {formatCurrency(tradeForm.quantity * tradeForm.price)}
                    </span>
                  </div>
                  <div className="flex justify-between text-slate-400">
                    <span>Available Cash:</span>
                    <span className="font-mono text-emerald-400 font-semibold">{formatCurrency(walletBalance)}</span>
                  </div>
                </div>

                <button
                  type="submit"
                  className={cn(
                    'w-full py-3 rounded-xl font-bold text-sm text-white shadow-lg transition-all',
                    tradeForm.type === 'buy'
                      ? 'bg-gradient-to-r from-emerald-500 to-emerald-700 hover:from-emerald-600 hover:to-emerald-800 shadow-emerald-500/25'
                      : 'bg-gradient-to-r from-rose-500 to-rose-700 hover:from-rose-600 hover:to-rose-800 shadow-rose-500/25'
                  )}
                >
                  Confirm {tradeForm.type.toUpperCase()} Order
                </button>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* ALGO STRATEGIES TAB (WITH FULL CRUD) */}
      {activeTab === 'algo' && (
        <div className="space-y-6 animate-fade-in">
          <div className="flex items-center justify-between flex-wrap gap-4">
            <div>
              <h2 className="nova-section-title">Algorithmic Trading Strategies (CRUD)</h2>
              <p className="text-xs text-nova-text-muted">Create, edit, duplicate, backtest, and deploy automated strategies.</p>
            </div>
            <button
              onClick={() => {
                setEditingStrategy(null);
                setStrategyForm({
                  name: '',
                  description: '',
                  risk: 'Medium',
                  tags: 'Mean-Reversion, RSI',
                  targetReturn: 22,
                  maxDrawdown: 5,
                  isPublic: true,
                });
                setShowNewStrategy(true);
              }}
              className="nova-btn-primary text-sm flex items-center gap-2"
            >
              <Plus size={16} /> Create New Strategy
            </button>
          </div>

          <div className="grid md:grid-cols-2 gap-5">
            {strategies.map((s) => (
              <div key={s.id} className="nova-card p-5 flex flex-col justify-between">
                <div>
                  <div className="flex items-start justify-between gap-3 mb-3">
                    <div>
                      <div className="flex items-center gap-2 flex-wrap mb-1">
                        <h3 className="text-base font-bold text-nova-text">{s.name}</h3>
                        <span className={getStatusBadge(s.status)}>{s.status}</span>
                        {s.isPublic && <span className="nova-badge-blue text-xs">Public</span>}
                      </div>
                      <p className="text-xs text-nova-text-muted leading-relaxed">{s.description}</p>
                    </div>

                    <button
                      onClick={() => {
                        toggleStrategyStatus(s.id);
                        showToast(`Strategy "${s.name}" is now ${s.status === 'active' ? 'paused' : 'activated'}.`, 'info');
                      }}
                      className={cn(
                        'px-3 py-1.5 rounded-lg border text-xs font-semibold flex items-center gap-1.5 transition-all flex-shrink-0',
                        s.status === 'active'
                          ? 'border-amber-500/40 text-amber-400 bg-amber-500/10 hover:bg-amber-500/20'
                          : 'border-emerald-500/40 text-emerald-400 bg-emerald-500/10 hover:bg-emerald-500/20'
                      )}
                    >
                      {s.status === 'active' ? (
                        <>
                          <Pause size={12} /> Pause
                        </>
                      ) : (
                        <>
                          <Play size={12} /> Activate
                        </>
                      )}
                    </button>
                  </div>

                  <div className="grid grid-cols-4 gap-2.5 text-xs my-4">
                    <div className="p-2 rounded-lg bg-nova-surface2 text-center">
                      <span className="text-slate-400 block text-[10px]">Return</span>
                      <b className="text-emerald-400 font-bold">+{s.returns}%</b>
                    </div>
                    <div className="p-2 rounded-lg bg-nova-surface2 text-center">
                      <span className="text-slate-400 block text-[10px]">Win Rate</span>
                      <b className="text-white font-bold">{s.winRate}%</b>
                    </div>
                    <div className="p-2 rounded-lg bg-nova-surface2 text-center">
                      <span className="text-slate-400 block text-[10px]">Max DD</span>
                      <b className="text-rose-400 font-bold">-{s.maxDrawdown}%</b>
                    </div>
                    <div className="p-2 rounded-lg bg-nova-surface2 text-center">
                      <span className="text-slate-400 block text-[10px]">Trades</span>
                      <b className="text-white font-bold">{s.trades}</b>
                    </div>
                  </div>

                  <div className="flex flex-wrap gap-1.5 mb-4">
                    {s.tags.map((tag) => (
                      <span key={tag} className="nova-badge-blue text-[10px] px-2 py-0.5">
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Strategy Action Buttons (CRUD) */}
                <div className="pt-3.5 border-t border-nova-border/60 flex items-center justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => {
                        setEditingStrategy(s);
                        setStrategyForm({
                          name: s.name,
                          description: s.description,
                          risk: 'Medium',
                          tags: s.tags.join(', '),
                          targetReturn: s.returns,
                          maxDrawdown: s.maxDrawdown,
                          isPublic: s.isPublic,
                        });
                        setShowNewStrategy(true);
                      }}
                      className="inline-flex items-center gap-1 text-xs px-2.5 py-1.5 rounded-lg border border-nova-border text-slate-300 hover:text-white hover:bg-nova-surface2"
                    >
                      <Edit3 size={13} /> Edit
                    </button>
                    <button
                      onClick={() => handleDuplicateStrategy(s)}
                      className="inline-flex items-center gap-1 text-xs px-2.5 py-1.5 rounded-lg border border-nova-border text-slate-300 hover:text-white hover:bg-nova-surface2"
                    >
                      <Copy size={13} /> Duplicate
                    </button>
                  </div>

                  <button
                    onClick={() => handleDeleteStrategy(s)}
                    className="inline-flex items-center gap-1 text-xs px-2.5 py-1.5 rounded-lg border border-rose-500/30 text-rose-400 hover:bg-rose-500/10 transition-colors"
                  >
                    <Trash2 size={13} /> Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ORDERS TAB (WITH FULL CRUD) */}
      {activeTab === 'orders' && (
        <div className="space-y-6 animate-fade-in">
          <div className="flex items-center justify-between flex-wrap gap-4">
            <div>
              <h2 className="nova-section-title">Order Ledger & History</h2>
              <p className="text-xs text-nova-text-muted">Manage, filter, cancel, or re-order trades.</p>
            </div>
            <button
              onClick={() => handleOpenTrade('AAPL', 'buy', 193.42)}
              className="nova-btn-primary text-sm flex items-center gap-2"
            >
              <Plus size={16} /> Place New Order
            </button>
          </div>

          {/* Filter Bar */}
          <div className="nova-card p-4 flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-2 flex-wrap">
              {(['all', 'buy', 'sell', 'executed', 'cancelled'] as const).map((filter) => (
                <button
                  key={filter}
                  onClick={() => setOrderFilter(filter)}
                  className={cn(
                    'px-3.5 py-1.5 rounded-lg text-xs font-semibold capitalize transition-all',
                    orderFilter === filter
                      ? 'bg-nova-primary text-white shadow-md'
                      : 'bg-nova-surface2 text-slate-400 hover:text-white'
                  )}
                >
                  {filter}
                </button>
              ))}
            </div>

            <div className="relative w-64">
              <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                value={orderSearch}
                onChange={(e) => setOrderSearch(e.target.value)}
                placeholder="Search symbol or order ID..."
                className="nova-input pl-8 py-1.5 text-xs w-full"
              />
            </div>
          </div>

          <div className="nova-card overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="text-xs text-nova-text-muted bg-nova-surface2">
                    <th className="text-left px-4 py-3">Order ID</th>
                    <th className="text-left px-4 py-3">Symbol</th>
                    <th className="text-left px-4 py-3">Side</th>
                    <th className="text-left px-4 py-3">Quantity</th>
                    <th className="text-left px-4 py-3">Price</th>
                    <th className="text-left px-4 py-3">Total Value</th>
                    <th className="text-left px-4 py-3">Timestamp</th>
                    <th className="text-left px-4 py-3">Status</th>
                    <th className="text-right px-4 py-3">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredOrders.length === 0 ? (
                    <tr>
                      <td colSpan={9} className="text-center py-10 text-xs text-slate-400 italic">
                        No orders matching the current filter.
                      </td>
                    </tr>
                  ) : (
                    filteredOrders.map((o) => (
                      <tr key={o.id} className="border-t border-nova-border/50 hover:bg-nova-surface2/40">
                        <td className="px-4 py-3 text-xs font-mono text-slate-400">{o.id}</td>
                        <td className="px-4 py-3 text-sm font-bold text-white">{o.symbol}</td>
                        <td className="px-4 py-3">
                          <span
                            className={cn(
                              'text-xs font-bold px-2 py-0.5 rounded uppercase',
                              o.type === 'buy' ? 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/30' : 'bg-rose-500/15 text-rose-400 border border-rose-500/30'
                            )}
                          >
                            {o.type}
                          </span>
                        </td>
                        <td className="px-4 py-3 text-sm font-mono text-white">{o.quantity}</td>
                        <td className="px-4 py-3 text-sm font-mono text-white">${o.price.toFixed(2)}</td>
                        <td className="px-4 py-3 text-sm font-mono font-semibold text-white">{formatCurrency(o.total)}</td>
                        <td className="px-4 py-3 text-xs text-slate-400">{formatTimeAgo(o.timestamp)}</td>
                        <td className="px-4 py-3 text-xs">
                          <span className={getStatusBadge(o.status)}>{o.status}</span>
                        </td>
                        <td className="px-4 py-3 text-right">
                          <div className="flex items-center justify-end gap-1.5">
                            <button
                              onClick={() => handleOpenTrade(o.symbol, o.type, o.price)}
                              className="text-xs px-2.5 py-1 rounded bg-blue-500/10 hover:bg-blue-500/20 text-blue-400 border border-blue-500/30 font-medium"
                              title="Repeat trade"
                            >
                              Re-Order
                            </button>
                            {o.status === 'pending' && (
                              <button
                                onClick={() => {
                                  cancelOrder(o.id);
                                  showToast(`Order ${o.id} cancelled.`, 'info');
                                }}
                                className="text-xs px-2.5 py-1 rounded bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 border border-rose-500/30 font-medium"
                              >
                                Cancel
                              </button>
                            )}
                            <button
                              onClick={() => {
                                deleteOrder(o.id);
                                showToast(`Order record ${o.id} removed.`, 'info');
                              }}
                              className="text-xs p-1 rounded text-slate-400 hover:text-rose-400"
                              title="Delete from history"
                            >
                              <Trash2 size={13} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* PORTFOLIO TAB */}
      {activeTab === 'portfolio' && (
        <div className="space-y-6 animate-fade-in">
          <div className="flex items-center justify-between flex-wrap gap-4">
            <div>
              <h2 className="nova-section-title">Holdings & Realized P&L</h2>
              <p className="text-xs text-nova-text-muted">Total value: {formatCurrency(totalValue)} across {holdings.length} securities.</p>
            </div>
            <button
              onClick={() => handleOpenTrade('MSFT', 'buy', 420.55)}
              className="nova-btn-primary text-sm flex items-center gap-2"
            >
              <Plus size={16} /> Add Position
            </button>
          </div>

          <div className="nova-card overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="text-xs text-nova-text-muted bg-nova-surface2">
                    {['Symbol', 'Qty', 'Entry Price', 'LTP', 'Value', 'Total P&L', 'P&L %', 'Day Change', 'Action'].map((h) => (
                      <th key={h} className="text-left px-4 py-3">
                        {h}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {holdings.map((h) => (
                    <tr key={h.symbol} className="border-t border-nova-border/50 hover:bg-nova-surface2">
                      <td className="px-4 py-3 text-sm font-bold text-nova-text">{h.symbol}</td>
                      <td className="px-4 py-3 text-sm text-nova-text">{h.quantity}</td>
                      <td className="px-4 py-3 text-sm">${h.avgPrice.toFixed(2)}</td>
                      <td className="px-4 py-3 text-sm">${h.currentPrice.toFixed(2)}</td>
                      <td className="px-4 py-3 text-sm font-semibold">{formatCurrency(h.value)}</td>
                      <td className={`px-4 py-3 text-sm font-semibold ${h.pnl >= 0 ? 'text-nova-green' : 'text-nova-red'}`}>
                        {h.pnl >= 0 ? '+' : ''}
                        {formatCurrency(h.pnl)}
                      </td>
                      <td className={`px-4 py-3 text-sm font-semibold ${h.pnl >= 0 ? 'text-nova-green' : 'text-nova-red'}`}>
                        {formatPercent(h.pnlPercent)}
                      </td>
                      <td className={`px-4 py-3 text-sm font-semibold ${h.change1dPercent >= 0 ? 'text-nova-green' : 'text-nova-red'}`}>
                        {formatPercent(h.change1dPercent)}
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex gap-2">
                          <button
                            onClick={() => handleOpenTrade(h.symbol, 'buy', h.currentPrice)}
                            className="text-xs nova-btn-accent py-1 px-2.5"
                          >
                            Buy
                          </button>
                          <button
                            onClick={() => handleOpenTrade(h.symbol, 'sell', h.currentPrice)}
                            className="text-xs bg-rose-500/10 border border-rose-500/30 text-rose-400 hover:bg-rose-500/20 py-1 px-2.5 rounded-lg font-semibold"
                          >
                            Sell
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* CHARTS TAB */}
      {activeTab === 'charts' && (
        <div className="space-y-5 animate-fade-in">
          <h2 className="nova-section-title">Technical Charting Terminal</h2>
          <div className="nova-card p-5">
            <p className="text-nova-text-muted text-sm mb-4">
              TradingView-grade charting with 80+ technical indicators.
            </p>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={mockMarketStocks[2].priceHistory.slice(-60)}>
                  <defs>
                    <linearGradient id="chartGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#1D4ED8" stopOpacity={0.3} />
                      <stop offset="95%" stopColor="#1D4ED8" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <XAxis dataKey="date" tick={{ fill: '#64748B', fontSize: 10 }} axisLine={false} tickLine={false} interval={10} />
                  <YAxis tick={{ fill: '#64748B', fontSize: 10 }} axisLine={false} tickLine={false} tickFormatter={(v) => `$${v.toFixed(0)}`} />
                  <Tooltip contentStyle={{ background: '#1E293B', border: 'none', borderRadius: 8, fontSize: 11 }} />
                  <Area type="monotone" dataKey="price" stroke="#1D4ED8" fill="url(#chartGrad)" strokeWidth={2} dot={false} />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      )}

      {/* SCREENER TAB */}
      {activeTab === 'screener' && (
        <div className="space-y-5 animate-fade-in">
          <h2 className="nova-section-title">Backtesting & Screener</h2>
          <div className="nova-card p-5">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="text-xs text-nova-text-muted bg-nova-surface2">
                    {['Symbol', 'Price', 'Change', 'P/E', 'Volume', 'Sector', 'Action'].map((h) => (
                      <th key={h} className="text-left px-4 py-2.5">
                        {h}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {mockMarketStocks.map((s) => (
                    <tr key={s.symbol} className="border-t border-nova-border/50 hover:bg-nova-surface2">
                      <td className="px-4 py-3 text-sm font-bold text-nova-text">{s.symbol}</td>
                      <td className="px-4 py-3 text-sm">${s.price.toFixed(2)}</td>
                      <td className={`px-4 py-3 text-sm font-semibold ${s.changePercent >= 0 ? 'text-nova-green' : 'text-nova-red'}`}>
                        {s.changePercent >= 0 ? '+' : ''}
                        {s.changePercent.toFixed(2)}%
                      </td>
                      <td className="px-4 py-3 text-sm text-nova-text-muted">{s.pe.toFixed(1)}</td>
                      <td className="px-4 py-3 text-sm text-nova-text-muted">{s.volume}</td>
                      <td className="px-4 py-3 text-sm text-nova-text-muted">{s.sector.split(' ')[0]}</td>
                      <td className="px-4 py-3">
                        <button
                          onClick={() => handleOpenTrade(s.symbol, 'buy', s.price)}
                          className="text-xs nova-btn-accent py-1 px-3"
                        >
                          Buy
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* ALERTS TAB */}
      {activeTab === 'alerts' && (
        <div className="space-y-4 animate-fade-in">
          <h2 className="nova-section-title">Alerts & Trigger Notifications</h2>
          {alerts.map((alert) => (
            <div
              key={alert.id}
              onClick={() => markAlertRead(alert.id)}
              className={cn('nova-card p-4 cursor-pointer', !alert.isRead && 'border-nova-primary/30 bg-nova-primary/5')}
            >
              <div className="flex items-start gap-3">
                <div className={cn('w-2 h-2 rounded-full mt-2', !alert.isRead ? 'bg-nova-primary-light' : 'bg-transparent')} />
                <div>
                  <p className="text-sm font-semibold text-nova-text">{alert.title}</p>
                  <p className="text-xs text-nova-text-muted">{alert.message}</p>
                  <p className="text-xs text-nova-text-subtle mt-1">{formatTimeAgo(alert.createdAt)}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* WALLET TAB */}
      {activeTab === 'wallet' && (
        <div className="space-y-5 animate-fade-in">
          <div className="flex items-center justify-between">
            <h2 className="nova-section-title">Trader Margin Wallet & Payouts</h2>
            <div className="flex gap-2">
              <button
                onClick={() => setShowDepositModal(true)}
                className="nova-btn-accent text-xs py-2 px-4 font-bold"
              >
                + Add Margin (Razorpay)
              </button>
              <button
                onClick={() => setShowWithdrawModal(true)}
                className="nova-btn-outline text-xs py-2 px-4"
              >
                Instant Bank Payout
              </button>
            </div>
          </div>
          <div className="nova-card p-6 bg-gradient-to-br from-slate-900 via-indigo-950/40 to-slate-900 border border-nova-border/80">
            <p className="text-nova-text-muted text-xs mb-1 uppercase tracking-wider">Available Trading Margin Balance</p>
            <p className="text-4xl font-mono font-black text-nova-text">{formatCurrency(walletBalance)}</p>
            <div className="flex gap-3 mt-5">
              <button
                onClick={() => setShowDepositModal(true)}
                className="nova-btn-accent text-sm py-2.5 px-6 font-bold"
              >
                + Deposit Margin
              </button>
              <button
                onClick={() => setShowWithdrawModal(true)}
                className="nova-btn-outline text-sm py-2.5 px-6"
              >
                Withdraw Funds
              </button>
            </div>
          </div>
        </div>
      )}

      {/* REPORTS TAB */}
      {activeTab === 'reports' && (
        <div className="space-y-4 animate-fade-in">
          <h2 className="nova-section-title">Reports & Tax Ledgers</h2>
          {[
            {
              title: 'Portfolio & Positions Report',
              action: () => {
                import('@/lib/pdfGenerator').then((m) => m.generatePortfolioReport(currentUser!, holdings, walletBalance));
              },
            },
            {
              title: 'Trading P&L & Tax Audit',
              action: () => {
                import('@/lib/pdfGenerator').then((m) => m.generateTaxReport(currentUser!));
              },
            },
            {
              title: 'Algo Bot Performance Summary',
              action: () => {
                import('@/lib/pdfGenerator').then((m) => m.generatePerformanceReport(currentUser!, holdings));
              },
            },
          ].map((r) => (
            <div key={r.title} className="nova-card p-5 flex items-center justify-between">
              <p className="text-sm font-bold text-nova-text">{r.title}</p>
              <button onClick={r.action} className="nova-btn-primary text-sm py-2 px-5">
                Download PDF
              </button>
            </div>
          ))}
        </div>
      )}

      {/* SETTINGS & PROFILE TAB */}
      {activeTab === 'settings' && (
        <div className="space-y-5 animate-fade-in">
          <h2 className="nova-section-title">Trader Profile & Risk Configuration</h2>
          <ProfileSettingsPanel />
        </div>
      )}

      {/* ========================================================================= */}
      {/* INTERACTIVE TRADE EXECUTION MODAL                                          */}
      {/* ========================================================================= */}
      {tradeModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fadeIn">
          <div
            className="relative w-full max-w-lg bg-[#0b1428] border border-[#1c2a45] rounded-3xl shadow-[0_25px_60px_-15px_rgba(0,0,0,0.9)] overflow-hidden flex flex-col"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="p-6 bg-gradient-to-b from-[#12203d] to-[#0b1428] border-b border-[#1c2a45] relative">
              <button
                onClick={() => setTradeModalOpen(false)}
                className="absolute top-5 right-5 w-8 h-8 rounded-full bg-[#1c2a45]/80 hover:bg-[#2a3c61] text-slate-300 flex items-center justify-center transition-colors"
              >
                <X size={16} />
              </button>

              <div className="flex items-center gap-2 mb-2">
                <span
                  className={cn(
                    'text-xs font-mono font-bold uppercase tracking-wider px-2.5 py-1 rounded-full border',
                    tradeForm.type === 'buy'
                      ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400'
                      : 'bg-rose-500/10 border-rose-500/30 text-rose-400'
                  )}
                >
                  {tradeForm.type === 'buy' ? 'Buy / Long Order' : 'Sell / Short Order'}
                </span>
                <span className="text-xs font-mono text-slate-400">Execution Pad</span>
              </div>

              <div className="flex items-center justify-between mt-2">
                <div>
                  <h3 className="text-2xl font-display font-bold text-white">{tradeForm.symbol}</h3>
                  <p className="text-xs text-slate-400">{tradeForm.name}</p>
                </div>
                <div className="text-right">
                  <span className="text-xl font-mono font-bold text-white">${Number(tradeForm.price).toFixed(2)}</span>
                </div>
              </div>
            </div>

            {/* Form Body */}
            <form onSubmit={handleExecuteTrade} className="p-6 space-y-4">
              {/* Buy / Sell Toggle Tabs */}
              <div className="grid grid-cols-2 gap-2 p-1 bg-[#0f1c33] rounded-xl border border-[#1c2a45]">
                <button
                  type="button"
                  onClick={() => setTradeForm({ ...tradeForm, type: 'buy' })}
                  className={cn(
                    'py-2 rounded-lg text-xs font-bold transition-all',
                    tradeForm.type === 'buy' ? 'bg-emerald-500 text-white shadow-md' : 'text-slate-400 hover:text-white'
                  )}
                >
                  BUY / LONG
                </button>
                <button
                  type="button"
                  onClick={() => setTradeForm({ ...tradeForm, type: 'sell' })}
                  className={cn(
                    'py-2 rounded-lg text-xs font-bold transition-all',
                    tradeForm.type === 'sell' ? 'bg-rose-500 text-white shadow-md' : 'text-slate-400 hover:text-white'
                  )}
                >
                  SELL / SHORT
                </button>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="nova-label">Order Type</label>
                  <select
                    value={tradeForm.orderType}
                    onChange={(e) => setTradeForm({ ...tradeForm, orderType: e.target.value as any })}
                    className="nova-input"
                  >
                    <option>Market</option>
                    <option>Limit</option>
                    <option>Stop Loss</option>
                    <option>Stop Limit</option>
                  </select>
                </div>
                <div>
                  <label className="nova-label">Execution Price ($)</label>
                  <input
                    type="number"
                    step="0.01"
                    value={tradeForm.price}
                    onChange={(e) => setTradeForm({ ...tradeForm, price: Math.max(0.01, Number(e.target.value)) })}
                    className="nova-input font-mono"
                  />
                </div>
              </div>

              <div>
                <div className="flex justify-between items-center mb-1">
                  <label className="nova-label">Quantity</label>
                  <div className="flex gap-1">
                    {[10, 25, 50, 100].map((qty) => (
                      <button
                        key={qty}
                        type="button"
                        onClick={() => setTradeForm({ ...tradeForm, quantity: qty })}
                        className="text-[10px] px-2 py-0.5 rounded bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700 font-mono"
                      >
                        +{qty}
                      </button>
                    ))}
                  </div>
                </div>
                <input
                  type="number"
                  min="1"
                  value={tradeForm.quantity}
                  onChange={(e) => setTradeForm({ ...tradeForm, quantity: Math.max(1, Number(e.target.value)) })}
                  className="nova-input font-mono"
                />
              </div>

              {/* Target & Stop Loss */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="nova-label">Target Profit ($)</label>
                  <input
                    type="number"
                    step="0.01"
                    value={tradeForm.targetPrice}
                    onChange={(e) => setTradeForm({ ...tradeForm, targetPrice: Number(e.target.value) })}
                    className="nova-input font-mono text-emerald-400"
                  />
                </div>
                <div>
                  <label className="nova-label">Stop Loss ($)</label>
                  <input
                    type="number"
                    step="0.01"
                    value={tradeForm.stopLossPrice}
                    onChange={(e) => setTradeForm({ ...tradeForm, stopLossPrice: Number(e.target.value) })}
                    className="nova-input font-mono text-rose-400"
                  />
                </div>
              </div>

              {/* Cost Calculation */}
              <div className="p-3.5 rounded-2xl bg-[#0f1c33] border border-[#1c2a45] space-y-2 text-xs">
                <div className="flex justify-between text-slate-400">
                  <span>Estimated Total Margin:</span>
                  <b className="font-mono text-white text-sm">{formatCurrency(tradeForm.quantity * tradeForm.price)}</b>
                </div>
                <div className="flex justify-between text-slate-400">
                  <span>Available Cash Balance:</span>
                  <b className="font-mono text-emerald-400">{formatCurrency(walletBalance)}</b>
                </div>
              </div>

              {/* Actions */}
              <div className="flex gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setTradeModalOpen(false)}
                  className="px-5 py-2.5 rounded-xl border border-[#1c2a45] text-slate-400 hover:text-white text-xs font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className={cn(
                    'flex-1 py-3 rounded-xl font-bold text-xs text-white shadow-lg transition-all',
                    tradeForm.type === 'buy'
                      ? 'bg-gradient-to-r from-emerald-500 to-emerald-700 hover:from-emerald-600 shadow-emerald-500/25'
                      : 'bg-gradient-to-r from-rose-500 to-rose-700 hover:from-rose-600 shadow-rose-500/25'
                  )}
                >
                  Execute {tradeForm.type.toUpperCase()} ({formatCurrency(tradeForm.quantity * tradeForm.price)})
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* STRATEGY CREATE / EDIT MODAL                                               */}
      {/* ========================================================================= */}
      {showNewStrategy && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-md flex items-center justify-center z-50 p-4">
          <div className="relative w-full max-w-md bg-[#0b1428] border border-[#1c2a45] rounded-3xl p-6 shadow-2xl">
            <button
              onClick={() => {
                setShowNewStrategy(false);
                setEditingStrategy(null);
              }}
              className="absolute top-5 right-5 w-8 h-8 rounded-full bg-[#1c2a45] text-slate-400 hover:text-white flex items-center justify-center"
            >
              <X size={16} />
            </button>
            <h3 className="text-xl font-display font-bold text-nova-text mb-4">
              {editingStrategy ? 'Edit Strategy' : 'Create New Strategy'}
            </h3>
            <form onSubmit={handleSaveStrategy} className="space-y-4">
              <div>
                <label className="nova-label">Strategy Name</label>
                <input
                  type="text"
                  required
                  value={strategyForm.name}
                  onChange={(e) => setStrategyForm({ ...strategyForm, name: e.target.value })}
                  className="nova-input"
                  placeholder="E.g., Quantum Momentum Alpha"
                />
              </div>
              <div>
                <label className="nova-label">Description & Logic</label>
                <textarea
                  required
                  value={strategyForm.description}
                  onChange={(e) => setStrategyForm({ ...strategyForm, description: e.target.value })}
                  className="nova-input resize-none h-20 text-xs"
                  placeholder="Describe your strategy triggers, indicators, and execution horizon..."
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="nova-label">Target Return (%)</label>
                  <input
                    type="number"
                    value={strategyForm.targetReturn}
                    onChange={(e) => setStrategyForm({ ...strategyForm, targetReturn: Number(e.target.value) })}
                    className="nova-input font-mono"
                  />
                </div>
                <div>
                  <label className="nova-label">Max Drawdown (%)</label>
                  <input
                    type="number"
                    value={strategyForm.maxDrawdown}
                    onChange={(e) => setStrategyForm({ ...strategyForm, maxDrawdown: Number(e.target.value) })}
                    className="nova-input font-mono"
                  />
                </div>
              </div>
              <div>
                <label className="nova-label">Tags (comma-separated)</label>
                <input
                  type="text"
                  value={strategyForm.tags}
                  onChange={(e) => setStrategyForm({ ...strategyForm, tags: e.target.value })}
                  className="nova-input text-xs"
                  placeholder="Momentum, RSI, Mean-Reversion"
                />
              </div>
              <label className="flex items-center gap-2 cursor-pointer pt-1">
                <input
                  type="checkbox"
                  checked={strategyForm.isPublic}
                  onChange={(e) => setStrategyForm({ ...strategyForm, isPublic: e.target.checked })}
                  className="w-4 h-4 accent-nova-accent"
                />
                <span className="text-xs text-nova-text-muted">Public strategy (visible on social marketplace)</span>
              </label>

              <div className="flex gap-3 pt-3">
                <button
                  type="button"
                  onClick={() => {
                    setShowNewStrategy(false);
                    setEditingStrategy(null);
                  }}
                  className="nova-btn-ghost flex-1 text-xs py-2.5"
                >
                  Cancel
                </button>
                <button type="submit" className="nova-btn-primary flex-1 text-xs py-2.5">
                  {editingStrategy ? 'Update Strategy' : 'Deploy Strategy'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Shared Modals */}
      <DepositModal isOpen={showDepositModal} onClose={() => setShowDepositModal(false)} />
      <WithdrawalModal isOpen={showWithdrawModal} onClose={() => setShowWithdrawModal(false)} />
    </DashboardLayout>
  );
};

export default TraderDashboard;

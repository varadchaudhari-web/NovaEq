import React, { useState } from 'react';
import { useLocation } from 'react-router-dom';
import {
  TrendingUp,
  TrendingDown,
  PieChart,
  BarChart2,
  Activity,
  Plus,
  Bell,
  Star,
  Wallet,
  ArrowUpRight,
  ArrowDownRight,
  Target,
  RefreshCw,
  ShieldCheck,
  Award,
  BookOpen,
  Calendar,
  FileText,
  CreditCard,
  Building,
  CheckCircle2,
  ChevronRight,
  Trash2,
  Edit3,
  Sliders,
  Sparkles,
  MessageSquare,
  Share2,
  Heart,
  X
} from 'lucide-react';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  PieChart as RPieChart,
  Pie,
  Cell,
  BarChart,
  Bar
} from 'recharts';
import DashboardLayout from '@/components/layout/DashboardLayout';
import { useAppStore } from '@/stores/useAppStore';
import { formatCurrency, formatPercent, formatTimeAgo, getPnLColor, getStatusBadge, cn } from '@/lib/utils';
import DepositModal from '@/components/wallet/DepositModal';
import WithdrawalModal from '@/components/wallet/WithdrawalModal';
import KYCVerificationModal from '@/components/profile/KYCVerificationModal';
import RiskAssessmentModal from '@/components/profile/RiskAssessmentModal';
import FinancialGoalModal from '@/components/profile/FinancialGoalModal';
import SIPModal from '@/components/wealth/SIPModal';
import LumpsumModal from '@/components/wealth/LumpsumModal';
import ProfileSettingsPanel from '@/components/profile/ProfileSettingsPanel';
import type { FinancialGoal, MutualFund } from '@/types';

const SECTOR_COLORS = ['#1D4ED8', '#10B981', '#F59E0B', '#8B5CF6', '#06B6D4', '#EF4444'];

const RetailInvestorDashboard: React.FC = () => {
  const {
    currentUser,
    holdings,
    orders,
    alerts,
    recommendations,
    walletBalance,
    communityPosts,
    marketStocks,
    watchlist,
    financialGoals,
    sipPlans,
    mutualFunds,
    courses,
    markAlertRead,
    toggleFollowRecommendation,
    addOrder,
    closeHolding,
    addToWatchlist,
    removeFromWatchlist,
    deleteGoal,
    toggleSIPStatus,
    cancelSIP,
    enrollCourse,
    updateCourseProgress,
    addCommunityPost,
    toggleLikePost,
  } = useAppStore();

  const location = useLocation();
  const [activeTab, setActiveTab] = useState(
    (location.state as { activeTab?: string } | null)?.activeTab || 'overview'
  );

  // Modals state
  const [showDepositModal, setShowDepositModal] = useState(false);
  const [showWithdrawModal, setShowWithdrawModal] = useState(false);
  const [showKYCModal, setShowKYCModal] = useState(false);
  const [showRiskModal, setShowRiskModal] = useState(false);
  const [showGoalModal, setShowGoalModal] = useState(false);
  const [goalToEdit, setGoalToEdit] = useState<FinancialGoal | null>(null);
  const [selectedFundForSIP, setSelectedFundForSIP] = useState<MutualFund | null>(null);
  const [selectedFundForLumpsum, setSelectedFundForLumpsum] = useState<MutualFund | null>(null);

  // Order Execution Modal
  const [tradeModal, setTradeModal] = useState<{ open: boolean; symbol: string; type: 'buy' | 'sell'; price: number }>({
    open: false,
    symbol: 'RELIANCE',
    type: 'buy',
    price: 2950,
  });
  const [tradeQty, setTradeQty] = useState('10');
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Community post input
  const [newPostContent, setNewPostContent] = useState('');
  const [newPostSymbol, setNewPostSymbol] = useState('');
  const [newPostSentiment, setNewPostSentiment] = useState<'bullish' | 'bearish' | 'neutral'>('bullish');

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  const totalValue = holdings.reduce((s, h) => s + h.value, 0);
  const totalPnL = holdings.reduce((s, h) => s + h.pnl, 0);
  const totalInvested = totalValue - totalPnL;
  const pnlPercent = totalInvested > 0 ? (totalPnL / totalInvested) * 100 : 0;
  const dayChange = holdings.reduce((s, h) => s + (h.change1d || 0) * h.quantity, 0);

  const sectorAlloc = holdings.reduce((acc, h) => {
    const sec = h.sector || 'Others';
    acc[sec] = (acc[sec] || 0) + h.value;
    return acc;
  }, {} as Record<string, number>);
  const pieData = Object.entries(sectorAlloc).map(([name, value]) => ({ name, value: Math.round(value) }));

  const growthData = currentUser?.portfolioValue
    ? Array.from({ length: 30 }, (_, i) => {
        const d = new Date();
        d.setDate(d.getDate() - (29 - i));
        return {
          date: d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
          value: Math.round(240000 + i * 1500 + Math.random() * 3000 - 1000),
        };
      })
    : [];

  const handleExecuteTrade = (e: React.FormEvent) => {
    e.preventDefault();
    const qty = Number(tradeQty);
    if (!qty || qty <= 0) return;

    const totalCost = qty * tradeModal.price;
    if (tradeModal.type === 'buy' && totalCost > walletBalance) {
      showToast(`Insufficient balance. Required: ${formatCurrency(totalCost)}, Available: ${formatCurrency(walletBalance)}`);
      return;
    }

    addOrder({
      symbol: tradeModal.symbol.toUpperCase(),
      name: tradeModal.symbol.toUpperCase(),
      type: tradeModal.type,
      quantity: qty,
      price: tradeModal.price,
      status: 'executed',
      total: totalCost,
    });

    setTradeModal({ ...tradeModal, open: false });
    showToast(`Order executed: ${tradeModal.type.toUpperCase()} ${qty}x ${tradeModal.symbol} @ ₹${tradeModal.price}`);
  };

  const handleCreatePost = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPostContent.trim()) return;
    addCommunityPost(newPostContent.trim(), newPostSymbol.trim() || undefined, newPostSentiment);
    setNewPostContent('');
    setNewPostSymbol('');
    showToast('Post published to NovaEq community!');
  };

  const unreadAlerts = alerts.filter((a) => !a.isRead);

  return (
    <DashboardLayout activeTab={activeTab} onTabChange={setActiveTab}>
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed top-20 right-8 z-50 bg-slate-900 border border-nova-accent/50 text-nova-text px-4 py-3 rounded-xl shadow-2xl flex items-center gap-3 animate-in fade-in slide-in-from-top-4">
          <Sparkles size={18} className="text-nova-accent" />
          <span className="text-xs font-semibold">{toastMessage}</span>
          <button onClick={() => setToastMessage(null)} className="text-nova-text-muted hover:text-nova-text ml-2">
            <X size={14} />
          </button>
        </div>
      )}

      {/* Overview Tab */}
      {activeTab === 'overview' && (
        <div className="space-y-6 animate-fade-in">
          {/* Welcome & Fast Actions Header */}
          <div className="flex items-center justify-between flex-wrap gap-4">
            <div>
              <h1 className="text-2xl font-display font-bold text-nova-text">
                Welcome back, {currentUser?.name?.split(' ')[0]}
              </h1>
              <p className="text-nova-text-muted text-xs">
                Risk Profile: <span className="text-nova-accent font-semibold capitalize">{currentUser?.riskProfile || 'Moderate'}</span> · KYC Status:{' '}
                <span className={cn('font-semibold uppercase text-[11px]', currentUser?.kycStatus === 'approved' ? 'text-emerald-400' : 'text-amber-400')}>
                  {currentUser?.kycStatus || 'Pending'}
                </span>
              </p>
            </div>
            <div className="flex items-center gap-2">
              <button onClick={() => setShowDepositModal(true)} className="nova-btn-accent text-xs py-2 px-4 flex items-center gap-1.5 font-bold">
                <CreditCard size={14} /> + Add Funds
              </button>
              <button onClick={() => setShowWithdrawModal(true)} className="nova-btn-outline text-xs py-2 px-4 flex items-center gap-1.5">
                <Building size={14} /> Withdraw
              </button>
              <button
                onClick={() =>
                  setTradeModal({
                    open: true,
                    symbol: 'RELIANCE',
                    type: 'buy',
                    price: 2950,
                  })
                }
                className="nova-btn-primary text-xs py-2 px-4 flex items-center gap-1.5 font-bold"
              >
                <Plus size={15} /> Quick Trade
              </button>
            </div>
          </div>

          {/* Key Metrics Cards */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            {[
              {
                label: 'Portfolio Value',
                value: formatCurrency(totalValue),
                sub: `${dayChange >= 0 ? '+' : ''}${formatCurrency(dayChange)} today`,
                positive: dayChange >= 0,
                icon: PieChart,
              },
              {
                label: 'Total P&L',
                value: formatCurrency(totalPnL),
                sub: formatPercent(pnlPercent),
                positive: totalPnL >= 0,
                icon: TrendingUp,
              },
              {
                label: 'Cash Balance',
                value: formatCurrency(walletBalance),
                sub: 'Ready for deployment',
                positive: true,
                icon: Wallet,
                action: () => setShowDepositModal(true),
              },
              {
                label: 'Active Goals',
                value: `${financialGoals.length} Goals`,
                sub: 'SIPs tracking on plan',
                positive: true,
                icon: Target,
                action: () => setActiveTab('goals'),
              },
            ].map(({ label, value, sub, positive, icon: Icon, action }) => (
              <div
                key={label}
                className={cn('nova-stat-card transition-all', action && 'cursor-pointer hover:border-nova-accent/50')}
                onClick={action}
              >
                <div className="flex items-center justify-between mb-2">
                  <p className="text-xs text-nova-text-muted">{label}</p>
                  <Icon size={16} className="text-nova-text-subtle" />
                </div>
                <p className="text-xl font-bold text-nova-text">{value}</p>
                <p className={`text-xs mt-1 ${positive ? 'text-nova-green' : 'text-nova-red'}`}>{sub}</p>
              </div>
            ))}
          </div>

          {/* Growth & Allocation Charts */}
          <div className="grid lg:grid-cols-3 gap-5">
            <div className="lg:col-span-2 nova-card p-5">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h3 className="text-sm font-bold text-nova-text">Portfolio Performance (30 Days)</h3>
                  <p className="text-xs text-nova-text-muted">Real-time benchmarked against Nifty 50</p>
                </div>
                <span className="nova-badge-green text-xs font-mono">+{formatPercent(pnlPercent, false)}</span>
              </div>
              <div className="h-52">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={growthData}>
                    <defs>
                      <linearGradient id="pfGrad" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#10B981" stopOpacity={0.25} />
                        <stop offset="95%" stopColor="#10B981" stopOpacity={0} />
                      </linearGradient>
                    </defs>
                    <XAxis dataKey="date" tick={{ fill: '#64748B', fontSize: 10 }} axisLine={false} tickLine={false} interval={5} />
                    <YAxis tick={{ fill: '#64748B', fontSize: 10 }} axisLine={false} tickLine={false} tickFormatter={(v) => `₹${(v / 1000).toFixed(0)}K`} />
                    <Tooltip contentStyle={{ background: '#0F172A', border: '1px solid #334155', borderRadius: 8, fontSize: 11 }} formatter={(v: number) => [formatCurrency(v), 'Portfolio Value']} />
                    <Area type="monotone" dataKey="value" stroke="#10B981" fill="url(#pfGrad)" strokeWidth={2} dot={false} />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </div>

            <div className="nova-card p-5">
              <h3 className="text-sm font-bold text-nova-text mb-2">Asset & Sector Mix</h3>
              <div className="h-36">
                <ResponsiveContainer width="100%" height="100%">
                  <RPieChart>
                    <Pie data={pieData.length ? pieData : [{ name: 'Cash', value: 100 }]} cx="50%" cy="50%" innerRadius={38} outerRadius={60} dataKey="value" paddingAngle={3}>
                      {pieData.map((_, i) => (
                        <Cell key={i} fill={SECTOR_COLORS[i % SECTOR_COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip formatter={(v: number) => [formatCurrency(v), 'Value']} contentStyle={{ background: '#0F172A', border: '1px solid #334155', borderRadius: 8, fontSize: 11 }} />
                  </RPieChart>
                </ResponsiveContainer>
              </div>
              <div className="space-y-1.5 mt-2">
                {pieData.slice(0, 4).map((d, i) => (
                  <div key={d.name} className="flex items-center justify-between text-xs">
                    <div className="flex items-center gap-1.5">
                      <div className="w-2 h-2 rounded-full" style={{ background: SECTOR_COLORS[i % SECTOR_COLORS.length] }} />
                      <span className="text-nova-text-muted truncate max-w-[110px]">{d.name}</span>
                    </div>
                    <span className="text-nova-text font-semibold font-mono">{totalValue > 0 ? ((d.value / totalValue) * 100).toFixed(1) : 0}%</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Quick Holdings Table with Working Actions */}
          <div className="nova-card overflow-hidden">
            <div className="flex items-center justify-between px-5 py-3 border-b border-nova-border bg-nova-surface2">
              <h3 className="text-sm font-bold text-nova-text">Active Positions ({holdings.length})</h3>
              <button onClick={() => setActiveTab('portfolio')} className="text-xs text-nova-primary-light hover:underline font-semibold">
                Manage All Positions →
              </button>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="text-xs text-nova-text-muted border-b border-nova-border bg-nova-bg/30">
                    <th className="text-left px-4 py-2.5">Stock</th>
                    <th className="text-left px-4 py-2.5">Qty</th>
                    <th className="text-left px-4 py-2.5">Avg Price</th>
                    <th className="text-left px-4 py-2.5">LTP</th>
                    <th className="text-left px-4 py-2.5">Holding Value</th>
                    <th className="text-left px-4 py-2.5">Unrealized P&L</th>
                    <th className="text-right px-4 py-2.5">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {holdings.slice(0, 5).map((h) => (
                    <tr key={h.symbol} className="border-t border-nova-border/50 hover:bg-nova-surface2 transition-colors">
                      <td className="px-4 py-3">
                        <p className="text-sm font-bold text-nova-text">{h.symbol}</p>
                        <p className="text-[11px] text-nova-text-muted">{h.name}</p>
                      </td>
                      <td className="px-4 py-3 text-xs font-mono font-semibold text-nova-text">{h.quantity}</td>
                      <td className="px-4 py-3 text-xs font-mono text-nova-text">₹{h.avgPrice.toFixed(2)}</td>
                      <td className="px-4 py-3 text-xs font-mono text-nova-text">₹{h.currentPrice.toFixed(2)}</td>
                      <td className="px-4 py-3 text-xs font-mono font-bold text-nova-text">{formatCurrency(h.value)}</td>
                      <td className={`px-4 py-3 text-xs font-mono font-bold ${getPnLColor(h.pnl)}`}>
                        {h.pnl >= 0 ? '+' : ''}{formatCurrency(h.pnl)} ({formatPercent(h.pnlPercent)})
                      </td>
                      <td className="px-4 py-3 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          <button
                            onClick={() =>
                              setTradeModal({
                                open: true,
                                symbol: h.symbol,
                                type: 'buy',
                                price: h.currentPrice,
                              })
                            }
                            className="px-2 py-1 text-[11px] font-bold rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 hover:bg-emerald-500/20"
                          >
                            +Buy
                          </button>
                          <button
                            onClick={() =>
                              setTradeModal({
                                open: true,
                                symbol: h.symbol,
                                type: 'sell',
                                price: h.currentPrice,
                              })
                            }
                            className="px-2 py-1 text-[11px] font-bold rounded bg-rose-500/10 text-rose-400 border border-rose-500/30 hover:bg-rose-500/20"
                          >
                            -Sell
                          </button>
                          <button
                            onClick={() => {
                              closeHolding(h.symbol);
                              showToast(`Square-off completed for ${h.symbol}`);
                            }}
                            className="px-2 py-1 text-[11px] font-medium rounded border border-nova-border text-nova-text-muted hover:text-nova-red"
                          >
                            Exit
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

      {/* Portfolio Tab */}
      {activeTab === 'portfolio' && (
        <div className="space-y-5 animate-fade-in">
          <div className="flex items-center justify-between">
            <h2 className="nova-section-title">Portfolio & Holdings Management</h2>
            <button
              onClick={() =>
                setTradeModal({
                  open: true,
                  symbol: 'RELIANCE',
                  type: 'buy',
                  price: 2950,
                })
              }
              className="nova-btn-accent text-xs py-2 px-4 flex items-center gap-1.5 font-bold"
            >
              <Plus size={15} /> Add Position
            </button>
          </div>

          <div className="grid grid-cols-3 gap-4">
            <div className="nova-card p-4 text-center">
              <p className="text-xs text-nova-text-muted mb-1">Total Current Value</p>
              <p className="text-xl font-bold font-mono text-nova-text">{formatCurrency(totalValue)}</p>
            </div>
            <div className="nova-card p-4 text-center">
              <p className="text-xs text-nova-text-muted mb-1">Net Realized / Unrealized P&L</p>
              <p className={`text-xl font-bold font-mono ${getPnLColor(totalPnL)}`}>
                {totalPnL >= 0 ? '+' : ''}{formatCurrency(totalPnL)}
              </p>
            </div>
            <div className="nova-card p-4 text-center">
              <p className="text-xs text-nova-text-muted mb-1">Overall ROI %</p>
              <p className={`text-xl font-bold font-mono ${getPnLColor(totalPnL)}`}>{formatPercent(pnlPercent)}</p>
            </div>
          </div>

          <div className="nova-card overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="text-xs text-nova-text-muted bg-nova-surface2">
                    {['Symbol', 'Company Name', 'Qty', 'Avg Price', 'Current LTP', 'Total Value', 'P&L (₹)', 'ROI (%)', 'Actions'].map((h) => (
                      <th key={h} className="text-left px-4 py-3 font-semibold">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {holdings.map((h) => (
                    <tr key={h.symbol} className="border-t border-nova-border/50 hover:bg-nova-surface2 transition-colors">
                      <td className="px-4 py-3 text-sm font-bold text-nova-text">{h.symbol}</td>
                      <td className="px-4 py-3 text-xs text-nova-text-muted">{h.name}</td>
                      <td className="px-4 py-3 text-xs font-mono font-semibold text-nova-text">{h.quantity}</td>
                      <td className="px-4 py-3 text-xs font-mono text-nova-text">₹{h.avgPrice.toFixed(2)}</td>
                      <td className="px-4 py-3 text-xs font-mono text-nova-text">₹{h.currentPrice.toFixed(2)}</td>
                      <td className="px-4 py-3 text-xs font-mono font-bold text-nova-text">{formatCurrency(h.value)}</td>
                      <td className={`px-4 py-3 text-xs font-mono font-bold ${getPnLColor(h.pnl)}`}>
                        {h.pnl >= 0 ? '+' : ''}{formatCurrency(h.pnl)}
                      </td>
                      <td className={`px-4 py-3 text-xs font-mono font-bold ${getPnLColor(h.pnlPercent)}`}>
                        {formatPercent(h.pnlPercent)}
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-1.5">
                          <button
                            onClick={() =>
                              setTradeModal({
                                open: true,
                                symbol: h.symbol,
                                type: 'buy',
                                price: h.currentPrice,
                              })
                            }
                            className="px-2 py-1 text-[11px] font-bold rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 hover:bg-emerald-500/20"
                          >
                            +Buy
                          </button>
                          <button
                            onClick={() =>
                              setTradeModal({
                                open: true,
                                symbol: h.symbol,
                                type: 'sell',
                                price: h.currentPrice,
                              })
                            }
                            className="px-2 py-1 text-[11px] font-bold rounded bg-rose-500/10 text-rose-400 border border-rose-500/30 hover:bg-rose-500/20"
                          >
                            -Sell
                          </button>
                          <button
                            onClick={() => {
                              closeHolding(h.symbol);
                              showToast(`Closed entire position in ${h.symbol}`);
                            }}
                            className="px-2 py-1 text-[11px] rounded border border-rose-500/20 text-rose-400 hover:bg-rose-500/10"
                          >
                            Square Off
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

      {/* Markets Tab */}
      {activeTab === 'markets' && (
        <div className="space-y-5 animate-fade-in">
          <div className="flex items-center justify-between">
            <h2 className="nova-section-title">NSE / BSE Live Market Watch</h2>
            <span className="text-xs font-mono text-emerald-400 flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" /> Live Feed Active
            </span>
          </div>

          <div className="nova-card overflow-hidden">
            <div className="grid grid-cols-6 px-4 py-2.5 bg-nova-surface2 text-xs font-semibold text-nova-text-muted uppercase tracking-wider">
              <span className="col-span-2">Security Name</span>
              <span className="text-right">Price</span>
              <span className="text-right">Day Chg %</span>
              <span className="text-right">Volume</span>
              <span className="text-right">Actions</span>
            </div>
            {marketStocks.map((stock) => (
              <div key={stock.symbol} className="grid grid-cols-6 px-4 py-3 border-t border-nova-border/50 hover:bg-nova-surface2 transition-colors">
                <div className="col-span-2">
                  <p className="text-sm font-bold text-nova-text">{stock.symbol}</p>
                  <p className="text-xs text-nova-text-muted truncate">{stock.name}</p>
                </div>
                <p className="text-sm font-mono font-semibold text-nova-text text-right self-center">₹{stock.price.toFixed(2)}</p>
                <p className={`text-sm font-mono font-semibold text-right self-center ${stock.changePercent >= 0 ? 'text-nova-green' : 'text-nova-red'}`}>
                  {formatPercent(stock.changePercent)}
                </p>
                <p className="text-xs text-nova-text-muted text-right self-center font-mono">{stock.volume}</p>
                <div className="flex justify-end gap-1.5 self-center">
                  <button
                    onClick={() =>
                      setTradeModal({
                        open: true,
                        symbol: stock.symbol,
                        type: 'buy',
                        price: stock.price,
                      })
                    }
                    className="px-2.5 py-1 text-xs font-bold rounded bg-nova-accent text-nova-bg hover:opacity-90 transition-opacity"
                  >
                    Trade
                  </button>
                  <button
                    onClick={() => (watchlist.includes(stock.symbol) ? removeFromWatchlist(stock.symbol) : addToWatchlist(stock.symbol))}
                    className={cn(
                      'text-xs px-2 py-1 rounded-lg border transition-all',
                      watchlist.includes(stock.symbol)
                        ? 'bg-amber-500/10 border-amber-500/30 text-amber-400'
                        : 'border-nova-border text-nova-text-muted hover:text-nova-text'
                    )}
                  >
                    <Star size={13} fill={watchlist.includes(stock.symbol) ? 'currentColor' : 'none'} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Watchlist Tab */}
      {activeTab === 'watchlist' && (
        <div className="space-y-5 animate-fade-in">
          <div className="flex items-center justify-between">
            <h2 className="nova-section-title">My Tracked Securities</h2>
            <button onClick={() => setActiveTab('markets')} className="nova-btn-outline text-xs py-1.5 px-3">
              + Add Stocks
            </button>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
            {marketStocks
              .filter((stock) => watchlist.includes(stock.symbol))
              .map((stock) => (
                <div key={stock.symbol} className="nova-card p-5 hover:border-nova-accent/40 transition-all">
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <p className="text-base font-bold text-nova-text">{stock.symbol}</p>
                      <p className="text-xs text-nova-text-muted">{stock.name}</p>
                    </div>
                    <button
                      onClick={() => removeFromWatchlist(stock.symbol)}
                      className="text-xs text-nova-text-subtle hover:text-rose-400"
                    >
                      Remove
                    </button>
                  </div>
                  <div className="flex items-baseline justify-between mb-4">
                    <p className="text-2xl font-mono font-black text-nova-text">₹{stock.price.toFixed(2)}</p>
                    <span className={`text-sm font-mono font-semibold ${stock.changePercent >= 0 ? 'text-nova-green' : 'text-nova-red'}`}>
                      {formatPercent(stock.changePercent)}
                    </span>
                  </div>
                  <div className="flex items-center gap-2 pt-2 border-t border-nova-border/60">
                    <button
                      onClick={() =>
                        setTradeModal({
                          open: true,
                          symbol: stock.symbol,
                          type: 'buy',
                          price: stock.price,
                        })
                      }
                      className="nova-btn-accent text-xs py-1.5 flex-1 font-bold"
                    >
                      Buy Order
                    </button>
                    <button
                      onClick={() =>
                        setTradeModal({
                          open: true,
                          symbol: stock.symbol,
                          type: 'sell',
                          price: stock.price,
                        })
                      }
                      className="nova-btn-outline text-xs py-1.5 flex-1"
                    >
                      Sell Order
                    </button>
                  </div>
                </div>
              ))}
          </div>
        </div>
      )}

      {/* Financial Goals & Wealth Planning Tab */}
      {activeTab === 'goals' && (
        <div className="space-y-5 animate-fade-in">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="nova-section-title">Goal-Based Wealth Planning</h2>
              <p className="text-xs text-nova-text-muted">Target milestones with automated SIP contributions</p>
            </div>
            <button
              onClick={() => {
                setGoalToEdit(null);
                setShowGoalModal(true);
              }}
              className="nova-btn-primary text-xs py-2 px-4 flex items-center gap-1.5 font-bold"
            >
              <Plus size={15} /> Create Goal
            </button>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
            {financialGoals.map((goal) => {
              const progress = Math.min(100, Math.round((goal.currentAmount / goal.targetAmount) * 100));
              return (
                <div key={goal.id} className="nova-card p-5 flex flex-col justify-between hover:border-nova-accent/40 transition-all">
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                        {goal.category}
                      </span>
                      <div className="flex items-center gap-1">
                        <button
                          onClick={() => {
                            setGoalToEdit(goal);
                            setShowGoalModal(true);
                          }}
                          className="p-1 text-nova-text-subtle hover:text-nova-text"
                          title="Edit Goal"
                        >
                          <Edit3 size={13} />
                        </button>
                        <button
                          onClick={() => {
                            deleteGoal(goal.id);
                            showToast(`Deleted goal: ${goal.name}`);
                          }}
                          className="p-1 text-nova-text-subtle hover:text-rose-400"
                          title="Delete Goal"
                        >
                          <Trash2 size={13} />
                        </button>
                      </div>
                    </div>

                    <h3 className="text-base font-bold text-nova-text mb-1">{goal.name}</h3>
                    <p className="text-xs text-nova-text-muted mb-4">Target Year: {goal.targetYear}</p>

                    <div className="space-y-1.5 mb-4">
                      <div className="flex justify-between text-xs font-mono">
                        <span className="text-nova-text-muted">Saved: {formatCurrency(goal.currentAmount)}</span>
                        <span className="text-nova-text font-bold">Target: {formatCurrency(goal.targetAmount)}</span>
                      </div>
                      <div className="w-full h-2 rounded-full bg-nova-surface2 overflow-hidden">
                        <div className="h-full bg-gradient-to-r from-emerald-500 to-cyan-400 rounded-full" style={{ width: `${progress}%` }} />
                      </div>
                      <p className="text-[11px] text-right font-mono font-semibold text-emerald-400">{progress}% Achieved</p>
                    </div>
                  </div>

                  <div className="pt-3 border-t border-nova-border flex items-center justify-between text-xs">
                    <span className="text-nova-text-muted">Monthly SIP:</span>
                    <span className="font-mono font-bold text-nova-accent">{formatCurrency(goal.monthlyContribution)}/mo</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Mutual Funds & SIPs Tab */}
      {activeTab === 'mutual-funds' && (
        <div className="space-y-6 animate-fade-in">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="nova-section-title">Mutual Funds & Automated SIPs</h2>
              <p className="text-xs text-nova-text-muted">Direct mutual funds with zero commission</p>
            </div>
          </div>

          {/* Active SIPs Ledger */}
          <div className="nova-card overflow-hidden">
            <div className="px-5 py-3 bg-nova-surface2 border-b border-nova-border flex items-center justify-between">
              <h3 className="text-sm font-bold text-nova-text">My Active SIP Plans ({sipPlans.length})</h3>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="text-xs text-nova-text-muted border-b border-nova-border">
                    <th className="text-left px-4 py-2.5">Fund Name</th>
                    <th className="text-left px-4 py-2.5">Monthly SIP</th>
                    <th className="text-left px-4 py-2.5">Next Debit</th>
                    <th className="text-left px-4 py-2.5">Total Invested</th>
                    <th className="text-left px-4 py-2.5">Status</th>
                    <th className="text-right px-4 py-2.5">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {sipPlans.map((sip) => (
                    <tr key={sip.id} className="border-t border-nova-border/50 text-xs hover:bg-nova-surface2">
                      <td className="px-4 py-3 font-semibold text-nova-text">{sip.fundName}</td>
                      <td className="px-4 py-3 font-mono font-bold text-emerald-400">{formatCurrency(sip.amount)}</td>
                      <td className="px-4 py-3 font-mono text-nova-text-muted">{sip.nextDebitDate}</td>
                      <td className="px-4 py-3 font-mono text-nova-text">{formatCurrency(sip.totalInvested)} ({sip.installmentsPaid} debits)</td>
                      <td className="px-4 py-3">
                        <span className={cn('px-2 py-0.5 rounded text-[10px] font-bold uppercase', sip.status === 'active' ? 'bg-emerald-500/20 text-emerald-400' : 'bg-amber-500/20 text-amber-400')}>
                          {sip.status}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <button
                            onClick={() => toggleSIPStatus(sip.id)}
                            className="text-xs text-nova-text-muted hover:text-nova-accent underline"
                          >
                            {sip.status === 'active' ? 'Pause' : 'Resume'}
                          </button>
                          <button
                            onClick={() => {
                              cancelSIP(sip.id);
                              showToast('SIP plan cancelled.');
                            }}
                            className="text-xs text-rose-400 hover:text-rose-300"
                          >
                            Cancel
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Top Ranked Mutual Funds Catalog */}
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
            {mutualFunds.map((fund) => (
              <div key={fund.id} className="nova-card p-5 flex flex-col justify-between hover:border-nova-accent/50 transition-all">
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-blue-500/20 text-blue-400">
                      {fund.category}
                    </span>
                    <span className="text-xs font-mono font-bold text-emerald-400">+{fund.returns3y}% 3Y</span>
                  </div>
                  <h3 className="text-base font-bold text-nova-text mb-1">{fund.name}</h3>
                  <p className="text-xs text-nova-text-muted mb-3">Manager: {fund.fundManager} · AUM: {fund.aum}</p>

                  <div className="grid grid-cols-2 gap-2 text-xs font-mono bg-nova-bg/50 p-2.5 rounded-xl mb-4">
                    <div><span className="text-nova-text-subtle">NAV:</span> <span className="font-bold text-nova-text">₹{fund.nav.toFixed(2)}</span></div>
                    <div><span className="text-nova-text-subtle">Min SIP:</span> <span className="font-bold text-emerald-400">₹{fund.minSIP}</span></div>
                  </div>
                </div>

                <div className="flex items-center gap-2 pt-2 border-t border-nova-border">
                  <button
                    onClick={() => setSelectedFundForSIP(fund)}
                    className="nova-btn-accent text-xs py-2 flex-1 font-bold"
                  >
                    Start SIP
                  </button>
                  <button
                    onClick={() => setSelectedFundForLumpsum(fund)}
                    className="nova-btn-outline text-xs py-2 flex-1 hover:border-nova-accent hover:text-nova-accent font-semibold transition-all"
                  >
                    One-Time
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* AI Insights Tab */}
      {activeTab === 'ai-insights' && (
        <div className="space-y-5 animate-fade-in">
          <div className="flex items-center justify-between">
            <h2 className="nova-section-title">AI Portfolio Intelligence Engine</h2>
            <button onClick={() => setShowRiskModal(true)} className="nova-btn-outline text-xs py-1.5 px-3 flex items-center gap-1">
              <Sliders size={13} /> Re-calibrate Risk
            </button>
          </div>

          <div className="grid md:grid-cols-4 gap-4">
            {[
              { label: 'AI Health Score', value: '88/100', desc: 'Optimal Sharpe ratio & low tail-risk', color: 'text-emerald-400' },
              { label: 'Risk Calibration', value: currentUser?.riskProfile || 'Moderate', desc: 'Calibrated across equity & derivatives', color: 'text-nova-accent' },
              { label: 'Sector Concentration', value: 'Balanced', desc: 'No single sector exceeds 35% weight', color: 'text-cyan-400' },
              { label: 'Tactical Action', value: 'Accumulate Largecaps', desc: 'Banking & Auto sectors poised for breakout', color: 'text-amber-400' },
            ].map((item) => (
              <div key={item.label} className="nova-card p-4">
                <p className="text-xs text-nova-text-muted mb-1">{item.label}</p>
                <p className={`text-xl font-black ${item.color}`}>{item.value}</p>
                <p className="text-xs text-nova-text-subtle mt-1">{item.desc}</p>
              </div>
            ))}
          </div>

          {/* AI Recommended Stock Ideas */}
          <div className="nova-card p-5">
            <h3 className="text-sm font-bold text-nova-text mb-4">High Conviction AI Trade Setups</h3>
            <div className="space-y-3">
              {recommendations.map((rec) => (
                <div key={rec.id} className="p-4 rounded-xl bg-nova-bg/50 border border-nova-border/70 flex items-center justify-between gap-4">
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-sm font-bold text-nova-text">{rec.symbol}</span>
                      <span className={cn('text-[10px] font-bold px-2 py-0.5 rounded uppercase', rec.action === 'buy' ? 'bg-emerald-500/20 text-emerald-400' : 'bg-rose-500/20 text-rose-400')}>
                        {rec.action}
                      </span>
                      <span className="text-xs text-nova-text-muted">Target: ₹{rec.targetPrice} (+{rec.upside.toFixed(1)}%)</span>
                    </div>
                    <p className="text-xs text-nova-text-muted">{rec.rationale}</p>
                  </div>
                  <button
                    onClick={() =>
                      setTradeModal({
                        open: true,
                        symbol: rec.symbol,
                        type: rec.action === 'buy' ? 'buy' : 'sell',
                        price: rec.currentPrice,
                      })
                    }
                    className="nova-btn-primary text-xs py-2 px-4 flex-shrink-0 font-bold"
                  >
                    Execute Setup
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Community Feed Tab */}
      {activeTab === 'community' && (
        <div className="space-y-5 animate-fade-in">
          <h2 className="nova-section-title">Investor Community & Sentiment</h2>

          {/* Create Post */}
          <form onSubmit={handleCreatePost} className="nova-card p-5 space-y-3">
            <textarea
              rows={3}
              value={newPostContent}
              onChange={(e) => setNewPostContent(e.target.value)}
              className="nova-input text-xs resize-none"
              placeholder="Share market thesis, chart breakdown, or trading question with 100k+ investors..."
              required
            />
            <div className="flex items-center justify-between flex-wrap gap-2">
              <div className="flex items-center gap-2">
                <input
                  type="text"
                  value={newPostSymbol}
                  onChange={(e) => setNewPostSymbol(e.target.value.toUpperCase())}
                  className="nova-input text-xs w-28 uppercase font-mono"
                  placeholder="$TICKER"
                />
                <select
                  value={newPostSentiment}
                  onChange={(e) => setNewPostSentiment(e.target.value as any)}
                  className="nova-input text-xs"
                >
                  <option value="bullish">🟢 Bullish</option>
                  <option value="bearish">🔴 Bearish</option>
                  <option value="neutral">⚪ Neutral</option>
                </select>
              </div>
              <button type="submit" className="nova-btn-primary text-xs py-2 px-5 font-bold">
                Publish Post
              </button>
            </div>
          </form>

          {/* Feed */}
          <div className="space-y-4">
            {communityPosts.map((post) => (
              <div key={post.id} className="nova-card p-5">
                <div className="flex items-start gap-3 mb-3">
                  <img src={post.userAvatar} alt={post.userName} className="w-10 h-10 rounded-full object-cover" />
                  <div>
                    <div className="flex items-center gap-2">
                      <p className="text-sm font-bold text-nova-text">{post.userName}</p>
                      {post.symbol && (
                        <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-nova-primary/20 text-nova-primary-light">
                          ${post.symbol}
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-nova-text-muted capitalize">{post.userRole} · {formatTimeAgo(post.createdAt)}</p>
                  </div>
                </div>
                <p className="text-sm text-nova-text mb-4 leading-relaxed">{post.content}</p>
                <div className="flex items-center gap-5 text-xs text-nova-text-muted pt-3 border-t border-nova-border/60">
                  <button onClick={() => toggleLikePost(post.id)} className="flex items-center gap-1.5 hover:text-rose-400 transition-colors">
                    <Heart size={14} fill={post.isLiked ? '#F43F5E' : 'none'} className={post.isLiked ? 'text-rose-500' : ''} />
                    <span>{post.likes}</span>
                  </button>
                  <span className="flex items-center gap-1.5">
                    <MessageSquare size={14} /> {post.comments.length}
                  </span>
                  <span className="flex items-center gap-1.5">
                    <Share2 size={14} /> {post.shares}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Learning Hub Tab */}
      {activeTab === 'learning' && (
        <div className="space-y-5 animate-fade-in">
          <h2 className="nova-section-title">Investor Academy & Interactive Courses</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
            {courses.map((course) => (
              <div key={course.id} className="nova-card overflow-hidden flex flex-col justify-between">
                <div>
                  <img src={course.thumbnail} alt={course.title} className="w-full h-36 object-cover" />
                  <div className="p-4 space-y-2">
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-nova-primary/20 text-nova-primary-light">
                      {course.level.toUpperCase()}
                    </span>
                    <h3 className="text-sm font-bold text-nova-text">{course.title}</h3>
                    <p className="text-xs text-nova-text-muted">{course.instructor} · {course.duration}</p>
                    {course.isEnrolled && (
                      <div className="pt-2">
                        <div className="flex justify-between text-[11px] text-nova-text-muted mb-1">
                          <span>Progress</span>
                          <span>{course.progress}%</span>
                        </div>
                        <div className="w-full h-1.5 bg-nova-surface2 rounded-full overflow-hidden">
                          <div className="h-full bg-nova-accent rounded-full" style={{ width: `${course.progress}%` }} />
                        </div>
                      </div>
                    )}
                  </div>
                </div>
                <div className="p-4 pt-0">
                  <button
                    onClick={() => {
                      if (!course.isEnrolled) {
                        enrollCourse(course.id);
                        showToast(`Enrolled in: ${course.title}`);
                      } else {
                        updateCourseProgress(course.id, Math.min(100, course.progress + 25));
                        showToast(`Progress saved: ${course.title}`);
                      }
                    }}
                    className={cn('text-xs py-2 px-4 rounded-xl font-bold w-full', course.isEnrolled ? 'bg-nova-accent/20 border border-nova-accent/40 text-nova-accent' : 'nova-btn-primary')}
                  >
                    {course.isEnrolled ? (course.progress >= 100 ? 'Completed ✓' : 'Continue Lesson') : 'Enroll Free'}
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Wallet & Payments Tab */}
      {activeTab === 'wallet' && (
        <div className="space-y-6 animate-fade-in">
          <div className="flex items-center justify-between">
            <h2 className="nova-section-title">Digital Trading Wallet & Banking</h2>
            <div className="flex items-center gap-2">
              <button onClick={() => setShowDepositModal(true)} className="nova-btn-accent text-xs py-2 px-4 font-bold flex items-center gap-1.5">
                <CreditCard size={14} /> + Add Funds (Razorpay)
              </button>
              <button onClick={() => setShowWithdrawModal(true)} className="nova-btn-outline text-xs py-2 px-4 flex items-center gap-1.5">
                <Building size={14} /> Bank Payout (Instant)
              </button>
            </div>
          </div>

          <div className="nova-card p-6 bg-gradient-to-br from-slate-900 via-indigo-950/40 to-slate-900 border border-nova-border/80">
            <p className="text-xs text-nova-text-muted mb-1 uppercase tracking-wider">Available Trading Margin Balance</p>
            <p className="text-4xl font-mono font-black text-nova-text">{formatCurrency(walletBalance)}</p>
            <p className="text-xs text-emerald-400 mt-2 flex items-center gap-1">
              <ShieldCheck size={14} /> Bank-grade SEBI segregated client ledger
            </p>
          </div>

          {/* Transactions Ledger */}
          <div className="nova-card overflow-hidden">
            <div className="px-5 py-3 bg-nova-surface2 border-b border-nova-border">
              <h3 className="text-sm font-bold text-nova-text">Transaction History Ledger</h3>
            </div>
            <div className="divide-y divide-nova-border/50">
              {useAppStore.getState().walletTransactions.map((tx) => (
                <div key={tx.id} className="flex items-center justify-between px-5 py-3.5 hover:bg-nova-surface2 transition-colors">
                  <div>
                    <p className="text-xs font-semibold text-nova-text">{tx.description}</p>
                    <p className="text-[11px] text-nova-text-muted font-mono">{tx.reference} · {formatTimeAgo(tx.timestamp)}</p>
                  </div>
                  <p className={`text-xs font-mono font-bold ${tx.amount > 0 ? 'text-nova-green' : 'text-nova-red'}`}>
                    {tx.amount > 0 ? '+' : ''}{formatCurrency(Math.abs(tx.amount))}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Reports Tab */}
      {activeTab === 'reports' && (
        <div className="space-y-4 animate-fade-in">
          <h2 className="nova-section-title">Institutional Financial Reports</h2>
          {[
            {
              title: 'Portfolio Valuation & Allocation Report',
              desc: 'Audited holdings summary, sector weights, P&L statement, and beta analysis',
              action: () => import('@/lib/pdfGenerator').then((m) => m.generatePortfolioReport(currentUser!, holdings, walletBalance)),
            },
            {
              title: 'Capital Gains Tax Statement (FY 2023-24)',
              desc: 'Short-term (STCG) and Long-term (LTCG) tax breakdown compliant with Indian Income Tax Act',
              action: () => import('@/lib/pdfGenerator').then((m) => m.generateTaxReport(currentUser!)),
            },
            {
              title: 'Alpha & Performance Benchmark Report',
              desc: 'Drawdown analysis, Sharpe ratio, and alpha generation vs Nifty 50 and S&P 500',
              action: () => import('@/lib/pdfGenerator').then((m) => m.generatePerformanceReport(currentUser!, holdings)),
            },
            {
              title: 'Risk Profile & Value at Risk (VaR) Report',
              desc: 'Stress testing scenarios, liquidity risk, and portfolio diversification health check',
              action: () => import('@/lib/pdfGenerator').then((m) => m.generateRiskReport(currentUser!, holdings)),
            },
          ].map((rep) => (
            <div key={rep.title} className="nova-card p-5 flex items-center justify-between gap-4">
              <div>
                <p className="text-sm font-bold text-nova-text">{rep.title}</p>
                <p className="text-xs text-nova-text-muted">{rep.desc}</p>
              </div>
              <button onClick={rep.action} className="nova-btn-primary text-xs py-2 px-5 flex-shrink-0 font-bold">
                Download PDF
              </button>
            </div>
          ))}
        </div>
      )}

      {/* Profile & Settings Tab */}
      {activeTab === 'settings' && (
        <div className="space-y-5 animate-fade-in">
          <h2 className="nova-section-title">Investor Profile & Account Settings</h2>
          <ProfileSettingsPanel />
        </div>
      )}

      {/* Trade Execution Modal */}
      {tradeModal.open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md p-4 animate-fade-in">
          <div className="nova-card border border-nova-border w-full max-w-sm p-6 relative shadow-2xl">
            <button
              onClick={() => setTradeModal({ ...tradeModal, open: false })}
              className="absolute top-4 right-4 text-nova-text-muted hover:text-nova-text"
            >
              <X size={18} />
            </button>

            <form onSubmit={handleExecuteTrade} className="space-y-4">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <span className={cn('text-[10px] font-bold px-2 py-0.5 rounded uppercase', tradeModal.type === 'buy' ? 'bg-emerald-500/20 text-emerald-400' : 'bg-rose-500/20 text-rose-400')}>
                    {tradeModal.type} Order
                  </span>
                  <span className="text-xs font-mono font-bold text-nova-text">₹{tradeModal.price.toFixed(2)}</span>
                </div>
                <h3 className="text-xl font-display font-bold text-nova-text">{tradeModal.symbol}</h3>
              </div>

              <div>
                <label className="nova-label text-xs">Quantity</label>
                <input
                  type="number"
                  required
                  min="1"
                  value={tradeQty}
                  onChange={(e) => setTradeQty(e.target.value)}
                  className="nova-input text-sm font-mono font-bold"
                />
              </div>

              <div className="p-3 bg-nova-bg/60 rounded-xl space-y-1 text-xs">
                <div className="flex justify-between text-nova-text-muted">
                  <span>Order Value:</span>
                  <span className="font-mono font-bold text-nova-text">{formatCurrency(Number(tradeQty) * tradeModal.price)}</span>
                </div>
                <div className="flex justify-between text-nova-text-muted">
                  <span>Available Balance:</span>
                  <span className="font-mono font-semibold text-emerald-400">{formatCurrency(walletBalance)}</span>
                </div>
              </div>

              <div className="flex items-center gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setTradeModal({ ...tradeModal, open: false })}
                  className="nova-btn-outline text-xs flex-1 py-2.5"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className={cn('text-xs flex-1 py-2.5 rounded-xl font-bold transition-all', tradeModal.type === 'buy' ? 'bg-emerald-500 hover:bg-emerald-600 text-white' : 'bg-rose-500 hover:bg-rose-600 text-white')}
                >
                  Confirm {tradeModal.type.toUpperCase()}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Shared Modals */}
      <DepositModal isOpen={showDepositModal} onClose={() => setShowDepositModal(false)} />
      <WithdrawalModal isOpen={showWithdrawModal} onClose={() => setShowWithdrawModal(false)} />
      <KYCVerificationModal isOpen={showKYCModal} onClose={() => setShowKYCModal(false)} />
      <RiskAssessmentModal isOpen={showRiskModal} onClose={() => setShowRiskModal(false)} />
      <FinancialGoalModal isOpen={showGoalModal} onClose={() => setShowGoalModal(false)} goalToEdit={goalToEdit} />
      <SIPModal isOpen={!!selectedFundForSIP} onClose={() => setSelectedFundForSIP(null)} fund={selectedFundForSIP} />
      <LumpsumModal isOpen={!!selectedFundForLumpsum} onClose={() => setSelectedFundForLumpsum(null)} fund={selectedFundForLumpsum} />
    </DashboardLayout>
  );
};

export default RetailInvestorDashboard;

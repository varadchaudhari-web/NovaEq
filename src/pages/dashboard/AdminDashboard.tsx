import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import {
  Users,
  UserCheck,
  Shield,
  TrendingUp,
  Activity,
  AlertCircle,
  FileText,
  Settings,
  Check,
  X,
  Eye,
  Zap,
  Search,
  Filter,
  CheckCircle2,
  Lock,
  DollarSign,
  AlertTriangle,
  Play,
  Pause,
  Trash2,
  Bell
} from 'lucide-react';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar
} from 'recharts';
import DashboardLayout from '@/components/layout/DashboardLayout';
import { useAppStore } from '@/stores/useAppStore';
import { formatCurrency, formatDate, formatTimeAgo, cn, getStatusBadge } from '@/lib/utils';
import ProfileSettingsPanel from '@/components/profile/ProfileSettingsPanel';
import LearnManagementPanel from '@/components/admin/LearnManagementPanel';
import type { SubscriptionPlan, Order, Strategy } from '@/types';

const revenueData = Array.from({ length: 12 }, (_, i) => ({
  month: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'][i],
  revenue: Math.round(85000 + i * 12000 + Math.random() * 15000),
  users: Math.round(9000 + i * 1200 + Math.random() * 500),
}));

const auditLogs = [
  { id: 'log001', action: 'KYC Approved', user: 'Diana Lopez', admin: 'Compliance Desk (Admin)', timestamp: '2024-01-12T10:00:00Z', type: 'kyc' },
  { id: 'log002', action: 'KYC Rejected', user: 'Michael Wong', admin: 'Compliance Desk (Admin)', timestamp: '2024-01-11T09:00:00Z', type: 'kyc', notes: 'PAN Image blurred, re-upload requested' },
  { id: 'log003', action: 'Subscription Upgraded', user: 'Alex Reynolds', admin: 'System Billing', timestamp: '2024-01-10T14:30:00Z', type: 'subscription' },
  { id: 'log004', action: 'Trade Order Flagged', user: 'Priya Sharma', admin: 'Surveillance Engine', timestamp: '2024-01-09T16:20:00Z', type: 'compliance' },
  { id: 'log005', action: 'Penny Drop Verified', user: 'Rohan Joshi', admin: 'NPCI IMPS Node', timestamp: '2024-01-08T11:45:00Z', type: 'security' },
];

const systemAlerts = [
  { title: 'High Algo Trade Velocity Detected', severity: 'warning', message: 'NIFTY 24500 CE momentum strategy executed 48 orders in 10s. Monitoring risk limits.', time: '3m ago' },
  { title: 'KYC Desk Queue Notification', severity: 'info', message: '3 new SEBI KYC submissions pending officer approval.', time: '45m ago' },
  { title: 'Razorpay Sandbox Settlement', severity: 'success', message: 'All demo deposit and bank payout webhooks acknowledged with 100% SLA.', time: '2h ago' },
  { title: 'Peak Margin Compliance Checked', severity: 'success', message: 'Zero margin shortfall detected across all retail and trader accounts.', time: '3h ago' },
];

const AdminDashboard: React.FC = () => {
  const {
    kycApplications,
    users,
    subscriptionPlans,
    orders,
    strategies,
    alerts,
    markAlertRead,
    markAllAlertsRead,
    approveKYC,
    rejectKYC,
    updateUserSubscription,
    cancelOrder,
    deleteOrder,
    toggleStrategyStatus,
  } = useAppStore();

  const location = useLocation();
  const [activeTab, setActiveTab] = useState(
    (location.state as { activeTab?: string } | null)?.activeTab || 'overview'
  );

  useEffect(() => {
    const stateTab = (location.state as { activeTab?: string } | null)?.activeTab;
    if (stateTab) {
      setActiveTab(stateTab);
    }
  }, [location.state]);

  const [rejectModal, setRejectModal] = useState<{ open: boolean; id: string }>({ open: false, id: '' });
  const [rejectNotes, setRejectNotes] = useState('');
  const [selectedUser, setSelectedUser] = useState<string | null>(null);
  const [userSearch, setUserSearch] = useState('');
  const [userRoleFilter, setUserRoleFilter] = useState('all');
  const [flaggedOrders, setFlaggedOrders] = useState<Record<string, boolean>>({});
  const [viewDocsModal, setViewDocsModal] = useState<{ open: boolean; userName: string; docs: string[] } | null>(null);

  const pendingKYC = kycApplications.filter((k) => k.status === 'pending' || k.status === 'submitted');
  const totalUsers = users.length + 125000;

  const filteredUsers = users.filter((u) => {
    const matchesSearch = u.name.toLowerCase().includes(userSearch.toLowerCase()) || u.email.toLowerCase().includes(userSearch.toLowerCase());
    const matchesRole = userRoleFilter === 'all' || u.role === userRoleFilter;
    return matchesSearch && matchesRole;
  });

  const toggleFlagOrder = (orderId: string) => {
    setFlaggedOrders((prev) => ({ ...prev, [orderId]: !prev[orderId] }));
  };

  return (
    <DashboardLayout activeTab={activeTab} onTabChange={setActiveTab}>
      {/* Overview Tab */}
      {activeTab === 'overview' && (
        <div className="space-y-6 animate-fade-in">
          <div className="flex items-center justify-between flex-wrap gap-4">
            <div>
              <h1 className="text-2xl font-display font-bold text-nova-text">Super Admin & Compliance Command</h1>
              <p className="text-nova-text-muted text-xs">SEBI Surveillance Desk · Platform Oversight · Revenue & Risk</p>
            </div>
            <div className="flex items-center gap-2">
              <span className="px-3 py-1 rounded-full text-xs font-mono font-bold bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                ● System Health: 99.98%
              </span>
            </div>
          </div>

          {/* Metric Highlights */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            {[
              { label: 'Registered Investors & Traders', value: totalUsers.toLocaleString(), sub: '+1,480 this week', icon: Users, action: () => setActiveTab('users') },
              { label: 'Pending KYC Submissions', value: String(pendingKYC.length), sub: 'Awaiting officer signoff', icon: UserCheck, alert: pendingKYC.length > 0, action: () => setActiveTab('kyc') },
              { label: 'Monthly Platform Volume', value: '₹48.2 Cr', sub: '+22.4% MoM', icon: TrendingUp, action: () => setActiveTab('revenue') },
              { label: 'Active Algo Strategies', value: String(strategies.filter((s) => s.status === 'active').length), sub: 'Deployed across live markets', icon: Zap, action: () => setActiveTab('algo') },
            ].map(({ label, value, sub, icon: Icon, alert, action }) => (
              <div
                key={label}
                className={cn('nova-stat-card cursor-pointer transition-all hover:border-nova-accent/50', alert && 'border-amber-500/40 bg-amber-500/5')}
                onClick={action}
              >
                <div className="flex items-center justify-between mb-2">
                  <p className="text-xs text-nova-text-muted">{label}</p>
                  <Icon size={16} className={alert ? 'text-amber-400' : 'text-nova-text-subtle'} />
                </div>
                <p className="text-xl font-bold text-nova-text font-mono">{value}</p>
                <p className="text-xs mt-1 text-nova-text-muted">{sub}</p>
              </div>
            ))}
          </div>

          {/* Live System Alerts */}
          <div className="nova-card overflow-hidden">
            <div className="px-5 py-3 bg-nova-surface2 border-b border-nova-border flex items-center justify-between">
              <h3 className="text-sm font-bold text-nova-text flex items-center gap-2">
                <AlertTriangle size={15} className="text-amber-400" /> Real-Time Surveillance Feeds
              </h3>
              <span className="nova-badge-yellow text-xs">{systemAlerts.filter((a) => a.severity === 'warning').length} active triggers</span>
            </div>
            <div className="divide-y divide-nova-border/50">
              {systemAlerts.map((alert, i) => (
                <div key={i} className="flex items-start gap-3 px-5 py-3.5 hover:bg-nova-surface2 transition-colors">
                  <div className={cn('w-2.5 h-2.5 rounded-full mt-1.5 flex-shrink-0', alert.severity === 'warning' ? 'bg-amber-400' : 'bg-emerald-400')} />
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-bold text-nova-text">{alert.title}</p>
                    <p className="text-xs text-nova-text-muted mt-0.5">{alert.message}</p>
                  </div>
                  <span className="text-[11px] text-nova-text-subtle font-mono">{alert.time}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Revenue Analytics Chart */}
          <div className="nova-card p-5">
            <h3 className="text-sm font-bold text-nova-text mb-4">Platform Revenue & Subscription Trajectory (2024)</h3>
            <div className="h-56">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={revenueData}>
                  <XAxis dataKey="month" tick={{ fill: '#64748B', fontSize: 11 }} axisLine={false} tickLine={false} />
                  <YAxis tick={{ fill: '#64748B', fontSize: 11 }} axisLine={false} tickLine={false} tickFormatter={(v) => `₹${(v / 1000).toFixed(0)}K`} />
                  <Tooltip contentStyle={{ background: '#0F172A', border: '1px solid #334155', borderRadius: 8, fontSize: 11 }} formatter={(v: number) => [`₹${(v / 1000).toFixed(0)}K`, 'Revenue']} />
                  <Bar dataKey="revenue" fill="#3B82F6" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      )}

      {/* Users Management Tab */}
      {activeTab === 'users' && (
        <div className="space-y-5 animate-fade-in">
          <div className="flex items-center justify-between flex-wrap gap-3">
            <h2 className="nova-section-title">User Accounts & Tier Administration</h2>
            <div className="flex items-center gap-2">
              <div className="relative">
                <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-nova-text-subtle" />
                <input
                  type="text"
                  value={userSearch}
                  onChange={(e) => setUserSearch(e.target.value)}
                  className="nova-input pl-8 py-1.5 text-xs w-48"
                  placeholder="Search user / email..."
                />
              </div>
              <select
                value={userRoleFilter}
                onChange={(e) => setUserRoleFilter(e.target.value)}
                className="nova-input py-1.5 px-3 text-xs w-32"
              >
                <option value="all">All Roles</option>
                <option value="investor">Investor</option>
                <option value="trader">Trader</option>
                <option value="advisor">Advisor</option>
                <option value="admin">Admin</option>
              </select>
            </div>
          </div>

          <div className="nova-card overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="text-xs text-nova-text-muted bg-nova-surface2 border-b border-nova-border">
                    <th className="text-left px-4 py-2.5">User Profile</th>
                    <th className="text-left px-4 py-2.5">Role</th>
                    <th className="text-left px-4 py-2.5">KYC Status</th>
                    <th className="text-left px-4 py-2.5">Plan Tier</th>
                    <th className="text-left px-4 py-2.5">Portfolio Value</th>
                    <th className="text-right px-4 py-2.5">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredUsers.map((u) => (
                    <tr key={u.id} className="border-t border-nova-border/50 text-xs hover:bg-nova-surface2 transition-colors">
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-2.5">
                          <img src={u.avatar} alt={u.name} className="w-8 h-8 rounded-full object-cover" />
                          <div>
                            <p className="font-bold text-nova-text">{u.name}</p>
                            <p className="text-[11px] text-nova-text-muted">{u.email}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-4 py-3 capitalize font-medium text-nova-text">{u.role}</td>
                      <td className="px-4 py-3">
                        <span className={cn('text-[10px] font-bold px-2 py-0.5 rounded uppercase', getStatusBadge(u.kycStatus))}>
                          {u.kycStatus}
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        <select
                          value={u.subscription}
                          onChange={(e) => updateUserSubscription(u.id, e.target.value as SubscriptionPlan)}
                          className="nova-input py-1 px-2 text-[11px] font-bold uppercase w-24"
                        >
                          {subscriptionPlans.map((p) => (
                            <option key={p.id} value={p.id}>{p.name}</option>
                          ))}
                        </select>
                      </td>
                      <td className="px-4 py-3 font-mono font-bold text-nova-text">{formatCurrency(u.portfolioValue || 0)}</td>
                      <td className="px-4 py-3 text-right">
                        <button
                          onClick={() => setSelectedUser(u.id)}
                          className="nova-btn-outline text-[11px] py-1 px-2.5"
                        >
                          Inspect Profile
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

      {/* KYC Approval Panel */}
      {activeTab === 'kyc' && (
        <div className="space-y-5 animate-fade-in">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="nova-section-title">SEBI KYC Verification Desk</h2>
              <p className="text-xs text-nova-text-muted">Review submitted PAN, Aadhaar, and bank statements for regulatory approval</p>
            </div>
            <span className="text-xs font-mono font-bold text-amber-400 bg-amber-500/10 border border-amber-500/20 px-3 py-1 rounded-lg">
              {pendingKYC.length} Pending Review
            </span>
          </div>

          {pendingKYC.length === 0 ? (
            <div className="nova-card p-12 text-center space-y-3">
              <CheckCircle2 size={42} className="text-emerald-400 mx-auto" />
              <h3 className="text-lg font-bold text-nova-text">All KYC Applications Cleared</h3>
              <p className="text-xs text-nova-text-muted">Zero pending submissions in compliance queue.</p>
            </div>
          ) : (
            <div className="space-y-4">
              {pendingKYC.map((app) => (
                <div key={app.id} className="nova-card p-5 border border-nova-border hover:border-nova-accent/40 transition-all">
                  <div className="flex items-start justify-between flex-wrap gap-3 mb-4">
                    <div>
                      <h3 className="text-base font-bold text-nova-text">{app.userName}</h3>
                      <p className="text-xs text-nova-text-muted">{app.userEmail}</p>
                      <p className="text-[11px] text-nova-text-subtle font-mono mt-1">Submitted: {formatTimeAgo(app.submittedAt)}</p>
                    </div>
                    <span className="text-xs font-mono font-bold px-2.5 py-1 rounded bg-amber-500/20 text-amber-400 border border-amber-500/30 uppercase">
                      {app.status}
                    </span>
                  </div>

                  <div className="p-3 bg-nova-bg/60 rounded-xl mb-4 space-y-2">
                    <p className="text-xs font-semibold text-nova-text">Uploaded Identity Files:</p>
                    <div className="flex flex-wrap gap-2">
                      {app.documents.map((doc) => (
                        <div key={doc} className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-nova-surface text-xs text-nova-text font-mono border border-nova-border">
                          <FileText size={13} className="text-nova-accent" /> {doc}
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="flex items-center gap-2 pt-2 border-t border-nova-border">
                    <button
                      onClick={() => approveKYC(app.id)}
                      className="nova-btn-primary text-xs py-2 px-4 flex items-center gap-1.5 font-bold bg-emerald-500 hover:bg-emerald-600 text-white"
                    >
                      <Check size={14} /> Approve & Issue Compliance Certificate
                    </button>
                    <button
                      onClick={() => setRejectModal({ open: true, id: app.id })}
                      className="nova-btn-outline text-xs py-2 px-4 flex items-center gap-1.5 text-rose-400 hover:bg-rose-500/10 border-rose-500/30"
                    >
                      <X size={14} /> Reject with Note
                    </button>
                    <button
                      onClick={() => setViewDocsModal({ open: true, userName: app.userName, docs: app.documents })}
                      className="nova-btn-outline text-xs py-2 px-3 ml-auto flex items-center gap-1"
                    >
                      <Eye size={13} /> View Scans
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Trade Surveillance Tab */}
      {activeTab === 'trades' && (
        <div className="space-y-5 animate-fade-in">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="nova-section-title">Platform Trade Surveillance & Order Ledger</h2>
              <p className="text-xs text-nova-text-muted">Live audit trail of all orders executed across retail and institutional traders</p>
            </div>
            <span className="text-xs font-mono font-bold text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-3 py-1 rounded-lg">
              {orders.length} Total Orders Monitored
            </span>
          </div>

          <div className="nova-card overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="text-xs text-nova-text-muted bg-nova-surface2 border-b border-nova-border">
                    <th className="text-left px-4 py-2.5">Order ID</th>
                    <th className="text-left px-4 py-2.5">Security</th>
                    <th className="text-left px-4 py-2.5">Side</th>
                    <th className="text-left px-4 py-2.5">Quantity</th>
                    <th className="text-left px-4 py-2.5">Execution Price</th>
                    <th className="text-left px-4 py-2.5">Total Value</th>
                    <th className="text-left px-4 py-2.5">Status</th>
                    <th className="text-right px-4 py-2.5">Surveillance Action</th>
                  </tr>
                </thead>
                <tbody>
                  {orders.map((o) => (
                    <tr key={o.id} className={cn('border-t border-nova-border/50 text-xs hover:bg-nova-surface2 transition-colors', flaggedOrders[o.id] && 'bg-rose-500/5')}>
                      <td className="px-4 py-3 font-mono text-nova-text-muted">{o.id}</td>
                      <td className="px-4 py-3 font-bold text-nova-text">{o.symbol}</td>
                      <td className="px-4 py-3 font-bold">
                        <span className={cn('px-2 py-0.5 rounded text-[10px]', o.type === 'buy' ? 'bg-emerald-500/20 text-emerald-400' : 'bg-rose-500/20 text-rose-400')}>
                          {o.type.toUpperCase()}
                        </span>
                      </td>
                      <td className="px-4 py-3 font-mono text-nova-text">{o.quantity}</td>
                      <td className="px-4 py-3 font-mono text-nova-text">₹{o.price.toFixed(2)}</td>
                      <td className="px-4 py-3 font-mono font-bold text-nova-text">{formatCurrency(o.total || o.quantity * o.price)}</td>
                      <td className="px-4 py-3 font-semibold capitalize text-nova-text">{o.status}</td>
                      <td className="px-4 py-3 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          <button
                            onClick={() => toggleFlagOrder(o.id)}
                            className={cn('px-2 py-1 rounded text-[11px] font-bold border transition-all', flaggedOrders[o.id] ? 'bg-rose-500 text-white border-rose-600' : 'border-nova-border text-nova-text-muted hover:border-amber-500/50 hover:text-amber-400')}
                          >
                            {flaggedOrders[o.id] ? 'Flagged ⚑' : 'Flag Order'}
                          </button>
                          {o.status === 'open' && (
                            <button
                              onClick={() => cancelOrder(o.id)}
                              className="px-2 py-1 rounded text-[11px] font-medium border border-rose-500/30 text-rose-400 hover:bg-rose-500/10"
                            >
                              Cancel
                            </button>
                          )}
                          <button
                            onClick={() => deleteOrder(o.id)}
                            className="p-1 text-nova-text-subtle hover:text-rose-400"
                            title="Delete Record"
                          >
                            <Trash2 size={13} />
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

      {/* Algo Strategies Oversight Tab */}
      {activeTab === 'algo' && (
        <div className="space-y-5 animate-fade-in">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="nova-section-title">Automated Trading Strategies Oversight</h2>
              <p className="text-xs text-nova-text-muted">Master kill-switch and risk guardrails for all user-created algorithmic strategies</p>
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-5">
            {strategies.map((str) => (
              <div key={str.id} className="nova-card p-5 border border-nova-border hover:border-nova-accent/40 transition-all flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className={cn('px-2.5 py-0.5 rounded text-[10px] font-bold uppercase', str.status === 'active' ? 'bg-emerald-500/20 text-emerald-400' : 'bg-amber-500/20 text-amber-400')}>
                      {str.status}
                    </span>
                    <span className="text-xs font-mono font-bold text-emerald-400">+{str.returns}% Win Rate: {str.winRate}%</span>
                  </div>
                  <h3 className="text-base font-bold text-nova-text mb-1">{str.name}</h3>
                  <p className="text-xs text-nova-text-muted mb-4">{str.description}</p>

                  <div className="grid grid-cols-3 gap-2 bg-nova-bg/50 p-2.5 rounded-xl text-xs font-mono mb-4">
                    <div><span className="text-nova-text-subtle">Trades:</span> <span className="font-bold text-nova-text">{str.trades}</span></div>
                    <div><span className="text-nova-text-subtle">Max DD:</span> <span className="font-bold text-rose-400">{str.maxDrawdown}%</span></div>
                    <div><span className="text-nova-text-subtle">Followers:</span> <span className="font-bold text-cyan-400">{str.followers}</span></div>
                  </div>
                </div>

                <div className="flex items-center gap-2 pt-2 border-t border-nova-border">
                  <button
                    onClick={() => toggleStrategyStatus(str.id)}
                    className={cn('text-xs py-2 px-4 rounded-xl flex-1 font-bold flex items-center justify-center gap-1.5 transition-all', str.status === 'active' ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30' : 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30')}
                  >
                    {str.status === 'active' ? <><Pause size={13} /> Suspend Strategy</> : <><Play size={13} /> Re-activate Strategy</>}
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Compliance & Regulations Checklist Tab */}
      {activeTab === 'compliance' && (
        <div className="space-y-5 animate-fade-in">
          <h2 className="nova-section-title">SEBI Regulatory Compliance Checklist</h2>
          <div className="grid md:grid-cols-3 gap-4 mb-4">
            {[
              { label: 'SEBI Compliant Status', value: '100%', color: 'text-emerald-400' },
              { label: 'Active Flagged Trades', value: String(Object.values(flaggedOrders).filter(Boolean).length), color: 'text-amber-400' },
              { label: 'Audit Compliance Score', value: '99.4/100', color: 'text-cyan-400' },
            ].map(({ label, value, color }) => (
              <div key={label} className="nova-card p-4 text-center">
                <p className="text-xs text-nova-text-muted mb-1">{label}</p>
                <p className={`text-3xl font-black font-mono ${color}`}>{value}</p>
              </div>
            ))}
          </div>

          <div className="nova-card p-5 space-y-3">
            <h3 className="text-sm font-bold text-nova-text mb-2">Mandatory Statutory Compliance Checks</h3>
            {[
              ['Daily SEBI Margin Shortfall Reporting (T+1)', true],
              ['Real-Time Anti-Money Laundering (PMLA) Scanning', true],
              ['Insider Trading & Front-Running Surveillance Engine', true],
              ['Segregation of Client Trading Funds with Clearing Corporations', true],
              ['Penny-Drop Account Validation on Withdrawals', true],
              ['Annual Information Security & ISO 27001 Audit', true],
            ].map(([label, done]) => (
              <div key={String(label)} className="flex items-center justify-between p-3 rounded-xl bg-nova-bg/50 border border-nova-border/70 text-xs">
                <div className="flex items-center gap-2">
                  <div className="w-5 h-5 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center flex-shrink-0">
                    <Check size={12} />
                  </div>
                  <span className="font-semibold text-nova-text">{String(label)}</span>
                </div>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-emerald-500/15 text-emerald-400 border border-emerald-500/25 uppercase">
                  Compliant
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Revenue & Subscriptions Tab */}
      {activeTab === 'revenue' && (
        <div className="space-y-6 animate-fade-in">
          <h2 className="nova-section-title">Revenue & Subscription Monetization</h2>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            {[
              { l: 'Monthly Recurring (MRR)', v: '₹2.48 Cr', c: 'text-emerald-400' },
              { l: 'Annual Run Rate (ARR)', v: '₹29.7 Cr', c: 'text-cyan-400' },
              { l: 'Average ARPU', v: '₹1,950', c: 'text-nova-text' },
              { l: 'Pro/Elite Conversion', v: '18.4%', c: 'text-amber-400' },
            ].map(({ l, v, c }) => (
              <div key={l} className="nova-card p-4 text-center">
                <p className="text-xs text-nova-text-muted mb-1">{l}</p>
                <p className={`text-2xl font-black font-mono ${c}`}>{v}</p>
              </div>
            ))}
          </div>

          <div className="nova-card p-5">
            <h3 className="text-sm font-bold text-nova-text mb-4">Monthly Platform Growth</h3>
            <div className="h-56">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={revenueData}>
                  <defs>
                    <linearGradient id="adminRevGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#3B82F6" stopOpacity={0.25} />
                      <stop offset="95%" stopColor="#3B82F6" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <XAxis dataKey="month" tick={{ fill: '#64748B', fontSize: 11 }} axisLine={false} tickLine={false} />
                  <YAxis tick={{ fill: '#64748B', fontSize: 11 }} axisLine={false} tickLine={false} tickFormatter={(v) => `₹${(v / 1000).toFixed(0)}K`} />
                  <Tooltip contentStyle={{ background: '#0F172A', border: '1px solid #334155', borderRadius: 8, fontSize: 11 }} />
                  <Area type="monotone" dataKey="revenue" stroke="#3B82F6" fill="url(#adminRevGrad)" strokeWidth={2} dot={false} />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      )}

      {/* Audit Logs Tab */}
      {activeTab === 'audit' && (
        <div className="space-y-5 animate-fade-in">
          <h2 className="nova-section-title">Platform Audit & Action Logs</h2>
          <div className="nova-card overflow-hidden">
            <div className="divide-y divide-nova-border/50">
              {auditLogs.map((log) => (
                <div key={log.id} className="flex items-center justify-between px-5 py-3.5 hover:bg-nova-surface2 transition-colors text-xs">
                  <div>
                    <p className="font-bold text-nova-text">{log.action}</p>
                    <p className="text-nova-text-muted mt-0.5">Target: {log.user} · Executed by: {log.admin}</p>
                    {log.notes && <p className="text-rose-400 mt-0.5">Note: {log.notes}</p>}
                  </div>
                  <div className="text-right">
                    <span className="text-nova-text-subtle font-mono">{formatTimeAgo(log.timestamp)}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* System Alerts Tab */}
      {activeTab === 'alerts' && (
        <div className="space-y-5 animate-fade-in">
          <div className="flex items-center justify-between flex-wrap gap-4">
            <div>
              <h2 className="nova-section-title">System Surveillance & Market Alerts</h2>
              <p className="text-xs text-nova-text-muted mt-0.5">
                Surveillance anomalies, circuit breaker warnings, API rate-limit spikes, and execution notifications.
              </p>
            </div>
            <button
              onClick={markAllAlertsRead}
              className="nova-btn-outline text-xs py-2 px-3.5 flex items-center gap-1.5"
            >
              <CheckCircle2 size={14} className="text-emerald-400" />
              <span>Mark All as Read</span>
            </button>
          </div>

          <div className="space-y-3">
            {alerts.map((alert) => (
              <div
                key={alert.id}
                onClick={() => markAlertRead(alert.id)}
                className={cn(
                  'nova-card p-4 transition-all flex items-start justify-between gap-4 cursor-pointer hover:border-nova-primary/40',
                  !alert.isRead ? 'border-nova-primary/40 bg-nova-primary/5' : 'bg-nova-surface'
                )}
              >
                <div className="flex items-start gap-3 min-w-0">
                  <div className="w-9 h-9 rounded-xl bg-blue-500/15 text-blue-400 flex items-center justify-center flex-shrink-0 mt-0.5">
                    <Bell size={18} />
                  </div>
                  <div className="min-w-0">
                    <div className="flex items-center gap-2 flex-wrap mb-1">
                      <span className="text-sm font-bold text-nova-text">{alert.title}</span>
                      {!alert.isRead && (
                        <span className="w-2 h-2 rounded-full bg-nova-primary animate-pulse" />
                      )}
                      {alert.symbol && (
                        <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-nova-surface2 border border-nova-border text-nova-accent font-bold">
                          {alert.symbol}
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-nova-text-muted leading-relaxed mb-1.5">{alert.message}</p>
                    <span className="text-[11px] text-nova-text-subtle">{formatTimeAgo(alert.createdAt)}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Platform & Profile Settings Tab */}
      {activeTab === 'settings' && (
        <div className="space-y-5 animate-fade-in">
          <h2 className="nova-section-title">Admin Account & Platform Control Settings</h2>
          <ProfileSettingsPanel isAdmin={true} />
        </div>
      )}

      {/* Inspect User Modal */}
      {selectedUser && (() => {
        const u = users.find((u) => u.id === selectedUser);
        if (!u) return null;
        return (
          <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4 animate-fade-in">
            <div className="nova-card border border-nova-border p-6 w-full max-w-md space-y-4">
              <div className="flex items-center gap-3">
                <img src={u.avatar} alt={u.name} className="w-14 h-14 rounded-full object-cover" />
                <div>
                  <h3 className="text-lg font-bold text-nova-text">{u.name}</h3>
                  <p className="text-xs text-nova-text-muted capitalize">{u.role} · {u.subscription} subscription</p>
                </div>
                <button onClick={() => setSelectedUser(null)} className="ml-auto text-nova-text-muted hover:text-nova-text">
                  <X size={18} />
                </button>
              </div>

              <div className="grid grid-cols-2 gap-3 text-xs bg-nova-bg/50 p-3.5 rounded-xl">
                <div><span className="text-nova-text-muted">Email:</span> <p className="font-semibold text-nova-text truncate">{u.email}</p></div>
                <div><span className="text-nova-text-muted">Phone:</span> <p className="font-semibold text-nova-text">{u.phone}</p></div>
                <div><span className="text-nova-text-muted">KYC Status:</span> <p className="font-semibold text-emerald-400 uppercase">{u.kycStatus}</p></div>
                <div><span className="text-nova-text-muted">Risk Profile:</span> <p className="font-semibold text-nova-accent capitalize">{u.riskProfile}</p></div>
                <div><span className="text-nova-text-muted">Portfolio:</span> <p className="font-mono font-bold text-nova-text">{formatCurrency(u.portfolioValue || 0)}</p></div>
                <div><span className="text-nova-text-muted">Total P&L:</span> <p className="font-mono font-bold text-emerald-400">{formatCurrency(u.totalPnL || 0)}</p></div>
              </div>

              <div className="flex gap-2 pt-2">
                <button
                  onClick={() => {
                    updateUserSubscription(u.id, 'elite');
                    setSelectedUser(null);
                  }}
                  className="nova-btn-primary text-xs flex-1 py-2 font-bold"
                >
                  Upgrade to Elite Tier
                </button>
                <button onClick={() => setSelectedUser(null)} className="nova-btn-outline text-xs flex-1 py-2">
                  Close
                </button>
              </div>
            </div>
          </div>
        );
      })()}

      {/* Learn Page & Educational CMS Management */}
      {activeTab === 'learn-mgmt' && <LearnManagementPanel />}

      {/* Reject KYC Modal */}
      {rejectModal.open && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4 animate-fade-in">
          <div className="nova-card border border-nova-border p-6 w-full max-w-sm space-y-4">
            <h3 className="text-lg font-bold text-nova-text">Reject KYC Application</h3>
            <p className="text-xs text-nova-text-muted">Specify the regulatory reason for rejection to notify the applicant.</p>
            <textarea
              rows={3}
              value={rejectNotes}
              onChange={(e) => setRejectNotes(e.target.value)}
              className="nova-input text-xs resize-none"
              placeholder="e.g. Document image quality is blurred. Please upload original clear PDF scan."
              required
            />
            <div className="flex gap-2">
              <button onClick={() => setRejectModal({ open: false, id: '' })} className="nova-btn-outline text-xs flex-1 py-2">
                Cancel
              </button>
              <button
                onClick={() => {
                  rejectKYC(rejectModal.id, rejectNotes);
                  setRejectModal({ open: false, id: '' });
                  setRejectNotes('');
                }}
                className="bg-rose-500 hover:bg-rose-600 text-white rounded-xl text-xs flex-1 py-2 font-bold"
              >
                Confirm Rejection
              </button>
            </div>
          </div>
        </div>
      )}

      {/* View Docs Modal */}
      {viewDocsModal && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4 animate-fade-in">
          <div className="nova-card border border-nova-border p-6 w-full max-w-md space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-bold text-nova-text">KYC Documents: {viewDocsModal.userName}</h3>
              <button onClick={() => setViewDocsModal(null)} className="text-nova-text-muted hover:text-nova-text">
                <X size={18} />
              </button>
            </div>
            <div className="space-y-2">
              {viewDocsModal.docs.map((doc) => (
                <div key={doc} className="p-3 bg-nova-bg/60 rounded-xl border border-nova-border flex items-center justify-between text-xs">
                  <span className="flex items-center gap-2 font-mono text-nova-text">
                    <FileText size={15} className="text-nova-accent" /> {doc}
                  </span>
                  <span className="text-emerald-400 font-bold">Verified Scan</span>
                </div>
              ))}
            </div>
            <button onClick={() => setViewDocsModal(null)} className="nova-btn-primary text-xs w-full py-2">
              Close Preview
            </button>
          </div>
        </div>
      )}
    </DashboardLayout>
  );
};

export default AdminDashboard;

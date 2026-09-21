import React, { useState } from 'react';
import { useLocation } from 'react-router-dom';
import { Users, UserCheck, Shield, TrendingUp, Activity, AlertCircle, FileText, Settings, Check, X, Eye } from 'lucide-react';
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer, BarChart, Bar } from 'recharts';
import DashboardLayout from '@/components/layout/DashboardLayout';
import { useAppStore } from '@/stores/useAppStore';
import { formatCurrency, formatDate, formatTimeAgo, cn, getStatusBadge } from '@/lib/utils';
import type { SubscriptionPlan } from '@/types';

const revenueData = Array.from({ length: 12 }, (_, i) => ({
  month: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'][i],
  revenue: Math.round(85000 + i * 12000 + Math.random() * 15000),
  users: Math.round(9000 + i * 1200 + Math.random() * 500),
}));

const auditLogs = [
  { id: 'log001', action: 'KYC Approved', user: 'Diana Lopez', admin: 'Sarah Williams', timestamp: '2024-01-12T10:00:00Z', type: 'kyc' },
  { id: 'log002', action: 'KYC Rejected', user: 'Michael Wong', admin: 'Sarah Williams', timestamp: '2024-01-11T09:00:00Z', type: 'kyc', notes: 'Insufficient document quality' },
  { id: 'log003', action: 'Subscription Changed', user: 'Alex Reynolds', admin: 'Sarah Williams', timestamp: '2024-01-10T14:30:00Z', type: 'subscription' },
  { id: 'log004', action: 'Trade Flagged', user: 'Priya Sharma', admin: 'System Auto', timestamp: '2024-01-09T16:20:00Z', type: 'compliance' },
  { id: 'log005', action: 'User Suspended', user: 'Anonymous_5521', admin: 'Sarah Williams', timestamp: '2024-01-08T11:45:00Z', type: 'security' },
];

const systemAlerts = [
  { title: 'High Trading Volume Detected', severity: 'warning', message: 'NVDA volume 3x above normal. Monitoring for manipulation.', time: '5m ago' },
  { title: 'KYC Queue Building Up', severity: 'info', message: '3 new KYC submissions pending review. Average wait 18 hours.', time: '1h ago' },
  { title: 'Server Response Time Elevated', severity: 'warning', message: 'P99 latency at 450ms — above 200ms threshold.', time: '2h ago' },
  { title: 'Daily Revenue Milestone', severity: 'success', message: 'Platform crossed ₹1.2 Cr daily revenue for the first time.', time: '4h ago' },
];

const AdminDashboard: React.FC = () => {
  const { kycApplications, users, subscriptionPlans, approveKYC, rejectKYC, updateUserSubscription, alerts } = useAppStore();
  const location = useLocation();
  const [activeTab, setActiveTab] = useState((location.state as { activeTab?: string } | null)?.activeTab || 'overview');
  const [rejectModal, setRejectModal] = useState<{ open: boolean; id: string }>({ open: false, id: '' });
  const [rejectNotes, setRejectNotes] = useState('');
  const [selectedUser, setSelectedUser] = useState<string | null>(null);

  const pendingKYC = kycApplications.filter(k => k.status === 'pending' || k.status === 'submitted');
  const totalUsers = users.length + 125000;
  const activeUsers = Math.round(totalUsers * 0.78);

  return (
    <DashboardLayout activeTab={activeTab} onTabChange={setActiveTab}>
      {activeTab === 'overview' && (
        <div className="space-y-6 animate-fade-in">
          <div>
            <h1 className="text-2xl font-display font-bold text-nova-text">Admin Dashboard</h1>
            <p className="text-nova-text-muted text-sm">Platform management · Compliance · Analytics</p>
          </div>

          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            {[
              { label: 'Total Users', value: totalUsers.toLocaleString(), sub: '+1,240 this week', icon: Users },
              { label: 'Pending KYC', value: String(pendingKYC.length), sub: 'Awaiting review', icon: UserCheck, alert: pendingKYC.length > 0 },
              { label: 'Monthly Revenue', value: '₹2.4 Cr', sub: '+18.2% MoM', icon: TrendingUp },
              { label: 'Platform Uptime', value: '99.97%', sub: 'Last 30 days', icon: Activity },
            ].map(({ label, value, sub, icon: Icon, alert }) => (
              <div key={label} className={cn('nova-stat-card', alert && 'border-nova-yellow/40 bg-nova-yellow/5')} onClick={() => alert && setActiveTab('kyc')}>
                <div className="flex items-center justify-between mb-3">
                  <p className="text-xs text-nova-text-muted">{label}</p>
                  <Icon size={16} className={alert ? 'text-nova-yellow' : 'text-nova-text-subtle'} />
                </div>
                <p className="text-xl font-bold text-nova-text">{value}</p>
                <p className="text-xs mt-1 text-nova-text-muted">{sub}</p>
              </div>
            ))}
          </div>

          {/* System Alerts */}
          <div className="nova-card overflow-hidden">
            <div className="px-5 py-3 bg-nova-surface2 border-b border-nova-border flex items-center justify-between">
              <h3 className="text-sm font-bold text-nova-text">System Alerts</h3>
              <span className="nova-badge-yellow text-xs">{systemAlerts.filter(a => a.severity === 'warning').length} warnings</span>
            </div>
            {systemAlerts.map((alert, i) => (
              <div key={i} className={cn('flex items-start gap-3 px-5 py-4 border-t border-nova-border/50', alert.severity === 'warning' ? 'bg-nova-yellow/5' : alert.severity === 'success' ? 'bg-nova-green/5' : '')}>
                <div className={cn('w-2 h-2 rounded-full mt-1.5 flex-shrink-0', alert.severity === 'warning' ? 'bg-nova-yellow' : alert.severity === 'success' ? 'bg-nova-green' : 'bg-nova-primary-light')} />
                <div className="flex-1">
                  <p className="text-sm font-semibold text-nova-text">{alert.title}</p>
                  <p className="text-xs text-nova-text-muted mt-0.5">{alert.message}</p>
                </div>
                <span className="text-xs text-nova-text-subtle">{alert.time}</span>
              </div>
            ))}
          </div>

          {/* Revenue Chart */}
          <div className="nova-card p-5">
            <h3 className="text-sm font-bold text-nova-text mb-4">Revenue & User Growth (2024)</h3>
            <div className="h-52">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={revenueData}>
                  <XAxis dataKey="month" tick={{ fill: '#64748B', fontSize: 11 }} axisLine={false} tickLine={false} />
                  <YAxis tick={{ fill: '#64748B', fontSize: 11 }} axisLine={false} tickLine={false} tickFormatter={v => `₹${(v / 1000).toFixed(0)}K`} />
                  <Tooltip contentStyle={{ background: '#1E293B', border: 'none', borderRadius: 8, fontSize: 11 }} formatter={(v: number) => [`₹${(v / 1000).toFixed(0)}K`, 'Revenue']} />
                  <Bar dataKey="revenue" fill="#1D4ED8" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      )}

      {activeTab === 'users' && (
        <div className="space-y-5 animate-fade-in">
          <h2 className="nova-section-title">User Management</h2>
          <div className="nova-card overflow-hidden">
            <div className="grid grid-cols-7 px-5 py-2.5 bg-nova-surface2 text-xs font-bold text-nova-text-muted">
              {['User', 'Email', 'Role', 'KYC', 'Plan', 'Joined', 'Action'].map(h => <span key={h}>{h}</span>)}
            </div>
            {users.map(user => (
              <div key={user.id} className="grid grid-cols-7 px-5 py-3 border-t border-nova-border/50 items-center hover:bg-nova-surface2 cursor-pointer" onClick={() => setSelectedUser(user.id)}>
                <div className="flex items-center gap-2">
                  <img src={user.avatar} alt={user.name} className="w-8 h-8 rounded-full object-cover" />
                  <span className="text-sm font-semibold text-nova-text truncate">{user.name}</span>
                </div>
                <span className="text-xs text-nova-text-muted truncate">{user.email}</span>
                <span className="text-xs capitalize text-nova-text-muted">{user.role}</span>
                <span className={cn('text-xs', getStatusBadge(user.kycStatus))}>{user.kycStatus}</span>
                <span className="text-xs capitalize text-nova-text-muted">{user.subscription}</span>
                <span className="text-xs text-nova-text-muted">{formatDate(user.joinDate)}</span>
                <div className="flex gap-1">
                  <button className="nova-btn-ghost p-1.5 text-xs" onClick={e => { e.stopPropagation(); setSelectedUser(user.id); }}><Eye size={14} /></button>
                  <select className="nova-input py-1 px-2 text-xs w-24" onClick={e => e.stopPropagation()} onChange={e => {
                    if (e.target.value) updateUserSubscription(user.id, e.target.value as SubscriptionPlan);
                  }}>
                    <option value="">Change Plan</option>
                    {subscriptionPlans.map(p => <option key={p.id} value={p.id}>{p.name}</option>)}
                  </select>
                </div>
              </div>
            ))}
          </div>

          {selectedUser && (() => {
            const u = users.find(u => u.id === selectedUser)!;
            return (
              <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4">
                <div className="glass-modal rounded-2xl border border-nova-border p-6 w-full max-w-md">
                  <div className="flex items-center gap-3 mb-5">
                    <img src={u.avatar} alt={u.name} className="w-14 h-14 rounded-full object-cover" />
                    <div><p className="text-lg font-bold text-nova-text">{u.name}</p><p className="text-sm text-nova-text-muted capitalize">{u.role} · {u.subscription}</p></div>
                    <button onClick={() => setSelectedUser(null)} className="ml-auto nova-btn-ghost p-2"><X size={18} /></button>
                  </div>
                  <div className="grid grid-cols-2 gap-3 text-sm mb-5">
                    {[['Email', u.email], ['Phone', u.phone], ['KYC', u.kycStatus], ['Risk', u.riskProfile], ['Portfolio', formatCurrency(u.portfolioValue)], ['Total P&L', formatCurrency(u.totalPnL)]].map(([l, v]) => (
                      <div key={String(l)} className="flex flex-col gap-0.5"><span className="text-xs text-nova-text-muted">{l}</span><span className="text-sm font-semibold text-nova-text capitalize">{v}</span></div>
                    ))}
                  </div>
                  <div className="flex gap-3">
                    <button onClick={() => { updateUserSubscription(u.id, 'pro'); setSelectedUser(null); }} className="nova-btn-primary flex-1 text-sm">Upgrade to Pro</button>
                    <button onClick={() => setSelectedUser(null)} className="nova-btn-ghost flex-1 text-sm">Close</button>
                  </div>
                </div>
              </div>
            );
          })()}
        </div>
      )}

      {activeTab === 'kyc' && (
        <div className="space-y-5 animate-fade-in">
          <h2 className="nova-section-title">KYC Approval Panel</h2>
          {pendingKYC.length === 0 ? (
            <div className="text-center py-16"><UserCheck size={48} className="text-nova-accent mx-auto mb-4" /><h3 className="text-lg font-bold text-nova-text mb-2">All KYC Applications Reviewed</h3><p className="text-nova-text-muted text-sm">No pending applications. Great work!</p></div>
          ) : (
            <div className="space-y-4">
              {pendingKYC.map(app => (
                <div key={app.id} className="nova-card p-5">
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <p className="text-sm font-bold text-nova-text">{app.userName}</p>
                      <p className="text-xs text-nova-text-muted">{app.userEmail}</p>
                      <p className="text-xs text-nova-text-subtle mt-0.5">Submitted: {formatTimeAgo(app.submittedAt)}</p>
                    </div>
                    <span className={cn('text-xs', getStatusBadge(app.status))}>{app.status}</span>
                  </div>
                  <div className="flex flex-wrap gap-2 mb-4">
                    {app.documents.map(doc => (
                      <div key={doc} className="flex items-center gap-1.5 nova-glass px-3 py-1.5 rounded-lg text-xs text-nova-text-muted">
                        <FileText size={12} className="text-nova-accent" />{doc}
                      </div>
                    ))}
                  </div>
                  <div className="flex gap-3">
                    <button onClick={() => approveKYC(app.id)} className="flex items-center gap-2 bg-nova-green/10 border border-nova-green/30 text-nova-green hover:bg-nova-green/20 px-4 py-2 rounded-lg text-sm font-semibold transition-all">
                      <Check size={16} /> Approve
                    </button>
                    <button onClick={() => setRejectModal({ open: true, id: app.id })} className="flex items-center gap-2 bg-nova-red/10 border border-nova-red/30 text-nova-red hover:bg-nova-red/20 px-4 py-2 rounded-lg text-sm font-semibold transition-all">
                      <X size={16} /> Reject
                    </button>
                    <button className="nova-btn-ghost text-sm"><Eye size={16} /> View Docs</button>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Recently Reviewed */}
          <div className="nova-card overflow-hidden">
            <div className="px-5 py-3 bg-nova-surface2 border-b border-nova-border"><h3 className="text-sm font-bold text-nova-text">Recently Reviewed</h3></div>
            {kycApplications.filter(k => k.status === 'approved' || k.status === 'rejected').map(app => (
              <div key={app.id} className="flex items-center justify-between px-5 py-3 border-t border-nova-border/50">
                <div>
                  <p className="text-sm font-semibold text-nova-text">{app.userName}</p>
                  <p className="text-xs text-nova-text-muted">{app.reviewedAt ? formatTimeAgo(app.reviewedAt) : ''}</p>
                </div>
                <div className="flex items-center gap-3">
                  <span className={cn('text-xs', getStatusBadge(app.status))}>{app.status}</span>
                  {app.notes && <p className="text-xs text-nova-text-subtle max-w-xs truncate">{app.notes}</p>}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {activeTab === 'compliance' && (
        <div className="space-y-5 animate-fade-in">
          <h2 className="nova-section-title">Compliance Tracker</h2>
          <div className="grid md:grid-cols-3 gap-4 mb-4">
            {[{ label: 'SEBI Compliant', value: '100%', color: 'text-nova-green' }, { label: 'Flagged Trades', value: '2', color: 'text-nova-yellow' }, { label: 'Compliance Score', value: '98.4', color: 'text-nova-accent' }].map(({ label, value, color }) => (
              <div key={label} className="nova-card p-4 text-center"><p className="text-xs text-nova-text-muted mb-1">{label}</p><p className={`text-3xl font-black ${color}`}>{value}</p></div>
            ))}
          </div>
          <div className="nova-card p-5">
            <h3 className="text-sm font-bold text-nova-text mb-4">Compliance Checklist</h3>
            <div className="space-y-3">
              {[
                ['KYC/AML Compliance', true], ['SEBI Reporting — Daily', true], ['Insider Trading Monitoring', true],
                ['Position Limit Monitoring', true], ['Client Suitability Assessment', true], ['Risk Disclosure Updates', false],
              ].map(([label, done]) => (
                <div key={String(label)} className="flex items-center gap-3">
                  <div className={cn('w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0', done ? 'bg-nova-accent/10 border border-nova-accent/30' : 'bg-nova-yellow/10 border border-nova-yellow/30')}>
                    {done ? <Check size={12} className="text-nova-accent" /> : <span className="text-nova-yellow text-xs">!</span>}
                  </div>
                  <span className="text-sm text-nova-text">{String(label)}</span>
                  {!done && <span className="nova-badge-yellow text-xs ml-auto">Pending</span>}
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {activeTab === 'trades' && (
        <div className="space-y-5 animate-fade-in">
          <h2 className="nova-section-title">Trade Monitoring</h2>
          <div className="nova-card overflow-hidden">
            <div className="grid grid-cols-7 px-5 py-2.5 bg-nova-surface2 text-xs font-bold text-nova-text-muted">
              {['Order ID', 'User', 'Symbol', 'Type', 'Qty', 'Total', 'Status'].map(h => <span key={h}>{h}</span>)}
            </div>
            {useAppStore.getState().orders.map(o => (
              <div key={o.id} className="grid grid-cols-7 px-5 py-3 border-t border-nova-border/50 text-sm hover:bg-nova-surface2">
                <span className="text-nova-text-muted text-xs">{o.id}</span>
                <span className="text-nova-text">User</span>
                <span className="font-bold text-nova-text">{o.symbol}</span>
                <span className={o.type === 'buy' ? 'text-nova-green' : 'text-nova-red'}>{o.type.toUpperCase()}</span>
                <span className="text-nova-text">{o.quantity}</span>
                <span className="text-nova-text">{formatCurrency(o.total)}</span>
                <span className={getStatusBadge(o.status)}>{o.status}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {activeTab === 'revenue' && (
        <div className="space-y-5 animate-fade-in">
          <h2 className="nova-section-title">Revenue Analytics</h2>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            {[{ l: 'MRR', v: '₹2.4 Cr', c: 'text-nova-accent' }, { l: 'ARR', v: '₹28.8 Cr', c: 'text-nova-accent' }, { l: 'Avg ARPU', v: '₹1,920', c: 'text-nova-text' }, { l: 'Churn Rate', v: '2.1%', c: 'text-nova-red' }].map(({ l, v, c }) => (
              <div key={l} className="nova-card p-4 text-center"><p className="text-xs text-nova-text-muted mb-1">{l}</p><p className={`text-2xl font-black ${c}`}>{v}</p></div>
            ))}
          </div>
          <div className="nova-card p-5">
            <h3 className="text-sm font-bold text-nova-text mb-4">Monthly Revenue Trend</h3>
            <div className="h-56">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={revenueData}>
                  <defs><linearGradient id="revGrad" x1="0" y1="0" x2="0" y2="1"><stop offset="5%" stopColor="#10B981" stopOpacity={0.2} /><stop offset="95%" stopColor="#10B981" stopOpacity={0} /></linearGradient></defs>
                  <XAxis dataKey="month" tick={{ fill: '#64748B', fontSize: 11 }} axisLine={false} tickLine={false} />
                  <YAxis tick={{ fill: '#64748B', fontSize: 11 }} axisLine={false} tickLine={false} tickFormatter={v => `₹${(v / 1000).toFixed(0)}K`} />
                  <Tooltip contentStyle={{ background: '#1E293B', border: 'none', borderRadius: 8, fontSize: 11 }} />
                  <Area type="monotone" dataKey="revenue" stroke="#10B981" fill="url(#revGrad)" strokeWidth={2} dot={false} />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      )}

      {activeTab === 'subscriptions' && (
        <div className="space-y-5 animate-fade-in">
          <h2 className="nova-section-title">Subscription Management</h2>
          <div className="grid md:grid-cols-4 gap-4">
            {useAppStore.getState().subscriptionPlans.map(plan => (
              <div key={plan.id} className="nova-card p-4 text-center">
                <p className="text-sm font-bold text-nova-text">{plan.name}</p>
                <p className="text-2xl font-black text-nova-accent mt-1">${plan.price}<span className="text-sm text-nova-text-muted">/mo</span></p>
                <p className="text-xs text-nova-text-muted mt-2">{Math.round(Math.random() * 50000 + 10000).toLocaleString()} users</p>
                <div className="w-full h-1.5 bg-nova-surface2 rounded-full mt-3">
                  <div className="h-full bg-nova-primary rounded-full" style={{ width: `${[15, 25, 45, 15][useAppStore.getState().subscriptionPlans.indexOf(plan)]}%` }} />
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {activeTab === 'alerts' && (
        <div className="space-y-4 animate-fade-in">
          <h2 className="nova-section-title">System Alerts</h2>
          {systemAlerts.map((alert, i) => (
            <div key={i} className={cn('nova-card p-4', alert.severity === 'warning' ? 'border-nova-yellow/30' : alert.severity === 'success' ? 'border-nova-green/30' : 'border-nova-border')}>
              <div className="flex items-start gap-3">
                <div className={cn('w-2 h-2 rounded-full mt-2', alert.severity === 'warning' ? 'bg-nova-yellow' : alert.severity === 'success' ? 'bg-nova-green' : 'bg-nova-primary-light')} />
                <div><p className="text-sm font-semibold text-nova-text">{alert.title}</p><p className="text-xs text-nova-text-muted">{alert.message}</p><p className="text-xs text-nova-text-subtle mt-1">{alert.time}</p></div>
              </div>
            </div>
          ))}
        </div>
      )}

      {activeTab === 'audit' && (
        <div className="space-y-5 animate-fade-in">
          <h2 className="nova-section-title">Audit Logs</h2>
          <div className="nova-card overflow-hidden">
            <div className="grid grid-cols-5 px-5 py-2.5 bg-nova-surface2 text-xs font-bold text-nova-text-muted">
              {['Action', 'User', 'Admin', 'Time', 'Type'].map(h => <span key={h}>{h}</span>)}
            </div>
            {auditLogs.map(log => (
              <div key={log.id} className="grid grid-cols-5 px-5 py-3 border-t border-nova-border/50 text-sm hover:bg-nova-surface2">
                <span className="font-semibold text-nova-text">{log.action}</span>
                <span className="text-nova-text-muted">{log.user}</span>
                <span className="text-nova-text-muted">{log.admin}</span>
                <span className="text-nova-text-subtle text-xs">{formatTimeAgo(log.timestamp)}</span>
                <span className={cn('text-xs', log.type === 'kyc' ? 'nova-badge-blue' : log.type === 'compliance' ? 'nova-badge-yellow' : 'nova-badge-green')}>{log.type}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {activeTab === 'settings' && (
        <div className="space-y-5 animate-fade-in">
          <h2 className="nova-section-title">Platform Settings</h2>
          <div className="grid md:grid-cols-2 gap-5">
            {[['Maintenance Mode', 'OFF'], ['KYC Auto-Approval', 'OFF'], ['Trading Hours Lock', 'ON'], ['Real-time Alerts', 'ON'], ['API Rate Limiting', 'ON'], ['Two-Factor Enforcement', 'ON']].map(([setting, status]) => (
              <div key={String(setting)} className="nova-card p-4 flex items-center justify-between">
                <p className="text-sm font-semibold text-nova-text">{setting}</p>
                <button className={cn('px-4 py-1.5 rounded-lg text-xs font-bold border transition-all', status === 'ON' ? 'bg-nova-accent/10 border-nova-accent/30 text-nova-accent' : 'bg-nova-surface2 border-nova-border text-nova-text-muted')}>
                  {status}
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Reject Modal */}
      {rejectModal.open && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4">
          <div className="glass-modal rounded-2xl border border-nova-border p-6 w-full max-w-sm">
            <h3 className="text-lg font-bold text-nova-text mb-3">Reject KYC Application</h3>
            <p className="text-sm text-nova-text-muted mb-4">Provide a reason that will be sent to the applicant.</p>
            <textarea value={rejectNotes} onChange={e => setRejectNotes(e.target.value)} className="nova-input resize-none h-24 mb-4" placeholder="e.g., Document quality insufficient. Please resubmit with clearer images." />
            <div className="flex gap-3">
              <button onClick={() => setRejectModal({ open: false, id: '' })} className="nova-btn-ghost flex-1">Cancel</button>
              <button onClick={() => { rejectKYC(rejectModal.id, rejectNotes); setRejectModal({ open: false, id: '' }); setRejectNotes(''); }} className="bg-nova-red/10 border border-nova-red/30 text-nova-red hover:bg-nova-red/20 rounded-lg py-2.5 flex-1 font-semibold text-sm transition-all">
                Reject
              </button>
            </div>
          </div>
        </div>
      )}
    </DashboardLayout>
  );
};

export default AdminDashboard;

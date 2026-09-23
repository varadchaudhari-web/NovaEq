import React, { useState, useRef, useEffect } from 'react';
import {
  Bell,
  Check,
  CheckCheck,
  Trash2,
  TrendingUp,
  AlertTriangle,
  Zap,
  Info,
  ExternalLink,
  X
} from 'lucide-react';
import { useAppStore } from '@/stores/useAppStore';
import { formatTimeAgo } from '@/lib/utils';
import { useNavigate } from 'react-router-dom';

interface NotificationDropdownProps {
  className?: string;
}

export const NotificationDropdown: React.FC<NotificationDropdownProps> = ({ className = '' }) => {
  const { alerts, markAlertRead, markAllAlertsRead, currentUser, openAuthModal, setSidebarActive } = useAppStore();
  const [isOpen, setIsOpen] = useState(false);
  const [activeFilter, setActiveFilter] = useState<'all' | 'unread' | 'price' | 'execution'>('all');
  const dropdownRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();

  const unreadCount = alerts.filter((a) => !a.isRead).length;

  // Close on outside click
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isOpen]);

  const filteredAlerts = alerts.filter((a) => {
    if (activeFilter === 'unread') return !a.isRead;
    if (activeFilter === 'price') return a.type === 'price';
    if (activeFilter === 'execution') return a.type === 'execution' || a.type === 'portfolio';
    return true;
  });

  const getAlertIcon = (type: string) => {
    switch (type) {
      case 'price':
        return <TrendingUp size={15} className="text-emerald-400" />;
      case 'execution':
        return <Zap size={15} className="text-amber-400" />;
      case 'portfolio':
        return <AlertTriangle size={15} className="text-blue-400" />;
      default:
        return <Info size={15} className="text-purple-400" />;
    }
  };

  const handleAlertClick = (alertId: string, symbol?: string) => {
    markAlertRead(alertId);
    if (symbol) {
      navigate('/markets');
    }
  };

  return (
    <div className={`relative ${className}`} ref={dropdownRef}>
      {/* Bell Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="relative p-2 rounded-xl text-slate-300 hover:text-white hover:bg-slate-800/60 transition-all border border-transparent hover:border-[#1c2a45]"
        title="Notifications & Alerts"
        aria-label="Notifications"
      >
        <Bell size={19} />
        {unreadCount > 0 && (
          <span className="absolute top-1 right-1 min-w-[18px] h-[18px] px-1 bg-gradient-to-r from-rose-500 to-rose-600 text-white text-[10px] font-bold rounded-full flex items-center justify-center shadow-lg shadow-rose-500/50 animate-pulse leading-none">
            {unreadCount > 9 ? '9+' : unreadCount}
          </span>
        )}
      </button>

      {/* Popover Menu */}
      {isOpen && (
        <div className="absolute right-0 top-full mt-2 w-80 sm:w-96 max-w-[90vw] bg-[#0c162c] border border-[#1c2a45] rounded-2xl shadow-[0_20px_50px_rgba(0,0,0,0.8)] backdrop-blur-xl z-50 overflow-hidden animate-fadeIn">
          {/* Header */}
          <div className="p-4 bg-gradient-to-r from-[#111e38] to-[#0d1830] border-b border-[#1c2a45] flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="font-display font-bold text-sm text-white">Notifications</span>
              {unreadCount > 0 && (
                <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-blue-500/20 border border-blue-500/40 text-blue-300">
                  {unreadCount} New
                </span>
              )}
            </div>

            <div className="flex items-center gap-2">
              {unreadCount > 0 && (
                <button
                  onClick={markAllAlertsRead}
                  className="text-xs text-blue-400 hover:text-blue-300 flex items-center gap-1 font-medium transition-colors"
                  title="Mark all as read"
                >
                  <CheckCheck size={14} />
                  <span className="hidden sm:inline">Mark read</span>
                </button>
              )}
              <button
                onClick={() => setIsOpen(false)}
                className="w-6 h-6 rounded-full hover:bg-slate-800 text-slate-400 hover:text-white flex items-center justify-center transition-colors"
              >
                <X size={14} />
              </button>
            </div>
          </div>

          {/* Filter Tabs */}
          <div className="flex items-center gap-1 px-3 py-2 bg-[#091122] border-b border-[#1c2a45] overflow-x-auto scrollbar-none">
            {[
              { id: 'all', label: 'All' },
              { id: 'unread', label: `Unread (${unreadCount})` },
              { id: 'price', label: 'Price' },
              { id: 'execution', label: 'Orders' },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveFilter(tab.id as any)}
                className={`px-2.5 py-1 rounded-lg text-xs font-medium whitespace-nowrap transition-colors ${
                  activeFilter === tab.id
                    ? 'bg-blue-600 text-white shadow-sm'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-[#132240]'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {/* Alerts List */}
          <div className="max-h-80 overflow-y-auto divide-y divide-[#1c2a45]/60">
            {filteredAlerts.length === 0 ? (
              <div className="p-8 text-center">
                <div className="w-12 h-12 rounded-2xl bg-blue-500/10 border border-blue-500/20 text-blue-400 flex items-center justify-center mx-auto mb-3">
                  <Check size={20} />
                </div>
                <p className="text-xs font-semibold text-slate-300">All caught up!</p>
                <p className="text-[11px] text-slate-500 mt-1">No pending notifications in this filter.</p>
              </div>
            ) : (
              filteredAlerts.map((alert) => (
                <div
                  key={alert.id}
                  onClick={() => handleAlertClick(alert.id, alert.symbol)}
                  className={`p-3.5 transition-colors cursor-pointer flex items-start gap-3 group ${
                    alert.isRead ? 'bg-transparent hover:bg-[#101e38]/50' : 'bg-[#122345]/40 hover:bg-[#122345]/70'
                  }`}
                >
                  <div className="w-8 h-8 rounded-xl bg-[#091122] border border-[#1c2a45] flex items-center justify-center flex-shrink-0 mt-0.5">
                    {getAlertIcon(alert.type)}
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-1 mb-0.5">
                      <h4
                        className={`text-xs font-semibold truncate ${
                          alert.isRead ? 'text-slate-300' : 'text-white'
                        }`}
                      >
                        {alert.title}
                      </h4>
                      {!alert.isRead && (
                        <span className="w-2 h-2 rounded-full bg-blue-500 flex-shrink-0" />
                      )}
                    </div>
                    <p className="text-[11px] text-slate-400 leading-snug line-clamp-2 mb-1">
                      {alert.message}
                    </p>
                    <div className="flex items-center justify-between text-[10px] text-slate-500">
                      <span>{formatTimeAgo(alert.createdAt)}</span>
                      {alert.symbol && (
                        <span className="font-mono text-blue-400 font-semibold uppercase">
                          {alert.symbol}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Footer Bar */}
          <div className="p-2.5 bg-[#080f1e] border-t border-[#1c2a45] text-center">
            <button
              onClick={() => {
                setIsOpen(false);
                setSidebarActive('alerts');
                if (currentUser) {
                  const rolePath =
                    currentUser?.role === 'trader'
                      ? '/dashboard/trader'
                      : currentUser?.role === 'advisor'
                      ? '/dashboard/advisor'
                      : currentUser?.role === 'admin'
                      ? '/dashboard/admin'
                      : '/dashboard/investor';
                  navigate(rolePath, { state: { activeTab: 'alerts', ts: Date.now() } });
                } else {
                  openAuthModal('Sign in to view real-time portfolio and execution alert feeds');
                }
              }}
              className="text-xs text-blue-400 hover:text-blue-300 font-medium inline-flex items-center gap-1.5 transition-colors"
            >
              <span>View Full Alerts Feed</span>
              <ExternalLink size={12} />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default NotificationDropdown;

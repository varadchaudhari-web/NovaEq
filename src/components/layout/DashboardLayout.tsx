import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import {
  LayoutDashboard, TrendingUp, BarChart2, Brain, Zap, PieChart,
  Bell, Users, BookOpen, Wallet, FileText, Settings, LogOut,
  Menu, X, ChevronLeft, Shield, UserCheck, Activity,
  Target, Globe, Star, AlertCircle, ChevronDown, Briefcase
} from 'lucide-react';
import Logo from '@/components/ui/Logo';
import { useAppStore } from '@/stores/useAppStore';
import { cn, formatCurrency } from '@/lib/utils';
import type { UserRole } from '@/types';

interface NavItem {
  id: string;
  label: string;
  icon: React.ElementType;
  badge?: number | string;
  section?: string;
}

const navByRole: Record<UserRole, NavItem[]> = {
  investor: [
    { id: 'overview', label: 'Dashboard', icon: LayoutDashboard, section: 'main' },
    { id: 'portfolio', label: 'Portfolio', icon: PieChart, section: 'main' },
    { id: 'markets', label: 'Markets', icon: TrendingUp, section: 'main' },
    { id: 'watchlist', label: 'Watchlist', icon: Star, section: 'main' },
    { id: 'goals', label: 'Financial Goals', icon: Target, section: 'wealth' },
    { id: 'mutual-funds', label: 'Mutual Funds & SIPs', icon: PieChart, section: 'wealth' },
    { id: 'ai-insights', label: 'AI Insights', icon: Brain, section: 'tools' },
    { id: 'community', label: 'Community', icon: Users, section: 'social' },
    { id: 'learning', label: 'Learn', icon: BookOpen, section: 'resources' },
    { id: 'wallet', label: 'Wallet & Banking', icon: Wallet, section: 'resources' },
    { id: 'reports', label: 'Reports', icon: FileText, section: 'resources' },
    { id: 'settings', label: 'Profile', icon: Settings, section: 'account' },
  ],
  trader: [
    { id: 'overview', label: 'Dashboard', icon: LayoutDashboard, section: 'main' },
    { id: 'trading', label: 'Markets', icon: TrendingUp, section: 'main' },
    { id: 'algo', label: 'Strategies', icon: Zap, section: 'tools' },
    { id: 'screener', label: 'Backtesting', icon: Target, section: 'tools' },
    { id: 'orders', label: 'Orders', icon: Activity, section: 'tools' },
    { id: 'charts', label: 'Analytics', icon: BarChart2, section: 'tools' },
    { id: 'alerts', label: 'Alerts', icon: Bell, section: 'social' },
    { id: 'wallet', label: 'Wallet & Banking', icon: Wallet, section: 'resources' },
  ],
  advisor: [
    { id: 'overview', label: 'Dashboard', icon: LayoutDashboard, section: 'main' },
    { id: 'clients', label: 'Clients', icon: Users, section: 'main' },
    { id: 'portfolios', label: 'Portfolios', icon: Briefcase, section: 'main' },
    { id: 'recommendations', label: 'Recommendations', icon: Star, section: 'tools' },
    { id: 'community', label: 'Community', icon: Users, section: 'social' },
    { id: 'reports', label: 'Reports', icon: FileText, section: 'resources' },
  ],
  admin: [
    { id: 'overview', label: 'Dashboard', icon: LayoutDashboard, section: 'main' },
    { id: 'users', label: 'Users', icon: Users, section: 'main' },
    { id: 'kyc', label: 'KYC Desk', icon: UserCheck, section: 'compliance', badge: 3 },
    { id: 'trades', label: 'Trade Surveillance', icon: Activity, section: 'compliance' },
    { id: 'algo', label: 'Strategies Oversight', icon: Zap, section: 'compliance' },
    { id: 'compliance', label: 'Regulations', icon: Shield, section: 'compliance' },
    { id: 'revenue', label: 'Revenue & Plans', icon: TrendingUp, section: 'monitoring' },
    { id: 'audit', label: 'Audit Logs', icon: FileText, section: 'system' },
    { id: 'settings', label: 'Settings', icon: Settings, section: 'system' },
  ],
};


const sectionLabels: Record<string, string> = {
  main: 'Main',
  wealth: 'Wealth & Goals',
  tools: 'Tools & Analytics',
  social: 'Social & Feed',
  resources: 'Banking & Resources',
  compliance: 'Surveillance & Compliance',
  account: 'Account',
  monitoring: 'Financials',
  system: 'Administration',
};


interface DashboardLayoutProps {
  children: React.ReactNode;
  activeTab: string;
  onTabChange: (tab: string) => void;
}

const DashboardLayout: React.FC<DashboardLayoutProps> = ({ children, activeTab, onTabChange }) => {
  const { currentUser, logout, alerts, walletBalance } = useAppStore();
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [collapsed, setCollapsed] = useState(false);

  const unreadAlerts = alerts.filter(a => !a.isRead).length;
  const role = currentUser?.role || 'investor';
  const navItems = navByRole[role] || navByRole.investor;

  const sections = [...new Set(navItems.map(i => i.section))];

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const SidebarContent = () => (
    <div className="flex flex-col h-full">
      {/* Logo */}
      <div className={cn(
        'flex items-center px-4 py-4 border-b border-nova-border',
        collapsed ? 'justify-center' : 'justify-between'
      )}>
        {!collapsed && (
          <button onClick={() => navigate('/')} className="hover:opacity-90 transition-opacity text-left" title="NovaEq Home">
            <Logo size="sm" />
          </button>
        )}
        {collapsed && (
          <button onClick={() => navigate('/')} className="w-8 h-8 rounded-lg bg-nova-primary flex items-center justify-center hover:opacity-90 transition-opacity" title="Back to Website">
            <TrendingUp size={16} className="text-white" />
          </button>
        )}
        <button
          onClick={() => setCollapsed(!collapsed)}
          className="hidden lg:flex nova-btn-ghost p-1.5 rounded-lg"
        >
          <ChevronLeft size={16} className={cn('transition-transform', collapsed && 'rotate-180')} />
        </button>
      </div>

      {/* User Info */}
      {!collapsed && (
        <div className="px-4 py-3 border-b border-nova-border">
          <div className="flex items-center gap-3">
            <div className="relative">
              <img
                src={currentUser?.avatar}
                alt={currentUser?.name}
                className="w-9 h-9 rounded-full object-cover"
              />
              <span className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-nova-accent rounded-full border-2 border-nova-secondary" />
            </div>
            <div className="min-w-0">
              <p className="text-sm font-semibold text-nova-text truncate">{currentUser?.name}</p>
              <p className="text-xs text-nova-text-muted capitalize">{currentUser?.role} · {currentUser?.subscription}</p>
            </div>
          </div>
          <div className="mt-2.5 px-2 py-1.5 bg-nova-surface2 rounded-lg flex items-center justify-between">
            <span className="text-xs text-nova-text-muted">Balance</span>
            <span className="text-xs font-bold text-nova-accent">{formatCurrency(walletBalance)}</span>
          </div>
        </div>
      )}

      {/* Navigation */}
      <nav className="flex-1 px-3 py-3 overflow-y-auto no-scrollbar">
        {sections.map(section => {
          const sectionItems = navItems.filter(i => i.section === section);
          return (
            <div key={section} className="mb-4">
              {!collapsed && (
                <p className="text-xs font-semibold text-nova-text-subtle uppercase tracking-wider px-2 mb-1.5">
                  {sectionLabels[section || 'main']}
                </p>
              )}
              {sectionItems.map(item => {
                const Icon = item.icon;
                const badge = item.id === 'alerts' ? unreadAlerts : item.badge;
                const isActive = activeTab === item.id;
                return (
                  <button
                    key={item.id}
                    onClick={() => {
                      onTabChange(item.id);
                      setSidebarOpen(false);
                    }}
                    className={cn(
                      'sidebar-nav-item w-full mb-0.5',
                      isActive && 'active',
                      collapsed && 'justify-center px-2'
                    )}
                    title={collapsed ? item.label : undefined}
                  >
                    <Icon size={18} className="flex-shrink-0" />
                    {!collapsed && (
                      <>
                        <span className="flex-1 text-left">{item.label}</span>
                        {badge && Number(badge) > 0 && (
                          <span className="ml-auto bg-nova-red text-white text-xs font-bold px-1.5 py-0.5 rounded-full min-w-[20px] text-center">
                            {badge}
                          </span>
                        )}
                      </>
                    )}
                    {collapsed && badge && Number(badge) > 0 && (
                      <span className="absolute top-0 right-0 w-2 h-2 bg-nova-red rounded-full" />
                    )}
                  </button>
                );
              })}
            </div>
          );
        })}
      </nav>

      {/* Bottom Actions: Back to Website & Sign Out */}
      <div className="px-3 py-3 border-t border-nova-border space-y-1">
        <button
          onClick={() => navigate('/')}
          className={cn(
            'sidebar-nav-item w-full text-nova-text-muted hover:text-nova-text hover:bg-nova-surface2 group',
            collapsed && 'justify-center px-2'
          )}
          title={collapsed ? 'Back to Website' : undefined}
        >
          <Globe size={18} className="text-nova-primary-light flex-shrink-0 group-hover:scale-110 transition-transform" />
          {!collapsed && <span>Back to Website</span>}
        </button>

        <button
          onClick={handleLogout}
          className={cn(
            'sidebar-nav-item w-full text-nova-red hover:text-nova-red hover:bg-nova-red/10',
            collapsed && 'justify-center px-2'
          )}
        >
          <LogOut size={18} />
          {!collapsed && <span>Sign Out</span>}
        </button>
      </div>
    </div>
  );

  return (
    <div className="flex h-screen bg-nova-bg overflow-hidden">
      {/* Desktop Sidebar */}
      <aside className={cn(
        'hidden lg:flex flex-col bg-nova-secondary border-r border-nova-border transition-all duration-300 flex-shrink-0',
        collapsed ? 'w-16' : 'w-64'
      )}>
        <SidebarContent />
      </aside>

      {/* Mobile Sidebar Overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/60 z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Mobile Sidebar */}
      <aside className={cn(
        'fixed left-0 top-0 bottom-0 w-72 bg-nova-secondary border-r border-nova-border z-50 lg:hidden transform transition-transform duration-300',
        sidebarOpen ? 'translate-x-0' : '-translate-x-full'
      )}>
        <SidebarContent />
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Top Bar */}
        <header className="h-14 border-b border-nova-border bg-nova-secondary/50 flex items-center px-4 gap-3 sm:gap-4 flex-shrink-0">
          <button
            className="lg:hidden nova-btn-ghost p-2"
            onClick={() => setSidebarOpen(true)}
          >
            <Menu size={20} />
          </button>

          {/* Page title */}
          <div className="flex-1 min-w-0">
            <h1 className="text-sm font-semibold text-nova-text capitalize truncate">
              {navItems.find(i => i.id === activeTab)?.label || 'Dashboard'}
            </h1>
          </div>

          {/* Quick actions & Back to Website */}
          <div className="flex items-center gap-2 sm:gap-3">
            <button
              onClick={() => navigate('/')}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-nova-border hover:border-nova-primary/50 bg-nova-surface hover:bg-nova-surface2 text-nova-text-muted hover:text-nova-text text-xs font-semibold transition-all shadow-sm group"
              title="Exit Dashboard and Return to Website"
            >
              <Globe size={14} className="text-nova-primary-light group-hover:rotate-12 transition-transform" />
              <span className="hidden sm:inline">Back to Website</span>
              <span className="sm:hidden">Website</span>
            </button>

            <button
              onClick={() => onTabChange('alerts')}
              className="relative nova-btn-ghost p-2"
              title="Alerts"
            >
              <Bell size={18} />
              {unreadAlerts > 0 && (
                <span className="absolute -top-0.5 -right-0.5 w-4 h-4 bg-nova-red text-white text-xs rounded-full flex items-center justify-center font-bold leading-none">
                  {unreadAlerts > 9 ? '9+' : unreadAlerts}
                </span>
              )}
            </button>
            <div
              className="flex items-center gap-2 cursor-pointer p-1 rounded-lg hover:bg-nova-surface2 transition-colors"
              onClick={() => onTabChange('settings')}
              title="Profile Settings"
            >
              <img
                src={currentUser?.avatar}
                alt={currentUser?.name}
                className="w-8 h-8 rounded-full object-cover"
              />
              <span className="hidden sm:block text-sm text-nova-text-muted">{currentUser?.name?.split(' ')[0]}</span>
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 overflow-y-auto p-4 md:p-6">
          {children}
        </main>
      </div>
    </div>
  );
};

export default DashboardLayout;

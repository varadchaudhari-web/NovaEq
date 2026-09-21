import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Menu, X, ChevronDown, Bell, User, LogOut } from 'lucide-react';
import Logo from '@/components/ui/Logo';
import { useAppStore } from '@/stores/useAppStore';
import { cn } from '@/lib/utils';

const publicNavItems = [
  { label: 'Markets', href: '/markets' },
  { label: 'AI Insights', href: '/ai-insights' },
  { label: 'Pricing', href: '/pricing' },
  {
    label: 'Learn',
    href: '/learn',
    children: [
      { label: 'Trading Courses', href: '/learn' },
      { label: 'Webinars', href: '/learn#webinars' },
      { label: 'Market Blog', href: '/learn#blog' },
      { label: 'Tutorials', href: '/learn#tutorials' },
    ],
  },
  { label: 'Community', href: '/community' },
  { label: 'About', href: '/about' },
];

const loggedInNavItems: Record<string, typeof publicNavItems> = {
  investor: [
    { label: 'Markets', href: '/markets' },
    { label: 'AI Insights', href: '/ai-insights' },
    { label: 'Community', href: '/community' },
    { label: 'Learn', href: '/learn' },
  ],
  trader: [
    { label: 'Markets', href: '/markets' },
    { label: 'AI Insights', href: '/ai-insights' },
    { label: 'Community', href: '/community' },
    { label: 'Learn', href: '/learn' },
  ],
  advisor: [
    { label: 'AI Insights', href: '/ai-insights' },
    { label: 'Community', href: '/community' },
    { label: 'Learn', href: '/learn' },
    { label: 'About', href: '/about' },
  ],
  admin: [
    { label: 'About', href: '/about' },
    { label: 'Contact', href: '/contact' },
  ],
};

const PublicNavbar: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { isLoggedIn, currentUser, logout, alerts } = useAppStore();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);
  const [userMenuOpen, setUserMenuOpen] = useState(false);

  const unreadCount = alerts.filter(a => !a.isRead).length;
  const navItems = isLoggedIn && currentUser ? loggedInNavItems[currentUser.role] || loggedInNavItems.investor : publicNavItems;

  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handler);
    return () => window.removeEventListener('scroll', handler);
  }, []);

  useEffect(() => {
    setMobileOpen(false);
    setActiveDropdown(null);
  }, [location.pathname]);

  const getDashboardPath = () => {
    switch (currentUser?.role) {
      case 'trader': return '/dashboard/trader';
      case 'advisor': return '/dashboard/advisor';
      case 'admin': return '/dashboard/admin';
      default: return '/dashboard/investor';
    }
  };

  return (
    <nav
      className={cn(
        'fixed top-0 left-0 right-0 z-50 transition-all duration-300',
        scrolled
          ? 'nova-glass border-b border-nova-border shadow-nova-card'
          : 'bg-transparent'
      )}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex-shrink-0">
            <Logo size="md" />
          </Link>

          {/* Desktop Nav */}
          <div className="hidden lg:flex items-center gap-1">
            {navItems.map((item) => (
              <div key={item.label} className="relative">
                {item.children ? (
                  <button
                    className={cn(
                      'flex items-center gap-1 px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200',
                      'text-nova-text-muted hover:text-nova-text hover:bg-nova-surface2'
                    )}
                    onMouseEnter={() => setActiveDropdown(item.label)}
                    onMouseLeave={() => setActiveDropdown(null)}
                  >
                    {item.label}
                    <ChevronDown size={14} className={cn('transition-transform', activeDropdown === item.label && 'rotate-180')} />
                  </button>
                ) : (
                  <Link
                    to={item.href}
                    className={cn(
                      'px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200',
                      location.pathname === item.href
                        ? 'text-nova-primary-light bg-nova-primary/10'
                        : 'text-nova-text-muted hover:text-nova-text hover:bg-nova-surface2'
                    )}
                  >
                    {item.label}
                  </Link>
                )}

                {item.children && activeDropdown === item.label && (
                  <div
                    className="absolute top-full left-0 mt-1 w-48 nova-glass rounded-xl border border-nova-border shadow-nova-modal py-1"
                    onMouseEnter={() => setActiveDropdown(item.label)}
                    onMouseLeave={() => setActiveDropdown(null)}
                  >
                    {item.children.map(child => (
                      <Link
                        key={child.label}
                        to={child.href}
                        className="block px-4 py-2.5 text-sm text-nova-text-muted hover:text-nova-text hover:bg-nova-surface2 transition-colors"
                      >
                        {child.label}
                      </Link>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* Right Side */}
          <div className="flex items-center gap-3">
            {isLoggedIn && currentUser ? (
              <>
                <button
                  onClick={() => navigate(getDashboardPath(), { state: { activeTab: 'alerts' } })}
                  className="relative nova-btn-ghost p-2 rounded-xl"
                >
                  <Bell size={18} />
                  {unreadCount > 0 && (
                    <span className="absolute -top-1 -right-1 w-5 h-5 bg-nova-red text-white text-xs rounded-full flex items-center justify-center font-bold">
                      {unreadCount > 9 ? '9+' : unreadCount}
                    </span>
                  )}
                </button>

                <div className="relative">
                  <button
                    onClick={() => setUserMenuOpen(!userMenuOpen)}
                    className="flex items-center gap-2 nova-glass px-3 py-2 rounded-xl hover:border-nova-primary/30 transition-all"
                  >
                    <img src={currentUser.avatar} alt={currentUser.name} className="w-7 h-7 rounded-full object-cover" />
                    <span className="hidden sm:block text-sm font-medium text-nova-text">{currentUser.name.split(' ')[0]}</span>
                    <ChevronDown size={14} className="text-nova-text-muted" />
                  </button>

                  {userMenuOpen && (
                    <div className="absolute top-full right-0 mt-2 w-56 nova-glass rounded-xl border border-nova-border shadow-nova-modal py-2">
                      <div className="px-4 py-2 border-b border-nova-border mb-1">
                        <p className="text-sm font-semibold text-nova-text">{currentUser.name}</p>
                        <p className="text-xs text-nova-text-muted capitalize">{currentUser.role}</p>
                      </div>
                      <button
                        onClick={() => { navigate(getDashboardPath()); setUserMenuOpen(false); }}
                        className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-nova-text-muted hover:text-nova-text hover:bg-nova-surface2 transition-colors"
                      >
                        <User size={15} /> Dashboard
                      </button>
                      <button
                        onClick={() => { logout(); setUserMenuOpen(false); navigate('/'); }}
                        className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-nova-red hover:bg-nova-red/10 transition-colors"
                      >
                        <LogOut size={15} /> Sign Out
                      </button>
                    </div>
                  )}
                </div>

                <button
                  onClick={() => navigate(getDashboardPath())}
                  className="nova-btn-primary text-sm py-2 px-4 hidden sm:block"
                >
                  Dashboard
                </button>
              </>
            ) : (
              <>
                <Link to="/login" className="nova-btn-ghost text-sm hidden sm:block">
                  Login
                </Link>
                <Link to="/create-account" className="nova-btn-primary text-sm py-2 px-4">
                  Get Started
                </Link>
              </>
            )}

            {/* Mobile menu */}
            <button
              className="lg:hidden nova-btn-ghost p-2"
              onClick={() => setMobileOpen(!mobileOpen)}
            >
              {mobileOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {mobileOpen && (
        <div className="lg:hidden nova-glass border-t border-nova-border">
          <div className="px-4 py-3 space-y-1">
            {navItems.map((item) => (
              <div key={item.label}>
                <Link
                  to={item.href}
                  className={cn(
                    'block px-3 py-2.5 rounded-lg text-sm font-medium transition-colors',
                    location.pathname === item.href
                      ? 'text-nova-primary-light bg-nova-primary/10'
                      : 'text-nova-text-muted hover:text-nova-text hover:bg-nova-surface2'
                  )}
                >
                  {item.label}
                </Link>
                {item.children && (
                  <div className="ml-4 mt-1 space-y-1">
                    {item.children.map(child => (
                      <Link
                        key={child.label}
                        to={child.href}
                        className="block px-3 py-2 text-sm text-nova-text-subtle hover:text-nova-text-muted transition-colors"
                      >
                        {child.label}
                      </Link>
                    ))}
                  </div>
                )}
              </div>
            ))}
            {!isLoggedIn && (
              <div className="flex gap-2 pt-2">
                <Link to="/login" className="flex-1 nova-btn-outline text-sm text-center py-2.5">Login</Link>
                <Link to="/create-account" className="flex-1 nova-btn-primary text-sm text-center py-2.5">Get Started</Link>
              </div>
            )}
          </div>
        </div>
      )}
    </nav>
  );
};

export default PublicNavbar;

import React from 'react';
import { Link } from 'react-router-dom';
import { Mail, Phone, MapPin, Shield } from 'lucide-react';
import Logo from '@/components/ui/Logo';
import { useAppStore } from '@/stores/useAppStore';

const footerGroups = [
  {
    title: 'Products',
    links: [
      { label: 'Trading', href: '/markets' },
      { label: 'Investments', href: '/pricing' },
      { label: 'AI Insights', href: '/ai-insights' },
    ],
  },
  {
    title: 'Company',
    links: [
      { label: 'About', href: '/about' },
      { label: 'Careers', href: '/about#careers' },
      { label: 'Contact', href: '/contact' },
    ],
  },
  {
    title: 'Resources',
    links: [
      { label: 'Learn', href: '/learn' },
      { label: 'Community', href: '/community' },
      { label: 'Help', href: '/contact' },
    ],
  },
  {
    title: 'Legal',
    links: [
      { label: 'Privacy Policy', href: '/about#privacy' },
      { label: 'Terms', href: '/about#terms' },
      { label: 'Security', href: '/about#security' },
    ],
  },
];

const Footer: React.FC = () => {
  const { isLoggedIn, currentUser } = useAppStore();

  const dashboardPath = currentUser?.role === 'trader'
    ? '/dashboard/trader'
    : currentUser?.role === 'advisor'
      ? '/dashboard/advisor'
      : currentUser?.role === 'admin'
        ? '/dashboard/admin'
        : '/dashboard/investor';

  return (
    <footer className="bg-nova-secondary border-t border-nova-border mt-20">
      {/* CTA Banner */}
      <div className="border-b border-nova-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div>
              <h3 className="text-xl font-display font-bold text-nova-text mb-1">
                Start investing smarter with AI
              </h3>
              <p className="text-nova-text-muted text-sm">
                Join 125,000+ investors growing wealth on NovaEq. Free to start.
              </p>
            </div>
            <div className="flex gap-3">
              <Link to={isLoggedIn ? dashboardPath : '/create-account'} className="nova-btn-primary text-sm py-2.5">
                {isLoggedIn ? 'Open Dashboard' : 'Create Free Account'}
              </Link>
              <Link to={isLoggedIn ? '/markets' : '/pricing'} className="nova-btn-outline text-sm py-2.5">
                {isLoggedIn ? 'Explore Markets' : 'View Plans'}
              </Link>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 gap-10 lg:grid-cols-12 lg:gap-8">
          {/* Brand */}
          <div className="lg:col-span-3">
            <Logo size="md" className="mb-4" />
            <p className="text-nova-text-muted text-sm leading-relaxed mb-5 max-w-xs">
              AI-powered investment, equity trading, and wealth management platform for modern investors.
            </p>
            <div className="flex items-center gap-2 text-xs text-nova-text-subtle mb-6">
              <Shield size={14} className="text-nova-accent" />
              <span>SEBI Registered | ISO 27001 Certified</span>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-8 sm:grid-cols-4 lg:col-span-6">
            {footerGroups.map(group => (
              <div key={group.title}>
                <h4 className="text-nova-text font-semibold text-sm mb-4">{group.title}</h4>
                <ul className="space-y-2.5">
                  {group.links.map(({ label, href }) => (
                    <li key={label}>
                      <Link to={href} className="text-nova-text-muted hover:text-nova-primary-light text-sm transition-colors">
                        {label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>

          {/* Contact */}
          <div className="lg:col-span-3">
            <h4 className="text-nova-text font-semibold text-sm mb-4">Contact</h4>
            <ul className="space-y-3">
              <li className="flex items-start gap-2.5 text-sm text-nova-text-muted">
                <Mail size={14} className="text-nova-accent mt-0.5 flex-shrink-0" />
                <a href="mailto:support@novaeq.ai" className="hover:text-nova-primary-light transition-colors">
                  support@novaeq.ai
                </a>
              </li>
              <li className="flex items-start gap-2.5 text-sm text-nova-text-muted">
                <Phone size={14} className="text-nova-accent mt-0.5 flex-shrink-0" />
                <a href="tel:+18001234567" className="hover:text-nova-primary-light transition-colors">
                  1-800-NOVA-EQ
                </a>
              </li>
              <li className="flex items-start gap-2.5 text-sm text-nova-text-muted">
                <MapPin size={14} className="text-nova-accent mt-0.5 flex-shrink-0" />
                <span>Floor 12, Tech Tower<br />Mumbai, MH 400051</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom */}
        <div className="mt-12 pt-6 border-t border-nova-border flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-nova-text-subtle text-xs text-center sm:text-left">
            © 2024 NovaEq Technologies Pvt. Ltd. All rights reserved.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            {[
              { label: 'Privacy Policy', href: '/about#privacy' },
              { label: 'Terms', href: '/about#terms' },
              { label: 'Security', href: '/about#security' },
            ].map(({ label, href }) => (
              <Link key={label} to={href} className="text-nova-text-subtle hover:text-nova-text-muted text-xs transition-colors">
                {label}
              </Link>
            ))}
          </div>
          <p className="text-nova-text-subtle text-xs text-center">
            Investments are subject to market risk. Please read all scheme-related documents carefully.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;

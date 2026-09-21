import React, { useState } from 'react';
import { Check } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAppStore } from '@/stores/useAppStore';
import { cn } from '@/lib/utils';
import TiltCard from '@/components/ui/TiltCard';

const plans = [
  {
    id: 'free', name: 'Free', price: 0, yearlyPrice: 0, color: 'border-nova-border', badge: '',
    desc: 'Perfect for beginners exploring the market',
    features: ['5 stocks watchlist', '2 price alerts', 'Basic portfolio tracker', 'Community access', 'Market news feed', 'Basic charts'],
    missing: ['AI Recommendations', 'Algo Trading', 'PDF Reports', 'Advanced Analytics'],
    cta: 'Get Started Free', ctaClass: 'nova-btn-outline',
  },
  {
    id: 'basic', name: 'Basic', price: 9.99, yearlyPrice: 7.99, color: 'border-nova-primary/40', badge: '',
    desc: 'For active investors building their portfolio',
    features: ['25 stocks watchlist', '15 price alerts', 'Portfolio analytics', 'Technical charts', 'Market heatmaps', 'Strategy marketplace'],
    missing: ['AI Recommendations', 'Algo Trading', 'PDF Reports'],
    cta: 'Start Basic', ctaClass: 'nova-btn-outline',
  },
  {
    id: 'pro', name: 'Pro', price: 29.99, yearlyPrice: 23.99, color: 'border-nova-accent/60', badge: 'Most Popular',
    desc: 'For serious traders and active investors',
    features: ['Unlimited watchlist', '100 price alerts', 'AI recommendations', 'Advanced analytics', 'Algo trading (3 strategies)', 'PDF reports', 'SIP planner', 'Options chain'],
    missing: ['Dedicated advisor', 'API access'],
    cta: 'Start Pro Trial', ctaClass: 'nova-btn-accent',
  },
  {
    id: 'elite', name: 'Elite', price: 79.99, yearlyPrice: 63.99, color: 'border-nova-yellow/40', badge: 'Best Value',
    desc: 'For professional traders and financial advisors',
    features: ['Everything in Pro', 'Unlimited strategies', 'Priority AI processing', 'Dedicated advisor access', 'Custom PDF branding', 'API access', 'White-glove support', 'Early feature access'],
    missing: [],
    cta: 'Go Elite', ctaClass: 'nova-btn-primary',
  },
];

const featureComparison = [
  { feature: 'Watchlist Stocks', free: '5', basic: '25', pro: 'Unlimited', elite: 'Unlimited' },
  { feature: 'Price Alerts', free: '2', basic: '15', pro: '100', elite: 'Unlimited' },
  { feature: 'Portfolio Tracking', free: '✓', basic: '✓', pro: '✓', elite: '✓' },
  { feature: 'AI Recommendations', free: '✗', basic: '✗', pro: '✓', elite: '✓' },
  { feature: 'Algo Trading', free: '✗', basic: '✗', pro: '3 Strategies', elite: 'Unlimited' },
  { feature: 'PDF Reports', free: '✗', basic: '✗', pro: '✓', elite: 'Custom Branded' },
  { feature: 'API Access', free: '✗', basic: '✗', pro: '✗', elite: '✓' },
  { feature: 'Advisor Access', free: '✗', basic: '✗', pro: '✗', elite: 'Dedicated' },
  { feature: 'Support', free: 'Community', basic: 'Email', pro: 'Priority', elite: 'White-glove' },
];

const Pricing: React.FC = () => {
  const navigate = useNavigate();
  const { openAuthModal, isLoggedIn, currentUser, updateUserSubscription } = useAppStore();
  const [yearly, setYearly] = useState(false);

  const handlePlan = (planId: string) => {
    if (!isLoggedIn) {
      if (planId === 'free') navigate('/create-account');
      else openAuthModal(`Upgrade to ${planId.charAt(0).toUpperCase() + planId.slice(1)} — create your account first.`);
      return;
    }

    if (currentUser) updateUserSubscription(currentUser.id, planId as typeof currentUser.subscription);
    const paths: Record<string, string> = {
      investor: '/dashboard/investor',
      trader: '/dashboard/trader',
      advisor: '/dashboard/advisor',
      admin: '/dashboard/admin',
    };
    navigate(paths[currentUser?.role || 'investor'] || '/dashboard/investor');
  };

  return (
    <div className="min-h-screen pt-24">
      {/* Header */}
      <div className="text-center px-4 mb-14">
        <h1 className="text-5xl font-display font-black text-nova-text mb-4">
          Simple, Transparent <span className="gradient-text">Pricing</span>
        </h1>
        <p className="text-nova-text-muted max-w-xl mx-auto mb-7">
          Start free, upgrade when you're ready. No hidden fees. Cancel anytime.
        </p>
        <div className="inline-flex items-center gap-3 bg-nova-surface2 border border-nova-border rounded-xl p-1.5">
          <button onClick={() => setYearly(false)} className={cn('px-5 py-2 rounded-lg text-sm font-medium transition-all', !yearly ? 'bg-nova-primary text-white' : 'text-nova-text-muted')}>Monthly</button>
          <button onClick={() => setYearly(true)} className={cn('px-5 py-2 rounded-lg text-sm font-medium transition-all flex items-center gap-2', yearly ? 'bg-nova-primary text-white' : 'text-nova-text-muted')}>
            Yearly <span className="text-xs bg-nova-accent text-white px-1.5 py-0.5 rounded-md">Save 20%</span>
          </button>
        </div>
      </div>

      {/* Plans with 3D Tilt */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-16">
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {plans.map(plan => (
            <TiltCard
              key={plan.id}
              className={cn('p-6 relative border-2 flex flex-col', plan.color, plan.badge && 'scale-[1.02]')}
              tiltMaxAngle={9}
              translateZ={12}
            >
              {plan.badge && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                  <span className={cn('text-xs font-bold px-4 py-1.5 rounded-full shadow-md', plan.id === 'pro' ? 'bg-nova-accent text-white' : 'bg-nova-yellow text-nova-bg')}>
                    {plan.badge}
                  </span>
                </div>
              )}
              <div className="mb-5">
                <p className="text-lg font-display font-bold text-nova-text mb-1">{plan.name}</p>
                <p className="text-xs text-nova-text-muted mb-4">{plan.desc}</p>
                <div className="flex items-end gap-1">
                  <span className="text-4xl font-black text-nova-text">${yearly ? plan.yearlyPrice.toFixed(0) : plan.price.toFixed(0)}</span>
                  {plan.price > 0 && <span className="text-nova-text-muted text-sm mb-1">/mo</span>}
                </div>
                {yearly && plan.price > 0 && (
                  <p className="text-xs text-nova-accent mt-1">Billed annually — save ${((plan.price - plan.yearlyPrice) * 12).toFixed(0)}/yr</p>
                )}
              </div>

              <div className="flex-1 space-y-2 mb-6">
                {plan.features.map(f => (
                  <div key={f} className="flex items-start gap-2">
                    <Check size={14} className="text-nova-accent mt-0.5 flex-shrink-0" />
                    <span className="text-sm text-nova-text-muted">{f}</span>
                  </div>
                ))}
                {plan.missing.map(f => (
                  <div key={f} className="flex items-start gap-2 opacity-40">
                    <span className="w-3.5 h-3.5 flex-shrink-0 mt-0.5 text-nova-text-subtle text-center leading-none">✗</span>
                    <span className="text-sm text-nova-text-subtle line-through">{f}</span>
                  </div>
                ))}
              </div>

              <button onClick={() => handlePlan(plan.id)} className={cn(plan.ctaClass, 'w-full text-sm py-3')}>
                {plan.cta}
              </button>
            </TiltCard>
          ))}
        </div>
      </div>

      {/* Feature Comparison */}
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 mb-16">
        <h2 className="text-2xl font-display font-bold text-nova-text text-center mb-8">Full Feature Comparison</h2>
        <TiltCard className="p-0 overflow-hidden" tiltMaxAngle={4} translateZ={6}>
          <div className="grid grid-cols-5 bg-nova-surface2 px-4 py-3 text-xs font-bold text-nova-text-muted uppercase tracking-wider">
            <span className="col-span-1">Feature</span>
            {['Free', 'Basic', 'Pro', 'Elite'].map(p => <span key={p} className="text-center">{p}</span>)}
          </div>
          {featureComparison.map((row, i) => (
            <div key={row.feature} className={cn('grid grid-cols-5 px-4 py-3 border-t border-nova-border/50', i % 2 === 0 && 'bg-nova-surface2/30')}>
              <span className="text-sm text-nova-text">{row.feature}</span>
              {[row.free, row.basic, row.pro, row.elite].map((val, j) => (
                <span key={j} className={cn('text-sm text-center', val === '✓' || val.includes('✓') ? 'text-nova-green' : val === '✗' ? 'text-nova-text-subtle' : 'text-nova-text-muted')}>
                  {val}
                </span>
              ))}
            </div>
          ))}
        </TiltCard>
      </div>

      {/* FAQ */}
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 mb-20">
        <h2 className="text-2xl font-display font-bold text-nova-text text-center mb-8">Frequently Asked Questions</h2>
        <div className="space-y-4">
          {[
            { q: 'Is there a free trial for paid plans?', a: 'Yes! Pro and Elite plans come with a 14-day free trial. No credit card required to start.' },
            { q: 'Can I switch plans anytime?', a: 'Absolutely. Upgrade or downgrade at any time. Prorated credits apply automatically.' },
            { q: 'Are my investments real or simulated?', a: 'NovaEq is a pure analytics and AI platform. All trading shown is simulated for educational purposes.' },
            { q: 'What payment methods are accepted?', a: 'We accept all major credit/debit cards, UPI, net banking, and wallet payments.' },
            { q: 'Is my data secure?', a: 'Yes. NovaEq is ISO 27001 certified with bank-grade 256-bit encryption and SOC 2 compliance.' },
          ].map(({ q, a }) => (
            <TiltCard key={q} className="p-5" tiltMaxAngle={6} translateZ={8}>
              <p className="text-sm font-semibold text-nova-text mb-2">{q}</p>
              <p className="text-sm text-nova-text-muted">{a}</p>
            </TiltCard>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Pricing;


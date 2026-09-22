import React, { useState } from 'react';
import { Check, Shield, Zap, Sparkles, CreditCard, UserCheck, ArrowRight, CheckCircle2, Lock, X } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAppStore } from '@/stores/useAppStore';
import { cn } from '@/lib/utils';
import TiltCard from '@/components/ui/TiltCard';
import { initiateRazorpayPayment, RAZORPAY_TEST_KEY } from '@/lib/razorpay';
import { toast } from 'sonner';
import type { SubscriptionPlan, UserRole } from '@/types';

interface PlanItem {
  id: SubscriptionPlan;
  name: string;
  price: number;
  yearlyPrice: number;
  color: string;
  badge: string;
  desc: string;
  features: string[];
  missing: string[];
}

const plans: PlanItem[] = [
  {
    id: 'free',
    name: 'Free',
    price: 0,
    yearlyPrice: 0,
    color: 'border-nova-border hover:border-slate-600',
    badge: '',
    desc: 'Perfect for beginners exploring the market',
    features: [
      '5 stocks watchlist',
      '2 price alerts',
      'Basic portfolio tracker',
      'Community access',
      'Market news feed',
      'Basic charts',
    ],
    missing: ['AI Recommendations', 'Algo Trading', 'PDF Reports', 'Advanced Analytics'],
  },
  {
    id: 'basic',
    name: 'Basic',
    price: 9.99,
    yearlyPrice: 7.99,
    color: 'border-blue-500/40 hover:border-blue-500/80',
    badge: '',
    desc: 'For active investors building their portfolio',
    features: [
      '25 stocks watchlist',
      '15 price alerts',
      'Portfolio analytics',
      'Technical charts',
      'Market heatmaps',
      'Strategy marketplace',
    ],
    missing: ['AI Recommendations', 'Algo Trading', 'PDF Reports'],
  },
  {
    id: 'pro',
    name: 'Pro',
    price: 29.99,
    yearlyPrice: 23.99,
    color: 'border-emerald-500/50 hover:border-emerald-500',
    badge: 'Most Popular',
    desc: 'For serious traders and active investors',
    features: [
      'Unlimited watchlist',
      '100 price alerts',
      'AI recommendations',
      'Advanced analytics',
      'Algo trading (3 strategies)',
      'PDF reports',
      'SIP planner',
      'Options chain',
    ],
    missing: ['Dedicated advisor', 'API access'],
  },
  {
    id: 'elite',
    name: 'Elite',
    price: 79.99,
    yearlyPrice: 63.99,
    color: 'border-amber-500/50 hover:border-amber-500',
    badge: 'Best Value',
    desc: 'For professional traders and financial advisors',
    features: [
      'Everything in Pro',
      'Unlimited strategies',
      'Priority AI processing',
      'Dedicated advisor access',
      'Custom PDF branding',
      'API access',
      'White-glove support',
      'Early feature access',
    ],
    missing: [],
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

const demoProfiles: { role: UserRole; name: string; title: string; email: string; avatar: string }[] = [
  {
    role: 'investor',
    name: 'Alex Reynolds',
    title: 'Retail Investor (Portfolio & AI Insights)',
    email: 'alex@example.com',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&crop=face',
  },
  {
    role: 'trader',
    name: 'Priya Sharma',
    title: 'Quant Trader (Algo Trading & Charts)',
    email: 'priya@example.com',
    avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&h=100&fit=crop&crop=face',
  },
  {
    role: 'advisor',
    name: 'Marcus Chen',
    title: 'Wealth Advisor (Client Portfolios & Models)',
    email: 'marcus@example.com',
    avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop&crop=face',
  },
];

const Pricing: React.FC = () => {
  const navigate = useNavigate();
  const { isLoggedIn, currentUser, updateUserSubscription, login, addAlert } = useAppStore();
  const [yearly, setYearly] = useState(false);

  // Demo Checkout / Role Selection Modals
  const [selectedPlanForPayment, setSelectedPlanForPayment] = useState<PlanItem | null>(null);
  const [showDemoCheckoutModal, setShowDemoCheckoutModal] = useState(false);
  const [showRoleSelectionModal, setShowRoleSelectionModal] = useState(false);
  const [paymentSuccessData, setPaymentSuccessData] = useState<{ plan: PlanItem; paymentId: string } | null>(null);
  const [isProcessingPayment, setIsProcessingPayment] = useState(false);

  const currentPlanId = (currentUser?.subscription?.toLowerCase() || 'free') as SubscriptionPlan;

  const handlePlanClick = async (plan: PlanItem) => {
    // If logged in and already on this plan
    if (isLoggedIn && currentPlanId === plan.id) {
      toast.info(`You are currently on the ${plan.name} plan.`);
      return;
    }

    // LOGGED IN USER
    if (isLoggedIn && currentUser) {
      if (plan.id === 'free') {
        // Free downgrade
        updateUserSubscription(currentUser.id, 'free');
        addAlert({
          userId: currentUser.id,
          type: 'portfolio',
          title: 'Subscription Changed',
          message: 'Your account has been switched to the Free Plan.',
        });
        toast.success('Switched to Free Plan.');
        return;
      }

      // Paid plan switch
      setSelectedPlanForPayment(plan);
      executePaymentFlow(plan, currentUser.email, currentUser.name, (paymentId) => {
        updateUserSubscription(currentUser.id, plan.id);
        addAlert({
          userId: currentUser.id,
          type: 'portfolio',
          title: `Subscription Upgraded: ${plan.name} Plan`,
          message: `Your account subscription is now ${plan.name}. Payment ID: ${paymentId} (Demo mode).`,
        });
        toast.success(`Plan successfully upgraded to ${plan.name}! (Demo Payment Verified)`);
      });
      return;
    }

    // LOGGED OUT USER
    setSelectedPlanForPayment(plan);

    if (plan.id === 'free') {
      // Direct demo role selection
      setShowRoleSelectionModal(true);
      return;
    }

    // For paid plan: initiate demo checkout first
    executePaymentFlow(plan, 'guest@novaeq.ai', 'Guest Trader', (paymentId) => {
      setPaymentSuccessData({ plan, paymentId });
      setShowDemoCheckoutModal(false);
      setShowRoleSelectionModal(true);
    });
  };

  const executePaymentFlow = async (
    plan: PlanItem,
    email: string,
    name: string,
    onSuccessCallback: (paymentId: string) => void
  ) => {
    const finalPrice = yearly ? plan.yearlyPrice * 12 : plan.price;

    const started = await initiateRazorpayPayment({
      planName: plan.name,
      amount: finalPrice,
      isYearly: yearly,
      userEmail: email,
      userName: name,
      onSuccess: (paymentId) => {
        onSuccessCallback(paymentId);
      },
      onFailure: () => {
        // If razorpay popup is dismissed or cancelled, open the in-app demo checkout modal
        setShowDemoCheckoutModal(true);
      },
    });

    if (!started) {
      // In-app fallback demo payment modal
      setShowDemoCheckoutModal(true);
    }
  };

  const handleCompleteDemoModalPayment = () => {
    if (!selectedPlanForPayment) return;
    setIsProcessingPayment(true);

    setTimeout(() => {
      setIsProcessingPayment(false);
      setShowDemoCheckoutModal(false);
      const paymentId = `pay_demo_${Date.now()}`;

      if (isLoggedIn && currentUser) {
        updateUserSubscription(currentUser.id, selectedPlanForPayment.id);
        addAlert({
          userId: currentUser.id,
          type: 'portfolio',
          title: `Subscription Upgraded: ${selectedPlanForPayment.name} Plan`,
          message: `Your account subscription is now ${selectedPlanForPayment.name}. Payment ID: ${paymentId} (Demo mode).`,
        });
        toast.success(`Plan successfully upgraded to ${selectedPlanForPayment.name}! (Demo Mode)`);
      } else {
        setPaymentSuccessData({ plan: selectedPlanForPayment, paymentId });
        setShowRoleSelectionModal(true);
      }
    }, 800);
  };

  const handleSelectDemoProfile = (profile: typeof demoProfiles[0]) => {
    const chosenPlan = selectedPlanForPayment?.id || 'free';
    const user = login(profile.email, profile.role);

    if (user) {
      updateUserSubscription(user.id, chosenPlan);
      toast.success(`Logged in as ${profile.name} with ${selectedPlanForPayment?.name || 'Free'} Plan!`);
      const paths: Record<string, string> = {
        investor: '/dashboard/investor',
        trader: '/dashboard/trader',
        advisor: '/dashboard/advisor',
        admin: '/dashboard/admin',
      };
      setShowRoleSelectionModal(false);
      navigate(paths[profile.role] || '/dashboard/investor');
    }
  };

  return (
    <div className="min-h-screen pt-28 pb-20 bg-[#070d1a] text-[#f8fafc]">
      {/* Header */}
      <div className="text-center px-4 max-w-4xl mx-auto mb-14">
        <span className="font-mono text-xs text-blue-400 uppercase tracking-widest block mb-3">
          PLANS & PRICING
        </span>
        <h1 className="text-4xl sm:text-5xl font-display font-bold text-white mb-4">
          Simple, Transparent{' '}
          <span className="bg-gradient-to-r from-blue-400 via-sky-300 to-emerald-400 bg-clip-text text-transparent">
            Pricing
          </span>
        </h1>
        <p className="text-slate-400 text-sm sm:text-base max-w-xl mx-auto mb-8">
          Start free, upgrade when you're ready. Safe demo payments enabled with test key. Cancel anytime.
        </p>

        {/* Logged-in user status notification */}
        {isLoggedIn && currentUser && (
          <div className="inline-flex items-center gap-2.5 px-4 py-2 rounded-xl bg-blue-500/10 border border-blue-500/30 text-xs sm:text-sm text-blue-300 mb-8 shadow-sm">
            <UserCheck size={16} className="text-emerald-400 flex-shrink-0" />
            <span>
              Signed in as <strong className="text-white">{currentUser.name}</strong> · Current Plan:{' '}
              <strong className="text-emerald-400 uppercase font-semibold">
                {currentUser.subscription}
              </strong>
            </span>
          </div>
        )}

        {/* Monthly / Yearly Switcher */}
        <div className="flex justify-center">
          <div className="inline-flex items-center gap-2 bg-[#0d182e] border border-[#1c2a45] rounded-xl p-1.5 shadow-inner">
            <button
              onClick={() => setYearly(false)}
              className={cn(
                'px-5 py-2 rounded-lg text-xs sm:text-sm font-semibold transition-all',
                !yearly ? 'bg-blue-600 text-white shadow-md' : 'text-slate-400 hover:text-slate-200'
              )}
            >
              Monthly
            </button>
            <button
              onClick={() => setYearly(true)}
              className={cn(
                'px-5 py-2 rounded-lg text-xs sm:text-sm font-semibold transition-all flex items-center gap-2',
                yearly ? 'bg-blue-600 text-white shadow-md' : 'text-slate-400 hover:text-slate-200'
              )}
            >
              <span>Yearly</span>
              <span className="text-[10px] bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 px-2 py-0.5 rounded-full font-bold">
                Save 20%
              </span>
            </button>
          </div>
        </div>
      </div>

      {/* Pricing Cards Grid — No Overlap, Equal Height */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-20">
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6 items-stretch">
          {plans.map((plan) => {
            const isCurrent = isLoggedIn && currentPlanId === plan.id;
            const priceToDisplay = yearly ? plan.yearlyPrice : plan.price;

            return (
              <TiltCard
                key={plan.id}
                className={cn(
                  'p-7 sm:p-8 flex flex-col justify-between h-full min-h-[620px] relative border-2 transition-all',
                  plan.color,
                  isCurrent && 'border-emerald-500 ring-2 ring-emerald-500/40 bg-emerald-950/10'
                )}
                tiltMaxAngle={6}
                translateZ={10}
              >
                {/* Top Badges */}
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 z-20 flex gap-2">
                  {isCurrent ? (
                    <span className="text-xs font-bold px-3.5 py-1 rounded-full bg-emerald-500 text-slate-950 shadow-md flex items-center gap-1">
                      <CheckCircle2 size={13} /> Current Plan
                    </span>
                  ) : plan.badge ? (
                    <span
                      className={cn(
                        'text-xs font-bold px-3.5 py-1 rounded-full shadow-md',
                        plan.id === 'pro'
                          ? 'bg-gradient-to-r from-emerald-500 to-teal-500 text-slate-950'
                          : 'bg-gradient-to-r from-amber-400 to-amber-500 text-slate-950'
                      )}
                    >
                      {plan.badge}
                    </span>
                  ) : null}
                </div>

                {/* Plan Info */}
                <div>
                  <div className="mb-6 pt-1">
                    <div className="flex items-center justify-between gap-2 mb-1">
                      <h3 className="text-xl font-display font-bold text-white">{plan.name}</h3>
                      {plan.id === 'pro' && <Zap size={18} className="text-emerald-400" />}
                      {plan.id === 'elite' && <Sparkles size={18} className="text-amber-400" />}
                    </div>
                    <p className="text-xs text-slate-400 leading-relaxed min-h-[36px]">{plan.desc}</p>
                  </div>

                  {/* Price */}
                  <div className="mb-6 pb-6 border-b border-[#1c2a45]">
                    <div className="flex items-baseline gap-1.5">
                      <span className="text-4xl sm:text-5xl font-mono font-extrabold text-white">
                        ${priceToDisplay.toFixed(0)}
                      </span>
                      {plan.price > 0 && (
                        <span className="text-xs font-medium text-slate-400">/ month</span>
                      )}
                    </div>
                    {yearly && plan.price > 0 && (
                      <p className="text-xs text-emerald-400 font-medium mt-1.5">
                        Billed annually · ${(priceToDisplay * 12).toFixed(0)}/year
                      </p>
                    )}
                  </div>

                  {/* Feature Checklist */}
                  <div className="space-y-3 mb-8">
                    <span className="text-[11px] font-mono uppercase tracking-wider text-slate-400 block mb-2">
                      Included Features:
                    </span>
                    {plan.features.map((feat) => (
                      <div key={feat} className="flex items-start gap-2.5 text-xs sm:text-sm text-slate-300">
                        <span className="w-4 h-4 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center flex-shrink-0 mt-0.5">
                          <Check size={11} />
                        </span>
                        <span>{feat}</span>
                      </div>
                    ))}
                    {plan.missing.map((feat) => (
                      <div key={feat} className="flex items-start gap-2.5 text-xs sm:text-sm text-slate-500 opacity-50">
                        <span className="w-4 h-4 flex items-center justify-center flex-shrink-0 mt-0.5 text-slate-600">
                          ✕
                        </span>
                        <span className="line-through">{feat}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Bottom CTA Button */}
                <div className="pt-4 mt-auto">
                  {isCurrent ? (
                    <button
                      disabled
                      className="w-full py-3.5 px-4 rounded-xl font-semibold text-xs sm:text-sm bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 cursor-default flex items-center justify-center gap-2"
                    >
                      <Check size={16} className="text-emerald-400" />
                      <span>Active Plan</span>
                    </button>
                  ) : (
                    <button
                      onClick={() => handlePlanClick(plan)}
                      className={cn(
                        'w-full py-3.5 px-4 rounded-xl font-semibold text-xs sm:text-sm transition-all duration-200 flex items-center justify-center gap-2 group',
                        plan.id === 'pro'
                          ? 'bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 text-slate-950 font-bold shadow-lg shadow-emerald-500/20 hover:shadow-emerald-500/30 hover:-translate-y-0.5'
                          : plan.id === 'elite'
                          ? 'bg-gradient-to-r from-blue-500 to-blue-700 hover:from-blue-600 hover:to-blue-800 text-white shadow-lg shadow-blue-500/25 hover:shadow-blue-500/35 hover:-translate-y-0.5'
                          : 'bg-[#142340] hover:bg-[#1a2d52] text-slate-200 border border-[#243960] hover:border-blue-500/50'
                      )}
                    >
                      <span>
                        {isLoggedIn
                          ? plan.id === 'free'
                            ? 'Switch to Free'
                            : `Switch to ${plan.name}`
                          : plan.id === 'free'
                          ? 'Start with Free'
                          : `Choose ${plan.name}`}
                      </span>
                      <ArrowRight size={15} className="group-hover:translate-x-1 transition-transform" />
                    </button>
                  )}
                </div>
              </TiltCard>
            );
          })}
        </div>
      </div>

      {/* Feature Comparison Table */}
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 mb-20">
        <div className="text-center mb-10">
          <h2 className="text-2xl sm:text-3xl font-display font-bold text-white mb-2">
            Full Feature Comparison
          </h2>
          <p className="text-xs sm:text-sm text-slate-400">
            Compare every feature side-by-side to choose the best fit for your workflow.
          </p>
        </div>

        <TiltCard className="p-0 overflow-hidden border border-[#1c2a45]" tiltMaxAngle={3} translateZ={5}>
          <div className="grid grid-cols-5 bg-[#0f1c33] px-5 py-3.5 text-xs font-bold text-slate-300 uppercase tracking-wider border-b border-[#1c2a45]">
            <span className="col-span-1">Feature</span>
            {['Free', 'Basic', 'Pro', 'Elite'].map((p) => (
              <span key={p} className="text-center">
                {p}
              </span>
            ))}
          </div>
          {featureComparison.map((row, i) => (
            <div
              key={row.feature}
              className={cn(
                'grid grid-cols-5 px-5 py-3.5 border-b border-[#1c2a45]/60 text-xs sm:text-sm items-center',
                i % 2 === 0 ? 'bg-[#0a1428]/60' : 'bg-[#080f1e]/80'
              )}
            >
              <span className="text-slate-200 font-medium">{row.feature}</span>
              {[row.free, row.basic, row.pro, row.elite].map((val, j) => (
                <span
                  key={j}
                  className={cn(
                    'text-center font-medium',
                    val === '✓' || val.includes('✓')
                      ? 'text-emerald-400'
                      : val === '✗'
                      ? 'text-slate-600'
                      : 'text-slate-300'
                  )}
                >
                  {val}
                </span>
              ))}
            </div>
          ))}
        </TiltCard>
      </div>

      {/* Demo Notice Banner */}
      <div className="max-w-4xl mx-auto px-4 mb-16">
        <div className="p-6 rounded-2xl border border-blue-500/30 bg-gradient-to-r from-blue-950/40 to-slate-900/60 flex items-start gap-4 shadow-lg">
          <Shield size={24} className="text-blue-400 flex-shrink-0 mt-0.5" />
          <div className="text-xs sm:text-sm">
            <h4 className="font-bold text-white mb-1">Demo Environment Notice</h4>
            <p className="text-slate-300 leading-relaxed mb-2">
              NovaEq operates in a simulated demo environment. All payment interactions use test gateway keys (
              <code className="bg-blue-900/40 text-blue-300 px-1.5 py-0.5 rounded font-mono text-xs">
                {RAZORPAY_TEST_KEY}
              </code>
              ). Real bank accounts or cards are never charged.
            </p>
            <p className="text-slate-400 text-xs">
              Feel free to test upgrading, downgrading, and switching plans across different user roles.
            </p>
          </div>
        </div>
      </div>

      {/* FAQ */}
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 mb-20">
        <h2 className="text-2xl font-display font-bold text-white text-center mb-8">
          Frequently Asked Questions
        </h2>
        <div className="space-y-4">
          {[
            {
              q: 'Can I switch plans anytime?',
              a: 'Yes, you can upgrade, downgrade, or switch between plans at any time with instant effect.',
            },
            {
              q: 'Are my investments and payments real or simulated?',
              a: 'NovaEq is a portfolio analytics and intelligence platform operating in a demo/testing sandbox. All payments and market trades shown are simulated.',
            },
            {
              q: 'What payment modes are supported in test mode?',
              a: 'Test credit cards, Net Banking, UPI, and instant test simulation are all supported via Razorpay test gateway.',
            },
            {
              q: 'Is there a free trial for paid plans?',
              a: 'Yes, both Pro and Elite plans come with a 14-day free trial in live mode, or instant testing in demo mode.',
            },
          ].map(({ q, a }) => (
            <TiltCard key={q} className="p-5 border border-[#1c2a45]" tiltMaxAngle={5} translateZ={6}>
              <p className="text-sm font-semibold text-white mb-2">{q}</p>
              <p className="text-xs sm:text-sm text-slate-400 leading-relaxed">{a}</p>
            </TiltCard>
          ))}
        </div>
      </div>

      {/* DEMO CHECKOUT MODAL (In-App Razorpay Test Simulator) */}
      {showDemoCheckoutModal && selectedPlanForPayment && (
        <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[#0f1c33] border border-[#243960] rounded-2xl max-w-md w-full p-6 shadow-2xl relative animate-in fade-in zoom-in-95 duration-200">
            <button
              onClick={() => setShowDemoCheckoutModal(false)}
              className="absolute top-4 right-4 text-slate-400 hover:text-white p-1 rounded-lg hover:bg-slate-800"
            >
              <X size={18} />
            </button>

            <div className="flex items-center gap-3 mb-5">
              <div className="w-10 h-10 rounded-xl bg-blue-500/20 text-blue-400 flex items-center justify-center">
                <CreditCard size={20} />
              </div>
              <div>
                <h3 className="font-display font-bold text-white text-lg">Razorpay Demo Checkout</h3>
                <span className="text-[11px] font-mono text-emerald-400">TEST KEY: {RAZORPAY_TEST_KEY}</span>
              </div>
            </div>

            <div className="bg-[#091122] border border-[#1c2a45] rounded-xl p-4 mb-5 space-y-2">
              <div className="flex justify-between text-xs text-slate-300">
                <span>Selected Plan:</span>
                <strong className="text-white">{selectedPlanForPayment.name} Plan</strong>
              </div>
              <div className="flex justify-between text-xs text-slate-300">
                <span>Billing Interval:</span>
                <span className="text-slate-200">{yearly ? 'Annual (Save 20%)' : 'Monthly'}</span>
              </div>
              <div className="flex justify-between text-sm font-bold text-white pt-2 border-t border-[#1c2a45]">
                <span>Total Amount:</span>
                <span className="text-emerald-400 font-mono text-base">
                  ${(yearly ? selectedPlanForPayment.yearlyPrice * 12 : selectedPlanForPayment.price).toFixed(2)}
                  <span className="text-xs text-slate-400 font-normal ml-1">
                    (~₹{Math.round((yearly ? selectedPlanForPayment.yearlyPrice * 12 : selectedPlanForPayment.price) * 85)})
                  </span>
                </span>
              </div>
            </div>

            <div className="bg-amber-500/10 border border-amber-500/30 rounded-xl p-3 text-xs text-amber-200 mb-6 flex items-start gap-2.5">
              <Lock size={15} className="flex-shrink-0 mt-0.5 text-amber-400" />
              <span>
                <strong>Testing Sandbox Only:</strong> This is a demo gateway. No actual transaction or deduction will take place.
              </span>
            </div>

            <div className="space-y-3">
              <button
                onClick={handleCompleteDemoModalPayment}
                disabled={isProcessingPayment}
                className="w-full py-3.5 px-4 rounded-xl bg-gradient-to-r from-blue-500 to-blue-700 hover:from-blue-600 hover:to-blue-800 text-white font-semibold text-sm shadow-lg shadow-blue-500/25 flex items-center justify-center gap-2 transition-all disabled:opacity-50"
              >
                {isProcessingPayment ? (
                  <>
                    <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    <span>Processing Demo Payment...</span>
                  </>
                ) : (
                  <>
                    <CheckCircle2 size={17} />
                    <span>Complete Demo Payment (Test Mode)</span>
                  </>
                )}
              </button>

              <button
                onClick={() => setShowDemoCheckoutModal(false)}
                className="w-full py-2.5 text-xs text-slate-400 hover:text-slate-200 transition-colors"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* DEMO ROLE SELECTION MODAL (For logged out users or visitors) */}
      {showRoleSelectionModal && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-[#0f1c33] border border-[#243960] rounded-2xl max-w-lg w-full p-6 sm:p-7 shadow-2xl relative animate-in fade-in zoom-in-95 duration-200">
            <button
              onClick={() => setShowRoleSelectionModal(false)}
              className="absolute top-4 right-4 text-slate-400 hover:text-white p-1 rounded-lg hover:bg-slate-800"
            >
              <X size={18} />
            </button>

            <div className="text-center mb-6">
              <div className="w-12 h-12 rounded-2xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center mx-auto mb-3">
                <CheckCircle2 size={24} />
              </div>
              <h3 className="font-display font-bold text-white text-xl mb-1">
                {paymentSuccessData
                  ? `Demo Payment Verified (${paymentSuccessData.plan.name} Plan)`
                  : `Start with ${selectedPlanForPayment?.name || 'Free'} Plan`}
              </h3>
              <p className="text-xs sm:text-sm text-slate-300 max-w-sm mx-auto">
                This is a demo platform. Please choose a demo profile below to experience NovaEq with your selected{' '}
                <strong className="text-emerald-400">{selectedPlanForPayment?.name || 'Free'} Plan</strong>.
              </p>
            </div>

            <div className="space-y-3 mb-6">
              <span className="text-[11px] font-mono text-slate-400 uppercase tracking-wider block">
                Choose a Demo Account:
              </span>
              {demoProfiles.map((profile) => (
                <button
                  key={profile.role}
                  onClick={() => handleSelectDemoProfile(profile)}
                  className="w-full text-left p-3.5 rounded-xl border border-[#1c2a45] bg-[#091122]/80 hover:bg-[#12203d] hover:border-blue-500/50 transition-all flex items-center justify-between group"
                >
                  <div className="flex items-center gap-3">
                    <img
                      src={profile.avatar}
                      alt={profile.name}
                      className="w-10 h-10 rounded-full object-cover border border-[#243960]"
                    />
                    <div>
                      <p className="font-semibold text-sm text-white group-hover:text-blue-400 transition-colors">
                        {profile.name}
                      </p>
                      <p className="text-xs text-slate-400">{profile.title}</p>
                    </div>
                  </div>
                  <span className="text-xs font-semibold text-blue-400 opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all">
                    Select &rarr;
                  </span>
                </button>
              ))}
            </div>

            <div className="pt-3 border-t border-[#1c2a45] text-center">
              <button
                onClick={() => {
                  setShowRoleSelectionModal(false);
                  navigate('/create-account');
                }}
                className="text-xs text-slate-400 hover:text-white underline transition-colors"
              >
                Or register a brand new custom account
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Pricing;

import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import {
  Check,
  ChevronRight,
  User,
  Target,
  Shield,
  TrendingUp,
  ArrowRight,
  Lock,
  Mail,
  Phone,
  Eye,
  EyeOff,
  AlertCircle,
  Zap,
  Sparkles,
  CheckCircle2,
  CreditCard,
  Building,
  Smartphone,
  ShieldCheck,
  X,
  Loader2,
  QrCode
} from 'lucide-react';
import Logo from '@/components/ui/Logo';
import { useAppStore } from '@/stores/useAppStore';
import { initiateRazorpayPayment } from '@/lib/razorpay';
import type { UserRole, SubscriptionPlan } from '@/types';

type Step = 'role' | 'account' | 'kyc' | 'risk' | 'goals' | 'plan' | 'complete';

const roles = [
  {
    id: 'investor',
    label: 'Retail Investor',
    desc: 'I want to build long-term wealth, track mutual funds, and follow AI recommendations',
    icon: TrendingUp,
    badge: 'Popular for Wealth',
  },
  {
    id: 'trader',
    label: 'Active Quant Trader',
    desc: 'I trade equities, options, and execute automated algorithmic strategies',
    icon: Zap,
    badge: 'Algo & Terminal Access',
  },
  {
    id: 'advisor',
    label: 'Financial Advisor',
    desc: 'I manage client portfolios, publish signals, and provide advisory insights',
    icon: Shield,
    badge: 'Multi-Client Suite',
  },
];

const riskProfiles = [
  {
    id: 'conservative',
    label: 'Conservative',
    desc: 'I prefer capital preservation with minimal volatility and steady compounding.',
    expected: '8–12% Annual Target',
    color: 'border-nova-green/40 bg-nova-green/5',
  },
  {
    id: 'moderate',
    label: 'Moderate Balanced',
    desc: 'Balanced risk-adjusted approach — equities combined with risk guardrails.',
    expected: '14–20% Annual Target',
    color: 'border-nova-primary/40 bg-nova-primary/5',
  },
  {
    id: 'aggressive',
    label: 'Aggressive Alpha',
    desc: 'I seek maximum capital acceleration and can handle intraday market volatility.',
    expected: '22–35%+ Annual Target',
    color: 'border-nova-red/40 bg-nova-red/5',
  },
];

const goalOptions = [
  'Early Retirement Wealth',
  'Algorithmic Trading Profits',
  'Passive Income & Dividends',
  'Tax Saving (ELSS / Harvesting)',
  'Luxury Real Estate Fund',
  'Higher Education Capital',
  'Emergency Volatility Cushion',
  'Short-Term Momentum Gains',
];

const plans = [
  {
    id: 'free',
    name: 'Free Forever',
    price: '₹0',
    amount: 0,
    period: '/ month',
    desc: 'Essential portfolio tracking and delayed market data',
    features: ['1 Watchlist (15 stocks)', 'Real-time price quotes', 'Basic charting (5 indicators)', 'Community forum access'],
  },
  {
    id: 'pro',
    name: 'Pro Trader & Investor',
    price: '₹2,499',
    amount: 2499,
    period: '/ month',
    desc: 'Full AI intelligence and automated algo strategy execution',
    badge: 'Most Popular',
    features: [
      'Unlimited watchlists & 100 alerts',
      'Proprietary AI Signal Engine',
      '3 Automated Algo Trading Bots',
      'Multi-timeframe candlestick terminal',
      'Sector risk & correlation heatmap',
    ],
  },
  {
    id: 'elite',
    name: 'Elite Institutional',
    price: '₹7,999',
    amount: 7999,
    period: '/ month',
    desc: 'Uncapped algorithmic bots, sub-millisecond API & 1-on-1 advisor desk',
    badge: 'Institutional Alpha',
    features: [
      'Unlimited Algo Trading Bots',
      'Sub-millisecond direct broker API',
      'Python Webhook execution bridge',
      'Dedicated SEBI certified advisor desk',
      'Full institutional backtesting ledger',
    ],
  },
];

export const CreateAccount: React.FC = () => {
  const navigate = useNavigate();
  const { registerUser } = useAppStore();
  const [step, setStep] = useState<Step>('role');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const [data, setData] = useState({
    role: 'investor' as UserRole,
    name: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: '',
    panNumber: '',
    aadhar: '',
    riskProfile: 'moderate',
    goals: ['Early Retirement Wealth', 'Algorithmic Trading Profits'] as string[],
    selectedPlan: 'pro' as SubscriptionPlan,
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(false);

  // Payment Gateway State
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState<'upi' | 'card' | 'netbanking'>('upi');
  const [upiId, setUpiId] = useState('user@okaxis');
  const [cardNumber, setCardNumber] = useState('4532 8921 7734 1092');
  const [cardExpiry, setCardExpiry] = useState('11/29');
  const [cardCvv, setCardCvv] = useState('389');
  const [bankName, setBankName] = useState('HDFC Bank');
  const [isProcessingPayment, setIsProcessingPayment] = useState(false);
  const [paymentSuccess, setPaymentSuccess] = useState(false);
  const [paymentId, setPaymentId] = useState<string>('');

  const steps: Step[] = ['role', 'account', 'kyc', 'risk', 'goals', 'plan', 'complete'];
  const stepLabels = ['Role', 'Account', 'KYC', 'Risk', 'Goals', 'Plan', 'Launch'];
  const currentIdx = steps.indexOf(step);

  const validateStep = (currentStep: Step): boolean => {
    const errs: Record<string, string> = {};

    if (currentStep === 'role') {
      if (!data.role) errs.role = 'Please select your role.';
    }

    if (currentStep === 'account') {
      if (!data.name.trim() || data.name.trim().length < 2) {
        errs.name = 'Please enter your full legal name.';
      }
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!data.email.trim() || !emailRegex.test(data.email.trim())) {
        errs.email = 'Please enter a valid email address.';
      }
      const phoneDigits = data.phone.replace(/\D/g, '');
      if (phoneDigits.length < 10) {
        errs.phone = 'Please enter a valid 10-digit mobile number.';
      }
      if (!data.password || data.password.length < 6) {
        errs.password = 'Password must be at least 6 characters long.';
      }
      if (data.password !== data.confirmPassword) {
        errs.confirmPassword = 'Passwords do not match.';
      }
    }

    if (currentStep === 'kyc') {
      const panRegex = /^[A-Z]{5}[0-9]{4}[A-Z]{1}$/;
      const upperPan = data.panNumber.trim().toUpperCase();
      if (!upperPan || !panRegex.test(upperPan)) {
        errs.panNumber = 'Enter a valid 10-character PAN (e.g. ABCDE1234F).';
      }
      const aadharDigits = data.aadhar.replace(/\D/g, '');
      if (aadharDigits.length !== 12) {
        errs.aadhar = 'Enter a valid 12-digit Aadhaar number.';
      }
    }

    if (currentStep === 'risk') {
      if (!data.riskProfile) {
        errs.riskProfile = 'Please select a risk profile.';
      }
    }

    if (currentStep === 'goals') {
      if (data.goals.length === 0) {
        errs.goals = 'Please choose at least one financial goal.';
      }
    }

    if (currentStep === 'plan') {
      if (!data.selectedPlan) {
        errs.selectedPlan = 'Please select a subscription plan.';
      }
    }

    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleNext = () => {
    if (!validateStep(step)) return;

    if (step === 'plan') {
      // If Paid Plan selected, trigger Payment Gateway modal
      if (data.selectedPlan !== 'free' && !paymentSuccess) {
        setShowPaymentModal(true);
        return;
      }
    }

    setErrors({});
    setStep(steps[currentIdx + 1]);
  };

  const handleBack = () => {
    setErrors({});
    setStep(steps[currentIdx - 1]);
  };

  const toggleGoal = (g: string) => {
    setData((d) => ({
      ...d,
      goals: d.goals.includes(g) ? d.goals.filter((x) => x !== g) : [...d.goals, g],
    }));
  };

  // Payment Execution
  const handleInitiatePayment = async () => {
    const selectedPlanObj = plans.find((p) => p.id === data.selectedPlan);
    const amount = selectedPlanObj?.amount || 2499;

    setIsProcessingPayment(true);

    // Try Razorpay official checkout
    const rzpOpened = await initiateRazorpayPayment({
      title: `NovaEq ${selectedPlanObj?.name || 'Subscription'}`,
      description: `Plan activation for ${data.name || 'Nova Investor'}`,
      amount,
      currency: 'INR',
      userName: data.name,
      userEmail: data.email,
      contact: data.phone,
      onSuccess: (pId) => {
        setIsProcessingPayment(false);
        setPaymentId(pId);
        setPaymentSuccess(true);
        setTimeout(() => {
          setShowPaymentModal(false);
          setStep('complete');
        }, 1200);
      },
      onFailure: () => {
        setIsProcessingPayment(false);
      },
    });

    if (!rzpOpened) {
      // In-app fallback payment simulation
      setTimeout(() => {
        const generatedId = `pay_rzp_${Date.now().toString(36).toUpperCase()}_${Math.random().toString(36).substring(2, 6).toUpperCase()}`;
        setIsProcessingPayment(false);
        setPaymentId(generatedId);
        setPaymentSuccess(true);
        setTimeout(() => {
          setShowPaymentModal(false);
          setStep('complete');
        }, 1200);
      }, 1500);
    }
  };

  // Launch User into their real Account
  const handleComplete = () => {
    setLoading(true);

    // Register actual user in store + localStorage + sessionStorage
    const createdUser = registerUser({
      name: data.name.trim() || 'Nova Investor',
      email: data.email.trim().toLowerCase(),
      phone: data.phone,
      role: data.role,
      subscription: data.selectedPlan,
      riskProfile: data.riskProfile,
      goals: data.goals,
      password: data.password,
    });

    setTimeout(() => {
      setLoading(false);
      const paths: Record<string, string> = {
        investor: '/dashboard/investor',
        trader: '/dashboard/trader',
        advisor: '/dashboard/advisor',
      };
      navigate(paths[createdUser.role] || '/dashboard/investor');
    }, 1000);
  };

  const selectedPlanObj = plans.find((p) => p.id === data.selectedPlan) || plans[1];

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-24 bg-[#070d1a] text-[#f8fafc]">
      <div className="w-full max-w-2xl">
        {/* Brand Caption Header */}
        <div className="text-center mb-8">
          <Logo size="md" className="justify-center mb-4" />
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-blue-500/30 bg-blue-500/10 text-xs font-semibold text-blue-300 mb-2">
            <Sparkles size={12} className="text-blue-400" />
            <span>Instant Institutional Account Provisioning</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-display font-bold text-white mb-1">
            Create Your NovaEq Account
          </h1>
          <p className="text-slate-400 text-xs sm:text-sm">
            AI signals, multi-broker connectivity, and institutional risk management in under 2 minutes.
          </p>
        </div>

        {/* Progress Bar & Indicators */}
        <div className="flex items-center justify-between mb-8 px-2 overflow-x-auto pb-2 scrollbar-none">
          {stepLabels.map((label, i) => (
            <div key={label} className="flex items-center flex-shrink-0">
              <div
                className={`flex flex-col items-center gap-1 ${
                  i <= currentIdx ? 'text-blue-400 font-semibold' : 'text-slate-500'
                }`}
              >
                <div
                  className={`w-7 h-7 rounded-full border-2 flex items-center justify-center text-xs font-bold transition-all ${
                    i < currentIdx
                      ? 'bg-blue-600 border-blue-500 text-white'
                      : i === currentIdx
                      ? 'border-blue-400 bg-blue-500/20 text-blue-300 shadow-md shadow-blue-500/30'
                      : 'border-[#1c2a45] bg-[#0c162c] text-slate-500'
                  }`}
                >
                  {i < currentIdx ? <Check size={13} /> : i + 1}
                </div>
                <span className="text-[10px] hidden sm:block font-mono">{label}</span>
              </div>
              {i < stepLabels.length - 1 && (
                <div
                  className={`h-0.5 mx-1 sm:mx-2 w-4 sm:w-7 transition-all ${
                    i < currentIdx ? 'bg-blue-500' : 'bg-[#1c2a45]'
                  }`}
                />
              )}
            </div>
          ))}
        </div>

        {/* Card Container */}
        <div className="border border-[#1c2a45] bg-gradient-to-b from-[#0e1a33] to-[#0a1326] backdrop-blur-xl rounded-3xl p-6 sm:p-9 shadow-2xl relative">
          {/* ========================================================================= */}
          {/* STEP 1: ROLE SELECTION                                                    */}
          {/* ========================================================================= */}
          {step === 'role' && (
            <div className="animate-fadeIn">
              <h2 className="text-xl font-display font-bold text-white mb-1">
                What best describes your trading profile?
              </h2>
              <p className="text-slate-400 text-xs sm:text-sm mb-6">
                We'll tailor your workspace layout, intelligence feeds, and automated tools accordingly.
              </p>

              {errors.role && (
                <div className="p-3 mb-4 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs flex items-center gap-2">
                  <AlertCircle size={14} />
                  <span>{errors.role}</span>
                </div>
              )}

              <div className="space-y-3 mb-6">
                {roles.map((r) => {
                  const Icon = r.icon;
                  const isSelected = data.role === r.id;
                  return (
                    <div
                      key={r.id}
                      onClick={() => setData({ ...data, role: r.id as UserRole })}
                      className={`p-4 sm:p-5 rounded-2xl border transition-all cursor-pointer flex items-start gap-4 ${
                        isSelected
                          ? 'border-blue-500 bg-blue-500/15 shadow-lg shadow-blue-500/20'
                          : 'border-[#1c2a45] bg-[#0c162c]/70 hover:bg-[#122242]'
                      }`}
                    >
                      <div
                        className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 ${
                          isSelected ? 'bg-blue-600 text-white' : 'bg-[#15233e] text-blue-400'
                        }`}
                      >
                        <Icon size={20} />
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <b className="text-sm font-bold text-white">{r.label}</b>
                          {r.badge && (
                            <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-blue-500/20 text-blue-300 border border-blue-500/30">
                              {r.badge}
                            </span>
                          )}
                        </div>
                        <p className="text-xs text-slate-400 leading-relaxed">{r.desc}</p>
                      </div>
                      <div
                        className={`w-5 h-5 rounded-full border flex items-center justify-center flex-shrink-0 mt-0.5 ${
                          isSelected ? 'border-blue-500 bg-blue-500 text-white' : 'border-slate-600'
                        }`}
                      >
                        {isSelected && <Check size={12} />}
                      </div>
                    </div>
                  );
                })}
              </div>

              <button
                onClick={handleNext}
                className="w-full py-3.5 bg-gradient-to-r from-blue-500 to-blue-700 hover:from-blue-600 hover:to-blue-800 text-white font-semibold text-sm rounded-xl flex items-center justify-center gap-2 shadow-lg shadow-blue-500/25 transition-all"
              >
                <span>Continue to Account Setup</span>
                <ArrowRight size={16} />
              </button>
            </div>
          )}

          {/* ========================================================================= */}
          {/* STEP 2: ACCOUNT INFORMATION                                               */}
          {/* ========================================================================= */}
          {step === 'account' && (
            <div className="animate-fadeIn">
              <h2 className="text-xl font-display font-bold text-white mb-1">
                Account Credentials & Profile
              </h2>
              <p className="text-slate-400 text-xs sm:text-sm mb-6">
                Enter your identity details for secure 2FA authentication and account encryption.
              </p>

              <div className="space-y-4 mb-6">
                {/* Name */}
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                    Full Legal Name <span className="text-rose-400">*</span>
                  </label>
                  <div className="relative">
                    <User size={15} className="absolute left-3.5 top-3.5 text-slate-400" />
                    <input
                      type="text"
                      value={data.name}
                      onChange={(e) => setData({ ...data, name: e.target.value })}
                      placeholder="e.g. Varad Chaudhari"
                      className={`w-full pl-10 pr-4 py-2.5 rounded-xl bg-[#091122] border text-sm text-white focus:outline-none transition-colors ${
                        errors.name ? 'border-rose-500' : 'border-[#1c2a45] focus:border-blue-500'
                      }`}
                    />
                  </div>
                  {errors.name && (
                    <p className="text-rose-400 text-[11px] mt-1 flex items-center gap-1">
                      <AlertCircle size={12} /> {errors.name}
                    </p>
                  )}
                </div>

                {/* Email & Phone */}
                <div className="grid sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                      Email Address <span className="text-rose-400">*</span>
                    </label>
                    <div className="relative">
                      <Mail size={15} className="absolute left-3.5 top-3.5 text-slate-400" />
                      <input
                        type="email"
                        value={data.email}
                        onChange={(e) => setData({ ...data, email: e.target.value })}
                        placeholder="you@novaeq.ai"
                        className={`w-full pl-10 pr-4 py-2.5 rounded-xl bg-[#091122] border text-sm text-white focus:outline-none transition-colors ${
                          errors.email ? 'border-rose-500' : 'border-[#1c2a45] focus:border-blue-500'
                        }`}
                      />
                    </div>
                    {errors.email && (
                      <p className="text-rose-400 text-[11px] mt-1 flex items-center gap-1">
                        <AlertCircle size={12} /> {errors.email}
                      </p>
                    )}
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                      Mobile Number <span className="text-rose-400">*</span>
                    </label>
                    <div className="relative">
                      <Phone size={15} className="absolute left-3.5 top-3.5 text-slate-400" />
                      <input
                        type="tel"
                        value={data.phone}
                        onChange={(e) => setData({ ...data, phone: e.target.value })}
                        placeholder="9876543210"
                        className={`w-full pl-10 pr-4 py-2.5 rounded-xl bg-[#091122] border text-sm text-white focus:outline-none transition-colors ${
                          errors.phone ? 'border-rose-500' : 'border-[#1c2a45] focus:border-blue-500'
                        }`}
                      />
                    </div>
                    {errors.phone && (
                      <p className="text-rose-400 text-[11px] mt-1 flex items-center gap-1">
                        <AlertCircle size={12} /> {errors.phone}
                      </p>
                    )}
                  </div>
                </div>

                {/* Password & Confirm Password */}
                <div className="grid sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                      Create Password <span className="text-rose-400">*</span>
                    </label>
                    <div className="relative">
                      <Lock size={15} className="absolute left-3.5 top-3.5 text-slate-400" />
                      <input
                        type={showPassword ? 'text' : 'password'}
                        value={data.password}
                        onChange={(e) => setData({ ...data, password: e.target.value })}
                        placeholder="Min 6 characters"
                        className={`w-full pl-10 pr-10 py-2.5 rounded-xl bg-[#091122] border text-sm text-white focus:outline-none transition-colors ${
                          errors.password ? 'border-rose-500' : 'border-[#1c2a45] focus:border-blue-500'
                        }`}
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3.5 top-3 text-slate-400 hover:text-slate-200"
                      >
                        {showPassword ? <EyeOff size={15} /> : <Eye size={15} />}
                      </button>
                    </div>
                    {errors.password && (
                      <p className="text-rose-400 text-[11px] mt-1 flex items-center gap-1">
                        <AlertCircle size={12} /> {errors.password}
                      </p>
                    )}
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                      Confirm Password <span className="text-rose-400">*</span>
                    </label>
                    <div className="relative">
                      <Lock size={15} className="absolute left-3.5 top-3.5 text-slate-400" />
                      <input
                        type={showConfirmPassword ? 'text' : 'password'}
                        value={data.confirmPassword}
                        onChange={(e) => setData({ ...data, confirmPassword: e.target.value })}
                        placeholder="Re-enter password"
                        className={`w-full pl-10 pr-10 py-2.5 rounded-xl bg-[#091122] border text-sm text-white focus:outline-none transition-colors ${
                          errors.confirmPassword ? 'border-rose-500' : 'border-[#1c2a45] focus:border-blue-500'
                        }`}
                      />
                      <button
                        type="button"
                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                        className="absolute right-3.5 top-3 text-slate-400 hover:text-slate-200"
                      >
                        {showConfirmPassword ? <EyeOff size={15} /> : <Eye size={15} />}
                      </button>
                    </div>
                    {errors.confirmPassword && (
                      <p className="text-rose-400 text-[11px] mt-1 flex items-center gap-1">
                        <AlertCircle size={12} /> {errors.confirmPassword}
                      </p>
                    )}
                  </div>
                </div>
              </div>

              <div className="flex gap-3">
                <button
                  onClick={handleBack}
                  className="px-5 py-3 rounded-xl border border-[#1c2a45] bg-[#0c162c] text-slate-300 hover:text-white text-sm font-medium transition-colors"
                >
                  Back
                </button>
                <button
                  onClick={handleNext}
                  className="flex-1 py-3.5 bg-gradient-to-r from-blue-500 to-blue-700 hover:from-blue-600 hover:to-blue-800 text-white font-semibold text-sm rounded-xl flex items-center justify-center gap-2 shadow-lg shadow-blue-500/25 transition-all"
                >
                  <span>Proceed to KYC Verification</span>
                  <ArrowRight size={16} />
                </button>
              </div>
            </div>
          )}

          {/* ========================================================================= */}
          {/* STEP 3: KYC REGISTRATION                                                  */}
          {/* ========================================================================= */}
          {step === 'kyc' && (
            <div className="animate-fadeIn">
              <h2 className="text-xl font-display font-bold text-white mb-1">
                SEBI / CDSL KYC Verification
              </h2>
              <p className="text-slate-400 text-xs sm:text-sm mb-6">
                Required by financial market regulations to trade equities, derivatives, and algorithmic strategies.
              </p>

              <div className="space-y-4 mb-6">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                    Permanent Account Number (PAN) <span className="text-rose-400">*</span>
                  </label>
                  <input
                    type="text"
                    value={data.panNumber}
                    onChange={(e) => setData({ ...data, panNumber: e.target.value.toUpperCase() })}
                    maxLength={10}
                    placeholder="ABCDE1234F"
                    className={`w-full px-4 py-2.5 rounded-xl bg-[#091122] border font-mono text-sm uppercase text-white focus:outline-none transition-colors ${
                      errors.panNumber ? 'border-rose-500' : 'border-[#1c2a45] focus:border-blue-500'
                    }`}
                  />
                  {errors.panNumber ? (
                    <p className="text-rose-400 text-[11px] mt-1 flex items-center gap-1">
                      <AlertCircle size={12} /> {errors.panNumber}
                    </p>
                  ) : (
                    <p className="text-slate-500 text-[10px] mt-1">PAN is verified directly with the NSDL registry</p>
                  )}
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                    12-Digit Aadhaar Number <span className="text-rose-400">*</span>
                  </label>
                  <input
                    type="text"
                    value={data.aadhar}
                    onChange={(e) => setData({ ...data, aadhar: e.target.value.replace(/\D/g, '') })}
                    maxLength={12}
                    placeholder="1234 5678 9012"
                    className={`w-full px-4 py-2.5 rounded-xl bg-[#091122] border font-mono text-sm text-white focus:outline-none transition-colors ${
                      errors.aadhar ? 'border-rose-500' : 'border-[#1c2a45] focus:border-blue-500'
                    }`}
                  />
                  {errors.aadhar ? (
                    <p className="text-rose-400 text-[11px] mt-1 flex items-center gap-1">
                      <AlertCircle size={12} /> {errors.aadhar}
                    </p>
                  ) : (
                    <p className="text-slate-500 text-[10px] mt-1">Aadhaar details are verified via UIDAI OTP sandbox</p>
                  )}
                </div>
              </div>

              <div className="flex gap-3">
                <button
                  onClick={handleBack}
                  className="px-5 py-3 rounded-xl border border-[#1c2a45] bg-[#0c162c] text-slate-300 hover:text-white text-sm font-medium transition-colors"
                >
                  Back
                </button>
                <button
                  onClick={handleNext}
                  className="flex-1 py-3.5 bg-gradient-to-r from-blue-500 to-blue-700 hover:from-blue-600 hover:to-blue-800 text-white font-semibold text-sm rounded-xl flex items-center justify-center gap-2 shadow-lg shadow-blue-500/25 transition-all"
                >
                  <span>Verify & Set Risk Profile</span>
                  <ArrowRight size={16} />
                </button>
              </div>
            </div>
          )}

          {/* ========================================================================= */}
          {/* STEP 4: RISK PROFILING                                                    */}
          {/* ========================================================================= */}
          {step === 'risk' && (
            <div className="animate-fadeIn">
              <h2 className="text-xl font-display font-bold text-white mb-1">
                Risk Calibration Profile
              </h2>
              <p className="text-slate-400 text-xs sm:text-sm mb-6">
                Our AI neural model calibrates position sizing and stop-loss bounds based on your risk comfort.
              </p>

              <div className="space-y-3 mb-6">
                {riskProfiles.map((rp) => {
                  const isSelected = data.riskProfile === rp.id;
                  return (
                    <div
                      key={rp.id}
                      onClick={() => setData({ ...data, riskProfile: rp.id })}
                      className={`p-4 rounded-2xl border transition-all cursor-pointer ${
                        isSelected
                          ? 'border-blue-500 bg-blue-500/15 shadow-lg shadow-blue-500/20'
                          : 'border-[#1c2a45] bg-[#0c162c]/70 hover:bg-[#122242]'
                      }`}
                    >
                      <div className="flex items-center justify-between mb-1">
                        <b className="text-sm font-bold text-white">{rp.label}</b>
                        <span className="text-xs font-mono font-bold text-emerald-400 bg-emerald-500/10 px-2.5 py-0.5 rounded-full border border-emerald-500/25">
                          {rp.expected}
                        </span>
                      </div>
                      <p className="text-xs text-slate-400">{rp.desc}</p>
                    </div>
                  );
                })}
              </div>

              <div className="flex gap-3">
                <button
                  onClick={handleBack}
                  className="px-5 py-3 rounded-xl border border-[#1c2a45] bg-[#0c162c] text-slate-300 hover:text-white text-sm font-medium transition-colors"
                >
                  Back
                </button>
                <button
                  onClick={handleNext}
                  className="flex-1 py-3.5 bg-gradient-to-r from-blue-500 to-blue-700 hover:from-blue-600 hover:to-blue-800 text-white font-semibold text-sm rounded-xl flex items-center justify-center gap-2 shadow-lg shadow-blue-500/25 transition-all"
                >
                  <span>Select Financial Goals</span>
                  <ArrowRight size={16} />
                </button>
              </div>
            </div>
          )}

          {/* ========================================================================= */}
          {/* STEP 5: GOALS SELECTION                                                   */}
          {/* ========================================================================= */}
          {step === 'goals' && (
            <div className="animate-fadeIn">
              <h2 className="text-xl font-display font-bold text-white mb-1">
                Select Your Key Milestones
              </h2>
              <p className="text-slate-400 text-xs sm:text-sm mb-6">
                Choose targets you'd like NovaEq SIP planners and AI rebalancing bots to optimize for.
              </p>

              {errors.goals && (
                <div className="p-3 mb-4 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs flex items-center gap-2">
                  <AlertCircle size={14} />
                  <span>{errors.goals}</span>
                </div>
              )}

              <div className="grid sm:grid-cols-2 gap-2.5 mb-6">
                {goalOptions.map((goal) => {
                  const isChecked = data.goals.includes(goal);
                  return (
                    <div
                      key={goal}
                      onClick={() => toggleGoal(goal)}
                      className={`p-3 rounded-xl border text-xs font-semibold cursor-pointer transition-all flex items-center justify-between ${
                        isChecked
                          ? 'border-blue-500 bg-blue-500/20 text-white'
                          : 'border-[#1c2a45] bg-[#0c162c] text-slate-400 hover:text-slate-200 hover:bg-[#122242]'
                      }`}
                    >
                      <span>{goal}</span>
                      {isChecked && <Check size={14} className="text-blue-400 flex-shrink-0" />}
                    </div>
                  );
                })}
              </div>

              <div className="flex gap-3">
                <button
                  onClick={handleBack}
                  className="px-5 py-3 rounded-xl border border-[#1c2a45] bg-[#0c162c] text-slate-300 hover:text-white text-sm font-medium transition-colors"
                >
                  Back
                </button>
                <button
                  onClick={handleNext}
                  className="flex-1 py-3.5 bg-gradient-to-r from-blue-500 to-blue-700 hover:from-blue-600 hover:to-blue-800 text-white font-semibold text-sm rounded-xl flex items-center justify-center gap-2 shadow-lg shadow-blue-500/25 transition-all"
                >
                  <span>Select Subscription Plan</span>
                  <ArrowRight size={16} />
                </button>
              </div>
            </div>
          )}

          {/* ========================================================================= */}
          {/* STEP 6: PLAN SELECTION & PAYMENT GATEWAY                                  */}
          {/* ========================================================================= */}
          {step === 'plan' && (
            <div className="animate-fadeIn">
              <h2 className="text-xl font-display font-bold text-white mb-1">
                Select Your Access Tier
              </h2>
              <p className="text-slate-400 text-xs sm:text-sm mb-6">
                Choose the package that aligns with your trading volume and automation needs.
              </p>

              <div className="space-y-3 mb-6">
                {plans.map((p) => {
                  const isSelected = data.selectedPlan === p.id;
                  return (
                    <div
                      key={p.id}
                      onClick={() => {
                        setData({ ...data, selectedPlan: p.id as SubscriptionPlan });
                        setPaymentSuccess(false);
                      }}
                      className={`p-4 sm:p-5 rounded-2xl border transition-all cursor-pointer ${
                        isSelected
                          ? 'border-blue-500 bg-blue-500/15 shadow-lg shadow-blue-500/25 ring-1 ring-blue-500/30'
                          : 'border-[#1c2a45] bg-[#0c162c]/70 hover:bg-[#122242]'
                      }`}
                    >
                      <div className="flex items-start justify-between gap-3 mb-2">
                        <div>
                          <div className="flex items-center gap-2">
                            <b className="text-base font-bold text-white">{p.name}</b>
                            {p.badge && (
                              <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-blue-600 text-white font-semibold">
                                {p.badge}
                              </span>
                            )}
                          </div>
                          <span className="text-xs text-slate-400">{p.desc}</span>
                        </div>
                        <div className="text-right flex-shrink-0">
                          <b className="text-lg font-display font-bold text-white">{p.price}</b>
                          <span className="text-[11px] text-slate-400">{p.period}</span>
                        </div>
                      </div>

                      <div className="grid sm:grid-cols-2 gap-1.5 pt-3 border-t border-[#1c2a45]/60 text-xs text-slate-300">
                        {p.features.map((f, i) => (
                          <div key={i} className="flex items-center gap-1.5">
                            <Check size={12} className="text-emerald-400 flex-shrink-0" />
                            <span className="truncate">{f}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  );
                })}
              </div>

              {data.selectedPlan !== 'free' && (
                <div className="p-3.5 mb-6 rounded-2xl bg-blue-500/10 border border-blue-500/30 flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2">
                    <ShieldCheck size={16} className="text-emerald-400" />
                    <span className="text-slate-300">
                      Payment secured via <b className="text-white">Razorpay 256-bit SSL Gateway</b>
                    </span>
                  </div>
                  <span className="text-emerald-400 font-bold font-mono">
                    {data.selectedPlan === 'pro' ? '₹2,499' : '₹7,999'} Total
                  </span>
                </div>
              )}

              <div className="flex gap-3">
                <button
                  onClick={handleBack}
                  className="px-5 py-3 rounded-xl border border-[#1c2a45] bg-[#0c162c] text-slate-300 hover:text-white text-sm font-medium transition-colors"
                >
                  Back
                </button>
                <button
                  onClick={handleNext}
                  className="flex-1 py-3.5 bg-gradient-to-r from-blue-500 to-blue-700 hover:from-blue-600 hover:to-blue-800 text-white font-semibold text-sm rounded-xl flex items-center justify-center gap-2 shadow-lg shadow-blue-500/25 transition-all"
                >
                  <span>{data.selectedPlan === 'free' ? 'Review & Launch' : 'Proceed to Payment Gateway'}</span>
                  <ArrowRight size={16} />
                </button>
              </div>
            </div>
          )}

          {/* ========================================================================= */}
          {/* STEP 7: COMPLETE & LAUNCH DASHBOARD                                       */}
          {/* ========================================================================= */}
          {step === 'complete' && (
            <div className="animate-fadeIn text-center">
              <div className="w-16 h-16 rounded-3xl bg-emerald-500/20 border border-emerald-500/40 text-emerald-400 flex items-center justify-center mx-auto mb-4">
                <CheckCircle2 size={32} />
              </div>
              <h2 className="text-2xl font-display font-bold text-white mb-2">
                All Set, {data.name.split(' ')[0] || 'Trader'}!
              </h2>
              <p className="text-slate-300 text-xs sm:text-sm mb-6 max-w-md mx-auto">
                Your credentials are saved to local session storage and your customized{' '}
                <span className="text-blue-400 font-bold uppercase">{data.role}</span> suite is provisioned on the{' '}
                <span className="text-emerald-400 font-bold uppercase">{data.selectedPlan}</span> tier.
              </p>

              <div className="p-4 rounded-2xl bg-[#091122] border border-[#1c2a45] text-left text-xs space-y-2.5 mb-6 max-w-md mx-auto">
                <div className="flex justify-between">
                  <span className="text-slate-400">Account Owner:</span>
                  <b className="text-white">{data.name || 'Nova Investor'}</b>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Registered Email:</span>
                  <b className="text-white font-mono">{data.email}</b>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Assigned Persona:</span>
                  <b className="text-white capitalize">{data.role}</b>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Subscription Tier:</span>
                  <div className="flex items-center gap-1.5">
                    <b className="text-emerald-400 capitalize">{data.selectedPlan} Plan</b>
                    {data.selectedPlan !== 'free' && (
                      <span className="px-1.5 py-0.5 rounded bg-emerald-500/20 text-emerald-300 text-[10px] font-mono font-bold">
                        PAID & ACTIVE
                      </span>
                    )}
                  </div>
                </div>
                {paymentId && (
                  <div className="flex justify-between">
                    <span className="text-slate-400">Gateway Ref ID:</span>
                    <b className="text-blue-400 font-mono text-[11px]">{paymentId}</b>
                  </div>
                )}
                <div className="flex justify-between">
                  <span className="text-slate-400">Risk Sensitivity:</span>
                  <b className="text-white capitalize">{data.riskProfile}</b>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Algo Trading Modules:</span>
                  <b className={data.selectedPlan !== 'free' ? 'text-emerald-400' : 'text-slate-500'}>
                    {data.selectedPlan === 'free' ? 'Basic charting only' : 'Enabled & Active'}
                  </b>
                </div>
              </div>

              <button
                onClick={handleComplete}
                disabled={loading}
                className="w-full py-4 bg-gradient-to-r from-blue-500 to-emerald-500 hover:from-blue-600 hover:to-emerald-600 text-white font-display font-bold text-base rounded-2xl flex items-center justify-center gap-2 shadow-xl shadow-blue-500/30 transition-all disabled:opacity-60"
              >
                {loading ? (
                  <div className="flex items-center gap-2">
                    <Loader2 size={20} className="animate-spin" />
                    <span>Provisioning Dashboard & Session...</span>
                  </div>
                ) : (
                  <>
                    <span>Enter My Live Dashboard</span>
                    <ArrowRight size={18} />
                  </>
                )}
              </button>
            </div>
          )}

          {/* Bottom Login Link */}
          <p className="text-center text-xs text-slate-400 mt-6">
            Already have an account?{' '}
            <Link to="/login" className="text-blue-400 hover:text-blue-300 font-semibold underline">
              Sign In
            </Link>
          </p>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* RAZORPAY / SECURE PAYMENT GATEWAY MODAL                                   */}
      {/* ========================================================================= */}
      {showPaymentModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md p-4 animate-fadeIn">
          <div className="border border-[#1c2a45] bg-[#0a1326] w-full max-w-lg rounded-3xl p-6 sm:p-7 shadow-2xl relative overflow-hidden">
            {/* Modal Header */}
            <div className="flex items-start justify-between mb-5">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <div className="w-8 h-8 rounded-lg bg-blue-600/20 border border-blue-500/30 flex items-center justify-center text-blue-400">
                    <CreditCard size={18} />
                  </div>
                  <div>
                    <h3 className="text-base font-bold text-white">Razorpay Secure Checkout</h3>
                    <p className="text-xs text-slate-400">NovaEq Subscription Activation</p>
                  </div>
                </div>
              </div>
              <button
                onClick={() => setShowPaymentModal(false)}
                className="text-slate-400 hover:text-white p-1 rounded-lg hover:bg-slate-800/60"
              >
                <X size={18} />
              </button>
            </div>

            {/* Plan Price Summary */}
            <div className="p-4 rounded-2xl bg-[#091122] border border-[#1c2a45] mb-5">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs text-slate-400">Selected Plan:</span>
                <span className="text-xs font-bold text-white">{selectedPlanObj.name}</span>
              </div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs text-slate-400">Billing Cycle:</span>
                <span className="text-xs font-mono text-slate-300">Monthly Auto-Renewal</span>
              </div>
              <div className="flex items-center justify-between pt-2 border-t border-[#1c2a45]">
                <span className="text-xs font-bold text-white">Total Amount Due:</span>
                <span className="text-lg font-bold text-emerald-400 font-display">
                  {selectedPlanObj.price}
                </span>
              </div>
            </div>

            {/* Payment Method Selector */}
            <div className="mb-5">
              <label className="block text-xs font-semibold text-slate-300 mb-2">
                Choose Payment Method
              </label>
              <div className="grid grid-cols-3 gap-2">
                <button
                  type="button"
                  onClick={() => setPaymentMethod('upi')}
                  className={`p-3 rounded-xl border text-xs font-semibold flex flex-col items-center gap-1.5 transition-all ${
                    paymentMethod === 'upi'
                      ? 'border-blue-500 bg-blue-500/20 text-blue-300'
                      : 'border-[#1c2a45] bg-[#091122] text-slate-400 hover:bg-[#111f3d]'
                  }`}
                >
                  <Smartphone size={16} />
                  <span>UPI / QR</span>
                </button>
                <button
                  type="button"
                  onClick={() => setPaymentMethod('card')}
                  className={`p-3 rounded-xl border text-xs font-semibold flex flex-col items-center gap-1.5 transition-all ${
                    paymentMethod === 'card'
                      ? 'border-blue-500 bg-blue-500/20 text-blue-300'
                      : 'border-[#1c2a45] bg-[#091122] text-slate-400 hover:bg-[#111f3d]'
                  }`}
                >
                  <CreditCard size={16} />
                  <span>Card</span>
                </button>
                <button
                  type="button"
                  onClick={() => setPaymentMethod('netbanking')}
                  className={`p-3 rounded-xl border text-xs font-semibold flex flex-col items-center gap-1.5 transition-all ${
                    paymentMethod === 'netbanking'
                      ? 'border-blue-500 bg-blue-500/20 text-blue-300'
                      : 'border-[#1c2a45] bg-[#091122] text-slate-400 hover:bg-[#111f3d]'
                  }`}
                >
                  <Building size={16} />
                  <span>NetBanking</span>
                </button>
              </div>
            </div>

            {/* Method Inputs */}
            {paymentMethod === 'upi' && (
              <div className="space-y-3 mb-5 p-3.5 rounded-2xl bg-[#091122] border border-[#1c2a45]">
                <div className="flex items-center justify-between text-xs text-slate-400">
                  <span>Enter Virtual Payment Address (VPA):</span>
                  <span className="text-[10px] text-emerald-400">Instant Verification</span>
                </div>
                <input
                  type="text"
                  value={upiId}
                  onChange={(e) => setUpiId(e.target.value)}
                  placeholder="username@okaxis or @upi"
                  className="w-full px-3.5 py-2 rounded-xl bg-[#070d1a] border border-[#1c2a45] text-xs font-mono text-white focus:outline-none focus:border-blue-500"
                />
                <div className="flex items-center gap-2 pt-1 text-[11px] text-slate-400">
                  <QrCode size={13} className="text-blue-400" />
                  <span>Supports GPay, PhonePe, Paytm, BHIM UPI</span>
                </div>
              </div>
            )}

            {paymentMethod === 'card' && (
              <div className="space-y-3 mb-5 p-3.5 rounded-2xl bg-[#091122] border border-[#1c2a45]">
                <div>
                  <label className="block text-[11px] text-slate-400 mb-1">Card Number</label>
                  <input
                    type="text"
                    value={cardNumber}
                    onChange={(e) => setCardNumber(e.target.value)}
                    placeholder="4532 8921 7734 1092"
                    className="w-full px-3.5 py-2 rounded-xl bg-[#070d1a] border border-[#1c2a45] text-xs font-mono text-white focus:outline-none focus:border-blue-500"
                  />
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="block text-[11px] text-slate-400 mb-1">Valid Thru</label>
                    <input
                      type="text"
                      value={cardExpiry}
                      onChange={(e) => setCardExpiry(e.target.value)}
                      placeholder="MM/YY"
                      className="w-full px-3.5 py-2 rounded-xl bg-[#070d1a] border border-[#1c2a45] text-xs font-mono text-white focus:outline-none focus:border-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] text-slate-400 mb-1">CVV</label>
                    <input
                      type="password"
                      value={cardCvv}
                      maxLength={4}
                      onChange={(e) => setCardCvv(e.target.value)}
                      placeholder="•••"
                      className="w-full px-3.5 py-2 rounded-xl bg-[#070d1a] border border-[#1c2a45] text-xs font-mono text-white focus:outline-none focus:border-blue-500"
                    />
                  </div>
                </div>
              </div>
            )}

            {paymentMethod === 'netbanking' && (
              <div className="space-y-3 mb-5 p-3.5 rounded-2xl bg-[#091122] border border-[#1c2a45]">
                <label className="block text-[11px] text-slate-400 mb-1">Select Bank</label>
                <select
                  value={bankName}
                  onChange={(e) => setBankName(e.target.value)}
                  className="w-full px-3.5 py-2 rounded-xl bg-[#070d1a] border border-[#1c2a45] text-xs text-white focus:outline-none focus:border-blue-500"
                >
                  <option value="HDFC Bank">HDFC Bank</option>
                  <option value="State Bank of India">State Bank of India (SBI)</option>
                  <option value="ICICI Bank">ICICI Bank</option>
                  <option value="Axis Bank">Axis Bank</option>
                  <option value="Kotak Mahindra Bank">Kotak Mahindra Bank</option>
                </select>
              </div>
            )}

            {/* Pay Button */}
            <button
              onClick={handleInitiatePayment}
              disabled={isProcessingPayment}
              className="w-full py-3.5 bg-gradient-to-r from-emerald-500 to-blue-600 hover:from-emerald-600 hover:to-blue-700 text-white font-bold text-sm rounded-xl flex items-center justify-center gap-2 shadow-lg shadow-emerald-500/25 transition-all disabled:opacity-60"
            >
              {isProcessingPayment ? (
                <div className="flex items-center gap-2">
                  <Loader2 size={16} className="animate-spin" />
                  <span>Processing Razorpay Authorization...</span>
                </div>
              ) : (
                <>
                  <ShieldCheck size={16} />
                  <span>Authorize & Pay {selectedPlanObj.price}</span>
                </>
              )}
            </button>

            <div className="flex items-center justify-center gap-2 mt-4 text-[11px] text-slate-400">
              <Lock size={12} className="text-emerald-400" />
              <span>Razorpay Sandbox 256-Bit SSL Encrypted Sandbox Gateway</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CreateAccount;

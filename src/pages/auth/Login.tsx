import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import {
  Eye,
  EyeOff,
  TrendingUp,
  Shield,
  Smartphone,
  Check,
  ArrowRight,
  RefreshCw,
  Lock,
  Sparkles,
  AlertCircle,
  KeyRound,
  ShieldCheck
} from 'lucide-react';
import Logo from '@/components/ui/Logo';
import { useAppStore } from '@/stores/useAppStore';

const roleOptions = [
  { id: 'investor', label: 'Retail Investor', desc: 'I want to invest and grow my wealth', icon: TrendingUp, color: 'border-nova-accent/40 bg-nova-accent/5' },
  { id: 'trader', label: 'Trader / Algo Trader', desc: 'I trade actively and use strategies', icon: TrendingUp, color: 'border-nova-primary/40 bg-nova-primary/5' },
  { id: 'advisor', label: 'Financial Advisor', desc: 'I manage portfolios for clients', icon: Shield, color: 'border-nova-yellow/40 bg-nova-yellow/5' },
  { id: 'admin', label: 'Platform Admin', desc: 'Compliance and administration', icon: Shield, color: 'border-nova-purple/40 bg-nova-purple/5' },
];

type LoginStep = 'credentials' | 'otp' | 'biometric';

// Helper function to generate a random 6-character captcha code
const generateCaptchaCode = (): string => {
  const chars = '23456789ABCDEFGHJKLMNPQRSTUVWXYZ';
  let result = '';
  for (let i = 0; i < 6; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
};

const Login: React.FC = () => {
  const navigate = useNavigate();
  const { login } = useAppStore();
  const [step, setStep] = useState<LoginStep>('credentials');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [selectedRole, setSelectedRole] = useState('investor');
  const [showPassword, setShowPassword] = useState(false);
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Captcha State
  const [captchaCode, setCaptchaCode] = useState('');
  const [userCaptchaInput, setUserCaptchaInput] = useState('');
  const [isCaptchaRefreshing, setIsCaptchaRefreshing] = useState(false);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  // Initialize Captcha
  const refreshCaptcha = () => {
    setIsCaptchaRefreshing(true);
    const newCode = generateCaptchaCode();
    setCaptchaCode(newCode);
    setUserCaptchaInput('');
    setTimeout(() => setIsCaptchaRefreshing(false), 300);
  };

  useEffect(() => {
    refreshCaptcha();
  }, []);

  // Draw Captcha on Canvas with noise lines & distortion
  useEffect(() => {
    if (!canvasRef.current || !captchaCode) return;
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Clear
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Dark Gradient Background
    const grad = ctx.createLinearGradient(0, 0, canvas.width, canvas.height);
    grad.addColorStop(0, '#0f172a');
    grad.addColorStop(1, '#1e293b');
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Draw background noise grid lines
    ctx.strokeStyle = 'rgba(59, 130, 246, 0.2)';
    ctx.lineWidth = 1;
    for (let i = 0; i < canvas.width; i += 15) {
      ctx.beginPath();
      ctx.moveTo(i, 0);
      ctx.lineTo(i + (Math.random() - 0.5) * 10, canvas.height);
      ctx.stroke();
    }
    for (let j = 0; j < canvas.height; j += 10) {
      ctx.beginPath();
      ctx.moveTo(0, j);
      ctx.lineTo(canvas.width, j + (Math.random() - 0.5) * 10);
      ctx.stroke();
    }

    // Draw wavy slash line
    ctx.strokeStyle = 'rgba(16, 185, 129, 0.4)';
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    ctx.moveTo(5, canvas.height / 2 + (Math.random() - 0.5) * 10);
    ctx.bezierCurveTo(
      canvas.width * 0.3,
      10,
      canvas.width * 0.7,
      canvas.height - 10,
      canvas.width - 5,
      canvas.height / 2
    );
    ctx.stroke();

    // Draw stylized individual characters
    const charColors = ['#38bdf8', '#34d399', '#fbbf24', '#a78bfa', '#f472b6', '#60a5fa'];
    ctx.font = 'bold 22px monospace';
    ctx.textBaseline = 'middle';

    for (let i = 0; i < captchaCode.length; i++) {
      ctx.save();
      const x = 16 + i * 21;
      const y = canvas.height / 2 + (Math.random() - 0.5) * 6;
      const angle = (Math.random() - 0.5) * 0.4;
      ctx.translate(x, y);
      ctx.rotate(angle);
      ctx.fillStyle = charColors[i % charColors.length];
      ctx.shadowColor = 'rgba(0,0,0,0.8)';
      ctx.shadowBlur = 4;
      ctx.fillText(captchaCode[i], 0, 0);
      ctx.restore();
    }
  }, [captchaCode]);

  const handleCredentialSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!email.trim() || !password) {
      setError('Please fill in both Email and Password.');
      return;
    }

    // Captcha Validation
    if (!userCaptchaInput.trim()) {
      setError('Please enter the Captcha code shown in the security box.');
      return;
    }

    if (userCaptchaInput.trim().toUpperCase() !== captchaCode.toUpperCase()) {
      setError('Invalid Captcha code. Please re-enter the code correctly.');
      refreshCaptcha();
      return;
    }

    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setStep('otp');
    }, 900);
  };

  const handleOTPVerify = () => {
    const code = otp.join('');
    if (code.length < 6) {
      setError('Please enter the full 6-digit OTP code.');
      return;
    }
    setError('');
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setStep('biometric');
    }, 1000);
  };

  const handleBiometric = () => {
    setLoading(true);
    setTimeout(() => {
      const user = login(email, selectedRole);
      setLoading(false);
      if (user) {
        const paths: Record<string, string> = {
          investor: '/dashboard/investor',
          trader: '/dashboard/trader',
          advisor: '/dashboard/advisor',
          admin: '/dashboard/admin',
        };
        navigate(paths[user.role]);
      }
    }, 1200);
  };

  const handleOtpChange = (val: string, idx: number) => {
    if (val.length > 1 || /\D/.test(val)) return;
    const newOtp = [...otp];
    newOtp[idx] = val;
    setOtp(newOtp);
    if (val && idx < 5) {
      const next = document.getElementById(`otp-${idx + 1}`) as HTMLInputElement;
      next?.focus();
    }
  };

  // Demo account helper (pre-fills credentials but enforces Captcha verification)
  const selectDemoAccount = (role: string) => {
    setSelectedRole(role);
    const demoEmails: Record<string, string> = {
      investor: 'alex@novaeq.ai',
      trader: 'priya@novaeq.ai',
      advisor: 'marcus@novaeq.ai',
      admin: 'admin@novaeq.ai',
    };
    setEmail(demoEmails[role] || 'investor@novaeq.ai');
    setPassword('DemoPass2026!');
    setError('');
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-24 bg-[#070d1a] text-[#f8fafc]">
      <div className="w-full max-w-4xl">
        <div className="grid lg:grid-cols-2 gap-0 border border-[#1c2a45] rounded-3xl overflow-hidden shadow-2xl bg-[#0b1428]">
          {/* Left — Brand Panel */}
          <div className="hidden lg:flex flex-col bg-gradient-to-b from-[#0e1a33] via-[#091326] to-[#070d1a] p-10 relative overflow-hidden border-r border-[#1c2a45]">
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,rgba(29,78,216,0.25),transparent)] pointer-events-none" />
            <div className="relative flex-1 flex flex-col justify-between z-10">
              <div>
                <Logo size="md" className="mb-6" />
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-blue-500/30 bg-blue-500/10 text-xs font-semibold text-blue-300 mb-4">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 live-dot-pulse" />
                  <span>Institutional AI Intelligence Suite</span>
                </div>
                <h2 className="text-3xl font-display font-black text-white mb-3">
                  Welcome Back to{' '}
                  <span className="bg-gradient-to-r from-blue-400 via-sky-300 to-emerald-400 bg-clip-text text-transparent">
                    NovaEq
                  </span>
                </h2>
                <p className="text-slate-400 text-sm leading-relaxed mb-6">
                  Empower your capital with sub-millisecond execution, neural market signals, and automated portfolio safeguards.
                </p>
                <div className="space-y-3">
                  {[
                    'Sub-millisecond institutional trading terminal',
                    '500+ quantitative & sentiment AI catalyst signals',
                    'Zero-code algorithmic bot fleet & backtester',
                    'Real-time portfolio factor risk matrix',
                  ].map((f) => (
                    <div key={f} className="flex items-center gap-3">
                      <div className="w-5 h-5 rounded-full bg-emerald-500/15 border border-emerald-500/40 flex items-center justify-center flex-shrink-0">
                        <Check size={12} className="text-emerald-400" />
                      </div>
                      <span className="text-xs text-slate-300">{f}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="pt-6 border-t border-[#1c2a45] mt-8">
                <p className="text-[11px] text-slate-500 font-mono flex items-center gap-1.5">
                  <Lock size={12} className="text-emerald-400" />
                  <span>256-Bit SSL · ISO 27001 Certified · SEBI Regulated</span>
                </p>
              </div>
            </div>
          </div>

          {/* Right — Form */}
          <div className="p-7 sm:p-10 bg-[#091122]">
            <div className="lg:hidden mb-6">
              <Logo size="sm" />
            </div>

            {step === 'credentials' && (
              <>
                <div className="mb-6">
                  <span className="text-[11px] font-mono font-bold uppercase tracking-wider text-blue-400 block mb-1">
                    Secure Client Gateway
                  </span>
                  <h1 className="text-2xl font-display font-bold text-white mb-1">
                    Sign In to Dashboard
                  </h1>
                  <p className="text-slate-400 text-xs sm:text-sm">
                    Enter your credentials and solve the security Captcha to proceed.
                  </p>
                </div>

                {error && (
                  <div className="p-3 mb-4 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs flex items-center gap-2 animate-fadeIn">
                    <AlertCircle size={15} className="flex-shrink-0" />
                    <span>{error}</span>
                  </div>
                )}

                <form onSubmit={handleCredentialSubmit} className="space-y-4 mb-6">
                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1">
                      Email Address <span className="text-rose-400">*</span>
                    </label>
                    <input
                      type="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full px-3.5 py-2.5 rounded-xl bg-[#0e1a33] border border-[#1c2a45] text-sm text-white focus:outline-none focus:border-blue-500 transition-colors"
                      placeholder="your.email@domain.com"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1">
                      Password <span className="text-rose-400">*</span>
                    </label>
                    <div className="relative">
                      <input
                        type={showPassword ? 'text' : 'password'}
                        required
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="w-full px-3.5 py-2.5 rounded-xl bg-[#0e1a33] border border-[#1c2a45] text-sm text-white focus:outline-none focus:border-blue-500 pr-10 transition-colors"
                        placeholder="••••••••"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white"
                      >
                        {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                      </button>
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1">
                      Login Persona / Role
                    </label>
                    <select
                      value={selectedRole}
                      onChange={(e) => setSelectedRole(e.target.value)}
                      className="w-full px-3.5 py-2.5 rounded-xl bg-[#0e1a33] border border-[#1c2a45] text-sm text-white focus:outline-none focus:border-blue-500 transition-colors"
                    >
                      {roleOptions.map((r) => (
                        <option key={r.id} value={r.id}>
                          {r.label}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* ========================================================================= */}
                  {/* SECURITY CAPTCHA CODE VERIFICATION SECTION                                */}
                  {/* ========================================================================= */}
                  <div className="p-3.5 rounded-2xl bg-[#0e1a33] border border-[#1c2a45] space-y-2.5">
                    <div className="flex items-center justify-between">
                      <label className="text-xs font-semibold text-slate-300 flex items-center gap-1.5">
                        <ShieldCheck size={14} className="text-emerald-400" />
                        <span>Security Captcha Verification</span>
                      </label>
                      <button
                        type="button"
                        onClick={refreshCaptcha}
                        className="text-[11px] font-mono text-blue-400 hover:text-blue-300 flex items-center gap-1 transition-colors"
                        title="Reload new Captcha code"
                      >
                        <RefreshCw
                          size={11}
                          className={isCaptchaRefreshing ? 'animate-spin' : ''}
                        />
                        <span>Refresh Code</span>
                      </button>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 items-center">
                      {/* Stylized Captcha Canvas Box */}
                      <div className="relative rounded-xl overflow-hidden border border-[#1c2a45] bg-slate-900 shadow-inner flex items-center justify-center h-11 select-none">
                        <canvas
                          ref={canvasRef}
                          width={150}
                          height={44}
                          className="w-full h-full cursor-pointer"
                          onClick={refreshCaptcha}
                          title="Click image to reload Captcha"
                        />
                      </div>

                      {/* Captcha Input */}
                      <div>
                        <input
                          type="text"
                          required
                          maxLength={6}
                          value={userCaptchaInput}
                          onChange={(e) => setUserCaptchaInput(e.target.value.toUpperCase())}
                          placeholder="Enter Captcha"
                          className="w-full px-3 py-2.5 rounded-xl bg-[#091122] border border-[#1c2a45] text-xs font-mono uppercase tracking-widest text-white text-center focus:outline-none focus:border-emerald-400 transition-colors"
                        />
                      </div>
                    </div>
                  </div>

                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full py-3.5 bg-gradient-to-r from-blue-500 to-blue-700 hover:from-blue-600 hover:to-blue-800 text-white font-semibold text-sm rounded-xl flex items-center justify-center gap-2 shadow-lg shadow-blue-500/25 transition-all disabled:opacity-60"
                  >
                    {loading ? (
                      <span>Verifying Security Token...</span>
                    ) : (
                      <>
                        <span>Continue to Verification</span>
                        <ArrowRight size={16} />
                      </>
                    )}
                  </button>
                </form>

                {/* Pre-fill Quick Demo Accounts */}
                <div className="border-t border-[#1c2a45] pt-5">
                  <p className="text-xs text-slate-400 text-center mb-2.5">
                    Pre-fill Demo Account (Captcha required):
                  </p>
                  <div className="grid grid-cols-2 gap-2">
                    {roleOptions.map((r) => (
                      <button
                        key={r.id}
                        type="button"
                        onClick={() => selectDemoAccount(r.id)}
                        className={`text-left p-2 rounded-xl border transition-all hover:scale-[1.02] ${
                          selectedRole === r.id
                            ? 'border-blue-500 bg-blue-500/15'
                            : 'border-[#1c2a45] bg-[#0e1a33]/60 hover:bg-[#122240]'
                        }`}
                      >
                        <span className="block text-xs font-bold text-white">{r.label}</span>
                        <span className="block text-[10px] text-slate-400 truncate">{r.desc}</span>
                      </button>
                    ))}
                  </div>
                </div>

                <p className="text-center text-xs text-slate-400 mt-6">
                  Don't have an account?{' '}
                  <Link
                    to="/create-account"
                    className="text-blue-400 hover:text-blue-300 font-semibold underline"
                  >
                    Create one free
                  </Link>
                </p>
              </>
            )}

            {/* ========================================================================= */}
            {/* STEP 2: 2FA OTP VERIFICATION                                              */}
            {/* ========================================================================= */}
            {step === 'otp' && (
              <div className="animate-fadeIn">
                <div className="mb-6">
                  <span className="text-[11px] font-mono font-bold uppercase tracking-wider text-emerald-400 block mb-1">
                    Two-Factor Authentication
                  </span>
                  <h2 className="text-2xl font-display font-bold text-white mb-1">Enter 6-Digit OTP</h2>
                  <p className="text-slate-400 text-xs sm:text-sm">
                    A secure one-time verification code has been dispatched to{' '}
                    <b className="text-slate-200">{email || 'your registered device'}</b>.
                  </p>
                </div>

                {error && (
                  <div className="p-3 mb-4 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs flex items-center gap-2">
                    <AlertCircle size={15} />
                    <span>{error}</span>
                  </div>
                )}

                <div className="flex justify-center gap-2 my-6">
                  {otp.map((digit, idx) => (
                    <input
                      key={idx}
                      id={`otp-${idx}`}
                      type="text"
                      maxLength={1}
                      value={digit}
                      onChange={(e) => handleOtpChange(e.target.value, idx)}
                      className="w-11 h-12 text-center text-lg font-mono font-bold text-white bg-[#0e1a33] border border-[#1c2a45] rounded-xl focus:outline-none focus:border-blue-500"
                    />
                  ))}
                </div>

                <div className="p-3 rounded-xl bg-blue-500/10 border border-blue-500/20 text-xs text-blue-300 mb-6 text-center">
                  Demo Code: Enter any 6 numbers (e.g. <b>123456</b>)
                </div>

                <button
                  onClick={handleOTPVerify}
                  disabled={loading}
                  className="w-full py-3.5 bg-gradient-to-r from-blue-500 to-blue-700 hover:from-blue-600 hover:to-blue-800 text-white font-semibold text-sm rounded-xl flex items-center justify-center gap-2 shadow-lg shadow-blue-500/25 transition-all"
                >
                  {loading ? 'Verifying OTP...' : 'Verify & Continue'}
                </button>
              </div>
            )}

            {/* ========================================================================= */}
            {/* STEP 3: BIOMETRIC / FINAL LAUNCH                                          */}
            {/* ========================================================================= */}
            {step === 'biometric' && (
              <div className="animate-fadeIn text-center py-4">
                <div className="w-16 h-16 rounded-3xl bg-blue-500/15 border border-blue-500/30 text-blue-400 flex items-center justify-center mx-auto mb-4 animate-pulse">
                  <Smartphone size={32} />
                </div>
                <h2 className="text-2xl font-display font-bold text-white mb-2">
                  Biometric Verification
                </h2>
                <p className="text-slate-400 text-xs sm:text-sm max-w-sm mx-auto mb-6">
                  Hardware token recognized. Confirm your session to enter your personalized dashboard.
                </p>

                <button
                  onClick={handleBiometric}
                  disabled={loading}
                  className="w-full py-4 bg-gradient-to-r from-blue-500 via-indigo-600 to-emerald-500 hover:from-blue-600 hover:to-emerald-600 text-white font-display font-bold text-base rounded-2xl flex items-center justify-center gap-2 shadow-xl shadow-blue-500/30 transition-all"
                >
                  {loading ? 'Authorizing Session...' : 'Authenticate & Enter Dashboard'}
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;

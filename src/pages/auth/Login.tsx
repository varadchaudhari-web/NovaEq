import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Eye, EyeOff, TrendingUp, Shield, Smartphone, Check, ArrowRight } from 'lucide-react';
import Logo from '@/components/ui/Logo';
import { useAppStore } from '@/stores/useAppStore';

const roleOptions = [
  { id: 'investor', label: 'Retail Investor', desc: 'I want to invest and grow my wealth', icon: TrendingUp, color: 'border-nova-accent/40 bg-nova-accent/5' },
  { id: 'trader', label: 'Trader / Algo Trader', desc: 'I trade actively and use strategies', icon: TrendingUp, color: 'border-nova-primary/40 bg-nova-primary/5' },
  { id: 'advisor', label: 'Financial Advisor', desc: 'I manage portfolios for clients', icon: Shield, color: 'border-nova-yellow/40 bg-nova-yellow/5' },
  { id: 'admin', label: 'Platform Admin', desc: 'Compliance and administration', icon: Shield, color: 'border-nova-purple/40 bg-nova-purple/5' },
];

type LoginStep = 'credentials' | 'otp' | 'biometric';

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

  const handleCredentialSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) { setError('Please fill all fields.'); return; }
    setError('');
    setLoading(true);
    setTimeout(() => { setLoading(false); setStep('otp'); }, 1000);
  };

  const handleOTPVerify = () => {
    const code = otp.join('');
    if (code.length < 6) { setError('Enter the 6-digit OTP.'); return; }
    setLoading(true);
    setTimeout(() => { setLoading(false); setStep('biometric'); }, 1000);
  };

  const handleBiometric = () => {
    setLoading(true);
    setTimeout(() => {
      const user = login(email, selectedRole);
      setLoading(false);
      if (user) {
        const paths: Record<string, string> = { investor: '/dashboard/investor', trader: '/dashboard/trader', advisor: '/dashboard/advisor', admin: '/dashboard/admin' };
        navigate(paths[user.role]);
      }
    }, 1500);
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

  const quickLogin = (role: string) => {
    setLoading(true);
    setTimeout(() => {
      const user = login('', role);
      setLoading(false);
      if (user) {
        const paths: Record<string, string> = { investor: '/dashboard/investor', trader: '/dashboard/trader', advisor: '/dashboard/advisor', admin: '/dashboard/admin' };
        navigate(paths[user.role]);
      }
    }, 800);
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-24">
      <div className="w-full max-w-4xl">
        <div className="grid lg:grid-cols-2 gap-0 nova-card overflow-hidden shadow-nova-modal">
          {/* Left — Brand Panel */}
          <div className="hidden lg:flex flex-col bg-nova-hero p-10 relative overflow-hidden">
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,rgba(29,78,216,0.3),transparent)]" />
            <div className="relative flex-1 flex flex-col justify-between">
              <Logo size="md" />
              <div>
                <h2 className="text-3xl font-display font-black text-white mb-4">Welcome Back to <span className="text-nova-accent">NovaEq</span></h2>
                <p className="text-nova-text-muted mb-8">Your AI-powered investment command center is ready.</p>
                <div className="space-y-3">
                  {['Real-time portfolio analytics', 'AI stock recommendations', 'Algorithmic trading tools', 'Expert community insights'].map(f => (
                    <div key={f} className="flex items-center gap-3">
                      <div className="w-5 h-5 rounded-full bg-nova-accent/20 border border-nova-accent/40 flex items-center justify-center flex-shrink-0">
                        <Check size={12} className="text-nova-accent" />
                      </div>
                      <span className="text-sm text-nova-text-muted">{f}</span>
                    </div>
                  ))}
                </div>
              </div>
              <p className="text-xs text-nova-text-subtle">Secured by bank-grade 256-bit encryption · SEBI Registered</p>
            </div>
          </div>

          {/* Right — Form */}
          <div className="p-8 md:p-10 bg-nova-secondary">
            <div className="lg:hidden mb-6"><Logo size="sm" /></div>

            {step === 'credentials' && (
              <>
                <h1 className="text-2xl font-display font-bold text-nova-text mb-1">Sign In</h1>
                <p className="text-nova-text-muted text-sm mb-6">Access your investment dashboard</p>

                {error && <div className="bg-nova-red/10 border border-nova-red/30 text-nova-red text-sm px-4 py-3 rounded-lg mb-4">{error}</div>}

                <form onSubmit={handleCredentialSubmit} className="space-y-4 mb-6">
                  <div>
                    <label className="nova-label">Email Address</label>
                    <input type="email" value={email} onChange={e => setEmail(e.target.value)} className="nova-input" placeholder="your@email.com" />
                  </div>
                  <div>
                    <label className="nova-label">Password</label>
                    <div className="relative">
                      <input type={showPassword ? 'text' : 'password'} value={password} onChange={e => setPassword(e.target.value)} className="nova-input pr-10" placeholder="••••••••" />
                      <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 text-nova-text-muted hover:text-nova-text">
                        {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                      </button>
                    </div>
                  </div>
                  <div>
                    <label className="nova-label">Login As</label>
                    <select value={selectedRole} onChange={e => setSelectedRole(e.target.value)} className="nova-input">
                      {roleOptions.map(r => <option key={r.id} value={r.id}>{r.label}</option>)}
                    </select>
                  </div>
                  <button type="submit" disabled={loading} className="nova-btn-primary w-full py-3 flex items-center justify-center gap-2 disabled:opacity-60">
                    {loading ? 'Verifying...' : <><span>Continue</span><ArrowRight size={16} /></>}
                  </button>
                </form>

                <div className="border-t border-nova-border pt-5">
                  <p className="text-xs text-nova-text-muted text-center mb-3">Quick Demo Login — Click to enter as:</p>
                  <div className="grid grid-cols-2 gap-2">
                    {roleOptions.map(r => (
                      <button key={r.id} onClick={() => quickLogin(r.id)}
                        className={`text-xs px-3 py-2.5 rounded-lg border transition-all hover:scale-[1.02] ${r.color}`}>
                        <span className="block font-semibold text-nova-text">{r.label}</span>
                        <span className="block text-nova-text-subtle mt-0.5">{r.desc}</span>
                      </button>
                    ))}
                  </div>
                </div>

                <p className="text-center text-sm text-nova-text-muted mt-6">
                  No account? <Link to="/create-account" className="text-nova-primary-light hover:underline font-medium">Create one free</Link>
                </p>
              </>
            )}

            {step === 'otp' && (
              <>
                <div className="w-14 h-14 rounded-2xl bg-nova-primary/10 border border-nova-primary/20 flex items-center justify-center mb-5">
                  <Smartphone size={24} className="text-nova-primary-light" />
                </div>
                <h1 className="text-2xl font-display font-bold text-nova-text mb-1">OTP Verification</h1>
                <p className="text-nova-text-muted text-sm mb-6">We sent a 6-digit code to <span className="text-nova-text">{email || 'your registered mobile'}</span></p>

                {error && <div className="bg-nova-red/10 border border-nova-red/30 text-nova-red text-sm px-4 py-3 rounded-lg mb-4">{error}</div>}

                <div className="flex gap-2 mb-6">
                  {otp.map((digit, i) => (
                    <input key={i} id={`otp-${i}`} type="text" inputMode="numeric" pattern="[0-9]" maxLength={1} value={digit}
                      onChange={e => handleOtpChange(e.target.value, i)}
                      className="nova-input text-center text-xl font-bold py-3 flex-1 focus:border-nova-accent" />
                  ))}
                </div>

                <p className="text-xs text-nova-text-muted text-center mb-4">Demo: Enter any 6 digits to proceed</p>
                <button onClick={handleOTPVerify} disabled={loading} className="nova-btn-primary w-full py-3 disabled:opacity-60">
                  {loading ? 'Verifying OTP...' : 'Verify OTP'}
                </button>
                <button onClick={() => setStep('credentials')} className="nova-btn-ghost w-full mt-2 text-sm">← Back</button>
              </>
            )}

            {step === 'biometric' && (
              <>
                <div className="text-center">
                  <div className="w-20 h-20 rounded-3xl bg-nova-accent/10 border-2 border-nova-accent/30 flex items-center justify-center mx-auto mb-5">
                    <Shield size={32} className="text-nova-accent" />
                  </div>
                  <h1 className="text-2xl font-display font-bold text-nova-text mb-2">Biometric Verification</h1>
                  <p className="text-nova-text-muted text-sm mb-8">Confirm your identity with biometrics for enhanced security</p>

                  <button onClick={handleBiometric} disabled={loading}
                    className={`w-32 h-32 rounded-full mx-auto flex items-center justify-center flex-col gap-2 border-4 transition-all ${loading ? 'border-nova-accent bg-nova-accent/10 scale-95' : 'border-nova-border hover:border-nova-accent hover:bg-nova-accent/10 cursor-pointer'}`}>
                    <span className="text-3xl">{loading ? '🔐' : '👆'}</span>
                    <span className="text-xs text-nova-text-muted">{loading ? 'Authenticating...' : 'Touch to Verify'}</span>
                  </button>

                  <p className="text-xs text-nova-text-subtle mt-6">Simulated biometric — click to complete login</p>
                  <button onClick={() => handleBiometric()} className="nova-btn-outline w-full mt-4 text-sm py-3">Skip Biometric & Sign In</button>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;

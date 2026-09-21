import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Check, ChevronRight, User, Target, Shield, TrendingUp, ArrowRight } from 'lucide-react';
import Logo from '@/components/ui/Logo';
import { useAppStore } from '@/stores/useAppStore';

type Step = 'role' | 'account' | 'kyc' | 'risk' | 'goals' | 'complete';

const roles = [
  { id: 'investor', label: 'Retail Investor', desc: 'I want to invest and grow my personal wealth', icon: TrendingUp },
  { id: 'trader', label: 'Active Trader', desc: 'I trade stocks, F&O and use advanced strategies', icon: TrendingUp },
  { id: 'advisor', label: 'Financial Advisor', desc: 'I manage portfolios and advise clients professionally', icon: Shield },
];

const riskProfiles = [
  { id: 'conservative', label: 'Conservative', desc: 'I prefer stable returns with minimal risk', expected: '8–12% annual', color: 'border-nova-green/40' },
  { id: 'moderate', label: 'Moderate', desc: 'Balanced approach — some risk for better returns', expected: '12–18% annual', color: 'border-nova-yellow/40' },
  { id: 'aggressive', label: 'Aggressive', desc: 'I can handle high volatility for maximum growth', expected: '18–30% annual', color: 'border-nova-red/40' },
];

const goalOptions = ['Retirement Planning', 'Wealth Building', 'Passive Income', 'Tax Saving', 'Child Education', 'Home Purchase', 'Emergency Fund', 'Short-term Gains'];

const CreateAccount: React.FC = () => {
  const navigate = useNavigate();
  const { login } = useAppStore();
  const [step, setStep] = useState<Step>('role');
  const [data, setData] = useState({
    role: 'investor', name: '', email: '', phone: '', password: '',
    panNumber: '', aadhar: '', riskProfile: 'moderate', goals: [] as string[],
  });
  const [loading, setLoading] = useState(false);

  const steps: Step[] = ['role', 'account', 'kyc', 'risk', 'goals', 'complete'];
  const stepLabels = ['Role', 'Account', 'KYC', 'Risk Profile', 'Goals', 'Complete'];
  const currentIdx = steps.indexOf(step);

  const next = () => setStep(steps[currentIdx + 1]);
  const back = () => setStep(steps[currentIdx - 1]);

  const toggleGoal = (g: string) => {
    setData(d => ({ ...d, goals: d.goals.includes(g) ? d.goals.filter(x => x !== g) : [...d.goals, g] }));
  };

  const handleComplete = () => {
    setLoading(true);
    setTimeout(() => {
      const user = login(data.email || 'new@example.com', data.role);
      setLoading(false);
      if (user) {
        const paths: Record<string, string> = { investor: '/dashboard/investor', trader: '/dashboard/trader', advisor: '/dashboard/advisor' };
        navigate(paths[user.role] || '/dashboard/investor');
      }
    }, 1500);
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-24">
      <div className="w-full max-w-xl">
        <div className="text-center mb-8">
          <Logo size="md" className="justify-center mb-4" />
          <p className="text-nova-text-muted text-sm">Create your free NovaEq account — takes 2 minutes</p>
        </div>

        {/* Progress */}
        <div className="flex items-center justify-between mb-8 px-2">
          {stepLabels.map((label, i) => (
            <div key={label} className="flex items-center">
              <div className={`flex flex-col items-center gap-1 ${i <= currentIdx ? 'text-nova-accent' : 'text-nova-text-subtle'}`}>
                <div className={`w-7 h-7 rounded-full border-2 flex items-center justify-center text-xs font-bold transition-all ${i < currentIdx ? 'bg-nova-accent border-nova-accent text-white' : i === currentIdx ? 'border-nova-accent bg-nova-accent/10 text-nova-accent' : 'border-nova-border text-nova-text-subtle'}`}>
                  {i < currentIdx ? <Check size={14} /> : i + 1}
                </div>
                <span className="text-[10px] hidden sm:block">{label}</span>
              </div>
              {i < stepLabels.length - 1 && (
                <div className={`flex-1 h-px mx-1 sm:mx-2 transition-all ${i < currentIdx ? 'bg-nova-accent' : 'bg-nova-border'}`} style={{ width: '20px' }} />
              )}
            </div>
          ))}
        </div>

        <div className="nova-card p-7 shadow-nova-modal">
          {step === 'role' && (
            <div>
              <h2 className="text-xl font-display font-bold text-nova-text mb-1">What best describes you?</h2>
              <p className="text-nova-text-muted text-sm mb-6">We'll customize your experience based on your role.</p>
              <div className="space-y-3 mb-6">
                {roles.map(r => {
                  const Icon = r.icon;
                  return (
                    <div key={r.id} onClick={() => setData({ ...data, role: r.id })}
                      className={`nova-card p-4 cursor-pointer transition-all ${data.role === r.id ? 'border-nova-accent bg-nova-accent/5' : ''}`}>
                      <div className="flex items-center gap-3">
                        <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${data.role === r.id ? 'bg-nova-accent/10' : 'bg-nova-surface2'}`}>
                          <Icon size={18} className={data.role === r.id ? 'text-nova-accent' : 'text-nova-text-muted'} />
                        </div>
                        <div>
                          <p className="text-sm font-bold text-nova-text">{r.label}</p>
                          <p className="text-xs text-nova-text-muted">{r.desc}</p>
                        </div>
                        {data.role === r.id && <Check size={18} className="text-nova-accent ml-auto" />}
                      </div>
                    </div>
                  );
                })}
              </div>
              <button onClick={next} className="nova-btn-primary w-full py-3 flex items-center justify-center gap-2">
                Continue <ArrowRight size={16} />
              </button>
            </div>
          )}

          {step === 'account' && (
            <div>
              <h2 className="text-xl font-display font-bold text-nova-text mb-1">Create Your Account</h2>
              <p className="text-nova-text-muted text-sm mb-6">All fields are required to secure your account.</p>
              <div className="space-y-4 mb-6">
                <div><label className="nova-label">Full Name</label><input type="text" value={data.name} onChange={e => setData({ ...data, name: e.target.value })} className="nova-input" placeholder="Alex Reynolds" /></div>
                <div><label className="nova-label">Email Address</label><input type="email" value={data.email} onChange={e => setData({ ...data, email: e.target.value })} className="nova-input" placeholder="alex@example.com" /></div>
                <div><label className="nova-label">Phone Number</label><input type="tel" value={data.phone} onChange={e => setData({ ...data, phone: e.target.value })} className="nova-input" placeholder="+91 98765 43210" /></div>
                <div><label className="nova-label">Password</label><input type="password" value={data.password} onChange={e => setData({ ...data, password: e.target.value })} className="nova-input" placeholder="Min. 8 characters with symbols" /></div>
              </div>
              <div className="flex gap-3">
                <button onClick={back} className="nova-btn-ghost flex-1 py-3">← Back</button>
                <button onClick={next} className="nova-btn-primary flex-1 py-3">Continue →</button>
              </div>
            </div>
          )}

          {step === 'kyc' && (
            <div>
              <h2 className="text-xl font-display font-bold text-nova-text mb-1">KYC Verification</h2>
              <p className="text-nova-text-muted text-sm mb-2">Required by SEBI for trading and investing. Your data is encrypted.</p>
              <div className="nova-badge-blue text-xs mb-5 inline-flex items-center gap-1"><Shield size={12} /> 256-bit encrypted · SEBI compliant</div>
              <div className="space-y-4 mb-5">
                <div><label className="nova-label">PAN Card Number</label><input type="text" value={data.panNumber} onChange={e => setData({ ...data, panNumber: e.target.value.toUpperCase() })} className="nova-input uppercase" placeholder="ABCDE1234F" maxLength={10} /></div>
                <div><label className="nova-label">Aadhaar Number (last 4 digits)</label><input type="text" inputMode="numeric" pattern="[0-9]{4}" value={data.aadhar} onChange={e => setData({ ...data, aadhar: e.target.value.replace(/\D/g, '').slice(0, 4) })} className="nova-input" placeholder="1234" maxLength={4} /></div>
                <div>
                  <label className="nova-label">Identity Document</label>
                  <div className="nova-input py-8 text-center cursor-pointer border-dashed border-nova-border-light hover:border-nova-primary/40 transition-colors">
                    <p className="text-sm text-nova-text-muted">📎 Upload PAN / Aadhaar / Passport</p>
                    <p className="text-xs text-nova-text-subtle mt-1">PDF, JPG, PNG (max 5MB)</p>
                  </div>
                </div>
              </div>
              <div className="flex gap-3">
                <button onClick={back} className="nova-btn-ghost flex-1 py-3">← Back</button>
                <button onClick={next} className="nova-btn-primary flex-1 py-3">Submit KYC →</button>
              </div>
            </div>
          )}

          {step === 'risk' && (
            <div>
              <h2 className="text-xl font-display font-bold text-nova-text mb-1">Risk Profile Assessment</h2>
              <p className="text-nova-text-muted text-sm mb-6">This helps us tailor AI recommendations for your comfort level.</p>
              <div className="space-y-3 mb-6">
                {riskProfiles.map(r => (
                  <div key={r.id} onClick={() => setData({ ...data, riskProfile: r.id })}
                    className={`nova-card p-4 cursor-pointer border-2 transition-all ${data.riskProfile === r.id ? r.color + ' bg-opacity-5' : 'border-nova-border'}`}>
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-bold text-nova-text">{r.label}</p>
                        <p className="text-xs text-nova-text-muted">{r.desc}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-xs text-nova-accent font-semibold">{r.expected}</p>
                        {data.riskProfile === r.id && <Check size={16} className="text-nova-accent mt-1 ml-auto" />}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              <div className="flex gap-3">
                <button onClick={back} className="nova-btn-ghost flex-1 py-3">← Back</button>
                <button onClick={next} className="nova-btn-primary flex-1 py-3">Continue →</button>
              </div>
            </div>
          )}

          {step === 'goals' && (
            <div>
              <h2 className="text-xl font-display font-bold text-nova-text mb-1">Your Financial Goals</h2>
              <p className="text-nova-text-muted text-sm mb-6">Select all that apply. We'll personalize your dashboard accordingly.</p>
              <div className="grid grid-cols-2 gap-2 mb-6">
                {goalOptions.map(g => (
                  <div key={g} onClick={() => toggleGoal(g)}
                    className={`p-3 rounded-xl border cursor-pointer transition-all text-sm font-medium text-center ${data.goals.includes(g) ? 'bg-nova-accent/10 border-nova-accent/40 text-nova-accent' : 'border-nova-border text-nova-text-muted hover:border-nova-border-light'}`}>
                    {data.goals.includes(g) && '✓ '}{g}
                  </div>
                ))}
              </div>
              <div className="flex gap-3">
                <button onClick={back} className="nova-btn-ghost flex-1 py-3">← Back</button>
                <button onClick={next} disabled={data.goals.length === 0} className="nova-btn-primary flex-1 py-3 disabled:opacity-60">
                  Finish Setup →
                </button>
              </div>
            </div>
          )}

          {step === 'complete' && (
            <div className="text-center py-4">
              <div className="w-20 h-20 rounded-full bg-nova-accent/10 border-2 border-nova-accent flex items-center justify-center mx-auto mb-5">
                <Check size={36} className="text-nova-accent" />
              </div>
              <h2 className="text-2xl font-display font-bold text-nova-text mb-2">Demo Profile Ready</h2>
              <p className="text-nova-text-muted text-sm mb-2">Your details are prepared for this demo session.</p>
              <p className="text-xs text-nova-text-subtle mb-8">No real account is created because this demo does not connect to a database.</p>
              <div className="space-y-3">
                {[
                  { icon: '✓', text: 'Demo profile configured' }, { icon: '✓', text: 'Risk profile selected' },
                  { icon: '⏳', text: 'KYC shown as simulated review' }, { icon: '✓', text: 'Demo free plan active' },
                ].map(item => (
                  <div key={item.text} className="flex items-center gap-3 text-sm">
                    <span className={item.icon === '✓' ? 'text-nova-accent' : 'text-nova-yellow'}>{item.icon}</span>
                    <span className="text-nova-text-muted">{item.text}</span>
                  </div>
                ))}
              </div>
              <button onClick={handleComplete} disabled={loading} className="nova-btn-accent w-full py-3 mt-8 flex items-center justify-center gap-2">
                {loading ? 'Loading Demo Dashboard...' : <><span>Open Demo Dashboard</span><ArrowRight size={16} /></>}
              </button>
            </div>
          )}
        </div>

        <p className="text-center text-sm text-nova-text-muted mt-5">
          Already have an account? <Link to="/login" className="text-nova-primary-light hover:underline font-medium">Sign In</Link>
        </p>
      </div>
    </div>
  );
};

export default CreateAccount;

import React, { useState } from 'react';
import {
  X,
  Target,
  Shield,
  Zap,
  TrendingUp,
  CheckCircle2,
  ArrowRight
} from 'lucide-react';
import { useAppStore } from '@/stores/useAppStore';

interface RiskAssessmentModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const QUESTIONS = [
  {
    id: 'horizon',
    question: 'What is your primary investment time horizon?',
    options: [
      { label: 'Less than 1 year (Short-term capital preservation)', score: 1 },
      { label: '1 to 3 years (Balanced growth with moderate liquidity)', score: 2 },
      { label: '3 to 7 years (Wealth building across equity/hybrid assets)', score: 3 },
      { label: '7+ years (Aggressive long-term wealth compounder)', score: 4 },
    ]
  },
  {
    id: 'volatility',
    question: 'How would you react if your portfolio dropped 20% in a month during a market correction?',
    options: [
      { label: 'Sell all holdings immediately to avoid further losses', score: 1 },
      { label: 'Panic slightly and hold cash without making new trades', score: 2 },
      { label: 'Stay calm, rebalance holdings according to plan', score: 3 },
      { label: 'Excitedly buy more quality stocks at discounted valuations', score: 4 },
    ]
  },
  {
    id: 'experience',
    question: 'What is your level of market experience with derivatives and equities?',
    options: [
      { label: 'Beginner (Fixed deposits, savings accounts, index funds)', score: 1 },
      { label: 'Intermediate (Active direct equity investor for 2+ years)', score: 2 },
      { label: 'Advanced (Futures & Options, swing trading, technical analysis)', score: 3 },
      { label: 'Expert / Quant (Algorithmic trading, volatility arbitrage)', score: 4 },
    ]
  },
  {
    id: 'goal',
    question: 'What is your financial objective for this portfolio?',
    options: [
      { label: 'Protect principal with regular dividend/interest yields', score: 1 },
      { label: 'Beat inflation with steady compound annual growth (12-15%)', score: 2 },
      { label: 'Maximize aggressive capital appreciation (18-25%+ CAGR)', score: 3 },
      { label: 'High-frequency momentum alpha & active intraday trading', score: 4 },
    ]
  }
];

const RiskAssessmentModal: React.FC<RiskAssessmentModalProps> = ({ isOpen, onClose }) => {
  const { currentUser, updateUserProfile } = useAppStore();
  const [answers, setAnswers] = useState<Record<string, number>>({
    horizon: 3,
    volatility: 3,
    experience: 2,
    goal: 3
  });
  const [submitted, setSubmitted] = useState(false);

  if (!isOpen) return null;

  const totalScore = Object.values(answers).reduce((a, b) => a + b, 0);

  const getProfile = (score: number): 'conservative' | 'moderate' | 'aggressive' => {
    if (score <= 7) return 'conservative';
    if (score <= 11) return 'moderate';
    return 'aggressive';
  };

  const determinedProfile = getProfile(totalScore);

  const handleSave = () => {
    updateUserProfile({ riskProfile: determinedProfile });
    setSubmitted(true);
    setTimeout(() => {
      setSubmitted(false);
      onClose();
    }, 1500);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md p-4 animate-fade-in">
      <div className="nova-card border border-nova-border/80 w-full max-w-lg p-6 relative shadow-2xl max-h-[90vh] overflow-y-auto">
        <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-emerald-500 via-amber-500 to-rose-500" />

        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-nova-text-muted hover:text-nova-text p-1.5 rounded-lg hover:bg-nova-surface transition-colors"
        >
          <X size={18} />
        </button>

        {submitted ? (
          <div className="py-8 text-center space-y-4 animate-in fade-in zoom-in-95">
            <div className="w-16 h-16 rounded-full bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center mx-auto text-emerald-400">
              <CheckCircle2 size={36} />
            </div>
            <h3 className="text-xl font-display font-bold text-nova-text">Risk Profile Updated!</h3>
            <p className="text-sm text-nova-text-muted">
              Your profile is now set to <strong className="text-nova-accent capitalize">{determinedProfile}</strong> (Score: {totalScore}/16). AI recommendations will automatically tune to this risk tolerance.
            </p>
          </div>
        ) : (
          <div className="space-y-5">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded bg-amber-500/20 text-amber-400 border border-amber-500/30">
                  Investor Suitability
                </span>
                <span className="text-xs text-nova-text-muted">Current Profile: {currentUser?.riskProfile || 'moderate'}</span>
              </div>
              <h3 className="text-xl font-display font-bold text-nova-text">Risk Profile Assessment</h3>
              <p className="text-xs text-nova-text-muted">Help our AI engine calibrate stock picks, asset allocation, and volatility guardrails.</p>
            </div>

            {/* Questions */}
            <div className="space-y-4">
              {QUESTIONS.map((q, idx) => (
                <div key={q.id} className="p-3.5 rounded-xl bg-nova-bg/50 border border-nova-border/70 space-y-2">
                  <p className="text-xs font-bold text-nova-text">
                    <span className="text-nova-accent mr-1.5">{idx + 1}.</span> {q.question}
                  </p>
                  <div className="space-y-1.5">
                    {q.options.map(opt => (
                      <label
                        key={opt.score}
                        className={`flex items-start gap-2.5 p-2 rounded-lg cursor-pointer text-xs transition-all ${
                          answers[q.id] === opt.score
                            ? 'bg-nova-accent/10 border border-nova-accent/40 text-nova-text font-semibold'
                            : 'hover:bg-nova-surface2 text-nova-text-muted border border-transparent'
                        }`}
                      >
                        <input
                          type="radio"
                          name={q.id}
                          checked={answers[q.id] === opt.score}
                          onChange={() => setAnswers({ ...answers, [q.id]: opt.score })}
                          className="mt-0.5 accent-nova-accent"
                        />
                        <span>{opt.label}</span>
                      </label>
                    ))}
                  </div>
                </div>
              ))}
            </div>

            {/* Computed Result Preview */}
            <div className="p-3 rounded-xl bg-gradient-to-r from-nova-card to-nova-surface border border-nova-border flex items-center justify-between">
              <div>
                <p className="text-[11px] text-nova-text-muted">Calculated Suitability Score:</p>
                <p className="text-sm font-bold text-nova-text font-mono">{totalScore} / 16 Points</p>
              </div>
              <div className="text-right">
                <span className="text-xs font-bold px-3 py-1 rounded-lg uppercase tracking-wider bg-nova-accent/20 text-nova-accent border border-nova-accent/30">
                  {determinedProfile}
                </span>
              </div>
            </div>

            <div className="flex items-center gap-3 pt-2">
              <button
                type="button"
                onClick={onClose}
                className="nova-btn-outline text-xs flex-1 py-2.5"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleSave}
                className="nova-btn-primary text-xs flex-1 py-2.5 flex items-center justify-center gap-2 font-bold"
              >
                Save & Apply Profile <ArrowRight size={14} />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default RiskAssessmentModal;

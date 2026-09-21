import React from 'react';
import { X, Shield, TrendingUp, Brain, BarChart2, Zap } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAppStore } from '@/stores/useAppStore';
import Logo from '@/components/ui/Logo';

const benefits = [
  { icon: Brain, label: 'AI-Powered Recommendations', desc: 'Get personalized stock picks powered by advanced AI models' },
  { icon: TrendingUp, label: 'Real-Time Portfolio Analytics', desc: 'Track your investments with institutional-grade tools' },
  { icon: Zap, label: 'Algorithmic Trading', desc: 'Build and deploy automated trading strategies' },
  { icon: BarChart2, label: 'Expert Research Reports', desc: 'Access analyst reports and downloadable PDF insights' },
];

const AuthModal: React.FC = () => {
  const { authModalOpen, authModalReason, closeAuthModal } = useAppStore();
  const navigate = useNavigate();

  if (!authModalOpen) return null;

  const handleLogin = () => {
    closeAuthModal();
    navigate('/login');
  };

  const handleSignup = () => {
    closeAuthModal();
    navigate('/create-account');
  };

  return (
    <div className="fixed inset-0 z-[999] flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/70 backdrop-blur-sm"
        onClick={closeAuthModal}
      />

      {/* Modal */}
      <div className="relative glass-modal rounded-2xl border border-nova-border/60 shadow-nova-modal w-full max-w-md max-h-[calc(100vh-2rem)] overflow-y-auto animate-slide-up">
        {/* Header gradient */}
        <div className="absolute top-0 left-0 right-0 h-1 rounded-t-2xl bg-gradient-to-r from-nova-primary via-nova-accent to-nova-primary" />

        {/* Close */}
        <button
          onClick={closeAuthModal}
          className="absolute top-4 right-4 nova-btn-ghost p-2 rounded-xl z-10"
        >
          <X size={18} />
        </button>

        <div className="p-5 sm:p-7">
          {/* Logo */}
          <div className="flex justify-center mb-5">
            <Logo size="md" />
          </div>

          {/* Lock Icon */}
          <div className="flex justify-center mb-4">
            <div className="w-14 h-14 rounded-2xl bg-nova-primary/10 border border-nova-primary/20 flex items-center justify-center">
              <Shield size={28} className="text-nova-primary-light" />
            </div>
          </div>

          <h2 className="text-xl font-display font-bold text-nova-text text-center mb-2">
            Premium Feature
          </h2>
          <p className="text-nova-text-muted text-sm text-center mb-6 leading-relaxed">
            {authModalReason || 'Sign in or create a free account to access this feature and unlock the full power of NovaEq.'}
          </p>

          {/* Benefits */}
          <div className="space-y-3 mb-7">
            {benefits.map(({ icon: Icon, label, desc }) => (
              <div key={label} className="flex items-start gap-3 p-3 rounded-xl bg-nova-surface2/50 border border-nova-border">
                <div className="w-8 h-8 rounded-lg bg-nova-accent/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                  <Icon size={16} className="text-nova-accent" />
                </div>
                <div>
                  <p className="text-sm font-semibold text-nova-text">{label}</p>
                  <p className="text-xs text-nova-text-muted mt-0.5">{desc}</p>
                </div>
              </div>
            ))}
          </div>

          {/* CTA Buttons */}
          <div className="space-y-3">
            <button
              onClick={handleSignup}
              className="nova-btn-primary w-full py-3 text-center font-semibold"
            >
              Create Free Account
            </button>
            <button
              onClick={handleLogin}
              className="nova-btn-outline w-full py-3 text-center font-semibold"
            >
              Sign In to Existing Account
            </button>
          </div>

          <p className="text-center text-xs text-nova-text-subtle mt-4">
            Free plan available · No credit card required
          </p>
        </div>
      </div>
    </div>
  );
};

export default AuthModal;

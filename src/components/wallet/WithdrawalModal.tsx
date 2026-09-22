import React, { useState } from 'react';
import {
  X,
  Building,
  ShieldCheck,
  CheckCircle2,
  AlertCircle,
  Clock,
  ArrowRight,
  RefreshCw,
  Lock,
  Wallet
} from 'lucide-react';
import { useAppStore } from '@/stores/useAppStore';
import { formatCurrency } from '@/lib/utils';

interface WithdrawalModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const WithdrawalModal: React.FC<WithdrawalModalProps> = ({ isOpen, onClose }) => {
  const { withdraw, walletBalance, currentUser } = useAppStore();
  const [amount, setAmount] = useState('10000');
  const [step, setStep] = useState<'details' | 'verifying' | 'confirmed'>('details');
  const [form, setForm] = useState({
    holderName: currentUser?.name || 'Alex Reynolds',
    bankName: 'HDFC Bank',
    accountNumber: '5010043298124',
    confirmAccountNumber: '5010043298124',
    ifsc: 'HDFC0000240',
    accountType: 'Savings'
  });
  const [error, setError] = useState('');

  if (!isOpen) return null;

  const numAmount = Number(amount);

  const handleStartVerification = (e: React.FormEvent) => {
    e.preventDefault();
    if (!numAmount || numAmount <= 0) {
      setError('Please enter a valid withdrawal amount.');
      return;
    }
    if (numAmount > walletBalance) {
      setError(`Insufficient wallet balance. Maximum withdrawable amount is ${formatCurrency(walletBalance)}.`);
      return;
    }
    if (form.accountNumber !== form.confirmAccountNumber) {
      setError('Bank Account numbers do not match.');
      return;
    }
    if (!form.ifsc || form.ifsc.length < 9) {
      setError('Please enter a valid IFSC code.');
      return;
    }

    setError('');
    setStep('verifying');

    // Simulate Penny Drop Bank Verification Step
    setTimeout(() => {
      withdraw(numAmount, {
        bankName: form.bankName,
        accountNumber: form.accountNumber,
        ifsc: form.ifsc
      });
      setStep('confirmed');
    }, 2200);
  };

  const handleClose = () => {
    setStep('details');
    setError('');
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md p-4 animate-fade-in">
      <div className="nova-card border border-nova-border/80 w-full max-w-lg p-6 relative shadow-2xl overflow-hidden">
        {/* Top Gradient Banner */}
        <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-amber-500 via-emerald-500 to-cyan-500" />

        <button
          onClick={handleClose}
          disabled={step === 'verifying'}
          className="absolute top-4 right-4 text-nova-text-muted hover:text-nova-text p-1.5 rounded-lg hover:bg-nova-surface transition-colors"
        >
          <X size={18} />
        </button>

        {/* STEP 1: Bank Details & Amount Form */}
        {step === 'details' && (
          <form onSubmit={handleStartVerification} className="space-y-4">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                  Instant Bank Payout
                </span>
                <span className="text-xs text-nova-text-muted">NEFT / RTGS / IMPS</span>
              </div>
              <h3 className="text-xl font-display font-bold text-nova-text">Withdraw Funds</h3>
              <p className="text-xs text-nova-text-muted">
                Available Wallet Balance: <span className="font-bold text-emerald-400">{formatCurrency(walletBalance)}</span>
              </p>
            </div>

            {/* Amount */}
            <div>
              <label className="nova-label text-xs">Withdrawal Amount (₹)</label>
              <div className="relative">
                <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-lg font-bold text-nova-text-muted">₹</span>
                <input
                  type="number"
                  min="500"
                  max={walletBalance}
                  value={amount}
                  onChange={e => setAmount(e.target.value)}
                  className="nova-input pl-8 font-mono text-lg font-bold text-nova-text"
                  placeholder="10000"
                  required
                />
                <button
                  type="button"
                  onClick={() => setAmount(String(Math.floor(walletBalance)))}
                  className="absolute right-2.5 top-1/2 -translate-y-1/2 px-2.5 py-1 text-xs font-bold text-nova-accent hover:bg-nova-accent/10 rounded-md transition-colors"
                >
                  MAX
                </button>
              </div>
            </div>

            {/* Bank Information Grid */}
            <div className="bg-nova-bg/50 border border-nova-border/70 rounded-xl p-4 space-y-3">
              <p className="text-xs font-bold text-nova-text flex items-center gap-1.5">
                <Building size={14} className="text-nova-accent" /> Receiving Bank Account Details
              </p>

              <div>
                <label className="nova-label text-[11px]">Account Holder Name</label>
                <input
                  type="text"
                  required
                  value={form.holderName}
                  onChange={e => setForm({ ...form, holderName: e.target.value })}
                  className="nova-input text-xs"
                  placeholder="Full name as per bank records"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="nova-label text-[11px]">Bank Name</label>
                  <select
                    value={form.bankName}
                    onChange={e => setForm({ ...form, bankName: e.target.value })}
                    className="nova-input text-xs"
                  >
                    {['HDFC Bank', 'ICICI Bank', 'State Bank of India', 'Axis Bank', 'Kotak Mahindra Bank', 'Punjab National Bank', 'Bank of Baroda'].map(b => (
                      <option key={b} value={b}>{b}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="nova-label text-[11px]">Account Type</label>
                  <select
                    value={form.accountType}
                    onChange={e => setForm({ ...form, accountType: e.target.value })}
                    className="nova-input text-xs"
                  >
                    <option value="Savings">Savings Account</option>
                    <option value="Current">Current Account</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="nova-label text-[11px]">Account Number</label>
                  <input
                    type="text"
                    required
                    value={form.accountNumber}
                    onChange={e => setForm({ ...form, accountNumber: e.target.value })}
                    className="nova-input text-xs font-mono"
                    placeholder="5010043298124"
                  />
                </div>
                <div>
                  <label className="nova-label text-[11px]">Confirm Account Number</label>
                  <input
                    type="text"
                    required
                    value={form.confirmAccountNumber}
                    onChange={e => setForm({ ...form, confirmAccountNumber: e.target.value })}
                    className="nova-input text-xs font-mono"
                    placeholder="Re-enter account number"
                  />
                </div>
              </div>

              <div>
                <label className="nova-label text-[11px]">IFSC Code</label>
                <input
                  type="text"
                  required
                  value={form.ifsc}
                  onChange={e => setForm({ ...form, ifsc: e.target.value.toUpperCase() })}
                  className="nova-input text-xs font-mono uppercase"
                  placeholder="HDFC0000240"
                  maxLength={11}
                />
              </div>
            </div>

            {error && (
              <div className="flex items-center gap-2 text-xs text-rose-400 bg-rose-500/10 border border-rose-500/20 p-2.5 rounded-lg">
                <AlertCircle size={14} className="flex-shrink-0" />
                <span>{error}</span>
              </div>
            )}

            <div className="flex items-center justify-between text-[11px] text-nova-text-subtle">
              <span className="flex items-center gap-1"><ShieldCheck size={13} className="text-emerald-400" /> Automated ₹1 Penny Drop Verification</span>
              <span className="flex items-center gap-1"><Lock size={12} className="text-nova-accent" /> 100% Encrypted</span>
            </div>

            <div className="flex items-center gap-3 pt-2">
              <button
                type="button"
                onClick={handleClose}
                className="nova-btn-outline text-xs flex-1 py-2.5"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={!numAmount || numAmount <= 0}
                className="nova-btn-primary text-xs flex-1 py-2.5 flex items-center justify-center gap-2 font-bold"
              >
                Verify & Withdraw <ArrowRight size={14} />
              </button>
            </div>
          </form>
        )}

        {/* STEP 2: Penny-Drop Live Bank Verification Simulation */}
        {step === 'verifying' && (
          <div className="py-10 text-center space-y-5 animate-fade-in">
            <div className="relative w-20 h-20 mx-auto">
              <div className="w-20 h-20 rounded-full border-4 border-nova-accent/20 border-t-nova-accent animate-spin" />
              <div className="absolute inset-0 flex items-center justify-center">
                <Building size={28} className="text-nova-accent" />
              </div>
            </div>

            <div>
              <h3 className="text-lg font-display font-bold text-nova-text mb-1">
                Verifying Linked Bank Account...
              </h3>
              <p className="text-xs text-nova-text-muted max-w-sm mx-auto leading-relaxed">
                Executing automated penny drop validation with <strong className="text-nova-text">{form.bankName}</strong>. Validating account holder name matches <span className="text-nova-accent font-semibold">{form.holderName}</span>.
              </p>
            </div>

            <div className="bg-nova-bg/50 border border-nova-border/70 rounded-xl p-3.5 max-w-xs mx-auto text-left text-xs space-y-1 font-mono text-nova-text-subtle">
              <div className="flex justify-between"><span>IFSC Code:</span><span className="text-nova-text font-bold">{form.ifsc}</span></div>
              <div className="flex justify-between"><span>A/C Number:</span><span className="text-nova-text font-bold">•••• •••• {form.accountNumber.slice(-4)}</span></div>
              <div className="flex justify-between"><span>Status:</span><span className="text-amber-400 font-bold">Verifying with NPCI...</span></div>
            </div>
          </div>
        )}

        {/* STEP 3: Bank Verification Complete & 24hr Settlement Notice */}
        {step === 'confirmed' && (
          <div className="py-8 text-center space-y-5 animate-in fade-in zoom-in-95">
            <div className="w-16 h-16 rounded-full bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center mx-auto text-emerald-400 shadow-lg shadow-emerald-500/20">
              <CheckCircle2 size={36} />
            </div>

            <div className="space-y-1">
              <span className="text-[11px] font-bold uppercase tracking-wider px-3 py-1 rounded-full bg-emerald-500/15 text-emerald-400 border border-emerald-500/25">
                Bank Verification Completed
              </span>
              <h3 className="text-2xl font-display font-black text-nova-text pt-2">
                Withdrawal Initiated
              </h3>
            </div>

            <div className="bg-gradient-to-br from-nova-surface2 to-nova-bg border border-nova-border/80 rounded-2xl p-5 text-left space-y-3">
              <div className="flex items-center justify-between border-b border-nova-border/60 pb-2.5">
                <span className="text-xs text-nova-text-muted">Amount Deducted:</span>
                <span className="text-lg font-mono font-bold text-emerald-400">{formatCurrency(numAmount)}</span>
              </div>

              <div className="space-y-1.5 text-xs">
                <div className="flex justify-between text-nova-text-muted">
                  <span>Beneficiary Name:</span>
                  <span className="text-nova-text font-semibold">{form.holderName}</span>
                </div>
                <div className="flex justify-between text-nova-text-muted">
                  <span>Destination Bank:</span>
                  <span className="text-nova-text font-semibold">{form.bankName}</span>
                </div>
                <div className="flex justify-between text-nova-text-muted">
                  <span>Account Number:</span>
                  <span className="text-nova-text font-mono font-semibold">•••• •••• {form.accountNumber.slice(-4)}</span>
                </div>
                <div className="flex justify-between text-nova-text-muted">
                  <span>Reference ID:</span>
                  <span className="text-nova-text font-mono text-[11px]">WDR-{Math.random().toString(36).substr(2, 9).toUpperCase()}</span>
                </div>
              </div>

              <div className="pt-2 border-t border-nova-border/60 flex items-start gap-2 text-xs text-amber-300/90 bg-amber-500/10 p-2.5 rounded-lg border border-amber-500/20">
                <Clock size={16} className="text-amber-400 flex-shrink-0 mt-0.5" />
                <p>
                  <strong>Your bank verification is complete.</strong> Your money will be credited to your bank account within <span className="underline font-bold">24 working hours</span>.
                </p>
              </div>
            </div>

            <button
              onClick={handleClose}
              className="nova-btn-primary w-full py-2.5 text-xs font-bold"
            >
              Done & View Wallet
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default WithdrawalModal;

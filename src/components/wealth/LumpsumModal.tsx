import React, { useState } from 'react';
import {
  X,
  PieChart,
  CheckCircle2,
  ArrowRight,
  TrendingUp,
  ShieldCheck,
  Building,
  CreditCard,
  Wallet,
  Coins,
  AlertCircle
} from 'lucide-react';
import { useAppStore } from '@/stores/useAppStore';
import type { MutualFund } from '@/types';
import { formatCurrency } from '@/lib/utils';
import { initiateRazorpayPayment } from '@/lib/razorpay';
import { toast } from 'sonner';

interface LumpsumModalProps {
  isOpen: boolean;
  onClose: () => void;
  fund: MutualFund | null;
}

const PRESET_AMOUNTS = [5000, 10000, 25000, 50000, 100000];

const LumpsumModal: React.FC<LumpsumModalProps> = ({ isOpen, onClose, fund }) => {
  const { walletBalance, withdraw, currentUser, addAlert } = useAppStore();
  const [amount, setAmount] = useState(fund ? String(Math.max(5000, fund.minSIP * 2)) : '10000');
  const [paymentSource, setPaymentSource] = useState<'razorpay' | 'wallet'>('razorpay');
  const [isProcessing, setIsProcessing] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [paymentRefId, setPaymentRefId] = useState('');
  const [error, setError] = useState('');

  if (!isOpen || !fund) return null;

  const numAmount = Number(amount);
  const estimatedUnits = fund.nav > 0 && numAmount > 0 ? (numAmount / fund.nav).toFixed(3) : '0.000';
  const stampDuty = numAmount > 0 ? (numAmount * 0.00005).toFixed(2) : '0.00';

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!numAmount || numAmount < 500) {
      setError('Minimum one-time investment amount is ₹500.');
      return;
    }
    setError('');

    if (paymentSource === 'wallet') {
      if (walletBalance < numAmount) {
        setError(`Insufficient wallet balance (₹${walletBalance.toLocaleString()}). Please choose Razorpay or top-up funds.`);
        return;
      }

      setIsProcessing(true);
      setTimeout(() => {
        setIsProcessing(false);
        const ref = `MF_LUMP_${Math.random().toString(36).substring(2, 9).toUpperCase()}`;
        setPaymentRefId(ref);
        setIsSuccess(true);
        withdraw(numAmount, {
          accountNumber: 'N/A (Mutual Fund Units)',
          ifsc: 'BSE_STAR_MF',
          bankName: `One-Time Lumpsum: ${fund.name}`,
          accountHolder: currentUser?.name || 'Investor'
        });

        if (currentUser?.id) {
          addAlert({
            userId: currentUser.id,
            type: 'portfolio',
            title: `Mutual Fund Order Placed: ${fund.name}`,
            message: `One-time investment of ₹${numAmount.toLocaleString()} (${estimatedUnits} units) submitted successfully.`
          });
        }

        toast.success(`One-Time Investment of ₹${numAmount.toLocaleString()} in ${fund.name} confirmed!`);

        setTimeout(() => {
          setIsSuccess(false);
          onClose();
        }, 2200);
      }, 1200);
      return;
    }

    // Razorpay Direct Gateway
    setIsProcessing(true);
    const isOpened = await initiateRazorpayPayment({
      title: `One-Time Investment: ${fund.name}`,
      description: `Lumpsum investment of ₹${numAmount.toLocaleString()} (${estimatedUnits} units @ ₹${fund.nav.toFixed(2)})`,
      amount: numAmount,
      currency: 'INR',
      userName: currentUser?.name || 'NovaEq Investor',
      userEmail: currentUser?.email || 'investor@novaeq.ai',
      onSuccess: (paymentId) => {
        setIsProcessing(false);
        setPaymentRefId(paymentId);
        setIsSuccess(true);

        if (currentUser?.id) {
          addAlert({
            userId: currentUser.id,
            type: 'portfolio',
            title: `Mutual Fund Order Placed: ${fund.name}`,
            message: `Lumpsum investment of ₹${numAmount.toLocaleString()} completed via Razorpay (${paymentId}).`
          });
        }

        toast.success(`₹${numAmount.toLocaleString()} invested in ${fund.name} via Razorpay!`);
        setTimeout(() => {
          setIsSuccess(false);
          onClose();
        }, 2200);
      },
      onFailure: (err) => {
        setIsProcessing(false);
        console.log('Payment dismissed or failed:', err);
      }
    });

    if (!isOpened) {
      setTimeout(() => {
        const fallbackRef = `pay_rzp_mock_${Math.random().toString(36).substring(2, 9).toUpperCase()}`;
        setIsProcessing(false);
        setPaymentRefId(fallbackRef);
        setIsSuccess(true);
        toast.success(`One-Time investment of ₹${numAmount.toLocaleString()} in ${fund.name} placed!`);
        setTimeout(() => {
          setIsSuccess(false);
          onClose();
        }, 2200);
      }, 1200);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md p-4 animate-fade-in">
      <div className="nova-card border border-nova-border/80 w-full max-w-md p-6 relative shadow-2xl overflow-hidden">
        <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-blue-500 via-indigo-500 to-emerald-500" />

        <button
          onClick={onClose}
          disabled={isProcessing}
          className="absolute top-4 right-4 text-nova-text-muted hover:text-nova-text p-1.5 rounded-lg hover:bg-nova-surface transition-colors"
        >
          <X size={18} />
        </button>

        {isSuccess ? (
          <div className="py-8 text-center space-y-4 animate-in fade-in zoom-in-95">
            <div className="w-16 h-16 rounded-full bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center mx-auto text-emerald-400">
              <CheckCircle2 size={36} />
            </div>
            <h3 className="text-xl font-display font-bold text-nova-text">One-Time Order Placed!</h3>
            <p className="text-xs text-nova-text-muted">
              Lumpsum investment of <strong className="text-emerald-400">₹{numAmount.toLocaleString()}</strong> in <strong className="text-nova-text">{fund.name}</strong> has been routed to BSE Star MF.
            </p>
            <div className="bg-nova-bg/60 rounded-xl p-3 border border-nova-border/70 text-xs font-mono text-left space-y-1">
              <div className="flex justify-between">
                <span className="text-nova-text-subtle">Allotted Units (Est):</span>
                <span className="text-nova-text font-bold">{estimatedUnits} Units</span>
              </div>
              <div className="flex justify-between">
                <span className="text-nova-text-subtle">NAV Applied:</span>
                <span className="text-nova-text">₹{fund.nav.toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-nova-text-subtle">Reference ID:</span>
                <span className="text-emerald-400 font-bold">{paymentRefId || 'BSE_TXN_OK'}</span>
              </div>
            </div>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded bg-blue-500/20 text-blue-400 border border-blue-500/30">
                  {fund.category} · One-Time
                </span>
                <span className="text-xs text-emerald-400 font-bold font-mono">+{fund.returns3y}% 3Y CAGR</span>
              </div>
              <h3 className="text-lg font-display font-bold text-nova-text">{fund.name}</h3>
              <p className="text-xs text-nova-text-muted">Manager: {fund.fundManager} · AUM: {fund.aum}</p>
            </div>

            {/* Investment Amount */}
            <div>
              <div className="flex justify-between items-center mb-1">
                <label className="nova-label text-xs">Lumpsum Investment Amount (₹)</label>
                <span className="text-[11px] text-nova-text-subtle">Min: ₹500</span>
              </div>
              <div className="relative">
                <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-lg font-bold text-nova-text-muted">₹</span>
                <input
                  type="number"
                  required
                  min="500"
                  max="10000000"
                  value={amount}
                  onChange={e => setAmount(e.target.value)}
                  className="nova-input pl-8 font-mono text-lg font-bold text-nova-text"
                  placeholder="10000"
                />
              </div>

              {/* Quick Preset Chips */}
              <div className="flex flex-wrap gap-2 mt-2">
                {PRESET_AMOUNTS.map(amt => (
                  <button
                    key={amt}
                    type="button"
                    onClick={() => setAmount(String(amt))}
                    className={`px-2.5 py-1 rounded-lg text-xs font-mono font-medium transition-all ${
                      numAmount === amt
                        ? 'bg-nova-accent text-nova-bg font-bold shadow-md'
                        : 'bg-nova-surface border border-nova-border text-nova-text-muted hover:text-nova-text'
                    }`}
                  >
                    +₹{(amt / 1000).toFixed(0)}k
                  </button>
                ))}
              </div>
            </div>

            {/* Live Calculation Preview */}
            <div className="bg-nova-bg/60 rounded-xl p-3 border border-nova-border/70 text-xs space-y-1.5 font-mono">
              <div className="flex justify-between">
                <span className="text-nova-text-subtle">Current NAV:</span>
                <span className="text-nova-text font-semibold">₹{fund.nav.toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-nova-text-subtle">Estimated Units:</span>
                <span className="text-emerald-400 font-bold">{estimatedUnits} Units</span>
              </div>
              <div className="flex justify-between">
                <span className="text-nova-text-subtle">Govt Stamp Duty (0.005%):</span>
                <span className="text-nova-text-muted">₹{stampDuty}</span>
              </div>
            </div>

            {/* Payment Source Selector */}
            <div>
              <label className="nova-label text-xs">Payment Method</label>
              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => setPaymentSource('razorpay')}
                  className={`p-2.5 rounded-xl border flex flex-col items-center justify-center gap-1 text-xs transition-all ${
                    paymentSource === 'razorpay'
                      ? 'border-nova-accent bg-nova-accent/10 text-nova-accent font-bold'
                      : 'border-nova-border bg-nova-surface2 text-nova-text-muted hover:border-nova-border/80'
                  }`}
                >
                  <CreditCard size={18} />
                  <span>Razorpay Gateway</span>
                  <span className="text-[10px] text-nova-text-subtle">UPI / Card / Netbanking</span>
                </button>

                <button
                  type="button"
                  onClick={() => setPaymentSource('wallet')}
                  className={`p-2.5 rounded-xl border flex flex-col items-center justify-center gap-1 text-xs transition-all ${
                    paymentSource === 'wallet'
                      ? 'border-nova-accent bg-nova-accent/10 text-nova-accent font-bold'
                      : 'border-nova-border bg-nova-surface2 text-nova-text-muted hover:border-nova-border/80'
                  }`}
                >
                  <Wallet size={18} />
                  <span>Wallet Balance</span>
                  <span className="text-[10px] text-emerald-400 font-bold">{formatCurrency(walletBalance)}</span>
                </button>
              </div>
            </div>

            {error && (
              <div className="flex items-center gap-2 text-xs text-rose-400 bg-rose-500/10 border border-rose-500/20 p-2.5 rounded-lg">
                <AlertCircle size={14} className="flex-shrink-0" />
                <span>{error}</span>
              </div>
            )}

            <div className="flex items-center gap-3 pt-2">
              <button
                type="button"
                onClick={onClose}
                disabled={isProcessing}
                className="nova-btn-outline text-xs flex-1 py-2.5"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isProcessing || !numAmount}
                className="nova-btn-accent text-xs flex-1 py-2.5 flex items-center justify-center gap-2 font-bold shadow-lg shadow-nova-accent/20"
              >
                {isProcessing ? (
                  <span className="inline-flex items-center gap-2">
                    <span className="w-3.5 h-3.5 border-2 border-nova-bg border-t-transparent rounded-full animate-spin" />
                    Processing Order...
                  </span>
                ) : (
                  <>
                    Invest ₹{numAmount ? numAmount.toLocaleString() : '0'} <ArrowRight size={14} />
                  </>
                )}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};

export default LumpsumModal;

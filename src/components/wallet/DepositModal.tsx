import React, { useState } from 'react';
import {
  X,
  CreditCard,
  Smartphone,
  Building2,
  ShieldCheck,
  CheckCircle2,
  Lock,
  ArrowRight,
  Sparkles,
  AlertCircle
} from 'lucide-react';
import { useAppStore } from '@/stores/useAppStore';
import { formatCurrency } from '@/lib/utils';
import { initiateRazorpayPayment, RAZORPAY_TEST_KEY } from '@/lib/razorpay';
import { toast } from 'sonner';

interface DepositModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const PRESET_AMOUNTS = [5000, 10000, 25000, 50000, 100000];

const DepositModal: React.FC<DepositModalProps> = ({ isOpen, onClose }) => {
  const { deposit, walletBalance, currentUser } = useAppStore();
  const [amount, setAmount] = useState('25000');
  const [paymentMethod, setPaymentMethod] = useState<'upi' | 'card' | 'netbanking'>('upi');
  const [upiId, setUpiId] = useState('trader@oksbi');
  const [cardNumber, setCardNumber] = useState('4532 •••• •••• 8821');
  const [cardExpiry, setCardExpiry] = useState('08/28');
  const [cardCvv, setCardCvv] = useState('742');
  const [bank, setBank] = useState('HDFC Bank');
  const [isProcessing, setIsProcessing] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [paymentRefId, setPaymentRefId] = useState('');
  const [error, setError] = useState('');

  if (!isOpen) return null;

  const numAmount = Number(amount);

  const handleDeposit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!numAmount || numAmount < 100) {
      setError('Minimum deposit amount is ₹100.');
      return;
    }
    setError('');
    setIsProcessing(true);

    const isGatewayOpened = await initiateRazorpayPayment({
      title: 'Add Funds to NovaEq Wallet',
      description: `Wallet top-up of ₹${numAmount.toLocaleString()} via Razorpay Sandbox`,
      amount: numAmount,
      currency: 'INR',
      userName: currentUser?.name || 'NovaEq Trader',
      userEmail: currentUser?.email || 'trader@novaeq.ai',
      onSuccess: (paymentId) => {
        setIsProcessing(false);
        setPaymentRefId(paymentId);
        setIsSuccess(true);
        deposit(numAmount, `Razorpay Gateway (${paymentId})`);
        toast.success(`₹${numAmount.toLocaleString()} credited to your trading wallet via Razorpay!`);

        setTimeout(() => {
          setIsSuccess(false);
          onClose();
        }, 2500);
      },
      onFailure: (err) => {
        setIsProcessing(false);
        console.log('Payment dismissed or failed:', err);
      }
    });

    if (!isGatewayOpened) {
      // Fallback in-app payment simulation if Razorpay script is blocked or offline
      setTimeout(() => {
        const fallbackRef = `pay_rzp_mock_${Math.random().toString(36).substring(2, 9).toUpperCase()}`;
        setIsProcessing(false);
        setPaymentRefId(fallbackRef);
        setIsSuccess(true);
        deposit(numAmount, paymentMethod === 'upi' ? `Razorpay UPI (${upiId})` : paymentMethod === 'card' ? 'Razorpay Card Gateway' : `Razorpay Netbanking (${bank})`);
        toast.success(`₹${numAmount.toLocaleString()} added to your wallet!`);

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
        {/* Header decoration */}
        <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-blue-600 via-emerald-500 to-indigo-600" />

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
            <h3 className="text-xl font-display font-bold text-nova-text">Payment Successful!</h3>
            <p className="text-sm text-nova-text-muted">
              <span className="text-emerald-400 font-bold font-mono text-base">₹{numAmount.toLocaleString()}</span> has been instantly credited to your NovaEq trading wallet.
            </p>
            <div className="bg-nova-bg/60 rounded-xl p-3 border border-nova-border/70 text-xs text-nova-text-subtle font-mono">
              Reference: RZP_TEST_{Math.random().toString(36).substr(2, 9).toUpperCase()}
            </div>
          </div>
        ) : (
          <form onSubmit={handleDeposit} className="space-y-5">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded bg-blue-500/20 text-blue-400 border border-blue-500/30">
                  Razorpay Demo Sandbox
                </span>
                <span className="text-xs text-nova-text-muted font-mono">Key: rzp_test_...</span>
              </div>
              <h3 className="text-xl font-display font-bold text-nova-text">Add Funds to Wallet</h3>
              <p className="text-xs text-nova-text-muted">Current Balance: <span className="font-semibold text-nova-text">{formatCurrency(walletBalance)}</span></p>
            </div>

            {/* Amount Selection */}
            <div>
              <label className="nova-label text-xs">Enter Amount (₹)</label>
              <div className="relative">
                <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-lg font-bold text-nova-text-muted">₹</span>
                <input
                  type="number"
                  min="100"
                  max="10000000"
                  value={amount}
                  onChange={e => setAmount(e.target.value)}
                  className="nova-input pl-8 font-mono text-lg font-bold text-nova-text"
                  placeholder="25000"
                  required
                />
              </div>

              {/* Preset Chips */}
              <div className="flex flex-wrap gap-2 mt-2.5">
                {PRESET_AMOUNTS.map(amt => (
                  <button
                    key={amt}
                    type="button"
                    onClick={() => setAmount(String(amt))}
                    className={`px-2.5 py-1 rounded-lg text-xs font-mono font-medium transition-all ${
                      numAmount === amt
                        ? 'bg-nova-accent text-nova-bg font-bold shadow-md shadow-nova-accent/20'
                        : 'bg-nova-surface border border-nova-border text-nova-text-muted hover:text-nova-text'
                    }`}
                  >
                    +₹{(amt / 1000).toFixed(0)}k
                  </button>
                ))}
              </div>
            </div>

            {/* Payment Method Selector */}
            <div>
              <label className="nova-label text-xs">Payment Method</label>
              <div className="grid grid-cols-3 gap-2">
                {[
                  { id: 'upi', label: 'UPI / QR', icon: Smartphone },
                  { id: 'card', label: 'Debit / Card', icon: CreditCard },
                  { id: 'netbanking', label: 'Netbanking', icon: Building2 },
                ].map(({ id, label, icon: Icon }) => (
                  <button
                    key={id}
                    type="button"
                    onClick={() => setPaymentMethod(id as any)}
                    className={`p-2.5 rounded-xl border flex flex-col items-center justify-center gap-1.5 text-xs transition-all ${
                      paymentMethod === id
                        ? 'border-nova-accent bg-nova-accent/10 text-nova-accent font-bold'
                        : 'border-nova-border bg-nova-surface2 text-nova-text-muted hover:border-nova-border/80'
                    }`}
                  >
                    <Icon size={18} />
                    <span>{label}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Payment Method Specific Inputs */}
            {paymentMethod === 'upi' && (
              <div className="p-3 bg-nova-bg/50 border border-nova-border/70 rounded-xl space-y-2">
                <label className="nova-label text-[11px]">UPI ID / VPA</label>
                <input
                  type="text"
                  value={upiId}
                  onChange={e => setUpiId(e.target.value)}
                  className="nova-input text-xs"
                  placeholder="mobileNumber@upi / username@okhdfcbank"
                  required
                />
                <p className="text-[11px] text-nova-text-subtle flex items-center gap-1">
                  <ShieldCheck size={13} className="text-emerald-400" /> Supports Google Pay, PhonePe, Paytm, BHIM
                </p>
              </div>
            )}

            {paymentMethod === 'card' && (
              <div className="p-3 bg-nova-bg/50 border border-nova-border/70 rounded-xl space-y-2.5">
                <div>
                  <label className="nova-label text-[11px]">Card Number</label>
                  <input
                    type="text"
                    value={cardNumber}
                    onChange={e => setCardNumber(e.target.value)}
                    className="nova-input text-xs font-mono"
                    placeholder="4532 0000 0000 0000"
                    required
                  />
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="nova-label text-[11px]">Valid Thru</label>
                    <input
                      type="text"
                      value={cardExpiry}
                      onChange={e => setCardExpiry(e.target.value)}
                      className="nova-input text-xs font-mono"
                      placeholder="MM/YY"
                      required
                    />
                  </div>
                  <div>
                    <label className="nova-label text-[11px]">CVV</label>
                    <input
                      type="password"
                      maxLength={4}
                      value={cardCvv}
                      onChange={e => setCardCvv(e.target.value)}
                      className="nova-input text-xs font-mono"
                      placeholder="•••"
                      required
                    />
                  </div>
                </div>
              </div>
            )}

            {paymentMethod === 'netbanking' && (
              <div className="p-3 bg-nova-bg/50 border border-nova-border/70 rounded-xl space-y-2">
                <label className="nova-label text-[11px]">Select Bank</label>
                <select
                  value={bank}
                  onChange={e => setBank(e.target.value)}
                  className="nova-input text-xs"
                >
                  {['HDFC Bank', 'ICICI Bank', 'State Bank of India', 'Axis Bank', 'Kotak Mahindra Bank', 'Punjab National Bank'].map(b => (
                    <option key={b} value={b}>{b}</option>
                  ))}
                </select>
              </div>
            )}

            {error && (
              <div className="flex items-center gap-2 text-xs text-rose-400 bg-rose-500/10 border border-rose-500/20 p-2.5 rounded-lg">
                <AlertCircle size={14} className="flex-shrink-0" />
                <span>{error}</span>
              </div>
            )}

            {/* Security Guarantee */}
            <div className="flex items-center justify-between text-[11px] text-nova-text-subtle pt-1">
              <span className="flex items-center gap-1"><Lock size={12} className="text-emerald-400" /> 256-Bit SSL Encrypted</span>
              <span>Testing Environment (Demo Funds)</span>
            </div>

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
                    Processing Payment...
                  </span>
                ) : (
                  <>
                    Pay ₹{numAmount ? numAmount.toLocaleString() : '0'} <ArrowRight size={14} />
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

export default DepositModal;

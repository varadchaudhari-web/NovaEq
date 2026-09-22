import React, { useState } from 'react';
import {
  X,
  PieChart,
  Calendar,
  CheckCircle2,
  ArrowRight,
  TrendingUp,
  ShieldCheck,
  Building
} from 'lucide-react';
import { useAppStore } from '@/stores/useAppStore';
import type { MutualFund } from '@/types';
import { formatCurrency } from '@/lib/utils';

interface SIPModalProps {
  isOpen: boolean;
  onClose: () => void;
  fund: MutualFund | null;
}

const SIPModal: React.FC<SIPModalProps> = ({ isOpen, onClose, fund }) => {
  const { addSIP, walletBalance } = useAppStore();
  const [amount, setAmount] = useState(fund ? String(fund.minSIP) : '5000');
  const [frequency, setFrequency] = useState<'monthly' | 'weekly' | 'daily'>('monthly');
  const [debitDate, setDebitDate] = useState('05');
  const [isSuccess, setIsSuccess] = useState(false);

  if (!isOpen || !fund) return null;

  const numAmount = Number(amount);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!numAmount || numAmount < fund.minSIP) return;

    addSIP({
      fundId: fund.id,
      fundName: fund.name,
      amount: numAmount,
      frequency,
      nextDebitDate: `2026-10-${debitDate.padStart(2, '0')}`,
      status: 'active'
    });

    setIsSuccess(true);
    setTimeout(() => {
      setIsSuccess(false);
      onClose();
    }, 1800);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md p-4 animate-fade-in">
      <div className="nova-card border border-nova-border/80 w-full max-w-md p-6 relative shadow-2xl">
        <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-emerald-500 via-teal-500 to-indigo-500" />

        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-nova-text-muted hover:text-nova-text p-1.5 rounded-lg hover:bg-nova-surface transition-colors"
        >
          <X size={18} />
        </button>

        {isSuccess ? (
          <div className="py-8 text-center space-y-4 animate-in fade-in zoom-in-95">
            <div className="w-16 h-16 rounded-full bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center mx-auto text-emerald-400">
              <CheckCircle2 size={36} />
            </div>
            <h3 className="text-xl font-display font-bold text-nova-text">SIP Started Successfully!</h3>
            <p className="text-xs text-nova-text-muted">
              Your automated SIP of <strong className="text-emerald-400">₹{numAmount.toLocaleString()}/{frequency}</strong> in <strong className="text-nova-text">{fund.name}</strong> has been registered with BSE Star MF.
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded bg-teal-500/20 text-teal-400 border border-teal-500/30">
                  {fund.category}
                </span>
                <span className="text-xs text-emerald-400 font-bold font-mono">+{fund.returns3y}% 3Y CAGR</span>
              </div>
              <h3 className="text-lg font-display font-bold text-nova-text">{fund.name}</h3>
              <p className="text-xs text-nova-text-muted">Managed by {fund.fundManager} · AUM: {fund.aum}</p>
            </div>

            {/* SIP Amount */}
            <div>
              <div className="flex justify-between items-center mb-1">
                <label className="nova-label text-xs">SIP Amount (₹)</label>
                <span className="text-[11px] text-nova-text-subtle">Min SIP: ₹{fund.minSIP.toLocaleString()}</span>
              </div>
              <input
                type="number"
                required
                min={fund.minSIP}
                value={amount}
                onChange={e => setAmount(e.target.value)}
                className="nova-input text-sm font-mono font-bold"
                placeholder={String(fund.minSIP)}
              />
            </div>

            {/* Frequency & Debit Date */}
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="nova-label text-xs">Frequency</label>
                <select
                  value={frequency}
                  onChange={e => setFrequency(e.target.value as any)}
                  className="nova-input text-xs"
                >
                  <option value="monthly">Monthly</option>
                  <option value="weekly">Weekly</option>
                  <option value="daily">Daily</option>
                </select>
              </div>
              <div>
                <label className="nova-label text-xs">Monthly Debit Day</label>
                <select
                  value={debitDate}
                  onChange={e => setDebitDate(e.target.value)}
                  className="nova-input text-xs"
                >
                  {['01', '05', '10', '15', '20', '25'].map(d => (
                    <option key={d} value={d}>{d}th of every month</option>
                  ))}
                </select>
              </div>
            </div>

            {/* Bank Auto-Debit Mandate Info */}
            <div className="p-3 bg-nova-bg/50 border border-nova-border/70 rounded-xl space-y-1 text-xs">
              <div className="flex items-center justify-between text-nova-text-muted">
                <span>Payment Mode:</span>
                <span className="text-nova-text font-semibold">Auto-Debit / e-NACH Mandate</span>
              </div>
              <div className="flex items-center justify-between text-nova-text-muted">
                <span>Next Debit Date:</span>
                <span className="text-emerald-400 font-mono font-bold">10th Oct 2026</span>
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
                type="submit"
                className="nova-btn-primary text-xs flex-1 py-2.5 flex items-center justify-center gap-2 font-bold"
              >
                Start SIP <ArrowRight size={14} />
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};

export default SIPModal;

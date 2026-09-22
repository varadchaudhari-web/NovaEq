import React, { useState } from 'react';
import {
  X,
  Target,
  Plus,
  Trash2,
  Calendar,
  Sparkles,
  ArrowRight,
  TrendingUp
} from 'lucide-react';
import { useAppStore } from '@/stores/useAppStore';
import type { FinancialGoal } from '@/types';
import { formatCurrency } from '@/lib/utils';

interface FinancialGoalModalProps {
  isOpen: boolean;
  onClose: () => void;
  goalToEdit?: FinancialGoal | null;
}

const FinancialGoalModal: React.FC<FinancialGoalModalProps> = ({ isOpen, onClose, goalToEdit }) => {
  const { addGoal, updateGoal } = useAppStore();
  const [name, setName] = useState(goalToEdit?.name || '');
  const [category, setCategory] = useState<FinancialGoal['category']>(goalToEdit?.category || 'wealth');
  const [targetAmount, setTargetAmount] = useState(goalToEdit ? String(goalToEdit.targetAmount) : '10000000');
  const [currentAmount, setCurrentAmount] = useState(goalToEdit ? String(goalToEdit.currentAmount) : '1500000');
  const [targetYear, setTargetYear] = useState(goalToEdit ? String(goalToEdit.targetYear) : '2035');
  const [monthlyContribution, setMonthlyContribution] = useState(goalToEdit ? String(goalToEdit.monthlyContribution) : '35000');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    if (goalToEdit) {
      updateGoal(goalToEdit.id, {
        name,
        category,
        targetAmount: Number(targetAmount),
        currentAmount: Number(currentAmount),
        targetYear: Number(targetYear),
        monthlyContribution: Number(monthlyContribution)
      });
    } else {
      addGoal({
        userId: 'u001',
        name,
        category,
        targetAmount: Number(targetAmount),
        currentAmount: Number(currentAmount),
        targetYear: Number(targetYear),
        monthlyContribution: Number(monthlyContribution)
      });
    }
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md p-4 animate-fade-in">
      <div className="nova-card border border-nova-border/80 w-full max-w-md p-6 relative shadow-2xl">
        <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-emerald-500 via-cyan-500 to-indigo-500" />

        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-nova-text-muted hover:text-nova-text p-1.5 rounded-lg hover:bg-nova-surface transition-colors"
        >
          <X size={18} />
        </button>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                Wealth Planner
              </span>
            </div>
            <h3 className="text-xl font-display font-bold text-nova-text">
              {goalToEdit ? 'Edit Financial Goal' : 'Create New Financial Goal'}
            </h3>
            <p className="text-xs text-nova-text-muted">Set milestones and track progress with automated SIP investments.</p>
          </div>

          <div>
            <label className="nova-label text-xs">Goal Name *</label>
            <input
              type="text"
              required
              value={name}
              onChange={e => setName(e.target.value)}
              className="nova-input text-xs"
              placeholder="e.g. Dream House, Child Education, World Tour"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="nova-label text-xs">Category</label>
              <select
                value={category}
                onChange={e => setCategory(e.target.value as any)}
                className="nova-input text-xs"
              >
                <option value="wealth">Wealth Creation</option>
                <option value="retirement">Retirement</option>
                <option value="house">Real Estate / House</option>
                <option value="education">Child Education</option>
                <option value="emergency">Emergency Fund</option>
                <option value="vacation">Vacation / Travel</option>
              </select>
            </div>
            <div>
              <label className="nova-label text-xs">Target Year</label>
              <input
                type="number"
                required
                min={2026}
                max={2060}
                value={targetYear}
                onChange={e => setTargetYear(e.target.value)}
                className="nova-input text-xs font-mono"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="nova-label text-xs">Target Amount (₹) *</label>
              <input
                type="number"
                required
                min="10000"
                value={targetAmount}
                onChange={e => setTargetAmount(e.target.value)}
                className="nova-input text-xs font-mono"
                placeholder="10000000"
              />
            </div>
            <div>
              <label className="nova-label text-xs">Current Saved (₹) *</label>
              <input
                type="number"
                required
                min="0"
                value={currentAmount}
                onChange={e => setCurrentAmount(e.target.value)}
                className="nova-input text-xs font-mono"
                placeholder="1500000"
              />
            </div>
          </div>

          <div>
            <label className="nova-label text-xs">Monthly SIP Allocation (₹)</label>
            <input
              type="number"
              required
              min="500"
              value={monthlyContribution}
              onChange={e => setMonthlyContribution(e.target.value)}
              className="nova-input text-xs font-mono"
              placeholder="35000"
            />
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
              {goalToEdit ? 'Update Goal' : 'Create Goal'} <ArrowRight size={14} />
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default FinancialGoalModal;

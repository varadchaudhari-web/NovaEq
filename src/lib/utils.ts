import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatCurrency(value: number, currency = 'USD'): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency,
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(value);
}

export function formatNumber(value: number, decimals = 2): string {
  return new Intl.NumberFormat('en-US', {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  }).format(value);
}

export function formatCompact(value: number): string {
  if (value >= 1_000_000_000) return `$${(value / 1_000_000_000).toFixed(2)}B`;
  if (value >= 1_000_000) return `$${(value / 1_000_000).toFixed(2)}M`;
  if (value >= 1_000) return `$${(value / 1_000).toFixed(1)}K`;
  return `$${value.toFixed(2)}`;
}

export function formatPercent(value: number, showSign = true): string {
  const sign = showSign && value > 0 ? '+' : '';
  return `${sign}${value.toFixed(2)}%`;
}

export function formatTimeAgo(dateString: string): string {
  const date = new Date(dateString);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffSec = Math.floor(diffMs / 1000);
  const diffMin = Math.floor(diffSec / 60);
  const diffHour = Math.floor(diffMin / 60);
  const diffDay = Math.floor(diffHour / 24);

  if (diffDay > 30) return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  if (diffDay > 0) return `${diffDay}d ago`;
  if (diffHour > 0) return `${diffHour}h ago`;
  if (diffMin > 0) return `${diffMin}m ago`;
  return 'just now';
}

export function formatDate(dateString: string): string {
  return new Date(dateString).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
}

export function formatDateTime(dateString: string): string {
  return new Date(dateString).toLocaleString('en-US', {
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
}

export function getPnLColor(value: number): string {
  return value >= 0 ? 'text-nova-green' : 'text-nova-red';
}

export function getPnLBg(value: number): string {
  return value >= 0 ? 'bg-nova-green/10 border-nova-green/20' : 'bg-nova-red/10 border-nova-red/20';
}

export function getRiskColor(risk: string): string {
  switch (risk) {
    case 'low': return 'text-nova-green';
    case 'medium': return 'text-nova-yellow';
    case 'high': return 'text-nova-red';
    default: return 'text-nova-text-muted';
  }
}

export function getRiskBadgeClass(risk: string): string {
  switch (risk) {
    case 'low': return 'nova-badge-green';
    case 'medium': return 'nova-badge-yellow';
    case 'high': return 'nova-badge-red';
    default: return 'nova-badge-blue';
  }
}

export function getActionColor(action: string): string {
  switch (action) {
    case 'buy': return 'text-nova-green';
    case 'sell': return 'text-nova-red';
    case 'hold': return 'text-nova-yellow';
    default: return 'text-nova-text-muted';
  }
}

export function getActionBadge(action: string): string {
  switch (action) {
    case 'buy': return 'nova-badge-green';
    case 'sell': return 'nova-badge-red';
    case 'hold': return 'nova-badge-yellow';
    default: return 'nova-badge-blue';
  }
}

export function getStatusBadge(status: string): string {
  switch (status) {
    case 'executed': case 'completed': case 'approved': case 'active': return 'nova-badge-green';
    case 'pending': case 'submitted': return 'nova-badge-yellow';
    case 'cancelled': case 'rejected': case 'stopped': return 'nova-badge-red';
    case 'open': case 'draft': case 'paused': return 'nova-badge-blue';
    default: return 'nova-badge-blue';
  }
}

export function generateId(): string {
  return Math.random().toString(36).substr(2, 9);
}

export function clamp(value: number, min: number, max: number): number {
  return Math.min(Math.max(value, min), max);
}

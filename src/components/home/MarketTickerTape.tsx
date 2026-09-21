import React from 'react';

interface TickerItem {
  symbol: string;
  price: string;
  change: number;
}

const defaultTape: TickerItem[] = [
  { symbol: 'SENSEX', price: '74,572.35', change: 0.25 },
  { symbol: 'NIFTY 50', price: '22,531.05', change: 0.21 },
  { symbol: 'NVDA', price: '$875.30', change: 2.16 },
  { symbol: 'AAPL', price: '$193.42', change: 1.12 },
  { symbol: 'MSFT', price: '$425.80', change: -0.8 },
  { symbol: 'TSLA', price: '$178.30', change: -2.83 },
  { symbol: 'GOOGL', price: '$178.90', change: 0.68 },
  { symbol: 'META', price: '$504.20', change: 1.8 },
  { symbol: 'AMZN', price: '$195.30', change: -0.94 },
  { symbol: 'BTC/USD', price: '$52,847', change: 3.21 },
  { symbol: 'ETH/USD', price: '$2,948', change: 1.87 },
  { symbol: 'GOLD', price: '$2,038/oz', change: 0.42 },
  { symbol: 'CRUDE', price: '$76.42/bbl', change: -1.15 },
  { symbol: 'USD/INR', price: '83.12', change: 0.08 },
];

const MarketTickerTape: React.FC = () => {
  const renderItem = (item: TickerItem, key: string) => {
    const isPositive = item.change >= 0;
    return (
      <span key={key} className="inline-flex items-center gap-2.5 whitespace-nowrap text-xs font-mono px-4">
        <strong className="text-slate-300 font-semibold">{item.symbol}</strong>
        <span className="text-slate-400">{item.price}</span>
        <span className={`inline-flex items-center text-[11px] font-medium ${isPositive ? 'text-emerald-400' : 'text-rose-400'}`}>
          {isPositive ? '▲ +' : '▼ -'}
          {Math.abs(item.change).toFixed(2)}%
        </span>
      </span>
    );
  };

  return (
    <div className="border-y border-nova-border/80 bg-nova-surface2/90 py-3 overflow-hidden select-none relative z-10">
      <div className="animate-tape">
        {defaultTape.map((item, idx) => renderItem(item, `tape-1-${idx}`))}
        {defaultTape.map((item, idx) => renderItem(item, `tape-2-${idx}`))}
      </div>
    </div>
  );
};

export default MarketTickerTape;

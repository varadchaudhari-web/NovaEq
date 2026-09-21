import React from 'react';
import { TrendingUp, TrendingDown } from 'lucide-react';
import { marketTickerData } from '@/lib/mockData';

const MarketTicker: React.FC = () => {
  const doubled = [...marketTickerData, ...marketTickerData];

  return (
    <div className="bg-nova-secondary border-y border-nova-border py-2 overflow-hidden">
      <div className="ticker-wrapper">
        <div className="ticker-content gap-0">
          {doubled.map((item, i) => (
            <div key={i} className="inline-flex items-center gap-2 px-5 border-r border-nova-border/50">
              <span className="text-xs font-bold text-nova-text-muted tracking-wider">{item.symbol}</span>
              <span className="text-xs font-semibold text-nova-text">{item.value}</span>
              <span className={`flex items-center gap-0.5 text-xs font-semibold ${item.positive ? 'text-nova-green' : 'text-nova-red'}`}>
                {item.positive ? <TrendingUp size={11} /> : <TrendingDown size={11} />}
                {item.change}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default MarketTicker;

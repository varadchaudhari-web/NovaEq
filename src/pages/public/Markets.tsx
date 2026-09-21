import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { TrendingUp, TrendingDown, Search, Filter, BarChart2, Activity, Globe, RefreshCw } from 'lucide-react';
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer, BarChart, Bar, Cell } from 'recharts';
import MarketTicker from '@/components/features/MarketTicker';
import TiltCard from '@/components/ui/TiltCard';
import { useAppStore } from '@/stores/useAppStore';
import { mockMarketStocks } from '@/lib/mockData';
import { formatCurrency, formatPercent, cn } from '@/lib/utils';

const sectors = ['All', 'Technology', 'Financial Services', 'Healthcare', 'Consumer Discretionary', 'Energy'];

const heatmapData = [
  { name: 'Technology', change: 1.42, size: 'large', stocks: ['AAPL +1.12%', 'NVDA +2.16%', 'MSFT -0.80%'] },
  { name: 'Financials', change: 0.44, size: 'medium', stocks: ['JPM +0.44%', 'V +0.50%'] },
  { name: 'Healthcare', change: -0.39, size: 'medium', stocks: ['JNJ -0.39%'] },
  { name: 'Consumer', change: -1.89, size: 'medium', stocks: ['AMZN -0.94%', 'TSLA -2.83%'] },
  { name: 'Energy', change: -1.15, size: 'small', stocks: ['Crude -1.15%'] },
  { name: 'Comm. Services', change: 1.80, size: 'small', stocks: ['META +1.80%'] },
];

const volumeData = mockMarketStocks.slice(0, 8).map(s => ({
  symbol: s.symbol,
  volume: parseFloat(s.volume.replace('M', '')) * 1000000,
  change: s.changePercent,
}));

const Markets: React.FC = () => {
  const navigate = useNavigate();
  const { watchlist, addToWatchlist, removeFromWatchlist, openAuthModal, isLoggedIn, currentUser } = useAppStore();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedSector, setSelectedSector] = useState('All');
  const [activeTab, setActiveTab] = useState<'overview' | 'heatmap' | 'watchlist'>('overview');
  const [selectedStock, setSelectedStock] = useState(mockMarketStocks[2]);

  const filtered = mockMarketStocks.filter(s => {
    const matchSearch = s.symbol.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.name.toLowerCase().includes(searchQuery.toLowerCase());
    const matchSector = selectedSector === 'All' || s.sector === selectedSector;
    return matchSearch && matchSector;
  });

  const watchlisted = mockMarketStocks.filter(s => watchlist.includes(s.symbol));

  const handleWatchlistToggle = (symbol: string) => {
    if (!isLoggedIn) { openAuthModal('Add stocks to your personal watchlist — sign in to NovaEq.'); return; }
    if (watchlist.includes(symbol)) removeFromWatchlist(symbol);
    else addToWatchlist(symbol);
  };

  const handleTradeAction = () => {
    if (!isLoggedIn) {
      openAuthModal('Trade stocks with your NovaEq account — sign in to place orders.');
      return;
    }

    const paths: Record<string, string> = {
      investor: '/dashboard/investor',
      trader: '/dashboard/trader',
      advisor: '/dashboard/advisor',
      admin: '/dashboard/admin',
    };
    navigate(paths[currentUser?.role || 'investor'] || '/dashboard/investor', {
      state: { activeTab: currentUser?.role === 'trader' ? 'trading' : 'markets' },
    });
  };

  return (
    <div className="min-h-screen pt-16">
      <MarketTicker />

      {/* Page Header */}
      <div className="bg-nova-surface border-b border-nova-border py-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-3 mb-3">
            <Globe size={24} className="text-nova-primary-light" />
            <h1 className="text-3xl font-display font-black text-nova-text">Global Markets</h1>
          </div>
          <p className="text-nova-text-muted">Real-time equity prices, sector heatmaps, and market analytics</p>

          {/* Market Summary with 3D Tilt */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6">
            {[
              { label: 'NIFTY 50', value: '22,531.05', change: '+0.21%', positive: true },
              { label: 'SENSEX', value: '74,572.35', change: '+0.25%', positive: true },
              { label: 'NASDAQ', value: '16,742.39', change: '-0.12%', positive: false },
              { label: 'S&P 500', value: '5,234.18', change: '+0.07%', positive: true },
            ].map(m => (
              <TiltCard key={m.label} className="p-4" tiltMaxAngle={8}>
                <p className="text-xs text-nova-text-muted mb-1">{m.label}</p>
                <p className="text-xl font-bold text-nova-text">{m.value}</p>
                <span className={`text-sm font-semibold ${m.positive ? 'text-nova-green' : 'text-nova-red'}`}>{m.change}</span>
              </TiltCard>
            ))}
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Tabs */}
        <div className="flex gap-1 mb-6 bg-nova-surface2 p-1 rounded-xl w-fit">
          {['overview', 'heatmap', 'watchlist'].map(tab => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab as typeof activeTab)}
              className={cn(
                'px-5 py-2 rounded-lg text-sm font-medium capitalize transition-all',
                activeTab === tab ? 'bg-nova-primary text-white' : 'text-nova-text-muted hover:text-nova-text'
              )}
            >
              {tab === 'watchlist' ? `Watchlist (${watchlist.length})` : tab}
            </button>
          ))}
        </div>

        {activeTab === 'overview' && (
          <div className="grid lg:grid-cols-3 gap-6">
            {/* Stock List */}
            <div className="lg:col-span-2">
              <div className="flex gap-3 mb-4">
                <div className="relative flex-1">
                  <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-nova-text-muted" />
                  <input
                    type="search"
                    placeholder="Search stocks..."
                    value={searchQuery}
                    onChange={e => setSearchQuery(e.target.value)}
                    className="nova-input pl-9 py-2.5 text-sm"
                  />
                </div>
                <select
                  value={selectedSector}
                  onChange={e => setSelectedSector(e.target.value)}
                  className="nova-input py-2.5 text-sm w-40"
                >
                  {sectors.map(s => <option key={s} value={s}>{s}</option>)}
                </select>
              </div>

              <div className="nova-card overflow-hidden">
                <div className="grid grid-cols-6 px-4 py-2.5 bg-nova-surface2 text-xs font-semibold text-nova-text-muted uppercase tracking-wider">
                  <span className="col-span-2">Symbol</span>
                  <span className="text-right">Price</span>
                  <span className="text-right">Change</span>
                  <span className="text-right">Volume</span>
                  <span className="text-right">Action</span>
                </div>
                {filtered.map(stock => (
                  <div
                    key={stock.symbol}
                    className={cn(
                      'grid grid-cols-6 px-4 py-3 border-t border-nova-border/50 hover:bg-nova-surface2 transition-colors cursor-pointer',
                      selectedStock.symbol === stock.symbol && 'bg-nova-primary/5 border-l-2 border-l-nova-primary'
                    )}
                    onClick={() => setSelectedStock(stock)}
                  >
                    <div className="col-span-2">
                      <p className="text-sm font-bold text-nova-text">{stock.symbol}</p>
                      <p className="text-xs text-nova-text-muted truncate">{stock.name}</p>
                    </div>
                    <p className="text-sm font-semibold text-nova-text text-right self-center">${stock.price.toFixed(2)}</p>
                    <div className={`text-right self-center ${stock.changePercent >= 0 ? 'text-nova-green' : 'text-nova-red'}`}>
                      <p className="text-sm font-semibold">{stock.changePercent >= 0 ? '+' : ''}{stock.changePercent.toFixed(2)}%</p>
                      <p className="text-xs">{stock.change >= 0 ? '+' : ''}${stock.change.toFixed(2)}</p>
                    </div>
                    <p className="text-xs text-nova-text-muted text-right self-center">{stock.volume}</p>
                    <div className="flex justify-end self-center">
                      <button
                        onClick={e => { e.stopPropagation(); handleWatchlistToggle(stock.symbol); }}
                        className={cn(
                          'text-xs px-2 py-1 rounded-lg border transition-all',
                          watchlist.includes(stock.symbol)
                            ? 'bg-nova-accent/10 border-nova-accent/30 text-nova-accent'
                            : 'border-nova-border text-nova-text-muted hover:border-nova-primary/30 hover:text-nova-primary-light'
                        )}
                      >
                        {watchlist.includes(stock.symbol) ? '★ Added' : '☆ Watch'}
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Stock Detail Panel with 3D Tilt */}
            <div>
              <TiltCard className="p-5 sticky top-20" tiltMaxAngle={7} translateZ={10}>
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <p className="text-2xl font-display font-black text-nova-text">{selectedStock.symbol}</p>
                    <p className="text-sm text-nova-text-muted">{selectedStock.name}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-xl font-bold text-nova-text">${selectedStock.price.toFixed(2)}</p>
                    <span className={`text-sm font-semibold ${selectedStock.changePercent >= 0 ? 'text-nova-green' : 'text-nova-red'}`}>
                      {selectedStock.changePercent >= 0 ? '+' : ''}{selectedStock.changePercent.toFixed(2)}%
                    </span>
                  </div>
                </div>

                <div className="h-40 mb-4">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={selectedStock.priceHistory.slice(-30)}>
                      <defs>
                        <linearGradient id="stockGrad" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor={selectedStock.changePercent >= 0 ? '#10B981' : '#EF4444'} stopOpacity={0.2} />
                          <stop offset="95%" stopColor={selectedStock.changePercent >= 0 ? '#10B981' : '#EF4444'} stopOpacity={0} />
                        </linearGradient>
                      </defs>
                      <XAxis dataKey="date" hide />
                      <YAxis hide domain={['dataMin * 0.99', 'dataMax * 1.01']} />
                      <Tooltip
                        contentStyle={{ background: '#1E293B', border: 'none', borderRadius: 8, fontSize: 11 }}
                        formatter={(v: number) => [`$${v.toFixed(2)}`, 'Price']}
                      />
                      <Area type="monotone" dataKey="price" stroke={selectedStock.changePercent >= 0 ? '#10B981' : '#EF4444'} fill="url(#stockGrad)" strokeWidth={2} dot={false} />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>

                <div className="grid grid-cols-2 gap-2.5 text-xs">
                  {[
                    { label: 'Market Cap', value: selectedStock.marketCap },
                    { label: 'Volume', value: selectedStock.volume },
                    { label: '52W High', value: `$${selectedStock.high52w.toFixed(2)}` },
                    { label: '52W Low', value: `$${selectedStock.low52w.toFixed(2)}` },
                    { label: 'P/E Ratio', value: selectedStock.pe.toFixed(1) },
                    { label: 'EPS', value: `$${selectedStock.eps.toFixed(2)}` },
                    { label: 'Sector', value: selectedStock.sector.split(' ')[0] },
                  ].map(({ label, value }) => (
                    <div key={label} className="flex justify-between py-1.5 border-b border-nova-border/50">
                      <span className="text-nova-text-muted">{label}</span>
                      <span className="text-nova-text font-medium">{value}</span>
                    </div>
                  ))}
                </div>

                <div className="flex gap-2 mt-4">
                  <button
                    onClick={handleTradeAction}
                    className="flex-1 nova-btn-accent text-sm py-2.5"
                  >
                    Buy
                  </button>
                  <button
                    onClick={handleTradeAction}
                    className="flex-1 bg-nova-red/10 border border-nova-red/30 text-nova-red hover:bg-nova-red/20 rounded-lg text-sm py-2.5 font-semibold transition-all"
                  >
                    Sell
                  </button>
                </div>
              </TiltCard>
            </div>
          </div>
        )}

        {activeTab === 'heatmap' && (
          <div>
            <h2 className="text-xl font-display font-bold text-nova-text mb-6">Sector Performance Heatmap</h2>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-8">
              {heatmapData.map(sector => {
                const color = sector.change > 1 ? 'bg-nova-green' : sector.change > 0 ? 'bg-nova-green/60' : sector.change > -1 ? 'bg-nova-red/60' : 'bg-nova-red';
                return (
                  <TiltCard
                    key={sector.name}
                    className={cn('p-5 border cursor-pointer', sector.change >= 0 ? 'border-nova-green/20' : 'border-nova-red/20')}
                    tiltMaxAngle={10}
                  >
                    <div className="flex justify-between items-start mb-3">
                      <h3 className="text-sm font-bold text-nova-text">{sector.name}</h3>
                      <span className={`text-lg font-black ${sector.change >= 0 ? 'text-nova-green' : 'text-nova-red'}`}>
                        {sector.change >= 0 ? '+' : ''}{sector.change.toFixed(2)}%
                      </span>
                    </div>
                    <div className="w-full h-2 bg-nova-surface2 rounded-full mb-3">
                      <div className={`h-full rounded-full ${color}`} style={{ width: `${Math.min(Math.abs(sector.change) * 20, 100)}%` }} />
                    </div>
                    <div className="space-y-0.5">
                      {sector.stocks.map(s => (
                        <p key={s} className="text-xs text-nova-text-muted">{s}</p>
                      ))}
                    </div>
                  </TiltCard>
                );
              })}
            </div>

            {/* Volume Chart */}
            <TiltCard className="p-5" tiltMaxAngle={6} translateZ={8}>
              <h3 className="text-sm font-bold text-nova-text mb-4">Trading Volume by Stock</h3>
              <div className="h-56">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={volumeData}>
                    <XAxis dataKey="symbol" tick={{ fill: '#64748B', fontSize: 11 }} axisLine={false} tickLine={false} />
                    <YAxis tick={{ fill: '#64748B', fontSize: 11 }} axisLine={false} tickLine={false} tickFormatter={v => `${(v / 1000000).toFixed(0)}M`} />
                    <Tooltip
                      contentStyle={{ background: '#1E293B', border: 'none', borderRadius: 8, fontSize: 11 }}
                      formatter={(v: number) => [`${(v / 1000000).toFixed(1)}M`, 'Volume']}
                    />
                    <Bar dataKey="volume" radius={[4, 4, 0, 0]}>
                      {volumeData.map((entry, i) => (
                        <Cell key={i} fill={entry.change >= 0 ? '#10B981' : '#EF4444'} />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </TiltCard>
          </div>
        )}

        {activeTab === 'watchlist' && (
          <div>
            {watchlisted.length === 0 ? (
              <div className="text-center py-20">
                <Activity size={48} className="text-nova-text-subtle mx-auto mb-4" />
                <h3 className="text-lg font-bold text-nova-text mb-2">Your Watchlist is Empty</h3>
                <p className="text-nova-text-muted mb-6">Add stocks from the Overview tab to track your favourites.</p>
                <button onClick={() => setActiveTab('overview')} className="nova-btn-primary">
                  Browse Stocks
                </button>
              </div>
            ) : (
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                {watchlisted.map(stock => (
                  <TiltCard key={stock.symbol} className="p-5 cursor-pointer" tiltMaxAngle={10}>
                    <div className="flex items-start justify-between mb-3">
                      <div>
                        <p className="text-lg font-bold text-nova-text">{stock.symbol}</p>
                        <p className="text-xs text-nova-text-muted">{stock.name}</p>
                      </div>
                      <button onClick={(e) => { e.stopPropagation(); removeFromWatchlist(stock.symbol); }} className="text-xs text-nova-text-subtle hover:text-nova-red transition-colors">
                        Remove
                      </button>
                    </div>
                    <p className="text-2xl font-black text-nova-text mb-1">${stock.price.toFixed(2)}</p>
                    <span className={`text-sm font-semibold ${stock.changePercent >= 0 ? 'text-nova-green' : 'text-nova-red'}`}>
                      {stock.changePercent >= 0 ? <TrendingUp size={14} className="inline mr-1" /> : <TrendingDown size={14} className="inline mr-1" />}
                      {stock.changePercent >= 0 ? '+' : ''}{stock.changePercent.toFixed(2)}%
                    </span>
                    <div className="h-20 mt-3">
                      <ResponsiveContainer width="100%" height="100%">
                        <AreaChart data={stock.priceHistory.slice(-20)}>
                          <Area type="monotone" dataKey="price" stroke={stock.changePercent >= 0 ? '#10B981' : '#EF4444'} fill="none" strokeWidth={2} dot={false} />
                        </AreaChart>
                      </ResponsiveContainer>
                    </div>
                  </TiltCard>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default Markets;


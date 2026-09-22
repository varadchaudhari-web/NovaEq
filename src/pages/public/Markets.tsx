import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  TrendingUp,
  TrendingDown,
  Search,
  Filter,
  BarChart2,
  Activity,
  Globe,
  RefreshCw,
  X,
  ExternalLink,
  Shield,
  Brain,
  Check,
  Zap,
} from 'lucide-react';
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer, BarChart, Bar, Cell } from 'recharts';
import MarketTicker from '@/components/features/MarketTicker';
import TiltCard from '@/components/ui/TiltCard';
import { useAppStore } from '@/stores/useAppStore';
import { mockMarketStocks } from '@/lib/mockData';
import { formatCurrency, formatPercent, cn } from '@/lib/utils';

const sectors = ['All', 'Technology', 'Financial Services', 'Healthcare', 'Consumer Discretionary', 'Energy'];

interface IndexModalInfo {
  name: string;
  value: string;
  change: string;
  positive: boolean;
  high52w: string;
  low52w: string;
  pe: string;
  description: string;
  topConstituents: string[];
}

const indexDetailsData: Record<string, IndexModalInfo> = {
  'NIFTY 50': {
    name: 'NIFTY 50',
    value: '22,531.05',
    change: '+0.21%',
    positive: true,
    high52w: '22,783.40',
    low52w: '18,837.85',
    pe: '22.8',
    description: 'The benchmark index of the National Stock Exchange of India representing the 50 largest and most liquid Indian securities across 13 sectors.',
    topConstituents: ['HDFC Bank (11.8%)', 'Reliance Industries (9.7%)', 'ICICI Bank (7.9%)', 'Infosys (5.8%)', 'TCS (4.2%)'],
  },
  'SENSEX': {
    name: 'SENSEX (BSE 30)',
    value: '74,572.35',
    change: '+0.25%',
    positive: true,
    high52w: '75,124.28',
    low52w: '62,014.20',
    pe: '24.1',
    description: 'The oldest and most tracked stock market index in India, tracking 30 well-established financially sound companies listed on BSE.',
    topConstituents: ['Reliance Ind (10.2%)', 'HDFC Bank (12.4%)', 'ICICI Bank (8.1%)', 'Infosys (6.1%)', 'ITC (4.3%)'],
  },
  'NASDAQ': {
    name: 'NASDAQ Composite',
    value: '16,742.39',
    change: '-0.12%',
    positive: false,
    high52w: '17,100.80',
    low52w: '12,543.15',
    pe: '28.6',
    description: 'The premier global technology index heavily weighted towards modern tech, semiconductor, software, and biotechnology innovators.',
    topConstituents: ['Apple Inc (12.1%)', 'Microsoft (11.9%)', 'Nvidia (6.8%)', 'Amazon (6.2%)', 'Meta (4.5%)'],
  },
  'S&P 500': {
    name: 'S&P 500 Index',
    value: '5,234.18',
    change: '+0.07%',
    positive: true,
    high52w: '5,320.10',
    low52w: '4,103.78',
    pe: '25.4',
    description: 'The leading benchmark for the U.S. equity market, tracking 500 of the largest public American corporations representing ~80% of available market cap.',
    topConstituents: ['Microsoft (7.1%)', 'Apple (6.2%)', 'Nvidia (5.4%)', 'Amazon (3.8%)', 'Alphabet (3.6%)'],
  },
};

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

  // Modal State for card clicks
  const [modalStock, setModalStock] = useState<(typeof mockMarketStocks)[0] | null>(null);
  const [modalIndex, setModalIndex] = useState<IndexModalInfo | null>(null);
  const [modalSector, setModalSector] = useState<(typeof heatmapData)[0] | null>(null);

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

  const handleTradeAction = (symbol?: string) => {
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
      state: { activeTab: currentUser?.role === 'trader' ? 'trading' : 'markets', selectedSymbol: symbol },
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
              <TiltCard
                key={m.label}
                className="p-4 cursor-pointer hover:border-nova-primary/50 transition-all group"
                tiltMaxAngle={8}
                onClick={() => setModalIndex(indexDetailsData[m.label] || null)}
              >
                <div className="flex items-center justify-between mb-1">
                  <p className="text-xs text-nova-text-muted">{m.label}</p>
                  <span className="text-[10px] text-nova-primary-light font-mono opacity-0 group-hover:opacity-100 transition-opacity">Details &rarr;</span>
                </div>
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
                    onClick={() => {
                      setSelectedStock(stock);
                      setModalStock(stock);
                    }}
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
                    <div className="flex justify-end self-center gap-1.5">
                      <button
                        onClick={e => { e.stopPropagation(); setModalStock(stock); }}
                        className="text-xs px-2.5 py-1 rounded-lg border border-blue-500/30 text-blue-400 hover:bg-blue-500/10 transition-all font-medium"
                      >
                        Details
                      </button>
                      <button
                        onClick={e => { e.stopPropagation(); handleWatchlistToggle(stock.symbol); }}
                        className={cn(
                          'text-xs px-2 py-1 rounded-lg border transition-all',
                          watchlist.includes(stock.symbol)
                            ? 'bg-nova-accent/10 border-nova-accent/30 text-nova-accent'
                            : 'border-nova-border text-nova-text-muted hover:border-nova-primary/30 hover:text-nova-primary-light'
                        )}
                      >
                        {watchlist.includes(stock.symbol) ? '★' : '☆'}
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
                    onClick={() => setModalStock(selectedStock)}
                    className="flex-1 nova-btn-accent text-sm py-2.5"
                  >
                    View Details
                  </button>
                  <button
                    onClick={() => handleTradeAction(selectedStock.symbol)}
                    className="flex-1 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-500 hover:to-blue-600 text-white rounded-lg text-sm py-2.5 font-semibold transition-all shadow-md shadow-blue-500/20"
                  >
                    Trade in Dashboard
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
                    className={cn('p-5 border cursor-pointer hover:border-nova-primary/50 transition-all group', sector.change >= 0 ? 'border-nova-green/20' : 'border-nova-red/20')}
                    tiltMaxAngle={10}
                    onClick={() => setModalSector(sector)}
                  >
                    <div className="flex justify-between items-start mb-3">
                      <div>
                        <h3 className="text-sm font-bold text-nova-text">{sector.name}</h3>
                        <span className="text-[10px] text-nova-primary-light opacity-0 group-hover:opacity-100 transition-opacity">View Sector &rarr;</span>
                      </div>
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
                  <TiltCard
                    key={stock.symbol}
                    className="p-5 cursor-pointer hover:border-nova-primary/50 transition-all"
                    tiltMaxAngle={10}
                    onClick={() => setModalStock(stock)}
                  >
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

      {/* ========================================================================= */}
      {/* STOCK INTELLIGENCE SHOWCASE MODAL                                         */}
      {/* ========================================================================= */}
      {modalStock && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-black/80 backdrop-blur-md animate-fadeIn">
          <div
            className="relative w-full max-w-2xl bg-[#0b1428] border border-[#1c2a45] rounded-3xl shadow-[0_25px_60px_-15px_rgba(0,0,0,0.9)] overflow-hidden flex flex-col max-h-[90vh]"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="p-6 bg-gradient-to-b from-[#12203d] to-[#0b1428] border-b border-[#1c2a45] relative">
              <button
                onClick={() => setModalStock(null)}
                className="absolute top-5 right-5 w-8 h-8 rounded-full bg-[#1c2a45]/80 hover:bg-[#2a3c61] text-slate-300 flex items-center justify-center transition-colors"
              >
                <X size={16} />
              </button>

              <div className="flex items-center gap-2 mb-2">
                <span className="text-xs font-mono font-bold uppercase tracking-wider text-blue-400 bg-blue-500/10 px-2.5 py-1 rounded-full border border-blue-500/25">
                  {modalStock.sector}
                </span>
                <span className="text-xs font-mono text-emerald-400 bg-emerald-500/10 px-2.5 py-1 rounded-full border border-emerald-500/25">
                  AI Conviction: 88%
                </span>
              </div>

              <div className="flex items-center justify-between mt-2">
                <div>
                  <h3 className="text-2xl sm:text-3xl font-display font-black text-white">
                    {modalStock.symbol}
                  </h3>
                  <p className="text-sm text-slate-400">{modalStock.name}</p>
                </div>
                <div className="text-right">
                  <p className="text-2xl font-mono font-bold text-white">${modalStock.price.toFixed(2)}</p>
                  <span
                    className={`text-sm font-semibold ${
                      modalStock.changePercent >= 0 ? 'text-emerald-400' : 'text-rose-400'
                    }`}
                  >
                    {modalStock.changePercent >= 0 ? '+' : ''}
                    {modalStock.changePercent.toFixed(2)}% (${modalStock.change.toFixed(2)})
                  </span>
                </div>
              </div>
            </div>

            {/* Body */}
            <div className="p-6 overflow-y-auto space-y-6">
              {/* Chart */}
              <div className="p-4 rounded-2xl bg-[#0f1c33]/70 border border-[#1c2a45]">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs text-slate-400 font-mono">30-Day Historical Trend</span>
                  <span className="text-xs text-slate-300 font-mono">High: ${modalStock.high52w.toFixed(2)} | Low: ${modalStock.low52w.toFixed(2)}</span>
                </div>
                <div className="h-44">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={modalStock.priceHistory.slice(-30)}>
                      <defs>
                        <linearGradient id="modalStockGrad" x1="0" y1="0" x2="0" y2="1">
                          <stop
                            offset="5%"
                            stopColor={modalStock.changePercent >= 0 ? '#10B981' : '#EF4444'}
                            stopOpacity={0.3}
                          />
                          <stop
                            offset="95%"
                            stopColor={modalStock.changePercent >= 0 ? '#10B981' : '#EF4444'}
                            stopOpacity={0}
                          />
                        </linearGradient>
                      </defs>
                      <XAxis dataKey="date" hide />
                      <YAxis hide domain={['dataMin * 0.98', 'dataMax * 1.02']} />
                      <Tooltip
                        contentStyle={{
                          background: '#0b1428',
                          borderColor: '#1c2a45',
                          borderRadius: 8,
                          fontSize: 11,
                        }}
                        formatter={(v: number) => [`$${v.toFixed(2)}`, 'Price']}
                      />
                      <Area
                        type="monotone"
                        dataKey="price"
                        stroke={modalStock.changePercent >= 0 ? '#10B981' : '#EF4444'}
                        fill="url(#modalStockGrad)"
                        strokeWidth={2}
                        dot={false}
                      />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
              </div>

              {/* Key Financial Metrics */}
              <div>
                <h4 className="text-xs font-mono uppercase tracking-wider text-slate-400 mb-3">
                  Institutional Fundamentals
                </h4>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  <div className="p-3 rounded-xl bg-[#0f1c33] border border-[#1c2a45]">
                    <span className="text-[11px] text-slate-400 block mb-0.5">Market Cap</span>
                    <b className="font-mono text-sm text-slate-100">{modalStock.marketCap}</b>
                  </div>
                  <div className="p-3 rounded-xl bg-[#0f1c33] border border-[#1c2a45]">
                    <span className="text-[11px] text-slate-400 block mb-0.5">Volume</span>
                    <b className="font-mono text-sm text-slate-100">{modalStock.volume}</b>
                  </div>
                  <div className="p-3 rounded-xl bg-[#0f1c33] border border-[#1c2a45]">
                    <span className="text-[11px] text-slate-400 block mb-0.5">P/E Ratio</span>
                    <b className="font-mono text-sm text-emerald-400">{modalStock.pe.toFixed(1)}</b>
                  </div>
                  <div className="p-3 rounded-xl bg-[#0f1c33] border border-[#1c2a45]">
                    <span className="text-[11px] text-slate-400 block mb-0.5">EPS (TTM)</span>
                    <b className="font-mono text-sm text-slate-100">${modalStock.eps.toFixed(2)}</b>
                  </div>
                </div>
              </div>

              {/* AI Quantitative Summary */}
              <div className="p-4 rounded-xl bg-[#0f1c33]/40 border border-[#1c2a45] space-y-2">
                <div className="flex items-center gap-2 text-xs font-semibold text-blue-400">
                  <Brain size={16} />
                  <span>AI Quantitative Sentiment & Health Score</span>
                </div>
                <p className="text-xs text-slate-300 leading-relaxed">
                  {modalStock.symbol} displays strong balance-sheet resilience with robust operating cash flows. Momentum indicators show high institutional accumulation above key moving averages with balanced risk-reward parameters.
                </p>
              </div>
            </div>

            {/* Footer */}
            <div className="p-5 bg-[#080e1c] border-t border-[#1c2a45] flex flex-wrap items-center justify-between gap-3">
              <button
                onClick={() => setModalStock(null)}
                className="px-4 py-2 rounded-xl border border-[#1c2a45] text-slate-400 hover:text-white text-xs font-medium"
              >
                Close
              </button>

              <div className="flex flex-wrap gap-2">
                <button
                  onClick={() => handleWatchlistToggle(modalStock.symbol)}
                  className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold border border-[#1c2a45] transition-all"
                >
                  {watchlist.includes(modalStock.symbol) ? '★ In Watchlist' : '☆ Add to Watchlist'}
                </button>

                <button
                  onClick={() => {
                    setModalStock(null);
                    navigate('/ai-insights');
                  }}
                  className="px-4 py-2 rounded-xl bg-blue-600/20 hover:bg-blue-600/30 border border-blue-500/40 text-blue-300 text-xs font-semibold"
                >
                  Explore in AI Insights
                </button>

                <button
                  onClick={() => {
                    const sym = modalStock.symbol;
                    setModalStock(null);
                    handleTradeAction(sym);
                  }}
                  className="px-5 py-2 rounded-xl bg-gradient-to-r from-blue-500 to-blue-700 hover:from-blue-600 hover:to-blue-800 text-white text-xs font-semibold shadow-md shadow-blue-500/25 flex items-center gap-1.5"
                >
                  <span>Trade in Dashboard</span>
                  <ExternalLink size={14} />
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* INDEX INTELLIGENCE SHOWCASE MODAL                                         */}
      {/* ========================================================================= */}
      {modalIndex && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-black/80 backdrop-blur-md animate-fadeIn">
          <div
            className="relative w-full max-w-lg bg-[#0b1428] border border-[#1c2a45] rounded-3xl shadow-[0_25px_60px_-15px_rgba(0,0,0,0.9)] overflow-hidden flex flex-col"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="p-6 bg-gradient-to-b from-[#12203d] to-[#0b1428] border-b border-[#1c2a45] relative">
              <button
                onClick={() => setModalIndex(null)}
                className="absolute top-5 right-5 w-8 h-8 rounded-full bg-[#1c2a45]/80 hover:bg-[#2a3c61] text-slate-300 flex items-center justify-center transition-colors"
              >
                <X size={16} />
              </button>

              <span className="text-xs font-mono font-bold uppercase tracking-wider text-blue-400 bg-blue-500/10 px-2.5 py-1 rounded-full border border-blue-500/25">
                Benchmark Index
              </span>

              <div className="flex items-center justify-between mt-3">
                <div>
                  <h3 className="text-2xl font-display font-bold text-white">{modalIndex.name}</h3>
                  <p className="text-xs text-slate-400">Global Market Barometer</p>
                </div>
                <div className="text-right">
                  <p className="text-2xl font-mono font-bold text-white">{modalIndex.value}</p>
                  <span className={`text-sm font-semibold ${modalIndex.positive ? 'text-emerald-400' : 'text-rose-400'}`}>
                    {modalIndex.change}
                  </span>
                </div>
              </div>
            </div>

            {/* Body */}
            <div className="p-6 space-y-4">
              <p className="text-xs text-slate-300 leading-relaxed bg-[#0f1c33]/50 p-3.5 rounded-xl border border-[#1c2a45]">
                {modalIndex.description}
              </p>

              <div className="grid grid-cols-3 gap-2.5 p-3 rounded-2xl bg-[#0f1c33] border border-[#1c2a45] text-center">
                <div>
                  <span className="text-[11px] text-slate-400 block mb-0.5">52W High</span>
                  <b className="font-mono text-xs text-emerald-400">{modalIndex.high52w}</b>
                </div>
                <div>
                  <span className="text-[11px] text-slate-400 block mb-0.5">52W Low</span>
                  <b className="font-mono text-xs text-slate-200">{modalIndex.low52w}</b>
                </div>
                <div>
                  <span className="text-[11px] text-slate-400 block mb-0.5">Index P/E</span>
                  <b className="font-mono text-xs text-blue-400">{modalIndex.pe}</b>
                </div>
              </div>

              <div>
                <h4 className="text-xs font-mono uppercase tracking-wider text-slate-400 mb-2">
                  Top Weighted Constituents
                </h4>
                <div className="flex flex-wrap gap-2">
                  {modalIndex.topConstituents.map((c, i) => (
                    <span
                      key={i}
                      className="text-xs px-2.5 py-1 rounded-lg bg-[#0f1c33] border border-[#1c2a45] text-slate-300"
                    >
                      {c}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            {/* Footer */}
            <div className="p-5 bg-[#080e1c] border-t border-[#1c2a45] flex items-center justify-between gap-3">
              <button
                onClick={() => setModalIndex(null)}
                className="px-4 py-2 rounded-xl border border-[#1c2a45] text-slate-400 hover:text-white text-xs font-medium"
              >
                Close
              </button>
              <button
                onClick={() => {
                  setModalIndex(null);
                  handleTradeAction();
                }}
                className="px-5 py-2 rounded-xl bg-gradient-to-r from-blue-500 to-blue-700 hover:from-blue-600 hover:to-blue-800 text-white text-xs font-semibold shadow-md flex items-center gap-1.5"
              >
                <span>View Markets in Dashboard</span>
                <ExternalLink size={14} />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* SECTOR SHOWCASE MODAL                                                     */}
      {/* ========================================================================= */}
      {modalSector && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-black/80 backdrop-blur-md animate-fadeIn">
          <div
            className="relative w-full max-w-md bg-[#0b1428] border border-[#1c2a45] rounded-3xl shadow-[0_25px_60px_-15px_rgba(0,0,0,0.9)] overflow-hidden flex flex-col"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="p-6 bg-gradient-to-b from-[#12203d] to-[#0b1428] border-b border-[#1c2a45] relative">
              <button
                onClick={() => setModalSector(null)}
                className="absolute top-5 right-5 w-8 h-8 rounded-full bg-[#1c2a45]/80 hover:bg-[#2a3c61] text-slate-300 flex items-center justify-center transition-colors"
              >
                <X size={16} />
              </button>

              <span className="text-xs font-mono font-bold uppercase tracking-wider text-emerald-400 bg-emerald-500/10 px-2.5 py-1 rounded-full border border-emerald-500/25">
                Sector Overview
              </span>

              <div className="flex items-center justify-between mt-3">
                <h3 className="text-2xl font-display font-bold text-white">{modalSector.name}</h3>
                <span className={`text-xl font-bold font-mono ${modalSector.change >= 0 ? 'text-emerald-400' : 'text-rose-400'}`}>
                  {modalSector.change >= 0 ? '+' : ''}{modalSector.change.toFixed(2)}%
                </span>
              </div>
            </div>

            {/* Body */}
            <div className="p-6 space-y-4">
              <div>
                <h4 className="text-xs font-mono uppercase tracking-wider text-slate-400 mb-2">
                  Top Performing Stocks Today
                </h4>
                <div className="space-y-2">
                  {modalSector.stocks.map((stk, i) => (
                    <div key={i} className="p-2.5 rounded-xl bg-[#0f1c33] border border-[#1c2a45] flex items-center justify-between text-xs font-mono">
                      <span className="text-slate-200 font-bold">{stk.split(' ')[0]}</span>
                      <span className={stk.includes('+') ? 'text-emerald-400 font-semibold' : 'text-rose-400 font-semibold'}>
                        {stk.split(' ')[1]}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              <p className="text-xs text-slate-400 leading-relaxed">
                Institutional fund flows indicate strong momentum rotation within the {modalSector.name} sector over the current trading cycle.
              </p>
            </div>

            {/* Footer */}
            <div className="p-5 bg-[#080e1c] border-t border-[#1c2a45] flex items-center justify-between gap-3">
              <button
                onClick={() => setModalSector(null)}
                className="px-4 py-2 rounded-xl border border-[#1c2a45] text-slate-400 hover:text-white text-xs font-medium"
              >
                Close
              </button>
              <button
                onClick={() => {
                  setModalSector(null);
                  handleTradeAction();
                }}
                className="px-5 py-2 rounded-xl bg-gradient-to-r from-blue-500 to-blue-700 hover:from-blue-600 hover:to-blue-800 text-white text-xs font-semibold shadow-md flex items-center gap-1.5"
              >
                <span>Trade Sector in Dashboard</span>
                <ExternalLink size={14} />
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Markets;


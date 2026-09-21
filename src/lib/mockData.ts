import type {
  User, Holding, Order, Strategy, Recommendation, Alert, CommunityPost,
  LeaderboardEntry, MarketStock, WalletTransaction, MutualFund, Course,
  KYCApplication, SubscriptionPlanData, BacktestResult, CandleData
} from '@/types';

// Generate price history
function genPriceHistory(basePrice: number, days: number = 60) {
  const history: { date: string; price: number }[] = [];
  let price = basePrice * 0.8;
  const now = new Date();
  for (let i = days; i >= 0; i--) {
    const d = new Date(now);
    d.setDate(d.getDate() - i);
    price = price * (1 + (Math.random() - 0.45) * 0.03);
    history.push({ date: d.toISOString().split('T')[0], price: Math.round(price * 100) / 100 });
  }
  return history;
}

function genCandleData(basePrice: number, days: number = 60): CandleData[] {
  const candles: CandleData[] = [];
  let price = basePrice * 0.8;
  const now = new Date();
  for (let i = days; i >= 0; i--) {
    const d = new Date(now);
    d.setDate(d.getDate() - i);
    const open = price;
    const change = (Math.random() - 0.45) * 0.04;
    const close = open * (1 + change);
    const high = Math.max(open, close) * (1 + Math.random() * 0.015);
    const low = Math.min(open, close) * (1 - Math.random() * 0.015);
    price = close;
    candles.push({
      date: d.toISOString().split('T')[0],
      open: Math.round(open * 100) / 100,
      high: Math.round(high * 100) / 100,
      low: Math.round(low * 100) / 100,
      close: Math.round(close * 100) / 100,
      volume: Math.floor(Math.random() * 5000000 + 1000000),
    });
  }
  return candles;
}

function genBacktestData(days: number = 180): BacktestResult[] {
  const results: BacktestResult[] = [];
  let value = 100000;
  let benchmark = 100000;
  const now = new Date();
  for (let i = days; i >= 0; i--) {
    const d = new Date(now);
    d.setDate(d.getDate() - i);
    value = value * (1 + (Math.random() - 0.44) * 0.025);
    benchmark = benchmark * (1 + (Math.random() - 0.47) * 0.015);
    results.push({
      date: d.toISOString().split('T')[0],
      value: Math.round(value),
      benchmark: Math.round(benchmark),
    });
  }
  return results;
}

export const mockUsers: User[] = [
  {
    id: 'u001',
    name: 'Alex Reynolds',
    email: 'alex@example.com',
    role: 'investor',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&crop=face',
    phone: '+1 (555) 234-5678',
    kycStatus: 'approved',
    subscription: 'pro',
    isVerified: true,
    joinDate: '2023-03-15',
    riskProfile: 'moderate',
    goals: ['Retirement Planning', 'Wealth Building', 'Passive Income'],
    portfolioValue: 284750.40,
    totalPnL: 34750.40,
    totalPnLPercent: 13.89,
    followersCount: 128,
    followingCount: 47,
    bio: 'Long-term value investor focused on tech and healthcare sectors.',
  },
  {
    id: 'u002',
    name: 'Priya Sharma',
    email: 'priya@example.com',
    role: 'trader',
    avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&h=100&fit=crop&crop=face',
    phone: '+1 (555) 345-6789',
    kycStatus: 'approved',
    subscription: 'elite',
    isVerified: true,
    joinDate: '2022-11-08',
    riskProfile: 'aggressive',
    goals: ['Short-term Gains', 'Algo Trading', 'Market Timing'],
    portfolioValue: 512300.80,
    totalPnL: 112300.80,
    totalPnLPercent: 28.1,
    followersCount: 892,
    followingCount: 156,
    bio: 'Quantitative trader specializing in momentum strategies and derivatives.',
  },
  {
    id: 'u003',
    name: 'Marcus Chen',
    email: 'marcus@example.com',
    role: 'advisor',
    avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop&crop=face',
    phone: '+1 (555) 456-7890',
    kycStatus: 'approved',
    subscription: 'elite',
    isVerified: true,
    joinDate: '2021-06-22',
    riskProfile: 'moderate',
    goals: ['Client Growth', 'Research Excellence', 'Portfolio Management'],
    portfolioValue: 1250000.00,
    totalPnL: 187500.00,
    totalPnLPercent: 17.6,
    followersCount: 3420,
    followingCount: 89,
    bio: 'CFA-certified financial advisor with 12 years of experience in equity research.',
  },
  {
    id: 'u004',
    name: 'Sarah Williams',
    email: 'admin@novaeq.com',
    role: 'admin',
    avatar: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=100&h=100&fit=crop&crop=face',
    phone: '+1 (555) 567-8901',
    kycStatus: 'approved',
    subscription: 'elite',
    isVerified: true,
    joinDate: '2021-01-01',
    riskProfile: 'conservative',
    goals: ['Platform Growth', 'Compliance', 'User Safety'],
    portfolioValue: 0,
    totalPnL: 0,
    totalPnLPercent: 0,
    followersCount: 0,
    followingCount: 0,
    bio: 'NovaEq platform administrator and compliance officer.',
  },
];

export const mockHoldings: Holding[] = [
  { symbol: 'AAPL', name: 'Apple Inc.', quantity: 45, avgPrice: 168.30, currentPrice: 193.42, value: 8703.90, pnl: 1131.60, pnlPercent: 14.93, sector: 'Technology', change1d: 2.15, change1dPercent: 1.12 },
  { symbol: 'MSFT', name: 'Microsoft Corp.', quantity: 32, avgPrice: 378.20, currentPrice: 425.80, value: 13625.60, pnl: 1523.20, pnlPercent: 12.58, sector: 'Technology', change1d: -3.42, change1dPercent: -0.80 },
  { symbol: 'NVDA', name: 'NVIDIA Corp.', quantity: 18, avgPrice: 498.70, currentPrice: 875.30, value: 15755.40, pnl: 6777.60, pnlPercent: 75.48, sector: 'Technology', change1d: 18.50, change1dPercent: 2.16 },
  { symbol: 'GOOGL', name: 'Alphabet Inc.', quantity: 25, avgPrice: 140.50, currentPrice: 178.90, value: 4472.50, pnl: 960.00, pnlPercent: 27.33, sector: 'Technology', change1d: 1.20, change1dPercent: 0.68 },
  { symbol: 'AMZN', name: 'Amazon.com Inc.', quantity: 38, avgPrice: 172.80, currentPrice: 195.30, value: 7421.40, pnl: 855.00, pnlPercent: 13.02, sector: 'Consumer Discretionary', change1d: -1.85, change1dPercent: -0.94 },
  { symbol: 'JPM', name: 'JPMorgan Chase', quantity: 60, avgPrice: 155.40, currentPrice: 218.70, value: 13122.00, pnl: 3798.00, pnlPercent: 40.73, sector: 'Financial Services', change1d: 0.95, change1dPercent: 0.44 },
  { symbol: 'JNJ', name: 'Johnson & Johnson', quantity: 50, avgPrice: 162.30, currentPrice: 152.40, value: 7620.00, pnl: -495.00, pnlPercent: -6.10, sector: 'Healthcare', change1d: -0.60, change1dPercent: -0.39 },
  { symbol: 'TSLA', name: 'Tesla Inc.', quantity: 22, avgPrice: 245.60, currentPrice: 178.30, value: 3922.60, pnl: -1481.40, pnlPercent: -27.41, sector: 'Consumer Discretionary', change1d: -5.20, change1dPercent: -2.83 },
];

export const mockOrders: Order[] = [
  { id: 'ord001', symbol: 'AAPL', name: 'Apple Inc.', type: 'buy', quantity: 10, price: 191.50, status: 'executed', timestamp: '2024-01-15T09:32:00Z', total: 1915.00 },
  { id: 'ord002', symbol: 'MSFT', name: 'Microsoft Corp.', type: 'buy', quantity: 5, price: 422.30, status: 'executed', timestamp: '2024-01-14T14:18:00Z', total: 2111.50 },
  { id: 'ord003', symbol: 'TSLA', name: 'Tesla Inc.', type: 'sell', quantity: 8, price: 182.40, status: 'executed', timestamp: '2024-01-13T11:05:00Z', total: 1459.20 },
  { id: 'ord004', symbol: 'NVDA', name: 'NVIDIA Corp.', type: 'buy', quantity: 3, price: 868.90, status: 'pending', timestamp: '2024-01-15T15:45:00Z', total: 2606.70 },
  { id: 'ord005', symbol: 'GOOGL', name: 'Alphabet Inc.', type: 'buy', quantity: 15, price: 176.20, status: 'open', timestamp: '2024-01-15T10:22:00Z', total: 2643.00 },
  { id: 'ord006', symbol: 'AMZN', name: 'Amazon.com Inc.', type: 'sell', quantity: 12, price: 198.50, status: 'cancelled', timestamp: '2024-01-12T13:55:00Z', total: 2382.00 },
  { id: 'ord007', symbol: 'JPM', name: 'JPMorgan Chase', type: 'buy', quantity: 20, price: 216.80, status: 'executed', timestamp: '2024-01-11T09:15:00Z', total: 4336.00 },
  { id: 'ord008', symbol: 'META', name: 'Meta Platforms', type: 'buy', quantity: 8, price: 504.20, status: 'executed', timestamp: '2024-01-10T14:30:00Z', total: 4033.60 },
];

export const mockStrategies: Strategy[] = [
  {
    id: 'str001',
    name: 'Momentum Surge Alpha',
    description: 'Identifies stocks with strong price momentum using RSI and MACD crossovers. Targets 10-15% returns per quarter.',
    creatorId: 'u002',
    creatorName: 'Priya Sharma',
    status: 'active',
    returns: 34.8,
    maxDrawdown: 12.3,
    winRate: 68.5,
    trades: 142,
    isPublic: true,
    followers: 287,
    tags: ['momentum', 'technical', 'swing-trading'],
    createdAt: '2023-08-15',
    backtestResults: genBacktestData(180),
  },
  {
    id: 'str002',
    name: 'Sector Rotation Pro',
    description: 'Dynamically rotates between S&P 500 sectors based on economic cycle indicators and relative strength.',
    creatorId: 'u002',
    creatorName: 'Priya Sharma',
    status: 'active',
    returns: 22.1,
    maxDrawdown: 8.5,
    winRate: 72.3,
    trades: 88,
    isPublic: true,
    followers: 456,
    tags: ['sector-rotation', 'macro', 'diversified'],
    createdAt: '2023-10-02',
    backtestResults: genBacktestData(180),
  },
  {
    id: 'str003',
    name: 'Mean Reversion Scalper',
    description: 'High-frequency mean reversion strategy targeting oversold/overbought conditions in large-cap stocks.',
    creatorId: 'u002',
    creatorName: 'Priya Sharma',
    status: 'paused',
    returns: 18.7,
    maxDrawdown: 15.2,
    winRate: 61.8,
    trades: 389,
    isPublic: false,
    followers: 0,
    tags: ['mean-reversion', 'scalping', 'high-frequency'],
    createdAt: '2023-06-20',
    backtestResults: genBacktestData(180),
  },
  {
    id: 'str004',
    name: 'Dividend Aristocrats',
    description: 'Long-term portfolio built on dividend growth stocks. Focus on consistent income and capital preservation.',
    creatorId: 'u003',
    creatorName: 'Marcus Chen',
    status: 'active',
    returns: 11.2,
    maxDrawdown: 4.1,
    winRate: 78.9,
    trades: 34,
    isPublic: true,
    followers: 1205,
    tags: ['dividends', 'value', 'long-term'],
    createdAt: '2022-12-01',
    backtestResults: genBacktestData(365),
  },
];

export const mockRecommendations: Recommendation[] = [
  {
    id: 'rec001',
    advisorId: 'u003',
    advisorName: 'Marcus Chen',
    symbol: 'NVDA',
    name: 'NVIDIA Corporation',
    action: 'buy',
    targetPrice: 1050.00,
    currentPrice: 875.30,
    upside: 19.96,
    risk: 'medium',
    rationale: 'AI chip demand surge with data center revenue accelerating. CUDA ecosystem moat remains intact. Expecting continued margin expansion into 2025.',
    sector: 'Technology',
    followers: 1842,
    publishedAt: '2024-01-12T09:00:00Z',
    isFollowed: true,
    timeHorizon: '12 months',
  },
  {
    id: 'rec002',
    advisorId: 'u003',
    advisorName: 'Marcus Chen',
    symbol: 'MSFT',
    name: 'Microsoft Corporation',
    action: 'buy',
    targetPrice: 480.00,
    currentPrice: 425.80,
    upside: 12.74,
    risk: 'low',
    rationale: 'Azure cloud growth reaccelerating. Copilot AI integration driving enterprise subscription upgrades. Strong free cash flow generation.',
    sector: 'Technology',
    followers: 3120,
    publishedAt: '2024-01-10T11:30:00Z',
    isFollowed: false,
    timeHorizon: '9 months',
  },
  {
    id: 'rec003',
    advisorId: 'u003',
    advisorName: 'Marcus Chen',
    symbol: 'JNJ',
    name: 'Johnson & Johnson',
    action: 'hold',
    targetPrice: 165.00,
    currentPrice: 152.40,
    upside: 8.27,
    risk: 'low',
    rationale: 'Talc litigation overhang clearing. MedTech segment outperforming. Dividend growth streak intact at 62 years. Defensive position in volatile market.',
    sector: 'Healthcare',
    followers: 892,
    publishedAt: '2024-01-08T14:00:00Z',
    isFollowed: false,
    timeHorizon: '6 months',
  },
  {
    id: 'rec004',
    advisorId: 'u003',
    advisorName: 'Marcus Chen',
    symbol: 'TSLA',
    name: 'Tesla Inc.',
    action: 'sell',
    targetPrice: 140.00,
    currentPrice: 178.30,
    upside: -21.53,
    risk: 'high',
    rationale: 'Margin pressure from price cuts intensifying. EV demand slowdown in key markets. Increased competition from BYD and legacy automakers.',
    sector: 'Consumer Discretionary',
    followers: 2341,
    publishedAt: '2024-01-05T10:15:00Z',
    isFollowed: true,
    timeHorizon: '3 months',
  },
  {
    id: 'rec005',
    advisorId: 'u003',
    advisorName: 'Marcus Chen',
    symbol: 'META',
    name: 'Meta Platforms',
    action: 'buy',
    targetPrice: 600.00,
    currentPrice: 504.20,
    upside: 19.00,
    risk: 'medium',
    rationale: "Year of Efficiency 2.0 driving operating leverage. Threads gaining traction. AI-powered ad targeting improvements boosting ARPU across all regions.",
    sector: 'Technology',
    followers: 1567,
    publishedAt: '2024-01-03T09:45:00Z',
    isFollowed: false,
    timeHorizon: '12 months',
  },
];

export const mockAlerts: Alert[] = [
  { id: 'al001', userId: 'u001', type: 'price', title: 'NVDA Price Alert', message: 'NVIDIA crossed your target of $870 — currently at $875.30', symbol: 'NVDA', triggerPrice: 870, isRead: false, createdAt: '2024-01-15T10:32:00Z', isActive: true },
  { id: 'al002', userId: 'u001', type: 'portfolio', title: 'Portfolio Up 2.3% Today', message: 'Your portfolio gained $6,452.30 today. Strong performance in Tech sector.', isRead: false, createdAt: '2024-01-15T09:30:00Z', isActive: true },
  { id: 'al003', userId: 'u001', type: 'news', title: 'Breaking: Fed Rate Decision', message: 'Federal Reserve holds rates steady at 5.25–5.50%. Markets rally on dovish commentary.', isRead: true, createdAt: '2024-01-15T14:00:00Z', isActive: true },
  { id: 'al004', userId: 'u001', type: 'execution', title: 'Order Executed: AAPL Buy', message: '10 shares of Apple Inc. purchased at $191.50. Total: $1,915.00', symbol: 'AAPL', isRead: true, createdAt: '2024-01-15T09:32:00Z', isActive: true },
  { id: 'al005', userId: 'u001', type: 'price', title: 'TSLA Below $180', message: 'Tesla dropped below your watchlist alert of $180 — currently at $178.30', symbol: 'TSLA', triggerPrice: 180, isRead: false, createdAt: '2024-01-15T11:15:00Z', isActive: true },
  { id: 'al006', userId: 'u001', type: 'news', title: 'Earnings Alert: MSFT', message: 'Microsoft beats Q4 estimates with $62.0B revenue. EPS of $3.05 vs $2.78 expected.', isRead: false, createdAt: '2024-01-14T20:30:00Z', isActive: true },
];

export const mockCommunityPosts: CommunityPost[] = [
  {
    id: 'post001',
    userId: 'u003',
    userName: 'Marcus Chen',
    userAvatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop&crop=face',
    userRole: 'advisor',
    content: 'The AI trade is far from over. NVIDIA\'s data center revenue grew 409% YoY last quarter. With inference demand accelerating, I\'m maintaining my $1,050 target. The real question is — are you positioned correctly for this wave? My full analysis is now available in the Insights section. #NVDA #AIStocks #TechInvesting',
    symbol: 'NVDA',
    sentiment: 'bullish',
    likes: 342,
    comments: [
      { id: 'c001', userId: 'u001', userName: 'Alex Reynolds', userAvatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&crop=face', content: 'Great analysis Marcus! I\'ve been adding on every dip. The data center build-out is just getting started.', likes: 28, createdAt: '2024-01-14T11:20:00Z' },
      { id: 'c002', userId: 'u002', userName: 'Priya Sharma', userAvatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&h=100&fit=crop&crop=face', content: 'My algo has been flagging NVDA for a momentum entry since $820. Strong breakout confirmed.', likes: 45, createdAt: '2024-01-14T12:05:00Z' },
    ],
    shares: 89,
    isLiked: false,
    createdAt: '2024-01-14T10:00:00Z',
    tags: ['NVDA', 'AIStocks', 'TechInvesting'],
  },
  {
    id: 'post002',
    userId: 'u002',
    userName: 'Priya Sharma',
    userAvatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&h=100&fit=crop&crop=face',
    userRole: 'trader',
    content: 'Just deployed the Momentum Surge Alpha v2 strategy live. Backtested 34.8% annualized returns with 68.5% win rate over 3 years. The key improvement is adaptive position sizing based on ATR. Anyone else trading momentum here? Drop your setups below 👇 #AlgoTrading #Momentum #QuantTrading',
    sentiment: 'bullish',
    likes: 218,
    comments: [
      { id: 'c003', userId: 'u001', userName: 'Alex Reynolds', userAvatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&crop=face', content: 'Following this strategy! The ATR-based position sizing is a smart addition.', likes: 12, createdAt: '2024-01-13T15:30:00Z' },
    ],
    shares: 67,
    isLiked: true,
    createdAt: '2024-01-13T14:00:00Z',
    tags: ['AlgoTrading', 'Momentum', 'QuantTrading'],
  },
  {
    id: 'post003',
    userId: 'u001',
    userName: 'Alex Reynolds',
    userAvatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&crop=face',
    userRole: 'investor',
    content: 'Year 2 portfolio update: Started with $250K, now at $284.7K (+13.9%). Biggest winners: NVDA (+75%), JPM (+40%), GOOGL (+27%). Biggest drag: TSLA (-27%). Lesson learned — diversification saves you on the downside. Staying patient with my long-term thesis. #LongTermInvesting #PortfolioUpdate',
    sentiment: 'bullish',
    likes: 156,
    comments: [
      { id: 'c004', userId: 'u003', userName: 'Marcus Chen', userAvatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop&crop=face', content: 'Great discipline Alex! The TSLA position hurts but your overall allocation is solid.', likes: 22, createdAt: '2024-01-12T09:45:00Z' },
    ],
    shares: 34,
    isLiked: false,
    createdAt: '2024-01-12T09:00:00Z',
    tags: ['LongTermInvesting', 'PortfolioUpdate'],
  },
];

export const mockLeaderboard: LeaderboardEntry[] = [
  { rank: 1, userId: 'u002', userName: 'Priya Sharma', userAvatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&h=100&fit=crop&crop=face', role: 'trader', returns: 28.1, portfolioValue: 512300, winRate: 68.5, followers: 892, badge: 'Top Trader' },
  { rank: 2, userId: 'u003', userName: 'Marcus Chen', userAvatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop&crop=face', role: 'advisor', returns: 17.6, portfolioValue: 1250000, winRate: 78.9, followers: 3420, badge: 'Elite Advisor' },
  { rank: 3, userId: 'u001', userName: 'Alex Reynolds', userAvatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&crop=face', role: 'investor', returns: 13.9, portfolioValue: 284750, winRate: 62.1, followers: 128, badge: 'Rising Star' },
  { rank: 4, userId: 'u005', userName: 'Jordan Liu', userAvatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&h=100&fit=crop&crop=face', role: 'trader', returns: 11.8, portfolioValue: 198400, winRate: 59.4, followers: 344, badge: 'Active Trader' },
  { rank: 5, userId: 'u006', userName: 'Sofia Mendez', userAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&h=100&fit=crop&crop=face', role: 'investor', returns: 10.2, portfolioValue: 156200, winRate: 55.8, followers: 89, badge: 'Smart Investor' },
];

export const mockMarketStocks: MarketStock[] = [
  { symbol: 'AAPL', name: 'Apple Inc.', price: 193.42, change: 2.15, changePercent: 1.12, volume: '54.2M', marketCap: '$2.98T', sector: 'Technology', high52w: 199.62, low52w: 164.08, pe: 31.2, eps: 6.20, priceHistory: genPriceHistory(193.42), candleData: genCandleData(193.42) },
  { symbol: 'MSFT', name: 'Microsoft Corp.', price: 425.80, change: -3.42, changePercent: -0.80, volume: '22.1M', marketCap: '$3.16T', sector: 'Technology', high52w: 430.82, low52w: 309.45, pe: 36.8, eps: 11.57, priceHistory: genPriceHistory(425.80), candleData: genCandleData(425.80) },
  { symbol: 'NVDA', name: 'NVIDIA Corp.', price: 875.30, change: 18.50, changePercent: 2.16, volume: '38.7M', marketCap: '$2.16T', sector: 'Technology', high52w: 974.00, low52w: 402.18, pe: 68.4, eps: 12.80, priceHistory: genPriceHistory(875.30), candleData: genCandleData(875.30) },
  { symbol: 'GOOGL', name: 'Alphabet Inc.', price: 178.90, change: 1.20, changePercent: 0.68, volume: '31.4M', marketCap: '$2.24T', sector: 'Technology', high52w: 193.31, low52w: 130.67, pe: 27.3, eps: 6.55, priceHistory: genPriceHistory(178.90), candleData: genCandleData(178.90) },
  { symbol: 'AMZN', name: 'Amazon.com Inc.', price: 195.30, change: -1.85, changePercent: -0.94, volume: '44.2M', marketCap: '$2.03T', sector: 'Consumer Discretionary', high52w: 201.20, low52w: 118.35, pe: 59.1, eps: 3.31, priceHistory: genPriceHistory(195.30), candleData: genCandleData(195.30) },
  { symbol: 'META', name: 'Meta Platforms', price: 504.20, change: 8.90, changePercent: 1.80, volume: '18.6M', marketCap: '$1.29T', sector: 'Technology', high52w: 531.49, low52w: 279.40, pe: 25.8, eps: 19.54, priceHistory: genPriceHistory(504.20), candleData: genCandleData(504.20) },
  { symbol: 'TSLA', name: 'Tesla Inc.', price: 178.30, change: -5.20, changePercent: -2.83, volume: '89.4M', marketCap: '$567.8B', sector: 'Consumer Discretionary', high52w: 299.29, low52w: 138.80, pe: 43.2, eps: 4.13, priceHistory: genPriceHistory(178.30), candleData: genCandleData(178.30) },
  { symbol: 'JPM', name: 'JPMorgan Chase', price: 218.70, change: 0.95, changePercent: 0.44, volume: '12.8M', marketCap: '$629.4B', sector: 'Financial Services', high52w: 225.48, low52w: 162.82, pe: 12.8, eps: 17.09, priceHistory: genPriceHistory(218.70), candleData: genCandleData(218.70) },
  { symbol: 'JNJ', name: 'Johnson & Johnson', price: 152.40, change: -0.60, changePercent: -0.39, volume: '8.9M', marketCap: '$365.8B', sector: 'Healthcare', high52w: 175.97, low52w: 143.13, pe: 15.3, eps: 9.96, priceHistory: genPriceHistory(152.40), candleData: genCandleData(152.40) },
  { symbol: 'V', name: 'Visa Inc.', price: 283.50, change: 1.40, changePercent: 0.50, volume: '7.2M', marketCap: '$578.2B', sector: 'Financial Services', high52w: 290.96, low52w: 227.16, pe: 29.4, eps: 9.64, priceHistory: genPriceHistory(283.50), candleData: genCandleData(283.50) },
];

export const mockWalletTransactions: WalletTransaction[] = [
  { id: 'tx001', type: 'deposit', amount: 50000, description: 'Bank Transfer — HDFC Bank ****4521', status: 'completed', timestamp: '2024-01-10T10:00:00Z', reference: 'DEP-241289' },
  { id: 'tx002', type: 'trade_buy', amount: -1915, description: 'Buy 10x AAPL @ $191.50', status: 'completed', timestamp: '2024-01-15T09:32:00Z', reference: 'TRD-392847' },
  { id: 'tx003', type: 'trade_sell', amount: 1459.20, description: 'Sell 8x TSLA @ $182.40', status: 'completed', timestamp: '2024-01-13T11:05:00Z', reference: 'TRD-384729' },
  { id: 'tx004', type: 'trade_buy', amount: -2111.50, description: 'Buy 5x MSFT @ $422.30', status: 'completed', timestamp: '2024-01-14T14:18:00Z', reference: 'TRD-391027' },
  { id: 'tx005', type: 'dividend', amount: 125.80, description: 'Dividend — JNJ Q4 2023', status: 'completed', timestamp: '2024-01-08T12:00:00Z', reference: 'DIV-204815' },
  { id: 'tx006', type: 'withdrawal', amount: -5000, description: 'Withdrawal to Bank ****4521', status: 'completed', timestamp: '2024-01-05T09:30:00Z', reference: 'WDR-198304' },
  { id: 'tx007', type: 'deposit', amount: 25000, description: 'UPI Transfer — @alexreynolds@okicici', status: 'completed', timestamp: '2024-01-02T11:15:00Z', reference: 'DEP-241122' },
  { id: 'tx008', type: 'trade_buy', amount: -4336, description: 'Buy 20x JPM @ $216.80', status: 'completed', timestamp: '2024-01-11T09:15:00Z', reference: 'TRD-388201' },
];

export const mockMutualFunds: MutualFund[] = [
  { id: 'mf001', name: 'Mirae Asset Large Cap Fund', category: 'Large Cap', nav: 98.42, returns1y: 18.3, returns3y: 15.8, returns5y: 16.2, riskLevel: 'low', aum: '$2.8B', minSIP: 500, rating: 5, fundManager: 'Neelesh Surana' },
  { id: 'mf002', name: 'Axis Bluechip Fund', category: 'Large Cap', nav: 52.18, returns1y: 14.6, returns3y: 13.2, returns5y: 14.8, riskLevel: 'low', aum: '$4.1B', minSIP: 500, rating: 4, fundManager: 'Shreyash Devalkar' },
  { id: 'mf003', name: 'SBI Small Cap Fund', category: 'Small Cap', nav: 124.35, returns1y: 32.4, returns3y: 28.7, returns5y: 24.1, riskLevel: 'high', aum: '$1.2B', minSIP: 1000, rating: 5, fundManager: 'R. Srinivasan' },
  { id: 'mf004', name: 'HDFC Mid-Cap Opportunities', category: 'Mid Cap', nav: 89.72, returns1y: 26.8, returns3y: 22.3, returns5y: 19.6, riskLevel: 'medium', aum: '$3.4B', minSIP: 500, rating: 4, fundManager: 'Chirag Setalvad' },
  { id: 'mf005', name: 'Parag Parikh Flexi Cap', category: 'Flexi Cap', nav: 64.28, returns1y: 22.1, returns3y: 19.4, returns5y: 21.3, riskLevel: 'medium', aum: '$5.6B', minSIP: 1000, rating: 5, fundManager: 'Rajeev Thakkar' },
];

export const mockCourses: Course[] = [
  { id: 'cr001', title: 'Stock Market Fundamentals', description: 'Master the basics of stock market investing — from understanding equities to portfolio construction.', instructor: 'Marcus Chen', duration: '8h 30m', level: 'beginner', enrolled: 12840, rating: 4.8, thumbnail: 'https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?w=400&h=225&fit=crop', progress: 65, lessons: 24, category: 'Investing', isEnrolled: true },
  { id: 'cr002', title: 'Technical Analysis Masterclass', description: 'Advanced charting patterns, indicators, and price action strategies used by professional traders.', instructor: 'Priya Sharma', duration: '12h 15m', level: 'advanced', enrolled: 8930, rating: 4.9, thumbnail: 'https://images.unsplash.com/photo-1642790595397-7047b1f0e285?w=400&h=225&fit=crop', progress: 30, lessons: 36, category: 'Trading', isEnrolled: true },
  { id: 'cr003', title: 'Algorithmic Trading with Python', description: 'Build and deploy automated trading strategies using Python, backtrader, and quantitative methods.', instructor: 'Priya Sharma', duration: '16h 45m', level: 'advanced', enrolled: 6280, rating: 4.7, thumbnail: 'https://images.unsplash.com/photo-1518186285589-2f7649de83e0?w=400&h=225&fit=crop', progress: 0, lessons: 48, category: 'Algo Trading', isEnrolled: false },
  { id: 'cr004', title: 'Options & Derivatives 101', description: 'Learn options strategies including covered calls, protective puts, spreads, and the Greeks.', instructor: 'Marcus Chen', duration: '10h 20m', level: 'intermediate', enrolled: 9450, rating: 4.6, thumbnail: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=400&h=225&fit=crop', progress: 0, lessons: 32, category: 'Derivatives', isEnrolled: false },
  { id: 'cr005', title: 'Financial Planning & Wealth Management', description: 'Comprehensive guide to personal finance, tax optimization, and long-term wealth building strategies.', instructor: 'Marcus Chen', duration: '6h 45m', level: 'beginner', enrolled: 15670, rating: 4.8, thumbnail: 'https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?w=400&h=225&fit=crop', progress: 100, lessons: 20, category: 'Wealth Management', isEnrolled: true },
  { id: 'cr006', title: 'Crypto & DeFi Investing', description: 'Navigate the cryptocurrency ecosystem, DeFi protocols, and blockchain-based investment vehicles.', instructor: 'Jordan Liu', duration: '9h 10m', level: 'intermediate', enrolled: 11200, rating: 4.5, thumbnail: 'https://images.unsplash.com/photo-1621761191319-c6fb62004040?w=400&h=225&fit=crop', progress: 0, lessons: 28, category: 'Crypto', isEnrolled: false },
];

export const mockKYCApplications: KYCApplication[] = [
  { id: 'kyc001', userId: 'uk001', userName: 'James Patterson', userEmail: 'james.p@example.com', submittedAt: '2024-01-14T09:30:00Z', status: 'pending', documents: ['PAN Card', 'Aadhaar Card', 'Bank Statement'] },
  { id: 'kyc002', userId: 'uk002', userName: 'Aisha Patel', userEmail: 'aisha.p@example.com', submittedAt: '2024-01-13T14:20:00Z', status: 'pending', documents: ['Passport', 'Bank Statement', 'Address Proof'] },
  { id: 'kyc003', userId: 'uk003', userName: 'Robert Kim', userEmail: 'robert.k@example.com', submittedAt: '2024-01-12T11:45:00Z', status: 'submitted', documents: ['PAN Card', 'Driving License', 'Utility Bill'] },
  { id: 'kyc004', userId: 'uk004', userName: 'Diana Lopez', userEmail: 'diana.l@example.com', submittedAt: '2024-01-11T16:00:00Z', status: 'approved', documents: ['PAN Card', 'Aadhaar Card'], reviewedBy: 'Sarah Williams', reviewedAt: '2024-01-12T10:00:00Z' },
  { id: 'kyc005', userId: 'uk005', userName: 'Michael Wong', userEmail: 'michael.w@example.com', submittedAt: '2024-01-10T08:30:00Z', status: 'rejected', documents: ['PAN Card', 'Bank Statement'], notes: 'Document quality insufficient. Please resubmit with clearer images.', reviewedBy: 'Sarah Williams', reviewedAt: '2024-01-11T09:00:00Z' },
];

export const mockSubscriptionPlans: SubscriptionPlanData[] = [
  { id: 'free', name: 'Free', price: 0, billingPeriod: 'monthly', features: ['5 stocks watchlist', '2 price alerts', 'Basic portfolio tracking', 'Market news feed', 'Community access'], maxWatchlists: 1, maxAlerts: 2, hasAlgoTrading: false, hasAIInsights: false, hasPDFReports: false, isPopular: false },
  { id: 'basic', name: 'Basic', price: 9.99, billingPeriod: 'monthly', features: ['25 stocks watchlist', '15 price alerts', 'Portfolio analytics', 'Technical charts', 'Market heatmaps', 'Strategy marketplace'], maxWatchlists: 3, maxAlerts: 15, hasAlgoTrading: false, hasAIInsights: false, hasPDFReports: false, isPopular: false },
  { id: 'pro', name: 'Pro', price: 29.99, billingPeriod: 'monthly', features: ['Unlimited watchlist', '100 alerts', 'AI recommendations', 'Advanced analytics', 'Algo trading (3 strategies)', 'PDF reports', 'SIP planner', 'Options chain'], maxWatchlists: 10, maxAlerts: 100, hasAlgoTrading: true, hasAIInsights: true, hasPDFReports: true, isPopular: true },
  { id: 'elite', name: 'Elite', price: 79.99, billingPeriod: 'monthly', features: ['Everything in Pro', 'Unlimited strategies', 'Priority AI processing', 'Dedicated advisor access', 'Custom PDF branding', 'API access', 'White-glove support', 'Early feature access'], maxWatchlists: -1, maxAlerts: -1, hasAlgoTrading: true, hasAIInsights: true, hasPDFReports: true, isPopular: false },
];

export const marketTickerData = [
  { symbol: 'SENSEX', value: '74,572.35', change: '+183.22', positive: true },
  { symbol: 'NIFTY 50', value: '22,531.05', change: '+47.65', positive: true },
  { symbol: 'AAPL', value: '$193.42', change: '+1.12%', positive: true },
  { symbol: 'MSFT', value: '$425.80', change: '-0.80%', positive: false },
  { symbol: 'NVDA', value: '$875.30', change: '+2.16%', positive: true },
  { symbol: 'TSLA', value: '$178.30', change: '-2.83%', positive: false },
  { symbol: 'GOOGL', value: '$178.90', change: '+0.68%', positive: true },
  { symbol: 'META', value: '$504.20', change: '+1.80%', positive: true },
  { symbol: 'AMZN', value: '$195.30', change: '-0.94%', positive: false },
  { symbol: 'BTC/USD', value: '$52,847', change: '+3.21%', positive: true },
  { symbol: 'ETH/USD', value: '$2,948', change: '+1.87%', positive: true },
  { symbol: 'GOLD', value: '$2,038/oz', change: '+0.42%', positive: true },
  { symbol: 'CRUDE OIL', value: '$76.42/bbl', change: '-1.15%', positive: false },
  { symbol: 'USD/INR', value: '83.12', change: '+0.08', positive: false },
  { symbol: 'JPM', value: '$218.70', change: '+0.44%', positive: true },
  { symbol: 'V', value: '$283.50', change: '+0.50%', positive: true },
];

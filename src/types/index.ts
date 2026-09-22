export type UserRole = 'investor' | 'trader' | 'advisor' | 'admin';
export type KYCStatus = 'pending' | 'submitted' | 'approved' | 'rejected';
export type SubscriptionPlan = 'free' | 'basic' | 'pro' | 'elite';
export type OrderStatus = 'open' | 'executed' | 'cancelled' | 'pending';
export type OrderType = 'buy' | 'sell';
export type StrategyStatus = 'draft' | 'active' | 'paused' | 'stopped';
export type RecommendationRisk = 'low' | 'medium' | 'high';
export type AlertType = 'price' | 'portfolio' | 'news' | 'execution';

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  avatar: string;
  phone: string;
  kycStatus: KYCStatus;
  subscription: SubscriptionPlan;
  isVerified: boolean;
  joinDate: string;
  riskProfile: 'conservative' | 'moderate' | 'aggressive';
  goals: string[];
  portfolioValue: number;
  totalPnL: number;
  totalPnLPercent: number;
  followersCount: number;
  followingCount: number;
  bio: string;
}

export interface Holding {
  symbol: string;
  name: string;
  quantity: number;
  avgPrice: number;
  currentPrice: number;
  value: number;
  pnl: number;
  pnlPercent: number;
  sector: string;
  change1d: number;
  change1dPercent: number;
}

export interface Order {
  id: string;
  symbol: string;
  name: string;
  type: OrderType;
  quantity: number;
  price: number;
  status: OrderStatus;
  timestamp: string;
  total: number;
}

export interface Strategy {
  id: string;
  name: string;
  description: string;
  creatorId: string;
  creatorName: string;
  status: StrategyStatus;
  returns: number;
  maxDrawdown: number;
  winRate: number;
  trades: number;
  isPublic: boolean;
  followers: number;
  tags: string[];
  createdAt: string;
  backtestResults: BacktestResult[];
}

export interface BacktestResult {
  date: string;
  value: number;
  benchmark: number;
}

export interface Recommendation {
  id: string;
  advisorId: string;
  advisorName: string;
  symbol: string;
  name: string;
  action: 'buy' | 'sell' | 'hold';
  targetPrice: number;
  currentPrice: number;
  upside: number;
  risk: RecommendationRisk;
  rationale: string;
  sector: string;
  followers: number;
  publishedAt: string;
  isFollowed: boolean;
  timeHorizon: string;
}

export interface Alert {
  id: string;
  userId: string;
  type: AlertType;
  title: string;
  message: string;
  symbol?: string;
  triggerPrice?: number;
  isRead: boolean;
  createdAt: string;
  isActive: boolean;
}

export interface CommunityPost {
  id: string;
  userId: string;
  userName: string;
  userAvatar: string;
  userRole: UserRole;
  content: string;
  symbol?: string;
  sentiment?: 'bullish' | 'bearish' | 'neutral';
  likes: number;
  comments: Comment[];
  shares: number;
  isLiked: boolean;
  createdAt: string;
  tags: string[];
}

export interface Comment {
  id: string;
  userId: string;
  userName: string;
  userAvatar: string;
  content: string;
  likes: number;
  createdAt: string;
}

export interface LeaderboardEntry {
  rank: number;
  userId: string;
  userName: string;
  userAvatar: string;
  role: UserRole;
  returns: number;
  portfolioValue: number;
  winRate: number;
  followers: number;
  badge: string;
}

export interface MarketStock {
  symbol: string;
  name: string;
  price: number;
  change: number;
  changePercent: number;
  volume: string;
  marketCap: string;
  sector: string;
  high52w: number;
  low52w: number;
  pe: number;
  eps: number;
  priceHistory: { date: string; price: number }[];
  candleData: CandleData[];
}

export interface CandleData {
  date: string;
  open: number;
  high: number;
  low: number;
  close: number;
  volume: number;
}

export interface WalletTransaction {
  id: string;
  type: 'deposit' | 'withdrawal' | 'trade_buy' | 'trade_sell' | 'dividend';
  amount: number;
  description: string;
  status: 'completed' | 'pending' | 'failed';
  timestamp: string;
  reference: string;
}

export interface MutualFund {
  id: string;
  name: string;
  category: string;
  nav: number;
  returns1y: number;
  returns3y: number;
  returns5y: number;
  riskLevel: RecommendationRisk;
  aum: string;
  minSIP: number;
  rating: number;
  fundManager: string;
}

export interface Course {
  id: string;
  title: string;
  description: string;
  instructor: string;
  duration: string;
  level: 'beginner' | 'intermediate' | 'advanced';
  enrolled: number;
  rating: number;
  thumbnail: string;
  progress: number;
  lessons: number;
  category: string;
  isEnrolled: boolean;
}

export interface KYCApplication {
  id: string;
  userId: string;
  userName: string;
  userEmail: string;
  submittedAt: string;
  status: KYCStatus;
  documents: string[];
  notes?: string;
  reviewedBy?: string;
  reviewedAt?: string;
}

export interface SubscriptionPlanData {
  id: SubscriptionPlan;
  name: string;
  price: number;
  billingPeriod: 'monthly' | 'yearly';
  features: string[];
  maxWatchlists: number;
  maxAlerts: number;
  hasAlgoTrading: boolean;
  hasAIInsights: boolean;
  hasPDFReports: boolean;
  isPopular: boolean;
}

export interface FinancialGoal {
  id: string;
  userId: string;
  name: string;
  category: 'retirement' | 'wealth' | 'house' | 'education' | 'emergency' | 'vacation';
  targetAmount: number;
  currentAmount: number;
  targetYear: number;
  monthlyContribution: number;
  createdAt: string;
}

export interface SIPPlan {
  id: string;
  fundId: string;
  fundName: string;
  amount: number;
  frequency: 'daily' | 'weekly' | 'monthly';
  nextDebitDate: string;
  status: 'active' | 'paused' | 'cancelled';
  totalInvested: number;
  installmentsPaid: number;
}

export interface AppState {
  currentUser: User | null;
  isLoggedIn: boolean;
  users: User[];
  holdings: Holding[];
  orders: Order[];
  strategies: Strategy[];
  recommendations: Recommendation[];
  alerts: Alert[];
  communityPosts: CommunityPost[];
  leaderboard: LeaderboardEntry[];
  marketStocks: MarketStock[];
  walletBalance: number;
  walletTransactions: WalletTransaction[];
  mutualFunds: MutualFund[];
  courses: Course[];
  kycApplications: KYCApplication[];
  subscriptionPlans: SubscriptionPlanData[];
  watchlist: string[];
  financialGoals: FinancialGoal[];
  sipPlans: SIPPlan[];
  sidebarActive: string;
  authModalOpen: boolean;
  authModalReason: string;
  notifications: Alert[];
}


import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type {
  AppState, User, Alert, CommunityPost, Strategy, Recommendation,
  KYCApplication, KYCStatus, SubscriptionPlan, Order, FinancialGoal, SIPPlan, Holding,
  Course, Webinar, MarketBlog
} from '@/types';
import {
  mockUsers, mockHoldings, mockOrders, mockStrategies,
  mockRecommendations, mockAlerts, mockCommunityPosts,
  mockLeaderboard, mockMarketStocks, mockWalletTransactions,
  mockMutualFunds, mockCourses, mockKYCApplications, mockSubscriptionPlans,
  mockWebinars, mockMarketBlogs
} from '@/lib/mockData';

const mockInitialGoals: FinancialGoal[] = [
  {
    id: 'goal-1',
    userId: 'u001',
    name: 'Early Retirement Fund',
    category: 'retirement',
    targetAmount: 25000000,
    currentAmount: 8450000,
    targetYear: 2038,
    monthlyContribution: 45000,
    createdAt: '2024-01-15'
  },
  {
    id: 'goal-2',
    userId: 'u001',
    name: 'Dream Luxury Home (BKC)',
    category: 'house',
    targetAmount: 18000000,
    currentAmount: 5200000,
    targetYear: 2029,
    monthlyContribution: 60000,
    createdAt: '2024-02-10'
  },
  {
    id: 'goal-3',
    userId: 'u001',
    name: 'Higher Education Fund',
    category: 'education',
    targetAmount: 6000000,
    currentAmount: 2800000,
    targetYear: 2032,
    monthlyContribution: 25000,
    createdAt: '2024-03-01'
  }
];

const mockInitialSIPs: SIPPlan[] = [
  {
    id: 'sip-1',
    fundId: 'mf1',
    fundName: 'Quant Active Fund Direct-Growth',
    amount: 15000,
    frequency: 'monthly',
    nextDebitDate: '2026-10-05',
    status: 'active',
    totalInvested: 180000,
    installmentsPaid: 12
  },
  {
    id: 'sip-2',
    fundId: 'mf2',
    fundName: 'Parag Parikh Flexi Cap Fund',
    amount: 20000,
    frequency: 'monthly',
    nextDebitDate: '2026-10-10',
    status: 'active',
    totalInvested: 320000,
    installmentsPaid: 16
  },
  {
    id: 'sip-3',
    fundId: 'mf3',
    fundName: 'Mirae Asset Large Cap Fund',
    amount: 10000,
    frequency: 'monthly',
    nextDebitDate: '2026-10-15',
    status: 'active',
    totalInvested: 90000,
    installmentsPaid: 9
  }
];

interface AppActions {
  login: (email: string, role?: string) => User | null;
  registerUser: (userData: Partial<User> & { password?: string }) => User;
  logout: () => void;
  setCurrentUser: (user: User) => void;
  setSidebarActive: (item: string) => void;
  openAuthModal: (reason?: string) => void;
  closeAuthModal: () => void;
  markAlertRead: (id: string) => void;
  markAllAlertsRead: () => void;
  addAlert: (alert: Omit<Alert, 'id' | 'createdAt'>) => void;
  addOrder: (order: Omit<Order, 'id' | 'timestamp'>) => void;
  toggleFollowRecommendation: (id: string) => void;
  toggleLikePost: (id: string) => void;
  addCommunityPost: (content: string, symbol?: string, sentiment?: CommunityPost['sentiment']) => void;
  addCommentToPost: (postId: string, content: string) => void;
  addRecommendation: (recommendation: Omit<Recommendation, 'id' | 'advisorId' | 'advisorName' | 'publishedAt' | 'followers' | 'isFollowed'>) => void;
  deleteRecommendation: (id: string) => void;
  approveKYC: (id: string) => void;
  rejectKYC: (id: string, notes: string) => void;
  submitKYCApplication: (app: Omit<KYCApplication, 'id' | 'submittedAt' | 'status'>) => void;
  updateUserSubscription: (userId: string, plan: SubscriptionPlan) => void;
  addToWatchlist: (symbol: string) => void;
  removeFromWatchlist: (symbol: string) => void;
  addStrategy: (strategy: Omit<Strategy, 'id' | 'createdAt' | 'backtestResults'>) => void;
  updateStrategy: (id: string, updates: Partial<Strategy>) => void;
  deleteStrategy: (id: string) => void;
  toggleStrategyStatus: (id: string) => void;
  cancelOrder: (id: string) => void;
  deleteOrder: (id: string) => void;
  closeHolding: (symbol: string) => void;
  updateHolding: (symbol: string, updates: Partial<Holding>) => void;
  enrollCourse: (courseId: string) => void;
  updateCourseProgress: (courseId: string, progress: number) => void;
  addCourse: (course: Course) => void;
  updateCourse: (id: string, updates: Partial<Course>) => void;
  deleteCourse: (id: string) => void;
  addWebinar: (webinar: Webinar) => void;
  updateWebinar: (id: string, updates: Partial<Webinar>) => void;
  deleteWebinar: (id: string) => void;
  addBlog: (blog: MarketBlog) => void;
  updateBlog: (id: string, updates: Partial<MarketBlog>) => void;
  deleteBlog: (id: string) => void;
  deposit: (amount: number, method: string) => void;
  withdraw: (amount: number, bankDetails?: { bankName: string; accountNumber: string; ifsc: string }) => void;
  updateUserKYC: (status: KYCStatus) => void;
  updateUserProfile: (updates: Partial<User>) => void;
  addGoal: (goal: Omit<FinancialGoal, 'id' | 'createdAt'>) => void;
  updateGoal: (id: string, updates: Partial<FinancialGoal>) => void;
  deleteGoal: (id: string) => void;
  addSIP: (sip: Omit<SIPPlan, 'id' | 'totalInvested' | 'installmentsPaid'>) => void;
  toggleSIPStatus: (id: string) => void;
  cancelSIP: (id: string) => void;
}

const defaultState: Omit<AppState, keyof AppActions> = {
  currentUser: null,
  isLoggedIn: false,
  users: mockUsers,
  holdings: mockHoldings,
  orders: mockOrders,
  strategies: mockStrategies,
  recommendations: mockRecommendations,
  alerts: mockAlerts,
  communityPosts: mockCommunityPosts,
  leaderboard: mockLeaderboard,
  marketStocks: mockMarketStocks,
  walletBalance: 148500.00,
  walletTransactions: mockWalletTransactions,
  mutualFunds: mockMutualFunds,
  courses: mockCourses,
  webinars: mockWebinars,
  marketBlogs: mockMarketBlogs,
  kycApplications: mockKYCApplications,
  subscriptionPlans: mockSubscriptionPlans,
  watchlist: ['RELIANCE', 'TCS', 'HDFCBANK', 'INFY', 'ICICIBANK', 'TATAMOTORS'],
  financialGoals: mockInitialGoals,
  sipPlans: mockInitialSIPs,
  sidebarActive: 'overview',
  authModalOpen: false,
  authModalReason: '',
  notifications: mockAlerts,
};


export const useAppStore = create<AppState & AppActions>()(
  persist(
    (set, get) => ({
      ...defaultState,

      registerUser: (userData) => {
        const { users } = get();
        const id = `usr_${Date.now()}`;
        const name = userData.name?.trim() || 'Nova Investor';
        const role = (userData.role as UserRole) || 'investor';
        const subscription = (userData.subscription as SubscriptionPlan) || 'pro';

        const avatar = `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(name)}&backgroundColor=0ea5e9,3b82f6,10b981`;

        const newUser: User = {
          id,
          name,
          email: (userData.email || 'user@novaeq.ai').trim().toLowerCase(),
          role,
          avatar,
          phone: userData.phone || '9876543210',
          kycStatus: 'submitted',
          subscription,
          isVerified: true,
          joinDate: new Date().toISOString().split('T')[0],
          riskProfile: userData.riskProfile || 'moderate',
          goals: userData.goals || ['Early Retirement Wealth'],
          portfolioValue: role === 'trader' ? 250000 : 150000,
          totalPnL: 6450,
          totalPnLPercent: 4.3,
          followersCount: 1,
          followingCount: 4,
          bio: `${role === 'trader' ? 'Active Quant Trader' : role === 'advisor' ? 'Certified Financial Advisor' : 'Wealth Accumulator & Investor'} on NovaEq.`,
        };

        const filtered = users.filter((u) => u.email.toLowerCase() !== newUser.email.toLowerCase());
        const updatedUsers = [newUser, ...filtered];

        try {
          localStorage.setItem('novaeq_registered_users', JSON.stringify(updatedUsers));
          sessionStorage.setItem('novaeq_session_user', JSON.stringify(newUser));
        } catch (e) {
          console.warn('Storage sync:', e);
        }

        set({
          users: updatedUsers,
          currentUser: newUser,
          isLoggedIn: true,
          sidebarActive: 'overview',
        });

        return newUser;
      },

      login: (email: string, role?: string) => {
        const { users } = get();

        // Check local storage registered users first
        let localUsers: User[] = [];
        try {
          const stored = localStorage.getItem('novaeq_registered_users');
          if (stored) localUsers = JSON.parse(stored);
        } catch (e) {}

        const allUsers = [...localUsers, ...users];

        let user: User | undefined;
        if (email && email.trim()) {
          user = allUsers.find((u) => u.email.toLowerCase() === email.trim().toLowerCase());
        }

        if (!user && role) {
          user = allUsers.find((u) => u.role === role);
        }

        if (!user) {
          user = allUsers[0];
        }

        if (user) {
          try {
            sessionStorage.setItem('novaeq_session_user', JSON.stringify(user));
          } catch (e) {}

          set({ currentUser: user, isLoggedIn: true, sidebarActive: 'overview' });
          return user;
        }
        return null;
      },

      logout: () => {
        try {
          sessionStorage.removeItem('novaeq_session_user');
        } catch (e) {}
        set({
          currentUser: null,
          isLoggedIn: false,
          sidebarActive: 'overview',
          authModalOpen: false,
        });
      },

      setCurrentUser: (user: User) => set({ currentUser: user }),

      setSidebarActive: (item: string) => set({ sidebarActive: item }),

      openAuthModal: (reason = 'Access this premium feature') => {
        set({ authModalOpen: true, authModalReason: reason });
      },

      closeAuthModal: () => set({ authModalOpen: false, authModalReason: '' }),

      markAlertRead: (id: string) => {
        set(state => ({
          alerts: state.alerts.map(a => a.id === id ? { ...a, isRead: true } : a),
          notifications: state.notifications.map(a => a.id === id ? { ...a, isRead: true } : a),
        }));
      },

      markAllAlertsRead: () => {
        set(state => ({
          alerts: state.alerts.map(a => ({ ...a, isRead: true })),
          notifications: state.notifications.map(a => ({ ...a, isRead: true })),
        }));
      },

      addAlert: (alertData) => {
        const newAlert: Alert = {
          ...alertData,
          id: `al${Date.now()}`,
          createdAt: new Date().toISOString(),
        };
        set(state => ({
          alerts: [newAlert, ...state.alerts],
          notifications: [newAlert, ...state.notifications],
        }));
      },

      addOrder: (orderData) => {
        const newOrder: Order = {
          ...orderData,
          id: `ord${Date.now()}`,
          timestamp: new Date().toISOString(),
        };

        const addAlert = get().addAlert;
        addAlert({
          userId: get().currentUser?.id || '',
          type: 'execution',
          title: `Order ${orderData.status === 'executed' ? 'Executed' : 'Placed'}: ${orderData.symbol}`,
          message: `${orderData.type === 'buy' ? 'Buy' : 'Sell'} ${orderData.quantity}x ${orderData.symbol} @ $${orderData.price.toFixed(2)}`,
          symbol: orderData.symbol,
          isRead: false,
          isActive: true,
        });

        // Sync Holdings and Wallet balance if executed
        if (orderData.status === 'executed') {
          set((state) => {
            const isBuy = orderData.type === 'buy';
            const orderTotal = orderData.total || orderData.quantity * orderData.price;
            const updatedWallet = isBuy
              ? Math.max(0, state.walletBalance - orderTotal)
              : state.walletBalance + orderTotal;

            let updatedHoldings = [...state.holdings];
            const existingIdx = updatedHoldings.findIndex(
              (h) => h.symbol.toUpperCase() === orderData.symbol.toUpperCase()
            );

            if (isBuy) {
              if (existingIdx >= 0) {
                const existing = updatedHoldings[existingIdx];
                const totalQty = existing.quantity + orderData.quantity;
                const newAvg =
                  (existing.avgPrice * existing.quantity + orderData.price * orderData.quantity) /
                  totalQty;
                const val = totalQty * orderData.price;
                const pnl = val - totalQty * newAvg;
                updatedHoldings[existingIdx] = {
                  ...existing,
                  quantity: totalQty,
                  avgPrice: newAvg,
                  currentPrice: orderData.price,
                  value: val,
                  pnl,
                  pnlPercent: newAvg > 0 ? (pnl / (totalQty * newAvg)) * 100 : 0,
                };
              } else {
                updatedHoldings.unshift({
                  symbol: orderData.symbol.toUpperCase(),
                  name: orderData.name || orderData.symbol,
                  quantity: orderData.quantity,
                  avgPrice: orderData.price,
                  currentPrice: orderData.price,
                  value: orderData.quantity * orderData.price,
                  pnl: 0,
                  pnlPercent: 0,
                  change1dPercent: 0.85,
                  assetClass: 'Equity',
                  allocationPercent: 12.5,
                });
              }
            } else {
              // Sell order
              if (existingIdx >= 0) {
                const existing = updatedHoldings[existingIdx];
                const remainingQty = existing.quantity - orderData.quantity;
                if (remainingQty <= 0) {
                  updatedHoldings = updatedHoldings.filter((_, idx) => idx !== existingIdx);
                } else {
                  const val = remainingQty * orderData.price;
                  const pnl = val - remainingQty * existing.avgPrice;
                  updatedHoldings[existingIdx] = {
                    ...existing,
                    quantity: remainingQty,
                    currentPrice: orderData.price,
                    value: val,
                    pnl,
                    pnlPercent: (pnl / (remainingQty * existing.avgPrice)) * 100,
                  };
                }
              }
            }

            return {
              orders: [newOrder, ...state.orders],
              walletBalance: updatedWallet,
              holdings: updatedHoldings,
            };
          });
        } else {
          set((state) => ({ orders: [newOrder, ...state.orders] }));
        }
      },

      cancelOrder: (id: string) => {
        set((state) => ({
          orders: state.orders.map((o) => (o.id === id ? { ...o, status: 'cancelled' } : o)),
        }));
      },

      deleteOrder: (id: string) => {
        set((state) => ({
          orders: state.orders.filter((o) => o.id !== id),
        }));
      },

      closeHolding: (symbol: string) => {
        const holding = get().holdings.find((h) => h.symbol.toUpperCase() === symbol.toUpperCase());
        if (!holding) return;
        get().addOrder({
          symbol: holding.symbol,
          name: holding.name,
          type: 'sell',
          quantity: holding.quantity,
          price: holding.currentPrice,
          status: 'executed',
          total: holding.quantity * holding.currentPrice,
        });
      },

      updateHolding: (symbol: string, updates: Partial<Holding>) => {
        set((state) => ({
          holdings: state.holdings.map((h) =>
            h.symbol.toUpperCase() === symbol.toUpperCase() ? { ...h, ...updates } : h
          ),
        }));
      },

      toggleFollowRecommendation: (id: string) => {
        set(state => ({
          recommendations: state.recommendations.map(r =>
            r.id === id
              ? { ...r, isFollowed: !r.isFollowed, followers: r.isFollowed ? r.followers - 1 : r.followers + 1 }
              : r
          ),
        }));
      },

      toggleLikePost: (id: string) => {
        set(state => ({
          communityPosts: state.communityPosts.map(p =>
            p.id === id
              ? { ...p, isLiked: !p.isLiked, likes: p.isLiked ? p.likes - 1 : p.likes + 1 }
              : p
          ),
        }));
      },

      addCommunityPost: (content, symbol, sentiment) => {
        const { currentUser } = get();
        if (!currentUser) return;
        const newPost: CommunityPost = {
          id: `post${Date.now()}`,
          userId: currentUser.id,
          userName: currentUser.name,
          userAvatar: currentUser.avatar,
          userRole: currentUser.role,
          content,
          symbol,
          sentiment,
          likes: 0,
          comments: [],
          shares: 0,
          isLiked: false,
          createdAt: new Date().toISOString(),
          tags: [],
        };
        set(state => ({
          communityPosts: [newPost, ...state.communityPosts],
          leaderboard: state.leaderboard.map(l =>
            l.userId === currentUser.id ? { ...l, followers: l.followers + 1 } : l
          ),
        }));
      },

      addCommentToPost: (postId, content) => {
        const { currentUser } = get();
        if (!currentUser) return;
        const comment = {
          id: `c${Date.now()}`,
          userId: currentUser.id,
          userName: currentUser.name,
          userAvatar: currentUser.avatar,
          content,
          likes: 0,
          createdAt: new Date().toISOString(),
        };
        set(state => ({
          communityPosts: state.communityPosts.map(p =>
            p.id === postId ? { ...p, comments: [...p.comments, comment] } : p
          ),
        }));
      },

      addRecommendation: (recommendationData) => {
        const { currentUser } = get();
        if (!currentUser) return;

        const newRecommendation: Recommendation = {
          ...recommendationData,
          id: `rec${Date.now()}`,
          advisorId: currentUser.id,
          advisorName: currentUser.name,
          followers: 0,
          publishedAt: new Date().toISOString(),
          isFollowed: false,
        };

        set(state => ({
          recommendations: [newRecommendation, ...state.recommendations],
        }));
      },

      deleteRecommendation: (id: string) => {
        set(state => ({
          recommendations: state.recommendations.filter(r => r.id !== id),
        }));
      },

      submitKYCApplication: (appData) => {
        const { currentUser } = get();
        if (!currentUser) return;
        const newApp: KYCApplication = {
          ...appData,
          id: `kyc${Date.now()}`,
          submittedAt: new Date().toISOString(),
          status: 'submitted',
        };
        set(state => ({
          kycApplications: [newApp, ...state.kycApplications],
          currentUser: state.currentUser ? { ...state.currentUser, kycStatus: 'submitted' } : null,
          users: state.users.map(u => u.id === currentUser.id ? { ...u, kycStatus: 'submitted' } : u),
        }));
      },


      approveKYC: (id: string) => {
        set(state => {
          const app = state.kycApplications.find(k => k.id === id);
          const updatedApps = state.kycApplications.map(k =>
            k.id === id ? { ...k, status: 'approved' as KYCStatus, reviewedBy: 'Sarah Williams', reviewedAt: new Date().toISOString() } : k
          );
          const updatedUsers = app
            ? state.users.map(u =>
              u.id === app.userId ? { ...u, kycStatus: 'approved' as KYCStatus, isVerified: true } : u
            )
            : state.users;
          return {
            kycApplications: updatedApps,
            users: updatedUsers,
            currentUser: app && state.currentUser?.id === app.userId
              ? { ...state.currentUser, kycStatus: 'approved' as KYCStatus, isVerified: true }
              : state.currentUser,
          };
        });
      },

      rejectKYC: (id: string, notes: string) => {
        set(state => {
          const app = state.kycApplications.find(k => k.id === id);
          return {
            kycApplications: state.kycApplications.map(k =>
              k.id === id ? { ...k, status: 'rejected' as KYCStatus, notes, reviewedBy: 'Sarah Williams', reviewedAt: new Date().toISOString() } : k
            ),
            users: app
              ? state.users.map(u =>
                u.id === app.userId ? { ...u, kycStatus: 'rejected' as KYCStatus, isVerified: false } : u
              )
              : state.users,
            currentUser: app && state.currentUser?.id === app.userId
              ? { ...state.currentUser, kycStatus: 'rejected' as KYCStatus, isVerified: false }
              : state.currentUser,
          };
        });
      },

      updateUserSubscription: (userId: string, plan: SubscriptionPlan) => {
        set(state => ({
          users: state.users.map(u => u.id === userId ? { ...u, subscription: plan } : u),
          currentUser: state.currentUser?.id === userId ? { ...state.currentUser, subscription: plan } : state.currentUser,
        }));
      },

      addToWatchlist: (symbol: string) => {
        set(state => ({
          watchlist: state.watchlist.includes(symbol) ? state.watchlist : [...state.watchlist, symbol],
        }));
      },

      removeFromWatchlist: (symbol: string) => {
        set(state => ({ watchlist: state.watchlist.filter(s => s !== symbol) }));
      },

      addStrategy: (strategyData) => {
        const { currentUser } = get();
        if (!currentUser) return;
        const newStrategy: Strategy = {
          ...strategyData,
          id: `str${Date.now()}`,
          creatorId: currentUser.id,
          creatorName: currentUser.name,
          createdAt: new Date().toISOString().split('T')[0],
          backtestResults: [],
        };
        set(state => ({ strategies: [newStrategy, ...state.strategies] }));
      },

      updateStrategy: (id: string, updates: Partial<Strategy>) => {
        set(state => ({
          strategies: state.strategies.map(s => (s.id === id ? { ...s, ...updates } : s)),
        }));
      },

      deleteStrategy: (id: string) => {
        set(state => ({
          strategies: state.strategies.filter(s => s.id !== id),
        }));
      },

      toggleStrategyStatus: (id: string) => {
        set(state => ({
          strategies: state.strategies.map(s =>
            s.id === id ? { ...s, status: s.status === 'active' ? 'paused' : 'active' } : s
          ),
        }));
      },

      enrollCourse: (courseId: string) => {
        set(state => ({
          courses: state.courses.map(c =>
            c.id === courseId ? { ...c, isEnrolled: true, enrolled: c.enrolled + 1 } : c
          ),
        }));
      },

      updateCourseProgress: (courseId: string, progress: number) => {
        set(state => ({
          courses: state.courses.map(c => c.id === courseId ? { ...c, progress } : c),
        }));
      },

      addCourse: (course: Course) => {
        set(state => ({ courses: [course, ...state.courses] }));
      },

      updateCourse: (id: string, updates: Partial<Course>) => {
        set(state => ({
          courses: state.courses.map(c => c.id === id ? { ...c, ...updates } : c),
        }));
      },

      deleteCourse: (id: string) => {
        set(state => ({
          courses: state.courses.filter(c => c.id !== id),
        }));
      },

      addWebinar: (webinar: Webinar) => {
        set(state => ({ webinars: [webinar, ...state.webinars] }));
      },

      updateWebinar: (id: string, updates: Partial<Webinar>) => {
        set(state => ({
          webinars: state.webinars.map(w => w.id === id ? { ...w, ...updates } : w),
        }));
      },

      deleteWebinar: (id: string) => {
        set(state => ({
          webinars: state.webinars.filter(w => w.id !== id),
        }));
      },

      addBlog: (blog: MarketBlog) => {
        set(state => ({ marketBlogs: [blog, ...state.marketBlogs] }));
      },

      updateBlog: (id: string, updates: Partial<MarketBlog>) => {
        set(state => ({
          marketBlogs: state.marketBlogs.map(b => b.id === id ? { ...b, ...updates } : b),
        }));
      },

      deleteBlog: (id: string) => {
        set(state => ({
          marketBlogs: state.marketBlogs.filter(b => b.id !== id),
        }));
      },

      deposit: (amount: number, method: string) => {
        const newTx = {
          id: `tx${Date.now()}`,
          type: 'deposit' as const,
          amount,
          description: `Deposit via ${method}`,
          status: 'completed' as const,
          timestamp: new Date().toISOString(),
          reference: `DEP-${Math.random().toString(36).substr(2, 8).toUpperCase()}`,
        };
        const addAlert = get().addAlert;
        addAlert({
          userId: get().currentUser?.id || '',
          type: 'execution',
          title: `Funds Added: ₹${amount.toLocaleString()}`,
          message: `Successfully deposited ₹${amount.toLocaleString()} via ${method} (Razorpay Demo).`,
          isRead: false,
          isActive: true,
        });
        set(state => ({
          walletBalance: state.walletBalance + amount,
          walletTransactions: [newTx, ...state.walletTransactions],
        }));
      },

      withdraw: (amount: number, bankDetails) => {
        const { walletBalance } = get();
        if (amount > walletBalance) return;
        const newTx = {
          id: `tx${Date.now()}`,
          type: 'withdrawal' as const,
          amount: -amount,
          description: bankDetails
            ? `Withdrawal to ${bankDetails.bankName} (A/C: ...${bankDetails.accountNumber.slice(-4)})`
            : 'Withdrawal to linked verified bank account',
          status: 'completed' as const,
          timestamp: new Date().toISOString(),
          reference: `WDR-${Math.random().toString(36).substr(2, 8).toUpperCase()}`,
        };
        const addAlert = get().addAlert;
        addAlert({
          userId: get().currentUser?.id || '',
          type: 'portfolio',
          title: `Withdrawal Initiated: ₹${amount.toLocaleString()}`,
          message: `Bank verification complete. ₹${amount.toLocaleString()} will be credited to your account within 24 working hours.`,
          isRead: false,
          isActive: true,
        });
        set(state => ({
          walletBalance: state.walletBalance - amount,
          walletTransactions: [newTx, ...state.walletTransactions],
        }));
      },

      updateUserKYC: (status: KYCStatus) => {
        set(state => ({
          currentUser: state.currentUser ? { ...state.currentUser, kycStatus: status } : null,
          users: state.users.map(u =>
            u.id === state.currentUser?.id ? { ...u, kycStatus: status } : u
          ),
        }));
      },

      updateUserProfile: (updates: Partial<User>) => {
        set(state => ({
          currentUser: state.currentUser ? { ...state.currentUser, ...updates } : null,
          users: state.users.map(u =>
            u.id === state.currentUser?.id ? { ...u, ...updates } : u
          ),
        }));
      },

      addGoal: (goalData) => {
        const { currentUser } = get();
        if (!currentUser) return;
        const newGoal: FinancialGoal = {
          ...goalData,
          id: `goal${Date.now()}`,
          userId: currentUser.id,
          createdAt: new Date().toISOString().split('T')[0],
        };
        set(state => ({ financialGoals: [newGoal, ...state.financialGoals] }));
      },

      updateGoal: (id: string, updates: Partial<FinancialGoal>) => {
        set(state => ({
          financialGoals: state.financialGoals.map(g => (g.id === id ? { ...g, ...updates } : g)),
        }));
      },

      deleteGoal: (id: string) => {
        set(state => ({
          financialGoals: state.financialGoals.filter(g => g.id !== id),
        }));
      },

      addSIP: (sipData) => {
        const newSIP: SIPPlan = {
          ...sipData,
          id: `sip${Date.now()}`,
          totalInvested: sipData.amount,
          installmentsPaid: 1,
        };
        set(state => ({ sipPlans: [newSIP, ...state.sipPlans] }));
      },

      toggleSIPStatus: (id: string) => {
        set(state => ({
          sipPlans: state.sipPlans.map(s =>
            s.id === id ? { ...s, status: s.status === 'active' ? 'paused' : 'active' } : s
          ),
        }));
      },

      cancelSIP: (id: string) => {
        set(state => ({
          sipPlans: state.sipPlans.map(s => (s.id === id ? { ...s, status: 'cancelled' } : s)),
        }));
      },
    }),
    {
      name: 'novaeq-store',
      partialize: (state) => ({
        currentUser: state.currentUser,
        isLoggedIn: state.isLoggedIn,
        users: state.users,
        watchlist: state.watchlist,
        walletBalance: state.walletBalance,
        walletTransactions: state.walletTransactions,
        orders: state.orders,
        strategies: state.strategies,
        alerts: state.alerts,
        communityPosts: state.communityPosts,
        kycApplications: state.kycApplications,
        courses: state.courses,
        recommendations: state.recommendations,
        financialGoals: state.financialGoals,
        sipPlans: state.sipPlans,
      }),
    }
  )
);



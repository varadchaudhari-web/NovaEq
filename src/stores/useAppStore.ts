import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type {
  AppState, User, Alert, CommunityPost, Strategy, Recommendation,
  KYCApplication, KYCStatus, SubscriptionPlan, Order
} from '@/types';
import {
  mockUsers, mockHoldings, mockOrders, mockStrategies,
  mockRecommendations, mockAlerts, mockCommunityPosts,
  mockLeaderboard, mockMarketStocks, mockWalletTransactions,
  mockMutualFunds, mockCourses, mockKYCApplications, mockSubscriptionPlans
} from '@/lib/mockData';

interface AppActions {
  login: (email: string, role?: string) => User | null;
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
  approveKYC: (id: string) => void;
  rejectKYC: (id: string, notes: string) => void;
  updateUserSubscription: (userId: string, plan: SubscriptionPlan) => void;
  addToWatchlist: (symbol: string) => void;
  removeFromWatchlist: (symbol: string) => void;
  addStrategy: (strategy: Omit<Strategy, 'id' | 'createdAt' | 'backtestResults'>) => void;
  toggleStrategyStatus: (id: string) => void;
  enrollCourse: (courseId: string) => void;
  updateCourseProgress: (courseId: string, progress: number) => void;
  deposit: (amount: number, method: string) => void;
  withdraw: (amount: number) => void;
  updateUserKYC: (status: KYCStatus) => void;
  updateUserProfile: (updates: Partial<User>) => void;
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
  walletBalance: 68420.50,
  walletTransactions: mockWalletTransactions,
  mutualFunds: mockMutualFunds,
  courses: mockCourses,
  kycApplications: mockKYCApplications,
  subscriptionPlans: mockSubscriptionPlans,
  watchlist: ['AAPL', 'MSFT', 'NVDA', 'GOOGL', 'AMZN'],
  sidebarActive: 'overview',
  authModalOpen: false,
  authModalReason: '',
  notifications: mockAlerts,
};

export const useAppStore = create<AppState & AppActions>()(
  persist(
    (set, get) => ({
      ...defaultState,

      login: (email: string, role?: string) => {
        const { users } = get();
        let user = users.find(u => u.email.toLowerCase() === email.toLowerCase());
        if (!user && role) {
          const roleMap: Record<string, string> = {
            investor: 'u001', trader: 'u002', advisor: 'u003', admin: 'u004',
          };
          user = users.find(u => u.id === roleMap[role]);
        }
        if (!user) {
          user = users.find(u => u.role === (role || 'investor'));
        }
        if (user) {
          set({ currentUser: user, isLoggedIn: true, sidebarActive: 'overview' });
          return user;
        }
        return null;
      },

      logout: () => {
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
        set(state => ({ orders: [newOrder, ...state.orders] }));
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
        set(state => ({
          walletBalance: state.walletBalance + amount,
          walletTransactions: [newTx, ...state.walletTransactions],
        }));
      },

      withdraw: (amount: number) => {
        const { walletBalance } = get();
        if (amount > walletBalance) return;
        const newTx = {
          id: `tx${Date.now()}`,
          type: 'withdrawal' as const,
          amount: -amount,
          description: 'Withdrawal to linked bank account',
          status: 'completed' as const,
          timestamp: new Date().toISOString(),
          reference: `WDR-${Math.random().toString(36).substr(2, 8).toUpperCase()}`,
        };
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
      }),
    }
  )
);

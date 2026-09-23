import React, { Suspense, lazy } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import PublicNavbar from '@/components/layout/PublicNavbar';
import Footer from '@/components/layout/Footer';
import AuthModal from '@/components/ui/AuthModal';
import ScrollToTop, { RouteScrollToTop } from '@/components/ui/ScrollToTop';
import { useAppStore } from '@/stores/useAppStore';
import { Toaster } from 'sonner';

// Public Pages
const Home = lazy(() => import('@/pages/public/Home'));
const Markets = lazy(() => import('@/pages/public/Markets'));
const AIInsights = lazy(() => import('@/pages/public/AIInsights'));
const Pricing = lazy(() => import('@/pages/public/Pricing'));
const Learn = lazy(() => import('@/pages/public/Learn'));
const Community = lazy(() => import('@/pages/public/Community'));
const About = lazy(() => import('@/pages/public/About'));
const Contact = lazy(() => import('@/pages/public/Contact'));
const PrivacyPolicy = lazy(() => import('@/pages/public/legal/PrivacyPolicy'));
const TermsOfService = lazy(() => import('@/pages/public/legal/TermsOfService'));
const SecurityCompliance = lazy(() => import('@/pages/public/legal/SecurityCompliance'));
const RiskDisclosure = lazy(() => import('@/pages/public/legal/RiskDisclosure'));

// Auth Pages
const Login = lazy(() => import('@/pages/auth/Login'));
const CreateAccount = lazy(() => import('@/pages/auth/CreateAccount'));

// Dashboard Pages
const RetailInvestorDashboard = lazy(() => import('@/pages/dashboard/RetailInvestorDashboard'));
const TraderDashboard = lazy(() => import('@/pages/dashboard/TraderDashboard'));
const AdvisorDashboard = lazy(() => import('@/pages/dashboard/AdvisorDashboard'));
const AdminDashboard = lazy(() => import('@/pages/dashboard/AdminDashboard'));

const LoadingSpinner = () => (
  <div className="flex items-center justify-center min-h-screen bg-nova-bg">
    <div className="flex flex-col items-center gap-4">
      <div className="relative w-12 h-12">
        <div className="absolute inset-0 border-4 border-nova-primary/20 rounded-full" />
        <div className="absolute inset-0 border-4 border-nova-accent border-t-transparent rounded-full animate-spin" />
      </div>
      <p className="text-nova-text-muted text-sm">Loading NovaEq...</p>
    </div>
  </div>
);

const PublicLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <>
    <PublicNavbar />
    <main>{children}</main>
    <Footer />
  </>
);

// Protected Route — redirects to login if not authenticated
const ProtectedRoute: React.FC<{ children: React.ReactNode; requiredRole?: string }> = ({ children, requiredRole }) => {
  const { isLoggedIn, currentUser } = useAppStore();
  if (!isLoggedIn) return <Navigate to="/login" replace />;
  if (requiredRole && currentUser?.role !== requiredRole) {
    const paths: Record<string, string> = { investor: '/dashboard/investor', trader: '/dashboard/trader', advisor: '/dashboard/advisor', admin: '/dashboard/admin' };
    return <Navigate to={paths[currentUser?.role || 'investor'] || '/dashboard/investor'} replace />;
  }
  return <>{children}</>;
};

const DashboardAlertRedirect: React.FC = () => {
  const { currentUser } = useAppStore();
  const paths: Record<string, string> = {
    investor: '/dashboard/investor',
    trader: '/dashboard/trader',
    advisor: '/dashboard/advisor',
    admin: '/dashboard/admin',
  };

  return <Navigate to={paths[currentUser?.role || 'investor'] || '/dashboard/investor'} replace state={{ activeTab: 'alerts' }} />;
};

const NotFound: React.FC = () => (
  <PublicLayout>
    <div className="min-h-screen flex items-center justify-center text-center px-4 pt-24">
      <div>
        <p className="text-8xl font-black gradient-text mb-4">404</p>
        <h1 className="text-3xl font-display font-bold text-nova-text mb-3">Page Not Found</h1>
        <p className="text-nova-text-muted mb-8">The page you're looking for doesn't exist.</p>
        <a href="/" className="nova-btn-primary inline-block">Return Home</a>
      </div>
    </div>
  </PublicLayout>
);

const App: React.FC = () => {
  return (
    <BrowserRouter future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
      <Toaster position="top-right" richColors />
      <RouteScrollToTop />
      <ScrollToTop />
      <AuthModal />
      <Suspense fallback={<LoadingSpinner />}>
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<PublicLayout><Home /></PublicLayout>} />
          <Route path="/markets" element={<PublicLayout><Markets /></PublicLayout>} />
          <Route path="/ai-insights" element={<PublicLayout><AIInsights /></PublicLayout>} />
          <Route path="/pricing" element={<PublicLayout><Pricing /></PublicLayout>} />
          <Route path="/learn" element={<PublicLayout><Learn /></PublicLayout>} />
          <Route path="/community" element={<PublicLayout><Community /></PublicLayout>} />
          <Route path="/about" element={<PublicLayout><About /></PublicLayout>} />
          <Route path="/contact" element={<PublicLayout><Contact /></PublicLayout>} />
          <Route path="/privacy" element={<PrivacyPolicy />} />
          <Route path="/terms" element={<TermsOfService />} />
          <Route path="/security" element={<SecurityCompliance />} />
          <Route path="/risk-disclosure" element={<RiskDisclosure />} />

          {/* Auth Routes (with navbar) */}
          <Route path="/login" element={<PublicLayout><Login /></PublicLayout>} />
          <Route path="/create-account" element={<PublicLayout><CreateAccount /></PublicLayout>} />

          {/* Dashboard Routes (protected, no navbar) */}
          <Route path="/dashboard/investor" element={
            <ProtectedRoute requiredRole="investor"><RetailInvestorDashboard /></ProtectedRoute>
          } />
          <Route path="/dashboard/trader" element={
            <ProtectedRoute requiredRole="trader"><TraderDashboard /></ProtectedRoute>
          } />
          <Route path="/dashboard/advisor" element={
            <ProtectedRoute requiredRole="advisor"><AdvisorDashboard /></ProtectedRoute>
          } />
          <Route path="/dashboard/admin" element={
            <ProtectedRoute requiredRole="admin"><AdminDashboard /></ProtectedRoute>
          } />
          <Route path="/dashboard/alerts" element={
            <ProtectedRoute><DashboardAlertRedirect /></ProtectedRoute>
          } />

          {/* Catch-all */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </Suspense>
    </BrowserRouter>
  );
};

export default App;

import React from 'react';
import { FileText, ShieldAlert, CheckCircle2, Scale, AlertTriangle } from 'lucide-react';
import { Link } from 'react-router-dom';
import PublicNavbar from '@/components/layout/PublicNavbar';
import Footer from '@/components/layout/Footer';

const TermsOfService: React.FC = () => {
  return (
    <div className="min-h-screen bg-[#070d1a] text-[#f8fafc]">
      <PublicNavbar />

      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pt-32 pb-24">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full border border-blue-500/30 bg-blue-500/10 text-xs font-semibold text-blue-300 mb-4">
            <Scale size={13} className="text-blue-400" />
            <span>User Agreement & Platform Terms</span>
          </div>
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-display font-bold text-white mb-4">
            Terms of Service
          </h1>
          <p className="text-slate-400 text-sm sm:text-base">
            Please read these terms carefully before deploying strategies or accessing NovaEq services.
          </p>
        </div>

        {/* Content Box */}
        <div className="border border-[#1c2a45] bg-[#0b1428]/80 backdrop-blur-xl rounded-3xl p-6 sm:p-10 space-y-8 shadow-2xl">
          <section>
            <h2 className="text-xl font-display font-bold text-white mb-3 flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-blue-400" />
              1. Platform Services & Eligibility
            </h2>
            <p className="text-sm text-slate-300 leading-relaxed">
              By creating an account on NovaEq, you warrant that you are at least 18 years of age, legally competent under the Indian Contract Act, 1872, and possess valid KYC credentials to trade in Indian or international capital markets.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-display font-bold text-white mb-3 flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-amber-400" />
              2. Algorithmic Trading & Automated Execution
            </h2>
            <div className="space-y-3 text-sm text-slate-300">
              <p className="leading-relaxed">
                NovaEq provides quantitative backtesting tools, visual strategy builders, and webhook execution relays. You explicitly acknowledge that:
              </p>
              <div className="p-4 rounded-xl bg-[#0f1c33] border border-[#1c2a45] space-y-2">
                <div className="flex items-start gap-2 text-slate-300">
                  <CheckCircle2 size={15} className="text-emerald-400 flex-shrink-0 mt-0.5" />
                  <span>All automated trading bot logic, leverage multipliers, and position sizes are set at your sole discretion.</span>
                </div>
                <div className="flex items-start gap-2 text-slate-300">
                  <CheckCircle2 size={15} className="text-emerald-400 flex-shrink-0 mt-0.5" />
                  <span>Exchange network latency, slippage, and brokerage gateway connection outages can affect fill prices.</span>
                </div>
                <div className="flex items-start gap-2 text-slate-300">
                  <CheckCircle2 size={15} className="text-emerald-400 flex-shrink-0 mt-0.5" />
                  <span>Historical backtest results do not assure future equity returns.</span>
                </div>
              </div>
            </div>
          </section>

          <section>
            <h2 className="text-xl font-display font-bold text-white mb-3 flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-rose-400" />
              3. Nature of AI Insights
            </h2>
            <div className="p-4 rounded-xl bg-rose-500/10 border border-rose-500/30 text-xs sm:text-sm text-rose-200 leading-relaxed flex items-start gap-3">
              <AlertTriangle size={18} className="text-rose-400 flex-shrink-0 mt-0.5" />
              <div>
                <b>Statutory Clarification:</b> NovaEq is a financial data analytics provider and technology ecosystem. AI signals, sentiment scores, and stock catalysts are algorithmically computed for quantitative decision support and do not constitute certified personal investment advice.
              </div>
            </div>
          </section>

          <section>
            <h2 className="text-xl font-display font-bold text-white mb-3 flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-blue-400" />
              4. Subscription Billing & Cancellations
            </h2>
            <p className="text-sm text-slate-300 leading-relaxed">
              Paid plans (Pro, Elite) are billed on a recurring monthly or annual cycle. You may cancel your subscription at any time via your dashboard settings, and your benefits will remain active until the close of the current billing period.
            </p>
          </section>
        </div>

        <div className="mt-10 text-center">
          <Link to="/" className="inline-flex items-center gap-2 text-sm text-blue-400 hover:text-blue-300 font-semibold">
            <span>&larr; Back to Home</span>
          </Link>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default TermsOfService;

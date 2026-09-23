import React from 'react';
import { AlertTriangle, TrendingDown, Scale, ShieldAlert, CheckCircle2 } from 'lucide-react';
import { Link } from 'react-router-dom';
import PublicNavbar from '@/components/layout/PublicNavbar';
import Footer from '@/components/layout/Footer';

const RiskDisclosure: React.FC = () => {
  return (
    <div className="min-h-screen bg-[#070d1a] text-[#f8fafc]">
      <PublicNavbar />

      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pt-32 pb-24">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full border border-rose-500/30 bg-rose-500/10 text-xs font-semibold text-rose-300 mb-4">
            <AlertTriangle size={13} className="text-rose-400" />
            <span>Statutory Risk Notice</span>
          </div>
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-display font-bold text-white mb-4">
            Risk Disclosure & Disclaimer
          </h1>
          <p className="text-slate-400 text-sm sm:text-base max-w-2xl mx-auto">
            Mandatory disclosures regarding derivatives, equity market volatility, and algorithmic trading risks.
          </p>
        </div>

        {/* Highlighted Warning Box */}
        <div className="p-6 rounded-3xl bg-rose-500/10 border border-rose-500/30 mb-8 shadow-xl">
          <div className="flex items-start gap-4">
            <div className="w-10 h-10 rounded-xl bg-rose-500/20 text-rose-400 flex items-center justify-center flex-shrink-0 mt-1">
              <ShieldAlert size={22} />
            </div>
            <div className="space-y-2">
              <h3 className="text-base sm:text-lg font-display font-bold text-white">
                SEBI Risk Disclosure on Derivatives (Futures & Options)
              </h3>
              <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                As per SEBI study dated January 25, 2023, <b>9 out of 10 individual traders in equity Futures and Options segment incurred net losses</b>, with an average loss of ~₹50,000 per trader. In addition, transaction costs accounted for 15% to 50% of the net trading losses.
              </p>
            </div>
          </div>
        </div>

        {/* Content Box */}
        <div className="border border-[#1c2a45] bg-[#0b1428]/80 backdrop-blur-xl rounded-3xl p-6 sm:p-10 space-y-8 shadow-2xl">
          <section>
            <h2 className="text-xl font-display font-bold text-white mb-3 flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-amber-400" />
              1. General Market Volatility Risk
            </h2>
            <p className="text-sm text-slate-300 leading-relaxed">
              Investments in the securities market are subject to market risks. Stock prices can fluctuate due to macroeconomic interest rate adjustments, global geopolitical events, quarterly earnings, and liquidity shortages. Never risk capital you cannot afford to lose entirely.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-display font-bold text-white mb-3 flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-blue-400" />
              2. Algorithmic System & Execution Risk
            </h2>
            <p className="text-sm text-slate-300 leading-relaxed">
              Automated execution strategies rely on software, exchange connectivity, and mathematical models. Technical anomalies, hardware breakdowns, network disconnects, or extreme market volatility may result in unexecuted orders, unexpected slippage, or execution at unfavorable prices.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-display font-bold text-white mb-3 flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-purple-400" />
              3. No Guaranteed Returns
            </h2>
            <p className="text-sm text-slate-300 leading-relaxed">
              NovaEq does not guarantee any minimum return on equity, mutual funds, or algorithmic strategies. Any historical performance metrics shown on backtests are purely indicative and do not guarantee future performance.
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

export default RiskDisclosure;

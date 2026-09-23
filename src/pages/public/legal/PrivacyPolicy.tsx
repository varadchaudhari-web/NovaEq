import React from 'react';
import { Shield, Lock, Eye, FileText, CheckCircle2, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import PublicNavbar from '@/components/layout/PublicNavbar';
import Footer from '@/components/layout/Footer';

const PrivacyPolicy: React.FC = () => {
  return (
    <div className="min-h-screen bg-[#070d1a] text-[#f8fafc]">
      <PublicNavbar />

      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pt-32 pb-24">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full border border-blue-500/30 bg-blue-500/10 text-xs font-semibold text-blue-300 mb-4">
            <Lock size={13} className="text-blue-400" />
            <span>Legal & Data Protection</span>
          </div>
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-display font-bold text-white mb-4">
            Privacy Policy
          </h1>
          <p className="text-slate-400 text-sm sm:text-base">
            Last Updated: January 15, 2026 · Effective Date: January 1, 2024
          </p>
        </div>

        {/* Content Box */}
        <div className="border border-[#1c2a45] bg-[#0b1428]/80 backdrop-blur-xl rounded-3xl p-6 sm:p-10 space-y-8 shadow-2xl">
          <section>
            <h2 className="text-xl font-display font-bold text-white mb-3 flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-blue-400" />
              1. Introduction & Scope
            </h2>
            <p className="text-sm text-slate-300 leading-relaxed">
              NovaEq Technologies Private Limited (&ldquo;NovaEq&rdquo;, &ldquo;we&rdquo;, &ldquo;our&rdquo;, or &ldquo;us&rdquo;) is committed to safeguarding the personal, financial, and transactional privacy of our users. This Privacy Policy details how we collect, process, encrypt, and store information when you access our quantitative analytics, algorithmic trading platform, mobile applications, and web ecosystem.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-display font-bold text-white mb-3 flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-emerald-400" />
              2. Information We Collect
            </h2>
            <div className="space-y-3 text-sm text-slate-300">
              <div className="p-4 rounded-xl bg-[#0f1c33] border border-[#1c2a45]">
                <b className="text-white block mb-1">A. KYC & Identification Data</b>
                <span>Full legal name, PAN card number, Aadhaar number (masked), date of birth, contact phone number, and residential address as mandated under SEBI regulations.</span>
              </div>
              <div className="p-4 rounded-xl bg-[#0f1c33] border border-[#1c2a45]">
                <b className="text-white block mb-1">B. Financial & Trading Telemetry</b>
                <span>Linked brokerage identifiers, portfolio holdings data, order execution history, algorithmic strategy parameters, and risk tolerance scores.</span>
              </div>
              <div className="p-4 rounded-xl bg-[#0f1c33] border border-[#1c2a45]">
                <b className="text-white block mb-1">C. Technical Device & Log Data</b>
                <span>IP addresses, device telemetry, browser signatures, session cookies, and multi-factor biometric authentication verification logs.</span>
              </div>
            </div>
          </section>

          <section>
            <h2 className="text-xl font-display font-bold text-white mb-3 flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-blue-400" />
              3. How We Use & Protect Your Data
            </h2>
            <ul className="space-y-2.5 text-sm text-slate-300">
              <li className="flex items-start gap-2.5">
                <CheckCircle2 size={16} className="text-emerald-400 flex-shrink-0 mt-0.5" />
                <span>To compute customized AI risk calibration matrices and deliver relevant algorithmic signals.</span>
              </li>
              <li className="flex items-start gap-2.5">
                <CheckCircle2 size={16} className="text-emerald-400 flex-shrink-0 mt-0.5" />
                <span>To comply with statutory anti-money laundering (AML) and Prevention of Money Laundering Act (PMLA) obligations.</span>
              </li>
              <li className="flex items-start gap-2.5">
                <CheckCircle2 size={16} className="text-emerald-400 flex-shrink-0 mt-0.5" />
                <span>To ensure bank-grade isolation: all databases are encrypted with AES-256 at rest and TLS 1.3 in transit.</span>
              </li>
              <li className="flex items-start gap-2.5">
                <CheckCircle2 size={16} className="text-emerald-400 flex-shrink-0 mt-0.5" />
                <span>We never sell or monetize your individual trading telemetry or personal data to third-party advertisers.</span>
              </li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-display font-bold text-white mb-3 flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-amber-400" />
              4. Data Retention & User Rights
            </h2>
            <p className="text-sm text-slate-300 leading-relaxed mb-4">
              Under SEBI mandates, financial transaction and KYC records must be retained securely for a period of not less than 5 years. You retain the right to request an extract of your personal profile data or request account closure at any time through our Compliance Officer.
            </p>
            <div className="p-4 rounded-xl bg-[#12203d] border border-[#1c2a45] text-xs text-slate-300">
              <b>Data Grievance Officer:</b> compliance@novaeq.ai · Tech Tower, Bandra-Kurla Complex (BKC), Mumbai 400051.
            </div>
          </section>
        </div>

        {/* Navigation back */}
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

export default PrivacyPolicy;

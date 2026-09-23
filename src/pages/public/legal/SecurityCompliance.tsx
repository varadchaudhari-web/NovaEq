import React from 'react';
import { ShieldCheck, Lock, Server, Key, Eye, CheckCircle2, Shield } from 'lucide-react';
import { Link } from 'react-router-dom';
import PublicNavbar from '@/components/layout/PublicNavbar';
import Footer from '@/components/layout/Footer';

const SecurityCompliance: React.FC = () => {
  return (
    <div className="min-h-screen bg-[#070d1a] text-[#f8fafc]">
      <PublicNavbar />

      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pt-32 pb-24">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full border border-emerald-500/30 bg-emerald-500/10 text-xs font-semibold text-emerald-300 mb-4">
            <ShieldCheck size={13} className="text-emerald-400" />
            <span>Institutional-Grade Infrastructure</span>
          </div>
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-display font-bold text-white mb-4">
            Security & Compliance
          </h1>
          <p className="text-slate-400 text-sm sm:text-base max-w-2xl mx-auto">
            How NovaEq safeguards customer funds, proprietary algorithms, and sensitive financial credentials.
          </p>
        </div>

        {/* Security Grid */}
        <div className="grid sm:grid-cols-2 gap-4 mb-8">
          {[
            {
              title: '256-Bit AES & TLS 1.3',
              desc: 'End-to-end data encryption across database storage, memory caches, and network relays.',
              icon: Lock,
              color: 'text-blue-400 bg-blue-500/10 border-blue-500/30',
            },
            {
              title: 'SEBI & PMLA Regulated',
              desc: 'Strict adherence to KYC guidelines, audit surveillance, and Penny Drop verification.',
              icon: Shield,
              color: 'text-emerald-400 bg-emerald-500/10 border-emerald-500/30',
            },
            {
              title: 'Zero-Trust Network Isolation',
              desc: 'Segregated VPC clusters with automated DDOS mitigation, Cloudflare Edge, and rate limiting.',
              icon: Server,
              color: 'text-purple-400 bg-purple-500/10 border-purple-500/30',
            },
            {
              title: 'Multi-Factor Biometrics',
              desc: 'TOTP 2FA, biometric fingerprint/FaceID confirmation for major fund movements and trades.',
              icon: Key,
              color: 'text-amber-400 bg-amber-500/10 border-amber-500/30',
            },
          ].map((item, i) => {
            const Icon = item.icon;
            return (
              <div
                key={i}
                className="p-6 rounded-2xl bg-[#0b1428] border border-[#1c2a45] shadow-lg flex flex-col justify-between"
              >
                <div>
                  <div
                    className={`w-10 h-10 rounded-xl border flex items-center justify-center mb-4 ${item.color}`}
                  >
                    <Icon size={20} />
                  </div>
                  <h3 className="text-base font-display font-bold text-white mb-2">{item.title}</h3>
                  <p className="text-xs sm:text-sm text-slate-400 leading-relaxed">{item.desc}</p>
                </div>
              </div>
            );
          })}
        </div>

        {/* Details Box */}
        <div className="border border-[#1c2a45] bg-[#0b1428]/80 backdrop-blur-xl rounded-3xl p-6 sm:p-10 space-y-6 shadow-2xl">
          <h2 className="text-xl font-display font-bold text-white">Certifications & Audit Ledger</h2>
          <div className="space-y-3 text-xs sm:text-sm text-slate-300">
            <div className="flex items-start gap-2.5">
              <CheckCircle2 size={16} className="text-emerald-400 flex-shrink-0 mt-0.5" />
              <span><b>ISO/IEC 27001:2022 Certified</b> for Information Security Management Systems.</span>
            </div>
            <div className="flex items-start gap-2.5">
              <CheckCircle2 size={16} className="text-emerald-400 flex-shrink-0 mt-0.5" />
              <span><b>Quarterly Third-Party Penetration Testing (VAPT)</b> conducted by CERT-In empaneled auditors.</span>
            </div>
            <div className="flex items-start gap-2.5">
              <CheckCircle2 size={16} className="text-emerald-400 flex-shrink-0 mt-0.5" />
              <span><b>Hardware Security Modules (HSM)</b> for secure private key and API credential storage.</span>
            </div>
          </div>
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

export default SecurityCompliance;

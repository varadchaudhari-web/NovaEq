import React from 'react';
import { Shield, Users, Award, TrendingUp, Brain, Linkedin, Twitter, Lock, FileText } from 'lucide-react';
import { Link } from 'react-router-dom';
import TiltCard from '@/components/ui/TiltCard';

const team = [
  { name: 'Aditya Menon', role: 'CEO & Co-Founder', bio: 'Former Goldman Sachs VP, IIT Bombay. 15+ years in fintech and quantitative finance.', avatar: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?w=120&h=120&fit=crop&crop=face' },
  { name: 'Neha Kapoor', role: 'CTO & Co-Founder', bio: 'Ex-Google SWE, Stanford CS. Built ML trading systems managing $2B+ AUM.', avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=120&h=120&fit=crop&crop=face' },
  { name: 'Rajan Suri', role: 'Chief Risk Officer', bio: '20 years in risk management at JP Morgan, Deutsche Bank. CFA Charterholder.', avatar: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=120&h=120&fit=crop&crop=face' },
  { name: 'Priya Malhotra', role: 'Head of AI Research', bio: 'PhD in ML from MIT. Former quant researcher at Two Sigma and Citadel.', avatar: 'https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?w=120&h=120&fit=crop&crop=face' },
];

const milestones = [
  { year: '2020', event: 'NovaEq founded by Aditya & Neha in Mumbai' },
  { year: '2021', event: 'Seed funding: ₹15 Cr from Sequoia India. Launched beta with 500 users.' },
  { year: '2022', event: 'Series A: ₹85 Cr. Launched AI recommendation engine. Reached 25,000 users.' },
  { year: '2023', event: 'Series B: ₹240 Cr. Expanded to 100,000+ users. Algo trading launched.' },
  { year: '2024', event: '125,000+ active investors. ₹12,400 Cr AUT. Expanding to Southeast Asia.' },
];

const partners = ['NSE India', 'BSE', 'CDSL', 'SEBI Registered', 'RBI Compliant', 'ISO 27001'];

const About: React.FC = () => {
  return (
    <div className="min-h-screen pt-24">
      {/* Hero */}
      <div className="max-w-4xl mx-auto px-4 text-center mb-16">
        <h1 className="text-5xl font-display font-black text-nova-text mb-5">
          Building the Future of<br /><span className="gradient-text">Wealth Creation in India</span>
        </h1>
        <p className="text-lg text-nova-text-muted leading-relaxed">
          NovaEq is on a mission to democratize institutional-grade investment intelligence for every Indian investor — from first-time savers to professional fund managers.
        </p>
      </div>

      {/* Values with 3D Tilt */}
      <div className="bg-nova-surface border-y border-nova-border py-14 mb-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-2xl font-display font-bold text-nova-text text-center mb-10">What We Stand For</h2>
          <div className="grid md:grid-cols-3 gap-6">
            {[
              { icon: Shield, title: 'Trust & Security', desc: 'SEBI regulated, ISO 27001 certified, bank-grade encryption. Your data and capital are always protected.', color: 'text-nova-primary-light', bg: 'bg-nova-primary/10' },
              { icon: Brain, title: 'AI-First Approach', desc: 'Every feature is powered by proprietary AI models trained on 20+ years of market data across global exchanges.', color: 'text-nova-accent', bg: 'bg-nova-accent/10' },
              { icon: Users, title: 'Community Driven', desc: 'We believe the best investment insights come from a smart, engaged community sharing knowledge openly.', color: 'text-nova-yellow', bg: 'bg-nova-yellow/10' },
            ].map(({ icon: Icon, title, desc, color, bg }) => (
              <TiltCard key={title} className="p-6 text-center" tiltMaxAngle={9} translateZ={12}>
                <div className={`w-14 h-14 rounded-2xl ${bg} flex items-center justify-center mx-auto mb-4`}>
                  <Icon size={24} className={color} />
                </div>
                <h3 className="text-lg font-bold text-nova-text mb-2">{title}</h3>
                <p className="text-nova-text-muted text-sm leading-relaxed">{desc}</p>
              </TiltCard>
            ))}
          </div>
        </div>
      </div>

      {/* Timeline */}
      <div className="max-w-3xl mx-auto px-4 sm:px-6 mb-16">
        <h2 className="text-2xl font-display font-bold text-nova-text text-center mb-10">Our Journey</h2>
        <div className="relative">
          <div className="absolute left-8 top-0 bottom-0 w-px bg-nova-border" />
          <div className="space-y-6">
            {milestones.map(m => (
              <div key={m.year} className="flex gap-6 relative">
                <div className="w-16 h-16 rounded-full bg-nova-primary/10 border-2 border-nova-primary flex items-center justify-center flex-shrink-0 z-10 shadow-md">
                  <span className="text-xs font-black text-nova-primary-light">{m.year}</span>
                </div>
                <TiltCard className="p-4 flex-1 self-center" tiltMaxAngle={5} translateZ={6}>
                  <p className="text-sm text-nova-text-muted">{m.event}</p>
                </TiltCard>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Team with 3D Tilt */}
      <div className="bg-nova-surface border-y border-nova-border py-14 mb-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-2xl font-display font-bold text-nova-text text-center mb-10">Leadership Team</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {team.map(member => (
              <TiltCard key={member.name} className="p-5 text-center group cursor-pointer" tiltMaxAngle={10} translateZ={12}>
                <img src={member.avatar} alt={member.name} className="w-20 h-20 rounded-2xl object-cover mx-auto mb-4 group-hover:scale-105 transition-transform shadow-lg" />
                <p className="text-sm font-bold text-nova-text">{member.name}</p>
                <p className="text-xs text-nova-accent mb-2">{member.role}</p>
                <p className="text-xs text-nova-text-muted leading-relaxed">{member.bio}</p>
                <div className="flex justify-center gap-2 mt-3">
                  <a href="#" className="nova-btn-ghost p-1.5 rounded-lg"><Linkedin size={14} /></a>
                  <a href="#" className="nova-btn-ghost p-1.5 rounded-lg"><Twitter size={14} /></a>
                </div>
              </TiltCard>
            ))}
          </div>
        </div>
      </div>

      {/* Partners & Compliance */}
      <div id="partners" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-16">
        <h2 className="text-2xl font-display font-bold text-nova-text text-center mb-8">Regulatory & Exchange Partners</h2>
        <div className="flex flex-wrap justify-center gap-4">
          {partners.map(p => (
            <TiltCard key={p} className="px-6 py-4 flex items-center gap-2 cursor-pointer" tiltMaxAngle={8}>
              <Shield size={16} className="text-nova-accent" />
              <span className="text-sm font-semibold text-nova-text">{p}</span>
            </TiltCard>
          ))}
        </div>
        <p className="text-center text-xs text-nova-text-subtle mt-6 max-w-2xl mx-auto" id="disclaimer">
          NovaEq is a financial analytics and AI platform. All investment insights are for educational and informational purposes only. 
          NovaEq does not provide SEBI-regulated investment advisory services. Past performance does not guarantee future results.
        </p>
      </div>

      {/* Legal with 3D Tilt */}
      <div className="bg-nova-surface border-y border-nova-border py-14 mb-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-2xl font-display font-bold text-nova-text text-center mb-10">Trust, Terms & Security</h2>
          <div className="grid md:grid-cols-3 gap-5">
            <TiltCard id="privacy" className="p-6 scroll-mt-24" tiltMaxAngle={8} translateZ={10}>
              <Shield size={24} className="text-nova-accent mb-4" />
              <h3 className="text-lg font-bold text-nova-text mb-2">Privacy Policy</h3>
              <p className="text-sm text-nova-text-muted leading-relaxed">
                NovaEq collects only the account, KYC, portfolio, and usage data needed to operate the platform. We do not sell personal data, and users can request account data correction or deletion through support.
              </p>
            </TiltCard>
            <TiltCard id="terms" className="p-6 scroll-mt-24" tiltMaxAngle={8} translateZ={10}>
              <FileText size={24} className="text-nova-primary-light mb-4" />
              <h3 className="text-lg font-bold text-nova-text mb-2">Terms</h3>
              <p className="text-sm text-nova-text-muted leading-relaxed">
                Platform insights, dashboards, simulations, and educational material are provided for informational use. Users remain responsible for investment decisions and must follow applicable market regulations.
              </p>
            </TiltCard>
            <TiltCard id="security" className="p-6 scroll-mt-24" tiltMaxAngle={8} translateZ={10}>
              <Lock size={24} className="text-nova-yellow mb-4" />
              <h3 className="text-lg font-bold text-nova-text mb-2">Security</h3>
              <p className="text-sm text-nova-text-muted leading-relaxed">
                Account access uses layered authentication, encrypted data handling, audit logging, and role-based controls for investor, trader, advisor, and admin workflows.
              </p>
            </TiltCard>
          </div>
        </div>
      </div>

      {/* Careers CTA with 3D Tilt */}
      <div id="careers" className="max-w-3xl mx-auto px-4 text-center pb-20 scroll-mt-24">
        <TiltCard className="p-10" tiltMaxAngle={6} translateZ={10}>
          <Award size={32} className="text-nova-accent mx-auto mb-4" />
          <h2 className="text-2xl font-display font-bold text-nova-text mb-3">Join the NovaEq Team</h2>
          <p className="text-nova-text-muted mb-6">We're hiring engineers, data scientists, and financial analysts. Come build the future of investing.</p>
          <Link to="/contact" className="nova-btn-primary inline-flex items-center gap-2">
            View Open Positions <TrendingUp size={16} />
          </Link>
        </TiltCard>
      </div>
    </div>
  );
};

export default About;


import React, { useState } from 'react';
import {
  Shield,
  Users,
  Award,
  TrendingUp,
  Brain,
  Linkedin,
  Twitter,
  Lock,
  FileText,
  MapPin,
  Briefcase,
  Clock,
  CheckCircle2,
  X,
  ChevronRight,
  Send,
  UploadCloud,
  Sparkles
} from 'lucide-react';
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

interface JobPosition {
  id: string;
  title: string;
  department: string;
  location: string;
  type: string;
  experience: string;
  salary: string;
  summary: string;
  requirements: string[];
}

const openPositions: JobPosition[] = [
  {
    id: 'pos-1',
    title: 'Senior Quantitative Developer',
    department: 'Quantitative Research',
    location: 'Mumbai / Hybrid',
    type: 'Full-time',
    experience: '4-7 Years',
    salary: '₹28,00,000 - ₹45,00,000 PA',
    summary: 'Build ultra-low latency execution engines, tick-by-tick statistical arbitrage models, and multi-asset algorithmic strategies.',
    requirements: ['Proficiency in C++ (17/20) or Python / Cython', 'Experience with market order books, FIX protocol, and microsecond latency', 'Strong foundation in probability, statistics, and linear algebra']
  },
  {
    id: 'pos-2',
    title: 'Lead AI / ML Research Engineer',
    department: 'AI & Data Science',
    location: 'Bengaluru / Remote',
    type: 'Full-time',
    experience: '5-9 Years',
    salary: '₹32,00,000 - ₹52,00,000 PA',
    summary: 'Lead the development of generative market narrative models, transformer-based price-action forecasting, and automated risk scoring.',
    requirements: ['Proven experience with PyTorch, Transformer architectures, and LLM fine-tuning', 'Experience modeling financial time series and multimodal sentiment', 'Published research in NeurIPS, ICML, or equivalent financial ML conferences is a plus']
  },
  {
    id: 'pos-3',
    title: 'Senior Full Stack Frontend Architect',
    department: 'Engineering',
    location: 'Remote (India)',
    type: 'Full-time',
    experience: '4-8 Years',
    salary: '₹24,00,000 - ₹38,00,000 PA',
    summary: 'Design and optimize real-time streaming financial dashboards, interactive WebGL charting, and resilient trading interfaces.',
    requirements: ['Mastery of React, TypeScript, Tailwind CSS, Canvas, and WebSocket state machines', 'Deep knowledge of web performance, bundle optimization, and high-frequency DOM updates', 'Experience with charting libraries (Lightweight Charts, D3, Recharts)']
  },
  {
    id: 'pos-4',
    title: 'Distributed Systems Backend Engineer',
    department: 'Engineering',
    location: 'Mumbai / Remote',
    type: 'Full-time',
    experience: '3-6 Years',
    salary: '₹22,00,000 - ₹36,00,000 PA',
    summary: 'Architect scalable event-driven microservices processing over 100,000 events per second with sub-millisecond persistence.',
    requirements: ['Strong experience in Go, Node.js / TypeScript, or Rust', 'Hands-on expertise with Apache Kafka, Redis cluster, PostgreSQL, and Docker/K8s', 'Solid understanding of distributed consensus, transactions, and failover']
  },
  {
    id: 'pos-5',
    title: 'Product Manager - Trading & Execution',
    department: 'Product & Design',
    location: 'Bengaluru / Hybrid',
    type: 'Full-time',
    experience: '3-6 Years',
    salary: '₹20,00,000 - ₹34,00,000 PA',
    summary: 'Own the roadmap for algorithmic execution tools, backtesting sandbox, order types, and risk management suites for retail and institutional traders.',
    requirements: ['Deep knowledge of Indian stock, futures, and options markets', 'Track record of launching fintech or trading products with high NPS', 'Data-driven mindset with analytical chops in SQL and user behavior telemetry']
  },
  {
    id: 'pos-6',
    title: 'Algorithmic Risk & Compliance Specialist',
    department: 'Risk & Operations',
    location: 'Mumbai',
    type: 'Full-time',
    experience: '2-5 Years',
    salary: '₹16,00,000 - ₹26,00,000 PA',
    summary: 'Oversee automated risk limits, margin simulations, SEBI regulatory compliance checks, and real-time stress testing.',
    requirements: ['Understanding of SEBI algorithmic trading guidelines, peak margin rules, and VaR', 'Hands-on data analysis skills in Python / Pandas and SQL', 'Prior experience at a stock broker, AMC, or prop trading desk']
  }
];

const About: React.FC = () => {
  const [selectedDept, setSelectedDept] = useState('All');
  const [selectedJob, setSelectedJob] = useState<JobPosition | null>(null);
  const [applicationSuccess, setApplicationSuccess] = useState(false);
  const [applicantForm, setApplicantForm] = useState({
    name: '',
    email: '',
    phone: '',
    experience: '',
    portfolio: '',
    resumeName: '',
    coverNote: ''
  });

  const departments = ['All', 'Quantitative Research', 'AI & Data Science', 'Engineering', 'Product & Design', 'Risk & Operations'];

  const filteredPositions = selectedDept === 'All'
    ? openPositions
    : openPositions.filter(p => p.department === selectedDept);

  const handleApplySubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setApplicationSuccess(true);
    setTimeout(() => {
      setApplicationSuccess(false);
      setSelectedJob(null);
      setApplicantForm({
        name: '',
        email: '',
        phone: '',
        experience: '',
        portfolio: '',
        resumeName: '',
        coverNote: ''
      });
    }, 2500);
  };

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
            <TiltCard id="privacy" className="p-6 scroll-mt-28" tiltMaxAngle={8} translateZ={10}>
              <Shield size={24} className="text-nova-accent mb-4" />
              <h3 className="text-lg font-bold text-nova-text mb-2">Privacy Policy</h3>
              <p className="text-sm text-nova-text-muted leading-relaxed">
                NovaEq collects only the account, KYC, portfolio, and usage data needed to operate the platform. We do not sell personal data, and users can request account data correction or deletion through support.
              </p>
            </TiltCard>
            <TiltCard id="terms" className="p-6 scroll-mt-28" tiltMaxAngle={8} translateZ={10}>
              <FileText size={24} className="text-nova-primary-light mb-4" />
              <h3 className="text-lg font-bold text-nova-text mb-2">Terms</h3>
              <p className="text-sm text-nova-text-muted leading-relaxed">
                Platform insights, dashboards, simulations, and educational material are provided for informational use. Users remain responsible for investment decisions and must follow applicable market regulations.
              </p>
            </TiltCard>
            <TiltCard id="security" className="p-6 scroll-mt-28" tiltMaxAngle={8} translateZ={10}>
              <Lock size={24} className="text-nova-yellow mb-4" />
              <h3 className="text-lg font-bold text-nova-text mb-2">Security</h3>
              <p className="text-sm text-nova-text-muted leading-relaxed">
                Account access uses layered authentication, encrypted data handling, audit logging, and role-based controls for investor, trader, advisor, and admin workflows.
              </p>
            </TiltCard>
          </div>
        </div>
      </div>

      {/* Careers Section - Open Positions */}
      <div id="careers" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-24 scroll-mt-28">
        <div className="text-center max-w-3xl mx-auto mb-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-nova-accent/10 border border-nova-accent/20 text-nova-accent text-xs font-semibold mb-3">
            <Award size={14} /> Careers at NovaEq
          </div>
          <h2 className="text-3xl font-display font-black text-nova-text mb-3">
            Join the NovaEq Team & Build the Future of Trading
          </h2>
          <p className="text-nova-text-muted text-sm leading-relaxed">
            We are hiring ambitious quantitative developers, AI researchers, software engineers, and product specialists to empower over a million Indian traders.
          </p>
        </div>

        {/* Department Filters */}
        <div className="flex flex-wrap items-center justify-center gap-2 mb-8">
          {departments.map(dept => (
            <button
              key={dept}
              onClick={() => setSelectedDept(dept)}
              className={`px-4 py-2 rounded-xl text-xs font-semibold transition-all ${
                selectedDept === dept
                  ? 'bg-nova-accent text-nova-bg shadow-lg shadow-nova-accent/20 font-bold'
                  : 'bg-nova-card border border-nova-border text-nova-text-muted hover:text-nova-text hover:border-nova-accent/40'
              }`}
            >
              {dept} {dept === 'All' ? `(${openPositions.length})` : `(${openPositions.filter(p => p.department === dept).length})`}
            </button>
          ))}
        </div>

        {/* Job Listings Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
          {filteredPositions.map(job => (
            <TiltCard
              key={job.id}
              className="p-6 flex flex-col justify-between border border-nova-border hover:border-nova-accent/50 transition-all group"
              tiltMaxAngle={6}
              translateZ={10}
            >
              <div>
                <div className="flex items-center justify-between gap-2 mb-3">
                  <span className="text-[11px] font-bold px-2.5 py-1 rounded-md bg-nova-primary/15 text-nova-primary-light border border-nova-primary/25">
                    {job.department}
                  </span>
                  <span className="text-xs font-mono font-medium text-emerald-400">
                    {job.salary}
                  </span>
                </div>

                <h3 className="text-base font-bold text-nova-text group-hover:text-nova-accent transition-colors mb-2">
                  {job.title}
                </h3>

                <p className="text-xs text-nova-text-muted leading-relaxed mb-4">
                  {job.summary}
                </p>

                <div className="space-y-1.5 mb-4 border-t border-nova-border/60 pt-3">
                  <p className="text-[11px] font-semibold text-nova-text-subtle uppercase tracking-wider">Key Requirements:</p>
                  {job.requirements.slice(0, 2).map((req, idx) => (
                    <div key={idx} className="flex items-start gap-1.5 text-xs text-nova-text-muted">
                      <span className="text-nova-accent mt-0.5">•</span>
                      <span>{req}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="pt-4 border-t border-nova-border flex items-center justify-between">
                <div className="flex items-center gap-3 text-xs text-nova-text-subtle">
                  <span className="flex items-center gap-1"><MapPin size={12} className="text-nova-accent" /> {job.location}</span>
                  <span className="flex items-center gap-1"><Briefcase size={12} className="text-nova-primary-light" /> {job.experience}</span>
                </div>
                <button
                  onClick={() => setSelectedJob(job)}
                  className="nova-btn-primary text-xs py-1.5 px-3.5 inline-flex items-center gap-1"
                >
                  Apply <ChevronRight size={14} />
                </button>
              </div>
            </TiltCard>
          ))}
        </div>

        {/* Culture / Perks Highlight */}
        <div className="bg-gradient-to-r from-nova-card via-nova-surface to-nova-card border border-nova-border rounded-2xl p-8 text-center max-w-4xl mx-auto">
          <h3 className="text-lg font-bold text-nova-text mb-4 flex items-center justify-center gap-2">
            <Sparkles size={18} className="text-nova-accent" /> Why Build With Us?
          </h3>
          <div className="grid sm:grid-cols-3 gap-6 text-left">
            <div className="p-4 rounded-xl bg-nova-bg/50 border border-nova-border/70">
              <p className="text-xs font-bold text-nova-text mb-1">Top 1% Compensation & ESOPs</p>
              <p className="text-xs text-nova-text-muted">Competitive pay benchmarked against top hedge funds and fintech startups.</p>
            </div>
            <div className="p-4 rounded-xl bg-nova-bg/50 border border-nova-border/70">
              <p className="text-xs font-bold text-nova-text mb-1">Cutting-Edge GPU Clusters</p>
              <p className="text-xs text-nova-text-muted">Uncapped compute resources for training quantitative models and LLM systems.</p>
            </div>
            <div className="p-4 rounded-xl bg-nova-bg/50 border border-nova-border/70">
              <p className="text-xs font-bold text-nova-text mb-1">Flexible & Remote First</p>
              <p className="text-xs text-nova-text-muted">Work from our Mumbai / Bengaluru tech centers or anywhere across India.</p>
            </div>
          </div>
        </div>
      </div>

      {/* Job Application Modal */}
      {selectedJob && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 backdrop-blur-sm p-4 overflow-y-auto">
          <div className="nova-card border border-nova-border w-full max-w-lg p-6 my-8 relative shadow-2xl animate-in fade-in zoom-in-95">
            <button
              onClick={() => setSelectedJob(null)}
              className="absolute top-4 right-4 text-nova-text-muted hover:text-nova-text p-1 rounded-lg hover:bg-nova-surface transition-colors"
            >
              <X size={20} />
            </button>

            {applicationSuccess ? (
              <div className="py-8 text-center space-y-4">
                <div className="w-16 h-16 rounded-full bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center mx-auto text-emerald-400">
                  <CheckCircle2 size={32} />
                </div>
                <h3 className="text-xl font-display font-bold text-nova-text">Application Submitted!</h3>
                <p className="text-sm text-nova-text-muted max-w-sm mx-auto">
                  Thank you, <span className="text-nova-text font-semibold">{applicantForm.name}</span>. Our talent acquisition team will review your profile for <span className="text-nova-accent font-semibold">{selectedJob.title}</span> and connect with you shortly.
                </p>
              </div>
            ) : (
              <form onSubmit={handleApplySubmit} className="space-y-4">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-[11px] font-bold px-2 py-0.5 rounded bg-nova-primary/20 text-nova-primary-light">
                      {selectedJob.department}
                    </span>
                    <span className="text-xs text-nova-text-muted">• {selectedJob.location}</span>
                  </div>
                  <h3 className="text-xl font-display font-bold text-nova-text">{selectedJob.title}</h3>
                  <p className="text-xs text-nova-text-muted mt-1">{selectedJob.summary}</p>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="nova-label text-xs">Full Name *</label>
                    <input
                      type="text"
                      required
                      value={applicantForm.name}
                      onChange={e => setApplicantForm({ ...applicantForm, name: e.target.value })}
                      className="nova-input text-xs"
                      placeholder="e.g. Rahul Sharma"
                    />
                  </div>
                  <div>
                    <label className="nova-label text-xs">Email Address *</label>
                    <input
                      type="email"
                      required
                      value={applicantForm.email}
                      onChange={e => setApplicantForm({ ...applicantForm, email: e.target.value })}
                      className="nova-input text-xs"
                      placeholder="rahul@example.com"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="nova-label text-xs">Phone Number *</label>
                    <input
                      type="tel"
                      required
                      value={applicantForm.phone}
                      onChange={e => setApplicantForm({ ...applicantForm, phone: e.target.value })}
                      className="nova-input text-xs"
                      placeholder="+91 98765 43210"
                    />
                  </div>
                  <div>
                    <label className="nova-label text-xs">Years of Experience *</label>
                    <input
                      type="text"
                      required
                      value={applicantForm.experience}
                      onChange={e => setApplicantForm({ ...applicantForm, experience: e.target.value })}
                      className="nova-input text-xs"
                      placeholder="e.g. 5 Years"
                    />
                  </div>
                </div>

                <div>
                  <label className="nova-label text-xs">Portfolio / LinkedIn / GitHub URL *</label>
                  <input
                    type="url"
                    required
                    value={applicantForm.portfolio}
                    onChange={e => setApplicantForm({ ...applicantForm, portfolio: e.target.value })}
                    className="nova-input text-xs"
                    placeholder="https://linkedin.com/in/username"
                  />
                </div>

                <div>
                  <label className="nova-label text-xs">Resume (PDF / DOCX) *</label>
                  <div className="border-2 border-dashed border-nova-border hover:border-nova-accent rounded-xl p-4 text-center cursor-pointer transition-colors bg-nova-bg/40 relative">
                    <input
                      type="file"
                      accept=".pdf,.doc,.docx"
                      required={!applicantForm.resumeName}
                      onChange={e => {
                        const file = e.target.files?.[0];
                        if (file) {
                          setApplicantForm({ ...applicantForm, resumeName: file.name });
                        }
                      }}
                      className="absolute inset-0 opacity-0 cursor-pointer w-full h-full"
                    />
                    <UploadCloud size={24} className="text-nova-accent mx-auto mb-1.5" />
                    {applicantForm.resumeName ? (
                      <p className="text-xs font-semibold text-emerald-400">{applicantForm.resumeName}</p>
                    ) : (
                      <p className="text-xs text-nova-text-muted">Click or drag & drop resume file (Max 10MB)</p>
                    )}
                  </div>
                </div>

                <div>
                  <label className="nova-label text-xs">Why are you excited to join NovaEq? (Optional)</label>
                  <textarea
                    rows={3}
                    value={applicantForm.coverNote}
                    onChange={e => setApplicantForm({ ...applicantForm, coverNote: e.target.value })}
                    className="nova-input text-xs resize-none"
                    placeholder="Briefly tell us about your trading algorithms, ML experiments, or distributed systems work..."
                  />
                </div>

                <div className="flex items-center gap-3 pt-2">
                  <button
                    type="button"
                    onClick={() => setSelectedJob(null)}
                    className="nova-btn-outline text-xs flex-1 py-2.5"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="nova-btn-primary text-xs flex-1 py-2.5 flex items-center justify-center gap-2"
                  >
                    <Send size={14} /> Submit Application
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default About;

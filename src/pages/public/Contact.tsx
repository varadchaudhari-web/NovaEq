import React, { useState } from 'react';
import { Mail, Phone, MapPin, Clock, MessageCircle, Send, Check, Headphones, FileText, Shield } from 'lucide-react';
import { useAppStore } from '@/stores/useAppStore';

const faqs = [
  { q: 'How do I reset my trading password?', a: 'Go to Login → Forgot Password → Enter your registered email. You\'ll receive a reset link within 2 minutes.' },
  { q: 'How long does KYC verification take?', a: 'KYC is typically verified within 24-48 business hours. Premium users get priority processing within 4 hours.' },
  { q: 'What documents are needed for KYC?', a: 'PAN Card (mandatory), Aadhaar/Passport (address proof), and a recent bank statement (last 3 months).' },
  { q: 'Can I withdraw funds immediately?', a: 'Withdrawals are processed within 1-3 business hours during market hours. Funds reflect in your bank within T+1.' },
];

const Contact: React.FC = () => {
  const { openAuthModal, isLoggedIn } = useAppStore();
  const [form, setForm] = useState({ name: '', email: '', subject: '', message: '', category: 'General Inquiry' });
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setTimeout(() => setSubmitted(true), 800);
  };

  return (
    <div className="min-h-screen pt-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-display font-black text-nova-text mb-3">We're Here to <span className="gradient-text">Help</span></h1>
          <p className="text-nova-text-muted">Our support team is available 16x5 to assist with any questions or concerns.</p>
        </div>

        {/* Contact Cards */}
        <div className="grid md:grid-cols-3 gap-5 mb-12">
          {[
            { icon: Headphones, title: 'Live Support Chat', desc: '24x7 chat support for Pro & Elite users. Response within 2 minutes.', action: 'Start Chat', color: 'text-nova-accent', bg: 'bg-nova-accent/10' },
            { icon: Mail, title: 'Email Support', desc: 'support@novaeq.ai — Response within 4 hours for all plans.', action: 'Send Email', color: 'text-nova-primary-light', bg: 'bg-nova-primary/10' },
            { icon: Phone, title: 'Phone Support', desc: '1-800-NOVA-EQ (Mon–Fri, 9 AM – 6 PM IST)', action: 'Call Now', color: 'text-nova-yellow', bg: 'bg-nova-yellow/10' },
          ].map(({ icon: Icon, title, desc, action, color, bg }) => (
            <div key={title} className="nova-card p-6 text-center">
              <div className={`w-14 h-14 rounded-2xl ${bg} flex items-center justify-center mx-auto mb-4`}>
                <Icon size={24} className={color} />
              </div>
              <h3 className="text-sm font-bold text-nova-text mb-2">{title}</h3>
              <p className="text-xs text-nova-text-muted mb-4">{desc}</p>
              <button onClick={() => !isLoggedIn && openAuthModal('Contact support — sign in to your NovaEq account.')}
                className={`nova-btn-outline text-sm py-2 px-5 w-full ${color} border-current`}>
                {action}
              </button>
            </div>
          ))}
        </div>

        <div className="grid lg:grid-cols-2 gap-10 mb-16">
          {/* Contact Form */}
          <div>
            <h2 className="text-xl font-display font-bold text-nova-text mb-5">Send a Message</h2>
            {submitted ? (
              <div className="nova-card p-10 text-center">
                <div className="w-16 h-16 rounded-full bg-nova-accent/10 border border-nova-accent/30 flex items-center justify-center mx-auto mb-4">
                  <Check size={28} className="text-nova-accent" />
                </div>
                <h3 className="text-lg font-bold text-nova-text mb-2">Message Sent!</h3>
                <p className="text-nova-text-muted text-sm">We'll get back to you at {form.email} within 4 hours.</p>
                <button onClick={() => setSubmitted(false)} className="nova-btn-outline text-sm mt-5">Send Another</button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="nova-card p-6 space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="nova-label">Full Name</label>
                    <input type="text" required value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} className="nova-input" placeholder="Alex Reynolds" />
                  </div>
                  <div>
                    <label className="nova-label">Email Address</label>
                    <input type="email" required value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} className="nova-input" placeholder="alex@example.com" />
                  </div>
                </div>
                <div>
                  <label className="nova-label">Category</label>
                  <select value={form.category} onChange={e => setForm({ ...form, category: e.target.value })} className="nova-input">
                    {['General Inquiry', 'Technical Support', 'Billing & Payments', 'KYC & Verification', 'Account Issue', 'Feature Request', 'Partnership'].map(c => (
                      <option key={c}>{c}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="nova-label">Subject</label>
                  <input type="text" required value={form.subject} onChange={e => setForm({ ...form, subject: e.target.value })} className="nova-input" placeholder="Brief description of your issue..." />
                </div>
                <div>
                  <label className="nova-label">Message</label>
                  <textarea required rows={5} value={form.message} onChange={e => setForm({ ...form, message: e.target.value })} className="nova-input resize-none" placeholder="Please describe your issue or question in detail..." />
                </div>
                <button type="submit" className="nova-btn-primary w-full flex items-center justify-center gap-2">
                  <Send size={16} /> Send Message
                </button>
              </form>
            )}
          </div>

          {/* FAQ & Info */}
          <div>
            <h2 className="text-xl font-display font-bold text-nova-text mb-5">Frequently Asked Questions</h2>
            <div className="space-y-3 mb-8">
              {faqs.map(({ q, a }) => (
                <div key={q} className="nova-card p-4">
                  <p className="text-sm font-semibold text-nova-text mb-2">{q}</p>
                  <p className="text-xs text-nova-text-muted">{a}</p>
                </div>
              ))}
            </div>

            <div className="nova-card p-5">
              <h3 className="text-sm font-bold text-nova-text mb-4 flex items-center gap-2"><MapPin size={16} className="text-nova-accent" /> Office & Regulatory</h3>
              <div className="space-y-3 text-sm text-nova-text-muted">
                <p><strong className="text-nova-text">Registered Office:</strong><br />Floor 12, NovaEq Technologies Pvt. Ltd.<br />BKC, Bandra East, Mumbai – 400 051, Maharashtra</p>
                <p><strong className="text-nova-text">SEBI Registration:</strong> INZ000000000 (Stock Broker)<br />SEBI Regn No: INH000000000 (Research Analyst)</p>
                <p className="flex items-center gap-2"><Clock size={14} className="text-nova-accent flex-shrink-0" />Support Hours: Mon–Fri, 9 AM – 9 PM IST</p>
                <p className="flex items-center gap-2"><Shield size={14} className="text-nova-accent flex-shrink-0" />Grievance Officer: grievance@novaeq.ai</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Contact;

import React, { useState } from 'react';
import {
  User,
  Mail,
  Phone,
  Shield,
  Key,
  Bell,
  CheckCircle2,
  Lock,
  Smartphone,
  Globe,
  Sliders,
  Sparkles,
  Save,
  RefreshCw,
  Eye,
  EyeOff,
  AlertCircle
} from 'lucide-react';
import { useAppStore } from '@/stores/useAppStore';
import { formatCurrency, cn } from '@/lib/utils';
import KYCVerificationModal from './KYCVerificationModal';
import RiskAssessmentModal from './RiskAssessmentModal';

interface ProfileSettingsPanelProps {
  isAdmin?: boolean;
}

const PRESET_AVATARS = [
  'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&h=150&fit=crop&crop=face',
  'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face',
  'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&h=150&fit=crop&crop=face',
  'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&h=150&fit=crop&crop=face',
  'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&h=150&fit=crop&crop=face',
];

const ProfileSettingsPanel: React.FC<ProfileSettingsPanelProps> = ({ isAdmin = false }) => {
  const { currentUser, updateUserProfile } = useAppStore();

  const [name, setName] = useState(currentUser?.name || '');
  const [email, setEmail] = useState(currentUser?.email || '');
  const [phone, setPhone] = useState(currentUser?.phone || '+91 98765 43210');
  const [bio, setBio] = useState(currentUser?.bio || 'Quantitative equity investor & momentum trader.');
  const [avatar, setAvatar] = useState(currentUser?.avatar || PRESET_AVATARS[0]);
  const [riskProfile, setRiskProfile] = useState(currentUser?.riskProfile || 'moderate');

  // Security States
  const [twoFactorEnabled, setTwoFactorEnabled] = useState(true);
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  // Notification Toggles
  const [notifyTradeExecution, setNotifyTradeExecution] = useState(true);
  const [notifyWhatsAppDigest, setNotifyWhatsAppDigest] = useState(true);
  const [notifyMarginCalls, setNotifyMarginCalls] = useState(true);
  const [notifyCommunity, setNotifyCommunity] = useState(false);

  // Admin Platform Switches
  const [algoTradingSwitch, setAlgoTradingSwitch] = useState(true);
  const [razorpaySandboxSwitch, setRazorpaySandboxSwitch] = useState(true);
  const [kycAutoScanSwitch, setKycAutoScanSwitch] = useState(true);
  const [tradingHoursLockSwitch, setTradingHoursLockSwitch] = useState(true);
  const [marginKillSwitch, setMarginKillSwitch] = useState(true);
  const [maintenanceModeSwitch, setMaintenanceModeSwitch] = useState(false);

  // Modals & Feedback
  const [showKYCModal, setShowKYCModal] = useState(false);
  const [showRiskModal, setShowRiskModal] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [passwordSuccess, setPasswordSuccess] = useState(false);
  const [passwordError, setPasswordError] = useState('');

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    updateUserProfile({
      name,
      email,
      phone,
      bio,
      avatar,
      riskProfile: riskProfile as any,
    });
    setSaveSuccess(true);
    setTimeout(() => setSaveSuccess(false), 3000);
  };

  const handleUpdatePassword = (e: React.FormEvent) => {
    e.preventDefault();
    if (newPassword.length < 6) {
      setPasswordError('New password must be at least 6 characters.');
      return;
    }
    if (newPassword !== confirmPassword) {
      setPasswordError('Passwords do not match.');
      return;
    }
    setPasswordError('');
    setPasswordSuccess(true);
    setTimeout(() => {
      setPasswordSuccess(false);
      setShowPasswordModal(false);
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
    }, 2000);
  };

  return (
    <div className="space-y-6 animate-fade-in max-w-5xl">
      {/* Top Save Confirmation Banner */}
      {saveSuccess && (
        <div className="p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 flex items-center justify-between animate-in fade-in">
          <div className="flex items-center gap-2 text-xs font-bold">
            <CheckCircle2 size={16} /> Profile and preferences saved successfully!
          </div>
          <span className="text-[11px] font-mono">Synced to Zustand state</span>
        </div>
      )}

      {/* Profile Overview Card & Edit Form */}
      <form onSubmit={handleSaveProfile} className="nova-card p-6 space-y-6 border border-nova-border/80">
        <div className="flex items-center justify-between flex-wrap gap-4 border-b border-nova-border/60 pb-5">
          <div className="flex items-center gap-4">
            <div className="relative group">
              <img
                src={avatar}
                alt={name}
                className="w-20 h-20 rounded-2xl object-cover border-2 border-nova-accent shadow-lg shadow-nova-accent/20"
              />
              <span className="absolute -bottom-1 -right-1 w-4 h-4 bg-emerald-400 rounded-full border-2 border-slate-900" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-xl font-display font-bold text-nova-text">{name || currentUser?.name}</h2>
                <span className="text-[10px] font-bold px-2.5 py-0.5 rounded-full uppercase bg-nova-primary/20 text-nova-primary-light border border-nova-primary/30">
                  {currentUser?.role || 'Investor'}
                </span>
                <span className="text-[10px] font-bold px-2.5 py-0.5 rounded-full uppercase bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                  {currentUser?.subscription || 'Elite'} Plan
                </span>
              </div>
              <p className="text-xs text-nova-text-muted mt-0.5">{email || currentUser?.email}</p>
              <p className="text-[11px] text-nova-text-subtle font-mono mt-1">SEBI KYC Status: <span className="text-emerald-400 font-bold uppercase">{currentUser?.kycStatus || 'Approved'}</span></p>
            </div>
          </div>

          <button
            type="submit"
            className="nova-btn-primary text-xs py-2 px-5 font-bold flex items-center gap-2 shadow-lg shadow-nova-accent/20"
          >
            <Save size={14} /> Save Profile Changes
          </button>
        </div>

        {/* Avatar Selection */}
        <div>
          <label className="nova-label text-xs">Choose Profile Avatar</label>
          <div className="flex items-center gap-3">
            {PRESET_AVATARS.map((avUrl, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => setAvatar(avUrl)}
                className={`relative rounded-xl overflow-hidden p-0.5 transition-all ${
                  avatar === avUrl ? 'ring-2 ring-nova-accent scale-105' : 'opacity-60 hover:opacity-100'
                }`}
              >
                <img src={avUrl} alt="Avatar" className="w-12 h-12 rounded-lg object-cover" />
              </button>
            ))}
            <div className="flex-1 max-w-xs ml-2">
              <input
                type="url"
                value={avatar}
                onChange={(e) => setAvatar(e.target.value)}
                placeholder="Or paste custom image URL..."
                className="nova-input text-xs"
              />
            </div>
          </div>
        </div>

        {/* Input Fields Grid */}
        <div className="grid md:grid-cols-2 gap-4">
          <div>
            <label className="nova-label text-xs">Full Legal Name *</label>
            <input
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="nova-input text-xs"
              placeholder="e.g. Alex Reynolds"
            />
          </div>

          <div>
            <label className="nova-label text-xs">Registered Email Address *</label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="nova-input text-xs"
              placeholder="alex@example.com"
            />
          </div>

          <div>
            <label className="nova-label text-xs">Mobile Number (Linked with Aadhaar/PAN) *</label>
            <input
              type="tel"
              required
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              className="nova-input text-xs font-mono"
              placeholder="+91 98765 43210"
            />
          </div>

          <div>
            <label className="nova-label text-xs">Risk Profile Suitability</label>
            <div className="flex gap-2">
              <select
                value={riskProfile}
                onChange={(e) => setRiskProfile(e.target.value as any)}
                className="nova-input text-xs capitalize flex-1"
              >
                <option value="conservative">Conservative (Capital Preservation)</option>
                <option value="moderate">Moderate (Balanced Growth)</option>
                <option value="aggressive">Aggressive (Maximum Alpha)</option>
              </select>
              <button
                type="button"
                onClick={() => setShowRiskModal(true)}
                className="nova-btn-outline text-xs px-3"
                title="Retake Suitability Test"
              >
                Retake
              </button>
            </div>
          </div>
        </div>

        <div>
          <label className="nova-label text-xs">Trading Bio & Investment Philosophy</label>
          <textarea
            rows={3}
            value={bio}
            onChange={(e) => setBio(e.target.value)}
            className="nova-input text-xs resize-none"
            placeholder="Share your quantitative algorithms, sector specializations, or investment rules..."
          />
        </div>

        <div className="flex items-center justify-between pt-2">
          <button
            type="button"
            onClick={() => setShowKYCModal(true)}
            className="nova-btn-outline text-xs py-2 px-4 flex items-center gap-1.5"
          >
            <Shield size={14} className="text-emerald-400" /> Review / Re-Submit KYC Documents
          </button>
          <button
            type="submit"
            className="nova-btn-primary text-xs py-2 px-5 font-bold flex items-center gap-1.5"
          >
            <Save size={14} /> Update Profile
          </button>
        </div>
      </form>

      {/* Admin Platform Feature Switches (If Admin Mode) */}
      {isAdmin && (
        <div className="nova-card p-6 space-y-4 border border-nova-border/80">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-base font-bold text-nova-text">Master Platform Feature Controls & Switches</h3>
              <p className="text-xs text-nova-text-muted">Interactive feature toggles with real-time state synchronization</p>
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-4">
            {[
              { label: 'Algo Trading Execution Gateways', desc: 'Allows automated webhook & algorithmic orders on NSE/BSE', state: algoTradingSwitch, toggle: () => setAlgoTradingSwitch(!algoTradingSwitch) },
              { label: 'Razorpay Sandbox Test Gateway', desc: 'Accepts test payments and instant simulation deposits', state: razorpaySandboxSwitch, toggle: () => setRazorpaySandboxSwitch(!razorpaySandboxSwitch) },
              { label: 'Automated KYC Scanning Engine', desc: 'NPCI and NSDL automated verification pipelines', state: kycAutoScanSwitch, toggle: () => setKycAutoScanSwitch(!kycAutoScanSwitch) },
              { label: 'Trading Hours Lock (09:15 - 15:30 IST)', desc: 'Prevents off-market unverified equity execution', state: tradingHoursLockSwitch, toggle: () => setTradingHoursLockSwitch(!tradingHoursLockSwitch) },
              { label: 'SEBI Peak Margin Kill-Switch', desc: 'Auto-squares positions with insufficient margin', state: marginKillSwitch, toggle: () => setMarginKillSwitch(!marginKillSwitch) },
              { label: 'Platform Maintenance Mode', desc: 'Displays maintenance notice across public web app', state: maintenanceModeSwitch, toggle: () => setMaintenanceModeSwitch(!maintenanceModeSwitch) },
            ].map(({ label, desc, state, toggle }) => (
              <div key={label} className="p-4 rounded-xl bg-nova-bg/50 border border-nova-border flex items-center justify-between gap-3">
                <div>
                  <p className="text-xs font-bold text-nova-text">{label}</p>
                  <p className="text-[11px] text-nova-text-muted mt-0.5">{desc}</p>
                </div>
                <button
                  type="button"
                  onClick={toggle}
                  className={cn(
                    'px-3 py-1.5 rounded-lg text-xs font-mono font-bold transition-all border flex-shrink-0',
                    state
                      ? 'bg-emerald-500/20 text-emerald-400 border-emerald-500/40 shadow-sm shadow-emerald-500/20'
                      : 'bg-rose-500/10 text-rose-400 border-rose-500/30'
                  )}
                >
                  {state ? 'ENABLED' : 'DISABLED'}
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Security & Authentication Suite */}
      <div className="grid md:grid-cols-2 gap-5">
        <div className="nova-card p-5 space-y-4">
          <h3 className="text-sm font-bold text-nova-text flex items-center gap-2">
            <Lock size={16} className="text-nova-accent" /> Security & Two-Factor Authentication
          </h3>

          <div className="space-y-3">
            <div className="flex items-center justify-between p-3 rounded-xl bg-nova-bg/50 border border-nova-border text-xs">
              <div>
                <p className="font-bold text-nova-text">Two-Factor Authentication (2FA)</p>
                <p className="text-[11px] text-nova-text-muted">Require TOTP authenticator code on new logins</p>
              </div>
              <button
                type="button"
                onClick={() => setTwoFactorEnabled(!twoFactorEnabled)}
                className={cn(
                  'px-3 py-1 rounded-lg text-xs font-bold transition-all border',
                  twoFactorEnabled
                    ? 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30'
                    : 'bg-nova-surface2 text-nova-text-muted border-nova-border'
                )}
              >
                {twoFactorEnabled ? 'Active' : 'Disabled'}
              </button>
            </div>

            <div className="flex items-center justify-between p-3 rounded-xl bg-nova-bg/50 border border-nova-border text-xs">
              <div>
                <p className="font-bold text-nova-text">Account Password</p>
                <p className="text-[11px] text-nova-text-muted">Last modified 3 months ago</p>
              </div>
              <button
                type="button"
                onClick={() => setShowPasswordModal(true)}
                className="nova-btn-outline text-xs py-1 px-3 font-semibold"
              >
                Change Password
              </button>
            </div>
          </div>
        </div>

        {/* Notifications & Communications Preferences */}
        <div className="nova-card p-5 space-y-4">
          <h3 className="text-sm font-bold text-nova-text flex items-center gap-2">
            <Bell size={16} className="text-nova-accent" /> Alert & Notification Channels
          </h3>

          <div className="space-y-2.5">
            {[
              { label: 'Instant Trade Execution Push Alerts', state: notifyTradeExecution, toggle: () => setNotifyTradeExecution(!notifyTradeExecution) },
              { label: 'Daily WhatsApp Portfolio & P&L Digest', state: notifyWhatsAppDigest, toggle: () => setNotifyWhatsAppDigest(!notifyWhatsAppDigest) },
              { label: 'Peak Margin Call & Risk Warnings', state: notifyMarginCalls, toggle: () => setNotifyMarginCalls(!notifyMarginCalls) },
              { label: 'Social Community Mentions & Replies', state: notifyCommunity, toggle: () => setNotifyCommunity(!notifyCommunity) },
            ].map(({ label, state, toggle }) => (
              <div key={label} className="flex items-center justify-between text-xs py-1.5 border-b border-nova-border/50">
                <span className="text-nova-text-muted">{label}</span>
                <button
                  type="button"
                  onClick={toggle}
                  className={cn(
                    'w-9 h-5 rounded-full transition-colors relative flex items-center',
                    state ? 'bg-nova-accent' : 'bg-nova-surface2 border border-nova-border'
                  )}
                >
                  <span
                    className={cn(
                      'w-3.5 h-3.5 rounded-full bg-white transition-transform transform',
                      state ? 'translate-x-4' : 'translate-x-1'
                    )}
                  />
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Change Password Modal */}
      {showPasswordModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md p-4 animate-fade-in">
          <div className="nova-card border border-nova-border w-full max-w-sm p-6 relative shadow-2xl">
            {passwordSuccess ? (
              <div className="py-6 text-center space-y-3">
                <CheckCircle2 size={36} className="text-emerald-400 mx-auto" />
                <h4 className="text-lg font-bold text-nova-text">Password Updated!</h4>
                <p className="text-xs text-nova-text-muted">Your trading password has been securely reset.</p>
              </div>
            ) : (
              <form onSubmit={handleUpdatePassword} className="space-y-4">
                <h4 className="text-lg font-bold text-nova-text">Update Account Password</h4>
                <div>
                  <label className="nova-label text-xs">Current Password</label>
                  <input
                    type="password"
                    required
                    value={currentPassword}
                    onChange={(e) => setCurrentPassword(e.target.value)}
                    className="nova-input text-xs"
                    placeholder="••••••••"
                  />
                </div>
                <div>
                  <label className="nova-label text-xs">New Password</label>
                  <input
                    type="password"
                    required
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    className="nova-input text-xs"
                    placeholder="Min 6 characters"
                  />
                </div>
                <div>
                  <label className="nova-label text-xs">Confirm New Password</label>
                  <input
                    type="password"
                    required
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className="nova-input text-xs"
                    placeholder="Re-enter password"
                  />
                </div>

                {passwordError && (
                  <div className="text-xs text-rose-400 bg-rose-500/10 border border-rose-500/20 p-2 rounded-lg">
                    {passwordError}
                  </div>
                )}

                <div className="flex gap-2 pt-2">
                  <button
                    type="button"
                    onClick={() => setShowPasswordModal(false)}
                    className="nova-btn-outline text-xs flex-1 py-2"
                  >
                    Cancel
                  </button>
                  <button type="submit" className="nova-btn-primary text-xs flex-1 py-2 font-bold">
                    Save Password
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}

      {/* Modals */}
      <KYCVerificationModal isOpen={showKYCModal} onClose={() => setShowKYCModal(false)} />
      <RiskAssessmentModal isOpen={showRiskModal} onClose={() => setShowRiskModal(false)} />
    </div>
  );
};

export default ProfileSettingsPanel;

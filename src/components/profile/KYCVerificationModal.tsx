import React, { useState } from 'react';
import {
  X,
  ShieldCheck,
  UploadCloud,
  CheckCircle2,
  FileText,
  AlertCircle,
  UserCheck,
  ArrowRight
} from 'lucide-react';
import { useAppStore } from '@/stores/useAppStore';

interface KYCVerificationModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const KYCVerificationModal: React.FC<KYCVerificationModalProps> = ({ isOpen, onClose }) => {
  const { currentUser, submitKYCApplication } = useAppStore();
  const [panNumber, setPanNumber] = useState('ABCDE1234F');
  const [aadhaarNumber, setAadhaarNumber] = useState('4928 1029 3847');
  const [panFile, setPanFile] = useState('PAN_Card_Scan.pdf');
  const [addressFile, setAddressFile] = useState('Aadhaar_Front_Back.pdf');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentUser) return;
    setIsSubmitting(true);

    setTimeout(() => {
      submitKYCApplication({
        userId: currentUser.id,
        userName: currentUser.name,
        userEmail: currentUser.email,
        documents: [panFile, addressFile, 'Bank_Statement_3M.pdf'],
        notes: `Submitted PAN: ${panNumber.toUpperCase()} & Aadhaar verification.`
      });
      setIsSubmitting(false);
      setIsSuccess(true);
      setTimeout(() => {
        setIsSuccess(false);
        onClose();
      }, 2000);
    }, 1200);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md p-4 animate-fade-in">
      <div className="nova-card border border-nova-border/80 w-full max-w-lg p-6 relative shadow-2xl overflow-hidden">
        <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-blue-600 via-indigo-500 to-purple-600" />

        <button
          onClick={onClose}
          disabled={isSubmitting}
          className="absolute top-4 right-4 text-nova-text-muted hover:text-nova-text p-1.5 rounded-lg hover:bg-nova-surface transition-colors"
        >
          <X size={18} />
        </button>

        {isSuccess ? (
          <div className="py-8 text-center space-y-4 animate-in fade-in zoom-in-95">
            <div className="w-16 h-16 rounded-full bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center mx-auto text-emerald-400">
              <CheckCircle2 size={36} />
            </div>
            <h3 className="text-xl font-display font-bold text-nova-text">KYC Documents Submitted!</h3>
            <p className="text-xs text-nova-text-muted max-w-sm mx-auto">
              Your documents have been submitted to our SEBI compliance verification desk. Verification typically completes within 4-12 hours.
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded bg-nova-primary/20 text-nova-primary-light border border-nova-primary/30">
                  SEBI Mandated KYC
                </span>
                <span className="text-xs text-nova-text-muted capitalize">Current: {currentUser?.kycStatus || 'pending'}</span>
              </div>
              <h3 className="text-xl font-display font-bold text-nova-text">Complete KYC Verification</h3>
              <p className="text-xs text-nova-text-muted">Required for unlimited trading limits and instant bank payouts.</p>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="nova-label text-xs">PAN Card Number *</label>
                <input
                  type="text"
                  required
                  value={panNumber}
                  onChange={e => setPanNumber(e.target.value.toUpperCase())}
                  className="nova-input text-xs font-mono uppercase"
                  placeholder="ABCDE1234F"
                  maxLength={10}
                />
              </div>
              <div>
                <label className="nova-label text-xs">Aadhaar / National ID *</label>
                <input
                  type="text"
                  required
                  value={aadhaarNumber}
                  onChange={e => setAadhaarNumber(e.target.value)}
                  className="nova-input text-xs font-mono"
                  placeholder="12-digit Aadhaar"
                  maxLength={14}
                />
              </div>
            </div>

            {/* Document Uploads */}
            <div className="space-y-2">
              <label className="nova-label text-xs">Upload Identity Documents</label>
              <div className="grid grid-cols-2 gap-3">
                <div className="border border-dashed border-nova-border hover:border-nova-accent rounded-xl p-3 text-center cursor-pointer bg-nova-bg/40 relative">
                  <UploadCloud size={20} className="text-nova-accent mx-auto mb-1" />
                  <p className="text-xs font-semibold text-nova-text truncate">{panFile || 'PAN Card (PDF/JPG)'}</p>
                  <span className="text-[10px] text-nova-text-subtle">Click to re-upload</span>
                  <input
                    type="file"
                    className="absolute inset-0 opacity-0 cursor-pointer"
                    onChange={e => e.target.files?.[0] && setPanFile(e.target.files[0].name)}
                  />
                </div>

                <div className="border border-dashed border-nova-border hover:border-nova-accent rounded-xl p-3 text-center cursor-pointer bg-nova-bg/40 relative">
                  <UploadCloud size={20} className="text-nova-accent mx-auto mb-1" />
                  <p className="text-xs font-semibold text-nova-text truncate">{addressFile || 'Address Proof (PDF)'}</p>
                  <span className="text-[10px] text-nova-text-subtle">Click to re-upload</span>
                  <input
                    type="file"
                    className="absolute inset-0 opacity-0 cursor-pointer"
                    onChange={e => e.target.files?.[0] && setAddressFile(e.target.files[0].name)}
                  />
                </div>
              </div>
            </div>

            {/* Declaration */}
            <div className="p-3 rounded-xl bg-nova-bg/50 border border-nova-border/70 text-[11px] text-nova-text-subtle flex items-start gap-2">
              <ShieldCheck size={16} className="text-emerald-400 flex-shrink-0 mt-0.5" />
              <span>
                I hereby declare that the details furnished above are true to the best of my knowledge and comply with SEBI/PMLA regulatory norms.
              </span>
            </div>

            <div className="flex items-center gap-3 pt-2">
              <button
                type="button"
                onClick={onClose}
                className="nova-btn-outline text-xs flex-1 py-2.5"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isSubmitting}
                className="nova-btn-primary text-xs flex-1 py-2.5 flex items-center justify-center gap-2 font-bold"
              >
                {isSubmitting ? 'Uploading & Verifying...' : 'Submit Verification'} <ArrowRight size={14} />
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};

export default KYCVerificationModal;

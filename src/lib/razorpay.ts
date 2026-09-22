/**
 * Razorpay Test / Demo Checkout Integration for NovaEq
 * Uses Test API Key: rzp_test_TYGuf1uL6B9fAl
 * Guaranteed to only operate in demo/test mode with no real charges.
 */

export const RAZORPAY_TEST_KEY = 'rzp_test_TYGuf1uL6B9fAl';

export interface RazorpayOptions {
  planName: string;
  amount: number; // in currency units (e.g., $10 or ₹800)
  currency?: string;
  isYearly?: boolean;
  userEmail?: string;
  userName?: string;
  onSuccess: (paymentId: string) => void;
  onFailure?: (error: unknown) => void;
}

declare global {
  interface Window {
    Razorpay?: any;
  }
}

export const loadRazorpayScript = (): Promise<boolean> => {
  return new Promise((resolve) => {
    if (typeof window === 'undefined') {
      resolve(false);
      return;
    }
    if (window.Razorpay) {
      resolve(true);
      return;
    }

    const script = document.createElement('script');
    script.src = 'https://checkout.razorpay.com/v1/checkout.js';
    script.async = true;
    script.onload = () => resolve(true);
    script.onerror = () => resolve(false);
    document.body.appendChild(script);
  });
};

export const initiateRazorpayPayment = async (options: RazorpayOptions): Promise<boolean> => {
  const isLoaded = await loadRazorpayScript();

  if (!isLoaded || !window.Razorpay) {
    return false; // Fallback to custom in-app Demo Checkout modal
  }

  // Convert USD / amount to INR equivalent for test checkout
  const amountInPaise = Math.round(options.amount * 85 * 100);

  const rzpOptions = {
    key: RAZORPAY_TEST_KEY,
    amount: amountInPaise,
    currency: 'INR',
    name: 'NovaEq Technologies (Demo)',
    description: `Subscription: ${options.planName} Plan (${options.isYearly ? 'Annual' : 'Monthly'}) [Test Mode]`,
    image: 'https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?w=100&h=100&fit=crop',
    handler: (response: { razorpay_payment_id: string }) => {
      options.onSuccess(response.razorpay_payment_id || `pay_demo_${Date.now()}`);
    },
    prefill: {
      name: options.userName || 'Demo User',
      email: options.userEmail || 'demo@novaeq.ai',
      contact: '9999999999',
    },
    notes: {
      mode: 'TEST_MODE_DEMO_ONLY',
      plan: options.planName,
    },
    theme: {
      color: '#3B82F6',
    },
    modal: {
      ondismiss: () => {
        if (options.onFailure) options.onFailure('Payment cancelled by user');
      },
    },
  };

  try {
    const rzp = new window.Razorpay(rzpOptions);
    rzp.open();
    return true;
  } catch (err) {
    console.warn('Razorpay checkout initialization error, falling back to demo modal:', err);
    return false;
  }
};

/**
 * Razorpay Test / Demo Checkout Integration for NovaEq
 * Uses Test API Key: rzp_test_TYGuf1uL6B9fAl
 * Guaranteed to only operate in demo/test mode with no real charges.
 */

export const RAZORPAY_TEST_KEY = 'rzp_test_TYGuf1uL6B9fAl';

export interface RazorpayOptions {
  planName?: string;
  title?: string;
  description?: string;
  amount: number; // in INR if currency is INR, or in USD if not specified
  currency?: 'INR' | 'USD';
  isYearly?: boolean;
  userEmail?: string;
  userName?: string;
  contact?: string;
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

  // Calculate amount in paise (1 INR = 100 paise)
  const isINR = options.currency === 'INR' || !options.currency;
  const inrAmount = isINR ? options.amount : Math.round(options.amount * 85);
  const amountInPaise = Math.round(inrAmount * 100);

  const paymentTitle = options.title || options.planName || 'NovaEq Wallet Top-up';
  const paymentDesc = options.description || `Payment for ${paymentTitle} [Razorpay Test Mode]`;

  const rzpOptions = {
    key: RAZORPAY_TEST_KEY,
    amount: amountInPaise,
    currency: 'INR',
    name: 'NovaEq Technologies',
    description: paymentDesc,
    image: 'https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?w=100&h=100&fit=crop',
    handler: (response: { razorpay_payment_id: string }) => {
      const pId = response.razorpay_payment_id || `pay_rzp_${Date.now()}`;
      options.onSuccess(pId);
    },
    prefill: {
      name: options.userName || 'NovaEq Trader',
      email: options.userEmail || 'trader@novaeq.ai',
      contact: options.contact || '9876543210',
    },
    notes: {
      mode: 'TEST_MODE_DEMO',
      purpose: paymentTitle,
    },
    theme: {
      color: '#00C9A7',
    },
    modal: {
      ondismiss: () => {
        if (options.onFailure) options.onFailure('Payment window closed by user');
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


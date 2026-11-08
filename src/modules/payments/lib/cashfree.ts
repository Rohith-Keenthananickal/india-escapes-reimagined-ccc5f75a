/**
 * Cashfree Checkout.js (v3) loader + open helper.
 * Docs: https://www.cashfree.com/docs/payments/online/web/redirect
 */

export type CashfreeMode = 'sandbox' | 'production';

declare global {
  interface Window {
    Cashfree?: (options: { mode: CashfreeMode }) => {
      checkout: (opts: {
        paymentSessionId: string;
        redirectTarget?: '_self' | '_blank' | '_top' | '_modal';
      }) => Promise<unknown>;
    };
  }
}

const SDK_URL = 'https://sdk.cashfree.com/js/v3/cashfree.js';

let loadPromise: Promise<void> | null = null;

export function getCashfreeMode(): CashfreeMode {
  const env = (import.meta.env.VITE_CASHFREE_MODE || 'sandbox').toLowerCase();
  return env === 'production' ? 'production' : 'sandbox';
}

export function loadCashfreeSdk(): Promise<void> {
  if (typeof window === 'undefined') {
    return Promise.reject(new Error('Cashfree SDK requires a browser'));
  }
  if (window.Cashfree) return Promise.resolve();
  if (loadPromise) return loadPromise;

  loadPromise = new Promise((resolve, reject) => {
    const existing = document.querySelector<HTMLScriptElement>(`script[src="${SDK_URL}"]`);
    if (existing) {
      existing.addEventListener('load', () => resolve());
      existing.addEventListener('error', () => reject(new Error('Failed to load Cashfree SDK')));
      if (window.Cashfree) resolve();
      return;
    }
    const script = document.createElement('script');
    script.src = SDK_URL;
    script.async = true;
    script.onload = () => resolve();
    script.onerror = () => {
      loadPromise = null;
      reject(new Error('Failed to load Cashfree SDK'));
    };
    document.body.appendChild(script);
  });

  return loadPromise;
}

export async function openCashfreeCheckout(paymentSessionId: string): Promise<void> {
  if (!paymentSessionId) {
    throw new Error('Missing payment_session_id');
  }
  await loadCashfreeSdk();
  if (!window.Cashfree) {
    throw new Error('Cashfree SDK not available');
  }
  const cashfree = window.Cashfree({ mode: getCashfreeMode() });
  await cashfree.checkout({
    paymentSessionId,
    redirectTarget: '_self',
  });
}

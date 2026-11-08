import { useCallback, useEffect, useRef, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import {
  Loader2,
  CheckCircle2,
  XCircle,
  Clock,
  AlertTriangle,
  RefreshCw,
  ArrowRight,
  ShieldCheck,
  Copy,
  Check,
  Calendar,
  HelpCircle,
  CreditCard,
  ArrowLeft,
  Lock,
} from 'lucide-react';
import Navbar from '@/components/Navbar';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { toast } from '@/hooks/use-toast';
import { paymentsService } from '../services/paymentsService';
import type { PaymentVerifyData } from '../types/payments.types';
import { ApiError } from '@/services/apiClient';
import { useQueryClient } from '@tanstack/react-query';
import { TRIPS_QUERY_KEY } from '@/modules/bookings/hooks/useTrips';
import { CART_QUERY_KEY } from '@/modules/cart/hooks/useCart';

type UiStatus = 'verifying' | 'success' | 'pending' | 'failed';

const PENDING_POLL_MS = 4000;
const PENDING_MAX_ATTEMPTS = 8;

function resolveOrderId(params: URLSearchParams): string | null {
  return (
    params.get('order_id') ||
    params.get('orderId') ||
    params.get('cf_order_id') ||
    params.get('transaction_id') ||
    null
  );
}

function classifyVerify(data: PaymentVerifyData): UiStatus {
  const pay = String(data.payment_status || '').toUpperCase();
  const top = String(data.status || '').toLowerCase();

  if (top === 'success' || pay === 'SUCCESS' || pay === 'PAID') {
    return 'success';
  }
  if (
    top === 'failed' ||
    pay === 'FAILED' ||
    pay === 'REFUNDED' ||
    pay === 'CANCELLED' ||
    pay === 'EXPIRED'
  ) {
    return 'failed';
  }
  if (
    top === 'pending' ||
    pay === 'PENDING' ||
    pay === 'INITIATED' ||
    pay === 'ACTIVE'
  ) {
    return 'pending';
  }
  return 'pending';
}

/**
 * Cashfree redirects here (directly or via API bridge):
 *   /booking/payment-return?order_id={transaction_id}
 *
 * Handles SUCCESS → success page, PENDING → poll, FAILED → recovery actions.
 */
export default function PaymentReturnPage() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const started = useRef(false);
  const pollCount = useRef(0);
  const pollTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const [uiStatus, setUiStatus] = useState<UiStatus>('verifying');
  const [message, setMessage] = useState('Confirming your payment with Cashfree…');
  const [transactionId, setTransactionId] = useState<string | null>(null);
  const [orderReference, setOrderReference] = useState<string | null>(null);
  const [paymentStatus, setPaymentStatus] = useState<string | null>(null);
  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  const clearPoll = () => {
    if (pollTimer.current) {
      clearTimeout(pollTimer.current);
      pollTimer.current = null;
    }
  };

  const copyToClipboard = (text: string, key: string) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(key);
    toast({
      title: 'Copied to clipboard',
      description: text,
    });
    setTimeout(() => {
      setCopiedKey((prev) => (prev === key ? null : prev));
    }, 2000);
  };

  const applyResult = useCallback(
    (data: PaymentVerifyData, orderId: string) => {
      const next = classifyVerify(data);
      setPaymentStatus(data.payment_status);
      setTransactionId(data.transaction_id || orderId);
      const ref =
        data.order_reference ||
        (data.trip_order_id != null ? String(data.trip_order_id) : null) ||
        data.booking_reference ||
        null;
      setOrderReference(ref);
      setMessage(data.message || `Payment status: ${data.payment_status}`);
      setUiStatus(next);

      if (next === 'success') {
        clearPoll();
        void queryClient.invalidateQueries({ queryKey: TRIPS_QUERY_KEY });
        void queryClient.invalidateQueries({ queryKey: CART_QUERY_KEY });
        navigate(
          `/booking-success?order=${encodeURIComponent(String(ref || orderId))}&tx=${encodeURIComponent(orderId)}`,
          { replace: true }
        );
        return;
      }

      if (next === 'failed') {
        clearPoll();
        return;
      }

      // pending — keep polling
      if (pollCount.current < PENDING_MAX_ATTEMPTS) {
        pollCount.current += 1;
        pollTimer.current = setTimeout(() => {
          void runVerify(orderId);
        }, PENDING_POLL_MS);
      } else {
        setMessage(
          data.message ||
            'Payment is still pending. You can check Trips shortly, or retry verification.'
        );
      }
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [navigate, queryClient]
  );

  const runVerify = useCallback(
    async (orderId: string) => {
      try {
        const data = await paymentsService.verify({ transaction_id: orderId });
        applyResult(data, orderId);
      } catch (err) {
        // Fallback: read transaction row if verify errors
        try {
          const txn = await paymentsService.getTransaction(orderId);
          const pay = String(txn.payment_status || '').toUpperCase();
          setPaymentStatus(pay);
          setTransactionId(txn.transaction_id || orderId);

          if (pay === 'SUCCESS' || pay === 'PAID') {
            applyResult(
              {
                status: 'success',
                message: 'Payment confirmed.',
                payment_status: txn.payment_status,
                transaction_id: txn.transaction_id,
                amount_paid: txn.amount,
                verified_at: new Date().toISOString(),
              },
              orderId
            );
            return;
          }
          if (pay === 'FAILED' || pay === 'REFUNDED') {
            setUiStatus('failed');
            setMessage(`Payment ${pay.toLowerCase()}.`);
            return;
          }
          setUiStatus('pending');
          setMessage('Payment is still processing. Checking again…');
          if (pollCount.current < PENDING_MAX_ATTEMPTS) {
            pollCount.current += 1;
            pollTimer.current = setTimeout(() => {
              void runVerify(orderId);
            }, PENDING_POLL_MS);
          }
        } catch {
          const detail =
            err instanceof ApiError
              ? typeof err.data?.detail === 'string'
                ? err.data.detail
                : err.message
              : 'We could not verify this payment.';
          setUiStatus('failed');
          setMessage(
            `${detail} If you were charged, check Trips or contact support with your order id.`
          );
        }
      }
    },
    [applyResult]
  );

  useEffect(() => {
    if (started.current) return;
    started.current = true;

    const orderId = resolveOrderId(searchParams);
    if (!orderId) {
      setUiStatus('failed');
      setMessage('Missing order_id from Cashfree return URL.');
      return;
    }

    setTransactionId(orderId);
    void runVerify(orderId);

    return () => clearPoll();
  }, [searchParams, runVerify]);

  const handleRetry = () => {
    const orderId = transactionId || resolveOrderId(searchParams);
    if (!orderId) return;
    clearPoll();
    pollCount.current = 0;
    setUiStatus('verifying');
    setMessage('Re-checking payment status…');
    void runVerify(orderId);
  };

  return (
    <div className="min-h-screen bg-[#F8FAFB] flex flex-col">
      <Navbar />

      <main className="flex-1 flex items-center justify-center px-4 py-12 sm:py-20">
        <div className="w-full max-w-lg">
          {/* Main Card Container */}
          <div className="bg-white rounded-3xl border border-gray-200/90 shadow-xl p-7 sm:p-10 space-y-7 relative overflow-hidden animate-fade-in">
            {/* Top Decorative Brand Bar */}
            <div
              className={`absolute top-0 left-0 right-0 h-1.5 ${
                uiStatus === 'success'
                  ? 'bg-emerald-500'
                  : uiStatus === 'failed'
                  ? 'bg-rose-500'
                  : uiStatus === 'pending'
                  ? 'bg-[#FFD26E]'
                  : 'bg-gradient-to-r from-[#2BB0BB] to-[#1A8491]'
              }`}
            />

            {/* 1. VERIFYING STATE */}
            {uiStatus === 'verifying' && (
              <div className="text-center space-y-6">
                {/* Animated Pulsing Icon */}
                <div className="relative w-24 h-24 mx-auto flex items-center justify-center">
                  <div className="absolute inset-0 rounded-full bg-teal-100/60 animate-ping opacity-75" />
                  <div className="relative w-20 h-20 rounded-full bg-teal-50 border-2 border-teal-200 flex items-center justify-center text-[#2BB0BB] shadow-inner">
                    <Loader2 className="w-9 h-9 animate-spin text-[#1A8491]" />
                  </div>
                </div>

                <div className="space-y-2">
                  <h1 className="text-2xl font-heading font-bold text-gray-900 tracking-tight">
                    Verifying Payment
                  </h1>
                  <p className="text-sm text-gray-600 max-w-sm mx-auto leading-relaxed">
                    {message}
                  </p>
                </div>

                {/* Security Reassurance Box */}
                <div className="bg-gray-50/80 rounded-2xl border border-gray-150 p-4 flex items-center gap-3 text-left">
                  <div className="w-9 h-9 rounded-xl bg-teal-50 text-[#1A8491] flex items-center justify-center shrink-0">
                    <ShieldCheck className="w-5 h-5" />
                  </div>
                  <div className="text-xs text-gray-600 leading-tight">
                    <span className="font-semibold text-gray-900 block mb-0.5">
                      Bank-grade 256-bit verification
                    </span>
                    Please keep this window open while we secure your reservation.
                  </div>
                </div>
              </div>
            )}

            {/* 2. SUCCESS STATE (Shown briefly before navigate) */}
            {uiStatus === 'success' && (
              <div className="text-center space-y-6 animate-scale-in">
                {/* Celebratory Success Icon */}
                <div className="relative w-24 h-24 mx-auto flex items-center justify-center">
                  <div className="absolute inset-0 rounded-full bg-emerald-100/70 animate-ping opacity-60" />
                  <div className="relative w-20 h-20 rounded-full bg-emerald-50 border-2 border-emerald-200 flex items-center justify-center text-emerald-600 shadow-sm">
                    <CheckCircle2 className="w-10 h-10" />
                  </div>
                </div>

                <div className="space-y-2">
                  <h1 className="text-2xl font-heading font-bold text-gray-900 tracking-tight">
                    Payment Confirmed!
                  </h1>
                  <p className="text-sm text-gray-600 max-w-sm mx-auto leading-relaxed">
                    {message}
                  </p>
                  <p className="text-xs font-medium text-[#1A8491] flex items-center justify-center gap-1.5 pt-1">
                    <Loader2 className="w-3.5 h-3.5 animate-spin" />
                    Preparing your reservation confirmation…
                  </p>
                </div>
              </div>
            )}

            {/* 3. PENDING STATE */}
            {uiStatus === 'pending' && (
              <div className="text-center space-y-6">
                {/* Pending Clock Icon */}
                <div className="relative w-24 h-24 mx-auto flex items-center justify-center">
                  <div className="absolute inset-0 rounded-full bg-amber-100/50 animate-pulse" />
                  <div className="relative w-20 h-20 rounded-full bg-amber-50 border-2 border-amber-200 flex items-center justify-center text-[#D4A237] shadow-sm">
                    <Clock className="w-9 h-9" />
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="flex items-center justify-center gap-2">
                    <h1 className="text-2xl font-heading font-bold text-gray-900 tracking-tight">
                      Payment Processing
                    </h1>
                    {paymentStatus && (
                      <Badge className="bg-amber-100 text-amber-800 border-amber-200 text-xs">
                        {paymentStatus}
                      </Badge>
                    )}
                  </div>
                  <p className="text-sm text-gray-600 max-w-sm mx-auto leading-relaxed">
                    {message}
                  </p>
                </div>

                {/* Automatic polling pulse indicator */}
                <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-amber-50/80 border border-amber-200/70 text-xs text-amber-800 font-medium">
                  <span className="relative flex h-2 w-2">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75" />
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-amber-500" />
                  </span>
                  Checking automatically with bank ({pollCount.current}/{PENDING_MAX_ATTEMPTS})
                </div>

                <div className="bg-gray-50/80 rounded-2xl border border-gray-150 p-4 text-xs text-gray-600 text-left space-y-1">
                  <p className="font-semibold text-gray-900">Next steps:</p>
                  <p>
                    • If paying via UPI, please approve the request in your UPI app (GPay, PhonePe, Paytm).
                  </p>
                  <p>• Once approved, this page will instantly update to confirmed.</p>
                </div>

                {/* Actions */}
                <div className="flex flex-col sm:flex-row gap-2.5 pt-2">
                  <Button
                    onClick={handleRetry}
                    className="flex-1 bg-[#2BB0BB] hover:bg-[#1A8491] text-white font-semibold rounded-xl h-11 transition-all duration-200 shadow-sm"
                  >
                    <RefreshCw className="w-4 h-4 mr-2" />
                    Check Status Now
                  </Button>
                  <Button
                    variant="outline"
                    onClick={() => navigate('/trips')}
                    className="flex-1 rounded-xl h-11 border-gray-200 text-gray-700 hover:bg-gray-50"
                  >
                    <Calendar className="w-4 h-4 mr-2" />
                    View My Trips
                  </Button>
                </div>
              </div>
            )}

            {/* 4. FAILED STATE */}
            {uiStatus === 'failed' && (
              <div className="text-center space-y-6">
                {/* Failure Icon */}
                <div className="w-20 h-20 rounded-full bg-rose-50 border-2 border-rose-200 flex items-center justify-center text-rose-500 mx-auto shadow-sm">
                  <XCircle className="w-10 h-10" />
                </div>

                <div className="space-y-2">
                  <div className="flex items-center justify-center gap-2">
                    <h1 className="text-2xl font-heading font-bold text-gray-900 tracking-tight">
                      Payment Not Completed
                    </h1>
                    {paymentStatus && (
                      <Badge variant="destructive" className="text-xs uppercase">
                        {paymentStatus}
                      </Badge>
                    )}
                  </div>
                  <p className="text-sm text-gray-600 max-w-sm mx-auto leading-relaxed">
                    {message}
                  </p>
                </div>

                {/* Deduction Reassurance Alert */}
                <div className="rounded-2xl border border-amber-200/80 bg-amber-50/70 p-4 text-left flex gap-3 text-xs text-amber-900">
                  <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                  <div className="space-y-1">
                    <span className="font-semibold block">Was money debited?</span>
                    <p className="text-amber-800 leading-relaxed">
                      If amount was debited from your bank, our system will reconcile it automatically within a few minutes, or it will be reversed to your account by your bank.
                    </p>
                  </div>
                </div>

                {/* Primary Recovery Action Buttons */}
                <div className="flex flex-col gap-2.5 pt-2">
                  <Button
                    onClick={() => navigate('/checkout')}
                    className="w-full bg-[#2BB0BB] hover:bg-[#1A8491] text-white font-heading font-semibold rounded-xl h-12 shadow-sm hover:shadow transition-all duration-200 flex items-center justify-center gap-2"
                  >
                    <CreditCard className="w-4 h-4" />
                    <span>Try Payment Again</span>
                    <ArrowRight className="w-4 h-4 ml-1" />
                  </Button>

                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      onClick={handleRetry}
                      className="flex-1 rounded-xl h-10 border-gray-200 text-gray-700 hover:bg-gray-50 text-xs font-medium"
                    >
                      <RefreshCw className="w-3.5 h-3.5 mr-1.5" />
                      Re-check Status
                    </Button>
                    <Button
                      variant="outline"
                      onClick={() => navigate('/trips')}
                      className="flex-1 rounded-xl h-10 border-gray-200 text-gray-700 hover:bg-gray-50 text-xs font-medium"
                    >
                      <Calendar className="w-3.5 h-3.5 mr-1.5" />
                      View Trips
                    </Button>
                  </div>
                </div>
              </div>
            )}

            {/* Reference Details Footer (Order & Transaction IDs) */}
            {(transactionId || orderReference) && (
              <div className="pt-4 border-t border-gray-150">
                <div className="rounded-2xl bg-gray-50/80 border border-gray-200/70 p-3.5 space-y-2 text-xs">
                  {orderReference && (
                    <div className="flex items-center justify-between">
                      <span className="text-gray-500 font-medium">Order Reference:</span>
                      <div className="flex items-center gap-1.5">
                        <span className="font-mono font-semibold text-gray-800">
                          {orderReference}
                        </span>
                        <button
                          type="button"
                          onClick={() => copyToClipboard(orderReference, 'order')}
                          className="text-gray-400 hover:text-gray-700 p-1 rounded transition-colors"
                          title="Copy Order Reference"
                        >
                          {copiedKey === 'order' ? (
                            <Check className="w-3.5 h-3.5 text-emerald-600" />
                          ) : (
                            <Copy className="w-3.5 h-3.5" />
                          )}
                        </button>
                      </div>
                    </div>
                  )}

                  {transactionId && (
                    <div className="flex items-center justify-between">
                      <span className="text-gray-500 font-medium">Transaction ID:</span>
                      <div className="flex items-center gap-1.5 max-w-[65%]">
                        <span className="font-mono text-gray-700 truncate" title={transactionId}>
                          {transactionId}
                        </span>
                        <button
                          type="button"
                          onClick={() => copyToClipboard(transactionId, 'tx')}
                          className="text-gray-400 hover:text-gray-700 p-1 rounded transition-colors shrink-0"
                          title="Copy Transaction ID"
                        >
                          {copiedKey === 'tx' ? (
                            <Check className="w-3.5 h-3.5 text-emerald-600" />
                          ) : (
                            <Copy className="w-3.5 h-3.5" />
                          )}
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>

          {/* Footer Back Link & Help */}
          <div className="mt-6 flex items-center justify-between text-xs text-gray-500 px-2">
            <button
              onClick={() => navigate('/cart')}
              className="flex items-center gap-1.5 hover:text-gray-900 transition-colors"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Return to Cart</span>
            </button>

            <a
              href="mailto:support@triphavenco.com"
              className="flex items-center gap-1 hover:text-[#1A8491] transition-colors"
            >
              <HelpCircle className="w-3.5 h-3.5" />
              <span>Need help with payment?</span>
            </a>
          </div>
        </div>
      </main>
    </div>
  );
}

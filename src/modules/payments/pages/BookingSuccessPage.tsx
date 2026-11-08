import { useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import {
  CheckCircle2,
  Home,
  Calendar,
  Copy,
  Check,
  Printer,
  ArrowRight,
  ShieldCheck,
  Mail,
  Sparkles,
  Luggage,
  HelpCircle,
  Compass,
} from 'lucide-react';
import Navbar from '@/components/Navbar';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { toast } from '@/hooks/use-toast';

export default function BookingSuccessPage() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const orderRef = searchParams.get('order') || searchParams.get('order_id');
  const txId = searchParams.get('tx');

  const [copiedKey, setCopiedKey] = useState<string | null>(null);

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

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="min-h-screen bg-[#F8FAFB] flex flex-col">
      <Navbar />

      <main className="flex-1 flex items-center justify-center px-4 py-12 sm:py-16">
        <div className="w-full max-w-xl space-y-6">
          {/* Main Card */}
          <div className="bg-white rounded-3xl border border-gray-200/90 shadow-xl p-7 sm:p-10 space-y-8 relative overflow-hidden animate-fade-in">
            {/* Top Brand Decorative Bar */}
            <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-emerald-500 via-[#2BB0BB] to-[#1A8491]" />

            {/* Celebratory Hero Header */}
            <div className="text-center space-y-4">
              <div className="relative w-24 h-24 mx-auto flex items-center justify-center">
                {/* Concentric subtle pulsing glow */}
                <div className="absolute inset-0 rounded-full bg-emerald-100/60 animate-ping opacity-75" />
                <div className="relative w-20 h-20 rounded-full bg-emerald-50 border-2 border-emerald-200 flex items-center justify-center text-emerald-600 shadow-sm animate-scale-in">
                  <CheckCircle2 className="w-10 h-10" />
                </div>
              </div>

              <div className="space-y-2">
                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 text-emerald-700 text-xs font-semibold border border-emerald-200/70">
                  <Sparkles className="w-3.5 h-3.5 text-emerald-600" />
                  <span>Reservation Confirmed & Paid</span>
                </div>
                <h1 className="text-3xl font-heading font-extrabold text-gray-900 tracking-tight">
                  You're going to Kerala!
                </h1>
                <p className="text-sm text-gray-600 max-w-md mx-auto leading-relaxed">
                  Your payment was successful and your stay dates are locked in. A booking confirmation voucher has been dispatched to your email.
                </p>
              </div>
            </div>

            {/* Booking Details Voucher Slip */}
            {(orderRef || txId) && (
              <div className="rounded-2xl border border-gray-200/80 bg-gray-50/70 p-5 space-y-3.5">
                <div className="flex items-center justify-between pb-3 border-b border-gray-200/60">
                  <span className="text-xs font-semibold uppercase tracking-wider text-gray-500">
                    Booking Summary
                  </span>
                  <Badge className="bg-emerald-100 text-emerald-800 border-emerald-200 text-xs font-medium">
                    Confirmed
                  </Badge>
                </div>

                <div className="space-y-2.5 text-xs sm:text-sm">
                  {orderRef && (
                    <div className="flex items-center justify-between gap-2">
                      <span className="text-gray-500 font-medium">Order Reference</span>
                      <div className="flex items-center gap-1.5">
                        <span className="font-mono font-semibold text-gray-900">
                          {orderRef}
                        </span>
                        <button
                          type="button"
                          onClick={() => copyToClipboard(orderRef, 'order')}
                          className="text-gray-400 hover:text-gray-700 p-1 rounded transition-colors"
                          title="Copy order reference"
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

                  {txId && (
                    <div className="flex items-center justify-between gap-2">
                      <span className="text-gray-500 font-medium">Payment ID</span>
                      <div className="flex items-center gap-1.5 max-w-[65%]">
                        <span className="font-mono text-gray-700 truncate" title={txId}>
                          {txId}
                        </span>
                        <button
                          type="button"
                          onClick={() => copyToClipboard(txId, 'tx')}
                          className="text-gray-400 hover:text-gray-700 p-1 rounded transition-colors shrink-0"
                          title="Copy payment ID"
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

                  <div className="flex items-center justify-between gap-2 pt-1 border-t border-gray-200/40 text-xs text-gray-500">
                    <span className="flex items-center gap-1">
                      <ShieldCheck className="w-3.5 h-3.5 text-[#1A8491]" />
                      Payment Verified via Cashfree
                    </span>
                    <button
                      type="button"
                      onClick={handlePrint}
                      className="hover:text-gray-900 flex items-center gap-1 transition-colors text-gray-600 font-medium"
                    >
                      <Printer className="w-3.5 h-3.5" />
                      Print Voucher
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* What to Expect Next (Timeline Guide) */}
            <div className="space-y-3 pt-1">
              <h3 className="font-heading font-semibold text-sm text-gray-900">
                What happens next?
              </h3>
              <div className="grid grid-cols-1 gap-2.5">
                <div className="flex items-start gap-3 p-3 rounded-xl bg-teal-50/50 border border-teal-100/60 text-left">
                  <div className="w-8 h-8 rounded-lg bg-teal-100/80 text-[#1A8491] flex items-center justify-center shrink-0 mt-0.5">
                    <Mail className="w-4 h-4" />
                  </div>
                  <div className="text-xs text-gray-600 leading-relaxed">
                    <span className="font-semibold text-gray-900 block">
                      Check your email inbox
                    </span>
                    We've emailed your booking vouchers, check-in directions, and host contacts.
                  </div>
                </div>

                <div className="flex items-start gap-3 p-3 rounded-xl bg-gray-50/70 border border-gray-150 text-left">
                  <div className="w-8 h-8 rounded-lg bg-gray-200/80 text-gray-700 flex items-center justify-center shrink-0 mt-0.5">
                    <Luggage className="w-4 h-4" />
                  </div>
                  <div className="text-xs text-gray-600 leading-relaxed">
                    <span className="font-semibold text-gray-900 block">
                      Manage trips anytime
                    </span>
                    View stay amenities, request special check-in times, or make changes under Trips.
                  </div>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-3 pt-2">
              <Button
                onClick={() => navigate('/trips')}
                className="flex-1 bg-[#2BB0BB] hover:bg-[#1A8491] text-white font-heading font-semibold rounded-xl h-12 shadow-sm hover:shadow transition-all duration-200 flex items-center justify-center gap-2 active:scale-[0.98]"
              >
                <Calendar className="w-4 h-4" />
                <span>View My Trips</span>
                <ArrowRight className="w-4 h-4 ml-1" />
              </Button>

              <Button
                variant="outline"
                onClick={() => navigate('/')}
                className="flex-1 rounded-xl h-12 border-gray-200 text-gray-700 hover:bg-gray-50 font-medium transition-all"
              >
                <Compass className="w-4 h-4 mr-2 text-gray-500" />
                <span>Explore More</span>
              </Button>
            </div>
          </div>

          {/* Footer Assistance Note */}
          <div className="text-center text-xs text-gray-500 flex items-center justify-center gap-2">
            <HelpCircle className="w-3.5 h-3.5 text-gray-400" />
            <span>Have questions about your itinerary?</span>
            <a
              href="mailto:support@triphavenco.com"
              className="text-[#1A8491] hover:underline font-medium"
            >
              Contact Concierge
            </a>
          </div>
        </div>
      </main>
    </div>
  );
}

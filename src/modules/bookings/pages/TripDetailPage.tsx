import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Loader2, ArrowLeft, AlertTriangle, ShieldAlert } from 'lucide-react';
import Navbar from '@/components/Navbar';
import { Button } from '@/components/ui/button';
import { useTripDetailQuery } from '../hooks/useTrips';
import { useRequireAuth } from '@/modules/cart/hooks/useRequireAuth';
import { useCartMutations } from '@/modules/cart/hooks/useCartMutations';
import { TripOrderDetail } from '../components/TripOrderDetail';
import { CancelBookingDialog } from '../components/CancelBookingDialog';

const CANCELLABLE = new Set(['CONFIRMED', 'PENDING_PAYMENT', 'PARTIALLY_CANCELLED']);

export default function TripDetailPage() {
  const { orderId } = useParams<{ orderId: string }>();
  const numericId = orderId ? Number(orderId) : undefined;
  const navigate = useNavigate();
  const { isAuthenticated, requireAuth } = useRequireAuth();
  const { data: order, isLoading, isError, refetch } = useTripDetailQuery(numericId);
  const { cancelOrder } = useCartMutations();
  const [cancelOpen, setCancelOpen] = useState(false);

  useEffect(() => {
    if (!isAuthenticated) requireAuth(`/trips/${orderId}`);
  }, [isAuthenticated, requireAuth, orderId]);

  const canCancel = order && CANCELLABLE.has(order.status);

  const handleCancel = async (reason: string) => {
    if (!numericId) return;
    await cancelOrder.mutateAsync({ orderId: numericId, payload: { reason } });
    setCancelOpen(false);
    refetch();
  };

  return (
    <div className="min-h-screen bg-[#F8FAFB] pb-20">
      <Navbar />

      <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
        {/* Navigation Breadcrumb */}
        <div className="flex items-center justify-between pb-4 border-b border-gray-200/80">
          <div className="flex items-center gap-3">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => navigate('/trips')}
              className="h-10 w-10 rounded-xl hover:bg-gray-100 text-gray-600"
            >
              <ArrowLeft className="w-5 h-5" />
            </Button>
            <div>
              <div className="flex items-center gap-2 text-xs font-medium text-gray-500 mb-0.5">
                <button
                  onClick={() => navigate('/trips')}
                  className="hover:text-gray-900 transition-colors"
                >
                  My Trips
                </button>
                <span>/</span>
                <span className="text-[#1A8491] font-semibold">
                  Reservation {order?.order_reference || `#${orderId}`}
                </span>
              </div>
              <h1 className="text-2xl sm:text-3xl font-heading font-bold text-gray-900 tracking-tight">
                Trip Details & Itinerary
              </h1>
            </div>
          </div>
        </div>

        {/* Content Body */}
        {!isAuthenticated || isLoading ? (
          <div className="flex flex-col items-center justify-center py-28 space-y-3">
            <Loader2 className="w-9 h-9 animate-spin text-[#2BB0BB]" />
            <p className="text-sm font-medium text-gray-500">Retrieving trip itinerary…</p>
          </div>
        ) : isError || !order ? (
          <div className="bg-white rounded-3xl border border-gray-200/90 p-10 max-w-md mx-auto text-center space-y-4 shadow-sm">
            <div className="w-14 h-14 bg-red-50 text-red-500 rounded-2xl flex items-center justify-center mx-auto">
              <AlertTriangle className="w-7 h-7" />
            </div>
            <div className="space-y-1">
              <h2 className="text-lg font-heading font-semibold text-gray-900">
                Trip Not Found
              </h2>
              <p className="text-xs text-gray-500 leading-relaxed">
                We couldn't locate this reservation. It may have been removed or belongs to another account.
              </p>
            </div>
            <Button
              variant="outline"
              onClick={() => navigate('/trips')}
              className="rounded-xl text-xs h-10 px-5 border-gray-200"
            >
              Back to Trips
            </Button>
          </div>
        ) : (
          <div className="space-y-8 animate-fade-in">
            <TripOrderDetail order={order} />

            {/* Cancellation Area (If eligible) */}
            {canCancel && (
              <div className="bg-white rounded-3xl border border-red-100 p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-sm">
                <div className="space-y-1">
                  <div className="flex items-center gap-2 text-sm font-semibold text-gray-900">
                    <ShieldAlert className="w-4 h-4 text-rose-500" />
                    <span>Need to cancel or modify this reservation?</span>
                  </div>
                  <p className="text-xs text-gray-500 max-w-xl leading-relaxed">
                    Eligible line items will be cancelled and refund amounts will be calculated based on the property cancellation window.
                  </p>
                </div>
                <Button
                  variant="outline"
                  onClick={() => setCancelOpen(true)}
                  className="rounded-xl text-xs font-semibold text-red-600 border-red-200 hover:bg-red-50 hover:text-red-700 h-10 px-4 shrink-0 transition-colors"
                >
                  Cancel Trip / Request Refund
                </Button>
              </div>
            )}
          </div>
        )}
      </main>

      <CancelBookingDialog
        open={cancelOpen}
        onOpenChange={setCancelOpen}
        title="Cancel this trip?"
        description="We'll cancel eligible line items and initiate refunds per policy. Partial cancellations may leave other items confirmed."
        isPending={cancelOrder.isPending}
        onConfirm={handleCancel}
      />
    </div>
  );
}

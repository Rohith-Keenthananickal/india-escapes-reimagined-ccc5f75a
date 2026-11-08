import { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Loader2,
  ArrowLeft,
  Calendar,
  Compass,
  AlertTriangle,
  CheckCircle2,
  Package,
} from 'lucide-react';
import Navbar from '@/components/Navbar';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useTripsQuery } from '../hooks/useTrips';
import { useRequireAuth } from '@/modules/cart/hooks/useRequireAuth';
import { TripOrderCard } from '../components/TripOrderCard';

type TripTab = 'all' | 'active' | 'cancelled';

export default function TripsPage() {
  const navigate = useNavigate();
  const { isAuthenticated, requireAuth } = useRequireAuth();
  const { data: orders, isLoading, isError, refetch } = useTripsQuery();

  const [activeTab, setActiveTab] = useState<TripTab>('all');

  useEffect(() => {
    if (!isAuthenticated) requireAuth('/trips');
  }, [isAuthenticated, requireAuth]);

  const activeOrders = useMemo(
    () =>
      orders?.filter(
        (o) => o.status === 'CONFIRMED' || o.status === 'PENDING_PAYMENT'
      ) ?? [],
    [orders]
  );

  const pastOrCancelledOrders = useMemo(
    () =>
      orders?.filter(
        (o) =>
          o.status === 'CANCELLED' ||
          o.status === 'REFUNDED' ||
          o.status === 'FAILED' ||
          o.status === 'PARTIALLY_CANCELLED'
      ) ?? [],
    [orders]
  );

  const displayedOrders = useMemo(() => {
    if (activeTab === 'active') return activeOrders;
    if (activeTab === 'cancelled') return pastOrCancelledOrders;
    return orders ?? [];
  }, [activeTab, orders, activeOrders, pastOrCancelledOrders]);

  return (
    <div className="min-h-screen bg-[#F8FAFB] pb-16">
      <Navbar />

      <main className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        {/* Header Section */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 pb-6 border-b border-gray-200/80">
          <div className="space-y-1">
            <div className="flex items-center gap-2 text-xs font-medium text-gray-500 mb-1">
              <button
                onClick={() => navigate('/')}
                className="hover:text-gray-900 flex items-center gap-1 transition-colors"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                Home
              </button>
              <span>/</span>
              <span className="text-[#1A8491] font-semibold">Trips & Bookings</span>
            </div>
            <h1 className="text-3xl font-heading font-bold text-gray-900 tracking-tight">
              My Trips & Itineraries
            </h1>
            <p className="text-sm text-gray-500">
              Manage your confirmed homestays, boutique villas, and curated Kerala experiences.
            </p>
          </div>

          <Button
            onClick={() => navigate('/properties')}
            className="bg-[#2BB0BB] hover:bg-[#1A8491] text-white font-medium rounded-xl h-10 px-4 text-xs gap-1.5 shadow-sm transition-all"
          >
            <Compass className="w-4 h-4" />
            <span>Discover Escapes</span>
          </Button>
        </div>

        {/* Filter Tabs */}
        {orders && orders.length > 0 && (
          <div className="flex items-center gap-2 border-b border-gray-200/80 pb-2">
            <button
              onClick={() => setActiveTab('all')}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-all flex items-center gap-1.5 ${
                activeTab === 'all'
                  ? 'bg-white text-gray-900 shadow-sm border border-gray-200'
                  : 'text-gray-500 hover:text-gray-900 hover:bg-gray-100/60'
              }`}
            >
              <span>All Bookings</span>
              <span className="text-[10px] px-1.5 py-0.2 rounded-full bg-gray-100 text-gray-600">
                {orders.length}
              </span>
            </button>

            <button
              onClick={() => setActiveTab('active')}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-all flex items-center gap-1.5 ${
                activeTab === 'active'
                  ? 'bg-white text-gray-900 shadow-sm border border-gray-200'
                  : 'text-gray-500 hover:text-gray-900 hover:bg-gray-100/60'
              }`}
            >
              <span>Upcoming & Confirmed</span>
              <span className="text-[10px] px-1.5 py-0.2 rounded-full bg-emerald-100 text-emerald-800">
                {activeOrders.length}
              </span>
            </button>

            <button
              onClick={() => setActiveTab('cancelled')}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-all flex items-center gap-1.5 ${
                activeTab === 'cancelled'
                  ? 'bg-white text-gray-900 shadow-sm border border-gray-200'
                  : 'text-gray-500 hover:text-gray-900 hover:bg-gray-100/60'
              }`}
            >
              <span>Cancelled / Refunded</span>
              <span className="text-[10px] px-1.5 py-0.2 rounded-full bg-gray-100 text-gray-600">
                {pastOrCancelledOrders.length}
              </span>
            </button>
          </div>
        )}

        {/* Content Body */}
        {!isAuthenticated || isLoading ? (
          <div className="flex flex-col items-center justify-center py-28 space-y-3">
            <Loader2 className="w-9 h-9 animate-spin text-[#2BB0BB]" />
            <p className="text-sm font-medium text-gray-500">Loading your itineraries…</p>
          </div>
        ) : isError ? (
          <div className="bg-white rounded-3xl border border-gray-200/90 p-10 max-w-md mx-auto text-center space-y-4 shadow-sm">
            <div className="w-14 h-14 bg-red-50 text-red-500 rounded-2xl flex items-center justify-center mx-auto">
              <AlertTriangle className="w-7 h-7" />
            </div>
            <div className="space-y-1">
              <h2 className="text-lg font-heading font-semibold text-gray-900">
                Could not load your trips
              </h2>
              <p className="text-xs text-gray-500 leading-relaxed">
                We ran into an issue connecting to your reservations. Please try again.
              </p>
            </div>
            <Button
              variant="outline"
              onClick={() => refetch()}
              className="rounded-xl text-xs h-10 px-5 border-gray-200"
            >
              Try Again
            </Button>
          </div>
        ) : !orders?.length ? (
          <div className="bg-white rounded-3xl border border-gray-200/90 p-12 max-w-lg mx-auto text-center space-y-5 shadow-sm">
            <div className="w-20 h-20 bg-teal-50 text-[#1A8491] rounded-3xl flex items-center justify-center mx-auto border border-teal-100 shadow-sm">
              <Calendar className="w-10 h-10 stroke-[1.5]" />
            </div>
            <div className="space-y-2">
              <h2 className="text-2xl font-heading font-bold text-gray-900 tracking-tight">
                No trips booked yet
              </h2>
              <p className="text-sm text-gray-500 max-w-sm mx-auto leading-relaxed">
                When you reserve serene backwater homestays or heritage plantation villas, your booking vouchers and live route will appear here.
              </p>
            </div>
            <Button
              onClick={() => navigate('/properties')}
              className="bg-[#2BB0BB] hover:bg-[#1A8491] text-white font-heading font-semibold rounded-xl px-6 h-11 shadow-sm transition-all"
            >
              <Compass className="w-4 h-4 mr-2" />
              Explore Kerala Properties
            </Button>
          </div>
        ) : displayedOrders.length === 0 ? (
          <div className="bg-white rounded-2xl border border-gray-200/80 p-8 text-center space-y-3">
            <p className="text-sm text-gray-500">
              No bookings found in this filter category.
            </p>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setActiveTab('all')}
              className="rounded-xl text-xs"
            >
              View All Bookings
            </Button>
          </div>
        ) : (
          <div className="space-y-4 animate-fade-in">
            {displayedOrders.map((order) => (
              <TripOrderCard key={order.id} order={order} />
            ))}
          </div>
        )}
      </main>
    </div>
  );
}

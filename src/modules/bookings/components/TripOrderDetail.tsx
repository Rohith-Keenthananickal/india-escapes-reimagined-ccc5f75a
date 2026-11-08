import { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useQueries } from '@tanstack/react-query';
import { format, parseISO, differenceInCalendarDays } from 'date-fns';
import {
  Hotel,
  Clock,
  Calendar,
  Users,
  MapPin,
  CheckCircle2,
  AlertTriangle,
  Copy,
  Check,
  Printer,
  ShieldCheck,
  ExternalLink,
  HelpCircle,
  Shield,
  Sparkles,
} from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { toast } from '@/hooks/use-toast';
import { propertyDetailsService } from '@/modules/property-details/services/propertyDetailsService';
import type { TripOrder, TripOrderItem } from '@/modules/cart/types/cart.types';

function formatDate(value?: string | null) {
  if (!value) return '—';
  try {
    return format(parseISO(value), 'EEE, MMM d, yyyy');
  } catch {
    return value;
  }
}

const STATUS_CONFIG: Record<
  string,
  { label: string; badgeClass: string; bannerClass: string; icon: any; bannerText: string }
> = {
  CONFIRMED: {
    label: 'Confirmed',
    badgeClass: 'bg-emerald-50 text-emerald-800 border-emerald-200',
    bannerClass: 'bg-emerald-50/80 border-emerald-200 text-emerald-900',
    icon: CheckCircle2,
    bannerText: 'Your reservation is confirmed! Check-in instructions and voucher details are below.',
  },
  PENDING_PAYMENT: {
    label: 'Payment Pending',
    badgeClass: 'bg-amber-50 text-amber-800 border-amber-200',
    bannerClass: 'bg-amber-50/80 border-amber-200 text-amber-900',
    icon: Clock,
    bannerText: 'Payment is awaiting final bank verification. Once verified, this booking locks in.',
  },
  CANCELLED: {
    label: 'Cancelled',
    badgeClass: 'bg-gray-100 text-gray-700 border-gray-200',
    bannerClass: 'bg-gray-50 border-gray-200 text-gray-800',
    icon: AlertTriangle,
    bannerText: 'This reservation has been cancelled. Refund processing details have been sent to your email.',
  },
  REFUNDED: {
    label: 'Refunded',
    badgeClass: 'bg-blue-50 text-blue-800 border-blue-200',
    bannerClass: 'bg-blue-50/80 border-blue-200 text-blue-900',
    icon: ShieldCheck,
    bannerText: 'Refund has been initiated and credited to your original payment method.',
  },
  PARTIALLY_CANCELLED: {
    label: 'Partially Cancelled',
    badgeClass: 'bg-orange-50 text-orange-800 border-orange-200',
    bannerClass: 'bg-orange-50/80 border-orange-200 text-orange-900',
    icon: AlertTriangle,
    bannerText: 'Some items in this booking were cancelled. The remaining items remain active.',
  },
  FAILED: {
    label: 'Failed',
    badgeClass: 'bg-rose-50 text-rose-800 border-rose-200',
    bannerClass: 'bg-rose-50/80 border-rose-200 text-rose-900',
    icon: AlertTriangle,
    bannerText: 'Payment failed for this booking. Any deducted amount will be reversed by your bank.',
  },
};

interface TripOrderDetailProps {
  order: TripOrder;
}

export function TripOrderDetail({ order }: TripOrderDetailProps) {
  const navigate = useNavigate();
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

  const propertyIds = useMemo(
    () =>
      [
        ...new Set(
          order.items
            .map((i) => i.property_id)
            .filter((id): id is number => !!id)
        ),
      ],
    [order.items]
  );

  const propertyQueries = useQueries({
    queries: propertyIds.map((id) => ({
      queryKey: ['property-details', id],
      queryFn: () => propertyDetailsService.getPropertyById(id),
      staleTime: 5 * 60_000,
      enabled: propertyIds.length > 0,
    })),
  });

  const propertyById = useMemo(() => {
    const map = new Map<
      number,
      Awaited<ReturnType<typeof propertyDetailsService.getPropertyById>>
    >();
    propertyIds.forEach((id, idx) => {
      const data = propertyQueries[idx]?.data;
      if (data) map.set(id, data);
    });
    return map;
  }, [propertyIds, propertyQueries]);

  const statusConfig = STATUS_CONFIG[order.status] || {
    label: order.status.replace(/_/g, ' '),
    badgeClass: 'bg-gray-50 text-gray-700 border-gray-200',
    bannerClass: 'bg-gray-50 border-gray-200 text-gray-800',
    icon: AlertTriangle,
    bannerText: `Booking status is currently ${order.status}.`,
  };

  const StatusIcon = statusConfig.icon;

  const stayItems = order.items.filter((i) => i.item_type !== 'EXPERIENCE');
  const experienceItems = order.items.filter((i) => i.item_type === 'EXPERIENCE');

  return (
    <div className="space-y-6">
      {/* Status Notice Banner */}
      <div
        className={`p-4 rounded-2xl border flex items-start gap-3.5 shadow-sm ${statusConfig.bannerClass}`}
      >
        <StatusIcon className="w-5 h-5 shrink-0 mt-0.5" />
        <div className="flex-1 text-xs sm:text-sm">
          <div className="flex items-center gap-2 font-semibold">
            <span>Status: {statusConfig.label}</span>
            <span className="text-xs opacity-70">•</span>
            <span className="font-mono text-xs">{order.order_reference}</span>
          </div>
          <p className="mt-0.5 leading-relaxed opacity-90">{statusConfig.bannerText}</p>
        </div>
      </div>

      {/* Main 2-Column Responsive Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Column (8 cols): Stays, Experiences, Check-in details */}
        <div className="lg:col-span-8 space-y-6">
          {/* Stays Section */}
          {stayItems.length > 0 && (
            <div className="space-y-4">
              <h3 className="font-heading font-bold text-lg text-gray-900 flex items-center gap-2">
                <Hotel className="w-5 h-5 text-[#1A8491]" />
                <span>Reserved Stays ({stayItems.length})</span>
              </h3>

              <div className="space-y-4">
                {stayItems.map((item) => {
                  const prop = item.property_id
                    ? propertyById.get(item.property_id)
                    : undefined;

                  const nights =
                    item.check_in_date && item.check_out_date
                      ? differenceInCalendarDays(
                          parseISO(item.check_out_date),
                          parseISO(item.check_in_date)
                        )
                      : null;

                  return (
                    <div
                      key={item.id}
                      className="bg-white rounded-3xl border border-gray-200/90 shadow-sm overflow-hidden p-5 sm:p-6 space-y-4"
                    >
                      <div className="flex flex-col sm:flex-row gap-4 items-start">
                        {/* Property Image */}
                        <div className="w-full sm:w-36 h-36 rounded-2xl overflow-hidden bg-gray-100 shrink-0 border border-gray-200">
                          {prop?.images?.[0] ? (
                            <img
                              src={prop.images[0]}
                              alt={prop.title || 'Property'}
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center text-gray-400 bg-gray-50">
                              <Hotel className="w-8 h-8 stroke-1" />
                            </div>
                          )}
                        </div>

                        {/* Title & Metadata */}
                        <div className="flex-1 min-w-0 space-y-2">
                          <div className="flex items-center justify-between gap-2 flex-wrap">
                            <span className="text-[11px] font-semibold text-teal-800 bg-teal-50 px-2 py-0.5 rounded-full border border-teal-200">
                              {item.item_type === 'STAY_ROOM' ? 'Private Room' : 'Entire Homestay / Villa'}
                            </span>
                            <Badge variant="outline" className="text-xs">
                              {item.status}
                            </Badge>
                          </div>

                          <div>
                            <h4 className="font-heading font-bold text-lg text-gray-900 line-clamp-1">
                              {prop?.title || `Kerala Stay #${item.property_id}`}
                            </h4>
                            <p className="text-xs text-gray-500 flex items-center gap-1 mt-0.5">
                              <MapPin className="w-3.5 h-3.5 text-gray-400 shrink-0" />
                              <span>{prop?.location || 'Kerala, India'}</span>
                            </p>
                          </div>

                          {prop?.id && (
                            <button
                              type="button"
                              onClick={() => navigate(`/property/${prop.id}`)}
                              className="inline-flex items-center gap-1 text-xs text-[#1A8491] hover:underline font-medium pt-1"
                            >
                              <span>View Property Listing</span>
                              <ExternalLink className="w-3.5 h-3.5" />
                            </button>
                          )}
                        </div>
                      </div>

                      {/* Check-in / Check-out Grid */}
                      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 p-3.5 rounded-2xl bg-gray-50/80 border border-gray-150 text-xs text-gray-600">
                        <div>
                          <span className="text-[10px] text-gray-400 block uppercase tracking-wider font-semibold">
                            Check-In
                          </span>
                          <span className="font-semibold text-gray-900 block mt-0.5">
                            {formatDate(item.check_in_date)}
                          </span>
                          <span className="text-[11px] text-gray-500">After 2:00 PM</span>
                        </div>

                        <div>
                          <span className="text-[10px] text-gray-400 block uppercase tracking-wider font-semibold">
                            Check-Out
                          </span>
                          <span className="font-semibold text-gray-900 block mt-0.5">
                            {formatDate(item.check_out_date)}
                          </span>
                          <span className="text-[11px] text-gray-500">Before 11:00 AM</span>
                        </div>

                        <div className="col-span-2 sm:col-span-1 border-t sm:border-t-0 pt-2 sm:pt-0">
                          <span className="text-[10px] text-gray-400 block uppercase tracking-wider font-semibold">
                            Party Size
                          </span>
                          <span className="font-semibold text-gray-900 block mt-0.5">
                            {item.guest_count} {item.guest_count === 1 ? 'Guest' : 'Guests'}
                          </span>
                          {nights !== null && (
                            <span className="text-[11px] text-gray-500">
                              {nights} {nights === 1 ? 'Night' : 'Nights'}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* Experiences Section */}
          {experienceItems.length > 0 && (
            <div className="space-y-4">
              <h3 className="font-heading font-bold text-lg text-gray-900 flex items-center gap-2">
                <Clock className="w-5 h-5 text-[#D4A237]" />
                <span>Reserved Experiences ({experienceItems.length})</span>
              </h3>

              <div className="space-y-3">
                {experienceItems.map((item) => (
                  <div
                    key={item.id}
                    className="bg-white rounded-3xl border border-gray-200/90 shadow-sm p-5 flex items-center justify-between gap-4"
                  >
                    <div className="flex items-center gap-3.5 min-w-0">
                      <div className="w-12 h-12 rounded-2xl bg-amber-50 text-[#D4A237] border border-amber-200 flex items-center justify-center shrink-0">
                        <Sparkles className="w-6 h-6 stroke-[1.5]" />
                      </div>
                      <div className="min-w-0">
                        <div className="flex items-center gap-2">
                          <h4 className="font-heading font-semibold text-sm sm:text-base text-gray-900 truncate">
                            Curated Kerala Experience #{item.experience_id}
                          </h4>
                          <Badge variant="outline" className="text-xs">
                            {item.status}
                          </Badge>
                        </div>
                        <div className="flex items-center gap-3 text-xs text-gray-500 mt-0.5">
                          <span className="flex items-center gap-1">
                            <Calendar className="w-3.5 h-3.5 text-gray-400" />
                            {formatDate(item.experience_date)}
                          </span>
                          <span className="flex items-center gap-1">
                            <Users className="w-3.5 h-3.5 text-gray-400" />
                            {item.guest_count} {item.guest_count === 1 ? 'Guest' : 'Guests'}
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="text-right shrink-0">
                      <span className="text-base font-heading font-bold text-gray-900">
                        ₹{Number(item.total_guest_payment || 0).toLocaleString()}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Check-In Guidelines & Ground Rules Card */}
          <div className="bg-white rounded-3xl border border-gray-200/90 shadow-sm p-6 space-y-4">
            <h3 className="font-heading font-bold text-base text-gray-900 flex items-center gap-2">
              <Shield className="w-4 h-4 text-[#1A8491]" />
              <span>Check-in Instructions & Travel Safety</span>
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs text-gray-600">
              <div className="p-3.5 rounded-2xl bg-gray-50/70 border border-gray-150 space-y-1">
                <span className="font-semibold text-gray-900 block">Government ID Required</span>
                <p>All adult guests must carry valid government photo IDs (Aadhaar, Passport, or Voter ID) for entry verification.</p>
              </div>

              <div className="p-3.5 rounded-2xl bg-gray-50/70 border border-gray-150 space-y-1">
                <span className="font-semibold text-gray-900 block">Host Contact & Key Exchange</span>
                <p>Directions and local caretaker contact details have been sent to your registered email address.</p>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column (4 cols): Payment Summary & Receipt Slip */}
        <div className="lg:col-span-4 space-y-6 lg:sticky lg:top-6">
          <div className="bg-white rounded-3xl border border-gray-200/90 shadow-sm p-6 space-y-5">
            <div className="flex items-center justify-between pb-3 border-b border-gray-100">
              <h3 className="font-heading font-bold text-base text-gray-900">
                Payment & Invoice
              </h3>
              <Badge className={statusConfig.badgeClass}>
                {statusConfig.label}
              </Badge>
            </div>

            {/* Reference Identifiers */}
            <div className="space-y-2.5 text-xs">
              <div className="flex items-center justify-between">
                <span className="text-gray-500 font-medium">Order Reference:</span>
                <div className="flex items-center gap-1.5">
                  <span className="font-mono font-bold text-gray-900">
                    {order.order_reference}
                  </span>
                  <button
                    type="button"
                    onClick={() => copyToClipboard(order.order_reference, 'order')}
                    className="p-1 text-gray-400 hover:text-gray-700 rounded transition-colors"
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

              {order.payment_transaction_id && (
                <div className="flex items-center justify-between">
                  <span className="text-gray-500 font-medium">Transaction ID:</span>
                  <div className="flex items-center gap-1.5 max-w-[60%]">
                    <span className="font-mono text-gray-700 truncate" title={order.payment_transaction_id}>
                      {order.payment_transaction_id}
                    </span>
                    <button
                      type="button"
                      onClick={() => copyToClipboard(order.payment_transaction_id!, 'tx')}
                      className="p-1 text-gray-400 hover:text-gray-700 rounded transition-colors shrink-0"
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

              <div className="flex items-center justify-between text-gray-500">
                <span>Booking Placed:</span>
                <span className="font-medium text-gray-700">{formatDate(order.created_at)}</span>
              </div>
            </div>

            <Separator />

            {/* Financials */}
            <div className="space-y-2 text-sm">
              <div className="flex justify-between items-center text-gray-600 text-xs">
                <span>Total Items</span>
                <span className="font-medium text-gray-900">{order.items.length}</span>
              </div>
              <div className="flex justify-between items-baseline pt-1">
                <span className="font-heading font-bold text-gray-900">
                  Total Paid
                </span>
                <span className="font-heading font-extrabold text-2xl text-[#1A8491]">
                  ₹{Number(order.total_guest_payment || 0).toLocaleString()}
                </span>
              </div>
            </div>

            {/* Print Voucher Action */}
            <Button
              variant="outline"
              onClick={handlePrint}
              className="w-full rounded-xl h-11 text-xs font-semibold border-gray-200 text-gray-700 hover:bg-gray-50 flex items-center justify-center gap-2"
            >
              <Printer className="w-4 h-4 text-gray-500" />
              <span>Print Itinerary / Receipt</span>
            </Button>
          </div>

          {/* Support Reassurance Card */}
          <div className="bg-white rounded-3xl border border-gray-200/90 shadow-sm p-5 space-y-2 text-xs text-gray-600">
            <div className="flex items-center gap-1.5 font-semibold text-gray-900">
              <HelpCircle className="w-4 h-4 text-[#1A8491]" />
              <span>Need help with this trip?</span>
            </div>
            <p className="leading-relaxed">
              Our 24/7 guest concierge team is available to help coordinate with hosts or adjust plans.
            </p>
            <a
              href="mailto:support@triphavenco.com"
              className="inline-block text-[#1A8491] font-semibold hover:underline pt-1"
            >
              Contact Support Concierge →
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}

export default TripOrderDetail;

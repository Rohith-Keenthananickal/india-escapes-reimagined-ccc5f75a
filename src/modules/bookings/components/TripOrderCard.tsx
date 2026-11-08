import { useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { format, parseISO } from 'date-fns';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  ChevronRight,
  Package,
  Calendar,
  Users,
  MapPin,
  Hotel,
  Clock,
  Sparkles,
} from 'lucide-react';
import { propertyDetailsService } from '@/modules/property-details/services/propertyDetailsService';
import type { TripOrder } from '@/modules/cart/types/cart.types';

const STATUS_CONFIG: Record<
  string,
  { label: string; badgeClass: string; dotClass: string }
> = {
  CONFIRMED: {
    label: 'Confirmed',
    badgeClass: 'bg-emerald-50 text-emerald-700 border-emerald-200',
    dotClass: 'bg-emerald-500',
  },
  PENDING_PAYMENT: {
    label: 'Payment Pending',
    badgeClass: 'bg-amber-50 text-amber-700 border-amber-200',
    dotClass: 'bg-amber-500',
  },
  CANCELLED: {
    label: 'Cancelled',
    badgeClass: 'bg-gray-100 text-gray-600 border-gray-200',
    dotClass: 'bg-gray-400',
  },
  REFUNDED: {
    label: 'Refunded',
    badgeClass: 'bg-blue-50 text-blue-700 border-blue-200',
    dotClass: 'bg-blue-500',
  },
  PARTIALLY_CANCELLED: {
    label: 'Partially Cancelled',
    badgeClass: 'bg-orange-50 text-orange-700 border-orange-200',
    dotClass: 'bg-orange-500',
  },
  FAILED: {
    label: 'Failed',
    badgeClass: 'bg-rose-50 text-rose-700 border-rose-200',
    dotClass: 'bg-rose-500',
  },
};

function formatDate(value?: string | null) {
  if (!value) return null;
  try {
    return format(parseISO(value), 'MMM d, yyyy');
  } catch {
    return value;
  }
}

interface TripOrderCardProps {
  order: TripOrder;
}

export function TripOrderCard({ order }: TripOrderCardProps) {
  const navigate = useNavigate();

  const firstStay = order.items.find((i) => i.item_type !== 'EXPERIENCE' && i.property_id);
  const firstItem = order.items[0];

  const { data: property } = useQuery({
    queryKey: ['property-details', firstStay?.property_id],
    queryFn: () => propertyDetailsService.getPropertyById(firstStay!.property_id!),
    staleTime: 5 * 60_000,
    enabled: !!firstStay?.property_id,
  });

  const statusInfo = STATUS_CONFIG[order.status] || {
    label: order.status.replace(/_/g, ' '),
    badgeClass: 'bg-gray-50 text-gray-700 border-gray-200',
    dotClass: 'bg-gray-400',
  };

  const datesText = useMemoDates(firstItem);
  const stayCount = order.items.filter((i) => i.item_type !== 'EXPERIENCE').length;
  const expCount = order.items.filter((i) => i.item_type === 'EXPERIENCE').length;

  return (
    <div
      onClick={() => navigate(`/trips/${order.id}`)}
      className="group bg-white rounded-2xl border border-gray-200/90 hover:border-[#2BB0BB]/50 hover:shadow-md transition-all duration-300 p-5 sm:p-6 cursor-pointer flex flex-col md:flex-row md:items-center justify-between gap-5"
    >
      <div className="flex items-start sm:items-center gap-4 min-w-0 flex-1">
        {/* Destination Thumbnail */}
        <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-xl overflow-hidden bg-gray-100 shrink-0 border border-gray-200 relative">
          {property?.images?.[0] ? (
            <img
              src={property.images[0]}
              alt={property.title || 'Trip stay'}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 ease-out"
            />
          ) : (
            <div className="w-full h-full flex flex-col items-center justify-center text-gray-400 bg-gray-50">
              <Hotel className="w-7 h-7 stroke-1 mb-1 text-gray-400" />
              <span className="text-[10px]">Kerala Trip</span>
            </div>
          )}
          {order.items.length > 1 && (
            <span className="absolute bottom-1 right-1 bg-black/75 backdrop-blur-sm text-white text-[10px] font-bold px-1.5 py-0.5 rounded-md">
              +{order.items.length - 1} more
            </span>
          )}
        </div>

        {/* Trip Metadata */}
        <div className="min-w-0 space-y-1.5 flex-1">
          <div className="flex flex-wrap items-center gap-2">
            <span className="font-mono text-xs font-semibold text-gray-500">
              {order.order_reference}
            </span>
            <Badge
              variant="outline"
              className={`text-xs px-2 py-0.5 font-medium flex items-center gap-1.5 ${statusInfo.badgeClass}`}
            >
              <span className={`w-1.5 h-1.5 rounded-full ${statusInfo.dotClass}`} />
              {statusInfo.label}
            </Badge>
          </div>

          <h3 className="font-heading font-bold text-base sm:text-lg text-gray-900 group-hover:text-[#1A8491] transition-colors truncate">
            {property?.title ||
              (firstItem?.item_type === 'EXPERIENCE'
                ? `Kerala Experience #${firstItem.experience_id}`
                : `Kerala Stay #${firstStay?.property_id || order.id}`)}
          </h3>

          <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-gray-500">
            {property?.location && (
              <span className="flex items-center gap-1 truncate">
                <MapPin className="w-3.5 h-3.5 text-gray-400 shrink-0" />
                {property.location}
              </span>
            )}

            {datesText && (
              <span className="flex items-center gap-1">
                <Calendar className="w-3.5 h-3.5 text-[#2BB0BB] shrink-0" />
                {datesText}
              </span>
            )}

            <span className="flex items-center gap-1">
              <Package className="w-3.5 h-3.5 text-gray-400 shrink-0" />
              {stayCount > 0 ? `${stayCount} Stay${stayCount > 1 ? 's' : ''}` : ''}
              {stayCount > 0 && expCount > 0 ? ', ' : ''}
              {expCount > 0 ? `${expCount} Experience${expCount > 1 ? 's' : ''}` : ''}
            </span>
          </div>
        </div>
      </div>

      {/* Pricing & CTA */}
      <div className="flex items-center justify-between md:flex-col md:items-end gap-3 pt-3 md:pt-0 border-t md:border-t-0 border-gray-100 shrink-0">
        <div className="text-left md:text-right">
          <span className="text-[11px] text-gray-400 block leading-tight">Total Payment</span>
          <span className="text-lg sm:text-xl font-heading font-extrabold text-[#1A8491]">
            ₹{Number(order.total_guest_payment || 0).toLocaleString()}
          </span>
        </div>

        <Button
          variant="outline"
          size="sm"
          className="rounded-xl border-gray-200 text-gray-700 group-hover:border-[#2BB0BB] group-hover:text-[#1A8491] group-hover:bg-teal-50/50 gap-1.5 h-9 text-xs font-semibold transition-all"
        >
          <span>View Itinerary</span>
          <ChevronRight className="w-4 h-4 text-gray-400 group-hover:text-[#1A8491] group-hover:translate-x-0.5 transition-all" />
        </Button>
      </div>
    </div>
  );
}

function useMemoDates(item?: TripOrder['items'][number]) {
  if (!item) return null;
  if (item.item_type === 'EXPERIENCE' && item.experience_date) {
    return formatDate(item.experience_date);
  }
  if (item.check_in_date && item.check_out_date) {
    return `${formatDate(item.check_in_date)} – ${formatDate(item.check_out_date)}`;
  }
  return null;
}

export default TripOrderCard;

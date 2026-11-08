import { format, parseISO } from 'date-fns';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Trash2, AlertTriangle, Users, Calendar } from 'lucide-react';
import type { CartItemPriced } from '../types/cart.types';

interface CartItemRowProps {
  item: CartItemPriced;
  onRemove: (itemId: number) => void;
  isRemoving?: boolean;
}

function itemLabel(item: CartItemPriced): string {
  if (item.item_type === 'EXPERIENCE') return `Experience #${item.experience_id}`;
  if (item.item_type === 'STAY_ROOM') return `Room stay · Property #${item.property_id}`;
  return `Whole property · #${item.property_id}`;
}

function formatDate(value?: string | null): string {
  if (!value) return '—';
  try {
    return format(parseISO(value), 'MMM d, yyyy');
  } catch {
    return value;
  }
}

export function CartItemRow({ item, onRemove, isRemoving }: CartItemRowProps) {
  return (
    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 rounded-2xl border border-gray-200 bg-white">
      <div className="space-y-2 min-w-0 flex-1">
        <div className="flex flex-wrap items-center gap-2">
          <h3 className="font-semibold text-gray-900 truncate">{itemLabel(item)}</h3>
          <Badge variant="secondary" className="text-xs">
            {item.item_type.replace(/_/g, ' ')}
          </Badge>
          {!item.is_available && (
            <Badge variant="destructive" className="text-xs gap-1">
              <AlertTriangle className="w-3 h-3" /> Unavailable
            </Badge>
          )}
        </div>

        <div className="flex flex-wrap gap-4 text-sm text-gray-600">
          {item.item_type === 'EXPERIENCE' ? (
            <span className="inline-flex items-center gap-1.5">
              <Calendar className="w-3.5 h-3.5" />
              {formatDate(item.experience_date)}
            </span>
          ) : (
            <span className="inline-flex items-center gap-1.5">
              <Calendar className="w-3.5 h-3.5" />
              {formatDate(item.check_in_date)} → {formatDate(item.check_out_date)}
            </span>
          )}
          <span className="inline-flex items-center gap-1.5">
            <Users className="w-3.5 h-3.5" />
            {item.guest_count} guest{item.guest_count === 1 ? '' : 's'}
          </span>
        </div>

        {item.availability_message && !item.is_available && (
          <p className="text-xs text-red-600">{item.availability_message}</p>
        )}
      </div>

      <div className="flex items-center gap-4 shrink-0">
        <div className="text-right">
          <p className="text-lg font-bold text-[#1A8491]">
            ₹{Number(item.total_guest_payment || 0).toLocaleString()}
          </p>
        </div>
        <Button
          variant="ghost"
          size="icon"
          className="text-gray-500 hover:text-red-600"
          disabled={isRemoving}
          onClick={() => onRemove(item.id)}
          aria-label="Remove item"
        >
          <Trash2 className="w-4 h-4" />
        </Button>
      </div>
    </div>
  );
}

export default CartItemRow;

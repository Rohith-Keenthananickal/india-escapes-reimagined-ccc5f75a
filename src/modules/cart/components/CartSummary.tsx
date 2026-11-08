import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { Loader2 } from 'lucide-react';
import type { CartData } from '../types/cart.types';

interface CartSummaryProps {
  cart: CartData;
  onCheckout: () => void;
  isCheckingOut?: boolean;
}

export function CartSummary({ cart, onCheckout, isCheckingOut }: CartSummaryProps) {
  const hasUnavailable = cart.items.some((item) => !item.is_available);
  const isEmpty = cart.items.length === 0;

  return (
    <div className="sticky top-24 rounded-2xl border border-gray-200 bg-white p-6 shadow-sm space-y-4">
      <h2 className="text-lg font-bold text-gray-900">Trip summary</h2>
      <div className="space-y-2 text-sm text-gray-600">
        <div className="flex justify-between">
          <span>{cart.items.length} item{cart.items.length === 1 ? '' : 's'}</span>
          <span>₹{Number(cart.total_guest_payment || 0).toLocaleString()}</span>
        </div>
      </div>
      <Separator />
      <div className="flex justify-between items-baseline">
        <span className="font-semibold text-gray-900">Total</span>
        <span className="text-2xl font-extrabold text-[#1A8491]">
          ₹{Number(cart.total_guest_payment || 0).toLocaleString()}
        </span>
      </div>
      {hasUnavailable && (
        <p className="text-xs text-red-600">
          Some items are unavailable. Remove or update them before checkout.
        </p>
      )}
      <Button
        className="w-full py-6 text-base font-bold bg-[#2BB0BB] hover:bg-[#1A8491] text-[#1F1F1F] hover:text-white rounded-xl"
        disabled={isEmpty || hasUnavailable || isCheckingOut}
        onClick={onCheckout}
      >
        {isCheckingOut ? (
          <>
            <Loader2 className="w-4 h-4 mr-2 animate-spin" /> Preparing payment…
          </>
        ) : (
          'Continue to checkout'
        )}
      </Button>
    </div>
  );
}

export default CartSummary;

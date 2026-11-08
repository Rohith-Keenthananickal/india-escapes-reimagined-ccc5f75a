import { useMutation, useQueryClient } from '@tanstack/react-query';
import { paymentsService } from '../services/paymentsService';
import type { PaymentVerifyRequest } from '../types/payments.types';
import { TRIPS_QUERY_KEY } from '@/modules/bookings/hooks/useTrips';
import { CART_QUERY_KEY } from '@/modules/cart/hooks/useCart';

/**
 * Thin verify mutation. PaymentReturnPage owns UX for success/pending/failed —
 * no global destructive toast here.
 */
export function usePaymentVerify() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: PaymentVerifyRequest) => paymentsService.verify(payload),
    onSuccess: (data) => {
      const pay = String(data.payment_status || '').toUpperCase();
      const top = String(data.status || '').toLowerCase();
      if (top === 'success' || pay === 'SUCCESS' || pay === 'PAID') {
        queryClient.invalidateQueries({ queryKey: TRIPS_QUERY_KEY });
        queryClient.invalidateQueries({ queryKey: CART_QUERY_KEY });
      }
    },
  });
}

export default usePaymentVerify;

import { useMutation, useQueryClient } from '@tanstack/react-query';
import { bookingsService } from '../services/bookingsService';
import type { BookingCancelRequest } from '../types/bookings.types';
import { toast } from '@/hooks/use-toast';
import { ApiError } from '@/services/apiClient';
import { TRIPS_QUERY_KEY } from './useTrips';

function errorMessage(err: unknown): string {
  if (err instanceof ApiError) {
    if (typeof err.data?.detail === 'string') return err.data.detail;
    return err.message;
  }
  if (err instanceof Error) return err.message;
  return 'Something went wrong';
}

export function useBookingMutations() {
  const queryClient = useQueryClient();

  const cancelBooking = useMutation({
    mutationFn: ({
      bookingId,
      payload,
    }: {
      bookingId: number;
      payload: BookingCancelRequest;
    }) => bookingsService.cancelBooking(bookingId, payload),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: TRIPS_QUERY_KEY });
      toast({
        title: 'Booking cancelled',
        description:
          data.refund_amount > 0
            ? `Refund initiated: ₹${data.refund_amount.toLocaleString()} (${Math.round(data.refund_rate * 100)}%)`
            : 'No refund applicable for this cancellation window.',
      });
    },
    onError: (err) => {
      toast({ title: 'Cancel failed', description: errorMessage(err), variant: 'destructive' });
    },
  });

  const cancelExperience = useMutation({
    mutationFn: ({
      bookingId,
      payload,
    }: {
      bookingId: number;
      payload: BookingCancelRequest;
    }) => bookingsService.cancelExperienceBooking(bookingId, payload),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: TRIPS_QUERY_KEY });
      toast({
        title: 'Experience cancelled',
        description:
          data.refund_amount > 0
            ? `Refund: ₹${data.refund_amount.toLocaleString()}`
            : 'No refund for this window.',
      });
    },
    onError: (err) => {
      toast({ title: 'Cancel failed', description: errorMessage(err), variant: 'destructive' });
    },
  });

  return { cancelBooking, cancelExperience };
}

export default useBookingMutations;

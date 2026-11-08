import { useQuery } from '@tanstack/react-query';
import { bookingsService } from '../services/bookingsService';
import type { AvailabilityCheckRequest, PriceQuoteRequest } from '../types/bookings.types';

export function useQuoteQuery(payload: PriceQuoteRequest | null, enabled = true) {
  return useQuery({
    queryKey: ['pricing-quote', payload],
    queryFn: () => bookingsService.getQuote(payload!),
    enabled: enabled && !!payload?.property_id && !!payload?.check_in_date && !!payload?.check_out_date,
    staleTime: 30_000,
    retry: 1,
  });
}

export function useAvailabilityQuery(payload: AvailabilityCheckRequest | null, enabled = true) {
  return useQuery({
    queryKey: ['availability', payload],
    queryFn: () => bookingsService.checkAvailability(payload!),
    enabled: enabled && !!payload?.property_id && !!payload?.check_in_date && !!payload?.check_out_date,
    staleTime: 15_000,
    retry: 1,
  });
}

export default useQuoteQuery;

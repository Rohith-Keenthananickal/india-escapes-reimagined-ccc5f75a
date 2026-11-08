import { useQuery } from '@tanstack/react-query';
import { cartService } from '@/modules/cart/services/cartService';
import { useAuth } from '@/modules/auth';

export const TRIPS_QUERY_KEY = ['trips'] as const;

export function useTripsQuery() {
  const { isAuthenticated } = useAuth();

  return useQuery({
    queryKey: TRIPS_QUERY_KEY,
    queryFn: () => cartService.listOrders(),
    enabled: isAuthenticated,
    staleTime: 60_000,
  });
}

export function useTripDetailQuery(orderId: number | undefined) {
  const { isAuthenticated } = useAuth();

  return useQuery({
    queryKey: [...TRIPS_QUERY_KEY, orderId],
    queryFn: () => cartService.getOrder(orderId!),
    enabled: isAuthenticated && !!orderId,
  });
}

export default useTripsQuery;

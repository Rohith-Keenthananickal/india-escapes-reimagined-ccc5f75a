import { useQuery } from '@tanstack/react-query';
import { cartService } from '../services/cartService';
import { useAuth } from '@/modules/auth';

export const CART_QUERY_KEY = ['cart'] as const;

export function useCartQuery(enabled = true) {
  const { isAuthenticated } = useAuth();

  return useQuery({
    queryKey: CART_QUERY_KEY,
    queryFn: () => cartService.getCart(),
    enabled: enabled && isAuthenticated,
    staleTime: 30_000,
  });
}

export function useCartItemCount() {
  const { data } = useCartQuery();
  return data?.items?.length ?? 0;
}

export default useCartQuery;

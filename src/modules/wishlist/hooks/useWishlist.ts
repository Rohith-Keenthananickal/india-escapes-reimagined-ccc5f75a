import { useQuery } from '@tanstack/react-query';
import { useAuth } from '@/modules/auth';
import { wishlistService } from '../services/wishlistService';

export const WISHLIST_QUERY_KEY = ['wishlist'] as const;
export const WISHLIST_IDS_QUERY_KEY = ['wishlist', 'ids'] as const;

export function useWishlistQuery() {
  const { isAuthenticated } = useAuth();

  return useQuery({
    queryKey: WISHLIST_QUERY_KEY,
    queryFn: () => wishlistService.list(),
    enabled: isAuthenticated,
    staleTime: 60_000,
  });
}

export function useWishlistIdsQuery() {
  const { isAuthenticated } = useAuth();

  return useQuery({
    queryKey: WISHLIST_IDS_QUERY_KEY,
    queryFn: () => wishlistService.listIds(),
    enabled: isAuthenticated,
    staleTime: 60_000,
  });
}

export default useWishlistQuery;

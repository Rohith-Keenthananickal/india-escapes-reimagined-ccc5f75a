import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from '@/hooks/use-toast';
import { ApiError } from '@/services/apiClient';
import { wishlistService } from '../services/wishlistService';
import type { WishlistItemCreate, WishlistItemUpdate } from '../types/wishlist.types';
import { WISHLIST_IDS_QUERY_KEY, WISHLIST_QUERY_KEY } from './useWishlist';

function errorMessage(err: unknown): string {
  if (err instanceof ApiError) {
    if (typeof err.data?.detail === 'string') return err.data.detail;
    if (typeof err.message === 'string') return err.message;
  }
  if (err instanceof Error) return err.message;
  return 'Something went wrong';
}

export function useWishlistMutations() {
  const queryClient = useQueryClient();

  const invalidateWishlist = () => {
    void queryClient.invalidateQueries({ queryKey: WISHLIST_QUERY_KEY });
    void queryClient.invalidateQueries({ queryKey: WISHLIST_IDS_QUERY_KEY });
  };

  const addItem = useMutation({
    mutationFn: (payload: WishlistItemCreate) => wishlistService.add(payload),
    onSuccess: (item) => {
      queryClient.setQueryData<number[]>(WISHLIST_IDS_QUERY_KEY, (prev) => {
        const ids = prev ?? [];
        if (ids.includes(item.property_id)) return ids;
        return [item.property_id, ...ids];
      });
      invalidateWishlist();
      toast({ title: 'Saved to wishlist' });
    },
    onError: (err) => {
      const msg = errorMessage(err);
      const isDuplicate =
        (err instanceof ApiError && err.status === 409) ||
        /already in wishlist/i.test(msg);
      toast({
        title: isDuplicate ? 'Already saved' : 'Could not save',
        description: msg,
        variant: 'destructive',
      });
    },
  });

  const removeItem = useMutation({
    mutationFn: (propertyId: number) => wishlistService.remove(propertyId),
    onSuccess: (_data, propertyId) => {
      queryClient.setQueryData<number[]>(WISHLIST_IDS_QUERY_KEY, (prev) =>
        (prev ?? []).filter((id) => id !== propertyId)
      );
      invalidateWishlist();
      toast({ title: 'Removed from wishlist' });
    },
    onError: (err) => {
      toast({
        title: 'Could not remove',
        description: errorMessage(err),
        variant: 'destructive',
      });
    },
  });

  const updateItem = useMutation({
    mutationFn: ({
      propertyId,
      payload,
    }: {
      propertyId: number;
      payload: WishlistItemUpdate;
    }) => wishlistService.update(propertyId, payload),
    onSuccess: () => {
      invalidateWishlist();
      toast({ title: 'Wishlist updated' });
    },
    onError: (err) => {
      toast({
        title: 'Update failed',
        description: errorMessage(err),
        variant: 'destructive',
      });
    },
  });

  const clearWishlist = useMutation({
    mutationFn: () => wishlistService.clear(),
    onSuccess: () => {
      queryClient.setQueryData(WISHLIST_IDS_QUERY_KEY, []);
      invalidateWishlist();
      toast({ title: 'Wishlist cleared' });
    },
    onError: (err) => {
      toast({
        title: 'Could not clear wishlist',
        description: errorMessage(err),
        variant: 'destructive',
      });
    },
  });

  const toggleItem = async (propertyId: number, isLiked: boolean) => {
    if (isLiked) {
      await removeItem.mutateAsync(propertyId);
      return;
    }
    await addItem.mutateAsync({ property_id: propertyId });
  };

  return {
    addItem,
    removeItem,
    updateItem,
    clearWishlist,
    toggleItem,
    isToggling: addItem.isPending || removeItem.isPending,
  };
}

export default useWishlistMutations;

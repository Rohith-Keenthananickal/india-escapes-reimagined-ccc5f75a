import { useMutation, useQueryClient } from '@tanstack/react-query';
import { cartService } from '../services/cartService';
import { CART_QUERY_KEY } from './useCart';
import type {
  CartCheckoutRequest,
  CartItemCreate,
  CartItemUpdate,
  TripOrderCancelRequest,
} from '../types/cart.types';
import { toast } from '@/hooks/use-toast';
import { ApiError } from '@/services/apiClient';
import { TRIPS_QUERY_KEY } from '@/modules/bookings/hooks/useTrips';

function errorMessage(err: unknown): string {
  if (err instanceof ApiError) {
    if (typeof err.data?.detail === 'string') return err.data.detail;
    if (typeof err.message === 'string') return err.message;
  }
  if (err instanceof Error) return err.message;
  return 'Something went wrong';
}

export function useCartMutations() {
  const queryClient = useQueryClient();

  const invalidateCart = () => queryClient.invalidateQueries({ queryKey: CART_QUERY_KEY });

  const addItem = useMutation({
    mutationFn: (payload: CartItemCreate) => cartService.addItem(payload),
    onSuccess: (data) => {
      queryClient.setQueryData(CART_QUERY_KEY, data);
      void queryClient.invalidateQueries({ queryKey: CART_QUERY_KEY });
      toast({ title: 'Added to trip', description: 'Item saved to your cart.' });
    },
    onError: (err) => {
      const msg = errorMessage(err);
      const isDuplicate =
        (err instanceof ApiError && err.status === 409) ||
        /already in your cart/i.test(msg);
      toast({
        title: isDuplicate ? 'Already in cart' : 'Could not add item',
        description: msg,
        variant: 'destructive',
      });
    },
  });

  const updateItem = useMutation({
    mutationFn: ({ itemId, payload }: { itemId: number; payload: CartItemUpdate }) =>
      cartService.updateItem(itemId, payload),
    onSuccess: (data) => {
      queryClient.setQueryData(CART_QUERY_KEY, data);
      void queryClient.invalidateQueries({ queryKey: CART_QUERY_KEY });
    },
    onError: (err) => {
      toast({ title: 'Update failed', description: errorMessage(err), variant: 'destructive' });
    },
  });

  const removeItem = useMutation({
    mutationFn: (itemId: number) => cartService.removeItem(itemId),
    onSuccess: (data) => {
      queryClient.setQueryData(CART_QUERY_KEY, data);
      void queryClient.invalidateQueries({ queryKey: CART_QUERY_KEY });
      toast({ title: 'Removed from trip' });
    },
    onError: (err) => {
      toast({ title: 'Remove failed', description: errorMessage(err), variant: 'destructive' });
    },
  });

  const clearCart = useMutation({
    mutationFn: () => cartService.clearCart(),
    onSuccess: (data) => {
      queryClient.setQueryData(CART_QUERY_KEY, data);
      void queryClient.invalidateQueries({ queryKey: CART_QUERY_KEY });
    },
  });

  const checkout = useMutation({
    mutationFn: (payload: CartCheckoutRequest) => cartService.checkout(payload),
    onSuccess: () => {
      invalidateCart();
    },
    onError: (err) => {
      toast({ title: 'Checkout failed', description: errorMessage(err), variant: 'destructive' });
    },
  });

  const cancelOrder = useMutation({
    mutationFn: ({
      orderId,
      payload,
    }: {
      orderId: number;
      payload: TripOrderCancelRequest;
    }) => cartService.cancelOrder(orderId, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: TRIPS_QUERY_KEY });
      toast({ title: 'Cancellation processed' });
    },
    onError: (err) => {
      toast({ title: 'Cancel failed', description: errorMessage(err), variant: 'destructive' });
    },
  });

  return { addItem, updateItem, removeItem, clearCart, checkout, cancelOrder, invalidateCart };
}

export default useCartMutations;

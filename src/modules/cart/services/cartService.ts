import apiClient from '@/services/apiClient';
import type {
  ApiResponse,
  CartCheckoutData,
  CartCheckoutRequest,
  CartData,
  CartItemCreate,
  CartItemUpdate,
  TripOrder,
  TripOrderCancelRequest,
} from '../types/cart.types';

export const cartService = {
  async getCart(): Promise<CartData> {
    const res = await apiClient.get<ApiResponse<CartData>>('/api/v1/cart/');
    return res.data;
  },

  async addItem(payload: CartItemCreate): Promise<CartData> {
    const res = await apiClient.post<ApiResponse<CartData>>('/api/v1/cart/items', payload);
    return res.data;
  },

  async updateItem(itemId: number, payload: CartItemUpdate): Promise<CartData> {
    const res = await apiClient.patch<ApiResponse<CartData>>(
      `/api/v1/cart/items/${itemId}`,
      payload
    );
    return res.data;
  },

  async removeItem(itemId: number): Promise<CartData> {
    const res = await apiClient.delete<ApiResponse<CartData>>(`/api/v1/cart/items/${itemId}`);
    return res.data;
  },

  async clearCart(): Promise<CartData> {
    const res = await apiClient.delete<ApiResponse<CartData>>('/api/v1/cart/');
    return res.data;
  },

  async checkout(payload: CartCheckoutRequest): Promise<CartCheckoutData> {
    const res = await apiClient.post<ApiResponse<CartCheckoutData>>(
      '/api/v1/cart/checkout',
      { provider: 'CASHFREE', ...payload }
    );
    return res.data;
  },

  async listOrders(skip = 0, limit = 50): Promise<TripOrder[]> {
    const res = await apiClient.get<ApiResponse<TripOrder[]>>('/api/v1/cart/orders', {
      params: { skip, limit },
    });
    return res.data;
  },

  async getOrder(orderId: number): Promise<TripOrder> {
    const res = await apiClient.get<ApiResponse<TripOrder>>(`/api/v1/cart/orders/${orderId}`);
    return res.data;
  },

  async cancelOrder(
    orderId: number,
    payload: TripOrderCancelRequest
  ): Promise<{ order: TripOrder; total_refund_amount: number }> {
    const res = await apiClient.post<{
      status: string;
      data: { order: TripOrder; total_refund_amount: number };
      message?: string;
    }>(`/api/v1/cart/orders/${orderId}/cancel`, payload);
    return res.data;
  },
};

export default cartService;

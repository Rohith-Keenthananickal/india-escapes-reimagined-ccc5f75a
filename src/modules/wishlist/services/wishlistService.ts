import apiClient from '@/services/apiClient';
import type {
  ApiResponse,
  WishlistItem,
  WishlistItemCreate,
  WishlistItemUpdate,
} from '../types/wishlist.types';

export const wishlistService = {
  async list(): Promise<WishlistItem[]> {
    const res = await apiClient.get<ApiResponse<WishlistItem[]>>('/api/v1/wishlist/');
    return res.data;
  },

  async listIds(): Promise<number[]> {
    const res = await apiClient.get<ApiResponse<number[]>>('/api/v1/wishlist/ids');
    return res.data;
  },

  async add(payload: WishlistItemCreate): Promise<WishlistItem> {
    const res = await apiClient.post<ApiResponse<WishlistItem>>('/api/v1/wishlist/items', payload);
    return res.data;
  },

  async get(propertyId: number): Promise<WishlistItem> {
    const res = await apiClient.get<ApiResponse<WishlistItem>>(
      `/api/v1/wishlist/items/${propertyId}`
    );
    return res.data;
  },

  async update(propertyId: number, payload: WishlistItemUpdate): Promise<WishlistItem> {
    const res = await apiClient.patch<ApiResponse<WishlistItem>>(
      `/api/v1/wishlist/items/${propertyId}`,
      payload
    );
    return res.data;
  },

  async remove(propertyId: number): Promise<void> {
    await apiClient.delete<ApiResponse<{ property_id: number }>>(
      `/api/v1/wishlist/items/${propertyId}`
    );
  },

  async clear(): Promise<{ deleted: number }> {
    const res = await apiClient.delete<ApiResponse<{ deleted: number }>>('/api/v1/wishlist/');
    return res.data;
  },
};

export default wishlistService;

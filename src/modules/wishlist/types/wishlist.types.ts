export interface WishlistPropertySummary {
  id: number;
  property_name?: string | null;
  cover_image?: string | null;
  location_address?: string | null;
  price?: number | null;
}

export interface WishlistItem {
  id: number;
  property_id: number;
  notes?: string | null;
  created_at?: string | null;
  updated_at?: string | null;
  property: WishlistPropertySummary;
}

export interface WishlistItemCreate {
  property_id: number;
  notes?: string | null;
}

export interface WishlistItemUpdate {
  notes?: string | null;
}

export interface ApiResponse<T> {
  status: string;
  data: T;
  message?: string;
}

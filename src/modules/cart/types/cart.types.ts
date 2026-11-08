export type CartItemType = 'STAY_ROOM' | 'STAY_WHOLE_PROPERTY' | 'EXPERIENCE';
export type CartStatus = 'ACTIVE' | 'CHECKED_OUT' | 'ABANDONED';
export type TripOrderStatus =
  | 'PENDING_PAYMENT'
  | 'CONFIRMED'
  | 'PARTIALLY_CANCELLED'
  | 'CANCELLED'
  | 'REFUNDED'
  | 'FAILED';

export interface BookingRoomSelection {
  room_id: number;
  quantity: number;
}

export interface CartItemCreate {
  item_type: CartItemType;
  property_id?: number;
  rooms?: BookingRoomSelection[];
  check_in_date?: string;
  check_out_date?: string;
  experience_id?: number;
  experience_date?: string;
  guest_count: number;
  special_requests?: string;
}

export interface CartItemUpdate {
  rooms?: BookingRoomSelection[];
  check_in_date?: string;
  check_out_date?: string;
  experience_date?: string;
  guest_count?: number;
  special_requests?: string;
}

export interface CartItemPriced {
  id: number;
  item_type: CartItemType;
  property_id?: number | null;
  experience_id?: number | null;
  rooms?: BookingRoomSelection[] | null;
  check_in_date?: string | null;
  check_out_date?: string | null;
  experience_date?: string | null;
  guest_count: number;
  special_requests?: string | null;
  total_guest_payment: number;
  host_payout_amount: number;
  atp_commission_amount: number;
  platform_net_amount: number;
  pricing?: Record<string, unknown> | null;
  is_available: boolean;
  availability_message?: string | null;
}

export interface CartData {
  id: number;
  user_id: number;
  status: CartStatus;
  items: CartItemPriced[];
  total_guest_payment: number;
  currency: string;
  created_at: string;
  updated_at: string;
}

export interface CartCheckoutRequest {
  provider?: 'CASHFREE' | 'MOCK';
  guest_name?: string;
  guest_email?: string;
  guest_phone?: string;
}

export interface CartCheckoutData {
  trip_order_id: number;
  order_reference: string;
  total_guest_payment: number;
  currency: string;
  transaction_id: string;
  provider: string;
  provider_order_id?: string | null;
  payment_session_id?: string | null;
  cf_order_id?: string | null;
  key_id?: string | null;
  environment?: string | null;
  hold_expires_at?: string | null;
}

export interface TripOrderItem {
  id: number;
  item_type: CartItemType;
  property_id?: number | null;
  experience_id?: number | null;
  booking_id?: number | null;
  experience_booking_id?: number | null;
  check_in_date?: string | null;
  check_out_date?: string | null;
  experience_date?: string | null;
  guest_count: number;
  total_guest_payment: number;
  host_payout_amount: number;
  atp_commission_amount: number;
  platform_net_amount: number;
  status: string;
}

export interface TripOrder {
  id: number;
  order_reference: string;
  guest_id: number;
  status: TripOrderStatus;
  total_guest_payment: number;
  currency: string;
  payment_transaction_id?: string | null;
  hold_expires_at?: string | null;
  items: TripOrderItem[];
  created_at: string;
  updated_at: string;
}

export interface TripOrderCancelRequest {
  reason?: string;
  item_ids?: number[];
}

export interface ApiResponse<T> {
  status: string;
  data: T;
  message?: string;
}

export type BookingType = 'ROOM' | 'WHOLE_PROPERTY';
export type BookingStatus =
  | 'PENDING_PAYMENT'
  | 'CONFIRMED'
  | 'CHECKED_IN'
  | 'CHECKED_OUT'
  | 'CANCELLED'
  | 'REFUNDED';

export interface BookingRoomSelection {
  room_id: number;
  quantity: number;
}

export interface PriceQuoteRequest {
  property_id: number;
  room_id?: number;
  rooms?: BookingRoomSelection[];
  booking_type?: BookingType;
  check_in_date: string;
  check_out_date: string;
  guest_count: number;
  transaction_category?: 'DOMESTIC' | 'INTERNATIONAL';
}

export interface PriceQuote {
  property_id: number;
  nights_count: number;
  base_accommodation_amount: number;
  accommodation_gst_amount: number;
  total_guest_platform_fee: number;
  total_guest_payment: number;
  host_payout_amount: number;
  [key: string]: unknown;
}

export interface AvailabilityCheckRequest {
  property_id: number;
  room_id?: number;
  rooms?: BookingRoomSelection[];
  booking_type?: BookingType;
  check_in_date: string;
  check_out_date: string;
  exclude_booking_id?: number;
}

export interface AvailabilityCheck {
  is_available: boolean;
  message?: string | null;
  hold_minutes: number;
  blocked_by_host: boolean;
  blocked_by_whole_property: boolean;
}

export interface BookingCancelRequest {
  reason?: string;
}

export interface BookingSummary {
  id: number;
  booking_reference: string;
  property_id: number;
  room_id?: number | null;
  guest_id: number;
  booking_type: BookingType;
  check_in_date: string;
  check_out_date: string;
  number_of_nights: number;
  guest_count: number;
  status: BookingStatus;
  total_guest_payment?: number | null;
  host_payout_amount?: number | null;
  created_at: string;
}

export interface BookingDetail extends BookingSummary {
  host_id: number;
  atp_id?: number | null;
  guest_name?: string | null;
  guest_email?: string | null;
  guest_phone?: string | null;
  special_requests?: string | null;
  hold_expires_at?: string | null;
  cancelled_at?: string | null;
  cancellation_reason?: string | null;
  financial_snapshot?: Record<string, unknown> | null;
  trip_order_id?: number | null;
}

export interface CancelResult {
  booking: BookingDetail;
  refund_rate: number;
  refund_amount: number;
}

export interface ApiResponse<T> {
  status: string;
  data: T;
  message?: string;
}

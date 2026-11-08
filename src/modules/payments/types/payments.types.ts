export interface PaymentVerifyRequest {
  transaction_id: string;
  booking_id?: number;
  trip_order_id?: number;
  provider_order_id?: string;
  provider_payment_id?: string;
  payment_method?: string;
}

export interface PaymentVerifyData {
  status: string;
  message: string;
  booking_id?: number | null;
  booking_reference?: string | null;
  trip_order_id?: number | null;
  order_reference?: string | null;
  payment_status: string;
  transaction_id: string;
  amount_paid: number;
  host_payout_amount?: number;
  verified_at: string;
}

export interface PaymentTransaction {
  id: number;
  transaction_id: string;
  amount: number;
  currency: string;
  provider: string;
  provider_order_id?: string | null;
  provider_payment_id?: string | null;
  payment_status: string;
  payment_method?: string | null;
  created_at: string;
}

export interface ApiResponse<T> {
  status: string;
  data: T;
  message?: string;
}

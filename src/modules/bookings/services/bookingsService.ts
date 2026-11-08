import apiClient from '@/services/apiClient';
import type {
  ApiResponse,
  AvailabilityCheck,
  AvailabilityCheckRequest,
  BookingCancelRequest,
  BookingDetail,
  BookingSummary,
  CancelResult,
  PriceQuote,
  PriceQuoteRequest,
} from '../types/bookings.types';

export const bookingsService = {
  async getQuote(payload: PriceQuoteRequest): Promise<PriceQuote> {
    const res = await apiClient.post<ApiResponse<PriceQuote>>(
      '/api/v1/pricing/quote',
      payload
    );
    return res.data;
  },

  async checkAvailability(payload: AvailabilityCheckRequest): Promise<AvailabilityCheck> {
    const res = await apiClient.post<ApiResponse<AvailabilityCheck>>(
      '/api/v1/bookings/check-availability',
      payload
    );
    return res.data;
  },

  async listBookings(params?: {
    property_id?: number;
    booking_status?: string;
    skip?: number;
    limit?: number;
  }): Promise<BookingSummary[]> {
    const res = await apiClient.get<ApiResponse<BookingSummary[]>>('/api/v1/bookings/', {
      params,
    });
    return res.data;
  },

  async getBooking(bookingId: number): Promise<BookingDetail> {
    const res = await apiClient.get<ApiResponse<BookingDetail>>(
      `/api/v1/bookings/${bookingId}`
    );
    return res.data;
  },

  async cancelBooking(
    bookingId: number,
    payload: BookingCancelRequest
  ): Promise<CancelResult> {
    const res = await apiClient.post<{
      status: string;
      data: CancelResult;
      message?: string;
    }>(`/api/v1/bookings/${bookingId}/cancel`, payload);
    return res.data;
  },

  async cancelExperienceBooking(
    bookingId: number,
    payload: BookingCancelRequest
  ): Promise<{ booking: unknown; refund_rate: number; refund_amount: number }> {
    const res = await apiClient.post<{
      status: string;
      data: { booking: unknown; refund_rate: number; refund_amount: number };
    }>(`/api/v1/experience-bookings/${bookingId}/cancel`, payload);
    return res.data;
  },
};

export default bookingsService;

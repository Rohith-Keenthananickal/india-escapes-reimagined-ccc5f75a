import apiClient from '@/services/apiClient';
import type {
  ApiResponse,
  PaymentTransaction,
  PaymentVerifyData,
  PaymentVerifyRequest,
} from '../types/payments.types';

export const paymentsService = {
  async verify(payload: PaymentVerifyRequest): Promise<PaymentVerifyData> {
    const res = await apiClient.post<ApiResponse<PaymentVerifyData>>(
      '/api/v1/payments/verify',
      payload
    );
    return res.data;
  },

  async getTransaction(transactionId: string): Promise<PaymentTransaction> {
    const res = await apiClient.get<ApiResponse<PaymentTransaction>>(
      `/api/v1/payments/${transactionId}`
    );
    return res.data;
  },
};

export default paymentsService;

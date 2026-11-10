/**
 * Authentication Service for TriphavenCo
 * Integrates with Heaven Connect FastAPI endpoints.
 */

import apiClient from '@/services/apiClient';
import type {
  AuthResponse,
  UserProfile,
  GoogleLoginPayload,
  EmailLoginPayload,
  MobileOTPLoginPayload,
  RegisterPayload,
  EmailOTPPurpose,
  EmailOTPLoginSendPayload,
  EmailOTPLoginVerifyPayload,
  EmailOtpResponse,
  EmailOtpVerifyResponse,
  PasswordResetPayload,
  ApiResponse,
} from '../types/auth.types';

export const authService = {
  /**
   * Register a new user and receive authentication token
   */
  async register(payload: RegisterPayload): Promise<AuthResponse> {
    const response = await apiClient.post<ApiResponse<AuthResponse>>(
      '/api/v1/auth/register',
      { ...payload, portal: payload.portal ?? 'GUEST', user_type: 'GUEST' }
    );
    return response.data;
  },

  /**
   * Authenticate with email and password
   */
  async loginWithEmail(payload: EmailLoginPayload): Promise<AuthResponse> {
    const response = await apiClient.post<ApiResponse<AuthResponse>>(
      '/api/v1/auth/login/email',
      { ...payload, portal: payload.portal ?? 'GUEST' }
    );
    return response.data;
  },

  /**
   * Send OTP for passwordless email login
   */
  async sendEmailLoginOtp(email: string): Promise<EmailOtpResponse> {
    const payload: EmailOTPLoginSendPayload = {
      email: email.trim().toLowerCase(),
      portal: 'GUEST',
    };
    return apiClient.post<EmailOtpResponse>('/api/v1/auth/login/email-otp/send', payload);
  },

  /**
   * Verify OTP and create a guest-portal session
   */
  async loginWithEmailOtp(email: string, otpCode: string): Promise<AuthResponse> {
    const payload: EmailOTPLoginVerifyPayload = {
      email: email.trim().toLowerCase(),
      otp_code: otpCode.trim(),
      portal: 'GUEST',
    };
    const response = await apiClient.post<ApiResponse<AuthResponse>>(
      '/api/v1/auth/login/email-otp/verify',
      payload
    );
    return response.data;
  },

  /**
   * Authenticate with mobile number and SMS OTP
   */
  async loginWithMobile(phoneNumber: string, otp: string): Promise<AuthResponse> {
    const payload: MobileOTPLoginPayload = {
      phone_number: phoneNumber,
      otp,
      portal: 'GUEST',
    };
    const response = await apiClient.post<ApiResponse<AuthResponse>>(
      '/api/v1/auth/login/mobile',
      payload
    );
    return response.data;
  },

  /**
   * Authenticate or register using a verified Google ID token
   */
  async loginWithGoogle(idToken: string): Promise<AuthResponse> {
    const payload: GoogleLoginPayload = { id_token: idToken, portal: 'GUEST' };
    const response = await apiClient.post<ApiResponse<AuthResponse>>(
      '/api/v1/auth/login/google',
      payload
    );
    return response.data;
  },

  /**
   * Fetch current user profile using JWT session token
   */
  async getCurrentUser(token?: string): Promise<UserProfile> {
    const options = token ? { headers: { Authorization: `Bearer ${token}` } } : undefined;
    const response = await apiClient.get<ApiResponse<UserProfile>>(
      '/api/v1/auth/me',
      options
    );
    return response.data;
  },

  /**
   * Terminate user session
   */
  async logout(): Promise<void> {
    try {
      await apiClient.post('/api/v1/auth/logout');
    } catch {
      // Ignore network errors during logout
    }
  },

  /**
   * Send Email OTP for registration, verification, or reset
   */
  async sendEmailOtp(
    email: string,
    purpose: EmailOTPPurpose = 'EMAIL_VERIFICATION'
  ): Promise<EmailOtpResponse> {
    return apiClient.post<EmailOtpResponse>('/api/v1/auth/send-email-otp', {
      email,
      purpose,
    });
  },

  /**
   * Verify Email OTP
   */
  async verifyEmailOtp(
    email: string,
    otpCode: string,
    purpose: EmailOTPPurpose = 'EMAIL_VERIFICATION'
  ): Promise<EmailOtpVerifyResponse> {
    return apiClient.post<EmailOtpVerifyResponse>('/api/v1/auth/verify-email-otp', {
      email,
      otp_code: otpCode,
      purpose,
    });
  },

  /**
   * Resend Email OTP
   */
  async resendEmailOtp(
    email: string,
    purpose: EmailOTPPurpose = 'EMAIL_VERIFICATION'
  ): Promise<EmailOtpResponse> {
    return apiClient.post<EmailOtpResponse>('/api/v1/auth/resend-email-otp', {
      email,
      purpose,
    });
  },

  /**
   * Reset Password after OTP verification
   */
  async resetPassword(payload: PasswordResetPayload): Promise<{ status: string; message: string }> {
    return apiClient.post('/api/v1/auth/reset-password/update', payload);
  },

  /**
   * Update User Phone Number (for WhatsApp alerts post Google Signup)
   */
  async updateUserPhone(
    userId: number,
    phoneNumber: string,
    countryCode: string = '+91'
  ): Promise<UserProfile> {
    const response = await apiClient.put<ApiResponse<UserProfile>>(`/api/v1/users/${userId}`, {
      phone_number: phoneNumber,
      country_code: countryCode,
    });
    return response.data;
  },
};

export default authService;



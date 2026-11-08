/**
 * TriphavenCo Authentication Types
 * Data models, request/response structures, and user profiles matching backend OpenAPI.
 */

export type UserRole = 'GUEST' | 'HOST' | 'AREA_COORDINATOR' | 'ADMIN';
export type AuthProviderType = 'EMAIL' | 'GOOGLE' | 'MOBILE';
export type UserStatusType = 'ACTIVE' | 'BLOCKED' | 'DELETED';

export type EmailOTPPurpose =
  | 'CONFIRMATION'
  | 'PASSWORD_RESET'
  | 'WELCOME'
  | 'USER_REGISTRATION'
  | 'EMAIL_VERIFICATION'
  | 'PASSWORD_CHANGED';

export interface GuestProfile {
  id?: number;
  passport_number?: string | null;
  nationality?: string | null;
  preferences?: Record<string, unknown> | null;
}

export interface UserProfile {
  id: number;
  email: string;
  full_name: string;
  profile_image?: string | null;
  user_type: UserRole;
  auth_provider: AuthProviderType;
  email_verified: boolean;
  phone_number?: string | null;
  country_code?: string | null;
  phone_verified?: boolean;
  status?: UserStatusType;
  guest_profile?: GuestProfile | null;
  created_at?: string;
  updated_at?: string;
}

export interface TokenResponse {
  access_token: string;
  token_type: string;
  expires_in: number;
  user: UserProfile;
}

export type AuthResponse = TokenResponse;

export interface GoogleLoginPayload {
  id_token: string;
}

export interface EmailLoginPayload {
  email: string;
  password?: string;
  remember_me?: boolean;
}

export interface MobileOTPLoginPayload {
  phone_number: string;
  otp: string;
}

export interface RegisterPayload {
  email: string;
  password: string;
  full_name: string;
  phone_number?: string;
  country_code?: string;
  user_type?: 'GUEST' | 'HOST';
  nationality?: string;
  passport_number?: string;
  agree_marketing?: boolean;
}

export interface SignUpPayload {
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  countryCode?: string;
  password?: string;
  confirmPassword?: string;
  userType?: 'GUEST' | 'HOST';
  nationality?: string;
  agreeToTerms?: boolean;
  agreeToMarketing?: boolean;
}

export interface EmailOTPRequestPayload {
  email: string;
  purpose: EmailOTPPurpose;
}

export interface EmailOTPVerifyPayload {
  email: string;
  otp_code: string;
  purpose?: EmailOTPPurpose;
}

export interface EmailOtpResponse {
  message: string;
  email: string;
  expires_in_minutes: number;
}

export interface EmailOtpVerifyResponse {
  status: string;
  message: string;
  data: {
    email: string;
    email_verified: boolean;
  };
}

export interface PasswordResetPayload {
  email: string;
  new_password: string;
  confirm_password: string;
}

export interface ApiResponse<T> {
  status: string;
  message: string;
  data: T;
}


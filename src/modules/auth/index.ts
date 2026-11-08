/**
 * TriphavenCo Auth Module
 * Central entry point for all authentication pages, components, hooks, services, and types.
 */

// Pages
export * from './pages/LoginPage';
export * from './pages/SignUpPage';
export * from './pages/ForgotPasswordPage';
export * from './pages/EmailVerificationPage';

// Components
export * from './components/GoogleAuthButton';
export * from './components/GoogleOneTap';

// Context & State
export * from './context/AuthContext';

// Hooks
export * from './hooks/useAuth';
export * from './hooks/useGoogleOneTap';

// Services
export * from './services/authService';

// Config
export * from './config/google';

// Types
export * from './types/auth.types';

// Default export
export { default } from './pages/LoginPage';

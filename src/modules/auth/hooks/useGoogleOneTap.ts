import { useEffect, useRef } from 'react';
import { useLocation } from 'react-router-dom';
import { useAuth } from './useAuth';
import { toast } from '@/hooks/use-toast';
import { GOOGLE_CLIENT_ID } from '../config/google';

const ONETAP_DISMISSED_KEY = 'triphaven_onetap_dismissed';

const EXCLUDED_ROUTES = [
  '/login',
  '/signup',
  '/forgot-password',
  '/email-verification',
  '/account_deletion',
  '/host',
];

export const useGoogleOneTap = () => {
  const { isAuthenticated, isLoading, loginWithGoogle } = useAuth();
  const location = useLocation();
  const isPromptingRef = useRef<boolean>(false);
  const isSubmittingRef = useRef<boolean>(false);

  useEffect(() => {
    if (!GOOGLE_CLIENT_ID) {
      return;
    }

    // 1. Do not prompt if auth is still verifying or user is already logged in
    if (isLoading || isAuthenticated) {
      return;
    }

    // 2. Check route exclusion
    const isExcluded = EXCLUDED_ROUTES.some((route) => location.pathname.startsWith(route));
    if (isExcluded) {
      return;
    }

    // 3. Check if user already dismissed One Tap in this session
    if (sessionStorage.getItem(ONETAP_DISMISSED_KEY) === 'true') {
      return;
    }

    // 4. Prevent duplicate prompts while active
    if (isPromptingRef.current) {
      return;
    }

    let pollInterval: NodeJS.Timeout;

    const setupOneTap = () => {
      if (typeof window === 'undefined' || !window.google?.accounts?.id) {
        return false;
      }

      isPromptingRef.current = true;

      window.google.accounts.id.initialize({
        client_id: GOOGLE_CLIENT_ID,
        callback: async (response: { credential: string }) => {
          if (!response.credential || isSubmittingRef.current) return;
          isSubmittingRef.current = true;

          try {
            const user = await loginWithGoogle(response.credential);
            toast({
              title: "Welcome to TriphavenCo!",
              description: `Signed in as ${user.full_name || user.email}`,
            });
          } catch (error: unknown) {
            console.error('Google One Tap Sign-In Error:', error);
            const errMessage = error instanceof Error ? error.message : "Failed to sign in with Google.";
            toast({
              title: "Sign in failed",
              description: errMessage,
              variant: "destructive",
            });
          } finally {
            isSubmittingRef.current = false;
          }
        },
        auto_select: false,
        cancel_on_tap_outside: true,
        use_fedcm_for_prompt: true,
        context: 'signin',
      });

      window.google.accounts.id.prompt((notification) => {
        if (notification.isNotDisplayed()) {
          // Handled silently
        } else if (notification.isSkippedMoment()) {
          sessionStorage.setItem(ONETAP_DISMISSED_KEY, 'true');
          isPromptingRef.current = false;
        } else if (notification.isDismissedMoment()) {
          sessionStorage.setItem(ONETAP_DISMISSED_KEY, 'true');
          isPromptingRef.current = false;
        }
      });

      return true;
    };

    if (!setupOneTap()) {
      pollInterval = setInterval(() => {
        if (setupOneTap()) {
          clearInterval(pollInterval);
        }
      }, 500);
    }

    return () => {
      if (pollInterval) clearInterval(pollInterval);
    };
  }, [isAuthenticated, isLoading, location.pathname, loginWithGoogle]);
};

export default useGoogleOneTap;

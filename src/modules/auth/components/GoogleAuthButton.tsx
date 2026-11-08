import React, { useEffect, useRef, useState, useCallback } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { toast } from '@/hooks/use-toast';
import { Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { UserProfile } from '../types/auth.types';
import { GOOGLE_CLIENT_ID } from '../config/google';

export interface GoogleAuthButtonProps {
  mode?: 'signin' | 'signup';
  className?: string;
  onSuccess?: () => void;
  onSuccessWithUser?: (user: UserProfile) => void;
}

export const GoogleAuthButton: React.FC<GoogleAuthButtonProps> = ({
  mode = 'signin',
  className = '',
  onSuccess,
  onSuccessWithUser,
}) => {
  const buttonContainerRef = useRef<HTMLDivElement>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [gisLoaded, setGisLoaded] = useState(false);
  const { loginWithGoogle } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const handleCredentialResponse = useCallback(
    async (response: { credential: string }) => {
      if (!response.credential) {
        toast({
          title: "Authentication failed",
          description: "No Google credential received.",
          variant: "destructive",
        });
        return;
      }

      setIsProcessing(true);
      try {
        const user = await loginWithGoogle(response.credential);
        toast({
          title: mode === 'signup' ? "Account created!" : "Welcome back!",
          description: `Signed in as ${user.full_name || user.email}`,
        });

        if (onSuccessWithUser) {
          onSuccessWithUser(user);
        } else if (onSuccess) {
          onSuccess();
        } else {
          // Redirect to originating route if available, otherwise root
          const locationState = location.state as { from?: { pathname?: string } } | null;
          const redirectPath = locationState?.from?.pathname || '/';
          navigate(redirectPath, { replace: true });
        }
      } catch (error: unknown) {

        console.error('Google Auth Error:', error);
        const errMessage = error instanceof Error ? error.message : "Failed to authenticate with Google.";
        toast({
          title: "Sign in failed",
          description: errMessage,
          variant: "destructive",
        });
      } finally {
        setIsProcessing(false);
      }
    },
    [loginWithGoogle, location.state, mode, navigate, onSuccess]
  );

  useEffect(() => {
    if (!GOOGLE_CLIENT_ID) {
      return;
    }

    let checkInterval: NodeJS.Timeout;

    const initializeAndRender = () => {
      if (typeof window !== 'undefined' && window.google?.accounts?.id && buttonContainerRef.current) {
        setGisLoaded(true);

        window.google.accounts.id.initialize({
          client_id: GOOGLE_CLIENT_ID,
          callback: handleCredentialResponse,
          auto_select: false,
          cancel_on_tap_outside: true,
          context: mode === 'signup' ? 'signup' : 'signin',
        });

        // Clear existing children in container before rendering to prevent duplicate buttons on re-render
        if (buttonContainerRef.current) {
          buttonContainerRef.current.innerHTML = '';
          window.google.accounts.id.renderButton(buttonContainerRef.current, {
            type: 'standard',
            theme: 'outline',
            size: 'large',
            text: mode === 'signup' ? 'signup_with' : 'signin_with',
            shape: 'rectangular',
            logo_alignment: 'left',
            width: '100%',
          });
        }
        return true;
      }
      return false;
    };

    if (!initializeAndRender()) {
      // If script is still downloading, poll for up to 3 seconds
      checkInterval = setInterval(() => {
        if (initializeAndRender()) {
          clearInterval(checkInterval);
        }
      }, 200);
    }

    return () => {
      if (checkInterval) clearInterval(checkInterval);
    };
  }, [handleCredentialResponse, mode]);

  return (
    <div className={`relative w-full ${className}`}>
      {/* Container for official Google Identity Services button */}
      <div
        ref={buttonContainerRef}
        className={`w-full min-h-[44px] flex items-center justify-center transition-opacity ${
          isProcessing ? 'opacity-40 pointer-events-none' : 'opacity-100'
        }`}
      />

      {/* Fallback button if GIS script is loading or blocked by ad-blockers */}
      {!gisLoaded && !isProcessing && (
        <Button
          type="button"
          variant="outline"
          disabled={true}
          className="w-full flex items-center justify-center space-x-2 border-gray-300 py-2.5 rounded-lg text-sm font-medium"
        >
          <img
            src="https://developers.google.com/identity/images/g-logo.png"
            alt="Google"
            className="w-4 h-4 mr-2"
          />
          <span>{mode === 'signup' ? 'Sign up with Google' : 'Sign in with Google'}</span>
        </Button>
      )}

      {/* Loading overlay */}
      {isProcessing && (
        <div className="absolute inset-0 flex items-center justify-center bg-white/80 rounded-lg">
          <Loader2 className="w-5 h-5 animate-spin text-[#1A8491] mr-2" />
          <span className="text-xs font-semibold text-gray-700">Verifying with Google...</span>
        </div>
      )}
    </div>
  );
};

export default GoogleAuthButton;

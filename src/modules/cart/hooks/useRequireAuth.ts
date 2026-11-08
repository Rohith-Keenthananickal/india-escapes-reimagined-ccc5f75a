import { useCallback } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/modules/auth';

/**
 * Ensures the guest is logged in before cart/checkout actions.
 * Redirects to /login?returnUrl=... when unauthenticated.
 */
export function useRequireAuth() {
  const { isAuthenticated, user } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const requireAuth = useCallback(
    (returnPath?: string): boolean => {
      if (isAuthenticated) return true;
      const returnUrl = returnPath || `${location.pathname}${location.search}`;
      navigate(`/login?returnUrl=${encodeURIComponent(returnUrl)}`);
      return false;
    },
    [isAuthenticated, navigate, location.pathname, location.search]
  );

  return { isAuthenticated, user, requireAuth };
}

export default useRequireAuth;

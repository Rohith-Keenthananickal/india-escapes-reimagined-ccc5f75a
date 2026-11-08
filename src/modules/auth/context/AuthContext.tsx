import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { authService } from '../services/authService';
import type { UserProfile, AuthResponse } from '../types/auth.types';
import { toast } from '@/hooks/use-toast';

export interface AuthContextType {
  user: UserProfile | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  loginWithGoogle: (credential: string) => Promise<UserProfile>;
  loginWithEmail: (payload: { email: string; password?: string; remember_me?: boolean }) => Promise<UserProfile>;
  loginWithMobile: (phoneNumber: string, otp: string) => Promise<UserProfile>;
  register: (payload: import('../types/auth.types').RegisterPayload) => Promise<UserProfile>;
  logout: () => void;
  setSession: (authData: AuthResponse) => void;
}

export const AuthContext = createContext<AuthContextType | undefined>(undefined);

const TOKEN_KEY = 'triphaven_token';
const USER_KEY = 'triphaven_user';

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<UserProfile | null>(() => {
    try {
      const savedUser = localStorage.getItem(USER_KEY);
      return savedUser ? JSON.parse(savedUser) : null;
    } catch {
      return null;
    }
  });
  const [token, setToken] = useState<string | null>(() => {
    return typeof window !== 'undefined' ? localStorage.getItem(TOKEN_KEY) : null;
  });
  const [isLoading, setIsLoading] = useState<boolean>(true);

  // Validate existing session on application boot
  useEffect(() => {
    let isMounted = true;

    const restoreSession = async () => {
      const savedToken = localStorage.getItem(TOKEN_KEY);
      if (!savedToken) {
        if (isMounted) setIsLoading(false);
        return;
      }

      try {
        const currentUser = await authService.getCurrentUser(savedToken);
        if (isMounted) {
          setUser(currentUser);
          localStorage.setItem(USER_KEY, JSON.stringify(currentUser));
        }
      } catch (error) {
        console.warn('TriphavenCo: Session expired or invalid, clearing local auth state.');
        if (isMounted) {
          setToken(null);
          setUser(null);
          localStorage.removeItem(TOKEN_KEY);
          localStorage.removeItem(USER_KEY);
        }
      } finally {
        if (isMounted) setIsLoading(false);
      }
    };

    restoreSession();

    return () => {
      isMounted = false;
    };
  }, []);

  const setSession = useCallback((authData: AuthResponse) => {
    setToken(authData.access_token);
    setUser(authData.user);
    localStorage.setItem(TOKEN_KEY, authData.access_token);
    localStorage.setItem(USER_KEY, JSON.stringify(authData.user));
  }, []);

  const loginWithGoogle = useCallback(async (credential: string): Promise<UserProfile> => {
    setIsLoading(true);
    try {
      const authData = await authService.loginWithGoogle(credential);
      setSession(authData);
      return authData.user;
    } finally {
      setIsLoading(false);
    }
  }, [setSession]);

  const loginWithEmail = useCallback(async (payload: { email: string; password?: string; remember_me?: boolean }): Promise<UserProfile> => {
    setIsLoading(true);
    try {
      const authData = await authService.loginWithEmail(payload);
      setSession(authData);
      return authData.user;
    } finally {
      setIsLoading(false);
    }
  }, [setSession]);

  const loginWithMobile = useCallback(async (phoneNumber: string, otp: string): Promise<UserProfile> => {
    setIsLoading(true);
    try {
      const authData = await authService.loginWithMobile(phoneNumber, otp);
      setSession(authData);
      return authData.user;
    } finally {
      setIsLoading(false);
    }
  }, [setSession]);

  const register = useCallback(async (payload: import('../types/auth.types').RegisterPayload): Promise<UserProfile> => {
    setIsLoading(true);
    try {
      const authData = await authService.register(payload);
      setSession(authData);
      return authData.user;
    } finally {
      setIsLoading(false);
    }
  }, [setSession]);

  const logout = useCallback(() => {
    setToken(null);
    setUser(null);
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(USER_KEY);

    // Disable Google One Tap auto-selection so user is not automatically signed back in
    if (typeof window !== 'undefined' && window.google?.accounts?.id?.disableAutoSelect) {
      window.google.accounts.id.disableAutoSelect();
    }

    // Terminate session on backend
    authService.logout();

    toast({
      title: "Signed out",
      description: "You have been safely signed out of TriphavenCo.",
    });
  }, []);

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        isAuthenticated: !!token && !!user,
        isLoading,
        loginWithGoogle,
        loginWithEmail,
        loginWithMobile,
        register,
        logout,
        setSession,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};


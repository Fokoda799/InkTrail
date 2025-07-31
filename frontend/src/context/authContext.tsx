// context/AuthContext.tsx
import React, { createContext, useEffect, useState } from 'react';
import { User, SignUpData } from '../types/userTypes';
import { signUp, logOut, signIn, verifyEmailToken, resendVerificationCode, linkWithGoogle } from '../api/authApi';

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean; // Renamed from isCheckingAuth for clarity
  isVerified: boolean; // Indicates if the user has verified their email
  register: (userData: SignUpData) => Promise<void>;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  verifyEmail: (token: string) => Promise<void>;
  resendVerificationEmail: (email: string) => Promise<void>;
  oAuth: () => Promise<void>;
}

export const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true); // Start with true to check auth status
  const [isVerified, setIsVerified] = useState(false);

  useEffect(() => {
    const checkAuthStatus = async () => {
      setIsLoading(true);
      try {
        const storedUser = localStorage.getItem('authUser');
        if (storedUser) {
          const parsedUser = JSON.parse(storedUser);
          // Add token verification here if needed
          setUser(parsedUser);
          setIsVerified(parsedUser.isVerified || false);
        }
      } catch (error) {
        console.error('Error checking auth status:', error);
        localStorage.removeItem('authUser');
        setUser(null);
      } finally {
        setIsLoading(false);
      }
    };

    checkAuthStatus();
  }, []);

  const register = async (userData: SignUpData) => {
    setIsLoading(true);
    try {
      const res = await signUp(userData);
      setUser(res.user);
      setIsVerified(res.user.isVerified || false);
      localStorage.setItem('authUser', JSON.stringify(res.user));
    } catch (error) {
      console.error('Registration error:', error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const login = async (email: string, password: string) => {
    setIsLoading(true);
    try {
      const res = await signIn(email, password);
      setUser(res.user);
      setIsVerified(res.user.isVerified || false);
      localStorage.setItem('authUser', JSON.stringify(res.user));
    } catch (error) {
      console.error('Login error:', error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = async () => {
    setIsLoading(true);
    try {
      await logOut();
      setUser(null);
      localStorage.removeItem('authUser');
    } catch (error) {
      console.error('Logout error:', error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const verifyEmail = async (token: string) => {
    setIsLoading(true);
    try {
      const res = await verifyEmailToken(token);
      setUser(res.user);
      setIsVerified(res.user.isVerified || false);
      localStorage.setItem('authUser', JSON.stringify(res.user));
    } catch (error) {
      console.error('Email verification error:', error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const resendVerificationEmail = async (email: string) => {
    try {
      await resendVerificationCode(email);
    } catch (error) {
      console.error('Resend verification error:', error);
      throw error;
    }
  };

  const oAuth = async () => {
    setIsLoading(true);
    try {
      const res = await linkWithGoogle();
      setUser(res.user);
      setIsVerified(res.user.isVerified || false);
      localStorage.setItem('authUser', JSON.stringify(res.user));
    } catch (error) {
      console.error('OAuth error:', error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const value: AuthContextType = {
    user,
    isAuthenticated: !!user,
    isLoading,
    isVerified,
    register,
    login,
    logout,
    verifyEmail,
    resendVerificationEmail,
    oAuth
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
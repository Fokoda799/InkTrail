// context/AuthContext.tsx
import React, { createContext, useEffect, useState } from 'react';
import { User, SignUpData } from '../types/userTypes';
import {
  signUp,
  logOut,
  signIn,
  verifyEmailToken,
  resendVerificationCode,
  linkWithGoogle,
  getUser as fetchUser,
  getMe,
  updatePassword as updatePasswordApi,
  deleteAccount as deleteAccountApi
} from '../api/authApi';
import { useNavigate } from 'react-router-dom';

interface AuthContextType {
  user: User | null;
  setUser: React.Dispatch<React.SetStateAction<User | null>>;
  isAuthenticated: boolean;
  isLoading: boolean;
  isVerified: boolean;
  register: (userData: SignUpData) => Promise<void>;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  verifyEmail: (token: string) => Promise<void>;
  resendVerificationEmail: (email: string) => Promise<void>;
  oAuth: () => Promise<void>;
  getUser: (username: string) => Promise<User | null>;
  updatePassword: (currentPassword: string | undefined, newPassword: string) => Promise<User | null>;
  deleteAccount: () => Promise<void>;
}

export const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isVerified, setIsVerified] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const token = localStorage.getItem('token');
  const navigate = useNavigate();

  // Helper to store user
  const storeUser = (user: User | null) => {
    if (user) {
      localStorage.setItem('authUser', JSON.stringify(user));
    } else {
      localStorage.removeItem('authUser');
    }
    setUser(user);
    setIsAuthenticated(!!user);
    setIsVerified(user?.isVerified || false);
  };

  useEffect(() => {
    const checkAuthStatus = async () => {
      setIsLoading(true);
      try {
        const currentUser = await getMe();
        if (currentUser) {
          storeUser(currentUser);
        }
      } catch (error) {
        console.error('Error checking auth status:', error);
        storeUser(null);
        navigate('/welcome', { replace: true });
      } finally {
        setIsLoading(false);
      }
    };
    if (!token) {
      storeUser(null);
      setIsLoading(false);
      return;
  }
    checkAuthStatus();
  }, []); // ✅ No unnecessary dependencies

  const register = async (userData: SignUpData) => {
    try {
      const res = await signUp(userData);
      localStorage.setItem('token', res.token);
      storeUser(res.user);
    } catch (error) {
      console.error('Registration error:', error);
      throw error;
    }
  };

  const login = async (email: string, password: string) => {
    try {
      const res = await signIn(email, password);
      storeUser(res.user);
    } catch (error) {
      console.error('Login error:', error);
      throw error;
    }
  };

  const logout = async () => {
    setIsLoading(true);
    try {
      await logOut();
      storeUser(null);
      navigate('/welcome', { replace: true }); // ✅ Redirect on logout
    } catch (error) {
      console.error('Logout error:', error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const verifyEmail = async (token: string) => {
    try {
      const res = await verifyEmailToken(token);
      storeUser(res.user);
    } catch (error) {
      console.error('Email verification error:', error);
      throw error;
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
    try {
      const res = await linkWithGoogle();
      storeUser(res.user);
    } catch (error) {
      console.error('OAuth error:', error);
      throw error;
    }
  };

  const handleUpdatePassword = async (currentPassword: string | undefined, newPassword: string) => {
    try {
      const updatedUser = await updatePasswordApi(currentPassword, newPassword);
      storeUser(updatedUser);
      return updatedUser;
    } catch (error) {
      console.error('Update password error:', error);
      throw error;
    }
  };

  const handleDeleteAccount = async () => {
    try {
      await deleteAccountApi();
      storeUser(null);
      navigate('/welcome', { replace: true });
    } catch (error) {
      console.error('Delete account error:', error);
      throw error;
    }
  };

  const value: AuthContextType = {
    user,
    setUser,
    isAuthenticated,
    isLoading,
    isVerified,
    register,
    login,
    logout,
    verifyEmail,
    resendVerificationEmail,
    oAuth,
    getUser: fetchUser,
    updatePassword: handleUpdatePassword,
    deleteAccount: handleDeleteAccount
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

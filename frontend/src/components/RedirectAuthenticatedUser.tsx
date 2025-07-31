// components/RedirectAuthenticatedUser.tsx
import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import LoadingSpinner from './LoadingSpinner';

export const RedirectAuthenticatedUser = () => {
  const { isAuthenticated, isLoading } = useAuth();

  if (isLoading) {
    return <LoadingSpinner />;
  }

  return isAuthenticated ? <Navigate to="/" replace /> : <Outlet />;
};
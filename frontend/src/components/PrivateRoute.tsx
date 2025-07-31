// components/PrivateRoute.tsx
import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import LoadingSpinner from './LoadingSpinner';// Your loading spinner component

export const PrivateRoute = () => {
  const { isAuthenticated, isLoading, isVerified } = useAuth();

  if (isLoading) {
    return <LoadingSpinner />;
  }

  if (!isAuthenticated) {
    return <Navigate to="/signin" replace />;
  }

  return <Outlet />;
};
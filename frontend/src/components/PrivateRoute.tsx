import {useAppSelector} from '../redux/hooks'
import { selectUserState } from '../redux/reducers/userReducer'
import { Outlet, Navigate } from 'react-router-dom'
import LoadingSpinner from './LoadingSpinner';

const PrivateRoute = () => {
  const { isAuthenticated, user, isCheckingAuth } = useAppSelector(selectUserState);

  if (isCheckingAuth) {
    return <LoadingSpinner />
  }

  if (!isAuthenticated) {
    return <Navigate to='/login' replace />;
  }

  if (!user?.isVerified) {
    return <Navigate to='/verify-email' replace />;
  }

  return <Outlet />;
};

export default PrivateRoute
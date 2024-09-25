import { Navigate, Outlet } from 'react-router-dom';
import { useAppSelector } from '../redux/hooks';
import { selectUserState } from '../redux/reducers/userReducer';


const RedirectAuthenticatedUser = () => {
	const { isAuthenticated, user } = useAppSelector(selectUserState);

	if (isAuthenticated && user?.isVerified) {
		return <Navigate to='/' replace />;
	}

	return <Outlet />;
};

export default RedirectAuthenticatedUser;
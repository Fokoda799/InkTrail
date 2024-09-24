import {useSelector} from 'react-redux'
import { selectUserState } from '../redux/reducers/userReducer'
import { Outlet, Navigate } from 'react-router-dom'

function PrivetRoute() {
  const { me, isVerified } = useSelector(selectUserState);
  return me && isVerified ? <Outlet /> : <Navigate to="/signin" />;
}

export default PrivetRoute
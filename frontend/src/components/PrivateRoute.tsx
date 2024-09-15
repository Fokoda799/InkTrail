import {useSelector} from 'react-redux'
import { selectUserState } from '../redux/reducers/userReducer'
import { Outlet, Navigate } from 'react-router-dom'

function PrivetRoute() {
  const { currentUser } = useSelector(selectUserState);
  return currentUser ? <Outlet /> : <Navigate to="/signin" />;
}

export default PrivetRoute
import {useSelector} from 'react-redux'
import { selectUserState } from '../redux/reducers/userReducer'
import { Outlet, Navigate } from 'react-router-dom'

function PrivetRoute() {
  const { me } = useSelector(selectUserState);
  return me ? <Outlet /> : <Navigate to="/signin" />;
}

export default PrivetRoute
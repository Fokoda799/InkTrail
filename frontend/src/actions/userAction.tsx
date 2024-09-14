import axios from 'axios';
import { FormData } from '../types/userTypes';
import { AuthResponse, ErrorResponse } from '../types/userTypes';
import { useSelector, useDispatch } from 'react-redux';
import { 
  signUpSuccess, signInSuccess,
  signUpFailure, signInFailure,
  signInStart, signUpStart,
  signOutSuccess
} from '../redux/reducers/userReducer';
import { selectUser, selectUserError, selectUserLoading } from '../redux/reducers/userReducer';

const useAuthActions = () => {
  const user = useSelector(selectUser);
  const error = useSelector(selectUserError);
  const loading = useSelector(selectUserLoading);
  const dispatch = useDispatch();

  const signUp = async (provider: string, formData: FormData): Promise<boolean> => {
    if (provider === 'credentials') {
      dispatch(signUpStart()); // Set loading state
      try {
        const response = await axios.post<AuthResponse | ErrorResponse>('/api/v1/user/sign-up', formData);
        const res = response.data;

        if (res.success) {
          dispatch(signUpSuccess(res.user));  // Dispatch success
          return true;
        } else {
          console.error('Sign up failed: ', res.message);
          dispatch(signUpFailure(res.message || 'Sign-up failed'));  // Dispatch failure
          return false;
        }
      } catch (error) {
        if (axios.isAxiosError(error)) {
          console.error('Error during sign-up:', error.response?.data || error.message);
          dispatch(signUpFailure(error.response?.data.message || error.message));
        } else {
          console.error('Unexpected error:', error);
          dispatch(signUpFailure('Unexpected error occurred'));
        }
        return false;
      }
    }
    return false; // If the provider isn't 'credentials', return false
  };

  const signIn = async (provider: string, formData?: FormData): Promise<boolean> => {
    if (provider === 'credentials') {
      dispatch(signInStart()); // Set loading state
      try {
        const encoded = btoa(`${formData?.email}:${formData?.password}`);
        const headers = { Authorization: `Basic ${encoded}` };

        const response = await axios.get<AuthResponse | ErrorResponse>('/api/v1/user/sign-in', { headers });
        const res = response.data;

        if (res.success) {
          dispatch(signInSuccess(res.user));  // Dispatch success
          return true;
        } else {
          console.error('Sign in failed: ', res.message);
          dispatch(signInFailure(res.message || 'Sign-in failed'));  // Dispatch failure
          return false;
        }
      } catch (error) {
        if (axios.isAxiosError(error)) {
          console.error('Error during sign-in:', error.response?.data || error.message);
          dispatch(signInFailure(error.response?.data.message || error.message));
        } else {
          console.error('Unexpected error:', error);
          dispatch(signInFailure('Unexpected error occurred'));
        }
        return false;
      }
    } else {
      alert(`Signing in with ${provider}`);
      return false;
    }
  };

  const signOut = async () => {
    try {
      // Placeholder for sign-out logic
      await axios.get('/api/v1/user/logout');
      dispatch(signOutSuccess());
    } catch (error) {
      console.error('Error during sign-out:', error)
    }
  }

  return { user, error, loading, signUp, signIn, signOut };
};

export { useAuthActions };

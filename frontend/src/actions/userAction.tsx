import axios from 'axios';
import { FormData } from '../types/userTypes';
import { AuthResponse, ErrorResponse } from '../types/userTypes';
import { useSelector, useDispatch } from 'react-redux';
import { GoogleAuthProvider, getAuth, signInWithPopup } from 'firebase/auth';
import { app } from '../firebase';
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
          dispatch(signUpFailure(error.response?.data.message || 'Sign-up failed'));
        } else {
          console.error('Unexpected error:', error);
          dispatch(signUpFailure('Unexpected error occurred'));
        }
        return false;
      }
    }
    console.error('Unsupported provider for sign-up:', provider);
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
          dispatch(signInFailure(error.response?.data.message || 'Sign-in failed'));
        } else {
          console.error('Unexpected error:', error);
          dispatch(signInFailure('Unexpected error occurred'));
        }
        return false;
      }
    } else if (provider === 'google') {
      const provider = new GoogleAuthProvider();
      const auth = getAuth(app);
      try {
        const result = await signInWithPopup(auth, provider);
        const data = {
          username: result.user.displayName,
          email: result.user.email,
          avatar: result.user.photoURL
        };

        const response = await axios.post<AuthResponse | ErrorResponse>('/api/v1/user/google', data);
        const res = response.data;

        if (res.success) {
          dispatch(signInSuccess(res.user));  // Dispatch success
          return true;
        } else {
          console.error('Google sign-in failed: ', res.message);
          dispatch(signInFailure(res.message || 'Google sign-in failed'));  // Dispatch failure
          return false;
        }
      } catch (error) {
        if (error instanceof Error) {
          console.error('Error during Google sign-in:', error.message);
        } else {
          console.error('Unexpected error:', error);
        }
        dispatch(signInFailure('Google sign-in failed'));
        return false;
      }
    } else {
      console.error('Unsupported provider:', provider);
      return false;
    }
  };

  const signOut = async () => {
    try {
      // Placeholder for sign-out logic
      await axios.get('/api/v1/user/logout');
      dispatch(signOutSuccess());
    } catch (error) {
      if (axios.isAxiosError(error)) {
        console.error('Error during sign-out:', error.response?.data || error.message);
      } else {
        console.error('Unexpected error:', error);
      }
    }
  };

  return { user, error, loading, signUp, signIn, signOut };
};

export { useAuthActions };

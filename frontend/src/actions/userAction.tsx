import type { AppDispatch } from '../redux/store';
import type { AuthResponse } from '../types/userTypes';
import { GoogleAuthProvider, getAuth, signInWithPopup } from 'firebase/auth';
import { app } from '../firebase';
import {
  setLoading,
  setError,
  setSignup,
  setSignin,
  setSignout,
  setVerifyEmail,
  isCheckingAuth,
  setCheckAuth,
  notAuthenticated,
  setUpdateUser,
  setUpdatePassword,
  setDeleteUser,
} from '../redux/reducers/userReducer';
import axios from 'axios';
import { SignUpData, UpdateData } from '../types/userTypes';
import { clearBlogs } from '../redux/reducers/blogReducer';

// Auth API URL
const apiUrlAuth = '/api/v1/auth/';
const apiUrlUser = '/api/v1/user/';

// Sign In User
export const signIn = (email: string, password: string) => async (dispatch: AppDispatch) => {
  // Set loading to true
  dispatch(setLoading());

  try {

    // Make a GET request to the server
    const { data }: { data: AuthResponse } = await axios.post(`${apiUrlAuth}sign-in`, {
      email, password
    });
    dispatch(setSignin(data.user));

  } catch (error: unknown) {
    const message = axios.isAxiosError(error) ? error.response?.data.message : String(error);
    dispatch(setError(message));
  }
};

// Register User
export const signUp = (signUpData: SignUpData) => async (dispatch: AppDispatch) => {
  dispatch(setLoading());

  try {
    // Make a POST request to the server
    const { data }: { data: AuthResponse } = await axios.post(`${apiUrlAuth}sign-up`, signUpData);
    dispatch(setSignup(data.user));

  } catch (error: unknown) {
    const message = axios.isAxiosError(error) ? error.response?.data.message : String(error);
    dispatch(setError(message));
  }
};

// Sign In with Google
export const signInWithGoogle = () => async (dispatch: AppDispatch) => {
  dispatch(setLoading());

  try {
    const provider = new GoogleAuthProvider();
    const auth = getAuth(app);
    const result = await signInWithPopup(auth, provider);
    const config = { headers: { "Content-Type": 'application/json' } };

    const username = result.user.email?.split('@')[0];
    const signInData = {
      username,
      email: result.user.email,
      avatar: result.user.photoURL,
    };

    const { data }: { data: AuthResponse } = await axios.post(`${apiUrlAuth}google`, signInData, config);
    dispatch(setSignin(data.user));

  } catch (error: unknown) {
    const message = axios.isAxiosError(error) ? error.response?.data.message : String(error);
    dispatch(setError(message));
  }
};

// Logout User
export const logout = () => async (dispatch: AppDispatch) => {
  dispatch(setLoading());

  try {
    await axios.get(`${apiUrlAuth}logout`);
    dispatch(setSignout());
    dispatch(clearBlogs());

  } catch (error: unknown) {
    const message = axios.isAxiosError(error) ? error.response?.data.message : String(error);
    dispatch(setError(message));
  }
};

// Verify Email
export const verifyEmail = (code: string) => async (dispatch: AppDispatch) => {
  dispatch(setLoading());

  try {
    const { data }: { data: AuthResponse } = await axios.post(`${apiUrlAuth}verify-email`, { code });
    dispatch(setVerifyEmail(data.user));

  } catch (error: unknown) {
    const message = axios.isAxiosError(error) ? error.response?.data.message : String(error);
    dispatch(setError(message));
  }
};

// Check if user is authenticated
export const checkAuth = () => async (dispatch: AppDispatch) => {
  dispatch(isCheckingAuth());

  try {
    const { data }: { data: AuthResponse } = await axios.get(`${apiUrlAuth}check-auth`);
    dispatch(setCheckAuth(data.user));

  } catch (error: unknown) {
    const message = axios.isAxiosError(error) ? error.response?.data.message : String(error);
    dispatch(setError(message));
    dispatch(notAuthenticated());
  }
};


// Update User Profile
export const updateUser = (updateData: UpdateData) => async (dispatch: AppDispatch) => {
  dispatch(setLoading());  

  try {

    const { data }: { data: AuthResponse } = await axios.put(`${apiUrlUser}me`, updateData);
    dispatch(setUpdateUser(data.user));
  } catch (error: unknown) {
    const message = axios.isAxiosError(error) ? error.response?.data.message : String(error);
    dispatch(setError(message)); // Corrected the dispatch here
  }
}

// Update user Password
export const updatePassword = (newPassword: string, currentPassword?: string) => async (dispatch: AppDispatch) => {
  dispatch(setLoading());

  try {
    
    const { data }: { data: AuthResponse } = await axios.put(
      `${apiUrlUser}me/update-password`,
      { currentPassword, newPassword }
    );
    dispatch(setUpdatePassword(data.user));

  } catch (error) {
    const message = axios.isAxiosError(error) ? error.response?.data.message : String(error);
    dispatch(setError(message));
  }
}

// Delete user account
export const deleteUser = () => async (dispatch: AppDispatch) => {
  dispatch(setLoading());

  try {
    await axios.delete(`${apiUrlUser}me`);
    dispatch(setDeleteUser());

    // Remove token from local storage
    localStorage.removeItem('token');
    localStorage.removeItem('persist:root');

    // Clear blogs
    dispatch(clearBlogs());
  } catch (error) {
    const message = axios.isAxiosError(error) ? error.response?.data.message : String(error);
    dispatch(setError(message));
  }
}
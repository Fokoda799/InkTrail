import type { AppDispatch } from '../redux/store';
import type { AuthResponse, ErrorResponse } from '../types/userTypes';
import { GoogleAuthProvider, getAuth, signInWithPopup } from 'firebase/auth';
import { app } from '../firebase';
import {
  signInFailure, signInSuccess, signInStart,
  signUpFailure, signUpSuccess, signUpStart,
  signOutStart, signOutSuccess, signOutFailure,
  updateUserStart, updateUserSuccess, updateUserFailure,
  updatePasswordStart, updatePasswordFailure, updatePasswordSuccess,
  forgotPasswordStart, forgotPasswordSuccess, forgotPasswordFailure,
  resetPasswordStart, resetPasswordSuccess, resetPasswordFailure,
  loadUserStart,
  loadUserSuccess,
  loadUserFailure
} from '../redux/reducers/userReducer';
import axios from 'axios';
import { SignInData, SignUpData, UpdateData } from '../types/userTypes';
import { clearBlogs } from '../redux/reducers/blogReducer';

// Sign In User
export const signIn = ({ email, password }: SignInData) => async (dispatch: AppDispatch) => {
  try {
    dispatch(signInStart());

    const encoded = btoa(`${email}:${password}`);
    const config = { headers: { Authorization: `Basic ${encoded}` } };

    const { data }: { data: AuthResponse | ErrorResponse } = await axios.get(`/api/v1/auth/sign-in`, config);

    if (!data.success) {
      console.log('Error:', data.message);
      dispatch(signInFailure(data.message));
      return;
    }

    dispatch(signInSuccess(data.user));
  } catch (error: unknown) {
    const message = axios.isAxiosError(error) ? error.response?.data.message : String(error);
    console.log('Error:', message);
    dispatch(signInFailure(message));
  }
};

// Register User
export const signUp = (signUpData: SignUpData) => async (dispatch: AppDispatch) => {
  try {
    dispatch(signUpStart());
    
    const { data }: { data: AuthResponse | ErrorResponse } = await axios.post(`/api/v1/auth/sign-up`, signUpData);

    if (!data.success) {
      console.log('Error:', data.message);
      dispatch(signUpFailure(data.message));
      return;
    }

    dispatch(signUpSuccess(data.user));
  } catch (error: unknown) {
    const message = axios.isAxiosError(error) ? error.response?.data.message : String(error);
    console.log('Error:', message);
    dispatch(signUpFailure(message));
  }
};

export const loadUser = () => async (dispatch: AppDispatch) => {
  try {
    dispatch(loadUserStart());

    const { data }: { data: AuthResponse | ErrorResponse } = await axios.get('/api/v1/user/me');

    if (!data.success) {
      console.log('Error:', data.message);
      dispatch(loadUserFailure(data.message));
      return;
    }

    dispatch(loadUserSuccess(data.user));
  } catch (error: unknown) {
    const message = axios.isAxiosError(error) ? error.response?.data.message : String(error);
    console.log('Error:', message);
    dispatch(loadUserFailure(message));
  }
}

// Sign In with Google
export const signInWithGoogle = () => async (dispatch: AppDispatch) => {
  try {
    dispatch(signInStart());
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

    console.log(result.user);
    console.log(signInData);

    const { data }: { data: AuthResponse | ErrorResponse } = await axios.post(`/api/v1/auth/google`, signInData, config);

    if (!data.success) {
      dispatch(signInFailure(data.message));
      return;
    }

    dispatch(signInSuccess(data.user));
  } catch (error: unknown) {
    const message = axios.isAxiosError(error) ? error.response?.data.message : String(error);
    console.log('Error: ', message);
    dispatch(signInFailure(message));
  }
};

// Logout User
// src/actions/userActions.ts
export const logout = () => async (dispatch: AppDispatch) => {
  try {
    dispatch(signOutStart());
    await axios.get(`/api/v1/auth/logout`); // Optional API call to log out the user on the server side

    dispatch(signOutSuccess());
    dispatch(clearBlogs());
  } catch (error: unknown) {
    const message = axios.isAxiosError(error) ? error.response?.data.message : String(error);
    console.log('Error:', message);
    dispatch(signOutFailure(message));
  }
};


// Update User Profile
export const updateUser = (updateData: UpdateData) => async (dispatch: AppDispatch) => {
  try {
    dispatch(updateUserStart());

    const { data }: { data: AuthResponse | ErrorResponse } = await axios.put('/api/v1/user/me', updateData);

    if (!data.success) {
      console.log(data.message);
      dispatch(updateUserFailure(data.message));
      return;
    }

    dispatch(updateUserSuccess(data.user));
  } catch (error: unknown) {
    const message = axios.isAxiosError(error) ? error.response?.data.message : String(error);
    console.log('Error:', message);
    dispatch(updateUserFailure(message)); // Corrected the dispatch here
  }
}

export const updatePassword = (newPassword: string, currentPassword?: string) => async (dispatch: AppDispatch) => {
  try {
    dispatch(updatePasswordStart());
    
    const { data }: { data: AuthResponse | ErrorResponse} = await axios.put(
      '/api/v1/me/update-password',
      { currentPassword, newPassword }
    );

    if (!data.success) {
      console.log(data.message);
      dispatch(updatePasswordFailure(data.message));
      return;
    }
    dispatch(updatePasswordSuccess(data.user))
  } catch (error) {
    const message = axios.isAxiosError(error) ? error.response?.data.message : String(error);
    console.log('Error:', message);
    dispatch(updateUserFailure(message));
  }
}

export const forgotPassword = (email: string) => async (dispatch: AppDispatch) => {
  try {
      dispatch(forgotPasswordStart());
      const { data }: { data: AuthResponse | ErrorResponse } = await axios.post('/api/v1/auth/forgot-password', { email });

      if (!data.success) {
          console.log('Error:', data.message);
          dispatch(forgotPasswordFailure(data.message));
          return;
      }

      dispatch(forgotPasswordSuccess(data.user));
  } catch (error: unknown) {
      const message = axios.isAxiosError(error) ? error.response?.data.message : String(error);
      console.log('Error:', message);
      dispatch(forgotPasswordFailure(message));
  }
};

// Reset password
export const resetPassword = (token: string, newPassword: string) => async (dispatch: AppDispatch) => {
  try {
      dispatch(resetPasswordStart());
      const { data }: { data: AuthResponse | ErrorResponse } = await axios.patch('/api/v1/auth/reset-password', { token, newPassword });

      if (!data.success) {
          console.log('Error:', data.message);
          dispatch(resetPasswordFailure(data.message));
          return;
      }

      dispatch(resetPasswordSuccess(data.user));
  } catch (error: unknown) {
      const message = axios.isAxiosError(error) ? error.response?.data.message : String(error);
      console.log('Error:', message);
      dispatch(resetPasswordFailure(message));
  }
};

export const followUser = (id: string) => async (dispatch: AppDispatch) => {
  try {
    dispatch(updateUserStart());

    const { data }: { data: AuthResponse | ErrorResponse } = await axios.put(`/api/v1/user/follow/${id}`);

    if (!data.success) {
      console.log(data.message);
      dispatch(updateUserFailure(data.message));
      return;
    }

    dispatch(loadUser());
  } catch (error) {
    let message = 'An unexpected error occurred';

    if (axios.isAxiosError(error)) {
      message = error.response?.data?.message || 'A network error occurred';
    } else if (error instanceof Error) {
      message = error.message;
    } else {
      message = String(error);
    }

    console.log('Error:', message);
    dispatch(updateUserFailure(message)); // Ensure the correct action is dispatched
  }
};

export const unfollowUser = (id: string) => async (dispatch: AppDispatch) => {
  try {
    dispatch(updateUserStart());

    const { data }: { data: AuthResponse | ErrorResponse } = await axios.put(`/api/v1/user/unfollow/${id}`);

    if (!data.success) {
      console.log(data.message);
      dispatch(updateUserFailure(data.message));
      return;
    }

    dispatch(loadUser());
  } catch (error) {
    let message = 'An unexpected error occurred';

    if (axios.isAxiosError(error)) {
      message = error.response?.data?.message || 'A network error occurred';
    } else if (error instanceof Error) {
      message = error.message;
    } else {
      message = String(error);
    }

    console.log('Error:', message);
    dispatch(updateUserFailure(message)); // Ensure the correct action is dispatched
  }
}

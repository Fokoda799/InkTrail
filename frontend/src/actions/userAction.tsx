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

// export const updatePassword = (newPassword: string, currentPassword?: string) => async (dispatch: AppDispatch) => {
//   try {
//     dispatch(updatePasswordStart());
    
//     const { data }: { data: AuthResponse | ErrorResponse} = await axios.put(
//       '/api/v1/me/update-password',
//       { currentPassword, newPassword }
//     );

//     if (!data.success) {
//       console.log(data.message);
//       dispatch(updatePasswordFailure(data.message));
//       return;
//     }
//     dispatch(updatePasswordSuccess(data.user))
//   } catch (error) {
//     const message = axios.isAxiosError(error) ? error.response?.data.message : String(error);
//     console.log('Error:', message);
//     dispatch(updateUserFailure(message));
//   }
// }

// export const forgotPassword = (email: string) => async (dispatch: AppDispatch) => {
//   try {
//       dispatch(forgotPasswordStart());
//       const { data }: { data: AuthResponse | ErrorResponse } = await axios.post('/api/v1/auth/forgot-password', { email });

//       if (!data.success) {
//           console.log('Error:', data.message);
//           dispatch(forgotPasswordFailure(data.message));
//           return;
//       }

//       dispatch(forgotPasswordSuccess(data.user));
//   } catch (error: unknown) {
//       const message = axios.isAxiosError(error) ? error.response?.data.message : String(error);
//       console.log('Error:', message);
//       dispatch(forgotPasswordFailure(message));
//   }
// };

// // Reset password
// export const resetPassword = (token: string, newPassword: string) => async (dispatch: AppDispatch) => {
//   try {
//       dispatch(resetPasswordStart());
//       const { data }: { data: AuthResponse | ErrorResponse } = await axios.patch('/api/v1/auth/reset-password', { token, newPassword });

//       if (!data.success) {
//           console.log('Error:', data.message);
//           dispatch(resetPasswordFailure(data.message));
//           return;
//       }

//       dispatch(resetPasswordSuccess(data.user));
//   } catch (error: unknown) {
//       const message = axios.isAxiosError(error) ? error.response?.data.message : String(error);
//       console.log('Error:', message);
//       dispatch(resetPasswordFailure(message));
//   }
// };

// export const followUser = (id: string) => async (dispatch: AppDispatch) => {
//   try {
//     dispatch(updateUserStart());

//     const { data }: { data: AuthResponse | ErrorResponse } = await axios.put(`/api/v1/user/follow/${id}`);

//     if (!data.success) {
//       console.log(data.message);
//       dispatch(updateUserFailure(data.message));
//       return;
//     }

//     dispatch(loadUser());
//   } catch (error) {
//     let message = 'An unexpected error occurred';

//     if (axios.isAxiosError(error)) {
//       message = error.response?.data?.message || 'A network error occurred';
//     } else if (error instanceof Error) {
//       message = error.message;
//     } else {
//       message = String(error);
//     }

//     console.log('Error:', message);
//     dispatch(updateUserFailure(message)); // Ensure the correct action is dispatched
//   }
// };

// export const unfollowUser = (id: string) => async (dispatch: AppDispatch) => {
//   try {
//     dispatch(updateUserStart());

//     const { data }: { data: AuthResponse | ErrorResponse } = await axios.put(`/api/v1/user/unfollow/${id}`);

//     if (!data.success) {
//       console.log(data.message);
//       dispatch(updateUserFailure(data.message));
//       return;
//     }

//     dispatch(loadUser());
//   } catch (error) {
//     let message = 'An unexpected error occurred';

//     if (axios.isAxiosError(error)) {
//       message = error.response?.data?.message || 'A network error occurred';
//     } else if (error instanceof Error) {
//       message = error.message;
//     } else {
//       message = String(error);
//     }

//     console.log('Error:', message);
//     dispatch(updateUserFailure(message)); // Ensure the correct action is dispatched
//   }
// }

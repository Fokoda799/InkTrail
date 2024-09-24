import { createSlice } from '@reduxjs/toolkit';
import type { RootState } from '../store';
import type { UserState } from '../../types/userTypes';

// Define the initial state using that type
const initialState: UserState = {
  user: null,
	isAuthenticated: false,
	error: null,
	isLoading: false,
	isCheckingAuth: true,
	message: null,
};

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    // Loading and error handling reducers
    setLoading: (state) => {
      state.isLoading = true;
      state.error = null;
    },
    setError: (state, action) => {
      state.error = action.payload;
      state.isLoading = false;
    },

    // User authentication reducers
    setSignup: (state, action) => {
      state.user = action.payload;
      state.isAuthenticated = true;
      state.isLoading = false;
      state.error = null;
    },
    setSignin: (state, action) => {
      state.user = action.payload;
      state.isAuthenticated = true;
      state.isLoading = false;
      state.error = null;
    },
    setSignout: (state) => {
      state.user = null;
      state.isAuthenticated = false;
      state.isLoading = false;
      state.error = null;
    },
    setVerifyEmail: (state, action) => {
      state.user = action.payload;
      state.isAuthenticated = true;
      state.isLoading = false;
      state.error = null;
    },
    isCheckingAuth: (state) => {
      state.isCheckingAuth = true;
      state.error = null;
    },
    setCheckAuth: (state, action) => {
      state.user = action.payload;
      state.isAuthenticated = true;
      state.isCheckingAuth = false;
      state.error = null;
    },
  },
});

// Action creators
export const {
  setLoading,
  setError,
  setSignup,
  setSignin,
  setSignout,
  setVerifyEmail,
  isCheckingAuth,
  setCheckAuth,
} = userSlice.actions;

// Selector to get authentication state
export const selectUserState = (state: RootState) => state.user;

export default userSlice.reducer;

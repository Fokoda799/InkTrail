import { createSlice } from '@reduxjs/toolkit';
import type { RootState } from '../store';
import type { UserState } from '../../types/userTypes';

// Define the initial state using that type
const initialState: UserState = {
  currentUser: null,
  isAuth: false,
  loading: false,
  error: null,
};

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    signInStart: (state) => {
      state.loading = true;
    },
    signInSuccess: (state, action) => {
      state.currentUser = action.payload;
      state.isAuth = true;
      state.loading = false;
      state.error = null;
    },
    signInFailure: (state, action) => {
      state.loading = false;
      state.error = action.payload;
    },
    signUpStart: (state) => {
      state.loading = true;
    },
    signUpSuccess: (state, action) => {
      state.currentUser = action.payload;
      state.isAuth = true;
      state.loading = false;
      state.error = null;
    },
    signUpFailure: (state, action) => {
      state.loading = false;
      state.error = action.payload;
    },
    signOutStart: (state) => {
      state.loading = true
    },
    signOutSuccess: (state) => {
      state.currentUser = null;
      state.loading = false;
    },
    signOutFailure: (state, action) => {
      state.error = action.payload;
    },
    updateUserStart: (state) => {
      state.loading = true;
    },
    updateUserSuccess: (state, action) => {
      state.currentUser = action.payload;
      state.loading = false;
    },
    updateUserFailure: (state, action) => {
      state.error = action.payload;
      state.loading = false;
    },
    clearError: (state) => {
      state.error = null;
    }
  },
});

// Action creators
export const {
  signInStart, signInSuccess, signInFailure,
  signUpStart, signUpSuccess, signUpFailure,
  signOutSuccess, signOutFailure, clearError, 
  signOutStart, updateUserFailure, updateUserStart,
  updateUserSuccess
} = userSlice.actions;

// Selector to get authentication state
export const selectUserState = (state: RootState) => state.user;

export default userSlice.reducer;

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
    signOutSuccess: (state) => {
      state.currentUser = null;
      state.isAuth = false;
    }
  },
});

// Action creators
export const {
  signInStart, signInSuccess, signInFailure,
  signUpStart, signUpSuccess, signUpFailure,
  signOutSuccess
} = userSlice.actions;

// Selector to get authentication state
export const selectUser = (state: RootState) => state.user.isAuth;
export const selectCurrentUser = (state: RootState) => state.user.currentUser;
export const selectUserError = (state: RootState) => state.user.error;
export const selectUserLoading = (state: RootState) => state.user.loading;

export default userSlice.reducer;

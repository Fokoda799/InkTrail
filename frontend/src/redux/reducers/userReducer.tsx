import { createSlice } from '@reduxjs/toolkit';
import type { RootState } from '../store';
import type { UserState } from '../../types/userTypes';
import { setLoading, setSuccess, setFailure } from '../../helpers/userHelper';

// Define the initial state using that type
const initialState: UserState = {
  currentUser: null,
  loading: false,
  error: null,
};

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    signInStart: setLoading,
    signInSuccess: setSuccess,
    signInFailure: setFailure,
    
    signUpStart: setLoading,
    signUpSuccess: setSuccess,
    signUpFailure: setFailure,

    updateUserStart: setLoading,
    updateUserSuccess: setSuccess,
    updateUserFailure: setFailure,

    updatePasswordStart: setLoading,
    updatePasswordSuccess: setSuccess,
    updatePasswordFailure: setFailure,

    forgotPasswordStart: setLoading,
    forgotPasswordSuccess: setSuccess,
    forgotPasswordFailure: setFailure,

    resetPasswordStart: setLoading,
    resetPasswordSuccess: setSuccess,
    resetPasswordFailure: setFailure,
    
    signOutStart: setLoading,
    signOutSuccess: (state) => {
      state.currentUser = null;
      state.loading = false;
      state.error = null;
    },
    signOutFailure: setFailure,
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
  updateUserSuccess, updatePasswordStart, updatePasswordSuccess,
  updatePasswordFailure, forgotPasswordStart, forgotPasswordSuccess, forgotPasswordFailure,
  resetPasswordStart, resetPasswordSuccess, resetPasswordFailure
} = userSlice.actions;

// Selector to get authentication state
export const selectUserState = (state: RootState) => state.user;

export default userSlice.reducer;

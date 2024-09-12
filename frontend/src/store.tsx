import { configureStore } from '@reduxjs/toolkit';
import userReducer from './redux/userReducer';

const store = configureStore({
  reducer: {
    user: userReducer, // Combine all reducers here
  },
  devTools: process.env.NODE_ENV !== 'production', // Enable Redux DevTools in development
});

export default store;

// Define RootState and AppDispatch types
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

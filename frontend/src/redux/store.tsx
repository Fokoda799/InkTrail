import { createSlice, configureStore } from '@reduxjs/toolkit';

// Define the type for the state
interface AuthState {
    isLogin: boolean;
}

// Set the initial state with its type
const initialState: AuthState = {
    isLogin: false
};

// Create the slice with typed state and reducers
const authSlice = createSlice({
    name: "auth",
    initialState,
    reducers: {
        login(state: AuthState) {
            state.isLogin = true;
        },
        logout(state: AuthState) {
            state.isLogin = false;
        }
    }
});

// Configure the store with the reducer from the slice
const store = configureStore({
    reducer: {
        auth: authSlice.reducer
    }
});

// Export types for the store and actions
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export const { login, logout } = authSlice.actions;
export { store, authSlice };

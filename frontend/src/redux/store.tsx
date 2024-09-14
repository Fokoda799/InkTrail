import { combineReducers, configureStore } from '@reduxjs/toolkit';
import userReducer from './reducers/userReducer';
import { persistReducer, persistStore } from 'redux-persist';
import storage from 'redux-persist/lib/storage';

// Combine reducers if there are multiple slices
const rootReducer = combineReducers({
  user: userReducer, // use 'users' if you named the slice users
});

// Persist configuration
const persistConfig = {
  key: 'root',
  version: 1,
  storage,
};

// Create persisted reducer
const persistedReducer = persistReducer(persistConfig, rootReducer);

// Configure store with persisted reducer
const store = configureStore({
  reducer: persistedReducer, // use the persistedReducer directly
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
    }),
});

// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>;
// Inferred type: {posts: PostsState, comments: CommentsState, users: UsersState}
export type AppDispatch = typeof store.dispatch;

export default store;
export const persistor = persistStore(store);

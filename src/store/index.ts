import { configureStore } from '@reduxjs/toolkit';
import userReducer from './slices/userSlice';
import toastReducer from './slices/toastSlice';

export const store = configureStore({
  reducer: {
    users: userReducer,
    toast: toastReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: ['persist/PERSIST', 'persist/REHYDRATE'],
      },
    }),
});

export type AppDispatch = typeof store.dispatch;
export type RootState = ReturnType<typeof store.getState>;

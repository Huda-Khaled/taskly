import { configureStore } from '@reduxjs/toolkit';
import userReducer from './slices/userSlice';
import type { UserState } from './slices/userSlice';

export const makeStore = (preloadedState?: { user: UserState }) => {
  return configureStore({
    reducer: {
      user: userReducer,
    },
    preloadedState,
    devTools: process.env.NODE_ENV !== 'production',
  });
};

export type AppStore = ReturnType<typeof makeStore>;
export type RootState = ReturnType<AppStore['getState']>;
export type AppDispatch = AppStore['dispatch'];
